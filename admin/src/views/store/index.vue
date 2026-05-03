<template>
  <div class="store">
    <div class="page-header">
      <h2>店铺装修</h2>
    </div>

    <div class="content-card">
      <el-tabs v-model="activeTab" type="card">
        <el-tab-pane label="首页Banner" name="banner">
          <div class="tab-content">
            <div class="toolbar">
              <el-button type="primary" icon="Plus">添加Banner</el-button>
            </div>
            <div class="banner-list">
              <div class="banner-item" v-for="banner in bannerList" :key="banner.id">
                <div class="banner-image">
                  <img :src="banner.image" />
                </div>
                <div class="banner-info">
                  <span class="banner-name">{{ banner.name }}</span>
                  <div class="banner-actions">
                    <el-button size="small">编辑</el-button>
                    <el-button size="small" type="danger">删除</el-button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane label="首页导航" name="nav">
          <div class="tab-content">
            <div class="nav-grid">
              <div class="nav-item" v-for="nav in navList" :key="nav.id">
                <div class="nav-icon">{{ nav.icon }}</div>
                <span class="nav-name">{{ nav.name }}</span>
              </div>
            </div>
            <el-button type="primary" icon="Plus" style="margin-top: 20px;">自定义导航</el-button>
          </div>
        </el-tab-pane>

        <el-tab-pane label="店铺设置" name="settings">
          <div class="tab-content">
            <el-form :model="storeForm" label-width="120px">
              <el-form-item label="店铺名称">
                <el-input v-model="storeForm.name" />
              </el-form-item>
              <el-form-item label="店铺简介">
                <el-textarea v-model="storeForm.description" :rows="3" />
              </el-form-item>
              <el-form-item label="店铺Logo">
                <el-upload action="#" :show-file-list="false">
                  <el-button icon="Upload">上传Logo</el-button>
                </el-upload>
              </el-form-item>
              <el-form-item label="客服电话">
                <el-input v-model="storeForm.phone" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary">保存设置</el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';

const activeTab = ref('banner');

const bannerList = ref([
  { id: 1, name: '活动Banner', image: '' },
  { id: 2, name: '促销Banner', image: '' }
]);

const navList = ref([
  { id: 1, name: '首页', icon: '🏠' },
  { id: 2, name: '心动墙', icon: '💓' },
  { id: 3, name: '盲盒', icon: '🎁' },
  { id: 4, name: '动态广场', icon: '✨' },
  { id: 5, name: '我的', icon: '👤' }
]);

const storeForm = reactive({
  name: '暖栖港湾',
  description: '温暖你的心灵港湾',
  phone: '400-123-4567'
});
</script>

<style scoped>
.store {
  padding: 20px;
}

.page-header {
  margin-bottom: 20px;
}

.page-header h2 {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.content-card {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.tab-content {
  padding: 20px;
}

.toolbar {
  margin-bottom: 20px;
}

.banner-list {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.banner-item {
  width: calc(50% - 10px);
  border: 1px dashed #e8e8e8;
  border-radius: 8px;
  padding: 16px;
}

.banner-image {
  height: 120px;
  background: #f5f5f5;
  border-radius: 8px;
  margin-bottom: 12px;
}

.banner-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
}

.banner-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.banner-name {
  font-size: 14px;
  font-weight: 500;
}

.nav-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 20px;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background: #f9f9f9;
  border-radius: 12px;
}

.nav-icon {
  font-size: 32px;
  margin-bottom: 8px;
}

.nav-name {
  font-size: 13px;
  color: #666;
}
</style>