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

type ApiFilePath=string;
type ApiIndex=any;

export interface IContext{
  moonConfig: IGenApiConfig,
  apiGroups?:IWebApiGroup[]
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

  swagger2ApiGroup=new AsyncSeriesWaterfallHook<any,IWebApiGroup[]>(['context'])

  //编辑转换之前
  beforeCompile=new SyncHook<IWebApiGroup[],GenContext>(["webApiGroup",'context']);

  beforeGroupCompile =new SyncHook<IWebApiGroup,GenContext>(["webApiGroup",'context']);

  //单个api编译时
  beforeApiCompile=new SyncHook<IWebApiDefinded>(["IWebApiDefinded"]);

  //单个api response修改时
  onResponseSchema=new SyncHook(["responseSchema",'context']);

  //controller文件存储前
  beforeApiSave =new SyncHook<IFileSaveOptions,GenContext>(["IFileSaveOptions","any"]);

  //controller文件存储后
  afterApiSave =new SyncHook<ApiFilePath,IWebApiGroup>(["ApiFilePath","IWebApiGroup"]);

  afterGroupCompile =new SyncHook<IWebApiGroup,GenContext>(["webApiGroup",'context']);

  //编辑转换之后
  afterCompile=new SyncHook<IWebApiGroup[]>(["webApiGroup",'context']);


  // beforeIndex=new SyncHook<IWebApiGroup>();
  afterIndex=new SyncHook<string,ApiIndex>();

  //结束后;
  finish=new SyncHook<GenContext>(['context']);

  //api转换

  //api加载

  //api保存前
}
