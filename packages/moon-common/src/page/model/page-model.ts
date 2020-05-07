/**
 * @desc
 *
 * @使用场景
 *
 * @coder.yang2010@gmail.com
 * @Date    2020/3/14
 **/
import {IPageDefined} from 'moon-core/src/typings/page';
import ActionModel from './action-model';
import DataModel from './data-model';
import SubComponentModel from './sub-component-model';
import * as stringUtil from '../../util/string-util';

export default class PageModel {
  pageInfo: IPageDefined;

  context: any;

  constructor(pageInfo: IPageDefined, context: any) {
    this.pageInfo = pageInfo;
    this.context = context;
  }

  get title(): string {
    return this.pageInfo.title;
  }

  get pageKey(): string {
    return this.pageInfo.pagePath.replace(/\//gi, '-').replace('.', '-');
  }

  get className(): string {
    return stringUtil.toUCamelize(this.pageKey);
  }

  get instanceName(): string {
    return stringUtil.toLCamelize(this.pageKey);
  }

  get pageTitle(): string {
    return this.pageInfo.title;
  }

  get pagePath(): string {
    return this.pageInfo.pagePath;
  }

  get actions(): ActionModel[] {
    return this.pageInfo.actions.map(action => new ActionModel(action));
  }

  get dataModels(): DataModel[] {
    return this.pageInfo.models.map(model => new DataModel(model));
  }

  get subComponents(): SubComponentModel[] {
    return this.pageInfo.subComps.map(comp => new SubComponentModel(comp));
  }
}
