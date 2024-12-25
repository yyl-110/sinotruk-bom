const Layout = () => import('@/layout/index.vue')

export default {
  name: 'ConfigurationMgt',
  path: '/configuration',
  component: Layout,
  redirect: '/configuration/mgt',
  meta: {
    order: 10,
  },
  children: [
    {
      name: 'ConfigurationMgt',
      path: 'mgt',
      component: () => import('./index.vue'),
      meta: {
        title: '配置管理',
        customIcon: 'icon_configuration_normal',
        keepAlive: true,
      },
    },
    {
      name: 'SpectrumPlanning',
      path: 'spectrum',
      component: () => import('./SpectrumPlanning/index.vue'),
      isHidden: true,
      meta: {
        title: '配置管理',
        order: 2,
        activeMenu: 'ConfigurationMgt',
      },
    },
    {
      name: 'TechnologyConfig',
      path: 'technology-config',
      component: () => import('./TechnologyConfig/index.vue'),
      isHidden: true,
      meta: {
        title: '配置管理',
        order: 2,
        activeMenu: 'ConfigurationMgt',
      },
    },
    {
      name: 'TechnicalParam',
      path: 'technology-param',
      component: () => import('./TechnicalParam/index.vue'),
      isHidden: true,
      meta: {
        title: '配置管理',
        order: 2,
        activeMenu: 'ConfigurationMgt',
      },
    },
    {
      name: 'MatchingFormula',
      path: 'matching-formula',
      component: () => import('./MatchingFormula/index.vue'),
      isHidden: true,
      meta: {
        title: '配置管理',
        order: 2,
        activeMenu: 'ConfigurationMgt',
      },
    },
    {
      name: 'Formula',
      path: 'formula',
      component: () => import('./Formula/index.vue'),
      isHidden: true,
      meta: {
        title: '配置管理',
        order: 2,
        activeMenu: 'ConfigurationMgt',
      },
    },
    {
      name: 'ConfigNumMgt',
      path: 'num-mgt',
      component: () => import('./ConfigNumMgt/index.vue'),
      isHidden: true,
      meta: {
        title: '配置管理',
        order: 2,
        activeMenu: 'ConfigurationMgt',
        keepAlive: true,
      },
    },
    {
      name: 'SuperBom',
      path: 'super-bom',
      component: () => import('./SuperBom/index.vue'),
      isHidden: true,
      meta: {
        title: '配置管理',
        order: 2,
        activeMenu: 'ConfigurationMgt',
      },
    },
    {
      name: 'FeatureMapping',
      path: 'feature-mapping',
      component: () => import('./FeatureMapping/index.vue'),
      isHidden: true,
      meta: {
        title: '配置管理',
        order: 2,
        activeMenu: 'ConfigurationMgt',
      },
    },
    {
      name: 'NumberMapping',
      path: 'number-mapping',
      component: () => import('./NumberMapping/index.vue'),
      isHidden: true,
      meta: {
        title: '配置管理',
        order: 2,
        activeMenu: 'ConfigurationMgt',
      },
    },
  ],
}
