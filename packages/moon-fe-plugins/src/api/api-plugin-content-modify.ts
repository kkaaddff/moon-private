/**
 * @desc
 *
 * @使用场景
 *
 * @coder.yang2010@gmail.com
 * @Date    2020/4/10
 **/
import MoonCore from 'moon-core';
import {join} from 'path';
import * as fse  from 'fs-extra';
import {IFileSaveOptions} from "moon-core/declarations/typings/page";

export default class ContentModify {

  constructor(public contentHandleCal:(content:string,options:IFileSaveOptions)=>string) {
  }

  apply(hook) {
    hook.beforeApiSave.tap('beforeSave-content-modify', (option, other) => {
      if(this.contentHandleCal){
        option.content =  this.contentHandleCal(option.content,option);
      }
    })
  }
}
