<template>
  <div class="system-settings-page">
    <el-card shadow="never" class="page-card">
      <div class="card-header">
        <el-tabs v-model="activeTab" class="config-tabs">
          <el-tab-pane label="基础配置" name="basic"></el-tab-pane>
          <el-tab-pane label="运营配置" name="operation"></el-tab-pane>
          <el-tab-pane label="首单体验" name="first"></el-tab-pane>
          <el-tab-pane label="短信通知" name="sms"></el-tab-pane>
          <el-tab-pane label="下单播报" name="order"></el-tab-pane>
          <el-tab-pane label="提现配置" name="withdraw"></el-tab-pane>
          <el-tab-pane label="AI聊天" name="ai"></el-tab-pane>
          <el-tab-pane label="字典配置" name="dictionary"></el-tab-pane>
          <el-tab-pane label="邮件配置" name="email"></el-tab-pane>
          <el-tab-pane label="+" name="add"></el-tab-pane>
        </el-tabs>
      </div>

      <div v-if="activeTab === 'dictionary'" class="config-content">
        <div class="config-section">
          <div class="section-header">
            <span class="section-title">分类类型</span>
            <span class="section-variable">{Ssite.categorytype}</span>
          </div>
          <div class="key-value-list">
            <div class="key-value-item" v-for="(item, index) in categoryTypes" :key="index">
              <input v-model="item.key" class="key-input" placeholder="键名" />
              <input v-model="item.value" class="value-input" placeholder="键值" />
              <el-button size="small" type="danger" icon="Delete"></el-button>
              <el-button size="small" type="primary" icon="Plus"></el-button>
            </div>
            <el-button type="success" icon="Plus" class="add-btn">添加</el-button>
          </div>
        </div>

        <div class="config-section">
          <div class="section-header">
            <span class="section-title">配置分组</span>
            <span class="section-variable">{Ssite.configgroup}</span>
          </div>
          <div class="key-value-list">
            <div class="key-value-item" v-for="(item, index) in configGroups" :key="index">
              <input v-model="item.key" class="key-input" placeholder="键名" />
              <input v-model="item.value" class="value-input" placeholder="键值" />
              <el-button size="small" type="danger" icon="Delete"></el-button>
              <el-button size="small" type="primary" icon="Plus"></el-button>
            </div>
            <el-button type="success" icon="Plus" class="add-btn">添加</el-button>
          </div>
        </div>

        <div class="config-section">
          <div class="section-header">
            <span class="section-title">附件类别</span>
            <span class="section-variable">{Ssite.attachmentcategory}</span>
          </div>
          <div class="key-value-list">
            <div class="key-value-item" v-for="(item, index) in attachmentCategories" :key="index">
              <input v-model="item.key" class="key-input" placeholder="键名" />
              <input v-model="item.value" class="value-input" placeholder="键值" />
              <el-button size="small" type="danger" icon="Delete"></el-button>
              <el-button size="small" type="primary" icon="Plus"></el-button>
            </div>
            <el-button type="success" icon="Plus" class="add-btn">添加</el-button>
          </div>
        </div>
      </div>

      <div v-else-if="activeTab === 'email'" class="config-content">
        <el-form :model="emailForm" label-width="150px" class="config-form">
          <el-form-item label="邮件发送方式">
            <el-select v-model="emailForm.type" placeholder="请选择">
              <el-option label="SMTP" value="smtp"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="SMTP服务器">
            <el-input v-model="emailForm.smtpHost" placeholder="smtp.qq.com"></el-input>
          </el-form-item>
          <el-form-item label="SMTP端口">
            <el-input v-model="emailForm.smtpPort" type="number"></el-input>
          </el-form-item>
          <el-form-item label="SMTP用户名">
            <el-input v-model="emailForm.smtpUser"></el-input>
          </el-form-item>
          <el-form-item label="SMTP密码">
            <el-input v-model="emailForm.smtpPass" type="password"></el-input>
          </el-form-item>
          <el-form-item label="SMTP验证方式">
            <el-select v-model="emailForm.verifyType" placeholder="请选择">
              <el-option label="SSL" value="ssl"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="发件人邮箱">
            <el-input v-model="emailForm.fromEmail"></el-input>
            <el-button type="primary">发送测试邮件</el-button>
          </el-form-item>
          <div class="form-actions">
            <el-button type="primary">确定</el-button>
            <el-button>重置</el-button>
          </div>
        </el-form>
      </div>

      <div v-else class="config-content">
        <div class="empty-tip">请选择左侧配置项</div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { Delete, Plus } from '@element-plus/icons-vue';

const activeTab = ref('dictionary');

const categoryTypes = reactive([
  { key: 'default', value: '默认' },
  { key: 'page', value: '单页' },
  { key: 'article', value: '文章' },
  { key: 'test', value: 'Test' }
]);

const configGroups = reactive([
  { key: 'basic', value: '基础配置' },
  { key: 'example', value: '运营配置' },
  { key: 'experience', value: '首单体验' },
  { key: 'smsnotice', value: '短信通知' },
  { key: 'orderservice', value: '下单播报' },
  { key: 'withdraw', value: '提现配置' },
  { key: 'deepseek', value: 'AI聊天' },
  { key: 'dictionary', value: '字典配置' },
  { key: 'email', value: '邮件配置' }
]);

const attachmentCategories = reactive([
  { key: 'category1', value: '分类一' },
  { key: 'category2', value: '分类二' },
  { key: 'custom', value: '自定义' }
]);

const emailForm = reactive({
  type: 'smtp',
  smtpHost: 'smtp.qq.com',
  smtpPort: 465,
  smtpUser: '10000',
  smtpPass: 'password',
  verifyType: 'SSL',
  fromEmail: '10000@qq.com'
});
</script>

<style scoped>
.system-settings-page {
  padding: 0;
}

.page-card {
  border-radius: 4px;
  border: 1px solid #e8e8e8;
}

.card-header {
  padding-bottom: 16px;
  border-bottom: 1px solid #e8e8e8;
  margin-bottom: 16px;
}

.config-tabs {
  width: 100%;
}

.config-content {
  padding: 16px;
}

.config-section {
  margin-bottom: 24px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px dashed #e8e8e8;
}

.section-title {
  font-weight: 600;
  color: #333;
}

.section-variable {
  font-size: 12px;
  color: #999;
  font-family: monospace;
}

.key-value-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.key-value-item {
  display: flex;
  gap: 8px;
  align-items: center;
}

.key-input, .value-input {
  flex: 1;
  max-width: 200px;
}

.add-btn {
  margin-top: 8px;
}

.config-form {
  max-width: 800px;
}

.form-actions {
  margin-top: 24px;
  display: flex;
  gap: 12px;
}

.empty-tip {
  text-align: center;
  color: #999;
  padding: 40px;
}
</style>
