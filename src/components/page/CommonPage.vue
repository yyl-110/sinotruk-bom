<template>
  <AppPage :show-footer="showFooter">
    <header v-if="showHeader" min-h-48 flex items-center justify-between px-20 pl-0>
      <slot v-if="$slots.header" name="header" />
      <template v-else>
        <h2 flex items-center text-14 font-normal dark:text-hex-ccc>
          <span :class="subTitle ? 'text-hex-86909C' : 'text-hex-1D2129'" @click="backTop">
            {{ title || route.meta?.title }}
          </span>
          <span v-if="subTitle" flex items-center text-hex-1d2129>
            <the-icon icon="right" type="custom" color="#86909C" />
            {{ subTitle }}{{ itemName }}&nbsp;
            <span text-red>{{ currentObjState.state }}</span>
          </span>
        </h2>
        <slot name="action" />
      </template>
    </header>

    <div class="cus-scroll-x" flex-1 rounded-4 bg-white pb-20>
      <slot />
    </div>
  </AppPage>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useBusinessStore } from '~/src/store'
import { storeToRefs } from 'pinia'
const businessStore = useBusinessStore()
const { currentObjState } = storeToRefs(businessStore)

const props = defineProps({
  showFooter: {
    type: Boolean,
    default: false,
  },
  showHeader: {
    type: Boolean,
    default: true,
  },
  title: {
    type: String,
    default: undefined,
  },
  subTitle: {
    type: String,
    default: undefined,
  },
  back: {
    type: String,
    default: '',
  },
})
const route = useRoute()
const router = useRouter()
const itemName = computed(() => {
  return route.query.number ? `（${route.query.number}）` : ''
})
const backTop = () => {
  if (props.back) {
    router.push(props.back)
  }
}
</script>
