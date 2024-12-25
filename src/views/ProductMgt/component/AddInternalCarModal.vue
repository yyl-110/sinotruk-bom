<template>
  <n-modal v-model:show="showModal" :mask-closable="false">
    <div w-1200 rounded-4 bg-white>
      <header h-40 flex items-center flex-justify-between px-20>
        <div flex items-center>
          <div class="line" mr-8></div>
          <span text-14 font-bold text-hex-1d289>
            {{
              modelType === 'edit'
                ? '编辑内部车型号'
                : modelType === 'new'
                ? '新建内部车型号'
                : '内部车型号详情'
            }}
          </span>
        </div>
        <img
          src="@/assets/images/close.png"
          alt=""
          class="h-16 w-16 cursor-pointer"
          @click="cancel"
        />
      </header>
      <main min-h-150 px-20 pr-80 pt-20>
        <n-spin :show="loading">
          <n-form
            ref="formRef"
            :model="formValue"
            :label-width="140"
            label-placement="left"
            require-mark-placement="left"
          >
            <n-grid :cols="24" :x-gap="24">
              <n-form-item-gi
                v-for="item in formArr"
                :key="item.id"
                :span="12"
                :label="item.name"
                :disabled="item.readonly === 'Y' || modelType === 'detail'"
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
                <n-select
                  v-if="item.action === 'select' || item.action === 'Fix'"
                  v-model:value="formValue[item.id]"
                  placeholder="请选择"
                  :options="item.enums"
                  label-field="value"
                  value-field="key"
                  :render-option="$renderTooltip"
                  filterable
                  :disabled="item.readonly === 'Y' || modelType === 'detail'"
                />
                <n-input
                  v-if="item.action === 'text'"
                  v-model:value="formValue[item.id]"
                  :type="item.id === 'remark' ? 'textarea' : 'text'"
                  placeholder="请输入"
                  :disabled="item.readonly === 'Y' || modelType === 'detail'"
                />
                <!-- <n-input-group v-if="item.action === 'Fix'">
                  <n-select
                    v-model:value="formValue[item.id]"
                    :options="[]"
                    disabled
                    multiple
                    h-32
                    placeholder="请选择"
                  />
                  <n-button type="primary" rounded-4 @click="choosePerson">选择</n-button>
                </n-input-group> -->
                <n-input-number
                  v-if="item.action === 'number'"
                  v-model:value="formValue[item.id]"
                  button-placement="both"
                  :min="0"
                  :disabled="item.readonly === 'Y' || modelType === 'detail'"
                />
              </n-form-item-gi>
            </n-grid>
          </n-form>
        </n-spin>
      </main>
      <footer v-if="modelType !== 'detail'" h-70 flex items-center flex-justify-end px-20>
        <n-button mr-20 @click="reset">重置</n-button>
        <n-button
          mr-20
          :loading="submitLoading && clickType === 'save'"
          @click="
            () => {
              clickType = 'save'
              save()
            }
          "
        >
          保存
        </n-button>
        <n-button
          type="primary"
          :loading="submitLoading && clickType === 'confirm'"
          @click="confirm"
        >
          确定
        </n-button>
      </footer>
    </div>
  </n-modal>
</template>

<script setup>
import { ref } from 'vue'
import _ from 'lodash'
import {
  createInternalVehicleModel,
  getInternalVehicleModelDetail,
  updateInternalVehicleModel,
} from '~/src/api/product'
const formValue = ref({})
const formRef = ref(null)
const modelType = ref('new')
const loading = ref(false)
const handleOid = ref('')
const parentOid = ref('')
const chooseTreeOid = ref('')
const submitLoading = ref(false)
const clickType = ref('save')
const saveState = ref(false) // 保存确定逻辑

const emits = defineEmits(['handleConfirm'])
const formArr = ref([])

const showModal = ref(false)
const cancel = () => {
  showModal.value = false
}
const confirm = () => {
  clickType.value = 'confirm'
  if (saveState.value) {
    showModal.value = false
    return
  }
  save(callback)
}

const reset = () => {
  formRef.value.restoreValidation()
  let obj = {}
  console.log('formArr.value:', formArr.value)
  formArr.value.forEach((item) => {
    obj[item.id] = ''
  })
  formValue.value = obj
}
/**
 * @param {*} type 弹框类型 new edit detail 新增 详情 编辑
 * @param {*} oid 点击表格行oid
 * @param {*} pOid 节点树点击的父节点oid
 * @param {*} chooseOid 节点树点击元素的oid
 */
const show = (type, oid, pOid, chooseOid) => {
  saveState.value = false
  handleOid.value = oid
  parentOid.value = pOid
  chooseTreeOid.value = chooseOid
  fetchDetail(type === 'new' ? chooseOid : oid)
  modelType.value = type
  showModal.value = true
}
const close = () => {
  showModal.value = false
}

const fetchDetail = async (oid) => {
  try {
    loading.value = true
    const res = await getInternalVehicleModelDetail({ oid })
    formArr.value = res.data
    const values = {}
    res.data.forEach((item) => {
      values[item.id] = item.value || null
    })
    formValue.value = values
  } catch (error) {
    console.log('error:', error)
  } finally {
    loading.value = false
  }
}

const callback = () => {
  showModal.value = false
}

const save = async (callback) => {
  formRef.value?.validate(async (errors) => {
    if (!errors) {
      try {
        const payload = {
          ...formValue.value,
          oid: modelType.value === 'new' ? chooseTreeOid.value : handleOid.value,
        }
        const apiUrl =
          modelType.value === 'new' ? createInternalVehicleModel : updateInternalVehicleModel
        submitLoading.value = true
        const res = await apiUrl(payload)
        console.log('res:', res)
        if (res.success) {
          saveState.value = true
          $message.success('保存成功')
          emits('handleConfirm', res.data, modelType.value)
          modelType.value = 'edit'
          handleOid.value = res.data?.oid
          if (callback) {
            callback()
          }
        }
      } catch (error) {
        console.log('error:', error)
      } finally {
        submitLoading.value = false
      }
    } else {
      console.log(errors)
    }
  })
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
