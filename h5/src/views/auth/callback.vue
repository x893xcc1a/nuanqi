<template>
  <div class="auth-callback">
    <div class="loading-content">
      <van-loading type="spinner" color="#999999" />
      <p class="text-auxiliary" style="margin-top: 16px;">登录中...</p>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { showToast } from 'vant';
import { handleAuthCallback, getAuthRedirectTarget } from '../../utils/wechatAuth';

const route = useRoute();
const router = useRouter();

onMounted(async () => {
  try {
    // 【微信H5专用】从URL参数获取code和state
    const { code, state } = route.query;
    
    if (!code) {
      showToast({ message: '授权失败，请重试', position: 'middle' });
      router.replace('/auth/guide');
      return;
    }
    
    // 处理授权回调
    const result = await handleAuthCallback(code, state);
    
    if (result.success) {
      showToast({ message: '登录成功', position: 'middle' });
      
      // 获取授权前应跳转的页面
      const target = getAuthRedirectTarget();
      
      // 如果是新用户，引导完善信息
      if (result.isNewUser) {
        router.replace('/profile/edit');
      } else {
        router.replace(target);
      }
    }
  } catch (error) {
    console.error('Auth callback error:', error);
    showToast({ 
      message: error.message || '登录失败', 
      position: 'middle' 
    });
    router.replace('/auth/guide');
  }
});
</script>

<style scoped>
.auth-callback {
  min-height: 100vh;
  background: #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: center;
}

.loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
