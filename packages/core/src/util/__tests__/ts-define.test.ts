/**
 * @desc
 *
 * @使用场景
 *
 * @Date    2019/4/2
 **/

import { genTsFromSchema, genTsFromDefines } from '../json-util'

describe('ts类型定义生成', () => {
  it('ts类型定义生成', async () => {
    let content = await genTsFromDefines({
      definitions: {
        'BaseResponse«WholeMenuInfoResponse»': {
          type: 'object',
          required: ['code'],
          properties: {
            code: {
              type: 'string',
              description: '结果码',
            },
            context: {
              description: '内容',
              originalRef: 'WholeMenuInfoResponse',
              $ref: '#/definitions/WholeMenuInfoResponse',
            },
            message: {
              type: 'string',
              description: '消息内容',
            },
          },
          title: 'BaseResponse«WholeMenuInfoResponse»',
        },
        WholeMenuInfoResponse: {
          type: 'object',
          properties: {
            functionInfoVOList: {
              type: 'array',
              description: '功能集合',
              items: {
                originalRef: 'FunctionInfoVO',
                $ref: '#/definitions/FunctionInfoVO',
              },
            },
            menuInfoVOList: {
              type: 'array',
              description: '菜单集合',
              items: {
                originalRef: 'MenuInfoVO',
                $ref: '#/definitions/MenuInfoVO',
              },
            },
          },
          title: 'WholeMenuInfoResponse',
        },
        FunctionInfoVO: {
          type: 'object',
          properties: {
            functionId: {
              type: 'string',
              description: 'Id',
            },
            functionName: {
              type: 'string',
              description: '功能名称',
            },
            functionSort: {
              type: 'integer',
              format: 'int32',
              description: '排序',
            },
            functionTitle: {
              type: 'string',
              description: '功能展示名称',
            },
            menuId: {
              type: 'string',
              description: '菜单Id',
            },
            systemType: {
              type: 'integer',
              format: 'int32',
              description: '系统类别',
            },
          },
          title: 'FunctionInfoVO',
        },
        MenuInfoVO: {
          type: 'object',
          properties: {
            menuGrade: {
              type: 'integer',
              format: 'int32',
              description: '菜单级别',
            },
            menuId: {
              type: 'string',
              description: 'Id',
            },
            menuName: {
              type: 'string',
              description: '菜单名',
            },
            menuSort: {
              type: 'integer',
              format: 'int32',
              description: '排序',
            },
            parentMenuId: {
              type: 'string',
              description: '父菜单Id',
            },
            systemType: {
              type: 'integer',
              format: 'int32',
              description: '系统类别',
            },
          },
          title: 'MenuInfoVO',
        },
      },
    })

    expect(content).toMatchSnapshot()
  })
})
