import request from './request';

// 【微信H5专用】获取JSAPI支付配置
export function getJsapiConfig(orderNo) {
  return request.post('/pay/jsapi-config', { order_no: orderNo });
}

// 查询支付状态
export function queryPayStatus(orderNo) {
  return request.get(`/pay/query/${orderNo}`);
}
