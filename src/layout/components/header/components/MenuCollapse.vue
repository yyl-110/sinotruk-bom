<template>
  <div
    z-999
    h-40
    w-40
    flex
    cursor-pointer
    flex-justify-center
    rounded-100
    bg-hex-f5f5f9
    class="collapsed"
    @click="appStore.switchCollapsed"
  >
    <div h-26 w-26 flex flex-justify-center rounded-200 bg-primary class="inner">
      <the-icon
        type="custom"
        icon="left"
        color="#fff"
        :size="20"
        :class="['collapsed-icon', appStore.collapsed ? 'select-collapsed' : '']"
      />
    </div>
  </div>
  <!-- <n-icon size="20" cursor-pointer @click="appStore.switchCollapsed">
    <icon-mdi:format-indent-increase v-if="appStore.collapsed" />
    <icon-mdi:format-indent-decrease v-else />
  </n-icon> -->
</template>

<script setup>
import { useAppStore } from '@/store'

const appStore = useAppStore()
</script>

<style lang="scss" scoped>
.collapsed {
  align-items: center;
  position: absolute;
  top: 30px;
  right: -20px;
  .inner {
    align-items: center;
  }
  .collapsed-icon {
    transform: rotate(0deg);
    transition: all 0.5s ease-in-out;
    &.select-collapsed {
      transform: rotate(180deg);
    }
  }
}
</style>
