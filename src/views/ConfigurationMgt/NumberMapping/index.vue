<template>
  <CommonPage sub-title="表号映射管理" back="mgt">
    <div h-full w-full overflow-x-auto px-20 pt-20>
      <!-- <child-title /> -->
      <config-mgt-nav :select="7" />
      <n-space mt-20>
        <n-button attr-type="button" type="primary" @click="add">
          <template #icon>
            <TheIcon icon="addBtn" type="custom" :size="16" />
          </template>
          新增
        </n-button>
        <!-- <n-button type="primary" @click="checkForm">
          <template #icon>
            <img src="@/assets/images/search_white.png" alt="" class="h-14 w-14" />
          </template>
          表号封闭检查
        </n-button> -->
      </n-space>
      <div class="tableWrap" mt-20 w-full>
        <a-table
          :columns="columns"
          :data-source="data"
          :loading="loading"
          :row-key="rowKey"
          :pagination="false"
          :row-selection="rowSelection"
          :scroll="{ x: '100%', y: 700 }"
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
            <template v-if="column.key === 'description'">
              <n-ellipsis>
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
        <div mt-20 flex flex-justify-end>
          <n-pagination
            v-model:page="page"
            v-model:page-size="pagination.pageSize"
            :page-count="pagination.pageCount"
            :page-sizes="pagination.pageSizes"
            show-size-picker
            show-quick-jumper
            :[aaa]="['size-picker', 'pages', 'quick-jumper']"
            @update:page="pagination.onChange"
            @update:page-size="pagination.onUpdatePageSize"
          />
        </div>
      </div>
    </div>
    <number-mapping-modal
      v-if="numberMappingModalShow"
      ref="numberMappingRef"
      @handle-confirm="handleConfirm"
      @handle-close="numberMappingModalShow = false"
    />
    <CheckResult ref="CheckResultRef" />
  </CommonPage>
</template>

