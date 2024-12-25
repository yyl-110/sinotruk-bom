<template>
  <div h-full w-full>
    <app-title text="系列编码" />
    <div class="form" min-h-60 flex flex-justify-between>
      <n-form
        ref="formRef"
        inline
        :model="formValue"
        label-placement="left"
        important-w-auto
        require-mark-placement="left"
      >
        <n-grid :cols="24" :x-gap="24">
          <n-form-item-gi :span="6" label="编码">
            <n-input v-model:value="formValue.number" placeholder="编码" @keydown.enter="search" />
          </n-form-item-gi>
          <n-form-item-gi :span="6" label="名称">
            <n-input v-model:value="formValue.name" placeholder="名称" @keydown.enter="search" />
          </n-form-item-gi>
          <n-form-item-gi :span="6" label="产品经理">
            <n-input
              v-model:value="formValue.responsiblePerson"
              placeholder="产品经理"
              @keydown.enter="search"
            />
          </n-form-item-gi>
          <n-form-item-gi :span="6" label="状态">
            <n-select
              v-model:value="formValue.status"
              placeholder="请选择"
              filterable
              :options="statusList"
            />
          </n-form-item-gi>
          <n-form-item-gi :span="24">
            <n-button type="primary" @click="add">
              <template #icon>
                <the-icon type="custom" icon="addBtn" color="#fff" :size="16" />
              </template>
              新建
            </n-button>
            <n-button attr-type="button" type="primary" ml-auto @click="search">
              <template #icon>
                <img src="@/assets/images/search_white.png" alt="" class="h-14 w-14" />
              </template>
              搜索
            </n-button>
            <n-button ml-10 @click="reset">
              <template #icon>
                <img src="@/assets/images/refresh.png" alt="" class="h-14 w-14" />
              </template>
              重置
            </n-button>
          </n-form-item-gi>
        </n-grid>
      </n-form>
    </div>
    <div w-full overflow-hidden>
      <n-data-table
        remote
        :columns="columns"
        :data="tableData"
        :pagination="pagination"
        :bordered="false"
        :loading="loading"
        :scroll-x="scrollxWidth"
        :max-height="600"
        :scrollbar-props="{ trigger: 'none' }"
        w-full
      />
    </div>
    <addcar-children-modal ref="addCarRef" @handle-confirm="confirmHandle" />
  </div>
</template>

<script setup>
import AppTitle from '@/components/common/AppTitle.vue'
import { NButton, NIcon } from 'naive-ui'
import { computed, onActivated, onMounted, ref, watch } from 'vue'
import SvgIcon from '@/components/icon/SvgIcon.vue'
import AddcarChildrenModal from './addcarChildrenModal.vue'
import { getVehicleTypeList, deleteVehicleType } from '~/src/api/product'
import { useRouter } from 'vue-router'
import useHandle from '@/hooks/useHandle'
import { useBusinessStore } from '~/src/store'
import dayjs from 'dayjs'
const { queryCreateFReviewDoc, handleDelete, createChangePage } = useHandle()
const { handleConfigMgtOid, handleInternalVehicleModelList } = useBusinessStore()
import { statusList } from '@/views/data'

const router = useRouter()

const props = defineProps({
  oid: {
    type: String,
    default: '',
  },
  parentOid: {
    type: String,
    default: '',
  },
})
const addCarRef = ref(null)
const loading = ref(false)
const pageSize = ref(50)
const page = ref(1)
const modelType = ref('new')
const handleInx = ref(0)
const emits = defineEmits(['handleConfirm', 'handleClickItem'])

const formValue = ref({
  name: '',
  code: '',
  responsiblePerson: '',
  status: null,
})

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
  onChange: (pageCount) => {
    page.value = pageCount
    fetchData()
  },
})

const add = () => {
  handleInx.value = 0
  modelType.value = 'new'
  addCarRef.value.show('new', '', props.parentOid, props.oid)
}

