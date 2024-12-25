import { Random } from 'mockjs'
import bomList from './data.json'
const list = [
  {
    oid: 'VR:com.ptc.windchill.option.model.ExpressionAlias:123451',
    number: '00101',
    name: '特征1',
    description: '如果[(AEB==AEB的值)&&(FCW==FCW的值)]则 [ADCU==ADCU的值;]',
    version: 'A.1',
    status: '设计中',

    changeUrl: 'http://xxx.xxx/xxx',
  },
  {
    oid: 'VR:com.ptc.windchill.option.model.ExpressionAlias:123452',
    number: '00101',
    specialAcModule: '否',
    name: '特征1',
    description: '如果[(AEB==AEB的值)&&(FCW==FCW的值)]则 [ADCU==ADCU的值;]',
    version: 'B.3424',
    status: '设计中',
    changeUrl: 'http://xxx.xxx/xxx',
  },
  {
    oid: 'VR:com.ptc.windchill.option.model.ExpressionAlias:1234522',
    number: '00101',
    name: '特征1',
    description: '如果[(AEB==AEB的值)&&(FCW==FCW的值)]则 [ADCU==ADCU的值;]',
    version: 'A.1',
    status: '设计中',
    changeUrl: 'http://xxx.xxx/xxx',
  },
  {
    oid: 'VR:com.ptc.windchill.option.model.ExpressionAlias:1234523',
    number: '00101',
    name: '特征1',
    description: '如果[(AEB==AEB的值)&&(FCW==FCW的值)]则 [ADCU==ADCU的值;]',
    version: 'A.1',
    status: '已完成',
    changeUrl: 'http://xxx.xxx/xxx',
  },
  {
    oid: 'VR:com.ptc.windchill.option.model.ExpressionAlias:1234524',
    number: '00101',
    name: '特征1',
    description: '如果[(AEB==AEB的值)&&(FCW==FCW的值)]则 [ADCU==ADCU的值;]',
    version: 'A.1',
    status: '已完成',
    changeUrl: 'http://xxx.xxx/xxx',
  },
]

