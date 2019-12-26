const baseUrl = '/doc'

let config = [
  {
    label: '概述',
    to: `${baseUrl}/overview`,
  },
  {
    label: '快速开始',
    to: `${baseUrl}/quick-start`,
  },
  {
    label: '支持者 CLI 文档',
    content: [
      {
        label: '腾讯',
        content: [
          {
            label: 'CLI 文档',
            content: [
              {
                label: '快速开始',
                to: `${baseUrl}/providers/tencent/cli-reference/quick-start`,
              },
              {
                label: '配置账号',
                to: `${baseUrl}/providers/tencent/cli-reference/configure`,
              },
              {
                label: '创建服务',
                to: `${baseUrl}/providers/tencent/cli-reference/create`,
              },
              {
                label: '打包服务',
                to: `${baseUrl}/providers/tencent/cli-reference/package`,
              },
              {
                label: '部署服务',
                to: `${baseUrl}/providers/tencent/cli-reference/deploy`,
              },
              {
                label: '部署函数',
                to: `${baseUrl}/providers/tencent/cli-reference/deploy-function`,
              },
              {
                label: '部署列表',
                to: `${baseUrl}/providers/tencent/cli-reference/deploy-list`,
              },
              {
                label: '云端调用',
                to: `${baseUrl}/providers/tencent/cli-reference/invoke`,
              },
              {
                label: '日志查看',
                to: `${baseUrl}/providers/tencent/cli-reference/logs`,
              },
              {
                label: '回滚服务',
                to: `${baseUrl}/providers/tencent/cli-reference/rollback`,
              },
              {
                label: '删除服务',
                to: `${baseUrl}/providers/tencent/cli-reference/delete`,
              },
              {
                label: '获取详情',
                to: `${baseUrl}/providers/tencent/cli-reference/info`,
              },
              {
                label: '运行数据统计',
                to: `${baseUrl}/providers/tencent/cli-reference/metrics`,
              },
            ],
          },
          {
            label: '事件类型',
            content: [
              {
                label: 'API 网关',
                to: `${baseUrl}/providers/tencent/events/apigateway`,
              },
              {
                label: 'COS 对象存储',
                to: `${baseUrl}/providers/tencent/events/cos`,
              },
              {
                label: 'Timer 定时触发器',
                to: `${baseUrl}/providers/tencent/events/timer`,
              },
              {
                label: 'CKakfa 消息队列',
                to: `${baseUrl}/providers/tencent/events/cloud-kafka`,
              },
              {
                label: 'CMQ 消息队列',
                to: `${baseUrl}/providers/tencent/events/cmq`,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    label: '支持者 Component 文档',
    content: [
      {
        label: '腾讯',
        content: [
          {
            label: '基础 Component',
            content: [
              {
                label: '云函数 SCF 组件',
                to: `${baseUrl}/providers/tencent/components/scf`,
              },
              {
                label: 'API 网关组件',
                to: `${baseUrl}/providers/tencent/components/apigateway`,
              },
              {
                label: '对象存储 COS 组件',
                to: `${baseUrl}/providers/tencent/components/cos`,
              },
              {
                label: '内容分发网络 CDN 组件',
                to: `${baseUrl}/providers/tencent/components/cdn`,
              },
              {
                label: '访问管理 CAM 角色组件',
                to: `${baseUrl}/providers/tencent/components/cam-role`,
              },
              {
                label: '访问管理 CAM 策略组件',
                to: `${baseUrl}/providers/tencent/components/cam-policy`,
              },
            ],
          },
          {
            label: '最佳实践',
            content: [
              {
                label: '快速部署 Express 框架',
                to: `${baseUrl}/providers/tencent/components/express`,
              },
              {
                label: '快速部署 Koa 框架',
                to: `${baseUrl}/providers/tencent/components/koa`,
              },
              {
                label: '快速部署 Egg 框架',
                to: `${baseUrl}/providers/tencent/components/koa`,
              },
              {
                label: '快速部署一个 Vue 全栈应用',
                to: `${baseUrl}/providers/tencent/templates/vue-full-stack`,
              },
              {
                label: '快速部署一个 React 全栈应用',
                to: `${baseUrl}/providers/tencent/templates/react-full-stack`,
              },
              {
                label: '部署 PHP Laravel 框架',
                to: `${baseUrl}/providers/tencent/components/laravel`,
              },
              {
                label: '快速部署 Python Flask 框架',
                to: `${baseUrl}/providers/tencent/components/flask`,
              },
              {
                label: '快速构建 REST API',
                to: `${baseUrl}/providers/tencent/templates/rest-api`,
              },
              {
                label: '快速部署静态网站',
                to: `${baseUrl}/providers/tencent/components/website`,
              },
              {
                label: '快速部署 Hexo 博客',
                to: `${baseUrl}/providers/tencent/templates/hexo`,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    label: '常见问题',
    to: `${baseUrl}/questions`,
  },
]

module.exports = {
  baseUrl,
  config,
}
