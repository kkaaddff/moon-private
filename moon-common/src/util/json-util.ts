/**
 * @desc
 *
 * @使用场景
 *
 * @Date    2019/3/27
 **/

import * as generateSchema from 'generate-schema';
import {compile} from 'json-schema-to-typescript';
import debug from 'debug';


const log = debug('web-apis:jsonUtil');
/**
 * 将json转换为ts定义
 *
 * @param value
 * @returns {any}
 */
export async function genTsFromJSON(
  name: string,
  value: any
): Promise<IJsonTsGenResult> {
  log(`根据JSON生成ts定义文件`);
  let schema = generateSchema.json(name, value);
  let tsResult = await genTsFromSchema(name, schema);
  return {...tsResult, schema};
}

//考虑使用z隐式传参呢..

/**
 * 将json schema 转换为ts定义
 *
 * @param {string} name
 * @param jsonSchema
 * @returns {Promise<string>}
 */
export async function genTsFromSchema(
  name: string,
  jsonSchema: any,
): Promise<ITsGenResult> {
  log(`根据jsonSchema生成ts定义文件`);
  let tsContent = await compile(jsonSchema, name, {
    bannerComment: '',
    // unreachableDefinitions:true,
    // $refOptions:{
    //   parse:{
    //     definitions:parse
    //   }
    // }
  });

  let result = {
    //这是一个默认的规则;
    typeName: jsonSchema.title ? jsonSchema.title.replace(/ */gi, '') : name,
    tsContent,
  };
  return result;
}

export async function genTsFromDefines(
  definitions: {
    definitions: {[key: string]: any};
  },
  name = 'IgnoreType',
): Promise<string> {
  log(`根据jsonSchema中definitions生成ts定义文件`);

  try{
    let tsContent = await compile(definitions, name, {
      bannerComment: '',
      unreachableDefinitions: true,
    });

    tsContent =  tsContent.replace(/ \* This interface was referenced by `IgnoreType`'s JSON-Schema\n/g,"")
      .replace(/.*via the `definition`.*\n/g,"");

    return tsContent;
  }catch(err) {
      console.warn('生成ts出错',err);
      return '';
  }
}

export interface IJsonTsGenResult extends ITsGenResult {
  typeName: string;
  tsContent: string;
  schema: any;
}

export interface ITsGenResult {
  typeName: string;
  tsContent: string
}
