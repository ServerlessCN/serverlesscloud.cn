import { Component } from '../types'

const baseUrl = '/doc'

const config: Component[] = [
  {
    name: 'framework',
    thumbnail:
      'https://img.qcloud.com/qcloud/iaas_web/build/sfo_provider_2x_v2.png',
    slogan: '摒弃复杂配置，轻松实现 REST API',
    description:
      '无需复杂的配置，通过 Serverless Framework CLI便可以结合云函数和 API 网关，轻松实现 REST API 场景。',
    link: `${baseUrl}/providers/tencent/templates/rest-api`,
  },
  {
    name: 'express component',
    thumbnail:
      'https://main.qcloudimg.com/raw/706ecab42919643ad6099a7b585efc16.png',
    slogan: '只需3秒，部署 Express.js 应用程序',
    description:
      '通过腾讯云 Express 组件，只需短短几秒，便能在腾讯云Serverless 架构上部署按需计费的 Express.js 应用程序。',
    link: `${baseUrl}/providers/tencent/components/express`,
  },
  {
    name: 'website component',
    thumbnail:
      'https://main.qcloudimg.com/raw/38c79c64784c926f05e4de86093874ff.png',
    slogan: '一行命令，部署您的静态网站',
    description:
      '腾讯云 Website 组件现已支持最新的 Web 框架和技术（Vue.js、React 等），您可以在几秒钟内将静态网站部署到对象存储中。',
    link: `${baseUrl}/providers/tencent/components/website`,
  },
]

export default config
