const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const orderController = require('../controllers/orderController');

router.use(authMiddleware);

// 创建订单
router.post('/', orderController.createOrder);

// 获取订单列表
router.get('/', orderController.getOrders);

// 获取订单详情
router.get('/:id', orderController.getOrderDetail);

// 取消订单
router.post('/:id/cancel', orderController.cancelOrder);

// 完成订单
router.post('/:id/complete', orderController.completeOrder);

module.exports = router;
