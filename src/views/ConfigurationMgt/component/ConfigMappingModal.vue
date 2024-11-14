<template>
  <n-modal v-model:show="showModal" :mask-closable="false" @after-leave="closeModel">
    <div h-95vh w-90vw flex flex-col rounded-4 bg-white>
      <header h-40 w-full flex items-center flex-justify-between px-20>
        <div flex items-center>
          <div class="line" mr-8></div>
          <span text-14 font-bold text-hex-1d2129>配置特征映射</span>
        </div>
        <img
          src="@/assets/images/close.png"
          alt=""
          class="h-16 w-16 cursor-pointer"
          @click="cancel"
        />
      </header>
      <main min-h-150 w-full flex-1 overflow-x-auto px-20 pt-20>
        <n-spin :show="modalLoading">
          <div class="form">
            <n-form
              ref="formRef"
              :label-width="120"
              label-placement="left"
              :rules="rules"
              inline
              require-mark-placement="left"
            >
              <n-grid :cols="24" w-full :x-gap="24">
                <n-form-item-gi :span="8" label="选择配置特征">
                  <n-select
                    v-model:value="formValue.sourceObjects[0].oid"
                    :render-option="$renderTooltip"
                    placeholder="请选择"
                    :options="featureOption"
                    label-field="value"
                    value-field="key"
                    filterable
                    :disabled="mappingType === 'detail'"
                    @update:value="changeFeature"
                  />
                </n-form-item-gi>
                <n-form-item-gi :span="8" label="排序">
                  <n-input-number
                    v-model:value="formValue.sort"
                    :min="0"
                    button-placement="both"
                    :disabled="mappingType === 'detail'"
                  >
                    <template #minus-icon>
                      <the-icon icon="input_minus" :size="14" type="custom" />
                    </template>
                    <template #add-icon>
                      <the-icon icon="input_add" :size="14" type="custom" />
                    </template>
                  </n-input-number>
                </n-form-item-gi>
                <n-form-item-gi :span="8" label=""></n-form-item-gi>
                <n-form-item-gi :span="24" label="选择技术特征" max-h-210 class="cus-scroll-y">
                  <div
                    v-for="(item, index) in formValue.targetObjects"
                    :key="index"
                    mb-24
                    mr-24
                    flex
                    items-center
                    style="width: 30%"
                  >
                    <n-select
                      :value="formValue.targetObjects[index].oid"
                      placeholder="请选择"
                      :options="allDesignCharacterList"
                      label-field="value"
                      value-field="key"
                      filterable
                      :disabled="mappingType === 'detail'"
                      :render-option="$renderTooltip"
                      @update:value="(val, obj) => changeTarget(val, obj, index)"
                    />
                    <n-button
                      ml-10
                      h-32
                      w-32
                      rounded-4
                      :disabled="mappingType === 'detail'"
                      @click="add(index)"
                    >
                      <template #icon>
                        <the-icon type="custom" icon="icon_add" :size="14" />
                      </template>
                    </n-button>
                    <n-button
                      v-if="formValue.targetObjects.length > 1"
                      ml-10
                      h-32
                      w-32
                      rounded-4
                      :disabled="mappingType === 'detail'"
                      @click="minus(index, formValue.targetObjects[index].oid)"
                    >
                      <template #icon>
                        <the-icon type="custom" icon="icon_minus" :size="14" />
                      </template>
                    </n-button>
                  </div>
                </n-form-item-gi>
                <n-form-item-gi :span="24" label="特征值" mt-20>
                  <n-button
                    attr-type="button"
                    type="primary"
                    :disabled="mappingType === 'detail'"
                    @click="addTableColumns"
                  >
                    <template #icon>
                      <TheIcon icon="addBtn" type="custom" :size="16" class="mr-3" />
                    </template>
                    新增
                  </n-button>
                  <n-button
                    ml-20
                    :disabled="!checkedRowKeys.length || mappingType === 'detail'"
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
          <div mt-30 w-full overflow-hidden>
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
        </n-spin>
      </main>
      <footer v-if="mappingType !== 'detail'" h-70 flex items-center flex-justify-end px-20>
        <n-button mr-20 @click="showModal = false">取消</n-button>
        <n-button mr-20 @click="() => save()">保存</n-button>
        <n-button type="primary" @click="confirm">确定</n-button>
      </footer>
    </div>
  </n-modal>
