<template>
  <el-container>
    <el-header>逆向App</el-header>
    <el-main>
      <RouterView />
    </el-main>
    <el-footer>版权说明</el-footer>
  </el-container>
</template>
<script setup></script>
<style scope lang="less">
html,
body {
  margin: 0;
  padding: 0;
}
.el-container {
  height: 100vh;
}
.el-header,
.el-footer {
  display: flex;
  justify-content: center;
  align-items: center;
}

.el-header {
  font-size: 16px;
  font-weight: bold;
}
</style>