const confirmHandle = (row, type) => {
  modelType.value = type
  if (modelType.value === 'new') {
    tableData.value.unshift(row)
    emits('handleConfirm')
  }
  if (modelType.value === 'edit') {
    tableData.value.splice(handleInx.value, 1, row)
    emits('handleConfirm')
  }
}
const numberWidth = ref(150)
const nameWidth = ref(180)

const scrollxWidth = computed(() => numberWidth.value + 200 + 1120)

const columns = computed(() => [
  {
    title: '序号',
    key: 'no',
    width: 60,
    render(row, inx) {
      return inx + 1
    },
  },
  {
    title: '系列编码',
    key: 'number',
    // ellipsis: {
    //   tooltip: true,
    // },
    render: (row) => {
      return h(
        'span',
        {
          class: 'color-primary cursor-pointer',
          onClick: () => {
            emits('handleClickItem', row.oid)
          },
        },
        row.number
      )
    },
    resizable: true,
    width: numberWidth.value,
    minWidth: numberWidth.value,
  },
  {
    title: '名称',
    key: 'name',
    ellipsis: {
      tooltip: true,
    },
    resizable: true,
    // width: nameWidth.value,
    // minWidth: nameWidth.value,
  },
  {
    title: '配置车型',
    key: 'configVehicle',
    minWidth: 80,
    ellipsis: {
      tooltip: true,
    },
    resizable: true,
  },
  {
    title: '版本',
    key: 'version',
    minWidth: 80,
    ellipsis: {
      tooltip: true,
    },
    resizable: true,
  },
  {
    title: '备注',
    key: 'remark',
    minWidth: 170,
    ellipsis: {
      tooltip: true,
    },
    resizable: true,
  },
  {
    title: '状态',
    key: 'status',
    minWidth: 100,
    ellipsis: {
      tooltip: true,
    },
    resizable: true,
  },
  {
    title: '产品经理',
    key: 'responsiblePerson',
    minWidth: 80,
    ellipsis: {
      tooltip: true,
    },
    resizable: true,
  },
  {
    title: '更新时间',
    key: 'updateTime',
    minWidth: 170,
    ellipsis: {
      tooltip: true,
    },
    render(row) {
      return dayjs(row.updateTime).format('YYYY/MM/DD HH:mm:ss')
    },
    resizable: true,
  },
  {
    title: '操作',
    key: 'actions',
    width: 380,
    fixed: 'right',
    render(row, inx) {
      return h(
        'div',
        {
          class: 'flex items-center',
        },
        { default: () => btnList.map((i) => renderBtn(i, row, inx)) }
      )
    },
  },
])

const btnList = [
  { icon: 'icon_operate_12', text: '信息', type: 0 },
  { icon: 'edit', text: '修改', type: 1 },
  { icon: 'icon_operate', text: '型谱策划', type: 2 },
  { icon: 'icon_operate_14', type: 3, text: '技术配置' },
  { icon: 'setting', text: '配置号管理', type: 4 },
  { icon: 'icon_operate_16', text: '超级BOM', type: 5 },
  { icon: 'flag', text: '签审', type: 6 },
  { icon: 'icon_operate_6', text: '更改', type: 7 },
  { icon: 'del', text: '删除', type: 8 },
]

const btnDisabled = (btn, row) => {
  if (row.status === '重新工作') {
    return [6, 7, 8].includes(btn.type)
  }
  if (row.status === '已完成') {
    return [1, 8, 6].includes(btn.type)
  }
  if (row.status === '设计中') {
    if (row.version.includes('A')) {
      return [7].includes(btn.type)
    }
    return [6, 7].includes(btn.type)
  }
  return [1, 6, 7, 8].includes(btn.type)
}

