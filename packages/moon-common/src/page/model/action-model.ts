import {IAction} from 'moon-core/src/typings/page';
import MethodModel from './method-model';
import {toLCamelize, toUCamelize} from "../../util/string-util";

/**
 * @desc
 *
 * @使用场景
 *
 * @coder.yang2010@gmail.com
 * @Date    2020/3/14
 **/

export default class ActionModel {
  ast: IAction;

  constructor(ast: IAction) {
    this.ast = ast;
  }

  get className():string{
    return toUCamelize(this.ast.fileName);
  }

  get instanceName():string{
    return toLCamelize(this.ast.fileName);
  }

  get name(): string {
    return this.ast.fileName;
  }

  get methods(): MethodModel[] {
    return this.ast.methods.map(method => new MethodModel(method));
  }
}
