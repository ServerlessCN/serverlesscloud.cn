---
title: 云函数开发者工具实操 - 直播课
description: 本次直播，腾讯云高级产品经理张远哲将分享 Serverless 的开发者工具建设
keywords: Serverless 全局变量组件,Serverless 单独部署组件,Serverless Component
date: 2019-08-28
thumbnail: https://img.serverlesscloud.cn/2020413/1586784466875-1585645264854-08f2789b7010bbfb.jpg
categories:
  - meetup
authors:
  - serverless 社区
authorslink:
  - https://serverlesscloud.cn
location: 
  - 线上直播 | 腾讯云大学 & Serverless 社区
tags:
  - 课程
  - serverless
---

## 他是谁？

讲师：腾讯云高级产品经理张远哲。一直从事云计算相关产品工作。参与过小程序平台的研发，KMS产品的研发，以及Kafka集群DevOps的搭建。现担任云函数高级产品经理，负责云函数产品的策划工作，致力于无服务器架构的使用和推广。  

## 他会讲什么？

1.  什么是 Serverless？
2.  云函数架构简介
3.  云函数产品能力介绍
4.  Serverless 开发者工具
5.  动手实操：云函数最佳应用实践

## 你将收获

1.  了解 Serverless 概念及架构
2.  掌握 Serverless 开发工具的原理及使用
3.  基于云函数的 Demo 部署及应用

## 直播时间

2019 年 8 月 28 日（周三）19:00-20:30

## 报名通道

扫描下方二维码，点击**「预约直播」**报名直播课程。

![](https://img.serverlesscloud.cn//tmp/tmp.jpeg)

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