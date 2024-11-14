<template>
  <div min-w-180>
    <div
      :style="{ backgroundColor: color }"
      h-32
      flex
      items-center
      flex-justify-center
      rounded-4
      text-14
      text-white
      class="title"
      :class="[cardType === 2 && 'hasContent']"
    >
      {{ title }}
    </div>
    <div
      v-if="cardType === 2"
      class="content"
      h-32
      flex
      items-center
      flex-justify-center
      text-hex-1d2129
    >
      <div v-if="isChoose" w-full text-14>
        <slot name="select" />
      </div>
      <span v-else>{{ content }}</span>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  cardType: {
    type: Number,
    default: 1,
  },
  title: {
    type: String,
    default: '',
  },
  color: {
    type: String,
    default: '#CB2634',
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
const emits = defineEmits(['choose'])
const choose = () => {
  emits('choose')
}
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
