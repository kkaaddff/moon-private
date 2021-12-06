import type { Plugin } from 'vite'
import * as path from 'path'
import { parse } from 'url'
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

let mockData: TMockMethod[] = []
let moonConfig: any

async function createMockServer(opt: TMockOptions) {
  const moonConfig = require(path.join(process.cwd(), 'moon-config.js'))
  const mockPath = path.join(process.cwd(), moonConfig.api.dir || './src/api', 'mock')
  const result = await readDirFiles(mockPath)

  for (const key in result) {
    const controllerMethod = JSON.parse(result[key])
    mockData.push(
      ...controllerMethod.map((item) => ({
        ...item,
        url: parse(item.url).pathname,
      }))
    )
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
      queryParams = parse(req.url, true)
    }

    const reqUrl = queryParams.pathname

    const matchRequest = mockData.find((item) => {
      if (!reqUrl || !item || !item.url) {
        return false
      }
      if (item.method && item.method.toUpperCase() !== req.method) {
        return false
      }
      return pathToRegexp(item.url).test(reqUrl)
    })

    if (matchRequest) {
      const { controller, data, url } = matchRequest
      res.setHeader('Content-Type', 'application/json')
      res.statusCode = 200
      res.end(JSON.stringify({ data, code: '200', message: 'success', url }))
      return
    }
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
