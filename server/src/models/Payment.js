const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Payment = sequelize.define('Payment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  order_no: {
    type: DataTypes.STRING(32),
    allowNull: false,
    comment: '关联订单号'
  },
  transaction_id: {
    type: DataTypes.STRING(64),
    allowNull: true,
    comment: '微信流水号'
  },
  amount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: '支付金额（分）'
  },
  status: {
    type: DataTypes.ENUM('pending', 'success', 'failed', 'refunded'),
    defaultValue: 'pending',
    comment: '支付状态'
  },
  prepay_id: {
    type: DataTypes.STRING(64),
    allowNull: true,
    comment: '微信预支付ID'
  },
  pay_time: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: '支付完成时间'
  },
  notify_data: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: '微信回调数据'
  }
}, {
  tableName: 'payments',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Payment;
