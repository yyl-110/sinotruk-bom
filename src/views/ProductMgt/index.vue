<template>
  <CommonPage>
    <div h-full w-full overflow-x-hidden overflow-y-hidden>
      <n-grid
        cols="13 s:13 m:13 l:13 xl:13 2xl:13"
        responsive="screen"
        class="gridWrap"
        lg:h-full
        lt-lg:h-auto
      >
        <n-grid-item span="13 s:13 m:5 l:4 xl:4 2xl:3" class="item1 cus-scroll-y h-full pl-20">
          <div class="tree-wrap py-20 pr-10">
            <n-spin :show="loading">
              <!-- :override-default-node-click-behavior="override" -->
              <n-tree
                :data="treeData"
                :default-expanded-keys="defaultExpandedKeys"
                :render-prefix="renderPrefixIcon"
                :render-switcher-icon="renderSwitcherIconWithExpaned"
                :selected-keys="selectKey"
                block-line
                show-line
                text-14
                :loading="loading"
                @update:selected-keys="handleSelectedChange"
              />
            </n-spin>
          </div>
        </n-grid-item>
        <n-grid-item span="13 s:13 m:8 l:9 xl:9 2xl:10" class="cus-scroll-y" h-full>
          <div px-20 pb-20>
            <!-- 车型子类 -->
            <card-children
              v-if="rightActionType === 1"
              :oid="actionOid"
              :parent-oid="pOid"
              @handle-confirm="fetchData"
              @handle-click-item="handleClickItem"
            />
            <!-- 内部车型号 -->
            <internal-car
              v-if="rightActionType === 2"
              :oid="actionOid"
              :parent-oid="pOid"
              @handle-confirm="fetchData"
            />
          </div>
        </n-grid-item>
      </n-grid>
    </div>
    <!-- 新建子节点 -->
    <add-children-modal
      ref="addChildrenRef"
      @handle-confirm="addChildren"
      @handle-edit="editChildren"
    />

    <!-- 新增品牌 -->
    <addBrandModal ref="addBrandRef" @handle-confirm="addBrand" @handle-edit="editBrand" />
  </CommonPage>
</template>

<script setup>
import { onActivated, onMounted, ref } from 'vue'
import { NButton, NEllipsis, NIcon, NTooltip } from 'naive-ui'
import SvgIcon from '@/components/icon/SvgIcon.vue'
import CardChildren from './component/CardChildren.vue'
import icon_manage from '@/assets/images/icon_manage.png'
import AddChildrenModal from './component/addChildrenModal.vue'
import AddBrandModal from './component/addBrandModal.vue'
import InternalCar from './component/InternalCar.vue'
import { createTreeNode, deleteTreeNode, getBaseStructure, modifyTreeNode } from '@/api/product'
import useHandle from '~/src/hooks/useHandle'
import { useAppStore } from '~/src/store'
const { handleDelete } = useHandle()
const { changeLoading } = useAppStore()
defineOptions({ name: 'ProductMgt' })

const addChildrenRef = ref(null)
const addBrandRef = ref(null)

const rightActionType = ref(0) // 1:车型子类 2:内部车型号
const actionOid = ref('') // 查看列表oid
/* 父Oid */
const pOid = ref('')
const handleActionOid = ref('') //操作oid
const loading = ref(false)
const selectKey = ref([])

/* 选中节点 */
const handleSelectedChange = (val, options) => {
  const option = options[0]
  selectKey.value = val

  pOid.value = option.parentOid
  if (option?.createTitle === '车型子类') {
    rightActionType.value = 1
    actionOid.value = option?.key
  } else if (option?.createTitle === '内部车型号') {
    rightActionType.value = 2
    actionOid.value = option?.key
  } else {
    rightActionType.value = 0
  }
}

const getTree = (tree = [], oid = '') => {
  let arr = []
  if (!!tree && tree.length !== 0) {
    tree.forEach((item) => {
      let obj = {}
      obj = { ...item, parentOid: oid, childNodes: getTree(item.childNodes, item.oid) }
      arr.push(obj)
    })
  }
  return arr
}

const getOids = (data = []) => {
  // if (data.childType === '车型子类') {
  //   defaultExpandedKeys.value.push(data.oid)
  //   return
  // }
  data.forEach((item) => {
    if (item.childType !== '车型子类') {
      defaultExpandedKeys.value.push(item.oid)
      getOids(item.childNodes || [])
    }
  })
}

/**
 * @param {*} type 是否处理展开逻辑 1 处理
 * @return {*}
 */
const fetchData = async (type) => {
  try {
    loading.value = true
    const res = await getBaseStructure()
    treeData.value = createData(getTree([res?.data]))
    if (type === 1) {
      getOids(res.data?.childNodes)
      if (res.data?.childNodes && res.data?.childNodes.length)
        defaultExpandedKeys.value.push(res.data.oid)
    }
  } catch (error) {
    console.log('error:', error)
  } finally {
    loading.value = false
  }
}

