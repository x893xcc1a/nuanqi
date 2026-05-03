const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const AdminUser = sequelize.define('AdminUser', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING(50),
    unique: true,
    allowNull: false,
    comment: '登录账号'
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
    comment: 'bcrypt加密密码'
  },
  role: {
    type: DataTypes.ENUM('super_admin', 'customer_service', 'finance'),
    defaultValue: 'customer_service',
    comment: '角色：超级管理员/客服/财务'
  },
  nickname: {
    type: DataTypes.STRING(50),
    allowNull: true,
    comment: '显示名称'
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive'),
    defaultValue: 'active',
    comment: '账号状态'
  },
  last_login_at: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: '最后登录时间'
  }
}, {
  tableName: 'admin_users',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = AdminUser;
