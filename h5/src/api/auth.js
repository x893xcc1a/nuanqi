import request from './request';

// 【微信H5专用】微信登录
export function wechatLogin(code) {
  return request.post('/auth/wechat-login', { code });
}

// 【微信H5专用】获取用户信息（需用户同意授权）
export function getWechatUserInfo(code) {
  return request.post('/auth/user-info', { code });
}

// 刷新token
export function refreshToken(refreshToken) {
  return request.post('/auth/refresh-token', { refreshToken });
}

// 【微信H5专用】获取微信授权URL
export function getWechatAuthUrl(redirectUri, scope = 'snsapi_base', state = '') {
  return request.get('/auth/wechat-auth-url', {
    params: { redirectUri, scope, state }
  });
}
