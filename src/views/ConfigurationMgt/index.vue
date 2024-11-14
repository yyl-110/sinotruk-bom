<template>
  <CommonPage>
    <div w-full overflow-x-hidden px-20>
      <app-title text="配置管理" />
      <div class="form" h-60 w-full flex flex-justify-between>
        <n-form
          ref="formRef"
          :model="formValue"
          label-placement="left"
          require-mark-placement="left"
          inline
        >
          <n-form-item label="车型子类编码">
            <n-input
              v-model:value="formValue.number"
              placeholder="输入编码"
              max-w-150
              @keydown.enter="search"
            />
          </n-form-item>
          <n-form-item label="车型子类名称">
            <n-input
              v-model:value="formValue.name"
              placeholder="输入名称"
              max-w-150
              @keydown.enter="search"
            />
          </n-form-item>
          <n-form-item label="产品经理">
            <n-input
              v-model:value="formValue.responsiblePerson"
              placeholder="请输入产品经理"
              max-w-150
              @keydown.enter="search"
            />
          </n-form-item>
          <n-form-item label="状态">
            <n-select
              v-model:value="formValue.status"
              placeholder="请选择"
              filterable
              :options="statusList"
              max-w-150
            />
          </n-form-item>
          <n-form-item ml-auto>
            <n-button attr-type="button" type="primary" @click="search">搜索</n-button>
            <n-button attr-type="button" type="primary" ml-10 @click="reset">重置</n-button>
          </n-form-item>
        </n-form>
      </div>
      <n-data-table
        remote
        :columns="columns"
        :data="tableData"
        :pagination="pagination"
        :loading="loading"
        :bordered="false"
        :scroll-x="1290"
        :max-height="600"
        mt-20
        w-full
      />
    </div>
    <addCarChildrenModal ref="carChildrenRef" @handle-confirm="confirmHandle" />
  </CommonPage>
</template>

<script setup>
import AppTitle from '~/src/components/common/AppTitle.vue'
import { NButton, NIcon } from 'naive-ui'
import { onActivated, ref } from 'vue'
import SvgIcon from '@/components/icon/SvgIcon.vue'
import addCarChildrenModal from './component/addCarChildrenModal.vue'
import { useRoute, useRouter } from 'vue-router'
import { deleteVehicleType, getVehicleTypeList } from '~/src/api/product'
import useHandle from '@/hooks/useHandle'
import { useBusinessStore } from '~/src/store'
import dayjs from 'dayjs'
const { queryCreateFReviewDoc, handleDelete, createChangePage } = useHandle()
import { statusList } from '@/views/data'
const carChildrenRef = ref(null)
const business = useBusinessStore()
defineOptions({ name: 'ConfigurationMgt' })

const router = useRouter()
const route = useRoute()

const formValue = ref({
  number: '',
  name: '',
  responsiblePerson: '',
  status: null,
})

const loading = ref(false)
const pageSize = ref(50)
const page = ref(1)
const tableData = ref([])
const handleInx = ref(-1)

