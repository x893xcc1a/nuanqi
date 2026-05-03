<template>
  <div class="service-categories">
    <div class="page-header">
      <h2>服务分类</h2>
    </div>

    <div class="content-card">
      <div class="card-header">
        <el-button type="primary" icon="Plus">添加</el-button>
        <el-button icon="Edit">编辑</el-button>
        <div class="search-box">
          <el-input placeholder="搜索" prefix-icon="Search" v-model="searchKeyword" />
        </div>
      </div>

      <el-table :data="categoryList" border style="width: 100%">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="Id" width="80" />
        <el-table-column prop="name" label="分类名称" width="150" />
        <el-table-column prop="multilang" label="多语言" width="150" />
        <el-table-column prop="image" label="图片" width="100">
          <template #default="scope">
            <span v-if="scope.row.image" class="image-tag">已上传</span>
            <span v-else class="image-tag empty">未上传</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="80">
          <template #default="scope">
            <el-switch :value="scope.row.status === 'active'" />
          </template>
        </el-table-column>
        <el-table-column prop="blindBox" label="盲盒商品" width="100">
          <template #default="scope">
            <el-switch :value="scope.row.blindBox === 'active'" />
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column prop="updateTime" label="更新时间" width="180" />
        <el-table-column label="操作" width="100">
          <template #default="scope">
            <el-button size="small" icon="Edit">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="table-footer">
        <span>显示第 1 到第 10 条记录，总共 12 条记录</span>
        <div class="pagination">
          <el-pagination
            :current-page="currentPage"
            :page-size="pageSize"
            :total="total"
            layout="prev, pager, next, ->, jumper, ->, slot"
          >
            <template #slot>
              <span class="page-info">共 {{ total }} 条</span>
            </template>
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const searchKeyword = ref('');
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(12);

const categoryList = ref([
  { id: 1, name: '文语盲盒', multilang: '', image: '', status: 'active', blindBox: 'active', createTime: '2024-08-26 02:28:17', updateTime: '2026-01-20 17:32:38' },
  { id: 13, name: '视频聊天', multilang: '', image: '', status: 'inactive', blindBox: 'inactive', createTime: '2024-08-26 02:28:17', updateTime: '2026-02-18 21:31:51' },
  { id: 11, name: '首单优惠', multilang: '', image: '', status: 'active', blindBox: 'active', createTime: '2025-02-11 16:22:15', updateTime: '2026-03-12 12:43:36' },
  { id: 10, name: '唱歌', multilang: '', image: '', status: 'active', blindBox: 'inactive', createTime: '2025-01-30 20:19:16', updateTime: '2025-07-22 13:36:36' },
  { id: 9, name: '叫醒', multilang: '', image: '', status: 'active', blindBox: 'inactive', createTime: '2025-01-30 20:19:02', updateTime: '2025-07-22 13:36:37' },
  { id: 8, name: '游戏陪玩', multilang: '', image: '', status: 'active', blindBox: 'inactive', createTime: '2025-01-30 20:18:37', updateTime: '2026-01-14 13:32:11' },
  { id: 7, name: '哄睡', multilang: '', image: '', status: 'active', blindBox: 'inactive', createTime: '2024-08-26 02:34:59', updateTime: '2026-01-14 13:32:12' },
  { id: 4, name: '买断', multilang: '', image: '', status: 'active', blindBox: 'inactive', createTime: '2025-07-22 22:33:32', updateTime: '2025-07-22 22:33:32' },
  { id: 2, name: '语音连麦', multilang: '', image: '', status: 'active', blindBox: 'inactive', createTime: '2024-08-26 02:31:43', updateTime: '2025-07-22 22:34:54' },
  { id: 12, name: '文字语音条', multilang: '', image: '', status: 'active', blindBox: 'inactive', createTime: '2026-01-20 17:10:52', updateTime: '2026-01-20 17:24:39' }
]);
</script>

<style scoped>
.service-categories {
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
  width: 200px;
}

.image-tag {
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 12px;
  background: #e8f5e9;
  color: #2e7d32;
}

.image-tag.empty {
  background: #f5f5f5;
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

.page-info {
  margin-left: 8px;
  font-size: 13px;
  color: #666;
}
</style>