const sequelize = require('../config/database');
const User = require('./User');
const Keeper = require('./Keeper');
const Order = require('./Order');
const Payment = require('./Payment');
const Post = require('./Post');
const Conversation = require('./Conversation');
const AdminUser = require('./AdminUser');
const Service = require('./Service');
const ServiceCategory = require('./ServiceCategory');
const KeeperLevel = require('./KeeperLevel');
const Coupon = require('./Coupon');
const AutoReply = require('./AutoReply');
const CommonWord = require('./CommonWord');
const FAQ = require('./FAQ');
const Setting = require('./Setting');

User.hasOne(Keeper, { foreignKey: 'user_id', as: 'keeperProfile' });
Keeper.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

User.hasMany(Order, { foreignKey: 'seeker_id', as: 'seekerOrders' });
User.hasMany(Order, { foreignKey: 'keeper_id', as: 'keeperOrders' });
Order.belongsTo(User, { foreignKey: 'seeker_id', as: 'seeker' });
Order.belongsTo(User, { foreignKey: 'keeper_id', as: 'keeper' });

Order.hasOne(Payment, { foreignKey: 'order_no', sourceKey: 'order_no', as: 'payment' });
Payment.belongsTo(Order, { foreignKey: 'order_no', targetKey: 'order_no', as: 'order' });

User.hasMany(Post, { foreignKey: 'user_id', as: 'posts' });
Post.belongsTo(User, { foreignKey: 'user_id', as: 'author' });

Order.hasMany(Conversation, { foreignKey: 'order_id', as: 'conversations' });
Conversation.belongsTo(Order, { foreignKey: 'order_id', as: 'order' });

ServiceCategory.hasMany(Service, { foreignKey: 'category_id', as: 'services' });
Service.belongsTo(ServiceCategory, { foreignKey: 'category_id', as: 'category' });

module.exports = {
  sequelize,
  User,
  Keeper,
  Order,
  Payment,
  Post,
  Conversation,
  AdminUser,
  Service,
  ServiceCategory,
  KeeperLevel,
  Coupon,
  AutoReply,
  CommonWord,
  FAQ,
  Setting
};