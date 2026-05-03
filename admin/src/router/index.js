import { createRouter, createWebHistory } from 'vue-router';
import { ElMessage } from 'element-plus';

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/login/index.vue'),
    meta: { public: true }
  },
  {
    path: '/',
    component: () => import('../layouts/MainLayout.vue'),
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('../views/dashboard/index.vue'),
        meta: { title: '控制台', icon: 'Monitor' }
      },
      {
        path: 'settings/system',
        name: 'SystemSettings',
        component: () => import('../views/settings/system.vue'),
        meta: { title: '系统配置', icon: 'Settings', roles: ['super_admin'] }
      },
      {
        path: 'settings/attachments',
        name: 'AttachmentManagement',
        component: () => import('../views/settings/attachments.vue'),
        meta: { title: '附件管理', icon: 'Folder', roles: ['super_admin'] }
      },
      {
        path: 'services',
        name: 'Services',
        component: () => import('../views/services/index.vue'),
        meta: { title: '服务管理', icon: 'Headphones', roles: ['super_admin', 'customer_service'] }
      },
      {
        path: 'services/categories',
        name: 'ServiceCategories',
        component: () => import('../views/services/categories.vue'),
        meta: { title: '服务分类', icon: 'Grid', roles: ['super_admin', 'customer_service'] }
      },
      {
        path: 'services/levels',
        name: 'ServiceLevels',
        component: () => import('../views/services/levels.vue'),
        meta: { title: '店员等级配置', icon: 'Award', roles: ['super_admin'] }
      },
      {
        path: 'coupons',
        name: 'Coupons',
        component: () => import('../views/coupons/index.vue'),
        meta: { title: '优惠券管理', icon: 'Ticket', roles: ['super_admin', 'finance'] }
      },
      {
        path: 'orders',
        name: 'Orders',
        component: () => import('../views/orders/index.vue'),
        meta: { title: '订单中心', icon: 'List', roles: ['super_admin', 'finance', 'customer_service'] }
      },
      {
        path: 'users',
        name: 'Users',
        component: () => import('../views/users/index.vue'),
        meta: { title: '用户管理', icon: 'User', roles: ['super_admin', 'customer_service'] }
      },
      {
        path: 'keepers',
        name: 'Keepers',
        component: () => import('../views/keepers/index.vue'),
        meta: { title: '店员管理', icon: 'UserFilled', roles: ['super_admin', 'customer_service'] }
      },
      {
        path: 'rewards',
        name: 'Rewards',
        component: () => import('../views/rewards/index.vue'),
        meta: { title: '打赏信息', icon: 'Gift', roles: ['super_admin', 'finance'] }
      },
      {
        path: 'finance',
        name: 'Finance',
        component: () => import('../views/finance/index.vue'),
        meta: { title: '财务管理', icon: 'Money', roles: ['super_admin', 'finance'] }
      },
      {
        path: 'posts',
        name: 'Posts',
        component: () => import('../views/posts/index.vue'),
        meta: { title: '动态管理', icon: 'ChatDotSquare', roles: ['super_admin', 'customer_service'] }
      },
      {
        path: 'conversations',
        name: 'Conversations',
        component: () => import('../views/conversations/index.vue'),
        meta: { title: '会话管理', icon: 'MessageSquare', roles: ['super_admin', 'customer_service'] }
      },
      {
        path: 'wechat/auto-reply',
        name: 'AutoReply',
        component: () => import('../views/wechat/auto-reply.vue'),
        meta: { title: '自动回复', icon: 'Message', roles: ['super_admin'] }
      },
      {
        path: 'wechat/menu',
        name: 'WechatMenu',
        component: () => import('../views/wechat/menu.vue'),
        meta: { title: '自定义菜单', icon: 'Menu', roles: ['super_admin'] }
      },
      {
        path: 'wechat/material',
        name: 'Material',
        component: () => import('../views/wechat/material.vue'),
        meta: { title: '素材管理', icon: 'Image', roles: ['super_admin'] }
      },
      {
        path: 'wechat/common',
        name: 'CommonWords',
        component: () => import('../views/wechat/common.vue'),
        meta: { title: '常用语', icon: 'FileText', roles: ['super_admin', 'customer_service'] }
      },
      {
        path: 'wechat/faq',
        name: 'FAQ',
        component: () => import('../views/wechat/faq.vue'),
        meta: { title: '常见问题', icon: 'HelpCircle', roles: ['super_admin', 'customer_service'] }
      },
      {
        path: 'marketing',
        name: 'Marketing',
        component: () => import('../views/marketing/index.vue'),
        meta: { title: '营销管理', icon: 'Sparkles', roles: ['super_admin', 'marketing'] }
      },
      {
        path: 'store',
        name: 'Store',
        component: () => import('../views/store/index.vue'),
        meta: { title: '店铺装修', icon: 'Palette', roles: ['super_admin'] }
      },
      {
        path: 'team',
        name: 'Team',
        component: () => import('../views/team/index.vue'),
        meta: { title: '团队管理', icon: 'Users', roles: ['super_admin'] }
      },
      {
        path: 'statistics',
        name: 'Statistics',
        component: () => import('../views/statistics/index.vue'),
        meta: { title: '数据管理', icon: 'BarChart', roles: ['super_admin', 'finance'] }
      },
      {
        path: 'message',
        name: 'Message',
        component: () => import('../views/message/index.vue'),
        meta: { title: '消息配置', icon: 'Bell', roles: ['super_admin'] }
      }
    ]
  }
];

const router = createRouter({
  history: createWebHistory('/admin/'),
  routes
});

router.beforeEach((to, from, next) => {
  // 直接从 localStorage 读取，避免依赖 store 初始化时序问题
  const token = localStorage.getItem('adminToken');
  
  // 公开页面直接访问
  if (to.meta.public) {
    // 如果已登录且去登录页，重定向到首页
    if (token && to.path === '/login') {
      next('/dashboard');
    } else {
      next();
    }
    return;
  }
  
  // 需要登录的页面
  if (!token) {
    next('/login');
    return;
  }
  
  // 暂时禁用角色权限检查，让所有页面都能访问
  // if (to.meta.roles && to.meta.roles.length > 0) {
  //   if (!to.meta.roles.includes(adminInfo.role)) {
  //     ElMessage.error('您没有权限访问该页面');
  //     next('/dashboard');
  //     return;
  //   }
  // }
  
  next();
});

export default router;