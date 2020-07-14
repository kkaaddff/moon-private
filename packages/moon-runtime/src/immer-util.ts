/**
 * @desc
 *
 * @使用场景
 *
 * @Date    2019/4/28
 **/

export function commonChange(
  immerObj,
  param: {
    batchUpdate?: [
      {
        paths: string[];
        value: any;
      }
    ];
    paths: string[];
    value: any;
    key: string;
  }
) {
  if (param.paths) {
    param.paths = ensurePath(param.paths);
  }

  if (param.paths[0] === param.key) {
    immerObj = modifyDeep(immerObj, param.paths.slice(1), param.value);
  }

  if (param.batchUpdate) {
    for (let i = 0, iLen = param.batchUpdate.length; i < iLen; i++) {
      let { paths, value } = param.batchUpdate[i];
      paths = ensurePath(paths);

      if (paths[0] === param.key) {
        immerObj = modifyDeep(immerObj, paths.slice(1), value);
      }
    }
  }

  return immerObj;
}

function ensurePath(paths: string | string[]): string[] {
  let result = paths;

  if (typeof paths === "string") {
    result = paths.split(".");
    return result;
  } else {
    return result as string[];
  }
  // return  result;
}

export function getValueByPath<T = any>(
  immerObj,
  paths: (string | number)[]
): T | undefined {
  if (!immerObj) {
    return;
  }

  let lastIndex = paths.length;
  let targetObj = immerObj;
  for (let i = 0, iLen = lastIndex; i < iLen; i++) {
    targetObj = targetObj[paths[i]];
    if (!targetObj) {
      console.warn(`the obj defined by paths ${paths} is not exist!!`);
      return;
    }
  }

  return targetObj;
}

/**
 * 根据路径对对象进行赋值;
 *
 * @param immerObj
 * @param paths
 * @param value
 */
export function modifyDeep(immerObj, paths: (string | number)[], value: any) {
  if (paths.length == 0) {
    if (typeof value === "function") {
      //调用外部方法对对象进行处理;
      immerObj = value(immerObj);
    } else {
      immerObj = value;
    }
    return immerObj;
  }

  let lastIndex = paths.length - 1;
  let obj = getValueByPath(immerObj, paths.slice(0, lastIndex));

  if (typeof value === "function") {
    //调用外部方法对对象进行处理;
    immerObj = value(obj[paths[lastIndex]]);
  } else {
    obj[paths[lastIndex]] = value;
  }

  return immerObj;
}

export function assign(immerObj, obj) {
  if (!obj) {
    return immerObj;
  }
  for (let propKey in obj) {
    immerObj[propKey] = obj[propKey];
  }
  return immerObj;
}
