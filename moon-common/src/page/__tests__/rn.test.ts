/**
 * @desc
 *
 * @使用场景
 *
 * @Date    2019/7/25
 **/

import {tmpdir} from 'os';
import {join} from 'path';
import {remove} from  'fs-extra';
import MoonCore from  'moon-core';
import {genRnPage} from  '../rn';

describe('rn生成页面测试', () => {
  it('列表页面', async () => {
    let targetDir = join(tmpdir(), 'moon-temp/' ,Math.random()+"");
    await genRnPage({
      projectPath: targetDir,
      //@ts-ignore
      pageInfo: cashManPageDef,
    });

    //直接访问有问题..似乎会有 读取不到文件的情况发生;;
    let content = await MoonCore.JestUtil.readDirFiles(targetDir);
    expect(content).toMatchSnapshot();
    await remove(targetDir);
  });
});


let cashManPageDef =
  {
    "pagePath": "pages/test",
    pageKey: 'pagesTest',
    title: '测试',
    "actors": [
      {
        "fileName": "main",
        "datas": [{ "name": "request", "value": { "q": "", "pageNum": 0, "pageSize": 10 } }, { "name": "total", "value": 0 }, { "name": "list", "value": [], "schemaType": "fromValue" }],
        "events": [
          { "name": "modifyRequest", "comment": "修改查询条件数据", "content": "immerUtil.assign(draftState.request,payload);", "param": "" },
          { "name": "cleanList", "comment": "清空查询结果", "content": "draftState.list = [];", "param": "" },
          { "name": "queryResult", "comment": "", "content": "draftState.list = payload.list;\n        draftState.total = payload.total;\n        ", "param": "" }
        ]
      }
    ],
    "actions": [
      {
        "fileName": "action",
        "methods": [
          {
            "name": "modifySearch",
            "comment": "\n              普通条件查询可以走,commonChange\n              ",
            "content": "\n      dispatch({ type: Command.modifyRequest, payload: param});\n      //修改完直接查询;\n      if(options.isQuery) {\n        await this.query(options.isResetPage)\n      }\n      ",
            "param": "param,options:{\n      isQuery:boolean;\n      isResetPage:boolean;\n    }={isQuery:true,isResetPage:false}"
          },
          {
            "name": "nextPage",
            "comment": "查询下一页",
            "param": "",
            "content": "\n      let {request} = getData().main;\n      request.pageNum=request.pageNum+1;\n      dispatch({ type: Command.modifyRequest, payload: request });\n      await this.query();\n              "
          },
          {
            "name": "query",
            "comment": "以当前查询条件查询",
            "param": "isResetPage:boolean=false",
            "content": "\n            if(isResetPage) {\n              await dispatch({ type: Command.modifyRequest, payload: {pageNum:0} });\n            }\n          \n          let {request} =  getData().main;\n      //TODO 接口缺失 \n      // let {} = await api..XXapi();\n      \n      dispatch({ type: Command.queryResult, payload: {\n        total:0,\n        list:[]\n        } });\n        "
          }
        ]
      }
    ],
    "subComps": [{ "fileName": "info", "methods": [{ "name": "render", "comment": "", "content": "", "param": "" }] }],
    "lifeCycles": { "init": { "name": "init", "param": "", "content": "" }, "clean": { "name": "clean", "param": "", "content": "" } },
    "mainComp": { "methods": [] }
  };