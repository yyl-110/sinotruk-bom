<template>
  <div w-full>
    <n-radio-group v-model:value="value" name="radiobuttongroup1" @update:value="change">
      <n-radio-button
        v-for="song in list"
        :key="song.value"
        :value="song.value"
        :label="song.label"
      />
    </n-radio-group>
  </div>
</template>

<script setup>
import { onActivated } from 'vue'
import { useRoute, useRouter } from 'vue-router'
const route = useRoute()

const router = useRouter()
const list = ref([
  { value: 1, label: '配置特征' },
  { value: 2, label: '技术特征' },
  { value: 3, label: '配置特征映射' },
])
const props = defineProps({
  select: {
    type: Number,
    default: 1,
  },
})
const value = ref(props.select || 1)

const change = (val) => {
  if (val === props.select) {
    return
  }
  router.push({
    path: val === 1 ? 'config' : val === 2 ? 'technical' : 'mapping',
    query: {
      oid: route.query.oid,
      platformName: route.query.platformName,
    },
  })
}
onActivated(() => {
  value.value = props.select
})
</script>

<style lang="scss" scoped>
::v-deep.n-radio-group .n-radio-button.n-radio-button--checked {
  --n-button-color-active: var(--primary-color);
  --n-button-text-color-active: #fff;
  --n-button-border-radius: 4px;
  border: none;
}
::v-deep.n-radio-group .n-radio-button {
  --n-button-color: #f2f3f5;
  border: none;
  --n-button-text-color: #1d2129;
  border-radius: 4px;
  // padding-left: 14px;
  // padding-right: 14px;
  overflow: hidden;
}

::v-deep.n-radio-group .n-radio-group__splitor {
  width: 0;
}
::v-deep.n-radio-group.n-radio-group--button-group {
  --n-height: 34px;
  background: #f2f3f5;
  padding-right: 2px;
  padding-left: 2px;
  border-radius: 4px;
}
::v-deep.n-radio-group.n-radio-group--button-group .n-radio-button {
  --n-height: 30px;
  margin-top: 2px;
  margin-bottom: 2px;
}
</style>
