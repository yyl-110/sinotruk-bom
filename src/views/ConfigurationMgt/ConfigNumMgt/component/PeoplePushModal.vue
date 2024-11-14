<template>
  <n-modal v-model:show="showModal" :mask-closable="false">
    <div w-1200 rounded-4 bg-white>
      <header h-40 flex items-center flex-justify-between px-20>
        <div flex items-center>
          <div class="line" mr-8></div>
          <span text-14 font-bold text-hex-1d2129>配置号断点管理</span>
        </div>
        <img
          src="@/assets/images/close.png"
          alt=""
          class="h-16 w-16 cursor-pointer"
          @click="cancel"
        />
      </header>
      <main min-h-500 px-20 pt-20>
        <n-data-table
          v-model:checked-row-keys="checkedRowKeys"
          :columns="columns"
          :data="tableData"
          :pagination="false"
          :loading="loading"
          :max-height="500"
          :scroll-x="1020"
          :row-key="rowKey"
        />
      </main>
      <footer h-70 flex items-center flex-justify-end px-20>
        <n-button mr-20 @click="cancel">取消</n-button>
        <n-button type="primary" :disabled="!tableData.length" @click="handPush">确定</n-button>
      </footer>
    </div>
  </n-modal>
</template>

<script setup>
import dayjs from 'dayjs'
import { NButton, NDatePicker, NIcon } from 'naive-ui'
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { getPushConfigCodeList, manualPushStartConfigCode } from '~/src/api/config'
import { useAppStore } from '~/src/store'

const route = useRoute()
const emits = defineEmits(['handleConfirm'])
const showModal = ref(false)
const loading = ref(false)
const rowKey = (row, index) => row?.oid
const { changeLoading } = useAppStore()
const checkedRowKeys = ref([])

const columns = [
  {
    type: 'selection',
    multiple: false,
  },
  {
    title: '需要手动推送的配置号',
    key: 'configCode',
    width: 300,
  },
  {
    title: '车型子类版本',
    key: 'version',
    width: 120,
  },
  {
    title: '车型子类工厂视图及修改者',
    key: 'modifier',
    width: 160,
  },
  {
    title: '车型子类计划生效日期',
    key: 'vehiclePartEffDate',
    width: 140,
  },
  {
    title: '车型子类生效日期',
    key: 'actualEffectiveTime',
    width: 200,
    render: (row, inx) => {
      return h(NDatePicker, {
        formattedValue: row.actualEffectiveTime || null,
        type: 'date',
        clearable: true,
        valueFormat: 'yyyy-MM-dd',
        placeholder: '选择生效日期',
        // isDateDisabled: disablePreviousDate,
        onUpdateFormattedValue(v) {
          tableData.value[inx]['actualEffectiveTime'] = v
        },
      })
    },
  },
]
const tableData = ref([])
const cancel = () => {
  showModal.value = false
}

const confirm = async () => {}

const disablePreviousDate = (ts) => {
  return ts < Date.now()
}

const show = () => {
  fetchData()
  showModal.value = true
}
const close = () => {
  showModal.value = false
}

const fetchData = async () => {
  try {
    loading.value = true
    const res = await getPushConfigCodeList({ oid: route.query.oid })
    tableData.value = res.data || []
  } catch (error) {
    console.log('error:', error)
  } finally {
    loading.value = false
  }
}

const handPush = async () => {
  if (!checkedRowKeys.value.length) {
    $message.warning('请选择数据')
    return
  }
  const selectObj = tableData.value.find((item) => item.oid === checkedRowKeys.value[0])
  const actualEffectiveTime = selectObj?.actualEffectiveTime
  if (!actualEffectiveTime) {
    $message.warning('时间不能为空')
    return
  }
  /* 时间判断处理 === 必须大于今天 */
  if (dayjs(actualEffectiveTime).isValid()) {
    const dateToCompare = dayjs(actualEffectiveTime)
    const isGreaterThanToday = dateToCompare.isAfter(dayjs(), 'day')
    const daySame = dateToCompare.isSame(dayjs(), 'day')
    if (!isGreaterThanToday && !daySame) {
      $message.warning('不能选择今天之前的日期')
      return
    }
  }
  $dialog.confirm({
    title:
      '请确认当前车型子类生效日期的版本与现在推送立即生效的配置号在业务上是否吻合，吻合点确定操作，否则点击取消操作',
    async confirm() {
      try {
        changeLoading(true)
        const res = await manualPushStartConfigCode({
          oid: selectObj?.oid,
          vehicleTypeEffDate: actualEffectiveTime,
        })
        if (res.success) {
          $message.success(res?.message || '推送成功')
          showModal.value = false
        }
      } catch (error) {
        console.log('error:', error)
      } finally {
        changeLoading(false)
      }
    },
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
</style>
