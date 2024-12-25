export const ZTenum = [
  { value: '是', key: '是' },
  { value: '否', key: '否' },
]
export const STATEENUM = [
  { value: '未启用', key: '未启用' },
  { value: '启用', key: '启用' },
  { value: '停用', key: '停用' },
]

export const TSSTATEENUM = [
  { value: '已推送', key: '已推送' },
  { value: '未推送', key: '未推送' },
]
export const FEATUREENUM = [
  { value: '正常', key: '正常' },
  { value: '异常', key: '异常' },
]
export const ZYSTATEENUM = [
  { value: '未探查', key: '未探查' },
  { value: '缺资源', key: '缺资源' },
  { value: '资源全', key: '资源全' },
]
export const SPECIALZYSTATEENUM = [
  { value: '未探查', key: '未探查' },
  { value: '资源全', key: '资源全' },
]
export const XPBHENUM = [
  { value: '无变化', key: '无变化' },
  { value: '选装变化', key: '选装变化' },
  { value: '本次新增', key: '本次新增' },
]

/* 常规车型 */
export const btnList = [
  { text: '虚拟探查', icon: 'iconn_search_white', type: 9, color: '#fff' },
  { text: '批量探查', icon: 'icon_explore', type: 1 },
  { text: '整车AC任务下发', icon: 'icon_set', type: 3, color: 'red' },
  { text: '所长AC任务分配', icon: 'icon_set', type: 10, color: 'red' },
  { text: '设计员任务清单', icon: 'icon_view', type: 2, color: 'red' },
  { text: '查看配置号超级BOM', icon: 'icon_operate_2', type: 8, color: '#fff' },
  { text: '属性设置', icon: 'icon_attribute', type: 4 },
  { text: '查看配置号明细', icon: 'icon_operate', type: 7, color: '#fff' },
  { text: '发布', icon: 'icon_enable', type: 5 },
  { text: '停用', icon: 'icon_deactivate', type: 6 },
  { text: '配置号断点管理', icon: 'icon_operate_23', type: 11, color: '#fff' },
]
/* 特殊车型 */
export const specialBtnList = [
  { text: '批量探查', icon: 'icon_explore', type: 1 },
  // { text: '配置号AC任务设置', icon: 'icon_set', type: 3 },
  // { text: '配置号下发设计任务', icon: 'icon_set', type: 10 },
  // { text: '查看AC任务', icon: 'icon_view', type: 2 },
  { text: '查看配置号超级BOM', icon: 'icon_operate_2', type: 8, color: '#fff' },
  { text: '属性设置', icon: 'icon_attribute', type: 4 },
  { text: '查看配置号明细', icon: 'icon_operate', type: 7, color: '#fff' },
  { text: '发布', icon: 'icon_enable', type: 5 },
  { text: '停用', icon: 'icon_deactivate', type: 6 },
  // { text: '虚拟探查', icon: 'iconn_search_white', type: 9, color: '#fff' },
  { text: '配置号断点管理', icon: 'icon_operate_23', type: 11, color: '#fff' },
]

export const btnList2 = [
  { text: '查询', icon: 'iconn_search_white', type: 1 },
  { text: '刷新', icon: 'icon_resetting', type: 2 },
  { text: '清空全部型谱', icon: 'del', type: 4 },
]

export const searchDesc = {
  ConfigCode: '配置号',
  mainRecom: '主推',
  number: '短码',
  pushStatus: '推送状态',
  sourceStatus: '资源状态',
  spectrumStatus: '型谱变化',
  status: '状态',
}
