<template>
  <n-modal v-model:show="showModal" :mask-closable="false" @after-leave="closeModel">
    <div w-900 rounded-4 bg-white>
      <header h-40 flex items-center flex-justify-between px-20>
        <div flex items-center>
          <div class="line" mr-8></div>
          <span text-14 font-bold text-hex-4E5969>配置号停用属性设置</span>
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
            :model="formValue"
            :label-width="130"
            label-placement="left"
            require-mark-placement="left"
            :rules="rules"
          >
            <n-grid :cols="24">
              <n-form-item-gi :span="12" label="审批单位" path="companyAuditOrg">
                <n-select
                  v-model:value="formValue.companyAuditOrg"
                  placeholder="请选择"
                  :options="options1"
                  label-field="value"
                  value-field="key"
                  :render-option="$renderTooltip"
                  filterable
                />
              </n-form-item-gi>
              <n-form-item-gi :span="24" label="申请原因" path="applyReason">
                <n-input
                  v-model:value="formValue.applyReason"
                  type="textarea"
                  placeholder="请输入"
                />
              </n-form-item-gi>
            </n-grid>
          </n-form>
        </div>
        <div class="mt-20">
          <div flex items-center>
            <div class="line" mr-8></div>
            <span text-14 font-bold text-hex-4E5969>推荐配置号设置</span>
          </div>
          <n-data-table
            :columns="columns"
            :data="tableData"
            :scroll-x="800"
            :max-height="400"
            mt-20
          />
        </div>
      </main>
      <footer h-70 flex items-center flex-justify-end px-20>
        <n-button mr-20 @click="cancel">取消</n-button>
        <n-button type="primary" @click="disableConfigCodeApply">确定</n-button>
      </footer>
    </div>
  </n-modal>
</template>

<script setup>
import { NSelect, NTooltip } from 'naive-ui'
import { computed, ref } from 'vue'
import {
  createDisableConfigCodeApply,
  getConfigCodeAuditOrgList,
  getEffConfigCodeList,
} from '~/src/api/config'
import { useAppStore } from '~/src/store'
const formValue = ref({ companyAuditOrg: null, applyReason: '' })
const formRef = ref(null)
const options1 = ref([])
const tableOptions = ref({})
const { changeLoading } = useAppStore()

const emits = defineEmits(['handleConfirm'])

const rules = {
  companyAuditOrg: {
    required: true,
    message: '请选择审批单位',
    trigger: ['input', 'blur'],
  },
  applyReason: {
    required: true,
    message: '请输入申请原因',
    trigger: ['input', 'blur'],
  },
}

const columns = ref([
  {
    title: '序号',
    key: 'no',
    align: 'center',
    width: 60,
    render(row, inx) {
      return inx + 1
    },
  },
  { title: '停用配置号', key: 'configCode', width: 200 },
  {
    title: '推荐配置号',
    key: 'reConfigCode',
    width: 200,
    render(row, index) {
      return h(NSelect, {
        value: row.reConfigCode,
        labelField: 'value',
        valueField: 'key',
        filterable: true,
        options: tableOptions.value[row?.internalVehicleModel],
        renderOption: ({ node, option }) =>
          h(NTooltip, null, {
            trigger: () => node,
            default: () => option.value,
          }),
        onUpdateValue(v) {
          tableData.value[index].reConfigCode = v
        },
      })
    },
  },
])

const getOptions = async () => {
  const data = tableData.value.map((item) => item.internalVehicleModel)
  const dedupeData = Array.from(new Set(data))
  let obj = {}
  for (const item of dedupeData) {
    const res = await getEffConfigCodeList({ internalVehicleModel: item })
    obj[item] = res.data
  }
  tableOptions.value = obj
}

const tableData = ref([])

const showModal = ref(false)
const cancel = () => {
  showModal.value = false
}
const confirm = () => {}

const show = (arr) => {
  tableData.value = arr
  getOptions()
  showModal.value = true
  fetchEnumData()
}
const close = () => {
  showModal.value = false
}

const fetchEnumData = async () => {
  const res = await getConfigCodeAuditOrgList({})
  options1.value = res.data
}

const closeModel = () => {
  formValue.value = {}
  tableOptions.value = {}
}

const disableConfigCodeApply = async () => {
  formRef.value?.validate(async (errors) => {
    if (!errors) {
      try {
        changeLoading(true)
        const payload = {
          ...formValue.value,
          data: tableData.value.map((item) => ({
            oid: item?.oid,
            reConfigCode: item?.reConfigCode || '',
          })),
        }
        const res = await createDisableConfigCodeApply(payload)
        if (res.success) {
          $message.success(res?.message || '停用成功')
          showModal.value = false
        }
      } catch (error) {
        console.log('error:', error)
      } finally {
        changeLoading(false)
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
.form {
  border-bottom: 1px solid #eaeaea;
  padding-right: 20px;
}
</style>
