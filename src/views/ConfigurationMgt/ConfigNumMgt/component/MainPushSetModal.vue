<template>
  <n-modal v-model:show="showModal" :mask-closable="false">
    <div w-1200 rounded-4 bg-white>
      <header h-40 flex items-center flex-justify-between px-20>
        <div flex items-center>
          <div class="line" mr-8></div>
          <span text-14 font-bold text-hex-1d2129>主推设置</span>
        </div>
        <img
          src="@/assets/images/close.png"
          alt=""
          class="h-16 w-16 cursor-pointer"
          @click="cancel"
        />
      </header>
      <main min-h-600 px-20 pt-20>
        <div class="form" h-60 w-full flex items-center bb-1>
          <n-form
            ref="formRef"
            :label-width="120"
            :model="formValue"
            label-placement="left"
            require-mark-placement="left"
            inline
            w-full
          >
            <n-form-item label="编码" flex-1>
              <n-input v-model:value="formValue.number" placeholder="输入编码" />
            </n-form-item>
            <n-form-item label="名称" flex-1>
              <n-input v-model:value="formValue.name" placeholder="输入名称" />
            </n-form-item>
            <n-form-item flex-1>
              <n-button type="primary" ml-auto @click="search">
                <template #icon>
                  <img src="@/assets/images/search_white.png" alt="" class="h-14 w-14" />
                </template>
                搜索
              </n-button>
            </n-form-item>
          </n-form>
        </div>
        <n-data-table :columns="columns" :data="tableData" :pagination="false" />
      </main>
      <footer h-70 flex items-center flex-justify-end px-20>
        <n-button mr-20 @click="cancel">取消</n-button>
        <n-button type="primary" @click="confirm">确定</n-button>
      </footer>
    </div>
  </n-modal>
</template>

<script setup>
import { NButton, NIcon } from 'naive-ui'
import { ref } from 'vue'

const formValue = ref({})
const formRef = ref(null)

const emits = defineEmits(['handleConfirm'])
const showModal = ref(false)
const page = ref(1)

const paginations = ['size-picker', 'pages', 'quick-jumper']

const columns = [
  { type: 'selection' },
  {
    title: '序号',
    key: 'no',
    width: 60,
    align: 'center',
    render(row, inx) {
      return inx + 1
    },
  },
  {
    title: '编号',
    key: 'type',
  },
  {
    title: '名称',
    key: 'name',
  },
]
const tableData = ref([{ type: 123, name: '3232', description: '特征【油箱容积]的值[860L+240L' }])
const cancel = () => {
  showModal.value = false
}
const confirm = () => {
  formRef.value?.validate((errors) => {
    if (!errors) {
      emits('handleConfirm', formValue.value)
    } else {
      console.log(errors)
      $message.error(errors)
    }
  })
}

const reset = () => {
  formRef.value.restoreValidation()
}

const show = (type) => {
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
</style>
