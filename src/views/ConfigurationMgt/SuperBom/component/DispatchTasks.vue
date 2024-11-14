<template>
  <n-modal v-model:show="showModal" :mask-closable="false" @after-leave="closeModel">
    <div h-100vh w-full rounded-4 bg-white>
      <header h-40 flex items-center flex-justify-between px-20>
        <div flex items-center>
          <div class="line" mr-8></div>
          <span text-14 font-bold text-hex-1d2129>下任务</span>
        </div>
        <img
          src="@/assets/images/close.png"
          alt=""
          class="h-16 w-16 cursor-pointer"
          @click="cancel"
        />
      </header>
      <main h-auto min-h-500 px-20>
        <div class="top" py-10>
          <n-button rounded-4 type="primary" @click="setConfrimTime">批量设置期望完成时间</n-button>
          <n-button type="primary" ml-20 rounded-4 @click="setConfirmRemark">
            批量设置任务说明
          </n-button>
        </div>
        <div class="tableWrap" mt-10>
          <n-data-table
            v-model:checked-row-keys="checkedRowKeys"
            :columns="columns"
            :data="data"
            :pagination="false"
            :row-key="rowKey"
            :scrollbar-props="{ trigger: 'none' }"
            :max-height="600"
            :scroll-x="1000"
            w-full
          />
        </div>
      </main>
      <footer h-70 flex items-center flex-justify-end px-20>
        <n-button @click="cancel">取消</n-button>
        <n-button type="primary" ml-20 :loading="btnLoading" @click="confirm">确定</n-button>
      </footer>
    </div>
  </n-modal>
  <!-- 时间 -->
  <n-modal v-model:show="showTime" :mask-closable="false">
    <div h-300 w-400 rounded-4 bg-white>
      <header h-40 flex items-center flex-justify-between px-20>
        <div flex items-center>
          <div class="line" mr-8></div>
          <span text-14 font-bold text-hex-1d2129>批量设置期望完成时间</span>
        </div>
        <img
          src="@/assets/images/close.png"
          alt=""
          class="h-16 w-16 cursor-pointer"
          @click="cancelTime"
        />
      </header>
      <main h-190 px-40 pt-50>
        <n-date-picker
          v-model:formatted-value="confirmTimeValue"
          :value-format="formatData"
          type="datetime"
          clearable
        />
      </main>
      <footer h-70 flex items-center flex-justify-end px-20>
        <n-button @click="cancelTime">取消</n-button>
        <n-button type="primary" ml-20 @click="confirmTime">确定</n-button>
      </footer>
    </div>
  </n-modal>
  <n-modal v-model:show="showRemark" :mask-closable="false">
    <div min-h-400 w-500 rounded-4 bg-white>
      <header h-40 flex items-center flex-justify-between px-20>
        <div flex items-center>
          <div class="line" mr-8></div>
          <span text-14 font-bold text-hex-1d2129>批量设置任务说明</span>
        </div>
        <img
          src="@/assets/images/close.png"
          alt=""
          class="h-16 w-16 cursor-pointer"
          @click="cancelRemark"
        />
      </header>
      <main min-h-270 px-40 pt-50>
        <n-input
          v-model:value="confirmRemarkValue"
          type="textarea"
          placeholder="请输入任务说明"
          :rows="7"
        />
      </main>
      <footer h-70 flex items-center flex-justify-end px-20>
        <n-button @click="cancelRemark">取消</n-button>
        <n-button type="primary" ml-20 @click="confirmRemark">确定</n-button>
      </footer>
    </div>
  </n-modal>
</template>

<script setup>
import { NDatePicker, NInput } from 'naive-ui'
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { distributeAcTaskList, getAcTaskList } from '~/src/api/config'
const route = useRoute()
const formRef = ref(null)

