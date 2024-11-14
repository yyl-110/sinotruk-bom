<template>
  <n-modal v-model:show="showModal" :mask-closable="false" @after-leave="closeModel">
    <div w-1200 rounded-4 bg-white>
      <header h-40 flex items-center flex-justify-between px-20>
        <div flex items-center>
          <div class="line" mr-8></div>
          <span text-14 font-bold text-hex-1d2129>现有添加</span>
        </div>
        <img
          src="@/assets/images/close.png"
          alt=""
          class="h-16 w-16 cursor-pointer"
          @click="cancel"
        />
      </header>
      <main min-h-500 px-20 pt-20>
        <div class="form" h-60 w-full flex items-center>
          <n-form
            ref="formRef"
            :label-width="60"
            :model="formValue"
            label-placement="left"
            require-mark-placement="left"
            inline
            w-full
          >
            <n-form-item label="编码">
              <n-input
                v-model:value="formValue.number"
                placeholder="输入编码"
                @keydown.enter="search"
              />
            </n-form-item>
            <n-form-item label="名称">
              <n-input
                v-model:value="formValue.name"
                placeholder="输入名称"
                @keydown.enter="search"
              />
            </n-form-item>
            <n-form-item ml-auto>
              <n-button type="primary" ml-auto @click="search">
                <template #icon>
                  <img src="@/assets/images/search_white.png" alt="" class="h-14 w-14" />
                </template>
                搜索
              </n-button>
            </n-form-item>
          </n-form>
        </div>
        <n-data-table
          v-model:checked-row-keys="checkedRowKeys"
          remote
          :columns="columns"
          :data="tableData"
          :pagination="pagination"
          :row-key="rowKey"
          :loading="loading"
          :max-height="400"
          mt-20
        />
      </main>
      <footer h-70 flex items-center flex-justify-end px-20>
        <n-button mr-20 @click="reset">重置</n-button>
        <!-- <n-button mr-20 @click="cancel">保存</n-button> -->
        <n-button type="primary" @click="confirm">确定</n-button>
      </footer>
    </div>
  </n-modal>
</template>

<script setup>
import { ref } from 'vue'
import { getACModelACPart, insertACPart } from '~/src/api/config'
const formValue = ref({})
const formRef = ref(null)

const emits = defineEmits(['handleConfirm'])
const showModal = ref(false)
const checkedRowKeys = ref([])
const acOid = ref('')
const loading = ref(false)

const rowKey = (row) => row.oid

const pageSize = ref(20)
const page = ref(1)
const tableData = ref([])
const pagination = ref({
  pageCount: 0,
  showSizePicker: true,
  showQuickJumper: true,
  page: page.value,
  itemCount: 0,
  pageSizes: [20, 50, 100],
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
    type: 'selection',
    multiple: false,
  },
  {
    title: '序号',
    key: 'no',
    align: 'center',
    render(row, inx) {
      return inx + 1
    },
  },
  {
    title: '编码',
    key: 'number',
  },
  {
    title: '名称',
    key: 'name',
  },
]
const cancel = () => {
  showModal.value = false
}
const confirm = async () => {
  if (checkedRowKeys.value.length === 0) {
    $message.warning('请选择搜索结果')
    return
  }
  const res = await insertACPart({ parentOid: checkedRowKeys.value[0], oid: acOid.value })
  if (res.success) {
    $message.success('添加成功')
    showModal.value = false
    formValue.value = {}
  }
}

const reset = () => {
  formRef.value.restoreValidation()
}

const show = (oid) => {
  acOid.value = oid
  // fetchData()
  showModal.value = true
}
const close = () => {
  showModal.value = false
}
const search = () => {
  fetchData()
}
const closeModel = () => {
  formValue.value = {}
  tableData.value = []
}

const fetchData = async () => {
  try {
    loading.value = true
    const res = await getACModelACPart({
      oid: acOid.value,
      ...formValue.value,
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

defineExpose({
  show,
  close,
})
</script>

<style lang="scss" scoped>
footer {
  border-top: 1px solid #f2f3f5;
}
.line {
  width: 4px;
  height: 18px;
  background: #1890ff;
}
header {
  background: rgba(165, 180, 203, 0.1);
}
.form {
  border-bottom: 1px solid #eaeaea;
}
</style>
