import Mock from 'mockjs'

import product from './product'
import global from './global'
import feature from './feature'
import config from './config'
const apiArr = [...product, ...config, ...feature, ...global]

for (const i of apiArr) {
  Mock.mock(new RegExp(i.url), i.method || 'get', i.response)
}

export default apiArr
