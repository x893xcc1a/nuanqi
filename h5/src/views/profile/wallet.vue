<template>
  <div class="wallet-page">
    <van-nav-bar 
      title="我的钱包" 
      left-arrow 
      fixed 
      placeholder 
      :border="true"
      @click-left="goBack"
    />
    
    <div class="wallet-content">
      <!-- 余额卡片 -->
      <div class="balance-card">
        <span class="text-auxiliary">账户余额</span>
        <span class="balance-amount">¥{{ balance.toFixed(2) }}</span>
        <div class="balance-actions">
          <button class="btn-outline" style="flex: 1;">充值</button>
          <button class="btn-primary" style="flex: 1; margin-left: 12px;">提现</button>
        </div>
      </div>
      
      <div class="divider"></div>
      
      <!-- 交易记录 -->
      <div class="records-section">
        <h3 class="title-sm">交易记录</h3>
        <div class="records-list">
          <div v-for="record in records" :key="record.id" class="record-item">
            <div class="record-info">
              <span class="record-title">{{ record.title }}</span>
              <span class="record-time text-auxiliary">{{ record.time }}</span>
            </div>
            <span :class="['record-amount', record.type]">
              {{ record.type === 'income' ? '+' : '-' }}¥{{ record.amount.toFixed(2) }}
            </span>
          </div>
        </div>
        
        <van-empty v-if="records.length === 0" description="暂无交易记录" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const balance = ref(0);

// 模拟数据
const records = ref([
  { id: 1, title: '订单收入', time: '2024-01-15 14:30', amount: 50, type: 'income' },
  { id: 2, title: '提现', time: '2024-01-14 10:00', amount: 100, type: 'expense' },
  { id: 3, title: '订单收入', time: '2024-01-13 16:45', amount: 30, type: 'income' }
]);

function goBack() {
  router.back();
}
</script>

<style scoped>
.wallet-page {
  min-height: 100vh;
  background: #FAFAFA;
}

.wallet-content {
  padding: 16px;
}

.balance-card {
  background: #000000;
  border-radius: 2px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.balance-card .text-auxiliary {
  color: #999999;
}

.balance-amount {
  font-size: 36px;
  font-weight: 700;
  color: #FFFFFF;
  margin: 16px 0 24px;
}

.balance-actions {
  display: flex;
  width: 100%;
}

.balance-actions .btn-outline {
  border-color: #FFFFFF;
  color: #FFFFFF;
}

.records-section {
  background: #FFFFFF;
  padding: 16px;
  border: 0.5px solid #EEEEEE;
  border-radius: 2px;
}

.record-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 0;
  border-bottom: 0.5px solid #EEEEEE;
}

.record-item:last-child {
  border-bottom: none;
}

.record-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.record-title {
  font-size: 14px;
  color: #333333;
}

.record-amount {
  font-size: 15px;
  font-weight: 600;
}

.record-amount.income {
  color: #000000;
}

.record-amount.expense {
  color: #999999;
}
</style>
