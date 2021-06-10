/**
 * @desc
 *
 * @使用场景
 *
 * @Date    2019/3/27
 **/

import request from 'umi-request'
import * as fs from 'fs'
import * as fse from 'fs-extra'
import * as generateSchema from 'generate-schema'
import { compile } from 'json-schema-to-typescript'

/**
 * 读取 swaggerJson 支持本地文件和远程接口
 * @param swaggerUrl
 * @returns Json Object
 */
export async function loadJson(swaggerUrl: string): Promise<any> {
  let result = null
  if (fs.existsSync(swaggerUrl)) {
    result = await loadJsonFromFs(swaggerUrl)
  } else {
    result = await loadJsonFromServer(swaggerUrl)
  }
  return result
}

async function loadJsonFromFs(filePath: string): Promise<any> {
  const apiJson = await fse.readJSONSync(filePath)
  return apiJson
}

async function loadJsonFromServer(swaggerUrl: string): Promise<any> {
  let result = await request(swaggerUrl, {
    method: 'get',
  })
  return result
}

/**
 * 将json转换为ts定义
  log(`根据JSON生成ts定义文件`)
 * @param value
 * @returns {any}
 */
export async function genTsFromJSON(name: string, value: any): Promise<IJsonTsGenResult> {
  let schema = generateSchema.json(name, value)
  let tsResult = await genTsFromSchema(name, schema)
  return { ...tsResult, schema }
}

//考虑使用z隐式传参呢..

/**
 * 将json schema 转换为ts定义
  log(`根据jsonSchema生成ts定义文件`)
 * @param {string} name
 * @param jsonSchema
 * @returns {Promise<string>}
 */
export async function genTsFromSchema(name: string, jsonSchema: any): Promise<ITsGenResult> {
  let tsContent = await compile(jsonSchema, name, {
    bannerComment: '',
    // unreachableDefinitions:true,
    // $refOptions:{
    //   parse:{
    //     definitions:parse
    //   }
    // }
  })

  let result = {
    //这是一个默认的规则;
    typeName: jsonSchema.title ? jsonSchema.title.replace(/ */gi, '') : name,
    tsContent,
  }
  return result
}

/**
 * 
  log(`根据jsonSchema中definitions生成ts定义文件`)
 * @param definitions 
 * @param name 
 * @returns 
 */
export async function genTsFromDefines(
  definitions: {
    definitions: { [key: string]: any }
  },
  name = 'IgnoreType'
): Promise<string> {
  try {
    let tsContent = await compile(definitions, name, {
      bannerComment: '',
      unreachableDefinitions: true,
    })

    tsContent = tsContent
      .replace(/ \* This interface was referenced by `IgnoreType`'s JSON-Schema\n/g, '')
      .replace(/.*via the `definition`.*\n/g, '')

    return tsContent
  } catch (err) {
    console.warn('生成ts出错', err)
    return ''
  }
}

export interface IJsonTsGenResult extends ITsGenResult {
  typeName: string
  tsContent: string
  schema: any
}

export interface ITsGenResult {
  typeName: string
  tsContent: string
}
