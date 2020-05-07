import {IActorItem} from 'moon-core/src/typings/page';
import {genTsFromJSON} from "moon-core/lib/util/json-util";
import DataModel from "./data-model";

/**
 * @desc
 *
 * @使用场景
 *
 * @coder.yang2010@gmail.com
 * @Date    2020/3/14
 **/

export default class DataItemModel {
  ast: any;

  ownedDataModel :DataModel;

  constructor(ownedDataModel:DataModel,ast: any) {
    this.ast = ast;
    this.ownedDataModel = ownedDataModel;
  }

  get name(): string {
    return this.ast.name;
  }

  get value(): string {
    return this.ast.value;
  }

  get type(): string {
    return this.ast.type;
  }

  get typeName(): string {
    return this.ast.typeName;
  }

  getTypescriptInfo(){
    return {
      name:`I${this.ownedDataModel.className}${this.name}`
    }
  }

  // let jsonDefied  =  await genTsFromJSON(Util.getPropsTsName(actor.fileName,dataItem.name,dataItem),dataItem.value);
  // dataItem.schema=jsonDefied.schema;
  // dataItem.typeName=jsonDefied.typeName;
  // valueTsDefinds.push(jsonDefied.tsContent)
}
