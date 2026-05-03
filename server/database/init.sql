-- 暖栖港湾数据库初始化脚本
-- 数据库: nuanqi
-- 字符集: utf8mb4

CREATE DATABASE IF NOT EXISTS nuanqi 
  DEFAULT CHARACTER SET utf8mb4 
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE nuanqi;

-- 1. 用户表
CREATE TABLE IF NOT EXISTS users (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  openid VARCHAR(100) NOT NULL UNIQUE COMMENT '微信openid，唯一标识',
  unionid VARCHAR(100) DEFAULT NULL COMMENT '微信unionid',
  nickname VARCHAR(100) DEFAULT NULL COMMENT '用户昵称',
  avatar_url VARCHAR(500) DEFAULT NULL COMMENT '头像URL',
  role ENUM('seeker', 'keeper', 'both') DEFAULT 'seeker' COMMENT '用户角色：访客/守护者/两者',
  phone VARCHAR(20) DEFAULT NULL COMMENT '手机号',
  status ENUM('active', 'banned', 'inactive') DEFAULT 'active' COMMENT '账号状态',
  last_login_at DATETIME DEFAULT NULL COMMENT '最后登录时间',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_openid (openid),
  INDEX idx_role (role),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';

-- 2. 守护者资料表
CREATE TABLE IF NOT EXISTS keepers (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED NOT NULL COMMENT '关联用户ID',
  real_name VARCHAR(255) DEFAULT NULL COMMENT '真实姓名（AES加密）',
  id_card VARCHAR(255) DEFAULT NULL COMMENT '身份证号（AES加密）',
  bio TEXT DEFAULT NULL COMMENT '个人简介',
  tags JSON DEFAULT NULL COMMENT '技能标签数组，如["情感咨询","倾听陪伴"]',
  hourly_rate INT UNSIGNED DEFAULT NULL COMMENT '每小时价格（分）',
  level_id INT UNSIGNED DEFAULT 1 COMMENT '守护者等级ID',
  score INT UNSIGNED DEFAULT 0 COMMENT '守护者积分',
  status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending' COMMENT '审核状态',
  certification_imgs JSON DEFAULT NULL COMMENT '认证图片数组',
  is_online TINYINT(1) DEFAULT 0 COMMENT '是否在线',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_status (status),
  INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='守护者资料表';

-- 3. 守护者等级表
CREATE TABLE IF NOT EXISTS keeper_levels (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL COMMENT '等级名称',
  icon VARCHAR(20) DEFAULT NULL COMMENT '等级图标',
  min_score INT UNSIGNED DEFAULT 0 COMMENT '最低积分',
  max_score INT UNSIGNED DEFAULT 0 COMMENT '最高积分（0表示不限）',
  discount INT DEFAULT 100 COMMENT '服务折扣百分比',
  color VARCHAR(20) DEFAULT '#3b82f6' COMMENT '等级颜色',
  sort INT DEFAULT 0 COMMENT '排序',
  status ENUM('active', 'inactive') DEFAULT 'active' COMMENT '状态',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_sort (sort)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='守护者等级表';

-- 4. 服务分类表
CREATE TABLE IF NOT EXISTS service_categories (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL COMMENT '分类名称',
  image VARCHAR(500) DEFAULT NULL COMMENT '分类图片',
  status ENUM('active', 'inactive') DEFAULT 'active' COMMENT '状态',
  is_blind_box TINYINT(1) DEFAULT 0 COMMENT '是否盲盒商品',
  multilang VARCHAR(100) DEFAULT NULL COMMENT '多语言标识',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='服务分类表';

-- 5. 服务项目表
CREATE TABLE IF NOT EXISTS services (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL COMMENT '服务名称',
  category_id INT UNSIGNED NOT NULL COMMENT '关联分类ID',
  duration DECIMAL(10,2) DEFAULT 0 COMMENT '服务时长（小时）',
  sort INT DEFAULT 0 COMMENT '排序',
  status ENUM('active', 'inactive') DEFAULT 'active' COMMENT '状态',
  multilang VARCHAR(100) DEFAULT NULL COMMENT '多语言标识',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES service_categories(id) ON DELETE CASCADE,
  INDEX idx_category_id (category_id),
  INDEX idx_sort (sort)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='服务项目表';

-- 6. 订单表
CREATE TABLE IF NOT EXISTS orders (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  order_no VARCHAR(32) NOT NULL UNIQUE COMMENT '订单编号，如NQ20240101A1B2C3',
  seeker_id INT UNSIGNED NOT NULL COMMENT '访客用户ID',
  keeper_id INT UNSIGNED NOT NULL COMMENT '守护者用户ID',
  service_id INT UNSIGNED DEFAULT NULL COMMENT '关联服务ID',
  service_type ENUM('text', 'voice', 'video', 'buyout', 'blind_box') DEFAULT 'text' COMMENT '服务类型',
  duration INT UNSIGNED NOT NULL COMMENT '服务时长（分钟）',
  amount INT UNSIGNED NOT NULL COMMENT '订单金额（分）',
  status ENUM('unpaid', 'paid', 'serving', 'completed', 'cancelled', 'refunding', 'refunded') DEFAULT 'unpaid' COMMENT '订单状态',
  remark TEXT DEFAULT NULL COMMENT '用户备注',
  paid_at DATETIME DEFAULT NULL COMMENT '支付时间',
  completed_at DATETIME DEFAULT NULL COMMENT '完成时间',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (seeker_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (keeper_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE SET NULL,
  INDEX idx_order_no (order_no),
  INDEX idx_seeker_id (seeker_id),
  INDEX idx_keeper_id (keeper_id),
  INDEX idx_status (status),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='订单表';

-- 7. 支付流水表
CREATE TABLE IF NOT EXISTS payments (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  order_no VARCHAR(32) NOT NULL COMMENT '关联订单号',
  transaction_id VARCHAR(64) DEFAULT NULL COMMENT '微信流水号',
  amount INT UNSIGNED NOT NULL COMMENT '支付金额（分）',
  status ENUM('pending', 'success', 'failed', 'refunded') DEFAULT 'pending' COMMENT '支付状态',
  prepay_id VARCHAR(64) DEFAULT NULL COMMENT '微信预支付ID',
  pay_time DATETIME DEFAULT NULL COMMENT '支付完成时间',
  notify_data JSON DEFAULT NULL COMMENT '微信回调原始数据',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (order_no) REFERENCES orders(order_no) ON DELETE CASCADE,
  INDEX idx_order_no (order_no),
  INDEX idx_transaction_id (transaction_id),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='支付流水表';

-- 8. 优惠券表
CREATE TABLE IF NOT EXISTS coupons (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL COMMENT '优惠券名称',
  type ENUM('new_user', 'discount', 'gift', 'free') DEFAULT 'discount' COMMENT '类型',
  value INT UNSIGNED NOT NULL COMMENT '面额（分）',
  min_amount INT UNSIGNED DEFAULT 0 COMMENT '最低消费（分）',
  total INT UNSIGNED DEFAULT 1000 COMMENT '总量',
  used_count INT UNSIGNED DEFAULT 0 COMMENT '已使用数量',
  start_time DATETIME NOT NULL COMMENT '开始时间',
  end_time DATETIME NOT NULL COMMENT '结束时间',
  status ENUM('active', 'inactive') DEFAULT 'active' COMMENT '状态',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='优惠券表';

-- 9. 用户优惠券表
CREATE TABLE IF NOT EXISTS user_coupons (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED NOT NULL COMMENT '用户ID',
  coupon_id INT UNSIGNED NOT NULL COMMENT '优惠券ID',
  status ENUM('unused', 'used', 'expired') DEFAULT 'unused' COMMENT '状态',
  used_at DATETIME DEFAULT NULL COMMENT '使用时间',
  order_no VARCHAR(32) DEFAULT NULL COMMENT '关联订单号',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (coupon_id) REFERENCES coupons(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户优惠券表';

-- 10. 广场动态表
CREATE TABLE IF NOT EXISTS posts (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED NOT NULL COMMENT '发布者用户ID',
  content TEXT NOT NULL COMMENT '动态内容',
  images JSON DEFAULT NULL COMMENT '图片URL数组',
  is_anonymous TINYINT(1) DEFAULT 0 COMMENT '是否匿名',
  lighthouse_no VARCHAR(20) DEFAULT NULL COMMENT '匿名编号，如#892',
  likes_count INT UNSIGNED DEFAULT 0 COMMENT '点赞数',
  status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending' COMMENT '审核状态',
  mood_tag VARCHAR(50) DEFAULT NULL COMMENT '情绪标签，如"平静","焦虑"',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_status (status),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='广场动态表';

-- 11. 会话/通话记录表
CREATE TABLE IF NOT EXISTS conversations (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  order_id INT UNSIGNED NOT NULL COMMENT '关联订单ID',
  user_id INT UNSIGNED NOT NULL COMMENT '关联用户ID',
  type ENUM('text', 'voice') NOT NULL COMMENT '消息类型',
  content TEXT DEFAULT NULL COMMENT '文字内容',
  duration INT UNSIGNED DEFAULT NULL COMMENT '语音时长（秒）',
  file_url VARCHAR(500) DEFAULT NULL COMMENT '语音文件URL',
  sender_id INT UNSIGNED NOT NULL COMMENT '发送者用户ID',
  last_chat_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '最后会话时间',
  unread_count INT UNSIGNED DEFAULT 0 COMMENT '未读消息数',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_order_id (order_id),
  INDEX idx_user_id (user_id),
  INDEX idx_last_chat_time (last_chat_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='会话记录表';

-- 12. 自动回复表
CREATE TABLE IF NOT EXISTS auto_replies (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  keyword VARCHAR(100) NOT NULL COMMENT '关键字',
  type ENUM('news', 'image', 'video', 'voice', 'text', 'link') DEFAULT 'text' COMMENT '回复类型',
  content TEXT NOT NULL COMMENT '回复内容',
  sort INT DEFAULT 0 COMMENT '排序',
  status ENUM('active', 'inactive') DEFAULT 'active' COMMENT '状态',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_sort (sort),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='自动回复表';

-- 13. 常用语表
CREATE TABLE IF NOT EXISTS common_words (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  category VARCHAR(50) DEFAULT 'other' COMMENT '分类',
  content TEXT NOT NULL COMMENT '常用语内容',
  sort INT DEFAULT 0 COMMENT '排序',
  status ENUM('active', 'inactive') DEFAULT 'active' COMMENT '状态',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_category (category),
  INDEX idx_sort (sort)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='常用语表';

-- 14. 常见问题表
CREATE TABLE IF NOT EXISTS faqs (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  question VARCHAR(500) NOT NULL COMMENT '问题',
  answer TEXT NOT NULL COMMENT '答案',
  sort INT DEFAULT 0 COMMENT '排序',
  status ENUM('active', 'inactive') DEFAULT 'active' COMMENT '状态',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_sort (sort)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='常见问题表';

-- 15. 系统设置表
CREATE TABLE IF NOT EXISTS settings (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `key` VARCHAR(100) NOT NULL UNIQUE COMMENT '设置键',
  value TEXT NOT NULL COMMENT '设置值',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_key (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='系统设置表';

-- 16. 后台管理员表
CREATE TABLE IF NOT EXISTS admin_users (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE COMMENT '登录账号',
  password VARCHAR(255) NOT NULL COMMENT 'bcrypt加密密码',
  role ENUM('super_admin', 'customer_service', 'finance', 'marketing') DEFAULT 'customer_service' COMMENT '角色',
  nickname VARCHAR(50) DEFAULT NULL COMMENT '显示名称',
  status ENUM('active', 'inactive') DEFAULT 'active' COMMENT '账号状态',
  last_login_at DATETIME DEFAULT NULL COMMENT '最后登录时间',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_username (username),
  INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='后台管理员表';

-- 插入默认超级管理员（密码: admin123）
INSERT IGNORE INTO admin_users (username, password, role, nickname, status) VALUES 
('admin', '$2a$10$v2cRLZn7c83gL7C69zZshe8ZXF1OGoJOnmo5ZIZhViwrvDTz1ap7C', 'super_admin', '超级管理员', 'active');

-- 插入守护者等级数据
INSERT IGNORE INTO keeper_levels (id, name, icon, min_score, max_score, discount, color, sort, status) VALUES
(1, '普通店员', '⭐', 0, 1000, 100, '#909399', 1, 'active'),
(2, '金牌店员', '🥇', 1000, 5000, 95, '#ffd700', 2, 'active'),
(3, '镇店店员', '👑', 5000, 10000, 90, '#ff6b6b', 3, 'active'),
(4, '女神', '💎', 10000, 20000, 85, '#e84393', 4, 'active'),
(5, '男神', '🌟', 10000, 20000, 85, '#0984e3', 5, 'active'),
(6, '首席', '🏆', 20000, 50000, 80, '#6c5ce7', 6, 'active'),
(7, '锦鲤', '🐠', 50000, 100000, 75, '#fdcb6e', 7, 'active'),
(8, '店长', '👔', 100000, 0, 70, '#2d3436', 8, 'active');

-- 插入服务分类数据
INSERT IGNORE INTO service_categories (id, name, status, is_blind_box) VALUES
(1, '文语盲盒', 'active', 1),
(2, '语音连麦', 'active', 0),
(3, '买断', 'active', 0),
(4, '哄睡', 'active', 0),
(5, '游戏陪玩', 'active', 0),
(6, '叫醒', 'active', 0),
(7, '唱歌', 'active', 0),
(8, '首单优惠', 'active', 1),
(9, '视频聊天', 'inactive', 0),
(10, '文字语音条', 'active', 0);