import { post, get } from '../utils/request'
export const getBaseStructure = (params) => post('/Windchill/app/product/getBaseStructure', params)
export const createTreeNode = (params) =>
  post('/Windchill/app/product/createTreeNode', { ...params, showDialog: true })
export const modifyTreeNode = (params) => post('/Windchill/app/product/modifyTreeNode', params)
export const getVehicleTypeList = (params) =>
  post('/Windchill/app/product/getVehicleTypeList', params) // 车类子型列表
export const getInternalVehicleModelList = (params) =>
  post('/Windchill/app/product/getInternalVehicleModelList', params) // 内部车型号列表
export const getVehicleTypeDetail = (params) =>
  post('/Windchill/app/product/getVehicleTypeDetail', params) // 车型子类详情
export const deleteVehicleType = (params) =>
  post('/Windchill/app/product/deleteVehicleType', params) // 删除车型子类
export const deleteTreeNode = (params) => post('/Windchill/app/product/deleteTreeNode', params) // 4.2.6.产品管理-删除型谱结构树节点接口
export const createVehicleType = (params) =>
  post('/Windchill/app/product/createVehicleType', { ...params, showDialog: true }) // 4.2.52新建车型子类接口
export const updateVehicleType = (params) =>
  post('/Windchill/app/product/updateVehicleType', { ...params, showDialog: true }) // 4.2.52更新车型子类接口
export const getInternalVehicleModelDetail = (params) =>
  post('/Windchill/app/product/getInternalVehicleModelDetail', params) // 4.2.60.产品管理-查询内部车型号详细信息接口（0.50版本调整）（0.53版本调整）
export const createInternalVehicleModel = (params) =>
  post('/Windchill/app/product/createInternalVehicleModel', { ...params, showDialog: true }) // 4.2.58.产品管理-新建内部车型号接口（0.50版本调整）
export const updateInternalVehicleModel = (params) =>
  post('/Windchill/app/product/updateInternalVehicleModel', { ...params, showDialog: true }) // 4.2.58.产品管理-更新内部车型号接口（0.50版本调整）
export const deleteInternalVehicleModel = (params) =>
  post('/Windchill/app/product/deleteInternalVehicleModel', params) // 4.2.58.产品管理-删除内部车型号接口（0.50版本调整）
export const createBatchFReviewDoc = (params) =>
  post('/Windchill/app/feature/createBatchFReviewDoc', { ...params, showDialog: true }) // 特征管理-创建配置批量审签单接口（0.60版本新增
export const getCurrentUserInfo = (params) =>
  post('/Windchill/app/product/getCurrentUserInfo', params) // 获取当前登录用户信息
export const searchConfigUserInfoList = (params) =>
  post('/Windchill/app/product/searchConfigUserInfoList', params) // 获取参与成员
