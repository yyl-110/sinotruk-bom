<template>
  <div h-100vh w-full rounded-4 bg-white>
    <header h-40 flex items-center flex-justify-between px-20>
      <div flex items-center>
        <div class="line" mr-8></div>
        <span text-14 font-bold text-hex-1d2129>配置号{{ handleData.number }}下发设计任务</span>
      </div>
    </header>
    <main min-h-500 flex flex-col px-20>
      <div class="top" flex flex-shrink-0 py-10>
        <n-input
          v-model:value="filterText"
          placeholder="搜索部门负责人"
          type="text"
          style="width: 200px"
          @keydown.enter="queryData"
        />
        <n-button type="primary" ml-20 rounded-4 @click="queryData">查询</n-button>
        <n-button type="primary" ml-20 rounded-4 @click="setOwer">设置设计负责人</n-button>
      </div>
      <div class="tableWrap" mt-10 flex-1>
        <n-data-table
          v-model:checked-row-keys="checkedRowKeys"
          :columns="columns"
          :data="filterTableData"
          :pagination="false"
          :row-key="rowKey"
          :scrollbar-props="{ trigger: 'none' }"
          flex-height
          :scroll-x="1200"
          style="height: 100%"
          :bordered="false"
          :loading="loading"
          @update:sorter="uploadSorter"
        />
      </div>
    </main>
    <footer h-70 flex items-center flex-justify-end px-20>
      <n-button ml-20 :loading="saveLoading" @click="save">保存</n-button>
      <n-button type="primary" ml-20 :loading="btnLoading" @click="confirm">确定</n-button>
    </footer>
  </div>
  <PeopleSettingModal ref="PeopleSettingModalRef" @handle-confirm="choosePersonResult" />
  <AcInsertModal ref="acInsertRef" />
</template>

<script setup>
import { NButton, NInput } from 'naive-ui'
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import {
  setDesignHeadAndDistributeTask,
  getAcTaskForDesignHead,
  saveDesignHeadAndDistributeTask,
} from '~/src/api/config'
import PeopleSettingModal from '@/components/common/PeopleSettingModal.vue'
import AcInsertModal from '@/views/ConfigurationMgt/SuperBom/component/AcInsertModal.vue'
import _ from 'lodash'
const route = useRoute()

const emits = defineEmits(['handleConfirm', 'goDetail'])
const loading = ref(false)
const selectOid = ref(route.query.oid)
const data = ref([])
const showTime = ref(false)
const confirmTimeValue = ref(null)
const formatData = 'yyyy-MM-dd HH:mm:ss'
const btnLoading = ref(false)
const saveLoading = ref(false)
const handleData = ref({})
const PeopleSettingModalRef = ref(null)
const acInsertRef = ref(null)
const filterText = ref('')
const queryText = ref('')
const sortType = ref(null)
const sortKey = ref(null)

const recursiveSort = (data, type) => {
  if (type === 'descend') {
    if (sortKey.value === 'startTime') {
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
    if (sortKey.value === 'startTime') {
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

const filterTableData = computed(() => {
  const tableData = data.value.filter((item) =>
    item?.departmentDisplayName.includes(queryText.value)
  )
  if (!sortType.value) return tableData
  /* 降序 */
  const _data = _.cloneDeep(tableData)
  recursiveSort(_data, sortType.value)
  return _data
})

const columns = ref([
  {
    type: 'selection',
  },
  {
    title: '序号',
    key: 'no',
    width: 90,
    render(row, inx) {
      return inx + 1
    },
  },
  {
    title: '任务编号',
    key: 'taskNumber',
    align: 'center',
    resizable: true,
  },
  {
    title: 'AC模块',
    key: 'acModuleName',
    align: 'center',
    resizable: true,
    sorter: 'default',
  },
  {
    title: '配置号负责人',
    align: 'center',
    resizable: true,
    key: 'configCodeUserDisplayName',
    sorter: 'default',
  },
  {
    title: '部门负责人',
    align: 'center',
    resizable: true,
    key: 'departmentDisplayName',
    sorter: 'default',
  },
  {
    title: '设计负责人',
    align: 'center',
    resizable: true,
    key: 'ownerDisplayName',
    sorter: 'default',
  },
  {
    title: '任务创建时间',
    align: 'center',
    resizable: true,
    key: 'startTime',
    sorter: 'default',
  },
  {
    title: '期望完成时间',
    key: 'expectedCompletionTime',
    resizable: true,
    align: 'center',
    // render: (row, inx) => {
    //   return h(NDatePicker, {
    //     formattedValue: row.expectedCompletionTime || null,
    //     type: 'datetime',
    //     clearable: true,
    //     valueFormat: 'yyyy-MM-dd HH:mm:ss',
    //     onUpdateFormattedValue(v) {
    //       data.value[inx]['expectedCompletionTime'] = v
    //     },
    //   })
    // },
  },
  {
    title: '任务说明',
    key: 'taskRemark',
    minWidth: 120,
    resizable: true,
  },
  {
    tilte: '',
    key: 'action',
    minWidth: 80,
    render: (row) =>
      h(
        NButton,
        {
          text: true,
          color: '#8a2be2',
          class: 'cursor-pointer',
          onClick: () => {
            goDetail(row)
          },
        },
        '特征详情'
      ),
  },
])

const uploadSorter = (val) => {
  sortType.value = val?.order
  sortKey.value = val?.columnKey
}

const goDetail = (row) => {
  acInsertRef.value.show(row.oid, 2, 'single', row?.acModuleName)
}
const rowKey = (row) => row.oid
const checkedRowKeys = ref([])

const queryData = () => {
  queryText.value = filterText.value
}

const setOwer = () => {
  if (!checkedRowKeys.value.length) {
    $message.info('请选择任务')
    return
  }
  PeopleSettingModalRef.value.show(1)
}

const save = async () => {
  try {
    saveLoading.value = true
    const res = await saveDesignHeadAndDistributeTask({
      configCodeOid: selectOid.value,
      data: data.value,
    })
    if (res.success) {
      $message.success(res.message)
    }
  } catch (error) {
    console.log('error:', error)
  } finally {
    saveLoading.value = false
  }
  // emits('handleConfirm', formValue.value)
}

const confirm = async () => {
  if (!checkedRowKeys.value.length) {
    $message.warning('请选择要下发的任务')
    return
  }
  const selectTableData = data.value.filter((item) => checkedRowKeys.value.includes(item.oid))
  try {
    btnLoading.value = true
    const res = await setDesignHeadAndDistributeTask({
      configCodeOid: selectOid.value,
      data: selectTableData,
    })
    if (res.success) {
      $message.success(res.message)
    }
  } catch (error) {
    console.log('error:', error)
  } finally {
    btnLoading.value = false
  }
}

/* 选择people回调 */
const choosePersonResult = (val) => {
  data.value = data.value.map((item) => {
    if (checkedRowKeys.value.includes(item.oid)) {
      return {
        ...item,
        ownerDisplayName: val.map((item) => item.username).join(','),
        owner: val.map((item) => item.userid).join(','),
      }
    }
    return item
  })
}

const fetchData = async () => {
  try {
    loading.value = true
    const res = await getAcTaskForDesignHead({ oid: selectOid.value })
    if (res.success) {
      data.value = res.data
    }
  } catch (error) {
    console.log('error:', error)
  } finally {
    loading.value = false
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
main {
  height: calc(100vh - 110px);
}
</style>
