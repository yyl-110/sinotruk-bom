<template>
  <CommonPage sub-title="超级BOM" back="mgt">
    <div h-full w-full px-20 pt-20>
      <!-- <child-title /> -->
      <config-mgt-nav :select="9" />
      <div mt-20 flex>
        <!-- <n-button type="primary" mr-20 rounded-4 @click="settingPeople">
          <template #icon>
            <the-icon type="custom" icon="icon_set" size="14" />
          </template>
          设置项目组
        </n-button> -->
        <!-- <n-button mr-20 rounded-4 type="primary" @click="handleDispatch">
          <template #icon>
            <the-icon type="custom" icon="task" size="14" color="#ffffff" />
          </template>
          下任务
        </n-button> -->
        <!-- <n-button
          v-if="isSpecial == 'true'"
          type="primary"
          mr-20
          rounded-4
          :loading="btnLoading"
          @click="settingAcModal"
        >
          <template #icon>
            <the-icon type="custom" icon="icon_set" size="14" />
          </template>
          设置特殊AC模块
        </n-button> -->
        <n-button mr-20 rounded-4 type="primary" @click="fetchData">
          <!-- <template #icon>
            <the-icon type="custom" icon="icon_" size="14" color="#ffffff" />
          </template> -->
          刷新
        </n-button>
        <n-button mr-20 rounded-4 type="primary" @click="extendAll">展开所有</n-button>
        <n-button type="primary" mr-20 rounded-4 @click="unExtendAll">收起所有</n-button>
        <n-button type="primary" mr-20 rounded-4 :loading="exportLoading" @click="exportBom">
          导出BOM
        </n-button>
      </div>
      <div class="tableWrap">
        <n-data-table
          v-model:checked-row-keys="checkedRowKeys"
          :expanded-row-keys="expandKey"
          :columns="columns"
          :data="sorterTableData"
          :pagination="false"
          :bordered="false"
          :row-key="rowKey"
          :render-expand-icon="renderExpandIcon"
          :loading="loading"
          :scroll-x="1200"
          default-expand-all
          flex-height
          mt-20
          :scrollbar-props="{ trigger: 'none' }"
          class="dataTable"
          @update:sorter="uploadSorter"
          @update:expanded-row-keys="expandRow"
        />
      </div>
    </div>
    <AcInsertModal ref="acInsertRef" />
    <feature-detail ref="featureDetailref" />
    <PeopleSettingModal ref="PeopleSettingModalRef" @handle-confirm="confirmPeople" />
    <!-- <DispatchTasks ref="DispatchTasksRef" /> -->
  </CommonPage>
</template>

