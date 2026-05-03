<template>
  <div v-if="hasError" class="error-boundary">
    <div class="error-content">
      <div class="error-icon">😔</div>
      <h3 class="error-title">出了一点小问题</h3>
      <p class="error-message">{{ errorMessage }}</p>
      <div class="error-actions">
        <button class="btn-secondary" @click="handleReload">重新加载</button>
        <button class="btn-primary" @click="handleGoHome">返回首页</button>
      </div>
    </div>
  </div>
  <slot v-else></slot>
</template>

<script setup>
import { ref, onErrorCaptured, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const hasError = ref(false);
const errorMessage = ref('页面加载出错了');
const router = useRouter();

const handleReload = () => {
  window.location.reload();
};

const handleGoHome = () => {
  router.push('/');
};

const logError = (err) => {
  // 发送错误日志（仅在生产环境）
  if (import.meta.env.PROD) {
    // 可以这里调用错误上报API
    console.error('Error captured:', err);
  }
};

// 捕获子组件错误
onErrorCaptured((err, instance, info) => {
  hasError.value = true;
  errorMessage.value = err.message || '页面加载出错了';
  logError(err);
  return false; // 继续向上抛出
});

// 监听全局未处理的错误
onMounted(() => {
  const handleError = (event) => {
    hasError.value = true;
    errorMessage.value = event.error?.message || '页面加载出错了';
    logError(event.error);
  };
  
  const handleUnhandledRejection = (event) => {
    hasError.value = true;
    errorMessage.value = event.reason?.message || '请求出错了';
    logError(event.reason);
  };
  
  window.addEventListener('error', handleError);
  window.addEventListener('unhandledrejection', handleUnhandledRejection);
  
  return () => {
    window.removeEventListener('error', handleError);
    window.removeEventListener('unhandledrejection', handleUnhandledRejection);
  };
});
</script>

<style scoped>
.error-boundary {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #FFFFFF;
  padding: 24px;
}

.error-content {
  text-align: center;
  max-width: 320px;
}

.error-icon {
  font-size: 64px;
  margin-bottom: 24px;
}

.error-title {
  font-size: 18px;
  font-weight: 600;
  color: #000000;
  margin-bottom: 12px;
}

.error-message {
  font-size: 14px;
  color: #666666;
  margin-bottom: 32px;
  line-height: 1.5;
}

.error-actions {
  display: flex;
  gap: 12px;
}

.error-actions button {
  flex: 1;
  padding: 12px 24px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  border: none;
  cursor: pointer;
}

.btn-secondary {
  background: #F5F5F5;
  color: #666666;
}

.btn-primary {
  background: #000000;
  color: #FFFFFF;
}
</style>
