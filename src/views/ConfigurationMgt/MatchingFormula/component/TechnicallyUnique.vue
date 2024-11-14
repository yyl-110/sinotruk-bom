<template>
  <n-modal v-model:show="showModal" :mask-closable="false" @after-leave="closeModel">
    <div w-1200 rounded-4 bg-white>
      <header h-40 flex items-center flex-justify-between px-20>
        <div flex items-center>
          <div class="line" mr-8></div>
          <span text-14 font-bold text-hex-1d2129>技术特征来源唯一性检查</span>
        </div>
        <img
          src="@/assets/images/close.png"
          alt=""
          class="h-16 w-16 cursor-pointer"
          @click="cancel"
        />
      </header>
      <main h-full min-h-560 px-20 pt-20>
        <n-grid
          cols="5 s:5 m:5 l:5 xl:5 2xl:5"
          responsive="screen"
          class="gridWrap"
          h-full
          lt-lg:h-auto
          :x-gap="20"
        >
          <n-grid-item span="5 s:2 m:2 l:2 xl:2 2xl:2" class="item1" h-full pr-20>
            <n-data-table
              :columns="columns"
              :data="tableData"
              :pagination="false"
              :loading="loading"
              :max-height="400"
              mt-20
            />
          </n-grid-item>
          <n-grid-item v-if="featureOid" span="5 s:3 m:3 l:3 xl:3 2xl:3">
            <div>
              <div h-30 w-full flex items-center>
                <div class="line" mr-8></div>
                <span text-14 text-hex-1D2129>特征逆查</span>
              </div>
              <n-tabs type="line" animated :value="tabValue" @update:value="changeTab">
                <n-tab-pane
                  v-for="item in tabList"
                  :key="item.value"
                  :name="item.value"
                  :tab="item.label"
                ></n-tab-pane>
              </n-tabs>
              <!-- <div class="form" mt-12>
                <n-form
                  ref="formRef"
                  inline
                  :model="name"
                  label-placement="left"
                  label-width="auto"
                  require-mark-placement="right-hanging"
                >
                  <n-form-item label="名称">
                    <n-input v-model:value="name" placeholder="请输入" @keydown.enter="lookData" />
                  </n-form-item>
                  <n-form-item>
                    <n-button type="primary" ml-20 @click="lookData">
                      <template #icon>
                        <img src="@/assets/images/search_white.png" alt="" class="h-14 w-14" />
                      </template>
                      查询
                    </n-button>
                  </n-form-item>
                </n-form>
              </div> -->
              <n-data-table
                :columns="tabValue === 1 ? columns1 : tabValue === 4 ? columns3 : columns2"
                :data="data1"
                :pagination="false"
                :bordered="false"
                mt-20
              />
            </div>
          </n-grid-item>
        </n-grid>
      </main>
      <footer h-70 flex items-center flex-justify-end px-20>
        <n-pagination
          v-model:page="page"
          :page-count="pageCount"
          show-quick-jumper
          show-size-picker
          :display-order="paginations"
          :page-size="pageSize"
          :page-sizes="[20, 50, 100, 200]"
          @update:page-size="onUpdatePageSize"
          @update:page="onChange"
        />
      </footer>
    </div>
  </n-modal>
</template>

<script setup>
import { ref, watch } from 'vue'
import SvgIcon from '@/components/icon/SvgIcon.vue'
import { NButton, NDataTable, NIcon } from 'naive-ui'
import {
  configReverseModelLogicalRules,
  configReversePlatformLogicalRules,
  configReverseSaleDesignMapRules,
  getMultiSourceCharacterList,
  reverseAcModelLogicalRules,
} from '~/src/api/config'
import { useRoute, useRouter } from 'vue-router'
const route = useRoute()
const formValue = ref({})
const formRef = ref(null)
const name = ref('')
const page = ref(1)
const pageSize = ref(20)
const tableData = ref([])
const tableHeaderName = ref('固化配置')
const loading = ref(false)
const featureOid = ref('')
const router = useRouter()
const pageCount = ref(1)
const tabValue = ref(1)

const paginations = ['size-picker', 'pages', 'quick-jumper']

const onUpdatePageSize = (size) => {
  pageSize.value = size
  fetchData()
}
const onChange = (pages) => {
  page.value = pages
  fetchData()
}

const data1 = ref([])
const columns = [
  {
    title: '序号',
    key: 'no',
    align: 'center',
    render(row, inx) {
      return inx + 1
    },
  },
  {
    title: '技术特征名称',
    key: 'name',
  },
  {
    title: '操作',
    key: 'action',
    render: (row) =>
      h(
        NButton,
        {
          size: 'tiny',
          class: 'rounded-10 w-30 mr-10 h-30',
          onClick: () => {
            if (featureOid.value === row.oid) return
            // tabValue.value = 1
            name.value = ''
            // tableHeaderName.value = 'AC模板'
            featureOid.value = row.oid
            loadData()
          },
        },
        h(
          NIcon,
          { size: 16, color: '#1890FF' },
          { default: () => h(SvgIcon, { icon: 'icon_operate_10' }) }
        )
      ),
  },
]

