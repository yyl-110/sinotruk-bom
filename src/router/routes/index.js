const Layout = () => import('@/layout/index.vue')

export const basicRoutes = [
  {
    name: '404',
    path: '/404',
    component: () => import('@/views/error-page/404.vue'),
    isHidden: true,
  },

  {
    name: 'Login',
    path: '/login',
    component: () => import('@/views/login/index.vue'),
    isHidden: true,
    meta: {
      title: '登录页',
    },
  },
  {
    name: 'ViewDetail',
    path: '/view-detail',
    component: () => import('@/views/ConfigurationMgt/ViewDetail/index.vue'),
    isHidden: true,
    meta: {
      title: '查看配置号明细',
    },
  },
  {
    name: 'DispatchTask',
    path: '/dispatch-task',
    component: () => import('@/views/ConfigurationMgt/Task/DispatchTask.vue'),
    isHidden: true,
    meta: {
      title: '配置号下发任务',
    },
  },
  {
    name: 'TaskQuery',
    path: '/query-task',
    component: () => import('@/views/ConfigurationMgt/Task/TaskQuery.vue'),
    isHidden: true,
    meta: {
      title: '查看AC任务',
    },
  },
  // {
  //   name: 'ExternalLink',
  //   path: '/external-link',
  //   component: Layout,
  //   meta: {
  //     title: '外部链接',
  //     icon: 'mdi:link-variant',
  //     order: 4,
  //   },
  //   children: [
  //     {
  //       name: 'LinkGithubSrc',
  //       path: 'https://github.com/zclzone/vue-naive-admin',
  //       meta: {
  //         title: '源码 - github',
  //         icon: 'mdi:github',
  //       },
  //     },
  //     {
  //       name: 'LinkGiteeSrc',
  //       path: 'https://gitee.com/zclzone/vue-naive-admin',
  //       meta: {
  //         title: '源码 - gitee',
  //         icon: 'simple-icons:gitee',
  //       },
  //     },
  //     {
  //       name: 'LinkDocs',
  //       path: 'https://zclzone.github.io/vue-naive-admin-docs',
  //       meta: {
  //         title: '文档 - vuepress',
  //         icon: 'mdi:vuejs',
  //       },
  //     },
  //   ],
  // },
]

export const NOT_FOUND_ROUTE = {
  name: 'NotFound',
  path: '/:pathMatch(.*)*',
  redirect: '/404',
  isHidden: true,
}

export const EMPTY_ROUTE = {
  name: 'Empty',
  path: '/:pathMatch(.*)*',
  component: null,
}

const modules = import.meta.glob('@/views/**/route.js', { eager: true })
const asyncRoutes = []
Object.keys(modules).forEach((key) => {
  asyncRoutes.push(modules[key].default)
})

export { asyncRoutes }
