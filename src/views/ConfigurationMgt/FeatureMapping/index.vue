<template>
  <CommonPage sub-title="配置特征映射" back="mgt">
    <div h-full w-full px-20 pt-20>
      <!-- <child-title /> -->
      <config-mgt-nav :select="4" />
      <div class="form w-full pt-20">
        <n-form
          ref="formRef"
          :label-width="120"
          label-placement="left"
          :model="name"
          inline
          require-mark-placement="left"
          w-full
        >
          <n-form-item label="特征" path="type">
            <n-input v-model:value="name" placeholder="请输入" @keydown.enter="search" />
          </n-form-item>
          <n-form-item ml-auto>
            <n-button type="primary" ml-auto mr-20 @click="search">
              <template #icon>
                <img src="@/assets/images/search_white.png" alt="" class="h-14 w-14" />
              </template>
              查询
            </n-button>
            <n-button attr-type="button" type="primary" mr-20 @click="add">
              <template #icon>
                <TheIcon icon="addBtn" type="custom" :size="16" />
              </template>
              新增
            </n-button>
            <n-button @click="reset">
              <template #icon>
                <img src="@/assets/images/refresh.png" alt="" class="h-14 w-14" />
              </template>
              重置
            </n-button>
          </n-form-item>
        </n-form>
      </div>
      <n-data-table
        remote
        :columns="columns"
        :data="tableData"
        :pagination="pagination"
        :bordered="false"
        :max-height="500"
        :loading="loading"
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
import { NButton, NIcon } from 'naive-ui'
import SvgIcon from '@/components/icon/SvgIcon.vue'
import ConfigMgtNav from '../component/ConfigMgtNav.vue'
import ConfigMappingModal from '../component/ConfigMappingModal.vue'
import { getFeatureLocalSaleDesignMapRuleList } from '~/src/api/config'
import { useRoute } from 'vue-router'
import { computed, nextTick, onMounted } from 'vue'
import { deleteConditionRule } from '~/src/api/feature'
import useHandle from '@/hooks/useHandle'
const { handleDelete } = useHandle()
const configMappingRef = ref(null)
const name = ref('')
const route = useRoute()
const loading = ref(false)
const pageSize = ref(50)
const page = ref(1)
const mappingType = ref('new')
const selectOid = ref('')
const editIndex = ref(0)
const mappingModalShow = ref(false)

const reset = () => {
  name.value = ''
  page.value = 1
  pagination.value.pageCount = 1
  fetchData()
}
const search = () => {
  page.value = 1
  pagination.value.pageCount = 1
  fetchData()
}

const add = () => {
  editIndex.value = 0
  mappingType.value = 'new'
  mappingModalShow.value = true
  nextTick(() => {
    configMappingRef.value.show('new', route.query.oid)
  })
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
  {
    title: '序号',
    key: 'no',
    width: 60,
    render(row, inx) {
      return inx + 1
    },
  },
  {
    title: '编号',
    key: 'number',
    width: 100,
  },
  {
    title: '模版特征',
    key: 'name',
    width: '50%',
  },
  {
    title: '操作',
    key: 'actions',
    width: 200,
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
  if (row.status === '已完成') {
    return [3, 2].includes(btn.type)
  }
  if (row.status === '设计中') {
    return false
  }
  return [2, 3].includes(btn.type)
}

const renderBtn = (btn, row, inx) => {
  return $toolTipWrap(
    btn.text,
    h(
      NButton,
      {
        size: 'tiny',
        disabled: btnDisabled(btn, row),
        onClick: () => handleClick(btn?.type, row, inx),
        class: 'rounded-10 w-30 mr-10 h-30',
      },
      h(NIcon, { size: 16, color: '#1890FF' }, { default: () => h(SvgIcon, { icon: btn.icon }) })
    )
  )
}

const tableData = ref([])

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
      await handleDelete(deleteConditionRule, { oid: row?.oid }, row?.name)
      fetchData()
      break

    default:
      break
  }
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

const fetchData = async () => {
  try {
    loading.value = true
    const res = await getFeatureLocalSaleDesignMapRuleList({
      oid: route.query.oid,
      name: name.value,
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

onMounted(() => {
  fetchData()
})
</script>

<style lang="scss" scoped>
.form {
  border-bottom: 1px solid #eaeaea;
}
</style>
