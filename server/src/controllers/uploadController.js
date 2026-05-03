const fs = require('fs');
const path = require('path');

class UploadController {
  // 上传单张图片
  async uploadImage(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({
          code: 400,
          message: '请选择图片文件'
        });
      }
      
      const fileUrl = `/uploads/${req.file.filename}`;
      
      res.json({
        code: 200,
        message: '上传成功',
        data: {
          filename: req.file.filename,
          originalName: req.file.originalname,
          url: fileUrl,
          size: req.file.size
        }
      });
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({
        code: 500,
        message: '上传失败'
      });
    }
  }

  // 批量上传图片
  async uploadImages(req, res) {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          code: 400,
          message: '请选择图片文件'
        });
      }
      
      const files = req.files.map(file => ({
        filename: file.filename,
        originalName: file.originalname,
        url: `/uploads/${file.filename}`,
        size: file.size
      }));
      
      res.json({
        code: 200,
        message: '上传成功',
        data: files
      });
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({
        code: 500,
        message: '上传失败'
      });
    }
  }
}

module.exports = new UploadController();
