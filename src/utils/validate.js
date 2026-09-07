// 表单校验：统一返回 { ok, errors } 形状
// ok = 是否全部通过；errors = { 字段名: 错误提示文字 }，页面直接拿 errors.xxx 显示
import { CATEGORIES, ITEM_TYPES } from '../data/constants'

// 学号：6-12 位数字
export function isValidStudentId(v) {
  return /^\d{6,12}$/.test(String(v).trim())
}

// 登录表单：学号 + 密码
export function validateLogin(studentId, password) {
  const errors = {}
  if (!studentId || !studentId.trim()) {
    errors.studentId = '请输入学号'
  } else if (!isValidStudentId(studentId)) {
    errors.studentId = '学号为 6-12 位数字'
  }
  if (!password) {
    errors.password = '请输入密码'
  } else if (password.length < 6) {
    errors.password = '密码至少 6 位'
  }
  return { ok: Object.keys(errors).length === 0, errors }
}

// 发布/编辑表单：7 个字段全部校验
export function validatePublishForm(form) {
  const errors = {}

  if (!form.type || !ITEM_TYPES[form.type]) {
    errors.type = '请选择信息类型'
  }

  const title = (form.title || '').trim()
  if (!title) {
    errors.title = '请填写物品名称'
  } else if (title.length > 20) {
    errors.title = '物品名称不超过 20 字'
  }

  if (!CATEGORIES.some((c) => c.value === form.category)) {
    errors.category = '请选择物品分类'
  }

  if (!form.location || !form.location.trim()) {
    errors.location = '请填写地点'
  }

  if (!form.time) {
    errors.time = '请选择时间'
  } else if (new Date(form.time).getTime() > Date.now()) {
    errors.time = '时间不能晚于现在'
  }

  const contact = (form.contact || '').trim()
  if (!contact) {
    errors.contact = '请填写联系方式'
  } else if (contact.length < 3 || contact.length > 30) {
    errors.contact = '联系方式长度 3-30 个字符'
  }

  const description = (form.description || '').trim()
  if (!description) {
    errors.description = '请填写物品描述'
  } else if (description.length > 200) {
    errors.description = '描述不超过 200 字'
  }

  return { ok: Object.keys(errors).length === 0, errors }
}
