---
title: 面对突发需求，如何借助 Serverless 快速上云 - 直播课
description: 腾讯云 Serverless 技术专家王俊杰分享突发需求下，如何使用 Serverless Framework 实现快速上云！
keywords: Serverless 全局变量组件,Serverless 单独部署组件,Serverless Component
date: 2020-02-27
thumbnail: https://img.serverlesscloud.cn/2020327/1585306882572-9.jpg
categories:
  - meetup
authors:
  - Serverless 社区
authorslink:
  - https://serverlesscloud.cn
location: 
  - 线上直播 | 腾讯云 & 云+社区 & Serverless 社区
tags:
  - serverless
  - 活动  
---

当突发事件来临时，当绝佳 idea 闪现时，如何快速搞定开发和部署，使之变身为产品？快，则应万变！Serverless 具有拥有免运维、开发成本降低、按需自动扩缩容等诸多优点，并且已经支持 Express、Koa、Flask、Lavaral 等传统语言框架，这些使得开发者能够更快的构建和上线应用，为新业务和原有服务快速上云，提供了便捷的支持。明晚（2月27日） 20:00 - 21:00，腾讯云 Serverless 技术专家王俊杰，将为大家分享突发需求下，如何使用 Serverless Framework 实现快速上云！

## 议题信息

![](https://img.serverlesscloud.cn/2020325/1585123876840-IMG_0293.JPG)

**在线学习福利**

**福利一：****互动有礼。**参与课程直播在线互动，更有机会获得腾讯鼠年公仔、异步社区会员卡等礼品！
**福利二：部署大奖。**学习期间可跟随老师一起完成 Live Demo，2月28日（本周五）24:00之前成功完成 Demo 部署的小伙伴，还有**计算器笔记本、价值50元的腾讯云云函数产品无门槛代金券等奖品 100\% 放送**！


## Serverless Framework 免费试用计划

Serverless Framework 免费试用名额已开放，我们诚邀您来试用和体验最便捷的 Serverless 开发和部署方式。包括服务中使用到云函数 SCF、API 网关、对象存储 COS 等产品，均在试用期内提供免费资源，并伴有专业的技术支持，帮助您的业务快速、便捷实现 Serverless ！

Serverless Framework 落地 Serverless 架构的全云端开发闭环体验，覆盖编码、运维、调试、部署等开发全生命周期。使用 Serverless Framework 即可在几秒钟内将业务部署至云端。

![具体免费详情可查阅：https://cloud.tencent.com/document/product/1154/38792](https://img.serverlesscloud.cn/2020312/1584006765599-IMG_0123.PNG)


## 立即使用 Serverless，只需三步

Serverless Framework 是构建和运维 Serverless 应用的框架，简单三步，即可通过 Serverless Framework 快速实现服务部署。

**1、创建本地应用**

- 通过 npm 安装 Serverless

```
$ npm install -g serverless
```

- 基于 tencent_nodejs 模板创建 hello_world

```
$ serverless create --template tencent-nodejs --path my-service
```

**2、安装相关依赖**

- 执行 npm install 安装相关依赖

```
$ cd my-service$ npm install
```

**3. 部署**

- 扫描微信二维码一键登录腾讯云账号，部署函数到云端

```
$ serverless deploy
```

- 触发云函数

```
$ serverless invoke -f hello_world
```

部署完成后，即可在命令行中看到部署情况，也可以在腾讯云控制台看到对应资源。

![](https://img.serverlesscloud.cn/2020312/1584006765436-IMG_0123.PNG)