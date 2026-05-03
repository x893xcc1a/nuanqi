<template>
  <div class="ranking-page">
    <div class="page-header">
      <div class="back-btn" @click="goBack">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M15 10L5 5L5 15L15 10Z" fill="#000000"/>
        </svg>
      </div>
      <h1 class="header-title">守护者排行榜</h1>
      <div class="header-placeholder"></div>
    </div>

    <div class="tabs">
      <div 
        v-for="tab in tabs" 
        :key="tab.key"
        class="tab-item"
        :class="{ active: activeTab === tab.key }"
        @click="activeTab = tab.key"
      >
        {{ tab.label }}
      </div>
    </div>

    <div class="ranking-content">
      <div class="top-three">
        <div class="rank-item second" v-if="topRankings[1]">
          <div class="rank-badge">2</div>
          <div class="rank-avatar">
            <img :src="topRankings[1]?.avatar_url || defaultAvatar" alt="avatar">
          </div>
          <div class="rank-info">
            <span class="rank-name">{{ topRankings[1]?.nickname }}</span>
            <span class="rank-score">{{ topRankings[1]?.score }}分</span>
          </div>
          <div class="rank-level" :style="{ color: topRankings[1]?.level_color }">
            {{ topRankings[1]?.level_name }}
          </div>
        </div>
        
        <div class="rank-item first" v-if="topRankings[0]">
          <div class="rank-crown">👑</div>
          <div class="rank-badge">1</div>
          <div class="rank-avatar">
            <img :src="topRankings[0]?.avatar_url || defaultAvatar" alt="avatar">
          </div>
          <div class="rank-info">
            <span class="rank-name">{{ topRankings[0]?.nickname }}</span>
            <span class="rank-score">{{ topRankings[0]?.score }}分</span>
          </div>
          <div class="rank-level" :style="{ color: topRankings[0]?.level_color }">
            {{ topRankings[0]?.level_name }}
          </div>
        </div>
        
        <div class="rank-item third" v-if="topRankings[2]">
          <div class="rank-badge">3</div>
          <div class="rank-avatar">
            <img :src="topRankings[2]?.avatar_url || defaultAvatar" alt="avatar">
          </div>
          <div class="rank-info">
            <span class="rank-name">{{ topRankings[2]?.nickname }}</span>
            <span class="rank-score">{{ topRankings[2]?.score }}分</span>
          </div>
          <div class="rank-level" :style="{ color: topRankings[2]?.level_color }">
            {{ topRankings[2]?.level_name }}
          </div>
        </div>
      </div>

      <div class="other-list">
        <div 
          v-for="(item, index) in otherRankings" 
          :key="item.id"
          class="other-item"
          @click="goToKeeper(item.id)"
        >
          <div class="other-rank">{{ index + 4 }}</div>
          <div class="other-avatar">
            <img :src="item.avatar_url || defaultAvatar" alt="avatar">
          </div>
          <div class="other-info">
            <span class="other-name">{{ item.nickname }}</span>
            <span class="other-tags">{{ item.tags?.slice(0, 2).join('、') }}</span>
          </div>
          <div class="other-score">{{ item.score }}分</div>
        </div>
      </div>
    </div>

    <div class="my-rank" v-if="myRank">
      <div class="my-rank-header">我的排名</div>
      <div class="my-rank-content">
        <div class="my-avatar">
          <img :src="myRank.avatar_url || defaultAvatar" alt="avatar">
        </div>
        <div class="my-info">
          <span class="my-name">{{ myRank.nickname }}</span>
          <span class="my-level" :style="{ color: myRank.level_color }">
            {{ myRank.level_name }}
          </span>
        </div>
        <div class="my-rank-num">第 {{ myRank.rank }} 名</div>
        <div class="my-score">{{ myRank.score }}分</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const activeTab = ref('day');

const tabs = [
  { key: 'day', label: '日榜' },
  { key: 'week', label: '周榜' },
  { key: 'month', label: '月榜' },
  { key: 'total', label: '总榜' }
];

const defaultAvatar = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40"%3E%3Crect width="40" height="40" fill="%23EEEEEE"/%3E%3Ccircle cx="20" cy="16" r="6" fill="%23999999"/%3E%3Cpath d="M10 34c0-6 4-10 10-10s10 4 10 10" fill="%23999999"/%3E%3C/svg%3E';

const topRankings = ref([
  { id: 1, nickname: '暖心小太阳', score: 12580, level_name: '首席', level_color: '#6c5ce7', avatar_url: '' },
  { id: 2, nickname: '温柔倾听者', score: 9856, level_name: '女神', level_color: '#e84393', avatar_url: '' },
  { id: 3, nickname: '深夜陪伴者', score: 8723, level_name: '镇店店员', level_color: '#ff6b6b', avatar_url: '' }
]);

