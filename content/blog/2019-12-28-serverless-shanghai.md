---
title: Serverless 技术行沙龙
description: 来自深圳清华大学研究院 、Serverless 社区专家们围绕 Serverless + 5G，Serverless SSR 技术探索等话题展开深入分享
keywords: Serverless 全局变量组件,Serverless 单独部署组件,Serverless Component
date: 2019-12-28
thumbnail: https://img.serverlesscloud.cn/2020326/1585185314084-9.jpg
categories:
  - meetup
authors:
  - Serverless 社区
authorslink:
  - https://serverlesscloud.cn
location: 
  - 上海 | 中国计算机学会 & 深圳清华大学研究院 & 腾讯云 & 云+社区
tags:
  - serverless
  - 活动  
---

![活动信息](https://img.serverlesscloud.cn/2020325/1585121773487-IMG_0291.JPG)  


Serverless 架构在 IT 行业蓄势待发，并非没有道理。Serverless 架构具有缩短交付时间，简化操作和运维成本等能力，以及创造出一种革命性的付费模式——按资源消耗付费，这些能极大节约企业资源以及人力成本。  

12 月 28 日，由中国计算机学会、深圳清华大学研究院、腾讯云联合举办，清华校友总会互联网与新媒体专业委员会、深圳清华校友互联网与人工智能协会、通联支付共同协办的**Serverless 技术行 · 上海站沙龙**，将围绕 **Serverless + 5G，Serverless Framework 框架与应用实践， Serverless SSR 技术探索，以及提升前端研发效能等热门话题**，展开深入分享，拨开 Serverless 技术迷雾，帮助企业级开发者快速落地 Serverless 应用。

## 活动指南

**活动时间：**12 月 28 日 13:30-18:00  
**活动地点：**上海市浦东新区金沪路 55 号通华科技大厦 6 楼多功能厅

## 活动议程


### Serverless 在5G等新技术领域的应用探索

Serverless 作为一种新型互联网架构直接或间接推动了云计算的发展，近些年 Serverless 一路高歌，在不同行业逐步落地应用。同时，Serverless 作为一种轻量级计算开始登陆 5G、边缘计算等技术的舞台。本次将分享 Serverless 在新技术领域的探索与应用。

1. Serverless的优势
2. 5G、边缘计算的痛点
3. FDN技术介绍（serverless + 边缘计算）
4. serverless在边缘计算中的应用情况
5. 面向分布式云编程

### Serverless Framework：构建和运维Serverless应用的框架

本次沙龙将重点分享：

1. Serverless 应用架构
2. Serverless Framework 概念与原理
3. 使用 Serverless Framework 构建应用
4. Serverless Framework 高级功能

### PHP Serverless 组件的开发和落地实践

PHP做为世界上流行的编程语言之一，怎能缺席 Serverless，本次分享将介绍如何构建 PHP 的Serverless Framework Component，以及 Serverless 在 PHP 中的应用。

1. 简要介绍 PHP 的现状和发展  
2. Serverless 组件请求执行的整个过程  
3. PHP slim 框架与 Serverless 的集成  
4. Nodejs 各个框架与 serverless 的集成5. Serverless 开发的注意事项

### Serverless Render：提升前端研发效能

SSR 是 Web 应用常见的优化手段，使用了 SSR 意味着开发者必须要维护一个 Node 服务。在 Serverless 时代，这将成为历史。本次分享将介绍 NOW 直播团队是如何将 Serverless 平滑落地到现有业务中的，如何与团队工作流打通来提升研发效能，以及传统 SSR 存在的痛点和如何优化。

1. 同构 SSR 的前世今生
2. Serverless 落地到 SSR 中 -- Serverless Render
3. Serverless + CI Flow
4. 追求极致: Serverless Render 性能优化
5. 未来: 组件即服务

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