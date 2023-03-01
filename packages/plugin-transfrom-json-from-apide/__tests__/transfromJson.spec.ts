import { transfromJson } from '../src'
import { isEqual } from 'lodash'

const YapiJson = {
  swagger: '2.0',
  info: {
    title: 'crm-inspector',
    version: 'last',
  },
  basePath: '/',
  tags: [
    {
      name: '质检模板项服务(Pigeon api)',
    },
  ],
  schemes: ['http'],
  paths: {
    '/listTemplateItem': {
      post: {
        tags: ['质检模板项服务(Pigeon api)'],
        summary: '列表查询',
        description: '[李祥伟]()',
        consumes: ['application/json'],
        parameters: [
          {
            name: 'root',
            in: 'body',
            schema: {
              properties: {
                templateId: {
                  description: '主键',
                  mock: {
                    mock: '@integer',
                  },
                  type: 'Long',
                },
              },
              required: ['templateId'],
              title: 'empty object',
              type: 'object',
            },
          },
        ],
        responses: {
          '200': {
            description: 'successful operation',
            schema: {
              properties: {
                data: {
                  description: '类型：com.inspector.dto.TemplateItemDto',
                  properties: {
                    level: {
                      description: '枚举类型->FIRST:;SECOND:;',
                      mock: {
                        mock: '@string',
                      },
                      type: 'String',
                    },
                    name: {
                      description: '模板项名称',
                      mock: {
                        mock: '@string',
                      },
                      type: 'String',
                    },
                    id: {
                      description: '',
                      mock: {
                        mock: '@integer',
                      },
                      type: 'integer',
                    },
                    templateId: {
                      description: '模板id',
                      mock: {
                        mock: '@integer',
                      },
                      type: 'integer',
                    },
                    childItemList: {
                      description:
                        '；类型：com.inspector.dto.TemplateItemDto；属性信息见当前属性所在对象的属性信息',
                      type: 'object',
                    },
                    parentId: {
                      description: '业务类型',
                      mock: {
                        mock: '@integer',
                      },
                      type: 'integer',
                    },
                    status: {
                      description: '枚举类型->ENABLE:;DISABLE:;',
                      mock: {
                        mock: '@string',
                      },
                      type: 'String',
                    },
                  },
                  required: [
                    'id',
                    'parentId',
                    'name',
                    'level',
                    'status',
                    'templateId',
                    'childItemList',
                  ],
                  type: 'object',
                },
                success: {
                  description: '',
                  mock: {
                    mock: '@boolean',
                  },
                  type: 'boolean',
                },
                errorCode: {
                  description: '',
                  mock: {
                    mock: '@integer',
                  },
                  type: 'integer',
                },
                errorMsg: {
                  description: '',
                  mock: {
                    mock: '@string',
                  },
                  type: 'String',
                },
              },
              required: ['success', 'errorCode', 'errorMsg', 'data'],
              title: 'empty object',
              type: 'object',
            },
          },
        },
      },
    },
  },
}

const TargetJson = {
  swagger: '2.0',
  definitions: {},
  info: {
    title: 'crm-inspector',
    version: 'last',
  },
  basePath: '/',
  tags: [
    {
      name: '质检模板项服务(Pigeon api)',
      description: 'Pigeon api',
    },
  ],
  schemes: ['http'],
  paths: {
    '/listTemplateItem': {
      post: {
        tags: ['质检模板项服务(Pigeon api)'],
        summary: '列表查询',
        operationId: 'listTemplateItemBypost',
        description: '[李祥伟]()',
        consumes: ['application/json'],
        parameters: [
          {
            name: 'root',
            in: 'body',
            schema: {
              properties: {
                templateId: {
                  description: '主键',
                  mock: {
                    mock: '@integer',
                  },
                  type: 'Long',
                },
              },
              required: ['templateId'],
              title: 'empty object',
              type: 'object',
            },
          },
        ],
        responses: {
          '200': {
            description: 'successful operation',
            schema: {
              properties: {
                data: {
                  description: '类型：com.inspector.dto.TemplateItemDto',
                  properties: {
                    level: {
                      description: '枚举类型->FIRST:;SECOND:;',
                      mock: {
                        mock: '@string',
                      },
                      type: 'String',
                    },
                    name: {
                      description: '模板项名称',
                      mock: {
                        mock: '@string',
                      },
                      type: 'String',
                    },
                    id: {
                      description: '',
                      mock: {
                        mock: '@integer',
                      },
                      type: 'integer',
                    },
                    templateId: {
                      description: '模板id',
                      mock: {
                        mock: '@integer',
                      },
                      type: 'integer',
                    },
                    childItemList: {
                      description:
                        '；类型：com.inspector.dto.TemplateItemDto；属性信息见当前属性所在对象的属性信息',
                      type: 'object',
                    },
                    parentId: {
                      description: '业务类型',
                      mock: {
                        mock: '@integer',
                      },
                      type: 'integer',
                    },
                    status: {
                      description: '枚举类型->ENABLE:;DISABLE:;',
                      mock: {
                        mock: '@string',
                      },
                      type: 'String',
                    },
                  },
                  required: [
                    'id',
                    'parentId',
                    'name',
                    'level',
                    'status',
                    'templateId',
                    'childItemList',
                  ],
                  type: 'object',
                },
                success: {
                  description: '',
                  mock: {
                    mock: '@boolean',
                  },
                  type: 'boolean',
                },
                errorCode: {
                  description: '',
                  mock: {
                    mock: '@integer',
                  },
                  type: 'integer',
                },
                errorMsg: {
                  description: '',
                  mock: {
                    mock: '@string',
                  },
                  type: 'String',
                },
              },
              required: ['success', 'errorCode', 'errorMsg', 'data'],
              title: 'empty object',
              type: 'object',
            },
          },
        },
      },
    },
  },
}

describe('transfrom-plugin/transfromJson', () => {
  it('Json After transformed should be equal to target ', () => {
    const transfromedCtx = {
      swaggerJson: YapiJson,
    }
    transfromJson(transfromedCtx)
    expect(transfromedCtx.swaggerJson).toEqual(TargetJson)
  })
})
