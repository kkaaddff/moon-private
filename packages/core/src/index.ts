/**
 * @desc
 *
 * @使用场景
 *
 * @Date  2019/5/31
 *
 **/

import * as JsonUtil from './util/json-util'
import * as JestUtil from './util/jest-util'
import * as CompileUtil from './util/compile-util'
import * as WebApiGen from './web-api'
import * as SwaggerUtil from './web-api/util/swagger'
import * as TsIndex from './web-api/ts-index'
import * as apiDomain from './web-api/domain'

export const api = {
  domain: apiDomain,
}

export default {
  // api:{
  //   domain:apiDomain
  // },
  JsonUtil,
  CompileUtil,
  JestUtil,
  SwaggerUtil,
  WebApiGen,
  TsIndex,
}
