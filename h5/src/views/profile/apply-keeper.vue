<template>
  <div class="apply-keeper">
    <van-nav-bar 
      title="申请守护者" 
      left-arrow 
      fixed 
      placeholder 
      :border="true"
      @click-left="goBack"
    />
    
    <div class="apply-form">
      <div class="form-intro">
        <h2 class="title-md">成为守护者</h2>
        <p class="text-primary" style="margin-top: 8px;">
          用您的倾听和陪伴，温暖每一个需要的人
        </p>
      </div>
      
      <van-cell-group :border="false">
        <van-field
          v-model="form.realName"
          label="真实姓名"
          placeholder="请输入真实姓名"
          :border="false"
          :error-message="errors.realName"
          @blur="validateField('realName')"
        />
        <van-field
          v-model="form.idCard"
          label="身份证号"
          placeholder="请输入身份证号"
          :border="false"
          :error-message="errors.idCard"
          @blur="validateField('idCard')"
        />
        <van-field
          v-model="form.bio"
          label="个人简介"
          type="textarea"
          rows="4"
          placeholder="请介绍自己，让用户更了解您..."
          :border="false"
          :error-message="errors.bio"
        />
        <van-field
          v-model="form.hourlyRate"
          label="每小时价格"
          placeholder="请输入价格（分）"
          type="number"
          :border="false"
          :error-message="errors.hourlyRate"
        >
          <template #right-icon>
            <span class="text-auxiliary">分/小时</span>
          </template>
        </van-field>
      </van-cell-group>
      
      <!-- 技能标签错误提示 -->
      <div v-if="errors.tags" class="error-message" style="padding: 0 16px;">
        {{ errors.tags }}
      </div>
      
      <!-- 技能标签 -->
      <div class="tags-section">
        <span class="text-primary" style="display: block; margin-bottom: 10px;">技能标签</span>
        <div class="tags-options">
          <span 
            v-for="tag in availableTags" 
            :key="tag"
            :class="['tag-option', { active: form.tags.includes(tag) }]"
            @click="toggleTag(tag)"
          >
            {{ tag }}
          </span>
        </div>
      </div>
      
      <!-- 认证图片 -->
      <div class="cert-section">
        <span class="text-primary" style="display: block; margin-bottom: 10px;">认证资料</span>
        <van-uploader
          v-model="certFiles"
          multiple
          :max-count="3"
          :after-read="afterRead"
        />
      </div>
      
      <div class="submit-area">
        <button class="btn-primary" @click="handleSubmit">提交申请</button>
        <p class="text-auxiliary" style="margin-top: 12px; text-align: center; font-size: 11px;">
          提交后我们将在1-3个工作日内完成审核
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { showToast, showLoadingToast, closeToast } from 'vant';
import { applyKeeper } from '../../api/user';
import { uploadImage } from '../../api/upload';
import { validateKeeperApplication, validateRealName, validateIdCard } from '../../utils/validator';

const router = useRouter();

const form = ref({
  realName: '',
  idCard: '',
  bio: '',
  hourlyRate: '',
  tags: []
});

// 表单错误信息
const errors = ref({});

const certFiles = ref([]);
const uploadingIndex = ref(-1);

const availableTags = ['情感咨询', '倾听陪伴', '压力释放', '成长指导', '树洞倾诉', '心理疗愈'];

function toggleTag(tag) {
  const index = form.value.tags.indexOf(tag);
  if (index > -1) {
    form.value.tags.splice(index, 1);
  } else {
    form.value.tags.push(tag);
  }
  // 清除标签错误
  if (errors.value.tags) {
    delete errors.value.tags;
  }
}

async function afterRead(file, detail) {
  const index = detail.index;
  uploadingIndex.value = index;
  
  try {
    if (file.file) {
      const res = await uploadImage(file.file);
      if (res.code === 200) {
        file.url = res.data.url;
        file.uploaded = true;
        showToast('图片上传成功');
      }
    }
  } catch (error) {
    showToast('图片上传失败');
    // 如果上传失败，移除该文件
    certFiles.value.splice(index, 1);
  } finally {
    uploadingIndex.value = -1;
  }
}

// 验证单个字段
function validateField(field) {
  let check;
  switch (field) {
    case 'realName':
      check = validateRealName(form.value.realName);
      break;
    case 'idCard':
      check = validateIdCard(form.value.idCard);
      break;
  }
  
  if (check) {
    if (check.valid) {
      delete errors.value[field];
    } else {
      errors.value[field] = check.message;
    }
  }
}

async function handleSubmit() {
  // 清除之前的错误
  errors.value = {};
  
  // 收集认证图片URL
  const certImgs = certFiles.value
    .filter(f => f.url || f.content)
    .map(f => f.url || f.content);
  
  // 完整表单验证
  const validation = validateKeeperApplication({
    realName: form.value.realName,
    idCard: form.value.idCard,
    bio: form.value.bio,
    tags: form.value.tags,
    hourlyRate: form.value.hourlyRate,
    certificationImgs: certImgs
  });
  
  if (!validation.valid) {
    errors.value = validation.errors;
    // 显示第一个错误
    const firstError = Object.values(errors.value)[0];
    showToast(firstError);
    return;
  }
  
  showLoadingToast({ message: '提交中...', forbidClick: true });
  
  try {
    // 转换字段名格式
    const submitData = {
      real_name: form.value.realName,
      id_card: form.value.idCard,
      bio: form.value.bio,
      hourly_rate: form.value.hourlyRate,
      tags: form.value.tags,
      certification_imgs: certImgs
    };
    
    const res = await applyKeeper(submitData);
    closeToast();
    
    if (res.code === 200) {
      showToast({ message: '申请已提交', position: 'middle' });
      setTimeout(() => {
        router.back();
      }, 1500);
    }
  } catch (error) {
    closeToast();
    showToast('提交失败，请重试');
  }
}

function goBack() {
  router.back();
}
</script>

<style scoped>
.apply-keeper {
  min-height: 100vh;
  background: #FFFFFF;
}

.apply-form {
  padding: 16px;
}

.form-intro {
  padding: 16px 0 24px;
}

.tags-section,
.cert-section {
  padding: 14px 0;
}

.tags-options {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag-option {
  padding: 6px 14px;
  border: 0.5px solid #EEEEEE;
  border-radius: 2px;
  font-size: 12px;
  color: #666666;
  background: #FFFFFF;
  cursor: pointer;
}

.tag-option.active {
  background: #000000;
  color: #FFFFFF;
  border-color: #000000;
}

.submit-area {
  margin-top: 32px;
  padding-bottom: 24px;
}
</style>
