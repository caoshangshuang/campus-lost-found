<script setup>
// 发布页：发布新信息 + 编辑已有信息（双模式）
// 模式由地址栏区分：/publish = 新建；/publish?id=xxx = 编辑那条信息
import { ref, reactive, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getItemById, addItem, updateItem, currentUser } from '../store'
import { CATEGORIES, ITEM_TYPES } from '../data/constants'
import { validatePublishForm } from '../utils/validate'

const route = useRoute()
const router = useRouter()

// 编辑模式判断：地址带 ?id=xxx 且该信息存在
const editId = typeof route.query.id === 'string' ? route.query.id : ''
const editItem = editId ? getItemById(editId) : null
const isEdit = computed(() => Boolean(editItem))

// 防御：试图编辑不存在或非本人的信息 → 直接送回列表
if (editId && (!editItem || editItem.ownerId !== currentUser.value.id)) {
  router.replace('/items')
}

// 表单数据：reactive 包装整个对象（7 个字段一起管理比 7 个 ref 清晰）
// 编辑模式用原数据预填，新建模式给默认值
const form = reactive({
  type: editItem ? editItem.type : 'lost',
  title: editItem ? editItem.title : '',
  category: editItem ? editItem.category : '',
  location: editItem ? editItem.location : '',
  time: editItem ? editItem.time : '',
  contact: editItem ? editItem.contact : '',
  description: editItem ? editItem.description : '',
})

const errors = ref({})

function handleSubmit() {
  // 校验：错误明细进 errors，页面逐字段显示
  const check = validatePublishForm(form)
  errors.value = check.errors
  if (!check.ok) return

  // 提交前统一 trim，保证入库数据干净
  const payload = {
    type: form.type,
    title: form.title.trim(),
    category: form.category,
    location: form.location.trim(),
    time: form.time,
    contact: form.contact.trim(),
    description: form.description.trim(),
  }

  if (editItem) {
    updateItem(editItem.id, payload)
    router.push(`/items/${editItem.id}`)
  } else {
    const item = addItem(payload)
    router.push(`/items/${item.id}`)
  }
}
</script>

<template>
  <section class="publish-page">
    <h1>{{ isEdit ? '编辑信息' : '发布信息' }}</h1>

    <form class="publish-form" @submit.prevent="handleSubmit">
      <!-- 类型：radio 单选，v-model 绑定到 form.type -->
      <div class="field">
        <span class="label">类型</span>
        <div class="radio-group">
          <label>
            <input type="radio" value="lost" v-model="form.type" />
            {{ ITEM_TYPES.lost }}（我丢了东西）
          </label>
          <label>
            <input type="radio" value="found" v-model="form.type" />
            {{ ITEM_TYPES.found }}（我捡到东西）
          </label>
        </div>
        <p v-if="errors.type" class="error">{{ errors.type }}</p>
      </div>

      <div class="field">
        <span class="label">物品名称</span>
        <input v-model="form.title" type="text" placeholder="如：校园卡 / 蓝牙耳机" />
        <p v-if="errors.title" class="error">{{ errors.title }}</p>
      </div>

      <div class="field">
        <span class="label">物品分类</span>
        <select v-model="form.category">
          <option value="" disabled>请选择分类</option>
          <option v-for="c in CATEGORIES" :key="c.value" :value="c.value">
            {{ c.label }}
          </option>
        </select>
        <p v-if="errors.category" class="error">{{ errors.category }}</p>
      </div>

      <div class="field">
        <span class="label">地点</span>
        <input v-model="form.location" type="text" placeholder="如：图书馆二楼" />
        <p v-if="errors.location" class="error">{{ errors.location }}</p>
      </div>

      <div class="field">
        <span class="label">丢失/拾获时间</span>
        <input v-model="form.time" type="datetime-local" />
        <p v-if="errors.time" class="error">{{ errors.time }}</p>
      </div>

      <div class="field">
        <span class="label">联系方式</span>
        <input v-model="form.contact" type="text" placeholder="手机号 / QQ / 微信（对外脱敏展示）" />
        <p v-if="errors.contact" class="error">{{ errors.contact }}</p>
      </div>

      <div class="field">
        <span class="label">详细描述</span>
        <textarea
          v-model="form.description"
          rows="4"
          placeholder="物品特征、丢失经过、认领方式等（200 字以内）"
        ></textarea>
        <p v-if="errors.description" class="error">{{ errors.description }}</p>
      </div>

      <button type="submit" class="submit-btn">{{ isEdit ? '保存修改' : '发 布' }}</button>
    </form>
  </section>
</template>

<style scoped>
.publish-page {
  max-width: 560px;
  margin: 0 auto;
}

h1 {
  margin-bottom: 20px;
}

.publish-form {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.label {
  font-size: 14px;
  color: #555;
}

input,
select,
textarea {
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  font-family: inherit;
}

input:focus,
select:focus,
textarea:focus {
  outline: none;
  border-color: #1e88e5;
}

.radio-group {
  display: flex;
  gap: 20px;
  font-size: 14px;
}

.radio-group label {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
}

.error {
  color: #d32f2f;
  font-size: 13px;
  margin: 0;
}

.submit-btn {
  padding: 11px;
  background: #1e88e5;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
}

.submit-btn:hover {
  background: #1565c0;
}
</style>
