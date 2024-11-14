<template>
  <div h-64 flex items-center>车型子类：G7S-K-4-6</div>
</template>

<script setup>
defineProps({
  name: {
    type: String,
    default: '',
  },
})
</script>

<style lang="scss" scoped>
div {
  border-bottom: 1px solid #eaeaea;
  font-weight: 400;
  font-size: 16px;
  color: #4e5969;
  line-height: 24px;
}
</style>
