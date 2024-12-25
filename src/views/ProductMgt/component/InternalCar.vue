<template>
  <div h-full w-full>
    <app-title text="内部车型号" />
    <div class="form" flex>
      <!-- <n-button type="primary" @click="add">
        <template #icon>
          <the-icon type="custom" icon="addBtn" color="#fff" size="16" />
        </template>
        新建
      </n-button> -->
      <n-form
        ref="formRef"
        :model="formValue"
        :label-width="100"
        label-placement="left"
        require-mark-placement="left"
        w-full
      >
        <n-grid :cols="24" :x-gap="24">
          <n-form-item-gi :span="8" label="内部车型号">
            <n-input v-model:value="formValue.number" placeholder="请输入" />
          </n-form-item-gi>
          <!-- <n-form-item-gi :span="8" label="品牌">
            <n-select
              v-model:value="formValue.brand"
              placeholder="请选择"
              :options="BRAND"
              label-field="value"
              value-field="key"
              :render-option="$renderTooltip"
              filterable
            />
          </n-form-item-gi> -->
          <!-- <n-form-item-gi :span="8" label="系列编码">
            <n-input v-model:value="formValue.seriesCode" placeholder="请输入" />
          </n-form-item-gi> -->
          <!-- <n-form-item-gi :span="8" label="品系">
            <n-select
              v-model:value="formValue.seriesName"
              placeholder="请选择"
              :options="enum1"
              label-field="value"
              value-field="key"
              :render-option="$renderTooltip"
              filterable
            />
          </n-form-item-gi> -->
          <!-- <n-form-item-gi :span="8" label="车型">
            <n-select
              v-model:value="formValue.VEHICLE_TYPE"
              placeholder="请选择"
              :options="enum2"
              label-field="value"
              value-field="key"
              :render-option="$renderTooltip"
              filterable
            />
          </n-form-item-gi> -->

          <n-form-item-gi :span="8" label="驱动型式" path="DRIVE_TYPE">
            <n-select
              v-model:value="formValue.DRIVE_TYPE"
              placeholder="请选择"
              :options="enum3"
              label-field="value"
              value-field="key"
              :render-option="$renderTooltip"
              filterable
            />
          </n-form-item-gi>
          <n-form-item-gi :span="8" label="燃料形式" path="fuelType">
            <n-select
              v-model:value="formValue.fuelType"
              placeholder="请选择"
              :options="enum4"
              label-field="value"
              value-field="key"
              :render-option="$renderTooltip"
              filterable
            />
          </n-form-item-gi>
          <n-form-item-gi :span="8" label="排放标准" path="EMISSION_STANDARD">
            <n-select
              v-model:value="formValue.EMISSION_STANDARD"
              placeholder="请选择"
              :options="enum5"
              label-field="value"
              value-field="key"
              :render-option="$renderTooltip"
              filterable
            />
          </n-form-item-gi>
          <n-form-item-gi :span="8" label="状态">
            <n-select
              v-model:value="formValue.status"
              placeholder="请选择"
              filterable
              :options="statusList"
            />
          </n-form-item-gi>
          <n-form-item-gi :span="8" label="更新者">
            <n-input v-model:value="formValue.updator" placeholder="请输入更新者" />
          </n-form-item-gi>
          <n-form-item-gi :span="24">
            <n-button type="primary" ml-auto @click="search">
              <template #icon>
                <img src="../../../assets/images/search_white.png" alt="" class="h-14 w-14" />
              </template>
              查询
            </n-button>
            <n-button ml-15 @click="reset">
              <template #icon>
                <img src="../../../assets/images/refresh.png" alt="" class="h-14 w-14" />
              </template>
              重置
            </n-button>
          </n-form-item-gi>
        </n-grid>
      </n-form>
    </div>
    <div class="btnwrap" my-20>
      <n-button type="primary" @click="add">
        <template #icon>
          <the-icon type="custom" icon="addBtn" color="#fff" :size="16" />
        </template>
        新建
      </n-button>
      <n-button type="primary" ml-20 @click="batchChange">
        <template #icon>
          <the-icon type="custom" icon="flag" color="#fff" size="16" />
        </template>
        批量审批
      </n-button>
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
    <add-internal-car-modal ref="addinternalRef" @handle-confirm="confirmHandle" />
    <InternalCarChangeModal ref="internalCarChangeRef" />
    <!-- <internal-car-approval-modal ref="internalCarApprovalRef" /> -->
  </div>
</template>

