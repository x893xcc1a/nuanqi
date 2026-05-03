const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  order_no: {
    type: DataTypes.STRING(32),
    unique: true,
    allowNull: false,
    comment: '订单编号'
  },
  seeker_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  keeper_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  service_type: {
    type: DataTypes.ENUM('text', 'voice', 'treehole'),
    allowNull: false,
    comment: '服务类型：文字/语音/树洞'
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: '服务时长（分钟）'
  },
  amount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: '订单金额（分）'
  },
  status: {
    type: DataTypes.ENUM('unpaid', 'paid', 'serving', 'completed', 'cancelled', 'refunding', 'refunded'),
    defaultValue: 'unpaid',
    comment: '订单状态'
  },
  remark: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: '用户备注'
  },
  paid_at: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: '支付时间'
  },
  completed_at: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: '完成时间'
  }
}, {
  tableName: 'orders',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Order;
