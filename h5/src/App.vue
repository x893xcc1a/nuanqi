<template>
  <ErrorBoundary>
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </ErrorBoundary>
</template>

<script setup>
import { onMounted } from 'vue';
import { useUserStore } from './stores/user';
import ErrorBoundary from './components/ErrorBoundary.vue';

const userStore = useUserStore();

onMounted(() => {
  // 【微信H5专用】初始化时检查登录状态
  userStore.checkLoginStatus();
});
</script>

<style>
/* 页面切换动画 - 极简淡入100ms */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 100ms ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
