<template>
  <n-modal v-model:show="showModal" :mask-closable="false">
    <div w-1200 rounded-4 bg-white>
      <header h-40 flex items-center flex-justify-between px-20>
        <div flex items-center>
          <div class="line" mr-8></div>
          <span text-14 font-bold text-hex-1d289>内部车型号批量审批</span>
        </div>
        <img
          src="@/assets/images/close.png"
          alt=""
          class="h-16 w-16 cursor-pointer"
          @click="cancel"
        />
      </header>
      <main min-h-400 px-20 pt-20>
        <div class="topWrap">
          <n-collapse :default-expanded-names="['1']" @update:expanded-names="changeCollapse">
            <n-collapse-item title="内部车型号选择" name="3">
              <template #header="{ collapsed }">
                <div w-full flex items-center justify-between>
                  <span>内部车型号选择</span>
                  <div h-full flex items-center pr-20>
                    <the-icon
                      type="custom"
                      icon="toTop"
                      :size="16"
                      color="#1890ff"
                      class="toTop"
                      :class="[collapsed && 'extend']"
                    />
                  </div>
                </div>
              </template>
              <n-space item-style="display: flex;" pl-10>
                <n-checkbox-group :value="checkboxValue" :max="10" @update:value="select">
                  <n-checkbox
                    v-for="item in checkBoxList"
                    :key="item.oid"
                    :value="item.oid"
                    :label="item.number"
                  />
                </n-checkbox-group>
              </n-space>
            </n-collapse-item>
          </n-collapse>
        </div>
      </main>
      <footer h-70 flex items-center flex-justify-end px-20>
        <n-button mr-20 @click="reset">重置</n-button>
        <n-button mr-20 @click="cancel">保存</n-button>
        <n-button type="primary" @click="confirm">确定</n-button>
      </footer>
    </div>
  </n-modal>
</template>

<script setup>
import { NButton, NCheckbox } from 'naive-ui'
import { ref } from 'vue'
const formValue = ref({})
const formRef = ref(null)

const emits = defineEmits(['handleConfirm'])
const checkboxValue = ref([])

const showModal = ref(false)
const expandedState = ref(true)
const checkBoxList = ref([])

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
const select = (val, aa) => {
  if (aa.value !== '0') {
    const arr = val.filter((item) => item !== '0')
    if (arr.length === checkBoxList.value.length - 1) {
      checkboxValue.value = checkBoxList.value.map((item) => item.oid)
    } else {
      checkboxValue.value = arr
    }
    return
  }
  /* 全选 */
  if (aa?.actionType === 'check') {
    checkboxValue.value = checkBoxList.value.map((item) => item.oid)
  } else {
    checkboxValue.value = []
  }
}

const reset = () => {
  formRef.value.restoreValidation()
}

const show = () => {
  showModal.value = true
}
const close = () => {
  showModal.value = false
}

const changeCollapse = (val) => {
  if (val.includes('1')) {
    expandedState.value = true
  } else {
    expandedState.value = false
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

::v-deep.n-collapse .n-collapse-item .n-collapse-item__header {
  height: 48px;
  background: rgba(24, 144, 255, 0.1);
  border-radius: 4px 4px 0px 0px;
  padding-left: 20px;
}
.topWrap {
  padding-bottom: 20px;
}

::v-deep.n-checkbox .n-checkbox__label {
  --n-text-color: #4e5969;
  font-size: 14px;
}

.toTop {
  transform: rotate(0);
  transition: all 0.3s ease-in-out;
  &.extend {
    transform: rotate(180deg);
  }
}
</style>
