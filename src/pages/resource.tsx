import * as React from 'react'
import Layout from '@src/layouts'
import { Container } from '@src/components/atoms'
import Helmet from '@src/components/Helmet'
import './resource.css'

interface Props {
  location: string
}

const resource: {
  title: string
  list: {
    title: string
    link?: string
  }[]
}[] = [
  {
    list: [
      {
        title: '一、基础组件',
      },
      {
        title: '@serverless/tencent-apigateway - 腾讯云 API 网关组件',
        link: 'https://github.com/serverless-components/tencent-apigateway',
      },
      {
        title: '@serverless/tencent-cam-role - 腾讯云 CAM 角色组件',
        link: 'https://github.com/serverless-components/tencent-cam-role',
      },
      {
        title: '@serverless/tencent-cam-policy - 腾讯云 CAM 策略组件',
        link: 'https://github.com/serverless-components/tencent-cam-policy',
      },
      {
        title: '@serverless/tencent-cdn - 腾讯云 CDN 组件',
        link: 'https://github.com/serverless-components/tencent-cdn',
      },
      {
        title: '@serverless/tencent-cos - 腾讯云云对象存储组件',
        link: 'https://github.com/serverless-components/tencent-cos',
      },
      {
        title: '@serverless/tencent-postgresql - 腾讯云 PG DB Serverless 数据库组件',
        link: 'https://github.com/serverless-components/tencent-postgresql',
      },
      {
        title: '@serverless/tencent-scf - 腾讯云云函数组件',
        link: 'https://github.com/serverless-components/tencent-scf',
      },
      {
        title: '@serverless/tencent-ssl - 腾讯云 SSL 证书组件',
        link: 'https://github.com/serverless-tencent/tencent-ssl',
      },
      {
        title: '@serverless/tencent-vpc - 腾讯云 VPC 私有网络组件',
        link: 'https://github.com/serverless-components/tencent-vpc',
      },
      {
        title: '二、高阶组件',
      },
      {
        title: '@serverless/serverless-global - 管理全局变量的组件',
        link: 'https://github.com/serverless-tencent/serverless-global',
      },
      {
        title: '@serverless/tencent-bottle - 腾讯云 Python Bottle RESTful API 组件',
        link: 'https://github.com/serverless-tencent/tencent-bottle',
      },
      {
        title: '@serverless/tencent-django - 腾讯云 Python Django RESTful API 组件',
        link: 'https://github.com/serverless-tencent/tencent-django',
      },
      {
        title: '@serverless/tencent-egg - 快速部署基于 Egg.js 的后端服务到腾讯云函数的组件',
        link: 'https://github.com/serverless-components/tencent-egg',
      },
      {
        title: '@serverless/tencent-express - 快速部署基于 Express.js 的后端服务到腾讯云函数的组件',
        link: 'https://github.com/serverless-components/tencent-express',
      },
      {
        title: '@serverless/tencent-flask - 腾讯云 Python Flask RESTful API 组件',
        link: 'https://github.com/serverless-components/tencent-flask',
      },
      {
        title: '@serverless/tencent-koa - 快速部署基于 Koa.js 的后端服务到腾讯云函数的组件',
        link: 'https://github.com/serverless-components/tencent-koa',
      },
      {
        title: '@serverless/tencent-laravel - 腾讯云 PHP Laravel RESTful API 组件',
        link: 'https://github.com/serverless-components/tencent-laravel',
      },
      {
        title: '@serverless/tencent-nextjs - 快速部署基于 Next.js 框架到腾讯云函数的组件',
        link: 'https://github.com/serverless-components/tencent-nextjs',
      },
      {
        title: '@serverless/tencent-nuxtjs - 快速部署基于 Nuxt.js 框架到腾讯云函数的组件',
        link: 'https://github.com/serverless-components/tencent-nuxtjs',
      },
      {
        title: '@serverless/tencent-pyramid - 腾讯云 Python Pyramid RESTful API 组件',
        link: 'https://github.com/serverless-tencent/tencent-pyramid',
      },
      {
        title: '@serverless/tencent-thinkphp - 腾讯云 ThinkPHP RESTful API 组件',
        link: 'https://github.com/serverless-components/tencent-thinkphp',
      },
      {
        title: '@serverless/tencent-tornado - 腾讯云 Python Tornado RESTful API 组件',
        link: 'https://github.com/serverless-tencent/tencent-tornado',
      },
      {
        title: '@serverless/tencent-website - 快速部署静态网站到腾讯云的组件',
        link: 'https://github.com/serverless-components/tencent-website',
      },
      {
        title: '三、社区贡献组件',
      },
      {
        title: '@authing/serverless-oidc - 快速部署基于 Authing 的身份认证组件',
        link: 'https://github.com/Authing/serverless-oidc',
      },
      {
        title: '@twn39/tencent-fastify - 快速部署基于 fastify.js 的后端服务到腾讯云函数的组件',
        link: 'https://github.com/twn39/tencent-fastify',
      },
      {
        title: '@twn39/tencent-php-slim - 快速部署基于 Slim PHP 微框架的后端服务到腾讯云函数的组件',
        link: 'https://github.com/twn39/tencent-php-slim',
      },
    ],
    title: '组件',
  },
  {
    list: [
      {
        title: 'Serverless 基本概念入门',
        link: 'https://serverlesscloud.cn/blog/2019-08-01-serverless-basic-concept/',
      },
      {
        title: 'Serverless + Docsify（部署文档网站）',
        link: 'https://serverlesscloud.cn/best-practice/2019-12-14-docsify-with-serverless/',
      },
      {
        title: 'Serverless + Hexo（部署个人博客）',
        link: 'https://serverlesscloud.cn/best-practice/2019-12-4-Quickly-build-personal-blog/',
      },
      {
        title: 'Serverless + Thumbsup（部署个人相册）',
        link: 'https://serverlesscloud.cn/best-practice/2019-12-13-Build-personal-album-website-with-serverless/',
      },
      {
        title: 'Serverless + Wintersmith（部署个人站点）',
        link: 'https://serverlesscloud.cn/best-practice/2020-01-13-Wintersmith-with-serverless/',
      },
      {
        title: 'Serverless 运行原理与组件架构',
        link: 'https://serverlesscloud.cn/blog/2019-08-21-serverless-operation-architecture/',
      },
      {
        title: 'Serverless 开发者工具建设',
        link: 'https://serverlesscloud.cn/blog/2019-08-25-serverless-developer-tools/',
      },
      {
        title: 'Serveless Component 是什么？',
        link: 'https://serverlesscloud.cn/blog/2018-04-25-what-are-serverless-components-how-use/',
      },
      {
        title: '通过 SCF Component 轻松构建 RESTful API',
        link: 'https://serverlesscloud.cn/best-practice/2019-12-3-Easy-to-build-REST-API/',
      },
      {
        title: 'Serverless + 企业微信打造 nCoV 疫情监控小助手',
        link: 'https://serverlesscloud.cn/best-practice/2020-02-06-serverless-work-weixin/',
      },
      {
        title: 'Serverless + Laravel 创建 CMS 内容管理系统',
        link: 'https://serverlesscloud.cn/best-practice/2020-01-13-LARAVEL-with-serverless/',
      },
      {
        title: 'Serverless + Egg.js 后台管理系统实战',
        link: 'https://serverlesscloud.cn/best-practice/2020-02-07-serverless-admin-system/',
      },
      {
        title: '基于 Serverless Component 全栈解决方案',
        link: 'https://serverlesscloud.cn/best-practice/2019-12-5-Full-stack-solution-based-on-serverless-component/',
      },
      {
        title: '基于 Serverless Component 全栈解决方案 - 续集',
        link: 'https://serverlesscloud.cn/best-practice/2019-12-11-serverless-fullstack-vue-practice-pro/',
      },
      {
        title: 'Serverless 的资源评估与成本探索',
        link: 'https://serverlesscloud.cn/blog/2019-12-10-resource-cost',
      },
      {
        title: 'NGW，前端新技术赛场：Serverless SSR 技术内幕',
        link: 'https://serverlesscloud.cn/blog/2019-11-15-serverless-ssr',
      },
      {
        title: '云函数场景下的 DevOps 实践 - Jenkins 篇',
        link: 'https://cloud.tencent.com/developer/article/1461708',
      },
      {
        title: '云函数场景下的 DevOps 实践 - CODING 企业版',
        link: 'https://cloud.tencent.com/developer/article/1467480',
      },
      {
        title: '云函数场景下的 DevOps 实践 - 蓝盾',
        link: 'https://cloud.tencent.com/developer/article/1479998',
      },
      {
        title: '如何开发自己的第一个 component',
        link: 'https://serverlesscloud.cn/best-practice/2019-12-12-how-write-first-serverless-component/',
      },
      {
        title: 'Serverless 从入门到精通：架构介绍及场景分析',
        link: 'https://cloud.tencent.com/edu/learning/live-1440',
      },
      {
        title: 'Serverless 架构揭秘与静态网站部署实战',
        link: 'https://cloud.tencent.com/edu/learning/live-1879',
      },
      {
        title: 'Serverless 开发实战之 Nodejs',
        link: 'https://cloud.tencent.com/edu/learning/live-1888',
      },
      {
        title: 'Serverless Python开发实战之极速制作情人节表白页',
        link: 'https://cloud.tencent.com/edu/learning/live-1910',
      },
      {
        title: 'Serverless 工程化实战：基于 Python + JS 的动态博客开发',
        link: 'https://cloud.tencent.com/edu/learning/live-1926',
      },
    ],
    title: '系列教程',
  },
  {
    list: [
      {
        title: 'Adblock（去广告搜索引擎）',
        link: 'https://github.com/TencentCloud/Serverless-demos/tree/master/Adblock',
      },
      {
        title: 'License Reco（车票识别 API）',
        link:
          'https://github.com/TencentCloud/Serverless-demos/tree/master/License%20Reco%EF%BC%88%E8%BD%A6%E7%A5%A8%E8%AF%86%E5%88%AB%20API%EF%BC%89',
      },
      {
        title: 'Natural Language Processing（网站与自然语言处理）',
        link:
          'https://github.com/TencentCloud/Serverless-demos/tree/master/Natural%20Language%20Processing%EF%BC%88%E7%BD%91%E7%AB%99%E4%B8%8E%E8%87%AA%E7%84%B6%E8%AF%AD%E8%A8%80%E5%A4%84%E7%90%86%EF%BC%89',
      },
      {
        title: 'Online Judge（在线判题系统）',
        link:
          'https://github.com/TencentCloud/Serverless-demos/tree/master/Online%20Judge%EF%BC%88%E5%9C%A8%E7%BA%BF%E5%88%A4%E9%A2%98%E7%B3%BB%E7%BB%9F%EF%BC%89',
      },
      {
        title: 'Watermark（上传图片加水印）',
        link: 'https://github.com/TencentCloud/Serverless-demos/tree/master/Watermark',
      },
      {
        title: 'Weather info system（天气信息系统）',
        link:
          'https://github.com/TencentCloud/Serverless-demos/tree/master/Weather%20info%20system%EF%BC%88%E5%A4%A9%E6%B0%94%E4%BF%A1%E6%81%AF%E7%B3%BB%E7%BB%9F%EF%BC%89',
      },
      {
        title: 'nCoV-web（疫情查询页）',
        link: 'https://github.com/TencentCloud/Serverless-demos/tree/master/nCoV-web',
      },
      {
        title: 'nCoV-wechat（疫情监控助手）',
        link:
          'https://github.com/TencentCloud/Serverless-demos/tree/master/nCoV-wechat%EF%BC%88%E7%96%AB%E6%83%85%E7%9B%91%E6%8E%A7%E5%8A%A9%E6%89%8B%EF%BC%89',
      },
      {
        title: '更多示例：Serverless-Demos',
        link: 'https://github.com/TencentCloud/Serverless-demos',
      },
      {
        title: '推荐书籍：《Serverless 架构：从原理、设计到项目实战》',
        link: 'https://item.jd.com/12592747.html',
      },
    ],
    title: '社区案例',
  },
]

