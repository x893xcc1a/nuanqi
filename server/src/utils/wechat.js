const axios = require('axios');
const { sha1, generateNonceStr, generateTimestamp } = require('./crypto');
const wechatConfig = require('../config/wechat');

// 获取微信access_token
async function getAccessToken() {
  const url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${wechatConfig.appId}&secret=${wechatConfig.secret}`;
  const response = await axios.get(url);
  return response.data.access_token;
}

// 获取JSAPI Ticket
async function getJsapiTicket(accessToken) {
  const url = `https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=${accessToken}&type=jsapi`;
  const response = await axios.get(url);
  return response.data.ticket;
}

// 生成JS-SDK配置
async function generateJsConfig(url) {
  const accessToken = await getAccessToken();
  const jsapiTicket = await getJsapiTicket(accessToken);
  const nonceStr = generateNonceStr();
  const timestamp = generateTimestamp();
  
  const string1 = `jsapi_ticket=${jsapiTicket}&noncestr=${nonceStr}&timestamp=${timestamp}&url=${url}`;
  const signature = sha1(string1);
  
  return {
    appId: wechatConfig.appId,
    timestamp,
    nonceStr,
    signature
  };
}

// 微信网页授权：获取openid
async function getOpenidByCode(code) {
  const url = `https://api.weixin.qq.com/sns/oauth2/access_token?appid=${wechatConfig.appId}&secret=${wechatConfig.secret}&code=${code}&grant_type=authorization_code`;
  const response = await axios.get(url);
  return response.data;
}

// 获取用户信息（需scope为snsapi_userinfo）
async function getUserInfo(accessToken, openid) {
  const url = `https://api.weixin.qq.com/sns/userinfo?access_token=${accessToken}&openid=${openid}&lang=zh_CN`;
  const response = await axios.get(url);
  return response.data;
}

// 生成微信支付签名
function generatePaySign(params, apiKey) {
  const sortedKeys = Object.keys(params).sort();
  const stringA = sortedKeys
    .filter(key => params[key] !== undefined && params[key] !== '' && key !== 'sign')
    .map(key => `${key}=${params[key]}`)
    .join('&');
  const stringSignTemp = stringA + '&key=' + apiKey;
  return crypto.createHash('md5').update(stringSignTemp).digest('hex').toUpperCase();
}

module.exports = {
  getAccessToken,
  getJsapiTicket,
  generateJsConfig,
  getOpenidByCode,
  getUserInfo,
  generatePaySign
};
