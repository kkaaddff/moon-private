import {IActorItem} from "moon-core/src/typings/page";

/**
 * @desc
 *
 * @使用场景
 *
 * @coder.yang2010@gmail.com
 * @Date    2020/3/14
 **/


export default class EventModel{
  ast:any;

  constructor(ast:IActorItem) {
    this.ast= ast;
  }

  get name():string{
    return this.ast.name;
  }

  get comment():string{
    return this.ast.comment;
  }


}
