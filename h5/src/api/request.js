import axios from 'axios';
import { showToast } from 'vant';
import { handleApiError } from '../utils/errorHandler';

// 【微信H5专用】创建axios实例
const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    // 直接从localStorage读取token，不依赖Pinia
    const token = localStorage.getItem('token');
    
    // 添加token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // 【微信H5专用】添加微信环境标识
    config.headers['X-Client-Type'] = 'wechat-h5';
    
    return config;
  },
  (error) => {
    handleApiError(error, { showError: false });
    return Promise.reject(error);
  }
);

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    const { code, message } = response.data;
    
    // 业务错误处理
    if (code !== 200) {
      showToast({
        message: message || '请求失败',
        position: 'bottom'
      });
      return Promise.reject(response.data);
    }
    
    return response.data;
  },
  async (error) => {
    const { response } = error;
    
    if (response) {
      switch (response.status) {
        case 401:
          // Token过期，直接清除localStorage
          localStorage.removeItem('token');
          localStorage.removeItem('userInfo');
          
          showToast({
            message: '登录已过期，请重新登录',
            position: 'bottom'
          });
          
          // 【防坑提示】避免在请求拦截器中直接跳转路由，可能引发循环
          setTimeout(() => {
            window.location.href = '/#/auth/guide';
          }, 1500);
          break;
          
        case 403:
          showToast({
            message: '无权限访问',
            position: 'bottom'
          });
          break;
          
        case 500:
          showToast({
            message: '服务器错误，请稍后重试',
            position: 'bottom'
          });
          break;
          
        default:
          showToast({
            message: response.data?.message || '网络错误',
            position: 'bottom'
          });
      }
    } else {
      showToast({
        message: '网络连接失败',
        position: 'bottom'
      });
    }
    
    return Promise.reject(error);
  }
);

export default request;
