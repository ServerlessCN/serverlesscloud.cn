---
title: 前端为什么要关注 Serverless?
description: 前端为什么要接 serverless? 交给后端不行吗?
keywords: serverless发展,Serverless 基本概念,Serverless生产力
date: 2020-03-14
thumbnail: https://img.serverlesscloud.cn/2020115/1579078112543-1577769064015-joshua-aragon-FGXqbqbGt5o-unsplash.jpg
categories:
  - engineering-culture
  - user-stories
authors:
  - Aceyclee
authorslink:
  - https://www.zhihu.com/people/Aceyclee
tags:
  - Serverless
  - 全栈应用
---

Serverless 的概念或应用场景我们以前讲过很多，这里不再冗述。概括性地讲 —— **Serverless 的内涵就是对全部底层资源和运维工作的封装，让开发者更专注于业务逻辑。**

完备的基础性文章推荐阅读这两篇：

- [Serverless 基本概念入门](https://serverlesscloud.cn/blog/2019-08-01-serverless-basic-concept)
- [Serverless 的运行原理与组件架构](https://serverlesscloud.cn/blog/2019-08-21-serverless-operation-architecture)

本文尝试从出圈的角度，以更接地气的方式聊聊 Serverless。

先讲个故事，疫情期间在家办公，大家肯定没少做饭，自己做饭才体会到家务不易，你需要：买菜买锅、处理食材、煎炒蒸煮、最后洗碗。

> 听起来是不是还挺像软件开发？你需要有云服务器、后台开发、前端开发、还有运维。

你想着，要是我能只翻两下铲子，然后就能吃饭那该多好。

巧了，有一些商家就提供了这种服务，帮你准备好了锅、洗干净的食材、专业的厨师指点，你只要进去翻两下铲子，就能煮一顿精美的饭食！而且不用洗碗。

> 对应到软件开发，开发者只需要关注业务逻辑（炒菜），而底层资源和运维工作（锅碗瓢盆、食材处理）都不用再操心。

终于到了正式复工的时间，你不用再自己做饭，新买的厨具就闲置了。你回想起昨天在商圈里的美好体验，家里的厨具要是也在能用的时候付费，不用不收费多好啊。

> 嘿嘿，Serverless 亦如此，按水电般计费，当部署在其上的函数运行时才收费。

所以回到题目中来，Serverless 本身是云计算相关技术，并非前端技术，为何前端要关注 Serverless 呢？

**答案很简单 —— 解放生产力。**

你的厨房里已经准备好了所有厨具和处理好的食材，你现在只需要关心火候认真炒菜，成为美食博主指日可待。也就是文首所说的 —— 开发者能更专注于业务逻辑，其他的底层资源和运维工作已经全部封装好了。

------

## ▎Talk is cheap, show you the code.

先给大家展示一个基于 Serverless 构建 docsify 文档的 [demo](https://serverlesscloud.cn/best-practice/2019-12-14-docsify-with-serverless)

这个三分钟的 demo，不仅完成了 docsify 发布代码的上传，还包括了腾讯云对象存储 COS 资源的申请和配置。而这仅仅是我第一次使用 Serverless 来构建应用，可见它上手性之高。

<video id="video" controls="" preload="none" poster="https://img.serverlesscloud.cn/20191217/1576566243002-docsifyvideopic.png">
<source id="mp4" src="https://img.serverlesscloud.cn/video/docsify%2B%E7%89%87%E5%B0%BE4.mp4">
</video>

> 原文链接：[《三分钟入坑指北   Docsify + Serverless Framework 快速创建个人博客》](https://serverlesscloud.cn/best-practice/2019-12-14-docsify-with-serverless)

**再进一步，我们演示个 Fullstack Application。**该项目借助社区现有的 [@serverless/tencent-express](https://github.com/serverless-components/tencent-express) 和 [@serverless/tencent-website](https://github.com/serverless-components/tencent-website) 组件来完成。

下面是一张简单的组件依赖图：

![Component Dependency Structure](https://static.yugasun.com/serverless/component-framework.png)

> 在开始所有步骤前，需执行 `npm install -g serverless` 命令，全局安装 `serverless cli`。

**1. 准备**

新建项目目录 `fullstack-application-vue`，在该项目目录下新增 `api` 和 `dashboard` 目录。然后新增 `serverless.yml` 和 `.env` 配置文件，项目目录结构如下：

```
├── README.md 		// 项目说明文档
├── api					  // Restful api 后端服务
├── dashboard			// 前端页面
├── .env					// 腾讯云相关鉴权参数：TENCENT_APP_ID，TENCENT_SECRET_ID，TENCENT_SECRET_KEY
└── serverless.yml	// serverless 文件
```

**2. 后端服务开发**

进入目录 `api`，新增 `app.js` 文件，编写 `express` 服务代码，这里先新增一个路由 `/`，并返回当前服务器时间：

```js
const express = require('express')
const cors = require('cors')
const app = express()

app.use(cors())
app.get('/', (req, res) => {
  res.send(JSON.stringfy({ message: `Server time: ${new Date().toString()}` }))
})
module.exports = app
```

**3. 前端页面开发**

本案例使用的是 `Vue.js` + `Parcel` 的前端模板，当然你可以使用任何前端项目脚手架，比如 Vue.js 官方推荐的 [Vue CLI](https://github.com/vuejs/vue-cli) 生成的项目。进入 `dashboard` 目录，编写入口文件 `src/index.js`:

```js
// 这里初始是没有 env.js 模块的，第一次部署后会自动生成
require('../env')

const Vue = require('vue')

module.exports = new Vue({
  el: '#root',
  data: {
    message: 'Click me!',
    isVisible: true,
  },
  methods: {
    async queryServer() {
      const response = await fetch(window.env.apiUrl)
      const result = await response.json()
      this.message = result.message
    },
  },
})
```

**3. 配置**

前后端代码都准备好了，再简单配置下 `serverless.yml` 文件了：

```yaml
name: fullstack-application-vue

frontend:
  component: '@serverless/tencent-website'
  # inputs 为 @serverless/tencent-website 组件的输入
  # 具体配置说明参考：https://github.com/serverless-components/tencent-website/blob/master/docs/configure.md
  inputs:
    code:
      src: dist
      root: frontend
      hook: npm run build
    env:
      # 下面的 API服务部署后，获取对应的 api 请求路径
      apiUrl: ${api.url}

api:
  component: '@serverless/tencent-express'
  # inputs 为 @serverless/tencent-express 组件的输入
  # 具体配置说明参考：https://github.com/serverless-components/tencent-express/blob/master/docs/configure.md
  inputs:
    code: ./api
    functionName: fullstack-vue-api
    apigatewayConf:
      protocol: https
```

**4. 部署**

部署时，只需要运行 `serverless` 命令就行，当然如果你需要查看部署中的 `DEBUG` 信息，还需要加上 `--debug` 参数，如下：

```
$ serverless
# or
$ serverless --debug
```

最后终端会 `balabalabala~`, 看到绿色的`done`就行了。

> 体验：[在线 Demo](https://br1ovx-efmogqe-1251556596.cos-website.ap-guangzhou.myqcloud.com/)

既然是全栈，怎么少得了数据库的读写呢？

读者可移步作者原文继续阅读：[《基于 Serverless Component 的全栈解决方案》](https://serverlesscloud.cn/best-practice/2019-12-5-Full-stack-solution-based-on-serverless-component)

从这两个小项目中已然得解 ——  Serverless 的内涵就是对全部底层资源和运维工作的封装，让开发者更专注于业务逻辑。


## ▎写在后面

题主在问题描述中的思考很有价值，其实 Serverless 的确不是一个前端的概念，甚至都不是为了解决前端的问题而出现的，**它其实就是云计算发展的必经过程。**

就好比，底层语言的发展趋势肯定是高级语言。而高级语言肯定也会封装起底层的硬件，让程序员无需关心硬件的状态，专注编码。

十年前编程还是比较难的高级学科，如今小学已经开展编程课程。其实就是因为程序语言的发展，让编程变得更加友好。

同样地，Serverless 的出现和完善，也是让软件开发变得更加友好。不仅前端需要关注 Serverless，它可能属于每一种类型的应用开发者。

而这会淘汰后端吗？并不会！

后端会更聚焦于业务逻辑、数据处理、算法策略等更专精的事情。

汽车的出现让马车夫成为了司机，技术在变革，工程师也将成长。



---
<div id='scf-deploy-iframe-or-md'></div>

---

> **传送门：**
> - GitHub: [github.com/serverless](https://github.com/serverless/serverless/blob/master/README_CN.md)
> - 官网：[serverless.com](https://serverless.com/)

欢迎访问：[Serverless 中文网](https://serverlesscloud.cn/)，您可以在 [最佳实践](https://serverlesscloud.cn/best-practice) 里体验更多关于 Serverless 应用的开发！
