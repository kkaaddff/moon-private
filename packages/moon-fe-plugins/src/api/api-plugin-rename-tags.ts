/**
 * @desc
 *
 * @使用场景
 *
 * @coder.yang2010@gmail.com
 * @Date    2020/4/10
 **/
import ApiCompileHooks from "moon-common/declarations/swagger-api/hook";


export default class RenameTags{

  constructor(public maps:{[key:string]:string}={} ) {
  }

  apply(hook:ApiCompileHooks) {
    hook.swagger2ApiGroup.tap("controller Group", context => {
      for (let i = 0, iLen = context.swaggerJson.tags.length; i < iLen; i++) {
        let tag = context.swaggerJson.tags[i];
        if(this.maps[tag.name]){
          tag.description = this.maps[tag.name]
        }
      }
    });
  }
}


