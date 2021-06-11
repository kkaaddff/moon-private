/**
 * @desc
 *
 * @使用场景
 *
 * @coder.yang2010@gmail.com
 * @Date    2020/4/10
 **/
import * as fakeGen from './fake-gen'
import * as fse from 'fs-extra'
import { join } from 'path'
import { TLanguage } from './fake-gen'

export class SwaggerMock {
  language: TLanguage

  constructor(config: SwaggerConfig) {
    this.language = config?.lang ?? 'en'
  }

  apply(hook) {
    let mockItem: MockRepos

    hook.onResponseSchema.tap('plugin-api-swagger-mock', async (resSchema, context) => {
      let { apiItem, apiGroup: webapiGroup, apiDir } = context
      let { name: controlFileName } = webapiGroup
      let { url, methodName: method, name } = apiItem

      if (!mockItem) {
        mockItem = new MockRepos(join(apiDir, 'mock'))
      }

      // TODO dong 2020/4/10  如果遇到生成问题 , 能不能中断??/
      let mockFile: IMockFile = mockItem.getMockFile(controlFileName)

      let mockMethod: IMock = mockFile.mocks.find(
        (item) => item.url === url && item.method === method
      )

      if (!mockMethod) {
        mockMethod = {
          url,
          controller: {
            name: controlFileName,
            method: name,
          },
          method,
          data: null,
        }

        mockFile.mocks.push(mockMethod)
      }

      if (!mockMethod.data) {
        try {
          console.log(
            `当前Controller:  ${webapiGroup.name}:['${apiItem.name}'],如果过进入infinite loop . 请设置moon.config :api.mock.ignoreApi`
          )

          let json = await fakeGen.genrateFakeData(
            resSchema,
            webapiGroup.definitions,
            this.language
          )

          mockMethod.data = json
          console.log('fake data!!')
        } catch (err) {
          //TODO 这里把出错的数据记录下来后面分析出错的原因;;
          console.error(err, '解析数据出错;;')
        }
      }
    })

    hook.afterIndex.tap('plugin-api-swagger-mock-save', async () => {
      await mockItem.save()
    })
  }
}

class MockRepos {
  apiMockDir: string
  repos: { [controllerName: string]: IMockFile } = {}

  constructor(apiMockDir: string) {
    this.apiMockDir = apiMockDir
  }

  /**
   * 获取mock内容
   * @param controller
   */
  getMockFile(controller: string): IMockFile {
    if (!this.repos[controller]) {
      let filePath = join(this.apiMockDir, controller + '.json')
      fse.ensureFileSync(filePath)
      this.repos[controller] = {
        name: controller,
        filePath,
        mocks: [],
      }
    }

    return this.repos[controller]
  }

  async save() {
    await Promise.all(
      Object.values(this.repos).map((mockFile) => {
        return fse.writeJson(mockFile.filePath, mockFile.mocks, { spaces: 2 })
      })
    )
  }
}

export interface SwaggerConfig {
  lang: TLanguage
  mocks: IMock[]
}

export interface IMockFile {
  //eg:currency-rate-controller
  name: string
  filePath: string
  mocks: IMock[]
}

export interface IMock {
  url: string
  method: string
  data: any
  controller: {
    name: string
    method: string
  }
}
