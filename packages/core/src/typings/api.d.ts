/**
 * @desc
 *
 * @使用场景
 *
 * @Date    2019/5/31
 **/
import {IFileSaveOpt} from "./util";
import RequestParameter from "../web-api/client/domain/request-parameter";
import {ApiGroup} from "../web-api/client/domain";
import Method from "../web-api/client/domain/method";

/**
 * 对于接口的定义
 */
export interface IWebApiDefinded {
  url: string;
  method?: 'post' | 'get'; //默认为post方法
  //方法名称
  name: string;
  comment: string;
  requestParam: RequestParameter[];
  responseSchema: SchemaProps;
}
//
// export interface IWebApiGroup {
//   name: string;
//   serverInfo:{
//     // contact: string;
//     description: string;
//     // license: {name: string, url: string}
//     // termsOfService: string;
//     title: string;
//     version: string;
//     host:string;
//     [key:string]:any;
//   };
//   apis: Method[];
//   //公共的props, 供其他人调用;
//   definitions?: {
//     [defName: string]: SchemaProps;
//   };
// }

export interface IWebApiContext extends IFileSaveOpt {
  webapiGroup: ApiGroup;
  projectPath: string;
  //修改返回值的schema信息; 进行调整以生成ts定义; 因为多了api层的修改;
  resSchemaModify?: (resScheme: SchemaProps,apiItem: Method , context: IWebApiContext) => Promise<SchemaProps>;
  isNeedMock?:(controller:string,method:string)=>boolean;
  beforeCompile?: (
    apiItem: Method,
  ) => Promise<Method> | Method;
}

interface IJsonSchemaProps {
  description?: string;
  title?: string;
}

interface INumberValidates {
  exclusiveMaximum?: number;
  exclusiveMinimum?: number;
  minimum?: number;
  multipleOf?: number;
  maximum?: number;
}

interface IJSIntegerProps extends IJsonSchemaProps, INumberValidates {
  type: 'integer';
}

interface IJSNumberProps extends IJsonSchemaProps, INumberValidates {
  type: 'number';
}

export interface JSStringProps extends IJsonSchemaProps {
  type: 'string';
  maxLength?: string;
  minLength?: string;
  pattern?: string;
}

export interface IJSArrayProps extends IJsonSchemaProps {
  type: 'array';
  //如果type是数组要
  // 定义子组件的属性;
  items: SchemaProps;
  // 定义最少数量
  minItems?: number;
  maxItems?: number;
  // 是否可以重复
  uniqueItems?: boolean;
}

export interface IJSObjectProps extends IJsonSchemaProps {
  type: 'object';
  maxProperties?: number;
  minProperties?: number;
  properties: { [name: string]: SchemaProps };
  required?: string[];
}

export type SchemaProps =
  | IJSObjectProps
  | IJSArrayProps
  | JSStringProps
  | IJSNumberProps
  | IJSIntegerProps
  | IJsonSchemaRef;

export interface IJsonSchemaRef extends IJsonSchemaProps {
  $ref: string;
  type?:string
}

export interface IJsonSchemaBean extends IJSObjectProps {
  $schema?: string;
  $id?: string;
  title: string;
}

export interface ITypeShape {
  // type:"string"|"number"|"object"|"array";
  comment?: string;
  jsonSchema?: SchemaProps;
}

export interface IParamShape extends ITypeShape {
  name: string;
  isInQuery?: boolean; //参数是否在路径上带着? /account/refundOrders/?id={returnOrderNo}
  isInPath?: boolean; //参数是否在路径上带着? /account/refundOrders/{returnOrderNo}
  isInBody?: boolean; //参数是请求体;
  defaultValue?: any;
}
