<template>
  <CommonPage sub-title="型谱策划" back="mgt">
    <div h-full w-full px-20 pt-20>
      <!-- <app-title text="型谱策划" /> -->
      <!-- <child-title /> -->
      <config-mgt-nav :select="1" />
      <div class="btnWrap" mt-20 flex items-center>
        <div class="btn" :class="[selectIndex === 1 && 'select']" @click="handleClickBtn(1)">
          <the-icon icon="edit" type="coutom" mr-9 size="14" />
          <span ml-9>编辑特征</span>
        </div>
        <div ml-20 class="btn" :class="[selectIndex === 2 && 'select']" @click="handleClickBtn(2)">
          <the-icon icon="edit" type="coutom" size="14" />
          <span ml-9>编辑特征值</span>
        </div>
        <n-button
          ml-20
          type="primary"
          :disabled="headerData.status !== '设计中'"
          @click="reviewAndSign"
        >
          <template #icon>
            <the-icon icon="flag" type="coutom" mr-9 size="14" />
          </template>
          审签
        </n-button>
        <n-button
          ml-20
          type="primary"
          :disabled="headerData.status !== '已完成'"
          @click="createChangePage(headerData.changeUrl)"
        >
          <template #icon>
            <the-icon icon="icon_change" type="coutom" mr-9 size="14" />
          </template>
          更改
        </n-button>
        <n-button v-if="!isSpecial" ml-20 type="primary" @click="handleCheckTypeSpectrum">
          <template #icon>
            <the-icon icon="iconn_search_white" type="coutom" mr-9 size="14" />
          </template>
          型谱封闭检查
        </n-button>
      </div>
      <n-collapse :default-expanded-names="['1', '2']" mt-20>
        <template #arrow>
          <the-icon type="custom" icon="icon_form_fold" :size="16" color="#1D2129" />
        </template>
        <n-collapse-item title="固化配置" name="1">
          <template #header="{ collapsed }">
            <div w-full flex items-center justify-between>
              <span>固化配置</span>
              <div h-full flex items-center pr-20>
                <div v-if="headerData?.processCreator">
                  流程发起者：{{ headerData.processCreator }}
                </div>
                <div class="ml-20">版本：{{ headerData.version }}</div>
                <span ml-20 mr-10 text-hex-faad14>{{ headerData.status }}</span>
                <the-icon
                  type="custom"
                  icon="toTop"
                  :size="16"
                  color="#1890ff"
                  class="toTop"
                  :class="[collapsed && 'extend']"
                />
              </div>
            </div>
          </template>
          <n-grid
            cols="20 s:20 m:20 l:20 xl:20 2xl:20"
            responsive="screen"
            class="gridWrap"
            lt-lg:h-auto
            :x-gap="20"
          >
            <n-grid-item :span="selectIndex ? '20 s:20 m:8 l:8 xl:8 2xl:8' : 20">
              <n-data-table
                :columns="columns1"
                :data="fixedItems"
                :pagination="false"
                :loading="loading"
                :single-line="false"
                style="height: 500px"
                :max-height="450"
                flex-height
                :row-key="rowKey"
                :row-class-name="rowClassName"
              />
            </n-grid-item>
            <n-grid-item v-if="selectIndex" span="20 s:20 m:12 l:12 xl:12 2xl:12">
              <CategoryTable
                key="1"
                :choose-type="'fixed'"
                :select-index="selectIndex"
                @handle-click="confirm"
              />
            </n-grid-item>
          </n-grid>
        </n-collapse-item>
        <div class="btnWrap" mt-20 flex items-center>
          <div class="btn" :class="[selectIndex2 === 1 && 'select']" @click="handleClickBtn2(1)">
            <the-icon icon="edit" type="coutom" mr-9 size="14" />
            <span ml-9>编辑特征</span>
          </div>
          <div
            ml-20
            class="btn"
            :class="[selectIndex2 === 2 && 'select']"
            @click="handleClickBtn2(2)"
          >
            <the-icon icon="edit" type="coutom" size="14" />
            <span ml-9>编辑特征值</span>
          </div>
        </div>
        <n-collapse-item title="选装配置" name="2">
          <template #header="{ collapsed }">
            <div w-full flex items-center justify-between>
              <span>选装配置</span>
              <div h-full flex items-center pr-20>
                <the-icon
                  type="custom"
                  icon="toTop"
                  :size="16"
                  color="#1890ff"
                  class="toTop"
                  :class="[collapsed && 'extend']"
                />
              </div>
            </div>
          </template>
          <n-grid
            cols="20 s:20 m:20 l:20 xl:20 2xl:20"
            responsive="screen"
            class="gridWrap"
            lt-lg:h-auto
            :x-gap="20"
          >
            <n-grid-item :span="selectIndex2 ? '20 s:20 m:8 l:8 xl:8 2xl:8' : 20">
              <n-data-table
                :columns="columns2"
                :data="optionalItems"
                :pagination="false"
                :single-line="false"
                :loading="loading"
                style="height: 500px"
                :max-height="450"
                flex-height
                :row-key="rowKey"
                :row-class-name="rowClassName"
              />
            </n-grid-item>
            <n-grid-item v-if="selectIndex2" span="20 s:20 m:12 l:12 xl:12 2xl:12">
              <CategoryTable
                key="2"
                :choose-type="'optional'"
                :select-index="selectIndex2"
                @handle-click="confirm1"
              />
            </n-grid-item>
          </n-grid>
        </n-collapse-item>
      </n-collapse>
      <!-- <div
        v-if="selectIndex || selectIndex2"
        class="footer"
        mt-100
        flex
        items-center
        flex-justify-end
        pt-20
      >
        <n-button mr-20>重置</n-button>
        <n-button mr-20>保存</n-button>
        <n-button type="primary">确定</n-button>
      </div> -->
      <div class="h-20"></div>
    </div>
  </CommonPage>
