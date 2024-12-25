<template>
  <n-modal v-model:show="showModal" :mask-closable="false">
    <div w-500 rounded-4 bg-white>
      <header h-40 flex items-center flex-justify-between px-20>
        <div flex items-center>
          <div class="line" mr-8></div>
          <span text-14 font-bold text-hex-1d2129>
            {{ actionType === 'add' ? '新增' : '修改' }}{{ createTitle }}
          </span>
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
          require-mark-placement="left"
        >
          <n-form-item label="子节点名称" path="name" w-full>
            <n-input v-model:value="formValue.name" placeholder="请输入" />
          </n-form-item>
          <n-form-item v-if="actionType !== 'edit'" label="子节点类型" path="type" w-full>
            <n-select
              v-model:value="formValue.type"
              placeholder="请选择"
              filterable
              :options="options"
              :disabled="actionType === 'edit'"
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
import { computed, ref } from 'vue'
const formValue = ref({})
const formRef = ref(null)

const emits = defineEmits(['handleConfirm', 'handleEdit'])
const childType = ref('')
const rowData = ref({})
const actionType = ref('add')
const createTitle = ref('节点')

const rules = {
  name: {
    required: true,
    message: '请输入子节点名称',
    trigger: 'blur',
  },
  type: {
    required: true,
    message: '请选择子节点类型',
    trigger: 'blur',
  },
}

const options = computed(() =>
  childType.value.split(',').map((item) => ({ label: item, value: item }))
)

const showModal = ref(false)
const cancel = () => {
  rowData.value = {}
  showModal.value = false
  formValue.value = {}
}
const confirm = () => {
  formRef.value?.validate((errors) => {
    if (!errors) {
      if (actionType.value === 'add') {
        emits('handleConfirm', { ...formValue.value, oid: rowData.value.oid })
      } else {
        emits('handleEdit', { name: formValue.value.name, oid: rowData.value.oid })
      }
    } else {
      console.log(errors)
      // $message.error(errors)
    }
  })
}

const show = (type, item) => {
  formValue.value = {}
  rowData.value = item
  actionType.value = type
  if (type === 'edit') {
    formValue.value = { name: item.name }
  }
  childType.value = item.childType
  if (item.createTitle) {
    createTitle.value = item.createTitle
  }
  showModal.value = true
}

const close = () => {
  rowData.value = {}
  showModal.value = false
  formValue.value = {}
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
