---
title: Serverless DevOps 最佳实践 - 云+社区沙龙
description: 腾讯云高级架构师孔令飞在大会上分享了 Serverless DevOps 最佳实践
date: 2019-11-09
thumbnail: https://img.serverlesscloud.cn/2020326/1585185314095-9.jpg
categories:
  - meetup
authors:
  - Serverless 中文网
authorslink:
  - https://china.serverless.cn/
location: 
  - 腾讯云 & 云+社区 & Serverless 中文社区
---

## 活动信息

![活动信息](https://img.serverlesscloud.cn/2020325/1585121482272-IMG_0286.JPG)  

## 收获多多

1.  收获与腾讯、行业技术大咖**面对面交流**机会

2.  收获**机器学习算法**在运维领域的应用经验

3.  收获腾讯数字化转型中，**海量业务上云实践**经验

4.  收获研发**运维技术PaaS体系实践** 

5.  收获**云运维方向技术趋势**解读 


## 活动指南

**时间：**2019年11月09日（周六） 13:30-18:00 
**地点：**腾讯大厦2楼多功能厅（广东省深圳市南山区深南大道10000号）

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