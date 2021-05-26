//@ts-ignore
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
const controllerName = 'model-controller'

/**
 *
 * 添加Model
 *
 */
async function addModel(param: {
  /*model*/
  model: IAddModelModelReq
}): Promise<AddModelRes> {
  const result = await sdk.post<AddModelRes>(
    `/model/add`,
    param.model,
    {},
    { serverInfo, controllerName }
  )
  return result.data
}

/**
 *
 * 添加Model tag
 *
 */
async function addModelTag(param: {
  /*modelTagRel*/
  modelTagRel: IAddModelTagModelTagRelReq
}): Promise<AddModelTagRes> {
  const result = await sdk.post<AddModelTagRes>(
    `/model/add/tag`,
    param.modelTagRel,
    {},
    { serverInfo, controllerName }
  )
  return result.data
}

/**
 *
 * 删除Model tag
 *
 */
async function deleteModelTag(param: {
  /*id*/
  id: number
}): Promise<DeleteModelTagRes> {
  const result = await sdk.post<DeleteModelTagRes>(
    `/model/delete/tag/${param.id}`,
    {},
    {},
    { serverInfo, controllerName }
  )
  return result.data
}

/**
 *
 * 删除Model
 *
 */
async function deleteModel(param: {
  /*id*/
  id: number
}): Promise<DeleteModelRes> {
  const result = await sdk.post<DeleteModelRes>(
    `/model/delete/${param.id}`,
    {},
    {},
    { serverInfo, controllerName }
  )
  return result.data
}

/**
 *
 * Model分页列表
 *
 */
async function getModelPageList(param: {
  /*modelPageParam*/
  modelPageParam: IGetModelPageListModelPageParamReq
}): Promise<GetModelPageListRes> {
  const result = await sdk.post<GetModelPageListRes>(
    `/model/getPageList`,
    param.modelPageParam,
    {},
    { serverInfo, controllerName }
  )
  return result.data
}

/**
 *
 * Model详情
 *
 */
async function getModel(param: {
  /*id*/
  id: number
}): Promise<GetModelRes> {
  const result = await sdk.get<GetModelRes>(
    `/model/info/${param.id}`,
    {},
    {},
    { serverInfo, controllerName }
  )
  return result.data
}

/**
 *
 * 修改Model
 *
 */
async function updateModel(param: {
  /*model*/
  model: IUpdateModelModelReq
}): Promise<UpdateModelRes> {
  const result = await sdk.post<UpdateModelRes>(
    `/model/update`,
    param.model,
    {},
    { serverInfo, controllerName }
  )
  return result.data
}

export default {
  addModel,

  addModelTag,

  deleteModelTag,

  deleteModel,

  getModelPageList,

  getModel,

  updateModel,
}

/**
 * id
 *
 */
export type IDeleteModelTagIdReq = number
/**
 */
export type AddModelRes = boolean
/**
 */
export type AddModelTagRes = boolean
/**
 */
export type DeleteModelTagRes = boolean
/**
 */
export type DeleteModelRes = boolean
/**
 */
export type UpdateModelRes = boolean

export interface IgnoreType {
  [k: string]: any
}
/**
 *  Model updateVo对象
 *
 */
export interface ModelAddOrUpdateVo {
  id: number
  resourceOpt?: ResourceOptInfo
  name: string
  tagOptInfo?: TagOptInfo
  marketprice?: string
  createdBy?: string
  createdTime?: string
  updatedBy?: string
  updatedTime?: string
  [k: string]: any
}
/**
 */
export interface ResourceOptInfo {
  toAdd?: ModelResouces[]
  toDels?: number[]
  [k: string]: any
}
/**
 */
export interface ModelResouces {
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
export interface TagOptInfo {
  toAdd?: ModelTagsVo[]
  toDels?: number[]
  [k: string]: any
}
/**
 *  ModelTags QueryVo对象
 *
 */
export interface ModelTagsVo {
  modelId?: number
  id: number
  name?: string
  code?: string
  createdBy?: string
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
 */
export interface ModelTagsRel {
  id: number
  modelid?: number
  tagid?: number
  [k: string]: any
}
/**
 * Model分页参数
 *
 */
export interface ModelPageParam {
  /**
   * 页码,默认为1
   */
  pageNo?: number
  /**
   * 排序
   */
  pageSorts?: OrderItem[]
  tags?: number[]
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
export interface ApiResultPagingModelFullVo {
  code?: number
  success?: boolean
  message?: string
  data?: GetModelPageListRes
  time?: string
  [k: string]: any
}
/**
 * 分页结果对象
 *
 */
export interface GetModelPageListRes {
  /**
   * 总行数
   */
  total?: number
  /**
   * 数据列表
   */
  records?: GetModelRes[]
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
 *  Model updateVo对象
 *
 */
export interface GetModelRes {
  id: number
  resouces?: ModelResouces[]
  name: string
  tags?: ModelTagsVo[]
  marketprice?: string
  createdBy?: string
  createdTime?: string
  updatedBy?: string
  updatedTime?: string
  [k: string]: any
}
/**
 */
export interface ApiResultModelFullVo {
  code?: number
  success?: boolean
  message?: string
  data?: GetModelRes
  time?: string
  [k: string]: any
}
/**
 *  Model updateVo对象
 *
 */
export interface IAddModelModelReq {
  id: number
  resourceOpt?: ResourceOptInfo
  name: string
  tagOptInfo?: TagOptInfo
  marketprice?: string
  createdBy?: string
  createdTime?: string
  updatedBy?: string
  updatedTime?: string
  [k: string]: any
}
/**
 */
export interface IAddModelTagModelTagRelReq {
  id: number
  modelid?: number
  tagid?: number
  [k: string]: any
}
/**
 * Model分页参数
 *
 */
export interface IGetModelPageListModelPageParamReq {
  /**
   * 页码,默认为1
   */
  pageNo?: number
  /**
   * 排序
   */
  pageSorts?: OrderItem[]
  tags?: number[]
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
export interface GetModelPageListRes1 {
  /**
   * 总行数
   */
  total?: number
  /**
   * 数据列表
   */
  records?: GetModelRes[]
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
 *  Model updateVo对象
 *
 */
export interface GetModelRes1 {
  id: number
  resouces?: ModelResouces[]
  name: string
  tags?: ModelTagsVo[]
  marketprice?: string
  createdBy?: string
  createdTime?: string
  updatedBy?: string
  updatedTime?: string
  [k: string]: any
}
/**
 *  Model updateVo对象
 *
 */
export interface IUpdateModelModelReq {
  id: number
  resourceOpt?: ResourceOptInfo
  name: string
  tagOptInfo?: TagOptInfo
  marketprice?: string
  createdBy?: string
  createdTime?: string
  updatedBy?: string
  updatedTime?: string
  [k: string]: any
}

// create by moon https://github.com/creasy2010/moon
