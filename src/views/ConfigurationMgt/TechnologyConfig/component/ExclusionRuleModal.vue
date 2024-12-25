<template>
  <n-modal v-model:show="showModal" :mask-closable="false" @after-leave="closeModel">
    <div h-95vh w-90vw flex flex-col rounded-4 bg-white>
      <header h-40 flex flex-shrink-0 items-center flex-justify-between px-20>
        <div flex items-center>
          <div class="line" mr-8></div>
          <span text-14 font-bold text-hex-1d2129>同选互斥</span>
        </div>
        <img
          src="@/assets/images/close.png"
          alt=""
          class="h-16 w-16 cursor-pointer"
          @click="cancel"
        />
      </header>
      <main h-0 flex-1 px-20 pt-20>
        <n-radio-group v-model:value="navValue" name="1" @update:value="change">
          <n-radio-button value="1" label="同选规则列表" />
          <n-radio-button value="2" label="互斥规则列表" />
        </n-radio-group>
        <div mt-20 flex items-center>
          <n-button attr-type="button" type="primary" @click="add">
            <template #icon>
              <TheIcon icon="addBtn" type="custom" :size="16" />
            </template>
            新增
          </n-button>
          <n-button attr-type="button" type="primary" ml-20 @click="expandAll">展开所有</n-button>
          <n-button attr-type="button" type="primary" ml-20 @click="putAwayAll">收起所有</n-button>
        </div>
        <div mt-20 h-auto>
          <a-table
            v-model:expandedRowKeys="expandedRowKeys"
            :columns="columns"
            :data-source="data"
            :loading="loading"
            :row-key="rowKey"
            :pagination="false"
            :scroll="{ x: '100%', y: tableHeight }"
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
                  :scroll="{ x: '100%', y: tableHeight }"
                ></a-table>
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
      </main>
      <footer h-70 flex items-center flex-justify-end px-20>
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
      </footer>
      <RulesSettingModal
        v-if="rulesModalShow"
        ref="RulesSettingRef"
        @handle-confirm="confirm"
        @handle-close="rulesModalShow = false"
      />
    </div>
  </n-modal>
</template>

<script setup>
import { computed, nextTick } from 'vue'
import { getIncludeExcludeRuleDetail, getIncludeExcludeRuleList } from '~/src/api/config'
import { deleteConditionRule } from '~/src/api/feature'
import useHandle from '~/src/hooks/useHandle'
import RulesSettingModal from './RulesSettingModal.vue'
const { handleDelete } = useHandle()

const emits = defineEmits(['handleConfirm'])
const aaa = 'display-order'
const showModal = ref(false)
const navValue = ref('1')
const pageSize = ref(50)
const page = ref(1) // 页码
const data = ref([])
const loading = ref(false)
const loadingChild = ref(false)
const RulesSettingRef = ref(null)
const mappingType = ref('add')
const editIndex = ref(0)
const expandedRowKeys = ref([])

const tableHeight = computed(() => {
  return window.innerHeight * 0.95 - 300
})

const modalOid = ref('')
const rowKey = (row) => row.oid
const rulesModalShow = ref(false)
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
  { title: '编号', dataIndex: 'number', key: 'number', width: 80 },
  { title: '规则名', dataIndex: 'name', key: 'name', width: 120 },
  {
    title: '定义内容',
    dataIndex: 'description',
    key: 'description',
    width: 400,
    ellipsis: true,
  },
  { title: '版本', dataIndex: 'version', key: 'version', width: 80 },
  { title: '状态', dataIndex: 'status', key: 'status', width: 100 },
  {
    title: '排序',
    dataIndex: 'sort',
    key: 'sort',
    width: 80,
    sorter: (row1, row2) => row1.sort - row2.sort,
  },
  { title: '操作', dataIndex: 'action', key: 'action', width: 180, fixed: 'right' },
]
const btnList = [
  { icon: 'icon_operate_12', text: '信息', type: 1 },
  { icon: 'edit', text: '修改', type: 2 },
  { icon: 'del', text: '删除', type: 3 },
]
const btnDisabled = (btn, row) => {
  if (row.status === '重新工作') {
    return [3].includes(btn.type)
  }
  if (row.status === '设计中') {
    return false
  }
  return [2, 3].includes(btn.type)
}
const handleClick = async (type, row, index) => {
  switch (type) {
    case 1:
      mappingType.value = 'detail'
      detail(row)
      break
    case 2:
      editIndex.value = index
      mappingType.value = 'edit'
      edit(row)
      break

    case 3:
      await handleDelete(deleteConditionRule, { oid: row?.oid }, row?.name)
      fetchData()
      break

    default:
      break
  }
}

