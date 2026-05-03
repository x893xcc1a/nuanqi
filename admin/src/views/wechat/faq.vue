<template>
  <div class="faq">
    <div class="page-header">
      <h2>常见问题</h2>
    </div>

    <div class="content-card">
      <div class="card-header">
        <el-button type="primary" icon="Plus" @click="showAddModal = true">添加问题</el-button>
        <div class="search-box">
          <el-input placeholder="搜索问题" prefix-icon="Search" v-model="searchKeyword" />
        </div>
      </div>

      <el-table :data="faqList" border style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="question" label="问题" width="200" />
        <el-table-column prop="answer" label="答案" />
        <el-table-column prop="sort" label="排序" width="80" />
        <el-table-column prop="status" label="状态" width="80">
          <template #default="scope">
            <el-switch :value="scope.row.status === 'active'" @change="toggleStatus(scope.row)" />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="160">
          <template #default="scope">
            <el-button size="small" icon="Edit" @click="editFaq(scope.row)">编辑</el-button>
            <el-button size="small" icon="Trash" type="danger">删除</el-button>
          </template>
        </el-table-column>
      </div>

      <div class="pagination">
        <el-pagination
          :current-page="currentPage"
          :page-size="pageSize"
          :total="total"
          layout="prev, pager, next, jumper, ->, total"
        />
      </div>
    </div>

    <el-dialog :title="editForm.id ? '编辑问题' : '添加问题'" :visible.sync="showAddModal" width="500px">
      <el-form :model="editForm" label-width="80px">
        <el-form-item label="问题" required>
          <el-input v-model="editForm.question" placeholder="请输入问题" />
        </el-form-item>
        <el-form-item label="答案" required>
          <el-textarea v-model="editForm.answer" :rows="6" placeholder="请输入答案" />
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
        <el-button type="primary" @click="saveFaq">确定</el-button>
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

const faqList = ref([
  { id: 1, question: '如何注册账号？', answer: '您可以通过微信登录直接注册，无需额外注册流程。', sort: 1, status: 'active' },
  { id: 2, question: '如何联系客服？', answer: '在首页点击客服按钮即可联系在线客服。', sort: 2, status: 'active' },
  { id: 3, question: '如何充值？', answer: '在个人中心点击钱包，选择充值方式进行充值。', sort: 3, status: 'active' },
  { id: 4, question: '订单如何取消？', answer: '在订单列表中找到对应订单，点击取消订单按钮即可。', sort: 4, status: 'active' }
]);

total.value = faqList.value.length;

const editForm = reactive({
  id: null,
  question: '',
  answer: '',
  sort: 0,
  status: 'active'
});

function resetForm() {
  editForm.id = null;
  editForm.question = '';
  editForm.answer = '';
  editForm.sort = 0;
  editForm.status = 'active';
}

function editFaq(row) {
  Object.assign(editForm, row);
  showAddModal.value = true;
}

function saveFaq() {
  if (!editForm.question) {
    ElMessage.error('请输入问题');
    return;
  }
  if (!editForm.answer) {
    ElMessage.error('请输入答案');
    return;
  }
  if (editForm.id) {
    const index = faqList.value.findIndex(f => f.id === editForm.id);
    if (index > -1) {
      faqList.value[index] = { ...editForm };
    }
    ElMessage.success('修改成功');
  } else {
    const newId = Math.max(...faqList.value.map(f => f.id)) + 1;
    faqList.value.push({ ...editForm, id: newId });
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
.faq {
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