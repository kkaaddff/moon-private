/**
 * @desc
 *
 * @使用场景
 *
 * @coder.yang2010@gmail.com
 * @Date    2020/5/13
 **/
import fs from 'fs'
import ApiCompileHooks from "moon-common/declarations/swagger-api/hook";
import * as fse from "fs-extra";

import fileVisitor from 'file-visitor';

/**
 *  type:  'api' 表示查找的是 api 中的文件生成 api.controller.xxx ,
 *  type:  'controller' 则查找的是页面中 api.controller.xx 替换调用方法参数
 * */
type CheckType = 'api' | 'controller'

export default class ApiWrapperCodeMod{

  constructor() {
  }

  srouceDir:string = "./demo/src";

  map:{
    [controllerName:string]:{
      methodName:string;
      reqParam:string[]
    }[]
  }={};

  apply=(hook:ApiCompileHooks) =>{
    hook.beforeCompile.tap('ApiWrapperCodeMod',async(apigroups)=>{
      debugger;
      this.map = apigroups.reduce((acc,next)=>{
        acc[next.name] = next.apis.map(item=>{
          return {
            methodName:item.name,
            reqParam:item.requestParam.map(item=>item.name)
          }
        })
        return acc;
      },{});
    })

    hook.finish.tap('ApiWrapperCodeModFinish',async()=>{
      debugger;
       // TODO dong 2020/5/13
       const METHOD_GET = 'sdk.get'

       const changeApi = async (_lookingForString: string, type: CheckType) => {
        try {
          await fileVisitor('D:/node-test/src', {
            '.ts[x]?$': a => {
              const { content, absPath, name } = a
      
              const tranPathToController = (funcName: string) => {
                const _fileName = name.toString()
                const _arr = _fileName.split('\\')
                const _name = _arr[_arr.length - 1].split('.')[0]
                // 转驼峰
                const _cName = changeCamel(_name)
                // 拼接
                return `api.${_cName}.${funcName}`
              }
      
              // 转驼峰
              const changeCamel = (str: string): string => {
                const strArr = str.split('-')
                if (strArr[0] === '') {
                  strArr.shift()
                }
                for (let i = 1, len = strArr.length; i < len; i++) {
                  if (strArr[i] !== '') {
                    strArr[i] = strArr[i][0].toUpperCase() + strArr[i].substring(1)
                  }
                }
                return strArr.join('')
              }
      
              const findPageOrComponmentFunc = (controllerName: string): void => {
                console.log(controllerName)
                changeApi(controllerName, 'controller')
              }
      
              const findApiController = (_lookStr: string): void => {
                // 在 data 中查找该字符串的位置
                const _data = content
                let index = _data.indexOf(_lookStr)
                let num = 0
                while (index !== -1) {
                  num++
                  const _start = _data.lastIndexOf('async function', index) + 15
                  const _end = _data.indexOf('(', _start)
                  const _funcName = _data.slice(_start, _end)
                  const _controllerName = tranPathToController(_funcName)
                  findPageOrComponmentFunc(_controllerName)
                  index = _data.indexOf(_lookStr, index + 1)
                }
              }
      
              // TODO dong 2020/5/13 修改引用方式;
      
              const handleFileChange = (_lookStr: string): void => {
                const _data = content
                const _filePath = absPath
                console.log(_filePath, _lookStr)
                const _start = _data.indexOf(_lookStr) + _lookStr.length
                const _end = _data.indexOf(')', _start) + 1
                const _args = _data.slice(_start, _end)
                const _new_args = makeNewParams(_args)
                console.log(`${_args}, 将替换为${_new_args}`)
                const newFileContent = _data.replace(_args, JSON.parse(_new_args))
                fs.writeFileSync(_filePath, newFileContent, 'utf8')
              }
      
              const makeNewParams = (str: string): string => {
                const _newStr = str.slice(1, str.length - 1)
                const _obj = `({${_newStr}})`
                return JSON.stringify(_obj)
              }
      
              // TODO dong 2020/5/13 检测文件内容
              
              const exc = new RegExp(_lookingForString)
              if (exc.test(content)) {
                if (type === 'api') {
                  findApiController(_lookingForString)
                } else {
                  handleFileChange(_lookingForString)
                }
              }
      
              // return
            }
          })
        } catch (error) {
          console.log(error)
        }
        // await fse.writeJSON("./method-reqparam.json",this.map);
      }
      
      changeApi(METHOD_GET, 'api')
    })

  }
}
