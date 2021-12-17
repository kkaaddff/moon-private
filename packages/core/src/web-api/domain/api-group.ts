/**
 * @desc
 *
 * @使用场景
 *
 * @coder.yang2010@gmail.com
 * @Date    2020/5/12
 **/
import Method from './method'
import { SchemaProps } from '../../typings/api'

export default class ApiGroup {
  apis: Method[] = []

  definitions: { [name: string]: SchemaProps } = {}

  constructor(
    public options: {
      name: string
      serverInfo: any
    }
  ) {}

  get name() {
    return this.options.name
  }

  get serverInfo() {
    return this.options.serverInfo
  }

  addApis(apis: Method[]) {
    this.apis = this.apis.concat(apis)
  }

  /**
   * 添加一个api
   * @param api
   */
  addApi(api: Method) {
    this.apis.push(api)
  }

  /**
   * 是否已经存在`methodName`相同方法;
   * @param methodName
   */
  isMethodNameExist(methodName: string) {
    return !this.apis.every((method) => method.name !== methodName)
  }
  /**
   * 是否已经存在`url`相同的方法;
   * @param methodUrl
   */
  isMethodUrlExist(methodUrl: string) {
    return !this.apis.every((method) => method.url !== methodUrl)
  }
}
