<template>
  <CommonPage back="mgt">
    <template #header>
      <app-title text="特征管理" important-h-48 />
    </template>
    <div h-full w-full px-20>
      <!-- <app-title text="可选AC模块" /> -->
      <div class="form" pt-24>
        <n-form
          ref="formRef"
          :model="formValue"
          label-placement="left"
          require-mark-placement="left"
          inline
          important-w-full
        >
          <n-grid :cols="24" :x-gap="24">
            <n-form-item-gi :span="6" label="规则名">
              <n-input
                v-model:value="formValue.name"
                placeholder="请输入"
                @keydown.enter="search"
              />
            </n-form-item-gi>
            <n-form-item-gi :span="6" label="编号">
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

            <n-form-item-gi :span="24">
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
      <ac-table
        :table-data="acTableData"
        :loading="loading"
        :pagination="false"
        @btn-click="btnClick"
      />
      <div mt-20 flex flex-justify-end>
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
    </div>
    <add-ac-modal
      v-if="acModalShow"
      ref="addAcRef"
      @handle-confirm="handleConfirm"
      @handle-close="acModalShow = false"
    />
  </CommonPage>
</template>

<script setup>
import { nextTick, onActivated, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { deleteConditionRule, getACModuleExcludeRuleList } from '~/src/api/feature'
import AddAcModal from '../component/AddAcModal.vue'
import AcTable from '../component/AcTable.vue'
import useHandle from '~/src/hooks/useHandle'
const { queryCreateFReviewDoc, handleDelete, createChangePage } = useHandle()
import { statusList, USER_ROLE } from '@/views/data'
import useUserRole from '~/src/hooks/useUserRole'

const route = useRoute()
defineOptions({ name: 'OptionalAc' })

const aaa = 'display-order'
const formRef = ref(null)
const addAcRef = ref(null)
const formValue = ref({ name: '', number: '', status: null })
const acTableData = ref([])
const modalType = ref('add')
const editIndex = ref(0)
const acModalShow = ref(false)

const pageSize = ref(50)
const page = ref(1) // 页码
const loading = ref(false)

const userDisabled = computed(() => useUserRole.value === USER_ROLE.CONFIGURATOR)

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

const search = () => {
  page.value = 1
  fetchData()
}
const reset = () => {
  formValue.value = { name: '', number: '', status: null }
  page.value = 1
  fetchData()
}
const add = () => {
  modalType.value = 'add'
  editIndex.value = 0
  acModalShow.value = true
  nextTick(() => {
    addAcRef.value.show('add', '')
  })
}

const handleConfirm = (row, type) => {
  modalType.value = type
  if (modalType.value === 'add') {
    acTableData.value.unshift(row)
  } else {
    if (editIndex.value || editIndex.value === 0) acTableData.value.splice(editIndex.value, 1, row)
  }
}

const btnClick = async ({ type, row, index }) => {
  switch (type) {
    /* 详情 */
    case 1:
      modalType.value = 'detail'
      acModalShow.value = true
      nextTick(() => {
        addAcRef.value.show('detail', row.oid)
      })
      break
    /* 修改 */
    case 2:
      modalType.value = 'edit'
      editIndex.value = index
      acModalShow.value = true
      nextTick(() => {
        addAcRef.value.show('edit', row.oid)
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

const fetchData = async () => {
  try {
    const { name = '', number = '' } = formValue.value
    loading.value = true
    const res = await getACModuleExcludeRuleList({
      page: page.value,
      count: pageSize.value,
      oid: route.query.oid,
      ...formValue.value,
      name: name.trim(),
      number: number.trim(),
    })
    acTableData.value = res.data || []
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
