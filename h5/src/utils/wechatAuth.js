/**
 * 【微信H5专用】微信网页授权封装
 * 完整实现OAuth2.0授权流程，带state校验防止CSRF攻击
 */

import { wechatLogin } from '../api/auth';
import { useUserStore } from '../stores/user';

const WECHAT_APPID = import.meta.env.VITE_WECHAT_APPID || '';

/**
 * 生成随机state字符串
 */
function generateState() {
  const state = 'st_' + Math.random().toString(36).substr(2, 15);
  sessionStorage.setItem('wx_auth_state', state);
  return state;
}

/**
 * 校验state是否合法
 */
function verifyState(state) {
  const savedState = sessionStorage.getItem('wx_auth_state');
  sessionStorage.removeItem('wx_auth_state');
  return savedState && savedState === state;
}

/**
 * 【微信H5专用】构建微信授权URL
 * @param {string} redirectUri - 授权后回调地址
 * @param {string} scope - 授权作用域：snsapi_base（静默）/ snsapi_userinfo（需同意）
 * @returns {string} 授权URL
 */
export function buildAuthUrl(redirectUri, scope = 'snsapi_base') {
  const state = generateState();
  
  // 【防坑提示】redirectUri必须是通过ICP备案的域名，且与公众号配置一致
  const encodedUri = encodeURIComponent(redirectUri);
  
  return `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${WECHAT_APPID}&redirect_uri=${encodedUri}&response_type=code&scope=${scope}&state=${state}#wechat_redirect`;
}

/**
 * 【微信H5专用】处理授权回调
 * @param {string} code - 微信返回的授权码
 * @param {string} state - 微信返回的state
 * @returns {Promise<Object>} 登录结果
 */
export async function handleAuthCallback(code, state) {
  // 【防坑提示】务必校验state，防止CSRF攻击
  if (!verifyState(state)) {
    throw new Error('State校验失败，可能存在安全风险');
  }
  
  if (!code) {
    throw new Error('未获取到授权码');
  }
  
  try {
    const res = await wechatLogin(code);
    
    if (res.code === 200) {
      const { token, refreshToken, user } = res.data;
      const userStore = useUserStore();
      
      userStore.setToken(token, refreshToken);
      userStore.setUserInfo(user);
      
      return {
        success: true,
        isNewUser: user.isNewUser,
        user
      };
    }
    
    throw new Error(res.message || '登录失败');
  } catch (error) {
    console.error('Auth callback error:', error);
    throw error;
  }
}

/**
 * 【微信H5专用】检查是否在微信公众号环境
 */
export function isWechatBrowser() {
  const ua = navigator.userAgent.toLowerCase();
  return ua.includes('micromessenger');
}

/**
 * 【微信H5专用】引导用户授权
 * @param {string} targetUrl - 授权成功后跳转的目标页面
 * @param {boolean} needUserInfo - 是否需要用户信息（昵称、头像）
 */
export function guideToAuth(targetUrl = window.location.href, needUserInfo = false) {
  if (!isWechatBrowser()) {
    // 非微信环境，提示用户
    console.warn('请在微信中打开');
    return;
  }
  
  // 【防坑提示】回调地址必须是当前页面或专门的回调页
  const redirectUri = `${window.location.origin}${window.location.pathname}#/auth/callback`;
  const scope = needUserInfo ? 'snsapi_userinfo' : 'snsapi_base';
  
  // 保存目标页面，授权后跳转
  sessionStorage.setItem('auth_redirect_target', targetUrl);
  
  const authUrl = buildAuthUrl(redirectUri, scope);
  window.location.href = authUrl;
}

/**
 * 【微信H5专用】静默授权获取openid（不弹框）
 */
export function silentAuth() {
  return guideToAuth(window.location.href, false);
}

/**
 * 获取授权后应跳转的目标页面
 */
export function getAuthRedirectTarget() {
  const target = sessionStorage.getItem('auth_redirect_target');
  sessionStorage.removeItem('auth_redirect_target');
  return target || '/home';
}

export default {
  buildAuthUrl,
  handleAuthCallback,
  isWechatBrowser,
  guideToAuth,
  silentAuth,
  getAuthRedirectTarget
};
