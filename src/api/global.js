import axios from 'axios'
import { post } from '../utils/request'
export const getGlobalConfigFeatureList = (params) =>
  post('/Windchill/app/feature/getGlobalConfigFeatureList', params) //4.2.27.特征管理-查询全局排重配置特征枚举接口
export const getDesignCharacterNameEnum = (params) =>
  post('/Windchill/app/feature/getDesignCharacterNameEnum', params) //4.2.15.特征管理-查询技术特征枚举
export const getDesignCharacterValueEnum = (params) =>
  post('/Windchill/app/feature/getDesignCharacterValueEnum', params) //4.2.15.特征管理-查询技术特征值枚举接口
export const getDesignCharacterClsEnum = (params) =>
  post('/Windchill/app/feature/getDesignCharacterClsEnum', params) //4.2.16.特征管理-查询技术特征分类枚举接口
export const getAllDesignCharacterList = (params) =>
  post('/Windchill/app/feature/getAllDesignCharacterList', params) //4.2.28.特征管理-查询全局全部技术特征枚举接口
export const getDistinctDesignCharacterList = (params) =>
  post('/Windchill/app/feature/getDistinctDesignCharacterList', params) //4.2.38全局排重技术特征枚举接口

export const getCharacterValueList = (params) =>
  post('/Windchill/app/feature/getCharacterValueList', params) //4.2.29.特征管理-查询特征值枚举接口
export const getMModuleList = (params) => post('/Windchill/app/feature/getMModuleList', params) //4.2.37.特征管理-查询M模块枚举接口
export const getACModuleList = (params) => post('/Windchill/app/feature/getACModuleList', params) // 4.2.43.特征管理-查询AC模块枚举接口（0.49版本新增）
export const configGetACModuleList = (params) =>
  post('/Windchill/app/config/getACModuleList', params) // 4.2.43.配置特征-查询AC模块枚举接
export const getACModuleTechCharasList = (params) =>
  post('/Windchill/app/feature/getACModuleTechCharasList', params) // 4.2.44.特征管理-查询AC模块技术特征枚举接口（0.49版本新增）
export const createFReviewDoc = (params) =>
  post('/Windchill/app/feature/createFReviewDoc', { ...params, showDialog: true }) // 4.2.8.特征管理-创建配置审签单接口
export const getACPartList = (params) =>
  post('/Windchill/app/config/getTableMappingACPartList', params) // 4.2.74.配置管理-查询AC实例枚举接口
export const mutexRuleConditionFeature = (params) =>
  post('/Windchill/app/config/mutexRuleConditionFeature', params) // 同选规则选择条件特征
export const mutexRuleConditionFeatureValueCombo = (params) =>
  post('/Windchill/app/config/mutexRuleConditionFeatureValueCombo', params) // 同选规则选择结果特征
