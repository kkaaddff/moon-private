/**
 * @desc
 *
 * @使用场景
 *
 * @Date    2019/4/2
 **/
import * as fse from 'fs-extra'
import * as _ from 'lodash'
import { join } from 'path'
import MoonCore from '@zhangqc/moon-core'
import * as minimatch from 'minimatch'
import { camelCase } from 'lodash'
import ApiCompileHooks from './hook'
import loadApiGroup from './load-api-group'
import { IWebApiContext, IWebApiDefinded, SchemaProps } from '@zhangqc/moon-core'
import { IFileSaveOptions } from '@zhangqc/moon-core'
import { IInsertImportDeclaration } from '@zhangqc/moon-core'
import { ApiGroup } from '@zhangqc/moon-core/declarations/web-api/domain'
import { applyHook } from '../util/hook-util'
import { IGenApiConfig } from './types'

process.on('unhandledRejection', (error) => {
  console.log('unhandledRejection', error)
})

export async function genApi(context: { workDir: string; config: IGenApiConfig }): Promise<void> {
  let workBase = context.workDir
  let hookInstance = new ApiCompileHooks()

  let defaultMoonConfig = {
    api: context.config,
  }

  /** 注册 所有 plugin */
  defaultMoonConfig.api?.plugins?.map((plugin) => {
    applyHook(hookInstance, plugin)
  })

  await hookInstance.init.promise(context)

  let apiGroups = await loadApiGroup(defaultMoonConfig.api, hookInstance)

  await hookInstance.beforeCompile.call(apiGroups, context)

  let apiDir = join(workBase, defaultMoonConfig.api.dir)

  let inserts: IInsertImportDeclaration[] = []

  for (let i = 0, ilen = apiGroups.length; i < ilen; i++) {
    try {
      let webapiGroup: ApiGroup = apiGroups[i]

      await hookInstance.beforeGroupCompile.call(webapiGroup, context)

      // 在 exclude 列表
      if (defaultMoonConfig.api?.exclude?.some((item) => minimatch(webapiGroup.name, item))) {
        console.log(
          `${i + 1}/${ilen} ignore webapiGroup:${webapiGroup.name},due to MoonConfig.api.exclude`
        )
        continue
      }

      // 有 include 且不在 include 列表
      if (
        defaultMoonConfig.api?.include?.length > 0 &&
        defaultMoonConfig.api.include.every((item) => minimatch(webapiGroup.name, item))
      ) {
        console.log(
          `${i + 1}/${ilen} ignore webapiGroup:${webapiGroup.name},due to MoonConfig.api.include`
        )
        continue
      }

      console.log(`${i + 1}/${ilen}`, 'current webapiGroup:', webapiGroup.name)

      let saveApiFile = await MoonCore.WebApiGen.buildWebApi({
        webapiGroup,
        projectPath: apiDir,
        beforeCompile: (apiItem) => {
          hookInstance.beforeApiCompile.call(apiItem)
          return apiItem
        },
        reqParamModify: async (apiItem, context) => {
          hookInstance.onRequestParam.call(apiItem, {
            apiItem,
            apiGroup: context.webapiGroup,
            apiDir,
          })
          return apiItem
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
            defaultMoonConfig.api.wrapper
          )
          hookInstance.onResponseSchema.call(finalSchema, {
            apiItem,
            apiGroup: context.webapiGroup,
            apiDir,
          })
          return finalSchema
        },
        tsDeclarationModify: (apiGroup) => {
          hookInstance.beforeDeclarationGen.call(apiGroup)
          return apiGroup
        },
        beforeSave: (options: IFileSaveOptions, context: any) => {
          options.content = options.content.replace(
            /result\.data/gi,
            defaultMoonConfig.api.wrapper ? `result.${defaultMoonConfig.api.wrapper}` : 'result'
          )
          hookInstance.beforeApiSave.call(options, context)
          return Promise.resolve(options)
        },
      })

      hookInstance.afterApiSave.call(saveApiFile, webapiGroup)

      let controllerName = camelCase(webapiGroup.name)
      let filePath = `./${webapiGroup.name}`

      inserts.push({
        namespaceImport: controllerName,
        moduleSpecifier: filePath,
      })

      await hookInstance.afterGroupCompile.call(webapiGroup, context)
    } catch (err) {
      console.error(err)
    }
  }

  hookInstance.afterCompile.call(apiGroups, context)

  hookInstance.beforeIndex.call(apiGroups, context)

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
  hookInstance.afterIndex.call(apiIndexFilePath, context)
  await hookInstance.finish.call(context)
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
