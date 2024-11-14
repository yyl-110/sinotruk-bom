<template>
  <n-modal v-model:show="showModal" :mask-closable="false" @after-leave="closeModel">
    <div w-1200 rounded-4 bg-white>
      <header h-40 flex items-center flex-justify-between px-20>
        <div flex items-center>
          <div class="line" mr-8></div>
          <span text-14 font-bold text-hex-1d2129>
            {{ modalType === 'edit' || modalType === 'add' ? '可选AC模块定义' : '可选AC模块详情' }}
          </span>
        </div>
        <img
          src="@/assets/images/close.png"
          alt=""
          class="h-16 w-16 cursor-pointer"
          @click="cancel"
        />
      </header>
      <n-spin :show="modalLoading">
        <main max-h-620 min-h-150 min-h-500 flex flex-col px-20 pt-20>
          <n-scrollbar max-h-380>
            <div class="form">
              <n-form
                ref="formRef"
                :model="formValue"
                :label-width="120"
                label-placement="left"
                require-mark-placement="left"
                :disabled="modalType === 'detail'"
              >
                <n-grid :cols="24" :x-gap="24">
                  <n-form-item-gi :span="8" label="AC模块">
                    <n-select
                      :value="formValue.model"
                      placeholder="请选择"
                      :options="acModuleList"
                      label-field="value"
                      label-value="key"
                      :render-option="$renderTooltip"
                      filterable
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
                  <n-form-item-gi :span="13" label="选择技术特征" max-h-210 class="cus-scroll-y">
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
                          :options="aCModuleTechCharasList"
                          label-field="value"
                          value-field="key"
                          :render-option="$renderTooltip"
                          :loading="loading"
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
                          :disabled="modalType === 'detail'"
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
                          :disabled="modalType === 'detail'"
                          @click="minusTechnidal(index, formValue.targetObjects[index].oid)"
                        >
                          <template #icon>
                            <the-icon type="custom" icon="icon_minus" size="14" />
                          </template>
                        </n-button>
                      </div>
                    </div>
                  </n-form-item-gi>
                </n-grid>
              </n-form>
            </div>
          </n-scrollbar>
          <div style="max-width: fit-content" min-w-full>
            <n-data-table
              v-model:checked-row-keys="checkedRowKeys"
              :columns="customColumns"
              :data="data"
              :pagination="false"
              :scroll-x="scrollxWidth"
              :scrollbar-props="{ trigger: 'none' }"
              :max-height="280"
              w-full
            />
          </div>
        </main>
      </n-spin>
      <footer v-if="modalType !== 'detail'" h-70 flex items-center flex-justify-end px-20>
        <n-button mr-20 @click="showModal = false">取消</n-button>
        <n-button mr-20 @click="() => save()">保存</n-button>
        <n-button type="primary" @click="confirm">确定</n-button>
      </footer>
    </div>
  </n-modal>
</template>

<script setup>
import { c, NButton, NIcon, NInput, NSelect, NTooltip } from 'naive-ui'
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import {
  createACModuleExcludeRule,
  getACModuleDesignCharacterList,
  getACModuleExcludeRuleDetail,
  updateACModuleExcludeRule,
} from '~/src/api/feature'
import SvgIcon from '~/src/components/icon/SvgIcon.vue'
import useEnum from '~/src/hooks/useEnum'
import _, { isEmpty } from 'lodash'
import { isArray } from '~/src/utils'

const { queryACModuleTechCharasList, queryACModuleList, queryCharacterValueList } = useEnum()
const route = useRoute()

const props = defineProps({
  mModuleList: {
    type: Array,
    default: () => [],
  },
})
const formValue = ref({
  model: null,
  sort: 0,
  targetObjects: [{ oid: null }],
})
const formRef = ref(null)

const emits = defineEmits(['handleConfirm', 'handleClose'])

const data = ref([])
const scrollxWidth = computed(() => 200 + 200 * columns.value.length)

