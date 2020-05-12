/**
 * @desc
 *
 * @使用场景
 *
 * @coder.yang2010@gmail.com
 * @Date    2020/5/12
 **/
import {addDef2List, findAllRefType, IMethodDefinded} from "../util/swagger";
import {toLCamelize} from "../../../util/string-util";
import RequestParameter from "./request-parameter";
import {SchemaProps} from "../../../typings/api";

export default class Method{

  constructor(public methodInfo:IMethodDefinded,public methodInfoOptions:{
    url:string;
    method:"POST"|"GET"|"UPDATE"|"DELETE"|"OPTIONS"|string;
  }) {

  }

  private _name:string;

  /**
   * 方法名称;
   */
  get name():string {
    if(!this._name) {
      this._name = toLCamelize(this.methodInfo.operationId)
        .replace(/UsingPOST.*/gi, '')
        .replace(/UsingPUT.*/gi, '')
        .replace(/UsingHEAD.*/gi, '')
        .replace(/UsingOPTIONS.*/gi, '')
        .replace(/UsingPATCH.*/gi, '')
        .replace(/UsingGET.*/gi, '')
        .replace(/UsingDELETE.*/gi, '');
      return this._name;
    } else{
     return  this._name;
    }
  }


  set name(newName:string){
    this._name=newName;
  }

  /**
   * 备注信息;
   */
  get comment():string{
    return this.methodInfo.summary;
  }

  private params:RequestParameter[];

  get requestParam():RequestParameter[]{
    if(!this.params){
      this.params = (this.methodInfo.parameters || [])
        .filter(item => item.in != 'header')
        //spring error根据参数传递过来
        .filter(item => !(item.name === 'errors' && item.schema &&item.schema["$ref"]==='#/definitions/Errors'))
        .filter(item=>!item.name.startsWith("userInfo"))
        .map(item => {
          return new RequestParameter(item,{ownedMethod:this});
        })
    }

    return this.params;
  }

  get responseSchema():SchemaProps{
    return this.methodInfo.responses['200'].schema;
  }


  tplGetMethodName(){
    let methodName =this.name
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
  tplGetRequestParamContent():string{
    return this.requestParam.map(item=>{
      return `${item.name+(item.isRequired?"":"?")}:${item.tplGenInterfaceName()}`
    }).join(',')
  }

  tplGetResponseInterfaceName():string{
    return getTypeNameFromSchema(this.responseSchema)
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


