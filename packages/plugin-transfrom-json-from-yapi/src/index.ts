import { titleCase } from 'title-case'
const pluginName = 'TransfromJsonFromYapiPlugin'

/**
 * 处理 Yapi 导出 swaggerJson 中存在的信息不全的问题
 * - 缺失了 `definitions` ：默认使用空对象
 * - tags 下请求对象中缺少 operationId ： 根据 url 以及 method 补全
 * - path 下请求对象中缺少 description (描述服务的 controller )：
 */
export class TransfromJsonFromYapiPlugin {
  apply(compilerHook) {
    compilerHook.swagger2ApiGroup.tap(pluginName, transfromJson)
  }
}

export function transfromJson(context) {
  const { swaggerJson } = context
  const { paths } = swaggerJson

  swaggerJson.definitions = swaggerJson?.definitions ?? {}

  swaggerJson.tags = addDefinition2Tag(swaggerJson.tags)

  for (const pathKey in paths) {
    addOperationId(paths[pathKey], pathKey)
  }
}
/**
 * 处理 `tags` 下只有 `name` 的情况。
 * 从 `name` 中提取英文作为服务名称
 * 1. 匹配括号中的英文加数字
 * 2. 从匹配数组中取最后一个
 * 3. 替换掉括号（）
 * @param tags
 * @returns
 */
function addDefinition2Tag(tags: Array<{ name: string; description?: string }> = []) {
  tags.forEach((tag) => {
    tag.description =
      tag.description ??
      titleCase(
        tag.name
          .match(/\([a-zA-Z| |0-9]*\)/g)
          .pop()
          .replace(/\(|\)/g, '')
      )
  })
  return tags
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