export default [
  {
    url: '/Windchill/app/config/getTechParamConfigCharacterList',
    method: 'post',
    response: () => {
      return {
        success: true,
        message: 'ok',
        total: 15,
        pages: 1,
        data: {
          undefinedCharas: [
            {
              optionOid: 'OR: com.ptc.windchill.option.model.OptionMaster:12345',
              optionName: '特征1',
            },
            {
              optionOid: 'OR: com.ptc.windchill.option.model.OptionMaster:12346',
              optionName: '特征2',
            },
            {
              optionOid: 'OR: com.ptc.windchill.option.model.OptionMaster:12347',
              optionName: '特征3',
            },
          ],
          definedCharas: [
            {
              optionOid: 'OR: com.ptc.windchill.option.model.OptionMaster:34561',
              optionName: '特征4',
            },
            {
              optionOid: 'OR: com.ptc.windchill.option.model.OptionMaster:34562',
              optionName: '特征5',
            },
            {
              optionOid: 'OR: com.ptc.windchill.option.model.OptionMaster:34563',
              optionName: '特征6',
            },
          ],
          fixedCharas: [
            {
              title: '机箱桥',
              items: [
                {
                  optionOid: 'OR: com.ptc.windchill.option.model.OptionMaster:12345',
                  optionName: '特征1',
                  status: 'N',
                  value: null,
                  choices: [
                    {
                      choiceOid: 'OR: com.ptc.windchill.option.model.ChoiceMaster:11334',
                      choiceName: '特征值1-1',
                    },
                  ],
                },
                {
                  optionOid: 'OR: com.ptc.windchill.option.model.OptionMaster:23434',
                  optionName: '特征2',
                  status: 'Y',
                  value: 'OR: com.ptc.windchill.option.model.ChoiceMaster:22344',
                  choices: [
                    {
                      choiceOid: 'OR: com.ptc.windchill.option.model.ChoiceMaster:22344',
                      choiceName: '特征值2-1',
                    },
                  ],
                },
              ],
            },
          ],
        },
      }
    },
  },
  {
    url: '/Windchill/app/config/getTechParamMappingCharacterList',
    method: 'post',
    response: () => {
      return {
        success: true,
        message: 'ok',
        data: {
          undefinedOrderCharas: [
            {
              optionOid: 'OR: com.ptc.windchill.option.model.OptionMaster:12345',
              optionName: '特征1',
            },
          ],
          undefinedLogicCharas: [
            {
              optionOid: 'OR: com.ptc.windchill.option.model.OptionMaster:3456',
              optionName: '特征4',
            },
          ],
          definedOrderCharas: [
            {
              optionOid: 'OR: com.ptc.windchill.option.model.OptionMaster:43255',
              optionName: '特征2',
            },
          ],
          definedLogicCharas: [
            {
              optionOid: 'OR: com.ptc.windchill.option.model.OptionMaster:3451136',
              optionName: '特征3',
              source: '订单',
            },
            {
              optionOid: 'OR: com.ptc.windchill.option.model.OptionMaster:3451136',
              optionName: '特征4',
              source: '',
            },
          ],
        },
      }
    },
  },
  {
    url: '/Windchill/app/feature/getLogicalRuleList',
    method: 'post',
    response: () => {
      return {
        success: true,
        message: 'ok',
        total: 15,
        pages: 1,
        data: list,
      }
    },
  },
  {
    url: '/Windchill/app/config/startSourceDetectionWF',
    method: 'post',
    response: () => {
      return {
        success: true,
        message: 'ok',
        data: {},
      }
    },
  },
  {
    url: '/Windchill/app/config/setConfigCodeMainRecom',
    method: 'post',
    response: () => {
      return {
        success: true,
        message: 'ok',
        data: {},
      }
    },
  },
  {
    url: '/Windchill/app/feature/getLocalLogicalRuleList',
    method: 'post',
    response: () => {
      return {
        success: true,
        message: 'ok',
        total: 15,
        pages: 1,
        data: list,
      }
    },
  },
  {
    url: '/Windchill/app/config/getIncludeExcludeRuleDetail',
    method: 'post',
    response: () => {
      return {
        success: true,
        message: 'ok',
        data: [
          {
            oid: 'VR:com.ptc.windchill.option.model.ExpressionAlias:600826',
            name: '同选模块1',
            model: '',
            sort: '0',
            expression: '32424',
            sourceObjects: [
              {
                oid: 'OR:com.ptc.windchill.option.model.OptionMaster:600825',
                name: '驾驶室',
              },
            ],
            targetObjects: [
              {
                oid: 'OR:com.ptc.windchill.option.model.OptionMaster:600826',
                name: '驾驶室宽度',
              },
            ],
            mappingValues: [
              {
                oid: 'oid',
                sourceValues: [
                  {
                    oid: 'OR:com.ptc.windchill.option.model.ChoiceMaster:600532',
                    value: '驾驶室特征值1',
                  },
                ],
                targetValues: [
                  {
                    oid: 'OR:com.ptc.windchill.option.model.ChoiceMaster:600826',
                    value: '中宽体',
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
    url: '/Windchill/app/config/getIncludeExcludeRuleList',
    method: 'post',
    response: () => {
      return {
        success: true,
        message: 'ok',
        total: 15,
        pages: 1,
        'data|10': [
          {
            oid: 'VR:com.ptc.windchill.option.model.ExpressionAlias:123451',
            number: '00101',
            name: '特征1',
            description: '如果[(AEB==AEB的值)&&(FCW==FCW的值)]则 [ADCU==ADCU的值;]',
            version: 'A.1',
            status: '已完成',
            changeUrl: 'http://xxx.xxx/xxx',
          },
          {
            oid: 'VR:com.ptc.windchill.option.model.ExpressionAlias:123452',
            number: '00102',
            name: '特征1',
            description: '如果[(AEB==AEB的值)&&(FCW==FCW的值)]则 [ADCU==ADCU的值;]',
            version: 'A.1',
            status: '设计中',
            changeUrl: 'http://xxx.xxx/xxx',
          },
        ],
      }
    },
  },
  {
    url: '/Windchill/app/config/startEnableConfigCodeWF',
    method: 'post',
    response: () => {
      return {
        success: false,
        message: '这是失败信息',
        data: {},
      }
    },
  },
  {
    url: '/Windchill/app/config/getCouldCopyVehicleType',
    method: 'post',
    response: () => {
      return {
        success: true,
        message: '这是失败信息',
        data: [
          { key: 'OR:wt.part.WTPart:14552764112', value: 'TS7-1-4X2-B-2-2030-001' },
          { key: 'OR:wt.part.WTPart:14552891442', value: 'TS7-B-E-B-2-X-001' },
        ],
      }
    },
  },
  {
    url: '/Windchill/app/config/startDisableConfigCodeWF',
    method: 'post',
    response: () => {
      return {
        success: true,
        message: 'ok',
        data: {},
      }
    },
  },
  {
    url: '/Windchill/app/config/updateConfigCodeAttributes',
    method: 'post',
    response: () => {
      return {
        success: true,
        message: 'ok',
        data: {},
      }
    },
  },
  {
    url: '/Windchill/app/config/getConfigCodeSourceDetectionTree',
    method: 'post',
    response: () => {
      return {
        success: true,
        message: 'ok',
        data: [
          {
            oid: 'OR:wt.part.WTPart:12443',
            parentOid: '',
            mark: 'G7S-载货-8×4-国六（资源数：559；任务数：2；成熟度不满足：1 )[资源率：340.85%(资源数：559/模板数164)]',
            action: '',
            version: 'A.1',
            amount: '',
            maturity: 'D55',
            processMaturity: 'P40',
            owner: '张涛',
          },
          {
            oid: 'OR:wt.part.WTPart:124431',
            parentOid: 'OR:wt.part.WTPart:12443',
            mark: 'G7S-载货-8×4-国六（资源数：559；任务数：2；成熟度不满足：1 )[资源率：340.85%(资源数：559/模板数164)]',
            action: '',
            version: 'A.1',
            amount: '',
            maturity: 'D55',
            processMaturity: 'P40',
            owner: '张涛',
          },
        ],
      }
    },
  },
  {
    url: '/Windchill/app/config/getVehicleTypeSourceDetectionTree',
    method: 'post',
    response: () => {
      return {
        success: true,
        message: 'ok',
        data: bomList,
      }
    },
  },
  {
    url: '/Windchill/app/config/getConfigCodeDetailInfo',
    method: 'post',
    response: () => {
      return {
        success: true,
        message: 'ok',
        data: {
          title: '查看配置号明细-ZZ4256V384HF1LB/B9EDM38-G-新标运@PE001',
          attributes: [
            {
              id: 'branch',
              name: '品牌',
              value: '豪沃',
            },
          ],
          'configs|10': [
            {
              category: '固化配置',
              option: 'ABS控制系统',
              choice: 'EBS',
              saleDesc: '销售语言',
              stdConfig: '是',
            },
            {
              category: '固化配置',
              option: 'ABS控制系统',
              choice: 'EBS',
              saleDesc: '销售语言',
              stdConfig: '是',
            },
            {
              category: '固化配置',
              option: 'ABS控制系统',
              choice: 'EBS',
              saleDesc: '销售语言',
              stdConfig: '是',
            },
            {
              category: '固化配置',
              option: 'ABS控制系统',
              choice: 'EBS',
              saleDesc: '销售语言',
              stdConfig: '是',
            },
            {
              category: '固化配置',
              option: 'ABS控制系统',
              choice: 'EBS',
              saleDesc: '销售语言',
              stdConfig: '是',
            },
            {
              category: '固化配置',
              option: 'ABS控制系统',
              choice: 'EBS',
              saleDesc: '销售语言',
              stdConfig: '是',
            },
            {
              category: '固化配置',
              option: 'ABS控制系统',
              choice: 'EBS',
              saleDesc: '销售语言',
              stdConfig: '是',
            },
          ],
        },
      }
    },
  },
  {
    url: '/Windchill/app/config/getConfigCodeAttributesInfo',
    method: 'post',
    response: () => {
      return {
        success: true,
        message: 'ok',
        data: [
          {
            id: 'area',
            name: '区域',
            action: 'text',
            value: '',
            readonly: 'Y',
            required: 'Y',
          },
          {
            id: 'sceneName',
            name: '应用场景',
            action: 'text',
            value: '整车12',
            readonly: 'Y',
            required: 'Y',
          },
          {
            id: 'marketName',
            name: '细分市场',
            action: 'text',
            value: '整车3',
            readonly: 'Y',
            required: 'Y',
          },
          {
            id: 'wheelbase',
            name: '轴距',
            action: 'text',
            value: '哈哈哈哈哈',
            readonly: 'Y',
            required: 'Y',
          },
          {
            id: 'series',
            name: '系列号',
            action: 'text',
            value: '',
            readonly: 'N',
            required: 'Y',
            enums: [
              {
                key: '整车',
                value: '整车',
              },
            ],
          },
          {
            id: 'series1',
            name: '整车整备质量',
            action: 'text',
            value: '10kg',
            readonly: 'N',
            required: 'Y',
            enums: [
              {
                key: '整车',
                value: '整车',
              },
            ],
          },
          {
            id: 'series2',
            name: '订单池分类',
            action: 'select',
            value: '订单1',
            readonly: 'N',
            required: 'Y',
            enums: [
              {
                key: '订单1',
                value: '订单1',
              },
              {
                key: '订单2',
                value: '订单2',
              },
            ],
          },
          {
            id: 'series3',
            name: '限购数量',
            action: 'number',
            value: '10',
            readonly: 'N',
            required: 'Y',
            enums: [
              {
                key: '订单1',
                value: '订单1',
              },
            ],
          },
        ],
      }
    },
  },
  {
    url: '/Windchill/app/config/getConfigCodeList',
    method: 'post',
    response: () => {
      return {
        success: true,
        message: 'ok',
        pages: 2,
        total: 21,
        data: {
          titles: [
            {
              titleID: 'number',
              titleName: '短码',
            },
            {
              titleID: 'ConfigCode',
              titleName: '配置号',
            },
            {
              titleID: 'internalVehicleModel',
              titleName: '内部车型号内部车型号内部车型号',
            },
            {
              titleID: 'spectrumStatus',
              titleName: '型谱变化型谱变化型谱变化',
            },
            {
              titleID: 'status',
              titleName: '状态状态状态',
            },
            {
              titleID: 'pushStatus',
              titleName: '推送状态状态状态状态',
            },
            {
              titleID: 'sourceStatus',
              titleName: '资源状态状态状态状态',
            },
            {
              titleID: 'characStatus',
              titleName: '特征状态状态状态',
            },
            // {
            //   titleID: 'mainRecom',
            //   titleName: '主推',
            // },
          ],
          items: [
            {
              oid: 'VR:wt.doc.WTDocument:123425',
              number: '00012',
              configCode: 'G7S-K-4-6',
              internalVehicleModel: Random.ctitle(4, 10),
              固化配置1ID: '配化配置1数值',
              固化配置nID: '固化配置n数值',
              spectrumStatus: '型谱变化值状态状态状态状态',
              status: '未启用',
              pushStatus: '推送状态值特征状态值',
              sourceStatus: '资源状态值特征状态值',
              characStatus: '特征状态值特征状态值特征状态值',
              mainRecom: '是否主推特征状态值特征状态值特征状态值',
            },
            {
              oid: 'VR:wt.doc.WTDocument:12345',
              number: '00012',
              configCode: 'G7S-K-4-6',
              internalVehicleModel: Random.ctitle(4, 10),
              固化配置1ID: '配化配置1数值',
              固化配置nID: '固化配置n数值',
              spectrumStatus: '型谱变化值状态状态状态状态',
              status: '启用',
              pushStatus: '推送状态值特征状态值',
              sourceStatus: '资源状态值特征状态值',
              characStatus: '特征状态值特征状态值特征状态值',
              mainRecom: '是否主推特征状态值特征状态值特征状态值',
            },
          ],
        },
      }
    },
  },
  {
    url: '/Windchill/app/config/getConfigCode',
    method: 'post',
    response: () => {
      return {
        success: true,
        message: 'ok',
        data: {
          groupConds: [
            {
              id: 'internalVehicleModel',
              title: '内部车型号',
              values: [
                {
                  key: 'VR: wt.doc.WTDocument:600826',
                  value: '内部车型号1',
                },
              ],
            },
          ],
          fixedConds: [
            {
              id: 'segementMarket',
              title: '细分市场',
              values: [
                {
                  key: '',
                  value: '',
                },
                {
                  key: '细分市场1',
                  value: '细分市场1',
                },
              ],
            },
          ],
          optionalConds: [
            {
              id: 'segementMarket',
              title: '整车版本选装',
              values: [
                {
                  key: '整车版本选装key',
                  value: '整车版本选装value',
                },
              ],
            },
            {
              id: 'segementMarket1',
              title: '整车版本选装2',
              values: [
                {
                  key: '整车版本选装key1',
                  value: '整车版本选装value1',
                },
              ],
            },
          ],
        },
      }
    },
  },
  {
    url: '/Windchill/app/feature/getLocalSaleDesignMapRuleList',
    method: 'post',
    response: () => {
      return {
        success: true,
        message: 'ok',
        total: 15,
        pages: 1,
        data: [
          {
            oid: 'VR:com.ptc.windchill.option.model.ExpressionAlias:123425',
            number: '00101',
            name: '特征1',
            version: 'A.1',
            status: '设计中',
            sort: '0',
            changeUrl: 'http://xxx.xxx/xxx',
          },
          {
            oid: 'VR:com.ptc.windchill.option.model.ExpressionAlias:123452',
            number: '00101',
            name: '特征2',
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
    url: '/Windchill/app/config/getAcTaskList',
    method: 'post',
    response: () => {
      return {
        code: 200,
        data: [
          {
            acModuleName: '所属模块名称',
            configCodeOid: '配置号id',
            expectedCompletionTime: '',
            oid: '1',
            owner: '责任人',
            taskNumber: '任务编号',
            taskRemark: '任务说明',
          },
          {
            acModuleName: '所属模块名称',
            configCodeOid: '配置号id',
            expectedCompletionTime: '2024-06-29 12:00:00',
            oid: '2',
            owner: '责任人',
            taskNumber: '任务编号',
            taskRemark: '任务说明',
          },
        ],
        message: '',
        success: true,
      }
    },
  },
  {
    url: '/Windchill/app/config/getAcTaskForDepartManager',
    method: 'post',
    response: () => {
      return {
        code: 200,
        'data|10': [
          {
            acModuleName: 'ZZ-0260-2581 SCR电控系统-AC',
            configCodeOid: () => Random.id(),
            configCodeUser: 'Administrator',
            configCodeUserDisplayName: 'Acadmin',
            department: 'lisi',
            departmentDisplayName: '李四',
            departmentPeople: '',
            expectedCompletionTime: '',
            startTime: () => Random.date(),
            oid: () => Random.id(),
            owner: '',
            taskNumber: '02877',
            taskRemark: '',
          },
        ],
        message: '',
        success: true,
      }
    },
  },
  {
    url: '/Windchill/app/config/setDesignHeadAndDistributeTask',
    method: 'post',
    response: () => {
      return {
        code: 200,
        data: null,
        message: '',
        success: true,
      }
    },
  },
  {
    url: '/Windchill/app/config/specialVehicleCloseCheck',
    method: 'post',
    response: () => {
      return {
        code: 200,
        data: [
          {
            description: '描述信息',
            name: '规则名',
          },
          {
            description: 'ZZ-0900-9851 无内胎轮胎随车工具-AC未添加AC表号',
          },
        ],
        message: '',
        success: true,
      }
    },
  },
  {
    url: '/Windchill/app/config/specialVehicleSourceDetection',
    method: 'post',
    response: () => {
      return {
        code: 200,
        data: [
          {
            description: '描述信息',
            name: '规则名',
          },
          {
            description: 'ZZ-0900-9851 无内胎轮胎随车工具-AC未添加AC表号',
          },
        ],
        message: '失败',
        success: false,
      }
    },
  },
  {
    url: '/Windchill/app/config/updateVehicleTypeOptionSet',
    method: 'post',
    response: () => {
      return {
        code: 200,
        data: null,
        message: '成功',
        success: true,
      }
    },
  },
  {
    url: '/Windchill/app/config/getAcTaskForDesignHead',
    method: 'post',
    response: () => {
      return {
        code: 200,
        data: [
          {
            acModuleName: 'ZZ-0110-1824 保险杠-AC',
            configCodeOid: 'OR:ext.cnhtc.configmgmt.model.CmConfigCode:12194592250',
            configCodeUserDisplayName: 'wcadmin',
            configCodeUserName: 'Administrator',
            department: 'wangzh',
            departmentDisplayName: 'wangzh',
            expectedCompletionTime: '2024-07-10 10:53:33',
            oid: 'OR:ext.cnhtc.configmgmt.model.CmSourceDetectionMapping:1219493873268',
            owner: 'wangzh',
            ownerDisplayName: 'wangzh',
            taskNumber: '02798',
            taskRemark: '',
          },
          {
            acModuleName: 'ZZ-0110-1824 保险杠-AC',
            configCodeOid: 'OR:ext.cnhtc.configmgmt.model.CmConfigCode:122194592250',
            configCodeUserDisplayName: 'wcadmin',
            configCodeUserName: 'Administrator',
            department: 'wangzh',
            departmentDisplayName: 'wangzh',
            expectedCompletionTime: '2024-07-10 10:53:33',
            oid: 'OR:ext.cnhtc.configmgmt.model.CmSourceDetectionMapping:121949338768',
            owner: 'wangzh',
            ownerDisplayName: 'wangzh',
            taskNumber: '02798',
            taskRemark: '',
          },
        ],
        message: '',
        success: true,
      }
    },
  },
  {
    url: '/Windchill/app/config/tableMappingAcModuleNameEnum',
    method: 'post',
    response: () => {
      return {
        code: 200,
        data: [
          { key: 'OR:wt.part.WTPartMaster:12169970852', value: 'ZZ-0550-5552 LNG供气系统-AC' },
          { key: 'OR:wt.part.WTPartMaster:1216997085', value: 'ZZ-0550-5552 LNG供气系统-AC1' },
        ],
        message: '',
        success: true,
      }
    },
  },
  {
    url: '/Windchill/app/config/getTableMappingACPartList',
    method: 'post',
    response: () => {
      return {
        code: 200,
        data: [
          { key: 'OR:wt.part.WTPartMaster:12167416457', value: 'AC0000720000003' },
          { key: 'OR:wt.part.WTPartMaster:12167416458', value: 'AC0000720000002' },
        ],
        message: '',
        success: true,
      }
    },
  },
  {
    url: '/Windchill/app/config/getACPartMapRuleList',
    method: 'post',
    response: () => {
      return {
        success: true,
        message: 'ok',
        total: 15,
        pages: 1,
        data: [
          {
            oid: 'VR:com.ptc.windchill.option.model.ExpressionAlias:123451',
            number: '00101',
            name: '特征1',
            description: '如果[(AEB==AEB的值)&&(FCW==FCW的值)]则 [ADCU==ADCU的值;]',
            version: 'A.1',
            status: '设计中',
            changeUrl: 'http://xxx.xxx/xxx',
          },
          {
            oid: 'VR:com.ptc.windchill.option.model.ExpressionAlias:123452',
            number: '00101',
            name: '特征1',
            description: '如果[(AEB==AEB的值)&&(FCW==FCW的值)]则 [ADCU==ADCU的值;]',
            version: 'A.1',
            status: '已完成',
            changeUrl: 'http://xxx.xxx/xxx',
          },
          {
            oid: 'VR:com.ptc.windchill.option.model.ExpressionAlias:123453',
            number: '00101',
            name: '特征1',
            description: '如果[(AEB==AEB的值)&&(FCW==FCW的值)]则 [ADCU==ADCU的值;]',
            version: 'A.1',
            status: '已完成',
            changeUrl: 'http://xxx.xxx/xxx',
          },
          {
            oid: 'VR:com.ptc.windchill.option.model.ExpressionAlias:123454',
            number: '00101',
            name: '特征1',
            description: '如果[(AEB==AEB的值)&&(FCW==FCW的值)]则 [ADCU==ADCU的值;]',
            version: 'A.1',
            status: '已完成',
            changeUrl: 'http://xxx.xxx/xxx',
          },
          {
            oid: 'VR:com.ptc.windchill.option.model.ExpressionAlias:123455',
            number: '00101',
            name: '特征1',
            description: '如果[(AEB==AEB的值)&&(FCW==FCW的值)]则 [ADCU==ADCU的值;]',
            version: 'A.1',
            status: '已完成',
            changeUrl: 'http://xxx.xxx/xxx',
          },
        ],
      }
    },
  },
  {
    url: '/Windchill/app/config/getVehicleTypeEditOptionSet',
    method: 'post',
    response: () => {
      return {
        success: true,
        message: 'ok',
        // total: 5,
        // pages: 1,
        data: [
          {
            optionOid: 'VR: com.ptc.windchill.option.model.Option:600823226',
            optionNumber: '000001',
            optionName: '固化特征222',
            optionType: '固化配置',
            optionSelected: '',
            choices: [
              {
                choiceOid: 'VR: com.ptc.windchill.option.model.Choice:60082623',
                choiceNumber: '000101',
                choiceName: '固化特征值1',
                choiceSelected: '',
              },
              {
                choiceOid: 'VR: com.ptc.windchill.option.model.Choice:600826223',
                choiceNumber: '000101',
                choiceName: '固化特征值12',
                choiceSelected: '',
              },
              {
                choiceOid: 'VR: com.ptc.windchill.option.model.Choice:600822623',
                choiceNumber: '000101',
                choiceName: '固化特征值13',
                choiceSelected: '',
              },
            ],
          },
          {
            optionOid: 'VR: com.ptc.windchill.option.model.Option:600826',
            optionNumber: '000001',
            optionName: '固化特征1',
            optionType: '固化配置',
            optionSelected: '是',
            color: '白色',
            choices: [
              {
                choiceOid: 'VR: com.ptc.windchill.option.model.Choice:60082621',
                choiceNumber: '000101',
                choiceName: '固化特征值1',
                choiceSelected: '',
              },
              {
                choiceOid: 'VR: com.ptc.windchill.option.model.Choice:600826321',
                choiceNumber: '000101',
                choiceName: '固化特征值22222',
                choiceSelected: '',
              },
            ],
          },
        ],
      }
    },
  },
  {
    url: '/Windchill/app/config/getVehicleTypeEditOptionSetValue',
    method: 'post',
    response: () => {
      return {
        success: true,
        message: 'ok',
        // total: 5,
        // pages: 1,
        data: [
          {
            optionOid: 'VR: com.ptc.windchill.option.model.Option:600826',
            optionNumber: '000001',
            optionName: '固化特征1',
            optionSelected: '是',
            'choices|20': [
              {
                choiceOid: 'VR: com.ptc.windchill.option.model.Choice:6008262',
                choiceNumber: '0001012',
                choiceName: '固化特征值1',
                choiceSelected: '是',
              },
              {
                choiceOid: 'VR: com.ptc.windchill.option.model.Choice:600826',
                choiceNumber: '0001013',
                choiceName: '固化特征值2',
                choiceSelected: '',
              },
            ],
          },
          {
            optionOid: 'VR: com.ptc.windchill.option.model.Option:6008226',
            optionNumber: '000001',
            optionName: '固化特征12',
            optionSelected: '是',
            choices: [
              {
                choiceOid: 'VR: com.ptc.windchill.option.model.Choice:60082622',
                choiceNumber: '000101',
                choiceName: '固化特征值2-1',
                choiceSelected: '',
              },
              {
                choiceOid: 'VR: com.ptc.windchill.option.model.Choice:6008226',
                choiceNumber: '0001012',
                choiceName: '固化特征值2-2',
                choiceSelected: '',
              },
              {
                choiceOid: 'VR: com.ptc.windchill.option.model.Choice:60082326',
                choiceNumber: '0001013',
                choiceName: '固化特征值2-2',
                choiceSelected: '是',
              },
            ],
          },
        ],
      }
    },
  },
  {
    url: '/Windchill/app/config/getVehicleTypeOptionSet',
    method: 'post',
    response: () => {
      return {
        success: true,
        message: 'ok',
        total: 5,
        pages: 1,
        data: {
          changeUrl:
            'http://pdmuat.cnhtc.cn/Windchill/netmarkets/jsp/ext/cnhtc/configmgmt/change/createPCR.jsp',
          version: 'A.4',
          status: '设计中',
          processCreator: '张三',
          optionalItems: [
            {
              optionOid: 'VR: com.ptc.windchill.option.model.Option:600826',
              optionNumber: '000001',
              optionName: '选装特征1',
              color: '白色',

              choices: [
                {
                  choiceOid: 'VR: com.ptc.windchill.option.model.Choice:6008326',
                  choiceNumber: '000101',
                  choiceName: '选装特征值1',
                  color: '黑色',
                },
              ],
            },
            {
              optionOid: 'VR: com.ptc.windchill.option.model.Option:601234',
              optionNumber: '000002',
              optionName: '选装特征2',
              color: '白色',

              choices: [
                {
                  choiceOid: 'VR: com.ptc.windchill.option.model.Choice:600827',
                  choiceNumber: '000101',
                  choiceName: '选装特征值2',
                  color: '红色',
                },
              ],
            },
            {
              optionOid: 'VR: com.ptc.windchill.option.model.Option:6300828',
              optionNumber: '000003',
              optionName: '选装特征3',
              choices: [
                {
                  choiceOid: 'VR: com.ptc.windchill.option.model.Choice:600830',
                  choiceNumber: '000103',
                  choiceName: '选装特征值3',
                  color: '蓝色',
                },
              ],
            },
          ],
          fixedItems: [
            {
              optionOid: 'VR: com.ptc.windchill.option.model.Option:600826',
              optionNumber: '000001',
              optionName: '固化特征1',
              color: '白色',
              choices: [
                {
                  choiceOid: 'VR: com.ptc.windchill.option.model.Choice:6008226',
                  choiceNumber: '000101',
                  choiceName: '选装特征值12323',
                  color: '黑色',
                },
              ],
            },
            {
              optionOid: 'VR: com.ptc.windchill.option.model.Option:601234',
              optionNumber: '000002',
              optionName: '固化特征2',
              choices: [
                {
                  choiceOid: 'VR: com.ptc.windchill.option.model.Choice:60022826',
                  choiceNumber: '000101',
                  choiceName: '选装特征值12323',
                  color: '黑色',
                },
                {
                  choiceOid: 'VR: com.ptc.windchill.opti43on.model.Choice:600826',
                  choiceNumber: '000103',
                  choiceName: '选装特征值1232223',
                  color: '黑色',
                },
              ],
            },
            {
              optionOid: 'VR: com.ptc.windchill.option.model.=======Optqion:600828',
              optionNumber: '000003',
              optionName: '固化特征3',
              choices: [
                {
                  choiceOid: 'VR: com.ptc.windchill.option.model.Choice:60082126',
                  choiceNumber: '000101',
                  choiceName: '选装特征值12323',
                  color: '黑色',
                },
                {
                  choiceOid: 'VR: com.ptc.windchill.opti43on.model.Choice:60082324246',
                  choiceNumber: '000103',
                  choiceName: '选装特征值123222399999999',
                  color: '黑色',
                },
                {
                  choiceOid: 'VR: com.ptc.windchill.opti43on.model.Choice:6082324246',
                  choiceNumber: '000103',
                  choiceName: '选装特征值12399999',
                  color: '黑色',
                },
              ],
            },
            {
              optionOid: 'VR: com.ptc.windchill.option.model.Option:6008228',
              optionNumber: '000003',
              optionName: '固化特征3',
              choices: [
                {
                  choiceOid: 'VR: com.ptc.windchill.option.model.Choice:6008261',
                  choiceNumber: '000101',
                  choiceName: '选装特征值12323',
                  color: '黑色',
                },
                {
                  choiceOid: 'VR: com.ptc.windchill.opti43on.model.Choice:600826',
                  choiceNumber: '000103',
                  choiceName: '选装特征值1232223',
                  color: '黑色',
                },
              ],
            },
            {
              optionOid: 'VR: com.ptc.windchill.option.model.Option:60308228',
              optionNumber: '000003',
              optionName: '固化特征3',
              choices: [
                {
                  choiceOid: 'VR: com.ptc.windchill.option.model.Choice:6008262',
                  choiceNumber: '000101',
                  choiceName: '选装特征值12323',
                  color: '黑色',
                },
                {
                  choiceOid: 'VR: com.ptc.windchill.opti43on.model.Choice:600826',
                  choiceNumber: '000103',
                  choiceName: '选装特征值1232223',
                  color: '黑色',
                },
              ],
            },
            {
              optionOid: 'VR: com.ptc.windchill.option.model.Option:603038228',
              optionNumber: '000003',
              optionName: '固化特征3',
              color: '白色',
              choices: [
                {
                  choiceOid: 'VR: com.ptc.windchill.option.model.Choice:600826',
                  choiceNumber: '000101',
                  choiceName: '选装特征值12323',
                  color: '黑色',
                },
                {
                  choiceOid: 'VR: com.ptc.windchill.opti43on.model.Choice:600826',
                  choiceNumber: '000103',
                  choiceName: '选装特征值1232223',
                  color: '黑色',
                },
              ],
            },
          ],
        },
      }
    },
  },
  {
    url: '/Windchill/app/config/getInternalVehicleModelTechConfig',
    method: 'post',
    response: () => {
      let random = Math.random() < 0.5 ? 1 : 2
      const data = {
        data1: {
          fixedItems: [
            {
              choices: [
                {
                  choiceName: 'EATON 403方向机',
                  choiceNumber: '30552',
                  choiceOid: 'OR:com.ptc.windchill.option.model.ChoiceMaster:12153257551',
                  color: '黑色',
                },
                {
                  choiceName: '智能方向机',
                  choiceNumber: '30556',
                  choiceOid: 'OR:com.ptc.windchill.option.model.ChoiceMaster:12153257599',
                  color: '黑色',
                },
              ],
              optionName: '方向机',
              optionNumber: '04232',
              optionOid: 'OR:com.ptc.windchill.option.model.OptionMaster:12153257493',
              readOnly: 'N',
            },
            {
              choices: [
                {
                  choiceName: '汕德卡 G7-N-6-6',
                  choiceNumber: '31520',
                  choiceOid: 'OR:com.ptc.windchill.option.model.ChoiceMaster:12153271013',
                  color: '黑色',
                },
                {
                  choiceName: '汕德卡 G7H-S-4-6-L',
                  choiceNumber: '31552',
                  choiceOid: 'OR:com.ptc.windchill.option.model.ChoiceMaster:12153271397',
                  color: '黑色',
                },
              ],
              optionName: '系列编码',
              optionNumber: '04368',
              optionOid: 'OR:com.ptc.windchill.option.model.OptionMaster:12153270703',
              readOnly: 'N',
            },
            {
              choices: [
                {
                  choiceName: '局部加强(7+5/280)',
                  choiceNumber: '31210',
                  choiceOid: 'OR:com.ptc.windchill.option.model.ChoiceMaster:12153266275',
                  color: '黑色',
                },
                {
                  choiceName: '局部三层(8+5+8/300)',
                  choiceNumber: '31242',
                  choiceOid: 'OR:com.ptc.windchill.option.model.ChoiceMaster:12153266659',
                  color: '黑色',
                },
              ],
              optionName: '车架',
              optionNumber: '04288',
              optionOid: 'OR:com.ptc.windchill.option.model.OptionMaster:12153266109',
              readOnly: 'N',
            },
            {
              choices: [
                {
                  choiceName: '三段式金属保险杠',
                  choiceNumber: '30585',
                  choiceOid: 'OR:com.ptc.windchill.option.model.ChoiceMaster:12153257986',
                  color: '黑色',
                },
                {
                  choiceName: '高位保险杠(全金属)',
                  choiceNumber: '30589',
                  choiceOid: 'OR:com.ptc.windchill.option.model.ChoiceMaster:12153258034',
                  color: '黑色',
                },
              ],
              optionName: '保险杠',
              optionNumber: '04235',
              optionOid: 'OR:com.ptc.windchill.option.model.OptionMaster:12153257976',
              readOnly: 'N',
            },
            {
              choices: [
                {
                  choiceName: '豪沃H78L驾驶室',
                  choiceNumber: '31140',
                  choiceOid: 'OR:com.ptc.windchill.option.model.ChoiceMaster:12153265253',
                  color: '黑色',
                },
                {
                  choiceName: 'TX-WD驾驶室',
                  choiceNumber: '31084',
                  choiceOid: 'OR:com.ptc.windchill.option.model.ChoiceMaster:12153264481',
                  color: '黑色',
                },
              ],
              optionName: '驾驶室',
              optionNumber: '04274',
              optionOid: 'OR:com.ptc.windchill.option.model.OptionMaster:12153264075',
              readOnly: 'N',
            },
          ],
          optionalItems: [
            {
              choices: [
                {
                  choiceName: '选装LED前照灯',
                  choiceNumber: '31306',
                  choiceOid: 'OR:com.ptc.windchill.option.model.ChoiceMaster:12153267674',
                  color: '黑色',
                },
                {
                  choiceName: '选装非LED前照灯',
                  choiceNumber: '31307',
                  choiceOid: 'OR:com.ptc.windchill.option.model.ChoiceMaster:12153267686',
                  color: '黑色',
                },
              ],
              optionName: '前照灯选装',
              optionNumber: '04307',
              optionOid: 'OR:com.ptc.windchill.option.model.OptionMaster:12153267664',
              readOnly: 'N',
            },
          ],
        },
        data2: {
          fixedItems: [
            {
              choices: [
                {
                  choiceName: 'EATON 403方向机',
                  choiceNumber: '30552',
                  choiceOid: 'OR:com.ptc.windchill.option.model.ChoiceMaster:12153257551',
                  color: '黑色',
                  value: 'S2',
                },
                {
                  choiceName: '智能方向机',
                  choiceNumber: '30556',
                  choiceOid: 'OR:com.ptc.windchill.option.model.ChoiceMaster:12153257599',
                  color: '黑色',
                  value: 'S3',
                },
              ],
              optionName: '方向机',
              optionNumber: '04232',
              optionOid: 'OR:com.ptc.windchill.option.model.OptionMaster:12153257493',
              readOnly: 'N',
            },
            {
              choices: [
                {
                  choiceName: '汕德卡 G7-N-6-6',
                  choiceNumber: '31520',
                  choiceOid: 'OR:com.ptc.windchill.option.model.ChoiceMaster:12153271013',
                  color: '黑色',
                  value: 'S2',
                },
                {
                  choiceName: '汕德卡 G7H-S-4-6-L',
                  choiceNumber: '31552',
                  choiceOid: 'OR:com.ptc.windchill.option.model.ChoiceMaster:12153271397',
                  color: '黑色',
                  value: 'S3',
                },
              ],
              optionName: '系列编码',
              optionNumber: '04368',
              optionOid: 'OR:com.ptc.windchill.option.model.OptionMaster:12153270703',
              readOnly: 'N',
            },
            {
              choices: [
                {
                  choiceName: '局部加强(7+5/280)',
                  choiceNumber: '31210',
                  choiceOid: 'OR:com.ptc.windchill.option.model.ChoiceMaster:12153266275',
                  color: '黑色',
                  value: 'S2',
                },
                {
                  choiceName: '局部三层(8+5+8/300)',
                  choiceNumber: '31242',
                  choiceOid: 'OR:com.ptc.windchill.option.model.ChoiceMaster:12153266659',
                  color: '黑色',
                  value: 'S3',
                },
              ],
              optionName: '车架',
              optionNumber: '04288',
              optionOid: 'OR:com.ptc.windchill.option.model.OptionMaster:12153266109',
              readOnly: 'N',
            },
            {
              choices: [
                {
                  choiceName: '三段式金属保险杠',
                  choiceNumber: '30585',
                  choiceOid: 'OR:com.ptc.windchill.option.model.ChoiceMaster:12153257986',
                  color: '黑色',
                  value: 'S2',
                },
                {
                  choiceName: '高位保险杠(全金属)',
                  choiceNumber: '30589',
                  choiceOid: 'OR:com.ptc.windchill.option.model.ChoiceMaster:12153258034',
                  color: '黑色',
                  value: 'S3',
                },
              ],
              optionName: '保险杠',
              optionNumber: '04235',
              optionOid: 'OR:com.ptc.windchill.option.model.OptionMaster:12153257976',
              readOnly: 'N',
            },
            {
              choices: [
                {
                  choiceName: '豪沃H78L驾驶室',
                  choiceNumber: '31140',
                  choiceOid: 'OR:com.ptc.windchill.option.model.ChoiceMaster:12153265253',
                  color: '黑色',
                  value: 'S2',
                },
                {
                  choiceName: 'TX-WD驾驶室',
                  choiceNumber: '31084',
                  choiceOid: 'OR:com.ptc.windchill.option.model.ChoiceMaster:12153264481',
                  color: '黑色',
                  value: 'S3',
                },
              ],
              optionName: '驾驶室',
              optionNumber: '04274',
              optionOid: 'OR:com.ptc.windchill.option.model.OptionMaster:12153264075',
              readOnly: 'N',
            },
          ],
          optionalItems: [
            {
              choices: [
                {
                  choiceName: '选装LED前照灯',
                  choiceNumber: '31306',
                  choiceOid: 'OR:com.ptc.windchill.option.model.ChoiceMaster:12153267674',
                  color: '黑色',
                  value: 'S1',
                },
                {
                  choiceName: '选装非LED前照灯',
                  choiceNumber: '31307',
                  choiceOid: 'OR:com.ptc.windchill.option.model.ChoiceMaster:12153267686',
                  color: '黑色',
                  value: 'S3',
                },
              ],
              optionName: '前照灯选装',
              optionNumber: '04307',
              optionOid: 'OR:com.ptc.windchill.option.model.OptionMaster:12153267664',
              readOnly: 'N',
            },
          ],
        },
      }
      return {
        success: true,
        random,
        message: 'ok',
        data: data['data' + random],
      }
    },
  },
  {
    url: '/Windchill/app/config/getACPartMapRuleDetail',
    method: 'post',
    response: () => {
      return {
        success: true,
        message: 'ok',
        data: [
          {
            oid: 'VR:com.ptc.windchill.option.model.ExpressionAlias:600826',
            sourceObjects: [
              {
                oid: 'VR:com.ptc.windchill.option.model.Option:600825',
                name: '驾驶室',
              },
            ],
            targetObjects: [
              {
                oid: 'VR:com.ptc.windchill.option.model.Option:600826',
                name: '驾驶室宽度',
              },
            ],
            mappingValues: [
              {
                oid: 'oid',
                sourceValues: [
                  {
                    oid: 'VR:com.ptc.windchill.option.model.Choice:600532',
                    value: '驾驶室特征值1',
                  },
                ],
                targetValues: [
                  {
                    oid: 'VR:com.ptc.windchill.option.model.Choice:600826',
                    value: '中宽体',
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
    url: '/Windchill/app/config/getUnclosedCharacterValueList',
    method: 'post',
    response: () => {
      return {
        success: true,
        message: 'ok',
        data: [
          {
            type: '车型子类左侧',
            ruleName: '油箱截面',
            description: '特征[油箱容积]的值[860L+240L]未封闭',
          },
          {
            type: '车型子类左侧',
            ruleName: '油箱截面',
            description: '特征[油箱容积]的值[860L+240L]未封闭',
          },
        ],
      }
    },
  },
  {
    url: '/Windchill/app/config/getMultiSourceCharacterList',
    method: 'post',
    response: () => {
      return {
        success: true,
        message: 'ok',
        data: [
          {
            name: '油箱截面',
            oid: '213213',
          },
          {
            name: '油箱截面21',
            oid: '2132133232',
          },
        ],
      }
    },
  },
  {
    url: '/Windchill/app/config/getACModelACPart',
    method: 'post',
    response: () => {
      return {
        success: false,
        message: '312313',
        data: null,
        // 'data|10': [
        //   {
        //     oid: 'OR:wt.part.WTPart:123434',
        //     number: 'AC-000345348',
        //     name: 'AC组件1',
        //   },
        //   {
        //     oid: 'OR:wt.part.WTPart:1234343',
        //     number: 'AC-0003453482',
        //     name: 'AC组件13',
        //   },
        // ],
      }
    },
  },
  {
    url: '/Windchill/app/config/reverseModelLogicalRules',
    method: 'post',
    response: () => {
      return {
        success: true,
        message: 'ok',
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
    url: '/Windchill/app/config/reversePlatformLogicalRules',
    method: 'post',
    response: () => {
      return {
        success: true,
        message: 'ok',
        data: [
          {
            oid: 'VR:com.ptc.windchill.option.model.OptionS2et:8657693436',
            name: '车型子类名称',
            ruleName: '发动机模块',
            location: '定位',
          },
          {
            oid: 'VR:com.ptc.windchill.option.model.2OptionS2et:8657693436',
            name: '车型子类名称',
            ruleName: '发动机模块',
            location: '定位',
          },
        ],
      }
    },
  },
  {
    url: '/Windchill/app/config/reverseSaleDesignMapRuleRules',
    method: 'post',
    response: () => {
      return {
        success: true,
        message: 'ok',
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
    url: '/Windchill/app/config/getACTaskByJSONParas',
    method: 'post',
    response: () => {
      return {
        success: true,
        message: 'ok',
        'data|20': [
          {
            oid: () => Random.id(),
            taskID: () => Random.id(),
            acName: () => Random.ctitle(4, 5),
            owner: () => Random.cname(),
            ownerDisplayName: () => Random.cname(),
            configCodeUserDisplayName: () => Random.ctitle(4, 5),
            departmentDisplayName: () => Random.ctitle(4, 5),
            startTime: () => Random.date(),
            action: '录入',
            'state|1': ['已完成', '进行中', '已终止'],
            'attachFeature|1': ['有', '无'],
          },
        ],
      }
    },
  },
  {
    url: '/Windchill/app/config/getPackageCodeList',
    method: 'post',
    response: () => {
      return {
        success: true,
        message: 'ok',
        data: {
          configTitles: [
            {
              titleID: 'number',
              titleName: '短码',
            },
          ],
          configItems: [
            {
              oid: 'VR:wt.doc.WTDocument:12345',
              number: '00012',
              configCode: 'G7S-K-4-6',
            },
          ],
          pkTitles: [
            {
              titleID: '1',
              titleName: '内部车型号',
            },
            {
              titleID: '2',
              titleName: '系列编号',
            },
            {
              titleID: '3',
              titleName: '区域',
            },
            {
              titleID: '4',
              titleName: '轮胎',
            },
            {
              titleID: '5',
              titleName: '车架',
            },
            {
              titleID: '6',
              titleName: '燃油箱选装',
            },
            {
              titleID: '7',
              titleName: '驾驶室',
            },
            {
              titleID: '8',
              titleName: '保险杠',
            },
            {
              titleID: '9',
              titleName: '细分市场',
            },
          ],
          pkItems: [
            {
              ['1']: Random.ctitle(10, 15),
              ['2']: Random.ctitle(10, 15),
              ['3']: Random.ctitle(10, 15),
              ['4']: Random.ctitle(10, 15),
              ['5']: Random.ctitle(10, 15),
              ['6']: Random.ctitle(10, 15),
              ['7']: Random.ctitle(10, 15),
              ['8']: Random.ctitle(10, 15),
              ['9']: Random.ctitle(10, 15),
            },
          ],
        },
      }
    },
  },
  {
    url: '/Windchill/app/config/getACModelEnterList',
    method: 'post',
    response: () => {
      return {
        success: true,
        message: 'ok',
        data: {
          titles: [
            {
              titleID: 'mark',
              titleName: '标识',
            },
            {
              titleID: Random.ctitle(5),
              titleName: Random.ctitle(8),
            },
            {
              titleID: Random.ctitle(5),
              titleName: Random.ctitle(8),
            },
            {
              titleID: Random.ctitle(5),
              titleName: Random.ctitle(8),
            },
            {
              titleID: Random.ctitle(5),
              titleName: Random.ctitle(8),
            },
            {
              titleID: Random.ctitle(5),
              titleName: Random.ctitle(8),
            },
            {
              titleID: Random.ctitle(5),
              titleName: Random.ctitle(8),
            },
            {
              titleID: Random.ctitle(5),
              titleName: Random.ctitle(8),
            },
            {
              titleID: Random.ctitle(5),
              titleName: Random.ctitle(8),
            },
            {
              titleID: Random.ctitle(5),
              titleName: Random.ctitle(8),
            },
            {
              titleID: '定位特征1ID ',
              titleName: '定位特征1名称',
            },
            {
              titleID: '定位特征n ID ',
              titleName: '定位特征n名称',
            },
            {
              titleID: 'modifier',
              titleName: '修改者',
            },
            {
              titleID: 'action',
              titleName: '操作',
            },
          ],
          'items|10-20': [
            {
              oid: 'VR:wt.part.WTPart:12345',
              mark: '$$$待录入实例',
              '定位特征1ID ': '定位特征1数值',
              定位特征nID: '定位特征n数值',
              modifer: '',
              action: '新建AC实例,更改AC实例录入',
              url: 'https://www.baidu.com',
            },
          ],
        },
      }
    },
  },
  {
    url: '/Windchill/app/config/getConfigVehicleQty',
    method: 'post',
    response: () => {
      return {
        success: true,
        message: 'ok',
        data: {
          quantity: '23458',
        },
      }
    },
  },
  {
    url: '/Windchill/app/config/getExplodeConfigCode',
    method: 'post',
    response: () => {
      return {
        success: false,
        message: '这是失败信息',
        data: {},
      }
    },
  },
  {
    url: '/Windchill/app/config/updateInternalVehicleModelTechConfig',
    method: 'post',
    response: () => {
      return {
        success: true,
        message: 'ok',
        data: {},
      }
    },
  },
  {
    url: '/Windchill/app/config/updateIncludeExcludeRule',
    method: 'post',
    response: () => {
      return {
        success: true,
        message: 'ok',
        data: {
          number: Random.ctitle(20),
          'oid|1-9999': 29,
        },
      }
    },
  },
  {
    url: 'Windchill/app/config/createIncludeExcludeRule',
    method: 'post',
    response: () => {
      return {
        success: true,
        message: 'ok',
        data: {},
      }
    },
  },
  {
    url: '/Windchill/app/config/getConfigCodeUnReleasedOptions',
    method: 'post',
    response: () => {
      return {
        success: true,
        message: 'ok',
        data: [
          {
            oid: 'OR:wt.part.WTPart:1234234',
            number: 'AC-0003453482',
            name: 'AC组件1',
          },
          {
            oid: 'OR:wt.part.WTPart:12342342',
            number: 'AC-00034534823',
            name: 'AC组件2',
          },
        ],
      }
    },
  },
  {
    url: '/Windchill/app/config/getConfigCodeAuditOrgList',
    method: 'post',
    response: () => {
      return {
        success: true,
        message: 'ok',
        data: [
          {
            key: '卡销',
            value: '卡销',
          },
        ],
      }
    },
  },
  {
    url: '/Windchill/app/config/getEffConfigCodeList',
    method: 'post',
    response: () => {
      return {
        success: true,
        message: 'ok',
        data: [
          {
            key: 'ZZ4256V384HF1LB/B9EDN38-G-新标运@PEOO1',
            value: 'ZZ4256V384HF1LB/B9EDN38-G-新标运@PEOO1',
          },
        ],
      }
    },
  },
  {
    url: '/Windchill/app/config/getConfigCodeUnReleasedOptions',
    method: 'post',
    response: () => {
      return {
        success: true,
        message: 'ok',
        data: [
          {
            oid: 'OR:wt.part.WTPart:123434',
            number: 'AC-000345348',
            name: 'AC组件1',
          },
        ],
      }
    },
  },
  {
    url: '/Windchill/app/config/getCurrentObjState',
    method: 'post',
    response: () => {
      return {
        code: 200,
        data: {
          state: '设计中',
          configVehicle: '普通车型',
          pushFlag: true,
          allPkNum: () => Random.id(2),
        },
        message: '',
        success: true,
      }
    },
  },
  {
    url: '/Windchill/app/config/createACPartMapRule',
    method: 'post',
    response: () => {
      return {
        code: 200,
        data: { number: 12332, oid: 23234 },
        message: '',
        success: true,
      }
    },
  },
  {
    url: '/Windchill/app/config/getPushConfigCodeList',
    method: 'post',
    response: () => {
      return {
        code: 200,
        data: [
          {
            'configCode|20': 'TS720240702001@20240987',
            modifier: '(3123)wcadmin',
            vehiclePartEffDate: '2024-07-24',
            oid: '223',
          },
          {
            'configCode|20': 'TS720240702001@20240987',
            modifier: '(3123)wcadmin1',
            vehiclePartEffDate: '2024-07-25',
            oid: '2232',
          },
        ],
        message: '',
        success: true,
      }
    },
  },
  {
    url: '/Windchill/app/config/manualReleaseConfigCode',
    method: 'post',
    response: () => {
      return { code: 200, data: '', message: '推送成功', success: true }
    },
  },
  {
    url: '/Windchill/app/config/exportBomData',
    method: 'post',
    response: () => {
      return {
        code: 200,
        data: 'http://pdmdev.cnhtc.cn/Windchill/templlext//cnhtc/lconfigmgmt%7C/1724231844946//exportBomTemplate.xlsx',
        message: '',
        success: true,
      }
    },
  },
  {
    url: '/Windchill/app/config/checkTypeSpectrum',
    method: 'post',
    response: () => {
      return {
        code: 200,
        data: 'http://pdmdev.cnhtc.cn/Windchill/templlext//cnhtc/lconfigmgmt%7C/1724231844946//exportBomTemplate.xlsx',
        message: '错误',
        success: false,
      }
    },
  },
  {
    url: '/Windchill/app/config/checkGeneratePartNumber',
    method: 'post',
    response: () => {
      return {
        code: 200,
        data: '',
        'message|1': ['存在相关分类配置', '需要输入AC实例编号'],
        success: true,
      }
    },
  },
]
