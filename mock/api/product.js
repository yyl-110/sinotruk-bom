import { Random } from 'mockjs'

const posts = {
  childType: '平台',
  deletePermission: 'N',
  childNodes: [
    {
      childType: '品牌',
      deletePermission: 'N',
      childNodes: [
        {
          childType: '品系,子品系',
          deletePermission: 'N',
          childNodes: [
            {
              childType: '子品系',
              deletePermission: 'N',
              name: 'GSS',
              action: 'create',
              oid: 'OR:wt.part.WTPart:246102',
              createPermission: 'Y',
              modifyPermission: 'Y',
            },
          ],
          createTitle: '品系/子品系',
          name: '东风',
          action: 'create',
          oid: 'OR:wt.part.WTPart:246112',
          createPermission: 'Y',
          modifyPermission: 'Y',
        },
      ],
      createTitle: '品牌',
      name: '重卡平台',
      action: 'create',
      oid: 'OR:wt.part.WTPart:245883',
      createPermission: 'Y',
      modifyPermission: 'Y',
    },
    {
      childType: '品牌',
      deletePermission: 'N',
      childNodes: [
        {
          childType: '品系,子品系',
          deletePermission: 'N',
          childNodes: [
            {
              childType: '车型子类',
              deletePermission: 'N',
              childNodes: [
                {
                  childType: '内部车型号',
                  deletePermission: 'Y',
                  childNodes: [],
                  createTitle: '内部车型号',
                  name: '车型bom01',
                  action: 'create',
                  oid: '1',
                  createPermission: 'N',
                  modifyPermission: 'Y',
                },
                {
                  childType: '内部车型号',
                  deletePermission: 'Y',
                  childNodes: [],
                  createTitle: '内部车型号',
                  name: '车型bom02',
                  action: 'create',
                  oid: '2',
                  createPermission: 'N',
                  modifyPermission: 'Y',
                },
              ],
              createTitle: '车型子类',
              name: 'PKH',
              action: 'create',
              oid: 'OR:wt.part.WTPart:246191',
              createPermission: 'N',
              modifyPermission: 'N',
            },
          ],
          createTitle: '品系/子品系',
          name: '皮卡',
          action: 'create',
          oid: 'OR:wt.part.WTPart:246179',
          createPermission: 'Y',
          modifyPermission: 'N',
        },
      ],
      createTitle: '平台',
      name: '轻卡',
      action: 'create',
      oid: 'OR:wt.part.WTPart:246167',
      createPermission: 'Y',
      modifyPermission: 'Y',
    },
  ],
  createTitle: '平台',
  name: '中国重汽',
  action: 'create',
  oid: 'OR:wt.part.WTPart:245078',
  createPermission: 'Y',
  modifyPermission: 'N',
}
const list = [
  {
    oid: 'VR:com.ptc.windchill.option.model.OptionSet:123451',
    number: 'G7S-K-4-67S-自卸-6x4',
    name: 'G7S-自卸-6x4-国六G7S-自卸-6fsafsafew（*@&！（@（*@&（*&@*&（@8（*！28*@（a---====23232+++@#（！（&（@&&#&@（&@！（x4-国六',
    yearNo: '2023',
    loadLocation: '商用车',
    version: 'A.1',
    status: '废弃',
    responsiblePerson: '张世宁',
    updateTime: 'Sun Jun 30 2024 18:58:15 GMT+0800',
    changeUrl: 'http://xxx.xxx/xxx',
  },
  {
    oid: 'VR:com.ptc.windchill.option.model.OptionSet:123452',
    number: 'G7S-K-4-6',
    name: 'G7S-自卸-6x4-国六G7S-自卸-6x4-国六',
    yearNo: '2023',
    loadLocation: '商用车',
    version: 'A.1',
    status: '设计中',
    responsiblePerson: '张世宁',
    updateTime: 'Sun Jun 30 2024 18:58:15 GMT+0800',
    changeUrl: 'http://xxx.xxx/xxx',
    configVehicle: '特殊车型',
    optionSetStatus: '已完成',
  },
  {
    oid: '1',
    number: 'G7S-K-4-6',
    name: 'G7S-自卸-6x4-国六G7S-自卸-6x4-国六',
    yearNo: '2023',
    loadLocation: '商用车',
    version: 'B.1',
    status: '设计中',
    responsiblePerson: '张世宁',
    updateTime: 'Sun Jun 30 2024 18:58:15 GMT+0800',
    changeUrl: 'http://xxx.xxx/xxx',
  },
  {
    oid: '2',
    number: 'G7S-K-4-6',
    name: 'G7S-自卸-6x4-国六G7S-自卸-6x4-国六',
    yearNo: '2023',
    loadLocation: '商用车',
    version: 'A.1',
    status: '已完成',
    responsiblePerson: '张世宁',
    updateTime: '2023-11-09 15:33',
    changeUrl: 'http://xxx.xxx/xxx',
  },
  {
    oid: '2',
    number: 'G7S-K-4-6',
    name: 'G7S-自卸-6x4-国六G7S-自卸-6x4-国六',
    yearNo: '2023',
    loadLocation: '商用车',
    version: 'A.1',
    status: '已完成',
    responsiblePerson: '张世宁',
    updateTime: '2023-11-09 15:33',
    changeUrl: 'http://xxx.xxx/xxx',
  },
  {
    oid: '2',
    number: 'G7S-K-4-6',
    name: 'G7S-自卸-6x4-国六G7S-自卸-6x4-国六',
    yearNo: '2023',
    loadLocation: '商用车',
    version: 'A.1',
    status: '已完成',
    responsiblePerson: '张世宁',
    updateTime: '2023-11-09 15:33',
    changeUrl: 'http://xxx.xxx/xxx',
  },
  {
    oid: '2',
    number: 'G7S-K-4-6',
    name: 'G7S-自卸-6x4-国六G7S-自卸-6x4-国六',
    yearNo: '2023',
    loadLocation: '商用车',
    version: 'A.1',
    status: '已完成',
    responsiblePerson: '张世宁',
    updateTime: '2023-11-09 15:33',
    changeUrl: 'http://xxx.xxx/xxx',
  },
  {
    oid: '2',
    number: 'G7S-K-4-6',
    name: 'G7S-自卸-6x4-国六G7S-自卸-6x4-国六',
    yearNo: '2023',
    loadLocation: '商用车',
    version: 'A.1',
    status: '已完成',
    responsiblePerson: '张世宁',
    updateTime: '2023-11-09 15:33',
    changeUrl: 'http://xxx.xxx/xxx',
  },
  {
    oid: '2',
    number: 'G7S-K-4-6',
    name: 'G7S-自卸-6x4-国六G7S-自卸-6x4-国六',
    yearNo: '2023',
    loadLocation: '商用车',
    version: 'A.1',
    status: '已完成',
    responsiblePerson: '张世宁',
    updateTime: '2023-11-09 15:33',
    changeUrl: 'http://xxx.xxx/xxx',
  },
  {
    oid: '2',
    number: 'G7S-K-4-6',
    name: 'G7S-自卸-6x4-国六G7S-自卸-6x4-国六',
    yearNo: '2023',
    loadLocation: '商用车',
    version: 'A.1',
    status: '已完成',
    responsiblePerson: '张世宁',
    updateTime: '2023-11-09 15:33',
    changeUrl: 'http://xxx.xxx/xxx',
  },
  {
    oid: '2',
    number: 'G7S-K-4-6',
    name: 'G7S-自卸-6x4-国六G7S-自卸-6x4-国六',
    yearNo: '2023',
    loadLocation: '商用车',
    version: 'A.1',
    status: '已完成',
    responsiblePerson: '张世宁',
    updateTime: '2023-11-09 15:33',
    changeUrl: 'http://xxx.xxx/xxx',
  },
  {
    oid: '2',
    number: 'G7S-K-4-6',
    name: 'G7S-自卸-6x4-国六G7S-自卸-6x4-国六',
    yearNo: '2023',
    loadLocation: '商用车',
    version: 'A.1',
    status: '已完成',
    responsiblePerson: '张世宁',
    updateTime: '2023-11-09 15:33',
    changeUrl: 'http://xxx.xxx/xxx',
  },
  {
    oid: '2',
    number: 'G7S-K-4-6',
    name: 'G7S-自卸-6x4-国六G7S-自卸-6x4-国六',
    yearNo: '2023',
    loadLocation: '商用车',
    version: 'A.1',
    status: '已完成',
    responsiblePerson: '张世宁',
    updateTime: '2023-11-09 15:33',
    changeUrl: 'http://xxx.xxx/xxx',
  },
  {
    oid: '2',
    number: 'G7S-K-4-6',
    name: 'G7S-自卸-6x4-国六G7S-自卸-6x4-国六',
    yearNo: '2023',
    loadLocation: '商用车',
    version: 'A.1',
    status: '已完成',
    responsiblePerson: '张世宁',
    updateTime: '2023-11-09 15:33',
    changeUrl: 'http://xxx.xxx/xxx',
  },
  {
    oid: '2',
    number: 'G7S-K-4-6',
    name: 'G7S-自卸-6x4-国六G7S-自卸-6x4-国六',
    yearNo: '2023',
    loadLocation: '商用车',
    version: 'A.1',
    status: '已完成',
    responsiblePerson: '张世宁',
    updateTime: '2023-11-09 15:33',
    changeUrl: 'http://xxx.xxx/xxx',
  },
  {
    oid: '2',
    number: 'G7S-K-4-6',
    name: 'G7S-自卸-6x4-国六G7S-自卸-6x4-国六',
    yearNo: '2023',
    loadLocation: '商用车',
    version: 'A.1',
    status: '已完成',
    responsiblePerson: '张世宁',
    updateTime: '2023-11-09 15:33',
    changeUrl: 'http://xxx.xxx/xxx',
  },
  {
    oid: '2',
    number: 'G7S-K-4-6',
    name: 'G7S-自卸-6x4-国六G7S-自卸-6x4-国六',
    yearNo: '2023',
    loadLocation: '商用车',
    version: 'A.1',
    status: '已完成',
    responsiblePerson: '张世宁',
    updateTime: '2023-11-09 15:33',
    changeUrl: 'http://xxx.xxx/xxx',
  },
  {
    oid: '2',
    number: 'G7S-K-4-6',
    name: 'G7S-自卸-6x4-国六G7S-自卸-6x4-国六',
    yearNo: '2023',
    loadLocation: '商用车',
    version: 'A.1',
    status: '已完成',
    responsiblePerson: '张世宁',
    updateTime: '2023-11-09 15:33',
    changeUrl: 'http://xxx.xxx/xxx',
  },
  {
    oid: '2',
    number: 'G7S-K-4-6',
    name: 'G7S-自卸-6x4-国六G7S-自卸-6x4-国六',
    yearNo: '2023',
    loadLocation: '商用车',
    version: 'A.1',
    status: '已完成',
    responsiblePerson: '张世宁',
    updateTime: '2023-11-09 15:33',
    changeUrl: 'http://xxx.xxx/xxx',
  },
]
const AttrsEnum = {
  vehicleUse: [
    {
      key: '载货车',
      value: '载货车',
    },
    {
      key: '越野车',
      value: '越野车',
    },
    {
      key: '自卸车',
      value: '自卸车',
    },
    {
      key: '牵引车',
      value: '牵引车',
    },
    {
      key: '搅拌车',
      value: '搅拌车',
    },
  ],
}

