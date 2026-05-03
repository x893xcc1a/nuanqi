const crypto = require('crypto');
const CryptoJS = require('crypto-js');

// AES加密（用于敏感信息如身份证号）
const AES_KEY = process.env.AES_SECRET || 'your-aes-secret-key-32chars!!';

function encryptAES(text) {
  return CryptoJS.AES.encrypt(text, AES_KEY).toString();
}

function decryptAES(ciphertext) {
  const bytes = CryptoJS.AES.decrypt(ciphertext, AES_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
}

// MD5（用于微信签名）
function md5(str) {
  return crypto.createHash('md5').update(str).digest('hex');
}

// SHA1（用于微信JS-SDK签名）
function sha1(str) {
  return crypto.createHash('sha1').update(str).digest('hex');
}

// 生成随机字符串
function generateNonceStr(length = 32) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let str = '';
  for (let i = 0; i < length; i++) {
    str += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return str;
}

// 生成时间戳
function generateTimestamp() {
  return Math.floor(Date.now() / 1000).toString();
}

module.exports = {
  encryptAES,
  decryptAES,
  md5,
  sha1,
  generateNonceStr,
  generateTimestamp
};
