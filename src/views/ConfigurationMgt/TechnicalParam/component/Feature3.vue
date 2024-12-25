<template>
  <div pt-20>
    <div
      class="feature-item position-relative min-h-20 w-full"
      :class="[extendList[0] && 'isBorder']"
    >
      <div class="title flex items-center px-10" @click="handleChange(0)">
        <div
          class="wrap mr-8 flex items-center"
          flex-justify-center
          :class="[!extendList[0] && 'fold']"
        >
          <the-icon icon="extend" type="custom" :size="10" class="icon" />
        </div>
        特征来源：订单
      </div>
      <div
        v-show="extendList[0]"
        class="content min-h-100 flex flex-justify-start px-20 pb-30 pt-36"
      >
        <n-space :size="[20, 20]">
          <card
            v-for="(item, index) in undefinedOrderCharas"
            :key="index"
            :title="item.optionName"
          />
        </n-space>
      </div>
    </div>
    <div
      class="feature-item position-relative mt-20 min-h-20 w-full"
      :class="[extendList[1] && 'isBorder']"
    >
      <div class="title flex items-center px-10" @click="handleChange(1)">
        <div
          class="wrap mr-8 flex items-center"
          flex-justify-center
          :class="[!extendList[1] && 'fold']"
        >
          <the-icon icon="extend" type="custom" :size="10" class="icon" />
        </div>
        特征来源：逻辑工具或订单
      </div>
      <div
        v-show="extendList[1]"
        class="content min-h-100 flex flex-justify-start px-20 pb-30 pt-36"
      >
        <n-space :size="[20, 20]">
          <card
            v-for="(item, index) in undefinedLogicCharas"
            :key="index"
            :title="item.optionName"
            :card-type="1"
          />
        </n-space>
      </div>
    </div>
  </div>
</template>

<script setup>
import card from './card.vue'
const props = defineProps({
  undefinedOrderCharas: {
    type: Array,
    default: () => [],
  },
  undefinedLogicCharas: {
    type: Array,
    default: () => [],
  },
})
const extendList = ref([true, true])
const handleChange = (index) => {
  extendList.value[index] = !extendList.value[index]
}
</script>

<style lang="scss" scoped>
.feature-item {
  border-radius: 3px;
  &.isBorder {
    border: 1px solid #e5e6eb;
  }
  .title {
    position: absolute;
    background: #fff;
    line-height: 20px;
    top: -5px;
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
