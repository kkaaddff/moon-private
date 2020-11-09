/**
 * @desc
 *
 * @使用场景
 *
 * @coder.yang2010@gmail.com
 * @Date    2020/4/27
 **/


import {genApiTsIndex} from "../ts-index";
import {join} from  'path';




describe('api索引', () => {
  it('basic', async () => {

    let tt  =  genApiTsIndex(
      {
        tsConfig:join(__dirname,"./datas/api/tsconfig.json"),
        apiDir:join(__dirname,"./datas/api"),
        // filter:({filePath})=>{
        //   return filePath.includes("asset-change-controller");
        // }
      }
    );

    expect(tt).toMatchSnapshot();
  });
});
