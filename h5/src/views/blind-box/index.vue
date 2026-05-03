<template>
  <div class="blind-box-page">
    <div class="page-header">
      <div class="header-bg"></div>
      <div class="header-content">
        <h1 class="header-title">心动盲盒</h1>
        <p class="header-desc">开启你的惊喜邂逅</p>
      </div>
    </div>

    <div class="price-section">
      <div class="price-item" :class="{ active: currentPrice === 1 }" @click="currentPrice = 1">
        <div class="price-value">1次</div>
        <div class="price-amount">¥9.9</div>
      </div>
      <div class="price-item" :class="{ active: currentPrice === 5 }" @click="currentPrice = 5">
        <div class="price-value">5次</div>
        <div class="price-amount">¥39.9</div>
        <div class="price-tag">划算</div>
      </div>
      <div class="price-item" :class="{ active: currentPrice === 10 }" @click="currentPrice = 10">
        <div class="price-value">10次</div>
        <div class="price-amount">¥69.9</div>
        <div class="price-tag">超值</div>
      </div>
    </div>

    <div class="box-container">
      <div class="blind-box" @click="openBox" :class="{ opening: isOpening, opened: isOpened }">
        <div class="box-lid">
          <div class="lid-decoration"></div>
        </div>
        <div class="box-body">
          <div class="box-shine"></div>
          <div class="box-pattern"></div>
        </div>
        <div class="box-glow" v-if="isOpening"></div>
      </div>
      
      <div class="open-btn" @click="openBox" :class="{ disabled: isOpening }">
        <span class="btn-text">{{ isOpening ? '开启中...' : '立即开启' }}</span>
      </div>
    </div>

    <div class="result-modal" v-if="showResult" @click="closeResult">
      <div class="result-content" @click.stop>
        <div class="result-header">
          <div class="result-title">恭喜获得</div>
          <div class="close-btn" @click="closeResult">×</div>
        </div>
        <div class="keeper-result">
          <div class="keeper-avatar">
            <img :src="resultKeeper?.avatar_url || defaultAvatar" alt="avatar">
          </div>
          <div class="keeper-name">{{ resultKeeper?.nickname || '神秘守护者' }}</div>
          <div class="keeper-level" :style="{ color: resultKeeper?.level_color }">
            {{ resultKeeper?.level_name }}
          </div>
        </div>
        <div class="result-actions">
          <div class="action-btn secondary" @click="closeResult">继续开启</div>
          <div class="action-btn primary" @click="goToChat">立即聊天</div>
        </div>
      </div>
    </div>

    <div class="tips-section">
      <div class="tips-title">盲盒玩法</div>
      <div class="tips-list">
        <div class="tip-item">
          <span class="tip-num">1</span>
          <span class="tip-text">随机匹配一位守护者</span>
        </div>
        <div class="tip-item">
          <span class="tip-num">2</span>
          <span class="tip-text">获得5分钟免费聊天时长</span>
        </div>
        <div class="tip-item">
          <span class="tip-num">3</span>
          <span class="tip-text">不满意可重新开启</span>
        </div>
      </div>
    </div>

    <div class="hot-section">
      <div class="section-header">
        <h2 class="title-sm">热门守护者</h2>
      </div>
      <div class="hot-list">
        <div 
          v-for="keeper in hotKeepers" 
          :key="keeper.id" 
          class="hot-item"
          @click="goToKeeper(keeper.id)"
        >
          <div class="hot-avatar">
            <img :src="keeper.user?.avatar_url || defaultAvatar" alt="avatar">
            <div class="hot-badge">{{ keeper.popularity || 0 }}</div>
          </div>
          <div class="hot-info">
            <span class="hot-name">{{ keeper.user?.nickname || '匿名' }}</span>
            <span class="hot-tags">{{ (keeper.tags || []).slice(0, 2).join('、') }}</span>
          </div>
        </div>
      </div>
    </div>

    <TabBar />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import TabBar from '../../components/TabBar.vue';

const router = useRouter();
const currentPrice = ref(1);
const isOpening = ref(false);
const isOpened = ref(false);
const showResult = ref(false);
const resultKeeper = ref(null);
const hotKeepers = ref([]);

