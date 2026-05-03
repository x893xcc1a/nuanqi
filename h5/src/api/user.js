import request from './request';

// 获取个人信息
export function getProfile() {
  return request.get('/user/profile');
}

// 更新个人信息
export function updateProfile(data) {
  return request.put('/user/profile', data);
}

// 申请成为守护者
export function applyKeeper(data) {
  return request.post('/user/apply-keeper', data);
}

// 切换角色
export function switchRole(role) {
  return request.post('/user/switch-role', { role });
}

// 获取守护者列表
export function getKeepers(params) {
  return request.get('/user/keepers', { params });
}

// 获取守护者详情
export function getKeeperDetail(id) {
  return request.get(`/user/keepers/${id}`);
}
