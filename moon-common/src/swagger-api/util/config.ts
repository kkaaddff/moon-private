/**
 * @desc
 *
 * @使用场景
 *
 * @coder.yang2010@gmail.com
 * @Date    2020/3/8
 **/
// import {IMoonConfig} from "moon-core/declarations/typings/config";
import {join} from "path";
import * as fse from "fs-extra";
import {IMoonConfig} from "../../../../core/src/typings/config";

export interface IBackendConfig{
  db:{
    connect:{
      host:string;
      user:string;
      password:string;
      database:string;
    };
    //保存目录;
    saveDir:string;
    plugins?:any[];
  }
}

export async function loadMoonConfig(projectDir=process.cwd()):Promise<IMoonConfig|IBackendConfig>{

  let defaulltMoonConfig: IMoonConfig;

  let JSONconfigFilePath = join(projectDir, '.moon.json');
  let jsConfigFilePath = join(projectDir, 'moon-config.js');
  try {
    if (fse.existsSync(JSONconfigFilePath)) {
      console.log('读取配置文件', JSONconfigFilePath);
      defaulltMoonConfig = await fse.readJSON(JSONconfigFilePath);
    } else if(fse.existsSync(jsConfigFilePath)) {
      console.log('读取配置文件', jsConfigFilePath);
      defaulltMoonConfig = require(jsConfigFilePath);

    } else {
      throw new Error('配置不存在:' + JSONconfigFilePath);
    }
  } catch (err) {
    console.error(err);
    throw new Error('配置读取失败:' + JSONconfigFilePath);
  }

  return defaulltMoonConfig;
}
