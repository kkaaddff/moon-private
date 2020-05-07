/**
 * @desc
 *
 * @使用场景
 *
 * @Date    2019/3/19
 **/
import * as ejs from 'ejs';
import {join} from 'path';
import {ISubComp, } from '../../typings/page';
import {getHandleFile} from "../../util/compile-util";
import * as stringUitl from '../../util/string-util';
import {genTsFromJSON} from "../../util/json-util";
import {DataType, IAction, IActorEvent, IActorItem, IContext, ImportInfo, IType} from "../../typings/page";

const Util = {
  ... stringUitl,

  getDefaultByType(type: DataType) {
    switch (type) {
      case 'any':
        return "{}";
        break;
      case 'string':
        return "''";
        break;
      case 'object':
        break;
        return "{}"
      case 'string[]':
        break;
      case 'number':
        break;
        return "0";
      default:
        return "any";
    }
  },


  /**
   * 获取reducer在全局注册的名字
   *
   * @param {string} reducerFileName
   * @returns {string}
   */
  getReducerUniqName(pageKey:string,reducerFileName:string) {
    return `${Util.toUCamelize(pageKey) + Util.toUCamelize(reducerFileName)}`;
  },

  /**
   * 获取 reducer在types中定义的名字
   * @param {string} reducerFileName
   * @returns {string}
   */
  getReducerTsName(reducerFileName:string) {
    return `I${Util.toUCamelize(reducerFileName)}Reducer`;
  },

  getPropsTsName(actorName:string,propsName:string,data:IType):string{
    let name  = `I-${actorName}-${propsName}`;
    return  stringUitl.toUCamelize(name);
  }
};


export async function generate(context: IContext) :Promise<string>{
  let {pageInfo,projectPath,prettiesConfig} = context;
  let pageOutDir =join(projectPath,'/src/pages/', pageInfo.pagePath);
  //所有的事件..
  let events = (pageInfo.models||[]).reduce(
    (accumulator: IActorEvent[], currentValue: IActorItem) => {
      // console.log(`accumulator:${accumulator}, currentValue:${currentValue}`);
      return accumulator.concat(currentValue.methods.map(event=>{
        event['moduleName']=currentValue.fileName;
        return event;
      }));
    },
    [],
  );

  let handlePage = getHandleFile({prettiesConfig,outDir:pageOutDir
      ,tplBase:join(__dirname,"tpl"),
    context
    });

  let base = {
    pageInfo,
    Util,
    className: Util.toUCamelize(pageInfo.pageKey),
    instanceName: Util.toLCamelize(pageInfo.pageKey),
    events,
  };
  //首页生成
  await handlePage('index.tsx.ejs', async (tplConent: string) => {
    let conent = ejs.render(tplConent, {
      ...base,
    });
    return conent;
  });

  await handlePage('selectors.ts.ejs', async (tplConent: string) => {
    let conent = ejs.render(tplConent, {
      ...base,
    });
    return conent;
  });

  await handlePage('index.less.ejs', async (tplConent: string) => {
    let conent = ejs.render(tplConent, {
      ...base,
    });
    return conent;
  });

  pageInfo.models.forEach(async (actor: IActorItem, index: number) => {
    //reducer生成
    await handlePage(
      'reducers/reducer.ts.ejs',
      async (tplConent: string) => {
        let conent = ejs.render(tplConent, {
          ...base,
          actor,
          index,
        });
        return conent;
      },
      {saveFilePath: "reducers/"+actor.fileName + '.ts',
       actor
      },
    );
  });

  //constant生成
  await handlePage('constant.ts.ejs', async (tplConent: string) => {
    let conent = ejs.render(tplConent, {
      ...base,
      events,
    });
    return conent;
  });

  //types生成
  await handlePage('types.ts.ejs', async (tplConent: string) => {

    let valueTsDefinds  =[];
    let toImportInfo:ImportInfo[]  = [];

    for (let i = 0, ilen = pageInfo.models.length; i < ilen; i++) {
      let actor = pageInfo.models[i];

      for (let j = 0, jlen = actor.datas.length; j < jlen; j++) {
        let dataItem = actor.datas[j];
        if (dataItem.schemaType==="internal") {

        } else if (dataItem.schemaType==="import") {
          toImportInfo.push(dataItem.importInfo);
          dataItem.typeName=dataItem.importInfo.interfaceName
          +(dataItem.importInfo.isArray?"[]":"");
        }else{
          let jsonDefied  =  await genTsFromJSON(Util.getPropsTsName(actor.fileName,dataItem.name,dataItem),dataItem.value);
          dataItem.schema=jsonDefied.schema;
          dataItem.typeName=jsonDefied.typeName;
          valueTsDefinds.push(jsonDefied.tsContent)

        }
      }
    }

    let conent = ejs.render(tplConent, {
      ...base,
      getImport:():string=>{
       return  toImportInfo.map((item:ImportInfo)=>`import {${item.interfaceName}} from 'api/${item.apiFile}';`).join('\n');
      },
      valueTsDefinds: valueTsDefinds.join(""),
    });
    return conent;
  });

  //action生成
  pageInfo.actions.forEach(async (action: IAction) => {
    await handlePage(
      'actions/action.ts.ejs',
      async (tplConent: string) => {
        let conent = ejs.render(tplConent, {
          ...base,
          action,
        });
        return conent;
      },
      {saveFilePath: "actions/"+action.fileName + '.ts',
      action},
    );
  });

  await handlePage(
    'actions/index.ts.ejs',
    async (tplConent: string) => {
      let conent = ejs.render(tplConent, {
        ...base,
      });
      return conent;
    }
  );
  //子组件生成;
  pageInfo.subComps.forEach(async (subComp: ISubComp, index: number) => {
    await handlePage(
      'components/sub-components.tsx.ejs',
      async (tplConent: string) => {
        let conent = ejs.render(tplConent, {
          ...base,
          subComp,
        });
        return conent;
      },
      {
        saveFilePath: 'components/' + subComp.fileName + '.tsx',
        subComp,
      },
    );

    await handlePage(
      'components/sub-components.less.ejs',
      async (tplConent: string) => {
        let conent = ejs.render(tplConent, {
          ...base,
          subComp,
        });
        return conent;
      },
      {saveFilePath: 'components/' + subComp.fileName + '.less'},
    );
  });

  return pageOutDir;
}


export async function buildPage(context: IContext) :Promise<string>{
  //在项目中生成相关文件
  // let projectSrc = join(context.projectPath, 'src');
  let pageInfo = context.pageInfo;
  pageInfo.pageKey = pageInfo.pagePath.replace(/\//ig,"-").replace('.',"-");

  return await generate(context);
  //在项目配置中添加store.reducer  及 页面显示的配置. ;
  //先判断是否有, 如果有的话, 不再重新生成了.

}

