/**
 * @desc
 *
 * @使用场景
 *
 * @coder.yang2010@gmail.com
 * @Date    2020/4/10
 **/
import ApiCompileHooks from "moon-common/declarations/swagger-api/hook";


export default class SwaggerJsonTransfer{
  constructor(public config: {
    transfer:(SwaggerJson:Object)=>Object;
  }) {
  }

  apply(hook:ApiCompileHooks) {
    hook.swagger2ApiGroup.tap("SwaggerJsonTransfer", context => {
      context.swaggerJson =   this.config.transfer(context.swaggerJson)
    });
  }
}


