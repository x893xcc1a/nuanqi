/**
 * 【微信H5专用】微信支付封装（WeixinJSBridge方式）
 * 微信公众号JSAPI支付，非小程序支付
 */

import { getJsapiConfig } from '../api/pay';

/**
 * 【微信H5专用】调起微信支付
 * @param {string} orderNo - 订单编号
 * @returns {Promise<Object>} 支付结果
 */
export async function requestPayment(orderNo) {
  try {
    // 1. 从后端获取支付配置
    const res = await getJsapiConfig(orderNo);
    
    if (res.code !== 200) {
      throw new Error(res.message || '获取支付配置失败');
    }
    
    const payConfig = res.data;
    
    // 2. 调用WeixinJSBridge支付
    return new Promise((resolve, reject) => {
      // 【防坑提示】必须在微信内置浏览器中调用
      if (typeof WeixinJSBridge === 'undefined') {
        // 监听WeixinJSBridgeReady事件
        document.addEventListener('WeixinJSBridgeReady', () => {
          callBridgePayment(payConfig, resolve, reject);
        }, false);
      } else {
        callBridgePayment(payConfig, resolve, reject);
      }
    });
  } catch (error) {
    console.error('Request payment error:', error);
    throw error;
  }
}

/**
 * 【微信H5专用】调用WeixinJSBridge支付接口
 */
function callBridgePayment(config, resolve, reject) {
  // 【防坑提示】参数名必须与微信文档一致，区分大小写
  WeixinJSBridge.invoke(
    'getBrandWCPayRequest',
    {
      appId: config.appId,
      timeStamp: config.timeStamp,
      nonceStr: config.nonceStr,
      package: config.package,
      signType: config.signType || 'RSA',
      paySign: config.paySign
    },
    (res) => {
      // 【防坑提示】res.err_msg的返回值格式：get_brand_wcpay_request:ok
      if (res.err_msg === 'get_brand_wcpay_request:ok') {
        resolve({
          success: true,
          message: '支付成功',
          result: res
        });
      } else if (res.err_msg === 'get_brand_wcpay_request:cancel') {
        resolve({
          success: false,
          cancelled: true,
          message: '用户取消支付'
        });
      } else {
        reject(new Error(res.err_desc || '支付失败'));
      }
    }
  );
}

/**
 * 【微信H5专用】查询支付状态
 * @param {string} orderNo - 订单编号
 * @param {number} maxRetries - 最大重试次数
 * @param {number} interval - 查询间隔（毫秒）
 */
export async function checkPayStatus(orderNo, maxRetries = 10, interval = 2000) {
  const { queryPayStatus } = await import('../api/pay');
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      const res = await queryPayStatus(orderNo);
      
      if (res.data?.status === 'success') {
        return { success: true, status: 'success' };
      }
      
      if (res.data?.status === 'failed') {
        return { success: false, status: 'failed', message: '支付失败' };
      }
      
      // 等待后重试
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, interval));
      }
    } catch (error) {
      console.error('Check pay status error:', error);
    }
  }
  
  return { success: false, status: 'unknown', message: '查询超时' };
}

/**
 * 【微信H5专用】完整的支付流程
 * @param {string} orderNo - 订单编号
 * @param {Function} onSuccess - 支付成功回调
 * @param {Function} onCancel - 支付取消回调
 * @param {Function} onFail - 支付失败回调
 */
export async function processPayment(orderNo, { onSuccess, onCancel, onFail }) {
  try {
    const result = await requestPayment(orderNo);
    
    if (result.success) {
      // 支付成功，查询确认
      const statusResult = await checkPayStatus(orderNo, 5, 1000);
      
      if (statusResult.success) {
        onSuccess?.(statusResult);
      } else {
        onFail?.(new Error('支付状态确认失败'));
      }
    } else if (result.cancelled) {
      onCancel?.();
    }
  } catch (error) {
    console.error('Payment process error:', error);
    onFail?.(error);
  }
}

export default {
  requestPayment,
  checkPayStatus,
  processPayment
};
