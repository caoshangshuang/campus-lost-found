// localStorage 安全读写：所有存取都经过这两个函数，应用其他代码不直接碰 localStorage
// 为什么包一层？localStorage 可能出问题：用户开了隐私模式、数据被别的代码写坏、存储已满……
// 一旦抛错我们不希望整个应用崩溃，所以用 try/catch 兜底

export function loadJSON(key, fallback = null) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    // JSON 损坏或存储不可用：返回兜底值，由调用方决定下一步（比如重新生成演示数据）
    return fallback
  }
}

export function saveJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch {
    return false // 写入失败（如存储已满），静默返回 false 而不是抛错
  }
}