const defaultAvatar = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40"%3E%3Crect width="40" height="40" fill="%23EEEEEE"/%3E%3Ccircle cx="20" cy="16" r="6" fill="%23999999"/%3E%3Cpath d="M10 34c0-6 4-10 10-10s10 4 10 10" fill="%23999999"/%3E%3C/svg%3E';

hotKeepers.value = [
  { id: 1, user: { nickname: '暖心小姐姐', avatar_url: '' }, tags: ['情感倾听', '陪伴'], popularity: 1258 },
  { id: 2, user: { nickname: '深夜树洞', avatar_url: '' }, tags: ['树洞', '解忧'], popularity: 892 },
  { id: 3, user: { nickname: '星空漫步者', avatar_url: '' }, tags: ['聊天', '音乐'], popularity: 654 }
];

function openBox() {
  if (isOpening.value) return;
  
  isOpening.value = true;
  
  setTimeout(() => {
    isOpened.value = true;
    isOpening.value = false;
    
    setTimeout(() => {
      resultKeeper.value = {
        nickname: '温暖小确幸',
        avatar_url: '',
        level_name: '金牌店员',
        level_color: '#ffd700'
      };
      showResult.value = true;
    }, 500);
  }, 2000);
}

function closeResult() {
  showResult.value = false;
  isOpened.value = false;
}

function goToChat() {
  showResult.value = false;
  isOpened.value = false;
  router.push('/keepers/1');
}

function goToKeeper(id) {
  router.push(`/keepers/${id}`);
}
</script>

<style scoped>
.blind-box-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #FEF3E2 0%, #FFF8F0 100%);
  padding-bottom: 60px;
}

.page-header {
  position: relative;
  padding: 60px 24px 40px;
  overflow: hidden;
}

.header-bg {
  position: absolute;
  top: -100px;
  right: -50px;
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, rgba(255, 182, 193, 0.4) 0%, transparent 70%);
}

.header-content {
  position: relative;
  z-index: 1;
}

.header-title {
  font-size: 32px;
  font-weight: 700;
  color: #000000;
  margin-bottom: 8px;
}

.header-desc {
  font-size: 14px;
  color: #999999;
}

.price-section {
  display: flex;
  gap: 12px;
  padding: 0 16px;
  margin-bottom: 24px;
}

.price-item {
  flex: 1;
  padding: 16px 8px;
  background: #FFFFFF;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 2px solid transparent;
  position: relative;
  transition: all 0.3s;
}

.price-item.active {
  border-color: #FF6B9D;
  background: rgba(255, 107, 157, 0.05);
}

.price-value {
  font-size: 12px;
  color: #666666;
  margin-bottom: 4px;
}

.price-amount {
  font-size: 18px;
  font-weight: 700;
  color: #FF6B9D;
}

.price-tag {
  position: absolute;
  top: -8px;
  right: 8px;
  padding: 2px 8px;
  background: linear-gradient(135deg, #FF6B9D, #FF8E53);
  color: #FFFFFF;
  font-size: 10px;
  border-radius: 10px;
}

.box-container {
  padding: 0 40px;
  margin-bottom: 32px;
}

.blind-box {
  position: relative;
  width: 200px;
  height: 200px;
  margin: 0 auto;
  cursor: pointer;
  transform-style: preserve-3d;
}

.box-body {
  position: absolute;
  bottom: 0;
  width: 200px;
  height: 150px;
  background: linear-gradient(145deg, #FFE4E9, #FFB6C1);
  border-radius: 0 0 12px 12px;
  box-shadow: 
    inset 0 -10px 30px rgba(255, 107, 157, 0.3),
    0 10px 40px rgba(255, 107, 157, 0.3);
}

.box-lid {
  position: absolute;
  top: 0;
  width: 200px;
  height: 60px;
  background: linear-gradient(145deg, #FF8FA3, #FF6B9D);
  border-radius: 12px 12px 0 0;
  transform-origin: bottom center;
  transition: transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: 0 -5px 20px rgba(255, 107, 157, 0.4);
}

.blind-box.opening .box-lid {
  transform: rotateX(-120deg);
}

.lid-decoration {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80px;
  height: 80px;
  border: 3px solid rgba(255, 255, 255, 0.5);
  border-radius: 50%;
}

.box-shine {
  position: absolute;
  top: 20px;
  left: 20px;
  width: 60px;
  height: 60px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.6) 0%, transparent 70%);
  border-radius: 50%;
}

.box-pattern {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 10px;
}

.box-pattern::before,
.box-pattern::after {
  content: '💕';
  font-size: 24px;
  animation: float 2s ease-in-out infinite;
}

.box-pattern::after {
  animation-delay: 1s;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.box-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.8) 0%, transparent 70%);
  animation: glow 2s ease-out forwards;
  pointer-events: none;
}

