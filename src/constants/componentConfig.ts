import { Component } from '../types'

const baseUrl = '/doc'

const config: Component[] = [
  {
    name: 'website component',
    thumbnail:
      'https://img.serverlesscloud.cn/20191226/1577353111488-website.png',
    slogan: '一行命令，部署您的静态网站',
    description:
      'Website Component 现已支持最新的 Web 框架（Vue.js、React 等），您可以在几秒钟内将静态网站部署到对象存储中。',
    link: `https://serverless.com/cn/components/tencent-website/`,
  },
  {
    name: 'Koa component',
    thumbnail:
      'https://img.serverlesscloud.cn/20191226/1577362756245-koajs.png',
    slogan: '快速部署 Koa 框架',
    description:
    '无需复杂配置，通过 Serverless Framework 快速部署 Koa 框架。',
    link: `https://serverless.com/cn/components/tencent-koa/`,
  },
  {
    name: 'express component',
    thumbnail:
      'https://img.serverlesscloud.cn/20191226/1577353480508-Express.js.png',
    slogan: '只需 3 秒，部署 Express.js 应用程序',
    description:
      '通过 Express Component，只需短短几秒，便能在腾讯云 Serverless 架构上部署按需计费的 Express.js 应用程序。',
    link: `https://serverless.com/cn/components/tencent-express/`,
  },
  {
    name: 'Python Flask component',
    thumbnail:
      'https://img.serverlesscloud.cn/20191226/1577353078702-flask.png',
    slogan: '快速部署 Python Flask 框架',
    description:
      '无需复杂的配置，通过 Serverless Framework 快速部署 Python Flask 框架。',
    link: `https://serverless.com/cn/components/tencent-flask/`,
  },
  {
    name: 'PHP Laravel component',
    thumbnail:
      'https://img.serverlesscloud.cn/20191226/1577353083364-laravel.png',
    slogan: '快速部署 PHP Laravel 框架',
    description:
    '无需复杂的配置，通过 Serverless Framework 快速部署 PHP Laravel 框架。',
    link: `https://serverless.com/cn/components/tencent-laravel/`,
  },
  {
    name: 'Egg component',
    thumbnail:
      'https://img.serverlesscloud.cn/20191226/1577362754931-egg.png',
    slogan: '快速部署 Egg 框架',
    description:
    '无需复杂的配置，通过 Serverless Framework 快速部署 Egg 框架。',
    link: `https://serverless.com/cn/components/tencent-egg/`,
  },
  {
    name: 'React fullstack component',
    thumbnail:
      'https://img.serverlesscloud.cn/20191226/1577353092870-react.png',
    slogan: '快速部署 React.js 全栈 Web 应用',
    description:
      '通过多个 Serverless Components 部署后端 API 与前端 React.js 结合的全栈应用程序。',
    link: `https://serverless.com/cn/components/tencent-flask/`,
  },
  {
    name: 'framework',
    thumbnail:
      'https://img.serverlesscloud.cn/20191226/1577353426037-probider.png',
    slogan: '摒弃复杂配置，轻松实现 REST API',
    description:
      '无需复杂的配置，通过 Serverless Framework CLI便可以结合云函数和 API 网关，轻松实现 REST API 场景。',
    link: `${baseUrl}/providers/tencent/templates/rest-api`,
  }
]

export default config
