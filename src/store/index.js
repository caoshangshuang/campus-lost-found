// 全局状态层（store）：应用所有页面共享的数据与操作都集中在这里（单一数据源）
// 设计思路：页面组件只管"显示和交互"，数据怎么存、怎么变全部由 store 负责，
// 这样页面之间共享数据不需要互相传参，也方便统一做持久化（localStorage）
import { reactive, computed } from 'vue'
import { loadJSON, saveJSON } from '../utils/storage'
import { buildSeedItems, USERS } from '../data/seed'
import { STATUS_META } from '../data/constants'

// localStorage 的键名，带版本号：将来数据结构升级时换新键名即可，避免读旧数据出错
const STORAGE_KEY = 'lost_found_v1'

// 初始化状态：优先读浏览器里保存的数据；没有（首次使用或被清空）就用种子数据
function initState() {
  const saved = loadJSON(STORAGE_KEY)
  // 校验读出来的结构是否可用：有 items 数组且非空才算有效存档
  if (saved && Array.isArray(saved.items) && saved.items.length > 0) {
    return saved
  }
  const fresh = { items: buildSeedItems(), session: { userId: null } }
  saveJSON(STORAGE_KEY, fresh)
  return fresh
}

// 整个应用共享的响应式状态：任何页面 import 进去改它，其他页面立刻跟着变
export const state = reactive(initState())

// 每次数据变化后写回 localStorage，刷新页面数据不丢
function persist() {
  saveJSON(STORAGE_KEY, state)
}

// ---------- 会话（登录 / 登出） ----------

// 当前登录用户：根据 session.userId 实时算出；未登录为 null
export const currentUser = computed(() =>
  USERS.find((u) => u.id === state.session.userId) || null,
)

export function isLoggedIn() {
  return state.session.userId !== null
}

export function login(studentId, password) {
  const user = USERS.find((u) => u.id === studentId && u.password === password)
  if (!user) return false // 学号或密码不对
  state.session.userId = user.id
  persist()
  return true
}

export function logout() {
  state.session.userId = null
  persist()
}

// ---------- 物品操作 ----------

export function getItemById(id) {
  return state.items.find((i) => i.id === id) || null
}

// 新增发布：把表单数据转成物品对象，插到列表最前面（最新的排第一）
export function addItem(form) {
  const id = 'u_' + Date.now() + '_' + Math.floor(Math.random() * 1000)
  const item = {
    id,
    type: form.type,
    title: form.title.trim(),
    category: form.category,
    location: form.location.trim(),
    time: form.time, // 丢失/拾获时间
    description: form.description.trim(),
    contact: form.contact.trim(), // 存原文，展示时才脱敏（见 utils/mask.js）
    status: 'pending',
    ownerId: currentUser.value.id,
    ownerName: currentUser.value.name,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  }
  state.items.unshift(item) // unshift：插入数组最前面
  persist()
  return item
}

// 更新发布：把 patch 里的字段合并到原对象上（只改表单里有的字段）
export function updateItem(id, patch) {
  const item = getItemById(id)
  if (!item) return null
  Object.assign(item, patch, { updatedAt: Date.now() })
  persist()
  return item
}

// 删除发布（只能删自己的，调用方负责校验）
export function removeItem(id) {
  state.items = state.items.filter((i) => i.id !== id)
  persist()
}

// 状态流转：只能按 pending → claiming → done 单向推进（状态机）
// 下一步去哪由 STATUS_META 里的 next 决定，防止非法跳转
export function advanceStatus(id) {
  const item = getItemById(id)
  if (!item) return null
  const meta = STATUS_META[item.status]
  if (!meta.next) return item // 已到终点（done），不能再推进
  item.status = meta.next
  item.updatedAt = Date.now()
  persist()
  return item
}

// ---------- 查询辅助 ----------

// 全部物品，按发布时间倒序（最新的在前）；先复制再排序，不改变原始数组
export const sortedItems = computed(() =>
  [...state.items].sort((a, b) => b.createdAt - a.createdAt),
)

// 某人的全部发布（"我的发布"页用）
export function itemsByOwner(ownerId) {
  return state.items.filter((i) => i.ownerId === ownerId)
}
