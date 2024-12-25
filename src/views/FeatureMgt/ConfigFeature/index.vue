<template>
  <CommonPage>
    <template #header>
      <app-title text="特征管理" important-h-48 />
    </template>
    <div h-full w-full bg-hex-f5f6fb>
      <n-grid
        cols="10 s:10 m:10 l:10 xl:10 2xl:10"
        responsive="screen"
        class="gridWrap"
        :x-gap="12"
        lg:h-full
        lt-lg:h-auto
      >
        <n-grid-item :span="!showRight ? 10 : '10 s:10 m:7 l:7 xl:7 2xl:7'">
          <div class="h-full rounded-4 bg-white px-20 pt-20">
            <!-- <app-title text="特征管理" /> -->
            <app-nav :select="1" :oid="route.query.oid" />
            <div class="form" mt-17 w-full flex flex-justify-between>
              <n-form
                ref="formRef"
                :model="formValue"
                label-placement="left"
                require-mark-placement="left"
                inline
                important-w-full
              >
                <n-grid :cols="24" :x-gap="24">
                  <n-form-item-gi :span="5" label="名称">
                    <n-input
                      v-model:value="formValue.name"
                      placeholder="请输入特征名称"
                      @keydown.enter="search"
                    />
                  </n-form-item-gi>
                  <n-form-item-gi :span="5" label="编号">
                    <n-input
                      v-model:value="formValue.number"
                      placeholder="请输入编号"
                      @keydown.enter="search"
                    />
                  </n-form-item-gi>
                  <n-form-item-gi :span="5" label="状态">
                    <n-select
                      v-model:value="formValue.status"
                      placeholder="请选择"
                      filterable
                      :options="statusList"
                    />
                  </n-form-item-gi>
                  <n-form-item-gi :span="showRight ? 24 : 9">
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
                      @click="add"
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
            <div my-20 w-full>
              <n-radio-group
                v-model:value="navValue"
                name="radiobuttongroup1"
                @update:value="change"
              >
                <n-radio-button
                  v-for="song in list"
                  :key="song.value"
                  :value="song.value"
                  :label="song.label"
                />
              </n-radio-group>
            </div>
            <!-- table -->
            <n-data-table
              remote
              :columns="columns"
              :data="tableData"
              :pagination="pagination"
              :bordered="false"
              :max-height="600"
              :loading="loading"
              :row-props="rowProps"
              :scrool-x="1200"
            />
          </div>
        </n-grid-item>
        <n-grid-item v-if="showRight" span="10 s:10 m:3 l:3 xl:3 2xl:3">
          <div h-full min-h-500 w-full rounded-4 bg-white px-20 pt-5>
            <WeldingFeatureDetail
              v-if="showRight === 2"
              :select-data="selectDetail"
              :nav-value="navValue"
              :loading="detailLoading"
            />
            <add-welding-config
              v-if="showRight === 1"
              :option-type="optionType"
              :handle-item="selectDetail"
              :nav-value="navValue"
              :handle-oid="handleOid"
              @handle-confim="handleConfim"
            />
          </div>
        </n-grid-item>
      </n-grid>
    </div>
  </CommonPage>
</template>

<script setup>
import appTitle from '@/components/common/AppTitle.vue'
import AppNav from '@/components/common/AppNav.vue'
import { NButton, NIcon } from 'naive-ui'
import SvgIcon from '@/components/icon/SvgIcon.vue'
import WeldingFeatureDetail from '../component/WeldingFeatureDetail.vue'
import AddWeldingConfig from '../component/AddWeldingConfig.vue'
import { getSaleCharacterDetail, getSaleCharacterList } from '~/src/api/feature'
import { computed, onActivated, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import useHandle from '~/src/hooks/useHandle'
const { queryCreateFReviewDoc, createChangePage } = useHandle()
import { statusList, USER_ROLE } from '@/views/data'
import useUserRole from '@/hooks/useUserRole'
defineOptions({ name: 'ConfigFeature' })

const route = useRoute()
const formRef = ref(null)
const formValue = ref({ name: '', number: '', status: null })
const showRight = ref(0) // 0 隐藏 1 新增 2 详情
const loading = ref(false)
const pageSize = ref(50)
const page = ref(1)
const tableData = ref([])
const selectOid = ref('')
const selectDetail = ref({})
const optionType = ref('add')
const editIndex = ref(null)
const detailLoading = ref(false)
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

const handleOid = computed(() => (optionType.value === 'add' ? route.query.oid : selectOid.value))

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
    title: '特征名称',
    minWidth: 150,
    key: 'name',
  },
  {
    title: '流程发起者',
    key: 'processCreator',
    width: 120,
  },
  {
    title: '版本',
    key: 'version',
    width: 80,
  },
  {
    title: '状态',
    key: 'status',
    width: 80,
  },
  {
    title: '排序',
    key: 'sort',
    width: 80,
    sorter: (row1, row2) => row1.sort - row2.sort,
  },
  {
    title: '操作',
    key: 'actions',
    fixed: 'right',
    width: 200,
    render(row, index) {
      return h(
        'div',
        {
          class: 'flex items-center',
          onClick: (e) => e.stopPropagation(),
        },
        { default: () => btnList.map((i) => renderBtn(i, row, index)) }
      )
    },
  },
]

