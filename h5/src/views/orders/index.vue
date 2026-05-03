<template>
  <div class="orders-page">
    <van-nav-bar title="我的订单" fixed placeholder :border="true" />
    
    <!-- 状态筛选 -->
    <div class="status-tabs">
      <div 
        v-for="tab in tabs" 
        :key="tab.value"
        :class="['status-tab', { active: activeTab === tab.value }]"
        @click="switchTab(tab.value)"
      >
        {{ tab.label }}
      </div>
    </div>
    
    <!-- 订单列表 -->
    <div class="orders-list">
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <van-list
          v-model:loading="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="onLoad"
        >
          <div 
            v-for="order in orders" 
            :key="order.id"
            class="order-card"
          >
            <div class="order-header">
              <span class="text-auxiliary">{{ order.order_no }}</span>
              <span :class="['status-badge', order.status]">{{ statusText[order.status] }}</span>
            </div>
            
            <div class="order-body">
              <div class="order-info">
                <span class="text-primary">{{ serviceTypeMap[order.service_type] }}</span>
                <span class="text-auxiliary">{{ order.duration }}分钟</span>
              </div>
              <div class="order-user">
                <span class="text-auxiliary">
                  {{ role === 'seeker' ? '守护者' : '访客' }}：
                </span>
                <span class="text-primary">
                  {{ role === 'seeker' ? order.keeper?.nickname : order.seeker?.nickname }}
                </span>
              </div>
            </div>
            
            <div class="order-footer">
              <span class="order-amount">¥{{ (order.amount / 100).toFixed(2) }}</span>
              <div class="order-actions">
                <button 
                  v-if="order.status === 'unpaid' && role === 'seeker'"
                  class="btn-pay"
                  @click="payOrder(order)"
                >
                  去支付
                </button>
                <button 
                  v-if="order.status === 'unpaid' && role === 'seeker'"
                  class="btn-cancel"
                  @click="cancelOrderHandler(order.id)"
                >
                  取消
                </button>
                <button 
                  v-if="order.status === 'serving' && role === 'keeper'"
                  class="btn-pay"
                  @click="completeOrderHandler(order.id)"
                >
                  完成服务
                </button>
              </div>
            </div>
          </div>
        </van-list>
      </van-pull-refresh>
    </div>
    
    <TabBar />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { showToast, showLoadingToast, closeToast, showConfirmDialog } from 'vant';
import TabBar from '../../components/TabBar.vue';
import { getOrders, cancelOrder, completeOrder } from '../../api/order';
import { useUserStore } from '../../stores/user';

const router = useRouter();
const userStore = useUserStore();
const orders = ref([]);
const loading = ref(false);
const finished = ref(false);
const refreshing = ref(false);
const page = ref(1);
const activeTab = ref('');
const role = ref(userStore.currentRole || 'seeker');

const tabs = [
  { label: '全部', value: '' },
  { label: '待支付', value: 'unpaid' },
  { label: '进行中', value: 'serving' },
  { label: '已完成', value: 'completed' }
];

const statusText = {
  unpaid: '待支付',
  paid: '已支付',
  serving: '进行中',
  completed: '已完成',
  cancelled: '已取消',
  refunding: '退款中',
  refunded: '已退款'
};

const serviceTypeMap = {
  text: '文字陪伴',
  voice: '语音通话',
  treehole: '树洞倾诉'
};

async function onLoad() {
  if (refreshing.value) {
    orders.value = [];
    page.value = 1;
    refreshing.value = false;
  }
  
  try {
    const params = {
      page: page.value,
      limit: 10,
      role: role.value
    };
    
    if (activeTab.value) {
      params.status = activeTab.value;
    }
    
    const res = await getOrders(params);
    
    if (res.code === 200) {
      orders.value.push(...res.data.list);
      
      if (page.value >= res.data.totalPages) {
        finished.value = true;
      } else {
        page.value++;
      }
    }
  } catch (error) {
    console.error('Load orders error:', error);
  } finally {
    loading.value = false;
  }
}

function onRefresh() {
  finished.value = false;
  loading.value = true;
  page.value = 1;
  onLoad();
}

function switchTab(tab) {
  activeTab.value = tab;
  orders.value = [];
  page.value = 1;
  finished.value = false;
  loading.value = true;
  onLoad();
}

function payOrder(order) {
  router.push(`/orders/create?orderId=${order.id}`);
}

async function cancelOrderHandler(id) {
  try {
    await showConfirmDialog({
      title: '确认取消',
      message: '取消后订单将无法恢复，是否确认？',
      confirmButtonText: '确认',
      cancelButtonText: '再想想'
    });
    
    showLoadingToast({ message: '取消中...', forbidClick: true });
    const res = await cancelOrder(id);
    closeToast();
    
    if (res.code === 200) {
      showToast('订单已取消');
      onRefresh();
    }
  } catch (error) {
    closeToast();
    if (error !== 'cancel') {
      showToast('取消失败');
    }
  }
}

async function completeOrderHandler(id) {
  try {
    await showConfirmDialog({
      title: '确认完成',
      message: '确认已完成服务？',
      confirmButtonText: '确认',
      cancelButtonText: '取消'
    });
    
    showLoadingToast({ message: '处理中...', forbidClick: true });
    const res = await completeOrder(id);
    closeToast();
    
    if (res.code === 200) {
      showToast('服务已完成');
      onRefresh();
    }
  } catch (error) {
    closeToast();
    if (error !== 'cancel') {
      showToast('操作失败');
    }
  }
}

onMounted(() => {
  onLoad();
});
</script>

<style scoped>
.orders-page {
  min-height: 100vh;
  background: #FAFAFA;
  padding-bottom: 60px;
}

.status-tabs {
  display: flex;
  background: #FFFFFF;
  border-bottom: 0.5px solid #EEEEEE;
  padding: 0 16px;
}

.status-tab {
  flex: 1;
  text-align: center;
  padding: 14px 0;
  font-size: 13px;
  color: #999999;
  position: relative;
  transition: all 0.1s;
}

.status-tab.active {
  color: #000000;
  font-weight: 600;
}

.status-tab.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 20px;
  height: 2px;
  background: #000000;
}

.orders-list {
  padding: 12px 16px;
}

.order-card {
  background: #FFFFFF;
  border: 0.5px solid #EEEEEE;
  border-radius: 2px;
  padding: 16px;
  margin-bottom: 12px;
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.status-badge {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 2px;
}

.status-badge.unpaid {
  background: #000000;
  color: #FFFFFF;
}

.status-badge.paid,
.status-badge.serving {
  background: #333333;
  color: #FFFFFF;
}

.status-badge.completed {
  background: #EEEEEE;
  color: #999999;
}

.status-badge.cancelled,
.status-badge.refunded {
  background: #FAFAFA;
  color: #CCCCCC;
}

.order-body {
  padding: 12px 0;
  border-top: 0.5px solid #EEEEEE;
  border-bottom: 0.5px solid #EEEEEE;
}

.order-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.order-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
}

.order-amount {
  font-size: 16px;
  font-weight: 700;
  color: #000000;
}

.order-actions {
  display: flex;
  gap: 8px;
}

.btn-pay {
  padding: 6px 16px;
  background: #000000;
  color: #FFFFFF;
  border: none;
  border-radius: 2px;
  font-size: 12px;
  cursor: pointer;
}

.btn-cancel {
  padding: 6px 16px;
  background: transparent;
  color: #666666;
  border: 0.5px solid #EEEEEE;
  border-radius: 2px;
  font-size: 12px;
  cursor: pointer;
}
</style>
