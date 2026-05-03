<template>
  <div class="keeper-detail">
    <van-nav-bar 
      title="守护者详情" 
      left-arrow 
      fixed 
      placeholder 
      :border="true"
      @click-left="goBack"
    />
    
    <div v-if="keeper" class="detail-content">
      <!-- 守护者信息 -->
      <div class="info-section">
        <div class="avatar-large">
          <img :src="keeper.user?.avatar_url || defaultAvatar" alt="avatar">
        </div>
        <h2 class="title-md" style="margin-top: 16px;">{{ keeper.user?.nickname || '匿名守护者' }}</h2>
        <div class="status-row" style="margin-top: 8px;">
          <span v-if="keeper.is_online" class="online-badge">在线</span>
          <span class="text-auxiliary">{{ keeper.bio || '暂无简介' }}</span>
        </div>
        <div class="tags-row" style="margin-top: 12px;">
          <span v-for="tag in (keeper.tags || [])" :key="tag" class="tag">{{ tag }}</span>
        </div>
      </div>
      
      <div class="divider"></div>
      
      <!-- 服务类型 -->
      <div class="service-section">
        <h3 class="title-sm">选择服务</h3>
        <div class="service-options">
          <div 
            v-for="service in services" 
            :key="service.type"
            :class="['service-option', { active: selectedService === service.type }]"
            @click="selectService(service.type)"
          >
            <span class="service-name">{{ service.name }}</span>
            <span class="service-price">¥{{ (keeper.hourly_rate / 100).toFixed(0) }}/时</span>
          </div>
        </div>
      </div>
      
      <div class="divider"></div>
      
      <!-- 时长选择 -->
      <div class="duration-section">
        <h3 class="title-sm">选择时长</h3>
        <div class="duration-options">
          <div 
            v-for="d in durations" 
            :key="d"
            :class="['duration-option', { active: selectedDuration === d }]"
            @click="selectDuration(d)"
          >
            {{ d }}分钟
          </div>
        </div>
      </div>
      
      <div class="divider"></div>
      
      <!-- 备注 -->
      <div class="remark-section">
        <h3 class="title-sm">需求备注</h3>
        <van-field
          v-model="remark"
          type="textarea"
          rows="3"
          placeholder="请简单描述您的需求，让守护者更好地陪伴您..."
          :border="false"
          class="remark-field"
        />
      </div>
    </div>
    
    <!-- 底部操作栏 -->
    <div class="bottom-action">
      <div class="price-info">
        <span class="text-auxiliary">合计</span>
        <span class="total-price">¥{{ totalPrice }}</span>
      </div>
      <button class="btn-primary" style="width: 160px;" @click="handleCreateOrder">
        立即预约
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { showToast, showLoadingToast, closeToast } from 'vant';
import { getKeeperDetail } from '../../api/user';
import { createOrder } from '../../api/order';

const route = useRoute();
const router = useRouter();
const keeper = ref(null);
const selectedService = ref('text');
const selectedDuration = ref(30);
const remark = ref('');

const services = [
  { type: 'text', name: '文字陪伴' },
  { type: 'voice', name: '语音通话' },
  { type: 'treehole', name: '树洞倾诉' }
];

const durations = [30, 60, 90, 120];

const defaultAvatar = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80"%3E%3Crect width="80" height="80" fill="%23EEEEEE"/%3E%3Ccircle cx="40" cy="30" r="14" fill="%23999999"/%3E%3Cpath d="M16 70c0-14 10-24 24-24s24 10 24 24" fill="%23999999"/%3E%3C/svg%3E';

const totalPrice = computed(() => {
  if (!keeper.value) return '0';
  const hours = Math.ceil(selectedDuration.value / 60);
  return ((keeper.value.hourly_rate * hours) / 100).toFixed(0);
});

onMounted(async () => {
  try {
    const res = await getKeeperDetail(route.params.id);
    if (res.code === 200) {
      keeper.value = res.data;
    }
  } catch (error) {
    showToast('获取守护者信息失败');
  }
});

function selectService(type) {
  selectedService.value = type;
}

function selectDuration(d) {
  selectedDuration.value = d;
}

async function handleCreateOrder() {
  if (!keeper.value) return;
  
  showLoadingToast({ message: '创建订单中...', forbidClick: true });
  
  try {
    const res = await createOrder({
      keeper_id: keeper.value.user_id,
      service_type: selectedService.value,
      duration: selectedDuration.value,
      remark: remark.value
    });
    
    closeToast();
    
    if (res.code === 200) {
      router.push(`/orders/create?orderId=${res.data.orderId}`);
    }
  } catch (error) {
    closeToast();
    showToast('创建订单失败');
  }
}

function goBack() {
  router.back();
}
</script>

<style scoped>
.keeper-detail {
  min-height: 100vh;
  background: #FFFFFF;
  padding-bottom: 80px;
}

.detail-content {
  padding: 0 16px;
}

.info-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px 0;
}

.avatar-large {
  width: 80px;
  height: 80px;
  border-radius: 2px;
  overflow: hidden;
}

.avatar-large img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: grayscale(100%);
}

.online-badge {
  display: inline-block;
  padding: 2px 8px;
  background: #000000;
  color: #FFFFFF;
  font-size: 10px;
  border-radius: 2px;
  margin-right: 8px;
}

.tags-row {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: center;
}

.service-section,
.duration-section,
.remark-section {
  padding: 16px 0;
}

.service-options,
.duration-options {
  display: flex;
  gap: 10px;
  margin-top: 12px;
  flex-wrap: wrap;
}

.service-option,
.duration-option {
  flex: 1;
  min-width: 80px;
  padding: 12px;
  border: 0.5px solid #EEEEEE;
  border-radius: 2px;
  text-align: center;
  cursor: pointer;
  transition: all 0.1s;
}

.service-option.active,
.duration-option.active {
  background: #000000;
  color: #FFFFFF;
  border-color: #000000;
}

.service-name {
  display: block;
  font-size: 13px;
  font-weight: 500;
}

.service-price {
  display: block;
  font-size: 11px;
  margin-top: 4px;
  opacity: 0.7;
}

.remark-field {
  margin-top: 8px;
  background: #FAFAFA;
  border-radius: 2px;
  padding: 8px;
}

.bottom-action {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #FFFFFF;
  border-top: 0.5px solid #EEEEEE;
  padding: 12px 16px;
  padding-bottom: calc(12px + env(safe-area-inset-bottom));
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.price-info {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.total-price {
  font-size: 20px;
  font-weight: 700;
  color: #000000;
}
</style>
