const { User, Keeper, Order, Payment, Post, AdminUser } = require('../models');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../utils/jwt');
const dayjs = require('dayjs');

class AdminController {
  // 管理员登录
  async login(req, res) {
    try {
      const { username, password } = req.body;
      
      const admin = await AdminUser.findOne({ where: { username } });
      if (!admin) {
        return res.status(401).json({ code: 401, message: '账号或密码错误' });
      }
      
      const isValid = await bcrypt.compare(password, admin.password);
      if (!isValid) {
        return res.status(401).json({ code: 401, message: '账号或密码错误' });
      }
      
      await admin.update({ last_login_at: new Date() });
      
      const token = generateToken({ 
        adminId: admin.id, 
        role: admin.role 
      });
      
      res.json({
        code: 200,
        message: '登录成功',
        data: {
          token,
          admin: {
            id: admin.id,
            username: admin.username,
            nickname: admin.nickname,
            role: admin.role
          }
        }
      });
    } catch (error) {
      console.error('Admin login error:', error);
      res.status(500).json({ code: 500, message: '登录失败' });
    }
  }
  
  // 仪表盘统计
  async getDashboard(req, res) {
    try {
      const today = dayjs().startOf('day').toDate();
      const yesterday = dayjs().subtract(1, 'day').startOf('day').toDate();
      
      // 今日订单数
      const todayOrders = await Order.count({
        where: { created_at: { [Op.gte]: today } }
      });
      
      // 待审核守护者
      const pendingKeepers = await Keeper.count({
        where: { status: 'pending' }
      });
      
      // 今日营收
      const todayRevenue = await Payment.sum('amount', {
        where: { 
          status: 'success',
          pay_time: { [Op.gte]: today }
        }
      }) || 0;
      
      // 用户总数
      const totalUsers = await User.count();
      
      // 近7天订单趋势
      const last7Days = [];
      for (let i = 6; i >= 0; i--) {
        const date = dayjs().subtract(i, 'day').startOf('day');
        const count = await Order.count({
          where: {
            created_at: {
              [Op.gte]: date.toDate(),
              [Op.lt]: date.add(1, 'day').toDate()
            }
          }
        });
        last7Days.push({
          date: date.format('MM-DD'),
          count
        });
      }
      
      res.json({
        code: 200,
        data: {
          todayOrders,
          pendingKeepers,
          todayRevenue: todayRevenue / 100, // 转为元
          totalUsers,
          trend: last7Days
        }
      });
    } catch (error) {
      console.error('Get dashboard error:', error);
      res.status(500).json({ code: 500, message: '获取统计数据失败' });
    }
  }
  
  // 用户列表
  async getUsers(req, res) {
    try {
      const { keyword, role, status, page = 1, limit = 20 } = req.query;
      
      const where = {};
      if (keyword) {
        where[Op.or] = [
          { nickname: { [Op.like]: `%${keyword}%` } },
          { openid: { [Op.like]: `%${keyword}%` } }
        ];
      }
      if (role) where.role = role;
      if (status) where.status = status;
      
      const users = await User.findAndCountAll({
        where,
        include: [{
          model: Keeper,
          as: 'keeperProfile',
          attributes: ['status', 'hourly_rate']
        }],
        limit: parseInt(limit),
        offset: (parseInt(page) - 1) * parseInt(limit),
        order: [['created_at', 'DESC']]
      });
      
      res.json({
        code: 200,
        data: {
          list: users.rows,
          total: users.count,
          page: parseInt(page),
          totalPages: Math.ceil(users.count / parseInt(limit))
        }
      });
    } catch (error) {
      console.error('Get users error:', error);
      res.status(500).json({ code: 500, message: '获取用户列表失败' });
    }
  }
  
  // 更新用户状态（封禁/解封）
  async updateUserStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      await User.update({ status }, { where: { id } });
      
