import {IActorItem} from "moon-core/src/typings/page";

/**
 * @desc
 *
 * @使用场景
 *
 * @coder.yang2010@gmail.com
 * @Date    2020/3/14
 **/

export default class MethodModel{
  ast:any;

  constructor(ast:any) {
    this.ast= ast;
  }

  get name():string{
    return this.ast.name;
  }

  get param():string{
    return this.ast.param;
  }

  get comment():string{
    return this.ast.comment;
  }

  get content():string{
    return this.ast.content;
  }
}
