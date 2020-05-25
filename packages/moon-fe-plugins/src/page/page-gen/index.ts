import {join} from 'path'
import * as ejs from 'ejs'
import * as fse from 'fs-extra';
import {IGenPageContext} from "moon-common/declarations/page/pc";

/**
 * @desc
 *
 * @使用场景
 *
 * @coder.yang2010@gmail.com
 * @Date    2020/3/9
 **/
export function apply(hook: any) {
  hook.loadGeneratorEngine.tap('loadcustom tpl', async () => {
    return async (pageModel: any, context: IGenPageContext) => {
      let prettConfig = context.prettiesConfig;
      let hook =context.hook;
      let {tplUtil, prettierUtil} = context.util;
      let tplHandle = tplUtil.getHandleFile({
        outDir: join(context.projectPath, 'src/pages/', pageModel.pagePath),
        tplBase: join(__dirname, 'page-tpl'),
        context: {
          beforeSave: async (options, context) => {
            if (options.tplPath.includes('.less')) {
              return options
            }
            if(prettConfig){
               options.content = prettierUtil.prettier(options.content,prettConfig)
            }
            hook?.beforeSave?.call(options,context);
            return options
          },
          afterSave:async(options, context)=>{
            hook?.afterSave?.call(options,context);
          }
        },
      })

      let subCompGenPromise = []
      for (let i = 0, iLen = pageModel.subComponents.length; i < iLen; i++) {
        let subComp = pageModel.subComponents[i]
        subCompGenPromise.push(
          tplHandle(
            'components/sub-components.tsx.ejs',
            async (tplContent) => {
              let conent = ejs.render(tplContent, {
                pageModel,
                subComp,
              })
              return conent
            },
            {
              saveFilePath: `components/${subComp.name}.tsx`,
            },
          ),
        )
        subCompGenPromise.push(
          tplHandle(
            'components/sub-components.less.ejs',
            async (tplContent) => {
              let conent = ejs.render(tplContent, {
                pageModel,
                subComp,
              })
              return conent
            },
            {
              saveFilePath: `components/${subComp.name}.less`,
            },
          ),
        )
      }

      let dataModelsPromise = []
      for (let i = 0, iLen = pageModel.dataModels.length; i < iLen; i++) {
        let dataModel = pageModel.dataModels[i]
        dataModelsPromise.push(
          tplHandle(
            'reducers/reducer.ts.ejs',
            async (tplContent) => {
              let conent = ejs.render(tplContent, {
                pageModel,
                dataModel,
              })
              return conent
            },
            {
              saveFilePath: `reducers/${dataModel.name}.tsx`,
            },
          ),
        )
      }

      let actionsPromise = []
      for (let i = 0, iLen = pageModel.actions.length; i < iLen; i++) {
        let action = pageModel.actions[i]
        actionsPromise.push(
          tplHandle(
            'actions/action.ts.ejs',
            async (tplContent) => {
              let conent = ejs.render(tplContent, {
                pageModel,
                action,
              })
              return conent
            },
            {
              saveFilePath: `actions/${action.name}.ts`,
            },
          ),
        )
      }

      await Promise.all([
        await tplHandle('index.tsx.ejs', async (tplContent) => {
          let conent = ejs.render(tplContent, {
            pageModel,
          })
          return conent
        }),

        await tplHandle('constant.ts.ejs', async (tplContent) => {
          let conent = ejs.render(tplContent, {
            pageModel,
          })
          return conent
        }),

        await tplHandle('actions/index.ts.ejs', async (tplContent) => {
          let conent = ejs.render(tplContent, {
            pageModel,
          })
          return conent
        }),

        await tplHandle('selectors.ts.ejs', async (tplContent) => {
          let conent = ejs.render(tplContent, {
            pageModel,
          })
          return conent
        }),

        await tplHandle('index.less.ejs', async (tplContent) => {
          let conent = ejs.render(tplContent, {
            pageModel,
          })
          return conent
        }),

        await tplHandle('types.d.ts.ejs', async (tplContent) => {
          let conent = ejs.render(tplContent, {
            pageModel,
          })
          return conent
        }),
        ...subCompGenPromise,
        ...dataModelsPromise,
        ...actionsPromise,
      ])
    }
  })
}
