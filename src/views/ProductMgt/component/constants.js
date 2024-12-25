/* 车型平台 */
const CAR_PLATFORM = [
  { label: '中重卡平台', value: 1 },
  { label: '轻卡平台', value: 2 },
]

/* 品牌 */
const BRAND = [
  { label: '汕德卡', value: 1 },
  { label: '豪沃', value: 2 },
  { label: '黄河', value: 3 },
]
/* 子品系 */
const CHILDREN_STRAIN = [
  { label: 'C9H', value: 1 },
  { label: 'G7S', value: 2 },
  { label: 'G7S', value: 3 },
]

/* 车辆用途 */
const USE_TO = [
  { label: '牵引', value: 1 },
  { label: '载货', value: 2 },
  { label: '自卸', value: 3 },
  { label: '搅拌', value: 4 },
]

const CHILD_TYPE_ENUM = {
  企业: [{ label: '平台', value: '平台' }],
  平台: [{ label: '品牌', value: '品牌' }],
  品牌: [
    { label: '品系', value: '品系' },
    { label: '子品系', value: '子品系' },
  ],
  品系: [{ label: '子品系', value: '子品系' }],
  子品系: [{ label: '车型子类', value: '车型子类' }],
}

const ADD_INTERNAL = {
  serialNumber: {
    required: true,
    message: '请输入系列编号',
    trigger: 'blur',
  },
  number: {
    required: true,
    message: '请输入内部车型号',
    trigger: 'blur',
  },
  certVehicleModel: {
    required: true,
    message: '请输入合格证车型号',
    trigger: 'blur',
  },
  brand: {
    required: true,
    message: '请选择品牌',
    trigger: 'blur',
  },
  salesCode: {
    required: true,
    message: '请选择销售代号',
    trigger: 'blur',
  },
  platform: {
    required: true,
    message: '请选择车辆类型',
    trigger: 'blur',
  },
  vehicleUse: {
    required: true,
    message: '请选择车辆用途',
    trigger: 'blur',
  },
  series: {
    required: true,
    message: '请选择品系',
    trigger: 'blur',
  },
  subseries: {
    required: true,
    message: '请选择子品系',
    trigger: 'blur',
  },
  driveForm: {
    required: true,
    message: '请选择驱动型式',
    trigger: 'blur',
  },
  emissionStd: {
    required: true,
    message: '请选择排放标准',
    trigger: 'blur',
  },
  fuelForm: {
    required: true,
    message: '请选择燃料型式',
    trigger: 'blur',
  },
  prodFactory: {
    required: true,
    message: '请选择生产单位',
    trigger: 'blur',
  },
  pattern: {
    required: true,
    message: '请选择版型',
    trigger: 'blur',
  },
  wheelBase: {
    required: true,
    message: '请输入轴距',
    trigger: 'blur',
  },
  totalWeight: {
    required: true,
    message: '请选择总质量',
    trigger: 'blur',
  },
  boxLength: {
    required: true,
    message: '请选择货架长度',
    trigger: 'blur',
  },
  volume: {
    required: true,
    message: '请选择容积',
    trigger: 'blur',
  },
  engineFactory: {
    required: true,
    message: '请选择发动机厂家',
    trigger: 'blur',
  },
  enginePower: {
    required: true,
    message: '请选择发动机功率',
    trigger: 'blur',
  },
  frontAxleNum: {
    required: true,
    message: '请输入前轴数量',
    trigger: 'blur',
  },
  frontWheelNum: {
    required: true,
    message: '请输入前轮数',
    trigger: 'blur',
  },
  rearWheelNum: {
    required: true,
    message: '请选择后轮数',
    trigger: 'blur',
  },
}

export { CAR_PLATFORM, BRAND, CHILDREN_STRAIN, USE_TO, CHILD_TYPE_ENUM, ADD_INTERNAL }
