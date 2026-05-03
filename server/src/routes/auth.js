const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// 【微信H5专用】微信登录
router.post('/wechat-login', authController.wechatLogin);

// 【微信H5专用】获取用户信息（需用户同意）
router.post('/user-info', authController.getUserInfo);

// 刷新token
router.post('/refresh-token', authController.refreshToken);

// 【微信H5专用】获取微信授权URL
router.get('/wechat-auth-url', authController.getWechatAuthUrl);

module.exports = router;
