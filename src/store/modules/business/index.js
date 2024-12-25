import { defineStore } from 'pinia'
import { getCurrentUserInfo } from '~/src/api/product'
import { isEmpty } from '../../../utils/common/is'

export const useBusinessStore = defineStore('business', {
  state() {
    return {
      chooseInternalVehicleModelList: [], // 选择的内部车型号列表
      configMgtOid: '', // 配置管理的oid
      isSpecial: false,
      childChangeType: '', // 印谱策划记录更改的type fixed optional
      pageModalVisible: false,
      currentObjState: {},
      currentUserInfo: {},
    }
  },
  actions: {
    handleInternalVehicleModelList(list) {
      this.chooseInternalVehicleModelList = list
    },
    handleConfigMgtOid(oid) {
      this.configMgtOid = oid
    },
    handleSpecialChange(state) {
      this.isSpecial = state
    },
    handleChildChangeType(state) {
      this.childChangeType = state
    },
    handleChangePageModalVisible(state) {
      this.pageModalVisible = state
    },
    handleCurrentObjState(state) {
      this.currentObjState = state
    },
    async handleCurrentUserInfo() {
      try {
        const res = await getCurrentUserInfo({})
        if (res.success) {
          this.currentUserInfo = res.data
        }
      } catch (error) {
        console.log('error:', error)
      }
    },
  },
})
