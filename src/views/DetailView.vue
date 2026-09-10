<script setup>
// 详情页：物品完整信息 + 发布者管理操作（状态推进 / 编辑 / 删除）
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getItemById, advanceStatus, removeItem, currentUser, isLoggedIn } from '../store'
import { ITEM_TYPES, STATUS_META, categoryLabel } from '../data/constants'
import { formatDate } from '../utils/format'
import { maskContact } from '../utils/mask'
import StatusBadge from '../components/StatusBadge.vue'

const route = useRoute()
const router = useRouter()

// route.params.id：地址 /items/:id 里的动态参数（路由表里定义的 :id）
const item = computed(() => getItemById(route.params.id))

// 当前登录人是否为发布者：决定显示"管理按钮"还是"联系提示"
const isOwner = computed(
  () => item.value && currentUser.value && item.value.ownerId === currentUser.value.id,
)

// 状态推进按钮文字：由状态机的 next 决定（pending→"标记为认领中"，claiming→"标记为已完结"）
const nextLabel = computed(() => {
  if (!item.value) return ''
  const next = STATUS_META[item.value.status].next
  if (next === 'claiming') return '标记为认领中'
  if (next === 'done') return '标记为已完结'
  return '' // 已完结：没有下一步
})

function handleAdvance() {
  if (!item.value) return
  advanceStatus(item.value.id)
}

function handleEdit() {
  router.push(`/publish?id=${item.value.id}`)
}

function handleDelete() {
  if (!item.value) return
  // confirm 是浏览器原生确认框：点"确定"返回 true，点"取消"返回 false
  if (!confirm('确定删除这条信息吗？删除后不可恢复。')) return
  removeItem(item.value.id)
  router.push('/items')
}
</script>

<template>
  <section v-if="item" class="detail-page">
    <button class="back-btn" @click="router.back()">← 返回</button>

    <div class="detail-card">
      <div class="head">
        <span class="type-tag" :class="item.type">{{ ITEM_TYPES[item.type] }}</span>
        <h1>{{ item.title }}</h1>
        <StatusBadge :status="item.status" />
      </div>

      <div class="meta">
        <span class="chip">{{ categoryLabel(item.category) }}</span>
        <span>📍 {{ item.location }}</span>
        <span>🕐 {{ item.time.replace('T', ' ') }}</span>
        <span>发布：{{ formatDate(item.createdAt) }}</span>
      </div>

      <p class="desc">{{ item.description }}</p>

      <!-- 联系方式：登录用户可见原文，游客脱敏（合规伦理约束的落实点） -->
      <div class="contact">
        <strong>联系方式：</strong>{{ maskContact(item.contact, isLoggedIn()) }}
        <span v-if="!isLoggedIn()" class="contact-tip">（登录后可见完整联系方式）</span>
      </div>

      <!-- 发布者操作区 -->
      <div v-if="isOwner" class="actions">
        <button v-if="nextLabel" class="btn primary" @click="handleAdvance">{{ nextLabel }}</button>
        <button class="btn" @click="handleEdit">编辑</button>
        <button class="btn danger" @click="handleDelete">删除</button>
      </div>
      <!-- 非发布者提示 -->
      <p v-else-if="currentUser" class="contact-tip">
        如信息相符，请通过上述联系方式与发布者联系认领。
      </p>
    </div>
  </section>

  <!-- 物品不存在（地址输错或已被删除） -->
  <section v-else class="not-found">
    <p>信息不存在或已被删除。</p>
    <router-link to="/items">← 返回列表</router-link>
  </section>
</template>

<style scoped>
.detail-page {
  max-width: 720px;
  margin: 0 auto;
}

.back-btn {
  background: none;
  border: none;
  color: #1e88e5;
  font-size: 14px;
  cursor: pointer;
  padding: 0 0 12px;
}

.detail-card {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.head {
  display: flex;
  align-items: center;
  gap: 12px;
}

.head h1 {
  font-size: 22px;
  flex: 1;
}

.type-tag {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  color: #fff;
}

.type-tag.lost {
  background: #ef5350;
}

.type-tag.found {
  background: #26a69a;
}

.meta {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 16px;
  font-size: 14px;
  color: #666;
  flex-wrap: wrap;
}

.chip {
  background: #e3f2fd;
  color: #1565c0;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.desc {
  margin-top: 16px;
  line-height: 1.8;
  font-size: 15px;
  background: #f8fafc;
  padding: 14px;
  border-radius: 8px;
}

.contact {
  margin-top: 16px;
  font-size: 15px;
  padding: 12px 14px;
  background: #fff8e1;
  border-radius: 8px;
}

.contact-tip {
  color: #999;
  font-size: 13px;
  margin-top: 8px;
}

.actions {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.btn {
  padding: 8px 18px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: #fff;
  cursor: pointer;
  font-size: 14px;
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

.not-found {
  text-align: center;
  color: #888;
  padding: 60px 0;
}

.not-found a {
  color: #1e88e5;
}
</style>
