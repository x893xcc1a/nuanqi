import { showToast } from 'vant';

/**
 * 统一错误处理
 */

// 错误码映射
const errorMessages = {
  400: '请求参数错误',
  401: '登录已过期，请重新登录',
  403: '没有权限访问',
  404: '请求的资源不存在',
  422: '请求参数验证失败',
  429: '请求过于频繁，请稍后再试',
  500: '服务器开小差了，请稍后再试',
  502: '网关错误',
  503: '服务不可用',
  504: '请求超时，请稍后再试'
};

// 处理API错误
export function handleApiError(error, options = {}) {
  const { showError = true, fallbackMessage = '操作失败，请重试' } = options;
  
  let message = fallbackMessage;
  
  if (error) {
    // 如果是后端返回的错误
    if (error.code) {
      message = error.message || fallbackMessage;
    }
    // 如果是响应错误
    else if (error.response) {
      const status = error.response.status;
      message = errorMessages[status] || fallbackMessage;
      
      // 401状态码，清除登录状态
      if (status === 401) {
        clearAuthData();
      }
    }
    // 如果是网络错误
    else if (error.message && error.message.includes('Network')) {
      message = '网络连接失败，请检查网络后重试';
    }
    // 其他错误
    else {
      message = error.message || fallbackMessage;
    }
  }
  
  if (showError) {
    showToast({
      message,
      position: 'bottom'
    });
  }
  
  return message;
}

// 清除登录数据
function clearAuthData() {
  try {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userInfo');
    localStorage.removeItem('currentRole');
  } catch (e) {
    console.error('Failed to clear auth data:', e);
  }
}

// 记录错误日志（可以扩展为上报到服务器）
export function logError(error, context = {}) {
  const errorInfo = {
    message: error?.message,
    stack: error?.stack,
    context,
    timestamp: new Date().toISOString(),
    url: window.location.href,
    userAgent: navigator.userAgent
  };
  
  // 控制台输出
  console.error('Application Error:', errorInfo);
  
  // 在生产环境上报到服务器
  if (import.meta.env.PROD) {
    // 可以这里调用错误上报API
    // reportToServer(errorInfo);
  }
}

export default {
  handleApiError,
  logError
};
