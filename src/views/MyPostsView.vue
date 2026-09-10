<script setup>
// 我的发布：管理本人发布的信息（查看 / 编辑 / 状态推进 / 删除）
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { currentUser, itemsByOwner, advanceStatus, removeItem } from '../store'
import { STATUS_META } from '../data/constants'
import ItemCard from '../components/ItemCard.vue'

const router = useRouter()

// 本人的全部发布：先过滤再排序（最新的在前）
// 注意 .slice() 先复制——sort 会原地修改数组，不复制会打乱 store 里的原始顺序
const myItems = computed(() => {
  if (!currentUser.value) return []
  return itemsByOwner(currentUser.value.id)
    .slice()
    .sort((a, b) => b.createdAt - a.createdAt)
})

function goDetail(id) {
  router.push(`/items/${id}`)
}

function handleAdvance(item) {
  advanceStatus(item.id)
}

function handleEdit(item) {
  router.push(`/publish?id=${item.id}`)
}

function handleDelete(item) {
  if (!confirm(`确定删除「${item.title}」吗？删除后不可恢复。`)) return
  removeItem(item.id)
}

// 状态推进按钮文字：到终点的信息不再显示按钮
function nextLabel(item) {
  const next = STATUS_META[item.status].next
  if (next === 'claiming') return '标记为认领中'
  if (next === 'done') return '标记为已完结'
  return ''
}
</script>

<template>
  <section>
    <h1>我的发布</h1>

    <p v-if="!myItems.length" class="empty">
      你还没有发布过信息，去 <router-link to="/publish">发布一条</router-link> 吧。
    </p>

    <!-- 每条 = 卡片 + 操作按钮行 -->
    <div v-for="item in myItems" :key="item.id" class="my-row">
      <ItemCard :item="item" @open="goDetail" />
      <div class="row-actions">
        <button v-if="nextLabel(item)" class="btn primary" @click="handleAdvance(item)">
          {{ nextLabel(item) }}
        </button>
        <button class="btn" @click="handleEdit(item)">编辑</button>
        <button class="btn danger" @click="handleDelete(item)">删除</button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.my-row {
  margin-bottom: 14px;
}

.row-actions {
  display: flex;
  gap: 10px;
  padding: 8px 16px;
  background: #fafbfc;
  border-radius: 0 0 10px 10px;
  margin-top: -6px;
  padding-top: 12px;
}

.btn {
  padding: 6px 16px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: #fff;
  cursor: pointer;
  font-size: 13px;
}

.btn.primary {
  background: #1e88e5;
  border-color: #1e88e5;
  color: #fff;
}

.btn.danger {
  color: #d32f2f;
  border-color: #ffcdd2;
}

.btn:hover {
  opacity: 0.85;
}

.empty {
  text-align: center;
  color: #999;
  padding: 40px 0;
}

.empty a {
  color: #1e88e5;
}
</style>
