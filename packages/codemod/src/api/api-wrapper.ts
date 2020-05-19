/**
 * @desc
 *
 * @使用场景
 *
 * @coder.yang2010@gmail.com
 * @Date    2020/5/13
 **/
import fs from "fs";
import ApiCompileHooks from "moon-common/declarations/swagger-api/hook";
import * as fse from "fs-extra";

import fileVisitor from "file-visitor";

/**
 *  type:  'api' 表示查找的是 api 中的文件生成 api.controller.xxx ,
 *  type:  'controller' 则查找的是页面中 api.controller.xx 替换调用方法参数
 * */
type CheckType = "api" | "controller";

export default class ApiWrapperCodeMod {
  constructor(public props: any, private count) {}

  srouceDir: string = "./demo/src";

  map: {
    [controllerName: string]: {
      methodName: string;
      reqParam: string[];
    }[];
  } = {};

  apply = (hook: ApiCompileHooks) => {
    hook.beforeCompile.tap("ApiWrapperCodeMod", async (apigroups) => {
      this.map = apigroups.reduce((acc, next) => {
        acc[next.name] = next.apis.map((item) => {
          return {
            methodName: item.name,
            reqParam: item.requestParam.map((item) => item.name),
          };
        });
        return acc;
      }, {});
    });

    hook.finish.tap("ApiWrapperCodeModFinish", async () => {
      // TODO dong 2020/5/13
      await fse.writeJSON("./method-reqparam.json", this.map);

    });
  };
}
