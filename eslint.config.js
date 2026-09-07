// ESLint 扁平化配置：基础 JS 规则 + Vue 官方规则 + 与 Prettier 兼容
import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import configPrettier from 'eslint-config-prettier'
import globals from 'globals'

export default [
  // 不检查构建产物和依赖
  { ignores: ['dist/**', 'node_modules/**'] },

  // ESLint 官方推荐的 JS 基础规则
  js.configs.recommended,

  // Vue 官方插件：essential 级别（只报真正会出 bug 的问题，风格问题交给 Prettier）
  ...pluginVue.configs['flat/essential'],

  // Prettier 兼容：关闭与格式化冲突的规则（格式化归 Prettier 管，查错归 ESLint 管）
  configPrettier,

  {
    files: ['**/*.js', '**/*.vue'],
    languageOptions: {
      globals: { ...globals.browser }, // 浏览器全局变量（window、document 等）
    },
    rules: {
      // 视图组件名允许单个单词（如 HomeView），不必强求多单词命名
      'vue/multi-word-component-names': 'off',
    },
  },
]
