<template>
  <div class="home-page">
    <!-- 顶部品牌区 -->
    <div class="brand-section">
      <h1 class="brand-title">暖栖港湾</h1>
      <p class="brand-subtitle text-auxiliary">一个安静的情感陪伴空间</p>
    </div>
    
    <!-- 服务入口 -->
    <div class="service-grid">
      <div class="service-card" @click="goToKeepers">
        <div class="service-icon">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <circle cx="16" cy="12" r="5" stroke="#000" stroke-width="1.5"/>
            <path d="M6 28C6 22 10 18 16 18C22 18 26 22 26 28" stroke="#000" stroke-width="1.5"/>
          </svg>
        </div>
        <span class="service-name">寻找守护者</span>
        <span class="service-desc text-auxiliary">专业倾听，温暖陪伴</span>
      </div>
      
      <div class="service-card" @click="goToSquare">
        <div class="service-icon">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <rect x="6" y="6" width="9" height="9" rx="1" stroke="#000" stroke-width="1.5"/>
            <rect x="17" y="6" width="9" height="9" rx="1" stroke="#000" stroke-width="1.5"/>
            <rect x="6" y="17" width="9" height="9" rx="1" stroke="#000" stroke-width="1.5"/>
            <rect x="17" y="17" width="9" height="9" rx="1" stroke="#000" stroke-width="1.5"/>
          </svg>
        </div>
        <span class="service-name">心灵广场</span>
        <span class="service-desc text-auxiliary">匿名倾诉，彼此看见</span>
      </div>
      
      <div class="service-card" @click="goToTreehole">
        <div class="service-icon">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <path d="M16 6C10 6 6 10 6 16C6 22 10 26 16 26" stroke="#000" stroke-width="1.5"/>
            <path d="M16 26C22 26 26 22 26 16C26 10 22 6 16 6" stroke="#000" stroke-width="1.5" stroke-dasharray="2 2"/>
            <circle cx="16" cy="16" r="3" stroke="#000" stroke-width="1.5"/>
          </svg>
        </div>
        <span class="service-name">树洞倾诉</span>
        <span class="service-desc text-auxiliary">安全私密，释放情绪</span>
      </div>
    </div>
    
    <!-- 推荐守护者 -->
    <div class="section">
      <div class="section-header">
        <h2 class="title-sm">推荐守护者</h2>
        <span class="text-auxiliary" style="font-size: 12px;" @click="goToKeepers">查看全部</span>
      </div>
      
      <div class="keeper-list" v-if="keepers.length > 0">
        <div 
          v-for="keeper in keepers" 
          :key="keeper.id"
          class="keeper-card"
          @click="goToKeeperDetail(keeper.id)"
        >
          <div class="keeper-avatar">
            <img :src="keeper.user?.avatar_url || defaultAvatar" alt="avatar">
          </div>
          <div class="keeper-info">
            <span class="keeper-name">{{ keeper.user?.nickname || '匿名守护者' }}</span>
            <div class="keeper-tags">
              <span v-for="tag in (keeper.tags || []).slice(0, 2)" :key="tag" class="tag">
                {{ tag }}
              </span>
            </div>
            <span class="text-auxiliary" style="font-size: 11px;">
              ¥{{ (keeper.hourly_rate / 100).toFixed(0) }}/小时
            </span>
          </div>
        </div>
      </div>
      
      <van-empty v-else description="暂无守护者" />
    </div>
    
    <!-- 底部导航 -->
    <TabBar />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import TabBar from '../../components/TabBar.vue';
import { getKeepers } from '../../api/user';

const router = useRouter();
const keepers = ref([]);
const defaultAvatar = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40"%3E%3Crect width="40" height="40" fill="%23EEEEEE"/%3E%3Ccircle cx="20" cy="16" r="6" fill="%23999999"/%3E%3Cpath d="M10 34c0-6 4-10 10-10s10 4 10 10" fill="%23999999"/%3E%3C/svg%3E';

onMounted(() => {
  loadKeepers();
});

async function loadKeepers() {
  try {
    const res = await getKeepers({ page: 1, limit: 4 });
    if (res.code === 200) {
      keepers.value = res.data.list;
    }
  } catch (error) {
    console.error('Load keepers error:', error);
  }
}

function goToKeepers() {
  router.push('/keepers');
}

function goToKeeperDetail(id) {
  router.push(`/keepers/${id}`);
}

function goToSquare() {
  router.push('/square');
}

function goToTreehole() {
  router.push('/keepers?type=treehole');
}
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  background: #FAFAFA;
  padding-bottom: 60px;
}

.brand-section {
  padding: 40px 24px 32px;
  background: #FFFFFF;
  border-bottom: 0.5px solid #EEEEEE;
}

.brand-title {
  font-size: 28px;
  font-weight: 700;
  letter-spacing: 2px;
  color: #000000;
}

.brand-subtitle {
  margin-top: 8px;
  font-weight: 300;
}

.service-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  padding: 16px;
  background: #FFFFFF;
  margin-bottom: 12px;
}

.service-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 8px;
  border: 0.5px solid #EEEEEE;
  border-radius: 2px;
  background: #FFFFFF;
}

.service-icon {
  margin-bottom: 12px;
}

.service-name {
  font-size: 13px;
  font-weight: 600;
  color: #000000;
  margin-bottom: 4px;
}

.service-desc {
  font-size: 10px;
  text-align: center;
}

.section {
  background: #FFFFFF;
  padding: 16px;
  margin-bottom: 12px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.keeper-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.keeper-card {
  display: flex;
  align-items: center;
  padding: 12px;
  border: 0.5px solid #EEEEEE;
  border-radius: 2px;
}

.keeper-avatar {
  width: 48px;
  height: 48px;
  border-radius: 2px;
  overflow: hidden;
  margin-right: 12px;
  flex-shrink: 0;
}

.keeper-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: grayscale(100%);
}

.keeper-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.keeper-name {
  font-size: 14px;
  font-weight: 600;
  color: #000000;
}

.keeper-tags {
  display: flex;
  gap: 6px;
}
</style>
