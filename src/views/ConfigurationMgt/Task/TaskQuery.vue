<template>
  <div h-full w-full flex flex-col rounded-4 bg-white>
    <header h-40 flex flex-shrink-0 items-center flex-justify-between px-20>
      <div flex items-center>
        <div class="line" mr-8></div>
        <span text-14 font-bold text-hex-1d2129>配置号AC任务查询</span>
      </div>
    </header>
    <main flex-1 px-20 pb-20 pt-20>
      <div class="form" h-60 w-full flex items-center bb-1>
        <n-form
          ref="formRef"
          :label-width="100"
          :model="formValue"
          label-placement="left"
          require-mark-placement="left"
          inline
          w-full
        >
          <n-form-item label="AC模块" :label-width="60">
            <n-select
              v-model:value="formValue.acName"
              placeholder="请选择"
              :render-option="$renderTooltip"
              filterable
              :options="ACListOptions"
              clearable
            />
          </n-form-item>
          <n-form-item label="部门负责人">
            <n-input
              v-model:value="formValue.departmentDisplayName"
              placeholder="输入部门负责人"
              clearable
              @keydown.enter="search"
            />
          </n-form-item>
          <n-form-item label="设计负责人">
            <n-input
              v-model:value="formValue.ownerDisplayName"
              placeholder="输入设计负责人"
              clearable
              @keydown.enter="search"
            />
          </n-form-item>
          <n-form-item label="状态" :label-width="60">
            <n-select
              v-model:value="formValue.state"
              placeholder="请选择"
              :render-option="$renderTooltip"
              filterable
              :options="ACstateList"
              clearable
            />
          </n-form-item>
          <n-form-item flex-1>
            <n-button type="primary" ml-auto @click="search">
              <template #icon>
                <img src="@/assets/images/search_white.png" alt="" class="h-14 w-14" />
              </template>
              查询
            </n-button>
            <n-button ml-10 @click="reset">
              <template #icon>
                <img src="@/assets/images/refresh.png" alt="" class="h-14 w-14" />
              </template>
              重置
            </n-button>
          </n-form-item>
        </n-form>
      </div>
      <n-data-table
        :columns="columns"
        :pagination="false"
        :loading="loading"
        flex-height
        :scroll-x="1640"
        :data="sorterTableData"
        class="tableBox"
        @update:sorter="uploadSorter"
      />
    </main>
    <AcInsertModal ref="acInsertRef" />
  </div>
</template>

<script setup>
import { NButton, NIcon } from 'naive-ui'
import { computed, onMounted, ref } from 'vue'
import SvgIcon from '@/components/icon/SvgIcon.vue'
import { getACTaskByJSONParas } from '~/src/api/config'
import AcInsertModal from '../SuperBom/component/AcInsertModal.vue'
import _ from 'lodash'
import { useRoute } from 'vue-router'

const route = useRoute()
const emits = defineEmits(['handleConfirm', 'handleLook'])

const formValue = ref({})
const formRef = ref(null)
const acInsertRef = ref(null)

const pageSize = ref(50)
const loading = ref(false)
const sortType = ref(null)
const sortKey = ref(null)
const ACList = ref([])
const ACState = ref([])
const searchFormValue = ref(null)

const pagination = ref({
  showSizePicker: true,
  showQuickJumper: true,
  pageSizes: [50, 100, 200, 500],
  pageSize: pageSize.value,
  displayOrder: ['size-picker', 'pages', 'quick-jumper'],
})

