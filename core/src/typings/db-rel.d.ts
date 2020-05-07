/**
 * @desc
 *
 * @使用场景
 *
 * @Date    2019/6/24
 **/

export interface PdmanDb{
  modules:ModulesItem[];
  dataTypeDomains:{
    datatype:DataTypeItem[];
    database:DbTemplate[];
  };
  profile:{
    dbs:DbConnectInfo[];
  }
}


export interface Point{
  entity:string;
  field:string;
}

export interface AssociationItem{
  relation:string;
  from:Point
  to:Point
}

export interface DataTypeItem{
  name: string;
  code: string;
  apply: Apply;
}

export interface Apply{
  JAVA: {
    "type": "String";
  };
  MYSQL: {
    "type": "String";
  };
  ORACLE: {
    "type": "String";
  };
  SQLServer: {
    "type": "String";
  };
  PostgreSQL: {
    "type": "String";
  };
}

export interface DbTemplate{
  code: string;
  template: string;
  fileShow: boolean;
  defaultDatabase: boolean;
  createTableTemplate: string;
  deleteTableTemplate: string;
  rebuildTableTemplate: string;
  createFieldTemplate: string;
  updateFieldTemplate: string;
  deleteFieldTemplate: string;
  deleteIndexTemplate: string;
  createIndexTemplate: string;
  updateTableComment: string;
}

export interface Properties {
  driver_class_name: string;
  url: string;
  username: string;
  password: string;
}

export interface DbConnectInfo{
  name: string;
  defaultDB: boolean;
  properties: Properties;
}

export interface ModulesItem{
  name:string;
  chnname:string;
  entities:Table[];
  graphCanvas:{
    nodes:GraphCanvasNode[];
    edges:GraphCanvasEdge[]
  };
  associations:AssociationItem[];
}

export interface ControlPoint{
  x: number;
  y: number;
}

export interface GraphCanvasEdge{
  shape: string;
  relation: string;
  source: string;
  target: string;
  id: string;
  controlPoints: ControlPoint[];
  sourceAnchor: number;
  targetAnchor: number;
}
export interface GraphCanvasNode{
  shape: string;
  title: string;
  moduleName: boolean;
  x: number;
  y: number;
  id: string;
  size: number[];

}


export interface Field {
  name: string;
  type: string;
  remark: string;
  chnname: string;
}

export interface Header {
  fieldName: string;
  relationNoShow: boolean;
}

export interface Table {
  title: string;
  fields: Field[];
  indexs: any[];
  headers: Header[];
  chnname: string;
}
