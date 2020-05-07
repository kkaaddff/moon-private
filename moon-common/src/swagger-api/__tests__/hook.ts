/**
 * @desc
 *
 * @使用场景
 *
 * @coder.yang2010@gmail.com
 * @Date    2019/12/26
 **/


import  {
  SyncHook
} from "tapable";


(async()=>{
  let  loadSwagger = new SyncHook<string,object>(['sdfsdf','adasd']);

  loadSwagger.tap('test',(aa,tt1)=>{
    console.log(aa);
    tt1['a']="bc";
    console.log('plugin test execute');
    return 111;
  })

  let tt = {};

  let result  =  loadSwagger.call("111",tt);
  console.log(result);
  console.log('tt:::',tt);
})();