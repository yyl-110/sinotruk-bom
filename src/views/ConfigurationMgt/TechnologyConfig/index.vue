<template>
  <CommonPage sub-title="技术配置" back="mgt">
    <template #action>
      <div v-if="currentObjState?.allPkNum" text-red>
        可配车辆总数：{{ currentObjState?.allPkNum }}
      </div>
    </template>
    <div position-relative w-full px-20 pt-20>
      <!-- <child-title /> -->
      <config-mgt-nav :select="2" />
      <n-collapse :default-expanded-names="['1', '2', '3']" mt-20>
        <template #arrow>
          <the-icon type="custom" icon="icon_form_fold" :size="16" color="#1D2129" />
        </template>
        <n-collapse-item title="内部车型号选择" name="3">
          <template #header="{ collapsed }">
            <div w-full flex items-center justify-between>
              <span>内部车型号</span>
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
          <n-space item-style="display: flex;" pl-10>
            <n-checkbox-group :value="checkboxValue" :max="10" @update:value="select">
              <n-checkbox
                v-for="item in checkBoxList"
                :key="item.oid"
                :value="item.oid"
                :label="renderLabel(item)"
              />
            </n-checkbox-group>
          </n-space>
        </n-collapse-item>
        <n-collapse-item title="固化配置" name="1">
          <template #header="{ collapsed }">
            <div w-full flex items-center justify-between>
              <span>固化配置</span>
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
          <div style="max-width: min-content" w-full>
            <n-data-table
              :columns="concatFixedColumns"
              :data="fixedItems"
              :pagination="false"
              :single-line="false"
              :max-height="500"
              :scroll-x="1200"
              :loading="loading"
            />
          </div>
        </n-collapse-item>
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
          <div style="max-width: min-content" w-full>
            <n-data-table
              :columns="concatOptionalColumns"
              :data="optionalItems"
              :pagination="false"
              :single-line="false"
              :max-height="500"
              :scroll-x="1200"
              :loading="loading"
              w-auto
            />
          </div>
        </n-collapse-item>
      </n-collapse>
      <div
        class="footer"
        position-sticky
        bottom-0
        left-0
        w-full
        flex
        items-center
        flex-justify-end
        pt-20
      >
        <n-button mr-20 @click="reset">重置</n-button>
        <n-button mr-20 type="primary" @click="save">保存</n-button>
        <!-- <n-button type="primary">确定</n-button> -->
      </div>
      <CopyCarModal ref="copyCarRef" @handle-confirm="handleCopyCar" />
      <CarCountModal ref="carCountRef" />
      <exclusion-rule-modal ref="exclusionRuleRef" />
    </div>
  </CommonPage>
</template>

<script setup>
import AppTitle from '@/components/common/AppTitle.vue'
import { NButton, NIcon, NSelect, NTooltip } from 'naive-ui'
import ChildTitle from '../component/ChildTitle.vue'
import ConfigMgtNav from '../component/ConfigMgtNav.vue'
import CopyCarModal from './component/CopyCarModal.vue'
import CarCountModal from './component/CarCountModal.vue'
import RulesSettingModal from './component/RulesSettingModal.vue'
import ExclusionRuleModal from './component/ExclusionRuleModal.vue'
import SvgIcon from '@/components/icon/SvgIcon.vue'
import { getInternalVehicleModelList } from '~/src/api/product'
import { useRoute } from 'vue-router'
import { onMounted, watch } from 'vue'
import { useAppStore, useBusinessStore } from '@/store'
import {
  getConfigVehicleQty,
  getCurrentObjState,
  getExplodeConfigCode,
  getInternalVehicleModelTechConfig,
  getVehicleTypeOptionSet,
  updateInternalVehicleModelTechConfig,
} from '~/src/api/config'
import { featureOption } from './data'
import _ from 'lodash'
import { storeToRefs } from 'pinia'
const route = useRoute()
const business = useBusinessStore()
const { currentObjState } = storeToRefs(business)

const checkboxValue = ref(business.chooseInternalVehicleModelList)
const appStore = useAppStore()
const { changeLoading } = appStore
const copyCarRef = ref(null)
const carCountRef = ref(null)
const exclusionRuleRef = ref(null)
const checkBoxList = ref([])
const fixedItems = ref([]) // 固化
const optionalItems = ref([]) // 选装
const originOid = ref('') //复制内部车型号原始元素
const handleType = ref('fixed') // 操作的类型
const handleIndex = ref(-1) // 操作的列index
const loading = ref(false)
/* 记录保存数据 */
const recordFixedItems = ref([]) // 固化
const recordOptionalItems = ref([]) // 选装

