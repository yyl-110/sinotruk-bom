<template>
  <CommonPage sub-title="配置号管理" back="mgt">
    <div min-h-full w-full px-20 pt-20>
      <!-- <child-title /> -->
      <config-mgt-nav :select="8" />
      <n-grid
        cols="10 s:10 m:10 l:10 xl:10 2xl:10"
        responsive="screen"
        class="gridWrap"
        :x-gap="20"
        mt-5
        lt-lg:h-auto
      >
        <n-grid-item span="10 s:10 m:10 l:2 xl:2 2xl:2">
          <Collapse w-full title="分组配置">
            <template #content>
              <n-space :size="[20, 20]">
                <Card
                  v-for="(item, index) in groupConds"
                  :key="item.id"
                  :title="item.title"
                  is-choose
                  :card-type="2"
                >
                  <template #select>
                    <div class="select">
                      <n-select
                        v-model:value="groupConds[index].value"
                        :render-option="$renderTooltip"
                        placeholder="请选择"
                        :options="item.values"
                        label-field="value"
                        value-field="key"
                        filterable
                        text-center
                      />
                    </div>
                  </template>
                </Card>
              </n-space>
            </template>
          </Collapse>
        </n-grid-item>
        <n-grid-item span="10 s:10 m:10 l:4 xl:4 2xl:4">
          <Collapse w-full title="固化配置">
            <template #content>
              <n-space :size="[20, 20]">
                <Card
                  v-for="(item, index) in fixedConds"
                  :key="item.id"
                  :title="item.title"
                  is-choose
                  :card-type="2"
                >
                  <template #select>
                    <div class="select">
                      <n-select
                        v-model:value="fixedConds[index].value"
                        :render-option="$renderTooltip"
                        placeholder="请选择"
                        :options="item.values"
                        label-field="value"
                        value-field="key"
                        filterable
                        text-center
                      />
                    </div>
                  </template>
                </Card>
              </n-space>
            </template>
          </Collapse>
        </n-grid-item>
        <n-grid-item span="10 s:10 m:10 l:4 xl:4 2xl:4">
          <Collapse w-full title="选装配置">
            <template #content>
              <n-space :size="[20, 20]">
                <Card
                  v-for="(item, index) in optionalConds"
                  :key="item.id"
                  :title="item.title"
                  is-choose
                  :card-type="2"
                >
                  <template #select>
                    <div class="select">
                      <n-select
                        v-model:value="optionalConds[index].value"
                        :render-option="$renderTooltip"
                        placeholder="请选择"
                        :options="item.values"
                        label-field="value"
                        value-field="key"
                        filterable
                        text-center
                      />
                    </div>
                  </template>
                </Card>
              </n-space>
            </template>
          </Collapse>
        </n-grid-item>
      </n-grid>
      <div class="form" mt-20 min-h-48 flex items-center py-10>
        <n-form
          ref="formRef"
          :model="formValue"
          label-placement="left"
          require-mark-placement="right-hanging"
          :rules="false"
          inline
          min-h-32
          flex-wrap
          class="searchForm"
        >
          <n-form-item label="配置号">
            <n-input
              v-model:value="formValue.ConfigCode"
              placeholder="请输入配置号查询"
              max-w-160
              @keydown.enter="handleClick2({ type: 1 })"
            ></n-input>
          </n-form-item>
          <n-form-item label="短码">
            <n-input
              v-model:value="formValue.number"
              placeholder="请输入短码查询"
              max-w-160
              @keydown.enter="handleClick2({ type: 1 })"
            ></n-input>
          </n-form-item>
          <n-form-item label="主推">
            <n-select
              v-model:value="formValue.mainRecom"
              :options="ZTenum"
              placeholder="请选择"
              label-field="value"
              value-field="key"
              filterable
              max-w-150
              min-w-80
            />
          </n-form-item>
          <n-form-item label="状态">
            <n-select
              v-model:value="formValue.status"
              :options="STATEENUM"
              placeholder="请选择"
              label-field="value"
              value-field="key"
              filterable
              max-w-150
              min-w-80
            />
          </n-form-item>
          <n-form-item label="推送状态">
            <n-select
              v-model:value="formValue.pushStatus"
              :options="TSSTATEENUM"
              placeholder="请选择"
              label-field="value"
              value-field="key"
              filterable
              max-w-150
              min-w-80
            />
          </n-form-item>
          <n-form-item label="资源状态">
            <n-select
              v-model:value="formValue.sourceStatus"
              :options="isSpecial ? SPECIALZYSTATEENUM : ZYSTATEENUM"
              placeholder="请选择"
              label-field="value"
              value-field="key"
              filterable
              max-w-150
              min-w-80
            />
          </n-form-item>
          <n-form-item label="型谱变化">
            <n-select
              v-model:value="formValue.spectrumStatus"
              :options="XPBHENUM"
              placeholder="请选择"
              label-field="value"
              value-field="key"
              filterable
              max-w-150
              min-w-80
            />
          </n-form-item>
          <n-form-item ml-auto>
            <n-button
              v-for="item in btnList2"
              :key="item.type"
              :type="item.type === 1 ? 'primary' : ''"
              ml-10
              @click="handleClick2(item)"
            >
              <template #icon>
                <TheIcon :icon="item.icon" type="custom" :size="18" class="mr-3" />
              </template>
              {{ item.text }}
            </n-button>
          </n-form-item>
        </n-form>
      </div>
      <n-scrollbar x-scrollable mt-20 h-auto pb-20>
        <n-space :size="[20, 10]" :wrap="false">
          <n-button
            v-for="item in isSpecial ? specialBtnList : btnList"
            :key="item.type"
            type="primary"
            :disabled="item.type === 11 && !currentObjState?.pushFlag"
            :style="{ color: item.color ? item.color : '' }"
            @click="handleClickOption(item.type)"
          >
            <template v-if="item.icon" #icon>
              <TheIcon
                :icon="item.icon"
                type="custom"
                :size="18"
                class="mr-3"
                :color="item.color ? item.color : ''"
              />
            </template>
            {{ item.text }}
          </n-button>
        </n-space>
      </n-scrollbar>
      <a-table
        :expanded-row-keys="expandedRowKeys"
        :columns="columns"
        :data-source="tableData"
        :loading="loading"
        :row-key="rowKey"
        :pagination="false"
        :row-selection="rowSelection"
        :scroll="{ x: '100%', y: 500 }"
        @expand="expandChange"
      >
        <template #expandedRowRender="{ column, record, index }">
          <div v-if="expandedRowKeys[0] === record.oid" mx-auto class="childTable">
            <ChildBomTable
              ref="ChildBomTableRef"
              :click-index="index"
              :click-row="record"
              :optional-oid="optionalConds"
            />
          </div>
        </template>
        <template #bodyCell="{ column, record, index }">
          <template v-if="column.key === 'index'">
            {{ index + 1 }}
          </template>
          <!-- <template v-if="column.key === 'action'">
            <a-tooltip>
              <template #title>手动推送</template>
              <a-button
                mr-20
                h-30
                w-30
                flex
                items-center
                justify-center
                rounded-10
                p-0
                @click="handPush(column, record)"
              >
                <the-icon :size="14" type="custom" icon="icon_operate_23" color="#1890FF" />
              </a-button>
            </a-tooltip>
          </template> -->
        </template>
      </a-table>
      <div mt-20 flex flex-justify-end>
        <n-pagination
          v-model:page="page"
          v-model:page-size="pageSize"
          :page-count="pagination.pageCount"
          :page-sizes="pagination.pageSizes"
          show-size-picker
          show-quick-jumper
          :[aaa]="['size-picker', 'pages', 'quick-jumper']"
          @update:page="pagination.onChange"
          @update:page-size="pagination.onUpdatePageSize"
        />
      </div>
    </div>
    <task-look-modal ref="taskLookRef" @handle-look="handleLookAc" />
    <properties-modal ref="propertiesRef" @handle-confirm="confirmProperties" />
    <config-detail-modal ref="configDetailRef" />
    <main-push-set-modal ref="MainPushSetRef" />
    <StopSettingModal ref="StopSettingModalRef" />
    <AcInsertModal ref="acInsertRef" />
    <PeoplePushModal ref="peoplePushModalRef" />
    <TaskSetting ref="TaskSettingRef" @go-detail="handleGoDetail" />
    <DispatchTask ref="dispatchTaskRef" @go-detail="handleGoDetail" />
    <CheckResult ref="CheckResultRef" />
  </CommonPage>
