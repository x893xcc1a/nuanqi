<template>
  <div class="material">
    <div class="page-header">
      <h2>素材管理</h2>
      <p class="tips">素材管理中图文消息、图片、视频、音频，需要在公众号平台进行上传。<a href="#" class="link">微信公众号管理</a></p>
    </div>

    <div class="content-card">
      <el-tabs v-model="activeTab" type="card">
        <el-tab-pane label="图文消息" name="news">
          <div class="tab-content">
            <div class="empty-state">
              <el-icon size="48" color="#ccc"><FileText /></el-icon>
              <p>暂无图文消息</p>
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane label="图片" name="image">
          <div class="tab-content">
            <div class="empty-state">
              <el-icon size="48" color="#ccc"><Image /></el-icon>
              <p>暂无图片</p>
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane label="视频" name="video">
          <div class="tab-content">
            <div class="empty-state">
              <el-icon size="48" color="#ccc"><Video /></el-icon>
              <p>暂无视频</p>
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane label="语音" name="voice">
          <div class="tab-content">
            <div class="empty-state">
              <el-icon size="48" color="#ccc"><Headphones /></el-icon>
              <p>暂无语音</p>
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane label="文本" name="text">
          <div class="tab-content">
            <div class="empty-state">
              <el-icon size="48" color="#ccc"><FileText /></el-icon>
              <p>暂无文本</p>
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane label="链接" name="link">
          <div class="tab-content">
            <div class="empty-state">
              <el-icon size="48" color="#ccc"><Link /></el-icon>
              <p>暂无链接</p>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { FileText, Image, Video, Headphones, Link } from '@element-plus/icons-vue';

const activeTab = ref('news');
</script>

<style scoped>
.material {
  padding: 20px;
}

.page-header {
  margin-bottom: 20px;
}

.page-header h2 {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0 0 8px 0;
}

.tips {
  font-size: 13px;
  color: #999;
  background: #fff8e1;
  padding: 10px 15px;
  border-radius: 4px;
  margin: 0;
}

.link {
  color: #3b82f6;
  text-decoration: none;
}

.content-card {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.tab-content {
  padding: 40px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 0;
  color: #999;
}

.empty-state p {
  margin-top: 16px;
  font-size: 14px;
}
</style>