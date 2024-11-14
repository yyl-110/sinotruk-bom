import { get, post } from '../utils/request'
export const getLogicalRuleList = (params) =>
  post('/Windchill/app/feature/getLogicalRuleList', params)
export const getVehicleTypeOptionSet = (params) =>
  post('/Windchill/app/config/getVehicleTypeOptionSet', params) // 4.2.61.配置管理-查询车型子类型谱规划信息接口
export const getVehicleTypeEditOptionSet = (params) =>
  post('/Windchill/app/config/getVehicleTypeEditOptionSet', params) // 4.2.60.配置管理-查询车型子类编辑特征页面信息接口
export const getVehicleTypeEditOptionSetValue = (params) =>
  post('/Windchill/app/config/getVehicleTypeEditOptionSetValue', params) // 4.2.61.配置管理-查询车型子类编辑特征值页面信息接口
export const updateVehicleTypeOptionSet = (params) =>
  post('/Windchill/app/config/updateVehicleTypeOptionSet', { ...params, showDialog: true }) // 4.2.64.配置管理-更新车型子类特征配置接口
export const updateVehicleTypeOptionSetValue = (params) =>
  post('/Windchill/app/config/updateVehicleTypeOptionSetValue', { ...params, showDialog: true }) // 4.2.64.配置管理-更新车型子类特征值接口

export const getACPartMapRuleList = (params) =>
  post('/Windchill/app/config/getACPartMapRuleList', params) // 4.2.69.配置管理-查询表号映射列表接口
export const getACPartMapRuleDetail = (params) =>
  post('/Windchill/app/config/getACPartMapRuleDetail', params) // 4.2.70.配置管理-查询表号映射详细信息接口
export const getTechParamConfigCharacterList = (params) =>
  post('/Windchill/app/config/getTechParamConfigCharacterList', params) //4.2.75.配置管理-查询技术参数配置特征清单接口
export const getTechParamMappingCharacterList = (params) =>
  post('/Windchill/app/config/getTechParamMappingCharacterList', params) //4.2.76.配置管理-查询技术参数映射特征清单接口
export const getFeatureLocalSaleDesignMapRuleList = (params) =>
  post('/Windchill/app/feature/getLocalSaleDesignMapRuleList', params) //4.2.76.4.2.25.特征管理-查询局部配置特征映射列表接口
export const getConfigCode = (params) => post('/Windchill/app/config/getConfigCode', params) //4.2.80.配置管理-获取配置号搜索条件接口
export const getConfigCodeList = (params) => post('/Windchill/app/config/getConfigCodeList', params) //4.2.81.配置管理-查询配置号列表接口
export const getInternalVehicleModelTechConfig = (params) =>
  post('/Windchill/app/config/getInternalVehicleModelTechConfig', params) //4.2.80.配置管理-查询内部车型号技术配置信息接口
export const getLocalLogicalRuleList = (params) =>
  post('/Windchill/app/feature/getLocalLogicalRuleList', params) //4.2.36.特征管理-查询局部匹配/计算公式列表接口
export const startSourceDetectionWF = (params) =>
  post('/Windchill/app/config/startSourceDetectionWF', params) //4.2.91.配置管理-启动资源探查流程接口
export const setConfigCodeMainRecom = (params) =>
  post('/Windchill/app/config/setConfigCodeMainRecom', params) //4.2.90.配置管理-设置配置号是否主推接口
export const getIncludeExcludeRuleList = (params) =>
  post('/Windchill/app/config/getIncludeExcludeRuleList', params) //4.2.82.配置管理-查询内部车型号同选/互斥规则列表接口
export const getIncludeExcludeRuleDetail = (params) =>
  post('/Windchill/app/config/getIncludeExcludeRuleDetail', params) //4.2.83.配置管理-查询同选/互斥规则详细信息接口
export const startEnableConfigCodeWF = (params) =>
  post('/Windchill/app/config/startEnableConfigCodeWF', { ...params, showDialog: true }) //4.2.91.配置管理-启动配置号启用流程接口
