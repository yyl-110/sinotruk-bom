<template>
  <div w-180 lt-lg:w-140>
    <div
      :style="{ backgroundColor: color }"
      h-32
      flex
      items-center
      flex-justify-center
      rounded-4
      text-14
      text-white
      class="title hasContent"
    >
      {{ title }}
    </div>
    <div class="content" h-32 flex items-center flex-justify-center text-hex-1890FF>
      <div v-if="isChoose" w-full text-14>
        <slot name="select" />
      </div>
      <span v-else>{{ content }}</span>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  color: {
    type: String,
    default: '#1890FF',
  },
  isChoose: {
    type: Boolean,
    default: false,
  },
  content: {
    type: String,
    default: '',
  },
})
// const emits = defineEmits(['choose'])
// const choose = () => {
//   emits('choose')
// }
</script>

<style lang="scss" scoped>
.content {
  border-radius: 0px 0px 4px 4px;
  border: 1px solid #e5e6eb;
  height: 32px;
}
.choose {
  text-decoration: underline;
  cursor: pointer;
}
.title {
  border-radius: 4px;
  &.hasContent {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }
}
</style>
