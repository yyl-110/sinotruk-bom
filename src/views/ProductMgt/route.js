const Layout = () => import('@/layout/index.vue')

export default {
  name: 'ProductMgt',
  path: '/',
  component: Layout,
  redirect: '/product-mgt',
  meta: {
    order: 1,
  },
  children: [
    {
      name: 'ProductMgt',
      path: 'product-mgt',
      component: () => import('./index.vue'),
      meta: {
        title: '产品管理',
        customIcon: 'icon_product',
        keepAlive: true,
      },
    },
  ],
}
