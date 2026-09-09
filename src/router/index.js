import { createRouter, createWebHistory } from 'vue-router'
import { isLoggedIn } from '../store'

// 路由表：路径 -> 页面组件（懒加载，构建时按页分包，减小首屏体积）
// meta.requiresAuth = true 的路由需要登录才能访问，由下方路由守卫拦截
const routes = [
  { path: '/', name: 'home', component: () => import('../views/HomeView.vue') },
  { path: '/login', name: 'login', component: () => import('../views/LoginView.vue') },
  { path: '/items', name: 'items', component: () => import('../views/ItemsView.vue') },
  { path: '/items/:id', name: 'detail', component: () => import('../views/DetailView.vue') },
  { path: '/publish', name: 'publish', meta: { requiresAuth: true }, component: () => import('../views/PublishView.vue') },
  { path: '/stats', name: 'stats', component: () => import('../views/StatsView.vue') },
  { path: '/my', name: 'myposts', meta: { requiresAuth: true }, component: () => import('../views/MyPostsView.vue') },
]

const router = createRouter({
  // history 模式：URL 无 # 号；部署时需配置 SPA 回退到 index.html
  history: createWebHistory(),
  routes,
})

// 路由守卫：每次跳转前执行
// 访问需要登录的页面时，未登录就跳到登录页，并用 query.redirect 记住想去的地址，
// 登录成功后由登录页跳回原地址
router.beforeEach((to) => {
  if (to.meta.requiresAuth && !isLoggedIn()) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }
})

export default router
