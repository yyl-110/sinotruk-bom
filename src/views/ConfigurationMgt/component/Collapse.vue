<template>
  <div
    class="feature-item position-relative min-h-20 min-w-200"
    :class="[extendData && 'isBorder']"
  >
    <div class="title flex items-center px-10" @click="handleChange()">
      <div class="wrap mr-8 flex items-center" flex-justify-center :class="[!extendData && 'fold']">
        <the-icon icon="extend" type="custom" size="10" class="icon" />
      </div>
      {{ title }}
    </div>
    <div v-show="extendData" class="content h-208 flex flex-justify-start px-20 pb-20 pt-36">
      <n-scrollbar h-full>
        <slot name="content" />
        <!-- <n-space :size="[20, 20]">
        <card v-for="(item, index) in data" :key="item.oid" :title="item.optionName" />
      </n-space> -->
      </n-scrollbar>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  extend: {
    type: Boolean,
    default: true,
  },
  title: {
    type: String,
    default: '',
  },
})
const extendData = ref(props.extend)
const handleChange = () => {
  extendData.value = !extendData.value
}
</script>

<style lang="scss" scoped>
.feature-item {
  border-radius: 3px;
  margin-top: 20px;
  &.isBorder {
    border: 1px solid #e5e6eb;
  }
  .title {
    position: absolute;
    background: #fff;
    line-height: 20px;
    top: -10px;
    left: 15px;
    cursor: pointer;
  }
  .wrap {
    width: 16px;
    height: 16px;
    background: #d8d8d8;
    border-radius: 2px;
    .icon {
      transition: all 0.3s ease-in-out;
      transform: rotate(180deg);
    }
    &.fold {
      .icon {
        transform: rotate(0deg);
      }
    }
  }
}
</style>