<script setup>
import AppTitle from '@/components/common/AppTitle.vue'
import { NButton, NIcon } from 'naive-ui'
import { onMounted, ref } from 'vue'
import SvgIcon from '@/components/icon/SvgIcon.vue'
import AddInternalCarModal from './AddInternalCarModal.vue'
import InternalCarChangeModal from './InternalCarChangeModal.vue'
// import InternalCarApprovalModal from './InternalCarApprovalModal.vue'
import {
  createBatchFReviewDoc,
  deleteInternalVehicleModel,
  getInternalVehicleModelDetail,
  getInternalVehicleModelList,
} from '~/src/api/product'
const { queryCreateFReviewDoc, handleDelete, createChangePage } = useHandle()
import { useRouter } from 'vue-router'
import useHandle from '~/src/hooks/useHandle'
import { getNullData, toolTipWrap } from '~/src/utils'
import { useBusinessStore, useAppStore } from '~/src/store'
import dayjs from 'dayjs'
import { statusList } from '@/views/data'
const router = useRouter()
const { changeLoading } = useAppStore()
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
const {
  handleInternalVehicleModelList,
  chooseInternalVehicleModelList = [],
  handleConfigMgtOid,
} = useBusinessStore()

const addinternalRef = ref(null)
const internalCarChangeRef = ref(null)
const internalCarApprovalRef = ref(null)
const loading = ref(false)
const pageSize = ref(50)
const page = ref(1)
const tableData = ref([])
const modelType = ref('new')
const handleInx = ref(0)
const emits = defineEmits(['handleConfirm'])

const formValue = ref({})
const BRAND = ref([])
const enum1 = ref([])
const enum2 = ref([])
const enum3 = ref([])
const enum4 = ref([])
const enum5 = ref([])

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
    const { number = '', updator = '' } = formValue.value
    const res = await getInternalVehicleModelList({
      oid: props.oid,
      ...getNullData(formValue.value),
      number: number.trim(),
      updator: updator.trim(),
      page: page.value,
      count: pageSize.value,
    })
    res.data.forEach((item) => {
      const numberW = (item?.number || '').length * 11
      const seriesCodeW = (item?.seriesCode || '').length * 11
      if (numberW > numberWidth.value) {
        numberWidth.value = numberW
      }
      if (seriesCodeW > seriesCodeWidth.value) {
        seriesCodeWidth.value = seriesCodeW
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

// 后续调用接口
const batchChange = async () => {
  try {
    changeLoading(true)
    const res = await createBatchFReviewDoc({ oid: props.oid })
    if (res.success) {
      $message.success('审批成功')
    }
  } catch (error) {
    console.log('error:', error)
  } finally {
    changeLoading(false)
  }
}

const add = () => {
  handleInx.value = 0
  modelType.value = 'new'
  addinternalRef.value.show('new', '', props.parentOid, props.oid)
}

const numberWidth = ref(200)
const seriesCodeWidth = ref(120)
const scrollxWidth = computed(() => seriesCodeWidth.value + numberWidth.value + 1120)

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
    title: '内部车型号',
    key: 'number',
    width: numberWidth.value,
    ellipsis: {
      tooltip: true,
    },
    // onClick: () => internalCarChangeRef.value.show()
    render: (row) => {
      return h('span', { class: 'color-primary cursor-pointer' }, row.number)
    },
    resizable: true,
  },
  {
    title: '系列编码',
    key: 'seriesCode',
    width: seriesCodeWidth.value,
    ellipsis: {
      tooltip: true,
    },
    resizable: true,
  },
  {
    title: '品系',
    key: 'seriesName',
    width: 80,
    ellipsis: {
      tooltip: true,
    },
    resizable: true,
  },
  {
    title: '车型',
    key: 'VEHICLE_TYPE',
    width: 80,
    ellipsis: {
      tooltip: true,
    },
    resizable: true,
  },
  {
    title: '驱动形式',
    key: 'DRIVE_TYPE',
    width: 80,
    ellipsis: {
      tooltip: true,
    },
    resizable: true,
  },
  {
    title: '燃料形式',
    key: 'fuelType',
    width: 80,
    ellipsis: {
      tooltip: true,
    },
    resizable: true,
  },
  {
    title: '排放标准',
    key: 'EMISSION_STANDARD',
    width: 80,
    ellipsis: {
      tooltip: true,
    },
    resizable: true,
  },
  {
    title: '版本',
    key: 'version',
    width: 80,
    ellipsis: {
      tooltip: true,
    },
    resizable: true,
  },
  {
    title: '状态',
    key: 'status',
    width: 80,
    ellipsis: {
      tooltip: true,
    },
    resizable: true,
    // render: (row) => {
    //   return h('div', { class: 'color-#FAAD14 flex items-center' }, [
    //     h('div', { class: 'w-8 h-8 rounded-90 mr-8 bg-#FAAD14 flex-shrink-0' }),
    //     row.status,
    //   ])
    // },
  },
  {
    title: '更新者',
    key: 'updator',
    width: 80,
    ellipsis: {
      tooltip: true,
    },
    resizable: true,
  },
  {
    title: '更新时间',
    key: 'updateTime',
    width: 170,
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
    width: 250,
    fixed: 'right',
    render(row, inx) {
      return h(
        'div',
        {
          class: 'flex items-center',
        },
        btnList.map((i) => renderBtn(i, row, inx))
      )
    },
  },
])

