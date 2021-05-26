/**
 * @desc
 *
 * @使用场景
 *
 * @Date    2019/4/2
 **/
import * as request from 'request'
import * as fs from 'fs'
import * as fse from 'fs-extra'
import * as _ from 'lodash'
import { join } from 'path'
import MoonCore from '@zhangqc/moon-core'
import * as minimatch from 'minimatch'
import { camelCase } from 'camel-case'
import ApiCompileHooks from './hook'
import {
  IWebApiContext,
  IWebApiDefinded,
  SchemaProps,
} from '@zhangqc/moon-core/declarations/typings/api'
import { IFileSaveOptions } from '@zhangqc/moon-core/declarations/typings/page'
import { IInsertOption } from '@zhangqc/moon-core/declarations/typings/util'
import { RequestParameter, ApiGroup } from '@zhangqc/moon-core/declarations/web-api/domain'
import { applyHook } from '../util/hook-util'

/**
 * 读取 swaggerJson 支持本地文件和远程接口
 * @param swaggerUrl
 * @returns Json Object
 */
async function loadJson(swaggerUrl: string): Promise<any> {
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
  return new Promise((resolve, reject) => {
    console.log(`从${swaggerUrl}中加载api doc信息`)
    request(swaggerUrl, function (error, response, body) {
      if (error) {
        console.error(error)
        reject(error)
      } else {
        resolve(JSON.parse(body))
      }
    })
  })
}

interface IApiIndex {
  [controllerName: string]: {
    fileName: string
    methods: {
      [methodName: string]: {
        responseTs: string[]
      }
    }
  }
}

process.on('unhandledRejection', (error) => {
  console.log('unhandledRejection', error)
})

export interface IGenApiConfig {
  swaggerUrl?: string
  swaggerUrls?: string[]
  // controller:RegExp;
  dir: string
  plugins?: any[]
  wrapper?: string
  exclude?: string[]
  include?: string[]
}

