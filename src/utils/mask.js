// 联系方式脱敏：核心原则——「存储存原文，展示时才打码」
// 这样发布者本人登录后仍能看到完整联系方式，而路人只能看到脱敏后的版本

// 判断是否为手机号（1 开头 + 第 2 位 3-9 + 共 11 位）
export function isPhone(v) {
  return /^1[3-9]\d{9}$/.test(String(v).trim())
}

// 脱敏展示：reveal=true 时原样返回（发布者本人看详情时用）
// 手机号：13812345678 -> 138****5678（保留前 3 后 4）
// 其他（QQ/微信等）：保留前 2 后 2，如 'QQ 1234567890' -> 'QQ****90'；太短的只留首字符
export function maskContact(value, reveal = false) {
  if (reveal || !value) return value || ''
  const s = String(value).trim()
  if (isPhone(s)) return s.slice(0, 3) + '****' + s.slice(7)
  if (s.length <= 4) return s[0] + '****'
  return s.slice(0, 2) + '****' + s.slice(-2)
}
