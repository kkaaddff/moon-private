// @ts-nocheck
/**
 * @desc
 *
 * @使用场景
 *
 * @Date    2019/6/5
 **/

import * as jsf from 'json-schema-faker'
import * as _ from 'lodash'

//参考文档:
//https://json-schema-faker.js.org/#gist/d9e27543d84157c1672f87e93ac250cc
//https://github.com/json-schema-faker/json-schema-faker/tree/master/docs

jsf.option('alwaysFakeOptionals', true)
jsf.option('ignoreMissingRefs', true)
jsf.option('failOnInvalidTypes', false)
jsf.option('failOnInvalidFormat', false)
jsf.extend('faker', () => require('faker'))

/**
 * @param jsonSchema
 * @param {{}} definitions
 */
export async function genrateFakeData(
  jsonSchema: any,
  definitions: { [name: string]: any } = {},
  lang: TLanguage
): Promise<object> {
  const faker = jsf.locate('faker')

  if (lang !== 'en') {
    faker.locale = lang
  }

  if (jsonSchema.$ref && definitions[jsonSchema.$ref.replace('#/definitions/', '')]) {
    jsonSchema = definitions[jsonSchema.$ref.replace('#/definitions/', '')]
  }

  let toDealJsonSchema = _.cloneDeep(jsonSchema)
  if (definitions) {
    toDealJsonSchema.definitions = definitions
  }

  cancelCircularRef(toDealJsonSchema, definitions)
  //去除circul 依赖, 如果有循环依赖,则设置null. 类似fastjson的处理方式;

  return (await jsf.resolve(toDealJsonSchema)) as object
}

/**
 * 消除循环依赖.
 */
export function cancelCircularRef(jsonSchema, definitions = {}, superRefs = [], pathRefs = {}) {
  if (!jsonSchema) {
    return
  }

  if (jsonSchema.title && !superRefs.includes(jsonSchema.title)) {
    superRefs.push(jsonSchema.title)
  }

  for (let _key in jsonSchema) {
    if (_key === 'definitions') {
      continue
    }

    //初始化记录;
    if (!pathRefs[_key]) {
      pathRefs[_key] = []
    }

    if (jsonSchema[_key] && jsonSchema[_key].$ref) {
      if (!jsonSchema[_key].originalRef) {
        jsonSchema[_key].originalRef = jsonSchema[_key].$ref.replace('#/definitions/', '')
      }

      //如果已经包含了.则设置为null
      let allPathRefs = pathRefs[_key].concat(superRefs)
      if (allPathRefs.includes(jsonSchema[_key].originalRef)) {
        //如果这条
        console.log(
          `断开循环引用: 当前类型:${jsonSchema[_key].originalRef},父路径已经引用类型${allPathRefs}`
        )
        jsonSchema[_key] = {
          type: 'null',
          default: null,
        }
      } else {
        pathRefs[_key].push(jsonSchema[_key].originalRef)
        cancelCircularRef(
          definitions[jsonSchema[_key].originalRef],
          definitions,
          pathRefs[_key].concat(superRefs)
        )
      }
    }

    if (typeof jsonSchema[_key] === 'object') {
      //继续向下循环,
      cancelCircularRef(jsonSchema[_key], definitions, pathRefs[_key].concat(superRefs))
    }
  }
}

export type TLanguage = 'zh_CN' | 'en'
