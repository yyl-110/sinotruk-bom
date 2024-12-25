<template>
  <n-modal v-model:show="showModal" :mask-closable="false" @after-leave="closeModel">
    <div w-900 rounded-4 bg-white>
      <header h-40 flex items-center flex-justify-between px-20>
        <div flex items-center>
          <div class="line" mr-8></div>
          <span text-14 font-bold text-hex-1d2129>
            {{
              modelType === 'edit'
                ? '编辑车型子类'
                : modelType === 'new'
                ? '新建车型子类'
                : '车型子类详情'
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
      <main min-h-350 px-20 pr-120 pt-20>
        <n-spin :show="loading">
          <n-form
            ref="formRef"
            :model="formValue"
            :label-width="120"
            inline
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
                  type: item.action === 'number' ? 'number' : item.action === 'Fix' ? 'array' : '',
                }"
              >
                <n-select
                  v-if="item.action === 'select'"
                  v-model:value="formValue[item.id]"
                  :render-option="$renderTooltip"
                  placeholder="请选择"
                  :options="item.id === 'duplicate' ? copyEnum : item.enums"
                  label-field="value"
                  value-field="key"
                  filterable
                  :disabled="modelType === 'detail' || item.readonly === 'Y'"
                  :loading="item.id === 'duplicate' ? copyEnumLoading : false"
                  @update:show="(state) => showSelect(state, item.id)"
                />
                <n-input
                  v-if="item.action === 'text'"
                  v-model:value="formValue[item.id]"
                  placeholder="请输入"
                  :disabled="item.readonly === 'Y' || modelType === 'detail'"
                />
                <n-input-group v-if="item.action === 'Fix'">
                  <n-select
                    v-model:value="formValue[item.id]"
                    :options="peopleOptions"
                    label-field="username"
                    value-field="userid"
                    disabled
                    multiple
                    placeholder="请选择"
                  />
                  <!-- <n-input v-model:value="formValue[item.id]" disabled placeholder="请选择" h-32 /> -->
                  <n-button type="primary" rounded-4 @click="choosePerson(item.id)">选择</n-button>
                </n-input-group>
                <n-input-number
                  v-if="item.action === 'number'"
                  v-model:value="formValue[item.id]"
                  button-placement="both"
                  :min="0"
                  :disabled="item.readonly === 'Y' || modelType === 'detail'"
                />
              </n-form-item-gi>

              <!-- <n-form-item-gi :span="12" label="复制车型子类">
              <n-input-group>
                <n-input v-model:value="formValue.duplicate" placeholder="请选择" disabled h-32 />
                <n-button type="primary" rounded-4>选择</n-button>
              </n-input-group>
            </n-form-item-gi>
            <n-form-item-gi :span="12" label="负责人" path="owner">
              <n-input-group>
                <n-select
                  v-model:value="formValue.owner"
                  :options="[]"
                  disabled
                  multiple
                  h-32
                  placeholder="请选择"
                />
                <n-button type="primary" rounded-4 @click="choosePerson">选择</n-button>
              </n-input-group>
            </n-form-item-gi> -->
            </n-grid>
          </n-form>
        </n-spin>
      </main>
      <footer v-if="modelType !== 'detail'" h-70 flex items-center flex-justify-end px-20>
        <n-button mr-20 @click="reset">重置</n-button>
        <n-button mr-20 @click="() => save()">保存</n-button>
        <n-button type="primary" @click="confirm">确定</n-button>
      </footer>
      <people-setting-modal ref="peopleRef" @handle-confirm="choosePersonResult" />
    </div>
  </n-modal>
</template>

<script setup>
import { ref } from 'vue'
import PeopleSettingModal from '@/components/common/PeopleSettingModal.vue'
import { createVehicleType, getVehicleTypeDetail, updateVehicleType } from '~/src/api/product'
import { getCouldCopyVehicleType } from '~/src/api/config'
import { isArray } from 'lodash-es'
const formValue = ref({ configVehicle: null })
const copyEnum = ref([])
const formRef = ref(null)
const peopleRef = ref(null)
const formArr = ref([])
const loading = ref(false)
const selectOid = ref('')
const choosePersonKey = ref('responsiblePerson')
const saveState = ref(false)
const peopleOptions = ref([])
const copyEnumLoading = ref(false)

const emits = defineEmits(['handleConfirm'])
const modelType = ref('new')

// const selectDisabled = computed(() => (item) => {
//   if (item.id === 'duplicate' && formValue.value?.configVehicle === '常规车型') {
//     return true
//   }
//   if (item.id === 'duplicate' && formValue.value?.configVehicle === '特殊车型') {
//     return false
//   }
//   return modelType.value === 'detail' || item.readonly === 'Y'
// })

const choosePerson = (key) => {
  choosePersonKey.value = key
  /* 参与成员 */
  if (key === 'participantPerson') {
    peopleRef.value.show(1, key)
    return
  }
  peopleRef.value.show()
}

const choosePersonResult = (list) => {
  const arr = list.map((item) => item.userid)
  peopleOptions.value = list
  formValue.value[choosePersonKey.value] = arr
}

const showModal = ref(false)
const save = (callbackFunction = null) => {
  let formObj = {}
  try {
    for (const key in formValue.value) {
      if (isArray(formValue.value[key])) {
        formObj[key] = formValue.value[key].join(',')
      } else {
        formObj[key] = formValue.value[key]
      }
    }
  } catch (error) {
    formObj = { ...formValue.value }
  }
  console.log('formRef.value:', formRef.value, formValue.value)
  formRef.value?.validate(async (errors) => {
    if (!errors) {
      const payload = { ...formObj, oid: selectOid.value }
      const apiUrl = modelType.value === 'new' ? createVehicleType : updateVehicleType
      const res = await apiUrl(payload)
      if (res.success) {
        $message.success('保存成功')
        saveState.value = true
        emits('handleConfirm', res.data)
        if (callbackFunction) {
          callbackFunction()
        }
      }
    } else {
      console.log(errors)
      $message.error('验证失败')
    }
  })
}
const cancel = () => {
  showModal.value = false
}
const callback = () => {
  showModal.value = false
}
const confirm = () => {
  if (saveState.value) {
    showModal.value = false
    return
  }
  save(callback)
}

const reset = () => {
  formRef.value.restoreValidation()
}

const show = (type = 'edit', oid) => {
  saveState.value = false
  selectOid.value = oid
  modelType.value = type
  fetchDetail(oid)
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
  try {
    loading.value = true
    const res = await getVehicleTypeDetail({ oid })
    formArr.value = res.data
    const values = {}
    res.data.forEach((item) => {
      if (item.action === 'Fix' && item.value) {
        if (item.id === 'participantPerson') {
          item.value = item.value.split(',').filter((val) => val)
        } else {
          item.value = [item.value]
        }
      }
      values[item.id] = item.value || null
    })
    formValue.value = values
  } catch (error) {
    console.log('error:', error)
  } finally {
    loading.value = false
  }
}
const fetchCopyEnum = async (oid) => {
  try {
    copyEnumLoading.value = true
    const res = await getCouldCopyVehicleType({ oid, ...formValue.value })
    if (res.success) {
      copyEnum.value = res.data
    }
  } catch (error) {
    console.log('error:', error)
  } finally {
    copyEnumLoading.value = false
  }
}

const showSelect = (state, type) => {
  if (state && type === 'duplicate') {
    fetchCopyEnum(selectOid.value)
  }
}

const closeModel = () => {
  formValue.value = { configVehicle: null }
}
watch(
  () => formValue.value['configVehicle'],
  () => {
    formValue.value['duplicate'] = ''
  }
)
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
