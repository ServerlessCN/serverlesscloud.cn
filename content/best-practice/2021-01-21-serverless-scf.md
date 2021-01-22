---
title: 更简洁、更快速！腾讯云 Serverless 云函数创建流程再次升级！
description: 邀请您体验简洁、快速、可配置的全新云函数控制台！
date: 2020-01-21
thumbnail: https://main.qcloudimg.com/raw/758c5797e5979f11b61de19dc9d1ead1.jpg
categories:
  - best-practice
authors:
  - Dora
tags:
  - Serverless
  - 控制台
---

近期，腾讯云 Serverless 发布了云函数控制台创建流程升级版，进一步缩短了快速创建函数的流程。

升级后的云函数控制台支持模版创建函数配置化引导，支持在云函数控制台创建应用。本文主要为您介绍云函数控制台升级版提供的全新能力。

## 背景介绍

目前云函数 SCF 控制台已提供了上百个函数模版，覆盖 API 网关触发、COS 触发、Ckafka 触发等多种触发场景，涉及日志服务 CLS、云数据库 CDW 等数十种云产品。

随着云函数覆盖场景和对接云产品的增加，如何在创建流程中完成模版函数配置与创建，如何提供创建应用的能力，本次云函数控制台体验升级在这些方面做了优化和提升。


## 简化函数创建流程，快速完成函数创建

1. 自动生成并填充函数名称，不论是模版创建还是自定义创建函数，都会自动生成并填充函数名称，在快速创建函数的场景下，真正实现无需额外输入，点击【完成】一步完成函数创建。

2. 仅展示函数创建的必填项，其他配置项折叠进高级配置中，避免增加不必要的理解成本。

![](https://main.qcloudimg.com/raw/fc7748d9183444021cb15a4f8d89ac1c.png)

## 模版创建函数支持配置化

按配置引导完成函数创建即可完成模版正常运行所依赖的全部函数配置。

1. 通过模版创建函数时，模版运行所依赖的配置项将提升到基础配置中优先展示，并自动填充模版正常运行的推荐值。
2. 模版运行角色配置引导，选择**配置并使用SCF模版运行角色**，将会自动创建函数运行角色 SCF_ExecuteRole 并关联模版运行所依赖的策略，或按照文字指引选择关联了对应策略的已有运行角色。
3. 环境变量配置引导，模版函数代码运行依赖的环境变量 key 已经预填充，按照 value 中的提示完成环境变量配置即可。

![](https://main.qcloudimg.com/raw/c55742c4f427f2a3bb092de73e603f7d.png)


## 函数创建流程支持触发器配置

1. 支持根据函数模版触发需要，自动创建定时触发器和 API 网关触发器。
2. 支持根据函数模版触发需要，自动选中所需触发器，并自动填充触发器创建默认值。

![](https://main.qcloudimg.com/raw/40402a839113950d48c319368aff8562.png)


## 和 Serverless Framework 打通，支持在云函数控制台创建应用

模版创建和 Serverless Framework 打通，在云函数控制台选择应用模版，单击【下一步】即可进入应用配置和创建流程。目前已经支持的应用有：`Express`，`Laravel`，`Nextjs SSR`，`Nuxtjs SSR`，`SpringBoot`，`Koa`，`Flask`和`Egg`，应用创建完成后可在 [Serverless Framework 控制台](https://console.cloud.tencent.com/sls)查看和管理。


![](https://main.qcloudimg.com/raw/0f456eb6da5c48f1cc5cb2c56742ff9e.png)

## 和 CODING 打通，支持通过 CI 部署函数和应用

模版创建和 CODING 打通，在云函数控制台选择模版后单击【通过 CI 部署】即可在 CODING 侧完成通过 CI 创建一个函数或应用。

![](https://main.qcloudimg.com/raw/aa1bdfff0da556b9fe41e80899b59dc5.png)

> 当前仅支持通过 CI 部署 Express 应用、Flask 应用和运行环境为 Node.js 12.16 的 Web 静态页面托管函数

---

---
<div id='scf-deploy-iframe-or-md'></div>

---

> **传送门：**
> - GitHub: [github.com/serverless](https://github.com/serverless/serverless/blob/master/README_CN.md)
> - 官网：[serverless.com](https://serverless.com/)

欢迎访问：[Serverless 中文网](https://serverlesscloud.cn/)，您可以在 [最佳实践](https://serverlesscloud.cn/best-practice) 里体验更多关于 Serverless 应用的开发！