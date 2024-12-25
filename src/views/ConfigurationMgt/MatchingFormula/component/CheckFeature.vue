<template>
  <n-modal v-model:show="showModal" :mask-closable="false">
    <div w-1200 rounded-4 bg-white>
      <header h-40 flex items-center flex-justify-between px-20>
        <div flex items-center>
          <div class="line" mr-8></div>
          <span text-14 font-bold text-hex-1d2129>检查特征值封闭</span>
        </div>
        <img
          src="@/assets/images/close.png"
          alt=""
          class="h-16 w-16 cursor-pointer"
          @click="cancel"
        />
      </header>
      <main min-h-400 px-20 pt-20>
        <h3>特征封闭检测结果</h3>
        <n-data-table
          :columns="columns"
          :data="tableData"
          :pagination="false"
          mt-20
          :loading="loading"
          :scroll-x="1100"
          :max-height="500"
        />
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
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { getUnclosedCharacterValueList } from '~/src/api/config'

const emits = defineEmits(['handleConfirm'])
const showModal = ref(false)
const route = useRoute()
const pageSize = ref(20)
const pageCount = ref(0)
const page = ref(1)
const loading = ref(false)
const paginations = ['size-picker', 'pages', 'quick-jumper']

const onUpdatePageSize = (size) => {
  pageSize.value = size
  fetchData()
}
const onChange = (pages) => {
  page.value = pages
  fetchData()
}

const columns = [
  {
    title: '序号',
    key: 'no',
    align: 'center',
    width: 80,
    render(row, inx) {
      return inx + 1
    },
  },
  {
    title: '类型',
    key: 'type',
  },
  {
    title: '特征名称',
    key: 'ruleName',
  },
  {
    title: '描述',
    key: 'description',
    width: '30%',
    ellipsis: {
      tooltip: true,
    },
  },
]
const tableData = ref([])
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
    const res = await getUnclosedCharacterValueList({
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