const rowProps = (row) => {
  return {
    onClick: () => {
      selectOid.value = row.oid
      showRight.value = 2
      fetchDetail()
    },
  }
}

const btnList = [
  { icon: 'edit', text: '修改', type: 2 },
  { icon: 'flag', text: '签审', type: 3 },
  { icon: 'icon_operate_6', text: '更改', type: 4 },
]

const userDisabled = computed(() => useUserRole.value === USER_ROLE.CONFIGURATOR)

const btnDisabled = (btn, row) => {
  /* 配置员无读写权限 */
  if (useUserRole.value === USER_ROLE.CONFIGURATOR) {
    return true
  }
  if (row.status === '重新工作') {
    return [3, 4].includes(btn.type)
  }
  if (row.status === '已完成') {
    return [2, 3].includes(btn.type)
  }
  if (row.status === '设计中') {
    if (row.version.includes('A')) {
      return btn.type === 4
    }
    return [3, 4].includes(btn.type)
  }
  return [2, 3, 4].includes(btn.type)
}

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
const list = [
  { label: '固化配置', value: 'fixed' },
  { label: '选装配置', value: 'optional' },
]

const navValue = ref('fixed')

const handleClick = (type, row, index) => {
  selectOid.value = row.oid
  switch (type) {
    case 2:
      showRight.value = 1
      optionType.value = 'edit'
      editIndex.value = index
      fetchDetail()
      break

    case 3:
      queryCreateFReviewDoc(row.oid)
      break
    case 4:
      createChangePage(row.changeUrl)
      break

    default:
      break
  }
}

const change = () => {
  page.value = 1
  pageSize.value = 50
  // formValue.value = { name: '', number: '', status: null }
  fetchData()
  showRight.value = 0
}

const search = () => {
  // if (!formValue.value?.name) {
  //   $message.warning('请输入特征名称！')
  //   return
  // }
  page.value = 1
  showRight.value = 0
  fetchData()
}

const reset = () => {
  page.value = 1
  showRight.value = 0
  formValue.value = { name: '', number: '', status: null }
  fetchData()
}

const add = () => {
  selectDetail.value = {}
  optionType.value = 'add'
  showRight.value = 1
}

const fetchDetail = async () => {
  try {
    detailLoading.value = true
    const res = await getSaleCharacterDetail({ oid: selectOid.value })
    selectDetail.value = res.data
  } catch (error) {
    console.log('error:', error)
  } finally {
    detailLoading.value = false
  }
}

const fetchData = async () => {
  try {
    loading.value = true
    const { name, number } = formValue.value
    const res = await getSaleCharacterList({
      oid: route.query?.oid,
      ...formValue.value,
      name: name.trim(),
      number: number.trim(),
      page: page.value,
      count: pageSize.value,
      type: navValue.value,
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

/* 新增成功 */
const handleConfim = (row) => {
  showRight.value = 0
  if (optionType.value === 'add') {
    tableData.value.unshift(row)
  } else {
    if (editIndex.value || editIndex.value === 0) tableData.value.splice(editIndex.value, 1, row)
  }

  // fetchData()
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
::v-deep.n-data-table .n-data-table-wrapper {
  // padding-bottom: 60px;
  // border-bottom: 1px solid #eaeaea;
}
</style>
