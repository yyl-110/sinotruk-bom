<template>
  <n-modal v-model:show="showModal" :mask-closable="false" @after-leave="closeModel">
    <div h-95vh w-90vw rounded-4 bg-white>
      <header h-40 flex items-center flex-justify-between px-20>
        <div flex items-center>
          <div class="line" mr-8></div>
          <span text-14 font-bold text-hex-1d2129>配置号{{ handleData.number }}AC任务设置</span>
        </div>
        <img
          src="@/assets/images/close.png"
          alt=""
          class="h-16 w-16 cursor-pointer"
          @click="cancel"
        />
      </header>
      <main h-auto px-20>
        <div class="top" py-10>
          <n-button rounded-4 type="primary" @click="setOwer">设置部门负责人</n-button>
          <n-button type="primary" ml-20 rounded-4 @click="setConfrimTime">
            批量设置期望完成时间
          </n-button>
          <n-button type="primary" ml-20 rounded-4 @click="setConfirmRemark">
            批量设置任务说明
          </n-button>
        </div>
        <div class="tableWrap" mt-10 w-full>
          <n-data-table
            v-model:checked-row-keys="checkedRowKeys"
            :columns="columns"
            :pagination="false"
            :row-key="rowKey"
            :scrollbar-props="{ trigger: 'none' }"
            flex-height
            :scroll-x="1820"
            :data="sorterTableData"
            class="tableRef"
            :loading="loading"
            @update:sorter="uploadSorter"
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
    <div min-h-380 w-500 rounded-4 bg-white>
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
  <PeopleSettingModal ref="PeopleSettingModalRef" @handle-confirm="choosePersonResult" />
</template>

<script setup>
import { NButton, NCheckbox, NCheckboxGroup, NDatePicker, NInput } from 'naive-ui'
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { setDepartmentManagerAndDistributeTask, getAcTaskForDepartManager } from '~/src/api/config'
import PeopleSettingModal from '@/components/common/PeopleSettingModal.vue'
import _ from 'lodash'
const route = useRoute()
const formRef = ref(null)

const emits = defineEmits(['handleConfirm', 'goDetail'])
const showModal = ref(false)
const loading = ref(false)
const selectOid = ref(null)
const data = ref([])
const showTime = ref(false)
const showRemark = ref(false)
const confirmTimeValue = ref(null)
const confirmRemarkValue = ref('')
const formatData = 'yyyy-MM-dd HH:mm:ss'
const btnLoading = ref(false)
const handleData = ref({})
const PeopleSettingModalRef = ref(null)
const sortType = ref(null)
const sortKey = ref(null)

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
    resizable: true,
  },
  {
    title: 'AC模块',
    key: 'acModuleName',
    align: 'center',
    resizable: true,
    sorter: 'default',
  },
  {
    title: '配置号负责人',
    align: 'center',
    resizable: true,
    key: 'configCodeUserDisplayName',
    sorter: 'default',
  },
  {
    title: '部门负责人',
    align: 'center',
    resizable: true,
    key: 'departmentDisplayName',
    sorter: 'default',
    render: (row, inx) => {
      return row.departmentDisplayName
        ? h(
            NCheckboxGroup,
            {
              value: row.departmentPeople,
              onUpdateValue: (v) => {
                data.value[inx].departmentPeople = v
              },
            },
            () => {
              return row.departmentDisplayName.map((item, index) => {
                return h(NCheckbox, { label: item, value: row.department[index] })
              })
            }
          )
        : ''
    },
  },
  {
    title: '任务创建时间',
    align: 'center',
    resizable: true,
    key: 'startTime',
    sorter: 'default',
  },
  {
    title: '期望完成时间',
    key: 'expectedCompletionTime',
    resizable: true,
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
    resizable: true,
    render: (row, index) => {
      return h(NInput, {
        value: row.taskRemark,
        type: 'textarea',
        autosize: {
          minRows: 3,
          maxRows: 5,
        },
        onUpdateValue(v) {
          data.value[index]['taskRemark'] = v
        },
      })
    },
  },
  {
    tilte: '',
    key: 'action',
    width: 90,
    align: 'center',
    render: (row) =>
      h(
        NButton,
        {
          text: true,
          color: '#8a2be2',
          class: 'cursor-pointer',
          onClick: () => {
            goDetail(row)
          },
        },
        '特征详情'
      ),
  },
])
const rowKey = (row) => row.oid
const checkedRowKeys = ref([])

