<template>
  <n-spin :show="loading">
    <div class="flex">
      <div style="width: 55%">
        <n-data-table
          :columns="firstColumns"
          :data="searchTableData1"
          :pagination="false"
          :bordered="false"
          :row-key="rowKey1"
          :default-checked-row-keys="defaultCheckedKeys1"
          :checked-row-keys="checkedRows1"
          :row-props="rowProps"
          style="height: 448px"
          :max-height="400"
          flex-height
          :row-class-name="rowClassName"
          @update:checked-row-keys="handleCheck1"
        />
        <div mt-20 flex items-center flex-justify-end>
          <n-button mr-20 @click="emits('handleClick', 'cancel')">取消</n-button>
          <n-button mr-20 @click="save">保存</n-button>
          <n-button type="primary" @click="() => save('confirm')">完成</n-button>
        </div>
      </div>
      <div ml-20 style="width: 45%">
        <n-data-table
          :columns="columns1"
          :data="selectTableData"
          :pagination="false"
          :bordered="false"
          :row-key="rowKey2"
          :default-checked-row-keys="defaultCheckedKeys2"
          :checked-row-keys="checkedRows2"
          style="height: 500px"
          :max-height="450"
          flex-height
          @update:checked-row-keys="handleCheck2"
        />
      </div>
    </div>
  </n-spin>
</template>

<script setup>
import { NIcon, NInput } from 'naive-ui'
import SvgIcon from '@/components/icon/SvgIcon.vue'
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import {
  getVehicleTypeEditOptionSet,
  getVehicleTypeEditOptionSetValue,
  updateVehicleTypeOptionSet,
  updateVehicleTypeOptionSetValue,
} from '~/src/api/config'
import _ from 'lodash'
import { useBusinessStore } from '~/src/store'
import { storeToRefs } from 'pinia'
const route = useRoute()
const emits = defineEmits(['handleClick'])
const business = useBusinessStore()
const childChangeType = computed(() => business.childChangeType)

const props = defineProps({
  chooseType: {
    type: String,
    default: '',
  },
  selectIndex: {
    type: Number,
    default: 0,
  },
})

const checkedRowKeysRef = ref([])
const defaultCheckedKeys1 = ref([])
const defaultCheckedKeys2 = ref([])
const checkedRows1 = ref([])
const checkedRows2 = ref([])
const saveState = ref(false)
const loading = ref(false)
const rowClassName = (row) => {
  if (row.optionOid === selectFeatureOid.value) {
    return 'activeTable'
  }
  return ''
}

const rowKey1 = (row) => row.optionOid
const rowKey2 = (row) => row.choiceOid

const search1 = ref('')
const search2 = ref('')
const searchTableData1 = computed(() => {
  let arr = tableData1.value.filter((item) => item.optionName.includes(search1.value))
  arr.forEach((item, index) => {
    if (item.optionSelected === '是') {
      arr.unshift(arr.splice(index, 1)[0])
    }
  })
  return arr
})
const selectTableData = computed(() => {
  const tableData = tableData2.value[selectFeatureOid.value] || []
  return tableData.filter((item) => item.choiceName.includes(search2.value))
})

// const searchTableData2 = computed(() =>
//   tableData2.value.filter((item) => item.optionName.includes(search2.value))
// )

const columns0 = [
  {
    type: 'selection',
    disabled() {
      return true
    },
  },
  {
    title: '特征名称',
    key: 'optionName',
  },
  {
    key: 'action',
    title(column) {
      return h(
        NInput,
        {
          placeholder: '关键词搜索',
          value: search1,
          clearable: true,
          onUpdateValue(v) {
            search1.value = v
          },
        },
        {
          suffix: h(
            NIcon,
            { size: 16 },
            { default: () => h(SvgIcon, { icon: 'icon_search_blue' }) }
          ),
        }
      )
    },
  },
]

const columns = [
  {
    type: 'selection',
  },
  {
    title: '特征类别',
    key: 'optionType',
    minWidth: 100,
  },
  {
    title: '特征名称',
    key: 'optionName',
    minWidth: 100,
  },
  {
    key: 'action',
    title(column) {
      return h(
        NInput,
        {
          placeholder: '关键词搜索',
          value: search1,
          clearable: true,
          onUpdateValue(v) {
            search1.value = v
          },
        },
        {
          suffix: h(
            NIcon,
            { size: 16 },
            { default: () => h(SvgIcon, { icon: 'icon_search_blue' }) }
          ),
        }
      )
    },
  },
]

const columns1 = [
  {
    type: 'selection',
  },
  {
    title: '特征值',
    key: 'choiceName',
  },
  {
    key: 'action',
    title(column) {
      return h(
        NInput,
        {
          placeholder: '关键词搜索',
          value: search2,
          class: 'max-w-120',
          clearable: true,
          onUpdateValue(v) {
            search2.value = v
          },
        },
        {
          suffix: h(
            NIcon,
            { size: 16 },
            { default: () => h(SvgIcon, { icon: 'icon_search_blue' }) }
          ),
        }
      )
    },
  },
]

const firstColumns = computed(() => {
  return props.selectIndex === 2 ? columns0 : columns
})

