import * as fse from "fs-extra";
import { join } from "path";

(async () => {
  let libDir = join(__dirname, "../lib");
  // let sourceDir=join(__dirname);
  // let targetDir =join(__dirname,"../lib/page/redux/tpl");

  // fse.ensureDirSync(targetDir);
  // fse.copySync(join(sourceDir,"db/mysql/gene/tpl"),join(libDir,"db/mysql/gene/tpl"));
})();
