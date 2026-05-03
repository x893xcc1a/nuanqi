import { createRouter, createWebHashHistory } from 'vue-router';
import { useUserStore } from '../stores/user';

// 【防坑提示】必须使用hash模式，否则微信授权回调后刷新页面会404
const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('../views/home/index.vue'),
    meta: { title: '心动墙', requiresAuth: false, tabBar: true, tabIndex: 0 }
  },
  {
    path: '/blind-box',
    name: 'BlindBox',
    component: () => import('../views/blind-box/index.vue'),
    meta: { title: '盲盒', requiresAuth: false, tabBar: true, tabIndex: 1 }
  },
  {
    path: '/keepers',
    name: 'Keepers',
    component: () => import('../views/keepers/index.vue'),
    meta: { title: '选人下单', requiresAuth: false, tabBar: true, tabIndex: 2 }
  },
  {
    path: '/keepers/:id',
    name: 'KeeperDetail',
    component: () => import('../views/keepers/detail.vue'),
    meta: { title: '守护者详情', requiresAuth: true }
  },
  {
    path: '/square',
    name: 'Square',
    component: () => import('../views/square/index.vue'),
    meta: { title: '动态广场', requiresAuth: false, tabBar: true, tabIndex: 3 }
  },
  {
    path: '/square/post',
    name: 'PostCreate',
    component: () => import('../views/square/post.vue'),
    meta: { title: '发布动态', requiresAuth: true }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('../views/profile/index.vue'),
    meta: { title: '个人中心', requiresAuth: true, tabBar: true, tabIndex: 4 }
  },
  {
    path: '/profile/edit',
    name: 'ProfileEdit',
    component: () => import('../views/profile/edit.vue'),
    meta: { title: '编辑资料', requiresAuth: true }
  },
  {
    path: '/profile/wallet',
    name: 'Wallet',
    component: () => import('../views/profile/wallet.vue'),
    meta: { title: '我的钱包', requiresAuth: true }
  },
  {
    path: '/profile/apply-keeper',
    name: 'ApplyKeeper',
    component: () => import('../views/profile/apply-keeper.vue'),
    meta: { title: '申请店员', requiresAuth: true }
  },
  {
    path: '/orders',
    name: 'Orders',
    component: () => import('../views/orders/index.vue'),
    meta: { title: '接单中心', requiresAuth: true }
  },
  {
    path: '/orders/create',
    name: 'CreateOrder',
    component: () => import('../views/orders/create.vue'),
    meta: { title: '确认订单', requiresAuth: true }
  },
  {
    path: '/auth/callback',
    name: 'AuthCallback',
    component: () => import('../views/auth/callback.vue'),
    meta: { title: '登录中...', requiresAuth: false }
  },
  {
    path: '/auth/guide',
    name: 'AuthGuide',
    component: () => import('../views/auth/guide.vue'),
    meta: { title: '授权引导', requiresAuth: false }
  },
  {
    path: '/blind-box/order',
    name: 'BlindBoxOrder',
    component: () => import('../views/blind-box/order.vue'),
    meta: { title: '盲盒下单', requiresAuth: true }
  },
  {
    path: '/home/ranking',
    name: 'Ranking',
    component: () => import('../views/home/ranking.vue'),
    meta: { title: '排行榜', requiresAuth: true }
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 };
  }
});

// 【微信H5专用】路由守卫 - 登录拦截
router.beforeEach((to, from, next) => {
  const userStore = useUserStore();
  
  // 设置页面标题
  if (to.meta.title) {
    document.title = to.meta.title;
  }
  
  // 需要登录的页面
  if (to.meta.requiresAuth && !userStore.isLoggedIn) {
    // 【防坑提示】记录目标页面，授权后跳转回来
    sessionStorage.setItem('redirectUrl', to.fullPath);
    next('/auth/guide');
    return;
  }
  
  next();
});

export default router;
