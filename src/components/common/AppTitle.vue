<template>
  <div h-60 w-full flex items-center>
    <div class="line" mr-8></div>
    <span text-14 text-hex-1D2129>{{ text }}{{ platformName }}</span>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()
const props = defineProps({
  text: {
    type: String,
    default: '',
  },
})
const platformName = computed(() =>
  route.query.platformName ? `(${route.query.platformName})` : ''
)
</script>

<style lang="scss" scoped>
.line {
  width: 4px;
  height: 18px;
  background: #1890ff;
}
</style>
