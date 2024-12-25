<template>
  <div h-full w-full flex flex-col rounded-4 bg-white>
    <header h-40 flex items-center flex-justify-between px-20>
      <div flex items-center>
        <div class="line" mr-8></div>
        <span text-14 font-bold text-hex-1d2129>
          {{ title }}
        </span>
      </div>
    </header>
    <main flex-1 px-20 class="cus-scroll-y">
      <Collapse title="常规属性">
        <template #content>
          <n-grid :cols="24" text-hex-4e5969 :y-gap="20">
            <n-grid-item v-for="item in attributes" :key="item.id" span="6">
              {{ item.name }}：{{ item.value }}
            </n-grid-item>
          </n-grid>
        </template>
      </Collapse>
      <div mt-40 pt-20 bt-1>
        <n-collapse :default-expanded-names="['1']">
          <template #arrow>
            <the-icon type="custom" icon="icon_form_fold" :size="16" color="#1D2129" />
          </template>
          <n-collapse-item title="配置详情" name="1">
            <template #header="{ collapsed }">
              <div w-full flex items-center justify-between>
                <span>配置详情</span>
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
            <n-data-table
              :columns="columns"
              :data="tableData"
              :pagination="false"
              :loading="loading"
              :scroll-x="1200"
              :max-height="500"
            />
          </n-collapse-item>
        </n-collapse>
      </div>
    </main>
  </div>
</template>

<script setup>
import Collapse from '../component/Collapse.vue'
import { onMounted, ref } from 'vue'
import { getConfigCodeDetailInfo } from '~/src/api/config'
import { useRoute } from 'vue-router'
const route = useRoute()

const title = ref('')
const attributes = ref([])
const configs = ref([])
const showModal = ref(false)
const columns = [
  {
    title: '序号',
    key: 'no',
    width: 60,
    render(row, inx) {
      return inx + 1
    },
  },
  {
    title: '配置类别',
    key: 'category',
  },
  {
    title: '配置类型',
    key: 'option',
  },
  {
    title: '配置选项',
    key: 'choice',
  },
  // {
  //   title: '任务创建时间',
  //   key: 'createDate',
  //   minWidth: 120,
  // },
  {
    title: '销售语言',
    key: 'saleDesc',
  },
  {
    title: '是否标配',
    key: 'stdConfig',
  },
]
const tableData = ref([])

const fetchData = async (oid) => {
  const res = await getConfigCodeDetailInfo({ oid })
  title.value = res.data.title
  attributes.value = res.data.attributes
  tableData.value = res.data.configs || []
  // configs.value = res.data.configs
  console.log('res:', res)
}
onMounted(() => {
  fetchData(route.query.oid)
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
</style>
