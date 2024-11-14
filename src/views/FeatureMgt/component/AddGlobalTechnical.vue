<!--
 * @Author: yyl
 * @Date: 2024-02-27 10:09:45
 * @LastEditors: yyl
 * @LastEditTime: 2024-09-19 09:12:34
 * @Description: 新增定位特征
-->
<template>
  <div w-full>
    <n-tabs type="line" animated :value="activeTab" @update:value="changeTab">
      <n-tab-pane name="1" :tab="optionType === 'add' ? `新增${title}` : `修改${title}`">
        <n-spin :show="updateLoading">
          <div class="wrap">
            <n-form
              ref="formRef"
              :model="formValue"
              label-placement="left"
              require-mark-placement="left"
              label-width="80"
              :rules="rules"
            >
              <n-form-item label="名称" path="name">
                <n-input
                  v-if="navValue === 'special'"
                  v-model:value="formValue.name"
                  placeholder="请输入"
                />
                <n-select
                  v-else
                  :value="formValue.name"
                  placeholder="请输入"
                  :options="designCharacterNameEnum"
                  :disabled="optionType === 'edit'"
                  label-field="value"
                  value-field="key"
                  :render-option="$renderTooltip"
                  filterable
                  clearable
                  :clear-filter-after-select="false"
                  :loading="loading"
                  @update:value="handleChangeName"
                />
              </n-form-item>
              <n-form-item label="特征分类" path="classification">
                <n-select
                  v-model:value="formValue.classification"
                  placeholder="请选择"
                  filterable
                  :options="designCharacterClsEnum"
                  label-field="value"
                  value-field="key"
                  :render-option="$renderTooltip"
                />
                <!-- <n-input v-model:value="formValue.classification" placeholder="请输入" /> -->
              </n-form-item>
              <n-form-item label="来源" path="source">
                <n-radio-group v-model:value="formValue.source" name="radiogroup1">
                  <n-space>
                    <n-radio v-for="item in comeList" :key="item.value" :value="item.value">
                      {{ item.label }}
                    </n-radio>
                  </n-space>
                </n-radio-group>
              </n-form-item>
              <n-form-item label="排序值">
                <n-input-number
                  v-model:value="formValue.sort"
                  :min="0"
                  max-w-120
                  button-placement="both"
                >
                  <template #minus-icon>
                    <the-icon icon="input_minus" size="14" type="custom" />
                  </template>
                  <template #add-icon>
                    <the-icon icon="input_add" size="14" type="custom" />
                  </template>
                </n-input-number>
                <div ml-20 text-12>值越小越靠前，支持小数点</div>
              </n-form-item>
              <n-form-item v-if="navValue === 'common'" label="描述">
                <n-input
                  v-model:value="formValue.description"
                  type="textarea"
                  placeholder="请输入"
                  maxlength="150"
                  show-count
                />
              </n-form-item>
              <n-form-item label="附件">
                <n-button @click="uploadFile">上传附件</n-button>
                <div
                  v-if="file || formValue?.fileName"
                  class="uploadWrap ml-12 flex cursor-pointer items-center"
                >
                  <span>{{ formValue?.fileName }}</span>
                  <n-icon size="20" ml-20 cursor-pointer class="icon" @click="delFile">
                    <icon-mdi:close />
                  </n-icon>
                </div>
                <input ref="fileInput" hidden type="file" @change="handleFileChange" />
              </n-form-item>
            </n-form>
          </div>
          <n-tabs type="line" animated mt-20>
            <template #suffix>
              <div flex items-center>
                <n-select
                  v-model:value="searchSelectFeature"
                  :options="searchOption"
                  placeholder="请选择"
                  filterable
                  size="small"
                  clearable
                  :render-option="$renderTooltip"
                ></n-select>
                <n-button ml-10 type="primary" size="small" @click="searchData">搜索</n-button>
              </div>
            </template>
            <n-tab-pane name="2" tab="特征值">
              <n-data-table
                ref="editTable"
                :columns="columns"
                :data="tableData"
                :pagination="false"
                :bordered="false"
                :max-height="300"
                class="editTable"
                mt-18
              >
                <template #empty>
                  <div></div>
                </template>
              </n-data-table>
              <div
                class="add h-42 flex items-center justify-center"
                cursor-pointer
                text-hex-1890ff
                @click="add"
              >
                <the-icon icon="addBtn" type="custom" color="#1890FF" :size="16" />
                新增一行
              </div>
              <div mt-20 flex flex-justify-end>
                <n-button type="primary" @click="save">保存</n-button>
              </div>
            </n-tab-pane>
          </n-tabs>
        </n-spin>
      </n-tab-pane>
      <n-tab-pane name="2" tab="特征逆查">
        <contrary-feature :oid="oid" />
      </n-tab-pane>
    </n-tabs>
  </div>
</template>

<script setup>
import { NButton, NIcon, NInput, NInputNumber, NSelect, NTooltip } from 'naive-ui'
import SvgIcon from '@/components/icon/SvgIcon.vue'
import ContraryFeature from './ContraryFeature.vue'

