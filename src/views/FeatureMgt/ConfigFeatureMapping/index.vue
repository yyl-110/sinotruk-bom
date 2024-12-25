<template>
  <CommonPage>
    <template #header>
      <app-title text="特征管理" important-h-48 />
    </template>
    <div h-full w-full px-20 pt-20>
      <app-nav :select="3" :oid="route.query.oid" />
      <div class="form" mt-17 w-full flex flex-justify-between>
        <n-form
          ref="formRef"
          label-placement="left"
          require-mark-placement="left"
          inline
          important-w-full
        >
          <n-grid :cols="24" :x-gap="24">
            <n-form-item-gi :span="5" label="特征">
              <n-input v-model:value="name" placeholder="请输入模板特征" @keydown.enter="search" />
            </n-form-item-gi>
            <n-form-item-gi :span="5" label="编号">
              <n-input v-model:value="number" placeholder="请输入编号" @keydown.enter="search" />
            </n-form-item-gi>
            <n-form-item-gi :span="5" label="状态">
              <n-select
                v-model:value="status"
                placeholder="请选择"
                filterable
                :options="statusList"
              />
            </n-form-item-gi>

            <n-form-item-gi :span="9">
              <n-button type="primary" ml-auto mr-20 @click="search">
                <template #icon>
                  <img src="@/assets/images/search_white.png" alt="" class="h-14 w-14" />
                </template>
                查询
              </n-button>
              <n-button
                attr-type="button"
                type="primary"
                mr-20
                :disabled="userDisabled"
                @click="addMapping"
              >
                <template #icon>
                  <TheIcon icon="addBtn" type="custom" :size="16" class="mr-5" />
                </template>
                新增
              </n-button>
              <n-button @click="reset">
                <template #icon>
                  <img src="@/assets/images/refresh.png" alt="" class="h-14 w-14" />
                </template>
                重置
              </n-button>
            </n-form-item-gi>
          </n-grid>
        </n-form>
      </div>
      <n-data-table
        remote
        :columns="columns"
        :data="tableData"
        :pagination="pagination"
        :bordered="false"
        :max-height="500"
        :scroll-x="1200"
        :loading="loading"
        mt-20
      />
    </div>
    <config-mapping-modal
      v-if="mappingModalShow"
      ref="configMappingRef"
      @handle-confirm="handleConfirm"
      @handle-close="mappingModalShow = false"
    />
  </CommonPage>
</template>

<script setup>
import AppTitle from '@/components/common/AppTitle.vue'
import AppNav from '@/components/common/AppNav.vue'
import { NButton, NIcon } from 'naive-ui'
import SvgIcon from '@/components/icon/SvgIcon.vue'
import ConfigMappingModal from '../component/ConfigMappingModal.vue'
import { computed, nextTick, onActivated, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { deleteConditionRule, getSaleDesignMapRuleList } from '~/src/api/feature'
import useHandle from '~/src/hooks/useHandle'
const { queryCreateFReviewDoc, createChangePage, handleDelete } = useHandle()
import { statusList, USER_ROLE } from '@/views/data'
import useUserRole from '~/src/hooks/useUserRole'

defineOptions({ name: 'ConfigFeatureMapping' })

const route = useRoute()
const name = ref(route.query.name || '')
const number = ref('')
const status = ref(null)
const configMappingRef = ref(null)
const loading = ref(false)
const pageSize = ref(50)
const page = ref(1)
const tableData = ref([])
const mappingType = ref('new')
const selectOid = ref('')
const editIndex = ref(0)
const mappingModalShow = ref(false)

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
    title: '编号',
    key: 'number',
  },
  {
    title: '模版特征',
    key: 'name',
    width: '30%',
  },
  {
    title: '流程发起者',
    key: 'processCreator',
    width: 100,
  },
  {
    title: '版本',
    key: 'version',
  },
  {
    title: '状态',
    key: 'status',
    width: 90,
  },
  {
    title: '排序',
    key: 'sort',
    sorter: (row1, row2) => row1.sort - row2.sort,
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
        disabled: btnDisabled(btn, row),
        onClick: () => handleClick(btn?.type, row, index),
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

/* 新增或者编辑成功 */
const handleConfirm = (row, type) => {
  mappingType.value = type
  if (mappingType.value === 'new') {
    tableData.value.unshift(row)
  } else {
    if (editIndex.value || editIndex.value === 0) tableData.value.splice(editIndex.value, 1, row)
  }
  // fetchData()
}

const userDisabled = computed(() => useUserRole.value === USER_ROLE.CONFIGURATOR)
const btnDisabled = (btn, row) => {
  if (userDisabled.value) {
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

const handleClick = async (type, row, index) => {
  selectOid.value = row.oid
  switch (type) {
    case 1:
      mappingType.value = 'detail'
      mappingModalShow.value = true
      nextTick(() => {
        configMappingRef.value.show('detail', row.oid)
      })
      break
    case 2:
      editIndex.value = index
      mappingType.value = 'edit'
      mappingModalShow.value = true
      nextTick(() => {
        configMappingRef.value.show('edit', row.oid)
      })
      break
    case 3:
      queryCreateFReviewDoc(row.oid)
      break
    case 4:
      createChangePage(row.changeUrl)
      break
    case 5:
      await handleDelete(deleteConditionRule, { oid: row?.oid }, row?.name)
      fetchData()
      break

    default:
      break
  }
}

const addMapping = () => {
  mappingModalShow.value = true
  nextTick(() => {
    configMappingRef.value.show('new', route.query.oid)
  })
  selectOid.value = ''
  mappingType.value = 'new'
  editIndex.value = 0
}

const search = () => {
  page.value = 1
  fetchData()
}
const reset = () => {
  page.value = 1
  name.value = ''
  number.value = ''
  status.value = null
  fetchData()
}
const fetchData = async () => {
  try {
    loading.value = true
    const res = await getSaleDesignMapRuleList({
      oid: route.query?.oid,
      name: name.value.trim(),
      number: number.value.trim(),
      status: status.value,
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
// onMounted(() => {
//   fetchData()
// })
onActivated(() => {
  fetchData()
})
</script>

<style lang="scss" scoped>
.form {
  border-bottom: 1px solid #eaeaea;
}
</style>
