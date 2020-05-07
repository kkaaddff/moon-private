/**
 * @desc
 *
 * @使用场景
 *
 * @coder.yang2010@gmail.com
 * @Date    2020/3/30
 **/

import * as prettierClass from 'prettier';

export function prettier(jsContent:string,config:any):string{
  try {
    return prettierClass.format(jsContent,config)
  } catch (err) {
  }
  return jsContent;
}
