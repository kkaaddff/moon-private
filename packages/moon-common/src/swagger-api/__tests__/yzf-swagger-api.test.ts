/**
 * @desc
 *
 * @使用场景
 *
 * @Date    2019/7/26
 **/
import { tmpdir } from 'os'
import { join } from 'path'
import { readJSON, remove } from 'fs-extra'
import moonCore from '@zhangqc/moon-core'
import {
  IWebApiContext,
  IWebApiDefinded,
  IWebApiGroup,
  SchemaProps,
} from '@zhangqc/moon-core/declarations/typings/api'

describe('云帐房swaggerapi测试', () => {
  it('正常生成测试', async () => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000

    let targetDir = join(__dirname, 'data', Math.random() + '')
    console.log('临时目录为:', targetDir)

    let webapiGroups: IWebApiGroup[] = await readJSON(join(__dirname, '../data/webapi-group.json'))

    for (let i = 0, iLen = 4; i < iLen; i++) {
      let webapiGroup = webapiGroups[i]

      await moonCore.WebApiGen.buildWebApi({
        webapiGroup,
        projectPath: targetDir,
        // @ts-ignore
        beforeCompile: (apiItem: IWebApiDefinded) => {
          return apiItem
        },
        resSchemaModify: async (
          schema: SchemaProps,
          apiItem: IWebApiDefinded,
          context: IWebApiContext
        ): Promise<SchemaProps> => moonCore.SwaggerUtil.resSchemaModify(schema, apiItem, context),
      })
    }

    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000
  })
})