</template>

<script setup>
import { NButton, NIcon, NInput, NSelect, NTooltip } from 'naive-ui'
import { computed, ref, watch } from 'vue'
import {
  getOrderDesignCharacterList,
  getSaleDesignMapRuleDetail,
  updateSaleDesignMapRule,
} from '@/api/feature'
import SvgIcon from '~/src/components/icon/SvgIcon.vue'
import useEnum from '@/hooks/useEnum'
import _ from 'lodash'
import {
  createLocalSaleDesignMapRule,
  getMappingRuleFeatureListForSpecial,
  getMappingRuleFeatureValuesForSpecial,
} from '@/api/config'
import { isEmpty } from '~/src/utils'
import { useRoute } from 'vue-router'
const route = useRoute()
const { queryCharacterValueList } = useEnum()
const formValue = ref({
  sort: 0,
  sourceObjects: [{ oid: null }],
  targetObjects: [{ oid: null }],
})
const formRef = ref(null)
const allDesignCharacterList = ref([]) // 技术特征枚举
const featureOption = ref([]) // 配置特征枚举
const checkedRowKeys = ref([])
const rowKey = (row) => row.index
const columns = ref([])
const mappingType = ref('new')
const selectOid = ref('')
const saveState = ref(false)
const modalLoading = ref(false)

const selectData = ref()
const emits = defineEmits(['handleConfirm', 'handleClose'])

const data = ref([])

const scrollxWidth = computed(() => 200 + 200 * columns.value.length)

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
            disabled: mappingType.value === 'detail',
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
            disabled: mappingType.value === 'detail',
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

const renderColums = async (targetObjects = [], sourceObjects = []) => {
  /* 配置特征表头 */
  let sourceArr = []
  if (sourceObjects.length) {
    const res = await getMappingRuleFeatureValuesForSpecial({
      oid: sourceObjects[0].oid,
      optionSetOid: route.query.oid,
    }) // 动态获取特征值枚举
    sourceArr = [
      {
        title: '配置：' + (sourceObjects[0].name || ''),
        key: sourceObjects[0].oid,
        rowKey: '配置',
        width: 200,
        minWidth: 150,
        resizable: true,
        render(row, index) {
          return h(NSelect, {
            value: row[sourceObjects[0].oid]?.oid,
            labelField: 'value',
            valueField: 'key',
            disabled: row.actionType === 'commit' || mappingType.value === 'detail',
            options: res.data,
            filterable: true,
            renderOption: ({ node, option }) =>
              h(NTooltip, null, {
                trigger: () => node,
                default: () => option.value,
              }),
            onUpdateValue(v, val) {
              data.value[index][sourceObjects[0].oid] = { oid: val?.key, value: val?.value }
            },
          })
        },
      },
    ]
  }
  const arr = []
  for (const item of targetObjects) {
    const res = await queryCharacterValueList(item?.oid) // 动态获取特征值枚举
    arr.push({
      title: '技术：' + (item.name || ''),
      key: item.oid,
      width: 200,
      minWidth: 150,
      resizable: true,
      rowKey: '技术',
      render(row, index) {
        return h(NSelect, {
          value: row[item.oid]?.oid,
          labelField: 'value',
          valueField: 'key',
          disabled: row.actionType === 'commit' || mappingType.value === 'detail',
          options: res.data,
          filterable: true,
          renderOption: ({ node, option }) =>
            h(NTooltip, null, {
              trigger: () => node,
              default: () => option.value,
            }),
          onUpdateValue(v, val) {
            data.value[index][item.oid] = { oid: val?.key, value: val?.value }
          },
        })
      },
    })
  }
  columns.value = [...sourceArr, ...arr]
}

