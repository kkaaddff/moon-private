const pluginName = 'TransfromJsonFromYapiPlugin'

/**
 * 处理 Yapi 导出 swaggerJson 中存在的信息不全的问题
 * - 缺失了 `definitions` ：默认使用空对象
 * - tags 下请求对象中缺少 operationId ： 根据 url 以及 method 补全
 * - path 下请求对象中缺少 description (描述服务的 controller )：
 */
export class TransfromJsonFromYapiPlugin {
  apply(compilerHook) {
    compilerHook.swagger2ApiGroup.tap(pluginName, (context) => {
      const { swaggerJson } = context
      const { paths } = swaggerJson

      swaggerJson.definitions = swaggerJson?.definitions ?? {}
      for (const pathKey in paths) {
        addOperationId(paths[pathKey], pathKey)
      }
    })
  }
}

function addOperationId(request: TRequest, path: string) {
  for (const method in request) {
    const operationId = buildOperationId(path, method as TMethod)
    request[method]['operationId'] = operationId
  }
}

function buildOperationId(path: string, method: TMethod) {
  const lastPath = path.split('/').pop() ?? ''
  return `${lastPath}By${method}`
}
type TMethod = 'post' | 'get' | 'delete' | 'put'

type TRequestDetail = { operationId?: string; [k: string]: any }

type TRequest = {
  [k in TMethod]: TRequestDetail
}