      res.json({ code: 200, message: '状态更新成功' });
    } catch (error) {
      console.error('Update user status error:', error);
      res.status(500).json({ code: 500, message: '更新失败' });
    }
  }
  
  // 守护者审核列表
  async getKeeperApplications(req, res) {
    try {
      const { status = 'pending', page = 1, limit = 20 } = req.query;
      
      const keepers = await Keeper.findAndCountAll({
        where: { status },
        include: [{
          model: User,
          as: 'user',
          attributes: ['id', 'nickname', 'avatar_url', 'phone']
        }],
        limit: parseInt(limit),
        offset: (parseInt(page) - 1) * parseInt(limit),
        order: [['created_at', 'DESC']]
      });
      
      res.json({
        code: 200,
        data: {
          list: keepers.rows,
          total: keepers.count,
          page: parseInt(page)
        }
      });
    } catch (error) {
      console.error('Get keeper applications error:', error);
      res.status(500).json({ code: 500, message: '获取列表失败' });
    }
  }
  
  // 审核守护者
  async reviewKeeper(req, res) {
    try {
      const { id } = req.params;
      const { status, reason } = req.body; // approved / rejected
      
      const keeper = await Keeper.findByPk(id);
      if (!keeper) {
        return res.status(404).json({ code: 404, message: '申请不存在' });
      }
      
      await keeper.update({ status });
      
      // 如果通过，更新用户角色
      if (status === 'approved') {
        await User.update(
          { role: 'keeper' },
          { where: { id: keeper.user_id, role: 'seeker' } }
        );
      }
      
      res.json({ code: 200, message: '审核完成' });
    } catch (error) {
      console.error('Review keeper error:', error);
      res.status(500).json({ code: 500, message: '审核失败' });
    }
  }
  
  // 订单管理列表
  async getOrders(req, res) {
    try {
      const { status, start_date, end_date, page = 1, limit = 20 } = req.query;
      
      const where = {};
      if (status) where.status = status;
      if (start_date && end_date) {
        where.created_at = {
          [Op.between]: [new Date(start_date), new Date(end_date)]
        };
      }
      
      const orders = await Order.findAndCountAll({
        where,
        include: [
          { model: User, as: 'seeker', attributes: ['nickname'] },
          { model: User, as: 'keeper', attributes: ['nickname'] },
          { model: Payment, as: 'payment' }
        ],
        limit: parseInt(limit),
        offset: (parseInt(page) - 1) * parseInt(limit),
        order: [['created_at', 'DESC']]
      });
      
      res.json({
        code: 200,
        data: {
          list: orders.rows,
          total: orders.count,
          page: parseInt(page)
        }
      });
    } catch (error) {
      console.error('Get admin orders error:', error);
      res.status(500).json({ code: 500, message: '获取订单失败' });
    }
  }
  
  // 动态审核列表
  async getPosts(req, res) {
    try {
      const { status = 'pending', page = 1, limit = 20 } = req.query;
      
      const posts = await Post.findAndCountAll({
        where: { status },
        include: [{
          model: User,
          as: 'author',
          attributes: ['nickname']
        }],
        limit: parseInt(limit),
        offset: (parseInt(page) - 1) * parseInt(limit),
        order: [['created_at', 'DESC']]
      });
      
      res.json({
        code: 200,
        data: {
          list: posts.rows,
          total: posts.count,
          page: parseInt(page)
        }
      });
    } catch (error) {
      console.error('Get admin posts error:', error);
      res.status(500).json({ code: 500, message: '获取动态失败' });
    }
  }
  
  // 审核动态
  async reviewPost(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      await Post.update({ status }, { where: { id } });
      
      res.json({ code: 200, message: '审核完成' });
    } catch (error) {
      console.error('Review post error:', error);
      res.status(500).json({ code: 500, message: '审核失败' });
    }
  }

  async getServices(req, res) {
    try {
      const { category, page = 1, limit = 20 } = req.query;
      const where = {};
      if (category && category !== 'all') where.category_id = category;
      
      const services = await this._getListData({
        model: 'Service',
        where,
        page,
        limit
      });
      
      res.json({ code: 200, data: services });
    } catch (error) {
      console.error('Get services error:', error);
      res.status(500).json({ code: 500, message: '获取服务列表失败' });
    }
  }

  async createService(req, res) {
    try {
      const { name, category_id, duration, sort = 0, status = 'active', multilang } = req.body;
      
      const Service = require('../models').Service;
      await Service.create({
        name,
        category_id,
        duration,
        sort,
        status,
        multilang
      });
      
      res.json({ code: 200, message: '创建成功' });
    } catch (error) {
      console.error('Create service error:', error);
      res.status(500).json({ code: 500, message: '创建失败' });
    }
  }

  async updateService(req, res) {
    try {
      const { id } = req.params;
      const { name, category_id, duration, sort, status, multilang } = req.body;
      
      const Service = require('../models').Service;
      await Service.update(
        { name, category_id, duration, sort, status, multilang },
        { where: { id } }
      );
      
      res.json({ code: 200, message: '更新成功' });
    } catch (error) {
      console.error('Update service error:', error);
      res.status(500).json({ code: 500, message: '更新失败' });
    }
  }

  async deleteService(req, res) {
    try {
      const { id } = req.params;
      const Service = require('../models').Service;
      await Service.destroy({ where: { id } });
      res.json({ code: 200, message: '删除成功' });
    } catch (error) {
      console.error('Delete service error:', error);
      res.status(500).json({ code: 500, message: '删除失败' });
    }
  }

  async getServiceCategories(req, res) {
    try {
      const categories = await this._getListData({
        model: 'ServiceCategory',
        page: req.query.page,
        limit: req.query.limit
      });
      res.json({ code: 200, data: categories });
    } catch (error) {
      console.error('Get service categories error:', error);
      res.status(500).json({ code: 500, message: '获取分类失败' });
    }
  }

  async createServiceCategory(req, res) {
    try {
      const { name, image, status = 'active', is_blind_box = false, multilang } = req.body;
      const ServiceCategory = require('../models').ServiceCategory;
      await ServiceCategory.create({ name, image, status, is_blind_box, multilang });
      res.json({ code: 200, message: '创建成功' });
    } catch (error) {
      console.error('Create service category error:', error);
      res.status(500).json({ code: 500, message: '创建失败' });
    }
  }

  async updateServiceCategory(req, res) {
    try {
      const { id } = req.params;
      const { name, image, status, is_blind_box, multilang } = req.body;
      const ServiceCategory = require('../models').ServiceCategory;
      await ServiceCategory.update(
        { name, image, status, is_blind_box, multilang },
        { where: { id } }
      );
      res.json({ code: 200, message: '更新成功' });
    } catch (error) {
      console.error('Update service category error:', error);
      res.status(500).json({ code: 500, message: '更新失败' });
    }
  }

  async deleteServiceCategory(req, res) {
    try {
      const { id } = req.params;
      const ServiceCategory = require('../models').ServiceCategory;
      await ServiceCategory.destroy({ where: { id } });
      res.json({ code: 200, message: '删除成功' });
    } catch (error) {
      console.error('Delete service category error:', error);
      res.status(500).json({ code: 500, message: '删除失败' });
    }
  }

  async getKeeperLevels(req, res) {
    try {
      const KeeperLevel = require('../models').KeeperLevel;
      const levels = await KeeperLevel.findAll({ order: [['sort', 'ASC']] });
      res.json({ code: 200, data: { list: levels, total: levels.length } });
    } catch (error) {
      console.error('Get keeper levels error:', error);
      res.status(500).json({ code: 500, message: '获取等级失败' });
    }
  }

  async createKeeperLevel(req, res) {
    try {
      const { name, icon, min_score, max_score, discount, color, sort = 0, status = 'active' } = req.body;
      const KeeperLevel = require('../models').KeeperLevel;
      await KeeperLevel.create({ name, icon, min_score, max_score, discount, color, sort, status });
      res.json({ code: 200, message: '创建成功' });
    } catch (error) {
      console.error('Create keeper level error:', error);
      res.status(500).json({ code: 500, message: '创建失败' });
    }
  }

  async updateKeeperLevel(req, res) {
    try {
      const { id } = req.params;
      const { name, icon, min_score, max_score, discount, color, sort, status } = req.body;
      const KeeperLevel = require('../models').KeeperLevel;
      await KeeperLevel.update(
        { name, icon, min_score, max_score, discount, color, sort, status },
        { where: { id } }
      );
      res.json({ code: 200, message: '更新成功' });
    } catch (error) {
      console.error('Update keeper level error:', error);
      res.status(500).json({ code: 500, message: '更新失败' });
    }
  }

  async deleteKeeperLevel(req, res) {
    try {
      const { id } = req.params;
      const KeeperLevel = require('../models').KeeperLevel;
      await KeeperLevel.destroy({ where: { id } });
      res.json({ code: 200, message: '删除成功' });
    } catch (error) {
      console.error('Delete keeper level error:', error);
      res.status(500).json({ code: 500, message: '删除失败' });
    }
  }

  async getCoupons(req, res) {
    try {
      const coupons = await this._getListData({
        model: 'Coupon',
        page: req.query.page,
        limit: req.query.limit
      });
      res.json({ code: 200, data: coupons });
    } catch (error) {
      console.error('Get coupons error:', error);
      res.status(500).json({ code: 500, message: '获取优惠券失败' });
    }
  }

  async createCoupon(req, res) {
    try {
      const { name, type, value, min_amount, total, start_time, end_time, status = 'active' } = req.body;
      const Coupon = require('../models').Coupon;
      await Coupon.create({ name, type, value, min_amount, total, start_time, end_time, status });
      res.json({ code: 200, message: '创建成功' });
    } catch (error) {
      console.error('Create coupon error:', error);
      res.status(500).json({ code: 500, message: '创建失败' });
    }
  }

  async updateCoupon(req, res) {
    try {
      const { id } = req.params;
      const { name, type, value, min_amount, total, start_time, end_time, status } = req.body;
      const Coupon = require('../models').Coupon;
      await Coupon.update(
        { name, type, value, min_amount, total, start_time, end_time, status },
        { where: { id } }
      );
      res.json({ code: 200, message: '更新成功' });
    } catch (error) {
      console.error('Update coupon error:', error);
      res.status(500).json({ code: 500, message: '更新失败' });
    }
  }

  async deleteCoupon(req, res) {
    try {
      const { id } = req.params;
      const Coupon = require('../models').Coupon;
      await Coupon.destroy({ where: { id } });
      res.json({ code: 200, message: '删除成功' });
    } catch (error) {
      console.error('Delete coupon error:', error);
      res.status(500).json({ code: 500, message: '删除失败' });
    }
  }

  async getConversations(req, res) {
    try {
      const Conversation = require('../models').Conversation;
      const conversations = await Conversation.findAndCountAll({
        include: [{ model: User, as: 'user', attributes: ['id', 'nickname', 'avatar_url', 'phone'] }],
        limit: parseInt(req.query.limit || 20),
        offset: (parseInt(req.query.page || 1) - 1) * parseInt(req.query.limit || 20),
        order: [['last_chat_time', 'DESC']]
      });
      res.json({
        code: 200,
        data: {
          list: conversations.rows,
          total: conversations.count,
          page: parseInt(req.query.page || 1)
        }
      });
    } catch (error) {
      console.error('Get conversations error:', error);
      res.status(500).json({ code: 500, message: '获取会话失败' });
    }
  }

  async deleteConversation(req, res) {
    try {
      const { id } = req.params;
      const Conversation = require('../models').Conversation;
      await Conversation.destroy({ where: { id } });
      res.json({ code: 200, message: '删除成功' });
    } catch (error) {
      console.error('Delete conversation error:', error);
      res.status(500).json({ code: 500, message: '删除失败' });
    }
  }

  async getAutoReplies(req, res) {
    try {
      const AutoReply = require('../models').AutoReply;
      const replies = await AutoReply.findAll({ order: [['sort', 'ASC']] });
      res.json({ code: 200, data: { list: replies, total: replies.length } });
    } catch (error) {
      console.error('Get auto replies error:', error);
      res.status(500).json({ code: 500, message: '获取自动回复失败' });
    }
  }

  async createAutoReply(req, res) {
    try {
      const { keyword, type, content, status = 'active', sort = 0 } = req.body;
      const AutoReply = require('../models').AutoReply;
      await AutoReply.create({ keyword, type, content, status, sort });
      res.json({ code: 200, message: '创建成功' });
    } catch (error) {
      console.error('Create auto reply error:', error);
      res.status(500).json({ code: 500, message: '创建失败' });
    }
  }

  async updateAutoReply(req, res) {
    try {
      const { id } = req.params;
      const { keyword, type, content, status, sort } = req.body;
      const AutoReply = require('../models').AutoReply;
      await AutoReply.update({ keyword, type, content, status, sort }, { where: { id } });
      res.json({ code: 200, message: '更新成功' });
    } catch (error) {
      console.error('Update auto reply error:', error);
      res.status(500).json({ code: 500, message: '更新失败' });
    }
  }

  async deleteAutoReply(req, res) {
    try {
      const { id } = req.params;
      const AutoReply = require('../models').AutoReply;
      await AutoReply.destroy({ where: { id } });
      res.json({ code: 200, message: '删除成功' });
    } catch (error) {
      console.error('Delete auto reply error:', error);
      res.status(500).json({ code: 500, message: '删除失败' });
    }
  }

  async getWechatMenu(req, res) {
    try {
      const Setting = require('../models').Setting;
      const menu = await Setting.findOne({ where: { key: 'wechat_menu' } });
      res.json({ code: 200, data: menu ? JSON.parse(menu.value) : [] });
    } catch (error) {
      console.error('Get wechat menu error:', error);
      res.status(500).json({ code: 500, message: '获取菜单失败' });
    }
  }

  async saveWechatMenu(req, res) {
    try {
      const { menu } = req.body;
      const Setting = require('../models').Setting;
      await Setting.upsert({ key: 'wechat_menu', value: JSON.stringify(menu) });
      res.json({ code: 200, message: '保存成功' });
    } catch (error) {
      console.error('Save wechat menu error:', error);
      res.status(500).json({ code: 500, message: '保存失败' });
    }
  }

  async getCommonWords(req, res) {
    try {
      const CommonWord = require('../models').CommonWord;
      const words = await CommonWord.findAll({ order: [['sort', 'ASC']] });
      res.json({ code: 200, data: { list: words, total: words.length } });
    } catch (error) {
      console.error('Get common words error:', error);
      res.status(500).json({ code: 500, message: '获取常用语失败' });
    }
  }

  async createCommonWord(req, res) {
    try {
      const { category, content, sort = 0, status = 'active' } = req.body;
      const CommonWord = require('../models').CommonWord;
      await CommonWord.create({ category, content, sort, status });
      res.json({ code: 200, message: '创建成功' });
    } catch (error) {
      console.error('Create common word error:', error);
      res.status(500).json({ code: 500, message: '创建失败' });
    }
  }

  async updateCommonWord(req, res) {
    try {
      const { id } = req.params;
      const { category, content, sort, status } = req.body;
      const CommonWord = require('../models').CommonWord;
      await CommonWord.update({ category, content, sort, status }, { where: { id } });
      res.json({ code: 200, message: '更新成功' });
    } catch (error) {
      console.error('Update common word error:', error);
      res.status(500).json({ code: 500, message: '更新失败' });
    }
  }

  async deleteCommonWord(req, res) {
    try {
      const { id } = req.params;
      const CommonWord = require('../models').CommonWord;
      await CommonWord.destroy({ where: { id } });
      res.json({ code: 200, message: '删除成功' });
    } catch (error) {
      console.error('Delete common word error:', error);
      res.status(500).json({ code: 500, message: '删除失败' });
    }
  }

  async getFAQ(req, res) {
    try {
      const FAQ = require('../models').FAQ;
      const faqs = await FAQ.findAll({ order: [['sort', 'ASC']] });
      res.json({ code: 200, data: { list: faqs, total: faqs.length } });
    } catch (error) {
      console.error('Get FAQ error:', error);
      res.status(500).json({ code: 500, message: '获取FAQ失败' });
    }
  }

  async createFAQ(req, res) {
    try {
      const { question, answer, sort = 0, status = 'active' } = req.body;
      const FAQ = require('../models').FAQ;
      await FAQ.create({ question, answer, sort, status });
      res.json({ code: 200, message: '创建成功' });
    } catch (error) {
      console.error('Create FAQ error:', error);
      res.status(500).json({ code: 500, message: '创建失败' });
    }
  }

  async updateFAQ(req, res) {
    try {
      const { id } = req.params;
      const { question, answer, sort, status } = req.body;
      const FAQ = require('../models').FAQ;
      await FAQ.update({ question, answer, sort, status }, { where: { id } });
      res.json({ code: 200, message: '更新成功' });
    } catch (error) {
      console.error('Update FAQ error:', error);
      res.status(500).json({ code: 500, message: '更新失败' });
    }
  }

  async deleteFAQ(req, res) {
    try {
      const { id } = req.params;
      const FAQ = require('../models').FAQ;
      await FAQ.destroy({ where: { id } });
      res.json({ code: 200, message: '删除成功' });
    } catch (error) {
      console.error('Delete FAQ error:', error);
      res.status(500).json({ code: 500, message: '删除失败' });
    }
  }

  async getTeam(req, res) {
    try {
      const team = await AdminUser.findAll({ order: [['created_at', 'DESC']] });
      res.json({ code: 200, data: { list: team, total: team.length } });
    } catch (error) {
      console.error('Get team error:', error);
      res.status(500).json({ code: 500, message: '获取团队列表失败' });
    }
  }

  async createTeamMember(req, res) {
    try {
      const { username, password, nickname, role = 'customer_service', status = 'active' } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      await AdminUser.create({ username, password: hashedPassword, nickname, role, status });
      res.json({ code: 200, message: '创建成功' });
    } catch (error) {
      console.error('Create team member error:', error);
      res.status(500).json({ code: 500, message: '创建失败' });
    }
  }

  async updateTeamMember(req, res) {
    try {
      const { id } = req.params;
      const { nickname, role, status, password } = req.body;
      const data = { nickname, role, status };
      if (password) data.password = await bcrypt.hash(password, 10);
      await AdminUser.update(data, { where: { id } });
      res.json({ code: 200, message: '更新成功' });
    } catch (error) {
      console.error('Update team member error:', error);
      res.status(500).json({ code: 500, message: '更新失败' });
    }
  }

  async deleteTeamMember(req, res) {
    try {
      const { id } = req.params;
      await AdminUser.destroy({ where: { id } });
      res.json({ code: 200, message: '删除成功' });
    } catch (error) {
      console.error('Delete team member error:', error);
      res.status(500).json({ code: 500, message: '删除失败' });
    }
  }

  async getStatistics(req, res) {
    try {
      const { start_date, end_date } = req.query;
      const start = start_date ? new Date(start_date) : dayjs().startOf('month').toDate();
      const end = end_date ? new Date(end_date) : new Date();
      
      const totalUsers = await User.count();
      const totalOrders = await Order.count({ where: { created_at: { [Op.between]: [start, end] } } });
      const totalRevenue = (await Payment.sum('amount', { where: { status: 'success', pay_time: { [Op.between]: [start, end] } } })) || 0;
      
      const dailyData = [];
      const days = dayjs(end).diff(dayjs(start), 'day');
      for (let i = days; i >= 0; i--) {
        const date = dayjs(start).add(i, 'day');
        const orders = await Order.count({
          where: {
            created_at: {
              [Op.gte]: date.startOf('day').toDate(),
              [Op.lt]: date.endOf('day').toDate()
            }
          }
        });
        dailyData.push({ date: date.format('YYYY-MM-DD'), orders });
      }
      
      res.json({
        code: 200,
        data: {
          totalUsers,
          totalOrders,
          totalRevenue: totalRevenue / 100,
          dailyData
        }
      });
    } catch (error) {
      console.error('Get statistics error:', error);
      res.status(500).json({ code: 500, message: '获取统计数据失败' });
    }
  }

  async getSystemSettings(req, res) {
    try {
      const Setting = require('../models').Setting;
      const settings = await Setting.findAll();
      const result = {};
      settings.forEach(s => {
        try {
          result[s.key] = JSON.parse(s.value);
        } catch {
          result[s.key] = s.value;
        }
      });
      res.json({ code: 200, data: result });
    } catch (error) {
      console.error('Get system settings error:', error);
      res.status(500).json({ code: 500, message: '获取系统设置失败' });
    }
  }

  async saveSystemSettings(req, res) {
    try {
      const Setting = require('../models').Setting;
      const settings = req.body;
      for (const [key, value] of Object.entries(settings)) {
        await Setting.upsert({
          key,
          value: typeof value === 'object' ? JSON.stringify(value) : value
        });
      }
      res.json({ code: 200, message: '保存成功' });
    } catch (error) {
      console.error('Save system settings error:', error);
      res.status(500).json({ code: 500, message: '保存失败' });
    }
  }

  async _getListData({ model, where = {}, page = 1, limit = 20 }) {
    const Model = require('../models')[model];
    const data = await Model.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
      order: [['created_at', 'DESC']]
    });
    return {
      list: data.rows,
      total: data.count,
      page: parseInt(page),
      totalPages: Math.ceil(data.count / parseInt(limit))
    };
  }
}

module.exports = new AdminController();
