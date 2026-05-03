<template>
  <div class="auth-guide">
    <div class="guide-content">
      <div class="logo">
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
          <rect width="64" height="64" rx="2" fill="#000"/>
          <path d="M20 32C20 25.373 25.373 20 32 20V20C38.627 20 44 25.373 44 32V44H20V32Z" stroke="#fff" stroke-width="1.5"/>
          <circle cx="32" cy="30" r="4" stroke="#fff" stroke-width="1.5"/>
        </svg>
      </div>
      <h1 class="title-lg">暖栖港湾</h1>
      <p class="text-primary" style="margin-top: 12px; text-align: center;">
        一个安静的情感陪伴空间
      </p>
      
      <div class="features">
        <div class="feature-item">
          <span class="dot">·</span>
          <span class="text-auxiliary">寻找倾听你的守护者</span>
        </div>
        <div class="feature-item">
          <span class="dot">·</span>
          <span class="text-auxiliary">在心灵广场匿名倾诉</span>
        </div>
        <div class="feature-item">
          <span class="dot">·</span>
          <span class="text-auxiliary">获得温暖的情感支持</span>
        </div>
      </div>
    </div>
    
    <div class="action-area">
      <button class="btn-primary" @click="handleLogin">
        微信一键登录
      </button>
      <p class="text-auxiliary" style="margin-top: 12px; text-align: center; font-size: 11px;">
        登录即表示同意《用户协议》和《隐私政策》
      </p>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { showToast } from 'vant';
import { guideToAuth, isWechatBrowser } from '../../utils/wechatAuth';
import { useUserStore } from '../../stores/user';

const router = useRouter();
const userStore = useUserStore();

onMounted(() => {
  // 如果已登录，跳转到首页
  if (userStore.isLoggedIn) {
    router.replace('/home');
  }
});

function handleLogin() {
  // 【微信H5专用】检查是否在微信环境
  if (!isWechatBrowser()) {
    showToast({
      message: '请在微信中打开',
      position: 'middle'
    });
    return;
  }
  
  // 跳转到微信授权
  guideToAuth('/home', false);
}
</script>

<style scoped>
.auth-guide {
  min-height: 100vh;
  background: #FFFFFF;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 80px 24px 40px;
}

.guide-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.logo {
  margin-bottom: 24px;
}

.features {
  margin-top: 48px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.dot {
  color: #999999;
  font-size: 20px;
  line-height: 1;
}

.action-area {
  padding-bottom: env(safe-area-inset-bottom);
}
</style>
