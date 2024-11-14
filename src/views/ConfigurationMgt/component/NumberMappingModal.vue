<template>
  <n-modal v-model:show="showModal" :mask-closable="false" @after-leave="closeModel">
    <div w-1200 rounded-4 bg-white>
      <header h-40 flex items-center flex-justify-between px-20>
        <div flex items-center>
          <div class="line" mr-8></div>
          <span text-14 font-bold text-hex-1d2129>表号映射</span>
        </div>
        <img
          src="@/assets/images/close.png"
          alt=""
          class="h-16 w-16 cursor-pointer"
          @click="cancel"
        />
      </header>
      <n-spin :show="modalLoading">
        <main min-h-400 px-20 pt-20>
          <div class="form">
            <n-form
              ref="formRef"
              :model="formValue"
              :rules="rules"
              :label-width="120"
              label-placement="left"
              require-mark-placement="left"
              :disabled="modalType === 'detail'"
            >
              <n-grid :cols="24" :x-gap="24">
                <n-form-item-gi :span="10" label="规则名称" path="name">
                  <n-input v-model:value="formValue.name" placeholder="请输入" />
                </n-form-item-gi>
                <n-form-item-gi :span="10" label="排序">
                  <n-input-number v-model:value="formValue.sort" :min="0" button-placement="both">
                    <template #minus-icon>
                      <the-icon icon="input_minus" :size="14" type="custom" />
                    </template>
                    <template #add-icon>
                      <the-icon icon="input_add" :size="14" type="custom" />
                    </template>
                  </n-input-number>
                </n-form-item-gi>
                <n-form-item-gi :span="11" label="选择配置特征" max-h-210 class="cus-scroll-y">
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
                        filterable
                        max-w-250
                        min-w-180
                        w-auto
                        flex-shrink-0
                        :render-option="$renderTooltip"
                        @update:value="(val, obj) => changeTarget(val, obj, index)"
                      />
                      <n-button ml-10 h-32 w-32 rounded-4 @click="addTechnidal(index)">
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
                <n-form-item-gi :span="12" label="选择AC模块">
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
                        :options="acModuleList"
                        label-field="value"
                        value-field="key"
                        filterable
                        max-w-350
                        min-w-240
                        flex-shrink-0
                        :render-option="$renderTooltip"
                        @update:value="(val, obj) => resultFeature(val, obj, index)"
                      />
                      <div ml-10 h-32 w-32 flex-shrink-0>
                        <n-button h-32 w-32 rounded-4 @click="addResult">
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
                    :disabled="modalType === 'detail'"
                    @click="addTable"
                  >
                    <template #icon>
                      <TheIcon icon="addBtn" type="custom" :size="16" class="mr-3" />
                    </template>
                    新增
                  </n-button>
                  <n-button
                    ml-20
                    :disabled="!checkedRowKeys.length || modalType === 'detail'"
                    @click="delTable"
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
          <div w-full overflow-hidden>
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
      <footer v-if="modalType !== 'detail'" h-70 flex items-center flex-justify-end px-20>
        <n-button mr-20 @click="cancel">取消</n-button>
        <n-button mr-20 @click="() => save()">保存</n-button>
        <n-button type="primary" @click="confirm">确定</n-button>
      </footer>
    </div>
  </n-modal>
</template>

<script setup>
import { NButton, NIcon, NInput, NSelect, NTooltip } from 'naive-ui'
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import {
  createACPartMapRule,
  getACPartMapRuleDetail,
  getMappingRuleFeatureListForSpecial,
  getMappingRuleFeatureValuesForSpecial,
  tableMappingAcModuleNameEnum,
  updateACPartMapRule,
  getACPartList,
} from '~/src/api/config'
import SvgIcon from '~/src/components/icon/SvgIcon.vue'
import useEnum from '~/src/hooks/useEnum'
import { isEmpty } from '~/src/utils'
import _ from 'lodash'
const { queryCharacterValueList, queryACPartList } = useEnum()
const route = useRoute()
const rowKey = (row) => row.index

const formValue = ref({
  sort: 0,
  name: '',
  sourceObjects: [{ oid: null }],
  targetObjects: [{ oid: null }],
})
const formRef = ref(null)

