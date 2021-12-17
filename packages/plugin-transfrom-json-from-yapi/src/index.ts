import { titleCase } from 'title-case'
import { clone, isEmpty, upperFirst } from 'lodash'
const pluginName = 'TransfromJsonFromYapiPlugin'

export class TransfromJsonFromYapiPlugin {
  private type: 'YmmMaven' | 'manual' | null
  private customMethod: (path: string, method: string) => string | null

  constructor(config: {
    type?: TransfromJsonFromYapiPlugin['type']
    customName?: TransfromJsonFromYapiPlugin['customMethod']
  }) {
    this.type = config.type ?? 'YmmMaven'
    this.customMethod = config.customName ?? null
  }

  apply(compilerHook) {
    /**
     * 处理 Yapi 导出 swaggerJson 中存在的信息不全的问题
     * - 缺失了 `definitions` ：默认使用空对象
     * - tags 下请求对象中缺少 operationId ： 根据 url 以及 method 补全
     * - path 下请求对象中缺少 description (描述服务的 controller )：
     */
    compilerHook.swagger2ApiGroup.tap(pluginName, this.transfromJson)

    /**
     * 处理 Yapi 导出 swaggerJson 中存在的信息不全的问题
     * * 将入参析构一层 解决 Yapi 参数默认包裹在 root：
     */
    compilerHook.onRequestParam.tap(pluginName, (apiItem, context) => {
      const requestParams = apiItem.requestParam
      let destructRequestParam = []

      requestParams?.forEach((param) => {
        if (param.ast.name === 'root') {
          const tempSchema = param.ast.schema

          for (const key in tempSchema.properties) {
            const newParam = clone(param)
            const schemaElement = tempSchema.properties[key]
            newParam.ast = {
              in: param.ast.in,
              name: key,
              schema: schemaElement,
            }
            destructRequestParam.push(newParam)
          }
        } else {
          // InBody InQuery 等不同属性的 params 在 requestParams 中的位置也不同
          destructRequestParam.push(param)
        }
      })

      if (destructRequestParam.length) {
        apiItem.requestParam = destructRequestParam
      }
      return requestParams
    })

    /**
     * 处理 Yapi 导出 swaggerJson 中存在的信息不全的问题
     * * 将出参析构一层 解决 Yapi 参数默认包裹在 root：
     * ! 区分 手动维护的 swagger 和 插件 自动生成的 yapi
     */
    compilerHook.onResponseSchema.tap(pluginName, (responseSchema, context) => {
      const result = this.type === 'manual' ? 'data' : 'YmmResult<Void>'
      if (responseSchema?.properties?.[result]) {
        if (responseSchema?.properties?.[result].type === 'array') {
          responseSchema.items = responseSchema.properties[result].items
          responseSchema.type = 'array'

          delete responseSchema.properties
        } else {
          responseSchema.properties = responseSchema.properties[result].properties
        }
      }
    })

    /**
     * 处理 Yapi 导出 swaggerJson 中存在的信息不全的问题
     * 从参数中收集 `definitions`
     */
    compilerHook.beforeDeclarationGen.tap(pluginName, (apiGroup) => {
      const { definitions } = apiGroup
      for (const key in definitions) {
        // TODO： definitions 拆分出更多的类型
        //  traverseDefinitionsProps(definitions[key], key, definitions)
        traverseDefinitionsProps(definitions[key])
      }
    })
  }

  //--------------------处理 swagger2ApiGroup--------------------------------------------
  transfromJson(context) {
    const { swaggerJson } = context
    const { paths } = swaggerJson

    swaggerJson.definitions = swaggerJson?.definitions ?? {}

    swaggerJson.tags = this.addDefinition2Tag(swaggerJson.tags)

    for (const pathKey in paths) {
      this.addOperationId(paths[pathKey], pathKey)
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
  addDefinition2Tag(tags: Array<{ name: string; description?: string }> = []) {
    tags.forEach((tag) => {
      tag.description = titleCase(
        tag.description ??
          tag.name
            .match(/\([a-zA-Z| |0-9]*\)/g)
            .pop()
            .replace(/\(|\)/g, '')
      )
    })
    return tags
  }

  addOperationId(request: TRequest, path: string) {
    for (const method in request) {
      const operationId = this.customMethod
        ? this.customMethod(path, method)
        : this.buildOperationId(path, method as TMethodType)
      request[method]['operationId'] = operationId
    }
  }

  buildOperationId(path: string, method: TMethodType) {
    const lastPath = path.split('/').pop() ?? ''
    return `${method}${upperFirst(lastPath)}`
  }
}

//--------------------处理 definitions 修改--------------------------------------------

/**
 * 递归遍历 definitions 处理 Yapi 中定义的 json-schema 不符合 json-schema-to-typescript 规范的问题
 * https://www.npmjs.com/package/json-schema-to-typescript
 * @param propObj definitions prop
 * @returns
 */
const JSON_SCHEMA_TYPES = {
  long: 'number',
  int: 'number',
  void: 'null',
}

function traverseDefinitionsProps(propObj) {
  if (!propObj) {
    return
  }

  if (isEmpty(propObj.items)) {
    delete propObj.items
  } else {
    traverseDefinitionsProps(propObj.items)
  }

  if (propObj.type) {
    propObj.type = JSON_SCHEMA_TYPES[propObj.type]
      ? JSON_SCHEMA_TYPES[propObj.type]
      : propObj.type.toLowerCase()
  }

  if (propObj?.properties) {
    for (const key in propObj.properties) {
      traverseDefinitionsProps(propObj.properties[key])
    }
  } else {
    return
  }
}

//--------------------类型定义--------------------------------------------

type TMethodType = 'post' | 'get' | 'delete' | 'put'

type TRequestDetail = { operationId?: string; [k: string]: any }

type TRequest = {
  [k in TMethodType]: TRequestDetail
}
