/**
 * @desc
 *
 * @使用场景
 *
 * @coder.yang2010@gmail.com
 * @Date    2020/3/9
 **/
import request from 'request';
import ApiCompileHooks from "moon-common/declarations/swagger-api/hook";
import {api} from "moon-core";
import stringJs from "string";

let {RequestParameter,Method,ApiGroup}= api.domain;

export default class RapLoader{

  constructor(public param:{
     rapJson:RpaData;
     url:string;
  }) {
  }

  apply = (hook:ApiCompileHooks)=> {
    //@ts-ignore
    hook.loadApiGroup.tap('loadRpa2WebApiGroup', async context => {
      //@ts-ignore
      context.apiGroups =await this.loadeWebapiGroup();
      return ;
    });
  }





    loadeWebapiGroup = async ()=>{
      let model:RpaData =this.param.rapJson;
      if(!model  && this.param.url){
        let content = await loadJson(this.param.url ||'http://rap2.taobao.org:38080/repository/get?id=253559&excludeProperty=true');
        model = content.data;
      }
    // let content = await loadJson('http://172.23.40.186:8080/repository/get?id=87');

    let webApiGroup = model.modules.map(moduleItem => {
      let apis = filterSameApi(moduleItem.interfaces).map(interfaceItem => {

        //url 参数要提取出来
        let reqParam = getRequestParam(interfaceItem,"request");
        let resParam = getRequestParam(interfaceItem,"response");

        let properties = resParam.reduce((acc,next)=>{
          //@ts-ignore
          acc[next.name]=next.jsonSchema;
          return acc;
        },{});

        let  methodName=getUrl2Name(interfaceItem.url);

        let  responseSchema = {
          "$schema": "http://json-schema.org/draft-07/schema",
          "$id": "http://example.com/root.json",
          "type": "object",
          "title":stringJs(interfaceItem.name+"Res").capitalize().camelize(),
          "description": "The root schema is the schema that comprises the entire JSON document.",
          "default": {},
          properties,
        };

        // TODO dong 2020/5/15 这里要处理下
        let method  =  new Method({
          url: interfaceItem.url,
          method: interfaceItem.method.toLowerCase(),
          //方法名称
          operationId:interfaceItem.name,
          name: interfaceItem.name,
          comment: `${interfaceItem.name}
        ${interfaceItem.description}`,
          parameters: reqParam,
          responses:{
            "200":{
              description: "",
              //@ts-ignore
              schema: responseSchema
            }
          },
        },{url: interfaceItem.url,method: interfaceItem.method.toLowerCase()})

        debugger;
        return method;
      });

      let apiGroup =   new ApiGroup({
        name:moduleItem.name,
        serverInfo: {
          // contact: string;
          description: '',
          // license: {name: string, url: string}
          // termsOfService: string;
          title: '',
          version: '',
          host: '',
        },
      });
      apiGroup.addApis(apis)
      return apiGroup;

      // return {
      //   name: NameMap[moduleItem.name],
      //   serverInfo: {
      //     // contact: string;
      //     description: '',
      //     // license: {name: string, url: string}
      //     // termsOfService: string;
      //     title: '',
      //     version: '',
      //     host: '',
      //   },
      //   apis,
      //   definitions: {},
      // };
    }).filter(item=>item.name);
    return webApiGroup;
  }

}


function firsetUppercase(str:string){
  if(!str){
    return str;
  }
  return str[0].toUpperCase()+str.substr(1);
}

function getUrl2Name(url:string):string{
  let items= url.split(/[\/\-]/gi).filter(item=>!!item).map(firsetUppercase);
  return items.join("");

}

function filterSameApi(interfaces:IInterface[]):IInterface[]{

  let intMap:{[url:string]:IInterface} ={};
  for (let i = 0, iLen = interfaces.length; i < iLen; i++) {
    let interfaceItem = interfaces[i];

    if(!intMap[interfaceItem.url]) {
      intMap[interfaceItem.url] = interfaceItem;
    }else{
      if(intMap[interfaceItem.url].id < interfaceItem.id){
        intMap[interfaceItem.url]= interfaceItem;
      }
    }
  }



  return Object.values(intMap);
}

async function loadJson(swaggerUrl: string): Promise<any> {
  return new Promise((resolve, reject) => {
    console.log(`从${swaggerUrl}中加载api doc信息`);
    request(swaggerUrl, function(error, response, body) {
      if (error) {
        reject(error);
      } else {
        resolve(JSON.parse(body));
      }
    });
  });
}



interface RpaData {
  id: number;
  name: string;
  description: string;
  modules: IModule[];
}

