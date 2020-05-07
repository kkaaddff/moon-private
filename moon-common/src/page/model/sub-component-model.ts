import {ISubComp} from 'moon-core/src/typings/page';
import {toLCamelize, toUCamelize} from '../../util/string-util';
import MethodModel from './method-model';

/**
 * @desc
 *
 * @使用场景
 *
 * @coder.yang2010@gmail.com
 * @Date    2020/3/14
 **/

export default class SubComponentModel {
  ast: ISubComp;

  constructor(ast: ISubComp) {
    this.ast = ast;
  }

  get name(): string {
    return this.ast.fileName;
  }

  get className(): string {
    return toUCamelize(this.ast.fileName);
  }

  get instanceName(): string {
    return toLCamelize(this.ast.fileName);
  }

  get methods(): MethodModel[] {
    return this.ast.methods.map((item) => new MethodModel(item));
  }

  /**
   * 获取render方法;
   */
  getRenderMethod(): MethodModel {
    return this.getMethod('render');
  }

  /**
   * 获取某一方法;
   * @param methodName
   */
  getMethod(methodName: string): MethodModel {
    let ast = this.ast.methods.find((item) => item.name === methodName);
    if (ast) {
      return new MethodModel(ast);
    }
    return null;
  }

  /**
   *
   * @param param
   */
  queryMethod(param: {
    nameKey?:string;
    includes?: string[];
    excludes?: string[];
  }): MethodModel[] {

    let methods  = this.ast.methods;

    if(param.nameKey){
      methods = methods.filter(item=>item.name.include("param.nameKey"));
    }

    if(param.includes){
      methods = methods.filter(item=>param.includes.includes(item.name))
    }

    if(param.excludes){
      methods = methods.filter(item=>!param.excludes.includes(item.name))
    }

    return methods.map(item=>new MethodModel(item));
  }
}
