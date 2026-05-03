import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useAdminStore = defineStore('admin', () => {
  // State
  const token = ref(localStorage.getItem('adminToken') || '');
  const adminInfo = ref(JSON.parse(localStorage.getItem('adminInfo') || '{}'));
  
  // Getters
  const isLoggedIn = computed(() => !!token.value);
  const isSuperAdmin = computed(() => adminInfo.value.role === 'super_admin');
  
  // Actions
  function setToken(newToken) {
    token.value = newToken;
    localStorage.setItem('adminToken', newToken);
  }
  
  function setAdminInfo(info) {
    adminInfo.value = info;
    localStorage.setItem('adminInfo', JSON.stringify(info));
  }
  
  function logout() {
    token.value = '';
    adminInfo.value = {};
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminInfo');
  }
  
  return {
    token,
    adminInfo,
    isLoggedIn,
    isSuperAdmin,
    setToken,
    setAdminInfo,
    logout
  };
});
