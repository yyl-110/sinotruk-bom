<template>
  <n-modal v-model:show="showModal" :mask-closable="false" @after-leave="closeModel">
    <div w-1200 rounded-4 bg-white>
      <header h-40 flex items-center flex-justify-between px-20>
        <div flex items-center>
          <div class="line" mr-8></div>
          <span text-14 font-bold text-hex-1d2129>逻辑匹配公式</span>
        </div>
        <img
          src="@/assets/images/close.png"
          alt=""
          class="h-16 w-16 cursor-pointer"
          @click="cancel"
        />
      </header>
      <n-spin :show="modalLoading">
        <main min-h-150 px-20 pt-20>
          <div class="form">
            <n-form
              ref="formRef"
              :model="formValue"
              :rules="rules"
              :label-width="120"
              label-placement="left"
              require-mark-placement="left"
              :disabled="modelType === 'detail'"
            >
              <n-grid :cols="24" :x-gap="24">
                <n-form-item-gi :span="8" label="规则名称" path="name">
                  <n-input v-model:value="formValue.name" placeholder="请输入" />
                </n-form-item-gi>
                <n-form-item-gi :span="8" label="所属M模块">
                  <n-select
                    v-model:value="formValue.model"
                    placeholder="请选择"
                    filterable
                    :options="mModuleList"
                    label-field="value"
                    label-value="key"
                    :render-option="$renderTooltip"
                    @update:value="(val) => changeModel(val)"
                  />
                </n-form-item-gi>
                <n-form-item-gi :span="8" label="排序">
                  <n-input-number v-model:value="formValue.sort" :min="0" button-placement="both">
                    <template #minus-icon>
                      <the-icon icon="input_minus" :size="14" type="custom" />
                    </template>
                    <template #add-icon>
                      <the-icon icon="input_add" :size="14" type="custom" />
                    </template>
                  </n-input-number>
                </n-form-item-gi>
                <n-form-item-gi :span="10" label="选择条件特征" max-h-210 class="cus-scroll-y">
                  <div class="w-full">
                    <div
                      v-for="(item, index) in formValue.sourceObjects"
                      :key="index"
                      mb-24
                      flex
                      items-center
                    >
                      <n-select
                        :value="formValue.sourceObjects[index].oid"
                        placeholder="请选择"
                        :options="allDesignCharacterList"
                        label-field="value"
                        value-field="key"
                        :render-option="$renderTooltip"
                        filterable
                        min-w-200
                        w-auto
                        flex-shrink-0
                        @update:value="(val, obj) => changeTarget(val, obj, index)"
                      />
                      <n-button
                        ml-10
                        h-32
                        w-32
                        rounded-4
                        :disabled="modelType === 'detail' || disabledAdd(item)"
                        @click="addTechnidal(index)"
                      >
                        <template #icon>
                          <the-icon type="custom" icon="addBtn" size="14" />
                        </template>
                      </n-button>
                      <n-button
                        v-if="index > 0"
                        ml-10
                        h-32
                        w-32
                        rounded-4
                        @click="minusTechnidal(index, formValue.sourceObjects[index].oid)"
                      >
                        <template #icon>
                          <the-icon type="custom" icon="icon_minus" size="14" />
                        </template>
                      </n-button>
                    </div>
                  </div>
                </n-form-item-gi>
                <n-form-item-gi :span="10" label="结果特征" max-h-210 class="cus-scroll-y">
                  <div class="w-full">
                    <div
                      v-for="(item, index) in formValue.targetObjects"
                      :key="index"
                      mb-24
                      flex
                      items-center
                    >
                      <n-select
                        :value="formValue.targetObjects[index].oid"
                        placeholder="请选择"
                        :options="resultList"
                        label-field="value"
                        filterable
                        value-field="key"
                        :render-option="$renderTooltip"
                        min-w-200
                        w-auto
                        flex-shrink-0
                        :loading="loading && !resultList.length"
                        @update:value="(val, obj) => resultFeature(val, obj, index)"
                      />
                      <div ml-10 h-32 w-32 flex-shrink-0>
                        <n-button
                          h-32
                          w-32
                          rounded-4
                          :disabled="modelType === 'detail'"
                          @click="addResult(index)"
                        >
                          <template #icon>
                            <the-icon type="custom" icon="addBtn" size="14" />
                          </template>
                        </n-button>
                      </div>
                      <div ml-10 h-32 w-32 flex-shrink-0>
                        <n-button
                          v-if="index > 0"
                          h-32
                          w-32
                          rounded-4
                          :disabled="modelType === 'detail'"
                          @click="minusResult(index, formValue.targetObjects[index].oid)"
                        >
                          <template #icon>
                            <the-icon type="custom" icon="icon_minus" size="14" />
                          </template>
                        </n-button>
                      </div>
                    </div>
                  </div>
                </n-form-item-gi>

                <n-form-item-gi :span="20" label="输入条件特征">
                  <n-input
                    v-model:value="formValue.expression"
                    type="textarea"
                    placeholder="请输入"
                    maxlength="150"
                    show-count
                    :disabled="textareaState === 1"
                  />
                </n-form-item-gi>
                <n-form-item-gi :span="4" label="">
                  <n-button
                    v-for="item in textareaBtn"
                    :key="item.type"
                    mr-10
                    mt-40
                    h-30
                    w-30
                    rounded-10
                    size="tiny"
                    :disabled="modelType === 'detail'"
                    @click="handleClickTextarea(item)"
                  >
                    <template #icon>
                      <the-icon type="custom" :icon="item.icon" :size="16" color="#1890FF" />
                    </template>
                  </n-button>
                </n-form-item-gi>
                <n-form-item-gi
                  :span="24"
                  label="特征值"
                  style="border-top: 1px solid #eaeaea"
                  pt-20
                >
                  <n-button
                    attr-type="button"
                    type="primary"
                    ml-20
                    :disabled="modelType === 'detail'"
                    @click="addTableColumns"
                  >
                    <template #icon>
                      <TheIcon icon="addBtn" type="custom" :size="16" class="mr-3" />
                    </template>
                    新增
                  </n-button>
                  <n-button
                    ml-20
                    :disabled="!checkedRowKeys.length || modelType === 'detail'"
                    @click="delTableColumns"
                  >
                    <template #icon>
                      <TheIcon icon="del" type="custom" :size="18" class="mr-3" />
                    </template>
                    删除
                  </n-button>
                </n-form-item-gi>
              </n-grid>
            </n-form>
          </div>
          <div v-if="showModal" w-full overflow-hidden>
            <n-data-table
              v-model:checked-row-keys="checkedRowKeys"
              :columns="customColumns"
              :data="data"
              :pagination="false"
              :row-key="rowKey"
              :scroll-x="scrollxWidth"
              :scrollbar-props="{ trigger: 'none' }"
              :max-height="280"
              w-full
            />
          </div>
        </main>
      </n-spin>

      <footer v-if="modelType !== 'detail'" h-70 flex items-center flex-justify-end px-20>
        <n-button mr-20 @click="showModal = false">取消</n-button>
        <n-button mr-20 @click="() => save()">保存</n-button>
        <n-button type="primary" @click="confirm">确定</n-button>
      </footer>
    </div>
  </n-modal>