import useEnum from '@/hooks/useEnum'
import { computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import _ from 'lodash'
import {
  createDesignCharacter,
  createDesignCharacterV2,
  updateDesignCharacter,
  updateDesignCharacterV2,
} from '~/src/api/feature'
const route = useRoute()

const { queryDesignCharacterValueEnum, queryDesignCharacterNameEnum } = useEnum()

const designCharacterValueEnum = ref([])
const designCharacterNameEnum = ref([])
const loading = ref(false)

const props = defineProps({
  optionType: {
    type: String,
    default: 'add',
  },
  handleItem: {
    type: Object,
    default: () => {},
  },
  navValue: {
    type: String,
    default: '',
  },
  designCharacterClsEnum: {
    type: Array,
    default: () => [],
  },
  activeData: {
    type: String,
    default: '1',
  },
  selectOid: {
    type: String,
    default: '',
  },
})
const oid = computed(() => props.selectOid || route.query.oid)
const activeTab = ref(props.activeData)
const selectLoading = ref(false)
const changeTab = (val) => {
  activeTab.value = val
}
const title = computed(() => {
  return props.navValue === 'special' ? '特殊技术特征' : '定位特征'
})
const formValue = ref({})
const searchSelectFeature = ref(null)
const searchFeature = ref(null)
const formRef = ref(null)
const editTable = ref(null)
const fileInput = ref(null)
const file = ref(null)
const updateLoading = ref(false)
const emits = defineEmits(['handleConfim'])
const rules = {
  name: {
    required: true,
    message: '请输入名称',
    trigger: 'blur',
  },
}

const searchOption = computed(() => {
  return data.value.map((item) => ({ label: item.value, value: item.value }))
})

const data = ref([])
const tableData = computed(() => {
  if (searchFeature.value) {
    return data.value.filter((item) => item.value.includes(searchFeature.value))
  }
  return data.value
})

const searchData = () => {
  searchFeature.value = searchSelectFeature.value
}
const comeList = [
  { value: '订单', label: '订单' },
  { value: 'AC模块', label: 'AC模块' },
  { value: '逻辑工具', label: '逻辑工具' },
  { value: '无', label: '无' },
  { value: '逻辑工具或订单', label: '逻辑工具或订单' },
]

const columns = [
  {
    title: '排序',
    key: 'sort',
    width: 120,
    render(row, index) {
      return h(NInputNumber, {
        value: Number(row.sort),
        min: 0,
        buttonPlacement: 'both',
        disabled: row.actionType === 'commit',
        onUpdateValue(v) {
          data.value[index].sort = v
        },
      })
    },
  },
  {
    title: '值',
    key: 'value',
    width: 180,
    render(row, index) {
      if (props.navValue === 'special') {
        return h(NInput, {
          value: row.value,
          disabled: row.actionType === 'commit',
          onUpdateValue(v) {
            data.value[index].value = v
          },
        })
      }
      return h(NSelect, {
        value: row.value,
        disabled: row.actionType === 'commit' || selectLoading.value,
        labelField: 'value',
        valueField: 'key',
        filterable: true,
        options: designCharacterValueEnum.value,
        loading: selectLoading.value,
        renderOption: ({ node, option }) =>
          h(NTooltip, null, {
            trigger: () => node,
            default: () => option.value,
          }),
        onUpdateValue(v) {
          data.value[index].value = v
        },
      })
    },
  },
  {
    title: '操作',
    key: 'option',
    minWidth: 80,
    render: (row, index) => {
      if (row.actionType === 'edit') {
        return h(
          NButton,
          {
            size: 'tiny',
            class: 'rounded-10 w-30 h-30',
            onClick: () => {
              data.value[index].actionType = 'commit'
            },
          },
          {
            default: () =>
              h(
                NIcon,
                { size: 16, color: '#1890FF' },
                { default: () => h(SvgIcon, { icon: 'icon_operate_8' }) }
              ),
          }
        )
      }
      return h(
        'div',
        {
          class: 'flex items-center',
        },
        {
          default: () => btnList.map((i) => renderBtn(i, row, index)),
        }
      )
    },
  },
]

const renderBtn = (i, row, index) => {
  return $toolTipWrap(
    i.text,
    h(
      NButton,
      {
        size: 'tiny',
        onClick: () => handleClick(i?.type, row, index),
        class: 'rounded-10 w-30 mr-10 h-30',
      },
      {
        default: () =>
          h(NIcon, { size: 16, color: '#1890FF' }, { default: () => h(SvgIcon, { icon: i.icon }) }),
      }
    )
  )
}

const handleClick = (type, row, index) => {
  switch (type) {
    case 2:
      data.value[index].actionType = 'edit'
      break
    case 3:
      data.value.splice(index, 1)
      break
    default:
      break
  }
}

const btnList = [
  { icon: 'edit', text: '修改', type: 2 },
  { icon: 'del', text: '删除', type: 3 },
]
const add = () => {
  data.value.push({ sort: 1, value: null, actionType: 'edit' })
  nextTick(() => {
    editTable.value &&
      data.value.length > 5 &&
      editTable.value.scrollTo({
        left: 0,
        top: (data.value.length - 5) * 60 + 1000,
        behavior: 'smooth',
      })
  })
}
const deleteTable = (row, index) => {
  data.value.splice(index, 1)
}

const fetchEnumData = async (name = '') => {
  try {
    selectLoading.value = true
    const res = await queryDesignCharacterValueEnum(route.query.oid, name)
    designCharacterValueEnum.value = res.data
  } catch (error) {
    console.log('error:', error)
  } finally {
    selectLoading.value = false
  }
}
/* 特征枚举 */
const fetchFeatureEnumData = async (name = '') => {
  try {
    loading.value = true
    const res = await queryDesignCharacterNameEnum(route.query.oid)
    designCharacterNameEnum.value = res.data
    if (formValue.value.name) fetchEnumData(formValue.value.name)
  } catch (error) {
    console.log('error:', error)
  } finally {
    loading.value = false
  }
}

/* 修改名称 */
const handleChangeName = async (value, obj) => {
  formValue.value.name = value
  await fetchEnumData(obj.value)
  /* 特征值表格数据新增 */
  const tableArr = designCharacterValueEnum.value.map((item, index) => {
    return { sort: index + 1, value: item.key, actionType: 'edit' }
  })
  data.value = tableArr
}

const save = async () => {
  formRef.value?.validate(async (errors) => {
    if (!errors) {
      const newArr = _.cloneDeep(data.value)
      if (newArr.some((item) => !item.value)) {
        $message.info('特征值不能为空')
        return
      }
      try {
        updateLoading.value = true
        const payload = {
          oid: props.optionType === 'add' ? route.query.oid : props.selectOid,
          ...formValue.value,
          values: newArr.map((item) => {
            delete item.actionType
            return item
          }),
          type: props.navValue === 'special' ? '特殊特征' : '通用特征',
        }
        if (file.value && props.optionType === 'edit') {
          payload.filePath = ''
        }
        if (!file.value && !formValue.value.fileName && props.optionType === 'edit') {
          payload.filePath = ''
        }
        const formData = new FormData()
        formData.append('jsonObject', JSON.stringify(payload))
        file.value && formData.append('file', file.value)
        const apiUrl =
          props.optionType === 'add' ? createDesignCharacterV2 : updateDesignCharacterV2
        const res = await apiUrl(formData)
        if (res.success) {
          emits('handleConfim', res.data)
          $message.success('保存成功')
        }
      } catch (error) {
        console.log('error:', error)
      } finally {
        updateLoading.value = false
      }
    } else {
      console.log(errors)
    }
  })
}

const uploadFile = () => {
  fileInput.value.click()
}
const handleFileChange = async (e) => {
  const fileData = e.target.files[0]
  console.log('fileData:', fileData)
  file.value = fileData
  formValue.value.fileName = fileData.name
}

const delFile = () => {
  file.value = ''
  formValue.value.fileName = ''
}

watch(
  () => props.handleItem,
  (val) => {
    if (val?.oid) {
      data.value = val?.values.map((item) => ({ ...item, actionType: 'commit' }))
      formValue.value = {
        name: val?.name,
        sort: Number(val?.sort ?? 0),
        description: val?.description,
        classification: val?.classification,
        source: val?.source,
        filePath: val?.filePath,
        fileName: val?.fileName,
      }
      if (props.navValue === 'common') {
        fetchFeatureEnumData()
      }
    } else {
      if (props.optionType === 'add' && props.navValue === 'common') {
        fetchFeatureEnumData()
      }
      data.value = []
      formValue.value = {
        name: null,
        sort: 0,
        description: '',
        classification: null,
        source: '',
        filePath: '',
        fileName: '',
      }
    }
  },
  { deep: true }
)

onMounted(() => {
  if (props.optionType === 'add' && props.navValue === 'common') {
    fetchFeatureEnumData()
  }
})

watch(
  () => props.activeData,
  (val) => {
    activeTab.value = val
  }
)
watch(
  () => data.value,
  () => {
    if (props.navValue === 'common') {
      designCharacterValueEnum.value = designCharacterValueEnum.value.map((item) => {
        if (data.value.some((val) => val.value === item.value)) {
          return { ...item, disabled: true }
        }
        return { ...item, disabled: false }
      })
    }
  },
  { deep: true }
)
</script>

<style lang="scss" scoped>
.wrap {
  border-bottom: 1px solid #eaeaea;
}
.add {
  border-bottom: 1px solid #eeeeee;
}
::v-deep.n-data-table .n-data-table-empty {
  --n-empty-padding: 0;
}
::v-deep.editTable .n-data-table-td {
  padding: 12px 4px;
}
::v-deep.editTable .n-data-table-th {
  padding: 12px 6px;
}
.uploadWrap {
  .icon {
    display: none;
  }
  &:hover {
    .icon {
      display: block !important;
    }
  }
}
</style>
