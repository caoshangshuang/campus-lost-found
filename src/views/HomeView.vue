<script setup>
// 首页：平台介绍 + 数据总览 + 最新发布
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { state, sortedItems } from '../store'
import ItemCard from '../components/ItemCard.vue'

const router = useRouter()

// 总览数字（直接由 store 的响应式状态计算）
const totalCount = computed(() => state.items.length)
const pendingCount = computed(() => state.items.filter((i) => i.status === 'pending').length)
const doneCount = computed(() => state.items.filter((i) => i.status === 'done').length)

// 最新 3 条（sortedItems 已经是时间倒序，直接取前 3）
const latestItems = computed(() => sortedItems.value.slice(0, 3))

function goDetail(id) {
  router.push(`/items/${id}`)
}
</script>

<template>
  <section class="home-page">
    <div class="hero">
      <h1>校园失物招领平台</h1>
      <p>丢失了东西？捡到了东西？在这里发布信息，让它们早日回家。</p>
      <div class="hero-actions">
        <button class="hero-btn primary" @click="router.push('/publish')">发布信息</button>
        <button class="hero-btn" @click="router.push('/items')">浏览失物招领</button>
      </div>
    </div>

    <div class="stat-row">
      <div class="stat-tile">
        <div class="stat-num">{{ totalCount }}</div>
        <div class="stat-label">信息总数</div>
      </div>
      <div class="stat-tile">
        <div class="stat-num accent">{{ pendingCount }}</div>
        <div class="stat-label">待认领</div>
      </div>
      <div class="stat-tile">
        <div class="stat-num green">{{ doneCount }}</div>
        <div class="stat-label">已完结</div>
      </div>
    </div>

    <div class="latest">
      <div class="latest-head">
        <h2>最新发布</h2>
        <router-link to="/items" class="more">查看全部 →</router-link>
      </div>
      <ItemCard
        v-for="item in latestItems"
        :key="item.id"
        :item="item"
        @open="goDetail"
      />
    </div>
  </section>
</template>

<style scoped>
.hero {
  text-align: center;
  padding: 40px 20px;
  background: linear-gradient(135deg, #1e88e5, #42a5f5);
  border-radius: 14px;
  color: #fff;
  margin-bottom: 20px;
}

.hero h1 {
  font-size: 30px;
  margin-bottom: 10px;
}

.hero p {
  opacity: 0.92;
  margin-bottom: 22px;
}

.hero-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.hero-btn {
  padding: 10px 24px;
  border-radius: 8px;
  font-size: 15px;
  cursor: pointer;
  border: 1px solid rgba(255, 255, 255, 0.7);
  background: transparent;
  color: #fff;
}

.hero-btn.primary {
  background: #fff;
  color: #1e88e5;
  border-color: #fff;
  font-weight: 600;
}

.hero-btn:hover {
  opacity: 0.9;
}

.stat-row {
  display: flex;
  gap: 14px;
  margin-bottom: 26px;
}

.stat-tile {
  flex: 1;
  background: #fff;
  border-radius: 12px;
  padding: 18px;
  text-align: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.stat-num {
  font-size: 30px;
  font-weight: 700;
  color: #1e88e5;
}

.stat-num.accent {
  color: #e65100;
}

.stat-num.green {
  color: #2e7d32;
}

.stat-label {
  margin-top: 4px;
  font-size: 13px;
  color: #888;
}

.latest-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.latest-head h2 {
  font-size: 18px;
}

.more {
  color: #1e88e5;
  font-size: 14px;
  text-decoration: none;
}

.latest :deep(.item-card) {
  margin-bottom: 10px;
}
</style>
