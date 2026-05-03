const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Conversation = sequelize.define('Conversation', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  order_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'orders',
      key: 'id'
    }
  },
  type: {
    type: DataTypes.ENUM('text', 'voice'),
    allowNull: false,
    comment: '消息类型'
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: '文字内容'
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: '语音时长（秒）'
  },
  file_url: {
    type: DataTypes.STRING(500),
    allowNull: true,
    comment: '语音文件URL'
  },
  sender_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: '发送者ID'
  }
}, {
  tableName: 'conversations',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Conversation;
