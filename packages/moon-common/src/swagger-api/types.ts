export interface IGenApiConfig {
  swaggerUrl?: string
  swaggerUrls?: string[]
  // controller:RegExp;
  dir: string
  plugins?: any[]
  wrapper?: string
  exclude?: string[]
  include?: string[]
}