const modalType = ref('add') // add detail edit
const aCModuleTechCharasList = ref([])
const acModuleList = ref([])
const characterValueList = ref([])
const checkedRowKeys = ref([])
const columns = ref([{}])
const selectOid = ref('')
const saveState = ref(false)
const saveData = ref({}) // 保存的数据
const loading = ref(false)
const modalLoading = ref(false)

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

const changeModel = async (val, skipHandleData = false) => {
  formValue.value.model = val
  try {
    loading.value = true
    const res = await queryACModuleTechCharasList(route.query.oid, formValue.value.model)
    aCModuleTechCharasList.value = res.data || []
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
    columns.value = [{}]
  } catch (error) {
    console.log('error:', error)
  } finally {
    loading.value = false
  }
}

const changeTarget = async (val, obj, index) => {
  if (!data.value.length) data.value = [{ actionType: 'edit' }]
  formValue.value.targetObjects[index].oid = val
  const res = await queryCharacterValueList(val) // 动态获取特征值枚举
  const characterList = res.data
  columns.value.splice(index, 1, {
    title: '技术：' + (obj?.value || ''),
    key: val,
    rowKey: '技术',
    width: 200,
    valueEnum: res.data,
    render(row, index) {
      return h(NSelect, {
        value: row[val],
        labelField: 'value',
        valueField: 'key',
        filterable: true,
        disabled: row.actionType === 'commit' || modalType.value === 'detail',
        options: characterList,
        multiple: true,
        renderOption: ({ node, option }) =>
          h(NTooltip, null, {
            trigger: () => node,
            default: () => option.value,
          }),
        onUpdateValue(v) {
          data.value[index][val] = v
        },
      })
    },
  })
}

const btnList = [
  { icon: 'icon_operate_8', text: '确认', type: 0 },
  { icon: 'edit', text: '修改', type: 1 },
  // { icon: 'COPYING', type: 3 },
]

