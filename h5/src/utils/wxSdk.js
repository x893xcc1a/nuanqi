/**
 * 【微信H5专用】微信JS-SDK封装
 * 实现分享自定义、图片预览等功能
 */

import axios from 'axios';

/**
 * 【微信H5专用】初始化微信JS-SDK配置
 * @param {Array} jsApiList - 需要使用的JS接口列表
 */
export async function initWxConfig(jsApiList = []) {
  try {
    // 从后端获取签名配置
    const url = window.location.href.split('#')[0]; // 【防坑提示】签名URL不能包含#后的内容
    
    const res = await axios.get('/api/v1/auth/jsconfig', {
      params: { url }
    });
    
    if (res.data.code !== 200) {
      throw new Error('获取JS-SDK配置失败');
    }
    
    const config = res.data.data;
    
    return new Promise((resolve, reject) => {
      wx.config({
        debug: import.meta.env.DEV, // 开发环境开启调试
        appId: config.appId,
        timestamp: config.timestamp,
        nonceStr: config.nonceStr,
        signature: config.signature,
        jsApiList: jsApiList.length > 0 ? jsApiList : [
          'updateAppMessageShareData',
          'updateTimelineShareData',
          'previewImage'
        ]
      });
      
      wx.ready(() => {
        console.log('WeChat JS-SDK ready');
        resolve();
      });
      
      wx.error((err) => {
        console.error('WeChat JS-SDK error:', err);
        reject(err);
      });
    });
  } catch (error) {
    console.error('Init wx config error:', error);
    throw error;
  }
}

/**
 * 【微信H5专用】设置分享内容（发送给朋友）
 * @param {Object} options - 分享配置
 */
export function setShareAppMessage(options = {}) {
  const defaultOptions = {
    title: '暖栖港湾 - 一个安静的情感陪伴空间',
    desc: '在这里，有人倾听你的故事',
    link: window.location.href,
    imgUrl: `${window.location.origin}/logo.png`,
    success: () => {},
    fail: () => {}
  };
  
  const config = { ...defaultOptions, ...options };
  
  wx.updateAppMessageShareData({
    title: config.title,
    desc: config.desc,
    link: config.link,
    imgUrl: config.imgUrl,
    success: config.success,
    fail: config.fail
  });
}

/**
 * 【微信H5专用】设置分享到朋友圈
 * @param {Object} options - 分享配置
 */
export function setShareTimeline(options = {}) {
  const defaultOptions = {
    title: '暖栖港湾 - 一个安静的情感陪伴空间',
    link: window.location.href,
    imgUrl: `${window.location.origin}/logo.png`,
    success: () => {},
    fail: () => {}
  };
  
  const config = { ...defaultOptions, ...options };
  
  wx.updateTimelineShareData({
    title: config.title,
    link: config.link,
    imgUrl: config.imgUrl,
    success: config.success,
    fail: config.fail
  });
}

/**
 * 【微信H5专用】预览图片
 * @param {Array} urls - 图片URL数组
 * @param {string} current - 当前显示的图片URL
 */
export function previewImage(urls, current) {
  wx.previewImage({
    current: current || urls[0],
    urls: urls
  });
}

/**
 * 【微信H5专用】统一设置页面分享
 * @param {Object} shareData - 分享数据
 */
export function setupShare(shareData = {}) {
  setShareAppMessage(shareData);
  setShareTimeline(shareData);
}

export default {
  initWxConfig,
  setShareAppMessage,
  setShareTimeline,
  previewImage,
  setupShare
};
