import { createRouter, createWebHashHistory } from 'vue-router'
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
  // hash 模式：URL 形如 /#/items。
  // 选型原因：Gitee Pages 等静态托管平台不支持 history 路由所需的服务器端重写，
  // 刷新 /items 会直接 404；hash 模式下路由信息在 # 之后，浏览器不会向服务器
  // 请求该路径，刷新与直达链接都正常。若将来部署到支持重写规则的平台
  // （如 Vercel/Netlify），可改回 createWebHistory。
  history: createWebHashHistory(),
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