export const startDisableConfigCodeWF = (params) =>
  post('/Windchill/app/config/startDisableConfigCodeWF', { ...params, showDialog: true }) //4.2.91.配置管理-启动配置号启用流程接口
export const getConfigCodeAttributesInfo = (params) =>
  post('/Windchill/app/config/getConfigCodeAttributesInfo', params) //4.2.95.配置管理-查询配置号属性信息接口
export const updateConfigCodeAttributes = (params) =>
  post('/Windchill/app/config/updateConfigCodeAttributes', { ...params, showDialog: true }) //4.2.97.产品管理-更新配置号属性接口
export const getConfigCodeDetailInfo = (params) =>
  post('/Windchill/app/config/getConfigCodeDetailInfo', params) //4.2.96.配置管理-查询配置号明细接口
export const getVehicleTypeSourceDetectionTree = (params) =>
  post('/Windchill/app/config/getVehicleTypeSourceDetectionTree', params) //44.2.98.配置管理-查询车型子类超级BOM探测结果
export const getConfigCodeSourceDetectionTree = (params) =>
  post('/Windchill/app/config/getConfigCodeSourceDetectionTree', params) //4.2.99.配置管理-查询配置号超级BOM探测结果
export const getUnclosedCharacterValueList = (params) =>
  post('/Windchill/app/config/getUnclosedCharacterValueList', params) //配置管理-查询未封闭特征值列表接口
export const getMultiSourceCharacterList = (params) =>
  post('/Windchill/app/config/getMultiSourceCharacterList', params) //4.2.67.配置管理-查询非唯一来源技术特征列表接口
export const configReversePlatformLogicalRules = (params) =>
  post('/Windchill/app/config/reversePlatformLogicalRules', params) //4.2.69.配置管理-车型子类级别技术特征逆查（M模块逻辑工具）接口
export const configReverseModelLogicalRules = (params) =>
  post('/Windchill/app/config/reverseModelLogicalRules', params) //4.2.68.配置管理-车型子类级别技术特征逆查（车型子类逻辑工具）接口
export const getConfigVehicleQty = (params) =>
  post('/Windchill/app/config/getConfigVehicleQty', params) //4.2.86.配置管理-可配车辆数量计算接口
export const getExplodeConfigCode = (params) =>
  post('/Windchill/app/config/getExplodeConfigCode', {
    ...params,
    isSkipError: true,
    showDialog: true,
  }) //4.2.87.配置管理-炸配置号接口
export const updateInternalVehicleModelTechConfig = (params) =>
  post('/Windchill/app/config/updateInternalVehicleModelTechConfig', {
    ...params,
    showDialog: true,
  }) //4.2.81.配置管理-更新内部车型号技术配置信息接口
export const updateIncludeExcludeRule = (params) =>
  post('/Windchill/app/config/updateIncludeExcludeRule', { ...params, showDialog: true }) //4.2.84.配置管理-更新同选/互斥规则接口
export const createIncludeExcludeRule = (params) =>
  post('/Windchill/app/config/createIncludeExcludeRule', { ...params, showDialog: true }) //4.2.84.配置管理-新建同选/互斥规则接口
export const getACModelCharacterInfo = (params) =>
  post('/Windchill/app/config/getACModelCharacterInfo', { ...params }) //4.2.100.配置管理-查询AC实例特征详情接口
export const getACModelEnterList = (params) =>
  post('/Windchill/app/config/getACModelEnterList', { ...params }) //4.2.101.配置管理-查询AC实例录入列表接口
export const getACModelACPart = (params) =>
  post('/Windchill/app/config/getACModelACPart', { ...params, showDialog: true }) //4.2.102.配置管理-查询AC实例录入列表接口
export const insertACPart = (params) => post('/Windchill/app/config/insertACPart', { ...params }) //4.2.103.配置管理-插入AC实例接口
export const createLocalSaleDesignMapRule = (params) =>
  post('/Windchill/app/feature/createLocalSaleDesignMapRule', { ...params, showDialog: true }) //4.2.32新建局部配置特征映射接口
