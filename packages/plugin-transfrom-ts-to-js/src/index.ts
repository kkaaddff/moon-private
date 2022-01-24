import buildTs from './tsbuild'
const pluginName = 'TransfromTs2JsPlugin'
import ApiCompileHooks from '@zhangqc/moon-common/declarations/swagger-api/hook'
import * as fse from 'fs-extra'

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
      const indexOptions = {
        content: fse.readFileSync(options, { encoding: 'utf8' }),
        toSaveFilePath: options,
      }
      buildTs(indexOptions)
      fse.removeSync(options)
      fse.writeFileSync(indexOptions.toSaveFilePath.replace(/\.ts$/, '.js'), indexOptions.content)
    })
  }
}

//--------------------类型定义--------------------------------------------

type TMethodType = 'post' | 'get' | 'delete' | 'put'

type TRequestDetail = { operationId?: string; [k: string]: any }

type TRequest = {
  [k in TMethodType]: TRequestDetail
}
