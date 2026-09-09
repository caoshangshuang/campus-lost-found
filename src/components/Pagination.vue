<script setup>
// 分页组件：显示页码按钮，点击时通知父组件换页
// 设计：组件不知道列表数据，只处理"第几页/共几页"两个数字——组件复用性靠这个
const props = defineProps({
  page: { type: Number, required: true }, // 当前第几页（从 1 开始）
  totalPages: { type: Number, required: true }, // 一共几页
})

const emit = defineEmits(['change'])

function go(p) {
  // 范围校验 + 去重：点当前页或越界页不触发
  if (p >= 1 && p <= props.totalPages && p !== props.page) {
    emit('change', p)
  }
}
</script>

<template>
  <div class="pagination">
    <!-- :disabled 绑定布尔值：第一页时"上一页"不可点 -->
    <button :disabled="page === 1" @click="go(page - 1)">上一页</button>

    <!-- v-for 直接循环数字：n in totalPages 得到 1,2,...,totalPages -->
    <button
      v-for="n in totalPages"
      :key="n"
      :class="{ current: n === page }"
      @click="go(n)"
    >
      {{ n }}
    </button>

    <button :disabled="page === totalPages" @click="go(page + 1)">下一页</button>
  </div>
</template>

<style scoped>
.pagination {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 20px;
}

button {
  padding: 6px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: #fff;
  cursor: pointer;
  font-size: 14px;
}

/* :not(:disabled)：不是禁用状态才响应 hover */
button:hover:not(:disabled) {
  border-color: #1e88e5;
  color: #1e88e5;
}

button.current {
  background: #1e88e5;
  border-color: #1e88e5;
  color: #fff;
}

button:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}
</style>
