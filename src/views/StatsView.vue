<script setup>
// 统计看板：总览数字 + 分类占比（SVG 环形图）+ 近 7 日发布趋势（SVG 柱状图）
// 图表为手写 SVG 实现，不依赖图表库：数据规模小，手写更轻量、
// 构建产物更小（性能约束），且每个像素都可控
import { computed } from 'vue'
import { state } from '../store'
import { CATEGORIES } from '../data/constants'
import { formatDay } from '../utils/format'

// ---------- 总览数字 ----------
const totalCount = computed(() => state.items.length)
const pendingCount = computed(() => state.items.filter((i) => i.status === 'pending').length)
const claimingCount = computed(() => state.items.filter((i) => i.status === 'claiming').length)
const doneCount = computed(() => state.items.filter((i) => i.status === 'done').length)
const todayCount = computed(() => {
  // 今天 0 点的时间戳：今天 0 点以后发布的都算"今日新增"
  const start = new Date().setHours(0, 0, 0, 0)
  return state.items.filter((i) => i.createdAt >= start).length
})

// ---------- 分类占比（环形图） ----------
const R = 80 // 环形图半径
const C = 2 * Math.PI * R // 圆周长（后面算每段弧长用）

// 环形图原理：不用"画扇区"，而是给整圆描边，用 stroke-dasharray 控制
// "实线段长 虚线间隙"——每个分类画一个圆，实线长 = 占比 × 周长，
// dashoffset 负向累加，把各段依次排到正确位置
const pieSegments = computed(() => {
  const total = state.items.length
  let accumulated = 0 // 已排布的比例累计
  return CATEGORIES.map((cat) => {
    const count = state.items.filter((i) => i.category === cat.value).length
    const fraction = total ? count / total : 0
    const seg = {
      ...cat,
      count,
      percent: Math.round(fraction * 100),
      dasharray: `${fraction * C} ${C}`,
      dashoffset: -accumulated * C,
    }
    accumulated += fraction
    return seg
  }).filter((s) => s.count > 0) // 数量为 0 的分类不参与绘制
})

// ---------- 近 7 日发布趋势（柱状图） ----------
// 构造 [今天-6 … 今天] 7 个"桶"，统计每天 createdAt 落在桶内的条数
const trend = computed(() => {
  const days = []
  for (let d = 6; d >= 0; d--) {
    const date = new Date()
    date.setDate(date.getDate() - d)
    // 当天 0 点时间戳
    const start = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime()
    const end = start + 86400000 // 加一天（24 小时的毫秒数）
    days.push({
      label: formatDay(start),
      count: state.items.filter((i) => i.createdAt >= start && i.createdAt < end).length,
    })
  }
  return days
})

// 柱高按最大值归一化：最多的一天顶满 BAR_H，其余按比例
const trendMax = computed(() => Math.max(...trend.value.map((d) => d.count), 1))
const BAR_H = 110
</script>

<template>
  <section>
    <h1>数据统计</h1>

    <!-- 总览数字 -->
    <div class="stat-row">
      <div class="stat-tile"><div class="num">{{ totalCount }}</div><div class="label">信息总数</div></div>
      <div class="stat-tile"><div class="num accent">{{ pendingCount }}</div><div class="label">待认领</div></div>
      <div class="stat-tile"><div class="num blue">{{ claimingCount }}</div><div class="label">认领中</div></div>
      <div class="stat-tile"><div class="num green">{{ doneCount }}</div><div class="label">已完结</div></div>
      <div class="stat-tile"><div class="num orange">{{ todayCount }}</div><div class="label">今日新增</div></div>
    </div>

    <div class="charts">
      <!-- 环形图 + 图例 -->
      <div class="chart-card">
        <h2>物品分类占比</h2>
        <div class="pie-wrap">
          <svg :width="220" :height="220" viewBox="0 0 220 220" class="pie">
            <!-- 每个分类一个圆环段；rotate(-90) 让起点从 12 点方向开始 -->
            <circle
              v-for="s in pieSegments"
              :key="s.value"
              cx="110"
              cy="110"
              :r="R"
              fill="none"
              :stroke="s.color"
              stroke-width="36"
              :stroke-dasharray="s.dasharray"
              :stroke-dashoffset="s.dashoffset"
              transform="rotate(-90 110 110)"
            />
            <text x="110" y="106" text-anchor="middle" class="pie-num">{{ totalCount }}</text>
            <text x="110" y="128" text-anchor="middle" class="pie-label">条信息</text>
          </svg>
          <ul class="legend">
            <li v-for="s in pieSegments" :key="s.value">
              <span class="dot" :style="{ background: s.color }"></span>
              {{ s.label }}：{{ s.count }} 条（{{ s.percent }}%）
            </li>
          </ul>
        </div>
      </div>

      <!-- 柱状图 -->
      <div class="chart-card">
        <h2>近 7 日发布趋势</h2>
        <svg class="bars" viewBox="0 0 420 170" width="100%">
          <g v-for="(d, i) in trend" :key="d.label">
            <!-- 柱：x = 槽位起点，y = 底部 - 高度，height = 按比例的高度 -->
            <rect
              :x="i * 60 + 8"
              :y="130 - (d.count / trendMax) * BAR_H"
              :width="34"
              :height="(d.count / trendMax) * BAR_H"
              rx="4"
              class="bar"
            />
            <!-- 数量标注：0 条不显示 -->
            <text
              v-if="d.count"
              :x="i * 60 + 25"
              :y="122 - (d.count / trendMax) * BAR_H"
              text-anchor="middle"
              class="bar-count"
            >{{ d.count }}</text>
            <!-- x 轴日期标签 -->
            <text :x="i * 60 + 25" :y="150" text-anchor="middle" class="bar-label">{{ d.label }}</text>
          </g>
        </svg>
      </div>
    </div>
  </section>
</template>

<style scoped>
.stat-row {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.stat-tile {
  flex: 1;
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  text-align: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.num {
  font-size: 28px;
  font-weight: 700;
  color: #1e88e5;
}

.num.accent {
  color: #e65100;
}

.num.blue {
  color: #1565c0;
}

.num.green {
  color: #2e7d32;
}

.num.orange {
  color: #eb6834;
}

.label {
  margin-top: 4px;
  font-size: 13px;
  color: #888;
}

.charts {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.chart-card {
  flex: 1;
  min-width: 300px;
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.chart-card h2 {
  font-size: 16px;
  margin-bottom: 16px;
}

.pie-wrap {
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}

.pie-num {
  font-size: 26px;
  font-weight: 700;
  fill: #333;
}

.pie-label {
  font-size: 13px;
  fill: #999;
}

.legend {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 13px;
  color: #555;
}

.dot {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 6px;
}

.bar {
  fill: #1e88e5;
}

.bar-count {
  font-size: 12px;
  fill: #555;
}

.bar-label {
  font-size: 11px;
  fill: #999;
}
</style>
