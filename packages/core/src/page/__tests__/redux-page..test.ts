/**
 * @desc
 *
 * @使用场景
 *
 * @Date    2019/7/25
 **/

import {generate} from '../redux/redux';
import {remove} from  'fs-extra';
import {tmpdir} from 'os';
import {join} from 'path';
import {readDirFiles} from '../../util/jest-util';



describe('生成页面测试', () => {
  it('redux页面生成测试', async () => {
    let targetDir = join(tmpdir(), 'moon-temp', Math.random()+"");

    await generate({
      projectPath: targetDir,
      //@ts-ignore
      pageInfo: cashManPageDef,
    });
    let content = await readDirFiles(targetDir);
    expect(content).toMatchSnapshot();

    await remove(targetDir);
  });
});

let cashManPageDef = {
  pagePath: 'cashier/main',
  pageKey: 'cashierMain',
  title: '测试',
  models: [
    {
      fileName: 'cart',
      datas: [
        {name: 'list', schemaType: 'fromValue', value: ''},
        {name: 'customer', schemaType: 'fromValue', value: ''},
        {name: 'coupons', schemaType: 'fromValue', value: ''},
        {name: 'coupon2Use', schemaType: 'fromValue', value: ''},
      ],
      methods: [
        {name: 'add', comment: '添加商品', param: ''},
        {name: 'del', comment: '删除商品', param: ''},
        {name: 'chooseCoupon', comment: '选择优惠券', param: ''},
        {name: 'delChoosedCoupon', comment: '去除选中优惠券', param: ''},
      ],
    },
    {
      fileName: 'content',
      datas: [
        {name: 'type', schemaType: 'fromValue', value: 0},
        {name: 'requestGoods', value: {q: '', pageNum: 0, pageSize: 10}},
        {name: 'totalGoods', value: 0},
        {
          name: 'listGoods',
          value: [{}],
          importInfo: {
            apiFile: 'PetGoodsController',
            methodName: 'list',
            interfaceName: 'GoodsVO2',
            isArray: true,
          },
          schemaType: 'import',
        },
        {name: 'requestService', value: {q: '', pageNum: 0, pageSize: 10}},
        {name: 'totalService', value: 0},
        {
          name: 'listService',
          value: [{}],
          importInfo: {
            apiFile: 'ProjectController',
            methodName: 'page',
            interfaceName: 'ProjectVO',
            isArray: true,
          },
          schemaType: 'import',
        },
        {name: 'requestCard', value: {q: '', pageNum: 0, pageSize: 10}},
        {name: 'totalCard', value: 0},
        {
          name: 'listCard',
          value: [{}],
          importInfo: {
            apiFile: 'BossGoodsEvaluateController',
            methodName: 'page',
            interfaceName: 'GoodsEvaluateVO3',
            isArray: true,
          },
          schemaType: 'import',
        },
        {
          name: 'goodsCates',
          schemaType: 'import',
          value: [],
          importInfo: {
            apiFile: 'StoreCateController',
            methodName: 'list',
            interfaceName: 'StoreCateResponseVOArray',
            isArray: false,
          },
        },
        {
          name: 'serviceCates',
          schemaType: 'import',
          value: [],
          importInfo: {
            apiFile: 'StoreProjectCateController',
            methodName: 'page',
            interfaceName: 'ProjectCatePageVO',
            isArray: true,
          },
        },
      ],
      methods: [
        {
          name: 'modifyRequestGoods',
          comment: '修改查询条件数据',
          content: 'immerUtil.assign(draftState.request,payload);',
          param: '',
        },
        {
          name: 'cleanListGoods',
          comment: '清空查询结果',
          content: 'draftState.list = [];',
          param: '',
        },
        {
          name: 'queryResultGoods',
          comment: '',
          content:
            'draftState.list = payload.list;\n        draftState.total = payload.total;\n        ',
          param: '',
        },
        {
          name: 'modifyRequestService',
          comment: '修改查询条件数据',
          content: 'immerUtil.assign(draftState.request,payload);',
          param: '',
        },
        {
          name: 'cleanListService',
          comment: '清空查询结果',
          content: 'draftState.list = [];',
          param: '',
        },
        {
          name: 'queryResultService',
          comment: '',
          content:
            'draftState.list = payload.list;\n        draftState.total = payload.total;\n        ',
          param: '',
        },
        {
          name: 'modifyRequestCard',
          comment: '修改查询条件数据',
          content: 'immerUtil.assign(draftState.request,payload);',
          param: '',
        },
        {
          name: 'cleanListCard',
          comment: '清空查询结果',
          content: 'draftState.list = [];',
          param: '',
        },
        {
          name: 'queryResultCard',
          comment: '',
          content:
            'draftState.list = payload.list;\n        draftState.total = payload.total;\n        ',
          param: '',
        },
      ],
    },
  ],
  actions: [
    {
      fileName: 'cartAction',
      methods: [
        {name: 'add', comment: '添加商品', content: '', param: ''},
        {name: 'del', comment: '删除商品', content: '', param: ''},
        {name: 'chooseCoupon', comment: '选择优惠券', content: '', param: ''},
        {name: 'delChoosedCoupon', comment: '去除选中优惠券', content: '', param: ''},
      ],
    },
    {
      fileName: 'contentAction',
      methods: [
        {
          name: 'modifySearchGoods',
          comment: '\n              普通条件查询可以走,commonChange\n              ',
          content:
            '\n      options.isResetPage?(param.pageNum=0):null;\n      dispatch({ type: Command.modifyRequestGoods, payload: param});\n      //修改完直接查询;\n      if(options.isQuery) {\n        await this.query()\n      }\n      ',
          param:
            'param,options:{\n      isQuery:boolean;\n      isResetPage:boolean;\n    }={isQuery:true,isResetPage:true}',
        },
        {
          name: 'nextPageGoods',
          comment: '查询下一页',
          param: '',
          content:
            '\n      let {request} = getData().main;\n      request.pageNum=request.pageNum+1;\n      dispatch({ type: Command.modifyRequestGoods, payload: request });\n      await this.query();\n              ',
        },
        {
          name: 'queryGoods',
          comment: '以当前查询条件查询',
          param: '',
          content:
            'let {request} =  getData().main;\n      //TODO 接口缺失 \n      // let {projectVOPage:{total,list}} = await api.PetGoodsController.list(\n      \n      dispatch({ type: Command.queryResultGoods, payload: {\n        total:0,\n        list:[]\n        } });\n        ',
        },
        {
          name: 'modifySearchService',
          comment: '\n              普通条件查询可以走,commonChange\n              ',
          content:
            '\n      options.isResetPage?(param.pageNum=0):null;\n      dispatch({ type: Command.modifyRequestService, payload: param});\n      //修改完直接查询;\n      if(options.isQuery) {\n        await this.query()\n      }\n      ',
          param:
            'param,options:{\n      isQuery:boolean;\n      isResetPage:boolean;\n    }={isQuery:true,isResetPage:true}',
        },
        {
          name: 'nextPageService',
          comment: '查询下一页',
          param: '',
          content:
            '\n      let {request} = getData().main;\n      request.pageNum=request.pageNum+1;\n      dispatch({ type: Command.modifyRequestService, payload: request });\n      await this.query();\n              ',
        },
        {
          name: 'queryService',
          comment: '以当前查询条件查询',
          param: '',
          content:
            'let {request} =  getData().main;\n      //TODO 接口缺失 \n      // let {projectVOPage:{total,list}} = await api.ProjectController.page(\n      \n      dispatch({ type: Command.queryResultService, payload: {\n        total:0,\n        list:[]\n        } });\n        ',
        },
        {
          name: 'modifySearchCard',
          comment: '\n              普通条件查询可以走,commonChange\n              ',
          content:
            '\n      options.isResetPage?(param.pageNum=0):null;\n      dispatch({ type: Command.modifyRequestCard, payload: param});\n      //修改完直接查询;\n      if(options.isQuery) {\n        await this.query()\n      }\n      ',
          param:
            'param,options:{\n      isQuery:boolean;\n      isResetPage:boolean;\n    }={isQuery:true,isResetPage:true}',
        },
        {
          name: 'nextPageCard',
          comment: '查询下一页',
          param: '',
          content:
            '\n      let {request} = getData().main;\n      request.pageNum=request.pageNum+1;\n      dispatch({ type: Command.modifyRequestCard, payload: request });\n      await this.query();\n              ',
        },
        {
          name: 'queryCard',
          comment: '以当前查询条件查询',
          param: '',
          content:
            'let {request} =  getData().main;\n      //TODO 接口缺失 \n      // let {projectVOPage:{total,list}} = await api.BossGoodsEvaluateController.page(\n      \n      dispatch({ type: Command.queryResultCard, payload: {\n        total:0,\n        list:[]\n        } });\n        ',
        },
        {name: 'modifyKeyWord', comment: '修改关键字', content: '', param: ''},
      ],
    },
  ],
  subComps: [
    {
      fileName: 'cart',
      methods: [{name: 'render', comment: '', content: '', param: ''}],
    },
    {
      fileName: 'cart-header',
      methods: [{name: 'render', comment: '', content: '', param: ''}],
    },
    {
      fileName: 'cart-list',
      methods: [{name: 'render', comment: '', content: '', param: ''}],
    },
    {
      fileName: 'cart-foot',
      methods: [{name: 'render', comment: '', content: '', param: ''}],
    },
    {
      fileName: 'cart-summary',
      methods: [{name: 'render', comment: '', content: '', param: ''}],
    },
    {
      fileName: 'content',
      methods: [{name: 'render', comment: '', content: '', param: ''}],
    },
    {
      fileName: 'content-search',
      methods: [{name: 'render', comment: '', content: '', param: ''}],
    },
    {
      fileName: 'content-tabs',
      methods: [{name: 'render', comment: '', content: '', param: ''}],
    },
    {
      fileName: 'content-tabs-service',
      methods: [{name: 'render', comment: '', content: '', param: ''}],
    },
    {
      fileName: 'content-tabs-goods',
      methods: [{name: 'render', comment: '', content: '', param: ''}],
    },
    {
      fileName: 'content-tabs-cards',
      methods: [{name: 'render', comment: '', content: '', param: ''}],
    },
    {
      fileName: 'content-bottom',
      methods: [{name: 'render', comment: '', content: '', param: ''}],
    },
  ],
  lifeCycles: {
    init: {name: 'init', param: '', content: ''},
    clean: {name: 'init', param: '', content: ''},
  },
  mainComp: {methods: []},
};