const columns = [
  {
    title: '序号',
    key: 'no',
    align: 'center',
    width: 60,
    render(row, inx) {
      return inx + 1
    },
  },
  {
    title: '任务编号',
    key: 'taskID',
    resizable: true,
  },
  {
    title: 'AC实例编号',
    key: 'acInstanceNumber',
    resizable: true,
    sorter: 'default',
  },
  {
    title: 'AC模块',
    key: 'acName',
    resizable: true,
    sorter: 'default',
  },
  {
    title: '配置号负责人',
    key: 'configCodeUserDisplayName',
    resizable: true,
    sorter: 'default',
  },
  {
    title: '部门负责人',
    key: 'departmentDisplayName',
    resizable: true,
    sorter: 'default',
  },
  {
    title: '设计负责人',
    key: 'ownerDisplayName',
    sorter: 'default',
    resizable: true,
  },
  {
    title: '任务创建时间',
    key: 'startTime',
    resizable: true,
    sorter: 'default',
  },
  {
    title: '期望完成时间',
    key: 'expectedCompletionTime',
    resizable: true,
    sorter: 'default',
  },
  {
    title: '任务说明',
    key: 'taskRemark',
    resizable: true,
  },
  {
    title: '状态',
    key: 'state',
    resizable: true,
    sorter: 'default',
  },
  {
    title: 'AC录入',
    key: 'actions',
    width: 80,
    fixed: 'right',
    align: 'center',
    render(row) {
      return row?.action === '录入'
        ? h(
            NButton,
            {
              size: 'tiny',
              class: 'rounded-10 w-30 h-30',
              onClick: () => {
                acInsertRef.value.show(row.oid, 1, 'single', row.acName)
              },
            },
            h(
              NIcon,
              { size: 16, color: '#1890FF' },
              { default: () => h(SvgIcon, { icon: 'edit' }) }
            )
          )
        : ''
    },
  },
]

const ACListOptions = computed(() => {
  return ACList.value.map((item) => ({ value: item, label: item }))
})
const ACstateList = computed(() => {
  return ACState.value.map((item) => ({ value: item, label: item }))
})

const tableData = ref([])

const recursiveSort = (data, type) => {
  if (type === 'descend') {
    if (sortKey.value === 'startTime' || sortKey.value === 'expectedCompletionTime') {
      try {
        data.sort((a, b) => new Date(b[sortKey.value]) - new Date(a[sortKey.value]))
      } catch (error) {
        console.log('error:', error)
      }
    } else {
      data.sort((a, b) => (b[sortKey.value] ?? Infinity) - (a[sortKey.value] ?? Infinity))
    }
  }
  if (type === 'ascend') {
    if (sortKey.value === 'startTime' || sortKey.value === 'expectedCompletionTime') {
      try {
        data.sort((a, b) => new Date(a[sortKey.value]) - new Date(b[sortKey.value]))
      } catch (error) {
        console.log('error:', error)
      }
    } else {
      data.sort((a, b) => (a[sortKey.value] ?? Infinity) - (b[sortKey.value] ?? Infinity))
    }
  }
}

const sorterTableData = computed(() => {
  let filterTableData = tableData.value
  const state = searchFormValue.value?.state
  const acName = searchFormValue.value?.acName
  const departmentDisplayName = searchFormValue.value?.departmentDisplayName
  const ownerDisplayName = searchFormValue.value?.ownerDisplayName
  if (searchFormValue.value) {
    filterTableData = tableData.value.filter((item) => {
      const state0 = state ? item.state.includes(state) : true
      const state1 = acName ? item.acName.includes(acName) : true
      const state2 = departmentDisplayName
        ? item.departmentDisplayName.includes(departmentDisplayName)
        : true
      const state3 = ownerDisplayName ? item.ownerDisplayName.includes(ownerDisplayName) : true
      if (state0 && state1 && state2 && state3) {
        return true
      }
      return false
    })
  }
  if (!sortType.value) return filterTableData
  /* 降序 */
  const data = _.cloneDeep(filterTableData)
  recursiveSort(data, sortType.value)
  return data
})

const uploadSorter = (val) => {
  sortType.value = val?.order
  sortKey.value = val?.columnKey
}

const fetchData = async () => {
  try {
    loading.value = true
    const res = await getACTaskByJSONParas({
      oid: route.query.oid,
    })
    tableData.value = res.data || []
    tableData.value.forEach((item) => {
      if (!ACList.value.includes(item.acName)) {
        ACList.value.push(item.acName)
      }
      if (!ACState.value.includes(item.state)) {
        ACState.value.push(item.state)
      }
    })
  } catch (error) {
    console.log('error:', error)
  } finally {
    loading.value = false
  }
}

const search = () => {
  searchFormValue.value = { ...formValue.value }
}
const reset = () => {
  searchFormValue.value = null
  formValue.value = {
    acName: null,
    departmentDisplayName: '',
    ownerDisplayName: '',
    state: null,
  }
}

onMounted(() => {
  fetchData()
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
.tableBox {
  height: calc(100% - 60px);
}
</style>
