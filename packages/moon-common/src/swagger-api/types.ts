export interface IGenApiConfig {
  swaggerUrl?: string
  swaggerUrls?: string[]
  // controller:RegExp;
  dir: string
  plugins?: any[]
  loader?: [(url: string, options: TTokenMap) => Promise<any>, TTokenMap]
  wrapper?: string
  exclude?: string[]
  include?: string[]
}
export type TTokenMap = { [key: string]: string }
