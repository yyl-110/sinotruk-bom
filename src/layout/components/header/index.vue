<template>
  <div flex items-center>
    <!-- <MenuCollapse /> -->
    <div text-16 font-bold text-white>产品配置管理</div>
    <!-- <MenuCollapse />
    <BreadCrumb ml-15 hidden sm:block /> -->
  </div>
  <div ml-auto flex items-center>
    <!-- <div cursor-pointer text-14 text-white>xxx，欢迎登录</div> -->
    <!-- <MessageNotification />
    <ThemeMode />
    <GiteeSite />
    <GithubSite />
    <FullScreen />
    <UserAvatar /> -->
  </div>
</template>

<script setup>
import BreadCrumb from './components/BreadCrumb.vue'
// import MenuCollapse from './components/MenuCollapse.vue'
import FullScreen from './components/FullScreen.vue'
import GithubSite from './components/GithubSite.vue'
import GiteeSite from './components/GiteeSite.vue'
import ThemeMode from './components/ThemeMode.vue'
import MessageNotification from './components/MessageNotification.vue'
</script>
