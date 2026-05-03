import request from './request';

// 发布动态
export function createPost(data) {
  return request.post('/posts', data);
}

// 获取动态列表
export function getPosts(params) {
  return request.get('/posts', { params });
}

// 获取动态详情
export function getPostDetail(id) {
  return request.get(`/posts/${id}`);
}

// 点赞
export function likePost(id) {
  return request.post(`/posts/${id}/like`);
}
