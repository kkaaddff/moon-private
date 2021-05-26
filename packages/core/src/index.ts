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
import * as WebApiGen from './web-api/client'
import * as SwaggerUtil from './web-api/client/util/swagger'
import * as fakeGen from './web-api/client/fake-gen'
import * as TsIndex from './web-api/client/ts-index'
import * as apiDomain from './web-api/client/domain'

export const api = {
  domain: apiDomain,
}

export default {
  // api:{
  //   domain:apiDomain
  // },
  JsonUtil,
  CompileUtil,
  fakeGen,
  JestUtil,
  SwaggerUtil,
  WebApiGen,
  TsIndex,
}