</template>

<script setup>
import AppTitle from '@/components/common/AppTitle.vue'
import { onMounted, ref, watch } from 'vue'
import ChildTitle from '../component/ChildTitle.vue'
import ConfigMgtNav from '../component/ConfigMgtNav.vue'
import CategoryTable from '../component/CategoryTable.vue'
import { checkTypeSpectrum, getVehicleTypeOptionSet } from '~/src/api/config'
import { useRoute } from 'vue-router'
import useHandle from '~/src/hooks/useHandle'
import { useAppStore, useBusinessStore } from '~/src/store'
import { storeToRefs } from 'pinia'
// import dataJson from './data.json'

const { queryCreateFReviewDoc, createChangePage } = useHandle()
const { handleChildChangeType } = useBusinessStore()
const { changeLoading } = useAppStore()
const businessStore = useBusinessStore()
const { currentObjState } = storeToRefs(businessStore)

const route = useRoute()
const selectIndex = ref(0) // 1 编辑特征 2 编辑特征值
const selectIndex2 = ref(0) // 1 编辑特征 2 编辑特征值
const loading = ref(false)
const fixedItems = ref([])
const optionalItems = ref([])
const chooseType = ref('') // fixed 固化 optional 选装

const headerData = ref({})

const expandedState = ref([true, true])
const rowKey = (row) => row?.choices?.choiceOid

const handleClickBtn = (type) => {
  if (type === 1 && !['设计中', '重新工作'].includes(headerData.value.status)) {
    return
  }
  if (type === 2 && !['设计中', '重新工作'].includes(headerData.value.status)) {
    return
  }
  if (type > 0) {
    selectIndex.value = type
  }
}
const handleClickBtn2 = (type) => {
  if (type === 1 && !['设计中', '重新工作'].includes(headerData.value.status)) {
    return
  }
  if (type === 2 && !['设计中', '重新工作'].includes(headerData.value.status)) {
    return
  }
  if (type > 0) {
    selectIndex2.value = type
  }
}

const getIndex = (rowData, arr) => {
  const indexLength = arr.filter((item) => item?.optionOid === rowData?.optionOid)
  return indexLength.length
}

const columns1 = [
  {
    title: '序号',
    key: 'no',
    width: 60,
    align: 'center',
    render(row, inx) {
      return row.tableIndex + 1
    },
    rowSpan: (rowData) => getIndex(rowData, fixedItems.value),
  },
  {
    title: '特征类别',
    key: 'optionType',
    rowSpan: (rowData) => getIndex(rowData, fixedItems.value),
  },
  {
    title: '特征名称',
    key: 'optionName',
    className: 'featureValue',
    rowSpan: (rowData) => getIndex(rowData, fixedItems.value),
  },
  {
    title: '特征值',
    key: 'choices',
    render: (row) => row.choices?.choiceName,
  },
]
const rowClassName = (row) => {
  if (row.color) {
    return 'blueWrap'
  }
  return ''
}
const columns2 = [
  {
    title: '序号',
    key: 'no',
    width: 60,
    align: 'center',
    render(row, inx) {
      return row.tableIndex + 1
    },
    rowSpan: (rowData) => getIndex(rowData, optionalItems.value),
  },
  {
    title: '特征类别',
    key: 'optionType',
    rowSpan: (rowData) => getIndex(rowData, optionalItems.value),
  },
  {
    title: '特征名称',
    key: 'optionName',
    className: 'featureValue',
    rowSpan: (rowData) => getIndex(rowData, optionalItems.value),
  },
  {
    title: '特征值',
    key: 'choices',
    render: (row) => row.choices?.choiceName,
  },
]

