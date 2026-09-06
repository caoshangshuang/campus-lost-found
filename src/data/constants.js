// 全局常量：物品分类、类型、状态流转规则
// 分类的颜色是固定的：图表里颜色跟随"分类本身"，而不是跟随数量排名，这样同一分类在任何页面颜色都不变

export const CATEGORIES = [
  { value: 'card', label: '校园卡/证件', color: '#2a78d6' }, // 蓝
  { value: 'electronics', label: '电子产品', color: '#eb6834' }, // 橙
  { value: 'keys', label: '钥匙/饰品', color: '#1baf7a' }, // 青
  { value: 'books', label: '书籍文具', color: '#eda100' }, // 黄
  { value: 'clothes', label: '衣物', color: '#e87ba4' }, // 品红
  { value: 'other', label: '其他', color: '#008300' }, // 绿
]

// 信息类型：发布者自己丢了的叫"失物"，捡到别人东西的叫"招领"
export const ITEM_TYPES = {
  lost: '失物',
  found: '招领',
}

// 状态只能按此顺序单向推进，由发布者操作：待认领 → 认领中 → 已完结
export const STATUS_FLOW = ['pending', 'claiming', 'done']

// 每个状态的展示信息：文字标签、下一个状态、徽章样式类名
// next: null 表示已到终点（已完结不能再推进）
export const STATUS_META = {
  pending: { label: '待认领', next: 'claiming', badgeClass: 'badge-pending' },
  claiming: { label: '认领中', next: 'done', badgeClass: 'badge-claiming' },
  done: { label: '已完结', next: null, badgeClass: 'badge-done' },
}

// 根据分类的 value 取中文标签，找不到时原样返回（容错）
export function categoryLabel(value) {
  const found = CATEGORIES.find((c) => c.value === value)
  return found ? found.label : value
}
