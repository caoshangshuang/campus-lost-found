import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// Vite 配置：https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  // base: './' —— 资源使用相对路径。
  // 原因：部署在 GitHub Pages 的子目录（/campus-lost-found/）下时，
  // 默认的绝对路径 /assets/xxx.js 会指向域名根目录导致 404 白屏；
  // 相对路径在任何子目录下都能正确加载。若将来绑定自定义域名（根目录部署），可移除。
  base: './',
})
