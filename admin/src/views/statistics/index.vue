<template>
  <div class="statistics">
    <div class="page-header">
      <h2>数据管理</h2>
      <div class="time-selector">
        <el-select v-model="timeRange" placeholder="选择时间范围">
          <el-option label="今日" value="today" />
          <el-option label="本周" value="week" />
          <el-option label="本月" value="month" />
          <el-option label="本季度" value="quarter" />
          <el-option label="本年" value="year" />
        </el-select>
      </div>
    </div>

    <div class="stats-grid">
      <div class="stat-card">
        <span class="stat-label">用户总数</span>
        <span class="stat-value">12,345</span>
        <span class="stat-change positive">+12.5%</span>
      </div>
      <div class="stat-card">
        <span class="stat-label">订单总数</span>
        <span class="stat-value">5,678</span>
        <span class="stat-change positive">+8.3%</span>
      </div>
      <div class="stat-card">
        <span class="stat-label">总营收</span>
        <span class="stat-value">¥123,456</span>
        <span class="stat-change positive">+15.2%</span>
      </div>
      <div class="stat-card">
        <span class="stat-label">活跃用户</span>
        <span class="stat-value">3,456</span>
        <span class="stat-change negative">-2.1%</span>
      </div>
    </div>

    <div class="charts-grid">
      <div class="chart-card">
        <h3>营收趋势</h3>
        <div class="chart-placeholder">
          <el-icon size="48" color="#ccc"><TrendingUp /></el-icon>
        </div>
      </div>
      <div class="chart-card">
        <h3>用户增长</h3>
        <div class="chart-placeholder">
          <el-icon size="48" color="#ccc"><Users /></el-icon>
        </div>
      </div>
    </div>

    <div class="content-card">
      <h3>数据详情</h3>
      <el-table :data="dataList" border style="width: 100%">
        <el-table-column prop="date" label="日期" width="120" />
        <el-table-column prop="users" label="新增用户" width="100" />
        <el-table-column prop="orders" label="订单数" width="100" />
        <el-table-column prop="revenue" label="营收" width="120" />
        <el-table-column prop="avgOrder" label="客单价" width="100" />
        <el-table-column prop="conversion" label="转化率" width="100" />
      </el-table>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { TrendingUp, Users } from '@element-plus/icons-vue';

const timeRange = ref('month');

const dataList = ref([
  { date: '2026-01-01', users: 123, orders: 45, revenue: '¥2,345', avgOrder: '¥52.11', conversion: '36.6%' },
  { date: '2026-01-02', users: 156, orders: 56, revenue: '¥3,120', avgOrder: '55.71', conversion: '36.0%' },
  { date: '2026-01-03', users: 134, orders: 48, revenue: '¥2,680', avgOrder: '¥55.83', conversion: '35.8%' },
  { date: '2026-01-04', users: 189, orders: 67, revenue: '¥3,890', avgOrder: '¥58.06', conversion: '35.5%' },
  { date: '2026-01-05', users: 212, orders: 78, revenue: '¥4,450', avgOrder: '¥57.05', conversion: '36.8%' }
]);
</script>

<style scoped>
.statistics {
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.page-header h2 {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.time-selector {
  width: 150px;
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
  flex-direction: column;
}

.stat-label {
  font-size: 13px;
  color: #999;
  margin-bottom: 8px;
}

.stat-value {
  font-size: 28px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.stat-change {
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 4px;
}

.stat-change.positive {
  background: #e8f5e9;
  color: #2e7d32;
}

.stat-change.negative {
  background: #ffebee;
  color: #c62828;
}

.charts-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 20px;
}

.chart-card {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  padding: 20px;
}

.chart-card h3 {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin: 0 0 16px 0;
}

.chart-placeholder {
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f9f9f9;
  border-radius: 8px;
}

.content-card {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  padding: 20px;
}

.content-card h3 {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin: 0 0 16px 0;
}
</style>