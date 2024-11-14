import { storeToRefs } from 'pinia'
import { useBusinessStore } from '../store'
import { computed } from 'vue'

export default (function () {
  const bussniss = useBusinessStore()
  const { currentUserInfo } = storeToRefs(bussniss)
  const userRole = computed(() => currentUserInfo.value?.userRole)
  console.log('用户权限======', userRole.value)
  return userRole
})()
