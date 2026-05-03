<template>
  <div class="settings-page">
    <el-card shadow="never" class="settings-card">
      <template #header>
        <span>系统设置</span>
      </template>
      
      <el-form :model="settings" label-width="120px">
        <el-form-item label="网站名称">
          <el-input v-model="settings.siteName" />
        </el-form-item>
        
        <el-form-item label="客服电话">
          <el-input v-model="settings.servicePhone" />
        </el-form-item>
        
        <el-form-item label="守护者审核">
          <el-switch v-model="settings.autoApprove" active-text="自动通过" inactive-text="人工审核" />
        </el-form-item>
        
        <el-form-item label="广场审核">
          <el-switch v-model="settings.postAutoApprove" active-text="自动通过" inactive-text="人工审核" />
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" @click="saveSettings">保存设置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import { ElMessage } from 'element-plus';

const settings = reactive({
  siteName: '暖栖港湾',
  servicePhone: '',
  autoApprove: false,
  postAutoApprove: false
});

function saveSettings() {
  // 实际项目中调用API保存
  ElMessage.success('设置已保存');
}
</script>

<style scoped>
.settings-card {
  max-width: 600px;
  border: 1px solid #EEEEEE;
  border-radius: 2px;
}
</style>
