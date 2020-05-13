/**
 * @desc
 *
 * @使用场景
 *
 * @coder.yang2010@gmail.com
 * @Date    2019/12/26
 **/
import {
  AsyncSeriesHook,
  AsyncSeriesWaterfallHook,
  SyncHook
} from "tapable";


import {IMoonConfig} from 'moon-core/declarations/typings/config';
import {
  IWebApiContext,
  IWebApiDefinded,
  IWebApiGroup,
  SchemaProps,
} from 'moon-core/declarations/typings/api';
import {IFileSaveOptions} from "moon-core/declarations/typings/page";
import {IGenApiConfig} from "./index";
import ApiGroup from "moon-core/declarations/web-api/client/domain/api-group";

type ApiFilePath=string;
type ApiIndex=any;

export interface IContext{
  moonConfig: IGenApiConfig,
  apiGroups?:ApiGroup[]
}

export interface GenContext{
  config: IGenApiConfig;
  workDir:string;
}

export type ErrorMsg ={
  level:"warn"|"error";
  message:string;
};

/**
 * api可编译hook
 */
export default class ApiCompileHooks {

  init=new AsyncSeriesHook<GenContext>(['context']);

  onError=new AsyncSeriesHook<ErrorMsg,IContext>(['errorMsgs','context']);

  loadApiGroup=new AsyncSeriesWaterfallHook<IContext>(["context"]);

  loadSwagger = new SyncHook<{
    moonConfig:IGenApiConfig;
    swaggerJson?:any
  }>(["context"]);

  swagger2ApiGroup=new AsyncSeriesWaterfallHook<any,ApiGroup[]>(['context'])

  //编辑转换之前
  beforeCompile=new SyncHook<ApiGroup[],GenContext>(["webApiGroup",'context']);

  beforeGroupCompile =new SyncHook<ApiGroup,GenContext>(["webApiGroup",'context']);

  //单个api编译时
  beforeApiCompile=new SyncHook<IWebApiDefinded>(["IWebApiDefinded"]);

  //单个api response修改时
  onResponseSchema=new SyncHook(["responseSchema",'context']);

  //controller文件存储前
  beforeApiSave =new SyncHook<IFileSaveOptions,GenContext>(["IFileSaveOptions","any"]);

  //controller文件存储后
  afterApiSave =new SyncHook<ApiFilePath,ApiGroup>(["ApiFilePath","ApiGroup"]);

  afterGroupCompile =new SyncHook<ApiGroup,GenContext>(["webApiGroup",'context']);

  //编辑转换之后
  afterCompile=new SyncHook<ApiGroup[]>(["webApiGroup",'context']);


  // beforeIndex=new SyncHook<ApiGroup>();
  afterIndex=new SyncHook<string,ApiIndex>();

  //结束后;
  finish=new SyncHook<GenContext>(['context']);

  //api转换

  //api加载

  //api保存前
}
