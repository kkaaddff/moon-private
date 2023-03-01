# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [1.0.2](https://github.com/kkaaddff/moon-private/compare/v0.1.1-alpha.15...v1.0.2) (2023-03-01)

### Bug Fixes

- **buildTs:** 处理 index.ts ([8f2b208](https://github.com/kkaaddff/moon-private/commit/8f2b2080b87ed00145e95823496c4d7beb2fd9b0))
- **common:** "main": filed ([70b703d](https://github.com/kkaaddff/moon-private/commit/70b703d69f98a690a8816ff3108327d1157f0b20))
- **core、yapi:** 输出 kebab ([c652b73](https://github.com/kkaaddff/moon-private/commit/c652b7376d2dc913f716dd04c65d23938874d885))
- **corecommonmock:** 补充类型定义 ([4774add](https://github.com/kkaaddff/moon-private/commit/4774add4d95f44660600df9b12c0dc00a8b145a6))
- **core:** 重命名判断 url 和 method ([0e5315c](https://github.com/kkaaddff/moon-private/commit/0e5315cfd7f763c2e909d60213f2d33085b32dc4))
- **json-from-yapi:** Definition2Tag 增加错误提示 ([021e802](https://github.com/kkaaddff/moon-private/commit/021e802adf15d3f2582fc363905acb6a79044c12))
- **loader:** 补充 loader 类型定义 ([400d657](https://github.com/kkaaddff/moon-private/commit/400d6579c8c9695a84e2f9b6840e684f90194360))
- **mock:** 修改 mock 的目录 ([8367fde](https://github.com/kkaaddff/moon-private/commit/8367fdeec5cd77abbb094acb755fd234d4b659ad))
- **trabsfrom json:** res 结果是数组时的处理 ([48ce60b](https://github.com/kkaaddff/moon-private/commit/48ce60b5207a76300d944c1f625a0866ca09ef8e))
- **transform json:** 判断 type ([7564e9d](https://github.com/kkaaddff/moon-private/commit/7564e9dd1b1a5500552da7d0e3a5f59542f2d95b))
- **transfrom-ts-to-js:** 转换 index 文件 ([34fd6cf](https://github.com/kkaaddff/moon-private/commit/34fd6cf006f5227991b80340fa35c610abf1650d))
- **TransfromJsonFromYapiPlugin:** class 绑定 this ([0d0df5d](https://github.com/kkaaddff/moon-private/commit/0d0df5d1536386c85df42e60d36281bba1ae87c7))
- **修复 response 转换:** type 赋值 ([ac0e4b6](https://github.com/kkaaddff/moon-private/commit/ac0e4b665ed113f8824eb42238936d8fc4760ed5))
- **修复参数缺失 bug:** 混合 query 和 body 的参数取不到的情况 ([ddc50d0](https://github.com/kkaaddff/moon-private/commit/ddc50d0ee1f1f1bbc840d073509f44f826f7ff15))
- **支持 mock 数据:** mock plugin ([a199cc9](https://github.com/kkaaddff/moon-private/commit/a199cc965c148c97c31d8a06d03ab9a50e08646b))
- **配置文件类型:** 需要统一类型 ([309b31a](https://github.com/kkaaddff/moon-private/commit/309b31ac2feebbbf752ed64bf5c2274ed42aa2fa))

### Features

- **build:** 梳理依赖 ([e3a5cd2](https://github.com/kkaaddff/moon-private/commit/e3a5cd262b830a13b180614cd5ede6ad464753e8))
- **common、core:** 更新 config 和 jsapi ([d5bfe8c](https://github.com/kkaaddff/moon-private/commit/d5bfe8c3ae8d76449db120787c5f95520315acb2))
- **core、common:** 生成 index.ts ([b63dc3a](https://github.com/kkaaddff/moon-private/commit/b63dc3a50f096b108f254e26e2b0c2677593ceef))
- **core:** 类型 ([320280d](https://github.com/kkaaddff/moon-private/commit/320280de69d71831365cf258b5ed6599d8182212))
- **json yapi:** 方法名 pascal ([cca1817](https://github.com/kkaaddff/moon-private/commit/cca1817fb4bf88e0c6cce8b12b31d241f7d9defd))
- **json-schema:** 升级 json-schema ([1237381](https://github.com/kkaaddff/moon-private/commit/123738160930f1cd8de4cba7126f75908ed7b737))
- **loader-yapi,transform-yapi:** 增加扩展，发布版本 ([9ef200f](https://github.com/kkaaddff/moon-private/commit/9ef200f7b922c90d7a928be4820b3368e3ae1107))
- **loader:** loader 加载 yapi 文件 ([4b3a64d](https://github.com/kkaaddff/moon-private/commit/4b3a64d902848b2c3c82394e963217b9a452ce87))
- **loader:** 实现 loader，core 做对应改造 ([17b99eb](https://github.com/kkaaddff/moon-private/commit/17b99eb217d4a2066c958d6a5a3b50bc6d9d09ab))
- **plugin-swagger-mock:** 增加 mock 插件 ([48f627f](https://github.com/kkaaddff/moon-private/commit/48f627fe7c19b9831b492c33bbbe14ff2e46f518))
- **plugin-yapi:** 删除 ([92ccf00](https://github.com/kkaaddff/moon-private/commit/92ccf00771633a2909cab16a8afe792009ab3d65))
- **rename:** 修改包名称 ([22dbdc1](https://github.com/kkaaddff/moon-private/commit/22dbdc1c845efd54035f69a760b7a7c7cfc07fc9))
- **transfrom yapi:** 可选的自定义 method 方法名称 ([c84c2e5](https://github.com/kkaaddff/moon-private/commit/c84c2e53d4be097a3dfe02305e9d6dd9bcc18738))
- **TransfromJsonFromYapiPlugin:** 转换出参时判断 json 来源 ([6d4809e](https://github.com/kkaaddff/moon-private/commit/6d4809e0abaec4f8df5e2d9ed343add6a83de90e))
- **tsconfig:** 整理全局 tsconfig ([dd4a624](https://github.com/kkaaddff/moon-private/commit/dd4a624538ed2e4324287d99671ca2470c23c5cd))
- **vite-mock:** 模拟数据 ([9002202](https://github.com/kkaaddff/moon-private/commit/900220214b22b2a803182a682c007f6b45dac40d))
- **yapi:** 新增库依赖 ([0323736](https://github.com/kkaaddff/moon-private/commit/0323736cc4f19b26bc5235a3f016d00da35f1c89))
- **zhangqc:** 全局更新包名 ([774a776](https://github.com/kkaaddff/moon-private/commit/774a7768545ace36515d355b47bce97b5205bc65))
- **依赖:** 删除为用到的依赖 ([c4786a7](https://github.com/kkaaddff/moon-private/commit/c4786a769d21d3b766e7cc4073ad400541f6dfb3))
- **全局:** 大版本：梳理依赖关系，构建流水线，升级依赖包 ([ed7ee9e](https://github.com/kkaaddff/moon-private/commit/ed7ee9e15f99aafe2c598ac28c0b1a8a5a67e18e))
- **全局:** 整理更新依赖 ([94f4921](https://github.com/kkaaddff/moon-private/commit/94f4921249790f0eb80de0923422704f99ca4377))
- **全局:** 更新所有包的 declaration ([bcb54c9](https://github.com/kkaaddff/moon-private/commit/bcb54c9785b663c9028ee83fde8ebcdfc8a90a4a))
- **全部包:** 发布 类型定义字段 ([f50635c](https://github.com/kkaaddff/moon-private/commit/f50635c06eb5236d6ce9c14137b0b8c30b8b5998))
- **删除:** 敏感信息 ([3975089](https://github.com/kkaaddff/moon-private/commit/3975089f390fee31646fdd74860aa8531fb29193))
- **增加 loader :** 将 loader 提取成插件内置 loader ([454f31c](https://github.com/kkaaddff/moon-private/commit/454f31c5141ea11a96ee935cf746118bfb19db98))
- **增加 commitlint:** 校验提交记录 ([f9c2429](https://github.com/kkaaddff/moon-private/commit/f9c2429c05790818fd6ed7b44bbcd7c0e3698348))

### Reverts

- Revert "style(prettier 配置): 修改 prettierrc，删除 jsx 配置" ([c0beac1](https://github.com/kkaaddff/moon-private/commit/c0beac177fd819845943009ba1a69a07f117ac40))
- **yapi:** 生成 definitions ([20291a0](https://github.com/kkaaddff/moon-private/commit/20291a0826df9afbb7b04b9a3d022dfb104936ca))
