<template>
  <div class="blind-box-order">
    <div class="page-header">
      <div class="back-btn" @click="goBack">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M15 10L5 5L5 15L15 10Z" fill="#000000"/>
        </svg>
      </div>
      <h1 class="header-title">确认订单</h1>
      <div class="header-placeholder"></div>
    </div>

    <div class="order-content">
      <div class="order-card">
        <div class="card-header">
          <span class="card-title">心动盲盒</span>
          <span class="card-subtitle">开启惊喜邂逅</span>
        </div>
        <div class="card-body">
          <div class="price-info">
            <div class="price-label">选择数量</div>
            <div class="quantity-select">
              <div class="qty-btn" @click="decreaseQty">-</div>
              <span class="qty-value">{{ quantity }}</span>
              <div class="qty-btn" @click="increaseQty">+</div>
            </div>
          </div>
          
          <div class="price-row">
            <span class="price-label">商品金额</span>
            <span class="price-value">¥{{ (price * quantity / 100).toFixed(2) }}</span>
          </div>
          
          <div class="price-row">
            <span class="price-label">运费</span>
            <span class="price-value free">免运费</span>
          </div>
        </div>
        <div class="card-footer">
          <div class="total-label">合计</div>
          <div class="total-price">¥{{ (price * quantity / 100).toFixed(2) }}</div>
        </div>
      </div>

      <div class="coupon-section">
        <div class="coupon-header" @click="showCouponList = !showCouponList">
          <span class="coupon-label">优惠券</span>
          <div class="coupon-right">
            <span class="coupon-value" v-if="selectedCoupon">-¥{{ selectedCoupon?.value / 100 }}</span>
            <span class="coupon-value" v-else>暂无可用</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M4 6L8 10L12 6" stroke="#999999" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </div>
        
        <div class="coupon-list" v-if="showCouponList">
          <div 
            v-for="coupon in coupons" 
            :key="coupon.id"
            class="coupon-item"
            :class="{ selected: selectedCoupon?.id === coupon.id }"
            @click="selectCoupon(coupon)"
          >
            <div class="coupon-left">
              <span class="coupon-amount">¥{{ coupon.value / 100 }}</span>
              <span class="coupon-condition">满{{ coupon.min_amount / 100 }}可用</span>
            </div>
            <div class="coupon-right">
              <span class="coupon-name">{{ coupon.name }}</span>
              <span class="coupon-time">{{ coupon.validTime }}</span>
            </div>
            <div class="coupon-check" v-if="selectedCoupon?.id === coupon.id">✓</div>
          </div>
        </div>
      </div>

      <div class="note-section">
        <div class="note-label">备注</div>
        <textarea 
          class="note-input" 
          v-model="remark" 
          placeholder="选填，如有特殊需求请备注"
        ></textarea>
      </div>
    </div>

    <div class="bottom-bar">
      <div class="bottom-left">
        <span class="pay-label">实付款</span>
        <span class="pay-amount">¥{{ finalPrice.toFixed(2) }}</span>
      </div>
      <div class="bottom-right" @click="submitOrder">提交订单</div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const quantity = ref(1);
const price = ref(990);
const remark = ref('');
const showCouponList = ref(false);
const selectedCoupon = ref(null);

const coupons = ref([
  { id: 1, name: '新人专享券', value: 300, min_amount: 500, validTime: '2024.01.01-2024.12.31' },
  { id: 2, name: '盲盒优惠', value: 200, min_amount: 990, validTime: '2024.01.01-2024.06.30' },
  { id: 3, name: '限时折扣', value: 100, min_amount: 0, validTime: '2024.03.01-2024.03.31' }
]);

const finalPrice = computed(() => {
  let total = price.value * quantity.value / 100;
  if (selectedCoupon.value) {
    total -= selectedCoupon.value.value / 100;
  }
  return total > 0 ? total : 0;
});

function goBack() {
  router.back();
}

function increaseQty() {
  if (quantity.value < 10) {
    quantity.value++;
  }
}

function decreaseQty() {
  if (quantity.value > 1) {
    quantity.value--;
  }
}

