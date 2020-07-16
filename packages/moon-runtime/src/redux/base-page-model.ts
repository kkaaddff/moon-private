import { getDispatch, getReducerData, getSubscribe } from "./store-context";
import { Dispath } from "../typings/global";
import produce from "immer";
import * as immerUtil from "../immer-util";
import { registerReducer } from "./store-context";
import { extraPathsValue } from "./util";
import { getValueByPath } from "../immer-util";

/**
 * @desc
 *
 * @使用场景
 *
 * @coder.yang2010@gmail.com
 * @Date    2019/12/10
 **/

class BasePageModel<ModelData = any> {
  public pageKey: string;
  public dispatch: Dispath;
  public models: {
    [key: string]: any; // 这里的any可以改下呢.
  };

  //watch机制,当数据发生变化,则自动触发;
  public watch?: {
    [dataPath: string]: Function;
  };
  private actorNames: string[];

  __pageReducers = {};

  //@ts-ignore
  __initdata: ModelData = {};

  constructor(pageKey: string, models = {}) {
    this.pageKey = pageKey;
    this.dispatch = getDispatch();
    this.models = models;
    this.actorNames = Object.keys(this.models);
    this.__link();
    this.registerReducer();

    //这个地方的调用放在那里自动来调呢? TODO
    setTimeout(this.subscribe, 0);
  }

  /**
   * 通用变化;
   * @param param
   */
  commonChange = (...param: any) => {
    this.emit(`${this.pageKey}_commonChange`, extraPathsValue(...param));
  };

  /**
   * 包装一层;
   * @param {string} event
   * @param {T} payload
   */
  emit = async <T = any>(event: string, payload?: T) => {
    return this.dispatch({
      type: event,
      payload,
    });
  };

  clean = () => {
    return this.emit(`${this.pageKey}_clean`);
  };

  /**
   * 获取此页面model所有state数据;
   * @returns {ModelData}
   * @deprecated 使用state更形像化;
   */
  get data(): ModelData {
    return this.state;
  }

  get state(): ModelData {
    return this.actorNames.reduce((current, actorKey) => {
      current[actorKey] = getReducerData(
        `${this.pageKey}${actorKey[0].toUpperCase() + actorKey.substr(1)}`
      );
      return current;
    }, {}) as any;
  }

  /**
   * 动态注入reducer,
   *
   */
  registerReducer = () => {
    registerReducer(this.__pageReducers);
  };

  /**
   * 暂不实现逻辑 .;
   */
  unregisterReducer = () => {};

  //记录当前model的值,当model发生变化时,自动记录起来;
  __currentValue: {
    [modelKey: string]: any;
  };

  __unsubscribe;

  /**
   * 添加watch机制,当model存在监控值,则
   */
  private subscribe = () => {
    if (this.watch) {
      this.__unsubscribe = getSubscribe(() => {
        let previousValue = this.__currentValue;
        let currentValue = this.data;
        if (!this.isEqual(previousValue, currentValue)) {
          for (let dataPath in this.watch) {
            let _paths = dataPath.split(".");
            let oldVal = getValueByPath(previousValue, _paths);
            let newVal = getValueByPath(currentValue, _paths);

            if (oldVal !== newVal) {
              this.watch[dataPath].apply(this, [newVal, oldVal, {}]);
            }
          }

          this.__currentValue = currentValue;
        }
      });
    }
  };

  private isEqual(modelValue1, modelValue2): boolean {
    if (!modelValue1 || !modelValue2) {
      //两者都不存在 的情况;
      return modelValue1 === modelValue2;
    }

    let keys1 = Object.keys(modelValue1);
    let keys2 = Object.keys(modelValue2);

    if (keys1.length !== keys2.length) {
      return false;
    } else {
      for (let i = 0, iLen = keys1.length; i < iLen; i++) {
        if (keys1[i] !== keys2[i]) {
          return false;
        }
        if (modelValue1[keys1[i]] !== modelValue2[keys1[i]]) {
          return false;
        }
      }
    }
  }

  /**
   * 组装关联
   * @private
   */
  private __link = () => {
    for (let modelsKey in this.models) {
      //公共方法处理;
      const commonMethod = {
        init: (state, payload) => {
          state.isReady = true;
          for (let propKey in payload[modelsKey]) {
            //@ts-ignore 这里处理的不够好.
            state[propKey] = payload[modelsKey][propKey];
          }
          return state;
        },
        commonChange: (state, payload) => {
          return immerUtil.commonChange(state, { ...payload, key: modelsKey });
        },
        clean: (state, payload) => {
          let INITIAL_STATE = this.__initdata[modelsKey];
          for (let propKey in INITIAL_STATE) {
            state[propKey] = INITIAL_STATE[propKey];
          }
          return state;
        },
      };

      let reducer = this.models[modelsKey];
      let initState = this.models[modelsKey]["INITIAL_STATE"];

      let methodMap = {};
      for (let methodName in reducer) {
        if (
          reducer.hasOwnProperty(methodName) &&
          typeof reducer[methodName] === "function"
        ) {
          methodMap[`${this.pageKey}_${modelsKey}_${methodName}`] =
            reducer[methodName];
        }
      }

      for (let methodName in commonMethod) {
        if (
          commonMethod.hasOwnProperty(methodName) &&
          typeof commonMethod[methodName] === "function"
        ) {
          methodMap[`${this.pageKey}_${methodName}`] = commonMethod[methodName];
        }
      }

      this.__initdata[modelsKey] = initState;

      this.__pageReducers[
        `${this.pageKey}${modelsKey[0].toUpperCase() + modelsKey.substr(1)}`
      ] = (state, action) => {
        if (!state) {
          state = initState;
        }
        let { type, payload } = action;

        if (methodMap[type]) {
          state = produce(state, (draftState) => {
            return methodMap[type](draftState, payload);
          });
        }

        return state;
      };
    }

    //公公方法
  };
}

export default BasePageModel;
