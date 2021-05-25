/**
 * @desc
 *
 * @使用场景
 *
 * @Date    2019/4/2
 **/

import { genTsFromSchema, genTsFromDefines } from '../json-util'
import { join } from 'path'
import * as fse from 'fs-extra'

describe('ref测试', () => {
  it('ref测试', async () => {
    let result = await genTsFromDefines({
      // "type": "array",
      // "items": {
      //   "$ref": "#/definitions/OfflineAccountVO",
      //   "originalRef": "OfflineAccountVO"
      // },
      definitions: {
        TestArray2: {
          title: 'TestArray2',
          type: 'array',
          items: {
            $ref: '#/definitions/OfflineAccountVO',
            originalRef: 'OfflineAccountVO',
          },
        },
        TestArray1: {
          title: 'TestArray1',
          type: 'array',
          items: {
            $ref: '#/definitions/OfflineAccountVO',
            originalRef: 'OfflineAccountVO',
          },
        },
        TestArray: {
          title: 'TestArray',
          type: 'array',
          items: {
            $ref: '#/definitions/OfflineAccountVO',
            originalRef: 'OfflineAccountVO',
          },
        },
        OfflineAccountVO: {
          type: 'object',
          properties: {
            accountId: {
              type: 'integer',
              format: 'int64',
              description: '线下账户id',
            },
            accountName: {
              type: 'string',
              description: '账户名称',
            },
            bankBranch: {
              type: 'string',
              description: '支行',
            },
            bankName: {
              type: 'string',
              description: '开户银行',
            },
            bankNo: {
              type: 'string',
              description: '账号',
            },
            bankStatus: {
              type: 'string',
              description: '账号状态\n* ENABLE: 启用\n* DISABLE: 禁用',
              enum: ['0', '1'],
            },
            companyInfoId: {
              type: 'integer',
              format: 'int64',
              description: '公司信息id',
            },
            createTime: {
              type: 'string',
              format: 'date-time',
              description: '创建时间',
            },
            deleteFlag: {
              type: 'string',
              description: '删除标志\n* NO: 否\n* YES: 是',
              enum: ['0', '1'],
            },
            deleteTime: {
              type: 'string',
              format: 'date-time',
              description: '删除时间',
            },
            isDefaultAccount: {
              type: 'string',
              description: '是否主账号\n* NO: 否\n* YES: 是',
              enum: ['0', '1'],
            },
            isReceived: {
              type: 'string',
              description: '是否收到平台首次打款\n* NO: 否\n* YES: 是',
              enum: ['0', '1'],
            },
            thirdId: {
              type: 'string',
              description: '第三方店铺id',
            },
            update_time: {
              type: 'string',
              format: 'date-time',
              description: '修改时间',
            },
          },
          title: 'OfflineAccountVO',
        },
      },
    })

    expect(result).toMatchSnapshot()
  })
})
