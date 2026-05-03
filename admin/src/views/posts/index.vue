<template>
  <div class="posts-page">
    <el-card shadow="never" class="table-card">
      <template #header>
        <div class="card-header">
          <span>内容审核</span>
          <el-radio-group v-model="activeStatus" size="small" @change="handleStatusChange">
            <el-radio-button label="pending">待审核</el-radio-button>
            <el-radio-button label="approved">已通过</el-radio-button>
            <el-radio-button label="rejected">已拒绝</el-radio-button>
          </el-radio-group>
        </div>
      </template>
      
      <el-table :data="postList" v-loading="loading" stripe>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column label="发布者" width="120">
          <template #default="{ row }">
            <span v-if="row.is_anonymous" class="anonymous-tag">{{ row.lighthouse_no }}</span>
            <span v-else>{{ row.author?.nickname || '匿名' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="content" label="内容" show-overflow-tooltip />
        <el-table-column prop="mood_tag" label="情绪标签" width="100" />
        <el-table-column prop="likes_count" label="点赞" width="80" />
        <el-table-column prop="created_at" label="发布时间" />
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
import { getAdminPosts, reviewPost } from '../../api/admin';

const loading = ref(false);
const postList = ref([]);
const activeStatus = ref('pending');

const pagination = reactive({
  page: 1,
  limit: 20,
  total: 0
});

async function loadData() {
  loading.value = true;
  
  try {
    const res = await getAdminPosts({
      status: activeStatus.value,
      page: pagination.page,
      limit: pagination.limit
    });
    
    if (res.code === 200) {
      postList.value = res.data.list;
      pagination.total = res.data.total;
    }
  } catch (error) {
    console.error('Load posts error:', error);
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
    await ElMessageBox.confirm('确认通过该动态？', '提示');
    
    const res = await reviewPost(row.id, { status: 'approved' });
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
    await ElMessageBox.confirm('确认拒绝该动态？', '提示', {
      type: 'warning'
    });
    
    const res = await reviewPost(row.id, { status: 'rejected' });
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

.anonymous-tag {
  color: #999999;
  font-size: 12px;
}

.pagination-wrapper {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
}
</style>
