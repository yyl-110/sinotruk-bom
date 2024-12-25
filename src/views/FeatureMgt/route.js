const Layout = () => import('@/layout/index.vue')

export default {
  name: 'FeatureMgt',
  path: '/feature',
  component: Layout,
  redirect: '/feature/mgt',
  meta: {
    order: 2,
  },
  children: [
    {
      name: 'FeatureMgt',
      path: 'mgt',
      component: () => import('./index.vue'),
      meta: {
        title: '特征管理',
        customIcon: 'icon_characteristic_normal',
        order: 1,
        keepAlive: true,
      },
    },
    {
      name: 'ConfigFeature',
      path: 'config',
      component: () => import('./ConfigFeature/index.vue'),
      isHidden: true,
      meta: {
        title: '特征管理',
        order: 2,
        activeMenu: 'FeatureMgt',
        keepAlive: true,
      },
    },
    {
      name: 'TechnicalFeature',
      path: 'technical',
      component: () => import('./TechnicalFeature/index.vue'),
      isHidden: true,
      meta: {
        title: '特征管理',
        order: 2,
        activeMenu: 'FeatureMgt',
        keepAlive: true,
      },
    },
    {
      name: 'ConfigFeatureMapping',
      path: 'mapping',
      component: () => import('./ConfigFeatureMapping/index.vue'),
      isHidden: true,
      meta: {
        title: '特征管理',
        order: 2,
        activeMenu: 'FeatureMgt',
        keepAlive: true,
      },
    },
    {
      name: 'GlobalLogic',
      path: 'global-logic',
      component: () => import('./GlobalLogic/index.vue'),
      isHidden: true,
      meta: {
        title: '特征管理',
        order: 2,
        activeMenu: 'FeatureMgt',
        keepAlive: true,
      },
    },
    {
      name: 'OptionalAc',
      path: 'optional-ac',
      component: () => import('./OptionalAc/index.vue'),
      isHidden: true,
      meta: {
        title: '特征管理',
        order: 2,
        activeMenu: 'FeatureMgt',
        keepAlive: true,
      },
    },
  ],
}
