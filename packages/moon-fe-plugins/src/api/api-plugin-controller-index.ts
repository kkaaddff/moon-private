/**
 * @desc
 *
 * @使用场景
 *
 * @coder.yang2010@gmail.com
 * @Date    2020/4/10
 **/
import MoonCore from 'moon-core';
import {join} from 'path';
import * as fse  from 'fs-extra';

export default class ApiIndex{

  _files:string[]=[];
  context:{
    workDir:string;
    config:any
  };

  apply(hook) {
    hook.init.tap('init-config',async(context:{
      workDir:string;
      config:any;
    })=>{
      this.context = context;
    });

      hook.beforeGroupCompile.tap("api-index-record",async (apiGroup)=>{
        this._files.push(apiGroup.name);
      });

      hook.afterCompile.tap("api-index",async ()=>{
        console.log('开始生成api索引文件,时间稍长,耐心等待');
        let indexInfo = MoonCore.TsIndex.genApiTsIndex({
          tsConfig: join(this.context.workDir, 'tsconfig.json'),
          apiDir: join(this.context.workDir,this.context.config.dir),
          filter:({filePath})=>{
            return this._files.some(item=>filePath.includes(item))
          },
        });
        console.log('保存api索引信息');
        //生成api索引文件::
       await fse.writeFile(join(
         join(this.context.workDir,this.context.config.dir),
         '_api-info.json',
       ), JSON.stringify(indexInfo, null, 2));
        hook.afterIndex.call(join(
          join(this.context.workDir,this.context.config.dir),
          '_api-info.json',
        ), indexInfo);
      });
  }
}
