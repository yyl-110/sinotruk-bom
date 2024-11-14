<template>
  <n-modal v-model:show="showModal" :mask-closable="false">
    <div w-500 rounded-4 bg-white>
      <header h-40 flex items-center flex-justify-between px-20>
        <div flex items-center>
          <div class="line" mr-8></div>
          <span text-14 font-bold text-hex-1d2129>复制内部车型号</span>
        </div>
        <img
          src="@/assets/images/close.png"
          alt=""
          class="h-16 w-16 cursor-pointer"
          @click="cancel"
        />
      </header>
      <main min-h-150 px-20 pr-120 pt-20>
        <n-form
          ref="formRef"
          :label-width="120"
          label-placement="left"
          :model="formValue"
          :rules="rules"
          :size="size"
          require-mark-placement="left"
        >
          <n-form-item label="内部车型号" path="name" w-full>
            <n-select
              v-model:value="formValue.name"
              placeholder="请选择"
              filterable
              :options="options"
            />
          </n-form-item>
        </n-form>
      </main>
      <footer h-70 flex items-center flex-justify-end px-20>
        <n-button mr-20 @click="cancel">取消</n-button>
        <n-button type="primary" @click="confirm">确定</n-button>
      </footer>
    </div>
  </n-modal>
</template>

<script setup>
import { ref } from 'vue'
const formValue = ref({ name: '' })
const formRef = ref(null)

const emits = defineEmits(['handleConfirm'])

const rules = {
  name: {
    required: true,
    message: '请输入子节点名称',
    trigger: 'blur',
  },
}

const options = []

const showModal = ref(false)
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

const show = () => {
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
