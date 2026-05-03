# 暖栖港湾（Warm Harbor）

一个基于微信公众号的H5情感陪伴平台，采用黑白极简设计风格。

## 项目结构

```
nuanqi/
├── h5/                 # 用户端（Vue3 + Vite + Vant）
│   ├── src/
│   │   ├── api/        # API接口
│   │   │   ├── auth.js
│   │   │   ├── order.js
│   │   │   ├── pay.js
│   │   │   ├── post.js
│   │   │   ├── request.js
│   │   │   ├── upload.js
│   │   │   └── user.js
│   │   ├── components/ # 公共组件
│   │   │   ├── ErrorBoundary.vue  # 全局错误边界
│   │   │   └── TabBar.vue         # 底部导航
│   │   ├── router/     # 路由配置
│   │   ├── stores/     # Pinia状态管理
│   │   ├── styles/     # 全局样式
│   │   ├── utils/      # 工具函数
│   │   │   ├── wechatAuth.js  # 【微信H5专用】授权封装
│   │   │   ├── wxPay.js       # 【微信H5专用】支付封装
│   │   │   ├── wxSdk.js       # 【微信H5专用】JS-SDK封装
│   │   │   ├── validator.js   # 表单验证
│   │   │   └── errorHandler.js # 全局错误处理
│   │   └── views/      # 页面视图
│   ├── package.json
│   ├── .eslintrc.js    # ESLint配置
│   └── vite.config.js
│
├── admin/              # 后台管理系统（Vue3 + Vite + Element Plus）
│   ├── src/
│   │   ├── api/        # API接口
│   │   │   ├── admin.js       # 完整管理API
│   │   │   └── request.js
│   │   ├── layouts/    # 布局组件
│   │   │   └── MainLayout.vue
│   │   ├── router/     # 路由配置
│   │   ├── stores/     # Pinia状态管理
│   │   ├── styles/     # 全局样式
│   │   └── views/      # 页面视图
│   │       ├── dashboard/
│   │       ├── services/
│   │       ├── settings/
│   │       ├── wechat/
│   │       ├── finance/
│   │       └── ...
│   ├── package.json
│   ├── .eslintrc.js    # ESLint配置
│   └── vite.config.js
│
├── server/             # 后端服务（Node.js + Express + MySQL）
│   ├── src/
│   │   ├── config/     # 配置文件
│   │   ├── controllers/# 控制器
│   │   │   ├── adminController.js
│   │   │   ├── authController.js
│   │   │   ├── orderController.js
│   │   │   ├── payController.js
│   │   │   ├── postController.js
│   │   │   ├── uploadController.js  # 文件上传
│   │   │   └── userController.js
│   │   ├── middleware/ # 中间件
│   │   │   └── auth.js
│   │   ├── models/     # 数据模型
│   │   │   ├── User.js
│   │   │   ├── Keeper.js
│   │   │   ├── Order.js
│   │   │   ├── Payment.js
│   │   │   ├── Post.js
│   │   │   ├── Service.js
│   │   │   ├── ServiceCategory.js
│   │   │   ├── KeeperLevel.js
│   │   │   ├── Coupon.js
│   │   │   ├── Conversation.js
│   │   │   ├── AutoReply.js
│   │   │   ├── CommonWord.js
│   │   │   ├── FAQ.js
│   │   │   ├── Setting.js
│   │   │   ├── AdminUser.js
│   │   │   └── index.js
│   │   ├── routes/     # 路由
│   │   │   ├── admin.js
│   │   │   ├── upload.js
│   │   │   └── ...
│   │   └── utils/      # 工具函数
│   │       └── upload.js  # Multer配置
│   ├── database/
│   │   └── init.sql    # 数据库初始化脚本
│   ├── scripts/        # 数据库脚本
│   │   ├── init-db.js
│   │   ├── seed-data.js
│   │   └── reset-admin.js
│   ├── package.json
│   ├── .eslintrc.js    # ESLint配置
│   └── Dockerfile
│
├── nginx.conf          # Nginx配置
├── docker-compose.yml  # Docker编排配置
└── README.md           # 项目文档
```

## 技术栈

### 用户端（H5）
- Vue 3 + Composition API
- Vue Router 4（hash模式）
- Pinia（手动 localStorage 持久化）
- Vant 4（黑白极简主题）
- Axios
- postcss-px-to-viewport
- 错误边界组件
- 表单验证工具

### 后台管理
- Vue 3
- Element Plus
- ECharts（黑白图表）
- Vue Router 4（history模式）
- 完整权限管理（可配置）

### 后端
- Node.js + Express
- MySQL + Sequelize ORM
- JWT认证
- 微信SDK集成
- Multer文件上传
- 完整管理API

## 核心功能

1. **微信授权登录** - OAuth2.0静默授权+用户信息授权
2. **双角色系统** - 访客（Seeker）与守护者（Keeper）
3. **陪伴服务** - 文字/语音/树洞，微信支付
4. **心灵广场** - 瀑布流动态，匿名发布
5. **盲盒功能** - 随机匹配，惊喜体验
6. **后台管理** - RBAC权限，完整数据管理

