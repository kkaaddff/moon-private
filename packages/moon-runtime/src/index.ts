/**
 * @desc
 *
 * @使用场景
 *
 * @coder.yang2010@gmail.com
 * @Date    2019/11/23
 **/

import {assign, modifyDeep, commonChange} from './immer-util';
import {createMockUtil} from './mock-util';
import * as storeContext from './redux/store-context';
import {extraPathsValue} from './redux/util';
import * as actionUtil from './redux/action-util';
import BasePageModel from './redux/base-page-model';
import BaseAction from './redux/base-action';
import {on, bus,emit} from './msg';

export const redux = {
  storeContext,
  util:{extraPathsValue},
  actionUtil,
  BaseModel: BasePageModel,
  BaseAction,
};

export const msg = {
  on,
  bus,
  emit
};

export const mock = {
  createMockUtil,
};

export const immerUtil = {
  assign,
  modifyDeep,
  commonChange,
};

export const util ={
  modifyDeep,
  extraPathsValue
}
