<template>
  <div class="orders">
    <div class="page-header">
      <h2>订单中心</h2>
    </div>

    <div class="content-card">
      <div class="card-header">
        <div class="search-box">
          <el-input placeholder="搜索订单编号" prefix-icon="Search" v-model="searchKeyword" />
        </div>
        <div class="filter-group">
          <el-select v-model="filterStatus" placeholder="订单状态" clearable size="small">
            <el-option label="全部" value="" />
            <el-option label="待支付" value="unpaid" />
            <el-option label="已支付" value="paid" />
            <el-option label="进行中" value="serving" />
            <el-option label="已完成" value="completed" />
            <el-option label="已取消" value="cancelled" />
          </el-select>
          <el-select v-model="filterDate" placeholder="时间范围" clearable size="small">
            <el-option label="今日" value="today" />
            <el-option label="本周" value="week" />
            <el-option label="本月" value="month" />
            <el-option label="自定义" value="custom" />
          </el-select>
        </div>
      </div>

      <el-table :data="orderList" border style="width: 100%">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="order_no" label="订单编号" width="180" />
        <el-table-column prop="userInfo" label="用户信息" width="180">
          <template #default="scope">
            <div class="user-info">
              <img :src="scope.row.avatar" class="avatar" />
              <div class="info">
                <span class="name">{{ scope.row.nickname }}</span>
                <span class="phone">{{ scope.row.phone }}</span>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="serviceType" label="服务类型" width="120">
          <template #default="scope">
            <span class="type-tag">{{ scope.row.serviceType }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="amount" label="金额" width="100">
          <template #default="scope">
            <span class="amount-tag">¥{{ scope.row.amount }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <span class="status-tag" :class="scope.row.status">{{ getStatusLabel(scope.row.status) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column prop="payTime" label="支付时间" width="180" />
        <el-table-column label="操作" width="160">
          <template #default="scope">
            <el-button size="small" text type="primary">详情</el-button>
            <el-button size="small" text type="primary">退款</el-button>
            <el-button size="small" text type="danger">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="table-footer">
        <span>已选择 0 项</span>
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
  </div>
</template>

<script setup>
import { ref } from 'vue';

const searchKeyword = ref('');
const filterStatus = ref('');
const filterDate = ref('');
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(100);

const orderList = ref([
  { id: 1, order_no: 'ORD202601010001', avatar: '', nickname: '用户A', phone: '138****8888', serviceType: '文字语音条', amount: '100.00', status: 'completed', createTime: '2026-01-01 10:00:00', payTime: '2026-01-01 10:05:00' },
  { id: 2, order_no: 'ORD202601010002', avatar: '', nickname: '用户B', phone: '139****9999', serviceType: '语音连麦', amount: '200.00', status: 'serving', createTime: '2026-01-01 11:00:00', payTime: '2026-01-01 11:02:00' },
  { id: 3, order_no: 'ORD202601010003', avatar: '', nickname: '用户C', phone: '137****7777', serviceType: '盲盒商品', amount: '50.00', status: 'paid', createTime: '2026-01-01 12:00:00', payTime: '2026-01-01 12:01:00' },
  { id: 4, order_no: 'ORD202601010004', avatar: '', nickname: '用户D', phone: '136****6666', serviceType: '买断', amount: '500.00', status: 'completed', createTime: '2026-01-01 13:00:00', payTime: '2026-01-01 13:03:00' },
  { id: 5, order_no: 'ORD202601010005', avatar: '', nickname: '用户E', phone: '135****5555', serviceType: '视频聊天', amount: '300.00', status: 'unpaid', createTime: '2026-01-01 14:00:00', payTime: '-' }
]);

const statusLabels = {
  unpaid: '待支付',
  paid: '已支付',
  serving: '进行中',
  completed: '已完成',
  cancelled: '已取消',
  refunding: '退款中',
  refunded: '已退款'
};

function getStatusLabel(status) {
  return statusLabels[status] || status;
}
</script>

<style scoped>
.orders {
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

.filter-group {
  display: flex;
  gap: 12px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #f0f0f0;
}

.info {
  display: flex;
  flex-direction: column;
}

.name {
  font-size: 13px;
  font-weight: 500;
}

.phone {
  font-size: 11px;
  color: #999;
}

.type-tag {
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 12px;
  background: #e8f5e9;
  color: #2e7d32;
}

.amount-tag {
  font-size: 14px;
  font-weight: 600;
  color: #e65100;
}

.status-tag {
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 12px;
}

.status-tag.unpaid {
  background: #fff3e0;
  color: #e65100;
}

.status-tag.paid {
  background: #e3f2fd;
  color: #1976d2;
}

.status-tag.serving {
  background: #e8f5e9;
  color: #2e7d32;
}

.status-tag.completed {
  background: #f5f5f5;
  color: #999;
}

.status-tag.cancelled {
  background: #ffebee;
  color: #c62828;
}

.table-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #e8e8e8;
}

.table-footer span {
  font-size: 13px;
  color: #666;
}

.pagination {
  display: flex;
  align-items: center;
}
</style>