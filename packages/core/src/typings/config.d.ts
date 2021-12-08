/**
 * @desc
 *
 * @使用场景
 *
 * @Date    2019/5/31
 **/
export interface IMoonConfig {
  type: TargetType
  // swaggerApi: string;
  page?: {
    engine?: string
    plugins?: any[]
    [other: string]: any
  }
  api: {
    swaggerUrl?: string
    swaggerUrls?: string[]
    dir: string
    plugins?: any[]
    loader?: any[]
    wrapper?: string
    exclude?: string[]
    include?: string[]
    mock?: {
      isMock?: boolean
      ignoreApi: Array<string | RegExp>
      mockApi: Array<string | RegExp>
    }
  }
}

export type TargetType = 'h5-redux' | 'taro-redux'
