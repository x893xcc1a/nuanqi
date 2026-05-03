<template>
  <div class="auto-reply">
    <div class="page-header">
      <h2>自动回复</h2>
    </div>

    <div class="content-card">
      <el-tabs v-model="activeTab" type="card">
        <el-tab-pane label="关键字回复" name="keyword">
          <div class="tab-content">
            <div class="toolbar">
              <el-button type="primary" icon="Plus" @click="showAddModal = true">添加</el-button>
              <div class="search-box">
                <el-input placeholder="搜索" prefix-icon="Search" v-model="searchKeyword" />
              </div>
            </div>

            <el-table :data="keywordList" border style="width: 100%">
              <el-table-column prop="id" label="ID" width="80" />
              <el-table-column prop="keyword" label="关键字" width="150" />
              <el-table-column prop="type" label="类型" width="120">
                <template #default="scope">
                  <span class="type-tag">{{ getTypeLabel(scope.row.type) }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="content" label="回复内容" />
              <el-table-column prop="status" label="状态" width="80">
                <template #default="scope">
                  <span class="status-tag" :class="scope.row.status">{{ scope.row.status === 'active' ? '启用' : '禁用' }}</span>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="120">
                <template #default="scope">
                  <el-button size="small" icon="Edit" @click="editKeyword(scope.row)">编辑</el-button>
                  <el-button size="small" icon="Trash" type="danger">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>

        <el-tab-pane label="关注回复" name="follow">
          <div class="tab-content">
            <el-form :model="followForm" label-width="100px">
              <el-form-item label="回复类型">
                <el-radio-group v-model="followForm.type">
                  <el-radio label="图文消息">图文消息</el-radio>
                  <el-radio label="图片">图片</el-radio>
                  <el-radio label="视频">视频</el-radio>
                  <el-radio label="语音">语音</el-radio>
                  <el-radio label="文本">文本</el-radio>
                  <el-radio label="链接">链接</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="回复内容">
                <el-select v-model="followForm.content">
                  <el-option label="欢迎关注" value="1" />
                  <el-option label="感谢关注" value="2" />
                </el-select>
              </el-form-item>
              <el-form-item label="状态">
                <el-switch v-model="followForm.status" active-value="active" inactive-value="inactive" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary">保存</el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-tab-pane>

        <el-tab-pane label="默认回复" name="default">
          <div class="tab-content">
            <el-form :model="defaultForm" label-width="100px">
              <el-form-item label="回复类型">
                <el-radio-group v-model="defaultForm.type">
                  <el-radio label="图文消息">图文消息</el-radio>
                  <el-radio label="图片">图片</el-radio>
                  <el-radio label="视频">视频</el-radio>
                  <el-radio label="语音">语音</el-radio>
                  <el-radio label="文本">文本</el-radio>
                  <el-radio label="链接">链接</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="回复内容">
                <el-select v-model="defaultForm.content">
                  <el-option label="暂无相关内容" value="1" />
                  <el-option label="请重新输入" value="2" />
                </el-select>
              </el-form-item>
              <el-form-item label="状态">
                <el-switch v-model="defaultForm.status" active-value="active" inactive-value="inactive" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary">保存</el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>

    <el-dialog :title="editKeywordForm.id ? '编辑关键字' : '添加关键字'" :visible.sync="showAddModal" width="450px">
      <el-form :model="editKeywordForm" label-width="80px">
        <el-form-item label="关键字" required>
          <el-input v-model="editKeywordForm.keyword" placeholder="请输入关键字，空格确认" />
        </el-form-item>
        <el-form-item label="类型" required>
          <el-radio-group v-model="editKeywordForm.type">
            <el-radio label="图文消息" value="news" />
            <el-radio label="图片" value="image" />
            <el-radio label="视频" value="video" />
            <el-radio label="语音" value="voice" />
            <el-radio label="文本" value="text" />
            <el-radio label="链接" value="link" />
          </el-radio-group>
        </el-form-item>
        <el-form-item label="回复内容" required>
          <el-select v-model="editKeywordForm.content">
            <el-option label="欢迎消息" value="1" />
            <el-option label="帮助信息" value="2" />
            <el-option label="活动通知" value="3" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="editKeywordForm.status">
            <el-radio label="启用" value="active" />
            <el-radio label="禁用" value="inactive" />
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showAddModal = false">取消</el-button>
        <el-button type="primary" @click="saveKeyword">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { ElMessage } from 'element-plus';

const activeTab = ref('keyword');
const searchKeyword = ref('');
const showAddModal = ref(false);

const keywordList = ref([
  { id: 1, keyword: '帮助', type: 'text', content: '帮助信息', status: 'active' },
  { id: 2, keyword: '活动', type: 'news', content: '活动通知', status: 'active' },
  { id: 3, keyword: '客服', type: 'text', content: '联系客服', status: 'active' }
]);

const editKeywordForm = reactive({
  id: null,
  keyword: '',
  type: 'text',
  content: '',
  status: 'active'
});

const followForm = reactive({
  type: 'news',
  content: '1',
  status: 'active'
});

const defaultForm = reactive({
  type: 'text',
  content: '1',
  status: 'active'
});

const typeLabels = {
  news: '图文消息',
  image: '图片',
  video: '视频',
  voice: '语音',
  text: '文本',
  link: '链接'
};

function getTypeLabel(type) {
  return typeLabels[type] || type;
}

function resetForm() {
  editKeywordForm.id = null;
  editKeywordForm.keyword = '';
  editKeywordForm.type = 'text';
  editKeywordForm.content = '';
  editKeywordForm.status = 'active';
}

function editKeyword(row) {
  Object.assign(editKeywordForm, row);
  showAddModal.value = true;
}

function saveKeyword() {
  if (!editKeywordForm.keyword) {
    ElMessage.error('请输入关键字');
    return;
  }
  if (editKeywordForm.id) {
    const index = keywordList.value.findIndex(k => k.id === editKeywordForm.id);
    if (index > -1) {
      keywordList.value[index] = { ...editKeywordForm };
    }
    ElMessage.success('修改成功');
  } else {
    const newId = Math.max(...keywordList.value.map(k => k.id)) + 1;
    keywordList.value.push({ ...editKeywordForm, id: newId });
    ElMessage.success('添加成功');
  }
  showAddModal.value = false;
  resetForm();
}
</script>

<style scoped>
.auto-reply {
  padding: 20px;
}

.page-header {
  margin-bottom: 20px;
}

.page-header h2 {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.content-card {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.tab-content {
  padding: 20px;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.search-box {
  width: 200px;
}

.type-tag {
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 12px;
  background: #e8f5e9;
  color: #2e7d32;
}

.status-tag {
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 12px;
}

.status-tag.active {
  background: #e8f5e9;
  color: #2e7d32;
}

.status-tag.inactive {
  background: #ffebee;
  color: #c62828;
}
</style>