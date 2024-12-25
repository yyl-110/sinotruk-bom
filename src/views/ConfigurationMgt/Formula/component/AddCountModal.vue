<template>
  <n-modal v-model:show="showModal" :mask-closable="false" @after-leave="closeModel">
    <div w-1200 rounded-4 bg-white>
      <header h-40 flex items-center flex-justify-between px-20>
        <div flex items-center>
          <div class="line" mr-8></div>
          <span text-14 font-bold text-hex-1d2129>逻辑计算公式</span>
        </div>
        <img
          src="@/assets/images/close.png"
          alt=""
          class="h-16 w-16 cursor-pointer"
          @click="cancel"
        />
      </header>
      <n-spin :show="modalLoading">
        <main min-h-500 px-20 pt-20>
          <div class="form">
            <n-form
              ref="formRef"
              :model="formValue"
              :rules="rules"
              :label-width="120"
              label-placement="left"
              require-mark-placement="left"
              :disabled="modalType === 'detail'"
            >
              <n-grid :cols="24" :x-gap="24">
                <n-form-item-gi :span="8" label="规则名称" path="name">
                  <n-input v-model:value="formValue.name" placeholder="请输入" />
                </n-form-item-gi>
                <!-- <n-form-item-gi :span="8" label="所属模块">
                  <n-select
                    v-model:value="formValue.model"
                    placeholder="请选择"
                    :options="mModuleList"
                    label-field="value"
                    label-value="key"
                    :render-option="$renderTooltip"
                    multiple
                    filterable
                  />
                </n-form-item-gi> -->
                <n-form-item-gi :span="8" label="排序">
                  <n-input-number v-model:value="formValue.sort" :min="0" button-placement="both">
                    <template #minus-icon>
                      <the-icon icon="input_minus" :size="14" type="custom" />
                    </template>
                    <template #add-icon>
                      <the-icon icon="input_add" :size="14" type="custom" />
                    </template>
                  </n-input-number>
                </n-form-item-gi>
                <n-form-item-gi :span="10" label="选择条件特征" max-h-210 class="cus-scroll-y">
                  <div class="w-full">
                    <div
                      v-for="(item, index) in formValue.sourceObjects"
                      :key="index"
                      mb-24
                      flex
                      items-center
                    >
                      <n-select
                        :value="formValue.sourceObjects[index].oid"
                        placeholder="请选择"
                        :options="allDesignCharacterList"
                        label-field="value"
                        value-field="key"
                        :render-option="$renderTooltip"
                        filterable
                        min-w-200
                        w-auto
                        flex-shrink-0
                        @update:value="(val, obj) => changeTarget(val, obj, index)"
                      />
                      <n-button ml-10 h-32 w-32 rounded-4 @click="addTechnidal">
                        <template #icon>
                          <the-icon type="custom" icon="addBtn" size="14" />
                        </template>
                      </n-button>
                      <n-button
                        v-if="index > 0"
                        ml-10
                        h-32
                        w-32
                        rounded-4
                        @click="minusTechnidal(index)"
                      >
                        <template #icon>
                          <the-icon type="custom" icon="icon_minus" size="14" />
                        </template>
                      </n-button>
                    </div>
                  </div>
                </n-form-item-gi>
                <n-form-item-gi :span="10" label="结果特征" max-h-210 class="cus-scroll-y">
                  <div class="w-full">
                    <div
                      v-for="(item, index) in formValue.targetObjects"
                      :key="index"
                      mb-24
                      flex
                      items-center
                    >
                      <n-select
                        v-model:value="formValue.targetObjects[index].oid"
                        placeholder="请选择"
                        :options="resultList"
                        label-field="value"
                        value-field="key"
                        :render-option="$renderTooltip"
                        filterable
                        min-w-200
                        w-auto
                        flex-shrink-0
                      />
                      <div ml-10 h-32 w-32 flex-shrink-0>
                        <n-button h-32 w-32 rounded-4 @click="addResult">
                          <template #icon>
                            <the-icon type="custom" icon="addBtn" size="14" />
                          </template>
                        </n-button>
                      </div>
                      <div ml-10 h-32 w-32 flex-shrink-0>
                        <n-button v-if="index > 0" h-32 w-32 rounded-4 @click="minusResult(index)">
                          <template #icon>
                            <the-icon type="custom" icon="icon_minus" size="14" />
                          </template>
                        </n-button>
                      </div>
                    </div>
                  </div>
                </n-form-item-gi>

                <n-form-item-gi :span="20" label="输入条件特征">
                  <n-input
                    v-model:value="formValue.expression"
                    type="textarea"
                    placeholder="请输入"
                    maxlength="150"
                    show-count
                    :disabled="textareaState === 1"
                  />
                </n-form-item-gi>
                <n-form-item-gi :span="4" label="">
                  <n-button
                    v-for="item in textareaBtn"
                    :key="item.type"
                    mr-10
                    mt-40
                    h-30
                    w-30
                    rounded-10
                    size="tiny"
                    @click="handleClickTextarea(item)"
                  >
                    <template #icon>
                      <the-icon type="custom" :icon="item.icon" :size="16" color="#1890FF" />
                    </template>
                  </n-button>
                </n-form-item-gi>
              </n-grid>
            </n-form>
          </div>
        </main>
      </n-spin>
      <footer v-if="modalType !== 'detail'" h-70 flex items-center flex-justify-end px-20>
        <n-button mr-20 @click="showModal = false">取消</n-button>
        <n-button mr-20 @click="() => save()">保存</n-button>
        <n-button type="primary" @click="confirm">确定</n-button>
      </footer>
    </div>
  </n-modal>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import {
  createLocalLogicalRule,
  expressionComplianceCheck,
  getLogicalRuleDetail,
  updateLogicalRule,
} from '~/src/api/feature'
import useEnum from '~/src/hooks/useEnum'
import _ from 'lodash'
import { isArray } from '~/src/utils'
import { localLogicFormulaConditionFeature, localLogicFormulaResultFeature } from '~/src/api/config'
const { queryMModuleList } = useEnum()
const route = useRoute()

