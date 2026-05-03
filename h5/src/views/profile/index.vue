<template>
  <div class="profile-page">
    <van-nav-bar title="我的港湾" fixed placeholder :border="true" />
    
    <!-- 用户信息 -->
    <div class="user-section">
      <div class="user-avatar" @click="goToEdit">
        <img :src="userStore.userInfo?.avatar_url || defaultAvatar" alt="avatar">
      </div>
      <div class="user-info">
        <h2 class="title-md">{{ userStore.userInfo?.nickname || '未设置昵称' }}</h2>
        <span class="text-auxiliary">{{ roleText }}</span>
      </div>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" @click="goToEdit">
        <path d="M6 3L11 8L6 13" stroke="#999" stroke-width="1.5"/>
      </svg>
    </div>
    
    <div class="divider"></div>
    
    <!-- 角色切换 -->
    <div v-if="userStore.isKeeper" class="role-switch">
      <div class="option-label">
        <span class="text-primary">当前视角</span>
      </div>
      <div class="role-options">
        <span 
          :class="['role-option', { active: userStore.currentRole === 'seeker' }]"
          @click="switchRole('seeker')"
        >
          访客
        </span>
        <span 
          :class="['role-option', { active: userStore.currentRole === 'keeper' }]"
          @click="switchRole('keeper')"
        >
          守护者
        </span>
      </div>
    </div>
    
    <!-- 功能菜单 -->
    <div class="menu-section">
      <div class="menu-group">
        <div class="menu-item" @click="goToWallet">
          <div class="menu-icon">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <rect x="2" y="5" width="16" height="12" rx="1" stroke="#000" stroke-width="1.5"/>
              <circle cx="14" cy="11" r="2" stroke="#000" stroke-width="1.5"/>
            </svg>
          </div>
          <span class="menu-text">我的钱包</span>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M6 3L11 8L6 13" stroke="#999" stroke-width="1.5"/>
          </svg>
        </div>
        
        <div class="menu-item" @click="goToOrders">
          <div class="menu-icon">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <rect x="3" y="3" width="14" height="14" rx="1" stroke="#000" stroke-width="1.5"/>
              <path d="M7 8H13M7 12H11" stroke="#000" stroke-width="1.5"/>
            </svg>
          </div>
          <span class="menu-text">我的订单</span>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M6 3L11 8L6 13" stroke="#999" stroke-width="1.5"/>
          </svg>
        </div>
        
        <div class="menu-item" @click="goToApplyKeeper" v-if="!userStore.isKeeper">
          <div class="menu-icon">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10 4V16M4 10H16" stroke="#000" stroke-width="1.5"/>
            </svg>
          </div>
          <span class="menu-text">申请成为守护者</span>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M6 3L11 8L6 13" stroke="#999" stroke-width="1.5"/>
          </svg>
        </div>
      </div>
      
      <div class="divider"></div>
      
      <div class="menu-group">
        <div class="menu-item" @click="clearCache">
          <div class="menu-icon">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M4 6H16M7 6V4C7 3 8 2 10 2C12 2 13 3 13 4V6M6 6L7 17C7 18 8 18 10 18C12 18 13 18 13 17L14 6" stroke="#000" stroke-width="1.5"/>
            </svg>
          </div>
          <span class="menu-text">清除缓存</span>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M6 3L11 8L6 13" stroke="#999" stroke-width="1.5"/>
          </svg>
        </div>
        
        <div class="menu-item" @click="contactService">
          <div class="menu-icon">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M3 10C3 6 6 3 10 3C14 3 17 6 17 10C17 14 14 17 10 17" stroke="#000" stroke-width="1.5"/>
              <path d="M3 17L3 13L7 13" stroke="#000" stroke-width="1.5"/>
            </svg>
          </div>
          <span class="menu-text">联系客服</span>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M6 3L11 8L6 13" stroke="#999" stroke-width="1.5"/>
          </svg>
        </div>
      </div>
      
      <div class="divider"></div>
      
      <div class="menu-group">
        <div class="menu-item logout" @click="handleLogout">
          <span class="menu-text" style="color: #999999;">退出登录</span>
        </div>
      </div>
    </div>
    
    <TabBar />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { showToast, showConfirmDialog } from 'vant';
