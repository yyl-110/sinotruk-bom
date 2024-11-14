<template>
  <CommonPage>
    <div h-full w-full px-20>
      <app-title text="特征管理" />
      <n-data-table
        :columns="columns"
        :data="tableData"
        :pagination="pagination"
        :bordered="false"
        :loading="loading"
        :min-height="250"
      />
    </div>
  </CommonPage>
</template>

<script setup>
import AppTitle from '@/components/common/AppTitle.vue'
import { NButton, NIcon } from 'naive-ui'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { getPlatformList } from '~/src/api/feature'
import SvgIcon from '~/src/components/icon/SvgIcon.vue'
import useHandle from '~/src/hooks/useHandle'
const { queryCreateFReviewDoc, createChangePage } = useHandle()
const router = useRouter()
const pagination = ref(false)
const tableData = ref([])
const loading = ref(false)
const columns = [
  {
    title: '平台名称',
    key: 'name',
  },
  {
    title: '操作',
    key: 'actions',
    width: 280,
    render(row) {
      return h(
        'div',
        {
          class: 'flex items-center',
        },
        btnList.map((i) => renderBtn(i, row))
      )
    },
  },
]

const btnList = [
  { icon: 'icon_operate_1', type: 1, text: '配置特征' },
  { icon: 'icon_operate_2', type: 2, text: '技术特征' },
  { icon: 'icon_operate_3', type: 3, text: '特征映射' },
  { icon: 'icon_operate_4', type: 4, text: '全局逻辑' },
  { icon: 'icon_operate_21', type: 5, text: '可选AC模块' },
  { icon: 'flag', text: '签审', type: 6 },
  // { icon: 'icon_operate_6', text: '更改', type: 7 },
]

const renderBtn = (btn, row) => {
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
  const oid = row.oid
  switch (type) {
    case 1:
      router.push({
        path: 'config',
        query: { oid, platformName: row.name },
      })
      break
    case 2:
      router.push({
        path: 'technical',
        query: { oid, platformName: row.name },
      })
      break
    case 3:
      router.push({
        path: 'mapping',
        query: { oid, platformName: row.name },
      })
      break
    case 4:
      router.push({
        path: 'global-logic',
        query: { oid, platformName: row.name },
      })
      break
    case 5:
      router.push({
        path: 'optional-ac',
        query: { oid, platformName: row.name },
      })
      break
    case 6:
      queryCreateFReviewDoc(oid)
      break
    case 7:
      createChangePage(row.changeUrl)
      break
    default:
      break
  }
}

const fetchData = async () => {
  try {
    loading.value = true
    const res = await getPlatformList({})
    tableData.value = res.data || []
  } catch (error) {
    console.log('error:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchData()
})
</script>

<style lang="scss" scoped></style>