const tableData1 = ref([])
const tableData2 = ref({})
const selectFeatureOid = ref('') //点击特征值选中的oid

const handleCheck1 = (row, type, optionData) => {
  const data = tableData2.value[optionData.row?.optionOid]
  /* 全部勾出 */
  if (optionData.action === 'uncheck') {
    tableData2.value = {
      ...tableData2.value,
      [optionData.row?.optionOid]: data.map((item) => ({ ...item, choiceSelected: '否' })),
    }
    const oidList = data.map((item) => item.choiceOid)
    checkedRows2.value = checkedRows2.value.filter((item) => !oidList.includes(item))
  }
  checkedRows1.value = row
}
const handleCheck2 = (row, type, optionData) => {
  checkedRows2.value = row
  if (props.selectIndex === 2) {
    return
  }
  /* 勾选一个 */
  if (optionData.action === 'check') {
    const selectOid = tableData1.value.find((item) =>
      item.choices.some((val) => val.choiceOid === optionData?.row?.choiceOid)
    )?.optionOid
    if (!checkedRows1.value.includes(selectOid)) {
      checkedRows1.value.push(selectOid)
    }
  }
}

const rowProps = (row) => {
  return {
    onClick: () => {
      selectFeatureOid.value = row.optionOid
      search2.value = ''
    },
  }
}

const save = async (type = 'save') => {
  let _tableData1 = _.cloneDeep(tableData1.value)
  _tableData1 = _tableData1.map((item) => {
    if (checkedRows1.value.includes(item.optionOid)) {
      item.choices = item.choices.map((val) => {
        if (checkedRows2.value.includes(val.choiceOid)) {
          return { ...val, choiceSelected: '是' }
        }
        return { ...val, choiceSelected: '否' }
      })
      return { ...item, optionSelected: '是' }
    }
    return { ...item, optionSelected: '否' }
  })
  const payload = {
    oid: route.query.oid,
    type: props.chooseType,
    data: _tableData1,
  }
  if (saveState.value && type === 'confirm') {
    emits('handleClick', type, true)
    return
  }
  const apiUrl =
    props.selectIndex === 1 ? updateVehicleTypeOptionSet : updateVehicleTypeOptionSetValue
  const res = await apiUrl(payload)
  if (res.success) {
    $message.success('更新成功')
    saveState.value = true
    emits('handleClick', type, false, props.chooseType)
    props.selectIndex === 1 ? fetchData1() : fetchData2()
  }
}

/* 特征 */
const fetchData1 = async () => {
  try {
    loading.value = true
    const res = await getVehicleTypeEditOptionSet({ oid: route.query.oid, type: props.chooseType })
    tableData1.value = res.data
    res.data.forEach((item) => {
      tableData2.value[item.optionOid] = item?.choices
    })
    /* 设置默认选中 */
    selectFeatureOid.value = res.data[0]?.optionOid
    checkedRows1.value = res.data
      .filter((item) => item.optionSelected === '是')
      .map((item) => item.optionOid)

    res.data.forEach((item) => {
      if (item.choices?.length) {
        item.choices.forEach((val) => {
          if (val.choiceSelected === '是') {
            checkedRows2.value.push(val.choiceOid)
          }
        })
      }
    })
  } catch (error) {
    console.log('error:', error)
  } finally {
    loading.value = false
  }
}
/* 特征值 */
const fetchData2 = async () => {
  try {
    loading.value = true
    const res = await getVehicleTypeEditOptionSetValue({
      oid: route.query.oid,
      type: props.chooseType,
    })
    tableData1.value = res.data

    /* 设置默认选中 */
    selectFeatureOid.value = res.data[0]?.optionOid

    res.data.forEach((item) => {
      tableData2.value[item.optionOid] = item?.choices
    })
    checkedRows1.value = res.data
      .filter((item) => item.optionSelected === '是')
      .map((item) => item.optionOid)
    res.data.forEach((item) => {
      if (item.choices?.length) {
        item.choices.forEach((val) => {
          if (val.choiceSelected === '是') {
            checkedRows2.value.push(val.choiceOid)
          }
        })
      }
    })
  } catch (error) {
    console.log('error:', error)
  } finally {
    loading.value = false
  }
}

watch(
  () => props.selectIndex,
  (val) => {
    if (val > 0) {
      checkedRows1.value = []
      checkedRows2.value = []
      defaultCheckedKeys1.value = []
      defaultCheckedKeys2.value = []
      tableData1.value = []
      tableData2.value = {}
      val === 1 ? fetchData1() : fetchData2()
    }
  },
  { immediate: true }
)
watch(
  () => childChangeType.value,
  (val1) => {
    const arr = val1.split('-')
    if (arr[1] !== props.chooseType) {
      props.selectIndex === 1 ? fetchData1() : fetchData2()
    }
  },
  { deep: true }
)
</script>

<style lang="scss" scoped>
::v-deep.n-data-table .n-data-table-th {
  padding: 8px 12px;
}

::v-deep.n-data-table {
  .activeTable {
    .n-data-table-td {
      background: rgba(247, 247, 250, 1);
    }
  }
}
</style>
