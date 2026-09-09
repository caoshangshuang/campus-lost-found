<script setup>
// 物品卡片组件：列表页用，展示一条物品信息的摘要
// 设计：卡片只负责"显示"和"通知被点击"，跳转到哪由父组件决定（关注点分离）
import { CATEGORIES, ITEM_TYPES, categoryLabel } from '../data/constants'
import { timeAgo } from '../utils/format'
import StatusBadge from './StatusBadge.vue'

// 接收父组件传入的物品对象
const props = defineProps({
  item: { type: Object, required: true },
})

// 声明事件：点击卡片时把物品 id "上报"给父组件
const emit = defineEmits(['open'])

function handleClick() {
  emit('open', props.item.id)
}

// 分类对应的固定颜色（constants 里定义，保证所有页面颜色一致）
function categoryColor(value) {
  const found = CATEGORIES.find((c) => c.value === value)
  return found ? found.color : '#888'
}
</script>

<template>
  <article class="item-card" @click="handleClick">
    <div class="card-head">
      <!-- :class="item.type"：type 是 'lost'/'found'，正好对应 CSS 类名 -->
      <span class="type-tag" :class="item.type">{{ ITEM_TYPES[item.type] }}</span>
      <h3 class="title">{{ item.title }}</h3>
      <StatusBadge :status="item.status" />
    </div>
    <div class="card-meta">
      <!-- :style 绑一个样式对象：动态设置背景色 -->
      <span class="chip" :style="{ background: categoryColor(item.category) }">
        {{ categoryLabel(item.category) }}
      </span>
      <span class="location">{{ item.location }}</span>
      <span class="time">{{ timeAgo(item.createdAt) }}</span>
    </div>
  </article>
</template>

<style scoped>
.item-card {
  background: #fff;
  border-radius: 10px;
  padding: 14px 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: transform 0.15s, box-shadow 0.15s;
}

.item-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.12);
}

.card-head {
  display: flex;
  align-items: center;
  gap: 10px;
}

.title {
  font-size: 16px;
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

.card-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 8px;
  font-size: 13px;
  color: #666;
}

.chip {
  color: #fff;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.time {
  margin-left: auto;
}
</style>
