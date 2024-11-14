<template>
  <n-modal v-model:show="showModal" :mask-closable="false">
    <div w-900 rounded-4 bg-white>
      <header h-40 flex items-center flex-justify-between px-20>
        <div flex items-center>
          <div class="line" mr-8></div>
          <span text-14 font-bold text-hex-1d2129>配置号属性设置 {{ title }}</span>
        </div>
        <img
          src="@/assets/images/close.png"
          alt=""
          class="h-16 w-16 cursor-pointer"
          @click="cancel"
        />
      </header>
      <main min-h-500 px-20 pt-20>
        <n-form
          ref="formRef"
          :model="formValue"
          :label-width="130"
          label-placement="left"
          require-mark-placement="left"
        >
          <n-grid :cols="24" :x-gap="30">
            <n-form-item-gi
              v-for="(item, index) in formData"
              :key="item.id"
              :span="12"
              :label="item.name"
              :path="item.required === 'Y' ? item.id : ''"
              :rule="{
                required: item.required === 'Y',
                message: `${
                  item.action === 'text' || item.action === 'number' ? '请输入' : '请选择'
                }${item.name}`,
                trigger: ['input', 'blur'],
                type: item.action === 'number' ? 'number' : '',
              }"
            >
              <n-input
                v-if="item.action === 'text'"
                v-model:value="formValue[item.id]"
                :placeholder="getPlaceholder(item)"
                :disabled="item.readonly === 'Y'"
              />
              <n-select
                v-if="item.action === 'select'"
                v-model:value="formValue[item.id]"
                placeholder="请选择"
                :options="item.enums"
                label-field="value"
                value-field="key"
                filterable
                :render-option="$renderTooltip"
                :disabled="item.readonly === 'Y'"
              />
              <n-input-number
                v-if="item.action === 'number'"
                v-model:value="formValue[item.id]"
                button-placement="both"
                :min="0"
                :disabled="item.readonly === 'Y'"
              >
                <template #minus-icon>
                  <the-icon icon="input_minus" size="14" type="custom" />
                </template>
                <template #add-icon>
                  <the-icon icon="input_add" size="14" type="custom" />
                </template>
              </n-input-number>
            </n-form-item-gi>
          </n-grid>
        </n-form>
      </main>
      <footer h-70 flex items-center flex-justify-end px-20>
        <n-button mr-20 @click="reset">重置</n-button>
        <n-button mr-20 @click="save">保存</n-button>
        <n-button type="primary" @click="confirm">确定</n-button>
      </footer>
    </div>
  </n-modal>
</template>

<script setup>
import { ref } from 'vue'
import { getConfigCodeAttributesInfo, updateConfigCodeAttributes } from '~/src/api/config'
import { getVehicleTypeDetail } from '~/src/api/product'
const formValue = ref({})
const formRef = ref(null)
const peopleRef = ref(null)
const selectOid = ref('')

const emits = defineEmits(['handleConfirm'])
const modelType = ref('new')
const title = ref('')
const formData = ref([])
const saveState = ref(false)

const showModal = ref(false)
const cancel = () => {
  showModal.value = false
}
const save = (type = 'save') => {
  formRef.value?.validate(async (errors) => {
    if (!errors) {
      formData.value = formData.value.map((item) => ({ ...item, value: formValue.value[item.id] }))
      let obj = { oid: selectOid.value }
      formData.value.forEach((item) => {
        obj[item.id] = item.value
      })
      const res = await updateConfigCodeAttributes(obj)
      if (res.success) {
        $message.success('设置成功')
        saveState.value = true
        emits('handleConfirm')
        if (type === 'confirm') {
          close()
        }
      }
    } else {
      console.log(errors)
    }
  })
}
const getPlaceholder = (val) => {
  //特殊处理的字段
  const sp = ['area', 'sceneName', 'marketName', 'wheelbase']
  if (sp.includes(val.id)) {
    return '在型谱策划固化配置区域添加该配置特征'
  } else {
    return '请输入'
  }
}
const confirm = () => {
  if (saveState.value) {
    showModal.value = false
    return
  }
  save('confirm')
}

const reset = () => {
  formRef.value.restoreValidation()
}

const show = (oid, row) => {
  saveState.value = false
  console.log('row:', row)
  selectOid.value = oid
  fetchData(oid)
  title.value = row.number
  // modelType.value = type
  // if (type !== 'new') {
  //   fetchDetail(oid)
  // }
  showModal.value = true
}
const close = () => {
  showModal.value = false
}

defineExpose({
  show,
  close,
})
const fetchDetail = async (oid) => {
  const res = await getVehicleTypeDetail({ oid })
  const data = res.data
  formValue.value = {
    ...data,
  }
}

const updateData = async () => {
  let obj = { oid: selectOid.value }
  formData.value.forEach((item) => {
    obj[item.id] = item.value
  })
  const res = await updateConfigCodeAttributes(obj)
  if (res.success) {
    $message.success('设置成功')
    close()
  }
}

const fetchData = async (oid) => {
  const res = await getConfigCodeAttributesInfo({ oid })
  res.data.forEach((item) => {
    formValue.value[item.id] = item.value
  })
  console.log('formValue.value:', formValue.value)
  formData.value = res.data
}
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
