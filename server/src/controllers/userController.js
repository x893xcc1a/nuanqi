const { User, Keeper } = require('../models');

class UserController {
  // 获取当前用户信息
  async getProfile(req, res) {
    try {
      const user = await User.findByPk(req.user.id, {
        include: [{
          model: Keeper,
          as: 'keeperProfile',
          attributes: ['id', 'bio', 'tags', 'hourly_rate', 'status', 'is_online']
        }]
      });
      
      res.json({
        code: 200,
        data: user
      });
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({ code: 500, message: '获取用户信息失败' });
    }
  }
  
  // 更新用户信息
  async updateProfile(req, res) {
    try {
      const { nickname, avatar_url, phone } = req.body;
      
      await User.update(
        { nickname, avatar_url, phone },
        { where: { id: req.user.id } }
      );
      
      res.json({
        code: 200,
        message: '更新成功'
      });
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({ code: 500, message: '更新失败' });
    }
  }
  
  // 申请成为守护者
  async applyKeeper(req, res) {
    try {
      const { real_name, id_card, bio, tags, hourly_rate } = req.body;
      const { encryptAES } = require('../utils/crypto');
      
      // 检查是否已申请
      let keeper = await Keeper.findOne({ where: { user_id: req.user.id } });
      
      const keeperData = {
        real_name: real_name ? encryptAES(real_name) : null,
        id_card: id_card ? encryptAES(id_card) : null,
        bio,
        tags: Array.isArray(tags) ? tags : JSON.parse(tags || '[]'),
        hourly_rate,
        status: 'pending'
      };
      
      if (keeper) {
        await keeper.update(keeperData);
      } else {
        keeper = await Keeper.create({
          user_id: req.user.id,
          ...keeperData
        });
      }
      
      // 更新用户角色
      await User.update(
        { role: req.user.role === 'seeker' ? 'both' : req.user.role },
        { where: { id: req.user.id } }
      );
      
      res.json({
        code: 200,
        message: '申请已提交，等待审核'
      });
    } catch (error) {
      console.error('Apply keeper error:', error);
      res.status(500).json({ code: 500, message: '申请失败' });
    }
  }
  
  // 切换角色视角
  async switchRole(req, res) {
    try {
      const { role } = req.body; // 'seeker' | 'keeper'
      
      if (!['seeker', 'keeper'].includes(role)) {
        return res.status(400).json({ code: 400, message: '无效的角色' });
      }
      
      if (role === 'keeper') {
        const keeper = await Keeper.findOne({ 
          where: { user_id: req.user.id, status: 'approved' } 
        });
        
        if (!keeper) {
          return res.status(403).json({ 
            code: 403, 
            message: '您还未通过守护者审核' 
          });
        }
      }
      
      res.json({
        code: 200,
        message: '切换成功',
        data: { currentRole: role }
      });
    } catch (error) {
      console.error('Switch role error:', error);
      res.status(500).json({ code: 500, message: '切换失败' });
    }
  }
  
  // 获取守护者列表
  async getKeepers(req, res) {
    try {
      const { tag, min_price, max_price, is_online, page = 1, limit = 10 } = req.query;
      
      const where = { status: 'approved' };
      
      if (is_online !== undefined) {
        where.is_online = is_online === 'true';
      }
      
      const keeperWhere = {};
      if (min_price) keeperWhere.hourly_rate = { ...keeperWhere.hourly_rate, [Op.gte]: min_price };
      if (max_price) keeperWhere.hourly_rate = { ...keeperWhere.hourly_rate, [Op.lte]: max_price };
      
      const { Op } = require('sequelize');
      
      const keepers = await Keeper.findAndCountAll({
        where: {
          ...where,
          ...keeperWhere
        },
        include: [{
          model: User,
          as: 'user',
          attributes: ['id', 'nickname', 'avatar_url']
        }],
        limit: parseInt(limit),
        offset: (parseInt(page) - 1) * parseInt(limit),
        order: [['is_online', 'DESC'], ['created_at', 'DESC']]
      });
      
      // 如果按标签筛选，在后端过滤
      let rows = keepers.rows;
      if (tag) {
        rows = rows.filter(k => k.tags && k.tags.includes(tag));
      }
      
      res.json({
        code: 200,
        data: {
          list: rows,
          total: keepers.count,
          page: parseInt(page),
          totalPages: Math.ceil(keepers.count / parseInt(limit))
        }
      });
    } catch (error) {
      console.error('Get keepers error:', error);
      res.status(500).json({ code: 500, message: '获取守护者列表失败' });
    }
  }
  
  // 获取守护者详情
  async getKeeperDetail(req, res) {
    try {
      const { id } = req.params;
      
      const keeper = await Keeper.findOne({
        where: { id, status: 'approved' },
        include: [{
          model: User,
          as: 'user',
          attributes: ['id', 'nickname', 'avatar_url']
        }]
      });
      
      if (!keeper) {
        return res.status(404).json({ code: 404, message: '守护者不存在' });
      }
      
      res.json({
        code: 200,
        data: keeper
      });
    } catch (error) {
      console.error('Get keeper detail error:', error);
      res.status(500).json({ code: 500, message: '获取详情失败' });
    }
  }
}

module.exports = new UserController();
