<template>
  <div class="coupons">
    <div class="page-header">
      <h2>优惠券管理</h2>
    </div>

    <div class="content-card">
      <div class="card-header">
        <el-button type="primary" icon="Plus">添加优惠券</el-button>
        <div class="search-box">
          <el-input placeholder="搜索优惠券" prefix-icon="Search" v-model="searchKeyword" />
        </div>
      </div>

      <el-table :data="couponList" border style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="优惠券名称" width="150" />
        <el-table-column prop="type" label="类型" width="100">
          <template #default="scope">
            <span class="type-tag">{{ getTypeLabel(scope.row.type) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="value" label="面额" width="100">
          <template #default="scope">
            <span class="value-tag">¥{{ scope.row.value }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="minAmount" label="最低消费" width="100">
          <template #default="scope">
            ¥{{ scope.row.minAmount || 0 }}
          </template>
        </el-table-column>
        <el-table-column prop="total" label="总量" width="80" />
        <el-table-column prop="used" label="已使用" width="80" />
        <el-table-column prop="startTime" label="开始时间" width="160" />
        <el-table-column prop="endTime" label="结束时间" width="160" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <span class="status-tag" :class="scope.row.status">{{ getStatusLabel(scope.row.status) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="160">
          <template #default="scope">
            <el-button size="small" icon="Edit">编辑</el-button>
            <el-button size="small" icon="Copy">复制</el-button>
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
  </div>
</template>

<script setup>
import { ref } from 'vue';

const searchKeyword = ref('');
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);

const couponList = ref([
  { id: 1, name: '新人专享券', type: 'new_user', value: 10, minAmount: 50, total: 1000, used: 345, startTime: '2026-01-01 00:00:00', endTime: '2026-12-31 23:59:59', status: 'active' },
  { id: 2, name: '满减优惠券', type: 'discount', value: 20, minAmount: 100, total: 500, used: 123, startTime: '2026-01-10 00:00:00', endTime: '2026-01-20 23:59:59', status: 'active' },
  { id: 3, name: '限时折扣券', type: 'discount', value: 50, minAmount: 200, total: 200, used: 89, startTime: '2026-01-15 00:00:00', endTime: '2026-01-18 23:59:59', status: 'ended' }
]);

total.value = couponList.value.length;

const typeLabels = {
  new_user: '新人券',
  discount: '满减券',
  gift: '礼品券',
  free: '免费券'
};

const statusLabels = {
  active: '进行中',
  ended: '已结束',
  pending: '待开始'
};

function getTypeLabel(type) {
  return typeLabels[type] || type;
}

function getStatusLabel(status) {
  return statusLabels[status] || status;
}
</script>

<style scoped>
.coupons {
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

.type-tag {
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 12px;
  background: #e8f5e9;
  color: #2e7d32;
}

.value-tag {
  font-size: 14px;
  font-weight: 600;
  color: #e65100;
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

.status-tag.ended {
  background: #f5f5f5;
  color: #999;
}

.status-tag.pending {
  background: #fff3e0;
  color: #e65100;
}

.pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #e8e8e8;
}
</style>