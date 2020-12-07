/**
 * @desc
 *
 * @使用场景
 *
 * @Date    2019/3/26
 **/
import { join, parse } from "path";
import * as fse from "fs-extra";
import debug from "debug";

const log = debug("moon:core:file-util");

/**
 * 向内容中间插入数据;
 *
 * @param {string} rawContent
 * @param {IInsertOption[]} inserts
 * @returns {string}
 */
export function insertContent(rawContent: string, inserts: IInsertOption[]) {
  let content = rawContent;
  for (let i = 0, ilen = inserts.length; i < ilen; i++) {
    let item: IInsertOption = inserts[i];

    if (!item.check || item.check(content, rawContent)) {
      let markContent, index;
      if (item.mark instanceof RegExp) {
        let [matchContent] = content.match(item.mark);
        if (matchContent) {
          index = content.indexOf(matchContent);
          markContent = matchContent;
        } else {
          throw new Error("内容未匹配到标记点");
        }
      } else {
        index = content.indexOf(item.mark);
        if (index > 0) {
          markContent = item.mark;
          index = content.indexOf(item.mark);
        } else {
          throw new Error("内容未匹配到标记点");
        }
      }

      if (!item.isBefore) {
        index = index + markContent.length;
      }
      content = `${content.substring(0, index)}
      ${item.content} 
      ${content.substring(index)}`;
    }
  }
  return content;
}

/**
 *
 * 向文件内容中间插入数据; 插入后再保存数据;
 * @param {string} filepath
 * @param {IInsertOption[]} inserts
 * @returns {Promise<void>}
 */
export async function insertFile(filepath: string, inserts: IInsertOption[]) {
  let rawContent = await readFile(filepath);
  let content = insertContent(rawContent, inserts);
  await fse.writeFile(filepath, content);
}

async function readFile(filePath: string): Promise<string> {
  let _tplContent = await fse.readFile(filePath);
  return _tplContent.toString();
}


export interface IInsertOption {
  mark: string|RegExp;
  isBefore?: boolean;
  content: string;
  /**
   *
   * @param content
   * @returns {boolean}   验证是否需要做 true  继续,false 中断
   */
  check?: (content, rawContent) => boolean;
}