export const createACPartMapRule = (params) =>
  post('/Windchill/app/config/createACPartMapRule', { ...params, showDialog: true }) //4.2.73.配置管理-新建表号映射接口
export const updateACPartMapRule = (params) =>
  post('/Windchill/app/config/updateACPartMapRule', { ...params, showDialog: true }) //4.2.73.配置管理-更新表号映射接口
export const getACTaskByJSONParas = (params) =>
  post('/Windchill/app/config/getACTaskByJSONParas', { ...params }) //4.2.93查询配置号AC任务（JSON格式接口）
export const getACTaskByParas = (params) =>
  post('/Windchill/app/config/getACTaskByParas', { ...params }) //4.2.94查询配置号AC任务（参数格式接口）
export const updateOptionFixedRule = (params) =>
  post('/Windchill/app/config/updateOptionFixedRule', { ...params, showDialog: true }) //4.2.78.配置管理-更新技术参数配置特征固化映射接口
export const createDisableConfigCodeApply = (params) =>
  post('/Windchill/app/config/createDisableConfigCodeApply', { ...params, showDialog: true }) //4.2.107.配置管理-创建配置号停用申请接口（0.63版本新增）
export const getEffConfigCodeList = (params) =>
  post('/Windchill/app/config/getEffConfigCodeList', { ...params }) //4.2.106.配置管理- 查询内部车型号有效配置号枚举接口（0.63版本新增）
export const getConfigCodeUnReleasedOptions = (params) =>
  post('/Windchill/app/config/getConfigCodeUnReleasedOptions', { ...params }) //4.2.108.配置管理-查询配置号待发布选装特征接口（0.63版本新增）
export const manualReleaseConfigCode = (params) =>
  post('/Windchill/app/config/manualReleaseConfigCode', { ...params }) //4.2.108.配置管理-查询配置号待发布选装特征接口（0.63版本新增）
export const getConfigCodeAuditOrgList = (params) =>
  post('/Windchill/app/config/getConfigCodeAuditOrgList', { ...params }) //4.2.105.配置管理-查询配置号审批单位枚举接口（0.63版本新增）
export const updateACModuleOwner = (params) =>
  post('/Windchill/app/config/updateACModuleOwner', { ...params, showDialog: true }) //4.2.110.配置管理-设置AC模块项目组人员接口（0.64版本新增）
export const preSourceDetection = (params) =>
  post('/Windchill/app/config/preSourceDetection', { ...params, showDialog: true }) //虚拟探查
export const configReverseSaleDesignMapRules = (params) =>
  post('/Windchill/app/config/reverseSaleDesignMapRules', { ...params }) //4.2.71车型子类级别技术特征逆查（配置特征映射）接口

export const getPackageCodeList = (params) =>
  post('/Windchill/app/config/getPackageCodeList', { ...params }) //4.2.91.配置管理-查询套餐号列表接口（0.65版本新增）
export const reverseAcModelLogicalRules = (params) =>
  post('/Windchill/app/config/reverseAcModelLogicalRules', { ...params }) //技术特征来源唯一性检查AC模块逆查调用接口
export const deleteNonePushConfigCode = (params) =>
  post('/Windchill/app/config/deleteNonePushConfigCode', { ...params }) //配置管理清除已推送
export const localLogicFormulaConditionFeature = (params) =>
  post('/Windchill/app/config/localLogicFormulaConditionFeature', { ...params }) //配置管理匹配公式/计算公式->条件特征
export const localLogicFormulaResultFeature = (params) =>
  post('/Windchill/app/config/localLogicFormulaResultFeature', { ...params }) //配置管理->匹配公式/计算公式->结果特征
export const getPkCodeSourceDetectionTree = (params) =>
  post('/Windchill/app/config/getPkCodeSourceDetectionTree', { ...params }) //配置管理->配置号下的套餐查看资源探查结果
export const getMappingRuleFeatureListForSpecial = (params) =>
  post('/Windchill/app/config/getMappingRuleFeatureListForSpecial', { ...params }) //特殊车型配置特征下拉调用接口