const Resource = ({ location }: Props) => {
  React.useEffect(() => {
    const resourceBodyDom = document.getElementById('scf-box-resource-body')
    if (!resourceBodyDom) return
    const tabs = resourceBodyDom.getElementsByClassName('scf-box-mobile-tabs-ul')
    const contents = resourceBodyDom.getElementsByClassName('scf-grid') as HTMLCollectionOf<HTMLDivElement>
    if (!contents) return
    if (!tabs) return

    const tabItems = tabs[0].children as HTMLCollectionOf<HTMLLIElement>
    function tabOnClick(n) {
      for (var i = 0; i < tabItems.length; ++i) {
        if (i == n) {
          tabItems[i].style.color = '#0052D9'
          if (contents[i]) contents[i].style.display = 'block'
          continue
        }
        tabItems[i].style.color = '#666666'
        if (contents[i]) contents[i].style.display = 'none'
      }
    }
    for (var i = 0; i < tabItems.length; ++i) {
      ;(function(i) {
        tabItems[i].onclick = function() {
          tabOnClick(i)
        }
      })(i)
    }
  })
  return (
    <Layout>
      <Helmet
        title="资源 - Serverless"
        keywords="Serverless components,Serverless组件,Serverless案例"
        description="Serverless components 组件实战，快速上手Serverless框架组件能力，帮助上手Serverless最佳操作场景实战。"
        location={location}
      />
      <h1 className="page-title">Serverless 中文网 - 资源</h1>
      <div style={{ marginTop: '80px', flex: '1 1' }}>
        <div className="scf-page-resource scf-layout-pattern">
          <div className="scf-home-block">
            <Container width={[1, 1, 1, 912, 0.76, 1200]} id="scf-box-resource-body" px={0}>
              <div id="scf-box-mobile-titlebar" className="scf-box__header-title">
                <h3>资源</h3>
              </div>
              <div className="scf-box-mobile-tabs">
                <ul className="scf-box-mobile-tabs-ul">
                  {resource.map(({ title, list }, index) => (
                    <li key={`title-${index}`}>{title}</li>
                  ))}
                </ul>
              </div>
              {resource.map(({ title, list }, index) => (
                <div className="scf-grid" key={index}>
                  <div className="scf-grid__item-12">
                    <div className="scf-grid__box">
                      <div className="scf-box__header">
                        <div className="scf-box__header-title">
                          <h3>{title}</h3>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="scf-grid__item-12">
                    <div className="scf-grid__box">
                      <ul className="scf-list scf-list--link">
                        {list.map(({ title, link }, indexList) => {
                          return (
                            <li className="scf-list__item" key={`${index}-${indexList}`}>
                              <a href={link} className="scf-list__text">
                                {title}
                              </a>
                            </li>
                          )
                        })}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </Container>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Resource
