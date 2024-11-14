<template>
  <n-layout has-sider wh-full bg-hex-f8f9fa>
    <n-layout-sider
      bordered
      collapse-mode="width"
      :collapsed-width="64"
      :width="220"
      :native-scrollbar="false"
      :collapsed="appStore.collapsed"
      position-absolute
      h-full
    >
      <MenuCollapse />
      <SideBar />
    </n-layout-sider>
    <article
      ml-220
      w-full
      flex-col
      flex-1
      class="cus-scroll-x article"
      :class="[appStore.collapsed ? 'ml-64' : 'ml-220']"
    >
      <header
        class="position-relative flex items-center bg-primary pl-40 pr-20"
        dark="bg-dark border-0"
        :style="`height: ${header.height}px`"
      >
        <AppHeader />
      </header>
      <section v-if="tags.visible" border-b bc-eee sm:block dark:border-0>
        <AppTags :style="{ height: `${tags.height}px` }" />
      </section>
      <section flex-1 overflow-hidden bg-hex-F8F9FA dark:bg-hex-101014>
        <n-spin :show="loading">
          <AppMain />
        </n-spin>
      </section>
    </article>
  </n-layout>
</template>

<script setup>
import AppHeader from './components/header/index.vue'
import SideBar from './components/sidebar/index.vue'
import AppMain from './components/AppMain.vue'
import AppTags from './components/tags/index.vue'
import MenuCollapse from './components/header/components/MenuCollapse.vue'
import { useAppStore } from '@/store'
import { header, tags } from '~/settings'
import BreadCrumb from './components/header/components/BreadCrumb.vue'
import { computed } from 'vue'

const appStore = useAppStore()
const loading = computed(() => appStore.globalLoading)
</script>

<style lang="scss" scoped>
.article {
  transition: margin 0.3s;
}
::v-deep .n-scrollbar {
  overflow: unset;
}
::v-deep.n-spin-container {
  height: 100%;
  .n-spin-content {
    height: 100%;
  }
}
</style>
