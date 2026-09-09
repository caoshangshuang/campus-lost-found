<script setup>
// 失物招领列表页：关键词搜索 + 类型/分类筛选 + 分页
// 数据流：sortedItems（store）→ 过滤（computed）→ 切片分页（computed）→ 渲染
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { sortedItems } from '../store'
import { CATEGORIES, ITEM_TYPES } from '../data/constants'
import ItemCard from '../components/ItemCard.vue'
import Pagination from '../components/Pagination.vue'

const router = useRouter()

// 筛选条件（响应式：输入框/下拉框一变，下面两个 computed 自动重算）
const keyword = ref('')
const typeFilter = ref('all') // 'all' | 'lost' | 'found'
const categoryFilter = ref('all') // 'all' | 分类值
const page = ref(1)
const PAGE_SIZE = 8 // 每页条数（16 条种子数据刚好分 2 页）

// 第一步：逐层过滤。filter 回调里 return false 就是"淘汰这一条"
const filteredItems = computed(() => {
  return sortedItems.value.filter((item) => {
    if (typeFilter.value !== 'all' && item.type !== typeFilter.value) return false
    if (categoryFilter.value !== 'all' && item.category !== categoryFilter.value) return false
    // 关键词匹配：标题+地点+描述拼接后查找（includes 判断是否包含）
    const kw = keyword.value.trim()
    if (kw && !(item.title + item.location + item.description).includes(kw)) return false
    return true
  })
})

// 第二步：按当前页切片（slice 不修改原数组，只取这一段）
const pagedItems = computed(() => {
  const start = (page.value - 1) * PAGE_SIZE
  return filteredItems.value.slice(start, start + PAGE_SIZE)
})

// 总页数：向上取整（8 条一页，9 条就是 2 页）
const totalPages = computed(() => Math.ceil(filteredItems.value.length / PAGE_SIZE))

// 筛选条件一变，回到第 1 页（否则可能停留在不存在的页码）
watch([keyword, typeFilter, categoryFilter], () => {
  page.value = 1
})

// 点卡片跳详情页
function openDetail(id) {
  router.push(`/items/${id}`)
}
</script>

<template>
  <section>
    <h1>失物招领</h1>

    <!-- 筛选栏 -->
    <div class="filter-bar">
      <input
        v-model="keyword"
        type="text"
        class="search"
        placeholder="搜索物品名称 / 地点 / 描述"
      />
      <select v-model="typeFilter" class="select">
        <option value="all">全部类型</option>
        <option value="lost">{{ ITEM_TYPES.lost }}</option>
        <option value="found">{{ ITEM_TYPES.found }}</option>
      </select>
      <select v-model="categoryFilter" class="select">
        <option value="all">全部分类</option>
        <option v-for="c in CATEGORIES" :key="c.value" :value="c.value">
          {{ c.label }}
        </option>
      </select>
      <span class="count">共 {{ filteredItems.length }} 条</span>
    </div>

    <!-- 列表区：有结果渲染卡片，没结果显示空状态 -->
    <div v-if="pagedItems.length" class="card-list">
      <ItemCard
        v-for="item in pagedItems"
        :key="item.id"
        :item="item"
        @open="openDetail"
      />
    </div>
    <p v-else class="empty">没有找到相关信息，换个关键词试试～</p>

    <!-- 分页：超过一页才显示；@change 收到的页码通过 $event 取到 -->
    <Pagination
      v-if="totalPages > 1"
      :page="page"
      :total-pages="totalPages"
      @change="page = $event"
    />
  </section>
</template>

<style scoped>
.filter-bar {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  align-items: center;
  margin-bottom: 16px;
}

.search {
  flex: 1;
  min-width: 220px;
  padding: 9px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
}

.select {
  padding: 9px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  background: #fff;
}

.count {
  font-size: 13px;
  color: #888;
}

.card-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.empty {
  text-align: center;
  color: #999;
  padding: 40px 0;
}
</style>
