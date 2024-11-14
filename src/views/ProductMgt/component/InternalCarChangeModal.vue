<template>
  <n-modal v-model:show="showModal" :mask-closable="false">
    <div w-1200 rounded-4 bg-white>
      <header h-40 flex items-center flex-justify-between px-20>
        <div flex items-center>
          <div class="line" mr-8></div>
          <span text-14 font-bold text-hex-1d289>内部车型号更改选项</span>
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
            <template #arrow>
              <the-icon type="custom" icon="icon_form_fold" :size="16" color="#1D2129" />
            </template>
            <template #header-extra>
              <div h-full flex items-center pr-20>
                <the-icon
                  type="custom"
                  icon="toTop"
                  :size="16"
                  color="#1890ff"
                  class="toTop"
                  :class="[expandedState && 'extend']"
                />
              </div>
            </template>

            <n-collapse-item title="内部车型号选择" name="1">
              <n-space item-style="display: flex;">
                <n-checkbox-group v-model:value="checkboxValue" @update:value="select">
                  <n-checkbox value="0" label="全部" />
                  <n-checkbox value="1" label="ZZ3256V464HF1/RCPDM41-G-新载重" />
                  <n-checkbox value="2" label="ZZ3256V464HF1/RCPDM46-G-新载重" />
                  <n-checkbox value="3" label="ZZ3256V464HF1/RCPDM46-G-新超强" />
                  <n-checkbox value="4" label="ZZ3256V464HF1/RCPDM46-G-新超强" />
                  <n-checkbox value="5" label="ZZ3256V464HF1/CCPDM46-G-新超强" />
                </n-checkbox-group>
              </n-space>
            </n-collapse-item>
          </n-collapse>
        </div>
        <n-data-table
          :columns="columns"
          :data="data"
          :pagination="pagination"
          :bordered="false"
          mt-18
        />
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
const checkboxValue = ref(0)

const showModal = ref(false)
const expandedState = ref(true)

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
    title: '特征类别',
    key: 'title',
  },
  {
    title: '特征名称',
    key: 'length',
  },
  {
    title: 'Action',
    key: 'actions',
    render(row) {
      return h(NCheckbox)
    },
  },
]

const data = [
  { no: 3, title: 'Wonderwall', length: '4:18' },
  { no: 4, title: "Don't Look Back in Anger", length: '4:48' },
  { no: 12, title: 'Champagne Supernova', length: '7:27' },
]

const pagination = ref(false)

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
  if (aa?.value === '0') {
    if (aa?.actionType === 'check') {
      checkboxValue.value = ['0', '1', '2', '3', '4', '5']
    } else {
      checkboxValue.value = []
    }
  } else {
    if (aa.actionType === 'uncheck') {
      const arr = val.filter((item) => item !== '0')
      checkboxValue.value = arr
    } else {
      if (val.length === 5) {
        checkboxValue.value = ['0', '1', '2', '3', '4', '5']
      }
    }
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
  border-bottom: 1px solid #eaeaea;
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
