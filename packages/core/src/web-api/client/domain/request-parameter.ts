import {SchemaProps} from "../../../typings/api";
import Method from "./method";

/**
 * @desc
 *
 * @使用场景
 *
 * @coder.yang2010@gmail.com
 * @Date    2020/5/12
 **/

const stringUtil = require("../util/string-util");

export interface IParamAst {
  description: string
  format: string
  in: "query"|"path"|"body",
  name: "id"
  required: boolean
  type: string;
  schema?:SchemaProps;
}

/**
 * 请求参数对象;
 */
export default class RequestParameter{

  constructor(public ast:IParamAst,public paramsOptions:{
    ownedMethod:Method;
  }) {
  }

  /**
   * 获取参数名字
   */
  get name():string{
    return getParamName(this.ast.name);
  }

  /**
   * 参数是否在query上
   */
  get isInQuery():boolean{
    return this.ast.in === 'query';
  }

  /**
   * 参数是否在path上
   */
  get isInPath():boolean{
    return this.ast.in === 'path';
  }

  /**
   * 参数是否在body上
   */
  get isInBody():boolean{
    return this.ast.in === 'body';
  }

  /**
   * 参数备注
   */
  get comment(){
    return this.ast.description;
  }

  /**
   * 参数是否必须的
   */
  get isRequired(){
    return this.ast.required;
  }

  /**
   * 获取参数定义信息;
   */
  get jsonSchema(){
    return this.ast.schema?this.ast.schema : this.ast;
  }
  get schema(){
    return this.ast.schema?this.ast.schema : this.ast;
  }

  /**
   * 获取参数的interfaceName定义;
   */
  tplGenInterfaceName():string{
    return `I${stringUtil.toUCamelize([this.paramsOptions.ownedMethod.name,this.name,'req'].join("-"))}`;
  }

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
