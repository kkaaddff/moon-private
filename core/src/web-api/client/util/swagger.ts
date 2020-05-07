import {
  IJSObjectProps,
  IWebApiContext,
  IWebApiDefinded,
  IWebApiGroup,
  SchemaProps,
} from '../../../typings/api';
import {toLCamelize} from '../../../util/string-util';

export function resSchemaModify(
  schema: SchemaProps,
  apiItem: IWebApiDefinded,
  context: IWebApiContext,
  wrapper?: string,
): SchemaProps {
  //api外了一层. 所有内容均把data提取出来d即可..
  if (!schema) {
    return schema;
  }

  if(apiItem.name==='sendSms_POST_4'){
  }

  if (!schema['originalRef'] && schema['$ref']) {
    schema['originalRef'] = schema['$ref'].replace('#/definitions/', '');
  }

  //@ts-ignore;
  if (schema['originalRef'] === 'BaseResponse') {
    return null;
  } else if (schema['$ref']) {
    // console.log('schema[\'$ref\']',schema);
    let subSchema = context.webapiGroup.definitions[
      schema['originalRef']
    ] as IJSObjectProps;

    if (!subSchema) {
      return null;
    }

    if (
      wrapper &&
      subSchema.type === 'object' &&
      subSchema.properties &&
      subSchema.properties[wrapper]
    ) {
      if (subSchema.properties[wrapper]['$ref']) {
        return context.webapiGroup.definitions[
          subSchema.properties[wrapper]['originalRef'] ||
            subSchema.properties[wrapper]['$ref'].replace('#/definitions/', '')
        ];
      } else if (subSchema.properties[wrapper]['type'] === 'array') {
        //@ts-ignore
        if(!(subSchema.properties[wrapper].items.originalRef ||subSchema.properties[wrapper].items['$ref'])){
          return null
        }
        let arrayAschema = subSchema.properties[wrapper];
        arrayAschema.title =
          //@ts-ignore
          (subSchema.properties[wrapper].items.originalRef ||
            //@ts-ignore
            subSchema.properties[wrapper].items['$ref'].replace(
              '#/definitions/',
              '',
            )) + 'Array';
        return arrayAschema;
      } else {
        return subSchema.properties[wrapper];
      }
    } else {
      return schema;
    }
  } else {
    return schema;
  }
}

export function addDef2List(
  definitions: {
    [defName: string]: SchemaProps;
  },
  schema: SchemaProps | SchemaProps[],
) {
  if (schema instanceof Array) {
    for (let i = 0, iLen = schema.length; i < iLen; i++) {
      let schemaItem = schema[i];

      if (!definitions[schemaItem.title]) {
        definitions[schemaItem.title] = schemaItem;
      }
    }
  } else {
    if (!definitions[schema.title]) {
      definitions[schema.title] = schema;
    }
  }
}

export function findAllRefType(
  definitions: {
    [defName: string]: SchemaProps;
  },
  obj: any,
  refs: string[] = [],
): SchemaProps[] {
  if (!obj) {
    return [];
  }

  let refLeng = refs.length;
  traverseObj(obj, refs);

  let results = [];

  if (obj && !obj.$ref) {
    results.push(obj);
  }

  for (let i = refLeng, ilen = refs.length; i < ilen; i++) {
    let ref = refs[i].replace('#/definitions/', '');

    if (ref && definitions[ref]) {
      results.push(definitions[ref]);
      //遍历对象, 至到找到所有的引用内容为至;
      let jlen = refs.length;
      traverseObj(definitions[ref], refs);
      // console.log('子 traverseObj',refs);
      if (refs.length > jlen) {
        //有新的ref添加进来..

        for (let j = jlen, allen = refs.length; j < allen; j++) {
          results = results.concat(
            findAllRefType(
              definitions,
              definitions[refs[j].replace('#/definitions/', '')],
              refs,
            ),
          );
        }
      }
    }
  }

  return results;
}

/**
 * 遍历 对象 寻找 ref类型.
 */
function traverseObj(obj: object, refs: string[] = []) {
  for (let key in obj) {
    if (obj.hasOwnProperty(key) && key === '$ref') {
      if (!refs.includes(obj[key])) {
        refs.push(obj[key]);
      }
    } else if (typeof obj[key] === 'object') {
      traverseObj(obj[key], refs);
    }
  }
  return refs;
}

export interface ITag {
  name: string;
  description: string;
}

export interface IResponseDef {
  description: string;
  schema: SchemaProps;
}

export interface ISwaggerInfo {
  description: string;
  version: string;
  title: string;
  contact: {
    name: string;
    url: string;
    email: string;
  };
}

export interface IMethodDefinded {
  tags: string[];
  summary: string;
  operationId: string;
  produces: string[];
  parameters: any[];
  responses: {
    [status: string]: IResponseDef;
  };
  deprecated: boolean;
}

export interface IApiDefinded {
  get?: IMethodDefinded;
  post?: IMethodDefinded;
  [methodType: string]: IMethodDefinded;
}

export interface ISwaggerApisDocs {
  swagger: string;
  host: string;
  basePath: string;
  info: ISwaggerInfo;
  tags: ITag[];
  paths: {
    [apiUrl: string]: IApiDefinded;
  };
  definitions: {
    [defName: string]: SchemaProps;
  };
}


