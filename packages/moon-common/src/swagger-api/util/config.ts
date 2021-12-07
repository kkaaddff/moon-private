/**
 * @desc
 *
 * @使用场景
 *
 * @coder.yang2010@gmail.com
 * @Date    2020/3/8
 **/
import { join } from 'path'
import * as fse from 'fs-extra'
import { IMoonConfig } from '@zhangqc/moon-core'

export interface IBackendConfig {
  db: {
    connect: {
      host: string
      user: string
      password: string
      database: string
    }
    //保存目录;
    saveDir: string
    plugins?: any[]
  }
}

export async function loadMoonConfig(projectDir = process.cwd()): Promise<IMoonConfig> {
  let defaultMoonConfig: IMoonConfig

  let jsConfigFilePath = join(projectDir, 'moon-config.js')
  let JSONconfigFilePath = join(projectDir, '.moon.json')
  try {
    if (fse.existsSync(JSONconfigFilePath)) {
      console.log('读取配置文件', JSONconfigFilePath)
      defaultMoonConfig = await fse.readJSON(JSONconfigFilePath)
    } else if (fse.existsSync(jsConfigFilePath)) {
      console.log('读取配置文件', jsConfigFilePath)
      defaultMoonConfig = require(jsConfigFilePath)
    } else {
      throw new Error(`
      配置不存在:
        ${JSONconfigFilePath},
        ${jsConfigFilePath}`)
    }
  } catch (err) {
    console.error(err)
    throw new Error('配置读取失败:' + jsConfigFilePath + ',' + JSONconfigFilePath)
  }

  return defaultMoonConfig
}
