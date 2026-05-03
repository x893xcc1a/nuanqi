<template>
  <div class="common-words">
    <div class="page-header">
      <h2>常用语</h2>
    </div>

    <div class="content-card">
      <div class="card-header">
        <el-button type="primary" icon="Plus" @click="showAddModal = true">添加常用语</el-button>
        <div class="search-box">
          <el-input placeholder="搜索常用语" prefix-icon="Search" v-model="searchKeyword" />
        </div>
      </div>

      <el-table :data="commonList" border style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="category" label="分类" width="120" />
        <el-table-column prop="content" label="常用语内容" />
        <el-table-column prop="sort" label="排序" width="80" />
        <el-table-column prop="status" label="状态" width="80">
          <template #default="scope">
            <el-switch :value="scope.row.status === 'active'" @change="toggleStatus(scope.row)" />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="160">
          <template #default="scope">
            <el-button size="small" icon="Edit" @click="editCommon(scope.row)">编辑</el-button>
            <el-button size="small" icon="Trash" type="danger">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination
          :current-page="currentPage"
          :page-size="pageSize"
          :total="total"
          layout="prev, pager, next, jumper, ->, total"
        />
      </div>
    </div>

    <el-dialog :title="editForm.id ? '编辑常用语' : '添加常用语'" :visible.sync="showAddModal" width="450px">
      <el-form :model="editForm" label-width="80px">
        <el-form-item label="分类" required>
          <el-select v-model="editForm.category">
            <el-option label="问候语" value="greeting" />
            <el-option label="结束语" value="ending" />
            <el-option label="引导语" value="guide" />
            <el-option label="其他" value="other" />
          </el-select>
        </el-form-item>
        <el-form-item label="常用语内容" required>
          <el-textarea v-model="editForm.content" :rows="4" placeholder="请输入常用语内容" />
        </el-form-item>
        <el-form-item label="排序">
          <el-input v-model.number="editForm.sort" type="number" />
        </el-form-item>
        <el-form-item label="状态">
          <el-switch v-model="editForm.status" active-value="active" inactive-value="inactive" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showAddModal = false">取消</el-button>
        <el-button type="primary" @click="saveCommon">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { ElMessage } from 'element-plus';

const searchKeyword = ref('');
const showAddModal = ref(false);
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);

const commonList = ref([
  { id: 1, category: 'greeting', content: '您好，请问有什么可以帮助您的？', sort: 1, status: 'active' },
  { id: 2, category: 'greeting', content: '您好，欢迎咨询！', sort: 2, status: 'active' },
  { id: 3, category: 'ending', content: '感谢您的咨询，祝您生活愉快！', sort: 1, status: 'active' },
  { id: 4, category: 'guide', content: '请点击下方按钮开始聊天', sort: 1, status: 'active' }
]);

total.value = commonList.value.length;

const editForm = reactive({
  id: null,
  category: 'greeting',
  content: '',
  sort: 0,
  status: 'active'
});

function resetForm() {
  editForm.id = null;
  editForm.category = 'greeting';
  editForm.content = '';
  editForm.sort = 0;
  editForm.status = 'active';
}

function editCommon(row) {
  Object.assign(editForm, row);
  showAddModal.value = true;
}

function saveCommon() {
  if (!editForm.content) {
    ElMessage.error('请输入常用语内容');
    return;
  }
  if (editForm.id) {
    const index = commonList.value.findIndex(c => c.id === editForm.id);
    if (index > -1) {
      commonList.value[index] = { ...editForm };
    }
    ElMessage.success('修改成功');
  } else {
    const newId = Math.max(...commonList.value.map(c => c.id)) + 1;
    commonList.value.push({ ...editForm, id: newId });
    total.value++;
    ElMessage.success('添加成功');
  }
  showAddModal.value = false;
  resetForm();
}

function toggleStatus(row) {
  row.status = row.status === 'active' ? 'inactive' : 'active';
}
</script>

<style scoped>
.common-words {
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
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.search-box {
  width: 250px;
}

.pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #e8e8e8;
}
</style>