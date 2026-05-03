<template>
  <div class="login-page">
    <div class="login-box">
      <div class="login-header">
        <h1 class="logo">暖栖港湾</h1>
        <p class="logo-sub">管理后台</p>
      </div>
      
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        class="login-form"
      >
        <el-form-item prop="username">
          <el-input
            v-model="form.username"
            placeholder="请输入账号"
            size="large"
            :prefix-icon="User"
          />
        </el-form-item>
        
        <el-form-item prop="password">
          <el-input
            v-model="form.password"
            type="password"
            placeholder="请输入密码"
            size="large"
            :prefix-icon="Lock"
            show-password
            @keyup.enter="handleLogin"
          />
        </el-form-item>
        
        <el-button
          type="primary"
          size="large"
          class="login-btn"
          :loading="loading"
          @click="handleLogin"
        >
          登录
        </el-button>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { User, Lock } from '@element-plus/icons-vue';
import { adminLogin } from '../../api/admin';
import { useAdminStore } from '../../stores/admin';

const router = useRouter();
const adminStore = useAdminStore();
const formRef = ref();
const loading = ref(false);

const form = reactive({
  username: '',
  password: ''
});

const rules = {
  username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
};

async function handleLogin() {
  const valid = await formRef.value.validate().catch(() => false);
  if (!valid) return;
  
  loading.value = true;
  
  try {
    const res = await adminLogin(form);
    
    if (res.code === 200) {
      // 先设置 localStorage
      localStorage.setItem('adminToken', res.data.token);
      localStorage.setItem('adminInfo', JSON.stringify(res.data.admin));
      
      // 然后更新 store
      adminStore.setToken(res.data.token);
      adminStore.setAdminInfo(res.data.admin);
      
      ElMessage.success('登录成功');
      
      // 使用 replace 而不是 push，并添加一点延迟确保 store 更新完成
      setTimeout(() => {
        router.replace('/dashboard');
      }, 100);
    }
  } catch (error) {
    console.error('Login error:', error);
    // 显示错误信息
    ElMessage.error(error.response?.data?.message || '登录失败');
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  background: #FAFAFA;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-box {
  width: 400px;
  background: #FFFFFF;
  border: 1px solid #EEEEEE;
  border-radius: 2px;
  padding: 40px;
}

.login-header {
  text-align: center;
  margin-bottom: 32px;
}

.logo {
  font-size: 24px;
  font-weight: 700;
  color: #000000;
  letter-spacing: 3px;
}

.logo-sub {
  font-size: 13px;
  color: #999999;
  margin-top: 8px;
}

.login-form {
  margin-top: 24px;
}

.login-btn {
  width: 100%;
  margin-top: 8px;
}
</style>
