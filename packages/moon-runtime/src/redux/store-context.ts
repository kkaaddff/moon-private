/**
 * @desc
 *
 * @使用场景
 *
 * @coder.yang2010@gmail.com
 * @Date    2019/11/23
 **/
import { combineReducers, Store, ReducersMapObject } from "redux";

var GlobalStore, GlobalReducer;

/**
 * 初始化, 获取全局store作处理;
 * @param {Store} globalStore
 * @param {ReducersMapObject} globalReducer
 */
export function init(globalStore: Store, globalReducer: ReducersMapObject) {
  GlobalStore = globalStore;
  GlobalReducer = globalReducer;
}

//动态注册reducer
let newReducer = {}; //保存动态新加的reducers
//动态注册reducer
export function registerReducer(reducerMap: { [name: string]: Function }) {
  //判断是否重复.
  for (let key in reducerMap) {
    if (GlobalReducer[key] || newReducer[key]) {
      console.warn(
        `the register reducer conflict with reducer name: ${key},please modify the reducer name`
      );
    }
  }

  newReducer = { ...newReducer, ...reducerMap }; //更新动态添加

  GlobalStore.replaceReducer(
    combineReducers({
      ...GlobalReducer,
      ...newReducer,
    })
  );
}

export function getDispatch() {
  return GlobalStore.dispatch;
}

export function getSubscribe(func: Function) {
  return GlobalStore.subscribe(func);
}
/**
 *
 * @param reducerKey
 * @returns {T}
 */
export function getReducerData<T>(reducerKey: string): T {
  return GlobalStore.getState()[reducerKey] as any;
}
