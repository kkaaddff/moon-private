import buildTs from './tsbuild'
const pluginName = 'TransfromTs2JsPlugin'

export class TransfromTsToJsPlugin {
  apply(compilerHook) {
    /**
     * 将 目标的 ts 转换成 js 并且同时输出 d.ts
     */
    compilerHook.beforeApiSave.tap(pluginName, (options, context) => {
      buildTs(options)
      context
    })
  }
}

//--------------------类型定义--------------------------------------------

type TMethodType = 'post' | 'get' | 'delete' | 'put'

type TRequestDetail = { operationId?: string; [k: string]: any }

type TRequest = {
  [k in TMethodType]: TRequestDetail
}
