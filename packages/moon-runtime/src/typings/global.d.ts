/**
 * @desc
 *
 * @使用场景
 *
 * @coder.yang2010@gmail.com
 * @Date    2019/12/10
 **/


export interface Dispath {
  (param: {type: string; [key: string]: any}) : Promise<void>;
}