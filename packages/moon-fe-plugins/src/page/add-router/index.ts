import {join} from 'path';
import * as fse from 'fs-extra';
import type PageModel from "moon-common/declarations/page/model/page-model";

/**
 * @desc
 *
 * @使用场景
 *
 * @coder.yang2010@gmail.com
 * @Date    2020/4/20
 **/

export interface IPageInfo{
  pagePath:string;
}

export default class AddRouter {
  contentGene?:(pageInfo:IPageInfo)=>string;

  /**
   *
   * @param targetFile   要修改的文件;
   * @param contentGene   要添加的路由内容;
   */
  constructor(public targetFile:string,contentGene?:(pageModel:PageModel)=>string) {
    this.contentGene =contentGene;
  }

  apply = async (hook) => {
    hook.beforeSave.tap('addRoute', async (options, {pageModel}) => {
      if (options.toSaveFilePath.endsWith('index.tsx')) {
        let newContent = `/*
   let ${pageModel.instanceName} =loadable(()=>import('@/pages/${pageModel.pagePath}'));
   <Route path="/${pageModel.pagePath}" component={${pageModel.instanceName}} />
 */`;
        if(this.contentGene){
          newContent =await this.contentGene(pageModel);
        }
        await fse.appendFile(this.targetFile,newContent)
      }
    });
  };
}
