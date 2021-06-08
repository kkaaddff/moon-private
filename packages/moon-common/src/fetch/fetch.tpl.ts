// @ts-ignore
import request from '@/utils/request'
import { isEmpty, forEach } from 'lodash'

/**
 * 是否是字符串
 * @param param
 */
function isString(param: any) {
  return Object.prototype.toString.call(param) === '[object String]'
}

/**
 * 是否是空对象
 * @param param
 */
function truthParam(obj: Object) {
  if (isEmpty(obj) || Array.isArray(obj)) {
    return obj
  } else {
    let res = {}
    forEach(obj, function (value, key) {
      if (value !== null && value !== undefined) {
        res[key] = value
      }
    })
    return res
  }
}

interface IFetch {
  host: string
  url: string
  method?: string
  data?: Object
  params?: Object
  option?: {
    serverInfo: {
      host: string
      version: string
      title: string
    }
    controllerName: string
  }
  contentType?: string
}

interface AsyncResult<T> {
  /**
   * 结果码
   */
  code: string
  data: T
  cause?: string
  /**
   * 消息内容
   */
  message: string
}

async function fetch<T = object>(arg: IFetch): Promise<AsyncResult<T>> {
  let {
    host = '',
    url,
    data,
    params,
    method,
    option: { controllerName },
  } = arg

  let options: any = {
    method,
  }
  options.data = truthParam(data)
  options.params = truthParam(params)
  try {
    let res: any = await request(url, options)
    return res
  } catch (e) {
    throw e
  }
}

// let host = config.host || 'http://118.31.238.229:8390';
let host = ''

export function get<T = any>(url: string, data: object, params: object, option: any = { host }) {
  return fetch<T>({
    host: option.host,
    url,
    data,
    params,
    method: 'get',
    option,
  })
}

export function patch<T = any>(url: string, data: object, option: any = { host }) {
  return fetch<T>({
    host: option.host,
    url,
    method: 'patch',
    option,
  })
}

export function head<T = any>(url: string, data: object, option: any = { host }) {
  return fetch<T>({
    host: option.host,
    url,
    method: 'head',
    option,
  })
}

export function put<T = any>(url: string, data: object, params: object, option: any = { host }) {
  return fetch<T>({
    host: option.host,
    url,
    method: 'put',
    data,
    params,
    option,
  })
}

export function post<T = any>(url: string, data: object, params: object, option: any = { host }) {
  return fetch<T>({
    host: option.host,
    url,
    method: 'post',
    data,
    params,
    option,
  })
}

export function options<T = any>(
  url: string,
  data: object,
  params: object,
  option: any = { host }
) {
  return fetch<T>({
    host: option.host,
    url,
    method: 'options',
    data,
    option,
    params,
  })
}

export function deleteF<T = any>(
  url: string,
  data: object,
  params: object,
  option: any = { host }
) {
  return fetch<T>({
    host: option.host,
    url,
    method: 'delete',
    data,
    params,
    option,
  })
}
