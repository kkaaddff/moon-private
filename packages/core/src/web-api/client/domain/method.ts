/**
 * @desc
 *
 * @使用场景
 *
 * @coder.yang2010@gmail.com
 * @Date    2020/5/12
 **/
import { IMethodDefinded } from "../util/swagger";
import { toLCamelize } from "../../../util/string-util";
import RequestParameter from "./request-parameter";
import { SchemaProps } from "../../../typings/api";
import { toUCamelize } from "../util/string-util";

export type MethodName = "POST" | "GET" | "UPDATE" | "DELETE" | "OPTIONS";
export default class Method {
  constructor(
    public methodInfo: IMethodDefinded,
    public methodInfoOptions: {
      url: string;
      method: MethodName | string;
    }
  ) {}

  private _name: string;

  get methodName() {
    return this.methodInfoOptions.method;
  }
  get url(): string {
    return this.methodInfoOptions.url;
  }
  /**
   * 方法名称;
   */
  get name(): string {
    if (!this._name) {
      this._name = toLCamelize(this.methodInfo.operationId)
        .replace(/UsingPOST.*/gi, "")
        .replace(/UsingPUT.*/gi, "")
        .replace(/UsingHEAD.*/gi, "")
        .replace(/UsingOPTIONS.*/gi, "")
        .replace(/UsingPATCH.*/gi, "")
        .replace(/UsingGET.*/gi, "")
        .replace(/UsingDELETE.*/gi, "");
      return this._name;
    } else {
      return this._name;
    }
  }

  set name(newName: string) {
    this._name = newName;
  }

  /**
   * 备注信息;
   */
  get comment(): string {
    return this.methodInfo.summary;
  }

  private params: RequestParameter[];

  get requestParam(): RequestParameter[] {
    if (!this.params) {
      this.params = (this.methodInfo.parameters || [])
        .filter((item) => item.in != "header")
        //spring error根据参数传递过来
        .filter(
          (item) =>
            !(
              item.name === "errors" &&
              item.schema &&
              item.schema["$ref"] === "#/definitions/Errors"
            )
        )
        .filter((item) => !item.name.startsWith("userInfo"))
        .map((item) => {
          return new RequestParameter(item, { ownedMethod: this });
        });
    }

    return this.params;
  }

  getObjectJsonSchemas() {}

  private _responseSchma;
  get responseSchema(): SchemaProps {
    if (!this._responseSchma) {
      this._responseSchma = this.methodInfo.responses["200"].schema;
      if(this._responseSchma ) {
        this._responseSchma.title = toUCamelize( this.name + "Res");
      }
    }
    return this._responseSchma;
  }

  set responseSchema(res) {
    this._responseSchma = res;

    if(this._responseSchma ){
      this._responseSchma.title = toUCamelize( this.name + "Res");
    }
  }

  tplGetMethodType() {
    return this.methodInfoOptions.method.toLocaleLowerCase();
  }

  tplGetMethodName() {
    let methodName = this.name;
    if (!methodName) {
      return "post";
    } else if (methodName.toLowerCase() === "export") {
      return "exportF";
    } else if (methodName.toLowerCase() === "delete") {
      return "deleteF";
    } else {
      return methodName;
    }
  }

  /**
   * 模板:
   * 获取入参内容;
   */
  tplGetRequestParamContent(): string {
    let param = ``,
      typeStr = ``;
    if (this.requestParam.length) {
      typeStr = this.requestParam
        .map((item) => {
          let typeStr = item.tplGenInterfaceName();
          if (item.isBasicType()) {
            typeStr = item.getBasicTsType();
          }
          return `${
            item.comment ? "\n/*" + item.comment + "*/\n" : ""
          }${item.name + (item.isRequired ? "" : "?")}:${typeStr}`;
        })
        .join(";");
      param = `param:{${typeStr}}`;
    }

    return param;
  }

  tplGetUrl(): string {
    return `\`${this.url.replace(/{/g, "${param.")}\``;
  }

  // getQueryParam(apiItem.requestParam)
  tplGetBodyParam(): string {
    let paramItem = this.requestParam.filter((item) => item.isInBody);
    if (
      paramItem.length === 1 &&
      (["date", "file", "array"].includes(paramItem[0].jsonSchema.type) ||
        // @ts-ignore
        paramItem[0].jsonSchema.$ref)
    ) {
      return `param.${paramItem[0].name}`;
    } else {
      return `{${paramItem
        .map((item) => `${item.name}:param.${item.name}`)
        .join(",\n")}}`;
    }
  }

  tplGetQueryParam(): string {
    let paramItem = this.requestParam.filter((item) => item.isInQuery);
    if (
      paramItem.length === 1 &&
      (["date", "file", "array"].includes(paramItem[0].jsonSchema.type) ||
        // @ts-ignore
        paramItem[0].jsonSchema.$ref)
    ) {
      return `param.${paramItem[0].name}`;
    } else {
      return `{${paramItem
        .map((item) => `${item.name}:param.${item.name}`)
        .join(",\n")}}`;
    }
  }

  tplGetResponseInterfaceName(): string {
    return getTypeNameFromSchema(this.responseSchema);
  }
}

function getTypeNameFromSchema(schema) {
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
}
