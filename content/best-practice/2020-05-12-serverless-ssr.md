---
title: 诚心求问：做一个 Serverless SSR 需要几步？
description: Serverless Framework 支持 Next.js SSR 框架实践
keywords: Serverless 多环境配置,Serverless 管理环境,Serverless配置方案
date: 2020-05-12
thumbnail: https://img.serverlesscloud.cn/2020518/1589792300410-nextjs%E5%89%AF%E6%9C%AC.png
categories:
  - best-practice
authors:
  - Jens
authorslink:
  - https://zhuanlan.zhihu.com/ServerlessGo
tags:
  - Serverless
  - Serverless SSR
---

很久之前，看到过一个段子：“把大象塞进冰箱需要几步？” 回答是：“三步，第一步打开冰箱，第二步把大象塞进去，第三步关上冰箱”。这是一个无厘头式的幽默，用极简平淡的回答，来解释看似夸张的问题。

做一个 Serverless SSR 虽然不是把大象装进冰箱这样的问题，但是同样让很多开发者望而生畏 —— 因为网上关于 SSR 和 Serverless 的教程太多，动辄很大篇幅，很多步骤。让初学者无从下手，就算照着学一遍，也可能会遇到这样那样的问题，很费功夫。

但是现在，开发者可以有一种 “冰箱装大象” 的方式来完成一个 Serverless SSR：

1. 你需要有一个 SSR 框架 ：Next.js
2. 你需要有一个 Serverless 框架 ：Serverless Framework

**然后，只要将你的 SSR 框架一步装入 Serverless Framework！**

跟着我一起做吧，几分钟完成一个 Serverless SSR 的模式：

首先，你需要有一个 SSR 框架，下面我们创建并初始化一个 `Next.js` 项目。

我们在本地创建一个 `Next.js` 项目并初始化：

```
$ mkdir serverless-next && cd serverless-next
$ npm init next-app src
```

然后，你需要有一个 Serverless 框架，下面的代码将通过 npm 全局安装 `serverless cli`

```
$ npm install -g serverless
```

在项目根目录创建 `serverless.yml` 文件：

```
$ touch serverless.yml
```

在其中进行如下配置：

```
component: nextjs # (必填) 组件名称，此处为nextjs
name: nextjsDemo # (必填) 实例名称
org: orgDemo # (可选) 用于记录组织信息，默认值为您的腾讯云账户 appid
app: appDemo # (可选) 该 next.js 应用名称
stage: dev # (可选) 用于区分环境信息，默认值是 dev

inputs:
  src: ./src
  functionName: nextjsDemo
  region: ap-guangzhou
  runtime: Nodejs10.15
  exclude:
    - .env
  apigatewayConf:
    protocols:
      - http
      - https
    environment: release
```

> 更多配置说明：`https://github.com/serverless-components/tencent-nextjs/blob/v2/docs/configure.md`

最后，将你的 SSR 框架装入 Serverless 框架，并部署
```
$ npm run build
```
在 serverless.yml 文件下的目录中运行以下指令进行部署：
```
$ sls deploy
```
执行部署完成后，扫描二维码授权登录腾讯云

![](https://img.serverlesscloud.cn/2020512/1589285285739-url%20%E5%89%AF%E6%9C%AC.jpg)

部署成功后，命令行会输出 Next.js 的部署地址（见红框）。将其复制到浏览器中打开，我们会看到 Next.js 的欢迎页面。到这里，你就成功部署了 Serverless SSR！

![](https://img.serverlesscloud.cn/2020512/1589284707619-%E6%88%AA%E5%B1%8F2020-05-12%20%E4%B8%8B%E5%8D%8875731%E5%89%AF%E6%9C%AC.jpg)


## 查看和管理你的 SSR 项目

刚才的步骤，我们完成了 Next.js 框架的 Serverless 方式部署。那么，如何查看和管理刚才部署的 Next.js 项目呢？

腾讯云 Serverless 提供了一站式的 Dashboard，可以方便地对项目进行可视化的管理和后续操作。访问地址：`https://serverless.cloud.tencent.com`

![](https://img.serverlesscloud.cn/2020512/1589277083481-%E5%85%AC%E4%BC%97%E5%8F%B7SSR%E7%BB%93%E6%9E%9C%E5%9B%BE.jpg)

可以看到，我们刚才部署的 Next.js 项目，已经出现在 Dashboard 中了。点击该项目，即可查看到该项目的详细信息，并进行后续的操作。

![](https://img.serverlesscloud.cn/2020512/1589288836572-%E6%88%AA%E5%B1%8F2020-05-12%20%E5%89%AF%E6%9C%AC.jpg)

以上，就是使用 Serverless Framework 轻松部署 SSR 框架 Next.js 的全部过程。不仅是 Next.js，包括 Express、Koa、Egg、Nuxt 等 Node 框架，都可以用同样的方法轻松完成部署。



---
<div id='scf-deploy-iframe-or-md'></div>

---

> **传送门：**
> - GitHub: [github.com/serverless](https://github.com/serverless/serverless/blob/master/README_CN.md)
> - 官网：[serverless.com](https://serverless.com/)

欢迎访问：[Serverless 中文网](https://serverlesscloud.cn/)，您可以在 [最佳实践](https://serverlesscloud.cn/best-practice) 里体验更多关于 Serverless 应用的开发！