const isSpecial = computed(() => currentObjState.value.configVehicle === '特殊车型')

const fetchData = async () => {
  try {
    loading.value = true
    const res = await getVehicleTypeOptionSet({ oid: route.query.oid, type: 'LATEST' })
    headerData.value = {
      version: res.data.version,
      status: res.data.status,
      changeUrl: res.data.changeUrl,
      processCreator: res.data.processCreator,
    }
    let fixedArr = []
    res.data?.fixedItems.forEach((item, index) => {
      item.tableIndex = index
      const arr = item.choices.map((val) => {
        return { ...item, choices: val, optionType: '固化配置' }
      })
      if (item.choices.length) {
        fixedArr = [...fixedArr, ...arr]
      } else {
        fixedArr = [...fixedArr, { ...item, optionType: '固化配置' }]
      }
    })
    fixedItems.value = fixedArr
    let optionalArr = []
    res.data?.optionalItems.forEach((item, index) => {
      item.tableIndex = index
      const arr = item.choices.map((val) => {
        return { ...item, choices: val, optionType: '选装配置' }
      })
      if (item?.choices.length) {
        optionalArr = [...optionalArr, ...arr]
      } else {
        optionalArr = [...optionalArr, { ...item, optionType: '选装配置' }]
      }
    })
    optionalItems.value = optionalArr
  } catch (e) {
    console.log('e:', e)
  } finally {
    loading.value = false
  }
}

/*
 * state 是否直接关闭编辑 不用调用接口刷新
 */
const confirm = (type, state, changeType) => {
  if (type !== 'cancel' && !state) {
    handleChildChangeType(`${new Date().getTime()}-${changeType}`)
    fetchData()
  }
  if (type === 'confirm' || type === 'cancel') {
    selectIndex.value = 0
  }
}
const confirm1 = (type, state, changeType) => {
  if (type !== 'cancel' && !state) {
    handleChildChangeType(`${new Date().getTime()}-${changeType}`)
    fetchData()
  }
  if (type === 'confirm' || type === 'cancel') {
    selectIndex2.value = 0
  }
}

const handleCheckTypeSpectrum = async () => {
  try {
    changeLoading(true)
    const res = await checkTypeSpectrum({ oid: route.query.oid })
    if (res.success) {
      $message.success('检测成功')
    }
  } catch (error) {
    console.log('error:', error)
  } finally {
    changeLoading(false)
  }
}

/* 审签 */
const reviewAndSign = () => {
  $dialog.confirm({
    content: '是否确认发起签审',
    negativeText: '取消',
    positiveText: '确认',
    confirm() {
      queryCreateFReviewDoc(route.query.oid, 'optionSet')
    },
  })
}

onMounted(() => {
  fetchData()
})
</script>

<style lang="scss" scoped>
.btnWrap {
  .btn {
    border: 1px solid #e5e6eb;
    color: #1d2129;
    font-size: 14px;
    display: flex;
    cursor: pointer;
    align-items: center;
    border-radius: 4px;
    padding: 0 14px;
    height: 32px;

    &.select {
      color: #fff;
      background-color: var(--primary-color);
      border-color: var(--primary-color);
    }
  }
}

::v-deep.n-collapse .n-collapse-item .n-collapse-item__header {
  height: 48px;
  background: rgba(24, 144, 255, 0.1);
  border-radius: 4px 4px 0px 0px;
  padding-left: 20px;
  padding-top: 0;
}

::v-deep.n-collapse
  .n-collapse-item
  .n-collapse-item__content-wrapper
  .n-collapse-item__content-inner {
  padding-top: 0 !important;
}

.toTop {
  transform: rotate(0);
  transition: all 0.3s ease-in-out;
  &.extend {
    transform: rotate(180deg);
  }
}
.footer {
  border-top: 1px solid #eaeaea;
}
::v-deep .n-data-table .n-data-table-td.n-data-table-td--last-row {
  border-width: 1px;
}
::v-deep .blueWrap .featureValue {
  color: #fff;
  background: #1890ff;
  --n-merged-td-color-hover: #1890ff;
}
</style>