<script setup>
import AppTitle from '@/components/common/AppTitle.vue'
import ChildTitle from '../component/ChildTitle.vue'
import ConfigMgtNav from '../component/ConfigMgtNav.vue'
import { NButton, NIcon } from 'naive-ui'
import SvgIcon from '~/src/components/icon/SvgIcon.vue'
import AcInsertModal from './component/AcInsertModal.vue'
import FeatureDetail from './component/FeatureDetail.vue'
import PeopleSettingModal from './component/PeopleSettingModal.vue'
// import DispatchTasks from './component/DispatchTasks.vue'
import {
  getConfigCodeDetailInfo,
  getConfigCodeSourceDetectionTree,
  getVehicleTypeSourceDetectionTree,
  updateACModuleOwner,
  getPkCodeSourceDetectionTree,
  setSpecialAcModuleInfo,
  exportBomData,
} from '~/src/api/config'
import { useRoute } from 'vue-router'
import { computed, onMounted } from 'vue'
import _ from 'lodash'
import { useBusinessStore } from '~/src/store'
import { storeToRefs } from 'pinia'
const businessStore = useBusinessStore()
const { currentObjState } = storeToRefs(businessStore)
const featureDetailref = ref(null)
const PeopleSettingModalRef = ref(null)
// const DispatchTasksRef = ref(null)
const acInsertRef = ref(null)
const checkedRowKeys = ref([])
const exportLoading = ref(false)
const rowKey = (row) => row.oid
const renderExpandIcon = () => {
  return h(
    NIcon,
    { size: 16, color: '#1890FF' },
    { default: () => h(SvgIcon, { icon: 'icon_form_fold' }) }
  )
}
const route = useRoute()
const queryData = route.query.oid
const loading = ref(false)
const btnLoading = ref(false)
const tableData = ref([])
const originData = ref([])
const colorList = {
  红色: 'red',
  橙色: 'orange',
  黑色: '#4e5969',
}
const sortType = ref(null)
const expandKey = ref([])
let columns = [
  {
    type: 'selection',
  },
  {
    title: '标识',
    key: 'mark',
    render: (row) => {
      return h('span', { style: { color: colorList[row.color] } }, { default: () => row.mark })
    },
    sorter: 'default',
    // width: 600,
    // ellipsis: {
    //   tooltip: true,
    // },
  },
  {
    title: '',
    key: 'actions',
    width: 80,
    render(row) {
      return h(
        'div',
        {
          class: 'flex items-center',
        },
        {
          default: () => {
            if (!row.action) return ''
            if (row.action === '录入') return btnList1.map((i) => renderBtn(i, row))
            if (row.action === '查看') return btnList2.map((i) => renderBtn(i, row))
          },
        }
      )
    },
  },
  {
    title: '版本',
    key: 'version',
    width: 100,
  },
  {
    title: '数量',
    key: 'amount',
    width: 80,
  },
  // {
  //   title: '特殊AC模块',
  //   key: 'specialAcModule',
  //   width: 100,
  // },
  {
    title: '成熟度',
    key: 'maturityC',
    width: 100,
  },
  // {
  //   title: '过程成熟度',
  //   key: 'processMaturity',
  //   width: 100,
  // },
  // {
  //   title: '项目组人员',
  //   key: 'owner',
  //   width: 120,
  //   render: (row) => (row.owner ? h(NButton, {}, row.owner) : ''),
  // },
  // {
  //   title: '部门负责人',
  //   key: 'departmentHead',
  //   width: 120,
  //   render: (row) => (row.departmentHead ? h(NButton, {}, row.departmentHead) : ''),
  // },
  // {
  //   title: '设计负责人',
  //   key: 'owner',
  //   width: 120,
  //   render: (row) => (row.owner ? h(NButton, {}, row.owner) : ''),
  // },
]

const isSpecial = computed(() => currentObjState.value.configVehicle === '特殊车型')
if (!isSpecial.value) {
  columns = [
    ...columns,
    {
      title: '部门负责人',
      key: 'departmentHead',
      width: 120,
      fixed: 'right',
      render: (row) => (row.departmentHead ? h(NButton, {}, row.departmentHead) : ''),
    },
    {
      title: '设计负责人',
      key: 'owner',
      width: 120,
      fixed: 'right',
      render: (row) => (row.owner ? h(NButton, {}, row.owner) : ''),
    },
  ]
}

const btnList1 = [{ icon: 'edit', text: '录入', type: 1 }]
const btnList2 = [{ icon: 'look', type: 2, text: '查看' }]

const settingAcModal = async () => {
  if (!checkedRowKeys.value.length) {
    $message.info('请选择节点')
    return
  }
  try {
    loading.value = true
    btnLoading.value = true
    const selectArr = originData.value
      .filter((item) => checkedRowKeys.value.includes(item.oid))
      .map((item) => ({
        oid: item.oid,
        specialAcModule: item?.specialAcModule,
      }))
    const res = await setSpecialAcModuleInfo({
      data: selectArr,
    })
    if (res.success) {
      $message.success('操作成功')
    }
  } catch (error) {
    console.log('error:', error)
  } finally {
    loading.value = false
    btnLoading.value = false
  }
}

const handleDispatch = () => {
  if (!checkedRowKeys.value.length) {
    $message.info('请选择节点')
    return
  }
  // DispatchTasksRef.value.show(checkedRowKeys.value)
}

const settingPeople = () => {
  if (!checkedRowKeys.value.length) {
    $message.info('请选择节点')
    return
  }
  PeopleSettingModalRef.value.show()
}

const confirmPeople = async (data) => {
  try {
    const res = await updateACModuleOwner({
      userid: data,
      data: checkedRowKeys.value.map((item) => ({ oid: item })),
    })
    if (res.success) {
      $message.success(res.message || '设置成功')
      fetchData()
      PeopleSettingModalRef.value.close()
    }
  } catch (error) {
    console.log('error:', error)
  }
}

const renderBtn = (btn, row) => {
  if (!row.action) return ''
  return $toolTipWrap(
    btn.text,
    h(
      NButton,
      {
        size: 'tiny',
        onClick: () => handleClick(btn.type, row),
        class: 'rounded-10 w-30 mr-10 h-30',
      },
      {
        default: () =>
          h(
            NIcon,
            { size: 16, color: '#1890FF' },
            { default: () => h(SvgIcon, { icon: btn.icon }) }
          ),
      }
    )
  )
}

