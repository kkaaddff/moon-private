import { IActorItem} from "moon-core/src/typings/page";
import MethodModel from "./method-model";
import DataItemModel from "./data-item-model";
import {toLCamelize, toUCamelize} from "../../util/string-util";

/**
 * @desc
 *
 * @使用场景
 *
 * @coder.yang2010@gmail.com
 * @Date    2020/3/14
 **/

export default class DataModel{
  ast:IActorItem;

  constructor(ast:IActorItem) {
    this.ast= ast;
  }


  get name():string{
    return this.ast.fileName;
  }

  get className():string{
    return toUCamelize(this.name)
  }

  get instanceName():string{
    return toLCamelize(this.name)
  }

  get datas():DataItemModel[]{
    return this.ast.datas.map(dataItem=>new DataItemModel(this,dataItem));
  }

  get methods():MethodModel[]{
    return this.ast.methods.map(item=>new MethodModel(item));
  }
}
