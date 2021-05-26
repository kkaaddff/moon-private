import * as fse from 'fs-extra'
import { join } from 'path'

;(async () => {
  let libDir = join(__dirname, '../lib')
  let sourceDir = join(__dirname)
  fse.copySync(join(sourceDir, 'web-api/tpl'), join(libDir, 'web-api/tpl'))
  fse.copySync(join(sourceDir, 'typings/'), join(libDir, '../declarations/typings/'))
})()
