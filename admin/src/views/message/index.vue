<template>
  <div class="page-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>消息配置</span>
        </div>
      </template>
      <div class="empty-state">
        <el-empty description="消息配置功能开发中..." />
      </div>
    </el-card>
  </div>
</template>

<script setup>
</script>

<style scoped>
.page-container {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.empty-state {
  padding: 60px 0;
}
</style>
