// 演示数据种子：应用首次运行（或清空浏览器数据后）写入 localStorage
// 关键设计：所有时间都用"相对今天"计算（daysAgo 天前），而不是写死日期——
// 否则过几天后"近 7 日发布趋势"图表会因为没有当天数据而全是 0

import { toLocalInputValue } from '../utils/format'

// 演示账号：两个账号用于展示"我的发布"会随登录人不同而变化
export const USERS = [
  { id: '2023001', name: '张三', password: '123456' },
  { id: '2023002', name: '李四', password: '123456' },
]

// 生成"daysAgo 天前、hour 点的 20 分"的 Date 对象
// 分钟固定为 20：同一批数据每次生成的结果完全一致，方便核对
function day(daysAgo, hour) {
  const d = new Date()
  d.setDate(d.getDate() - daysAgo)
  d.setHours(hour, 20, 0, 0)
  return d
}

// 16 条种子数据的规格表，每条一行：
// daysAgo 覆盖 0~8 天前（其中 0~6 在趋势图 7 天窗口内，7~8 天在窗口外，用来验证筛选正确）
// 张三(2023001) 和李四(2023002) 各 8 条
const ITEM_ROWS = [
  { id: 'i_101', type: 'lost', title: '校园卡', category: 'card', location: '图书馆二楼', daysAgo: 0, hour: 9, ownerId: '2023001', status: 'pending', contact: '13812345678', description: '蓝色卡套包着的校园卡，卡尾号 8321，在图书馆二楼电子阅览区丢失。' },
  { id: 'i_102', type: 'found', title: '蓝牙耳机', category: 'electronics', location: '第一食堂', daysAgo: 0, hour: 12, ownerId: '2023002', status: 'pending', contact: '15923456789', description: '白色充电仓的蓝牙耳机，在第一食堂东侧餐桌下捡到。' },
  { id: 'i_103', type: 'lost', title: '宿舍钥匙', category: 'keys', location: '5号宿舍楼', daysAgo: 0, hour: 7, ownerId: '2023002', status: 'claiming', contact: '13734567890', description: '一串三把钥匙，带蓝色钥匙扣，出宿舍楼时不慎掉落。' },
  { id: 'i_104', type: 'found', title: '高等数学教材', category: 'books', location: '教3-101', daysAgo: 1, hour: 10, ownerId: '2023001', status: 'pending', contact: '18645678901', description: '同济版《高等数学》上册，扉页写有名字，遗落在教3-101 靠窗第三排。' },
  { id: 'i_105', type: 'lost', title: '黑色羽绒服', category: 'clothes', location: '操场看台', daysAgo: 1, hour: 17, ownerId: '2023002', status: 'pending', contact: '13556789012', description: '黑色长款羽绒服，口袋里有双深色手套，落在操场看台上。' },
  { id: 'i_106', type: 'found', title: '学生证', category: 'card', location: '校门口', daysAgo: 2, hour: 8, ownerId: '2023001', status: 'done', contact: '18867890123', description: '捡到一张学生证，计算机学院的同学，已当面归还。' },
  { id: 'i_107', type: 'lost', title: 'U盘', category: 'electronics', location: '实验楼B座', daysAgo: 2, hour: 15, ownerId: '2023002', status: 'claiming', contact: '13978901234', description: '银色 32G U盘，挂在黑色挂绳上，实验楼B座机房丢失。' },
  { id: 'i_108', type: 'found', title: '保温杯', category: 'other', location: '图书馆一楼', daysAgo: 3, hour: 11, ownerId: '2023001', status: 'claiming', contact: '15089012345', description: '不锈钢保温杯，杯身贴有卡通贴纸，图书馆一楼大厅捡到。' },
  { id: 'i_109', type: 'lost', title: '眼镜', category: 'other', location: '体育馆', daysAgo: 3, hour: 18, ownerId: '2023002', status: 'done', contact: '15290123456', description: '黑框眼镜，装在灰色眼镜盒里，体育馆更衣室附近遗失，已找回。' },
  { id: 'i_110', type: 'found', title: '考研单词书', category: 'books', location: '教1-204', daysAgo: 4, hour: 9, ownerId: '2023002', status: 'pending', contact: 'QQ 1234567890', description: '考研英语单词书，封面写有笔记，在教1-204 教室捡到。' },
  { id: 'i_111', type: 'lost', title: '充电宝', category: 'electronics', location: '二食堂二楼', daysAgo: 4, hour: 13, ownerId: '2023001', status: 'pending', contact: '13601234567', description: '白色 20000mAh 充电宝，二食堂二楼靠窗座位遗失。' },
  { id: 'i_112', type: 'found', title: '运动手表', category: 'electronics', location: '操场跑道', daysAgo: 5, hour: 17, ownerId: '2023001', status: 'claiming', contact: '18712345678', description: '黑色运动手表，屏幕完好，在操场跑道东北角捡到。' },
  { id: 'i_113', type: 'lost', title: '笔记本', category: 'books', location: '图书馆三楼自习区', daysAgo: 5, hour: 21, ownerId: '2023002', status: 'pending', contact: '15823456789', description: '蓝色活页笔记本，内页有课程笔记，图书馆三楼自习区遗失。' },
  { id: 'i_114', type: 'found', title: '雨伞', category: 'other', location: '教学楼大厅', daysAgo: 6, hour: 8, ownerId: '2023001', status: 'pending', contact: '微信 wx123456', description: '深蓝色折叠雨伞，在教学楼大厅伞架旁捡到。' },
  { id: 'i_115', type: 'lost', title: '围巾', category: 'clothes', location: '校医院门口', daysAgo: 7, hour: 10, ownerId: '2023002', status: 'done', contact: '13334567890', description: '灰色羊毛围巾，校医院门口长椅上遗失，已找回。' },
  { id: 'i_116', type: 'found', title: '钥匙串', category: 'keys', location: '快递站门口', daysAgo: 8, hour: 16, ownerId: '2023001', status: 'done', contact: '18945678901', description: '两把钥匙带小熊挂件，在快递站门口捡到，已归还失主。' },
]

// 把规格表转换成应用使用的完整物品对象数组
export function buildSeedItems() {
  return ITEM_ROWS.map((row) => {
    const createdAt = day(row.daysAgo, row.hour).getTime() // 毫秒时间戳，趋势图按它分桶
    const owner = USERS.find((u) => u.id === row.ownerId)
    return {
      id: row.id,
      type: row.type,
      title: row.title,
      category: row.category,
      location: row.location,
      time: toLocalInputValue(createdAt), // 丢失/拾获时间（与发布时间一致，演示用）
      description: row.description,
      contact: row.contact, // 存原始值，展示时才脱敏
      status: row.status,
      ownerId: row.ownerId,
      ownerName: owner.name,
      createdAt,
      updatedAt: createdAt,
    }
  })
}