const renderBtn = (btn, row, index) => {
  if (row.actionType === 'edit') {
    if (btn.type === 0) {
      return $toolTipWrap(
        btn.text,
        h(
          NButton,
          {
            size: 'tiny',
            class: 'rounded-10 w-30 mr-10 h-30',
            disabled: modalType.value === 'detail',
            onClick: () => {
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
    if (btn.type === 1) {
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

const save = async (callback = null) => {
  if (formValue.value.targetObjects.some((item) => !item.oid)) {
    $message.info('技术特征不能为空')
    return
  }
  const formObj = {
    name: formValue.value.name,
    sort: formValue.value.sort,
    model: formValue.value.model,
    targetObjects: formValue.value.targetObjects.map((item) => ({
      oid: item.oid,
      name: aCModuleTechCharasList.value.find((val) => val.key === item.oid)?.value,
    })),
    sourceObjects: [],
  }
  /* 特征值 */
  const tableArr = []
  let tableValues = []
  const keyArr = columns.value.map((item) => item.key)
  data.value.forEach((item) => {
    tableValues = keyArr.map((val) => item[val])
    tableArr.push({
      targetValues: tableValues.map((val) => ({
        oid: isArray(val) ? val.join(',') : val,
        // value: columns.value[inx]?.valueEnum.find((itemValue) => itemValue.key === val)?.value,
      })),
      sourceValues: [],
    })
  })
  const payload = {
    oid: modalType.value === 'add' ? route.query.oid : selectOid.value,
    ...formObj,
    mappingValues: tableArr,
  }

  const apiUrl = modalType.value === 'edit' ? updateACModuleExcludeRule : createACModuleExcludeRule
  const res = await apiUrl(payload)
  if (res.success) {
    $message.success('保存成功')
    emits('handleConfirm', res.data, modalType.value)

    /* 保存成功后弹框变成编辑状态 */
    modalType.value = 'edit'
    selectOid.value = res?.data.oid

    saveData.value = res.data
    saveState.value = true
    if (callback) {
      callback()
    }
  }
}

const callback = () => {
  showModal.value = false
}

// const rules = {
//   name: {
//     required: true,
//     message: '请输入系列编号',
//     trigger: 'blur',
//   },
// }

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

const addTechnidal = () => {
  formValue.value.targetObjects.push({ oid: null })
  columns.value.push({})
}
const minusTechnidal = (index, oid) => {
  formValue.value.targetObjects.splice(index, 1)
  // changeTarget()
  columns.value.splice(index, 1)
  data.value = data.value.map((item) => {
    delete item[oid]
    return item
  })
}

const show = (type, oid) => {
  saveState.value = false
  selectOid.value = oid
  modalType.value = type
  /* 判断是否获取详情 */
  if (type === 'detail' || type === 'edit') {
    fetchData(oid)
  }
  fetchACoduleList()
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
    model: null,
    sort: 0,
    targetObjects: [{ oid: null }],
  }
  columns.value = []
  data.value = []
  selectOid.value = ''
  aCModuleTechCharasList.value = []
  acModuleList.value = []
  characterValueList.value = []
  checkedRowKeys.value = []
  emits('handleClose')
}

/* 初始渲染 */
const renderColums = async (targetObjects = []) => {
  const arr = []
  for (const item of targetObjects) {
    const res = await queryCharacterValueList(item.oid) // 动态获取特征值枚举
    arr.push({
      title: '技术：' + (item.name || ''),
      key: item.oid,
      width: 200,
      rowKey: '技术',
      valueEnum: res.data,
      render(row, index) {
        return h(NSelect, {
          value: row[item.oid],
          labelField: 'value',
          valueField: 'key',
          filterable: true,
          disabled: row.actionType === 'commit' || modalType.value === 'detail',
          options: res.data,
          multiple: true,
          renderOption: ({ node, option }) =>
            h(NTooltip, null, {
              trigger: () => node,
              default: () => option.value,
            }),
          onUpdateValue(v) {
            data.value[index][item.oid] = v
          },
        })
      },
    })
  }
  columns.value = [...arr]
}

const fetchData = async (oid) => {
  let res = {}
  try {
    modalLoading.value = true
    res = await getACModuleExcludeRuleDetail({ oid })
  } catch (error) {
    console.log('error:', error)
  } finally {
    modalLoading.value = false
  }
  const arrData = res.data[0]
  await changeModel(arrData?.model, true)
  formValue.value = {
    model: arrData?.model,
    sort: Number(arrData?.sort || 0),
    targetObjects: arrData?.targetObjects.length ? arrData.targetObjects : [{ oid: null }],
  }
  // fetchAllDesignCharacterList()
  /* 渲染表头 */
  renderColums(arrData?.targetObjects || [])

  /* 初始化表格数据 */
  if (arrData?.mappingValues && arrData.mappingValues.length > 0) {
    data.value = arrData.mappingValues.map((item, index) => {
      /* 技术特征 */
      const targetValues = {}
      item.targetValues.forEach((val, inx) => {
        targetValues[arrData.targetObjects[inx].oid] = val.oid.split(',')
      })
      return { ...targetValues, actionType: 'edit', index }
    })
  }
}

const fetchAllDesignCharacterList = async () => {
  try {
    loading.value = true
    const res = await queryACModuleTechCharasList(route.query.oid, formValue.value.model)
    aCModuleTechCharasList.value = res.data
  } catch (error) {
    console.log('error:', error)
  } finally {
    loading.value = false
  }
}

const fetchACoduleList = async () => {
  const res = await queryACModuleList(route.query.oid)
  acModuleList.value = res.data
}
watch(
  () => formValue.value.targetObjects,
  (val) => {
    const targetObjectsKeys = formValue.value.targetObjects.map((item) => item.oid)
    /* 设置禁用 */
    aCModuleTechCharasList.value = aCModuleTechCharasList.value.map((item) => {
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
