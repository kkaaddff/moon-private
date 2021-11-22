import request from 'umi-request'

const getApiUrl = ({ token, catId }: { token: string; catId: number }) => {
  return `https://yapi.amh-group.com/api/plugin/exportSwagger?type=OpenAPIV2&token=${token}&cat_id=${catId}`
}

async function fetch(catId, token) {
  let result = await request(getApiUrl({ token, catId }))
  return result
}
type TTokenMap = {
  catIds: number[]
  token: string
}[]

export async function yapiLoader(tokenMap: TTokenMap) {
  try {
    if (!Array.isArray(tokenMap)) {
      throw new Error(`loader options 应为数组！get ${Object.prototype.toString.call(tokenMap)}`)
    }
    const mapList: {
      catId
      token
    }[] = []

    tokenMap.map(({ catIds, token }) => {
      if (!Array.isArray(catIds)) {
        throw new Error(
          `loader options catIds 应为数组！get ${Object.prototype.toString.call(catIds)}`
        )
      }
      catIds.map((catId) => {
        mapList.push({
          catId,
          token,
        })
      })
    })
    const result = await Promise.all(mapList.map((item) => fetch(item.catId, item.token)))
    return result
  } catch (error) {
    console.warn('加载 YApi 数据出错！')
    console.warn(error)
  }
}

//--------------------类型定义--------------------------------------------

type TMethodType = 'post' | 'get' | 'delete' | 'put'

type TRequestDetail = { operationId?: string; [k: string]: any }

type TRequest = {
  [k in TMethodType]: TRequestDetail
}
