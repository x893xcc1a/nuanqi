<template>
  <div class="admin-layout">
    <header class="admin-header">
      <div class="header-left">
        <el-button icon="Menu" class="menu-btn" @click="sidebarCollapsed = !sidebarCollapsed"></el-button>
        <div class="logo-text">
          <span class="logo-title">陪聊V3.0</span>
        </div>
      </div>
      <div class="header-center">
        <el-tabs v-model="activeTab" class="header-tabs" type="card">
          <el-tab-pane v-for="tab in activeTabs" :key="tab.path" :label="tab.title" @click="handleTabClick(tab.path)">
          </el-tab-pane>
        </el-tabs>
      </div>
      <div class="header-right">
        <el-button class="header-btn">
          <el-icon><HomeFilled /></el-icon>
          主页
        </el-button>
        <el-button class="header-btn">
          <el-icon><Refresh /></el-icon>
          清除缓存
        </el-button>
        <el-button class="header-btn">
          <el-icon><FullScreen /></el-icon>
        </el-button>
        <span class="admin-name">{{ adminStore.adminInfo.nickname || adminStore.adminInfo.username }}</span>
        <el-dropdown @command="handleCommand">
          <span class="el-dropdown-link">
            <el-icon><User /></el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </header>

    <div class="admin-body">
      <aside class="admin-sidebar" :class="{ collapsed: sidebarCollapsed }">
        <div class="sidebar-header">
          <div class="user-info">
            <div class="avatar-wrapper">
              <el-icon><UserFilled /></el-icon>
            </div>
            <span class="user-name">{{ adminStore.adminInfo.nickname || adminStore.adminInfo.username }}</span>
            <span class="user-status online">在线</span>
          </div>
        </div>

        <div class="search-box">
          <el-input placeholder="搜索菜单" size="small" v-model="searchKeyword">
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
        </div>

        <el-menu
          :default-active="activeMenu"
          router
          class="admin-menu"
          background-color="#ffffff"
          text-color="#666666"
          active-text-color="#3b82f6"
        >
          <template v-for="menu in filteredMenus" :key="menu.path">
            <el-sub-menu v-if="menu.children" :index="menu.path">
              <template #title>
                <el-icon><component :is="menu.icon" /></el-icon>
                <span>{{ menu.title }}</span>
              </template>
              <el-menu-item 
                v-for="child in menu.children" 
                :key="child.path"
                :index="child.path"
              >
                <span>{{ child.title }}</span>
              </el-menu-item>
            </el-sub-menu>
            <el-menu-item 
              v-else
              :index="menu.path"
            >
              <el-icon><component :is="menu.icon" /></el-icon>
              <span>{{ menu.title }}</span>
            </el-menu-item>
          </template>
        </el-menu>
      </aside>

      <main class="admin-main">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessageBox, ElMessage } from 'element-plus';
import { useAdminStore } from '../stores/admin';
import { 
  Menu, HomeFilled, Refresh, FullScreen, Search, User, UserFilled,
  Monitor, Setting, Folder, Headset, Grid, Trophy, Ticket,
  List, Present, Money, ChatDotRound, ChatDotSquare, ChatLineSquare, Picture,
  Document, QuestionFilled, Star, TrendCharts, Bell
} from '@element-plus/icons-vue';

const route = useRoute();
const router = useRouter();
const adminStore = useAdminStore();
const sidebarCollapsed = ref(false);
const searchKeyword = ref('');
const activeTab = ref('dashboard');

const menuItems = [
  { path: '/dashboard', title: '控制台', icon: Monitor },
  { 
    path: '/settings', 
    title: '常规管理', 
    icon: Setting,
    children: [
      { path: '/settings/system', title: '系统配置', roles: ['super_admin'] },
      { path: '/settings/attachments', title: '附件管理', roles: ['super_admin'] }
    ]
  },
  { 
    path: '/services', 
    title: '陪聊服务', 
    icon: Headset,
    children: [
      { path: '/services', title: '服务管理', roles: ['super_admin', 'customer_service'] },
      { path: '/services/categories', title: '服务分类', roles: ['super_admin', 'customer_service'] },
      { path: '/services/levels', title: '店员等级配置', roles: ['super_admin'] }
    ]
  },
  { path: '/coupons', title: '优惠券管理', icon: Ticket, roles: ['super_admin', 'finance'] },
  { 
    path: '/marketing', 
    title: '营销管理', 
    icon: Star,
    children: [
      { path: '/marketing', title: '总览', roles: ['super_admin', 'marketing'] },
      { path: '/store', title: '店铺装修', roles: ['super_admin'] },
      { path: '/team', title: '团队管理', roles: ['super_admin'] }
    ]
  },
  { 
    path: '/orders', 
    title: '订单中心', 
    icon: List,
    children: [
      { path: '/orders', title: '订单中心', roles: ['super_admin', 'finance', 'customer_service'] }
    ]
  },
  { 
    path: '/statistics', 
    title: '数据管理', 
    icon: TrendCharts,
    children: [
      { path: '/statistics', title: '数据管理', roles: ['super_admin', 'finance'] }
    ]
  },
  { 
    path: '/store', 
    title: '商城配置', 
    icon: Present,
    children: [
      { path: '/store', title: '商城配置', roles: ['super_admin'] }
    ]
  },
  { path: '/users', title: '用户管理', icon: User, roles: ['super_admin', 'customer_service'] },
  { 
    path: '/keepers', 
    title: '店员管理', 
    icon: UserFilled,
    children: [
      { path: '/keepers', title: '店员管理', roles: ['super_admin', 'customer_service'] }
    ]
  },
  { 
    path: '/rewards', 
    title: '打赏信息', 
    icon: Present,
    children: [
      { path: '/rewards', title: '打赏信息', roles: ['super_admin', 'finance'] }
    ]
  },
  { path: '/finance', title: '财务管理', icon: Money, roles: ['super_admin', 'finance'] },
  { path: '/posts', title: '动态管理', icon: ChatDotRound, roles: ['super_admin', 'customer_service'] },
  { 
    path: '/wechat', 
    title: '微信管理', 
    icon: ChatLineSquare,
    children: [
      { path: '/wechat/auto-reply', title: '自动回复', roles: ['super_admin'] },
      { path: '/wechat/menu', title: '自定义菜单', roles: ['super_admin'] },
      { path: '/wechat/material', title: '素材管理', roles: ['super_admin'] },
      { path: '/wechat/common', title: '常用语', roles: ['super_admin', 'customer_service'] },
      { path: '/wechat/faq', title: '常见问题', roles: ['super_admin', 'customer_service'] }
    ]
  },
  { 
    path: '/message', 
    title: '消息配置', 
    icon: Bell,
    children: [
      { path: '/message', title: '消息配置', roles: ['super_admin'] }
    ]
  },
  { 
    path: '/conversations', 
    title: '会话管理', 
    icon: ChatDotRound,
    children: [
      { path: '/conversations', title: '会话管理', roles: ['super_admin', 'customer_service'] }
    ]
  }
];

