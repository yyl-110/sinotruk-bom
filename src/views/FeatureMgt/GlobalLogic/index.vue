<template>
  <CommonPage>
    <template #header>
      <app-title text="全局逻辑" important-h-48 />
    </template>
    <div id="container" h-full w-full px-20 pt-20>
      <!-- <app-title text="全局逻辑" /> -->
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
            <n-form-item-gi :span="5" label="规则名">
              <n-input
                v-model:value="formValue.name"
                placeholder="请输入"
                @keydown.enter="search"
              />
            </n-form-item-gi>
            <n-form-item-gi :span="5" label="所属模块">
              <n-select
                v-model:value="formValue.model"
                placeholder="请选择"
                filterable
                :options="mModuleList"
                label-field="value"
                value-field="key"
                :render-option="$renderTooltip"
              />
            </n-form-item-gi>
            <n-form-item-gi :span="5" label="编号">
              <n-input
                v-model:value="formValue.number"
                placeholder="请输入编号"
                @keydown.enter="search"
              />
            </n-form-item-gi>
            <n-form-item-gi :span="4" label="状态">
              <n-select
                v-model:value="formValue.status"
                placeholder="请选择"
                filterable
                :options="statusList"
              />
            </n-form-item-gi>

            <n-form-item-gi :span="5">
              <n-button type="primary" ml-auto mr-20 @click="search">
                <template #icon>
                  <img src="@/assets/images/search_white.png" alt="" class="h-14 w-14" />
                </template>
                查询
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
      <n-radio-group :value="navValue" name="radiobuttongroup1" my-20 @update:value="changeTab">
        <n-radio-button
          v-for="song in list"
          :key="song.value"
          :value="song.value"
          :label="song.label"
        />
      </n-radio-group>
      <div flex items-center>
        <n-button attr-type="button" type="primary" :disabled="userDisabled" @click="add">
          <template #icon>
            <TheIcon icon="addBtn" type="custom" :size="16" class="mr-2" />
          </template>
          新增
        </n-button>
        <n-button v-if="navValue === 'mapping'" type="primary" ml-20 @click="extendAll">
          展开所有
        </n-button>
        <n-button v-if="navValue === 'mapping'" type="primary" ml-20 @click="putAwayAll">
          收起所有
        </n-button>
      </div>
      <mate-table
        v-if="navValue === 'mapping'"
        ref="mateTableRef"
        :table-data="mappingTableData"
        :loading="loading"
        :pagination="false"
        @btn-click="btnClick"
      />
      <div v-if="navValue === 'mapping'" mt-20 flex flex-justify-end>
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
      <count-table
        v-if="navValue === 'calculate'"
        :table-data="calcTableData"
        :loading="loading"
        :pagination="pagination"
        @btn-click="btnClick"
      />
      <AddLogicModal
        v-if="logicModalShow"
        ref="addLogicRef"
        :m-module-list="mModuleList"
        @handle-confirm="handleConfirm"
        @handle-close="logicModalShow = false"
      />
      <AddContModal
        v-if="countModalShow"
        ref="addCountRef"
        :m-module-list="mModuleList"
        @handle-confirm="handleConfirm"
        @handle-close="countModalShow = false"
      />
    </div>
  </CommonPage>
</template>

<script setup>
import AppTitle from '@/components/common/AppTitle.vue'
import { nextTick, onActivated, onMounted, ref } from 'vue'
import MateTable from '../component/MateTable.vue'
import AddLogicModal from '../component/AddLogicModal.vue'
import AddContModal from '../component/AddCountModal.vue'
import CountTable from '../component/CountTable.vue'
import { getLogicalRuleList } from '~/src/api/config'
import { useRoute } from 'vue-router'
import useEnum from '~/src/hooks/useEnum'
import useHandle from '~/src/hooks/useHandle'
import { deleteConditionRule, getPlatformACModuleList } from '~/src/api/feature'
import { useBusinessStore } from '~/src/store'
import { statusList, USER_ROLE } from '@/views/data'
import useUserRole from '~/src/hooks/useUserRole'
const { queryCreateFReviewDoc, handleDelete, createChangePage } = useHandle()

