<template>
  <div w-full>
    <n-tabs type="line" animated :value="tabValue" @update:value="changeTab">
      <n-tab-pane
        v-for="item in tabList"
        :key="item.value"
        :name="item.value"
        :tab="item.label"
      ></n-tab-pane>
    </n-tabs>
    <div class="form" mt-28>
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
          <n-button @click="refreshData">
            <template #icon>
              <the-icon type="custom" icon="icon_resetting" :size="16" color="#1890FF" />
            </template>
            刷新
          </n-button>
          <n-button type="primary" ml-20 @click="lookData">
            <template #icon>
              <img src="@/assets/images/search_white.png" alt="" class="h-14 w-14" />
            </template>
            查询
          </n-button>
        </n-form-item>
      </n-form>
    </div>
    <n-data-table
      :columns="tabValue === 1 ? columns1 : tabValue === 4 ? columns3 : columns2"
      :data="data"
      :pagination="false"
      :bordered="false"
      :loading="loading"
      mt-20
    />
  </div>
</template>

<script setup>
import { NInput } from 'naive-ui'
import { computed, onActivated, onMounted, ref, watch } from 'vue'
import {
  reverseACModels,
  reverseModelLogicalRules,
  reversePlatformLogicalRules,
  reverseSaleDesignMapRules,
} from '~/src/api/feature'
import { useAppStore } from '@/store'
import { useRoute, useRouter } from 'vue-router'
const appStore = useAppStore()
const { changeRetrogradationTab } = appStore

const router = useRouter()
const route = useRoute()

const props = defineProps({
  oid: {
    type: String,
    default: '',
  },
})
const name = ref('')
const formRef = ref(null)
const tabValue = ref(appStore.retrogradationTabIndex)
const tabList = [
  { value: 1, label: 'AC模块', name: 'AC模块名称' },
  { value: 2, label: '车型子类逻辑工具', name: '车型子类名称' },
  { value: 3, label: 'M模块逻辑工具', name: 'M模块' },
  { value: 4, label: '配置特征', name: '配置特征' },
]

const labelName = tabList.find((item) => item.value === appStore.retrogradationTabIndex)?.name
const tableHeaderName = ref(labelName)
const loading = ref(false)

const changeTab = (val) => {
  changeRetrogradationTab(val)
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

const lookData = () => {
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
const refreshData = () => {
  name.value = ''
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

const data = ref([])

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
          class: `${tabValue.value !== 3 ? 'color-primary' : ''} cursor-pointer`,
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
          },
        },
        row.name
      ),
  },
  {
    title: '规则名',
    key: 'ruleName',
    render: (row) =>
      h(
        'span',
        {
          class: `${tabValue.value === 3 ? 'color-primary cursor-pointer' : ''}`,
          onClick: () => {
            if (tabValue.value === 3) {
              console.log('row:', row)
              router.push({
                path: '/feature/global-logic',
                query: {
                  oid: route.query.oid,
                  ruleName: row.ruleName,
                  platformName: route.query.platformName,
                },
              })
            }
          },
        },
        row.ruleName
      ),
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
                platformName: route.query.platformName,
              },
            })
          },
        },
        row.name
      ),
  },
])

//ac
const fetchAcData = async () => {
  try {
    loading.value = true
    const res = await reverseACModels({ oid: props.oid, name: name.value })
    data.value = res.data
  } catch (error) {
    console.log('error:', error)
  } finally {
    loading.value = false
  }
}
//车型子类
const fetchCarChildData = async () => {
  try {
    loading.value = true
    const res = await reverseModelLogicalRules({ oid: props.oid, name: name.value })
    data.value = res.data
  } catch (error) {
    console.log('error:', error)
  } finally {
    loading.value = false
  }
}
//M模块
const fetchMData = async () => {
  try {
    loading.value = true
    const res = await reversePlatformLogicalRules({ oid: props.oid, name: name.value })
    data.value = res.data
  } catch (error) {
    console.log('error:', error)
  } finally {
    loading.value = false
  }
}
//配置特征
const fetchConfigData = async () => {
  try {
    loading.value = true
    const res = await reverseSaleDesignMapRules({ oid: props.oid, name: name.value })
    data.value = res.data
  } catch (error) {
    console.log('error:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  if (tabValue.value === 1) {
    fetchAcData()
  } else if (tabValue.value === 2) {
    fetchCarChildData()
  } else if (tabValue.value === 3) {
    fetchMData()
  } else if (tabValue.value === 4) {
    fetchConfigData()
  }
})

// watch(
//   () => appStore.retrogradationTabIndex,
//   (val) => {
//     tabValue.value = val
//   }
// )
watch(
  () => props.oid,
  (val) => {
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
)
</script>

<style lang="scss" scoped>
::v-deep.n-tabs.n-tabs--top .n-tab-pane {
  padding: 0;
}
.form {
  border-bottom: 1px solid #eaeaea;
}
</style>
