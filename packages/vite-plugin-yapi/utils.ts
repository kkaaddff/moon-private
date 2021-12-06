import Debug from 'debug'
import { ViteDevServer } from 'vite'
import { RESOLVED_VIRTUAL_MODULE_ID } from './constants'

/**
 * 正则表达式
 * 1. views目录下
 * 2. 深度为1的
 * 3. 文件名为 routes.ts | router.ts
 */
const routerRegWithDepth1 = /views\/([^\/]+\/){1}route(s|r)\.ts/i

export const debug = {
  hmr: Debug('fta-router:hmr'),
  routeBlock: Debug('fta-router:routeBlock'),
  options: Debug('fta-router:options'),
  pages: Debug('fta-router:pages'),
  search: Debug('fta-router:search'),
  env: Debug('fta-router:env'),
  cache: Debug('fta-router:cache'),
  resolver: Debug('fta-router:resolver'),
}

export function extsToGlob(extensions: string[]) {
  return extensions.length > 1 ? `{${extensions.join(',')}}` : extensions[0] || ''
}

export function isTarget(path: string) {
  return routerRegWithDepth1.test(path)
}

export const nuxtDynamicRouteRE = /^_[\s\S]*$/

export function pathToName(filepath: string) {
  return filepath.replace(/[_.\-\\/]/g, '_').replace(/[[:\]()]/g, '$')
}

export function invalidatePagesModule(server: ViteDevServer) {
  const { moduleGraph } = server
  const module = moduleGraph.getModuleById(RESOLVED_VIRTUAL_MODULE_ID)

  if (module) {
    moduleGraph.invalidateModule(module)
    return module
  }
}

type DebugScope = `fta-router:${string}`

export function createDebugger(namespace: DebugScope): debug.Debugger['log'] {
  const log = Debug(namespace)
  return (msg: string, ...args: any[]) => {
    log(msg, ...args)
  }
}

export function isObject(value: unknown): value is Record<string, any> {
  return Object.prototype.toString.call(value) === '[object Object]'
}

export function slash(p: string): string {
  return p.replace(/\\/g, '/')
}
