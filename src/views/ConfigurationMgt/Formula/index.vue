<template>
  <CommonPage sub-title="计算公式" back="mgt">
    <div h-full w-full px-20 pt-20>
      <!-- <child-title /> -->
      <config-mgt-nav :select="6" />
      <n-button type="primary" mr-20 mt-20 :disabled="btnStatus" @click="add">
        <template #icon>
          <the-icon type="custom" icon="addBtn" color="#fff" size="16" />
        </template>
        新增
      </n-button>
      <!-- <n-button mt-20>
        <template #icon>
          <the-icon type="custom" icon="delete" size="20" />
        </template>
        删除
      </n-button> -->
      <n-data-table
        remote
        :columns="columns"
        :data="tableData"
        :pagination="pagination"
        :bordered="false"
        :row-key="rowKey"
        mt-20
        :scroll-x="1200"
        :max-height="700"
      />
    </div>
    <add-count-modal
      v-if="countModalShow"
      ref="addCountRef"
      @handle-confirm="handleConfirm"
      @handle-close="handleClose = false"
    />
  </CommonPage>
</template>

<script setup>
import AppTitle from '@/components/common/AppTitle.vue'
import ChildTitle from '../component/ChildTitle.vue'
import ConfigMgtNav from '../component/ConfigMgtNav.vue'
import { getLocalLogicalRuleList } from '~/src/api/config'
import SvgIcon from '@/components/icon/SvgIcon.vue'
import { NButton, NIcon } from 'naive-ui'
import AddCountModal from './component/AddCountModal.vue'
import { useRoute } from 'vue-router'
import useHandle from '~/src/hooks/useHandle'
import { deleteConditionRule } from '~/src/api/feature'
import { computed, nextTick } from 'vue'
import { useBusinessStore } from '~/src/store'
import { storeToRefs } from 'pinia'
const businessStore = useBusinessStore()
const { currentObjState } = storeToRefs(businessStore)
const route = useRoute()
const { queryCreateFReviewDoc, handleDelete, createChangePage } = useHandle()

const addCountRef = ref(null)
const pageSize = ref(50)
const page = ref(1) // 页码
const mappingType = ref('add')
const tableData = ref([])
const loading = ref(false)
const editIndex = ref(0)
const countModalShow = ref(false)
const rowKey = (row) => row.oid
const columns = [
  {
    type: 'selection',
    fixed: 'left',
  },
  {
    title: '序号',
    key: 'no',
    fixed: 'left',
    width: 60,
    align: 'center',
    render(row, inx) {
      return inx + 1
    },
  },
  {
    title: '编码',
    key: 'number',
    minWidth: 100,
  },
  {
    title: '规则名',
    key: 'name',
    minWidth: 100,
  },
  {
    title: '定义内容',
    key: 'description',
    width: 400,
    ellipsis: {
      tooltip: true,
    },
  },
  {
    title: '版本',
    minWidth: 80,
    key: 'version',
  },
  {
    title: '状态',
    minWidth: 100,
    key: 'status',
  },
  {
    title: '排序',
    key: 'sort',
    minWidth: 80,
    sorter: (row1, row2) => row1.sort - row2.sort,
  },
  {
    title: '操作',
    key: 'actions',
    width: 140,
    fixed: 'right',
    render(row, index) {
      return h(
        'div',
        {
          class: 'flex items-center',
        },
        btnList.map((i) => renderBtn(i, row, index))
      )
    },
  },
]

const btnList = [
  { icon: 'icon_operate_12', text: '信息', type: 1 },
  { icon: 'edit', text: '修改', type: 2 },
  // { icon: 'flag', text: '签审', type: 3 },
  // { icon: 'icon_operate_6', text: '更改', type: 4 },
  { icon: 'del', text: '删除', type: 5 },
]

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

const btnStatus = computed(() => {
  const status = currentObjState.value.state
  return !['设计中', '重新工作'].includes(status)
})

const renderBtn = (btn, row, index) => {
  return $toolTipWrap(
    btn.text,
    h(
      NButton,
      {
        size: 'tiny',
        onClick: () => handleClick(btn.type, row, index),
        class: 'rounded-10 w-30 mr-10 h-30',
        disabled: btnDisabled(btn, row),
      },
      h(NIcon, { size: 16, color: '#1890FF' }, { default: () => h(SvgIcon, { icon: btn.icon }) })
    )
  )
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
const fetchData = async () => {
  try {
    loading.value = true
    const res = await getLocalLogicalRuleList({
      page: page.value,
      count: pageSize.value,
      oid: route.query.oid,
      type: 'calculate',
    })
    tableData.value = res.data || []
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

const add = () => {
  editIndex.value = 0
  mappingType.value = 'add'
  countModalShow.value = true
  nextTick(() => {
    addCountRef.value.show('add')
  })
}
/* 新增或者编辑成功 */
const handleConfirm = (row, type) => {
  mappingType.value = type
  if (mappingType.value === 'add') {
    tableData.value.unshift(row)
  } else {
    if (editIndex.value || editIndex.value === 0) tableData.value.splice(editIndex.value, 1, row)
  }
}

const handleClick = async (type, row, index) => {
  switch (type) {
    case 1:
      mappingType.value = 'detail'
      countModalShow.value = true
      nextTick(() => {
        addCountRef.value.show('detail', row.oid)
      })
      break
    case 2:
      editIndex.value = index
      mappingType.value = 'edit'
      countModalShow.value = true
      nextTick(() => {
        addCountRef.value.show('edit', row.oid)
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

onMounted(() => {
  fetchData()
})
</script>

<style lang="scss" scoped></style>
