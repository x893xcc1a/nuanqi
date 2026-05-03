<template>
  <div class="users-page">
    <!-- 筛选栏 -->
    <el-card shadow="never" class="filter-card">
      <el-form :inline="true" :model="filterForm">
        <el-form-item label="关键词">
          <el-input v-model="filterForm.keyword" placeholder="昵称/OpenID" clearable />
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="filterForm.role" placeholder="全部" clearable>
            <el-option label="访客" value="seeker" />
            <el-option label="守护者" value="keeper" />
            <el-option label="两者" value="both" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="filterForm.status" placeholder="全部" clearable>
            <el-option label="正常" value="active" />
            <el-option label="禁用" value="banned" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="resetFilter">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    
    <!-- 数据表格 -->
    <el-card shadow="never" class="table-card">
      <el-table :data="userList" v-loading="loading" stripe>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column label="头像" width="80">
          <template #default="{ row }">
            <el-avatar :size="40" :src="row.avatar_url" />
          </template>
        </el-table-column>
        <el-table-column prop="nickname" label="昵称" />
        <el-table-column prop="openid" label="OpenID" show-overflow-tooltip />
        <el-table-column prop="role" label="角色">
          <template #default="{ row }">
            <el-tag :type="row.role === 'seeker' ? '' : 'info'">
              {{ roleMap[row.role] }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态">
          <template #default="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : 'danger'">
              {{ statusMap[row.status] }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="created_at" label="注册时间" />
        <el-table-column label="操作" width="150">
          <template #default="{ row }">
            <el-button 
              v-if="row.status === 'active'"
              type="danger" 
              link
              @click="banUser(row)"
            >
              封禁
            </el-button>
            <el-button 
              v-else
              type="success" 
              link
              @click="unbanUser(row)"
            >
              解封
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <!-- 分页 -->
      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.limit"
          :total="pagination.total"
          layout="total, prev, pager, next"
          @change="handlePageChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { getUsers, updateUserStatus } from '../../api/admin';

const loading = ref(false);
const userList = ref([]);

const filterForm = reactive({
  keyword: '',
  role: '',
  status: ''
});

const pagination = reactive({
  page: 1,
  limit: 20,
  total: 0
});

const roleMap = {
  seeker: '访客',
  keeper: '守护者',
  both: '两者'
};

const statusMap = {
  active: '正常',
  banned: '禁用',
  inactive: '未激活'
};

async function loadData() {
  loading.value = true;
  
  try {
    const res = await getUsers({
      ...filterForm,
      page: pagination.page,
      limit: pagination.limit
    });
    
    if (res.code === 200) {
      userList.value = res.data.list;
      pagination.total = res.data.total;
    }
  } catch (error) {
    console.error('Load users error:', error);
  } finally {
    loading.value = false;
  }
}

function handleSearch() {
  pagination.page = 1;
  loadData();
}

function resetFilter() {
  filterForm.keyword = '';
  filterForm.role = '';
  filterForm.status = '';
  handleSearch();
}

function handlePageChange() {
  loadData();
}

async function banUser(row) {
  try {
    await ElMessageBox.confirm(`确认封禁用户 "${row.nickname || row.id}"？`, '提示', {
      type: 'warning'
    });
    
    const res = await updateUserStatus(row.id, 'banned');
    if (res.code === 200) {
      ElMessage.success('已封禁');
      loadData();
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('Ban user error:', error);
    }
  }
}

async function unbanUser(row) {
  try {
    await ElMessageBox.confirm(`确认解封用户 "${row.nickname || row.id}"？`, '提示');
    
    const res = await updateUserStatus(row.id, 'active');
    if (res.code === 200) {
      ElMessage.success('已解封');
      loadData();
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('Unban user error:', error);
    }
  }
}

onMounted(() => {
  loadData();
});
</script>

<style scoped>
.filter-card {
  margin-bottom: 16px;
  border: 1px solid #EEEEEE;
  border-radius: 2px;
}

.table-card {
  border: 1px solid #EEEEEE;
  border-radius: 2px;
}

.pagination-wrapper {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
}
</style>
