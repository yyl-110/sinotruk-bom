<template>
  <n-modal v-model:show="showModal" :mask-closable="false">
    <div w-1200 rounded-4 bg-white>
      <header h-40 flex items-center flex-justify-between px-20>
        <div flex items-center>
          <div class="line" mr-8></div>
          <span text-14 font-bold text-hex-1d2129>人员设置</span>
        </div>
        <img
          src="@/assets/images/close.png"
          alt=""
          class="h-16 w-16 cursor-pointer"
          @click="cancel"
        />
      </header>
      <main min-h-500 px-20 pt-20>
        <div class="form">
          <n-form
            ref="formRef"
            :label-width="120"
            label-placement="left"
            :model="formValue"
            inline
            require-mark-placement="left"
          >
            <n-form-item label="登录名称" path="userid">
              <n-input
                v-model:value="formValue.userid"
                placeholder="请输入"
                clearable
                @keydown.enter="search"
              />
            </n-form-item>
            <n-form-item label="全名" path="username">
              <n-input
                v-model:value="formValue.username"
                placeholder="请输入"
                clearable
                @keydown.enter="search"
              />
            </n-form-item>
            <n-form-item ml-auto>
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
            </n-form-item>
          </n-form>
        </div>
        <n-data-table
          v-model:checked-row-keys="checkedRowKeys"
          :columns="columns"
          :data="tableData"
          :pagination="false"
          :max-height="400"
          :min-heihgt="300"
          :row-key="rowKey"
          :loading="loading"
          mt-20
        />
      </main>
      <footer h-70 flex items-center flex-justify-end px-20>
        <n-button mr-20 @click="cancel">取消</n-button>
        <n-button type="primary" @click="confirm">确定</n-button>
      </footer>
    </div>
  </n-modal>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { getUserList } from '~/src/api/feature'
const formValue = ref({ username: '', userid: '' })
const formRef = ref(null)

const emits = defineEmits(['handleConfirm'])
const checkedRowKeys = ref([])
const rowKey = (row) => row.userid
const loading = ref(false)

const showModal = ref(false)

const tableData = ref([])

const columns = [
  {
    type: 'selection',
    multiple: false,
  },
  {
    title: '序号',
    key: 'no',
    align: 'center',
    width: 60,
    render(row, inx) {
      return inx + 1
    },
  },
  {
    title: '登录名称',
    key: 'userid',
  },
  {
    title: '全名',
    key: 'username',
  },
]

const fetchData = async () => {
  try {
    loading.value = true
    const res = await getUserList({ ...formValue.value })
    tableData.value = res.data.map((item, index) => ({ ...item, key: index }))
  } catch (error) {
    console.log('error:', error)
  } finally {
    loading.value = false
  }
}

const cancel = () => {
  showModal.value = false
}
const confirm = () => {
  if (!checkedRowKeys.value.length) {
    $message.info('请选择搜索结果')
    return
  }
  emits('handleConfirm', checkedRowKeys.value[0])
}

const search = () => {
  fetchData()
}

const reset = () => {
  formValue.value = { username: '', userid: '' }
}

const show = () => {
  fetchData()
  showModal.value = true
}
const close = () => {
  showModal.value = false
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
