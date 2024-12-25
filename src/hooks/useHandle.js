import { createFReviewDoc } from '@/api/global'
import { useAppStore } from '@/store/modules/app'

export default function () {
  const appStore = useAppStore()
  const { changeLoading } = appStore
  const queryCreateFReviewDoc = async (oid, type) => {
    try {
      changeLoading(true)
      const payload = { oid }
      type && (payload.type = type)
      const res = await createFReviewDoc(payload)
      if (res.success) {
        $message.success(res.message)
      }
    } catch (error) {
      console.log('error:', error)
    } finally {
      changeLoading(false)
    }
  }
  /**
   * @param {*} api 删除接口
   * @param {*} payload 接口参数
   * @param {*} content 展示信息
   * @param {*} text 传入信息
   * @return {*}
   */
  const handleDelete = async (api, payload, name, text = '') => {
    return new Promise((r, j) => {
      const d = $dialog.confirm({
        // title: '信息',
        content: text ? text : `是否确认删除${name}`,
        negativeText: '取消',
        positiveText: '确认',
        onPositiveClick: () => {
          d.loading = true
          return api(payload)
            .then((res) => {
              // changeLoading(false)
              if (res.success) {
                $message.success('删除成功')
                r()
              }
              j()
            })
            .catch((e) => {
              j(e)
              // changeLoading(false)
            })
        },
      })
    })
  }

  /* 弹出创建更改页面 */
  const createChangePage = (url) => {
    url && window.open(url)
  }
  return {
    queryCreateFReviewDoc,
    handleDelete,
    createChangePage,
  }
}
