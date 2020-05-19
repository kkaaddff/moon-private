
import * as fse from 'fs-extra'
import {join} from 'path'

(async()=>{
  let libDir=join(__dirname,"../lib");
  let sourceDir=join(__dirname);
  let targetDir =join(__dirname,"../lib/page/page-gen/page-tpl");
  fse.ensureDirSync(targetDir);
  fse.copySync(join(sourceDir,"page/page-gen/page-tpl"),join(libDir,"page/page-gen/page-tpl"));
})();
