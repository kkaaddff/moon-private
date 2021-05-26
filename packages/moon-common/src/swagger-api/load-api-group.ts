import { loadJson } from '../util/json-util'
import MoonCore from '@zhangqc/moon-core'
import type ApiCompileHooks from './hook'
import { IGenApiConfig } from './types'
import { RequestParameter, ApiGroup } from '@zhangqc/moon-core/declarations/web-api/domain'

export default async function loadApiGroup(
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
