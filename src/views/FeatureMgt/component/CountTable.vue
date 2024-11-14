<template>
  <div>
    <n-data-table
      :columns="columns"
      :data="tableData"
      :pagination="pagination"
      :bordered="false"
      :max-height="600"
      :row-key="rowKey"
      :scroll-x="1300"
      mt-20
      :loading="loading"
    />
  </div>
</template>

<script setup>
import { NButton, NIcon } from 'naive-ui'
import SvgIcon from '@/components/icon/SvgIcon.vue'
import { ref } from 'vue'
import useUserRole from '~/src/hooks/useUserRole'
import { USER_ROLE } from '../../data'
const rowKey = (row) => row.oid
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
const emits = defineEmits(['btnClick'])
const columns = [
  {
    type: 'selection',
    fixed: 'left',
  },
  {
    title: '序号',
    key: 'no',
    width: 60,
    fixed: 'left',
    render(row, inx) {
      return inx + 1
    },
  },
  {
    title: '编号',
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
    ellipsis: {
      tooltip: true,
    },
    width: 300,
  },
  {
    title: '所属模块',
    key: 'model',
    width: 100,
  },
  {
    title: '流程发起者',
    key: 'processCreator',
    width: 100,
  },
  {
    title: '版本',
    key: 'version',
    minWidth: 80,
  },
  {
    title: '状态',
    key: 'status',
    minWidth: 100,
  },
  {
    title: '排序',
    key: 'sort',
    sorter: (row1, row2) => row1.sort - row2.sort,
    minWidth: 80,
  },
  {
    title: '操作',
    key: 'actions',
    width: 250,
    fixed: 'right',
    render(row, index) {
      return h(
        'div',
        {
          class: 'flex items-center',
        },
        { default: () => btnList.map((i) => renderBtn(i, row, index)) }
      )
    },
  },
]

const btnList = [
  { icon: 'icon_operate_12', text: '信息', type: 1 },
  { icon: 'edit', text: '修改', type: 2 },
  { icon: 'flag', text: '签审', type: 3 },
  { icon: 'icon_operate_6', text: '更改', type: 4 },
  { icon: 'del', text: '删除', type: 5 },
]

const renderBtn = (btn, row, index) => {
  return $toolTipWrap(
    btn.text,
    h(
      NButton,
      {
        size: 'tiny',
        onClick: () => handleClick(btn?.type, row, index),
        class: 'rounded-10 w-30 mr-10 h-30',
        disabled: btnDisabled(btn, row),
      },
      {
        default: () =>
          h(
            NIcon,
            { size: 16, color: '#1890FF' },
            { default: () => h(SvgIcon, { icon: btn.icon }) }
          ),
      }
    )
  )
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

const handleClick = (type, row, index) => {
  emits('btnClick', { type, row, index })
}
</script>

<style lang="scss" scoped></style>