</template>

<script setup>
import {
  SPECIALZYSTATEENUM,
  ZYSTATEENUM,
  XPBHENUM,
  TSSTATEENUM,
  STATEENUM,
  ZTenum,
  searchDesc,
} from './data'
import ConfigMgtNav from '../component/ConfigMgtNav.vue'
import Collapse from '../component/Collapse.vue'
import Card from './component/card.vue'
import TaskLookModal from './component/TaskLookModal.vue'
import PropertiesModal from './component/PropertiesModal.vue'
import ConfigDetailModal from './component/ConfigDetailModal.vue'
import MainPushSetModal from './component/MainPushSetModal.vue'
import StopSettingModal from './component/StopSettingModal.vue'
import AcInsertModal from '../SuperBom/component/AcInsertModal.vue'
import PeoplePushModal from './component/PeoplePushModal.vue'
import ChildBomTable from './component/ChildBomTable.vue'
import TaskSetting from './component/TaskSetting.vue'
import DispatchTask from './component/DispatchTask.vue'
import CheckResult from './component/CheckResult.vue'
import { useRoute, useRouter } from 'vue-router'
import {
  deleteNonePushConfigCode,
  getConfigCode,
  getConfigCodeList,
  preSourceDetection,
  setConfigCodeMainRecom,
  specialVehicleSourceDetection,
  startDisableConfigCodeWF,
  startEnableConfigCodeWF,
  startSourceDetectionWF,
} from '~/src/api/config'
import { computed, onActivated, onBeforeUnmount, onDeactivated, onMounted, onUnmounted } from 'vue'
import _ from 'lodash'
import { useAppStore, useBusinessStore } from '~/src/store'
import { btnList, specialBtnList, btnList2 } from './data'
import { storeToRefs } from 'pinia'
const businessStore = useBusinessStore()
const { currentObjState } = storeToRefs(businessStore)
const route = useRoute()
const router = useRouter()
const { changeLoading } = useAppStore()
defineOptions({ name: 'ConfigNumMgt' })