const btnList = [
  { icon: 'icon_operate_12', type: 0, text: '信息' },
  { icon: 'edit', type: 1, text: '修改' },
  { icon: 'icon_operate_14', type: 2, text: '技术配置' },
  { icon: 'flag', type: 3, text: '签审' },
  { icon: 'icon_operate_6', text: '更改', type: 4 },
  { icon: 'del', type: 5, text: '删除' },
]

const btnDisabled = (btn, row) => {
  if (row.status === '重新工作') {
    return [3, 4, 5].includes(btn.type)
  }
  if (row.status === '已完成') {
    return [1, 5, 3].includes(btn.type)
  }
  if (row.status === '设计中') {
    return btn.type === 4
  }
  if (row.status === '设计中') {
    if (row.version.includes('A')) {
      return btn.type === 4
    }
    return [3, 4].includes(btn.type)
  }
  return [1, 4, 3, 5].includes(btn.type)
}

const renderBtn = (btn, row, inx) => {
  return toolTipWrap(
    btn.text,
    h(
      NButton,
      {
        size: 'tiny',
        onClick: () => handleClick(btn.type, row, inx),
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

const search = () => {
  fetchData()
}

const reset = () => {
  formValue.value = {
    number: '',
    brand: null,
    seriesCode: '',
    seriesName: null,
    vehicleUse: null,
    DRIVE_TYPE: null,
    fuelType: null,
    EMISSION_STANDARD: null,
    updator: '',
    status: null,
  }
  fetchData()
}

const handleClick = async (type, row, inx) => {
  handleInx.value = inx
  switch (type) {
    case 0:
      modelType.value = 'detail'
      addinternalRef.value.show('detail', row.oid, props.parentOid, props.oid)
      break
    case 1:
      modelType.value = 'edit'
      addinternalRef.value.show('edit', row.oid, props.parentOid, props.oid)
      break
    case 2:
      sessionStorage.setItem('status', row.status)
      handleInternalVehicleModelList([row.oid])
      handleConfigMgtOid(props.oid)
      router.push({
        path: '/configuration/technology-config',
        query: { oid: props.oid, number: row.seriesCode },
      })
      break
    case 3:
      queryCreateFReviewDoc(row.oid)
      break
    case 4:
      createChangePage(row.changeUrl)
      break
    case 5:
      await handleDelete(deleteInternalVehicleModel, { oid: row.oid }, row.number)
      fetchData()
      emits('handleConfirm')
      break

    default:
      break
  }
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
const fetchDetail = async () => {
  const res = await getInternalVehicleModelDetail({ oid: props.oid })
  BRAND.value = res.data.find((item) => item.id === 'brandName')?.enums
  enum1.value = res.data.find((item) => item.id === 'seriesName')?.enums
  enum2.value = res.data.find((item) => item.id === 'VEHICLE_TYPE')?.enums
  enum3.value = res.data.find((item) => item.id === 'DRIVE_TYPE')?.enums
  enum4.value = res.data.find((item) => item.id === 'fuelType')?.enums
  enum5.value = res.data.find((item) => item.id === 'EMISSION_STANDARD')?.enums
}
onMounted(() => {
  fetchData()
  fetchDetail()
})
onActivated(() => {
  fetchData()
  fetchDetail()
})
watch(
  () => props.oid,
  () => {
    fetchData()
    fetchDetail()
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
::v-deep .n-button {
  --n-border-radius: 4px !important;
}

.form {
  border-bottom: 1px solid #eaeaea;
}
</style>
