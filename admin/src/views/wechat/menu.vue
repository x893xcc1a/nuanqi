<template>
  <div class="wechat-menu">
    <div class="page-header">
      <h2>自定义菜单</h2>
    </div>

    <div class="content-card">
      <div class="card-header">
        <div class="current-menu">
          <span class="label">当前菜单</span>
          <div class="menu-tags">
            <span class="tag">添加微信</span>
            <span class="tag">源码网</span>
            <span class="tag">Java产品</span>
          </div>
        </div>
        <div class="actions">
          <el-button icon="Copy" class="action-btn">复制</el-button>
          <el-button type="primary" icon="Plus" @click="showAddModal = true">添加</el-button>
        </div>
      </div>

      <div class="menu-list">
        <el-table :data="menuList" border style="width: 100%">
          <el-table-column prop="id" label="ID" width="80" />
          <el-table-column prop="name" label="名称" width="120" />
          <el-table-column prop="menuName" label="菜单名称" width="120" />
          <el-table-column prop="updateTime" label="更新时间" width="160" />
          <el-table-column prop="status" label="菜单状态" width="100">
            <template #default="scope">
              <span class="status-tag">{{ scope.row.status }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200">
            <template #default="scope">
              <el-button size="small" text type="primary">发布</el-button>
              <el-button size="small" text type="primary">编辑</el-button>
              <el-button size="small" text type="primary">复制</el-button>
              <el-button size="small" text type="danger">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <el-dialog title="添加菜单" :visible.sync="showAddModal" width="500px">
      <el-form :model="menuForm" label-width="80px">
        <el-form-item label="菜单名称" required>
          <el-input v-model="menuForm.name" placeholder="请输入菜单名称" />
        </el-form-item>
        <el-form-item label="公众号菜单">
          <div class="menu-editor">
            <div class="menu-tree">
              <p class="empty-tip">您尚未添加自定义菜单</p>
            </div>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showAddModal = false">取消</el-button>
        <el-button type="primary">确定</el-button>
        <el-button type="primary">确定&发布</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';

const showAddModal = ref(false);

const menuList = ref([
  { id: 1, name: '1111', menuName: '1111', updateTime: '2026-01-09 19:42:56', status: '未发布' }
]);

const menuForm = reactive({
  name: ''
});
</script>

<style scoped>
.wechat-menu {
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
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.current-menu {
  display: flex;
  align-items: center;
  gap: 12px;
}

.label {
  font-size: 13px;
  color: #666;
}

.menu-tags {
  display: flex;
  gap: 8px;
}

.tag {
  padding: 4px 12px;
  background: #e8f5e9;
  color: #2e7d32;
  border-radius: 4px;
  font-size: 12px;
}

.actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  background: #f5f5f5;
  border: 1px solid #d9d9d9;
}

.status-tag {
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 12px;
  background: #fff3e0;
  color: #e65100;
}

.menu-editor {
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  min-height: 200px;
}

.menu-tree {
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.empty-tip {
  color: #999;
  font-size: 13px;
}
</style>