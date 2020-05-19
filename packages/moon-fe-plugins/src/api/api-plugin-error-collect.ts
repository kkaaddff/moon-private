/**
 * @desc
 *
 * @使用场景
 *
 * @coder.yang2010@gmail.com
 * @Date    2020/4/10
 **/
import ApiCompileHooks from "moon-common/declarations/swagger-api/hook";

export type ErrorMsg ={
  level:"warn"|"error";
  message:string;
};

export default class ErrorCollect{

  errorMsgs:any[]=[];

  onError=null;

  constructor(onError:(msgs:ErrorMsg[])=>void) {
    this.onError = onError;
  }

  apply(hook:ApiCompileHooks) {
    hook.onError.tap('collect-error-msg',async(msg,context)=>{
      this.errorMsgs.push(msg);
    });

   hook.finish.tap("finish-error-msg",async ()=>{
     if(this.errorMsgs?.length>0 && this.onError){
       this.onError(this.errorMsgs);
     }
    });
  }
}
