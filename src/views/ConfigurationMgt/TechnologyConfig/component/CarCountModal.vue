<template>
  <n-modal v-model:show="showModal" :mask-closable="false">
    <div w-500 rounded-4 bg-white>
      <header h-40 flex items-center flex-justify-between px-20>
        <div flex items-center>
          <div class="line" mr-8></div>
          <span text-14 font-bold text-hex-1d2129>车辆总数计算</span>
        </div>
        <img
          src="@/assets/images/close.png"
          alt=""
          class="h-16 w-16 cursor-pointer"
          @click="cancel"
        />
      </header>
      <main min-h-148 px-20 pr-120 pt-20>
        <div class="form" flex items-center pb-20>
          <span ml-20 flex-shrink-0 text-hex-4e5969>实例车辆总数：</span>
          <n-input v-model:value="count" disabled></n-input>
          <!-- <n-input-number v-model:value="count" button-placement="both" disabled>
            <template #minus-icon>
              <the-icon icon="input_minus" size="14" type="custom" />
            </template>
            <template #add-icon>
              <the-icon icon="input_add" size="14" type="custom" />
            </template>
          </n-input-number> -->
        </div>
      </main>
      <!-- <footer h-70 flex items-center flex-justify-end px-20>
        <n-button mr-20 @click="cancel">取消</n-button>
        <n-button type="primary" @click="confirm">确定</n-button>
      </footer> -->
    </div>
  </n-modal>
</template>

<script setup>
import { ref } from 'vue'
const count = ref(0)

const showModal = ref(false)
const cancel = () => {
  showModal.value = false
}

const show = (quantity) => {
  if (quantity) count.value = Number(quantity)
  showModal.value = true
}

const close = () => {
  showModal.value = false
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