export const getTableMappingDesignCharacterList = (params) =>
  post('/Windchill/app/config/getTableMappingDesignCharacterList', { ...params }) //特殊车型技术特征下拉调用接口
export const getMappingRuleFeatureValuesForSpecial = (params) =>
  post('/Windchill/app/config/getMappingRuleFeatureValuesForSpecial', { ...params }) //型谱策划的对应销售特征值
export const checkTypeSpectrum = (params) =>
  post('/Windchill/app/config/checkTypeSpectrum', { ...params, showDialog: true }) // 型谱封闭检查
export const getAcTaskList = (params) => post('/Windchill/app/config/getAcTaskList', { ...params }) // 下任务列表接口
export const getAcTaskForDepartManager = (params) =>
  post('/Windchill/app/config/getAcTaskForDepartManager', { ...params }) // 配置号负责人AC任务列表请求接口
export const getAcTaskForDesignHead = (params) =>
  post('/Windchill/app/config/getAcTaskForDesignHead', { ...params }) // 基于设计部门负责人查看设置设计责任人列表
export const getCurrentObjState = (params) =>
  post('/Windchill/app/config/getCurrentObjState', { ...params }) // 获取当前车型子类的状态信息
export const setDesignHeadAndDistributeTask = (params) =>
  post('/Windchill/app/config/setDesignHeadAndDistributeTask', { ...params, showDialog: true }) // 设置AC设计责任人并下发任务接口
export const saveDesignHeadAndDistributeTask = (params) =>
  post('/Windchill/app/config/saveDesignHeadAndDistributeTask', { ...params, showDialog: true }) // 设置AC设计责任人
export const distributeAcTaskList = (params) =>
  post('/Windchill/app/config/distributeAcTaskList', { ...params, showDialog: true }) // 确认下任务
export const specialVehicleCloseCheck = (params) =>
  post('/Windchill/app/config/specialVehicleCloseCheck', { ...params, showDialog: true }) // 表号映射管理-表号封闭检查调用接口
export const setDepartmentManagerAndDistributeTask = (params) =>
  post('/Windchill/app/config/setDepartmentManagerAndDistributeTask', {
    ...params,
    showDialog: true,
  }) // 配置号负责人AC任务点击确认
export const specialVehicleSourceDetection = (params) =>
  post('/Windchill/app/config/specialVehicleSourceDetection', {
    ...params,
    showDialog: true,
  }) // 特殊车型配置号管理界面的资源探查调用接口
export const setSpecialAcModuleInfo = (params) =>
  post('/Windchill/app/config/setSpecialAcModuleInfo', { ...params, showDialog: true }) // 特殊车型
export const tableMappingAcModuleNameEnum = (params) =>
  post('/Windchill/app/config/tableMappingAcModuleNameEnum', { ...params }) // 表号映射规则选择AC模块下拉值
export const getACPartList = (params) =>
  post('/Windchill/app/config/getTableMappingACPartList', { ...params }) // 表号映射AC模块选择后需要请求对应的下拉条件值
export const getPushConfigCodeList = (params) =>
  post('/Windchill/app/config/getPushConfigCodeList', { ...params }) // 配置号手动推送
export const manualPushStartConfigCode = (params) =>
  post('/Windchill/app/config/manualPushStartConfigCode', { ...params, showDialog: true }) // 配置号手动推送确认
export const getCouldCopyVehicleType = (params) =>
  post('/Windchill/app/config/getCouldCopyVehicleType', { ...params }) // 编辑新增车型子类- 复制车型子类枚举
export const exportBomData = (params) => post('/Windchill/app/config/exportBomData', { ...params }) // 导出超级bom
export const addSamePosFeatureAcPart = (params) =>
  post('/Windchill/app/config/addSamePosFeatureAcPart', { ...params }) // 更改AC实例录入
export const checkGeneratePartNumber = (params) =>
  post('/Windchill/app/config/checkGeneratePartNumber', { ...params }) // 校验系统中是否存在该分类配置的编号规则
