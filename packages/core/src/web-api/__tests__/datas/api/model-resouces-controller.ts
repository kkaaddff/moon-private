// @ts-ignore
import * as sdk from '@/utils/fetch'
const serverInfo = {
  host: '127.0.0.1:8888',
  version: '2.0',
  title: 'spring-boot-plus API Documents',
  termsOfService: 'https://springboot.plus',
  contact: {
    name: 'springboot.plus',
    url: 'https://springboot.plus',
    email: 'coder.yang2010@gmail.com',
  },
}
const controllerName = 'model-resouces-controller'

/**
 *
 * 添加ModelResouces
 *
 */
async function addModelResouces(param: {
  /*modelResouces*/
  modelResouces: IAddModelResoucesModelResoucesReq
}): Promise<AddModelResoucesRes> {
  const result = await sdk.post<AddModelResoucesRes>(
    `/modelResouces/add`,
    param.modelResouces,
    {},
    { serverInfo, controllerName }
  )
  return result.data
}

/**
 *
 * 删除ModelResouces
 *
 */
async function deleteModelResouces(param: {
  /*id*/
  id: number
}): Promise<DeleteModelResoucesRes> {
  const result = await sdk.post<DeleteModelResoucesRes>(
    `/modelResouces/delete/${param.id}`,
    {},
    {},
    { serverInfo, controllerName }
  )
  return result.data
}

/**
 *
 * ModelResouces分页列表
 *
 */
async function getModelResoucesPageList(param: {
  /*modelResoucesPageParam*/
  modelResoucesPageParam: IGetModelResoucesPageListModelResoucesPageParamReq
}): Promise<GetModelResoucesPageListRes> {
  const result = await sdk.post<GetModelResoucesPageListRes>(
    `/modelResouces/getPageList`,
    param.modelResoucesPageParam,
    {},
    { serverInfo, controllerName }
  )
  return result.data
}

/**
 *
 * ModelResouces详情
 *
 */
async function getModelResouces(param: {
  /*id*/
  id: number
}): Promise<GetModelResoucesRes> {
  const result = await sdk.get<GetModelResoucesRes>(
    `/modelResouces/info/${param.id}`,
    {},
    {},
    { serverInfo, controllerName }
  )
  return result.data
}

/**
 *
 * 修改ModelResouces
 *
 */
async function updateModelResouces(param: {
  /*modelResouces*/
  modelResouces: IUpdateModelResoucesModelResoucesReq
}): Promise<UpdateModelResoucesRes> {
  const result = await sdk.post<UpdateModelResoucesRes>(
    `/modelResouces/update`,
    param.modelResouces,
    {},
    { serverInfo, controllerName }
  )
  return result.data
}

export default {
  addModelResouces,

  deleteModelResouces,

  getModelResoucesPageList,

  getModelResouces,

  updateModelResouces,
}

/**
 * id
 *
 */
export type IDeleteModelResoucesIdReq = number
/**
 */
export type AddModelResoucesRes = boolean
/**
 */
export type DeleteModelResoucesRes = boolean
/**
 */
export type UpdateModelResoucesRes = boolean

export interface IgnoreType {
  [k: string]: any
}
/**
 */
export interface GetModelResoucesRes {
  id?: number
  modelId?: number
  url?: string
  size?: number
  type?: string
  createdBy?: number
  createdTime?: string
  updatedBy?: string
  updatedTime?: string
  [k: string]: any
}
/**
 */
export interface ApiResultBoolean {
  code?: number
  success?: boolean
  message?: string
  data?: boolean
  time?: string
  [k: string]: any
}
/**
 * ModelResouces分页参数
 *
 */
export interface ModelResoucesPageParam {
  /**
   * 页码,默认为1
   */
  pageNo?: number
  /**
   * 排序
   */
  pageSorts?: OrderItem[]
  /**
   * 页大小,默认为10
   */
  pageSize?: number
  /**
   * 搜索字符串
   */
  keyword?: string
  [k: string]: any
}
/**
 */
export interface OrderItem {
  column?: string
  asc?: boolean
  [k: string]: any
}
/**
 */
export interface ApiResultPagingModelResouces {
  code?: number
  success?: boolean
  message?: string
  data?: GetModelResoucesPageListRes
  time?: string
  [k: string]: any
}
/**
 * 分页结果对象
 *
 */
export interface GetModelResoucesPageListRes {
  /**
   * 总行数
   */
  total?: number
  /**
   * 数据列表
   */
  records?: GetModelResoucesRes[]
  /**
   * 页码
   */
  pageNo?: number
  /**
   * 页大小
   */
  pageSize?: number
  [k: string]: any
}
/**
 */
export interface ApiResultModelResouces {
  code?: number
  success?: boolean
  message?: string
  data?: GetModelResoucesRes
  time?: string
  [k: string]: any
}
/**
 */
export interface IAddModelResoucesModelResoucesReq {
  id?: number
  modelId?: number
  url?: string
  size?: number
  type?: string
  createdBy?: number
  createdTime?: string
  updatedBy?: string
  updatedTime?: string
  [k: string]: any
}
/**
 * ModelResouces分页参数
 *
 */
export interface IGetModelResoucesPageListModelResoucesPageParamReq {
  /**
   * 页码,默认为1
   */
  pageNo?: number
  /**
   * 排序
   */
  pageSorts?: OrderItem[]
  /**
   * 页大小,默认为10
   */
  pageSize?: number
  /**
   * 搜索字符串
   */
  keyword?: string
  [k: string]: any
}
/**
 * 分页结果对象
 *
 */
export interface GetModelResoucesPageListRes1 {
  /**
   * 总行数
   */
  total?: number
  /**
   * 数据列表
   */
  records?: GetModelResoucesRes[]
  /**
   * 页码
   */
  pageNo?: number
  /**
   * 页大小
   */
  pageSize?: number
  [k: string]: any
}
/**
 */
export interface GetModelResoucesRes1 {
  id?: number
  modelId?: number
  url?: string
  size?: number
  type?: string
  createdBy?: number
  createdTime?: string
  updatedBy?: string
  updatedTime?: string
  [k: string]: any
}
/**
 */
export interface IUpdateModelResoucesModelResoucesReq {
  id?: number
  modelId?: number
  url?: string
  size?: number
  type?: string
  createdBy?: number
  createdTime?: string
  updatedBy?: string
  updatedTime?: string
  [k: string]: any
}

// create by moon https://github.com/creasy2010/moon
