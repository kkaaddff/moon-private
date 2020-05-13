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

  basicTypesMap={
    integer:"number",
    string:"string",
    boolean:"boolean",
    file:"File",
    object:"any",
  };
  /**
   * 判断参数类型是不是基本类型; string int number 等;
   */
  isBasicType():boolean{
    // TODO dong 2020/5/12 这里有一个判断的逻辑在.
    if(this.basicTypesMap[this.ast.type]){
      return true;
    } else if(this.ast.type==='array'){
      if(this.basicTypesMap[this.ast['items'].type]){
        return true;
      }
      debugger;
      return false
    } else if(this.ast.schema){
      return false;
    } else {
      debugger;
      return false;
    }
  }

  /**
   * 要先判断是基本类型的
   */
  getBasicTsType(){
    if(this.ast.type==='array'){
      if(!this.ast['items']){
        debugger;
      }
      return this.basicTypesMap[this.ast['items'].type]+"[]"
    }

    return this.basicTypesMap[this.ast.type];
  }
  getObjectJsonSchemas():any|undefined{
    if(this.isBasicType()){
      return ;
    }

    this.jsonSchema['title'] = this.tplGenInterfaceName();
    return this.jsonSchema;
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
