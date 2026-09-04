<script setup>
// 根组件：全局布局（导航栏 + 路由视图）
import NavBar from './components/NavBar.vue'
</script>

<template>
  <div class="app">
    <NavBar />
    <main class="page">
      <router-view />
    </main>
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'PingFang SC', 'Microsoft YaHei', 'Helvetica Neue', Arial, sans-serif;
  color: #2c3e50;
  background: #f5f7fa;
}

.page {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px 16px 40px;
}
</style>
