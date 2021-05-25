/**
 * @desc

 使用示例::
 let tplHandle =getHandleFile({
    outDir:context.config.saveDir,
    tplBase:join(__dirname)
  });

 await Promise.all(tables.map(async (tableInfo)=>{
    await tplHandle("domain/domain.ejs",async(tplContent)=>{
      let conent = ejs.render(tplContent, {
        tableInfo,
      });
      return conent
    })
  }));

 * @使用场景
 *
 * @Date    2019/3/26
 **/
import { join, parse } from 'path'
import * as fse from 'fs-extra'
import debug from 'debug'
import { IAction, IActorItem, ISubComp } from '@zhangqc/moon-core/src/typings/page'

const log = debug('moon:core:compile-util')

/**
 * 获取处理页面内容;;
 * 处理文件 的公共逻辑; 从模板中取出内容,渲染出来, 然后保存;
 * @param {string} outDir projectPath 项目根目录
 * @param {string} outDir 输出文件目录
 * @param {string} tplDir 模板文件目录
 *
 * @returns {(filePath: string, dealCal: (tplContent: string) => Promise<string>, param?: IHandlePageParam) => Promise<void>}
 */
export function getHandleFile({ outDir, tplBase, context }: IHandleFile) {
  return async function handlePage(
    tplPath: string,
    dealCal: (tplContent: string) => Promise<string>,
    param?: IHandlePageParam
  ) {
    let _param = {
      saveFilePath: tplPath.replace('.ejs', ''),
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

    if (context && context.beforeSave) {
      saveOptions = await context.beforeSave(saveOptions, context)
    }

    await fse.ensureDir(parse(saveOptions.toSaveFilePath).dir)
    log('output filePath: ', saveOptions.toSaveFilePath)
    fse.writeFileSync(saveOptions.toSaveFilePath, saveOptions.content)
    if (context && context.afterSave) {
      await context.afterSave(saveOptions, context)
    }
    return saveOptions.toSaveFilePath
  }
}

/**
 * 向内容中间插入数据;
 *
 * @param {string} rawContent
 * @param {IInsertOption[]} inserts
 * @returns {string}
 */
export function insertContent(rawContent: string, inserts: IInsertOption[]) {
  let content = rawContent
  for (let i = 0, ilen = inserts.length; i < ilen; i++) {
    let item: IInsertOption = inserts[i]

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
  return content
}

/**
 *
 * 向文件内容中间插入数据; 插入后再保存数据;
 * @param {string} filepath
 * @param {IInsertOption[]} inserts
 * @returns {Promise<void>}
 */
export async function insertFile(filepath: string, inserts: IInsertOption[]) {
  let rawContent = await readFile(filepath)
  let content = insertContent(rawContent, inserts)
  await fse.writeFile(filepath, content)
}

async function readFile(filePath: string): Promise<string> {
  let _tplContent = await fse.readFile(filePath)
  return _tplContent.toString()
}

interface IHandlePageParam {
  saveFilePath: string
  subComp?: ISubComp
  actor?: IActorItem
  action?: IAction
}

export interface IFileSaveOpt {
  beforeSave?: (options: IFileSaveOptions, context: any) => Promise<IFileSaveOptions>
  afterSave?: (options: IFileSaveOptions, context: any) => Promise<void>
}

export interface IHandleFile {
  outDir: string
  tplBase: string
  context?: IFileSaveOpt
}

export interface IInsertOption {
  mark: string | RegExp
  isBefore?: boolean
  content: string
  /**
   *
   * @param content
   * @returns {boolean}   验证是否需要做 true  继续,false 中断
   */
  check?: (content, rawContent) => boolean
}

export interface IFileSaveOptions {
  projectOutDir: string
  tplPath: string
  toSaveFilePath: string
  content: string
  param?: IHandlePageParam
}
