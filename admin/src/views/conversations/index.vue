<template>
  <div class="conversations">
    <div class="page-header">
      <h2>会话管理</h2>
    </div>

    <div class="content-card">
      <el-table :data="conversationList" border style="width: 100%">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="ID" width="80" sortable />
        <el-table-column prop="userInfo" label="用户信息" width="180">
          <template #default="scope">
            <div class="user-info">
              <img :src="scope.row.avatar" class="avatar" />
              <div class="info">
                <span class="name">{{ scope.row.nickname }}</span>
                <span class="role">{{ scope.row.role }}</span>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="手机号" width="120" />
        <el-table-column prop="lastChatService" label="最后会话客服" width="120" />
        <el-table-column prop="lastChatTime" label="最后会话时间" width="160" />
        <el-table-column label="操作" width="120">
          <template #default="scope">
            <el-button size="small" text type="primary">查看</el-button>
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
            @current-change="handlePageChange"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const conversationList = ref([
  { id: 64, nickname: '归零', avatar: '', phone: '-', lastChatService: 0, lastChatTime: '2026-04-30 12:57:37', role: '用户' },
  { id: 64, nickname: '半仙', avatar: '', phone: '-', lastChatService: 0, lastChatTime: '2026-04-30 12:57:37', role: '用户' },
  { id: 63, nickname: 'OK先生', avatar: '', phone: '-', lastChatService: 0, lastChatTime: '2026-03-20 16:30:36', role: '用户' },
  { id: 62, nickname: '用户3CfJqDm', avatar: '', phone: '18661703898', lastChatService: 0, lastChatTime: '2026-03-15 17:01:55', role: '用户' },
  { id: 61, nickname: '@开发各类软件', avatar: '', phone: '-', lastChatService: 0, lastChatTime: '2026-03-11 11:16:43', role: '用户' },
  { id: 60, nickname: '迦叶', avatar: '', phone: '-', lastChatService: 0, lastChatTime: '2026-03-07 19:03:06', role: '用户' },
  { id: 59, nickname: '东', avatar: '', phone: '-', lastChatService: 0, lastChatTime: '2026-02-08 15:17:01', role: '用户' },
  { id: 58, nickname: '大麦', avatar: '', phone: '-', lastChatService: 0, lastChatTime: '2026-02-06 17:50:14', role: '用户' },
  { id: 57, nickname: '五比幸福', avatar: '', phone: '-', lastChatService: 0, lastChatTime: '2026-01-25 11:38:41', role: '用户' },
  { id: 56, nickname: '有趣', avatar: '', phone: '15555555556', lastChatService: 0, lastChatTime: '2026-01-20 18:27:02', role: '店长' }
]);

const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(61);

function handlePageChange(page) {
  currentPage.value = page;
}
</script>

<style scoped>
.conversations {
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

.role {
  font-size: 11px;
  color: #999;
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