interface IModule {
  id: number;
  name: string;
  description: string;
  priority: number;
  creatorId: number;
  repositoryId: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: null;
  interfaces: IInterface[];
}

interface IInterface {
  id: number;
  name: string;
  url: string;
  method: 'POST' | 'GET';
  description: string;
  priority: number;
  creatorId: number;
  lockerId: number;
  moduleId: number;
  repositoryId: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: null;
  locker: null;
  properties: IProperty[];
  requestProperties:IRequestProperties[];
  responseProperties:IResponseProperties[];
}

interface IRequestProperties extends IProperty{

};

interface IResponseProperties extends IProperty{

};
interface IProperty {
  id: number;
  scope: 'response' | 'request';
  type: 'String' | 'Array'|'Object'|'Number'|'Boolean'|"RegExp";
  name: string;
  rule: string;
  value: string;
  //1:urlParam  2:queryParam . 3:bodyParam
  pos: 1|2|3;
  description: string;
  parentId: number;
  parent?:IProperty,
  children:IProperty[];
  priority: number;
  interfaceId: number;
  creatorId: number;
  moduleId: number;
  required:boolean;
  repositoryId: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
}

function getRequestParam(interfaceItem: IInterface,type:"request"|"response"){
  let requests:IProperty[] = interfaceItem.properties.filter(item=>item.scope===type);
  let allProperMap=interfaceItem.properties.reduce((acc,next)=>{
    acc[next.id] =next;
    return acc;
  },{});

  let root = requests.filter(item=>item.parentId===-1);

  return root.map(item=>findChildRen(item,allProperMap))
          .map((item)=>toParam(item,getUrl2Name(interfaceItem.url)));
}

function findChildRen(props:IProperty,allPropers:{[id:number]:IProperty}) {

  let children=[];

  for (let properId in allPropers) {
    let item =allPropers[properId];
    if(item.parentId===props.id){
      children.push(item);
      item.parent=props;
      findChildRen(item,allPropers);
    }
  }

  if(children.length>0) {
    props.children=children;
  }
  return props;
}


function toParam(obj:IProperty,Title:string){
  let jsonSchema =rap2JsonSchema(obj,Title);
  jsonSchema['$schema']  = "http://json-schema.org/draft-07/schema#";
  jsonSchema['$id']  = "http://example.com/product.schema.json";

  return {
    name: obj.name,
    description:obj.description,
    in:PosMap[obj.pos],
    type:jsonSchema.type,
    schema:jsonSchema,
    jsonSchema,
    defaultValue: "",
  }
}

const PosMap={
  1:"path",
  2:"query",
  3:"body",
}

function rap2JsonSchema(proper:IProperty,preName:string) {

  if(proper.type==="Array") {
    let items ;
    if(!proper.children ||proper.children.length===0){

    }else if(proper?.children?.length >=1) {
      //对象;;
      // http://rap.yzf.net/repository/editor?id=87&mod=319
      let  properties = proper.children.reduce((acc,next)=>{
        acc[next.name] =rap2JsonSchema(next,preName+ firsetUppercase(proper.name));
        return acc;
      },{});

      items={
        "title":  preName+firsetUppercase(proper.name),
        "description":  proper.description,
        "type": "object",
        properties,
      }

    }else{
      throw new Error("异常情况; ");
    }
    return {
      "description": proper.description,
      "title":  proper.name,
      "type": "array",
      items,
      "minItems": 1,
      "uniqueItems": true
    }
  }else if(proper.type==="RegExp") {
    return {
      "type": "string",
      "description": proper.description,
      "patternProperties": {
        "progBinaryName": proper.value
      },
      "required": proper.required
    }
  }else if(proper.type==="Boolean") {
    return {
      "type": "boolean",
      "description": proper.description
    }
  }else if(proper.type==="String") {
    return {
      "type": "string",
      "description": proper.description,
    }
  }else if(proper.type==="Number") {

    return {
      "type": "number",
      "description":  proper.description,
      "default": 0,
      "examples": [
      ]}
  }else if(proper.type==="Object") {
    let result  =  proper.children.reduce((acc,next)=>{
      acc[next.name]=rap2JsonSchema(next,preName+ firsetUppercase(proper.name));
      return acc;
    },{});
    return {
      "title":   preName+firsetUppercase(proper.name),
      "description":  proper.description,
      "type": "object",
      "properties": result,
      "required": [  ]
    }
  } else {

    console.error("暂未支持类型",proper.type);
    return {
      "title":   preName+firsetUppercase(proper.name),
      "description":  proper.description,
      "type": "object",
      "properties": {},
      "required": []
    }
  }
}