function createData(list) {
  if (!list) return undefined
  return list.map((item, index) => {
    return {
      label: () => {
        return h(NEllipsis, { class: 'pr-0' }, { default: () => item.name })
      },
      key: item.oid,
      parentOid: item?.parentOid,
      children: item?.childNodes && item?.childNodes.length && createData(item?.childNodes),
      childType: item?.childType,
      createTitle: item?.createTitle,
      suffix: () => {
        if (!item?.action) return ''
        const actionArr = item?.action.split(',')
        return h(
          'div',
          { class: 'flex items-center' },
          {
            default: () => [
              h(
                NTooltip,
                { trigger: 'hover', disabled: !actionArr.includes('create') },
                {
                  trigger: () =>
                    h(
                      NIcon,
                      {
                        size: 16,
                        color: '#1D2129',
                        class: 'mr-10',
                        onclick: (e) => {
                          e.stopPropagation()
                          if (item.createPermission === 'N') return
                          handleActionOid.value = item.oid
                          /* 新建品牌 */
                          if (item?.createTitle === '品牌') {
                            addBrandRef.value.show('add', item)
                          } else {
                            addChildrenRef.value.show('add', item, item?.createTitle)
                          }
                        },
                      },
                      {
                        default: () =>
                          h(SvgIcon, { icon: actionArr.includes('create') ? 'create' : '' }),
                      }
                    ),
                  default: () => '新增',
                }
              ),
              h(
                NTooltip,
                { trigger: 'hover', disabled: !actionArr.includes('modify') },
                {
                  trigger: () =>
                    h(
                      NIcon,
                      {
                        size: 16,
                        color: '#1D2129',
                        class: 'mr-10',
                        onClick: (e) => {
                          e.stopPropagation()
                          if (item.modifyPermission === 'N') return
                          handleActionOid.value = item.oid
                          if (item?.childType === '品牌') {
                            addBrandRef.value.show('edit', item)
                          } else {
                            addChildrenRef.value.show('edit', item)
                          }
                        },
                      },
                      {
                        default: () =>
                          h(SvgIcon, { icon: actionArr.includes('modify') ? 'modify' : '' }),
                      }
                    ),
                  default: () => '修改',
                }
              ),
              h(
                NTooltip,
                { trigger: 'hover', disabled: !actionArr.includes('delete') },
                {
                  trigger: () =>
                    h(
                      NIcon,
                      {
                        size: 16,
                        color: '#1D2129',
                        onClick: async (e) => {
                          e.stopPropagation()
                          if (item.deletePermission === 'N') return
                          handleActionOid.value = item.oid
                          if (item?.childNodes && item?.childNodes.length > 0) {
                            $message.error('存在子项，不允许删除')
                            return
                          }
                          await handleDelete(deleteTreeNode, { oid: item?.oid }, item?.name)
                          fetchData()
                        },
                      },
                      {
                        default: () =>
                          h(SvgIcon, { icon: actionArr.includes('delete') ? 'delete' : '' }),
                      }
                    ),
                  default: () => '删除',
                }
              ),
            ],
          }
        )
      },
    }
  })
}

const defaultExpandedKeys = ref([])
const treeData = ref([])
const renderSwitcherIconWithExpaned = ({ expanded }) => {
  return expanded ? h(SvgIcon, { icon: 'minus' }) : h(SvgIcon, { icon: 'add' })
}
const renderPrefixIcon = () => h('img', { size: 16, src: icon_manage, class: 'w-16 h-16' })

/* 新增子节点 */
const addChildren = async (val) => {
  try {
    changeLoading(true)
    const res = await createTreeNode({
      ...val,
      createPermission: 'Y',
      modifyPermission: 'Y',
      deletePermission: 'Y',
      childNodes: [],
    })
    if (res.success) {
      $message.success('新增成功')
      addChildrenRef.value.close()
      fetchData()
    }
  } catch (error) {
    console.log('error:', error)
  } finally {
    changeLoading(false)
  }
}
/* 修改子节点 */
const editChildren = async (val) => {
  try {
    changeLoading(true)
    const res = await modifyTreeNode({
      ...val,
    })
    if (res.success) {
      $message.success('修改成功')
      addChildrenRef.value.close()
      fetchData()
    }
  } catch (error) {
    console.log('error:', error)
  } finally {
    changeLoading(false)
  }
}
/* 新增品牌 */
const addBrand = async (val) => {
  try {
    changeLoading(true)
    const res = await createTreeNode({
      ...val,
      createPermission: 'Y',
      modifyPermission: 'Y',
      deletePermission: 'Y',
      childNodes: [],
    })
    if (res.success) {
      $message.success('新增成功')
      addBrandRef.value.close()
      fetchData()
    }
  } catch (error) {
    console.log('error:', error)
  } finally {
    changeLoading(false)
  }
}
/* 修改品牌 */
const editBrand = async (val) => {
  try {
    changeLoading(true)
    const res = await modifyTreeNode({
      ...val,
    })
    if (res.success) {
      $message.success('修改成功')
      addBrandRef.value.close()
      fetchData()
    }
  } catch (error) {
    console.log('error:', error)
  } finally {
    changeLoading(false)
  }
}

const override = ({ option }) => {
  pOid.value = option.parentOid
  if (option?.createTitle === '车型子类') {
    rightActionType.value = 1
    actionOid.value = option?.key
  } else if (option?.createTitle === '内部车型号') {
    rightActionType.value = 2
    actionOid.value = option?.key
  } else {
    rightActionType.value = 0
  }
}

const handleClickItem = (oid) => {
  rightActionType.value = 2
  actionOid.value = oid
  selectKey.value = [oid]
}

// onMounted(() => {
//   fetchData(1)
// })
onActivated(() => {
  fetchData(1)
})
</script>

<style lang="scss" scoped>
::v-deep.n-tree .n-tree-node-switcher.n-tree-node-switcher--expanded {
  transform: unset !important;
}
::v-deep.n-tree .n-tree-node-switcher__icon {
  width: 18px;
  height: 18px;
  font-size: 18px !important;
}
.tree-wrap {
  height: 100%;
}
.item1 {
  box-shadow: inset -1px 0px 0px 0px #eaeaea;
  height: 100%;
}

@media (max-width: 1023.9px) {
  .item1 {
    box-shadow: none !important;
  }
}
::v-deep.n-tree .n-tree-node-content .n-tree-node-content__text {
  color: #4e5969;
  overflow: hidden;
}

::v-deep.n-tree .n-tree-node-content__suffix {
  // min-width: 10px;
}
</style>
