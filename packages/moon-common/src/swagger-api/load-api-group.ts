import { loadJson } from '../util/json-util'
import MoonCore from '@apis/moon-core'
import type ApiCompileHooks from './hook'
import { IGenApiConfig } from './types'
import { ApiGroup } from '@apis/moon-core/declarations/web-api/domain'

export default async function loadApiGroup(
  apiGenConfig: IGenApiConfig,
  hookInstance: ApiCompileHooks
): Promise<ApiGroup[]> {
  let apiGroups: ApiGroup[] = []

  let context = {
    moonConfig: apiGenConfig,
    swaggerJson: null,
    apiGroups: [],
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
  }

  /** 将单个的 swaggerUrl 加入到 swaggerUrls 列表中统一处理逻辑 */
  if (apiGenConfig.swaggerUrl) {
    apiGenConfig.swaggerUrls = [...(apiGenConfig?.swaggerUrls ?? []), apiGenConfig.swaggerUrl]
  }

  if (apiGenConfig?.swaggerUrls?.length) {
    let apiGroups = context.apiGroups || []

    for (let i = 0, iLen = apiGenConfig.swaggerUrls.length; i < iLen; i++) {
      let swaggerUrl = apiGenConfig.swaggerUrls[i]
      console.log(`从${swaggerUrl}中加载api doc信息`)
      try {
        if (apiGenConfig.loader?.[0]) {
          //----------------------------------------------------------------
          /** 将自定义 loader 的 options 传给 loader */
          /** 如果有自定义 loader 采用自定义 loader */
          let swaggerJsonList = await apiGenConfig.loader?.[0](swaggerUrl, apiGenConfig.loader?.[1])
          context.apiGroups = null

          for (let index = 0; index < swaggerJsonList.length; index++) {
            context.swaggerJson = swaggerJsonList[index]
            await hookInstance.swagger2ApiGroup.promise(context)
            apiGroups = apiGroups.concat(
              MoonCore.SwaggerUtil.transfer(context.swaggerJson, errrorMsgDeal)
            )
          }
          //----------------------------------------------------------------
        } else {
          context.swaggerJson = await loadJson(swaggerUrl)
          context.apiGroups = null
          await hookInstance.swagger2ApiGroup.promise(context)
          if (!context.apiGroups) {
            apiGroups = apiGroups.concat(
              MoonCore.SwaggerUtil.transfer(context.swaggerJson, errrorMsgDeal)
            )
          }
        }
      } catch (err) {
        console.warn(`从swagger导出数据失败跳过此swagger${swaggerUrl}`)
        console.warn(err)
      }
    }
    context.apiGroups = apiGroups
  }

  return context.apiGroups
}
