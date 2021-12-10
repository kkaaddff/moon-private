/**
 * @desc
 *
 * 创建controller与入参出参的关联信息;;
 *
 * @使用场景
 *
 * @Date    2019/5/20
 **/
import {
  Project,
  InterfaceDeclarationStructure,
  StructureKind,
  TypeAliasDeclarationStructure,
} from 'ts-morph'

import debug from 'debug'
const baseType = ['number', 'string', 'unknown', 'boolean']
const numberReg = /^[0-9]+$/
let log = debug('web-api:ts-index')
export interface Controller {
  fileName: ''
  methods: {
    [methodName: string]: {
      responseTs: string[]
    }
  }
}

export interface ApiIndex {}

const urlReg = new RegExp('`(.*)`')

// export function genApiTsIndex({
//   tsConfig,
//   apiDir,
//   apiSuffix,
//   filter,
// }: {
//   apiDir: string
//   tsConfig: string
//   apiSuffix?: string
//   filter?: (param: { filePath: string }) => boolean
// }) {
//   const project = new Project({
//     tsConfigFilePath: tsConfig,
//   })
//   let result = project.addSourceFileAtPath(apiDir + '**/*.ts')

//   let apiTeIndex = {}

//   for (let fileIndex = 0, fileIndexLen = result.length; fileIndex < fileIndexLen; fileIndex++) {
//     let fileController = result[fileIndex]
//     let fileName = fileController.getBaseNameWithoutExtension()

//     if (apiSuffix) {
//       if (!fileName.endsWith(apiSuffix)) {
//         continue
//       }
//     }

//     if (filter && !filter({ filePath: fileName })) {
//       continue
//     }

//     apiTeIndex[fileName] = {
//       fileName,
//       methods: {},
//     }
//     let allMethods = apiTeIndex[fileName].methods

//     let allInterface = fileController
//       .getStructure()
//       // @ts-ignore
//       .statements.filter((item) =>
//         [StructureKind.Interface, StructureKind.TypeAlias].includes(item.kind)
//       )
//     //获取所有function方法.
//     let controllerFuns = fileController.getFunctions()
//     for (let i = 0, iLen = controllerFuns.length; i < iLen; i++) {
//       let functionDec = controllerFuns[i]

//       let statement = functionDec.getStructure()

//       if (statement.kind === StructureKind.Function) {
//         let urlMatch = functionDec.getBodyText().match(urlReg)

//         let responseTs = statement.returnType
//           ? getAllTsNameRef(
//               allInterface,
//               //@ts-ignore
//               statement.returnType.replace('Promise<', '').replace('>', '')
//             )
//           : []

//         allMethods[statement.name] = {
//           methdoName: statement.name,
//           responseTs,
//           url: urlMatch && urlMatch[1],
//           params: statement.parameters.map((item) => {
//             let results =
//               (item.type &&
//                 (item.type as string).matchAll(/([a-zA-Z0-9_]*) ?\?? ?: ?([a-zA-Z0-9_]*);?/)) ||
//               []

//             return {
//               name: item.name,
//               subTypes: Array.from(results).map((item) => ({
//                 name: item[1],
//                 isRequired: item[0].includes('?'),
//                 type: item[2],
//               })),
//             }
//           }),
//         }
//       }
//     }
//   }

//   return apiTeIndex
// }

/**
 * 获取ts定义的事情 ...
 * 递归遍历所有的ts定义信息;;
 * @param {InterfaceDeclarationStructure[]} interfaces
 * @param {string} name
 * @param {string[]} results
 * @returns {string[]}
 */
function getAllTsNameRef(
  interfaces: (InterfaceDeclarationStructure | TypeAliasDeclarationStructure)[],
  name: string,
  results: string[] = []
): string[] {
  if (name.endsWith('[]') && !results.includes(name)) {
    name = name.replace('[]', '')
    if (isRefTs(name)) {
      results.push(name + '[]')
    }
  }

  for (let i = 0, iLen = interfaces.length; i < iLen; i++) {
    let interfaceItem = interfaces[i]
    if (interfaceItem.name === name) {
      //如果是type则继续传递向下找;
      if (StructureKind.TypeAlias === interfaceItem.kind) {
        if (typeof interfaceItem.type === 'string') {
          results.push(interfaceItem.name)
          getAllTsNameRef(interfaces, interfaceItem.type, results)
        }
      }

      if (StructureKind.Interface === interfaceItem.kind) {
        // @ts-ignore
        // console.log(interfaces.properties);
        //遍历获取子依赖..
        results.push(name)
        if (interfaceItem.properties) {
          // @ts-ignore
          for (let j = 0, jLen = interfaceItem.properties.length; j < jLen; j++) {
            // @ts-ignore
            let property = interfaceItem.properties[j]
            //基本类型不统计在内了.,只统计interface与type类型的.
            //@ts-ignore
            if (['number', 'string', 'YearMonth'].includes(property.type)) {
              continue
            }

            let _propertyType = property.type as string
            if (_propertyType.includes('|')) {
              let allRef = _propertyType.split('|')

              for (let k = 0, kLen = allRef.length; k < kLen; k++) {
                let refElement = allRef[k]
                if (isRefTs(refElement) && !results.includes(refElement)) {
                  results = getAllTsNameRef(interfaces, refElement, results)
                }
              }
            } else {
              if (isRefTs(_propertyType) && !results.includes(_propertyType)) {
                results = getAllTsNameRef(interfaces, _propertyType, results)
              }
            }
          }
        }
      }
    }
  }

  if (!results.includes(name) && isRefTs(name)) {
    results.push(name)
  }

  return results
}

/**
 * 判断是否是引用类型.
 * @param {string} refInfo
 * @returns {boolean}
 */
function isRefTs(refInfo: string): boolean {
  if (baseType.includes(refInfo)) {
    return false
  } else if (numberReg.test(refInfo.trim())) {
    return false
  }
  log(
    `判断是否是引用类型;${numberReg.test('1')} -${refInfo}- VS -${refInfo.trim()}-`,
    numberReg.test(refInfo + ''),
    typeof refInfo
  )
  return true
}
