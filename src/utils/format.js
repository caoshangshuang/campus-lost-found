// 日期格式化工具：全项目的"时间怎么显示"都集中在这里定义，改格式只改这一个文件

// 补零：5 -> '05'
export function pad2(n) {
  return String(n).padStart(2, '0')
}

// 时间戳 -> '2026-09-07 14:30'（withTime=false 时只到日期）
export function formatDate(ts, withTime = true) {
  const d = new Date(ts)
  const date = `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`
  if (!withTime) return date
  return `${date} ${pad2(d.getHours())}:${pad2(d.getMinutes())}`
}

// 时间戳 -> '09-07'（趋势图 x 轴标签用）
export function formatDay(ts) {
  const d = new Date(ts)
  return `${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`
}

// 时间戳 -> '刚刚 / 5分钟前 / 3小时前 / 2天前'（列表卡片用，比完整日期更友好）
export function timeAgo(ts) {
  const minutes = Math.floor((Date.now() - ts) / 60000)
  if (minutes < 1) return '刚刚'
  if (minutes < 60) return `${minutes}分钟前`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}小时前`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}天前`
  return formatDate(ts, false) // 超过一个月直接显示日期
}

// 时间戳 -> '2026-09-07T14:30'（<input type="datetime-local"> 的绑定值格式）
export function toLocalInputValue(ts) {
  const d = new Date(ts)
  return (
    `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}` +
    `T${pad2(d.getHours())}:${pad2(d.getMinutes())}`
  )
}
