<script setup>
// 顶部导航栏组件：品牌 + 页面链接 + 登录状态区
import { useRouter } from 'vue-router'
import { currentUser, logout } from '../store'

const links = [
  { to: '/', label: '首页' },
  { to: '/items', label: '失物招领' },
  { to: '/publish', label: '发布信息' },
  { to: '/stats', label: '数据统计' },
  { to: '/my', label: '我的发布' },
]

const router = useRouter()

// 退出登录：清空会话后回到首页
function handleLogout() {
  logout()
  router.push('/')
}
</script>

<template>
  <nav class="navbar">
    <div class="navbar-inner">
      <router-link to="/" class="brand">校园失物招领</router-link>
      <div class="links">
        <router-link
          v-for="l in links"
          :key="l.to"
          :to="l.to"
          class="link"
          active-class="active"
        >
          {{ l.label }}
        </router-link>
      </div>
      <!-- 登录状态区：已登录显示用户名+退出，未登录显示登录入口 -->
      <div class="user-area">
        <template v-if="currentUser">
          <span class="username">{{ currentUser.name }}</span>
          <button class="logout-btn" @click="handleLogout">退出</button>
        </template>
        <router-link v-else to="/login" class="link">登录</router-link>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  background: #1e88e5;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.navbar-inner {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 16px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.brand {
  color: #fff;
  font-size: 18px;
  font-weight: 700;
  text-decoration: none;
}

.links {
  display: flex;
  gap: 8px;
}

.link {
  color: rgba(255, 255, 255, 0.85);
  text-decoration: none;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 15px;
}

.link:hover {
  background: rgba(255, 255, 255, 0.15);
}

.link.active {
  background: rgba(255, 255, 255, 0.25);
  color: #fff;
  font-weight: 600;
}

.user-area {
  display: flex;
  align-items: center;
  gap: 10px;
}

.username {
  color: #fff;
  font-size: 14px;
}

.logout-btn {
  background: rgba(255, 255, 255, 0.15);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.4);
  padding: 4px 10px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
}

.logout-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}
</style>
