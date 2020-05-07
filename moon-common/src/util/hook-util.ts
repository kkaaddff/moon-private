/**
 * @desc
 *
 * @使用场景
 *
 * @coder.yang2010@gmail.com
 * @Date    2020/3/12
 **/


export function applyHook(hook,item){

  try {
    if (typeof item === 'function') {
      item(hook);
    } else if (typeof item === 'string') {
      // TODO dong 2020/3/8 插件如果是字符串, 则动态require进来,没有install要install

    } else if (item.apply && typeof item.apply === 'function') {
      item['apply'](hook);
    } else {
      throw new Error('插件格式错误!!');
    }
  } catch (err) {
    console.error(err);
    return;
  }

}
