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
