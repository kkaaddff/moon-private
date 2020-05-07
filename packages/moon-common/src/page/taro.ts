import {IPageDefined} from "moon-core/declarations/typings/page";
import MoonCore from  'moon-core';

import * as fse from 'fs-extra';
import {join} from 'path';
import {IContext} from "moon-core/declarations/typings/page";
import {IFileSaveOptions} from "moon-core/declarations/typings/page";
import PageHooks from "./hook";
/**
 * @desc
 *
 * @使用场景
 *
 * @Date    2019/3/20
 **/
export async function genTaroPage(context:IContext,hook?:PageHooks) {
  let {pageInfo,projectPath}  = context;
  let prettiesConfig = {};
  try {
    prettiesConfig = await fse.readJSON(join(projectPath, 'pretties.json'));
  } catch (err) {}

  await MoonCore.ReduxGen.buildPage({
    ...context,
    prettiesConfig,
    beforeSave:async(options:IFileSaveOptions,context:IContext)=>{
      hook && hook.beforeSave.call(options, context);

      if (options.tplPath.endsWith('less.ejs')) {
        options.content=options.content.replace("@import \"~style/theme.less\";","");
      }

      // if(options.tplPath==='components/sub-components.tsx.ejs') {
      //   let _key =MoonCore.StringUtil.toUCamelize(options.param.subComp.fileName);
      //   options.content =options.content.replace('@connect',`@connect<Partial<I${_key}Props>,T.I${_key}State>`);
      // } else if(options.tplPath==='index.tsx.ejs'){
      //   options.content =options.content.replace('@connect',`@connect<Partial<T.IProps>>`);
      // }

      if(options.tplPath==='index.tsx.ejs' || options.tplPath==='components/sub-components.tsx.ejs'){
        options.content  = options.content
          .replace("import {connect} from 'react-redux'","import { connect } from '@tarojs/redux'")
          .replace("import * as React from 'react';","")
          .replace("React.Component","Component")
          .replace(/<div/ig,"<View")
          .replace(/<\/div>/ig,"</View>");
        options.content = `import { View, Button, Text, Image } from '@tarojs/components';
            import Taro, { Component, Config } from '@tarojs/taro'
            ${options.content}`
      }
      return options;
    },
    afterSave: async (options, context) => {
      if(options.toSaveFilePath.includes("index.tsx")) {

        let projectSrc  = projectPath;
        let pageKey = context.pageInfo.pageKey;
        let pageFilePath =join('pages', context.pageInfo.pagePath);
        // for (let i = 0, iLen = pageInfo.actors.length; i < iLen; i++) {
        //   // let actor = pageInfo.actors[i];
        //
        //   // let reducerKey =  MoonCore.StringUtil.toLCamelize(pageKey+"-"+actor.fileName);
        //
        //   // await MoonCore.CompileUtil.insertFile(join(projectSrc, 'src/redux/reducers/index.ts'), [
        //   //   {
        //   //     mark: '//mark1//',
        //   //     isBefore: true,
        //   //     content: `import ${reducerKey} from "@/${pageFilePath}/reducers/${actor.fileName}";`,
        //   //     check: (content): boolean => !content.includes(pageFilePath),
        //   //   },
        //   //   {
        //   //     mark: '//mark2//',
        //   //     isBefore: false,
        //   //     content: reducerKey+ ',',
        //   //     check: (content, rawContent): boolean =>
        //   //       !rawContent.includes(pageFilePath),
        //   //   },
        //   // ]);
        // }

        await MoonCore.CompileUtil.insertFile(join(projectSrc, 'src/app.tsx'), [
          {
            mark: '//pagePath//',
            isBefore: true,
            content: `'${pageFilePath}/index',`,
            check: (content): boolean => !content.includes(pageFilePath),
          }
        ]);
      }
    },
  });
}
//
// // import db  from '/Users/dong/wanmi/athena-frontend/page-def/db';
// (async () => {
//   let db = await fse.readJSON(join(__dirname, 'db.json'));
//   let projectPath = '/Users/dong/Falcon/skeleton/skeleton-taro/taroDemo';
//   let prettiesConfig = {};
//   try {
//     prettiesConfig = await fse.readJSON(join(projectPath, 'pretties.json'));
//   } catch (err) {}
//
//   for (let _key in db) {
//     let pageInfo: IPageDefined = db[_key];
//      if(!pageInfo.pagePath) {
//        pageInfo.pagePath=_key;
//      }
//
//     if (toGenMainPage.includes(_key)) {
//        console.log('==>> ',_key);
//
//     } else if (toGenSub1Page.includes(_key)) {
//
//       await MoonCore.ReduxGen.buildPage({
//         //动态加载;
//       //   import balanceBankcardInfoBankInfo from "./reducers/bank-info"
//       //   import {registerReducer} from "@/redux/store";
//       // registerReducer({balanceBankcardInfoBankInfo});
//
//
//       // beforeSave: async (options, context) => {
//         //   console.log('toSaveFilePath',options);
//         //   options.toSaveFilePath = options.toSaveFilePath.replace(
//         //     'pages',
//         //     'subpage1',
//         //   );
//         //   console.log('toSaveFilePath',options);
//         //   return options;
//         // },
//         // afterSave: async (options, context) => {
//         //   if(options.toSaveFilePath.includes("index.tsx")) {
//         //     options.content =  insertContent(options.content,[
//         //       {
//         //         mark: '@connect',
//         //         isBefore: true,
//         //         content: `
//         //         import { registerReducer } from "@/store";
//         //         import ${toLCamelize(context.pageInfo.pageKey)} from './reducer';
//         //         registerReducer({${toLCamelize(context.pageInfo.pageKey)}});
//         //         `,
//         //         check: (content): boolean => !content.includes('./reducer'),
//         //       }
//         //     ]);
//         //
//         //     await insertFile(join(projectPath, 'src', 'app.tsx'), [
//         //       {
//         //         mark: `//mark1-subpackage1//`,
//         //         isBefore: false,
//         //         content: `"${context.pageInfo.pagePath}/index",`,
//         //         check: (content): boolean => !content.includes(context.pageInfo.pagePath),
//         //       },
//         //     ]);
//         //
//         //   }
//         // },
//         prettiesConfig,
//         projectPath,
//         pageInfo,
//       });
//     }
//   }
// })();


// async function mainAfterSave(
//   projectPath: string,
//   pagePath: string,
//   pageKey: string,
// ) {
//   let projectSrc = join(projectPath, 'src');
//
//   // let pageInfo  = context.pageInfo;
//   //redux 框架简化添加流程;;
//   let pageFilePath = join('@/', pagePath, 'reducer');
//
//
//   await insertFile(join(projectSrc, 'app.tsx'), [
//     {
//       mark: `'pages/empty/index'`,
//       isBefore: true,
//       content: `"${pagePath}/index",`,
//       check: (content): boolean => !content.includes(pagePath),
//     },
//   ]);
// }
