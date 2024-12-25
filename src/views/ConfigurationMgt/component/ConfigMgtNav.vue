<template>
  <div w-full>
    <n-radio-group v-model:value="value" name="radiobuttongroup1" @update:value="change">
      <n-radio-button
        v-for="song in getSpecial"
        :key="song.value"
        :value="song.value"
        :label="song.label"
      />
    </n-radio-group>
  </div>
</template>

<script setup>
import { computed, onActivated, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getCurrentObjState } from '~/src/api/config'
import { useBusinessStore } from '~/src/store'
const { handleCurrentObjState } = useBusinessStore()

const router = useRouter()
const route = useRoute()
const isSpecial = ref(false)

// 特殊车型
const list = ref([
  { value: 1, label: '型谱策划', url: 'spectrum' },
  { value: 2, label: '技术配置', url: 'technology-config' },
  // { value: 3, label: '技术参数', url: 'technology-param' },
  // { value: 4, label: '配置特征映射', url: 'feature-mapping' },
  // { value: 5, label: '匹配公式', url: 'matching-formula' },
  // { value: 6, label: '计算公式', url: 'formula' },
  { value: 7, label: '表号映射管理', url: 'number-mapping' },
  { value: 8, label: '配置号管理', url: 'num-mgt' },
  { value: 9, label: '超级BOM', url: 'super-bom' },
])
//普通车型
const list1 = ref([
  { value: 1, label: '型谱策划', url: 'spectrum' },
  { value: 2, label: '技术配置', url: 'technology-config' },
  { value: 3, label: '技术参数', url: 'technology-param' },
  // { value: 4, label: '配置特征映射', url: 'feature-mapping' },
  { value: 5, label: '匹配公式', url: 'matching-formula' },
  { value: 6, label: '计算公式', url: 'formula' },
  // { value: 7, label: '表号映射管理', url: 'number-mapping' },
  { value: 8, label: '配置号管理', url: 'num-mgt' },
  { value: 9, label: '超级BOM', url: 'super-bom' },
])

const getSpecial = computed(() => (isSpecial.value ? list.value : list1.value))

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
  const url = getSpecial.value.find((item) => item.value === val)?.url
  router.push({ path: url, query: { oid: route.query.oid, number: route.query.number } })
}

const fetchConfigData = async () => {
  try {
    const res = await getCurrentObjState({ oid: route.query.oid })
    if (res.success) {
      isSpecial.value = res.data?.configVehicle === '特殊车型'
      handleCurrentObjState(res.data)
    }
  } catch (error) {
    console.log('error:', error)
  }
}
onMounted(() => {
  fetchConfigData()
})
onActivated(() => {
  if (props.select === 8) {
    value.value = props.select
    fetchConfigData()
  }
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