import TabBar from '../../components/TabBar.vue';
import { useUserStore } from '../../stores/user';
import { switchRole } from '../../api/user';

const router = useRouter();
const userStore = useUserStore();

const roleText = computed(() => {
  const map = { seeker: '访客', keeper: '守护者', both: '访客/守护者' };
  return map[userStore.userInfo?.role] || '访客';
});

const defaultAvatar = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 60 60"%3E%3Crect width="60" height="60" fill="%23EEEEEE"/%3E%3Ccircle cx="30" cy="22" r="10" fill="%23999999"/%3E%3Cpath d="M12 52c0-10 8-18 18-18s18 8 18 18" fill="%23999999"/%3E%3C/svg%3E';

async function switchRoleHandler(role) {
  try {
    const res = await switchRole(role);
    if (res.code === 200) {
      userStore.setCurrentRole(role);
      showToast('切换成功');
    }
  } catch (error) {
    showToast('切换失败');
  }
}

function goToEdit() {
  router.push('/profile/edit');
}

function goToWallet() {
  router.push('/profile/wallet');
}

function goToOrders() {
  router.push('/orders');
}

function goToApplyKeeper() {
  router.push('/profile/apply-keeper');
}

function clearCache() {
  // 清除本地缓存（保留登录态）
  const token = localStorage.getItem('token');
  localStorage.clear();
  if (token) localStorage.setItem('token', token);
  showToast('缓存已清除');
}

function contactService() {
  // 【微信H5专用】打开微信客服会话
  if (typeof wx !== 'undefined') {
    wx.openCustomerServiceChat({
      extInfo: { url: '' },
      corpId: '',
      success: () => {},
      fail: () => {
        showToast('请通过微信联系客服');
      }
    });
  } else {
    showToast('请通过微信联系客服');
  }
}

async function handleLogout() {
  try {
    await showConfirmDialog({
      title: '确认退出',
      message: '退出后需要重新登录',
      confirmButtonText: '退出',
      cancelButtonText: '取消'
    });
    
    userStore.logout();
    showToast('已退出登录');
    router.replace('/auth/guide');
  } catch (error) {
    // 取消
  }
}
</script>

<style scoped>
.profile-page {
  min-height: 100vh;
  background: #FAFAFA;
  padding-bottom: 60px;
}

.user-section {
  display: flex;
  align-items: center;
  padding: 24px 16px;
  background: #FFFFFF;
  gap: 16px;
}

.user-avatar {
  width: 60px;
  height: 60px;
  border-radius: 2px;
  overflow: hidden;
  flex-shrink: 0;
}

.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: grayscale(100%);
}

.user-info {
  flex: 1;
}

.role-switch {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 16px;
  background: #FFFFFF;
}

.role-options {
  display: flex;
  gap: 8px;
}

.role-option {
  padding: 4px 12px;
  border: 0.5px solid #EEEEEE;
  border-radius: 2px;
  font-size: 12px;
  color: #666666;
}

.role-option.active {
  background: #000000;
  color: #FFFFFF;
  border-color: #000000;
}

.menu-section {
  background: #FFFFFF;
}

.menu-group {
  padding: 0 16px;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 14px 0;
  border-bottom: 0.5px solid #EEEEEE;
}

.menu-item:last-child {
  border-bottom: none;
}

.menu-icon {
  margin-right: 12px;
  display: flex;
  align-items: center;
}

.menu-text {
  flex: 1;
  font-size: 14px;
  color: #333333;
}

.menu-item.logout {
  justify-content: center;
}

.menu-item.logout .menu-text {
  text-align: center;
}
</style>
