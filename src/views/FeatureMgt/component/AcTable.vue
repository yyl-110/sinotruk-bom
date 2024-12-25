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
          ></a-table>
        </div>
      </template>
      <template #bodyCell="{ column, record, index }">
        <template v-if="column.key === 'index'">
          {{ index + 1 }}
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
import { ref, watch } from 'vue'
import { getACModuleExcludeRuleDetail, getLogicalRuleDetail } from '~/src/api/feature'
import useUserRole from '~/src/hooks/useUserRole'
import { USER_ROLE } from '../../data'

const tableSelectOid = ref('')
const loadingChild = ref(false)
const expandedRowKeys = ref([])
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

const columns = [
  { title: '序号', dataIndex: 'index', key: 'index' },
  { title: '编号', dataIndex: 'number', key: 'number' },
  { title: '规则名', dataIndex: 'name', key: 'name' },
  { title: '流程发起者', dataIndex: 'processCreator', key: 'processCreator' },
  { title: '版本', dataIndex: 'version', key: 'version' },
  { title: '状态', dataIndex: 'status', key: 'status' },
  {
    title: '排序',
    dataIndex: 'sort',
    key: 'sort',
    sorter: (row1, row2) => row1.sort - row2.sort,
  },
  { title: '操作', dataIndex: 'action', key: 'action', fixed: 'right', width: 240 },
]

const btnList = [
  { icon: 'icon_operate_12', text: '信息', type: 1 },
  { icon: 'edit', text: '修改', type: 2 },
  { icon: 'flag', text: '签审', type: 3 },
  { icon: 'icon_operate_6', text: '更改', type: 4 },
  { icon: 'del', text: '删除', type: 5 },
]

const handleClick = (type, row, index) => {
  emits('btnClick', { type, row, index })
}

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
    const res = await getACModuleExcludeRuleDetail({ oid })
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

watch(
  () => props.tableData,
  (val) => {
    let newArr = val
    if (newArr.length) {
      newArr = val.map((item) => ({ ...item, childTableData: [], childColumns: [] }))
    }
    data.value = newArr
    expandedRowKeys.value = []
  },
  { deep: true }
)
</script>

<style lang="scss" scoped>
::v-deep:where(.css-dev-only-do-not-override-40xy44).ant-table-wrapper .ant-table-thead > tr > th,
:where(.css-dev-only-do-not-override-40xy44).ant-table-wrapper .ant-table-thead > tr > td {
  background: #f2f3f5;
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
