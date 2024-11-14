import { post } from '../utils/request'
export const getPlatformList = (params) => post('/Windchill/app/feature/getPlatformList', params) // 4.2.7查询平台列表接口
export const getSaleCharacterList = (params) =>
  post('/Windchill/app/feature/getSaleCharacterList', params) // 4.2.9.特征管理-查询配置特征列表接口
export const getSaleCharacterDetail = (params) =>
  post('/Windchill/app/feature/getSaleCharacterDetail', params) // 4.2.9.特征管理-固化特征详情
export const getDesignCharacterList = (params) =>
  post('/Windchill/app/feature/getDesignCharacterList', params) // 4.2.13.特征管理-查询技术特征列表接口
export const createSaleCharacter = (params) =>
  post('/Windchill/app/feature/createSaleCharacter', { ...params, showDialog: true }) // 4.2.11.特征管理-新建配置特征接口
export const updateSaleCharacter = (params) =>
  post('/Windchill/app/feature/updateSaleCharacter', { ...params, showDialog: true }) // 4.2.11.特征管理-更新配置特征接口
export const getSaleCharacterDetailV2 = (params) =>
  post('/Windchill/app/feature/getSaleCharacterDetailV2', params) // 4.2.17.特征管理-查询技术特征详细信息接口
export const createDesignCharacter = (params) =>
  post('/Windchill/app/feature/createDesignCharacter', { ...params, showDialog: true }) // 4.2.18.特征管理-新建技术特征接口
export const updateDesignCharacter = (params) =>
  post('/Windchill/app/feature/updateDesignCharacter', { ...params, showDialog: true }) // 4.2.19.特征管理-更新技术特征接口
export const reverseACModels = (params) => post('/Windchill/app/feature/reverseACModels', params) // 4.2.20.特征管理-通用技术特征逆查（AC模板）接口
export const reverseModelLogicalRules = (params) =>
  post('/Windchill/app/feature/reverseModelLogicalRules', params) // 4.2.21.特征管理-平台级别技术特征逆查（车型子类逻辑工具）接口
export const reversePlatformLogicalRules = (params) =>
  post('/Windchill/app/feature/reversePlatformLogicalRules', params) // 4.2.22.特征管理-平台级别技术特征逆查（M模块逻辑工具）接口
export const reverseSaleDesignMapRules = (params) =>
  post('/Windchill/app/feature/reverseSaleDesignMapRules', params) // 4.2.23平台级别技术特征逆查（配置特征映射）接口

export const getSaleDesignMapRuleList = (params) =>
  post('/Windchill/app/feature/getSaleDesignMapRuleList', params) // 4.2.24.特征管理-查询全局配置特征映射列表接口
export const createSaleDesignMapRule = (params) =>
  post('/Windchill/app/feature/createSaleDesignMapRule', { ...params, showDialog: true }) //4.2.31.特征管理-新建全局配置特征映射接口
export const updateSaleDesignMapRule = (params) =>
  post('/Windchill/app/feature/updateSaleDesignMapRule', { ...params, showDialog: true }) //4.2.31.特征管理-更新全局配置特征映射接口
export const createLogicalRule = (params) =>
  post('/Windchill/app/feature/createLogicalRule', { ...params, showDialog: true }) //4.2.40新建全局匹配/计算公式接口
export const updateLogicalRule = (params) =>
  post('/Windchill/app/feature/updateLogicalRule', { ...params, showDialog: true }) //4.2.42更新匹配/计算公式接口
export const createLocalLogicalRule = (params) =>
  post('/Windchill/app/feature/createLocalLogicalRule', { ...params, showDialog: true }) //4.2.41新建局部匹配/计算公式接口
export const createACModuleExcludeRule = (params) =>
  post('/Windchill/app/feature/createACModuleExcludeRule', { ...params, showDialog: true }) //4.2.47新建AC模块排除规则接口
export const updateACModuleExcludeRule = (params) =>
  post('/Windchill/app/feature/updateACModuleExcludeRule', { ...params, showDialog: true }) //4.2.47更新AC模块排除规则接口
export const getACModuleDesignCharacterList = (params) =>
  post('/Windchill/app/feature/getACModuleDesignCharacterList', params) //4.2.49查询AC模块订单/逻辑工具技术特征枚举接口（未对接）
export const deleteConditionRule = (params) =>
  post('/Windchill/app/feature/deleteConditionRule', params) // 4.2.34.特征管理-删除条件规则接口
export const getSaleDesignMapRuleDetail = (params) =>
  post('/Windchill/app/feature/getSaleDesignMapRuleDetail', params) // 4.2.26.特征管理-查询配置特征映射详细信息接口
export const getLogicalRuleDetail = (params) =>
  post('/Windchill/app/feature/getLogicalRuleDetail', params) // 4.2.35.特征管理-查询匹配/计算详细信息接口
export const getACModuleExcludeRuleList = (params) =>
  post('/Windchill/app/feature/getACModuleExcludeRuleList', params) // 特征管理-查询AC模块排除规则列表接口
export const getACModuleExcludeRuleDetail = (params) =>
  post('/Windchill/app/feature/getACModuleExcludeRuleDetail', params) // 特征管理-查询AC模块排除规则详细信息接口
export const expressionComplianceCheck = (params) =>
  post('/Windchill/app/feature/expressionComplianceCheck', params) // 特征管理-条件表达式合规校验
export const getUserList = (params) => post('/Windchill/app/feature/getUserList', params) // 用户列表
export const getOrderDesignCharacterList = (params) =>
  post('/Windchill/app/feature/getOrderDesignCharacterList', params) // 4.2.29查询全局订单技术特征枚举接口
export const globalTeachFeatureList = (params) =>
  post('/Windchill/app/feature/globalTeachFeatureList', params) // 特征管理-全局逻辑条件特征
export const getPlatformACModuleList = (params) =>
  post('/Windchill/app/config/getPlatformACModuleList', params) // 特征管理-全局逻辑获取所属模块
export const createDesignCharacterV2 = (params) =>
  post('/Windchill/app/feature/createDesignCharacterV2', params, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }) // 上传附件
export const updateDesignCharacterV2 = (params) =>
  post('/Windchill/app/feature/updateDesignCharacterV2', params, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }) // 更新附件
