<template>
  <n-modal v-model:show="showModal" :mask-closable="false">
    <div w-1200 rounded-4 bg-white>
      <header h-40 flex items-center flex-justify-between px-20>
        <div flex items-center>
          <div class="line" mr-8></div>
          <span text-14 font-bold text-hex-1d2129>表号封闭检测结果</span>
        </div>
        <img
          src="@/assets/images/close.png"
          alt=""
          class="h-16 w-16 cursor-pointer"
          @click="cancel"
        />
      </header>
      <main min-h-600 px-20 pt-20>
        <n-data-table
          :columns="columns"
          :data="tableData"
          :pagination="false"
          :loading="loading"
          :max-height="500"
          :scroll-x="1000"
        />
      </main>
      <!-- <footer h-70 flex items-center flex-justify-end px-20>
        <n-pagination
          v-model:page="page"
          v-model:page-size="pagination.pageSize"
          :page-count="pagination.pageCount"
          :page-sizes="pagination.pageSizes"
          show-quick-jumper
          show-size-picker
          :display-order="paginations"
          @update:page="pagination.onChange"
          @update:page-size="pagination.onUpdatePageSize"
        />
      </footer> -->
    </div>
  </n-modal>
</template>

<script setup>
import { NButton, NIcon } from 'naive-ui'
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { specialVehicleCloseCheck } from '~/src/api/config'

const showModal = ref(false)
const loading = ref(false)
const route = useRoute()

const columns = [
  {
    title: '序号',
    key: 'no',
    align: 'center',
    width: 60,
    render(row, inx) {
      return inx + 1
    },
  },
  {
    title: '规则',
    key: 'name',
  },
  {
    title: '描述',
    key: 'description',
  },
]
const tableData = ref([])
const cancel = () => {
  showModal.value = false
}

const show = (val) => {
  fetchData()
  showModal.value = true
}
const close = () => {
  showModal.value = false
}

const fetchData = async () => {
  try {
    loading.value = true
    const res = await specialVehicleCloseCheck({
      oid: route.query.oid,
    })
    tableData.value = res.data || []
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
