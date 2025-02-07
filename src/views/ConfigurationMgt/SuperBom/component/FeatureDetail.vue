<template>
  <n-modal v-model:show="showModal" :mask-closable="false">
    <div h-95vh w-90vw flex flex-col overflow-hidden rounded-4 bg-white>
      <header h-40 flex flex-shrink-0 items-center flex-justify-between px-20>
        <div flex items-center>
          <div class="line" mr-8></div>
          <span text-14 font-bold text-hex-1d2129>
            {{ acTitle }}{{ acTitle ? '-' : '' }}特征详情
          </span>
        </div>
        <img
          src="@/assets/images/close.png"
          alt=""
          class="h-16 w-16 cursor-pointer"
          @click="cancel"
        />
      </header>
      <n-spin :show="loading" h-0 flex-1>
        <main h-full min-h-500 overflow-y-auto px-20 pb-15 pt-20>
          <div
            class="feature-item position-relative min-h-20 w-full"
            :class="[extendList[0] && 'isBorder']"
          >
            <div class="title flex items-center px-10" @click="handleChange(0)">
              <div
                class="wrap mr-8 flex items-center"
                flex-justify-center
                :class="[!extendList[0] && 'fold']"
              >
                <the-icon icon="extend" type="custom" size="10" class="icon" />
              </div>
              定位特征
            </div>
            <div
              v-show="extendList[0]"
              class="content min-h-200 flex flex pb-24 pl-26 pt-20"
              max-h-375
              overflow-y-auto
            >
              <n-space>
                <div v-for="(item, index) in positionItemsArr" :key="index" class="card">
                  <div
                    class="cardTitle flex items-center"
                    h-34
                    justify-center
                    bg-hex-e5f3ff
                    px-15
                    text-hex-1d2129
                  >
                    <n-ellipsis style="max-width: 150px">
                      {{ item.name }}
                    </n-ellipsis>
                  </div>
                  <div class="cardContent px-20 py-10">
                    <n-space>
                      <div
                        v-for="(val, inx) in item.value.split(',')"
                        :key="inx"
                        class="item px-14 py-6 text-14 text-hex-4E5969"
                        min-h-37
                      >
                        {{ val }}
                      </div>
                    </n-space>
                  </div>
                </div>
              </n-space>
            </div>
          </div>
          <div
            class="feature-item position-relative mt-20 min-h-20 w-full pb-24"
            :class="[extendList[1] && 'isBorder']"
          >
            <div class="title flex items-center px-10" @click="handleChange(1)">
              <div
                class="wrap mr-8 flex items-center"
                flex-justify-center
                :class="[!extendList[1] && 'fold']"
              >
                <the-icon icon="extend" type="custom" size="10" class="icon" />
              </div>
              附带特征
            </div>
            <div
              v-show="extendList[1]"
              class="content min-h-200 flex flex pl-26 pt-20"
              max-h-250
              overflow-y-auto
            >
              <n-space>
                <div v-for="(item, index) in incidentialItems" :key="index" class="card">
                  <div
                    class="cardTitle flex items-center"
                    h-34
                    justify-center
                    bg-hex-e5f3ff
                    px-15
                    text-hex-1d2129
                  >
                    <n-ellipsis style="max-width: 150px">
                      {{ item.name }}
                    </n-ellipsis>
                  </div>
                  <div class="cardContent px-20 py-10">
                    <n-space>
                      <div
                        v-for="(val, inx) in item.value.split(',')"
                        :key="inx"
                        class="item px-14 py-6 text-14 text-hex-4E5969"
                        min-h-37
                      >
                        {{ val }}
                      </div>
                    </n-space>
                  </div>
                </div>
              </n-space>
            </div>
          </div>
        </main>
      </n-spin>
      <!-- <footer h-70 flex items-center flex-justify-end px-20>
        <n-button mr-20 @click="reset">重置</n-button>
        <n-button mr-20 @click="cancel">保存</n-button>
        <n-button type="primary" @click="confirm">确定</n-button>
      </footer> -->
    </div>
  </n-modal>
</template>

<script setup>
import { ref } from 'vue'
import { getACModelCharacterInfo } from '~/src/api/config'
const formValue = ref({})
const formRef = ref(null)
const extendList = ref([true, true])

const emits = defineEmits(['handleConfirm'])
const showModal = ref(false)

const positionItemsArr = ref([])
const incidentialItems = ref([])
const acTitle = ref('')
const loading = ref(false)
const cancel = () => {
  showModal.value = false
}
const confirm = () => {
  formRef.value?.validate((errors) => {
    if (!errors) {
      emits('handleConfirm', formValue.value)
    } else {
      console.log(errors)
      $message.error(errors)
    }
  })
}

const reset = () => {
  formRef.value.restoreValidation()
}

const handleChange = (index) => {
  extendList.value[index] = !extendList.value[index]
}

const show = (oid) => {
  showModal.value = true
  fetchData(oid)
}
const close = () => {
  showModal.value = false
}

const fetchData = async (oid) => {
  try {
    loading.value = true
    const res = await getACModelCharacterInfo({ oid })
    const {
      positionItems = [],
      incidentialItems: incidentialItemsArr = [],
      title = '',
    } = res?.data || {}
    positionItemsArr.value = positionItems
    incidentialItems.value = incidentialItemsArr
    acTitle.value = title
  } catch (error) {
    console.log('error:', error)
  } finally {
    loading.value = false
  }
}

defineExpose({
  show,
  close,
})
</script>

<style lang="scss" scoped>
footer {
  border-top: 1px solid #f2f3f5;
}
.line {
  width: 4px;
  height: 18px;
  background: #1890ff;
}
header {
  background: rgba(165, 180, 203, 0.1);
}
.feature-item {
  border-radius: 3px;
  &.isBorder {
    border: 1px solid #e5e6eb;
  }
  .title {
    position: absolute;
    background: #fff;
    line-height: 20px;
    top: -5px;
    left: 15px;
    cursor: pointer;
  }
  .wrap {
    width: 16px;
    height: 16px;
    background: #d8d8d8;
    border-radius: 2px;
    .icon {
      transition: all 0.3s ease-in-out;
    }
    &.fold {
      .icon {
        transform: rotate(180deg);
      }
    }
  }
}
.item {
  border-radius: 4px;
  border: 1px solid #e5e6eb;
}
.cardContent {
  border-radius: 0px 0px 4px 4px;
  border: 1px solid #e5e6eb;
}
::v-deep .n-spin-content {
  height: 100%;
}
</style>
