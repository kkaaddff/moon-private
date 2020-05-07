/**
 * @desc
 *
 * @使用场景
 *
 * @coder.yang2010@gmail.com
 * @Date    2020/4/27
 **/


import {genApiTsIndex} from "../ts-index";

describe('api索引', () => {
  it('basic', async () => {
    let tt  =  genApiTsIndex(
      {
        tsConfig:"/Users/dong/yzfworkbench/Auth4newdaizhang/packages/authority/tsconfig.json",
        apiDir:"/Users/dong/yzfworkbench/Auth4newdaizhang/packages/authority/src/api",
        filter:({filePath})=>{
          return filePath.includes("asset-change-controller");
        }
      }
    );
    console.log(tt);
    expect('hello').toEqual("hello");
  });
});
