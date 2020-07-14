/**
 * @desc
 *
 * @使用场景
 *
 * @coder.yang2010@gmail.com
 * @Date    2019/12/10
 **/

import { getDispatch } from "./store-context";
import { Dispath } from "../typings/global";
import BasePageModel from "./base-page-model";

class BaseAction<DataModel = any> {
  public dispatch: Dispath;

  private pageModel: BasePageModel;

  constructor(pageModel: BasePageModel) {
    this.dispatch = getDispatch();
    this.pageModel = pageModel;
  }

  public commonChange = (...param: any) => {
    this.pageModel.commonChange(...param);
  };

  /**
   * 包装一层;
   * @param {string} event
   * @param {T} payload
   */
  public emit = <T = any>(event: string, payload?: T) => {
    this.dispatch({
      type: event,
      payload,
    });
  };

  get state(): DataModel {
    return this.pageModel.data;
  }
}

export default BaseAction;
