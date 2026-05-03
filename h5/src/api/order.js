import request from './request';

// 创建订单
export function createOrder(data) {
  return request.post('/orders', data);
}

// 获取订单列表
export function getOrders(params) {
  return request.get('/orders', { params });
}

// 获取订单详情
export function getOrderDetail(id) {
  return request.get(`/orders/${id}`);
}

// 取消订单
export function cancelOrder(id) {
  return request.post(`/orders/${id}/cancel`);
}

// 完成订单
export function completeOrder(id) {
  return request.post(`/orders/${id}/complete`);
}
