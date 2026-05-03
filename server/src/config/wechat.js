require('dotenv').config();

module.exports = {
  appId: process.env.WECHAT_APPID,
  secret: process.env.WECHAT_SECRET,
  mchId: process.env.WECHAT_MCH_ID,
  apiKey: process.env.WECHAT_API_KEY,
  notifyUrl: process.env.WECHAT_NOTIFY_URL,
  
  // 【微信H5专用】授权回调作用域
  oauthScope: {
    base: 'snsapi_base',      // 静默授权，仅获取openid
    userInfo: 'snsapi_userinfo' // 用户同意，获取昵称头像
  },
  
  // 【微信H5专用】JS-SDK接口列表
  jsApiList: [
    'checkJsApi',
    'updateAppMessageShareData',
    'updateTimelineShareData',
    'onMenuShareAppMessage',
    'onMenuShareTimeline',
    'previewImage',
    'chooseImage',
    'uploadImage',
    'getLocation',
    'scanQRCode'
  ]
};
