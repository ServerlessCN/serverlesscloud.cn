---
title: Serverless 工程化实战：基于 Python + JS 的动态博客开发 - 直播课
description: 腾讯云研发工程师刘宇分享 Serverless 工程化项目开发实战和经验总结
keywords: Serverless 全局变量组件,Serverless 单独部署组件,Serverless Component
date: 2020-02-19
thumbnail: https://img.serverlesscloud.cn/2020327/1585306882217-9.jpg
categories:
  - meetup
authors:
  - Serverless 社区
authorslink:
  - https://serverlesscloud.cn
location: 
  - 线上直播 | 腾讯云 & 云+社区 & Serverless 社区
tags:
  - Serverless
  - 活动  
---

Tencent Serverless 目前已经支持了不少语言的热门框架，包括 Express、 Koa、Egg 以及 Flask 等等大家熟悉的框架都可以轻松上云部署。不过在实际业务的使用中，尤其是迁移过程中，还是有不少需要注意的地方，比如 POST/GET 的参数传输方法难以原生获取等等。

这变化都是原有项目上云过程中，需要去关注和改动的点。那么，如何在使用Serverless Framework做项目的时候更加顺畅，尽量避免“踩坑”。

本周三（2月19日）晚19:00，Serverless 团队联合腾讯云大学与云+社区免费推出的Serverless在线课堂第四期，腾讯云 Serverless 研发工程师、《Serverless开发实战》书籍作者刘宇，将以一个动态博客系统的开发为例子，详细分享 Serverless 架构下基于 Python + HTML/JS 的工程化实战，以及Serverless 工程化项目开发的一些经验总结。

## 在线课程介绍

**课程主题：**Serverless 工程化实战：基于 Python + JS 的动态博客开发
**课程时间：**2月19日（周三）19:00
**课程讲师：**刘宇，腾讯云 Serverless 研发工程师
**讲师简介：**Serverless Framework 社区核心贡献者，参与开发贡献 tencent-scf/cos/website/cam/apigateway 等 Component，著有国内首本 Serverless 技术书籍《Serverless 架构：从原理、设计到项目实战》，腾讯云 Serverless 系列课程特约讲师。
**课程大纲**

1.  Serverless 架构带来的便捷与“坑儿”
2.  Serverless Framework 与 云函数SCF
3.  Serverless 开发经验的分享
4.  具备前后端能力的 Blog 开发实现
  - 博客功能实现：文章管理、分类管理、标签管理以及留言管理
  - 前端能力实现：使用10个函数作为数据库增删改查接口
  - 后端管理系统实现：Flask-admin
  - 工程化项目本地开发如何进行调试？

**在线学习福利**

**福利一：**将文章转发至朋友圈，并将朋友圈截图发送至 TencentServerless 公众号，我们将随机**抽取10名幸运朋友送上计算器笔记本一个**。

**福利二：**课堂包含在线分享+互动答疑环节，直播分享过程中讲师将布置课堂作业，2月7日（本周五）24:00之前完成作业，还有**腾讯企鹅公仔、腾讯云云函数产品无门槛代金券等礼品 100\% 放送**！

- 前30名部署成功用户，可免费获得腾讯企鹅公仔一个；

- 30名之后部署成功用户，可免费获得价值50元的腾讯云云函数产品无门槛代金券一张。

**福利三：**结合在线课堂的分享，撰写部署的最佳实践文章、学习心得或者其他与Serverless 相关内容，并发布在您的知乎、博客或者朋友圈等平台，**即可获得腾讯蓝牙音箱、腾讯云产品无门槛代金券等好礼。**  

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