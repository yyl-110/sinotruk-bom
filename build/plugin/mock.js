import { viteMockServe } from 'vite-plugin-mock'

export function configMockPlugin(isBuild) {
  return viteMockServe({
    mockPath: 'mock/api',
    localEnabled: !isBuild,
    prodEnabled: isBuild,
    injectCode: `
      import { setupProdMockServer } from '../mock';
      setupProdMockServer();
    `,
    logger: true, //是否在控制台显示请求日志
  })
}
