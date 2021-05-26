/**
 * @desc
 *
 * @使用场景
 *
 * @Date    2019/5/31
 **/

import { SchemaProps } from './api'
import { IHandlePageParam } from './util'

export interface IFileSaveOptions {
  projectOutDir: string
  tplPath: string
  toSaveFilePath: string
  content: string
  param?: IHandlePageParam
}

export interface IPageDefined {
  /**
   * 页面路径
   *
   * eg:
   *   order
   *   trade/info
   *   trade/list
   *   trade/sub
   *   a-b
   *   a/b/c/e-d
   */
  title: string

  pagePath: string
  //通过filepath计算出来
  pageKey?: string
  lifeCycles: {
    init: {
      param: string
      content: string
    }
    clean: {
      param: string
      content: string
    }
  }
  mainComp: {
    imports: string
    style: string
    methods: unknown[]
  }

  models: IActorItem[]
  actions: IAction[]
  subComps: ISubComp[]
}

export interface IActorItem {
  fileName: string
  datas: IType[]
  methods: IActorEvent[]
}

export type DataType = 'any' | 'string' | 'object' | 'string[]' | 'number'

/**
 * //分别对应 controller methods response ...
 * import {} from 'webapi/controller'
 */
export interface ImportInfo {
  apiFile: string
  methodName: string
  interfaceName: string
  isArray: boolean
}

export interface IType {
  name: string
  value: any //从初始值里直接生成ts的定义

  schemaType: 'internal' | 'import' | 'fromValue'
  importInfo?: ImportInfo
  typeName: string //生成ts类型的名称;  在生成ts时定义出来
  schema: SchemaProps //ts类型schema  这个可以用户指定或自动生成来做了.
}

export interface IActorEvent {
  content?: string
  name: string
  param: any
}

export interface IAction {
  content?: string
  fileName: string
  methods: unknown[]
}

export interface IActorItem {
  name: string
  param: any
  content?: string
  comment?: string
}

export interface ISubComp {
  fileName: string
  imports: string
  style: string
  methods: unknown[]
}

/**
 *
 * @param {string} filePath
 * @param {(tplContent: string) => Promise<string>} dealCal
 * @returns {Promise<void>}
 */
export interface IContext {
  projectPath: string
  pageInfo: IPageDefined
  prettiesConfig?: object
  beforeSave?: (options: IFileSaveOptions, context: IContext) => Promise<IFileSaveOptions>
  afterSave?: (options: IFileSaveOptions, context: IContext) => Promise<void>
}
