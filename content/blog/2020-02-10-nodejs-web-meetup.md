---
title: Serverless 之 Nodejs 开发实战：三分钟搞定疫情信息展示页 - 直播课
description: Serverless 在线直播课程第二期，我们将分享 Serverless 的最佳应用场景以及如何利用Serverless 快速定制新型冠状病毒信息查询页，帮助你和身边人更及时了解疫情动态与信息。 
date: 2020-02-10
thumbnail: https://img.serverlesscloud.cn/2020325/1585130450976-6.jpeg
categories:
  - meetup
authors:
  - Serverless 中文网
authorslink:
  - https://china.serverless.cn/
location: 
  - 线上直播
---

Serverless 在线直播课程第二期，我们将分享 Serverless 的最佳应用场景以及如何利用 Serverless 快速定制新型冠状病毒信息查询页，帮助你和身边人更及时了解疫情动态与信息。  
直播课将于今天晚上（2月10日）19:00 开课，扫描**文中二维码或点击文末阅读原文**进行预约，预约成功后将发送开课提醒。  

![直播第二期](https://img.serverlesscloud.cn/2020325/1585122696033-IMG_0292.JPG)

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