const recursiveSort = (data, type) => {
  if (type === 'descend') {
    if (sortKey.value === 'departmentDisplayName') {
      data.sort((a, b) => (b[sortKey.value][0] ?? '').localeCompare(a[sortKey.value][0] ?? ''))
    } else if (sortKey.value === 'startTime') {
      try {
        data.sort((a, b) => new Date(b[sortKey.value]) - new Date(a[sortKey.value]))
      } catch (error) {
        console.log('error:', error)
      }
    } else {
      data.sort((a, b) => (b[sortKey.value] ?? Infinity) - (a[sortKey.value] ?? Infinity))
    }
  }
  if (type === 'ascend') {
    if (sortKey.value === 'departmentDisplayName') {
      data.sort((a, b) => (a[sortKey.value][0] ?? '').localeCompare(b[sortKey.value][0] ?? ''))
    } else if (sortKey.value === 'startTime') {
      try {
        data.sort((a, b) => new Date(a[sortKey.value]) - new Date(b[sortKey.value]))
      } catch (error) {
        console.log('error:', error)
      }
    } else {
      data.sort((a, b) => (a[sortKey.value] ?? Infinity) - (b[sortKey.value] ?? Infinity))
    }
  }
}

const sorterTableData = computed(() => {
  if (!sortType.value) return data.value
  /* 降序 */
  const tableData = _.cloneDeep(data.value)
  recursiveSort(tableData, sortType.value)
  return tableData
})

const uploadSorter = (val) => {
  sortType.value = val?.order
  sortKey.value = val?.columnKey
}

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

const setOwer = () => {
  if (!checkedRowKeys.value.length) {
    $message.info('请选择任务')
    return
  }
  PeopleSettingModalRef.value.show(1)
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
  if (!checkedRowKeys.value.length) {
    $message.info('请选择任务')
    return
  }
  const selectData = data.value.filter((item) => checkedRowKeys.value.includes(item.oid))
  const expectedCompletionTimeArr = selectData
    .filter((item) => !item.expectedCompletionTime)
    .map((item) => item.taskNumber)
  if (expectedCompletionTimeArr.length > 0) {
    const str = expectedCompletionTimeArr.join('，')
    $message.warning(`${str} 没有填写期望完成时间`)
    return
  }
  try {
    btnLoading.value = true
    let deepData = _.cloneDeep(selectData)
    deepData = deepData.map((item) => {
      const objData = { ...item }
      objData.department = objData.departmentPeople
      objData.departmentDisplayName = objData.departmentPeople.map((item) => {
        let _index = objData?.department.findIndex((val) => val === item)
        return objData.departmentDisplayName[_index]
      })
      delete objData.departmentPeople
      return objData
    })
    const res = await setDepartmentManagerAndDistributeTask({
      configCodeOid: selectOid.value,
      data: deepData.map((item) => {
        return {
          ...item,
          department: item.department.join(','),
          departmentDisplayName: item.departmentDisplayName.join(','),
        }
      }),
    })
    if (res.success) {
      $message.success(res.message)
    }
    showModal.value = false
  } catch (error) {
    console.log('error:', error)
  } finally {
    btnLoading.value = false
  }
  // emits('handleConfirm', formValue.value)
}

/* 选择people回调 */
const choosePersonResult = (val) => {
  try {
    data.value = data.value.map((item) => {
      if (checkedRowKeys.value.includes(item.oid)) {
        let departmentDisplayName = val
          .filter((value) => {
            return !item.departmentDisplayName.includes(value.username)
          })
          .map((item) => item.username)
        let department = val
          .filter((value) => {
            return !item.department.includes(value.userid)
          })
          .map((item) => item.userid)
        let departmentPeople = [...item.departmentPeople, ...val.map((item) => item.userid)]
        return {
          ...item,
          departmentDisplayName: [...item.departmentDisplayName, ...departmentDisplayName],
          department: [...item.department, ...department],
          departmentPeople: Array.from(new Set(departmentPeople)),
        }
      }
      return item
    })
  } catch (error) {
    console.log('error:', error)
  }
}

const fetchData = async () => {
  try {
    loading.value = true
    const res = await getAcTaskForDepartManager({ oid: selectOid.value })
    if (res.success) {
      if (res.data instanceof Array) {
        data.value = res.data.map((item) => {
          return {
            ...item,
            department: item.department ? item.department.split(',') : [],
            departmentDisplayName: item.departmentDisplayName
              ? item.departmentDisplayName.split(',')
              : [],
            departmentPeople: item.department ? item.department.split(',') : [],
          }
        })
      }
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
  if (val?.oid) {
    selectOid.value = val?.oid
    handleData.value = val
    fetchData()
  }
}
const close = () => {
  showModal.value = false
}

const closeModel = () => {
  checkedRowKeys.value = []
  data.value = []
  handleData.value = {}
  selectOid.value = null
}

const goDetail = (row) => {
  emits('goDetail', row.oid, row.acModuleName)
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
main {
  height: calc(100% - 110px);
}
.tableRef {
  height: 100%;
}
.tableWrap {
  height: calc(100% - 70px);
}
</style>
