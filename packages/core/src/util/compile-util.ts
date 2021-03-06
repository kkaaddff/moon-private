/**
 * @desc
 *
 * @使用场景
 *
 * @Date    2019/3/26
 **/
import { join, parse } from 'path'
import * as fse from 'fs-extra'
import * as prettier from 'prettier'
import {
  IHandleFile,
  IHandlePageParam,
  IInsertImportDeclaration,
  IInsertOption,
} from '../typings/util'
import debug from 'debug'
import {
  ModuleKind,
  ModuleResolutionKind,
  ObjectLiteralExpression,
  Project,
  ScriptTarget,
} from 'ts-morph'
import { IFileSaveOptions } from '../typings/page'

const log = debug('moon:core:compile-util')

export const DefaultTsconfig = {
  compilerOptions: {
    target: ScriptTarget.ESNext, // ts-morph 内部定义 ScriptTarget
    allowJs: true,
    strict: false,
    lib: ['dom', 'esnext'],
    module: ModuleKind.ESNext, // ts-morph 内部定义
    outDir: './src/api',
    declaration: true,
    moduleResolution: ModuleResolutionKind.NodeJs, // ts-morph 内部定义
    noUnusedLocals: false,
    noUnusedParameters: false,
    esModuleInterop: true,
  },
}

export const DefaultPrettiesConfig = {
  tabWidth: 2,
  endOfLine: 'lf',
  printWidth: 100,
  singleQuote: true,
  semi: false,
  trailingComma: 'es5',
  parser: 'typescript',
  ...fse.readJsonSync('.prettierrc', { throws: false }),
}

/**
 * 获取处理页面内容;;
 * 处理文件 的公共逻辑; 从模板中取出内容,渲染出来, 然后保存;
 * @param {string} outDir projectPath 项目根目录
 * @param {string} outDir 输出文件目录
 * @param {string} tplDir 模板文件目录
 *
 * @returns {(filePath: string, dealCal: (tplContent: string) => Promise<string>, param?: IHandlePageParam) => Promise<void>}
 */
export function getHandleFile({ outDir, tplBase, context, prettiesConfig = {} }: IHandleFile) {
  prettiesConfig = {
    ...DefaultPrettiesConfig,
    ...prettiesConfig,
  }

  return async function handlePage(
    tplPath: string,
    dealCal: (tplContent: string) => Promise<string>,
    param?: IHandlePageParam
  ) {
    let _param = {
      saveFilePath: tplPath.replace('.tpl', '').replace('.ejs', ''),
      ...param,
    }
    let _tplFilePath = join(tplBase, tplPath)

    let _tplContent = await fse.readFile(_tplFilePath)
    log('开始处理模板: ', _tplFilePath)
    let content = await dealCal(_tplContent.toString())

    let saveOptions: IFileSaveOptions = {
      projectOutDir: '',
      tplPath,
      toSaveFilePath: join(outDir, _param.saveFilePath),
      param,
      content,
    }

    //自定义前后都格式化下.避免多种判断问题...
    try {
      saveOptions.content = prettier.format(saveOptions.content, prettiesConfig)
    } catch (err) {
      if (tplPath.endsWith('.ts.ejs')) {
        console.warn(err)
      }
    }

    await fse.ensureDir(parse(saveOptions.toSaveFilePath).dir)
    try {
      saveOptions.content = prettier.format(saveOptions.content, prettiesConfig)
    } catch (err) {
      console.warn(`格式化失败::${err}`)
    }

    if (context.beforeSave) {
      saveOptions = await context.beforeSave(saveOptions, context)
    }

    log('output filePath: ', saveOptions.toSaveFilePath)

    fse.writeFileSync(saveOptions.toSaveFilePath, saveOptions.content)

    if (context.afterSave) {
      await context.afterSave(saveOptions, context)
    }

    return saveOptions.toSaveFilePath
  }
}

/**
 * 向内容中间插入数据;
 *
 * @param rawContent
 * @param inserts
 */
export function insertContent(rawContent: string, inserts: IInsertOption[]) {
  let content = rawContent
  for (let i = 0, ilen = inserts.length; i < ilen; i++) {
    let item = inserts[i]

    if (!item.check || item.check(content, rawContent)) {
      let markContent, index
      if (item.mark instanceof RegExp) {
        let [matchContent] = content.match(item.mark)
        if (matchContent) {
          index = content.indexOf(matchContent)
          markContent = matchContent
        } else {
          throw new Error('内容未匹配到标记点')
        }
      } else {
        index = content.indexOf(item.mark)
        if (index > 0) {
          markContent = item.mark
          index = content.indexOf(item.mark)
        } else {
          throw new Error('内容未匹配到标记点')
        }
      }

      if (!item.isBefore) {
        index = index + markContent.length
      }
      content = `${content.substring(0, index)}
      ${item.content} 
      ${content.substring(index)}`
    }
  }
  content = prettier.format(content, DefaultPrettiesConfig)
  return content
}

/**
 * 生成 index.ts  索引文件
 * @param filepath 索引文件路径 index.ts
 * @param inserts
 * @returns
 */
export function genIndexContentByTs(filepath: string, inserts: IInsertImportDeclaration[]) {
  const project = new Project(DefaultTsconfig)

  let sourceFile = project.addSourceFileAtPath(filepath)
  const importsText = sourceFile.getImportDeclarations().map((item) => item.getText())

  inserts.map((item) => {
    if (!importsText.find((text) => text.includes(item.namespaceImport))) {
      sourceFile.addImportDeclaration({
        namespaceImport: item.namespaceImport,
        moduleSpecifier: item.moduleSpecifier,
      })

      const ExportAssignment = sourceFile.getExportAssignment((d) => !d.isExportEquals())
      const objectLiteralExpression = ExportAssignment.getExpression() as ObjectLiteralExpression

      objectLiteralExpression.addShorthandPropertyAssignment({
        name: item.namespaceImport,
      })
    }
  })

  let content = sourceFile.getFullText()
  content = prettier.format(content, DefaultPrettiesConfig)
  return content
}

/**
 *
 * 向文件内容中间插入数据; 插入后再保存数据;
 * @param filepath
 * @param inserts
 */
export async function insertFile(filepath: string, inserts: IInsertImportDeclaration[]) {
  let content = genIndexContentByTs(filepath, inserts)
  await fse.writeFile(filepath, content)
}

async function readFile(filePath: string): Promise<string> {
  let _tplContent = await fse.readFile(filePath)
  return _tplContent.toString()
}