const itemsAlign = 'align'
const selectedRows1 = ref([])
const taskLookRef = ref(null)
const MainPushSetRef = ref(null)
const propertiesRef = ref(null)
const configDetailRef = ref(null)
const StopSettingModalRef = ref(null)
const peoplePushModalRef = ref(null)
const acInsertRef = ref(null)
const ChildBomTableRef = ref(null)
const TaskSettingRef = ref(null)
const dispatchTaskRef = ref(null)
const CheckResultRef = ref(null)
const aaa = 'display-order'
const formRef = ref(null)
const formValue = ref({})
const loading = ref(false)
const pageSize = ref(20)
const page = ref(1) // 页码
/* 分组配置-固化配置-选装配置 */
const fixedConds = ref([])
const groupConds = ref([])
const optionalConds = ref([])

const expandedRowKeys = ref([])
const expandChange = (expanded, expandedRows) => {
  if (!expanded) {
    expandedRowKeys.value = []
  } else {
    expandedRowKeys.value = [expandedRows.oid]
  }
}
const isSpecial = computed(() => currentObjState.value.configVehicle === '特殊车型')

const columns = ref([])

const tableData = ref([{ name: '', oid: '' }])

const rowKey = (row, index) => {
  return row.oid
}

const rowSelection = ref({
  onChange: (selectedRowKeys, selectedRows) => {
    // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
  },
  onSelect: (record, selected, selectedRows) => {
    selectedRows1.value = [...selectedRows]
    // console.log(record, selected, selectedRows)
  },
  onSelectAll: (selected, selectedRows, changeRows) => {
    console.log('selectedRows:3', selectedRows)
    selectedRows1.value = selectedRows
    // console.log(selected, selectedRows, changeRows)
  },
})

const pagination = ref({
  pageCount: 0,
  showSizePicker: true,
  showQuickJumper: true,
  page: page.value,
  pageSizes: [20, 50, 100, 500],
  pageSize: pageSize.value,
  displayOrder: ['size-picker', 'pages', 'quick-jumper'],
  onUpdatePageSize: (size) => {
    page.value = 1
    pageSize.value = size
    fetchData()
  },
  onChange: (pages) => {
    page.value = pages
    fetchData()
  },
})

