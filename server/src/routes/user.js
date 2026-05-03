const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const userController = require('../controllers/userController');

router.use(authMiddleware);

// 获取个人信息
router.get('/profile', userController.getProfile);

// 更新个人信息
router.put('/profile', userController.updateProfile);

// 申请成为守护者
router.post('/apply-keeper', userController.applyKeeper);

// 切换角色
router.post('/switch-role', userController.switchRole);

// 获取守护者列表
router.get('/keepers', userController.getKeepers);

// 获取守护者详情
router.get('/keepers/:id', userController.getKeeperDetail);

module.exports = router;
