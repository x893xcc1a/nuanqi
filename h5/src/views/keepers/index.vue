<template>
  <div class="keepers-page">
    <van-nav-bar title="守护者" fixed placeholder :border="true" />
    
    <!-- 筛选标签 -->
    <div class="filter-bar">
      <div class="filter-scroll">
        <span 
          v-for="tag in tags" 
          :key="tag"
          :class="['filter-tag', { active: selectedTag === tag }]"
          @click="selectTag(tag)"
        >
          {{ tag }}
        </span>
      </div>
    </div>
    
    <!-- 守护者列表 -->
    <div class="keeper-list">
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <van-list
          v-model:loading="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="onLoad"
        >
          <div 
            v-for="keeper in keepers" 
            :key="keeper.id"
            class="keeper-item"
            @click="goToDetail(keeper.id)"
          >
            <div class="keeper-main">
              <div class="keeper-avatar">
                <img :src="keeper.user?.avatar_url || defaultAvatar" alt="avatar">
                <span v-if="keeper.is_online" class="online-dot"></span>
              </div>
              <div class="keeper-content">
                <div class="keeper-header">
                  <span class="keeper-name">{{ keeper.user?.nickname || '匿名守护者' }}</span>
                  <span class="keeper-price">¥{{ (keeper.hourly_rate / 100).toFixed(0) }}/时</span>
                </div>
                <p class="keeper-bio text-primary">{{ keeper.bio || '暂无简介' }}</p>
                <div class="keeper-tags">
                  <span v-for="t in (keeper.tags || []).slice(0, 3)" :key="t" class="tag">
                    {{ t }}
                  </span>
                </div>
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
import TabBar from '../../components/TabBar.vue';
import { getKeepers } from '../../api/user';

const router = useRouter();
const keepers = ref([]);
const loading = ref(false);
const finished = ref(false);
const refreshing = ref(false);
const page = ref(1);
const selectedTag = ref('全部');

const tags = ['全部', '情感咨询', '倾听陪伴', '压力释放', '成长指导', '树洞倾诉'];

const defaultAvatar = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48"%3E%3Crect width="48" height="48" fill="%23EEEEEE"/%3E%3Ccircle cx="24" cy="18" r="8" fill="%23999999"/%3E%3Cpath d="M10 42c0-8 6-14 14-14s14 6 14 14" fill="%23999999"/%3E%3C/svg%3E';

async function onLoad() {
  if (refreshing.value) {
    keepers.value = [];
    page.value = 1;
    refreshing.value = false;
  }
  
  try {
    const params = {
      page: page.value,
      limit: 10
    };
    
    if (selectedTag.value !== '全部') {
      params.tag = selectedTag.value;
    }
    
    const res = await getKeepers(params);
    
    if (res.code === 200) {
      keepers.value.push(...res.data.list);
      
      if (page.value >= res.data.totalPages) {
        finished.value = true;
      } else {
        page.value++;
      }
    }
  } catch (error) {
    console.error('Load keepers error:', error);
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

function selectTag(tag) {
  selectedTag.value = tag;
  keepers.value = [];
  page.value = 1;
  finished.value = false;
  loading.value = true;
  onLoad();
}

function goToDetail(id) {
  router.push(`/keepers/${id}`);
}

onMounted(() => {
  onLoad();
});
</script>

<style scoped>
.keepers-page {
  min-height: 100vh;
  background: #FAFAFA;
  padding-bottom: 60px;
}

.filter-bar {
  background: #FFFFFF;
  border-bottom: 0.5px solid #EEEEEE;
  padding: 12px 16px;
  position: sticky;
  top: 46px;
  z-index: 10;
}

.filter-scroll {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  scrollbar-width: none;
}

.filter-scroll::-webkit-scrollbar {
  display: none;
}

.filter-tag {
  flex-shrink: 0;
  padding: 6px 14px;
  border: 0.5px solid #EEEEEE;
  border-radius: 2px;
  font-size: 12px;
  color: #666666;
  background: #FFFFFF;
  transition: all 0.1s;
}

.filter-tag.active {
  background: #000000;
  color: #FFFFFF;
  border-color: #000000;
}

.keeper-list {
  padding: 12px 16px;
}

.keeper-item {
  background: #FFFFFF;
  border: 0.5px solid #EEEEEE;
  border-radius: 2px;
  padding: 16px;
  margin-bottom: 12px;
}

.keeper-main {
  display: flex;
  gap: 12px;
}

.keeper-avatar {
  position: relative;
  width: 56px;
  height: 56px;
  border-radius: 2px;
  overflow: hidden;
  flex-shrink: 0;
}

.keeper-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: grayscale(100%);
}

.online-dot {
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 10px;
  height: 10px;
  background: #000000;
  border: 2px solid #FFFFFF;
  border-radius: 50%;
}

.keeper-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.keeper-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.keeper-name {
  font-size: 15px;
  font-weight: 600;
  color: #000000;
}

.keeper-price {
  font-size: 13px;
  font-weight: 600;
  color: #000000;
}

.keeper-bio {
  font-size: 12px;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.keeper-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}
</style>
