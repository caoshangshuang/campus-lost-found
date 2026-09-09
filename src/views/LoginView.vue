<script setup>
// 登录页：本地会话模拟登录（演示账号见 data/seed.js 的 USERS）
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { validateLogin } from '../utils/validate'
import { login } from '../store'

// useRoute：读当前路由信息（含 query）；useRouter：编程式跳转
const route = useRoute()
const router = useRouter()

// 表单数据与错误状态（响应式：输入框一改，这里跟着变）
const studentId = ref('')
const password = ref('')
const errors = ref({}) // 字段级错误 { studentId: '...', password: '...' }
const failed = ref(false) // 整体失败标记（学号或密码错误）

function handleSubmit() {
  failed.value = false

  // 第一步：格式校验（学号 6-12 位数字、密码至少 6 位）
  const check = validateLogin(studentId.value, password.value)
  errors.value = check.errors
  if (!check.ok) return

  // 第二步：账号密码验证（store 的 login 返回 true/false）
  if (!login(studentId.value.trim(), password.value)) {
    failed.value = true
    return
  }

  // 第三步：登录成功——有 redirect（守卫塞的）就跳回原页面，否则回首页
  const redirect = route.query.redirect
  router.push(typeof redirect === 'string' ? redirect : '/')
}
</script>

<template>
  <section class="login-page">
    <h1>登录</h1>
    <form class="login-form" @submit.prevent="handleSubmit">
      <label>
        学号
        <!-- v-model：输入框与变量双向绑定，输入什么变量就变什么 -->
        <input v-model="studentId" type="text" placeholder="如 2023001" />
      </label>
      <p v-if="errors.studentId" class="error">{{ errors.studentId }}</p>

      <label>
        密码
        <input v-model="password" type="password" placeholder="演示账号密码 123456" />
      </label>
      <p v-if="errors.password" class="error">{{ errors.password }}</p>

      <p v-if="failed" class="error">学号或密码错误</p>

      <button type="submit" class="submit-btn">登 录</button>
      <p class="hint">演示账号：2023001 / 123456（张三）· 2023002 / 123456（李四）</p>
    </form>
  </section>
</template>

<style scoped>
.login-page {
  max-width: 380px;
  margin: 40px auto;
}

h1 {
  text-align: center;
  margin-bottom: 24px;
}

.login-form {
  background: #fff;
  padding: 24px;
  border-radius: 10px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  gap: 12px;
}

label {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 14px;
  color: #555;
}

input {
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 15px;
}

input:focus {
  outline: none;
  border-color: #1e88e5;
}

.error {
  color: #d32f2f;
  font-size: 13px;
  margin: 0;
}

.submit-btn {
  padding: 10px;
  background: #1e88e5;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
}

.submit-btn:hover {
  background: #1565c0;
}

.hint {
  font-size: 12px;
  color: #999;
  text-align: center;
}
</style>
