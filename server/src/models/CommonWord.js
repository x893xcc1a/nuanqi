const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CommonWord = sequelize.define('CommonWord', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  category: {
    type: DataTypes.STRING,
    defaultValue: 'other'
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  sort: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive'),
    defaultValue: 'active'
  }
}, {
  tableName: 'common_words',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = CommonWord;