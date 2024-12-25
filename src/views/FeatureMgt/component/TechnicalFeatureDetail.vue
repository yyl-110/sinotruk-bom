<!--
 * @Author: yyl
 * @Date: 2024-02-27 11:19:25
 * @LastEditors: yyl
 * @LastEditTime: 2024-09-13 17:05:28
 * @Description: 定位特征详情
-->
<template>
  <div w-full>
    <n-spin :show="loading">
      <n-tabs type="line" animated :value="activeTab" @update:value="changeTab">
        <n-tab-pane name="1" :tab="navValue === 'common' ? '定位特征详情' : '特殊技术特征详情'">
          <div class="wrap">
            <n-form
              ref="formRef"
              :model="formValue"
              label-placement="left"
              require-mark-placement="left"
              label-width="100"
              :rules="rules"
              disabled
            >
              <n-form-item label="名称" path="name">
                <n-input v-model:value="formValue.name" placeholder="请输入" />
              </n-form-item>
              <n-form-item label="特征分类" path="classification">
                <n-input v-model:value="formValue.classification" placeholder="请输入" />
              </n-form-item>
              <n-form-item label="来源" path="source">
                <n-radio-group v-model:value="formValue.source" name="radiogroup1">
                  <n-space>
                    <n-radio v-for="item in comeList" :key="item.value" :value="item.value">
                      {{ item.label }}
                    </n-radio>
                  </n-space>
                </n-radio-group>
              </n-form-item>
              <n-form-item label="排序值">
                <n-input-number
                  v-model:value="formValue.sort"
                  :min="0"
                  max-w-120
                  button-placement="both"
                >
                  <template #minus-icon>
                    <the-icon icon="input_minus" size="14" type="custom" />
                  </template>
                  <template #add-icon>
                    <the-icon icon="input_add" size="14" type="custom" />
                  </template>
                </n-input-number>
                <div ml-20 text-12>值越小越靠前，支持小数点</div>
              </n-form-item>
              <n-form-item label="描述">
                <n-input
                  v-model:value="formValue.description"
                  type="textarea"
                  placeholder="请输入"
                  maxlength="150"
                  show-count
                />
              </n-form-item>
              <n-form-item label="附件">
                <n-button :disabled="!formValue.filePath" @click="download">下载附件</n-button>
                <div v-if="formValue.fileName" class="uploadWrap ml-12 flex items-center">
                  <span>{{ formValue?.fileName }}</span>
                </div>
              </n-form-item>
            </n-form>
          </div>
          <n-tabs type="line" animated mt-20>
            <n-tab-pane name="2" tab="特征值">
              <n-data-table
                :columns="columns"
                :data="data"
                :pagination="false"
                :bordered="false"
                :max-height="340"
                mt-18
              />
            </n-tab-pane>
          </n-tabs>
        </n-tab-pane>
        <n-tab-pane name="2" tab="特征逆查">
          <contrary-feature :oid="oid" />
        </n-tab-pane>
      </n-tabs>
    </n-spin>
  </div>
</template>

<script setup>
import SvgIcon from '@/components/icon/SvgIcon.vue'
import { computed, watch } from 'vue'
import ContraryFeature from './ContraryFeature.vue'

const emits = defineEmits(['handleChangeTab'])
const props = defineProps({
  selectData: {
    type: Object,
    default: () => {},
  },
  navValue: {
    type: String,
    default: '',
  },
  activeData: {
    type: String,
    default: '1',
  },
  selectOid: {
    type: String,
    default: '',
  },
  loading: {
    type: Boolean,
    default: false,
  },
})
const oid = computed(() => props.selectOid)
const formValue = ref({})
const formRef = ref(null)
const rules = {
  name: {
    required: true,
    message: '请输入名称',
    trigger: 'blur',
  },
}
const activeTab = ref(props.activeData)
const data = ref([])
const comeList = [
  { value: '订单', label: '订单' },
  { value: 'AC', label: 'AC模块' },
  { value: '逻辑工具', label: '逻辑工具' },
  { value: '无', label: '无' },
  { value: '逻辑工具或订单', label: '逻辑工具或订单' },
]

const columns = [
  {
    title: '排序',
    key: 'sort',
    sorter: (row1, row2) => row1.sort - row2.sort,
  },
  {
    title: '值',
    key: 'value',
  },
]
const add = () => {
  data.value.push({ feature: '', language: '' })
}
const deleteTable = (row, index) => {
  data.value.splice(index, 1)
}
const changeTab = (val) => {
  activeTab.value = val
  emits('handleChangeTab', val)
}
const download = () => {
  window.open(formValue.value.filePath)
}
watch(
  () => props.selectData,
  (val) => {
    data.value = val?.values
    formValue.value = {
      name: val?.name,
      sort: Number(val?.sort || 0),
      description: val?.description,
      source: val?.source,
      classification: val?.classification,
      fileName: val?.fileName,
      filePath: val?.filePath,
    }
  },
  { deep: true }
)
watch(
  () => props.activeData,
  (val) => {
    activeTab.value = val
  }
)
</script>

<style lang="scss" scoped>
.wrap {
  border-bottom: 1px solid #eaeaea;
}
.add {
  border-bottom: 1px solid #eeeeee;
}
</style>
