import { Random } from 'mockjs'
const _data = Math.random() * 10 > 3 ? '测试1' : '测试2'

const list = [
  {
    oid: 'VR:com.ptc.windchill.option.model.Option:12345',
    number: '00101',
    name: '特征1',
    version: 'A.1',
    status: '设计中',
    sort: '1',
    type: '固化特征',
    changeUrl: 'http://xxx.xxx/xxx',
    processCreator: 'zs',
  },
  {
    processCreator: 'zs',
    oid: 'VR:com.ptc.windchill.option.model.Option:12345',
    number: '00101',
    name: '特征1',
    version: 'A.1',
    status: '已完成',
    sort: '1',
    type: '固化特征',
    changeUrl: 'http://xxx.xxx/xxx',
  },
  {
    oid: 'VR:com.ptc.windchill.option.model.Option:12345',
    number: '00101',
    name: '特征1',
    version: 'A.1',
    status: '已完成',
    sort: '1',
    type: '固化特征',
    changeUrl: 'http://xxx.xxx/xxx',
  },
  {
    oid: 'VR:com.ptc.windchill.option.model.Option:12345',
    number: '00101',
    name: '特征1',
    version: 'A.1',
    status: '已完成',
    sort: '1',
    type: '固化特征',
    changeUrl: 'http://xxx.xxx/xxx',
  },
]

