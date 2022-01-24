import buildTs from './tsbuild'
const pluginName = 'TransfromTs2JsPlugin'
import ApiCompileHooks from '@zhangqc/moon-common/declarations/swagger-api/hook'
import * as fse from 'fs-extra'
import * as path from 'path'

export class TransfromTsToJsPlugin {
  apply(compilerHook: ApiCompileHooks) {
    /**
     * 将 目标的 ts 转换成 js 并且同时输出 d.ts
     */
    compilerHook.beforeApiSave.tap(pluginName, (options, moonContext) => {
      buildTs(options)
    })
    /**
     * 将 目标的 ts 转换成 js 并且同时输出 d.ts
     */
    compilerHook.afterIndex.tap(pluginName, (options, moonContext) => {
      debugger
      //
      // buildTs({ content: options, toSaveFilePath: options })
    })
  }
}

//--------------------类型定义--------------------------------------------

type TMethodType = 'post' | 'get' | 'delete' | 'put'

type TRequestDetail = { operationId?: string; [k: string]: any }

type TRequest = {
  [k in TMethodType]: TRequestDetail
}
