/**
 * @desc
 *
 * @使用场景
 *
 * @coder.yang2010@gmail.com
 * @Date    2019/12/26
 **/
import {
  AsyncSeriesWaterfallHook,
  SyncHook
} from "tapable";

import {IFileSaveOptions} from "moon-core/declarations/typings/page";
import {IContext} from "../../../core/src/typings/page";
import {IPageGenerator} from "./index";

type SaveFilePath=string;
type ApiIndex=any;
/**
 * api可编译hook
 */
export default class PageCompileHooks {

  loadGeneratorEngine = new AsyncSeriesWaterfallHook<any,IPageGenerator>(['context'])

  beforeSave=new SyncHook<IFileSaveOptions,IContext>(["options",'context']);

  afterSave=new SyncHook<IFileSaveOptions,IContext>(['SaveFilePath',"options",'context']);

  // beforeApiCompile=new SyncHook<IWebApiDefinded>(["IWebApiDefinded"]);
  //
  // beforeApiSave =new SyncHook<IFileSaveOptions,any>(["IFileSaveOptions","any"]);
  //
  // afterApiSave =new SyncHook<ApiFilePath,IWebApiGroup>(["ApiFilePath","IWebApiGroup"]);
  //
  // // beforeIndex=new SyncHook<IWebApiGroup>();
  //
  // afterIndex=new SyncHook<string,ApiIndex>();
}