/* 修改配置特征 */
const changeFeature = async (val, obj) => {
  /* 修改配置特征 */
  const spliceIndex = columns.value.some((item) => item.rowKey === '配置') ? 1 : 0
  const res = await getMappingRuleFeatureValuesForSpecial({
    oid: val,
    optionSetOid: route.query.oid,
  }) // 动态获取特征值枚举
  columns.value.splice(0, spliceIndex, {
    title: '配置：' + obj?.value,
    key: obj?.key,
    rowKey: '配置',
    width: 200,
    minWidth: 150,
    resizable: true,
    render(row, index) {
      return h(NSelect, {
        value: row[obj?.key]?.oid,
        labelField: 'value',
        valueField: 'key',
        filterable: true,
        disabled: row.actionType === 'commit' || mappingType.value === 'detail',
        options: res.data,
        renderOption: ({ node, option }) =>
          h(NTooltip, null, {
            trigger: () => node,
            default: () => option.value,
          }),
        onUpdateValue(v, it) {
          data.value[index][obj?.key] = { oid: it?.key, value: it?.value }
        },
      })
    },
  })
}

/* 修改技术特征 */
const changeTarget = async (val, obj, index) => {
  formValue.value.targetObjects[index].oid = val

  const res = await queryCharacterValueList(obj.key) // 动态获取特征值枚举
  columns.value.splice(index + 1, 1, {
    title: '技术：' + (obj?.value || ''),
    key: val,
    rowKey: '技术',
    width: 200,
    minWidth: 150,
    resizable: true,
    render(row, inx) {
      return h(NSelect, {
        value: row[val]?.oid,
        labelField: 'value',
        valueField: 'key',
        filterable: true,
        disabled: row.actionType === 'commit' || mappingType.value === 'detail',
        options: res.data,
        renderOption: ({ node, option }) =>
          h(NTooltip, null, {
            trigger: () => node,
            default: () => option.value,
          }),
        onUpdateValue(v, it) {
          data.value[inx][val] = { oid: it?.key, value: it?.value }
        },
      })
    },
  })
}

