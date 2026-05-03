<template>
  <div class="team">
    <div class="page-header">
      <h2>团队管理</h2>
    </div>

    <div class="content-card">
      <div class="card-header">
        <el-button type="primary" icon="Plus">添加成员</el-button>
        <div class="search-box">
          <el-input placeholder="搜索成员" prefix-icon="Search" v-model="searchKeyword" />
        </div>
      </div>

      <el-table :data="teamList" border style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="avatar" label="头像" width="80">
          <template #default="scope">
            <img :src="scope.row.avatar" class="avatar" />
          </template>
        </el-table-column>
        <el-table-column prop="name" label="姓名" width="100" />
        <el-table-column prop="role" label="角色" width="120">
          <template #default="scope">
            <span class="role-tag">{{ getRoleLabel(scope.row.role) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="手机号" width="120" />
        <el-table-column prop="email" label="邮箱" width="180" />
        <el-table-column prop="status" label="状态" width="80">
          <template #default="scope">
            <span class="status-tag" :class="scope.row.status">{{ scope.row.status === 'active' ? '在职' : '离职' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="joinTime" label="入职时间" width="160" />
        <el-table-column label="操作" width="160">
          <template #default="scope">
            <el-button size="small" icon="Edit">编辑</el-button>
            <el-button size="small" icon="Lock">权限</el-button>
            <el-button size="small" icon="Trash" type="danger">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination
          :current-page="currentPage"
          :page-size="pageSize"
          :total="total"
          layout="prev, pager, next, jumper, ->, total"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const searchKeyword = ref('');
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);

const teamList = ref([
  { id: 1, avatar: '', name: '张三', role: 'admin', phone: '13800138001', email: 'zhangsan@example.com', status: 'active', joinTime: '2026-01-01' },
  { id: 2, avatar: '', name: '李四', role: 'finance', phone: '13800138002', email: 'lisi@example.com', status: 'active', joinTime: '2026-01-10' },
  { id: 3, avatar: '', name: '王五', role: 'customer_service', phone: '13800138003', email: 'wangwu@example.com', status: 'active', joinTime: '2026-01-15' }
]);

total.value = teamList.value.length;

const roleLabels = {
  admin: '管理员',
  finance: '财务',
  customer_service: '客服',
  marketing: '营销'
};

function getRoleLabel(role) {
  return roleLabels[role] || role;
}
</script>

<style scoped>
.team {
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

.search-box {
  width: 250px;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #f0f0f0;
}

.role-tag {
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 12px;
  background: #e3f2fd;
  color: #1976d2;
}

.status-tag {
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 12px;
}

.status-tag.active {
  background: #e8f5e9;
  color: #2e7d32;
}

.status-tag.inactive {
  background: #ffebee;
  color: #c62828;
}

.pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #e8e8e8;
}
</style>