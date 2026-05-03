<template>
  <div class="finance-page">
    <el-row :gutter="16">
      <el-col :span="8">
        <div class="stat-card">
          <span class="stat-label">总营收</span>
          <span class="stat-value">¥{{ totalRevenue.toFixed(2) }}</span>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="stat-card">
          <span class="stat-label">待提现</span>
          <span class="stat-value">¥{{ pendingWithdraw.toFixed(2) }}</span>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="stat-card">
          <span class="stat-label">本月收入</span>
          <span class="stat-value">¥{{ monthlyRevenue.toFixed(2) }}</span>
        </div>
      </el-col>
    </el-row>
    
    <el-card shadow="never" class="table-card" style="margin-top: 16px;">
      <template #header>
        <span>财务流水</span>
      </template>
      
      <el-table :data="financeList" v-loading="loading" stripe>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="order_no" label="订单编号" />
        <el-table-column prop="transaction_id" label="微信流水号" />
        <el-table-column prop="amount" label="金额">
          <template #default="{ row }">
            ¥{{ (row.amount / 100).toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态">
          <template #default="{ row }">
            <el-tag :type="row.status === 'success' ? 'success' : 'warning'">
              {{ row.status === 'success' ? '成功' : '待处理' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="pay_time" label="支付时间" />
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const loading = ref(false);
const financeList = ref([]);
const totalRevenue = ref(0);
const pendingWithdraw = ref(0);
const monthlyRevenue = ref(0);

// 模拟数据
onMounted(() => {
  totalRevenue.value = 12580.5;
  pendingWithdraw.value = 2340;
  monthlyRevenue.value = 5680.5;
  
  financeList.value = [
    { id: 1, order_no: 'NQ202401010001', transaction_id: '4200001234567890', amount: 5000, status: 'success', pay_time: '2024-01-15 14:30:00' },
    { id: 2, order_no: 'NQ202401010002', transaction_id: '4200001234567891', amount: 3000, status: 'success', pay_time: '2024-01-15 15:00:00' },
    { id: 3, order_no: 'NQ202401010003', transaction_id: '', amount: 2000, status: 'pending', pay_time: '-' }
  ];
});
</script>

<style scoped>
.stat-card {
  background: #FFFFFF;
  border: 1px solid #EEEEEE;
  border-radius: 2px;
  padding: 20px;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: #000000;
  margin-top: 8px;
  display: block;
}

.stat-label {
  font-size: 13px;
  color: #999999;
}

.table-card {
  border: 1px solid #EEEEEE;
  border-radius: 2px;
}
</style>