const columns = [
  {
    title: '序号',
    key: 'no',
    fixed: 'left',
    width: 60,
    render(row, inx) {
      return inx + 1
    },
  },
  {
    title: '系列编码',
    key: 'number',
    fixed: 'left',
    width: 160,
    ellipsis: {
      tooltip: true,
    },
    render: (row) => {
      return h('span', { class: 'color-primary cursor-pointer' }, row.number)
    },
    resizable: true,
    minWidth: 160,
    maxWidth: 240,
  },
  {
    title: '名称',
    key: 'name',
    width: 200,
    ellipsis: {
      tooltip: true,
    },
    resizable: true,
    minWidth: 200,
  },
  // {
  //   title: '年代号',
  //   key: 'yearNo',
  //   minWidth: 80,
  // },
  {
    title: '配置车型',
    key: 'configVehicle',
    minWidth: 100,
    resizable: true,
  },
  {
    title: '版本',
    key: 'version',
    minWidth: 80,
    resizable: true,
  },
  {
    title: '状态',
    key: 'status',
    minWidth: 80,
    resizable: true,
  },
  {
    title: '产品经理',
    key: 'responsiblePerson',
    minWidth: 80,
    resizable: true,
  },
  {
    title: '更新时间',
    key: 'updateTime',
    resizable: true,
    width: 170,
    ellipsis: {
      tooltip: true,
    },
    render(row) {
      return dayjs(row.updateTime).format('YYYY/MM/DD HH:mm:ss')
    },
  },
  {
    title: '操作',
    key: 'actions',
    fixed: 'right',
    width: 340,
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
]

const btnList = [
  { icon: 'edit', type: 1, text: '修改' },
  { icon: 'icon_operate', text: '型谱策划', type: 2 },
  { icon: 'icon_operate_14', type: 3, text: '技术配置' },
  { icon: 'setting', text: '配置号管理', type: 4 },
  { icon: 'icon_operate_16', text: '超级BOM', type: 5 },
  { icon: 'flag', type: 6, text: '签审' },
  { icon: 'icon_operate_6', text: '更改', type: 7 },
  { icon: 'del', type: 8, text: '删除' },
]

const renderBtn = (btn, row, inx) => {
  return $toolTipWrap(
    btn.text,
    h(
      NButton,
      {
        size: 'tiny',
        onClick: () => handleClick(btn.type, row, inx),
        disabled: btnDisabled(btn, row),
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

const search = () => {
  page.value = 1
  fetchData()
}
const reset = () => {
  formValue.value = {
    number: '',
    name: '',
    responsiblePerson: '',
    status: null,
  }
  page.value = 1
  fetchData()
}

const handleClick = async (type, row, inx) => {
  handleInx.value = inx
  sessionStorage.setItem('isSpecial', row.configVehicle === '特殊车型')
  // business.handleSpecialChange(row.configVehicle === '特殊车型')
  switch (type) {
    case 1:
      carChildrenRef.value.show('edit', row.oid)
      break
    case 2:
      sessionStorage.setItem('status', row.status)
      business.handleConfigMgtOid(row.oid)
      router.push({
        path: '/configuration/spectrum',
        query: { oid: row.oid, number: row.number },
      })
      break
    case 3:
      sessionStorage.setItem('status', row.status)
      business.handleConfigMgtOid(row.oid)
      router.push({ path: 'technology-config', query: { oid: row.oid, number: row.number } })
      break
    case 4:
      sessionStorage.setItem('status', row.status)
      business.handleConfigMgtOid(row.oid)
      router.push({ path: 'num-mgt', query: { oid: row.oid, number: row.number } })
      break
    case 5:
      sessionStorage.setItem('status', row.status)
      business.handleConfigMgtOid(row.oid)
      router.push({ path: 'super-bom', query: { oid: row.oid, number: row.number } })
      break
    case 6:
      queryCreateFReviewDoc(row.oid)
      break
    case 7:
      createChangePage(row.changeUrl)
      break
    case 8:
      try {
        await handleDelete(deleteVehicleType, { oid: row.oid }, row.name)
        fetchData()
      } catch (error) {
        console.log('error:', error)
      }
      break

    default:
      break
  }
}

const pagination = ref({
  pageCount: 0,
  showSizePicker: true,
  showQuickJumper: true,
  page: page.value,
  itemCount: 0,
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
    const { number, name } = formValue.value
    const res = await getVehicleTypeList({
      oid: route.query?.oid,
      ...formValue.value,
      number: number.trim(),
      name: name.trim(),
      page: page.value,
      count: pageSize.value,
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
const confirmHandle = (row, inx) => {
  tableData.value.splice(handleInx.value, 1, row)
}
// onMounted(() => {
//   fetchData()
// })
onActivated(() => {
  fetchData()
})
watch(
  () => business.configMgtOid,
  () => {
    business.handleInternalVehicleModelList([])
  }
)
</script>

<style lang="scss" scoped>
.form {
  border-bottom: 1px solid #eaeaea;
}
::v-deep.n-data-table .n-data-table-td {
  --n-merged-td-color-hover: rgba(207, 247, 250, 1) !important;
}
</style>
