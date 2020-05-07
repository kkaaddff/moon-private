import MoonCore from 'moon-core';

import * as fse from 'fs-extra';
import {join} from 'path';
import {IContext} from 'moon-core/declarations/typings/page';
import {IFileSaveOptions} from 'moon-core/declarations/typings/page';
import PageHooks from "./hook";
/**
 * @desc
 *
 * @使用场景
 *
 * @Date    2019/3/20
 **/
export async function genRnPage(context: IContext,hook?:PageHooks) {
  let {pageInfo, projectPath} = context;
  let prettiesConfig = {};
  try {
    prettiesConfig = await fse.readJSON(join(projectPath, 'pretties.json'));
  } catch (err) {}

  //把less , style内容记录下来,我砶修改
  await MoonCore.ReduxGen.buildPage({
    ...context,
    prettiesConfig,
    beforeSave: async (options: IFileSaveOptions, context: IContext) => {
      hook && hook.beforeSave.call(options, context);
      if (options.tplPath.endsWith('less.ejs')) {
        options.content = options.content.replace(
          '@import "~style/theme.less";',
          '',
        );
      }

      if (
        options.tplPath === 'index.tsx.ejs' ||
        options.tplPath === 'components/sub-components.tsx.ejs'
      ) {
        let keyName = 'index';
        if (options.param && options.param.subComp) {
          keyName = MoonCore.StringUtil.toLCamelize(
            options.param.subComp.fileName,
          );
          options.content = options.content
            .replace(`import './${options.param.subComp.fileName}.less';`, '')
            .replace(`className="${keyName}"`, '');
        } else {
          options.content = options.content
            .replace(`import './index.less';`, '')
            .replace(
              `className="${MoonCore.StringUtil.toLCamelize(
                context.pageInfo.pageKey,
              )}"`,
              '',
            );
        }

        options.content = options.content
          .replace(
            "import * as React from 'react';",
            `
          import React from 'react';
          import { StyleSheet, View , Text } from 'react-native';
          `,
          )
          // .replace("React.Component","Component")
          .replace(/<div/gi, '<View')
          .replace(/<\/div>/gi, '</View>');

        options.content = `${options.content}
          const styles = StyleSheet.create({
            ${keyName} : {
            }
          });
        `;
      }
      return options;
    },
    afterSave: async (options, context) => {
      hook && hook.afterSave.call(options, context);
    //   if(options.toSaveFilePath.includes("index.tsx")) {
    //
    //     let projectSrc  = projectPath;
    //     let pageKey = context.pageInfo.pageKey;
    //     let pageFilePath =join('pages', context.pageInfo.pagePath);
    //     for (let i = 0, iLen = pageInfo.actors.length; i < iLen; i++) {
    //       let actor = pageInfo.actors[i];
    //
    //       let reducerKey =  MoonCore.StringUtil.toLCamelize(pageKey+"-"+actor.fileName);
    //
    //       await MoonCore.CompileUtil.insertFile(join(projectSrc, 'src/redux/reducers/index.ts'), [
    //         {
    //           mark: '//mark1//',
    //           isBefore: true,
    //           content: `import ${reducerKey} from "@/${pageFilePath}/reducers/${actor.fileName}";`,
    //           check: (content): boolean => !content.includes(pageFilePath),
    //         },
    //         {
    //           mark: '//mark2//',
    //           isBefore: false,
    //           content: reducerKey+ ',',
    //           check: (content, rawContent): boolean =>
    //             !rawContent.includes(pageFilePath),
    //         },
    //       ]);
    //     }
    //
    //     await MoonCore.CompileUtil.insertFile(join(projectSrc, 'src/app.tsx'), [
    //       {
    //         mark: '//pagePath//',
    //         isBefore: true,
    //         content: `'${pageFilePath}/index',`,
    //         check: (content): boolean => !content.includes(pageFilePath),
    //       }
    //     ]);
    //   }
    },
  });
}