export async function genApi(context: { workDir: string; config: IGenApiConfig }): Promise<void> {
  let workBase = context.workDir
  let hookInstance = new ApiCompileHooks()

  let defaulltMoonConfig = {
    api: context.config,
  }

  defaulltMoonConfig.api?.plugins?.map((plugin) => {
    applyHook(hookInstance, plugin)
  })

  await hookInstance.init.promise(context)

  let apiGroups = await loadeApiGroup(defaulltMoonConfig.api, hookInstance)

  await hookInstance.beforeCompile.call(apiGroups, context)

  let apiDir = join(workBase, defaulltMoonConfig.api.dir)

  let inserts: IInsertOption[] = []
  for (let i = 0, ilen = apiGroups.length; i < ilen; i++) {
    try {
      let webapiGroup: ApiGroup = apiGroups[i]

      await hookInstance.beforeGroupCompile.call(webapiGroup, context)
      if (defaulltMoonConfig.api?.exclude?.some((item) => minimatch(webapiGroup.name, item))) {
        console.log(
          `${i + 1}/${ilen} ignore webapiGroup:${webapiGroup.name},due to MoonConfig.api.exclude`
        )
        continue
      } else {
        if (defaulltMoonConfig.api?.include?.length > 0) {
          if (defaulltMoonConfig.api.include.some((item) => minimatch(webapiGroup.name, item))) {
            console.log(`${i + 1}/${ilen}`, 'current webapiGroup:', webapiGroup.name)
          } else {
            console.log(
              `${i + 1}/${ilen}`,
              'ignore webapiGroup:',
              webapiGroup.name,
              'due to MoonConfig.api.include'
            )
            continue
          }
        } else {
          console.log(`${i + 1}/${ilen}`, 'current webapiGroup:', webapiGroup.name)
        }
      }
      let saveApiFile = await MoonCore.WebApiGen.buildWebApi({
        webapiGroup,
        projectPath: apiDir,
        beforeCompile: (apiItem) => {
          hookInstance.beforeApiCompile.call(apiItem)
          return apiItem
        },
        reqParamModify: async (
          reqParam: RequestParameter,
          apiItem: IWebApiDefinded,
          context: IWebApiContext
        ): Promise<RequestParameter> => {
          let finalSchema = reqParam
          hookInstance.onRequestParam.call(finalSchema, {
            apiItem,
            apiGroup: context.webapiGroup,
            apiDir,
          })
          return finalSchema
        },
        resSchemaModify: async (
          schema: SchemaProps,
          apiItem: IWebApiDefinded,
          context: IWebApiContext
        ): Promise<SchemaProps> => {
          //添加生成mock数据的流程;;
          let finalSchema = MoonCore.SwaggerUtil.resSchemaModify(
            schema,
            apiItem,
            context,
            defaulltMoonConfig.api.wrapper
          )
          hookInstance.onResponseSchema.call(finalSchema, {
            apiItem,
            apiGroup: context.webapiGroup,
            apiDir,
          })
          return finalSchema
        },
        beforeSave: (options: IFileSaveOptions, context: any) => {
          hookInstance.beforeApiSave.call(options, context)
          options.content = options.content.replace(
            /result\.data/gi,
            defaulltMoonConfig.api.wrapper ? `result.${defaulltMoonConfig.api.wrapper}` : 'result'
          )
          return Promise.resolve(options)
        },
      })

      //@ts-ignore
      hookInstance.afterApiSave.call(saveApiFile, webapiGroup)

      let controllerName = camelCase(webapiGroup.name)
      let filePath = `./${webapiGroup.name}`

      inserts.push({
        mark: /export +default/,
        isBefore: true,
        content: `import * as  ${controllerName} from '${filePath}';`,
        // content: `import  ${controllerName} from '${filePath}';`,
        check: (content: string) => !content.includes(filePath),
      })

      inserts.push({
        mark: /default +{/,
        isBefore: false,
        content: `${controllerName},`,
        check: (_, raw) => !raw.includes(filePath),
      })
      await hookInstance.afterGroupCompile.call(webapiGroup, context)
    } catch (err) {
      console.error(err)
    }
  }
  await hookInstance.afterCompile.call(apiGroups, context)

  let apiIndexFilePath = join(apiDir, 'index.ts')
  if (!fse.pathExistsSync(apiIndexFilePath)) {
    console.log('create: 创建文件' + apiIndexFilePath)
    fse.writeFileSync(
      apiIndexFilePath,
      `export default {
    }`
    )
  }

  await MoonCore.CompileUtil.insertFile(apiIndexFilePath, inserts)
  //还是生成 一个总的 ?
  //转换

  await hookInstance.finish.call(context)
}

async function loadeApiGroup(
  apiGenConfig: IGenApiConfig,
  hookInstance: ApiCompileHooks
): Promise<ApiGroup[]> {
  let apiGroups: ApiGroup[] = []

  let context = {
    moonConfig: apiGenConfig,
    swaggerJson: null,
    apiGroups: null,
  }
  await hookInstance.loadApiGroup.promise(context)

  if (context.apiGroups && context.apiGroups.length > 0) {
    return context.apiGroups
  }

  await hookInstance.loadSwagger.promise(context)

  let errrorMsgDeal = async (errorInfo) => {
    await hookInstance.onError.promise(errorInfo, context)
  }

  if (context.swaggerJson) {
    await hookInstance.swagger2ApiGroup.promise(context)
    apiGroups = MoonCore.SwaggerUtil.transfer(context.swaggerJson, errrorMsgDeal)
    return apiGroups
  } else {
    if (apiGenConfig.swaggerUrl) {
      context.swaggerJson = await loadJson(apiGenConfig.swaggerUrl)
      await hookInstance.swagger2ApiGroup.promise(context)
      if (!context['apiGroups']) {
        //默认转换规则
        context['apiGroups'] = MoonCore.SwaggerUtil.transfer(context.swaggerJson, errrorMsgDeal)
      }
    } else if (apiGenConfig.swaggerUrls) {
      let apiGroups = context.apiGroups || []
      for (let i = 0, iLen = apiGenConfig.swaggerUrls.length; i < iLen; i++) {
        let swaggerUrl = apiGenConfig.swaggerUrls[i]
        try {
          context.swaggerJson = await loadJson(swaggerUrl)
          context.apiGroups = null
          await hookInstance.swagger2ApiGroup.promise(context)

          if (!context.apiGroups) {
            apiGroups = apiGroups.concat(
              context.apiGroups
                ? context.apiGroups
                : MoonCore.SwaggerUtil.transfer(context.swaggerJson, errrorMsgDeal)
            )
          }
        } catch (err) {
          console.warn(`从swagger导出数据失败跳过此swagger${swaggerUrl}`)
          console.warn(err)
        }
      }
      context['apiGroups'] = apiGroups
    }
  }

  return context['apiGroups']
}

export interface IParam {
  name: string
  in: string
  description: string
  required: boolean
  type: string
  default: string
}

export interface Parameter {}

export interface Items {
  $ref: string
  originalRef: string
}

export interface Schema {
  type: string
  items: Items
}
