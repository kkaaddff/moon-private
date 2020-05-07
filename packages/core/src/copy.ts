
import * as fse from 'fs-extra'
import {join} from 'path'

(async()=>{
  let libDir=join(__dirname,"../lib");
  let sourceDir=join(__dirname);
  let targetDir =join(__dirname,"../lib/page/redux/tpl");

  fse.ensureDirSync(targetDir);

  fse.copySync(join(sourceDir,"page/redux/tpl/"),join(libDir,"page/redux/tpl/"));
  fse.copySync(join(sourceDir,"web-api/client/tpl"),join(libDir,"web-api/client/tpl"));
  fse.copySync(join(sourceDir,"typings/"),join(libDir,"../declarations/typings/"));
})();