const renderBtn = (btn, row, inx) => {
  return $toolTipWrap(
    btn.text,
    h(
      NButton,
      {
        size: 'tiny',
        disabled: btnDisabled(btn, row),
        onClick: () => handleClick(btn.type, row, inx),
        class: 'rounded-10 w-30 mr-10 h-30',
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

const search = () => {
  fetchData()
}
const reset = () => {
  formValue.value = {
    name: '',
    code: '',
    responsiblePerson: '',
    status: null,
    number: '',
  }
  fetchData()
}

const handleClick = async (type, row, inx) => {
  handleInx.value = inx
  sessionStorage.setItem('isSpecial', row.configVehicle === '特殊车型')
  // handleSpecialChange(row.configVehicle === '特殊车型')
  handleInternalVehicleModelList([])
  switch (type) {
    case 0:
      modelType.value = 'detail'
      addCarRef.value.show('detail', row.oid, props.parentOid, props.oid)
      break
    case 1:
      modelType.value = 'edit'
      addCarRef.value.show('edit', row.oid, props.parentOid, props.oid)
      break
    case 2:
      sessionStorage.setItem('status', row.status)
      handleConfigMgtOid(row.oid)
      router.push({ path: '/configuration/spectrum', query: { oid: row.oid, number: row.number } })
      break
    case 3:
      sessionStorage.setItem('status', row.status)
      handleConfigMgtOid(row.oid)
      router.push({
        path: '/configuration/technology-config',
        query: { oid: row.oid, number: row.number },
      })
      break
    case 4:
      sessionStorage.setItem('status', row.status)
      handleConfigMgtOid(row.oid)
      router.push({ path: '/configuration/num-mgt', query: { oid: row.oid, number: row.number } })
      break
    case 5:
      sessionStorage.setItem('status', row.status)
      handleConfigMgtOid(row.oid)
      router.push({ path: '/configuration/super-bom', query: { oid: row.oid, number: row.number } })
      break

    case 6:
      queryCreateFReviewDoc(row.oid)
      break
    case 7:
      createChangePage(row.changeUrl)
      break
    case 8: // 删除
      try {
        if (row?.optionSetStatus === '正在审核' || row?.optionSetStatus === '已完成') {
          await handleDelete(
            deleteVehicleType,
            { oid: row.oid },
            '',
            '型谱策划对象在审核或是已完成状态，请确认是否需要删除'
          )
        } else {
          await handleDelete(deleteVehicleType, { oid: row.oid }, row.name)
        }
        fetchData()
        emits('handleConfirm')
      } catch (error) {
        console.log('error:', error)
      }
      break
    default:
      break
  }
}
const tableData = ref([])

const getBLen = (str) => {
  if (str == null) return 0
  if (typeof str != 'string') {
    str += ''
  }
  return str.replace(/[^\x00-\xff]/g, '01').length
}

const fetchData = async () => {
  try {
    loading.value = true
    const { responsiblePerson = '', name = '', number = '' } = formValue.value
    const res = await getVehicleTypeList({
      oid: props.oid,
      ...formValue.value,
      responsiblePerson: responsiblePerson.trim(),
      name: name.trim(),
      number: number.trim(),
      page: page.value,
      count: pageSize.value,
    })
    res.data.forEach((item) => {
      const numberW = getBLen(item?.number || '') * 10
      const nameW = getBLen(item?.name || '') * 7
      if (numberW > numberWidth.value) {
        numberWidth.value = numberW
      }
      if (nameW > nameWidth.value) {
        nameWidth.value = nameW
      }
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

onMounted(() => {
  fetchData()
})
onActivated(() => {
  fetchData()
})

watch(
  () => props.oid,
  () => {
    fetchData()
  }
)
</script>

<style lang="scss" scoped>
::v-deep.n-data-table .n-data-table-th {
  background: #f2f3f5;
  font-weight: 400;
  font-size: 14px;
  color: #1d2129;
}
::v-deep.n-data-table .n-data-table-td {
  --n-merged-td-color-hover: rgba(207, 247, 250, 1) !important;
}
</style>
