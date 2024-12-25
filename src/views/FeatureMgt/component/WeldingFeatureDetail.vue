<template>
  <div w-full>
    <n-spin :show="loading">
      <n-tabs type="line" animated>
        <n-tab-pane name="1" :tab="navValue === 'fixed' ? '固化特征详情' : '选装特征详情'">
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
              <n-form-item label="排序值">
                <n-input-number v-model:value="formValue.sort" :min="0" button-placement="both">
                  <template #minus-icon>
                    <the-icon icon="input_minus" size="14" type="custom" />
                  </template>
                  <template #add-icon>
                    <the-icon icon="input_add" size="14" type="custom" />
                  </template>
                </n-input-number>
              </n-form-item>
              <n-form-item label="备注说明">
                <n-input
                  v-model:value="formValue.description"
                  type="textarea"
                  placeholder="请输入"
                  maxlength="150"
                  show-count
                />
              </n-form-item>
            </n-form>
          </div>
        </n-tab-pane>
      </n-tabs>
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
    </n-spin>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  selectData: {
    type: Object,
    default: () => {},
  },
  navValue: {
    type: String,
    default: '',
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

const formRef = ref(null)
const formValue = ref({})
const rules = {
  name: {
    required: true,
    message: '请输入名称',
    trigger: 'blur',
  },
}

const data = ref([])

const columns = [
  {
    title: '序号',
    key: 'no',
    width: 60,
    align: 'center',
    render(row, inx) {
      return inx + 1
    },
  },
  {
    title: '排序',
    key: 'sort',
    align: 'center',
    sorter: (row1, row2) => row1.sort - row2.sort,
    width: 80,
  },
  {
    title: '特征值',
    key: 'value',
    minWidth: 180,
  },
  {
    title: '销售语言',
    key: 'saleDesc',
    width: 80,
  },
]

watch(
  () => props.selectData,
  (val) => {
    data.value = val?.values
    formValue.value = {
      name: val?.name,
      sort: Number(val?.sort || 0),
      description: val?.description,
    }
  },
  { deep: true }
)
</script>

<style lang="scss" scoped>
.wrap {
  border-bottom: 1px solid #eaeaea;
}
</style>
