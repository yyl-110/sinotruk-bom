<template>
  <a-config-provider
    :theme="{
      token: {
        colorPrimary: '#1890FF',
      },
    }"
  >
    <AppProvider>
      <router-view v-slot="{ Component }">
        <component :is="Component" />
      </router-view>
    </AppProvider>
  </a-config-provider>
</template>

<script setup>
import AppProvider from '@/components/common/AppProvider.vue'
</script>
