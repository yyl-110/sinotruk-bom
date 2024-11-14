<template>
  <div mt-20>
    <a-table
      v-model:expandedRowKeys="expandedRowKeys"
      :columns="columns"
      :data-source="data"
      :loading="loading"
      :row-key="rowKey"
      :pagination="pagination"
      :scroll="{ x: '100%', y: 600 }"
      @expand="expandChange"
    >
      <template #expandedRowRender="{ column, record }">
        <div mx-auto class="childTable">
          <a-table
            :columns="record?.childColumns"
            :data-source="record?.childTableData"
            :row-key="rowKey"
            :pagination="false"
            :loading="loadingChild"
            :scroll="{ x: '100%', y: 300 }"
          />
        </div>
      </template>
      <template #bodyCell="{ column, record, index }">
        <template v-if="column.key === 'description'">
          <n-ellipsis w-full>
            {{ record.description }}
          </n-ellipsis>
        </template>
        <template v-if="column.key === 'action'">
          <div flex items-center>
            <a-tooltip v-for="item in btnList" :key="item.type">
              <template #title>{{ item.text }}</template>
              <a-button
                mr-10
                h-30
                w-30
                flex
                flex-shrink-0
                items-center
                justify-center
                rounded-10
                p-0
                :disabled="btnDisabled(item, record)"
                @click="handleClick(item.type, record, index)"
              >
                <the-icon :size="14" type="custom" :icon="item.icon" color="#1890FF" />
              </a-button>
            </a-tooltip>
          </div>
        </template>
      </template>
    </a-table>
  </div>
</template>

<script setup>
import { NButton, NDataTable, NIcon } from 'naive-ui'
import SvgIcon from '@/components/icon/SvgIcon.vue'
import { ref, watch } from 'vue'
import { getLogicalRuleDetail } from '~/src/api/feature'
import useHandle from '~/src/hooks/useHandle'
import useUserRole from '~/src/hooks/useUserRole'
import { USER_ROLE } from '../../data'

const tableSelectOid = ref('')
const rowKey = (row) => {
  return row.oid
}
const props = defineProps({
  pagination: {
    type: Object,
    default: () => {},
  },
  tableData: {
    type: Array,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
})
const data = ref(props.tableData)
const emits = defineEmits(['btnClick'])
const loadingChild = ref(false)
const expandedRowKeys = ref([])

const columns = [
  { title: '编号', dataIndex: 'number', key: 'number', width: 80, fixed: 'left' },
  { title: '规则名', dataIndex: 'name', key: 'name', width: 100 },
  {
    title: '定义内容',
    dataIndex: 'description',
    key: 'description',
    width: 400,
    ellipsis: true,
  },
  { title: '所属模块', dataIndex: 'model', key: 'model', width: 100 },
  { title: '流程发起者', dataIndex: 'processCreator', key: 'processCreator', width: 110 },
  { title: '版本', dataIndex: 'version', key: 'version', width: 80 },
  { title: '状态', dataIndex: 'status', key: 'status', width: 100 },
  {
    title: '排序',
    dataIndex: 'sort',
    key: 'sort',
    width: 80,
    sorter: (row1, row2) => row1.sort - row2.sort,
  },
  { title: '操作', dataIndex: 'action', key: 'action', width: 220, fixed: 'right' },
]

const btnList = [
  { icon: 'icon_operate_12', text: '信息', type: 1 },
  { icon: 'edit', text: '修改', type: 2 },
  { icon: 'flag', text: '签审', type: 3 },
  { icon: 'icon_operate_6', text: '更改', type: 4 },
  { icon: 'del', text: '删除', type: 5 },
]
const btnDisabled = (btn, row) => {
  if (useUserRole.value === USER_ROLE.CONFIGURATOR) {
    return [2, 3, 4, 5].includes(btn.type)
  }
  if (row.status === '重新工作') {
    return [5, 3, 4].includes(btn.type)
  }
  if (row.status === '已完成') {
    return [5, 2, 3].includes(btn.type)
  }
  if (row.status === '设计中') {
    if (row.version.includes('A')) {
      return btn.type === 4
    }
    return [3, 4].includes(btn.type)
  }
  return [2, 3, 4, 5].includes(btn.type)
}

const handleClick = (type, row, index) => {
  emits('btnClick', { type, row, index })
}

const getMappingArr = (data) => {
  return new Promise((r) => {
    /* 数据 */
    let childTableData = []
    const { mappingValues = [] } = data
    childTableData = mappingValues.map((item, index) => {
      const childArr = [...item.sourceValues, ...item.targetValues]
      const obj = {}
      childArr.forEach((val, inx) => {
        obj['columns' + inx] = val.value
      })
      return obj
    })
    r(childTableData)
  })
}

const fetchData = async (oid) => {
  try {
    loadingChild.value = true
    const res = await getLogicalRuleDetail({ oid })
    /* 表头 */
    let childColumns = []
    res?.data.forEach(async (item) => {
      const { sourceObjects = [], targetObjects = [] } = item
      const columnsArr = [...sourceObjects, ...targetObjects]
      childColumns = columnsArr.map((item, index) => {
        return {
          title: item.name,
          dataIndex: 'columns' + index,
          key: 'columns' + index,
          align: 'center',
          width: 140,
          ellipsis: true,
        }
      })
      const childTableData = await getMappingArr(item)
      const index = data.value.findIndex((item) => item.oid === oid)
      const arr = data.value
      data.value[index] = { ...arr[index], childTableData, childColumns }
    })
  } catch (error) {
    console.log('error:', error)
  } finally {
    loadingChild.value = false
  }
}
const expandChange = (expanded, expandedRows) => {
  expanded && fetchData(expandedRows.oid)
}

const expandAll = async () => {
  for (let i = 0; i < data.value.length; i++) {
    if (!expandedRowKeys.value.includes(data.value[i]?.oid)) {
      expandedRowKeys.value.push(data.value[i]?.oid)
      await fetchData(data.value[i]?.oid)
    }
  }
}
const putAwayAll = () => {
  expandedRowKeys.value = []
}

defineExpose({
  expandAll,
  putAwayAll,
})

watch(
  () => props.tableData,
  (val) => {
    let newArr = val
    if (newArr.length) {
      newArr = val.map((item) => ({ ...item, childTableData: [], childColumns: [] }))
    }
    data.value = newArr
  },
  { deep: true }
)
</script>

<style lang="scss" scoped>
::v-deep:where(.css-dev-only-do-not-override-40xy44).ant-table-wrapper .ant-table-thead > tr > th,
:where(.css-dev-only-do-not-override-40xy44).ant-table-wrapper .ant-table-thead > tr > td {
  background: rgb(233, 243, 254);
  font-size: 14px;
  color: #1d2129;
  font-weight: 400;
  height: 48px;
  box-sizing: border-box;
  line-height: 27px;
}
::v-deep .childTable .ant-table-thead > tr > th {
  background: #f2f3f5 !important;
  font-size: 14px;
  color: #1d2129;
}

::v-deep .ant-table-cell {
  padding: 10px 16px !important;
  color: #4e5969;
  font-size: 14px;
}
</style>