const otherRankings = ref([
  { id: 4, nickname: '星光指引', score: 7654, tags: ['情感咨询', '心灵疗愈'] },
  { id: 5, nickname: '晨曦微露', score: 6543, tags: ['倾听陪伴', '解忧'] },
  { id: 6, nickname: '月光漫步', score: 5432, tags: ['音乐陪伴', '放松'] },
  { id: 7, nickname: '云端漫步', score: 4321, tags: ['聊天', '故事'] },
  { id: 8, nickname: '清风徐来', score: 3210, tags: ['冥想', '静心'] },
  { id: 9, nickname: '心语心愿', score: 2109, tags: ['情感支持', '陪伴'] },
  { id: 10, nickname: '梦的港湾', score: 1098, tags: ['树洞', '倾诉'] }
]);

const myRank = ref({
  id: 99,
  nickname: '我的昵称',
  score: 3520,
  rank: 15,
  level_name: '金牌店员',
  level_color: '#ffd700'
});

function goBack() {
  router.back();
}

function goToKeeper(id) {
  router.push(`/keepers/${id}`);
}
</script>

<style scoped>
.ranking-page {
  min-height: 100vh;
  background: #FAFAFA;
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

.tabs {
  display: flex;
  background: #FFFFFF;
  padding: 0 16px 16px;
  gap: 12px;
}

.tab-item {
  flex: 1;
  padding: 10px;
  text-align: center;
  font-size: 14px;
  color: #999999;
  border-radius: 20px;
  background: #F5F5F5;
  transition: all 0.3s;
}

.tab-item.active {
  background: linear-gradient(135deg, #FF6B9D, #FF8E53);
  color: #FFFFFF;
}

.ranking-content {
  padding: 24px 16px;
}

.top-three {
  display: flex;
  justify-content: center;
  align-items: flex-end;
  gap: 16px;
  margin-bottom: 32px;
}

.rank-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.rank-item.first {
  order: 2;
}

.rank-item.second {
  order: 1;
}

.rank-item.third {
  order: 3;
}

.rank-crown {
  position: absolute;
  top: -20px;
  font-size: 24px;
}

.rank-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  color: #FFFFFF;
}

.rank-item.first .rank-badge {
  background: linear-gradient(135deg, #FFD700, #FFA500);
  right: -4px;
}

.rank-item.second .rank-badge {
  background: linear-gradient(135deg, #C0C0C0, #A8A8A8);
}

.rank-item.third .rank-badge {
  background: linear-gradient(135deg, #CD7F32, #B87333);
}

.rank-avatar {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background: #EEEEEE;
  overflow: hidden;
  margin-bottom: 8px;
  border: 3px solid;
}

.rank-item.first .rank-avatar {
  width: 90px;
  height: 90px;
  border-color: #FFD700;
}

.rank-item.second .rank-avatar {
  width: 65px;
  height: 65px;
  border-color: #C0C0C0;
}

.rank-item.third .rank-avatar {
  width: 60px;
  height: 60px;
  border-color: #CD7F32;
}

.rank-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.rank-info {
  text-align: center;
  margin-bottom: 4px;
}

.rank-name {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: #000000;
}

.rank-score {
  font-size: 12px;
  color: #999999;
}

.rank-level {
  font-size: 12px;
  font-weight: 600;
}

.other-list {
  background: #FFFFFF;
  border-radius: 12px;
  padding: 16px;
}

.other-item {
  display: flex;
  align-items: center;
  padding: 12px 0;
  border-bottom: 0.5px solid #F0F0F0;
}

.other-item:last-child {
  border-bottom: none;
}

.other-rank {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 600;
  color: #999999;
  margin-right: 12px;
}

.other-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: #EEEEEE;
  overflow: hidden;
  margin-right: 12px;
}

.other-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.other-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.other-name {
  font-size: 14px;
  font-weight: 600;
  color: #000000;
}

.other-tags {
  font-size: 12px;
  color: #999999;
}

.other-score {
  font-size: 14px;
  font-weight: 600;
  color: #FF6B9D;
}

.my-rank {
  margin: 16px;
  background: linear-gradient(135deg, #FFF5F7, #FFF0F3);
  border-radius: 12px;
  padding: 16px;
}

.my-rank-header {
  font-size: 14px;
  font-weight: 600;
  color: #000000;
  margin-bottom: 12px;
}

.my-rank-content {
  display: flex;
  align-items: center;
}

.my-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #EEEEEE;
  overflow: hidden;
  margin-right: 12px;
}

.my-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.my-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.my-name {
  font-size: 14px;
  font-weight: 600;
  color: #000000;
}

.my-level {
  font-size: 12px;
  font-weight: 600;
}

.my-rank-num {
  font-size: 16px;
  font-weight: 700;
  color: #FF6B9D;
  margin-right: 12px;
}

.my-score {
  font-size: 14px;
  color: #999999;
}
</style>