const { queryMModuleList } = useEnum()
const route = useRoute()
const formValue = ref({ name: route.query.ruleName || '' })
const navValue = ref('mapping')
const addLogicRef = ref(null)
const addCountRef = ref(null)
const mateTableRef = ref(null)
const mModuleList = ref([])
const modalType = ref('add')
const editIndex = ref(0)
const aaa = 'display-order'
const logicModalShow = ref(false)
const countModalShow = ref(false)
const options = [
  { lable: '固化配置', value: 1 },
  { lable: '选装配置', value: 2 },
]
const pageSize = ref(50)
const page = ref(1) // 页码
const loading = ref(false)

const list = [
  { label: '匹配公式', value: 'mapping' },
  { label: '计算公式', value: 'calculate' },
]
const mappingTableData = ref([])
const calcTableData = ref([])
const add = () => {
  modalType.value = 'add'
  editIndex.value = 0
  if (navValue.value === 'mapping') {
    logicModalShow.value = true
    nextTick(() => {
      addLogicRef.value.show('add')
    })
  } else {
    countModalShow.value = true
    nextTick(() => {
      addCountRef.value.show('add')
    })
  }
}

const userDisabled = computed(() => useUserRole.value === USER_ROLE.CONFIGURATOR)

const handleConfirm = (row, type) => {
  modalType.value = type
  if (type === 'add') {
    if (navValue.value === 'mapping') {
      mappingTableData.value.unshift(row)
    } else {
      calcTableData.value.unshift(row)
    }
  } else {
    if (editIndex.value || editIndex.value === 0) {
      navValue.value === 'mapping'
        ? mappingTableData.value.splice(editIndex.value, 1, row)
        : calcTableData.value.splice(editIndex.value, 1, row)
    }
  }
}

const search = () => {
  page.value = 1
  fetchData()
}

const reset = () => {
  formValue.value = { name: '', model: null, number: '', status: null }
  page.value = 1
  fetchData()
}

const changeTab = (val) => {
  formValue.value = { name: '', model: null, number: '', status: null }
  navValue.value = val
  mappingTableData.value = []
  calcTableData.value = []
  pagination.value.page = 1
  page.value = 1
  fetchData()
}

const pagination = ref({
  pageCount: 0,
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

const btnClick = async ({ type, row, index }) => {
  switch (type) {
    /* 详情 */
    case 1:
      if (navValue.value === 'mapping') {
        logicModalShow.value = true
        nextTick(() => {
          addLogicRef.value.show('detail', row.oid)
        })
      } else {
        countModalShow.value = true
        nextTick(() => {
          addCountRef.value.show('detail', row.oid)
        })
      }
      break
    /* 修改 */
    case 2:
      modalType.value = 'edit'
      editIndex.value = index
      if (navValue.value === 'mapping') {
        logicModalShow.value = true
        nextTick(() => {
          addLogicRef.value.show('edit', row.oid)
        })
      } else {
        countModalShow.value = true
        nextTick(() => {
          addCountRef.value.show('edit', row.oid)
        })
      }
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

const fetchData = async () => {
  try {
    loading.value = true
    const res = await getLogicalRuleList({
      type: navValue.value,
      page: page.value,
      count: pageSize.value,
      oid: route.query.oid,
      ...formValue.value,
    })
    if (navValue.value === 'mapping') {
      mappingTableData.value = res.data || []
    } else {
      calcTableData.value = res.data || []
    }
    pagination.value.pageCount = Number(res.pages)
    pagination.value.pageSize = pageSize.value
    pagination.value.page = page.value
  } catch (error) {
    console.log('error:', error)
  } finally {
    loading.value = false
  }
}

/* 展开所有 */
const extendAll = () => {
  try {
    mateTableRef.value?.expandAll()
  } catch (e) {}
}
/* 收起 */
const putAwayAll = () => {
  try {
    mateTableRef.value?.putAwayAll()
  } catch (e) {}
}

const fetchMModuleList = async () => {
  const res = await getPlatformACModuleList({ oid: route.query.oid })
  mModuleList.value = res.data
}

onMounted(() => {
  fetchData()
  fetchMModuleList()
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
</style>
