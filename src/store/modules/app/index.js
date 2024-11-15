import { defineStore } from 'pinia'
import { useDark } from '@vueuse/core'

const isDark = useDark()
export const useAppStore = defineStore('app', {
  state() {
    return {
      collapsed: false,
      isDark,
      retrogradationTabIndex: 1,
      globalLoading: false,
    }
  },
  actions: {
    switchCollapsed() {
      this.collapsed = !this.collapsed
    },
    setCollapsed(collapsed) {
      this.collapsed = collapsed
    },
    /** 设置暗黑模式 */
    setDark(isDark) {
      this.isDark = isDark
    },
    /** 切换/关闭 暗黑模式 */
    toggleDark() {
      this.isDark = !this.isDark
    },
    /* 修改特征逆查tab */
    changeRetrogradationTab(index) {
      this.retrogradationTabIndex = index
    },
    changeLoading(loading) {
      this.globalLoading = loading
    },
  },
})
