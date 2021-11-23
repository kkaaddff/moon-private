import type { Plugin } from 'vite'
import * as path from 'path'
import * as url from 'url'
import { pathToRegexp } from 'path-to-regexp'
import { ResolvedConfig } from 'vite'
import MoonCore from '@zhangqc/moon-core'

const {
  JestUtil: { readDirFiles },
} = MoonCore

type TMockMethod = {
  url: string
  controller: {
    name: string
    method: string
  }
  method: TMethodType
  data: any
}

type TMethodType = 'post' | 'get' | 'update' | 'delete' | 'options' | 'head' | 'patch'

type TMockResponse = {
  code: string
  cause?: string
  data: any
  message: string
}

type TMockOptions = {
  logger?: boolean
  isMock?: boolean
  ignoreApi?: {
    [controller: string]: string[]
  }
  mockApi?: {
    [controller: string]: string[]
  }
}

export let mockData: TMockMethod[] = []

async function createMockServer(opt: TMockOptions) {
  const moonConfig = require(path.join(process.cwd(), 'moon-config.js'))
  const mockPath = path.join(process.cwd(), moonConfig.api.dir || './src/api', 'mock')
  const result = await readDirFiles(mockPath)

  for (const key in result) {
    const controllerMethod = JSON.parse(result[key])
    mockData.push(...controllerMethod)
  }
}

// request match
function requestMiddleware(opt: TMockOptions) {
  const middleware = async (req, res, next) => {
    let queryParams: {
      query?: {
        [key: string]: any
      }
      pathname?: string | null
    } = {}

    if (req.url) {
      queryParams = url.parse(req.url, true)
    }

    const reqUrl = queryParams.pathname

    if (reqUrl.includes('uc-behaviour-analysis-manager')) {
      debugger
    }

    const matchRequest = mockData.find((item) => {
      if (!reqUrl || !item || !item.url) {
        return false
      }
      if (item.method && item.method.toUpperCase() !== req.method) {
        return false
      }
      return reqUrl.includes(item.url)
    })

    if (reqUrl.includes('uc-behaviour-analysis-manager')) {
      matchRequest
      debugger
    }
    // if (matchRequest) {
    //   const isGet = req.method && req.method.toUpperCase() === 'GET'
    //   const { response, rawResponse, timeout, statusCode, url } = matchRequest

    //   if (timeout) {
    //     await sleep(timeout)
    //   }

    //   const urlMatch = match(url, { decode: decodeURIComponent })

    //   let query = queryParams.query
    //   if (reqUrl) {
    //     if ((isGet && JSON.stringify(query) === '{}') || !isGet) {
    //       const params = (urlMatch(reqUrl) as any).params
    //       if (JSON.stringify(params) !== '{}') {
    //         query = (urlMatch(reqUrl) as any).params || {}
    //       } else {
    //         query = queryParams.query || {}
    //       }
    //     }
    //   }

    //   const self: RespThisType = { req, res, parseJson: parseJson.bind(null, req) }
    //   if (isFunction(rawResponse)) {
    //     await rawResponse.bind(self)(req, res)
    //   } else {
    //     const body = await parseJson(req)
    //     res.setHeader('Content-Type', 'application/json')
    //     res.statusCode = statusCode || 200
    //     const mockResponse = isFunction(response)
    //       ? response.bind(self)({ url: req.url, body, query, headers: req.headers })
    //       : response
    //     res.end(JSON.stringify(Mock.mock(mockResponse)))
    //   }

    //   logger && loggerOutput('request invoke', req.url!)
    //   return
    // }
    next()
  }
  return middleware
}

export function viteMoonMockServe(opt: TMockOptions = {}): Plugin {
  let isDev = false
  let config: ResolvedConfig

  return {
    name: 'vite:mock',
    enforce: 'pre',
    async configResolved(resolvedConfig: ResolvedConfig) {
      config = resolvedConfig
      isDev = config.env.DEV
      if (isDev) {
        await createMockServer(opt)
      }
    },

    configureServer: ({ middlewares }) => {
      if (!isDev) {
        return
      }
      const middleware = requestMiddleware(opt)
      middlewares.use(middleware)
    },
  }
}