const carTotalCount = ref({})

const select = async (val, checkObj) => {
  if (checkObj.value !== '0') {
    const selectIndex = checkboxValue.value
      .filter((item) => item !== '0')
      .findIndex((item) => item === checkObj?.value)
    const arr = val.filter((item) => item !== '0')
    if (arr.length === checkBoxList.value.length - 1) {
      checkboxValue.value = checkBoxList.value.map((item) => item.oid)
    } else {
      /* 排序 */
      const sortCheckBoxArr = checkBoxList.value
        .filter((item) => arr.includes(item.oid))
        .map((item) => item.oid)
      checkboxValue.value = sortCheckBoxArr
    }
    /* 表头处理 */
    handleTableHeader()
    if (checkObj?.actionType === 'check') {
      try {
        loading.value = true
        await fetchInternalVehicleModelTechConfig(checkObj?.value, 'check')
      } catch (error) {
        console.log('error:', error)
      } finally {
        loading.value = false
      }
    } else {
      fetchInternalVehicleModelTechConfig('', 'uncheck', selectIndex)
    }
    business.handleInternalVehicleModelList(checkboxValue.value)
    return
  }
  /* 全选操作 */
  if (checkObj?.actionType === 'check') {
    if (checkBoxList.value.length > 10) {
      $message.warning('技术配置列表最多只允许10个内部车型号')
      return
    }
    checkboxValue.value = checkBoxList.value.map((item) => item.oid)
    /* 表头处理 */
    handleTableHeader()
    /* 全选操作先清楚已有的数据不然表头和列数据对应不上 */
    fixedItems.value = fixedItems.value.map((val) => {
      delete val?.canChoices
      return { ...val }
    })
    optionalItems.value = optionalItems.value.map((val) => {
      delete val?.canChoices
      return { ...val }
    })
    try {
      loading.value = true
      for (const item of checkboxValue.value) {
        if (item !== '0') await fetchInternalVehicleModelTechConfig(item, 'check')
      }
    } catch (error) {
      console.log('error:', error)
    } finally {
      loading.value = false
    }
  } else {
    checkboxValue.value = []
    /* 表头处理 */
    handleTableHeader()
    fetchInternalVehicleModelTechConfig('', 'uncheckall')
  }
  /* 存store */
  business.handleInternalVehicleModelList(checkboxValue.value)
}

const getIndex = (rowData, arr) => {
  const indexLength = arr.filter((item) => item?.optionOid === rowData?.optionOid)
  return indexLength.length
}

const columns1 = ref([
  {
    title: '序号',
    key: 'no',
    width: '60',
    align: 'center',
    fixed: 'left',
    render(row, inx) {
      return row.inx + 1
    },
    rowSpan: (rowData) => getIndex(rowData, fixedItems.value),
  },
  {
    title: '特征名称',
    key: 'optionName',
    width: '100',
    rowSpan: (rowData) => getIndex(rowData, fixedItems.value),
  },
  {
    title: '特征值',
    key: 'value',
    width: '250',
    render: (row) =>
      h(
        'sapn',
        {
          class:
            row.choices.color === '蓝色'
              ? 'text-primary'
              : row.choices.color === '红色'
              ? 'text-red'
              : '',
        },
        row.choices?.choiceName
      ),
  },
])
const columns2 = ref([
  {
    title: '序号',
    key: 'no',
    width: '60',
    align: 'center',
    fixed: 'left',
    render(row, inx) {
      return row.inx + 1
    },
    rowSpan: (rowData) => getIndex(rowData, optionalItems.value),
  },
  {
    title: '特征名称',
    key: 'optionName',
    width: '100',
    rowSpan: (rowData) => getIndex(rowData, optionalItems.value),
  },
  {
    title: '特征值',
    key: 'value',
    width: '250',
    render: (row) =>
      h(
        'sapn',
        {
          class:
            row.choices.color === '蓝色'
              ? 'text-primary'
              : row.choices.color === '红色'
              ? 'text-red'
              : '',
        },
        row.choices?.choiceName
      ),
  },
])
const concatFixedColumns = ref(columns1.value)
const concatOptionalColumns = ref(columns2.value)

