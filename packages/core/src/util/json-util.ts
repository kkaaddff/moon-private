/**
 * @desc
 *
 * @使用场景
 *
 * @Date    2019/3/27
 **/

import { compile } from 'json-schema-to-typescript'
import { IWebApiContext } from '../typings/api'
import { ITsGenResult } from '../typings/util'

import debug from 'debug'

const log = debug('web-apis:jsonUtil')

//考虑使用z隐式传参呢..

/**
 * 将json schema 转换为ts定义
 *
 * @param {string} name
 * @param jsonSchema
 * @returns {Promise<string>}
 */

export async function genTsFromDefines(
  definitions: {
    definitions: { [key: string]: any }
  },
  name = 'IgnoreType'
): Promise<string> {
  log(`根据jsonSchema中definitions生成ts定义文件`)

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