@keyframes glow {
  0% { opacity: 0; transform: translate(-50%, -50%) scale(0.5); }
  50% { opacity: 1; transform: translate(-50%, -50%) scale(1.2); }
  100% { opacity: 0; transform: translate(-50%, -50%) scale(2); }
}

.open-btn {
  margin-top: 24px;
  padding: 16px;
  background: linear-gradient(135deg, #FF6B9D, #FF8E53);
  border-radius: 30px;
  text-align: center;
  box-shadow: 0 6px 20px rgba(255, 107, 157, 0.4);
}

.open-btn.disabled {
  opacity: 0.6;
}

.btn-text {
  color: #FFFFFF;
  font-size: 16px;
  font-weight: 600;
}

.result-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.result-content {
  width: 320px;
  background: #FFFFFF;
  border-radius: 20px;
  overflow: hidden;
  animation: slideUp 0.4s ease;
}

@keyframes slideUp {
  from { transform: translateY(50px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.result-header {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 24px;
  background: linear-gradient(135deg, #FFE4E9, #FFB6C1);
  position: relative;
}

.result-title {
  font-size: 20px;
  font-weight: 700;
  color: #000000;
}

.close-btn {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 24px;
  color: #999999;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.keeper-result {
  padding: 32px 24px;
  text-align: center;
}

.keeper-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin: 0 auto 16px;
  background: #EEEEEE;
  overflow: hidden;
  border: 4px solid #FFE4E9;
}

.keeper-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.keeper-name {
  font-size: 18px;
  font-weight: 600;
  color: #000000;
  margin-bottom: 8px;
}

.keeper-level {
  font-size: 14px;
  font-weight: 600;
}

.result-actions {
  display: flex;
  gap: 12px;
  padding: 0 24px 24px;
}

.action-btn {
  flex: 1;
  padding: 14px;
  border-radius: 30px;
  text-align: center;
  font-size: 14px;
  font-weight: 600;
}

.action-btn.secondary {
  background: #F5F5F5;
  color: #666666;
}

.action-btn.primary {
  background: linear-gradient(135deg, #FF6B9D, #FF8E53);
  color: #FFFFFF;
}

.tips-section {
  padding: 24px 16px;
  background: #FFFFFF;
  margin-bottom: 16px;
  border-radius: 8px;
}

.tips-title {
  font-size: 16px;
  font-weight: 600;
  color: #000000;
  margin-bottom: 16px;
}

.tips-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.tip-item {
  display: flex;
  align-items: center;
}

.tip-num {
  width: 24px;
  height: 24px;
  background: linear-gradient(135deg, #FF6B9D, #FF8E53);
  color: #FFFFFF;
  font-size: 12px;
  font-weight: 600;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  flex-shrink: 0;
}

.tip-text {
  font-size: 14px;
  color: #666666;
}

.hot-section {
  padding: 16px;
  background: #FFFFFF;
  border-radius: 8px;
  margin: 0 16px;
}

.section-header {
  margin-bottom: 16px;
}

.title-sm {
  font-size: 16px;
  font-weight: 600;
  color: #000000;
}

.hot-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.hot-item {
  display: flex;
  align-items: center;
  padding: 12px;
  background: #FAFAFA;
  border-radius: 8px;
}

.hot-avatar {
  position: relative;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #EEEEEE;
  margin-right: 12px;
  overflow: hidden;
}

.hot-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hot-badge {
  position: absolute;
  bottom: -2px;
  right: -2px;
  padding: 2px 6px;
  background: #FF6B9D;
  color: #FFFFFF;
  font-size: 10px;
  border-radius: 10px;
}

.hot-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.hot-name {
  font-size: 14px;
  font-weight: 600;
  color: #000000;
}

.hot-tags {
  font-size: 12px;
  color: #999999;
}
</style>