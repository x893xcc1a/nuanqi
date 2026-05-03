import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { getProfile } from '../api/user';

export const useUserStore = defineStore('user', () => {
  // State
  const token = ref(localStorage.getItem('token') || '');
  const refreshToken = ref(localStorage.getItem('refreshToken') || '');
  const userInfo = ref(JSON.parse(localStorage.getItem('userInfo') || '{}'));
  const currentRole = ref(localStorage.getItem('currentRole') || 'seeker');
  
  // Getters
  const isLoggedIn = computed(() => !!token.value);
  const isKeeper = computed(() => {
    return userInfo.value.role === 'keeper' || userInfo.value.role === 'both';
  });
  
  // Actions
  function setToken(newToken, newRefreshToken) {
    token.value = newToken;
    refreshToken.value = newRefreshToken;
    localStorage.setItem('token', newToken);
    localStorage.setItem('refreshToken', newRefreshToken);
  }
  
  function setUserInfo(info) {
    userInfo.value = { ...userInfo.value, ...info };
    localStorage.setItem('userInfo', JSON.stringify(userInfo.value));
  }
  
  function setCurrentRole(role) {
    currentRole.value = role;
    localStorage.setItem('currentRole', role);
  }
  
  // 【微信H5专用】检查登录状态
  async function checkLoginStatus() {
    if (!token.value) return false;
    
    try {
      const res = await getProfile();
      if (res.code === 200) {
        setUserInfo(res.data);
        return true;
      }
    } catch (error) {
      console.log('Token expired or invalid');
    }
    
    // Token失效，清除登录态
    logout();
    return false;
  }
  
  function logout() {
    token.value = '';
    refreshToken.value = '';
    userInfo.value = {};
    currentRole.value = 'seeker';
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userInfo');
    localStorage.removeItem('currentRole');
  }
  
  return {
    token,
    refreshToken,
    userInfo,
    currentRole,
    isLoggedIn,
    isKeeper,
    setToken,
    setUserInfo,
    setCurrentRole,
    checkLoginStatus,
    logout
  };
});