const btnList = [
  { icon: 'COPYING', type: 1, text: '复制' },
  { icon: 'icon_operate_18', type: 2, text: '同选互斥' },
  { icon: 'icon_operate_19', type: 3, text: '可配车辆数量计算' },
  { icon: 'icon_operate_20', type: 4, text: '炸型谱' },
]

const btnDisabled = (btn, row) => {
  if (row.status === '重新工作' || row.status === '设计中') {
    return false
  }
  return [1, 4].includes(btn.type)
}

const renderLabel = (item) => {
  if (item.number === '全部') return '全部'
  return h('span', {}, item?.number, h('span', { class: 'text-red' }, `（${item?.pkNum}）`))
}

const renderBtn = (btn, row, type, inx) => {
  return $toolTipWrap(
    btn.text,
    h(
      NButton,
      {
        size: 'tiny',
        disabled: btnDisabled(btn, row),
        onClick: () => handleClick(btn?.type, row, type, inx),
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
const renderHeader = (checkData, row, type, inx) => {
  return h(
    'div',
    {
      size: 24,
    },
    {
      default: () => [
        h(
          'div',
          { class: 'text-hex-1D2129 text-14 mb-8' },
          `${checkData?.number}`,
          h(
            'span',
            { class: 'text-red' },
            carTotalCount.value[row.oid] ? `(${carTotalCount.value[row.oid]})` : ''
          ),
          h('span', { class: 'text-red' }, ' ' + checkData.status)
        ),
        type === 'fixed'
          ? h(
              'div',
              { class: 'flex items-center' },
              btnList.map((i) => renderBtn(i, row, type, inx))
            )
          : '',
      ],
    }
  )
}

const handleClick = async (type, row, handleState, index) => {
  handleType.value = handleState
  handleIndex.value = index

  switch (type) {
    case 1:
      originOid.value = row.oid
      copyCarRef.value.show(row.name, checkBoxList.value)
      break
    case 2:
      exclusionRuleRef.value.show(row.oid)
      break
    case 3:
      // eslint-disable-next-line no-case-declarations
      try {
        changeLoading(true)
        const res = await getConfigVehicleQty({ oid: row.oid })
        if (res.success) {
          carCountRef.value.show(res.data.quantity)
          carTotalCount.value[row.oid] = res.data.quantity
          /* 点击更新内部车型号数量数据 */
          const innerCardOid = row?.oid // 更新的内部车型号oid
          checkBoxList.value = checkBoxList.value.map((item) => {
            if (item.oid === innerCardOid) {
              return { ...item, pkNum: res.data.quantity }
            }
            return { ...item }
          })
          fetchConfigData()
        }
      } catch (error) {
        console.log('error:', error)
      } finally {
        changeLoading(false)
      }
      break

    case 4:
      try {
        changeLoading(true)
        const res = await getExplodeConfigCode({ oid: row.oid })
        if (res.success) $message.success(res.message, { closable: true, duration: 0 })
      } catch (error) {
        console.log('error:', error)
      } finally {
        changeLoading(false)
      }
      break

    default:
      break
  }
}
const fetchCheckBoxList = async () => {
  const res = await getInternalVehicleModelList({ oid: route.query.oid })
  let list = res.data
  list.unshift({ number: '全部', oid: '0' })
  checkBoxList.value = list
}

const fetchTableData = async () => {
  try {
    loading.value = true
    const res = await getVehicleTypeOptionSet({ oid: route.query.oid, type: 'ALL' })
    let fixedArr = []
    res.data?.fixedItems.forEach((item, inx) => {
      if (item?.choices.length) {
        item.choices.forEach((val, index) => {
          fixedArr.push({ ...item, choices: val, index, inx })
        })
      } else {
        fixedArr.push({ ...item, inx })
      }
    })
    fixedItems.value = fixedArr
    let optionalArr = []
    res.data?.optionalItems.forEach((item, inx) => {
      if (item?.choices.length) {
        item.choices.forEach((val, index) => {
          optionalArr.push({ ...item, choices: val, index, inx })
        })
      } else {
        optionalArr.push({ ...item, inx })
      }
    })
    optionalItems.value = optionalArr
  } catch (error) {
    console.log('error:', error)
  } finally {
    loading.value = false
  }
}

/**
 * 处理内部车型号变化后表头数据
 * @return {*}
 */
const handleTableHeader = () => {
  const chooseData = checkboxValue.value.filter((item) => item !== '0')
  const lastFixedColumnsArr = chooseData.map((item, inx) => {
    const checkData = checkBoxList.value.find((val) => val.oid === item)
    return {
      key: (row, index) => index + item,
      width: 300,
      oid: checkData?.oid,
      name: checkData?.number,
      status: checkData?.status,
      title(column) {
        return renderHeader(checkData, column, 'fixed', inx)
      },
      render(row, index) {
        return h(NSelect, {
          filterable: true,
          value: row.canChoices && row.canChoices[inx]?.value,
          options: featureOption,
          disabled:
            row.readonly === 'Y' ||
            !row?.canChoices ||
            !row?.canChoices[inx] ||
            !['设计中', '重新工作'].includes(checkData.status),
          onUpdateValue(v) {
            /* 获取编辑列数组 */
            const lineData = []
            const deepfixedItems = _.cloneDeep(fixedItems.value)
            deepfixedItems.forEach((line) => {
              if (line?.canChoices && line?.optionOid === row?.optionOid) {
                lineData.push(line?.canChoices[inx])
              }
            })
            const findVIndex = (lineData || []).findIndex((item) => item.value === v)
            if (findVIndex !== -1 && v !== '-') {
              $message.error('相同特征名称不同特征值的技术配置不允许相同')
              return
            }

            /* 只有一行特征值 */
            if (lineData.length === 1 && v === '-') {
              $message.error('只有1个特征值选项时，不允许填写-')
              return
            }
            const stateArr = (lineData || []).filter((item, lineInx) => lineInx !== row.index) ?? []

            if (v === '-' && stateArr.every((item) => item?.value === '-')) {
              $message.error('相同特征名称不同特征值的技术配置不能全为-')
              return
            }
            fixedItems.value[index].canChoices[inx].value = v
          },
        })
      },
    }
  })
  const lastOptionalColumnsArr = chooseData.map((item, inx) => {
    const checkData = checkBoxList.value.find((val) => val.oid === item)
    return {
      key: (row, index) => index + item,
      width: 300,
      oid: checkData?.oid,
      name: checkData?.number,
      title(column) {
        return renderHeader(checkData, column, 'optional', inx)
      },
      render(row, index) {
        return h(NSelect, {
          value: row.canChoices && row.canChoices[inx]?.value,
          options: featureOption,
          disabled:
            row.readonly === 'Y' ||
            !row?.canChoices ||
            !row?.canChoices[inx] ||
            !['设计中', '重新工作'].includes(checkData.status),
          filterable: true,
          onUpdateValue(v) {
            const lineData = []
            optionalItems.value.forEach((line) => {
              if (line?.canChoices && line?.optionOid === row?.optionOid) {
                lineData.push(line?.canChoices[inx])
              }
            })
            const findVIndex = (lineData || []).findIndex((item) => item.value === v)
            if (findVIndex !== -1 && v !== '-') {
              $message.error('相同特征名称不同特征值的技术配置不允许相同')
              return
            }
            /* 只有一行特征值 */
            if (lineData.length === 1 && v === '-') {
              $message.error('只有1个特征值选项时，不允许填写-')
              return
            }
            const stateArr = (lineData || []).filter((item, lineInx) => lineInx !== row.index) ?? []
            if (v === '-' && stateArr.every((item) => item?.value === '-')) {
              $message.error('相同特征名称不同特征值的技术配置不能全为-')
              return
            }
            optionalItems.value[index].canChoices[inx].value = v
          },
        })
      },
    }
  })
  concatFixedColumns.value = [...columns1.value, ...lastFixedColumnsArr]
  concatOptionalColumns.value = [...columns2.value, ...lastOptionalColumnsArr]
}

/**
 * 用于处理选中内部车型号后table数据
 * @param {*} oid //内部车型号oid
 * @param {*} type check选中 uncheck取消选中 uncheckall 取消全部
 * @return {*}
 */
const fetchInternalVehicleModelTechConfig = async (oid, type, index) => {
  /* 取消全部 */
  if (type === 'uncheckall') {
    concatFixedColumns.value = columns1.value
    concatOptionalColumns.value = columns2.value
    fixedItems.value = fixedItems.value.map((val) => {
      delete val?.canChoices
      return { ...val }
    })
    optionalItems.value = optionalItems.value.map((val) => {
      delete val?.canChoices
      return { ...val }
    })
    return
  }
  let res = {}
  if (type === 'check') {
    res = await getInternalVehicleModelTechConfig({ oid })
  }

  /* table数据处理 */
  if (type === 'check') {
    /* 数据追加 */
    let fixedArr = []
    res.data?.fixedItems.forEach((item, inx) => {
      if (item?.choices.length) {
        item.choices.forEach((val, choicesIndex) => {
          fixedArr.push({ ...item, choices: { ...val, docOid: oid }, index: choicesIndex, inx })
        })
      } else {
        fixedArr.push({ ...item, inx })
      }
    })
    fixedItems.value = fixedItems.value.map((val, inx) => {
      let selectCanChoices = val?.canChoices
      const selectIndex = checkboxValue.value
        .filter((it) => it !== '0')
        .findIndex((it) => it === oid)
      if (selectCanChoices && selectIndex !== -1) {
        selectCanChoices.splice(selectIndex, 0, fixedArr[inx]?.choices)
      }
      return {
        ...fixedArr[inx],
        ...val,
        canChoices: val?.canChoices ? selectCanChoices : [fixedArr[inx]?.choices],
      }
    })

    let optionalArr = []
    res.data?.optionalItems.forEach((item, inx) => {
      if (item?.choices.length) {
        item.choices.forEach((val, index) => {
          optionalArr.push({ ...item, choices: { ...val, docOid: oid }, index, inx })
        })
      } else {
        optionalArr.push({ ...item, inx })
      }
    })

    optionalItems.value = optionalItems.value.map((val, inx) => {
      let selectCanChoices = val?.canChoices
      const selectIndex = checkboxValue.value
        .filter((it) => it !== '0')
        .findIndex((it) => it === oid)
      if (selectCanChoices && selectIndex !== -1) {
        selectCanChoices.splice(selectIndex, 0, optionalArr[inx]?.choices)
      }
      return {
        ...optionalArr[inx],
        ...val,
        canChoices: val?.canChoices ? selectCanChoices : [optionalArr[inx]?.choices],
      }
    })
    return
  }
  /* uncheck */
  fixedItems.value = fixedItems.value.map((val) => {
    if (!val?.canChoices) {
      return val
    }
    try {
      val?.canChoices.splice(index, 1)
    } catch (error) {
      console.log('error:', error)
    }
    return { ...val }
  })
  optionalItems.value = optionalItems.value.map((val) => {
    if (!val?.canChoices) {
      return val
    }
    try {
      val?.canChoices.splice(index, 1)
    } catch (error) {
      console.log('error:', error)
    }
    return { ...val }
  })
}

const save = async () => {
  const fixedArr = fixedItems.value.map((item) => ({
    optionType: '固化配置',
    optionOid: item.optionOid,
    choiceOid: item?.choices?.choiceOid,
    techConfigs: item?.canChoices.map((val) => ({ docOid: val?.docOid, value: val?.value })),
  }))
  const optionalArr = optionalItems.value.map((item) => ({
    optionType: '选装配置',
    optionOid: item.optionOid,
    choiceOid: item?.choices?.choiceOid,
    techConfigs: item?.canChoices.map((val) => ({ docOid: val?.docOid, value: val?.value })),
  }))
  const payload = [...fixedArr, ...optionalArr]
  console.log('payload:', payload)
  try {
    changeLoading(true)
    const res = await updateInternalVehicleModelTechConfig({ data: payload, oid: route.query.oid })
    if (res.success) {
      $message.success('更新成功')
    }
  } catch (error) {
    console.log('error:', error)
  } finally {
    changeLoading(false)
  }
}

const reset = async () => {
  await fetchTableData()
  if (business.chooseInternalVehicleModelList.length > 0) {
    checkboxValue.value = business.chooseInternalVehicleModelList
    /* 表头处理 */
    handleTableHeader()
    try {
      loading.value = true
      for (const item of business.chooseInternalVehicleModelList) {
        if (item !== '0') await fetchInternalVehicleModelTechConfig(item, 'check')
      }
    } catch (error) {
      console.log('error:', error)
    } finally {
      loading.value = false
    }
  }
}

/* 复制内部车型号 */
const handleCopyCar = async (copyCarOid) => {
  let changedFixedArr = []
  let changeOptionalArr = []
  const arr = handleType.value === 'fixed' ? fixedItems.value : optionalItems.value
  /* 直接复制 */
  if (checkboxValue.value.includes(copyCarOid)) {
    // originOid
    const copyIndex = checkboxValue.value
      .filter((item) => item !== '0')
      .findIndex((item) => item === copyCarOid)
    /* 被复制数据arr */
    const valueArr1 = fixedItems.value.map((item) =>
      item.canChoices.find((val, inx) => inx === copyIndex)
    )
    const valueArr2 = optionalItems.value.map((item) =>
      item.canChoices.find((val, inx) => inx === copyIndex)
    )
    /* 修改后的数据 */
    changedFixedArr = fixedItems.value.map((item, index) => ({
      ...item,
      canChoices: item?.canChoices.map((val, inx) => {
        if (inx === handleIndex.value) {
          return { ...val, value: valueArr1[index]?.value }
        }
        return val
      }),
    }))
    changeOptionalArr = optionalItems.value.map((item, index) => ({
      ...item,
      canChoices: item?.canChoices.map((val, inx) => {
        if (inx === handleIndex.value) {
          return { ...val, value: valueArr2[index]?.value }
        }
        return val
      }),
    }))
  } else {
    /* 如果源目标车型号在技术配置页面尚未勾选加载源内部车型号的技术配置信息，则需要以源内部车型号oid为参数调用“查询内部车型号技术配置信息接口”获取源内部车型号的技术配置内容 */
    const res = await getInternalVehicleModelTechConfig({ oid: copyCarOid })
    let fixedArr = []
    let optionalArr = []
    res.data?.fixedItems.forEach((item, inx) => {
      if (item?.choices.length) {
        item.choices.forEach((val, index) => {
          fixedArr.push({ ...item, choices: val, index, inx })
        })
      } else {
        fixedArr.push({ ...item, inx, choices: {} })
      }
    })
    res.data?.optionalItems.forEach((item, inx) => {
      if (item?.choices.length) {
        item.choices.forEach((val, index) => {
          optionalArr.push({ ...item, choices: val, index, inx })
        })
      } else {
        optionalArr.push({ ...item, inx, choices: {} })
      }
    })
    /* 存在问题 */

    changedFixedArr = fixedItems.value.map((item, index) => ({
      ...item,
      canChoices: item?.canChoices.map((val, inx) => {
        if (inx === handleIndex.value) {
          return { ...val, value: fixedArr[index]?.choices?.value || null }
        }
        return val
      }),
    }))
    changeOptionalArr = optionalItems.value.map((item, index) => ({
      ...item,
      canChoices: item?.canChoices.map((val, inx) => {
        if (inx === handleIndex.value) {
          return { ...val, value: optionalArr[index]?.choices?.value || null }
        }
        return val
      }),
    }))
  }
  fixedItems.value = changedFixedArr
  optionalItems.value = changeOptionalArr
}

const fetchConfigData = async () => {
  try {
    const res = await getCurrentObjState({ oid: route.query.oid })
    if (res.success) {
      business.handleCurrentObjState(res.data)
    }
  } catch (error) {
    console.log('error:', error)
  }
}

onMounted(async () => {
  fetchCheckBoxList()
  await fetchTableData()
  if (business.chooseInternalVehicleModelList.length > 0) {
    checkboxValue.value = business.chooseInternalVehicleModelList
    /* 表头处理 */
    handleTableHeader()
    try {
      loading.value = true
      for (const item of business.chooseInternalVehicleModelList) {
        if (item !== '0') await fetchInternalVehicleModelTechConfig(item, 'check')
      }
    } catch (error) {
      console.log('error:', error)
    } finally {
      loading.value = false
    }
  }
})
</script>

<style lang="scss" scoped>
::v-deep.n-checkbox .n-checkbox__label {
  --n-text-color: #4e5969;
  font-size: 14px;
}

::v-deep.n-checkbox.n-checkbox--show-label {
  margin-top: 20px;
}

.form {
  border-bottom: 1px solid #eaeaea;
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
</style>
