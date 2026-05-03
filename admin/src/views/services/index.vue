<template>
  <div class="services">
    <div class="page-header">
      <h2>服务管理</h2>
    </div>

    <div class="content-card">
      <div class="category-tabs">
        <el-tag 
          v-for="cat in categories" 
          :key="cat.id" 
          :class="{ active: activeCategory === cat.id }"
          @click="activeCategory = cat.id"
        >
          {{ cat.name }}
        </el-tag>
      </div>

      <div class="card-header">
        <div class="btn-group">
          <el-button type="primary" icon="Plus">添加</el-button>
          <el-button icon="Edit">编辑</el-button>
          <el-button icon="Recycle">回收站</el-button>
        </div>
        <div class="search-box">
          <el-input placeholder="搜索" prefix-icon="Search" v-model="searchKeyword" />
        </div>
        <div class="view-controls">
          <el-button icon="Grid" :class="{ active: viewMode === 'grid' }" @click="viewMode = 'grid'"></el-button>
          <el-button icon="List" :class="{ active: viewMode === 'list' }" @click="viewMode = 'list'"></el-button>
          <el-button icon="ArrowDown"></el-button>
          <el-button icon="Upload"></el-button>
          <el-button icon="Search"></el-button>
        </div>
      </div>

      <el-table :data="serviceList" border style="width: 100%">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="Id" width="80" sortable />
        <el-table-column prop="title" label="标题" width="120" />
        <el-table-column prop="multilang" label="多语言" width="180" />
        <el-table-column prop="status" label="状态" width="80">
          <template #default="scope">
            <el-switch :value="scope.row.status === 'active'" @change="toggleStatus(scope.row)" />
          </template>
        </el-table-column>
        <el-table-column prop="sort" label="排序" width="80" />
        <el-table-column prop="duration" label="时长(小时)" width="120" />
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column prop="updateTime" label="更新时间" width="180" />
        <el-table-column label="操作" width="120">
          <template #default="scope">
            <el-button size="small" icon="Edit">编辑</el-button>
            <el-button size="small" icon="Check">启用</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="table-footer">
        <span>显示第 1 到第 10 条记录，总共 30 条记录</span>
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

    <el-dialog title="添加服务" :visible.sync="showAddModal" width="500px">
      <el-form :model="serviceForm" label-width="80px">
        <el-form-item label="名称" required>
          <el-input v-model="serviceForm.name" placeholder="请输入服务名称" />
        </el-form-item>
        <el-form-item label="多语言" required>
          <el-input v-model="serviceForm.multilang" placeholder="请输入多语言标识" />
        </el-form-item>
        <el-form-item label="所属分类" required>
          <el-select v-model="serviceForm.category">
            <el-option v-for="cat in categories" :key="cat.id" :label="cat.name" :value="cat.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="所属分类" required>
          <el-select v-model="serviceForm.subcategory">
            <el-option label="子分类1" value="1" />
            <el-option label="子分类2" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="时长" required>
          <el-input v-model.number="serviceForm.duration" type="number" placeholder="单位：小时，例如包天就填24，包周填168，包月填720，产品单价请在店员等级配置中设置" />
        </el-form-item>
        <el-form-item label="排序">
          <el-input v-model.number="serviceForm.sort" type="number" placeholder="0" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="serviceForm.status">
            <el-option label="开" value="active" />
            <el-option label="关" value="inactive" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showAddModal = false">取消</el-button>
        <el-button type="primary">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { ElMessage } from 'element-plus';

const activeCategory = ref('all');
const searchKeyword = ref('');
const viewMode = ref('list');
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(30);
const showAddModal = ref(false);

const categories = ref([
  { id: 'all', name: '全部' },
  { id: 'text', name: '文字语音条' },
  { id: 'voice', name: '语音连麦' },
  { id: 'buyout', name: '买断' },
  { id: 'sleep', name: '哄睡' },
  { id: 'game', name: '游戏陪玩' },
  { id: 'wake', name: '叫醒' },
  { id: 'sing', name: '唱歌' },
  { id: 'first', name: '首单优惠' },
  { id: 'blind', name: '文语盲盒' },
  { id: 'video', name: '视频聊天' }
]);

const serviceList = ref([
  { id: 47, title: '视频聊天', multilang: '', status: 'active', sort: 47, duration: 1.00, createTime: '2026-02-18 21:29:45', updateTime: '2026-02-18 21:29:45' },
  { id: 46, title: '30天', multilang: 'goods.monthlySubscription', status: 'active', sort: 46, duration: 720.00, createTime: '2026-01-20 17:12:41', updateTime: '2026-01-20 17:12:41' },
  { id: 45, title: '7天', multilang: 'goods.weeklySubscription', status: 'active', sort: 45, duration: 0.00, createTime: '2026-01-20 17:12:26', updateTime: '2026-01-20 17:12:26' },
  { id: 44, title: '1天', multilang: 'goods.dailySubscription', status: 'active', sort: 44, duration: 24.00, createTime: '2026-01-20 17:12:04', updateTime: '2026-01-20 17:12:04' },
  { id: 43, title: '60分钟', multilang: 'goods.oneHour', status: 'active', sort: 43, duration: 1.00, createTime: '2026-01-20 17:11:49', updateTime: '2026-01-20 17:11:49' },
  { id: 42, title: '30分钟', multilang: 'goods.halfHour', status: 'active', sort: 42, duration: 0.50, createTime: '2026-01-20 17:11:22', updateTime: '2026-01-20 17:11:22' },
  { id: 34, title: '唱一首歌', multilang: '唱一首歌', status: 'active', sort: 35, duration: 0.00, createTime: '2025-01-30 21:04:08', updateTime: '2025-01-30 21:04:08' },
  { id: 33, title: '叫醒一次', multilang: '叫醒一次', status: 'active', sort: 34, duration: 0.00, createTime: '2025-01-30 21:03:44', updateTime: '2025-01-30 21:03:44' },
  { id: 32, title: '30天', multilang: 'goods.monthlySubscription', status: 'active', sort: 33, duration: 720.00, createTime: '2025-01-30 20:59:04', updateTime: '2025-01-30 20:59:04' },
  { id: 40, title: '30分钟语音', multilang: 'goods.halfHour', status: 'active', sort: 32, duration: 0.50, createTime: '2026-03-12 14:43:30', updateTime: '2026-03-12 14:43:30' }
]);

const serviceForm = reactive({
  name: '',
  multilang: '',
  category: 'all',
  subcategory: '',
  duration: 0,
  sort: 0,
  status: 'active'
});

function toggleStatus(row) {
  row.status = row.status === 'active' ? 'inactive' : 'active';
  ElMessage.success(`已${row.status === 'active' ? '启用' : '禁用'}服务`);
}
</script>

<style scoped>
.services {
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

.category-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e8e8e8;
}

.category-tabs .el-tag {
  padding: 6px 16px;
  background: #f5f5f5;
  color: #666;
  border: none;
  cursor: pointer;
}

.category-tabs .el-tag.active {
  background: #fff;
  color: #3b82f6;
  border: 1px solid #3b82f6;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.btn-group {
  display: flex;
  gap: 8px;
}

.search-box {
  width: 200px;
}

.view-controls {
  display: flex;
  gap: 4px;
}

.view-controls .el-button {
  background: #f5f5f5;
  border: 1px solid #d9d9d9;
}

.view-controls .el-button.active {
  background: #3b82f6;
  color: #fff;
  border-color: #3b82f6;
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