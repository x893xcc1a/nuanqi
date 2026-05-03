<template>
  <div class="dashboard-page">
    <el-row :gutter="16">
      <el-col :span="6">
        <div class="stat-card">
          <span class="stat-label">今日订单</span>
          <span class="stat-value">{{ stats.todayOrders }}</span>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card">
          <span class="stat-label">待审核守护者</span>
          <span class="stat-value">{{ stats.pendingKeepers }}</span>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card">
          <span class="stat-label">今日营收</span>
          <span class="stat-value">¥{{ stats.todayRevenue }}</span>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card">
          <span class="stat-label">用户总数</span>
          <span class="stat-value">{{ stats.totalUsers }}</span>
        </div>
      </el-col>
    </el-row>

    <el-card class="chart-card" shadow="never">
      <template #header>
        <span class="card-title">近7天订单趋势</span>
      </template>
      <div ref="chartRef" class="chart"></div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import * as echarts from 'echarts';
import { getDashboard } from '../../api/admin';

const chartRef = ref(null);
let chartInstance = null;

const stats = ref({
  todayOrders: 0,
  pendingKeepers: 0,
  todayRevenue: 0,
  totalUsers: 0,
  trend: []
});

onMounted(async () => {
  chartInstance = echarts.init(chartRef.value);

  try {
    const res = await getDashboard();
    if (res.code === 200) {
      stats.value = res.data;
      updateChart(res.data.trend);
    }
  } catch (error) {
    console.error('Get dashboard error:', error);
  }
});

function updateChart(trend) {
  if (!chartInstance || !trend) return;

  const option = {
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      data: trend.map(t => t.date),
      axisLine: { lineStyle: { color: '#EEEEEE' } },
      axisLabel: { color: '#999999' }
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      splitLine: { lineStyle: { color: '#EEEEEE' } },
      axisLabel: { color: '#999999' }
    },
    series: [{
      data: trend.map(t => t.count),
      type: 'line',
      smooth: true,
      lineStyle: { color: '#000000', width: 2 },
      itemStyle: { color: '#000000' },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(0,0,0,0.1)' },
            { offset: 1, color: 'rgba(0,0,0,0)' }
          ]
        }
      }
    }]
  };

  chartInstance.setOption(option);
}

onUnmounted(() => {
  if (chartInstance) {
    chartInstance.dispose();
  }
});
</script>

<style scoped>
.dashboard-page {
  padding: 0;
}

.stat-card {
  background: #FFFFFF;
  border: 1px solid #EEEEEE;
  border-radius: 2px;
  padding: 20px;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: #000000;
  margin-top: 8px;
  display: block;
}

.stat-label {
  font-size: 13px;
  color: #999999;
}

.chart-card {
  margin-top: 16px;
  border: 1px solid #EEEEEE;
  border-radius: 2px;
}

.card-title {
  font-size: 14px;
  font-weight: 600;
  color: #333333;
}

.chart {
  height: 300px;
  width: 100%;
}
</style>
