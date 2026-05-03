const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const postController = require('../controllers/postController');

// 公开接口：获取动态列表
router.get('/', postController.getPosts);

// 公开接口：获取动态详情
router.get('/:id', postController.getPostDetail);

// 需要登录的接口
router.use(authMiddleware);

// 发布动态
router.post('/', postController.createPost);

// 点赞
router.post('/:id/like', postController.likePost);

module.exports = router;
