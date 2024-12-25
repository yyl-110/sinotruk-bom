<template>
  <router-view v-slot="{ Component, route }">
    <KeepAlive :include="keepAliveNames">
      <component :is="Component" v-if="!tagStore.reloading" :key="route.fullPath" />
    </KeepAlive>
  </router-view>
</template>

<script setup>
import { useTagsStore } from '@/store'
import { useRoute } from 'vue-router'
const tagStore = useTagsStore()
const routeObj = useRoute()

const keepAliveNames = computed(() => {
  return tagStore.tags.filter((item) => item.keepAlive).map((item) => item.name)
})

watch(
  () => routeObj.path,
  () => {
    const { name, fullPath: path } = routeObj
    const title = routeObj.meta?.title
    const icon = routeObj.meta?.icon
    const keepAlive = routeObj.meta?.keepAlive
    tagStore.addTag({ name, path, title, icon, keepAlive })
  },
  { immediate: true }
)
</script>
