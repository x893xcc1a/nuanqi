<template>
  <div class="service-levels">
    <div class="page-header">
      <h2>店员等级配置</h2>
    </div>

    <div class="content-card">
      <div class="card-header">
        <el-button type="primary" icon="Plus" @click="showAddModal = true">添加等级</el-button>
      </div>

      <el-table :data="levelList" border style="width: 100%">
        <el-table-column prop="id" label="Id" width="80" />
        <el-table-column prop="name" label="等级名称" width="120" />
        <el-table-column prop="icon" label="图标" width="100">
          <template #default="scope">
            <span class="level-icon">{{ scope.row.icon }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="minScore" label="最低积分" width="100" />
        <el-table-column prop="maxScore" label="最高积分" width="100" />
        <el-table-column prop="discount" label="折扣(%)" width="100" />
        <el-table-column prop="color" label="颜色" width="100">
          <template #default="scope">
            <span class="color-preview" :style="{ backgroundColor: scope.row.color }"></span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="80">
          <template #default="scope">
            <el-switch :value="scope.row.status === 'active'" @change="toggleStatus(scope.row)" />
          </template>
        </el-table-column>
        <el-table-column prop="sort" label="排序" width="80" />
        <el-table-column label="操作" width="180">
          <template #default="scope">
            <el-button size="small" icon="Edit" @click="editLevel(scope.row)">编辑</el-button>
            <el-button size="small" icon="Trash" type="danger" @click="deleteLevel(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog :title="editForm.id ? '编辑等级' : '添加等级'" :visible.sync="showAddModal" width="400px">
      <el-form :model="editForm" label-width="80px">
        <el-form-item label="等级名称" required>
          <el-input v-model="editForm.name" placeholder="请输入等级名称" />
        </el-form-item>
        <el-form-item label="图标" required>
          <el-input v-model="editForm.icon" placeholder="请输入图标emoji" />
        </el-form-item>
        <el-form-item label="最低积分" required>
          <el-input v-model.number="editForm.minScore" type="number" placeholder="最低积分" />
        </el-form-item>
        <el-form-item label="最高积分">
          <el-input v-model.number="editForm.maxScore" type="number" placeholder="最高积分(0表示不限)" />
        </el-form-item>
        <el-form-item label="折扣(%)" required>
          <el-input v-model.number="editForm.discount" type="number" placeholder="服务折扣百分比" />
        </el-form-item>
        <el-form-item label="颜色" required>
          <el-color-picker v-model="editForm.color" />
        </el-form-item>
        <el-form-item label="排序">
          <el-input v-model.number="editForm.sort" type="number" placeholder="排序数字" />
        </el-form-item>
        <el-form-item label="状态">
          <el-switch v-model="editForm.status" active-value="active" inactive-value="inactive" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showAddModal = false">取消</el-button>
        <el-button type="primary" @click="saveLevel">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';

const levelList = ref([
  { id: 1, name: '普通店员', icon: '⭐', minScore: 0, maxScore: 1000, discount: 100, color: '#909399', status: 'active', sort: 1 },
  { id: 2, name: '金牌店员', icon: '🥇', minScore: 1000, maxScore: 5000, discount: 95, color: '#ffd700', status: 'active', sort: 2 },
  { id: 3, name: '镇店店员', icon: '👑', minScore: 5000, maxScore: 10000, discount: 90, color: '#ff6b6b', status: 'active', sort: 3 },
  { id: 4, name: '女神', icon: '💎', minScore: 10000, maxScore: 20000, discount: 85, color: '#e84393', status: 'active', sort: 4 },
  { id: 5, name: '男神', icon: '🌟', minScore: 10000, maxScore: 20000, discount: 85, color: '#0984e3', status: 'active', sort: 5 },
  { id: 6, name: '首席', icon: '🏆', minScore: 20000, maxScore: 50000, discount: 80, color: '#6c5ce7', status: 'active', sort: 6 },
  { id: 7, name: '锦鲤', icon: '🐠', minScore: 50000, maxScore: 100000, discount: 75, color: '#fdcb6e', status: 'active', sort: 7 },
  { id: 8, name: '店长', icon: '👔', minScore: 100000, maxScore: 0, discount: 70, color: '#2d3436', status: 'active', sort: 8 }
]);

const showAddModal = ref(false);
const editForm = reactive({
  id: null,
  name: '',
  icon: '',
  minScore: 0,
  maxScore: 0,
  discount: 100,
  color: '#3b82f6',
  sort: 0,
  status: 'active'
});

function resetForm() {
  editForm.id = null;
  editForm.name = '';
  editForm.icon = '';
  editForm.minScore = 0;
  editForm.maxScore = 0;
  editForm.discount = 100;
  editForm.color = '#3b82f6';
  editForm.sort = 0;
  editForm.status = 'active';
}

function editLevel(row) {
  Object.assign(editForm, row);
  showAddModal.value = true;
}

async function saveLevel() {
  if (!editForm.name) {
    ElMessage.error('请输入等级名称');
    return;
  }
  if (editForm.id) {
    const index = levelList.value.findIndex(l => l.id === editForm.id);
    if (index > -1) {
      levelList.value[index] = { ...editForm };
    }
    ElMessage.success('修改成功');
  } else {
    const newId = Math.max(...levelList.value.map(l => l.id)) + 1;
    levelList.value.push({ ...editForm, id: newId });
    ElMessage.success('添加成功');
  }
  showAddModal.value = false;
  resetForm();
}

async function deleteLevel(row) {
  try {
    await ElMessageBox.confirm('确认删除该等级？', '提示', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning'
    });
    levelList.value = levelList.value.filter(l => l.id !== row.id);
    ElMessage.success('删除成功');
  } catch (error) {
    // 取消
  }
}

function toggleStatus(row) {
  row.status = row.status === 'active' ? 'inactive' : 'active';
  ElMessage.success(`已${row.status === 'active' ? '启用' : '禁用'}该等级`);
}
</script>

<style scoped>
.service-levels {
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
  justify-content: flex-end;
  margin-bottom: 20px;
}

.level-icon {
  font-size: 20px;
}

.color-preview {
  display: inline-block;
  width: 24px;
  height: 24px;
  border-radius: 4px;
  border: 1px solid #e8e8e8;
}
</style>