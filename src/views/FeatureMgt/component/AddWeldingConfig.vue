<template>
  <div w-full>
    <n-tabs type="line" animated>
      <n-tab-pane name="1" :tab="optionType === 'add' ? `新增${title}` : `修改${title}`">
        <n-collapse :default-expanded-names="['1']">
          <template #arrow>
            <the-icon type="custom" icon="icon_form_fold" :size="16" color="#1D2129" />
          </template>
          <n-collapse-item title="" name="1">
            <template #header="{ collapsed }">
              <div w-full flex items-center justify-between>
                <span>{{ collapsed ? '展开' : '收起' }}</span>
                <div h-full flex items-center>
                  <!-- <the-icon
                    type="custom"
                    icon="toTop"
                    :size="16"
                    color="#1890ff"
                    class="toTop"
                    :class="[collapsed && 'extend']"
                  /> -->
                </div>
              </div>
            </template>
            <div class="wrap">
              <n-form
                ref="formRef"
                :model="formValue"
                label-placement="left"
                require-mark-placement="left"
                label-width="100"
                :rules="rules"
              >
                <n-form-item label="名称" path="name">
                  <n-input v-model:value="formValue.name" placeholder="请输入" />
                </n-form-item>
                <n-form-item label="配置类别">
                  <n-select
                    v-model:value="formValue.type"
                    placeholder="请选择"
                    filterable
                    :options="options"
                    disabled
                  />
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
                  <div ml-10 text-12>值越小越靠前，支持小数点</div>
                </n-form-item>
                <n-form-item label="备注说明">
                  <n-input
                    v-model:value="formValue.description"
                    type="textarea"
                    placeholder="请输入"
                    maxlength="150"
                    show-count
                  />
                </n-form-item>
              </n-form>
            </div>
          </n-collapse-item>
        </n-collapse>
      </n-tab-pane>
    </n-tabs>
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
          mt-18
          class="editTable"
          :max-height="300"
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
  </div>
</template>

<script setup>
import { NButton, NIcon, NInput, NInputNumber } from 'naive-ui'
import SvgIcon from '@/components/icon/SvgIcon.vue'
import { computed, nextTick, watch } from 'vue'
import { useRoute } from 'vue-router'
import { createSaleCharacter, updateSaleCharacter } from '~/src/api/feature'
import _ from 'lodash'

const route = useRoute()
const editTable = ref(null)

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
  handleOid: {
    type: String,
    default: '',
  },
})
const options = [
  { label: '固化配置', value: 'fixed' },
  { label: '选装配置', value: 'optional' },
]
const title = computed(() => {
  return props.navValue === 'fixed' ? '固化配置' : '选装配置'
})
const formValue = ref({ type: props.navValue })
const searchSelectFeature = ref(null)
const searchFeature = ref(null)
const formRef = ref(null)
const emits = defineEmits(['handleConfim'])
const rules = {
  name: {
    required: true,
    message: '请输入名称',
    trigger: 'blur',
  },
  type: {
    required: true,
    message: '请输入配置类型',
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

const columns = ref([
  {
    title: '排序',
    key: 'sort',
    minWidth: 120,
    render(row, index) {
      return h(NInputNumber, {
        value: row.sort,
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
    title: '特征值',
    key: 'value',
    width: 180,
    render(row, index) {
      return h(NInput, {
        value: row.value,
        disabled: row.actionType === 'commit',
        onUpdateValue(v) {
          data.value[index].value = v
        },
      })
    },
  },
  {
    title: '销售语言',
    key: 'saleDesc',
    width: 70,
    render(row, index) {
      return h(NInput, {
        disabled: row.actionType === 'commit',
        value: row.saleDesc,
        onUpdateValue(v) {
          data.value[index].saleDesc = v
        },
      })
    },
  },
  {
    title: '操作',
    key: 'option',
    width: 90,
    render: (row, index) =>
      h(
        'div',
        {
          class: 'flex items-center',
        },
        {
          default: () => [
            row.actionType === 'edit' &&
              h(
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
              ),
            row.actionType === 'commit' &&
              h(
                NButton,
                {
                  size: 'tiny',
                  class: 'rounded-10 w-30 mr-10 h-30',
                  onClick: () => {
                    data.value[index].actionType = 'edit'
                  },
                },
                {
                  default: () =>
                    h(
                      NIcon,
                      { size: 16, color: '#1890FF' },
                      { default: () => h(SvgIcon, { icon: 'edit' }) }
                    ),
                }
              ),
            row.actionType === 'commit' &&
              h(
                NButton,
                {
                  size: 'tiny',
                  class: 'rounded-10 w-30 h-30',
                  onClick: () => deleteTable(row, index),
                },
                {
                  default: () =>
                    h(
                      NIcon,
                      { size: 16, color: '#1890FF' },
                      { default: () => h(SvgIcon, { icon: 'del' }) }
                    ),
                }
              ),
          ],
        }
      ),
  },
])

const add = () => {
  data.value.push({ value: '', saleDesc: '', sort: 0, actionType: 'edit' })
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

const save = async () => {
  formRef.value?.validate(async (errors) => {
    if (!errors) {
      const newArr = _.cloneDeep(data.value)
      if (newArr.some((item) => !item.value)) {
        $message.info('特征值不能为空')
        return
      }
      const payload = {
        oid: props.handleOid,
        ...formValue.value,
        type: options.find((item) => item.value === formValue.value.type)?.label,
        values: newArr.map((item) => {
          delete item.actionType
          return item
        }),
      }
      const apiUrl = props.optionType === 'add' ? createSaleCharacter : updateSaleCharacter
      const res = await apiUrl(payload)
      if (res.success) {
        emits('handleConfim', res.data)
        $message.success('保存成功')
      }
    } else {
      console.log(errors)
    }
  })
}

watch(
  () => props.handleItem,
  (val) => {
    if (val?.oid) {
      data.value = val?.values.map((item) => ({ ...item, actionType: 'commit' }))
      formValue.value = {
        name: val?.name,
        sort: Number(val?.sort || 0),
        description: val?.description,
        type: props.navValue,
      }
    } else {
      data.value = []
      formValue.value = { name: '', sort: 0, description: '', type: props.navValue }
    }
  },
  { immediate: true }
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

.toTop {
  transform: rotate(0);
  transition: all 0.3s ease-in-out;
  &.extend {
    transform: rotate(180deg);
  }
}
::v-deep.n-collapse .n-collapse-item .n-collapse-item__header {
  height: 32px;
  background: rgba(24, 144, 255, 0.1);
  border-radius: 4px 4px 0px 0px;
  padding-left: 10px;
  padding-right: 10px;
}
</style>