const formValue = ref({
  sort: 0,
  name: '',
  sourceObjects: [{ oid: null }],
  targetObjects: [{ oid: null }],
})
const formRef = ref(null)

const emits = defineEmits(['handleConfirm', 'handleClose'])

const modalType = ref('add') // add detail edit
const allDesignCharacterList = ref([]) // 技术特征枚举
const resultList = ref([]) // 结果枚举
const mModuleList = ref([]) // 枚举
const showModal = ref(false)
const textareaState = ref(1) // 1 禁止修改 2 允许修改
const storageExpression = ref('')
const saveState = ref(false)
const modalLoading = ref(false)
const selectOid = ref('')

/* 点击文本框后面的按钮 */
const handleClickTextarea = (btn) => {
  switch (btn.type) {
    case 1:
      textareaState.value = 2
      storageExpression.value = formValue.value.expression
      break
    case 2:
      verificationFormula()
      break
    case 3:
      formValue.value.expression = storageExpression.value
      storageExpression.value = updateExpressionText()
      break
    default:
      break
  }
}

/* 校验合规 */
const verificationFormula = async () => {
  if (!formValue.value.expression) {
    $message.warning('条件特征不能为空')
    return
  }
  /* 检查手动调整内容是否合规，如果不合规报错，如果合规输入条件特征文本框切换至不可编辑 */
  const payload = {
    data: formValue.value.sourceObjects.map((item) => ({
      name: allDesignCharacterList.value.find((val) => val.key === item.oid)?.value,
    })),
    expression: formValue.value.expression,
  }
  const res = await expressionComplianceCheck(payload)
  if (res.success) {
    $message.success(res.message)
    textareaState.value = 1
  }
}

const textareaBtn = [
  { icon: 'edit', text: '编辑', type: 1 },
  { icon: 'icon_operate_8', text: '提交', type: 2 },
  { icon: 'icon_operate_22', text: '撤回', type: 3 },
]

const rules = {
  name: {
    required: true,
    message: '请输入规则名称',
    trigger: 'blur',
  },
}

/* 更新条件特征为初始状态 */
const updateExpressionText = (type = 'reset', val, index, originValue) => {
  if (type === 'reset') {
    let expressionTextArr = formValue.value.sourceObjects.map(
      (item) => allDesignCharacterList.value.find((val) => val.key === item.oid)?.value || ''
    )
    formValue.value.expression = expressionTextArr.map((item) => `(${item})`).join('+')
    return
  }
  if (type === 'add') {
    /* 第一次添加 */
    if (!formValue.value.expression) {
      formValue.value.expression = `(${val})`
      return
    }
    /* 后面添加 */
    if (!originValue) {
      formValue.value.expression = `${formValue.value.expression}${val ? '+' : ''}(${val})`
    } else {
      formValue.value.expression = formValue.value.expression.replace(originValue, val)
    }
  }
  if (type === 'del') {
    if (originValue) {
      formValue.value.expression = formValue.value.expression.replace(originValue, '')
    }
  }
}

/* 条件特征 */
const changeTarget = (val, obj, index) => {
  let originOid = formValue.value.sourceObjects[index].oid
  const originValue = allDesignCharacterList.value.find((item) => item.key === originOid)?.value
  /* 更新条件特征 */
  updateExpressionText('add', obj?.value, index, originValue)

  formValue.value.sourceObjects[index].oid = val
}