export default [
  {
    url: '/Windchill/app/product/getBaseStructure',
    method: 'post',
    response: () => {
      return {
        success: true,
        message: 'ok',
        data: posts,
      }
    },
  },
  {
    url: '/Windchill/app/product/deleteTreeNode',
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
    url: '/Windchill/app/product/getVehicleTypeDetail',
    method: 'post',
    response: () => {
      return {
        success: true,
        message: 'ok',
        data: [
          {
            action: 'text',
            enums: [],
            id: 'seriesCode',
            name: '系列编码',
            readonly: 'Y',
            required: 'Y',
            value: 'TS7-B-4X4-B-3-W-001',
          },
          {
            action: 'text',
            enums: [],
            id: 'name',
            name: '名称',
            readonly: 'Y',
            required: 'Y',
            value: 'TS7-B-4X4-B-3-W-001',
          },
          {
            action: 'text',
            enums: [],
            id: 'VEHICLE_PLATFORM',
            name: '车型平台',
            readonly: 'Y',
            required: 'N',
            value: '中重卡',
          },
          {
            action: 'text',
            enums: [],
            id: 'brandName',
            name: '品牌',
            readonly: 'Y',
            required: 'Y',
            value: '豪沃',
          },
          {
            action: 'text',
            enums: [],
            id: 'subseriesName',
            name: '子品系',
            readonly: 'Y',
            required: 'Y',
            value: 'TS7',
          },
          {
            action: 'select',
            enums: [
              {
                key: '载货车',
                value: '载货车',
              },
              {
                key: '自卸车',
                value: '自卸车',
              },
              {
                key: '牵引车',
                value: '牵引车',
              },
              {
                key: '搅拌车',
                value: '搅拌车',
              },
              {
                key: '专用车',
                value: '专用车',
              },
            ],
            id: 'VEHICLE_TYPE',
            name: '车辆类型',
            readonly: 'Y',
            required: 'Y',
            value: '搅拌车',
          },
          {
            action: 'select',
            enums: [
              {
                key: '8×2(双前轴转向，后支承桥）',
                value: '8×2(双前轴转向，后支承桥）',
              },
              {
                key: '4×2',
                value: '4×2',
              },
              {
                key: '6×2',
                value: '6×2',
              },
              {
                key: '6×4',
                value: '6×4',
              },
              {
                key: '8×4',
                value: '8×4',
              },
              {
                key: '4×4',
                value: '4×4',
              },
              {
                key: '6×6',
                value: '6×6',
              },
              {
                key: '8×2',
                value: '8×2',
              },
              {
                key: '8×8',
                value: '8×8',
              },
              {
                key: '10×4',
                value: '10×4',
              },
              {
                key: '10×4(后提升,带转向）',
                value: '10×4(后提升,带转向）',
              },
              {
                key: '8×6',
                value: '8×6',
              },
              {
                key: '8×4(单前轴转向,双驱动桥+中提升桥)',
                value: '8×4(单前轴转向,双驱动桥+中提升桥)',
              },
              {
                key: '6×2(中置随动转向)',
                value: '6×2(中置随动转向)',
              },
              {
                key: '10×4(中置随动转向)',
                value: '10×4(中置随动转向)',
              },
              {
                key: '8×2(双前轴转向,中支承桥)',
                value: '8×2(双前轴转向,中支承桥)',
              },
              {
                key: '6×2(后提升)',
                value: '6×2(后提升)',
              },
              {
                key: '6×2(中支撑桥）',
                value: '6×2(中支撑桥）',
              },
              {
                key: '6×2(后支撑桥)',
                value: '6×2(后支撑桥)',
              },
              {
                key: '8×2(后提升）',
                value: '8×2(后提升）',
              },
              {
                key: '10×8',
                value: '10×8',
              },
              {
                key: '6×4(双驱动桥+后提升桥)',
                value: '6×4(双驱动桥+后提升桥)',
              },
              {
                key: '8×2(中提升)',
                value: '8×2(中提升)',
              },
              {
                key: '6×2后提升',
                value: '6×2后提升',
              },
              {
                key: '6×2双转向',
                value: '6×2双转向',
              },
            ],
            id: 'DRIVE_TYPE',
            name: '驱动型式',
            readonly: 'Y',
            required: 'Y',
            value: '4x4',
          },
          {
            action: 'select',
            enums: [
              {
                key: '国六',
                value: '国六',
              },
              {
                key: '国五',
                value: '国五',
              },
              {
                key: '国四',
                value: '国四',
              },
              {
                key: '国三',
                value: '国三',
              },
              {
                key: '国二',
                value: '国二',
              },
              {
                key: '纯电',
                value: '纯电',
              },
            ],
            id: 'EMISSION_STANDARD',
            name: '排放标准',
            readonly: 'Y',
            required: 'Y',
            value: '国三',
          },
          {
            action: 'select',
            enums: [
              {
                key: '燃油',
                value: '燃油',
              },
              {
                key: 'LNG',
                value: 'LNG',
              },
              {
                key: 'CNG',
                value: 'CNG',
              },
              {
                key: '电池',
                value: '电池',
              },
              {
                key: '混动-柴油',
                value: '混动-柴油',
              },
              {
                key: '混动-LNG',
                value: '混动-LNG',
              },
              {
                key: '氢燃料电池',
                value: '氢燃料电池',
              },
              {
                key: '混动-CNG',
                value: '混动-CNG',
              },
              {
                key: 'CNG+LNG',
                value: 'CNG+LNG',
              },
            ],
            id: 'fuelType',
            name: '燃料形式',
            readonly: 'Y',
            required: 'Y',
            value: 'LNG',
          },
          {
            action: 'select',
            enums: [
              {
                key: '2020',
                value: '2020',
              },
              {
                key: '2021',
                value: '2021',
              },
              {
                key: '2022',
                value: '2022',
              },
              {
                key: '2023',
                value: '2023',
              },
              {
                key: '2024',
                value: '2024',
              },
              {
                key: '2025',
                value: '2025',
              },
              {
                key: '2026',
                value: '2026',
              },
              {
                key: '2027',
                value: '2027',
              },
              {
                key: '2028',
                value: '2028',
              },
              {
                key: '2029',
                value: '2029',
              },
              {
                key: '2030',
                value: '2030',
              },
            ],
            id: 'yearNo',
            name: '年代号',
            readonly: 'Y',
            required: 'Y',
            value: '2028',
          },
          {
            action: 'select',
            enums: [
              {
                key: '不适用',
                value: '不适用',
              },
              {
                key: '冷藏',
                value: '冷藏',
              },
            ],
            id: 'helm',
            name: '专用用途',
            readonly: 'N',
            required: 'N',
            value: '',
          },
          {
            action: 'select',
            enums: [
              {
                key: '常规车型',
                value: '常规车型',
              },
              {
                key: '特殊车型',
                value: '特殊车型',
              },
            ],
            id: 'configVehicle',
            name: '配置车型',
            readonly: 'N',
            required: 'N',
            value: '特殊车型',
          },
          {
            action: 'select',
            enums: [
              {
                key: '卡车',
                value: '卡车',
              },
              {
                key: '济南商用车',
                value: '济南商用车',
              },
              {
                key: '济南轻卡',
                value: '济南轻卡',
              },
              {
                key: '济宁',
                value: '济宁',
              },
            ],
            id: 'loadLocation',
            name: '首次装车地点',
            readonly: 'N',
            required: 'Y',
            value: '济南商用车',
          },
          {
            action: 'select',
            enums: [
              {
                key: 'OR:wt.part.WTPart:14552764112',
                value: 'TS7-1-4X2-B-2-2030-001',
              },
              {
                key: 'OR:wt.part.WTPart:14552891442',
                value: 'TS7-B-E-B-2-X-001',
              },
            ],
            id: 'duplicate',
            name: '复制车型子类',
            readonly: 'N',
            required: 'Y',
            value: '',
          },
          {
            action: 'Fix',
            enums: [],
            id: 'responsiblePerson',
            name: '负责人',
            readonly: 'N',
            required: 'Y',
            value: 'zhangsan',
          },
          {
            action: 'Fix',
            enums: [],
            id: 'participantPerson',
            name: '参与成员',
            readonly: 'N',
            required: 'Y',
            value: 'zhangsan',
          },
          {
            action: 'text',
            enums: [],
            id: 'rmark',
            name: '备注信息',
            readonly: 'N',
            required: 'N',
            value: 'wangzh(dev2测试2)',
          },
          {
            action: 'select',
            enums: [
              {
                key: 'P00',
                value: 'P00-过程开发未开始',
              },
              {
                key: 'P55',
                value: 'P55-完成批量工艺设计评审',
              },
              {
                key: 'P25',
                value: 'P25-完成性能样车释放评审',
              },
              {
                key: 'P35',
                value: 'P35-完成可靠性样车工艺设计',
              },
              {
                key: 'P15',
                value: 'P15-完成功能样车释放评审',
              },
              {
                key: 'P50',
                value: 'P50-完成批量工艺方案评审',
              },
              {
                key: 'P60',
                value: 'P60-完成批量工艺验证评审',
              },
              {
                key: 'P30',
                value: 'P30-完成可靠性样车工艺方案',
              },
              {
                key: 'P40',
                value: 'P40-完成可靠性样车释放方案',
              },
              {
                key: 'P10',
                value: 'P10-完成功能样车工艺方案',
              },
              {
                key: 'P20',
                value: 'P20-完成性能样车工艺方案',
              },
            ],
            id: 'processmaturity',
            name: '过程成熟度',
            readonly: 'Y',
            required: 'Y',
            value: 'P40',
          },
          {
            action: 'select',
            enums: [
              {
                key: 'D30',
                value: 'D30-性能验证状态',
              },
              {
                key: 'D40',
                value: 'D40-可靠性验证状态',
              },
              {
                key: 'D10',
                value: 'D10-技术设计状态',
              },
              {
                key: 'D20',
                value: 'D20-功能验证状态',
              },
              {
                key: 'D45',
                value: 'D45-可靠性验证状态',
              },
              {
                key: 'D55',
                value: 'D55-设计释放准备状态',
              },
              {
                key: 'D35',
                value: 'D35-性能验证状态',
              },
              {
                key: 'D50',
                value: 'D50-真实道路场景验证状态',
              },
              {
                key: 'D60',
                value: 'D60-设计状态冻结',
              },
            ],
            id: 'maturity',
            name: '设计成熟度',
            readonly: 'Y',
            required: 'Y',
            value: 'D60',
          },
        ],
      }
    },
  },
  {
    url: '/Windchill/app/product/getVehicleTypeList',
    method: 'post',
    response: () => {
      return {
        success: true,
        message: 'ok',
        total: 15,
        pages: 2,
        data: list,
      }
    },
  },
  {
    url: '/Windchill/app/product/getInternalVehicleModelList',
    method: 'post',
    response: () => {
      return {
        success: true,
        message: 'ok',
        total: 15,
        pages: 1,
        data: [
          {
            oid: 'VR:wt.doc.WTDocument:1',
            number: 'ZZ1315V4666F1/UCVAV38-标运1',
            serialNumber: 'G7S-K-4-6',
            series: '品系',
            vehicleUse: '车型',
            driveForm: '驱动形式',
            fuelForm: '燃油形式',
            emissionStd: '排放标准',
            version: 'A.1',
            status: '设计中',
            responsiblePerson: '张世宁',
            updateTime: '2023-11-09 15:33',
            changeUrl: 'http://xxx.xxx/xxx',
            'pkNum|1-2000': 100,
          },
          {
            oid: 'VR:wt.doc.WTDocument:2',
            number: 'ZZ1315V4666F1/UCVAV38-标运2',
            serialNumber: 'G7S-K-4-6',
            series: '品系',
            vehicleUse: '车型',
            driveForm: '驱动形式',
            fuelForm: '燃油形式',
            emissionStd: '排放标准',
            version: 'A.1',
            status: '设计中',
            responsiblePerson: '张世宁',
            updateTime: '2023-11-09 15:33',
            changeUrl: 'http://xxx.xxx/xxx',
            'pkNum|1-2000': 100,
          },
          {
            oid: 'VR:wt.doc.WTDocument:3',
            number: 'ZZ1315V4666F1/UCVAV38-标运3',
            serialNumber: 'G7S-K-4-6',
            series: '品系',
            vehicleUse: '车型',
            driveForm: '驱动形式',
            fuelForm: '燃油形式',
            emissionStd: '排放标准',
            version: 'A.1',
            status: '已完成',
            responsiblePerson: '张世宁',
            updateTime: '2023-11-09 15:33',
            changeUrl: 'http://xxx.xxx/xxx',
            'pkNum|1-2000': 100,
          },
          {
            oid: 'VR:wt.doc.WTDocument:4',
            number: 'ZZ1315V4666F1/UCVAV38-标运4',
            serialNumber: 'G7S-K-4-6',
            series: '品系',
            vehicleUse: '车型',
            driveForm: '驱动形式',
            fuelForm: '燃油形式',
            emissionStd: '排放标准',
            version: 'A.1',
            status: '已完成',
            responsiblePerson: '张世宁',
            updateTime: '2023-11-09 15:33',
            changeUrl: 'http://xxx.xxx/xxx',
            'pkNum|1-2000': 100,
          },
        ],
      }
    },
  },
  {
    url: '/Windchill/app/product/getVehicleTypeAttrsEnum',
    method: 'post',
    response: () => {
      return {
        success: true,
        message: 'ok',
        data: AttrsEnum,
      }
    },
  },
  {
    url: '/Windchill/app/feature/getUserList',
    method: 'post',
    response: () => {
      return {
        success: true,
        message: 'ok',
        data: [
          {
            username: '张三',
            userid: 'zhangsan',
          },
          {
            username: '李四',
            userid: 'lisi',
          },
          {
            username: '王二',
            userid: 'wanger',
          },
          {
            username: '赵五',
            userid: 'zhaowu',
          },
        ],
      }
    },
  },
  {
    url: '/Windchill/app/product/deleteVehicleType',
    method: 'post',
    response: () => {
      return {
        success: true,
        message: '删除成功',
        data: {},
      }
    },
  },
  {
    url: '/Windchill/app/product/getCurrentUserInfo',
    method: 'post',
    response: () => {
      return {
        success: true,
        message: '',
        data: {
          userFullName: 'wcadmin',
          userName: 'Administrator',
          'userRole|1': ['配置管理员', '配置员'],
        },
      }
    },
  },
  {
    url: '/Windchill/app/product/searchConfigUserInfoList',
    method: 'post',
    response: () => {
      return {
        success: true,
        message: '',
        'data|5-10': [
          {
            department: () => Random.ctitle(5),
            userid: () => Random.id(),
            username: () => Random.cname(),
          },
        ],
      }
    },
  },
  {
    url: '/Windchill/app/product/getInternalVehicleModelDetail',
    method: 'post',
    response: () => {
      return {
        success: true,
        message: '',
        data: [
          {
            enums: [],
            readonly: 'N',
            name: '系列编码',
            action: 'text',
            id: 'seriesCode',
            value: '',
            required: 'Y',
          },
          {
            enums: [],
            readonly: 'N',
            name: '名称',
            action: 'text',
            id: 'name',
            value: '',
            required: 'Y',
          },
          {
            enums: [],
            readonly: 'N',
            name: '车型平台',
            action: 'text',
            id: 'carType',
            value: '',
          },
          {
            enums: [],
            readonly: 'N',
            name: '生产单位',
            action: 'text',
            id: 'company',
            value: '',
            required: 'Y',
          },
          {
            enums: [],
            readonly: 'N',
            name: '车辆类型',
            action: 'text',
            id: 'carSort',
            value: '',
          },
          {
            enums: [],
            readonly: 'N',
            name: '合格证型号',
            action: 'text',
            id: 'hgzModelCode',
            value: '',
          },
          {
            enums: [],
            readonly: 'N',
            name: '轴距',
            action: 'text',
            id: 'hheelbase',
            value: '',
          },
          {
            enums: [],
            readonly: 'N',
            name: '品牌',
            action: 'text',
            id: 'brandName',
            value: '',
          },
          {
            enums: [],
            readonly: 'N',
            name: '品系',
            action: 'text',
            id: 'seriesName',
            value: '',
          },
          {
            enums: [],
            readonly: 'N',
            name: '子品系',
            action: 'text',
            id: 'subseriesName',
            value: '',
          },
          {
            enums: [
              {
                value: '不适用',
                key: '不适用',
              },
              {
                value: '冷藏',
                key: '冷藏',
              },
            ],
            readonly: 'N',
            name: '总质量(吨)',
            action: 'select',
            id: 'weight',
            value: '',
            required: 'Y',
          },
          {
            enums: [
              {
                value: '8x2(双前轴转向，后支承桥）',
                key: '8x2(双前轴转向，后支承桥）',
              },
              {
                value: '4x2',
                key: '4x2',
              },
              {
                value: '6x2',
                key: '6x2',
              },
              {
                value: '6x4',
                key: '6x4',
              },
              {
                value: '8x4',
                key: '8x4',
              },
              {
                value: '4x4',
                key: '4x4',
              },
              {
                value: '6x6',
                key: '6x6',
              },
              {
                value: '8x2',
                key: '8x2',
              },
              {
                value: '8x8',
                key: '8x8',
              },
              {
                value: '10x4',
                key: '10x4',
              },
              {
                value: '10x4(后提升,带转向）',
                key: '10x4(后提升,带转向）',
              },
              {
                value: '8X6',
                key: '8X6',
              },
              {
                value: '8x4(单前轴转向,双驱动桥+中提升桥)',
                key: '8x4(单前轴转向,双驱动桥+中提升桥)',
              },
              {
                value: '6x2(中置随动转向)',
                key: '6x2(中置随动转向)',
              },
              {
                value: '10x4(中置随动转向)',
                key: '10x4(中置随动转向)',
              },
              {
                value: '8x2(双前轴转向,中支承桥)',
                key: '8x2(双前轴转向,中支承桥)',
              },
              {
                value: '6x2(后提升)',
                key: '6x2(后提升)',
              },
              {
                value: '6x2(中支撑桥）',
                key: '6x2(中支撑桥）',
              },
              {
                value: '6x2(后支撑桥)',
                key: '6x2(后支撑桥)',
              },
              {
                value: '8x2(后提升）',
                key: '8x2(后提升）',
              },
              {
                value: '10x8',
                key: '10x8',
              },
              {
                value: '6x4(双驱动桥+后提升桥)',
                key: '6x4(双驱动桥+后提升桥)',
              },
              {
                value: '8x2(中提升)',
                key: '8x2(中提升)',
              },
              {
                value: '6x2后提升',
                key: '6x2后提升',
              },
              {
                value: '6x2双转向',
                key: '6x2双转向',
              },
            ],
            readonly: 'N',
            required: 'Y',
            name: '驱动型式',
            action: 'number',
            id: 'driveForm',
            value: '3',
          },
        ],
      }
    },
  },
  // {
  //   url: '/api/post',
  //   method: 'post',
  //   response: ({ body }) => {
  //     return {
  //       code: 0,
  //       message: 'ok',
  //       data: body,
  //     }
  //   },
  // },
  // {
  //   url: '/api/post/:id',
  //   method: 'put',
  //   response: ({ query, body }) => {
  //     return {
  //       code: 0,
  //       message: 'ok',
  //       data: {
  //         id: query.id,
  //         body,
  //       },
  //     }
  //   },
  // },
  // {
  //   url: '/api/post/:id',
  //   method: 'delete',
  //   response: ({ query }) => {
  //     return {
  //       code: 0,
  //       message: 'ok',
  //       data: {
  //         id: query.id,
  //       },
  //     }
  //   },
  // },
]