const cancel = () => {
  showModal.value = false
}

const show = (oid) => {
  modalOid.value = oid
  fetchData(oid)
  showModal.value = true
}

const close = () => {
  showModal.value = false
}

const change = (val) => {
  expandedRowKeys.value = []
  navValue.value = val
  fetchData()
}

defineExpose({
  show,
  close,
})
const fetchData = async (oid = modalOid.value) => {
  try {
    loading.value = true
    const res = await getIncludeExcludeRuleList({
      oid,
      type: navValue.value === '1' ? 'include' : 'exclude',
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
  // let childTableData = []
  // const { mappingValues = [] } = data
  // const mappingArr = [mappingValues[0]?.sourceValues, mappingValues[0]?.targetValues]
  // // 转换为行数组
  // const rowArr = []
  // for (var i = 0; i < mappingArr[0].length; i++) {
  //   rowArr.push(mappingArr.map((columns, inx) => ({ ['columns' + inx]: columns[i].value })))
  // }
  // childTableData = rowArr.reduce((acc, curr) => {
  //   const obj = {}
  //   curr.forEach((item) => {
  //     const key = Object.keys(item)[0]
  //     obj[key] = item[key]
  //   })
  //   acc.push(obj)
  //   return acc
  // }, [])
  return childTableData
}

const fetchDetail = async (oid) => {
  try {
    loadingChild.value = true
    const res = await getIncludeExcludeRuleDetail({ oid })
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
  expanded && fetchDetail(expandedRows.oid)
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

const add = () => {
  mappingType.value = ''
  editIndex.value = 0
  rulesModalShow.value = true
  nextTick(() => {
    RulesSettingRef.value.show('add', { oid: modalOid.value }, navValue.value, modalOid.value)
  })
}
const detail = (row) => {
  rulesModalShow.value = true
  nextTick(() => {
    RulesSettingRef.value.show('detail', row, navValue.value, modalOid.value)
  })
}
const edit = (row) => {
  rulesModalShow.value = true
  nextTick(() => {
    RulesSettingRef.value.show('edit', row, navValue.value, modalOid.value)
  })
}

const closeModel = () => {
  modalOid.value = ''
  expandedRowKeys.value = []
}
const confirm = (row, type) => {
  mappingType.value = type
  if (mappingType.value === 'add') {
    data.value.unshift(row)
  } else {
    if (editIndex.value || editIndex.value === 0) data.value.splice(editIndex.value, 1, row)
  }
  // fetchData()
}
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
::v-deep.n-radio-group .n-radio-button.n-radio-button--checked {
  --n-button-color-active: var(--primary-color);
  --n-button-text-color-active: #fff;
  --n-button-border-radius: 4px;
  border: none;
}
::v-deep.n-radio-group .n-radio-button {
  --n-button-color: #f2f3f5;
  border: none;
  --n-button-text-color: #1d2129;
  border-radius: 4px;
  // padding-left: 14px;
  // padding-right: 14px;
  overflow: hidden;
}

::v-deep.n-radio-group .n-radio-group__splitor {
  width: 0;
}
::v-deep.n-radio-group.n-radio-group--button-group {
  --n-height: 34px;
  background: #f2f3f5;
  padding-right: 2px;
  padding-left: 2px;
  border-radius: 4px;
}
::v-deep.n-radio-group.n-radio-group--button-group .n-radio-button {
  --n-height: 30px;
  margin-top: 2px;
  margin-bottom: 2px;
}

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