const save = async (callback = null) => {
  formRef.value?.validate(async (errors) => {
    if (!errors) {
      // if (formValue.value.sourceObjects.some((item) => !item.oid)) {
      //   $message.info('条件特征不能为空')
      //   return
      // }
      // if (formValue.value.targetObjects.some((item) => !item.oid)) {
      //   $message.info('结果特征不能为空')
      //   return
      // }
      const formObj = {
        name: formValue.value.name,
        // model: isArray(formValue.value.model)
        //   ? formValue.value.model.join(',')
        //   : formValue.value.model,
        sort: formValue.value.sort,
        expression: formValue.value.expression,
        sourceObjects: formValue.value.sourceObjects.map((item) => ({
          oid: item.oid,
          name: allDesignCharacterList.value.find((val) => val.key === item.oid)?.value,
        })),
        targetObjects: formValue.value.targetObjects.map((item) => ({
          oid: item.oid,
          name: resultList.value.find((val) => val.key === item.oid)?.value,
        })),
      }
      const payload = {
        oid: modalType.value === 'add' ? route.query.oid : selectOid.value,
        ...formObj,
        type: 'calculate',
      }
      const apiUrl = modalType.value === 'edit' ? updateLogicalRule : createLocalLogicalRule
      const res = await apiUrl(payload)
      if (res.success) {
        $message.success('保存成功')
        emits('handleConfirm', res.data, modalType.value)

        /* 保存成功后弹框变成编辑状态 */
        modalType.value = 'edit'
        selectOid.value = res?.data.oid
        saveState.value = true
        if (callback) {
          callback()
        }
      }
    } else {
      console.log(errors)
    }
  })
}

const callback = () => {
  showModal.value = false
}

const cancel = () => {
  showModal.value = false
}
const confirm = () => {
  if (saveState.value) {
    showModal.value = false
    return
  }
  save(callback)
}

const addTechnidal = () => {
  formValue.value.sourceObjects.push({ oid: null })
}
const minusTechnidal = (index) => {
  formValue.value.sourceObjects.splice(index, 1)
  updateExpressionText('reset')
}
const addResult = () => {
  formValue.value.targetObjects.push({ oid: null })
}
const minusResult = (index) => {
  formValue.value.targetObjects.splice(index, 1)
}

const show = (type, oid) => {
  selectOid.value = oid
  saveState.value = false
  modalType.value = type
  /* 判断是否获取详情 */
  if (type === 'detail' || type === 'edit') {
    fetchData(oid)
  }
  fetchAllDesignCharacterList()
  fetchResultList(oid)
  // fetchMModuleList()
  showModal.value = true
}
const close = () => {
  showModal.value = false
}

defineExpose({
  show,
  close,
})

const closeModel = () => {
  formValue.value = {
    name: '',
    sort: 0,
    sourceObjects: [{ oid: null }],
    targetObjects: [{ oid: null }],
  }
  allDesignCharacterList.value = [] // 技术特征枚举
  resultList.value = [] // 结果枚举
  mModuleList.value = [] // 枚举
  emits('handleClose')
}

const fetchData = async (oid) => {
  let res = {}
  try {
    modalLoading.value = true
    res = await getLogicalRuleDetail({ oid })
  } catch (error) {
    console.log('error:', error)
  } finally {
    modalLoading.value = false
  }
  const arrData = res.data[0]
  formValue.value = {
    expression: arrData?.expression,
    name: arrData?.name,
    sort: Number(arrData?.sort || 0),
    sourceObjects: arrData.sourceObjects.length ? arrData.sourceObjects : [{ oid: null }],
    targetObjects: arrData.targetObjects.length ? arrData.targetObjects : [{ oid: null }],
  }
}

const fetchAllDesignCharacterList = async () => {
  const res = await localLogicFormulaConditionFeature({ oid: route.query.oid })
  allDesignCharacterList.value = res.data || []
}

const fetchMModuleList = async () => {
  const res = await queryMModuleList(route.query.oid)
  mModuleList.value = res.data || []
}

const fetchResultList = async (oid) => {
  const res = await localLogicFormulaResultFeature({
    oid: route.query.oid,
    ruleOid: modalType.value === 'add' ? '' : oid,
  })
  resultList.value = res.data || []
}

watch(
  () => formValue.value.sourceObjects,
  (val) => {
    const targetObjectsKeys = formValue.value.sourceObjects.map((item) => item.oid)
    /* 设置禁用 */
    allDesignCharacterList.value = allDesignCharacterList.value.map((item) => {
      if (targetObjectsKeys.includes(item.key)) {
        return { ...item, disabled: true }
      }
      return { ...item, disabled: false }
    })
  },
  { deep: true }
)
watch(
  () => formValue.value.targetObjects,
  (val) => {
    const targetObjectsKeys = formValue.value.targetObjects.map((item) => item.oid)
    console.log('targetObjectsKeys:', targetObjectsKeys)
    /* 设置禁用 */
    resultList.value = resultList.value.map((item) => {
      if (targetObjectsKeys.includes(item.key)) {
        return { ...item, disabled: true }
      }
      return { ...item, disabled: false }
    })
  },
  { deep: true }
)
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
// .form {
//   border-bottom: 1px solid #eaeaea;
// }
</style>