const columns1 = computed(() => [
  {
    title: '序号',
    key: 'no',
    width: 60,
    render(row, inx) {
      return inx + 1
    },
  },
  {
    title: tableHeaderName.value,
    key: 'name',
    render: (row) =>
      h(
        'span',
        {
          class: 'color-primary cursor-pointer',
          onClick: () => {
            window.location.href = row.url
          },
        },
        row.name
      ),
  },
  // {
  //   title: '规则名',
  //   key: 'ruleName',
  // },
  {
    title: '位置',
    key: 'location',
  },
])
const columns2 = computed(() => [
  {
    title: '序号',
    key: 'no',
    width: 60,
    render(row, inx) {
      return inx + 1
    },
  },
  {
    title: tableHeaderName.value,
    key: 'name',
    render: (row) =>
      h(
        'span',
        {
          class: 'color-primary cursor-pointer',
          onClick: () => {
            if (tabValue.value === 2) {
              router.push({
                path: '/configuration/matching-formula',
                query: {
                  oid: row.oid,
                  number: row.number,
                },
              })
            }
            if (tabValue.value === 3) {
              router.push({
                path: '/feature/global-logic',
                query: {
                  oid: row.oid,
                  number: row.number,
                },
              })
            }
          },
        },
        row.name
      ),
  },
  {
    title: '规则名',
    key: 'ruleName',
  },
  {
    title: '位置',
    key: 'location',
  },
])
const columns3 = computed(() => [
  {
    title: '序号',
    key: 'no',
    width: 60,
    render(row, inx) {
      return inx + 1
    },
  },
  {
    title: tableHeaderName.value,
    key: 'name',
    render: (row) =>
      h(
        'span',
        {
          class: 'color-primary cursor-pointer',
          onClick: () => {
            router.push({
              path: '/feature/mapping',
              query: {
                oid: route.query.oid,
                name: row.name,
              },
            })
          },
        },
        row.name
      ),
  },
])

const tabList = [
  { value: 1, label: '固化配置', name: '固化配置' },
  { value: 2, label: '车型子类逻辑工具', name: '车型子类名称' },
  { value: 3, label: 'M模块逻辑工具', name: 'M模块' },
  { value: 4, label: '配置特征', name: '配置特征' },
]
const changeTab = (val) => {
  tabValue.value = val
  name.value = ''
  tableHeaderName.value = tabList.find((item) => item.value === val)?.name
  if (val === 1) {
    fetchAcData()
  } else if (val === 2) {
    fetchCarChildData()
  } else if (val === 3) {
    fetchMData()
  } else if (val === 4) {
    fetchConfigData()
  }
}

const loadData = () => {
  if (tabValue.value === 1) {
    fetchAcData()
  } else if (tabValue.value === 2) {
    fetchCarChildData()
  } else if (tabValue.value === 3) {
    fetchMData()
  } else if (tabValue.value === 4) {
    fetchConfigData()
  }
}

const emits = defineEmits(['handleConfirm'])
const showModal = ref(false)
const cancel = () => {
  showModal.value = false
}

const show = (type) => {
  showModal.value = true
  fetchData()
}
const close = () => {
  showModal.value = false
}

const fetchData = async () => {
  try {
    loading.value = true
    const res = await getMultiSourceCharacterList({
      oid: route.query.oid,
      page: page.value,
      count: pageSize.value,
    })
    tableData.value = res.data || []
    pageCount.value = res.pages
  } catch (error) {
    console.log('error:', error)
  } finally {
    loading.value = false
  }
}

//ac
const fetchAcData = async () => {
  const res = await reverseAcModelLogicalRules({ vtOid: route.query.oid, dcOid: featureOid.value })
  data1.value = res.data
}
//车型子类
const fetchCarChildData = async () => {
  const res = await configReverseModelLogicalRules({
    vtOid: route.query.oid,
    dcOid: featureOid.value,
    name: name.value,
  })
  data1.value = res.data
}
//M模块
const fetchMData = async () => {
  const res = await configReversePlatformLogicalRules({
    vtOid: route.query.oid,
    dcOid: featureOid.value,
    name: name.value,
  })
  data1.value = res.data
}
//配置特征
const fetchConfigData = async () => {
  const res = await configReverseSaleDesignMapRules({
    vtOid: route.query.oid,
    dcOid: featureOid.value,
    name: name.value,
  })
  data1.value = res.data
}

const closeModel = () => {
  tabValue.value = 1
  name.value = ''
  tableHeaderName.value = 'AC模板'
  featureOid.value = ''
  tableData.value = []
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
.item1 {
  box-shadow: inset -1px 0px 0px 0px #eaeaea;
}
</style>
