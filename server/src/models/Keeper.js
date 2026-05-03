const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Keeper = sequelize.define('Keeper', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  real_name: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: '真实姓名（加密存储）'
  },
  id_card: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: '身份证号（加密）'
  },
  bio: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: '个人简介'
  },
  tags: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: '技能标签数组'
  },
  hourly_rate: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: '每小时价格（分）'
  },
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected'),
    defaultValue: 'pending',
    comment: '审核状态'
  },
  certification_imgs: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: '认证图片数组'
  },
  is_online: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    comment: '是否在线'
  }
}, {
  tableName: 'keepers',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Keeper;
