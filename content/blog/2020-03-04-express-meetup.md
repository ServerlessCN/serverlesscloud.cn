---
title: 如何开发一个 Serverless Express 组件 - 直播课
description: Serverless 专家陈涛在线分享如何开发一个 Serverless 组件
keywords: Serverless 全局变量组件,Serverless 单独部署组件,Serverless Component
date: 2020-03-04
thumbnail: https://img.serverlesscloud.cn/2020327/1585306882197-9.jpg
categories:
  - meetup
authors:
  - Serverless 社区
authorslink:
  - https://serverlesscloud.cn
location: 
  - 线上直播 | 腾讯云大学 & 云+社区 & Serverless 社区
tags:
  - serverless
  - 活动  
---

Tencent Serverless 目前已经支持了不少语言的热门框架，包括 Express、 Koa、Egg 以及 Flask 等等大家熟悉的框架都可以通过  Component 轻松上云部署。但用户的业务场景和功能需求是多种多样的，如果现有的 Component 无法满足业务诉求，开发者则需要制作一个自己的 Component 来支持自身的业务。

那么，如何快速进行 Component 开发制作呢？**本周三（3月4日）晚19:00，**Serverless 在线课堂第五期，**Serverless Framework 专家陈涛将分享《如何开发一个Serverless Express 组件》**，详细讲解这个多云资源编排的 Serverless 场景化的解决方案是如何运行的，开发者应该怎样按照定制化开发 Component 以满足自身业务需求。

![活动信息](https://img.serverlesscloud.cn/2020325/1585125058534-IMG_0294.JPG)

### 在线学习福利

![免费预约](https://img.serverlesscloud.cn/2020325/1585125194298-IMG_0295.PNG)

**福利一：**将文章转发至朋友圈，并将朋友圈截图发送至 TencentServerless 公众号，我们将随机抽取10名幸运朋友送上计算器笔记本一个。  
  
**福利二：**课堂包含在线分享+互动答疑环节，直播分享过程中讲师将布置课堂作业，3月6日（本周五）24:00之前完成作业，还有腾讯企鹅公仔、腾讯云云函数产品无门槛代金券等礼品 100\% 放送！
- 前30名部署成功用户，可免费获得腾讯企鹅公仔一个；
- 30名之后部署成功用户，可免费获得价值50元的腾讯云云函数产品无门槛代金券一张。

**福利三：**结合在线课堂的分享，撰写部署的最佳实践文章、学习心得或者其他与Serverless 相关内容，并发布在您的知乎、博客或者朋友圈等平台，即可获得腾讯蓝牙音箱、腾讯云产品无门槛代金券等好礼。

**免费预约直播**

![](https://mmbiz.qpic.cn/mmbiz_png/YHl6UWa9s60lk9Qiaz779rjazgZALEYDLqdOae7JfVIMsB5RmDZapdDpdmHl5MnZtnXyztztSrLWl5KsDA287gg/640?wx_fmt=png)

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