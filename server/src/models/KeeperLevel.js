const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const KeeperLevel = sequelize.define('KeeperLevel', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  icon: {
    type: DataTypes.STRING,
    allowNull: true
  },
  min_score: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  max_score: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  discount: {
    type: DataTypes.INTEGER,
    defaultValue: 100
  },
  color: {
    type: DataTypes.STRING,
    defaultValue: '#3b82f6'
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
  tableName: 'keeper_levels',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = KeeperLevel;