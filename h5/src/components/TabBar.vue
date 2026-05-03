<template>
  <van-tabbar v-model="active" class="tab-bar" :border="true">
    <van-tabbar-item to="/home">
      <template #icon="props">
        <div class="tab-icon">
          <svg v-if="props.active" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FF6B9D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
          <svg v-else width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#999999" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </div>
      </template>
      <span :class="active === 0 ? 'active-text' : ''">心动墙</span>
    </van-tabbar-item>
    
    <van-tabbar-item to="/blind-box">
      <template #icon="props">
        <div class="tab-icon">
          <svg v-if="props.active" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FF6B9D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            <path d="m9.7 17 2.3-2.3"></path>
            <path d="m14.3 17-2.3-2.3"></path>
            <path d="M12 7v5"></path>
          </svg>
          <svg v-else width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#999999" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            <path d="m9.7 17 2.3-2.3"></path>
            <path d="m14.3 17-2.3-2.3"></path>
            <path d="M12 7v5"></path>
          </svg>
        </div>
      </template>
      <span :class="active === 1 ? 'active-text' : ''">盲盒</span>
    </van-tabbar-item>
    
    <van-tabbar-item to="/keepers">
      <template #icon="props">
        <div class="tab-icon">
          <svg v-if="props.active" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FF6B9D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"></path>
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
            <path d="M9 21v-3a3 3 0 0 1 6 0v3"></path>
          </svg>
          <svg v-else width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#999999" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"></path>
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
            <path d="M9 21v-3a3 3 0 0 1 6 0v3"></path>
          </svg>
        </div>
      </template>
      <span :class="active === 2 ? 'active-text' : ''">选人下单</span>
    </van-tabbar-item>
    
    <van-tabbar-item to="/square">
      <template #icon="props">
        <div class="tab-icon">
          <svg v-if="props.active" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FF6B9D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <circle cx="12" cy="12" r="4"></circle>
            <circle cx="16.5" cy="7.5" r="1.5"></circle>
            <path d="M6 9h1"></path>
            <path d="M6 15h1"></path>
            <path d="M18 9h-1"></path>
            <path d="M18 15h-1"></path>
          </svg>
          <svg v-else width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#999999" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <circle cx="12" cy="12" r="4"></circle>
            <circle cx="16.5" cy="7.5" r="1.5"></circle>
            <path d="M6 9h1"></path>
            <path d="M6 15h1"></path>
            <path d="M18 9h-1"></path>
            <path d="M18 15h-1"></path>
          </svg>
        </div>
      </template>
      <span :class="active === 3 ? 'active-text' : ''">动态广场</span>
    </van-tabbar-item>
    
    <van-tabbar-item to="/profile">
      <template #icon="props">
        <div class="tab-icon">
          <svg v-if="props.active" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FF6B9D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
          <svg v-else width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#999999" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </div>
      </template>
      <span :class="active === 4 ? 'active-text' : ''">个人中心</span>
    </van-tabbar-item>
  </van-tabbar>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const active = ref(0);

const routeMap = {
  '/home': 0,
  '/blind-box': 1,
  '/keepers': 2,
  '/square': 3,
  '/profile': 4
};

watch(() => route.path, (path) => {
  const basePath = path.split('/')[1] ? '/' + path.split('/')[1] : '/home';
  const index = routeMap[basePath];
  if (index !== undefined) {
    active.value = index;
  }
}, { immediate: true });
</script>

<style scoped>
.tab-bar {
  --van-tabbar-height: 55px;
  --van-tabbar-background-color: #ffffff;
  border-top: 0.5px solid #EEEEEE;
  padding-bottom: env(safe-area-inset-bottom);
}

.van-tabbar-item {
  font-size: 10px;
}

.active-text {
  color: #FF6B9D;
  font-weight: 500;
}

.tab-icon {
  margin-bottom: 2px;
}
</style>
