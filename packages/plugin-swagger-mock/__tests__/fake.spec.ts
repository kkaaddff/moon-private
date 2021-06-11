import * as fse from 'fs-extra'
import { genrateFakeData, cancelCircularRef } from '../src/fake-gen'
import { join } from 'path'

import * as jsf from 'json-schema-faker'
import * as $RefParser from 'json-schema-ref-parser'

jsf.option('alwaysFakeOptionals', true)
jsf.option('ignoreMissingRefs', true)
jsf.option('failOnInvalidTypes', false)
jsf.option('failOnInvalidFormat', false)

/**
 * @desc
 *
 * @使用场景
 *
 * @Date    2019/6/5
 **/

describe('循环依赖测试', () => {
  it('测试', async () => {
    let apiSchema = fse.readJSONSync(join(__dirname, 'simple-circularref.json'))
    let definitions = apiSchema.definitions
    delete apiSchema.definitions

    cancelCircularRef(apiSchema, definitions)
    let result = await genrateFakeData(apiSchema, definitions)
    expect(result).not.toBeNull()
  })
})
