import { createRouter, createWebHistory } from 'vue-router'

// 路由表：路径 -> 页面组件（懒加载，构建时按页分包，减小首屏体积）
const routes = [
  { path: '/', name: 'home', component: () => import('../views/HomeView.vue') },
  { path: '/login', name: 'login', component: () => import('../views/LoginView.vue') },
  { path: '/items', name: 'items', component: () => import('../views/ItemsView.vue') },
  { path: '/items/:id', name: 'detail', component: () => import('../views/DetailView.vue') },
  { path: '/publish', name: 'publish', component: () => import('../views/PublishView.vue') },
  { path: '/stats', name: 'stats', component: () => import('../views/StatsView.vue') },
  { path: '/my', name: 'myposts', component: () => import('../views/MyPostsView.vue') },
]

const router = createRouter({
  // history 模式：URL 无 # 号；部署时需配置 SPA 回退到 index.html
  history: createWebHistory(),
  routes,
})

export default router
