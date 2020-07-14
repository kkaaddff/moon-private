/**
 * @desc
 *
 * @使用场景
 *
 * @coder.yang2010@gmail.com
 * @Date    2020/1/15
 **/
import mitt from "mitt";

export const bus = mitt();

export type TMsgListeners = { [eventName: string]: mitt.Handler };

export function on(listener: TMsgListeners = {}) {
  const keys = Object.keys(listener);

  for (let key of keys) {
    bus.on(key, listener[key]);
  }

  return () => {
    for (let key of keys) {
      bus.off(key, listener[key]);
    }
  };
}

export function emit(eventName: string, payload?: any) {
  bus.emit(eventName, payload);
}
