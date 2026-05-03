<template>
  <div class="keepers-page">
    <el-card shadow="never" class="table-card">
      <template #header>
        <div class="card-header">
          <span>守护者审核</span>
          <el-radio-group v-model="activeStatus" size="small" @change="handleStatusChange">
            <el-radio-button label="pending">待审核</el-radio-button>
            <el-radio-button label="approved">已通过</el-radio-button>
            <el-radio-button label="rejected">已拒绝</el-radio-button>
          </el-radio-group>
        </div>
      </template>
      
      <el-table :data="keeperList" v-loading="loading" stripe>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column label="申请人" width="120">
          <template #default="{ row }">
            <div class="user-cell">
              <el-avatar :size="32" :src="row.user?.avatar_url" />
              <span>{{ row.user?.nickname || '匿名' }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="bio" label="简介" show-overflow-tooltip />
        <el-table-column prop="tags" label="标签">
          <template #default="{ row }">
            <el-tag v-for="tag in (row.tags || []).slice(0, 3)" :key="tag" size="small" class="tag-item">
              {{ tag }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="hourly_rate" label="价格">
          <template #default="{ row }">
            ¥{{ (row.hourly_rate / 100).toFixed(0) }}/时
          </template>
        </el-table-column>
        <el-table-column prop="created_at" label="申请时间" />
        <el-table-column label="操作" width="200" v-if="activeStatus === 'pending'">
          <template #default="{ row }">
            <el-button type="primary" link @click="approve(row)">通过</el-button>
            <el-button type="danger" link @click="reject(row)">拒绝</el-button>
          </template>
        </el-table-column>
      </el-table>
      
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
import { getKeeperApplications, reviewKeeper } from '../../api/admin';

const loading = ref(false);
const keeperList = ref([]);
const activeStatus = ref('pending');

const pagination = reactive({
  page: 1,
  limit: 20,
  total: 0
});

async function loadData() {
  loading.value = true;
  
  try {
    const res = await getKeeperApplications({
      status: activeStatus.value,
      page: pagination.page,
      limit: pagination.limit
    });
    
    if (res.code === 200) {
      keeperList.value = res.data.list;
      pagination.total = res.data.total;
    }
  } catch (error) {
    console.error('Load keepers error:', error);
  } finally {
    loading.value = false;
  }
}

function handleStatusChange() {
  pagination.page = 1;
  loadData();
}

function handlePageChange() {
  loadData();
}

async function approve(row) {
  try {
    await ElMessageBox.confirm(`确认通过 "${row.user?.nickname || row.id}" 的守护者申请？`, '提示');
    
    const res = await reviewKeeper(row.id, { status: 'approved' });
    if (res.code === 200) {
      ElMessage.success('审核通过');
      loadData();
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('Approve error:', error);
    }
  }
}

async function reject(row) {
  try {
    await ElMessageBox.confirm(`确认拒绝 "${row.user?.nickname || row.id}" 的守护者申请？`, '提示', {
      type: 'warning'
    });
    
    const res = await reviewKeeper(row.id, { status: 'rejected' });
    if (res.code === 200) {
      ElMessage.success('已拒绝');
      loadData();
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('Reject error:', error);
    }
  }
}

onMounted(() => {
  loadData();
});
</script>

<style scoped>
.table-card {
  border: 1px solid #EEEEEE;
  border-radius: 2px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.user-cell {
  display: flex;
  align-items: center;
  gap: 8px;
}

.tag-item {
  margin-right: 4px;
}

.pagination-wrapper {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
}
</style>
