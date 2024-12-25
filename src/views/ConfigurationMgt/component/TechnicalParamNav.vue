<template>
  <div flex items-center>
    <div
      v-for="item in list"
      :key="item.type"
      class="item"
      mr-20
      text-hex-1D2129
      :class="[selectIndex + 1 === item.type && 'select']"
      @click="handleClick(item)"
    >
      <the-icon type="custom" :icon="item.icon" size="14" />
      <span ml-8>{{ item.title }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const list = [
  { title: '技术特征未定义', icon: 'icon_setting', type: 1 },
  { title: '技术特征已定义', icon: 'icon_setting', type: 2 },
  { title: '映射特征未定义', icon: 'share', type: 3 },
  { title: '映射特征已定义', icon: 'share', type: 4 },
]
const selectIndex = ref(0)
const emits = defineEmits(['handleSelect'])

const handleClick = (item) => {
  selectIndex.value = item.type - 1
  emits('handleSelect', item.type)
}

const selectData = () => selectIndex.value

defineExpose({
  selectData,
})
</script>

<style lang="scss" scoped>
.item {
  width: 150px;
  height: 32px;
  border-radius: 4px;
  border: 1px solid #e5e6eb;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  &.select {
    background: var(--primary-color);
    border-color: var(--primary-color);
    color: #fff;
  }
}
</style>