const addTableColumns = () => {
  if (customColumns.value.length < 3) {
    $message.info('配置特征不能为空')
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

const rules = {
  name: {
    required: true,
    message: '请输入子节点名称',
    trigger: 'blur',
  },
}

const showModal = ref(false)
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

const show = (type, oid) => {
  saveState.value = false
  selectOid.value = oid
  mappingType.value = type
  fetchData()
  fetchAllDesignCharacterList()
  showModal.value = true
  if (type === 'detail' || type === 'edit') {
    fetchDetail()
  }
}

const close = () => {
  showModal.value = false
}

const add = () => {
  formValue.value.targetObjects.push({ oid: null })
  columns.value.push({})
}
const minus = (index, oid) => {
  formValue.value.targetObjects.splice(index, 1)
  columns.value.splice(index + 1, 1)
  data.value = data.value.map((item) => {
    delete item[oid]
    return item
  })
}

const fetchData = async () => {
  const res = await getMappingRuleFeatureListForSpecial({ oid: route.query.oid })
  featureOption.value = res.data
}
const fetchAllDesignCharacterList = async () => {
  const res = await getOrderDesignCharacterList({ oid: route.query.oid })
  allDesignCharacterList.value = res.data
}
// const fetchCharacterValueList = async () => {
//   const res = await queryCharacterValueList(selectOid.value)
//   characterValueList.value = res.data
// }

const fetchDetail = async () => {
  let res = {}
  try {
    modalLoading.value = true
    res = await getSaleDesignMapRuleDetail({ oid: selectOid.value })
  } catch (error) {
    console.log('error:', error)
  } finally {
    modalLoading.value = false
  }
  selectData.value = res.data[0]
  formValue.value.sourceObjects[0].oid = res.data[0].sourceObjects[0]?.oid
  formValue.value.sort = res.data[0]?.sort

  if (res.data[0].targetObjects && res.data[0].targetObjects.length) {
    formValue.value.targetObjects = res.data[0].targetObjects.map((item) => ({
      oid: item?.oid,
    }))
  }
  renderColums(res.data[0]?.targetObjects || [], res.data[0]?.sourceObjects || [])
  /* 初始化表格数据 */
  if (res.data[0].mappingValues.length > 0) {
    /* 配置特征值 */
    data.value = res.data[0].mappingValues.map((item, index) => {
      /* 配置特征值添加 */
      const sourceValues = {
        [res.data[0].sourceObjects[0]?.oid]: item.sourceValues[0],
      }
      /* 技术特征值 */
      const targetValues = {}
      item.targetValues.forEach((val, inx) => {
        targetValues[res.data[0].targetObjects[inx].oid] = val
      })
      return { ...sourceValues, ...targetValues, actionType: 'edit', index }
    })
    console.log('data.value:', data.value)
  }
}
const save = async (callback = null) => {
  if (!formValue.value.sourceObjects[0]?.oid) {
    $message.info('配置特征不能为空')
    return
  }
  if (formValue.value.targetObjects.some((item) => !item.oid)) {
    $message.info('技术特征不能为空')
    return
  }
  const formObj = {
    sort: formValue.value.sort,
    sourceObjects: formValue.value.sourceObjects.map((item) => ({
      oid: item.oid,
      name: featureOption.value.find((val) => val.key === item.oid)?.value,
    })),
    targetObjects: formValue.value.targetObjects.map((item) => ({
      oid: item.oid,
      name: allDesignCharacterList.value.find((val) => val.key === item.oid)?.value,
    })),
  }
  const tableArr = []
  let tableValues = []
  const keyArr = columns.value.map((item) => item.key)
  data.value.forEach((item) => {
    tableValues = keyArr.map((val) => item[val])
    const targetValues = tableValues.slice(1)
    tableArr.push({
      sourceValues: [tableValues[0]],
      targetValues,
    })
  })
  const payload = { oid: selectOid.value, ...formObj, mappingValues: tableArr }
  if (
    tableArr.length &&
    tableArr.some(
      (item) => item.sourceValues.length + item.targetValues.length < tableValues.length
    )
  ) {
    $message.info('特征值不能为空')
    return
  }
  console.log('payload:', payload)
  const apiUrl =
    mappingType.value === 'edit' ? updateSaleDesignMapRule : createLocalSaleDesignMapRule
  const res = await apiUrl(payload)
  if (res.success) {
    $message.success('保存成功')
    emits('handleConfirm', res.data, mappingType.value)
    mappingType.value = 'edit'
    selectOid.value = res.data.oid
    saveState.value = true
    if (callback) {
      callback()
    }
  }
}
const callback = () => {
  showModal.value = false
}
const closeModel = () => {
  formValue.value = {
    sort: 0,
    sourceObjects: [{ oid: null }],
    targetObjects: [{ oid: null }],
  }
  columns.value = []
  data.value = []
  allDesignCharacterList.value = [] // 技术特征枚举
  featureOption.value = [] // 配置特征枚举
  checkedRowKeys.value = []
  emits('handleClose')
}

defineExpose({
  show,
  close,
})

watch(
  () => formValue.value.targetObjects,
  (val) => {
    const targetObjectsKeys = formValue.value.targetObjects.map((item) => item.oid)
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
.form {
  border-bottom: 1px solid #eaeaea;
}
.featureWrap {
  ::v-deep .n-form-item-blank {
    display: flex;
    width: 100%;
    flex-wrap: wrap;
  }
}
</style>