const filteredMenus = computed(() => {
  if (!searchKeyword.value) return menuItems;
  const keyword = searchKeyword.value.toLowerCase();
  return menuItems.filter(menu => 
    menu.title.toLowerCase().includes(keyword) ||
    menu.children?.some(child => child.title.toLowerCase().includes(keyword))
  );
});

const activeMenu = computed(() => {
  const path = route.path;
  const found = menuItems.find(m => m.path === path || m.children?.some(c => c.path === path));
  return found?.path || path;
});

const activeTabs = computed(() => {
  return [
    { path: '/dashboard', title: '控制台' },
    { path: '/settings/system', title: '系统配置' },
    { path: '/settings/attachments', title: '附件管理' },
    { path: '/services', title: '服务管理' },
    { path: '/services/categories', title: '服务分类' }
  ];
});

function handleTabClick(path) {
  router.push(path);
}

async function handleCommand(command) {
  if (command === 'logout') {
    try {
      await ElMessageBox.confirm('确认退出登录？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      });
      
      adminStore.logout();
      ElMessage.success('已退出登录');
      router.push('/login');
    } catch (error) {
      // 取消
    }
  }
}
</script>

<style scoped>
.admin-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  height: 50px;
  background: linear-gradient(90deg, #3b82f6 0%, #60a5fa 100%);
  color: #ffffff;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.menu-btn {
  background: transparent;
  border: none;
  color: #ffffff;
}

.logo-title {
  font-size: 16px;
  font-weight: 600;
}

.header-center {
  flex: 1;
  display: flex;
  justify-content: center;
}

.header-tabs {
  background: transparent;
}

.header-tabs :deep(.el-tabs__nav) {
  border: none;
}

.header-tabs :deep(.el-tabs__item) {
  color: rgba(255, 255, 255, 0.8);
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 4px 4px 0 0;
  margin-right: 8px;
}

.header-tabs :deep(.el-tabs__item.is-active) {
  color: #ffffff;
  background: rgba(255, 255, 255, 0.25);
}

.header-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.header-btn {
  background: rgba(255, 255, 255, 0.15);
  border: none;
  color: #ffffff;
  font-size: 12px;
  padding: 6px 12px;
}

.admin-name {
  font-size: 13px;
  margin-left: 8px;
}

.el-dropdown-link {
  cursor: pointer;
  color: #ffffff;
}

.admin-body {
  display: flex;
  height: calc(100vh - 50px);
}

.admin-sidebar {
  width: 200px;
  background: #ffffff;
  border-right: 1px solid #e8e8e8;
  transition: width 0.3s;
}

.admin-sidebar.collapsed {
  width: 60px;
}

.sidebar-header {
  padding: 16px;
  border-bottom: 1px solid #e8e8e8;
}

.user-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.avatar-wrapper {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.user-name {
  font-size: 13px;
  font-weight: 500;
}

.user-status {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 10px;
}

.user-status.online {
  background: #85ce61;
  color: #ffffff;
}

.search-box {
  padding: 12px;
}

.search-box :deep(.el-input__wrapper) {
  border-radius: 4px;
  border-color: #e8e8e8;
}

.admin-menu {
  border-right: none;
}

.admin-menu :deep(.el-menu-item),
.admin-menu :deep(.el-sub-menu__title) {
  height: 44px;
  line-height: 44px;
  font-size: 13px;
}

.admin-menu :deep(.el-menu-item.is-active),
.admin-menu :deep(.el-sub-menu__title.is-active) {
  background: #eff6ff;
  color: #3b82f6;
}

.admin-main {
  flex: 1;
  background: #f5f5f5;
  overflow: auto;
  padding: 20px;
}
</style>