<script setup>
import { nextTick, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import {
  getACPartMapRuleDetail,
  getACPartMapRuleList,
  specialVehicleCloseCheck,
} from '~/src/api/config'
import { deleteConditionRule } from '~/src/api/feature'
import useHandle from '~/src/hooks/useHandle'
import ChildTitle from '../component/ChildTitle.vue'
import ConfigMgtNav from '../component/ConfigMgtNav.vue'
import NumberMappingModal from '../component/NumberMappingModal.vue'
import CheckResult from '../component/CheckResult.vue'

const { queryCreateFReviewDoc, handleDelete, createChangePage } = useHandle()

const aaa = 'display-order'
const columns = [
  { title: '序号', dataIndex: 'index', key: 'index' },
  { title: '编码', dataIndex: 'number', key: 'number' },
  { title: '规则名', dataIndex: 'name', key: 'name' },
  { title: '版本', dataIndex: 'version', key: 'version' },
  { title: '状态', dataIndex: 'status', key: 'status' },
  {
    title: '排序',
    dataIndex: 'sort',
    key: 'sort',
    sorter: (row1, row2) => row1.sort - row2.sort,
  },
  { title: '操作', dataIndex: 'action', key: 'action', fixed: 'right', width: 150 },
]
const numberMappingRef = ref(null)
const CheckResultRef = ref(null)
const loadingChild = ref(false)
const route = useRoute()
const loading = ref(false)
const pageSize = ref(50)
const page = ref(1) // 页码
const expandChange = (expanded, expandedRows) => {
  expanded && fetchDetail(expandedRows.oid)
}
const rowKey = (row) => {
  return row.oid
}
const data = ref([])
const btnList = [
  // { icon: 'icon_operate_12', text: '信息', type: 1 },
  { icon: 'edit', text: '修改', type: 2 },
  // { icon: 'flag', text: '签审', type: 6 },
  // { icon: 'icon_operate_6', text: '更改', type: 7 },
  { icon: 'del', text: '删除', type: 3 },
]
const mappingType = ref('add')
const editIndex = ref(0)
const numberMappingModalShow = ref(false)

const btnDisabled = (btn, row) => {
  if (row.status === '重新工作') {
    return [6, 7, 3].includes(btn.type)
  }
  if (row.status === '已完成') {
    return [2, 3, 6].includes(btn.type)
  }
  if (row.status === '设计中') {
    return btn.type === 7
  }
  return [2, 6, 7, 3].includes(btn.type)
}

const pagination = ref({
  pageCount: 0,
  itemCount: 0,
  showSizePicker: true,
  showQuickJumper: true,
  page: page.value,
  pageSizes: [50, 100, 200, 500],
  pageSize: pageSize.value,
  displayOrder: ['size-picker', 'pages', 'quick-jumper'],
  onUpdatePageSize: (size) => {
    page.value = 1
    pageSize.value = size
    fetchData()
  },
  onChange: (pages) => {
    page.value = pages
    fetchData()
  },
})

const handleClick = async (type, row, index) => {
  switch (type) {
    case 1:
      mappingType.value = 'detail'
      numberMappingModalShow.value = true
      nextTick(() => {
        numberMappingRef.value?.show('detail', row.oid)
      })
      break
    case 2:
      editIndex.value = index
      mappingType.value = 'edit'
      numberMappingModalShow.value = true
      nextTick(() => {
        numberMappingRef.value?.show('edit', row.oid)
      })
      break
    case 3:
      try {
        await handleDelete(deleteConditionRule, { oid: row.oid }, row.name)
        fetchData()
      } catch (error) {
        console.log('error:', error)
      }
      break
    case 6:
      queryCreateFReviewDoc(row.oid)
      break
    case 7:
      createChangePage(row.changeUrl)
      break

    default:
      break
  }
}
const fetchData = async () => {
  const res = await getACPartMapRuleList({
    oid: route.query.oid,
    page: page.value,
    count: pageSize.value,
  })
  if (res.data.length) {
    data.value = res.data.map((item) => ({ ...item, childTableData: [], childColumns: [] }))
    pagination.value.pageCount = res.pages
    pagination.value.itemCount = res.total
    pagination.value.pageSize = pageSize.value
    pagination.value.page = page.value
  }
}

const getMappingArr = (data) => {
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
  return childTableData
}

const fetchDetail = async (oid) => {
  try {
    loadingChild.value = true
    const res = await getACPartMapRuleDetail({ oid })

    let childColumns = []
    res?.data.forEach(async (item) => {
      let { sourceObjects = [], targetObjects = [] } = item
      sourceObjects = sourceObjects.map((val) => ({ ...val, type: '条件' }))
      targetObjects = targetObjects.map((val) => ({ ...val, type: '表号' }))
      const columnsArr = [...sourceObjects, ...targetObjects]
      childColumns = columnsArr.map((item, index) => {
        return {
          title: `${item.type}：${item.name}`,
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

/* 新增或者编辑成功 */
const handleConfirm = (row, type) => {
  console.log('row:', row)
  mappingType.value = type
  if (mappingType.value === 'add') {
    data.value.unshift(row)
  } else {
    if (editIndex.value || editIndex.value === 0) data.value.splice(editIndex.value, 1, row)
  }
}

const rowSelection = ref({
  onChange: (selectedRowKeys, selectedRows) => {
    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
  },
  onSelect: (record, selected, selectedRows) => {
    console.log(record, selected, selectedRows)
  },
  onSelectAll: (selected, selectedRows, changeRows) => {
    console.log(selected, selectedRows, changeRows)
  },
})

const add = () => {
  editIndex.value = 0
  mappingType.value = 'add'
  numberMappingModalShow.value = true
  nextTick(() => {
    numberMappingRef.value?.show('add', route.query.oid)
  })
}

const checkForm = async () => {
  CheckResultRef.value.show()
}

onMounted(() => {
  fetchData()
})
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
