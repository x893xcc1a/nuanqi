<template>
  <div class="square-page">
    <van-nav-bar title="心灵广场" fixed placeholder :border="true" />
    
    <!-- 情绪标签筛选 -->
    <div class="mood-filter">
      <div class="filter-scroll">
        <span 
          v-for="mood in moods" 
          :key="mood"
          :class="['mood-tag', { active: selectedMood === mood }]"
          @click="selectMood(mood)"
        >
          {{ mood }}
        </span>
      </div>
    </div>
    
    <!-- 发布按钮 -->
    <div class="post-btn-wrapper">
      <button class="btn-outline" @click="goToPost">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style="margin-right: 6px;">
          <path d="M8 3V13M3 8H13" stroke="#000" stroke-width="1.5"/>
        </svg>
        发布动态
      </button>
    </div>
    
    <!-- 瀑布流动态列表 -->
    <div class="posts-waterfall">
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <van-list
          v-model:loading="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="onLoad"
        >
          <div class="waterfall">
            <div class="waterfall-column">
              <div 
                v-for="post in leftPosts" 
                :key="post.id"
                class="post-card"
                @click="viewDetail(post.id)"
              >
                <div v-if="post.images && post.images.length > 0" class="post-image">
                  <img :src="post.images[0]" alt="post" loading="lazy">
                </div>
                <div class="post-content">
                  <p class="post-text">{{ post.content }}</p>
                  <div class="post-meta">
                    <span v-if="post.is_anonymous" class="lighthouse">{{ post.lighthouse_no }}</span>
                    <span v-else class="author">{{ post.author?.nickname || '匿名' }}</span>
                    <div class="post-stats">
                      <span class="stat">· {{ post.likes_count }}</span>
                    </div>
                  </div>
                  <span v-if="post.mood_tag" class="mood-label">{{ post.mood_tag }}</span>
                </div>
              </div>
            </div>
            
            <div class="waterfall-column">
              <div 
                v-for="post in rightPosts" 
                :key="post.id"
                class="post-card"
                @click="viewDetail(post.id)"
              >
                <div v-if="post.images && post.images.length > 0" class="post-image">
                  <img :src="post.images[0]" alt="post" loading="lazy">
                </div>
                <div class="post-content">
                  <p class="post-text">{{ post.content }}</p>
                  <div class="post-meta">
                    <span v-if="post.is_anonymous" class="lighthouse">{{ post.lighthouse_no }}</span>
                    <span v-else class="author">{{ post.author?.nickname || '匿名' }}</span>
                    <div class="post-stats">
                      <span class="stat">· {{ post.likes_count }}</span>
                    </div>
                  </div>
                  <span v-if="post.mood_tag" class="mood-label">{{ post.mood_tag }}</span>
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
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { showToast } from 'vant';
import TabBar from '../../components/TabBar.vue';
import { getPosts } from '../../api/post';

const router = useRouter();
const posts = ref([]);
const loading = ref(false);
const finished = ref(false);
const refreshing = ref(false);
const cursor = ref(0);
const selectedMood = ref('全部');

const moods = ['全部', '平静', '焦虑', '开心', '难过', '孤独', '感恩', '迷茫'];

// 瀑布流分列
const leftPosts = computed(() => posts.value.filter((_, i) => i % 2 === 0));
const rightPosts = computed(() => posts.value.filter((_, i) => i % 2 === 1));

async function onLoad() {
  if (refreshing.value) {
    posts.value = [];
    cursor.value = 0;
    refreshing.value = false;
  }
  
  try {
    const params = {
      cursor: cursor.value,
      limit: 10
    };
    
    if (selectedMood.value !== '全部') {
      params.mood_tag = selectedMood.value;
    }
    
    const res = await getPosts(params);
    
    if (res.code === 200) {
      posts.value.push(...res.data.list);
      
      if (!res.data.hasMore) {
        finished.value = true;
      } else {
        cursor.value = res.data.nextCursor;
      }
    }
  } catch (error) {
    console.error('Load posts error:', error);
  } finally {
    loading.value = false;
  }
}

function onRefresh() {
  finished.value = false;
  loading.value = true;
  cursor.value = 0;
  onLoad();
}

function selectMood(mood) {
  selectedMood.value = mood;
  posts.value = [];
  cursor.value = 0;
  finished.value = false;
  loading.value = true;
  onLoad();
}

function goToPost() {
  router.push('/square/post');
}

function viewDetail(id) {
  // 可以跳转到详情页
  showToast('查看详情功能开发中');
}

onMounted(() => {
  onLoad();
});
</script>

<style scoped>
.square-page {
  min-height: 100vh;
  background: #FAFAFA;
  padding-bottom: 60px;
}

.mood-filter {
  background: #FFFFFF;
  border-bottom: 0.5px solid #EEEEEE;
  padding: 12px 16px;
  position: sticky;
  top: 46px;
  z-index: 10;
}

.filter-scroll {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  scrollbar-width: none;
}

.filter-scroll::-webkit-scrollbar {
  display: none;
}

.mood-tag {
  flex-shrink: 0;
  padding: 6px 14px;
  border: 0.5px solid #EEEEEE;
  border-radius: 2px;
  font-size: 12px;
  color: #666666;
  background: #FFFFFF;
}

.mood-tag.active {
  background: #000000;
  color: #FFFFFF;
  border-color: #000000;
}

.post-btn-wrapper {
  padding: 12px 16px;
  background: #FFFFFF;
}

.posts-waterfall {
  padding: 0 8px;
}

.waterfall {
  display: flex;
  gap: 8px;
}

.waterfall-column {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.post-card {
  background: #FFFFFF;
  border: 0.5px solid #EEEEEE;
  border-radius: 2px;
  overflow: hidden;
  break-inside: avoid;
}

.post-image {
  width: 100%;
  aspect-ratio: 1;
  overflow: hidden;
}

.post-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: grayscale(80%);
}

.post-content {
  padding: 12px;
}

.post-text {
  font-size: 13px;
  line-height: 1.6;
  color: #333333;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-bottom: 10px;
}

.post-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.lighthouse {
  font-size: 11px;
  color: #999999;
  font-weight: 300;
}

.author {
  font-size: 11px;
  color: #666666;
}

.stat {
  font-size: 11px;
  color: #999999;
}

.mood-label {
  display: inline-block;
  margin-top: 8px;
  padding: 2px 8px;
  border: 0.5px solid #EEEEEE;
  border-radius: 2px;
  font-size: 10px;
  color: #999999;
}
</style>