const confirmProperties = () => {
  fetchData()
}

const handleLookAc = (oid, acName = '') => {
  acInsertRef.value.show(oid, 1, 'configuration', acName)
}

const handleAllLook = async () => {
  if (!selectedRows1.value.length) {
    $message.info('请选择配置号')
    return
  }
  $dialog.confirm({
    content: '请确认是否进行批量探查',
    async confirm() {
      /* 特殊车型 */
      if (isSpecial.value) {
        try {
          const data = selectedRows1.value.map((item) => ({ oid: item.oid }))
          const res = await specialVehicleSourceDetection({ data })
          if (res.success && res.message === '不封闭') {
            CheckResultRef.value.show(res.data)
          } else if (res.success) {
            $message.success(res.message || '探查成功!')
          }
        } catch (error) {
          console.log('error:', error)
        }
        return
      }
      try {
        const res = await startSourceDetectionWF({
          data: selectedRows1.value.map((item) => ({ oid: item?.oid })),
        })
        if (res.success) {
          $message.success(res.message)
        }
        console.log('res:', res)
      } catch (error) {
        console.log('error:', error)
      }
    },
  })
}

const handleSetConfigCodeMainRecom = async () => {
  if (!selectedRows1.value.length) {
    $message.info('请选择配置号')
    return
  }
  try {
    const res = await setConfigCodeMainRecom({
      data: selectedRows1.value.map((item) => ({ oid: item?.oid })),
    })
    console.log('res:', res)
  } catch (error) {
    console.log('error:', error)
  }
}

const handleClick2 = (item) => {
  switch (item.type) {
    case 1:
      // eslint-disable-next-line no-case-declarations
      const searchQuery = JSON.stringify({
        fixedConds: fixedConds.value,
        groupConds: groupConds.value,
        optionalConds: optionalConds.value,
      })
      sessionStorage.setItem('configNumMgtSearchQuery', searchQuery)
      fetchData()
      if (expandedRowKeys.value.length > 0) {
        ChildBomTableRef.value.fetchData()
      }
      break

    case 2:
      fixedConds.value = fixedConds.value.map((item) => ({ ...item, value: null }))
      groupConds.value = groupConds.value.map((item) => ({ ...item, value: null }))
      optionalConds.value = optionalConds.value.map((item) => ({ ...item, value: null }))
      // eslint-disable-next-line no-case-declarations
      const formdata = {}
      for (const i in formValue.value) {
        formdata[i] = null
      }
      formValue.value = formdata
      fetchData()
      if (expandedRowKeys.value.length > 0) {
        ChildBomTableRef.value.fetchData()
      }
      break
    case 4:
      /* 未开发 */
      $dialog.confirm({
        content: '确认是否清空除了已推送的所有配置号',
        async confirm() {
          try {
            const res = await deleteNonePushConfigCode({ oid: route.query.oid })
            if (res?.success) {
              $message.success('操作成功')
              fetchData()
            }
          } catch (error) {
            console.log('error:', error)
          }
        },
      })
      // fixedConds.value = fixedConds.value.map((item) => ({ ...item, value: null }))
      // groupConds.value = groupConds.value.map((item) => ({ ...item, value: null }))
      // optionalConds.value = optionalConds.value.map((item) => ({ ...item, value: null }))
      break

    default:
      break
  }
}

/* 手动推送 */
const handPush = () => {
  // if (row.status !== '启用') {
  //   $message.error('只允许针对启用状态配置号手动推送')
  //   return
  // }
  // $dialog.confirm({
  //   content:
  //     '请确认当前车型子类生效时间的版本与现在推送立即生效的配置号在业务上是否吻合，吻合点确定操作，否则点击取消操作',
  //   negativeText: '取消',
  //   positiveText: '确认',
  // })
  peoplePushModalRef.value.show()
}

