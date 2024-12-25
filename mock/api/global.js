export default [
  {
    url: '/Windchill/app/feature/getGlobalConfigFeatureList',
    method: 'post',
    response: () => {
      return {
        success: true,
        message: 'ok',
        // total: 5,
        // pages: 1,
        data: [
          {
            key: 'VR:com.ptc.windchill.option.model.Option:600825',
            value: '整车',
          },
        ],
      }
    },
  },
  {
    url: '/Windchill/app/config/getMappingRuleFeatureListForSpecial',
    method: 'post',
    response: () => {
      return {
        success: true,
        message: 'ok',
        // total: 5,
        // pages: 1,
        data: [
          {
            key: 'VR:com.ptc.windchill.option.model.Option:600825',
            value: '整车1',
          },
          {
            key: 'VR:com.ptc.windchill.option.model.Option:6008226',
            value: '整车2',
          },
        ],
      }
    },
  },
  {
    url: '/Windchill/app/config/getTableMappingDesignCharacterList',
    method: 'post',
    response: () => {
      return {
        success: true,
        message: 'ok',
        // total: 5,
        // pages: 1,
        data: [
          {
            key: 'VR:com.ptc.windchill.option.model.Option:1',
            value: '技术1',
          },
          {
            key: 'VR:com.ptc.windchill.option.model.Option:2',
            value: '技术2',
          },
        ],
      }
    },
  },
  {
    url: '/Windchill/app/config/getMappingRuleFeatureValuesForSpecial',
    method: 'post',
    response: () => {
      return {
        success: true,
        message: 'ok',
        // total: 5,
        // pages: 1,
        data: [
          {
            key: 'VR:com.ptc.windchill.option.model.Option:1',
            value: '配置1',
          },
          {
            key: 'VR:com.ptc.windchill.option.model.Option:2',
            value: '配置2',
          },
        ],
      }
    },
  },
  {
    url: '/Windchill/app/config/getACModuleList',
    method: 'post',
    response: () => {
      return {
        success: true,
        message: 'ok',
        // total: 5,
        // pages: 1,
        data: [
          {
            key: 'VR:com.ptc.windchill.option.model.Option:1',
            value: 'AC1',
          },
          {
            key: 'VR:com.ptc.windchill.option.model.Option:2',
            value: 'AC2',
          },
        ],
      }
    },
  },
  {
    url: '/Windchill/app/config/getPlatformACModuleList',
    method: 'post',
    response: () => {
      return {
        success: true,
        message: 'ok',
        // total: 5,
        // pages: 1,
        data: [
          {
            key: 'VR:com.ptc.windchill.option.model.Option:600825',
            value: 'M1',
          },
          {
            key: 'VR:com.ptc.windchill.option.model.Option:6030825',
            value: 'M2',
          },
          {
            key: 'VR:com.ptc.windchill.option.model.Option:6003825',
            value: 'M3',
          },
        ],
      }
    },
  },
  {
    url: '/Windchill/app/feature/globalTeachFeatureList',
    method: 'post',
    response: () => {
      return {
        success: true,
        message: 'ok',
        // total: 5,
        // pages: 1,
        data: [
          {
            key: 'VR:com.ptc.windchill.option.jg1',
            value: '结果1',
          },
          {
            key: 'VR:com.ptc.windchill.option.jg2',
            value: '结果2',
          },
          {
            key: 'VR:com.ptc.windchill.option.jg3',
            value: '结果3',
          },
        ],
      }
    },
  },
  {
    url: '/Windchill/app/config/mutexRuleConditionFeature',
    method: 'post',
    response: () => {
      return {
        success: true,
        message: 'ok',
        // total: 5,
        // pages: 1,
        data: [
          {
            key: 'VR:com.ptc.windchill.option.model.Option:600825',
            value: '条件1',
          },
          {
            key: 'VR:com.ptc.windchill.option.model.Option:6030825',
            value: '条件2',
          },
          {
            key: 'VR:com.ptc.windchill.option.model.Option:6003825',
            value: '条件3',
          },
        ],
      }
    },
  },
  {
    url: '/Windchill/app/config/localLogicFormulaConditionFeature',
    method: 'post',
    response: () => {
      return {
        success: true,
        message: 'ok',
        // total: 5,
        // pages: 1,
        data: [
          {
            key: 'VR:com.ptc.windchill.option.model.Option:600825',
            value: '条件1',
          },
          {
            key: 'VR:com.ptc.windchill.option.model.Option:6030825',
            value: '条件2',
          },
          {
            key: 'VR:com.ptc.windchill.option.model.Option:6003825',
            value: '条件3',
          },
        ],
      }
    },
  },
  {
    url: '/Windchill/app/config/mutexRuleConditionFeatureValueCombo',
    method: 'post',
    response: () => {
      return {
        success: true,
        message: 'ok',
        // total: 5,
        // pages: 1,
        data: [
          {
            key: 'VR:com.ptc.windchill.option.model.Option:6008252222',
            value: '结果1',
          },
          {
            key: 'VR:com.ptc.windchill.option.model.Option:6030825',
            value: '结果2',
          },
          {
            key: 'VR:com.ptc.windchill.option.model.Option:60038333325',
            value: '结果3',
          },
        ],
      }
    },
  },
  {
    url: '/Windchill/app/config/localLogicFormulaResultFeature',
    method: 'post',
    response: () => {
      return {
        success: true,
        message: 'ok',
        // total: 5,
        // pages: 1,
        data: [
          {
            key: 'VR:com.ptc.windchill.option.model.Option:6008225',
            value: '结果1',
          },
          {
            key: 'VR:com.ptc.windchill.option.model.Option:6030825',
            value: '结果2',
          },
          {
            key: 'VR:com.ptc.windchill.option.model.Option:6002223825',
            value: '结果3',
          },
        ],
      }
    },
  },
  {
    url: '/Windchill/app/feature/getDesignCharacterValueEnum',
    method: 'post',
    response: () => {
      return {
        success: true,
        message: 'ok',
        // total: 5,
        // pages: 1,
        data: [
          {
            key: '特征值1',
            value: '特征值1',
          },
          {
            key: '特征值2',
            value: '特征值2',
          },
          {
            key: '特征值3',
            value: '特征值3',
          },
          {
            key: '特征值4',
            value: '特征值4',
          },
        ],
      }
    },
  },
  {
    url: '/Windchill/app/config/getTableMappingACPartList',
    method: 'post',
    response: () => {
      return {
        success: true,
        message: 'ok',
        // total: 5,
        // pages: 1,
        data: [
          {
            key: 'OR:wt.part.WTPartMaster:123435',
            value: '0110-保险杠实例',
          },
          {
            key: 'OR:wt.part.WTPartMaster:123451',
            value: '0110-保险杠实例1',
          },
        ],
      }
    },
  },
  {
    url: '/Windchill/app/feature/getDesignCharacterClsEnum',
    method: 'post',
    response: () => {
      return {
        success: true,
        message: 'ok',
        // total: 5,
        // pages: 1,
        data: [
          {
            key: '整车',
            value: '整车',
          },
        ],
      }
    },
  },
  {
    url: '/Windchill/app/feature/getAllDesignCharacterList',
    method: 'post',
    response: () => {
      return {
        success: true,
        message: 'ok',
        // total: 5,
        // pages: 1,
        data: [
          {
            key: 'OR:com.ptc.windchill.option.model.1',
            value: '整车1',
          },
          {
            key: 'OR:com.ptc.windchill.option.model.2',
            value: '整车2',
          },
          {
            key: 'OR:com.ptc.windchill.option.model.3',
            value: '整车3',
          },
          {
            key: 'OR:com.ptc.windchill.option.model.4',
            value: '整车4',
          },
        ],
      }
    },
  },
  {
    url: '/Windchill/app/feature/getCharacterValueList',
    method: 'post',
    response: () => {
      return {
        success: true,
        message: 'ok',
        // total: 5,
        // pages: 1,
        data: [
          {
            key: 'OR:com.ptc.windchill.option.tz1',
            value: '特征值1',
          },
          {
            key: 'OR:com.ptc.windchill.option.tz2',
            value: '特征值2',
          },
          {
            key: 'OR:com.ptc.windchill.option.tz3',
            value: '特征值3',
          },
          {
            key: 'OR:com.ptc.windchill.option.tz4',
            value: '特征值4',
          },
        ],
      }
    },
  },
  {
    url: '/Windchill/app/feature/getDesignCharacterNameEnum',
    method: 'post',
    response: () => {
      return {
        success: true,
        message: 'ok',
        // total: 5,
        // pages: 1,
        data: [
          {
            key: 'OR:com.ptc.windchill.option.model.choiceMaster:12345',
            value: '名称2',
          },
          {
            key: 'OR:com.ptc.windchill.option.model.ChoiceMaster:253141',
            value: '名称3',
          },
          {
            key: 'OR:com.ptc.windchill.option.model.ChoiceMaster:2531431',
            value: '名称32',
          },
          {
            key: 'OR:com.ptc.windchill.option.model.ChoiceMaster:2543141',
            value: '名称333',
          },
        ],
      }
    },
  },
  {
    url: '/Windchill/app/feature/getMModuleList',
    method: 'post',
    response: () => {
      return {
        success: true,
        message: 'ok',
        // total: 5,
        // pages: 1,
        data: [
          {
            key: '0110-保险杠模块',
            value: '0110-保险杠模块',
          },
          {
            key: '0110-保险杠模块1',
            value: '0110-保险杠模块1',
          },
        ],
      }
    },
  },
  {
    url: '/Windchill/app/feature/getACModuleList',
    method: 'post',
    response: () => {
      return {
        success: true,
        message: 'ok',
        // total: 5,
        // pages: 1,
        data: [
          {
            key: '0110-保险杠AC模块2',
            value: '0110-保险杠AC模块333',
          },
          {
            key: '0110-保险杠AC模块23',
            value: '0110-保险杠AC模块3333',
          },
          {
            key: '0110-保险杠AC模3块23',
            value: '0110-保险杠AC模块33333',
          },
        ],
      }
    },
  },
  {
    url: '/Windchill/app/feature/getACModuleTechCharasList',
    method: 'post',
    response: () => {
      return {
        success: true,
        message: 'ok',
        // total: 5,
        // pages: 1,
        data: [
          {
            key: 'OR:com.ptc.windchill.option.model.OptionMaster:600825',
            value: '技术特征1',
          },
          {
            key: 'OR:com.ptc.windchill.option.model.OptionMaster:6008251',
            value: '技术特征12',
          },
        ],
      }
    },
  },
  {
    url: '/Windchill/app/feature/createFReviewDoc',
    method: 'post',
    response: () => {
      return {
        success: true,
        message: 'ok',
        // total: 5,
        // pages: 1,
        data: {},
      }
    },
  },
]
