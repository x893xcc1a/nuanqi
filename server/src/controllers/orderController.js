const { Order, Payment, User, Keeper } = require('../models');
const { v4: uuidv4 } = require('uuid');
const dayjs = require('dayjs');

class OrderController {
  // 创建订单
  async createOrder(req, res) {
    try {
      const { keeper_id, service_type, duration, remark } = req.body;
      const seeker_id = req.user.id;
      
      // 验证守护者
      const keeper = await Keeper.findOne({
        where: { user_id: keeper_id, status: 'approved' },
        include: [{ model: User, as: 'user' }]
      });
      
      if (!keeper) {
        return res.status(404).json({ code: 404, message: '守护者不存在或未通过审核' });
      }
      
      // 计算金额（分）
      const amount = keeper.hourly_rate * Math.ceil(duration / 60);
      
      // 生成订单号
      const orderNo = 'NQ' + dayjs().format('YYYYMMDD') + Math.random().toString(36).substr(2, 6).toUpperCase();
      
      const order = await Order.create({
        order_no: orderNo,
        seeker_id,
        keeper_id: keeper.user_id,
        service_type,
        duration,
        amount,
        remark,
        status: 'unpaid'
      });
      
      res.json({
        code: 200,
        message: '订单创建成功',
        data: {
          orderId: order.id,
          orderNo: order.order_no,
          amount: order.amount,
          status: order.status
        }
      });
    } catch (error) {
      console.error('Create order error:', error);
      res.status(500).json({ code: 500, message: '创建订单失败' });
    }
  }
  
  // 获取订单列表
  async getOrders(req, res) {
    try {
      const { status, page = 1, limit = 10, role = 'seeker' } = req.query;
      const userId = req.user.id;
      
      const where = {};
      if (role === 'seeker') {
        where.seeker_id = userId;
      } else {
        where.keeper_id = userId;
      }
      
      if (status) {
        where.status = status;
      }
      
      const orders = await Order.findAndCountAll({
        where,
        include: [
          {
            model: User,
            as: role === 'seeker' ? 'keeper' : 'seeker',
            attributes: ['id', 'nickname', 'avatar_url']
          },
          {
            model: Payment,
            as: 'payment',
            attributes: ['status', 'pay_time']
          }
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
          page: parseInt(page),
          totalPages: Math.ceil(orders.count / parseInt(limit))
        }
      });
    } catch (error) {
      console.error('Get orders error:', error);
      res.status(500).json({ code: 500, message: '获取订单列表失败' });
    }
  }
  
  // 获取订单详情
  async getOrderDetail(req, res) {
    try {
      const { id } = req.params;
      
      const order = await Order.findOne({
        where: {
          id,
          [require('sequelize').Op.or]: [
            { seeker_id: req.user.id },
            { keeper_id: req.user.id }
          ]
        },
        include: [
          {
            model: User,
            as: 'seeker',
            attributes: ['id', 'nickname', 'avatar_url']
          },
          {
            model: User,
            as: 'keeper',
            attributes: ['id', 'nickname', 'avatar_url']
          },
          {
            model: Payment,
            as: 'payment'
          }
        ]
      });
      
      if (!order) {
        return res.status(404).json({ code: 404, message: '订单不存在' });
      }
      
      res.json({
        code: 200,
        data: order
      });
    } catch (error) {
      console.error('Get order detail error:', error);
      res.status(500).json({ code: 500, message: '获取订单详情失败' });
    }
  }
  
  // 取消订单
  async cancelOrder(req, res) {
    try {
      const { id } = req.params;
      
      const order = await Order.findOne({
        where: {
          id,
          seeker_id: req.user.id,
          status: 'unpaid'
        }
      });
      
      if (!order) {
        return res.status(404).json({ code: 404, message: '订单不存在或无法取消' });
      }
      
      await order.update({ status: 'cancelled' });
      
      res.json({
        code: 200,
        message: '订单已取消'
      });
    } catch (error) {
      console.error('Cancel order error:', error);
      res.status(500).json({ code: 500, message: '取消订单失败' });
    }
  }
  
  // 完成订单（守护者确认）
  async completeOrder(req, res) {
    try {
      const { id } = req.params;
      
      const order = await Order.findOne({
        where: {
          id,
          keeper_id: req.user.id,
          status: 'serving'
        }
      });
      
      if (!order) {
        return res.status(404).json({ code: 404, message: '订单不存在或状态错误' });
      }
      
      await order.update({ 
        status: 'completed',
        completed_at: new Date()
      });
      
      res.json({
        code: 200,
        message: '订单已完成'
      });
    } catch (error) {
      console.error('Complete order error:', error);
      res.status(500).json({ code: 500, message: '操作失败' });
    }
  }
}

module.exports = new OrderController();
