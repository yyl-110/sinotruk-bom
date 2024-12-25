<template>
  <div w-full>
    <div class="flex" mt-8 items-center>
      <n-button type="primary" mr-20>
        <template #icon>
          <the-icon type="custom" icon="addBtn" color="#fff" size="16" />
        </template>
        新增
      </n-button>
      <n-button>
        <template #icon>
          <the-icon type="custom" icon="delete" size="20" />
        </template>
        删除
      </n-button>
    </div>
    <div mt-32 w-full class="wrap" px-20>
      <div class="item" flex items-center>
        <span flex-shrink-0 text-hex-1d2129>特征列表：</span>
        <n-select
          v-model:value="formValue.featureList"
          :options="options"
          filterable
          multiple
          h-32
          min-w-400
          w-auto
        />
      </div>
      <div class="item" flex items-center>
        <span text-hex-1D2129>特征分割：</span>
        <div flex items-center text-hex-4E5969>
          细分市场
          <n-checkbox-group v-model:value="formValue.feature" ml-20>
            <n-space item-style="display: flex;">
              <n-checkbox value="1" label="变速箱" />
              <n-checkbox value="2" label="四方位摄像头" />
            </n-space>
          </n-checkbox-group>
        </div>
      </div>
      <div class="item" flex>
        <span flex-shrink-0 text-hex-1d2129>特征集合：</span>
        <n-data-table
          :columns="columns"
          :data="tableData"
          :pagination="pagination"
          :bordered="false"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { NButton, NIcon, NSelect } from 'naive-ui'
import SvgIcon from '@/components/icon/SvgIcon.vue'

const options = ['groode', 'veli good', 'emazing', 'lidiculous'].map((v) => ({
  label: v,
  value: v,
}))
const pagination = false
const tableData = ref([{ type: 1, name: 12, value: 2324 }])
const columns = [
  {
    title: '细分市场',
    key: 'type',
    render(row, index) {
      return h(NSelect, {
        multiple: true,
        options,
        value: row.type,
        filterable: true,
        onUpdateValue(v) {
          tableData.value[index].type = v
        },
      })
    },
  },
  {
    title: '变速箱',
    key: 'name',
    render(row, index) {
      return h(NSelect, {
        multiple: true,
        options,
        value: row.name,
        filterable: true,
        onUpdateValue(v) {
          tableData.value[index].name = v
        },
      })
    },
  },
  {
    title: '四方位摄像头',
    key: 'value',
    render(row, index) {
      return h(NSelect, {
        multiple: true,
        options,
        value: row.value,
        filterable: true,
        onUpdateValue(v) {
          tableData.value[index].value = v
        },
      })
    },
  },
  {
    key: 'action',
    title: '操作',
    render(row, index) {
      return h(
        'div',
        {
          class: 'flex items-center',
        },
        [
          h(
            NButton,
            {
              size: 'tiny',
              class: 'rounded-10 w-30 mr-10 h-30',
              onclick: add,
            },
            h(
              NIcon,
              { size: 16, color: '#1890FF' },
              { default: () => h(SvgIcon, { icon: 'addBtn' }) }
            )
          ),
          h(
            NButton,
            {
              size: 'tiny',
              class: 'rounded-10 w-30 mr-10 h-30',
              onclick: () => deleteTable(index),
            },
            h(NIcon, { size: 16, color: '#1890FF' }, { default: () => h(SvgIcon, { icon: 'del' }) })
          ),
        ]
      )
    },
  },
]
const formValue = ref({})
const add = () => {
  tableData.value.push({ type: '', name: '', value: '' })
}
const deleteTable = (index) => {
  tableData.value.splice(index, 1)
}
</script>

<style lang="scss" scoped>
.wrap {
  border: 1px solid #eaeaea;
  border-radius: 4px;
  min-height: 390px;
}
.item {
  margin-top: 30px;
}
</style>