const handleClickOption = async (type) => {
  switch (type) {
    case 1:
      handleAllLook()
      break
    case 4:
      if (!selectedRows1.value.length) {
        $message.info('请选择配置号')
        return
      }
      if (selectedRows1.value.length > 1) {
        $message.error('只允许选择一个配置号设置属性')
        return
      }
      // eslint-disable-next-line no-case-declarations
      const oid1 = selectedRows1.value[0]?.oid
      propertiesRef.value.show(
        oid1,
        tableData.value.find((item) => item.oid === oid1)
      )
      break
    case 5:
      start()
      break
    case 6:
      if (!selectedRows1.value.length) {
        $message.info('请选择配置号')
        return
      }
      /* 过滤未启用 */
      StopSettingModalRef.value.show(selectedRows1.value.filter((item) => item.status !== '未启用'))
      break
    case 2:
      if (!selectedRows1.value.length) {
        $message.info('请选择配置号')
        return
      }
      if (selectedRows1.value.length > 1) {
        $message.error('只允许选择一个配置号查看AC任务')
        return
      }
      taskLookRef.value.show(selectedRows1.value[0])
      break
    case 3:
      if (!selectedRows1.value.length) {
        $message.info('请选择配置号')
        return
      }
      if (selectedRows1.value.length > 1) {
        $message.error('只允许选择一个配置号设置任务')
        return
      }
      TaskSettingRef.value.show(selectedRows1.value[0])
      break
    case 7:
      if (!selectedRows1.value.length) {
        $message.info('请选择配置号')
        return
      }
      if (selectedRows1.value.length > 1) {
        $message.error('只允许选择一个配置号查看明细')
        return
      }
      // eslint-disable-next-line no-case-declarations
      const oid = selectedRows1.value[0]?.oid
      configDetailRef.value.show(oid)
      break
    case 8:
      if (!selectedRows1.value.length) {
        $message.info('请选择配置号')
        return
      }
      // if (selectedRows1.value.length > 1) {
      //   $message.error('只允许选择一个配置号设置属性')
      //   return
      // }
      // eslint-disable-next-line no-case-declarations
      const arr = selectedRows1.value.map((item) => ({
        oid: item.oid,
      }))
      router.push({
        path: '/configuration/super-bom',
        query: {
          oid: route.query.oid,
          number: route.query.number,
          expOid: encodeURIComponent(JSON.stringify(arr)),
        },
      })
      break
    case 9:
      if (!selectedRows1.value.length) {
        $message.info('请选择配置号')
        return
      }
      if (selectedRows1.value.length > 1) {
        $message.error('只允许选择一个配置号进行虚拟探查')
        return
      }
      // eslint-disable-next-line no-case-declarations
      const configOid = selectedRows1.value[0]?.oid
      // eslint-disable-next-line no-case-declarations
      try {
        changeLoading(true)
        const res = await preSourceDetection({ oid: configOid })
        if (res.success) {
          $message.success('操作成功')
        }
      } catch (error) {
        console.log('error:', error)
      } finally {
        changeLoading(false)
      }
      break
    case 10:
      if (!selectedRows1.value.length) {
        $message.info('请选择配置号')
        return
      }
      if (selectedRows1.value.length > 1) {
        $message.error('只允许选择一个配置号下发任务')
        return
      }
      dispatchTaskRef.value.show(selectedRows1.value[0])
      break

    case 11:
      handPush()
      break

    default:
      break
  }
}
const fetchConfig = async () => {
  const res = await getConfigCode({ oid: route.query.oid })
  /* 缓存搜索数据 */
  const configNumMgtSearchQuery = JSON.parse(
    sessionStorage.getItem('configNumMgtSearchQuery') || '{}'
  )
  const {
    groupConds: _groupConds = [],
    fixedConds: _fixedConds = [],
    optionalConds: _optionalConds = [],
  } = configNumMgtSearchQuery || {}
  groupConds.value = res.data.groupConds.map((item) => ({
    ...item,
    value: _groupConds.find((val) => val.id === item.id)?.value || null,
  }))
  fixedConds.value = res.data.fixedConds.map((item) => ({
    ...item,
    value: _fixedConds.find((val) => val.id === item.id)?.value || null,
  }))
  optionalConds.value = res.data.optionalConds.map((item) => ({
    ...item,
    value: _optionalConds.find((val) => val.id === item.id)?.value || null,
  }))
}
const fetchData = async () => {
  try {
    loading.value = true
    const baseConds = Object.keys(searchDesc)
      .map((key) => {
        return {
          id: key,
          title: searchDesc[key],
          value: formValue.value[key] && formValue.value[key].trim(),
        }
      })
      .filter((val) => val.value)
    const payload = {
      groupConds: groupConds.value.filter((item) => item.value),
      fixedConds: fixedConds.value.filter((item) => item.value),
      optionalConds: optionalConds.value.filter((item) => item.value),
      baseConds,
    }
    console.log('payload:', payload)
    const res = await getConfigCodeList({
      oid: route.query.oid,
      page: page.value,
      count: pageSize.value,
      data: {
        ...payload,
      },
    })
    let { titles = [], items = [] } = res.data
    tableData.value = items
    titles.unshift({ titleName: '序号', titleID: 'index', width: 60, fixed: 'left' })
    // titles.push({ titleName: '操作', titleID: 'action', width: 60, fixed: 'right' })
    columns.value = titles.map((item) => ({
      title: item.titleName,
      dataIndex: item.titleID,
      key: item.titleID,
      width: item.width || 160,
      fixed: item.fixed || '',
    }))
    pagination.value.pageCount = res.pages
    pagination.value.pageSize = pageSize.value
    pagination.value.page = page.value
  } catch (error) {
    console.log('error:', error)
  } finally {
    loading.value = false
  }
}
const fetchDetail = async () => {}

