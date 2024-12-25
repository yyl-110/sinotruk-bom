<template>
  <n-modal v-model:show="showModal" :mask-closable="false" @after-leave="closeModel">
    <div h-95vh w-90vw rounded-4 bg-white>
      <header h-40 flex items-center flex-justify-between px-20>
        <div flex items-center>
          <div class="line" mr-8></div>
          <span text-14 font-bold text-hex-1d2129>
            {{ modalType === 1 ? `AC实例录入(${acName})` : `特征详情(${acName})` }}
          </span>
        </div>
        <img
          src="@/assets/images/close.png"
          alt=""
          class="h-16 w-16 cursor-pointer"
          @click="cancel"
        />
      </header>
      <main h-auto min-h-500 px-20>
        <n-data-table
          :columns="columns"
          :data="tableData"
          :pagination="false"
          :max-height="tableHeight"
          :loading="loading"
          mt-20
          :scroll-x="scrollxWidth"
          :scrollbar-props="{ trigger: 'none' }"
        />
        <div
          v-if="!columns.length && !loading"
          class="empty h-500 w-full flex items-center justify-center"
        >
          <n-empty description="暂无数据"></n-empty>
        </div>
      </main>
      <footer v-if="modalType === 1" h-70 flex items-center flex-justify-end px-20>
        <n-button type="primary" @click="confirm">确定</n-button>
      </footer>
    </div>
  </n-modal>
  <AddNowModal v-if="modalType === 1" ref="addNowRef" />
</template>

<script setup>
import AddNowModal from './AddNowModal.vue'

import { computed, ref } from 'vue'
import {
  addSamePosFeatureAcPart,
  checkGeneratePartNumber,
  getACModelEnterList,
} from '~/src/api/config'
import { useRoute } from 'vue-router'
import { NInput } from 'naive-ui'
const route = useRoute()
const formValue = ref({})
const formRef = ref(null)

const emits = defineEmits(['handleConfirm'])
const showModal = ref(false)
const addNowRef = ref(null)
const loading = ref(false)
const modalType = ref(1) // 1-ac实例 2-特征详情
const jumpTypeData = ref('')
const acCode = ref('')
const showRowOid = ref('')

const tableData = ref([])
const columns = ref([])
const acName = ref('')

const scrollxWidth = computed(() => 150 * columns.value.length)

const cancel = () => {
  showModal.value = false
}
const confirm = () => {
  showModal.value = false
  // emits('handleConfirm', formValue.value)
}

const tableHeight = computed(() => {
  return window.innerHeight * 0.95 - 180
})

const reset = () => {
  formRef.value.restoreValidation()
}

/**
 * @param {*} oid
 * @param {*} type 1 录入 2 特征详情
 * @param {*} jumpType 'single' 单独页面跳转 'configuration' 配置管理下的查看AC任务
 * @param {*} name 特征详情展示
 * @return {*}
 */
const show = (oid, type = 1, jumpType = '', name = '') => {
  modalType.value = type
  jumpTypeData.value = jumpType
  acName.value = name
  fetchData(oid)
  showRowOid.value = oid
  showModal.value = true
}
const close = () => {
  showModal.value = false
}

const fetchData = async (oid) => {
  try {
    loading.value = true
    const res = await getACModelEnterList({ oid })
    let { titles = [], items = [] } = res?.data || {}
    tableData.value = items
    columns.value = titles.map((item) => ({
      title: item.titleName,
      dataIndex: item.titleID,
      key: item.titleID,
      width: item.width || 150,
      fixed: item.titleID === 'action' ? 'right' : '',
      render: (row) =>
        item.titleID === 'action'
          ? h(
              'div',
              { class: 'flex items-center text-primary cursor-pointer' },
              row.action
                .split(',')
                .map((val) => h('span', { class: 'mr-20', onClick: () => btnClick(val, row) }, val))
            )
          : row[item?.titleID]?.includes('$$$')
          ? h('span', { class: 'text-red' }, row[item?.titleID].replace('$$$', ''))
          : row[item?.titleID],
    }))
    /* 特征详情无操作列 */
    modalType.value !== 1 && columns.value.pop()
  } catch (error) {
    console.log('error:', error)
  } finally {
    loading.value = false
  }
}

const btnClick = async (val, row) => {
  if (val === '新建AC实例') {
    $dialog.confirm({
      content: '请确认是否新建AC实例',
      negativeText: '取消',
      positiveText: '确认',
      async confirm() {
        let url = row.url
        if (jumpTypeData.value === 'single') {
          url = `${url}&type=task&itemOid=${route.query.oid}&number=''`
        }
        if (jumpTypeData.value === 'configuration') {
          url = `${url}&type=configuration&itemOid=${route.query.oid}&number=${route.query.number}`
        }
        const res = await checkGeneratePartNumber({ oid: row.oid })
        if (res.code === 200) {
          if (res?.message === '需要输入AC实例编号') {
            /* 让用户输入 */
            $dialog.confirm({
              content: () =>
                h('div', { class: ' flex items-center pt-30' }, [
                  h('span', { class: 'flex-shrink-0' }, 'AC实例编号：'),
                  h(NInput, {
                    class: ' ml-10 flex-shrink-0 important-w-auto',
                    placeholder: '请输入AC实例编号',
                    value: acCode.value,
                    onUpdateValue(v) {
                      acCode.value = v
                    },
                  }),
                ]),
              title: 'AC实例编号',
              negativeText: '取消',
              positiveText: '确认',
              confirm() {
                window.open(`${url}&acNumber=${acCode.value}` || '')
              },
              cancel() {
                acCode.value = ''
              },
            })
          } else {
            window.open(`${url}&acNumber=""` || '')
          }
        }
      },
    })
  }
  if (val === '更改AC实例录入') {
    $dialog.confirm({
      content: '请确认是否更改AC实例',
      negativeText: '取消',
      positiveText: '确认',
      async confirm() {
        try {
          loading.value = true
          const res = await addSamePosFeatureAcPart({
            oid: row.oid,
            acOid: row.acOid,
            itemOid: route.query.oid,
          })
          if (res.success) {
            fetchData(showRowOid.value)
          }
        } catch (error) {
          console.log('error:', error)
        } finally {
          loading.value = false
        }
      },
    })
  }
  if (val === '添加现有') {
    addNowRef.value.show(row.oid)
  }
}

const closeModel = () => {
  modalType.value = 1
  acName.value = ''
  modalType.value = 1
  jumpTypeData.value = ''
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
