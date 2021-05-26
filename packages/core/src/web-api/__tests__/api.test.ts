/**
 * @desc
 *
 * @使用场景
 *
 * @Date    2019/7/25
 **/

import { readJSON, remove } from 'fs-extra'
import { join } from 'path'

import { buildWebApi } from '..'
import { IWebApiGroup } from '../../typings/api'
import { readDirFiles } from '../../util/jest-util'

import { tmpdir } from 'os'

describe('api生成', () => {
  it('简单api生成', async () => {
    let groupArray: IWebApiGroup[] = await readJSON(join(__dirname, 'webapi-group.json'))

    let projectPath = join(tmpdir(), 'moon-temp', Math.random() + '/')

    await buildWebApi({
      projectPath: projectPath,
      webapiGroup: groupArray[0],
    })

    let content = await readDirFiles(projectPath)
    expect(content).toMatchSnapshot()
    await remove(projectPath)
  })
})
