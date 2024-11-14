<template>
  <n-modal v-model:show="showModal" :mask-closable="false" @after-leave="handleClose">
    <div w-500 rounded-4 bg-white>
      <header h-40 flex items-center flex-justify-between px-20>
        <div flex items-center>
          <div class="line" mr-8></div>
          <span text-14 font-bold text-hex-1d2129>
            复制内部车型号{{ targetName ? '-' : '' }}{{ targetName }}
          </span>
        </div>
        <img
          src="@/assets/images/close.png"
          alt=""
          class="h-16 w-16 cursor-pointer"
          @click="cancel"
        />
      </header>
      <main min-h-250 px-20 pt-20>
        <div class="form" flex items-center pb-20 pr-50>
          <span ml-20 flex-shrink-0 text-hex-4e5969>内部车型号：</span>
          <n-select
            v-model:value="searchData"
            :options="options"
            placeholder="请选择内部车型号"
            label-field="number"
            value-field="oid"
            filterable
          />
        </div>
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
import _ from 'lodash'
const formValue = ref({})
const formRef = ref(null)
const carName = ref('')

const emits = defineEmits(['handleConfirm'])

const checkboxValue = ref(0)
const searchData = ref(null)
const options = ref([])
const targetName = computed(
  () => options.value.find((item) => item.oid === searchData.value)?.number
)

const showModal = ref(false)
const cancel = () => {
  showModal.value = false
}
const confirm = () => {
  if (!searchData.value) {
    $message.warning('请选择要复制的内部车型号')
    return
  }
  emits('handleConfirm', searchData.value)
  $message.success('复制成功')
  showModal.value = false
}

const show = (name, carList) => {
  let list = _.cloneDeep(carList)
  list.shift()
  showModal.value = true
  carName.value = name
  options.value = list.map((item) => ({ ...item, disabled: name === item.number }))
}

const close = () => {
  showModal.value = false
}

const handleClose = () => {
  searchData.value = null
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
::v-deep.n-checkbox .n-checkbox__label {
  --n-text-color: #4e5969;
  font-size: 14px;
}

::v-deep.n-checkbox.n-checkbox--show-label {
  margin-top: 20px;
}

.form {
  // border-bottom: 1px solid #eaeaea;
}

::v-deep.n-collapse .n-collapse-item .n-collapse-item__header {
  height: 48px;
  background: rgba(24, 144, 255, 0.1);
  border-radius: 4px 4px 0px 0px;
  padding-left: 20px;
  padding-top: 0;
}

::v-deep.n-collapse
  .n-collapse-item
  .n-collapse-item__content-wrapper
  .n-collapse-item__content-inner {
  padding-top: 0 !important;
}
</style>
