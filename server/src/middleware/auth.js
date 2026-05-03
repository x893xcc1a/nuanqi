const { verifyToken } = require('../utils/jwt');
const { User } = require('../models');

// 【微信H5专用】用户认证中间件
async function authMiddleware(req, res, next) {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ code: 401, message: '请先登录' });
    }
    
    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ code: 401, message: '登录已过期，请重新登录' });
    }
    
    const user = await User.findByPk(decoded.userId);
    if (!user || user.status === 'banned') {
      return res.status(403).json({ code: 403, message: '账号已被禁用' });
    }
    
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ code: 500, message: '服务器错误' });
  }
}

// 后台管理员认证中间件
async function adminAuthMiddleware(req, res, next) {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ code: 401, message: '请先登录' });
    }
    
    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ code: 401, message: '登录已过期' });
    }
    
    const { AdminUser } = require('../models');
    const admin = await AdminUser.findByPk(decoded.adminId);
    
    if (!admin || admin.status !== 'active') {
      return res.status(403).json({ code: 403, message: '无权限访问' });
    }
    
    req.admin = admin;
    next();
  } catch (error) {
    console.error('Admin auth error:', error);
    res.status(500).json({ code: 500, message: '服务器错误' });
  }
}

// RBAC权限检查
function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.admin) {
      return res.status(401).json({ code: 401, message: '未登录' });
    }
    
    if (!roles.includes(req.admin.role)) {
      return res.status(403).json({ code: 403, message: '权限不足' });
    }
    
    next();
  };
}

module.exports = {
  authMiddleware,
  adminAuthMiddleware,
  requireRole
};
