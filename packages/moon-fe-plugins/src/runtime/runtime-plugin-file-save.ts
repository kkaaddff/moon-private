import {join} from 'path';
import * as fse from 'fs-extra';
import type PageModel from 'moon-common/declarations/page/model/page-model';

/**
 * @desc
 *
 * @使用场景
 *
 * @coder.yang2010@gmail.com
 * @Date    2020/4/20
 **/

export default class FileSave {
  /**
   *
   * @param targetFile   要修改的文件;
   * @param contentGene   要添加的路由内容;
   */
  constructor(
    public config: {onFileSave?: (filePath, content, options) => Promise<void>},
  ) {}

  apply = async (hook) => {
    hook.onFileSave.tap('onFileSave', async (filePath, content, options) => {
      return this.config?.onFileSave(filePath, content, options);
    });
  };
}
