<template>
  <div class="marketing">
    <div class="page-header">
      <h2>营销管理</h2>
    </div>

    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon users">
          <el-icon><User /></el-icon>
        </div>
        <div class="stat-info">
          <span class="stat-value">1,234</span>
          <span class="stat-label">今日新增用户</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon orders">
          <el-icon><ShoppingCart /></el-icon>
        </div>
        <div class="stat-info">
          <span class="stat-value">567</span>
          <span class="stat-label">今日订单数</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon revenue">
          <el-icon><Wallet /></el-icon>
        </div>
        <div class="stat-info">
          <span class="stat-value">¥12,345</span>
          <span class="stat-label">今日营收</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon coupons">
          <el-icon><Ticket /></el-icon>
        </div>
        <div class="stat-info">
          <span class="stat-value">89</span>
          <span class="stat-label">优惠券发放</span>
        </div>
      </div>
    </div>

    <div class="content-card">
      <div class="card-header">
        <h3>营销活动列表</h3>
        <el-button type="primary" icon="Plus">创建活动</el-button>
      </div>

      <el-table :data="activityList" border style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="活动名称" width="180" />
        <el-table-column prop="type" label="活动类型" width="120">
          <template #default="scope">
            <span class="type-tag">{{ getTypeLabel(scope.row.type) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="startTime" label="开始时间" width="160" />
        <el-table-column prop="endTime" label="结束时间" width="160" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <span class="status-tag" :class="scope.row.status">{{ getStatusLabel(scope.row.status) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="participants" label="参与人数" width="100" />
        <el-table-column prop="revenue" label="活动收益" width="120" />
        <el-table-column label="操作" width="160">
          <template #default="scope">
            <el-button size="small" icon="Edit">编辑</el-button>
            <el-button size="small" icon="BarChart">数据</el-button>
            <el-button size="small" icon="Trash" type="danger">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { User, ShoppingCart, Wallet, Ticket } from '@element-plus/icons-vue';

const activityList = ref([
  { id: 1, name: '新用户专享礼包', type: 'new_user', startTime: '2026-01-01 00:00:00', endTime: '2026-12-31 23:59:59', status: 'active', participants: 1234, revenue: '¥5,678' },
  { id: 2, name: '周末特惠活动', type: 'weekend', startTime: '2026-01-10 00:00:00', endTime: '2026-01-12 23:59:59', status: 'ended', participants: 456, revenue: '¥2,345' },
  { id: 3, name: '邀请好友奖励', type: 'invite', startTime: '2026-01-01 00:00:00', endTime: '2026-06-30 23:59:59', status: 'active', participants: 789, revenue: '¥1,234' }
]);

const typeLabels = {
  new_user: '新用户活动',
  weekend: '周末活动',
  invite: '邀请活动',
  discount: '折扣活动'
};

const statusLabels = {
  active: '进行中',
  ended: '已结束',
  pending: '待开始'
};

function getTypeLabel(type) {
  return typeLabels[type] || type;
}

function getStatusLabel(status) {
  return statusLabels[status] || status;
}
</script>

<style scoped>
.marketing {
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

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 20px;
}

.stat-card {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
}

.stat-icon {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: #fff;
}

.stat-icon.users {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.stat-icon.orders {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.stat-icon.revenue {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.stat-icon.coupons {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 24px;
  font-weight: 600;
  color: #333;
}

.stat-label {
  font-size: 13px;
  color: #999;
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

.card-header h3 {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.type-tag {
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 12px;
  background: #e8f5e9;
  color: #2e7d32;
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

.status-tag.ended {
  background: #f5f5f5;
  color: #999;
}

.status-tag.pending {
  background: #fff3e0;
  color: #e65100;
}
</style>