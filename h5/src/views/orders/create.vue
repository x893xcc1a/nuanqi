<template>
  <div class="order-create">
    <van-nav-bar 
      title="确认订单" 
      left-arrow 
      fixed 
      placeholder 
      :border="true"
      @click-left="goBack"
    />
    
    <div v-if="order" class="order-content">
      <!-- 订单信息 -->
      <div class="order-section">
        <div class="order-row">
          <span class="text-auxiliary">订单编号</span>
          <span class="text-primary">{{ order.order_no }}</span>
        </div>
        <div class="order-row">
          <span class="text-auxiliary">服务类型</span>
          <span class="text-primary">{{ serviceName }}</span>
        </div>
        <div class="order-row">
          <span class="text-auxiliary">服务时长</span>
          <span class="text-primary">{{ order.duration }}分钟</span>
        </div>
      </div>
      
      <div class="divider"></div>
      
      <!-- 金额明细 -->
      <div class="amount-section">
        <div class="amount-row">
          <span class="text-primary">服务费用</span>
          <span class="text-primary">¥{{ (order.amount / 100).toFixed(2) }}</span>
        </div>
        <div class="amount-row total">
          <span class="title-sm">应付金额</span>
          <span class="total-amount">¥{{ (order.amount / 100).toFixed(2) }}</span>
        </div>
      </div>
      
      <div class="divider"></div>
      
      <!-- 备注 -->
      <div class="remark-section" v-if="order.remark">
        <span class="text-auxiliary">需求备注</span>
        <p class="text-primary" style="margin-top: 8px;">{{ order.remark }}</p>
      </div>
    </div>
    
    <!-- 支付按钮 -->
    <div class="pay-action">
      <button class="btn-primary" @click="handlePay">
        微信支付
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { showToast, showLoadingToast, closeToast, showSuccessToast } from 'vant';
import { getOrderDetail } from '../../api/order';
import { requestPayment } from '../../utils/wxPay';

const route = useRoute();
const router = useRouter();
const order = ref(null);

const serviceName = computed(() => {
  const map = { text: '文字陪伴', voice: '语音通话', treehole: '树洞倾诉' };
  return map[order.value?.service_type] || '陪伴服务';
});

onMounted(async () => {
  const orderId = route.query.orderId;
  if (!orderId) {
    showToast('订单信息错误');
    router.back();
    return;
  }
  
  try {
    const res = await getOrderDetail(orderId);
    if (res.code === 200) {
      order.value = res.data;
    }
  } catch (error) {
    showToast('获取订单失败');
  }
});

async function handlePay() {
  if (!order.value) return;
  
  showLoadingToast({ message: '调起支付...', forbidClick: true });
  
  try {
    // 【微信H5专用】调用WeixinJSBridge支付
    const result = await requestPayment(order.value.order_no);
    
    closeToast();
    
    if (result.success) {
      showSuccessToast('支付成功');
      setTimeout(() => {
        router.replace('/orders');
      }, 1500);
    } else if (result.cancelled) {
      showToast('已取消支付');
    }
  } catch (error) {
    closeToast();
    showToast(error.message || '支付失败');
  }
}

function goBack() {
  router.back();
}
</script>

<style scoped>
.order-create {
  min-height: 100vh;
  background: #FAFAFA;
  padding-bottom: 80px;
}

.order-content {
  padding: 16px;
}

.order-section,
.amount-section,
.remark-section {
  background: #FFFFFF;
  padding: 16px;
  border: 0.5px solid #EEEEEE;
  border-radius: 2px;
}

.order-row,
.amount-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
}

.order-row:not(:last-child),
.amount-row:not(:last-child) {
  border-bottom: 0.5px solid #EEEEEE;
}

.amount-row.total {
  padding-top: 16px;
  margin-top: 8px;
  border-top: 1px solid #000000;
  border-bottom: none;
}

.total-amount {
  font-size: 20px;
  font-weight: 700;
  color: #000000;
}

.pay-action {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #FFFFFF;
  border-top: 0.5px solid #EEEEEE;
  padding: 12px 16px;
  padding-bottom: calc(12px + env(safe-area-inset-bottom));
}
</style>