const start = async () => {
  if (!selectedRows1.value.length) {
    $message.info('请选择配置号')
    return
  }
  const res = await startEnableConfigCodeWF({
    data: selectedRows1.value.map((item) => ({ oid: item.oid })),
  })
  if (res.success) {
    $message.success('启动成功')
    fetchData()
  }
}
const stop = async () => {
  if (!selectedRows1.value.length) {
    $message.info('请选择配置号')
    return
  }
  const res = await startDisableConfigCodeWF({
    data: selectedRows1.value.map((item) => ({ oid: item.oid })),
  })
  if (res.success) {
    $message.success('停用成功')
    fetchData()
  }
}

//查看特征详情
const handleGoDetail = (oid, acModuleName = '') => {
  acInsertRef.value.show(oid, 2, '', acModuleName)
}

// onMounted(async () => {
//   /* 缓存搜索数据 */
//   const configNumMgtSearchQuery = JSON.parse(sessionStorage.getItem('configNumMgtSearchQuery'))
//   if (configNumMgtSearchQuery) {
//     await fetchConfig()
//   } else {
//     fetchConfig()
//   }
//   fetchData()
// })
onActivated(async () => {
  /* 缓存搜索数据 */
  const configNumMgtSearchQuery = JSON.parse(sessionStorage.getItem('configNumMgtSearchQuery'))
  if (configNumMgtSearchQuery) {
    await fetchConfig()
  } else {
    fetchConfig()
  }
  fetchData()
})
onDeactivated(() => {
  fixedConds.value = []
  groupConds.value = []
  optionalConds.value = []
})
</script>

<style lang="scss" scoped>
.form {
  border-bottom: 1px solid #eaeaea;
  border-top: 1px solid #eaeaea;
}
::v-deep.n-form-item .n-form-item-feedback-wrapper {
  --n-feedback-height: 0;
}

::v-deep:where(.css-dev-only-do-not-override-40xy44).ant-table-wrapper .ant-table-thead > tr > th,
:where(.css-dev-only-do-not-override-40xy44).ant-table-wrapper .ant-table-thead > tr > td {
  background: #f2f3f5;
  font-size: 14px;
  color: #1d2129;
  font-weight: 400;
  height: 48px;
  box-sizing: border-box;
  line-height: 27px;
}
::v-deep .childTable .ant-table-thead > tr > th {
  background: #f2f3f5 !important;
  font-size: 14px;
  color: #1d2129;
}

::v-deep .ant-table-cell {
  padding: 10px 16px !important;
  color: #4e5969;
  font-size: 14px;
}
::v-deep.select .n-base-selection .n-base-selection-label .n-base-selection-input {
  color: var(--primary-color);
}
::v-deep
  .select
  .n-base-selection
  .n-base-selection-placeholder
  .n-base-selection-placeholder__inner {
  color: var(--primary-color);
  text-decoration: underline;
  text-align: center;
  width: 100%;
}
.searchForm {
  .n-form-item {
    &:not(:last-child) {
      margin-bottom: 20px;
    }
  }
}
</style>
