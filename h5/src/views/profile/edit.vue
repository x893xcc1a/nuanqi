<template>
  <div class="profile-edit">
    <van-nav-bar 
      title="编辑资料" 
      left-arrow 
      fixed 
      placeholder 
      :border="true"
      @click-left="goBack"
    >
      <template #right>
        <button class="save-btn" @click="handleSave">保存</button>
      </template>
    </van-nav-bar>
    
    <div class="edit-form">
      <!-- 头像 -->
      <div class="avatar-edit">
        <div class="avatar-large">
          <img :src="form.avatar_url || defaultAvatar" alt="avatar">
        </div>
        <span class="text-auxiliary" style="margin-top: 8px;">点击更换头像</span>
      </div>
      
      <div class="divider"></div>
      
      <!-- 表单 -->
      <van-cell-group :border="false">
        <van-field
          v-model="form.nickname"
          label="昵称"
          placeholder="请输入昵称"
          :border="false"
        />
        <van-field
          v-model="form.phone"
          label="手机号"
          placeholder="请输入手机号"
          type="tel"
          :border="false"
        />
      </van-cell-group>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { showToast, showLoadingToast, closeToast } from 'vant';
import { getProfile, updateProfile } from '../../api/user';
import { useUserStore } from '../../stores/user';

const router = useRouter();
const userStore = useUserStore();

const form = ref({
  nickname: '',
  avatar_url: '',
  phone: ''
});

const defaultAvatar = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80"%3E%3Crect width="80" height="80" fill="%23EEEEEE"/%3E%3Ccircle cx="40" cy="30" r="14" fill="%23999999"/%3E%3Cpath d="M16 70c0-14 10-24 24-24s24 10 24 24" fill="%23999999"/%3E%3C/svg%3E';

onMounted(async () => {
  try {
    const res = await getProfile();
    if (res.code === 200) {
      form.value = {
        nickname: res.data.nickname || '',
        avatar_url: res.data.avatar_url || '',
        phone: res.data.phone || ''
      };
    }
  } catch (error) {
    console.error('Get profile error:', error);
  }
});

async function handleSave() {
  showLoadingToast({ message: '保存中...', forbidClick: true });
  
  try {
    const res = await updateProfile(form.value);
    closeToast();
    
    if (res.code === 200) {
      userStore.setUserInfo(form.value);
      showToast('保存成功');
      setTimeout(() => {
        router.back();
      }, 500);
    }
  } catch (error) {
    closeToast();
    showToast('保存失败');
  }
}

function goBack() {
  router.back();
}
</script>

<style scoped>
.profile-edit {
  min-height: 100vh;
  background: #FFFFFF;
}

.save-btn {
  padding: 4px 14px;
  background: #000000;
  color: #FFFFFF;
  border: none;
  border-radius: 2px;
  font-size: 13px;
}

.edit-form {
  padding: 16px;
}

.avatar-edit {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px 0;
}

.avatar-large {
  width: 80px;
  height: 80px;
  border-radius: 2px;
  overflow: hidden;
}

.avatar-large img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: grayscale(100%);
}
</style>
