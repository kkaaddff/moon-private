import { titleCase } from 'title-case'
import { pascalCase } from 'pascal-case'
import { clone, isEmpty, omit } from 'lodash'
import * as fse from 'fs-extra'
const pluginName = 'TransfromJsonFromYapiPlugin'

export class TransfromJsonFromYapiPlugin {
  apply(compilerHook) {
    /**
     * 处理 Yapi 导出 swaggerJson 中存在的信息不全的问题
     * - 缺失了 `definitions` ：默认使用空对象
     * - tags 下请求对象中缺少 operationId ： 根据 url 以及 method 补全
     * - path 下请求对象中缺少 description (描述服务的 controller )：
     */
    compilerHook.swagger2ApiGroup.tap(pluginName, transfromJson)

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
     */
    compilerHook.onResponseSchema.tap(pluginName, (responseSchema, context) => {
      if (responseSchema?.properties?.['YmmResult<Void>']) {
        responseSchema.properties = responseSchema.properties['YmmResult<Void>'].properties
      }
    })

    /**
     * 处理 Yapi 导出 swaggerJson 中存在的信息不全的问题
     * 从参数中收集 `definitions`
     */
    compilerHook.beforeDeclarationGen.tap(pluginName, (apiGroup) => {
      const { definitions } = apiGroup
      for (const key in definitions) {
        traverseDefinitionsProps(definitions[key], key, definitions)
      }

      fse.writeFile('./definitions.json', JSON.stringify(definitions))
    })
  }
}

//--------------------处理 swagger2ApiGroup--------------------------------------------
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
    const operationId = buildOperationId(path, method as TMethodType)
    request[method]['operationId'] = operationId
  }
}

function buildOperationId(path: string, method: TMethodType) {
  const lastPath = path.split('/').pop() ?? ''
  return `${lastPath}By${method}`
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

function traverseDefinitionsProps(propObj, key, definitions) {
  if (!propObj) {
    return
  }

  //------------------------字段数据类型 rename-----------------------------------
  if (propObj.type) {
    propObj.type = propObj.type.toLowerCase()
    if (JSON_SCHEMA_TYPES[propObj.type]) {
      propObj.type = JSON_SCHEMA_TYPES[propObj.type]
    }
  }
  //------------------------字段数据类型 rename-----------------------------------

  if (isEmpty(propObj.items)) {
    delete propObj.items
  } else {
    traverseDefinitionsProps(propObj.items, key, definitions)
  }

  if (propObj.properties) {
    for (const key in propObj.properties) {
      const propertiesItem = propObj.properties[key]
      traverseDefinitionsProps(propertiesItem, key, definitions)
      // 后序遍历，将复杂类型塞到 #/definitions/中去
      if (propertiesItem.type === 'object') {
        definitions[key] = propertiesItem
        propObj.properties[key] = {
          ...omit(propertiesItem, ['items', 'properties']),
          schema: {
            $ref: `#/definitions/${key}`,
          },
        }
      }
    }
  }
}

// function traverseDefinitionsProps(propObj) {
//   if (!propObj) {
//     return
//   }

//   if (isEmpty(propObj.items)) {
//     delete propObj.items
//   } else {
//     traverseDefinitionsProps(propObj.items)
//   }

//   if (propObj.type) {
//     propObj.type = JSON_SCHEMA_TYPES[propObj.type]
//       ? JSON_SCHEMA_TYPES[propObj.type]
//       : propObj.type.toLowerCase()
//   }

//   if (propObj?.properties) {
//     for (const key in propObj.properties) {
//       traverseDefinitionsProps(propObj.properties[key])
//     }
//   } else {
//     return
//   }
// }

//--------------------类型定义--------------------------------------------

type TMethodType = 'post' | 'get' | 'delete' | 'put'

type TRequestDetail = { operationId?: string; [k: string]: any }

type TRequest = {
  [k in TMethodType]: TRequestDetail
}
