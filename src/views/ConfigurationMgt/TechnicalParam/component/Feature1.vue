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
        特征来源：逻辑工具
      </div>
      <div
        v-show="extendList[0]"
        class="content min-h-100 flex flex-justify-start px-20 pb-30 pt-36"
      >
        <n-space :size="[20, 20]">
          <card v-for="(item, index) in data" :key="item.oid" :title="item.optionName" />
        </n-space>
      </div>
    </div>
    <n-button type="primary" mt-20>
      <template #icon>
        <the-icon type="custom" icon="icon_setting" color="#fff" :size="14" />
      </template>
      固化配置
    </n-button>
    <div
      v-for="(item, index) in fixedCharas"
      :key="index"
      class="feature-item position-relative mt-20 min-h-20 w-full"
      :class="[extendList[index + 1] && 'isBorder']"
    >
      <div class="title flex items-center px-10" @click="handleChange(index + 1)">
        <div
          class="wrap mr-8 flex items-center"
          flex-justify-center
          :class="[!extendList[index + 1] && 'fold']"
        >
          <the-icon icon="extend" type="custom" :size="10" class="icon" />
        </div>
        {{ item.title }}
      </div>
      <div
        v-show="extendList[index + 1]"
        class="content min-h-100 flex flex-justify-start px-20 pb-30 pt-36"
      >
        <n-space v-if="item?.items" :size="[20, 20]">
          <card
            v-for="(val, index) in item.items"
            :key="index"
            is-choose
            :title="val.optionName"
            :color="val.status === 'N' ? '#CB2634' : '#009A29'"
            :card-type="2"
          >
            <template #select>
              <n-select
                v-model:value="val.value"
                placeholder="请选择"
                :options="val.choices"
                filterable
                label-field="choiceName"
                value-field="choiceOid"
                text-center
              />
            </template>
          </card>
        </n-space>
      </div>
    </div>
  </div>
</template>

<script setup>
import { watch } from 'vue'
import card from './card.vue'
const props = defineProps({
  data: {
    type: Array,
    default: () => [],
  },
  fixedCharas: {
    type: Array,
    default: () => [],
  },
})
const extendList = ref([true, true, true])
const handleChange = (index) => {
  extendList.value[index] = !extendList.value[index]
}
const getChangeArrData = () => extendList.value

defineExpose({
  getChangeArrData,
  changedFixedCharas: () => props.fixedCharas,
})
// const getSelectValue = (arr, value) => {
//   console.log(
//     'arr.find((item) => item.choiceOid === value)?.choiceName:',
//     arr.find((item) => item.choiceOid === value)?.choiceName
//   )
//   return arr.find((item) => item.choiceOid === value)?.choiceName
// }

watch(
  () => props.fixedCharas,
  (val) => {
    extendList.value = new Array(val.length + 1).fill(true)
  },
  { immediate: true }
)
</script>

<style lang="scss" scoped>
::v-deep .n-base-selection .n-base-selection-placeholder .n-base-selection-placeholder__inner {
  color: #1d2129;
  text-decoration: underline;
  text-align: center;
  width: 100%;
}
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