export interface OnError{
  (param:{level:"warn"|"error",message:string}):void;
}

const nameCheckReg= /^[0-9a-zA-Z_\-«»]*$/
/**
 * 转换项目
 * @param {ISwaggerApisDocs} apiDocs
 * @returns {IWebApiGroup[]}
 */
export function transfer(apiDocs: ISwaggerApisDocs,onError:OnError=({message})=>console.error(message)): IWebApiGroup[] {
  //分组;
  let apiGroups: IWebApiGroup[] = [];
  let tag2DescMap:{[name:string]:string} =apiDocs.tags.reduce((acc,next)=>{
    acc[next.name]=  next.description.split(" ").map(toLCamelize).join("-");
    return acc;
  },{});
  let checksContents  = [...Object.keys(apiDocs.definitions),...Object.values(tag2DescMap)];

  //验证数据是否正确的.
  for (let i = 0, iLen = checksContents.length; i < iLen; i++) {
    let checksContent = checksContents[i];
    if(!nameCheckReg.test(checksContent)) {
      let message =`apiDocs.definitions或tags::包含非法字符,${checksContent},影响前端代码生成!`;
      onError && onError({level:"warn",message});
    }
  }

  for (let defName in apiDocs.definitions) {
    try {
      if (!apiDocs.definitions[defName].title) {
        apiDocs.definitions[defName].title = defName;
      }
    } catch (err) {
    }
  }

  let temp = {};
  let KeyMap:{[controllerName:string]:IWebApiGroup} = {};
  for (let url in apiDocs.paths) {
    let apiItem: IApiDefinded = apiDocs.paths[url];

    let groupKey = '';

    for (let method in apiItem) {
      let apiDefItem: any = {url, method};
      let methodInfo: IMethodDefinded = apiItem[method];

      groupKey = tag2DescMap[methodInfo.tags[0]]; //controller

      if (!KeyMap[groupKey]) {
        KeyMap[groupKey] = {
          name: groupKey,
          serverInfo:{
            host:apiDocs.host,
            ...apiDocs.info
          },
          apis: [],
          definitions: {},
        };
      }

      temp[url] = {url, methodName: methodInfo.operationId, group: groupKey};

      apiDefItem.name = toLCamelize(methodInfo.operationId)
        .replace(/UsingPOST.*/gi, '')
        .replace(/UsingPUT.*/gi, '')
        .replace(/UsingHEAD.*/gi, '')
        .replace(/UsingOPTIONS.*/gi, '')
        .replace(/UsingPATCH.*/gi, '')
        .replace(/UsingGET.*/gi, '')
        .replace(/UsingDELETE.*/gi, '');



      if(!(KeyMap[groupKey].apis.every(methodItem => methodItem.name !== apiDefItem.name))){
        console.warn('api名字相同::',groupKey,apiDefItem.name);
        continue;
      }

      //检查名字如果重复则添加一个get pot等信息;
      // console.log(KeyMap[groupKey].apis.every(methodItem => methodItem.name !== apiDefItem.name),apiDefItem.name,KeyMap[groupKey].apis.map(item=>item.name).join(",") )
     // console.log('apiDefItem.name==>',apiDefItem.name);
      if (!KeyMap[groupKey].apis.every(methodItem => methodItem.name !== apiDefItem.name)
      ) {
        apiDefItem.name =
          apiDefItem.name +
          '_' +
          methodInfo.operationId.substr(
            methodInfo.operationId.indexOf('Using') + 5,
          );
      }

      apiDefItem.comment = methodInfo.summary;

      apiDefItem.requestParam = (methodInfo.parameters || [])
        .filter(item => item.in != 'header')
        //spring error根据参数传递过来
        .filter(item => !(item.name === 'errors' && item.schema &&item.schema["$ref"]==='#/definitions/Errors'))
        .filter(item=>!item.name.startsWith("userInfo"))
        .map(item => {
          if (item.schema) {
            addDef2List(
              KeyMap[groupKey].definitions,
              findAllRefType(apiDocs.definitions, item.schema),
            );
          }

          return {
            name: getParamName(item.name),
            isInQuery: item.in === 'query' ? true : false,
            isInPath: item.in === 'path' ? true : false,
            isInBody: item.in === 'body' ? true : false,
            comment: item.description,
            jsonSchema: item.schema ? item.schema : item,
          };
        });
      apiDefItem.responseSchema = methodInfo.responses['200'].schema;
      addDef2List(
        KeyMap[groupKey].definitions,
        findAllRefType(apiDocs.definitions, apiDefItem.responseSchema),
      );
      KeyMap[groupKey].apis.push(apiDefItem);
    }
  }

  for (let key in KeyMap) {
    apiGroups.push(KeyMap[key]);
  }
  return apiGroups;
}

let ParamNameExclude = ['function','export','delete'];

function getParamName(paramName:string) {
  if(ParamNameExclude.includes(paramName)){
    return paramName+"_";
  }else if(paramName.includes("[]")) {
    return paramName.replace("[]",'');
  }else{
    return paramName;
  }
}
