import { getToken, refreshAccessToken, isNullOrWhitespace, setToken } from '@/utils'

const WHITE_LIST = ['/login', '/404']
export function createPermissionGuard(router) {
  router.beforeEach(async (to, from) => {
    if (!to?.path.includes('/configuration')) {
      sessionStorage.removeItem('isSpecial')
      sessionStorage.removeItem('status')
      sessionStorage.removeItem('configNumMgtSearchQuery')
    }
    // const token = getToken()
    // setToken('212')
    /** 没有token的情况 */
    // if (isNullOrWhitespace(token)) {
    //   if (WHITE_LIST.includes(to.path)) return true
    //   return { path: 'login', query: { ...to.query, redirect: to.path } }
    // }

    /** 有token的情况 */
    if (to.path === '/login') return { path: '/' }

    refreshAccessToken()
    return true
  })
}
