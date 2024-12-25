<template>
  <CommonPage sub-title="匹配公式" back="mgt">
    <div h-full w-full px-20 pt-20>
      <!-- <child-title /> -->
      <config-mgt-nav :select="5" />
      <div my-20 flex items-center>
        <n-button attr-type="button" type="primary" mr-20 :disabled="btnStatus" @click="add">
          <template #icon>
            <TheIcon icon="addBtn" type="custom" :size="16" />
          </template>
          新增
        </n-button>
        <n-button attr-type="button" type="primary" mr-20 @click="checkFeatureRef.show()">
          <template #icon>
            <TheIcon icon="iconn_search_white" :size="14" type="custom" />
          </template>
          特征封闭检测结果
        </n-button>
        <n-button attr-type="button" type="primary" mr-20 @click="technicallyUniqueRef.show()">
          <template #icon>
            <TheIcon icon="iconn_search_white" :size="14" type="custom" />
          </template>
          技术特征唯一性检查
        </n-button>
        <n-button attr-type="button" type="primary" mr-20 @click="handleCheckTypeSpectrum">
          <template #icon>
            <TheIcon icon="iconn_search_white" :size="14" type="custom" />
          </template>
          型谱封闭检查
        </n-button>
        <n-button type="primary" mr-20 @click="expandAll">展开所有</n-button>
        <n-button type="primary" @click="putAwayAll">收起所有</n-button>
      </div>
      <a-table
        v-model:expandedRowKeys="expandedRowKeys"
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
              :scroll="{ x: '100%', y: 300 }"
              :loading="loadingChild"
            ></a-table>
          </div>
        </template>
        <template #bodyCell="{ column, record, index }">
          <template v-if="column.key === 'index'">
            {{ index + 1 }}
          </template>
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

      <!-- <n-data-table
        :columns="columns"
        :data="data"
        :pagination="pagination"
        :bordered="false"
        :max-height="500"
        :render-expand-icon="renderExpandIcon"
        mt-20
        class="outTable"
      /> -->
      <technically-unique ref="technicallyUniqueRef" />
      <check-feature ref="checkFeatureRef" />
      <AddLogicModal
        v-if="logicModalShow"
        ref="addLogicRef"
        @handle-confirm="handleSaveSuccess"
        @handle-close="logicModalShow = false"
      />
    </div>
  </CommonPage>
</template>

<script setup>
import AppTitle from '@/components/common/AppTitle.vue'
import SvgIcon from '@/components/icon/SvgIcon.vue'
import { NButton, NDataTable, NIcon } from 'naive-ui'
import ChildTitle from '../component/ChildTitle.vue'
import ConfigMgtNav from '../component/ConfigMgtNav.vue'
import TechnicallyUnique from './component/TechnicallyUnique.vue'
import checkFeature from './component/CheckFeature.vue'
import AddLogicModal from './component/AddLogicModal.vue'
import { checkTypeSpectrum, getLocalLogicalRuleList } from '~/src/api/config'
import { useRoute } from 'vue-router'
import { nextTick, onMounted } from 'vue'
import { deleteConditionRule, getLogicalRuleDetail } from '~/src/api/feature'
import useHandle from '~/src/hooks/useHandle'
import { useAppStore, useBusinessStore } from '~/src/store'
import { storeToRefs } from 'pinia'
const businessStore = useBusinessStore()
const { currentObjState } = storeToRefs(businessStore)
const { queryCreateFReviewDoc, handleDelete, createChangePage } = useHandle()
const { changeLoading } = useAppStore()

const route = useRoute()
const technicallyUniqueRef = ref(null)
const checkFeatureRef = ref(null)
const addLogicRef = ref(null)
const loading = ref(false)
const loadingChild = ref(false)
const pageSize = ref(50)
const page = ref(1) // 页码
const mappingType = ref('add')
const selectOid = ref('')
const editIndex = ref(0)
const logicModalShow = ref(false)
const expandedRowKeys = ref([])
const expandChange = (expanded, expandedRows) => {
  expanded && fetchDetail(expandedRows.oid)
}
const rowKey = (row) => {
  return row.oid
}

