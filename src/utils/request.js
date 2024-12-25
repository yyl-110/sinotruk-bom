import axios from 'axios'
import { useDragModal } from '~/src/hooks/useDragModal'

// post请求头
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8'
// create an axios instance
// process.env.VUE_APP_BASE_API
const service = axios.create({
  baseURL: process.env.NODE_ENV === 'production' ? '' : '', // import.meta.env.VITE_BASE_API url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 3000000, // request timeout
})

// request interceptor
service.interceptors.request.use(
  (config) => {
    // do something before request is sent
    // if (store.getters.token) {
    //   // let each request carry token
    //   // ['X-Token'] is a custom headers key
    //   // please modify it according to the actual situation
    //   config.headers['X-Token'] = getToken();
    // }
    return config
  },
  (error) => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

service.interceptors.response.use((response) => {
  // IE 8-9
  if (
    response.data == null &&
    response.config.responseType === 'json' &&
    response.request.responseText != null
  ) {
    try {
      // eslint-disable-next-line no-param-reassign
      response.data = JSON.parse(response.request.responseText)
    } catch (e) {
      // ignored
    }
  }
  return response
})

/**
 * get方法，对应get请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function get(url, params) {
  return new Promise((resolve, reject) => {
    service
      .get(url, {
        params: params,
      })
      .then((res) => {
        const { success, message, msg, data = null } = res.data || {}
        if (!success) {
          $message.error(message || msg)
        }
        resolve(res?.data)
      })
      .catch((err) => {
        reject(err.data)
      })
  })
}
/**
 * post方法，对应post请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function post(url, params, options) {
  const { isSkipError = false, showDialog = false } = params || {}
  if (params?.isSkipError) delete params.isSkipError
  if (params?.showDialog) delete params.showDialog
  return new Promise((resolve, reject) => {
    service
      .post(url, params, options)
      .then((res) => {
        const { success, message, msg, data = null } = res.data || {}
        if (!success) {
          if (showDialog) {
            $dialog.errorModal({
              content: message || msg,
              title: '',
              showIcon: false,
              negativeText: '',
              positiveText: '确定',
              onAfterEnter: (e) => {
                useDragModal(e, '.n-dialog__content')
              },
            })
          } else {
            $message.error(message || msg)
          }
        }
        resolve(res?.data)
      })
      .catch((err) => {
        reject(err.data)
      })
  })
}

export default service
