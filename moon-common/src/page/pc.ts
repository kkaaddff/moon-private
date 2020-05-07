import MoonCore from 'moon-core';
import * as fse from 'fs-extra';
import {join} from 'path';

import PageModel from './model/page-model';
import {IPageDefined} from 'moon-core/src/typings/page';
import {IMoonConfig} from 'moon-core/src/typings/config';
import {applyHook} from '../util/hook-util';
import * as util from '../util';
import PageCompileHooks from './hook';

export interface IGenPageContext {
  projectPath: string;
  pageModel:PageModel;
  pageInfo: IPageDefined;
  prettiesConfig?: object;
  config: IMoonConfig;
}

/**
 * 生成页面;
 * @param {{projectPath: string}} params
 */
export async function genPage(context: IGenPageContext): Promise<string> {
  let {pageInfo, projectPath, config} = context;
  let prettiesConfig = {};
  try {
    prettiesConfig = await fse.readJSON(join(projectPath, 'pretties.json'));
  } catch (err) {}

  let hookInstance = new PageCompileHooks();

  try {
    config.page &&
      config.page.plugins &&
      config.page.plugins.map(item => {
        applyHook(hookInstance, item);
      });
  } catch (err) {
    console.error(err);
  }
  let pageModel = new PageModel(pageInfo, context);
  context.pageModel=pageModel;

  let _gene = await hookInstance.loadGeneratorEngine.promise(context);
  if (_gene && typeof _gene === 'function') {
    //@ts-ignore
    await _gene(pageModel, {...context,util},);
    return;
  }

  return MoonCore.ReduxGen.buildPage({
    //默认行为; 外部可以覆盖.
    beforeSave: async (options, context) => {
      //@ts-ignore
      await (hookInstance && hookInstance.beforeSave.call(options, context));
      return options;
    },
    afterSave: async (options, context) => {
      //@ts-ignore
      hookInstance && hookInstance.afterSave.call(options, context);
    },
    prettiesConfig,
    ...context,
  });
}
