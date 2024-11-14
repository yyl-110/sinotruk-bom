<template>
  <a-table
    :columns="columns"
    :data-source="tableData"
    :loading="loading"
    :pagination="false"
    :scroll="{ x: '100%', y: 300 }"
  >
    <template #bodyCell="{ column, record, index }">
      <template v-if="column.key === 'index'">{{ props.clickIndex + 1 }}.{{ index + 1 }}</template>
      <template v-if="column.key === 'action'">
        <a-tooltip>
          <template #title>查看单车BOM</template>
          <a-button
            mr-20
            h-30
            w-30
            flex
            items-center
            justify-center
            rounded-10
            p-0
            @click="goTo(record)"
          >
            <the-icon :size="14" type="custom" icon="icon_operate_16" color="#1890FF" />
          </a-button>
        </a-tooltip>
      </template>
    </template>
  </a-table>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { getPackageCodeList } from '~/src/api/config'
import _ from 'lodash'
import { useRoute, useRouter } from 'vue-router'
const route = useRoute()
const router = useRouter()
const props = defineProps({
  clickIndex: {
    type: Number,
    default: 0,
  },
  clickRow: {
    type: Object,
    default: () => {},
  },
  optionalOid: {
    type: Array,
    default: () => [],
  },
})

const tableData = ref([])
const defaultColumn = [
  { title: '序号', dataIndex: 'index', key: 'index', width: 60 },
  { width: 120, title: '短码', dataIndex: 'number', key: 'number' },
  // { width: 120, title: '配置号', dataIndex: 'ConfigCode', key: 'ConfigCode' },
  // {
  //   width: 120,
  //   title: '内部车型号',
  //   dataIndex: 'internalVehicleModel',
  //   key: 'internalVehicleModel',
  // },
  // { width: 120, title: '细分市场', dataIndex: 'ConfigCode', key: 'ConfigCode' },
  // { width: 120, title: '应用场景', dataIndex: 'ConfigCode', key: 'ConfigCode' },
  // { width: 120, title: '区域', dataIndex: 'ConfigCode', key: 'ConfigCode' },
  // { width: 120, title: '发动机', dataIndex: 'ConfigCode', key: 'ConfigCode' },
  // { width: 120, title: '变速箱', dataIndex: 'ConfigCode', key: 'ConfigCode' },
  // { width: 120, title: '窗帘', dataIndex: 'ConfigCode', key: 'ConfigCode' },
  // { width: 120, title: '轮胎', dataIndex: 'ConfigCode', key: 'ConfigCode' },
  // { width: 120, title: '显示屏', dataIndex: 'ConfigCode', key: 'ConfigCode' },
  { title: '操作', dataIndex: 'action', key: 'action', width: 60, fixed: 'right' },
]
const loading = ref(false)
const columns = ref(defaultColumn)

const fetchData = async (oid = props.clickRow?.oid) => {
  try {
    loading.value = true
    let optionalGroup = {}
    try {
      props.optionalOid.forEach((item) => {
        if (item.value) {
          optionalGroup[item.id] = item.value
        }
      })
    } catch (error) {
      console.log('error:', error)
    }
    const res = await getPackageCodeList({ oid, optionalGroup })
    const { configTitles = [], configItems = [], pkItems = [], pkTitles = [] } = res.data || {}
    const pkColumns = pkTitles.map((item) => {
      return {
        width: 180,
        title: item.titleName,
        dataIndex: item.titleID,
        key: item.titleID,
      }
    })
    let customColumn = _.cloneDeep(defaultColumn)
    customColumn.splice(2, 0, ...pkColumns)
    columns.value = customColumn
    const pkTableData = pkItems.map((item, index) => {
      return {
        number: configItems[index]?.number,
        oid: configItems[index]?.oid,
        // configCode: configItems[index]?.configCode,
        ...item,
      }
    })
    tableData.value = pkTableData
  } catch (error) {
    console.log('error:', error)
    throw error
  } finally {
    loading.value = false
  }
}

const goTo = (row) => {
  /* 修改oid props.clickRow.oid =》 route.query.oid */
  router.push({
    path: 'super-bom',
    query: { oid: route.query.oid, number: route.query.number, mealOid: row.oid },
  })
}

onMounted(() => {
  props.clickRow?.oid && fetchData(props.clickRow?.oid)
})
defineExpose({
  fetchData,
})
</script>

<style lang="scss" scoped></style>
