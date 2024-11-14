import {
  getDesignCharacterValueEnum,
  getDesignCharacterClsEnum,
  getAllDesignCharacterList,
  getCharacterValueList,
  getMModuleList,
  getACModuleList,
  getACModuleTechCharasList,
  getACPartList,
  getDistinctDesignCharacterList,
  getDesignCharacterNameEnum,
} from '@/api/global'
export default function () {
  /* 获取技术特征值枚举接口 */
  const queryDesignCharacterValueEnum = async (oid, name = '') => {
    return getDesignCharacterValueEnum({ oid, name })
  }

  /* 特征分类枚举 */
  const queryDesignCharacterClsEnum = async (oid) => {
    return getDesignCharacterClsEnum({ oid })
  }
  /* 查询全局全部技术特征枚举接口 */
  const queryAllDesignCharacterList = async (oid) => {
    return getAllDesignCharacterList({ oid })
  }
  /* 4.2.38全局排重技术特征枚举接口 */
  const queryDistinctDesignCharacterList = async (oid) => {
    return getDistinctDesignCharacterList({ oid })
  }
  /* 查询特征值枚举接口 */
  const queryCharacterValueList = async (oid) => {
    return getCharacterValueList({ oid })
  }
  /* M模块枚举 */
  const queryMModuleList = async (oid) => {
    return getMModuleList({ oid })
  }
  /* AC模块枚举 */
  const queryACModuleList = async (oid) => {
    return getACModuleList({ oid })
  }
  /* AC技术特征枚举 */
  const queryACModuleTechCharasList = async (oid, name) => {
    return getACModuleTechCharasList({ oid, name })
  }
  /* AC实例枚举接口 */
  const queryACPartList = async (oid) => {
    return getACPartList({ oid })
  }
  /* 技术特征枚举 */
  const queryDesignCharacterNameEnum = async (oid) => {
    return getDesignCharacterNameEnum({ oid })
  }
  return {
    queryDesignCharacterValueEnum,
    queryDesignCharacterClsEnum,
    queryAllDesignCharacterList,
    queryCharacterValueList,
    queryMModuleList,
    queryACModuleList,
    queryACModuleTechCharasList,
    queryACPartList,
    queryDistinctDesignCharacterList,
    queryDesignCharacterNameEnum,
  }
}