const expandAll = async () => {
  for (let i = 0; i < data.value.length; i++) {
    if (!expandedRowKeys.value.includes(data.value[i]?.oid)) {
      expandedRowKeys.value.push(data.value[i]?.oid)
      fetchDetail(data.value[i]?.oid)
    }
  }
}
const putAwayAll = () => {
  expandedRowKeys.value = []
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

const columns = [
  { title: '序号', dataIndex: 'index', key: 'index', width: 60, fixed: 'left' },
  { title: '编号', dataIndex: 'number', key: 'number', width: 100 },
  { title: '规则名', dataIndex: 'name', key: 'name', width: 100 },
  { title: '定义内容', dataIndex: 'description', key: 'description', width: 400, ellipsis: true },
  { title: '版本', dataIndex: 'version', key: 'version', width: 80 },
  { title: '状态', dataIndex: 'status', key: 'status', width: 100 },
  {
    title: '排序',
    dataIndex: 'sort',
    key: 'sort',
    width: 80,
    sorter: (row1, row2) => row1.sort - row2.sort,
  },
  { title: '操作', dataIndex: 'action', key: 'action', width: 140, fixed: 'right' },
]

const btnList = [
  { icon: 'icon_operate_12', text: '信息', type: 1 },
  { icon: 'edit', text: '修改', type: 2 },
  // { icon: 'flag', text: '签审', type: 3 },
  // { icon: 'icon_operate_6', text: '更改', type: 4 },
  { icon: 'del', text: '删除', type: 5 },
]

const btnStatus = computed(() => {
  const status = currentObjState.value.state
  return !['设计中', '重新工作'].includes(status)
})
const btnDisabled = (btn, row) => {
  if (row.status === '重新工作') {
    return [5].includes(btn.type)
  }
  if (row.status === '已完成') {
    return [5, 2].includes(btn.type)
  }
  if (row.status === '设计中') {
    return btn.type === 4
  }
  return [2, 5].includes(btn.type)
}

const add = () => {
  editIndex.value = 0
  mappingType.value = 'add'
  logicModalShow.value = true
  nextTick(() => {
    addLogicRef.value.show('add', route.query.oid)
  })
}

const handleSaveSuccess = (row, type) => {
  mappingType.value = type
  if (mappingType.value === 'add') {
    data.value.unshift(row)
  } else {
    if (editIndex.value || editIndex.value === 0) data.value.splice(editIndex.value, 1, row)
  }
}

const handleClick = async (type, row, index) => {
  switch (type) {
    /* 详情 */
    case 1:
      mappingType.value = 'detail'
      logicModalShow.value = true
      nextTick(() => {
        addLogicRef.value.show('detail', row.oid)
      })
      break
    /* 修改 */
    case 2:
      editIndex.value = index
      mappingType.value = 'edit'
      logicModalShow.value = true
      nextTick(() => {
        addLogicRef.value.show('edit', row.oid)
      })
      break
    case 3:
      queryCreateFReviewDoc(row.oid)
      break
    case 4:
      createChangePage(row.changeUrl)
      break
    case 5:
      await handleDelete(deleteConditionRule, { oid: row.oid }, row.name)
      fetchData()
      break

    default:
      break
  }
}

const data = ref([{ name: '' }])
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
const fetchData = async () => {
  try {
    loading.value = true
    const res = await getLocalLogicalRuleList({
      oid: route.query.oid,
      type: 'mapping',
      page: page.value,
      count: pageSize.value,
    })
    data.value = res.data
    pagination.value.pageCount = res.pages
    pagination.value.itemCount = res.total
    pagination.value.pageSize = pageSize.value
    pagination.value.page = page.value
  } catch (error) {
    console.log('error:', error)
  } finally {
    loading.value = false
  }
}

/* 型谱封闭检查 */
const handleCheckTypeSpectrum = async () => {
  try {
    changeLoading(true)
    const res = await checkTypeSpectrum({ oid: route.query.oid })
    if (res.success) {
      $message.success('检测成功')
    }
  } catch (error) {
    console.log('error:', error)
  } finally {
    changeLoading(false)
  }
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
