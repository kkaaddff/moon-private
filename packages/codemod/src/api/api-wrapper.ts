/**
 * @desc
 *
 * @使用场景
 *
 * @coder.yang2010@gmail.com
 * @Date    2020/5/13
 **/

import ApiCompileHooks from "moon-common/declarations/swagger-api/hook";
import * as fse from "fs-extra";

export default class ApiWrapperCodeMod{

  constructor() {
  }

  srouceDir:string = "./demo/src";

  map:{
    [controllerName:string]:{
      methodName:string;
      reqParam:string[]
    }[]
  }={};

  apply=(hook:ApiCompileHooks) =>{
    hook.beforeCompile.tap('ApiWrapperCodeMod',async(apigroups)=>{
      debugger;
      this.map = apigroups.reduce((acc,next)=>{
        acc[next.name] = next.apis.map(item=>{
          return {
            methodName:item.name,
            reqParam:item.requestParam.map(item=>item.name)
          }
        })
        return acc;
      },{});
    })

    hook.finish.tap('ApiWrapperCodeModFinish',async()=>{
      debugger;
       // TODO dong 2020/5/13




      await fse.writeJSON("./method-reqparam.json",this.map);
    })

  }
}
