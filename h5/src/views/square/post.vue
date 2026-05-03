<template>
  <div class="post-create">
    <van-nav-bar 
      title="发布动态" 
      left-arrow 
      fixed 
      placeholder 
      :border="true"
      @click-left="goBack"
    >
      <template #right>
        <button 
          class="publish-btn" 
          :disabled="!content.trim() || publishing"
          @click="handlePublish"
        >
          发布
        </button>
      </template>
    </van-nav-bar>
    
    <div class="post-form">
      <!-- 内容输入 -->
      <van-field
        v-model="content"
        type="textarea"
        rows="8"
        maxlength="500"
        placeholder="分享你的心情、故事或求助..."
        :border="false"
        class="content-field"
        show-word-limit
      />
      
      <!-- 图片上传 -->
      <div class="image-section">
        <van-uploader
          v-model="fileList"
          multiple
          :max-count="3"
          :after-read="afterRead"
          @delete="onDelete"
        />
        <p class="text-auxiliary" style="margin-top: 8px; font-size: 11px;">
          最多上传3张图片，自动转为黑白滤镜
        </p>
      </div>
      
      <div class="divider"></div>
      
      <!-- 匿名选项 -->
      <div class="option-row">
        <div class="option-label">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style="margin-right: 6px;">
            <circle cx="8" cy="8" r="6" stroke="#000" stroke-width="1.5"/>
            <circle cx="8" cy="8" r="2" fill="#000"/>
          </svg>
          <span class="text-primary">灯塔模式（匿名）</span>
        </div>
        <van-switch v-model="isAnonymous" size="18px" active-color="#000000" />
      </div>
      
      <!-- 情绪标签 -->
      <div class="mood-section">
        <span class="text-primary" style="display: block; margin-bottom: 10px;">情绪标签</span>
        <div class="mood-options">
          <span 
            v-for="mood in moods" 
            :key="mood"
            :class="['mood-option', { active: selectedMood === mood }]"
            @click="selectMood(mood)"
          >
            {{ mood }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { showToast, showLoadingToast, closeToast } from 'vant';
import { createPost } from '../../api/post';
import { uploadImage } from '../../api/upload';
import { validatePost } from '../../utils/validator';

const router = useRouter();
const content = ref('');
const fileList = ref([]);
const isAnonymous = ref(false);
const selectedMood = ref('');
const publishing = ref(false);
const uploading = ref(false);

const moods = ['平静', '焦虑', '开心', '难过', '孤独', '感恩', '迷茫', '希望'];

function selectMood(mood) {
  selectedMood.value = selectedMood.value === mood ? '' : mood;
}

async function afterRead(file) {
  uploading.value = true;
  try {
    // 如果是文件对象，上传到服务器
    if (file.file) {
      const res = await uploadImage(file.file);
      if (res.code === 200) {
        // 上传成功，使用服务器返回的URL
        file.url = res.data.url;
        file.uploaded = true;
        showToast('图片上传成功');
      }
    }
  } catch (error) {
    showToast('图片上传失败');
  } finally {
    uploading.value = false;
  }
}

function onDelete() {
  // 处理删除
}

async function handlePublish() {
  // 表单验证
  const validation = validatePost({ content: content.value });
  if (!validation.valid) {
    if (validation.errors.content) {
      showToast(validation.errors.content);
    }
    return;
  }
  
  publishing.value = true;
  showLoadingToast({ message: '发布中...', forbidClick: true });
  
  try {
    const images = fileList.value.map(f => f.url || f.content);
    
    const res = await createPost({
      content: content.value.trim(),
      images,
      is_anonymous: isAnonymous.value,
      mood_tag: selectedMood.value
    });
    
    closeToast();
    
    if (res.code === 200) {
      showToast({ message: '发布成功', position: 'middle' });
      setTimeout(() => {
        router.replace('/square');
      }, 1000);
    }
  } catch (error) {
    closeToast();
    showToast('发布失败，请重试');
  } finally {
    publishing.value = false;
  }
}

function goBack() {
  router.back();
}
</script>

<style scoped>
.post-create {
  min-height: 100vh;
  background: #FFFFFF;
}

.publish-btn {
  padding: 4px 14px;
  background: #000000;
  color: #FFFFFF;
  border: none;
  border-radius: 2px;
  font-size: 13px;
  font-weight: 500;
}

.publish-btn:disabled {
  background: #CCCCCC;
}

.post-form {
  padding: 16px;
}

.content-field {
  font-size: 15px;
  line-height: 1.8;
  background: transparent;
}

.image-section {
  margin-top: 16px;
}

.option-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 0;
}

.option-label {
  display: flex;
  align-items: center;
}

.mood-section {
  padding: 14px 0;
}

.mood-options {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.mood-option {
  padding: 6px 14px;
  border: 0.5px solid #EEEEEE;
  border-radius: 2px;
  font-size: 12px;
  color: #666666;
  background: #FFFFFF;
  cursor: pointer;
}

.mood-option.active {
  background: #000000;
  color: #FFFFFF;
  border-color: #000000;
}
</style>
