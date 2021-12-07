#!/usr/bin/env node

/**
 * @desc
 *
 * @使用场景
 *
 * @coder.yang2010@gmail.com
 * @Date    2020/3/24
 **/
import { genApi } from './index'
import { loadMoonConfig } from './util/config'

async function main() {
  let projectPath = process.cwd()
  let config = await loadMoonConfig()
  await genApi({
    workDir: projectPath,
    config: config.api,
  })
}

main()
