/**
 * @desc
 *
 * @使用场景
 *
 * @Date    2019/3/26
 **/

import * as ejs from "ejs";
import { join } from "path";
import { getHandleFile } from "../../util/compile-util";
import * as stringUtil from "../../util/string-util";
import { genTsFromDefines } from "../../util/json-util";
import { IParamShape } from "../../typings/api";
import { IWebApiContext, IWebApiDefinded } from "../../typings/api";

import debug from "debug";
import { toUCamelize } from "../../util/string-util";
import RequestParameter from "./domain/request-parameter";
const log = debug("web-api:");

//TODO 参数是file类型的处理
//TODO 类型生成重复的问题?

const Util = {
  ...stringUtil,

  getMethodName(methodName: string) {
    if (!methodName) {
      return "post";
    } else if (methodName.toLowerCase() === "export") {
      return "exportF";
    } else if (methodName.toLowerCase() === "delete") {
      return "deleteF";
    } else {
      return methodName;
    }
  },

  /**
   * 生成ts interface 名称
   * @param names
   */
  genInterfaceName(...names) {
    return `I${stringUtil.toUCamelize(names.join("-"))}`;
  },

  /**
   * 从jsonSchema中获取类型的名称;
   * @param schema
   */
  getTypeNameFromSchema(schema) {
    if (!schema) {
      return "unknown";
    }

    if (schema.title) {
      return schema.title.replace(
        /(«|»|,| )([a-zA-Z])?/gi,
        (_, __, char: string) => {
          if (char) {
            return char.toUpperCase();
          } else {
            return "";
          }
        }
      );
    } else {
      return "unknown";
    }
  },
};

/**
 * 生成webapi相关
 *
 * @param {{webapiGroup: IWebApiGroup; projectPath: string}} param
 * @returns {Promise<void>}
 */
export async function buildWebApi(context: IWebApiContext): Promise<string> {
  let { webapiGroup, projectPath } = context;
  let fileHandle = getHandleFile({
    context,
    outDir: context.projectPath,
    tplBase: join(__dirname, "tpl"),
  });
  //生成 方法入参入出参的ts定义;
  if (context.beforeCompile) {
    for (let i = 0, ilen = webapiGroup.apis.length; i < ilen; i++) {
      let apiItem = webapiGroup.apis[i];
      webapiGroup.apis[i] = await context.beforeCompile(apiItem);
    }
  }

  let tsDefinded = await generateTsDefined(context);
  //本项目公共的ts定义;
  let apiPath = await fileHandle(
    "api.ts.ejs",
    async (tplConent) => {
      let conent: string = ejs.render(tplConent, {
        Util,
        webapiGroup,
        tsDefinded,
        isInBody: (requestParams: IParamShape[]): Boolean => {
          log(`isInBody:`, requestParams);
          return !!requestParams.find((item) => item.isInBody);
        },
        isInQuery: (requestParams: IParamShape[]): Boolean => {
          log(`isInQuery:`, requestParams);
          return !!requestParams.find((item) => item.isInQuery);
        },
        getQueryParam: (requestParams: IParamShape[]): string => {
          // let result  = requestParams.filter(item=>item.isInQuery)
          //   .map(item=>`${item.name}=\${${item.name}}`).join("&");
          // if(result) {
          //   return '?'+ result;
          // }else{
          return "";
          // }
        },
      });

      return conent;
    },
    { saveFilePath: webapiGroup.name + ".ts" }
  );

  return apiPath;
}

async function generateTsDefined(context: IWebApiContext): Promise<string> {
  log(`ts定义信息: beg`);
  let { webapiGroup, resSchemaModify } = context;

  // let results = [];

  let param2RespTypes = [];

  for (let i = 0, ilen = webapiGroup.apis.length; i < ilen; i++) {
    let apiItem: IWebApiDefinded = webapiGroup.apis[i];

    for (let i = 0, ilen = apiItem.requestParam.length; i < ilen; i++) {
      let param: RequestParameter = apiItem.requestParam[i];
      //@ts-ignore
      param.jsonSchema.title = Util.genInterfaceName(
        apiItem.name,
        param.name,
        "req"
      );
      param2RespTypes.push(param.jsonSchema);
      // let {tsContent} = await genTsFromSchema(
      //   Util.genInterfaceName(apiItem.name, param.name, 'req'),
      //   param.jsonSchema as any,
      //   context,
      // );
      // results.push(tsContent);
    }

    if (apiItem.responseSchema) {
      let _resSchema = apiItem.responseSchema;
      if (resSchemaModify) {
        log(`ts定义信息: 调用resSchemaModify方法修饰返回值`);
        _resSchema = await resSchemaModify(
          apiItem.responseSchema,
          apiItem,
          context
        );
      }
      if (_resSchema) {
        if (/.*[\u4e00-\u9fa5]+.*/.test(_resSchema.title)) {
          console.warn(
            "model title中包含中文会导致生成ts失败,请检查" + apiItem.name
          );
        }
        //title为空, 或者中文.
        if (!_resSchema.title) {
          _resSchema.title = toUCamelize(apiItem.name + apiItem.method + "Res");
        }
        apiItem.responseSchema = _resSchema;
        if (_resSchema) {
          param2RespTypes.push(_resSchema);
        }
      }
    }
  }

  for (let i = 0, ilen = param2RespTypes.length; i < ilen; i++) {
    let item = param2RespTypes[i];
    context.webapiGroup.definitions[item.title] = item;
  }

  let content = await genTsFromDefines({
    definitions: context.webapiGroup.definitions,
  });

  return content;
}

//https://json-schema.org/latest/json-schema-validation.html#numeric

//https://json-schema.org/latest/json-schema-validation.html#string

//https://json-schema.org/latest/json-schema-validation.html#rfc.section.6.4
