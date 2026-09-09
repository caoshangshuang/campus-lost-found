<script setup>
// 状态徽章组件：根据物品状态显示对应文字与颜色的小标签
// 状态文字、样式类名都来自 constants 的 STATUS_META，组件本身不含业务规则
import { STATUS_META } from '../data/constants'

// props：父组件传入的状态值（'pending' | 'claiming' | 'done'）
defineProps({
  status: { type: String, required: true },
})
</script>

<template>
  <span class="badge" :class="STATUS_META[status].badgeClass">
    {{ STATUS_META[status].label }}
  </span>
</template>

<style scoped>
.badge {
  display: inline-block;
  padding: 2px 10px;
  border-radius: 999px; /* 胶囊形 */
  font-size: 12px;
  line-height: 20px;
}

.badge-pending {
  background: #fff3e0;
  color: #e65100;
}

.badge-claiming {
  background: #e3f2fd;
  color: #1565c0;
}

.badge-done {
  background: #e8f5e9;
  color: #2e7d32;
}
</style>