const emits = defineEmits(['handleConfirm'])
const showModal = ref(false)
const loading = ref(false)
const selectOids = ref([])
const data = ref([])
const showTime = ref(false)
const showRemark = ref(false)
const confirmTimeValue = ref(null)
const confirmRemarkValue = ref('')
const formatData = 'yyyy-MM-dd HH:mm:ss'
const btnLoading = ref(false)

const columns = ref([
  {
    type: 'selection',
  },
  {
    title: '序号',
    key: 'no',
    width: 90,
    render(row, inx) {
      return inx + 1
    },
  },
  {
    title: '任务编号',
    key: 'taskNumber',
    align: 'center',
    width: 120,
  },
  {
    title: 'AC模块名称',
    key: 'acModuleName',
    align: 'center',
    width: 120,
  },
  {
    title: '负责人',
    align: 'center',
    width: 90,
    key: 'owner',
  },
  {
    title: '期望完成时间',
    key: 'expectedCompletionTime',
    width: 220,
    align: 'center',
    render: (row, inx) => {
      return h(NDatePicker, {
        formattedValue: row.expectedCompletionTime || null,
        type: 'datetime',
        clearable: true,
        valueFormat: 'yyyy-MM-dd HH:mm:ss',
        onUpdateFormattedValue(v) {
          data.value[inx]['expectedCompletionTime'] = v
        },
      })
    },
  },
  {
    title: '任务说明',
    key: 'taskRemark',
    render: (row, index) => {
      return h(NInput, {
        value: row.taskRemark,
        onUpdateValue(v) {
          data.value[index]['taskRemark'] = v
        },
      })
    },
  },
])
const rowKey = (row) => row.oid
const checkedRowKeys = ref([])

/* 批量时间 */
const cancelTime = () => {
  confirmTimeValue.value = null
  showTime.value = false
}
const confirmTime = () => {
  data.value = data.value.map((item) => {
    if (checkedRowKeys.value.includes(item.oid)) {
      return { ...item, expectedCompletionTime: confirmTimeValue.value || null }
    }
    return item
  })
  showTime.value = false
}

/* 批量备注 */
const cancelRemark = () => {
  showRemark.value = false
  confirmRemarkValue.value = ''
}
const confirmRemark = () => {
  data.value = data.value.map((item) => {
    if (checkedRowKeys.value.includes(item.oid)) {
      return { ...item, taskRemark: confirmRemarkValue.value }
    }
    return item
  })
  showRemark.value = false
  confirmRemarkValue.value = ''
}

const setConfrimTime = () => {
  if (!checkedRowKeys.value.length) {
    $message.info('请选择任务')
    return
  }
  showTime.value = true
  confirmTimeValue.value = null
}
const setConfirmRemark = () => {
  if (!checkedRowKeys.value.length) {
    $message.info('请选择任务')
    return
  }
  showRemark.value = true
  confirmRemarkValue.value = null
}

const cancel = () => {
  showModal.value = false
}
const confirm = async () => {
  try {
    btnLoading.value = true
    const res = await distributeAcTaskList({
      optionSetOid: route.query.oid,
      task: data.value,
    })
    if (res.success) {
      $message.success('操作成功')
    }
    showModal.value = false
  } catch (error) {
    console.log('error:', error)
  } finally {
    btnLoading.value = false
  }
  // emits('handleConfirm', formValue.value)
}

const fetchData = async () => {
  try {
    loading.value = true
    const payload = selectOids.value.map((item) => ({
      oid: item,
    }))
    const res = await getAcTaskList({ data: payload, optionSetOid: route.query.oid })
    if (res.success) {
      data.value = res.data
    }
  } catch (error) {
    console.log('error:', error)
  } finally {
    loading.value = false
  }
}

const reset = () => {
  formRef.value.restoreValidation()
}

const show = (val) => {
  showModal.value = true
  if (val.length > 0) {
    selectOids.value = val
    fetchData()
  }
}
const close = () => {
  showModal.value = false
}

const closeModel = () => {
  checkedRowKeys.value = []
  data.value = []
  selectOids.value = []
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
