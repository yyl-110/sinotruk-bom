<template>
  <CommonPage sub-title="技术参数" back="mgt">
    <div min-h-full w-full px-20 pt-20>
      <config-mgt-nav :select="3" />
      <TechnicalParamNav mt-20 @handle-select="handleSelect" />
      <n-spin :show="loading">
        <div class="list" min-h-400>
          <feature1
            v-if="selectIndex === 1"
            ref="featureRef1"
            :data="undefinedCharas"
            :fixed-charas="fixedCharas"
          />
          <feature2
            v-if="selectIndex === 2"
            ref="featureRef2"
            :data="definedCharas"
            :fixed-charas="fixedCharas"
          />
          <feature3
            v-if="selectIndex === 3"
            ref="featureRef3"
            :undefined-order-charas="undefinedOrderCharas"
            :undefined-logic-charas="undefinedLogicCharas"
          />
          <feature4
            v-if="selectIndex === 4"
            ref="featureRef4"
            :defined-order-charas="definedOrderCharas"
            :defined-logic-charas="definedLogicCharas"
          />
        </div>
      </n-spin>
      <footer
        v-if="selectIndex < 3"
        class="footer"
        mt-20
        h-70
        w-full
        flex
        items-center
        flex-justify-end
        px-40
      >
        <n-button mr-20 :disabled="btnStatus" @click="save">保存</n-button>
        <n-button type="primary" :disabled="btnStatus" @click="confirm">完成</n-button>
      </footer>
      <div v-if="selectIndex < 3" class="emptyFooter" h-70></div>
    </div>
  </CommonPage>
</template>

<script setup>
import AppTitle from '@/components/common/AppTitle.vue'
import ChildTitle from '../component/ChildTitle.vue'
import ConfigMgtNav from '../component/ConfigMgtNav.vue'
import TechnicalParamNav from '../component/TechnicalParamNav.vue'
import feature2 from './component/Feature2.vue'
import feature3 from './component/Feature3.vue'
import feature4 from './component/Feature4.vue'
import feature1 from './component/feature1.vue'
import { useRoute } from 'vue-router'
import {
  getTechParamConfigCharacterList,
  getTechParamMappingCharacterList,
  updateOptionFixedRule,
} from '~/src/api/config'
import { computed, onMounted } from 'vue'
import { isEmpty } from '~/src/utils'
import { useBusinessStore } from '~/src/store'
import { storeToRefs } from 'pinia'
const businessStore = useBusinessStore()
const { currentObjState } = storeToRefs(businessStore)
const route = useRoute()
const loading = ref(false)
const undefinedCharas = ref([]) // 配置未定义
const definedCharas = ref([]) // 配置已定义
const fixedCharas = ref([]) // 固化配置
const undefinedOrderCharas = ref([]) // 未定义订单特征集合
const undefinedLogicCharas = ref([]) // 未定义订单或逻辑特征集
const definedOrderCharas = ref([]) // 已定义订单特征集合
const definedLogicCharas = ref([]) // 已定义订单或逻辑特征集
const featureRef1 = ref(null)
const featureRef2 = ref(null)
const featureRef3 = ref(null)
const featureRef4 = ref(null)

const selectIndex = ref(1)

const btnStatus = computed(() => {
  const status = currentObjState.value.state
  return !['设计中', '重新工作'].includes(status)
})

const handleSelect = (index) => {
  selectIndex.value = index
  if (index > 2) {
    fetchMappingData()
  } else {
    fetchData()
  }
}

const fetchMappingData = async () => {
  try {
    loading.value = true
    const res = await getTechParamMappingCharacterList({ oid: route.query.oid })
    undefinedOrderCharas.value = res.data.undefinedOrderCharas
    undefinedLogicCharas.value = res.data.undefinedLogicCharas
    definedOrderCharas.value = res.data.definedOrderCharas
    definedLogicCharas.value = res.data.definedLogicCharas
  } catch (error) {
    console.log('error:', error)
  } finally {
    loading.value = false
  }
}

/* type 是否刷新 */
const save = async (type) => {
  let data = []
  fixedCharas.value.forEach((item) => {
    item?.items.forEach((val) => {
      data.push({ choiceOid: val.value, optionOid: val?.optionOid })
    })
  })
  const payload = {
    data,
    oid: route.query.oid,
    type: 'fixed',
  }
  console.log('payload:', payload)
  try {
    loading.value = true
    const res = await updateOptionFixedRule(payload)
    if (res.success) {
      /* 更新保存前端 刷新页面 */
      if (type) {
        fetchData()
      } else {
        if (selectIndex.value === 1 || selectIndex.value === 2) {
          const changedFixed =
            selectIndex.value === 1
              ? featureRef1.value.changedFixedCharas()
              : featureRef2.value.changedFixedCharas()
          if (!isEmpty(changedFixed)) {
            fixedCharas.value = changedFixed.map((item) => {
              if (item.items) {
                return {
                  ...item,
                  items: item?.items.map((val) => ({ ...val, status: val.value ? 'Y' : 'N' })),
                }
              } else {
                return item
              }
            })
            /* 未定义 */
            const undefinedData = []
            const definedData = []
            fixedCharas.value.forEach((item) => {
              if (item.items) {
                item.items.forEach((val) => {
                  if (val.status === 'N') {
                    undefinedData.push({ optionName: val?.optionName, optionOid: val?.optionOid })
                  }
                  if (val.status === 'Y') {
                    definedData.push({ optionName: val?.optionName, optionOid: val?.optionOid })
                  }
                })
              }
            })
            if (selectIndex.vlaue === 1) {
              undefinedCharas.value = undefinedData
            } else {
              definedCharas.value = definedData
            }
          }
        }
      }
      $message.success('更新成功')
    }
  } catch (error) {
    console.log('error:', error)
  } finally {
    loading.value = false
  }
}

const confirm = () => {
  save(1)
}

const fetchData = async () => {
  try {
    loading.value = true
    const res = await getTechParamConfigCharacterList({ oid: route.query.oid })
    undefinedCharas.value = res.data.undefinedCharas
    definedCharas.value = res.data.definedCharas
    fixedCharas.value = res.data.fixedCharas
  } catch (error) {
    console.log('error:', error)
  } finally {
    loading.value = false
  }
}
onMounted(() => {
  fetchData()
})
</script>

<style lang="scss" scoped>
.n-spin-container {
  height: unset;
}
.footer {
  position: absolute;
  bottom: 24px;
  left: 0;
}
</style>