const emits = defineEmits(['handleConfirm', 'handleClose'])

const data = ref([])

const scrollxWidth = computed(() => 200 + 200 * columns.value.length)

const modalType = ref('add') // add detail edit
const allDesignCharacterList = ref([])
const acModuleList = ref([])
const checkedRowKeys = ref([])
const handleOid = ref('')
const saveState = ref(false)

const columns = ref([])
const modalLoading = ref(false)

const btnList = [
  { icon: 'icon_operate_8', text: '确认', type: 0 },
  { icon: 'edit', text: '修改', type: 1 },
  { icon: 'del', text: '删除', type: 2 },
  { icon: 'COPYING', text: '复制', type: 3 },
]

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
            disabled: modalType.value === 'detail',
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
            disabled: modalType.value === 'detail',
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

/* 配置特征 */
const changeTarget = async (val, obj, index) => {
  formValue.value.sourceObjects[index].oid = val
  const spliceIndex = columns.value.some((item) => item.rowKey === '配置') ? 1 : 0
  const res = await getMappingRuleFeatureValuesForSpecial({
    oid: val,
    optionSetOid: route.query.oid,
  }) // 动态获取特征值枚举
  const characterList = res.data
  columns.value.splice(index, spliceIndex, {
    title: '配置：' + (obj?.value || ''),
    key: val,
    rowKey: '配置',
    width: 200,
    valueEnum: characterList,
    render(row, inx) {
      return h(NSelect, {
        value: row[val],
        labelField: 'value',
        valueField: 'key',
        filterable: true,
        disabled: row.actionType === 'commit' || modalType.value === 'detail',
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

/* Ac */
const resultFeature = async (val, obj, index) => {
  formValue.value.targetObjects[index].oid = val

  const res = await getACPartList({ oid: val }) // 动态获取特征值枚举
  const characterList = res.data
  const sourceLength = (formValue.value.sourceObjects || []).filter((item) => item.oid).length
  console.log('formValue.value.sourceObjects:', formValue.value.sourceObjects)
  console.log('sourceLength:', index + sourceLength)
  console.log('columns.value:', columns.value)
  columns.value.splice(index + sourceLength, 1, {
    title: 'AC：' + (obj?.value || ''),
    key: val,
    rowKey: 'AC',
    width: 200,
    valueEnum: characterList,
    render(row, inx) {
      return h(NSelect, {
        value: row[val],
        labelField: 'value',
        valueField: 'key',
        filterable: true,
        disabled: row.actionType === 'commit' || modalType.value === 'detail',
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

const addTable = () => {
  data.value.push({ index: `${data.value.length}-${new Date().getTime()}`, actionType: 'edit' })
}
const delTable = () => {
  checkedRowKeys.value.map((item) => {
    const index = data.value.findIndex((val) => val.index === item)
    data.value.splice(index, 1)
  })
  checkedRowKeys.value = []
}

const showModal = ref(false)
const cancel = () => {
  showModal.value = false
}
const callback = () => {
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
}

const addResult = () => {
  formValue.value.targetObjects.push({ oid: null })
  columns.value.push({})
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

const deleteTableData = (row, index) => {
  data.value.splice(index, 1)
}

const reset = () => {
  formRef.value.restoreValidation()
}

const show = (type, oid) => {
  saveState.value = false
  handleOid.value = oid
  modalType.value = type
  /* 判断是否获取详情 */
  if (type === 'detail' || type === 'edit') {
    fetchData(oid)
  }
  fetchAllDesignCharacterList()
  fetchACoduleList()
  showModal.value = true
}
const close = () => {
  showModal.value = false
}

const closeModel = () => {
  formValue.value = {
    sort: 0,
    name: '',
    sourceObjects: [{ oid: null }],
    targetObjects: [{ oid: null }],
  }
  columns.value = []
  data.value = []
  allDesignCharacterList.value = []
  acModuleList.value = []
  checkedRowKeys.value = []
  emits('handleClose')
}

defineExpose({
  show,
  close,
})

/* 初始渲染 */
const renderColums = async (sourceObjects = [], targetObjects = []) => {
  let sourceArr = []
  for (const item of sourceObjects) {
    const res = await getMappingRuleFeatureValuesForSpecial({
      oid: item.oid,
      optionSetOid: route.query.oid,
    }) // 动态获取特征值枚举
    sourceArr.push({
      title: '配置：' + (item.name || ''),
      key: item.oid,
      width: 200,
      rowKey: '配置',
      valueEnum: res.data,
      render(row, index) {
        return h(NSelect, {
          value: row[item.oid],
          labelField: 'value',
          valueField: 'key',
          filterable: true,
          disabled: row.actionType === 'commit' || modalType.value === 'detail',
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
    const res = await getACPartList({ oid: item.oid }) // 动态获取特征值枚举
    targetArr.push({
      title: 'AC：' + (item.name || ''),
      key: item.oid,
      width: 200,
      rowKey: 'AC',
      valueEnum: res.data,
      render(row, index) {
        return h(NSelect, {
          value: row[item.oid],
          labelField: 'value',
          valueField: 'key',
          filterable: true,
          disabled: row.actionType === 'commit' || modalType.value === 'detail',
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

const save = async (callback) => {
  const formObj = {
    name: formValue.value.name,
    sort: formValue.value.sort,
    sourceObjects: formValue.value.sourceObjects.map((item) => ({
      oid: item.oid,
      name: allDesignCharacterList.value.find((val) => val.key === item.oid)?.value,
    })),
    targetObjects: formValue.value.targetObjects.map((item) => ({
      oid: item.oid,
      name: acModuleList.value.find((val) => val.key === item.oid)?.value,
    })),
  }
  /* 特征值 */
  const tableArr = []
  let tableValues = []
  const tjLength = columns.value.filter((item) => item.rowKey === '配置').length
  const keyArr = columns.value.map((item) => item.key)
  data.value.forEach((item) => {
    tableValues = keyArr.map((val) => item[val])
    const targetValues = tableValues.slice(tjLength)
    const sourceValues = tableValues.slice(0, tjLength)
    tableArr.push({
      sourceValues: sourceValues.map((val, inx) => ({
        oid: val,
        value: columns.value[inx]?.valueEnum.find((itemValue) => itemValue.key === val)?.value,
      })),
      targetValues: targetValues.map((val, inx) => ({
        oid: val,
        value: columns.value[inx + 1]?.valueEnum.find((itemValue) => itemValue.key === val)?.value,
      })),
    })
  })
  const payload = { oid: handleOid.value, ...formObj, mappingValues: tableArr, type: 'include' }

  const apiUrl = modalType.value === 'edit' ? updateACPartMapRule : createACPartMapRule
  const res = await apiUrl(payload)
  if (res.success) {
    $message.success('保存成功')
    emits('handleConfirm', res.data, modalType.value)
    modalType.value = 'edit'
    handleOid.value = res?.data.oid
    saveState.value = true
    if (callback) {
      callback()
    }
  }
}

const fetchData = async (oid) => {
  let res = {}
  try {
    modalLoading.value = true
    res = await getACPartMapRuleDetail({ oid })
  } catch (error) {
    console.log('error:', error)
  } finally {
    modalLoading.value = false
  }
  const arrData = res.data[0]
  formValue.value = {
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
      /* AC特征 */
      const targetValues = {}
      item.targetValues.forEach((val, inx) => {
        targetValues[arrData.targetObjects[inx].oid] = val.oid
      })
      return { ...sourceValues, ...targetValues, actionType: 'edit', index }
    })
  }
}

const fetchAllDesignCharacterList = async () => {
  const res = await getMappingRuleFeatureListForSpecial({ oid: route.query.oid })
  allDesignCharacterList.value = res.data
}

const fetchACoduleList = async () => {
  const res = await tableMappingAcModuleNameEnum({
    oid: route.query.oid,
    ruleOid: modalType.value !== 'add' ? handleOid.value : '',
  })
  acModuleList.value = res.data
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
    acModuleList.value = acModuleList.value.map((item) => {
      if (targetObjectsKeys.includes(item.key)) {
        return { ...item, disabled: true }
      }
      return { ...item, disabled: false }
    })
  },
  { deep: true }
)
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
