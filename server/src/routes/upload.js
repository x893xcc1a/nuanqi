const express = require('express');
const router = express.Router();
const upload = require('../utils/upload');
const uploadController = require('../controllers/uploadController');
const { authMiddleware } = require('../middleware/auth');

// 上传单张图片 (需要登录)
router.post('/image', authMiddleware, upload.single('file'), uploadController.uploadImage);

// 批量上传图片 (需要登录，最多5张)
router.post('/images', authMiddleware, upload.array('files', 5), uploadController.uploadImages);

module.exports = router;
