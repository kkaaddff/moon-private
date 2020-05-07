#!/usr/bin/env node

/**
 * @desc
 *
 * @使用场景
 *
 * @coder.yang2010@gmail.com
 * @Date    2020/3/24
 **/
import {genApi} from "./index";
import {loadMoonConfig} from "./util/config";
import {IMoonConfig} from "moon-core/src/typings/config";


(async ()=>{
  let projectPath = process.cwd();
  let config  =( await loadMoonConfig()) as IMoonConfig;
  await genApi({
    workDir:projectPath,
    config:config.api
  });
})();