const handleClick = (type, row) => {
  if (type === 1) {
    acInsertRef.value.show(row.oid)
  } else if (type === 2) {
    featureDetailref.value.show(row.oid)
  }
}

const recursiveSort = (data, type) => {
  if (type === 'descend') {
    data.sort((a, b) => (b.order ?? Infinity) - (a.order ?? Infinity))
  }
  if (type === 'ascend') {
    data.sort((a, b) => (a.order ?? Infinity) - (b.order ?? Infinity))
  }

  data.forEach((item) => {
    if (item.children && item.children.length > 0) {
      recursiveSort(item.children, type)
    }
  })
}

const sorterTableData = computed(() => {
  if (!sortType.value) return tableData.value
  /* 降序 */
  const data = _.cloneDeep(tableData.value)
  recursiveSort(data, sortType.value)
  return data
})

const uploadSorter = (val) => {
  sortType.value = val?.order
}

const handleTree = (data, id, parentId, children, rootId) => {
  id = id || 'id'
  parentId = parentId || 'parentId'
  children = children || 'children'
  rootId = rootId || ''
  //对源数据深度克隆
  const cloneData = _.cloneDeep(data)
  //循环所有项
  const treeData = cloneData.filter((father) => {
    let branchArr = cloneData.filter((child) => {
      //返回每一项的子级数组
      return father[id] === child[parentId]
    })
    branchArr.length > 0 ? (father.children = branchArr) : ''
    //返回第一层
    return father[parentId] === rootId
  })
  return treeData != '' ? treeData : data
}

const fetchData = async () => {
  /* 用于判断是否是配置号管理跳转过来 */
  const expOid = route.query?.expOid
  /* 用于判断是否从配置号管理套餐操作 */
  const mealOid = route.query?.mealOid
  const getApi = route.query?.expOid
    ? getConfigCodeSourceDetectionTree
    : mealOid
    ? getPkCodeSourceDetectionTree
    : getVehicleTypeSourceDetectionTree
  try {
    loading.value = true
    const res = await getApi(
      expOid
        ? { data: JSON.parse(decodeURIComponent(expOid)) }
        : { oid: mealOid ? mealOid : route.query.oid }
    )
    originData.value = res.data
    const data = res.data.map((item) => {
      const order = item?.mark.split(' ')[0]?.split('-')
      const orderData = order[order.length - 1]
      return { ...item, order: Number(orderData) }
    })
    tableData.value = handleTree(data, 'oid', 'parentOid')
  } catch (error) {
    console.log('error:', error)
  } finally {
    loading.value = false
  }
}
const fetchDatas = async (data) => {
  const res = await getConfigCodeDetailInfo(data)
  console.log('res:', res)
}
// 展开全部
const extendAll = () => {
  expandKey.value = originData.value.map((item) => item.oid)
}
// 收起所有
const unExtendAll = () => {
  expandKey.value = []
}
const expandRow = (val) => {
  expandKey.value = val
}

/* 导出 */
const exportBom = async () => {
  /* 用于判断是否是配置号管理跳转过来 */
  const expOid = route.query?.expOid
  /* 用于判断是否从配置号管理套餐操作 */
  const mealOid = route.query?.mealOid
  try {
    exportLoading.value = true
    let payload = {}
    if (expOid) {
      const oids = JSON.parse(decodeURIComponent(expOid))
      payload = {
        exportOid: oids,
        exportType: '配置号',
      }
    } else if (mealOid) {
      payload = {
        exportOid: mealOid,
        exportType: '套餐',
      }
    } else {
      payload = { exportOid: route.query.oid, exportType: '车型子类' }
    }
    const res = await exportBomData(payload)
    if (res.success) {
      window.open(res.data)
    }
  } catch (error) {
    console.log('error:', error)
  } finally {
    exportLoading.value = false
  }
}

onMounted(() => {
  if (route.query.type === 2) {
    const data = JSON.parse(queryData)
    fetchDatas(data)
  } else {
    fetchData()
  }
})
</script>

<style lang="scss" scoped>
.tableWrap {
  height: calc(100% - 130px);
  .dataTable {
    height: 100%;
    ::v-deep .n-data-table-wrapper {
      height: 100%;
    }
    ::v-deep .n-data-table-base-table {
      height: 100%;
    }
  }
}
::v-deep.n-data-table .n-data-table-td {
  padding: 2.5px 12px;
}
</style>