## 快速开始

### 环境要求
- Node.js >= 18
- MySQL >= 8.0
- 微信公众号（服务号推荐）

### 安装依赖

```bash
# 后端
cd server
npm install

# 用户端
cd h5
npm install

# 后台管理
cd admin
npm install
```

### 配置环境变量

复制对应的 `.env.example` 为 `.env` 并填写配置：

**server/.env 主要配置：**
```env
APP_PORT=3000
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_DATABASE=nuanqi
MYSQL_USER=root
MYSQL_PASSWORD=your_password
JWT_SECRET=your_jwt_secret
WECHAT_APPID=your_appid
WECHAT_SECRET=your_secret
WECHAT_TOKEN=warm_harbor_2024
WECHAT_AES_KEY=your_aes_key
```

**admin/.env 主要配置：**
```env
VITE_API_BASE_URL=http://localhost:3000/api/v1
```

**h5/.env 主要配置：**
```env
VITE_API_BASE_URL=http://localhost:3000/api/v1
```

### 初始化数据库

```bash
cd server
node scripts/init-db.js  # 创建数据库和表
node scripts/seed-data.js # 导入测试数据（可选）
node scripts/reset-admin.js # 重置管理员密码（可选）
```

### 启动开发环境

```bash
# 后端
cd server
npm run dev

# 用户端
cd h5
npm run dev
# 访问: http://localhost:5173

# 后台管理
cd admin
npm run dev
# 访问: http://localhost:5174/admin
# 默认账号: admin / admin123
```

### 生产部署

```bash
# 构建前端
cd h5 && npm run build
cd admin && npm run build

# Docker部署（推荐）
docker-compose up -d
```

## 后台管理功能模块

| 模块 | 说明 |
|-----|------|
| 控制台 | 数据概览、图表展示 |
| 系统配置 | 基础参数设置 |
| 附件管理 | 文件管理（占位） |
| 服务管理 | 陪聊服务配置 |
| 服务分类 | 服务分类管理 |
| 守护者等级 | 等级配置 |
| 优惠券 | 优惠券管理 |
| 订单中心 | 订单查询与管理 |
| 用户管理 | 用户列表、状态管理 |
| 守护者管理 | 守护者申请审核 |
| 打赏信息 | 打赏记录查询 |
| 财务管理 | 财务数据统计 |
| 动态管理 | 动态审核管理 |
| 会话管理 | 会话记录查询 |
| 自动回复 | 微信自动回复配置 |
| 自定义菜单 | 微信菜单配置 |
| 素材管理 | 微信素材库 |
| 常用语 | 快捷回复配置 |
| 常见问题 | FAQ管理 |
| 营销管理 | 营销活动配置 |
| 店铺装修 | 店铺页面配置 |
| 团队管理 | 管理员团队 |
| 数据统计 | 数据报表统计 |
| 消息配置 | 消息推送配置 |

## 微信配置要点

1. **公众号设置**：
   - JS接口安全域名：`your-domain.com`
   - 网页授权域名：`your-domain.com`
   - 业务域名：`your-domain.com`

2. **支付配置**：
   - 支付授权目录：`https://your-domain.com/h5/`
   - 回调地址：`https://your-domain.com/api/v1/pay/notify`

3. **【防坑提示】**：
   - H5路由必须使用hash模式（/#/）
   - 所有域名必须ICP备案
   - 必须配置HTTPS
   - 支付回调必须返回成功XML
   - 微信头像和昵称要在用户授权后获取

## Nginx部署配置

### 配置示例

```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    # HTTP 强制重定向到 HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;
    
    # SSL证书配置
    ssl_certificate /path/to/fullchain.pem;
    ssl_certificate_key /path/to/privkey.pem;
    
    # H5用户端
    location / {
        alias /path/to/nuanqi/h5/dist;
        try_files $uri $uri/ /index.html;
    }
    
    # 后台管理
    location /admin {
        alias /path/to/nuanqi/admin/dist;
        try_files $uri $uri/ /admin/index.html;
    }
    
    # 后端API代理
    location /api/v1 {
        proxy_pass http://127.0.0.1:3000/api/v1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # 上传文件服务
    location /uploads {
        alias /path/to/nuanqi/server/uploads;
    }
}
```

## 项目更新记录

### 最近更新
- ✅ 补充了完整后台管理API方法
- ✅ 修复了API拦截器Pinia调用问题
- ✅ 统一了localStorage key命名
- ✅ 实现了文件上传功能
- ✅ 添加了表单验证工具
- ✅ 添加了全局错误处理和错误边界
- ✅ 移除了pinia-plugin-persistedstate避免冲突
- ✅ 修复了后台管理图标问题
- ✅ 添加了ESLint配置文件

### 本地存储键说明

| 项目 | 键名 |
|-----|------|
| H5用户端 | `token`, `refreshToken`, `userInfo`, `currentRole` |
| 后台管理 | `adminToken`, `adminInfo` |

## 许可证

MIT