export default [
  {
    url: '/Windchill/app/feature/getPlatformList',
    method: 'post',
    response: () => {
      return {
        success: true,
        message: 'ok',
        // total: 5,
        // pages: 1,
        data: [
          {
            oid: 'OR:wt.pdmlink.PDMLinkProduct:600826',
            name: '中重卡平台',
            changeUrl: 'http://xxx/xxx/xxx',
          },
          {
            oid: 'OR:wt.pdmlink.PDMLinkProduct:600826',
            name: '轻卡平台',
            changeUrl: 'http://xxx/xxx/xxx',
          },
        ],
      }
    },
  },
  {
    url: '/Windchill/app/feature/getSaleCharacterDetail',
    method: 'post',
    response: () => {
      return {
        success: true,
        message: 'ok',
        // total: 5,
        // pages: 1,
        data: {
          oid: () => Random.id(),
          number: () => Random.id(),
          name: () => Random.ctitle(3, 5),
          type: '固化配置',
          sort: '1',
          description: '',
          'values|10-20': [
            {
              'sort|1-100': 1,
              value: () => Random.ctitle(3, 5),
              saleDesc: '销售语言',
            },
          ],
        },
      }
    },
  },
  {
    url: '/Windchill/app/feature/getSaleCharacterDetailV2',
    method: 'post',
    response: () => {
      return {
        success: true,
        message: 'ok',
        // total: 5,
        // pages: 1,
        data: {
          oid: 'VR:com.ptc.windchill.option.model.Option:12345',
          number: '00101',
          name: '特征1',
          type: '通用特征',
          classification: 'zc',
          source: '订单',
          sort: '1',
          filePath: 'https://www.baidu.com',
          fileName: () => Random.ctitle(),
          description: Math.random().toFixed(1),
          'values|10-20': [
            {
              'sort|1-100': 1,
              value: () => Random.ctitle(3, 5),
            },
          ],
        },
      }
    },
  },
  {
    url: '/Windchill/app/feature/reverseACModels',
    method: 'post',
    response: () => {
      return {
        success: true,
        message: 'ok',
        // total: 5,
        // pages: 1,
        data: [
          {
            name: '发动机模块',
            location: '定位',
            url: 'http://xxx.xxx/xxx',
          },
          {
            name: '发动机模块',
            location: '定位',
            url: 'http://xxx.xxx/xxx',
          },
        ],
      }
    },
  },
  {
    url: '/Windchill/app/feature/reverseModelLogicalRules',
    method: 'post',
    response: () => {
      return {
        success: true,
        message: 'ok',
        // total: 5,
        // pages: 1,
        data: [
          {
            oid: 'VR:com.ptc.windchill.option.model.OptionSet:8657693436',
            name: '车型子类名称',
            ruleName: '发动机模块',
            location: '定位',
          },
          {
            oid: 'VR:com.ptc.windchill.option.model.OptionSet:8657693436',
            name: '车型子类名称',
            ruleName: '发动机模块',
            location: '定位',
          },
        ],
      }
    },
  },
  {
    url: '/Windchill/app/feature/reversePlatformLogicalRules',
    method: 'post',
    response: () => {
      return {
        success: true,
        message: 'ok',
        // total: 5,
        // pages: 1,
        data: [
          {
            name: 'M模块名称',
            ruleName: '发动机模块',
            location: '定位',
          },
          {
            name: 'M模块名称',
            ruleName: '发动机模块',
            location: '定位',
          },
        ],
      }
    },
  },
  {
    url: '/Windchill/app/feature/reverseSaleDesignMapRules',
    method: 'post',
    response: () => {
      return {
        success: true,
        message: 'ok',
        // total: 5,
        // pages: 1,
        data: [
          {
            name: '发动机型号',
          },
          {
            name: '发动机型号',
          },
        ],
      }
    },
  },
  {
    url: '/Windchill/app/feature/getSaleCharacterList',
    method: 'post',
    response: () => {
      return {
        success: true,
        message: 'ok',
        total: 5,
        pages: 1,
        data: list,
      }
    },
  },
  {
    url: '/Windchill/app/feature/getSaleDesignMapRuleList',
    method: 'post',
    response: () => {
      return {
        success: true,
        message: 'ok',
        total: 5,
        pages: 1,
        data: [
          {
            oid: 'VR:com.ptc.windchill.option.model.ExpressionAlias:12345',
            number: '00101',
            name: '特征1',
            version: 'A.1',
            status: '设计中',
            sort: '0',
            changeUrl: 'http://xxx.xxx/xxx',
          },
          {
            oid: 'VR:com.ptc.windchill.option.model.ExpressionAlias:12345',
            number: '00101',
            name: '特征1',
            version: 'A.1',
            status: '已完成',
            sort: '0',
            changeUrl: 'http://xxx.xxx/xxx',
          },
        ],
      }
    },
  },
  {
    url: '/Windchill/app/feature/getDesignCharacterList',
    method: 'post',
    response: () => {
      return {
        success: true,
        message: 'ok',
        total: 51,
        pages: 2,
        'data|50': [
          {
            oid: 'OR:com.ptc.windchill.option.model.OptionMaster:600827',
            number: '00101',
            name: '特征1',
            source: 'AC模块',
            version: 'A.1',
            status: '设计中',
            sort: '1',
            type: '固化特征',
            changeUrl: 'http://xxx.xxx/xxx',
          },
        ],
      }
    },
  },
  {
    url: '/Windchill/app/feature/getOrderDesignCharacterList',
    method: 'post',
    response: () => {
      return {
        success: true,
        message: 'ok',
        // total: 5,
        // pages: 1,
        data: [
          {
            value: '技术特征d1',
            key: 'OR:com.ptc.windchill.option.model.OptionMaster:251240',
          },
          {
            value: '技术特征d3',
            key: 'OR:com.ptc.windchill.option.model.OptionMaster:251252',
          },
          {
            value: '技术特征d3技术特征d3技术特征d3技术特征d3技术特征d3技术特征d3技术特征d3',
            key: 'OR:com.ptc.windchill.option.model.OptionMaster:2351252',
          },
          {
            value: '技术特征d3技术特征d3技术特征d3技术特征d3技术特征d3技术特征d3技术特征d3',
            key: 'OR:com.ptc.windchill.option.model.OptionMaster:23351252',
          },
          {
            value: '技术特征d3技术特征d3技术',
            key: 'OR:com.ptc.windchill.option.model.OptionMaster:23531252',
          },
          {
            value: '技术特征d3技术特征d3技术2',
            key: 'OR:com.ptc.windchill.option.model.OptionMaster:233531252',
          },
          {
            value: '技术特征d3技术特征d3技术3',
            key: 'OR:com.ptc.windchill.option.model.OptionMaster:234531252',
          },
        ],
      }
    },
  },
  {
    url: '/Windchill/app/feature/getLogicalRuleDetail',
    method: 'post',
    response: () => {
      return {
        success: true,
        message: 'ok',
        // total: 5,
        // pages: 1,
        data: [
          {
            expression: '如果(技术特征a==技术选择a1)则(技术特征c==技术选择c3)',
            'mappingValues|10': [
              {
                oid: 'OR:ext.cnhtc.configmgmt.model.CmRuleChoiceMappingLink:254106',
                'sourceValues|20': [
                  {
                    oid: 'OR:com.ptc.windchill.option.model.ChoiceMaster:253128',
                    value: '轻卡技术特征值12,',
                  },
                ],
                'targetValues|20': [
                  {
                    oid: 'OR:com.ptc.windchill.option.model.ChoiceMaster:253141',
                    value: '轻卡技术特征值21,',
                  },
                ],
              },
            ],
            model: '模块4',
            oid: 'OR:com.ptc.windchill.option.model.ChoiceRule:253162',
            range: '局部',
            sort: '1',
            'sourceObjects|20': [
              {
                name: '轻卡技术特征1',
                oid: 'OR:com.ptc.windchill.option.model.OptionMaster:253205',
              },
            ],
            'targetObjects|20': [
              {
                name: '轻卡技术特征2',
                oid: 'OR:com.ptc.windchill.option.model.OptionMaster:253111',
              },
            ],
            type: '计算公式',
          },
        ],
      }
    },
  },
  {
    url: '/Windchill/app/feature/getSaleDesignMapRuleDetail',
    method: 'post',
    response: () => {
      return {
        success: true,
        message: 'ok',
        // total: 5,
        // pages: 1,
        data: [
          {
            oid: 'VR:com.ptc.windchill.option.model.ExpressionAlias:600826',
            name: '特征映射规则1',
            model: '',
            sort: '0',
            expression: '',
            sourceObjects: [
              {
                oid: 'VR:com.ptc.windchill.option.model.Option:6008251',
                name: '整车1',
              },
            ],
            targetObjects: [
              {
                oid: 'OR:com.ptc.windchill.option.model.OptionMaster:2512401',
                name: '技术特征1',
              },
              {
                oid: 'OR:com.ptc.windchill.option.model.OptionMaster:2512402',
                name: '技术特征2',
              },
              {
                oid: 'OR:com.ptc.windchill.option.model.OptionMaster:2512403',
                name: '技术特征3',
              },
            ],
            mappingValues: [
              {
                oid: 'oid',
                sourceValues: [
                  {
                    oid: 'OR:com.ptc.windchill.option.tz1',
                    value: _data,
                  },
                ],
                targetValues: [
                  {
                    oid: 'OR:com.ptc.windchill.option.tz1',
                    value: Random.ctitle(5),
                  },
                  {
                    oid: 'OR:com.ptc.windchill.option.tz2',
                    value: Random.ctitle(5),
                  },
                  {
                    oid: 'OR:com.ptc.windchill.option.tz3',
                    value: Random.ctitle(5),
                  },
                ],
              },
              {
                oid: 'oid',
                sourceValues: [
                  {
                    oid: 'OR:com.ptc.windchill.option.tz1',
                    value: _data,
                  },
                ],
                targetValues: [
                  {
                    oid: 'OR:com.ptc.windchill.option.tz1',
                    value: Random.ctitle(5),
                  },
                  {
                    oid: 'OR:com.ptc.windchill.option.tz2',
                    value: Random.ctitle(5),
                  },
                  {
                    oid: 'OR:com.ptc.windchill.option.tz3',
                    value: Random.ctitle(5),
                  },
                ],
              },
              {
                oid: 'oid',
                sourceValues: [
                  {
                    oid: 'OR:com.ptc.windchill.option.tz1',
                    value: _data,
                  },
                ],
                targetValues: [
                  {
                    oid: 'OR:com.ptc.windchill.option.tz1',
                    value: Random.ctitle(5),
                  },
                  {
                    oid: 'OR:com.ptc.windchill.option.tz2',
                    value: Random.ctitle(5),
                  },
                  {
                    oid: 'OR:com.ptc.windchill.option.tz3',
                    value: Random.ctitle(5),
                  },
                ],
              },
              {
                oid: 'oid',
                sourceValues: [
                  {
                    oid: 'OR:com.ptc.windchill.option.tz1',
                    value: _data,
                  },
                ],
                targetValues: [
                  {
                    oid: 'OR:com.ptc.windchill.option.tz1',
                    value: Random.ctitle(5),
                  },
                  {
                    oid: 'OR:com.ptc.windchill.option.tz2',
                    value: Random.ctitle(5),
                  },
                  {
                    oid: 'OR:com.ptc.windchill.option.tz3',
                    value: Random.ctitle(5),
                  },
                ],
              },
              {
                oid: 'oid',
                sourceValues: [
                  {
                    oid: 'OR:com.ptc.windchill.option.tz1',
                    value: _data,
                  },
                ],
                targetValues: [
                  {
                    oid: 'OR:com.ptc.windchill.option.tz1',
                    value: Random.ctitle(5),
                  },
                  {
                    oid: 'OR:com.ptc.windchill.option.tz2',
                    value: Random.ctitle(5),
                  },
                  {
                    oid: 'OR:com.ptc.windchill.option.tz3',
                    value: Random.ctitle(5),
                  },
                ],
              },
              {
                oid: 'oid',
                sourceValues: [
                  {
                    oid: 'OR:com.ptc.windchill.option.tz1',
                    value: _data,
                  },
                ],
                targetValues: [
                  {
                    oid: 'OR:com.ptc.windchill.option.tz1',
                    value: Random.ctitle(5),
                  },
                  {
                    oid: 'OR:com.ptc.windchill.option.tz2',
                    value: Random.ctitle(5),
                  },
                  {
                    oid: 'OR:com.ptc.windchill.option.tz3',
                    value: Random.ctitle(5),
                  },
                ],
              },
              {
                oid: 'oid',
                sourceValues: [
                  {
                    oid: 'OR:com.ptc.windchill.option.tz1',
                    value: _data,
                  },
                ],
                targetValues: [
                  {
                    oid: 'OR:com.ptc.windchill.option.tz1',
                    value: Random.ctitle(5),
                  },
                  {
                    oid: 'OR:com.ptc.windchill.option.tz2',
                    value: Random.ctitle(5),
                  },
                  {
                    oid: 'OR:com.ptc.windchill.option.tz3',
                    value: Random.ctitle(5),
                  },
                ],
              },
              {
                oid: 'oid',
                sourceValues: [
                  {
                    oid: 'OR:com.ptc.windchill.option.tz1',
                    value: _data,
                  },
                ],
                targetValues: [
                  {
                    oid: 'OR:com.ptc.windchill.option.tz1',
                    value: Random.ctitle(5),
                  },
                  {
                    oid: 'OR:com.ptc.windchill.option.tz2',
                    value: Random.ctitle(5),
                  },
                  {
                    oid: 'OR:com.ptc.windchill.option.tz3',
                    value: Random.ctitle(5),
                  },
                ],
              },
              {
                oid: 'oid',
                sourceValues: [
                  {
                    oid: 'OR:com.ptc.windchill.option.tz1',
                    value: _data,
                  },
                ],
                targetValues: [
                  {
                    oid: 'OR:com.ptc.windchill.option.tz1',
                    value: Random.ctitle(5),
                  },
                  {
                    oid: 'OR:com.ptc.windchill.option.tz2',
                    value: Random.ctitle(5),
                  },
                  {
                    oid: 'OR:com.ptc.windchill.option.tz3',
                    value: Random.ctitle(5),
                  },
                ],
              },
              {
                oid: 'oid',
                sourceValues: [
                  {
                    oid: 'OR:com.ptc.windchill.option.tz1',
                    value: _data,
                  },
                ],
                targetValues: [
                  {
                    oid: 'OR:com.ptc.windchill.option.tz1',
                    value: Random.ctitle(5),
                  },
                  {
                    oid: 'OR:com.ptc.windchill.option.tz2',
                    value: Random.ctitle(5),
                  },
                  {
                    oid: 'OR:com.ptc.windchill.option.tz3',
                    value: Random.ctitle(5),
                  },
                ],
              },
              {
                oid: 'oid',
                sourceValues: [
                  {
                    oid: 'OR:com.ptc.windchill.option.tz1',
                    value: _data,
                  },
                ],
                targetValues: [
                  {
                    oid: 'OR:com.ptc.windchill.option.tz1',
                    value: Random.ctitle(5),
                  },
                  {
                    oid: 'OR:com.ptc.windchill.option.tz2',
                    value: Random.ctitle(5),
                  },
                  {
                    oid: 'OR:com.ptc.windchill.option.tz3',
                    value: Random.ctitle(5),
                  },
                ],
              },
              {
                oid: 'oid',
                sourceValues: [
                  {
                    oid: 'OR:com.ptc.windchill.option.tz1',
                    value: _data,
                  },
                ],
                targetValues: [
                  {
                    oid: 'OR:com.ptc.windchill.option.tz1',
                    value: Random.ctitle(5),
                  },
                  {
                    oid: 'OR:com.ptc.windchill.option.tz2',
                    value: Random.ctitle(5),
                  },
                  {
                    oid: 'OR:com.ptc.windchill.option.tz3',
                    value: Random.ctitle(5),
                  },
                ],
              },
              {
                oid: 'oid',
                sourceValues: [
                  {
                    oid: 'OR:com.ptc.windchill.option.tz1',
                    value: _data,
                  },
                ],
                targetValues: [
                  {
                    oid: 'OR:com.ptc.windchill.option.tz1',
                    value: Random.ctitle(5),
                  },
                  {
                    oid: 'OR:com.ptc.windchill.option.tz2',
                    value: Random.ctitle(5),
                  },
                  {
                    oid: 'OR:com.ptc.windchill.option.tz3',
                    value: Random.ctitle(5),
                  },
                ],
              },
              {
                oid: 'oid',
                sourceValues: [
                  {
                    oid: 'OR:com.ptc.windchill.option.tz1',
                    value: _data,
                  },
                ],
                targetValues: [
                  {
                    oid: 'OR:com.ptc.windchill.option.tz1',
                    value: Random.ctitle(5),
                  },
                  {
                    oid: 'OR:com.ptc.windchill.option.tz2',
                    value: Random.ctitle(5),
                  },
                  {
                    oid: 'OR:com.ptc.windchill.option.tz3',
                    value: Random.ctitle(5),
                  },
                ],
              },
              {
                oid: 'oid',
                sourceValues: [
                  {
                    oid: 'OR:com.ptc.windchill.option.tz1',
                    value: _data,
                  },
                ],
                targetValues: [
                  {
                    oid: 'OR:com.ptc.windchill.option.tz1',
                    value: Random.ctitle(5),
                  },
                  {
                    oid: 'OR:com.ptc.windchill.option.tz2',
                    value: Random.ctitle(5),
                  },
                  {
                    oid: 'OR:com.ptc.windchill.option.tz3',
                    value: Random.ctitle(5),
                  },
                ],
              },
              {
                oid: 'oid',
                sourceValues: [
                  {
                    oid: 'OR:com.ptc.windchill.option.tz1',
                    value: _data,
                  },
                ],
                targetValues: [
                  {
                    oid: 'OR:com.ptc.windchill.option.tz1',
                    value: Random.ctitle(5),
                  },
                  {
                    oid: 'OR:com.ptc.windchill.option.tz2',
                    value: Random.ctitle(5),
                  },
                  {
                    oid: 'OR:com.ptc.windchill.option.tz3',
                    value: Random.ctitle(5),
                  },
                ],
              },
              {
                oid: 'oid',
                sourceValues: [
                  {
                    oid: 'OR:com.ptc.windchill.option.tz1',
                    value: _data,
                  },
                ],
                targetValues: [
                  {
                    oid: 'OR:com.ptc.windchill.option.tz1',
                    value: Random.ctitle(5),
                  },
                  {
                    oid: 'OR:com.ptc.windchill.option.tz2',
                    value: Random.ctitle(5),
                  },
                  {
                    oid: 'OR:com.ptc.windchill.option.tz3',
                    value: Random.ctitle(5),
                  },
                ],
              },
              {
                oid: 'oid',
                sourceValues: [
                  {
                    oid: 'OR:com.ptc.windchill.option.tz1',
                    value: _data,
                  },
                ],
                targetValues: [
                  {
                    oid: 'OR:com.ptc.windchill.option.tz1',
                    value: Random.ctitle(5),
                  },
                  {
                    oid: 'OR:com.ptc.windchill.option.tz2',
                    value: Random.ctitle(5),
                  },
                  {
                    oid: 'OR:com.ptc.windchill.option.tz3',
                    value: Random.ctitle(5),
                  },
                ],
              },
              {
                oid: 'oid',
                sourceValues: [
                  {
                    oid: 'OR:com.ptc.windchill.option.tz1',
                    value: _data,
                  },
                ],
                targetValues: [
                  {
                    oid: 'OR:com.ptc.windchill.option.tz1',
                    value: Random.ctitle(5),
                  },
                  {
                    oid: 'OR:com.ptc.windchill.option.tz2',
                    value: Random.ctitle(5),
                  },
                  {
                    oid: 'OR:com.ptc.windchill.option.tz3',
                    value: Random.ctitle(5),
                  },
                ],
              },
              {
                oid: 'oid',
                sourceValues: [
                  {
                    oid: 'OR:com.ptc.windchill.option.tz1',
                    value: '测试321',
                  },
                ],
                targetValues: [
                  {
                    oid: 'OR:com.ptc.windchill.option.tz1',
                    value: Random.ctitle(5),
                  },
                  {
                    oid: 'OR:com.ptc.windchill.option.tz2',
                    value: Random.ctitle(5),
                  },
                  {
                    oid: 'OR:com.ptc.windchill.option.tz3',
                    value: Random.ctitle(5),
                  },
                ],
              },
              {
                oid: 'oid',
                sourceValues: [
                  {
                    oid: 'OR:com.ptc.windchill.option.tz1',
                    value: '测试321',
                  },
                ],
                targetValues: [
                  {
                    oid: 'OR:com.ptc.windchill.option.tz1',
                    value: Random.ctitle(5),
                  },
                  {
                    oid: 'OR:com.ptc.windchill.option.tz2',
                    value: Random.ctitle(5),
                  },
                  {
                    oid: 'OR:com.ptc.windchill.option.tz3',
                    value: Random.ctitle(5),
                  },
                ],
              },
              {
                oid: 'oid',
                sourceValues: [
                  {
                    oid: 'OR:com.ptc.windchill.option.tz1',
                    value: '测试321',
                  },
                ],
                targetValues: [
                  {
                    oid: 'OR:com.ptc.windchill.option.tz1',
                    value: Random.ctitle(5),
                  },
                  {
                    oid: 'OR:com.ptc.windchill.option.tz2',
                    value: Random.ctitle(5),
                  },
                  {
                    oid: 'OR:com.ptc.windchill.option.tz3',
                    value: Random.ctitle(5),
                  },
                ],
              },
              {
                oid: 'oid',
                sourceValues: [
                  {
                    oid: 'OR:com.ptc.windchill.option.tz1',
                    value: '测试321',
                  },
                ],
                targetValues: [
                  {
                    oid: 'OR:com.ptc.windchill.option.tz1',
                    value: Random.ctitle(5),
                  },
                  {
                    oid: 'OR:com.ptc.windchill.option.tz2',
                    value: Random.ctitle(5),
                  },
                  {
                    oid: 'OR:com.ptc.windchill.option.tz3',
                    value: Random.ctitle(5),
                  },
                ],
              },
              {
                oid: 'oid',
                sourceValues: [
                  {
                    oid: 'OR:com.ptc.windchill.option.tz1',
                    value: '测试123',
                  },
                ],
                targetValues: [
                  {
                    oid: 'OR:com.ptc.windchill.option.tz1',
                    value: Random.ctitle(5),
                  },
                  {
                    oid: 'OR:com.ptc.windchill.option.tz2',
                    value: Random.ctitle(5),
                  },
                  {
                    oid: 'OR:com.ptc.windchill.option.tz3',
                    value: Random.ctitle(5),
                  },
                ],
              },
            ],
          },
        ],
      }
    },
  },
  {
    url: '/Windchill/app/feature/createLogicalRule',
    method: 'post',
    response: () => {
      return {
        success: true,
        message: 'ok',
        data: {
          'oid|20-20000': 30,
          number: Random.ctitle(10),
        },
      }
    },
  },
  {
    url: '/Windchill/app/feature/createSaleDesignMapRule',
    method: 'post',
    response: () => {
      return {
        success: true,
        message: 'ok',
        data: {
          'oid|20-20000': 30,
          number: Random.ctitle(10),
          status: '设计中',
        },
      }
    },
  },
  {
    url: '/Windchill/app/feature/deleteConditionRule',
    method: 'post',
    response: () => {
      return {
        success: true,
        message: 'ok',
        data: null,
      }
    },
  },
  {
    url: '/Windchill/app/product/createInternalVehicleModel',
    method: 'post',
    response: () => {
      return {
        success: true,
        message: 'ok',
        data: {
          'oid|20-20000': 30,
          number: Random.ctitle(10),
        },
      }
    },
  },
  {
    url: '/Windchill/app/product/updateInternalVehicleModel',
    method: 'post',
    response: () => {
      return {
        success: true,
        message: 'ok',
        data: {
          'oid|20-20000': 30,
          number: Random.ctitle(10),
        },
      }
    },
  },
  {
    url: '/Windchill/app/feature/updateLogicalRule',
    method: 'post',
    response: () => {
      return {
        success: true,
        message: 'ok',
        data: {
          'oid|20-20000': 30,
          number: Random.ctitle(10),
        },
      }
    },
  },
  {
    url: '/Windchill/app/feature/createACModuleExcludeRule',
    method: 'post',
    response: () => {
      return {
        success: true,
        message: 'ok',
        data: {
          'oid|20-20000': 30,
          number: Random.ctitle(10),
        },
      }
    },
  },
  {
    url: '/Windchill/app/feature/updateACModuleExcludeRule',
    method: 'post',
    response: () => {
      return {
        success: true,
        message: 'ok',
        data: {
          'oid|20-20000': 30,
          number: Random.ctitle(10),
        },
      }
    },
  },
  {
    url: '/Windchill/app/config/createIncludeExcludeRule',
    method: 'post',
    response: () => {
      return {
        success: true,
        message: 'ok',
        data: {
          'oid|20-20000': 30,
          number: Random.ctitle(10),
        },
      }
    },
  },
  {
    url: '/Windchill/app/feature/getACModuleExcludeRuleList',
    method: 'post',
    response: () => {
      return {
        success: true,
        message: 'ok',
        total: 5,
        pages: 1,
        data: [
          {
            oid: 'VR:com.ptc.windchill.option.model.ExpressionAlias:123451',
            number: '00101',
            name: '特征1',
            version: 'A.1',
            status: '已完成',
            sort: '0',
            changeUrl: 'http://xxx.xxx/xxx',
          },
          {
            oid: 'VR:com.ptc.windchill.option.model.ExpressionAlias:123452',
            number: '00101',
            name: '特征1',
            version: 'A.1',
            status: '已完成',
            sort: '0',
            changeUrl: 'http://xxx.xxx/xxx',
          },
          {
            oid: 'VR:com.ptc.windchill.option.model.ExpressionAlias:123453',
            number: '00101',
            name: '特征1',
            version: 'A.1',
            status: '已完成',
            sort: '0',
            changeUrl: 'http://xxx.xxx/xxx',
          },
        ],
      }
    },
  },
  {
    url: '/Windchill/app/feature/getACModuleExcludeRuleDetail',
    method: 'post',
    response: () => {
      return {
        success: true,
        message: 'ok',
        // total: 5,
        // pages: 1,
        data: {
          oid: 'VR:com.ptc.windchill.option.model.ExpressionAlias:600826',
          name: 'AC模块1',
          model: 'AC模块1',
          sort: '0',
          expression: '322',
          sourceObjects: [
            {
              oid: 'OR:com.ptc.windchill.option.model.OptionMaster:600825',
              name: '驾驶室',
            },
          ],
          targetObjects: [],
          mappingValues: [
            {
              oid: 'oid',
              sourceValues: [
                {
                  oid: 'OR:com.ptc.windchill.option.model.ChoiceMaster:600532, OR:com.ptc.windchill.option.model.ChoiceMaster:600514',
                  value: '驾驶室特征值1, 驾驶室特征值3',
                },
              ],
              targetValues: [],
            },
          ],
        },
      }
    },
  },
  {
    url: '/Windchill/app/feature/createLocalLogicalRule',
    method: 'post',
    response: () => {
      return {
        success: true,
        message: 'ok',
        data: {
          oid: 'VR:com.ptc.windchill.option.model.ExpressionAlias:600826',
          name: 'AC模块1',
          model: 'AC模块1',
          sort: '0',
          number: '234243',
        },
      }
    },
  },
]