</template>

<script setup>
import { NButton, NIcon, NInput, NSelect, NTooltip } from 'naive-ui'
import { computed, onUnmounted, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import {
  createLogicalRule,
  expressionComplianceCheck,
  getLogicalRuleDetail,
  globalTeachFeatureList,
  updateLogicalRule,
} from '~/src/api/feature'
import SvgIcon from '~/src/components/icon/SvgIcon.vue'
import useEnum from '~/src/hooks/useEnum'
import _, { isEmpty } from 'lodash'
const { queryAllDesignCharacterList, queryCharacterValueList, queryDistinctDesignCharacterList } =
  useEnum()
const route = useRoute()

const props = defineProps({
  mModuleList: {
    type: Array,
    default: () => [],
  },
})
const formValue = ref({
  sort: 0,
  name: '',
  model: null,
  sourceObjects: [{ oid: null }],
  targetObjects: [{ oid: null }],
})
// const formRef = ref(null)

const emits = defineEmits(['handleConfirm', 'handleClose'])

const data = ref([])

const scrollxWidth = computed(() => 200 + 200 * columns.value.length)

const modelType = ref('add') // add detail edit
const allDesignCharacterList = ref([]) // 技术特征枚举
const resultList = ref([]) // 结果枚举
const checkedRowKeys = ref([])
const rowKey = (row) => row.index
const columns = ref([])
const showModal = ref(false)
const textareaState = ref(1) // 1 禁止修改 2 允许修改
const storageExpression = ref('')
const selectOid = ref('')
const saveState = ref(false)
const loading = ref(false)
const modalLoading = ref(false)

const disabledAdd = (item) => {
  return !item.oid
}

const customColumns = computed(() => {
  if (!columns.value.length) return []
  return [
    { type: 'selection', width: 50 },
    ...columns.value.filter((item) => !isEmpty(item)),
    {
      title: '操作',
      key: 'actions',
      width: 150,
      fixed: 'right',
      render(row, index) {
        return h(
          'div',
          {
            class: 'flex items-center',
          },
          { default: () => btnList.map((i) => renderBtn(i, row, index)) }
        )
      },
    },
  ]
})

/* 点击文本框后面的按钮 */
const handleClickTextarea = (btn) => {
  switch (btn.type) {
    case 1:
      textareaState.value = 2
      storageExpression.value = formValue.value.expression
      break
    case 2:
      verificationFormula()
      break
    case 3:
      formValue.value.expression = storageExpression.value
      storageExpression.value = updateExpressionText()
      break
    default:
      break
  }
}

/* 校验合规 */
const verificationFormula = async () => {
  if (!formValue.value.expression) {
    $message.warning('条件特征不能为空')
    return
  }
  /* 检查手动调整内容是否合规，如果不合规报错，如果合规输入条件特征文本框切换至不可编辑 */
  const payload = {
    data: formValue.value.sourceObjects.map((item) => ({
      name: allDesignCharacterList.value.find((val) => val.key === item.oid)?.value,
    })),
    expression: formValue.value.expression,
  }
  const res = await expressionComplianceCheck(payload)
  if (res.success) {
    $message.success(res.message)
    textareaState.value = 1
  }
}

const textareaBtn = [
  { icon: 'edit', text: '编辑', type: 1 },
  { icon: 'icon_operate_8', text: '提交', type: 2 },
  { icon: 'icon_operate_22', text: '撤回', type: 3 },
]
const btnList = [
  { icon: 'icon_operate_8', text: '确认', type: 0 },
  { icon: 'edit', text: '修改', type: 1 },
  { icon: 'del', text: '删除', type: 2 },
  { icon: 'COPYING', type: 3, text: '复制' },
]

const renderBtn = (btn, row, index) => {
  if (row.actionType === 'edit') {
    if (btn.type === 0 || btn.type === 3) {
      return $toolTipWrap(
        btn.text,
        h(
          NButton,
          {
            size: 'tiny',
            class: 'rounded-10 w-30 mr-10 h-30',
            disabled: modelType.value === 'detail',
            onClick: () => {
              if (btn.type === 3) {
                copyTable(row, index)
                return
              }
              data.value[index].actionType = 'commit'
            },
          },
          {
            default: () =>
              h(
                NIcon,
                { size: 16, color: '#1890FF' },
                { default: () => h(SvgIcon, { icon: btn.icon }) }
              ),
          }
        )
      )
    }
    return ''
  }
  if (row.actionType === 'commit') {
    if (btn.type === 1 || btn.type === 2 || btn.type === 3) {
      return $toolTipWrap(
        btn.text,
        h(
          NButton,
          {
            size: 'tiny',
            class: 'rounded-10 w-30 mr-10 h-30',
            disabled: modelType.value === 'detail',
            onClick: () => {
              if (btn.type === 1) {
                data.value[index].actionType = 'edit'
              }
              if (btn.type === 2) {
                deleteTableData(row, index)
              }
              if (btn.type === 3) {
                copyTable(row, index)
              }
            },
          },
          {
            default: () =>
              h(
                NIcon,
                { size: 16, color: '#1890FF' },
                { default: () => h(SvgIcon, { icon: btn.icon }) }
              ),
          }
        )
      )
    }
    return ''
  }
}

const copyTable = (row, index) => {
  data.value.push({ ...row, index: `${index}-${new Date().getTime()}` })
}

const rules = {
  name: {
    required: true,
    message: '请输入规则名称',
    trigger: 'blur',
  },
}
/* 结果特征 */
const resultFeature = async (val, obj, index) => {
  // let originOid = formValue.value.targetObjects[index].oid
  formValue.value.targetObjects[index].oid = val

  const res = await queryCharacterValueList(val) // 动态获取特征值枚举
  const characterList = res.data
  const sourceLength = (formValue.value.sourceObjects || []).filter((item) => item.oid).length
  columns.value.splice(index + sourceLength, 1, {
    title: '结果：' + (obj?.value || ''),
    key: val,
    rowKey: '结果',
    width: 200,
    valueEnum: characterList,
    render(row, inx) {
      return h(NSelect, {
        value: row[val],
        labelField: 'value',
        valueField: 'key',
        filterable: true,
        disabled: row.actionType === 'commit' || modelType.value === 'detail',
        options: characterList,
        renderOption: ({ node, option }) =>
          h(NTooltip, null, {
            trigger: () => node,
            default: () => option.value,
          }),
        onUpdateValue(v) {
          data.value[inx][val] = v
        },
      })
    },
  })
}

/* 更新条件特征为初始状态 */
const updateExpressionText = (type = 'reset', val, index, originValue) => {
  if (type === 'reset') {
    let expressionTextArr = formValue.value.sourceObjects.map(
      (item) => allDesignCharacterList.value.find((val) => val.key === item.oid)?.value || ''
    )
    formValue.value.expression = expressionTextArr.map((item) => `(${item})`).join('&&')
    return
  }
  if (type === 'add') {
    /* 第一次添加 */
    if (!formValue.value.expression) {
      formValue.value.expression = `(${val})`
      return
    }
    /* 后面添加 */
    if (!originValue) {
      formValue.value.expression = `${formValue.value.expression}${val ? '&&' : ''}(${val})`
    } else {
      formValue.value.expression = formValue.value.expression.replace(originValue, val)
    }
  }
  if (type === 'del') {
    if (originValue) {
      formValue.value.expression = formValue.value.expression.replace(originValue, '')
    }
  }
}

/* 条件特征 */
const changeTarget = async (val, obj, index) => {
  /* 判断是否有已经选择的条件特征 */
  const sourceEffectiveState = formValue.value.sourceObjects.some((item) => item.oid)

  let originOid = formValue.value.sourceObjects[index].oid
  const originValue = allDesignCharacterList.value.find((item) => item.key === originOid)?.value
  /* 更新条件特征 */
  updateExpressionText('add', obj?.value, index, originValue)

  formValue.value.sourceObjects[index].oid = val

  const res = await queryCharacterValueList(val) // 动态获取特征值枚举
  const characterList = res.data

  const delteLength = sourceEffectiveState ? 1 : 0 // 条件特征长度为0=>直接插入

  columns.value.splice(index, delteLength, {
    title: '条件：' + (obj?.value || ''),
    key: val,
    rowKey: '条件',
    width: 200,
    valueEnum: characterList,
    render(row, inx) {
      return h(NSelect, {
        value: row[val],
        labelField: 'value',
        valueField: 'key',
        filterable: true,
        disabled: row.actionType === 'commit' || modelType.value === 'detail',
        options: characterList,
        tag: true,
        renderOption: ({ node, option }) =>
          h(NTooltip, null, {
            trigger: () => node,
            default: () => option.value,
          }),
        onUpdateValue(v) {
          data.value[inx][val] = v
        },
      })
    },
  })
}

/* 初始渲染 */
const renderColums = async (sourceObjects = [], targetObjects = []) => {
  let sourceArr = []
  for (const item of sourceObjects) {
    const res = await queryCharacterValueList(item.oid) // 动态获取特征值枚举
    sourceArr.push({
      title: '条件：' + (item.name || ''),
      key: item.oid,
      width: 200,
      rowKey: '条件',
      valueEnum: res.data,
      render(row, index) {
        return h(NSelect, {
          value: row[item.oid],
          labelField: 'value',
          valueField: 'key',
          filterable: true,
          tag: true,
          disabled: row.actionType === 'commit' || modelType.value === 'detail',
          options: res.data || [],
          // renderOption: ({ node, option }) =>
          //   h(NTooltip, null, {
          //     trigger: () => node,
          //     default: () => option.value,
          //   }),
          onUpdateValue(v) {
            data.value[index][item.oid] = v
          },
        })
      },
    })
  }
  const targetArr = []
  for (const item of targetObjects) {
    const res = await queryCharacterValueList(item.oid) // 动态获取特征值枚举
    targetArr.push({
      title: '结果：' + (item.name || ''),
      key: item.oid,
      width: 200,
      rowKey: '结果',
      valueEnum: res.data,
      render(row, index) {
        return h(NSelect, {
          value: row[item.oid],
          labelField: 'value',
          valueField: 'key',
          filterable: true,
          disabled: row.actionType === 'commit' || modelType.value === 'detail',
          options: res.data || [],
          // renderOption: ({ node, option }) =>
          //   h(NTooltip, null, {
          //     trigger: () => node,
          //     default: () => option.value,
          //   }),
          onUpdateValue(v) {
            data.value[index][item.oid] = v
          },
        })
      },
    })
  }
  columns.value = [...sourceArr, ...targetArr]
}

/**
 * 选择模块后需要动态获取结果特征
 * @param {*} val
 * @param skipHandleData 跳过处理
 * @return {*}
 */
const changeModel = async (val, skipHandleData = false) => {
  try {
    resultList.value = []
    loading.value = true
    const res = await globalTeachFeatureList({ oid: route.query.oid, name: val })
    resultList.value = res.data || []
    if (skipHandleData) return
    /* table数据 */
    let newData = []
    formValue.value.targetObjects.forEach((item) => {
      newData = data.value.map((it) => {
        delete it[item?.oid]
        return it
      })
    })
    data.value = newData
    /* form数据 */
    formValue.value.targetObjects = [{ oid: null }]
    /* table表头 */
    const sourceLength = (formValue.value.sourceObjects || []).filter((item) => item.oid).length //条件特征长度
    columns.value.splice(sourceLength)
  } catch (error) {
    console.log('error:', error)
  } finally {
    loading.value = false
  }
}

const save = async (callback = null) => {
  // formRef.value?.validate(async (errors) => {
  //   if (!errors) {
  // if (formValue.value.sourceObjects.some((item) => !item.oid)) {
  //   $message.info('条件特征不能为空')
  //   return
  // }
  // if (formValue.value.targetObjects.some((item) => !item.oid)) {
  //   $message.info('结果特征不能为空')
  //   return
  // }
  if (!formValue.value.name) {
    $message.warning('规则名不能为空')
    return
  }
  const formObj = {
    name: formValue.value.name,
    sort: formValue.value.sort,
    expression: formValue.value.expression,
    model: formValue.value.model,
    sourceObjects: formValue.value.sourceObjects.map((item) => ({
      oid: item.oid,
      name: allDesignCharacterList.value.find((val) => val.key === item.oid)?.value,
    })),
    targetObjects: formValue.value.targetObjects.map((item) => ({
      oid: item.oid,
      name: resultList.value.find((val) => val.key === item.oid)?.value,
    })),
  }
  /* 特征值 */
  const tableArr = []
  let tableValues = []
  const tjLength = columns.value.filter((item) => item.rowKey === '条件').length
  const keyArr = columns.value.map((item) => item.key)
  data.value.forEach((item) => {
    tableValues = keyArr.map((val) => item[val])

    const targetValues = tableValues.slice(tjLength)
    const sourceValues = tableValues.slice(0, tjLength)
    tableArr.push({
      sourceValues: sourceValues.map((val, inx) => ({
        oid: val,
        value:
          columns.value[inx]?.valueEnum.find((itemValue) => itemValue.key === val)?.value || val,
      })),
      targetValues: targetValues.map((val, inx) => ({
        oid: val,
        value: columns.value[inx + 1]?.valueEnum.find((itemValue) => itemValue.key === val)?.value,
      })),
    })
  })
  const payload = {
    oid: modelType.value === 'add' ? route.query.oid : selectOid.value,
    ...formObj,
    mappingValues: tableArr,
    type: 'mapping',
  }

  const apiUrl = modelType.value === 'edit' ? updateLogicalRule : createLogicalRule
  const res = await apiUrl(payload)
  if (res.success) {
    $message.success('保存成功')
    emits('handleConfirm', res.data, modelType.value)
    /* 保存成功后弹框变成编辑状态 */
    modelType.value = 'edit'
    selectOid.value = res?.data.oid

    saveState.value = true
    if (callback) {
      callback()
    }
  }
  // } else {
  //   console.log(errors)
  // }
  // })
}

const callback = () => {
  showModal.value = false
}

const addTableColumns = () => {
  if (customColumns.value.length < 3) {
    $message.info('条件特征或结果特征不能为空')
    return
  }
  data.value.push({ index: `${data.value.length}-${new Date().getTime()}`, actionType: 'edit' })
}

const delTableColumns = () => {
  checkedRowKeys.value.map((item) => {
    const index = data.value.findIndex((val) => val.index === item)
    data.value.splice(index, 1)
  })
  checkedRowKeys.value = []
}

const deleteTableData = (row, index) => {
  data.value.splice(index, 1)
}

const cancel = () => {
  showModal.value = false
}
const confirm = () => {
  if (saveState.value) {
    showModal.value = false
    return
  }
  save(callback)
}

const addTechnidal = () => {
  const sourceLength = (formValue.value.sourceObjects || []).filter((item) => item.oid).length
  formValue.value.sourceObjects.push({ oid: null })
  columns.value.splice(sourceLength, 0, {})
}
const minusTechnidal = (index, oid) => {
  formValue.value.sourceObjects.splice(index, 1)
  columns.value.splice(index, 1)
  data.value = data.value.map((item) => {
    delete item[oid]
    return item
  })
  updateExpressionText('reset')
}
const addResult = () => {
  formValue.value.targetObjects.push({ oid: null })
  columns.value.push({})
  // columns.value.splice(index + 1 + sourceLength, 0, {})
}
const minusResult = (index, oid) => {
  const sourceLength = (formValue.value.sourceObjects || []).filter((item) => item.oid).length
  formValue.value.targetObjects.splice(index, 1)
  data.value = data.value.map((item) => {
    delete item[oid]
    return item
  })
  columns.value.splice(index + sourceLength, 1)
}

const show = (type, oid) => {
  saveState.value = false
  selectOid.value = oid
  modelType.value = type
  /* 判断是否获取详情 */
  if (type === 'detail' || type === 'edit') {
    fetchData(oid)
  }
  // fetchResultList(oid)
  fetchAllDesignCharacterList()
  showModal.value = true
}
const close = () => {
  showModal.value = false
}

defineExpose({
  show,
  close,
})

const closeModel = () => {
  formValue.value = {
    name: '',
    model: null,
    sort: 0,
    sourceObjects: [{ oid: null }],
    targetObjects: [{ oid: null }],
  }
  columns.value = []
  data.value = []
  allDesignCharacterList.value = [] // 技术特征枚举
  resultList.value = [] // 结果枚举
  checkedRowKeys.value = []
  emits('handleClose')
}

const fetchData = async (oid) => {
  let res = {}
  try {
    modalLoading.value = true
    res = await getLogicalRuleDetail({ oid })
  } catch (error) {
    console.log('error:', error)
  } finally {
    modalLoading.value = false
  }
  /* 获取结果特征 */
  const arrData = res.data[0]
  await changeModel(arrData?.model, true)
  formValue.value = {
    expression: arrData?.expression,
    model: arrData?.model,
    name: arrData?.name,
    sort: Number(arrData?.sort || 0),
    sourceObjects: arrData.sourceObjects.length ? arrData.sourceObjects : [{ oid: null }],
    targetObjects: arrData.targetObjects.length ? arrData.targetObjects : [{ oid: null }],
  }
  /* 渲染表头 */
  renderColums(arrData.sourceObjects, arrData.targetObjects)

  /* 初始化表格数据 */
  if (arrData.mappingValues.length > 0) {
    /* 配置特征值 */
    data.value = arrData.mappingValues.map((item, index) => {
      /* 条件特征 */
      const sourceValues = {}
      item.sourceValues.forEach((val, inx) => {
        sourceValues[arrData.sourceObjects[inx].oid] = val.oid
      })
      /* 结果特征 */
      const targetValues = {}
      item.targetValues.forEach((val, inx) => {
        targetValues[arrData.targetObjects[inx].oid] = val.oid
      })
      return { ...sourceValues, ...targetValues, actionType: 'edit', index }
    })
  }
}

const fetchAllDesignCharacterList = async () => {
  const res = await queryAllDesignCharacterList(route.query.oid)
  allDesignCharacterList.value = res.data || []
}

const fetchResultList = async (oid) => {
  const res = await queryDistinctDesignCharacterList(oid ? oid : route.query.oid)
  resultList.value = res.data
}

watch(
  () => formValue.value.sourceObjects,
  (val) => {
    const targetObjectsKeys = formValue.value.sourceObjects.map((item) => item.oid)
    /* 设置禁用 */
    allDesignCharacterList.value = allDesignCharacterList.value.map((item) => {
      if (targetObjectsKeys.includes(item.key)) {
        return { ...item, disabled: true }
      }
      return { ...item, disabled: false }
    })
  },
  { deep: true }
)
watch(
  () => formValue.value.targetObjects,
  (val) => {
    const targetObjectsKeys = formValue.value.targetObjects.map((item) => item.oid)
    /* 设置禁用 */
    resultList.value = resultList.value.map((item) => {
      if (targetObjectsKeys.includes(item.key)) {
        return { ...item, disabled: true }
      }
      return { ...item, disabled: false }
    })
  },
  { deep: true }
)

onUnmounted(() => {
  formValue.value = null
  columns.value = null
  data.value = null
  allDesignCharacterList.value = null // 技术特征枚举
  resultList.value = null // 结果枚举
  checkedRowKeys.value = null
})
</script>

<style lang="scss" scoped>
footer {
  border-top: 1px solid #f2f3f5;
}
.line {
  width: 4px;
  height: 18px;
  background: #1890ff;
}
header {
  background: rgba(165, 180, 203, 0.1);
}
// .form {
//   border-bottom: 1px solid #eaeaea;
// }
</style>
