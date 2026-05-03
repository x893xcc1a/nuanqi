import request from './request';

// 管理员登录
export function adminLogin(data) {
  return request.post('/admin/login', data);
}

// 仪表盘统计
export function getDashboard() {
  return request.get('/admin/dashboard');
}

// 用户列表
export function getUsers(params) {
  return request.get('/admin/users', { params });
}

// 更新用户状态
export function updateUserStatus(id, status) {
  return request.put(`/admin/users/${id}/status`, { status });
}

// 守护者申请列表
export function getKeeperApplications(params) {
  return request.get('/admin/keepers', { params });
}

// 审核守护者
export function reviewKeeper(id, data) {
  return request.put(`/admin/keepers/${id}/review`, data);
}

// 订单列表
export function getAdminOrders(params) {
  return request.get('/admin/orders', { params });
}

// 动态列表
export function getAdminPosts(params) {
  return request.get('/admin/posts', { params });
}

// 审核动态
export function reviewPost(id, data) {
  return request.put(`/admin/posts/${id}/review`, data);
}

// ================= 服务管理 =================
export function getServices(params) {
  return request.get('/admin/services', { params });
}

export function createService(data) {
  return request.post('/admin/services', data);
}

export function updateService(id, data) {
  return request.put(`/admin/services/${id}`, data);
}

export function deleteService(id) {
  return request.delete(`/admin/services/${id}`);
}

// ================= 服务分类 =================
export function getServiceCategories(params) {
  return request.get('/admin/service-categories', { params });
}

export function createServiceCategory(data) {
  return request.post('/admin/service-categories', data);
}

export function updateServiceCategory(id, data) {
  return request.put(`/admin/service-categories/${id}`, data);
}

export function deleteServiceCategory(id) {
  return request.delete(`/admin/service-categories/${id}`);
}

// ================= 守护者等级 =================
export function getKeeperLevels(params) {
  return request.get('/admin/keeper-levels', { params });
}

export function createKeeperLevel(data) {
  return request.post('/admin/keeper-levels', data);
}

export function updateKeeperLevel(id, data) {
  return request.put(`/admin/keeper-levels/${id}`, data);
}

export function deleteKeeperLevel(id) {
  return request.delete(`/admin/keeper-levels/${id}`);
}

// ================= 优惠券 =================
export function getCoupons(params) {
  return request.get('/admin/coupons', { params });
}

export function createCoupon(data) {
  return request.post('/admin/coupons', data);
}

export function updateCoupon(id, data) {
  return request.put(`/admin/coupons/${id}`, data);
}

export function deleteCoupon(id) {
  return request.delete(`/admin/coupons/${id}`);
}

// ================= 会话管理 =================
export function getConversations(params) {
  return request.get('/admin/conversations', { params });
}

export function deleteConversation(id) {
  return request.delete(`/admin/conversations/${id}`);
}

// ================= 微信自动回复 =================
export function getAutoReplies(params) {
  return request.get('/admin/auto-replies', { params });
}

export function createAutoReply(data) {
  return request.post('/admin/auto-replies', data);
}

export function updateAutoReply(id, data) {
  return request.put(`/admin/auto-replies/${id}`, data);
}

export function deleteAutoReply(id) {
  return request.delete(`/admin/auto-replies/${id}`);
}

// ================= 微信自定义菜单 =================
export function getWechatMenu() {
  return request.get('/admin/wechat-menu');
}

export function saveWechatMenu(data) {
  return request.post('/admin/wechat-menu', data);
}

// ================= 常用语 =================
export function getCommonWords(params) {
  return request.get('/admin/common-words', { params });
}

export function createCommonWord(data) {
  return request.post('/admin/common-words', data);
}

export function updateCommonWord(id, data) {
  return request.put(`/admin/common-words/${id}`, data);
}

export function deleteCommonWord(id) {
  return request.delete(`/admin/common-words/${id}`);
}

// ================= FAQ =================
export function getFAQ(params) {
  return request.get('/admin/faq', { params });
}

export function createFAQ(data) {
  return request.post('/admin/faq', data);
}

export function updateFAQ(id, data) {
  return request.put(`/admin/faq/${id}`, data);
}

export function deleteFAQ(id) {
  return request.delete(`/admin/faq/${id}`);
}

// ================= 团队管理 =================
export function getTeam(params) {
  return request.get('/admin/team', { params });
}

export function createTeamMember(data) {
  return request.post('/admin/team', data);
}

export function updateTeamMember(id, data) {
  return request.put(`/admin/team/${id}`, data);
}

export function deleteTeamMember(id) {
  return request.delete(`/admin/team/${id}`);
}

// ================= 统计数据 =================
export function getStatistics(params) {
  return request.get('/admin/statistics', { params });
}

// ================= 系统设置 =================
export function getSystemSettings() {
  return request.get('/admin/system-settings');
}

export function saveSystemSettings(data) {
  return request.post('/admin/system-settings', data);
}
