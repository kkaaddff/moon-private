import request from 'umi-request'

const getApiUrl = (
  { token, catId } = {
    token: 'f1180521157f557c715a42d2a9b5c30fa000aadb96a0fce739bee7dd78014c11',
    catId: '39537',
  }
) => {
  return `https://yapi.amh-group.com/api/plugin/exportSwagger?type=OpenAPIV2&token=${token}&cat_id=${catId}`
}

async function fetch(pid, token, url) {
  let result = await request(url, {
    method: 'get',
    params: {
      type: 'OpenAPIV2',
      pid, // YApi项目id
      status: 'all',
      isWiki: false,
      token, // YApi生成的项目Token
    },
  })
  return result
}

export async function yapiLoader(swaggerUrl, tokenMap) {
  try {
    const mapList = Object.entries(tokenMap)
    const result = await Promise.all(mapList.map((item) => fetch(item[0], item[1], swaggerUrl)))
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
