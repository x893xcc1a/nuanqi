const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const payController = require('../controllers/payController');

router.use(authMiddleware);

// 【微信H5专用】获取JSAPI支付配置
router.post('/jsapi-config', payController.getJsapiConfig);

// 查询订单支付状态
router.get('/query/:order_no', payController.queryOrder);

// 【微信H5专用】支付回调（无需认证，微信调用）
router.post('/notify', payController.payNotify);

module.exports = router;
