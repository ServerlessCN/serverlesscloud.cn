---
title: Serverless Python 开发实战：极速制作情人节表白页 - 直播课
description: Serverless 专家陈涛讲解 Serverless 架构的处理规范、工作流程以及 Serverless 工程化的挑战与最佳实践
keywords: Serverless 全局变量组件,Serverless 单独部署组件,Serverless Component
date: 2020-02-13
thumbnail: https://img.serverlesscloud.cn/2020327/1585306882267-9.jpg
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

最近受到疫情的困扰，相隔几百米的恋人都成了异地恋，就连情人节也需要云相聚。程序员如何用一种即浪漫又Geek的方式来进行表白？本周四（2月13日）晚 19:00，Serverless 团队联合腾讯云大学与云+社区免费推出的Serverless在线课堂第三期，将分享《Serverless Python 开发实战之极速制作情人节表白页》，讲师将在线指导三分钟完成表白页制作部署。小伙伴们周四完成制作，周五情人节当天就可以派上用场啦！

## 在线课程介绍

**课程主题：**Serverless Python 开发实战之极速制作情人节表白页 

**课程时间：**2月13日（周四）19:00

**课程讲师：**陈涛，Serverless Framework 社区专家

**讲师简介：**参与 Serverless 社区及开源的相关研发工作。拥有丰富前端、JavaScript 技术经验，以及网站及小程序等项目开发经验，腾讯云 Serverless 系列课程特约讲师。

![Serverless Framework](https://video-1253970226.cos.ap-chengdu.myqcloud.com/c3b4a2e3-6877-4a38-aca1-bb9650f12386_%E5%89%AF%E6%9C%AC.jpg)  

**课程简介**

Python 是一种热门的编程语言，Serverless 是近年来迅速兴起的一个技术概念，基于Serverless架构能构建出多种应用场景，适用于各行各业。本次课程将为大家详细讲解 Serverless 架构的处理规范与处理模型、典型的工作流程，以及 Serverless 工程化的难点与挑战。最后将结合 Python Flask + Serverless 的情人节表白页制作实例，展示如何用 Serverless 的方式进行 Python 编程，将热门 Python 框架利用 Serverless 快速上云。

**课程大纲**  

1.  Serverless 的架构规范、处理模型、工作流程
2.  Serverless 工程化的难点与挑战
3.  Serverless 的事件与规范
4.  使用 Python Flask + Serverless 三分钟开发情人节表白页

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