function selectCoupon(coupon) {
  if (selectedCoupon.value?.id === coupon.id) {
    selectedCoupon.value = null;
  } else {
    selectedCoupon.value = coupon;
  }
}

function submitOrder() {
  router.push('/home');
}
</script>

<style scoped>
.blind-box-order {
  min-height: 100vh;
  background: #FAFAFA;
  padding-bottom: 80px;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 50px 16px 16px;
  background: #FFFFFF;
}

.back-btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.header-title {
  font-size: 18px;
  font-weight: 600;
  color: #000000;
}

.header-placeholder {
  width: 40px;
}

.order-content {
  padding: 16px;
}

.order-card {
  background: #FFFFFF;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 16px;
}

.card-header {
  padding: 16px;
  background: linear-gradient(135deg, #FFE4E9, #FFB6C1);
}

.card-title {
  display: block;
  font-size: 16px;
  font-weight: 600;
  color: #000000;
  margin-bottom: 4px;
}

.card-subtitle {
  font-size: 12px;
  color: #999999;
}

.card-body {
  padding: 16px;
}

.price-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.price-label {
  font-size: 14px;
  color: #666666;
}

.quantity-select {
  display: flex;
  align-items: center;
  gap: 16px;
}

.qty-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #F5F5F5;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: #666666;
}

.qty-value {
  font-size: 16px;
  font-weight: 600;
  color: #000000;
  min-width: 32px;
  text-align: center;
}

.price-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 0.5px solid #F0F0F0;
}

.price-row:last-of-type {
  border-bottom: none;
}

.price-value {
  font-size: 14px;
  color: #000000;
}

.price-value.free {
  color: #52C41A;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: #FAFAFA;
}

.total-label {
  font-size: 14px;
  color: #666666;
}

.total-price {
  font-size: 20px;
  font-weight: 700;
  color: #FF6B9D;
}

.coupon-section {
  background: #FFFFFF;
  border-radius: 12px;
  margin-bottom: 16px;
}

.coupon-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
}

.coupon-label {
  font-size: 14px;
  color: #000000;
}

.coupon-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.coupon-value {
  font-size: 14px;
  color: #FF6B9D;
}

.coupon-list {
  padding: 0 16px 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.coupon-item {
  display: flex;
  align-items: center;
  padding: 12px;
  background: #FAFAFA;
  border-radius: 8px;
  border: 2px solid transparent;
  position: relative;
}

.coupon-item.selected {
  border-color: #FF6B9D;
  background: rgba(255, 107, 157, 0.05);
}

.coupon-left {
  padding-right: 12px;
  border-right: 1px dashed #DDDDDD;
  margin-right: 12px;
}

.coupon-amount {
  display: block;
  font-size: 20px;
  font-weight: 700;
  color: #FF6B9D;
}

.coupon-condition {
  font-size: 10px;
  color: #999999;
}

.coupon-right {
  flex: 1;
}

.coupon-name {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #000000;
  margin-bottom: 4px;
}

.coupon-time {
  font-size: 12px;
  color: #999999;
}

.coupon-check {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #FF6B9D;
  color: #FFFFFF;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.note-section {
  background: #FFFFFF;
  border-radius: 12px;
  padding: 16px;
}

.note-label {
  font-size: 14px;
  color: #666666;
  margin-bottom: 8px;
}

.note-input {
  width: 100%;
  height: 80px;
  padding: 12px;
  border: 1px solid #EEEEEE;
  border-radius: 8px;
  font-size: 14px;
  resize: none;
  box-sizing: border-box;
}

.note-input::placeholder {
  color: #CCCCCC;
}

.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: #FFFFFF;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
}

.bottom-left {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.pay-label {
  font-size: 14px;
  color: #666666;
}

.pay-amount {
  font-size: 24px;
  font-weight: 700;
  color: #FF6B9D;
}

.bottom-right {
  padding: 14px 32px;
  background: linear-gradient(135deg, #FF6B9D, #FF8E53);
  border-radius: 30px;
  color: #FFFFFF;
  font-size: 16px;
  font-weight: 600;
}
</style>