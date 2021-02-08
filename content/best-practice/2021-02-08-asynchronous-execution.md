---
title: 解锁长时重计算：云函数首创异步执行模式
description: 可用于 2K4K 音视频处理、ETL 数据批处理、机器学习及 AI 推理等单任务重计算等场景
date: 2021-02-08
thumbnail: https://main.qcloudimg.com/raw/238c88435e45de91ad4475f6e085c2a6.jpg
categories:
  - best-practice
authors:
  - 李啸川
tags:
  - Serverless
  - 异步执行
---

云函数作为新一代通用计算平台的产品化载体，在云原生事件驱动框架下，对轻量的原子计算有较好的支持，但在 2k4K 音视频处理、ETL 数据批处理、机器学习及 AI 推理等单任务重计算的场景下，对云函数的运行机制及现有的上限阈值提出了更多挑战。

- 更长时间稳定运行
- 单实例更多算力
- 对运行中函数更强的状态管控
- 执行情况实时反馈

云函数 SCF 首创提供了一种全新的函数运行机制，函数异步执行模式。在解决以上痛点的同时，可以拓展适用于更多的应用场景。

## 同步执行模式

首先对比了解下云函数现有的同步执行模式，以通过 API 网关触发器同步调用云函数为例：

![](https://main.qcloudimg.com/raw/8f2fed12b32f4ba1389a79e873c5f177.png)

### 优点

- 全链路串行同步执行，模型简单直观易于理解
- 状态精简，逻辑分支、异常处理等成本低

同步执行模式，非常适合web应用、轻量API、IOT等时间短、计算量小的处理场景。

### 局限性

目前同步执行的超时时间上限为900s，整个调用链路涉及多个组件，所有组件都需要保持同步连接状态，并保障自身在连接状态下的稳定性，任意组件出现网络抖动或异常，都会影响调用的成功率。

另外，客户端需要阻塞等待请求的响应，持续占用客户端资源。在同步执行模式的架构下很难继续拓展为重计算提供更长时间稳定的执行。

## 异步执行模式

同样的API网关触发器同步调用，来看下异步执行模式

![](https://main.qcloudimg.com/raw/a3c6259f2fc06c2143a0e26dcf91f2ad.png)

### 函数异步执行模式特点

- 异步执行，发起事件调用立即返回事件的调用标识 RequestId，函数运行时并行启动执行
- 实时日志，执行日志实时上报，运行情况实时反馈
- 状态管理，提供事件状态的统计、查询及终止等事件管理相关服务

不难看出，运行机制的重新设计，从根本上解耦了对全链路所有组件的稳定性依赖，将稳定运行时间延长至24小时，并提供近乎无上限的扩展性。在此基础上，对长时运行过程中的日志由一次性上传升级为实时上报。

作为提供基础算力的资源层，以上可以满足支撑数据批处理、大规模分布式计算等任务调度系统的构建，考虑到 Serverless 化产品理念是提供开箱即用、简单高效的研发模型，云函数提供了对事件状态的持久化及相关的管理服务能力，进一步降低了开发者自建和运维任务管理系统的成本。


![](https://main.qcloudimg.com/raw/d6430bd530dca81cbed4bae9db193c2a.png)

## 如何在控制台设置异步执行模式

1. 登录 [云函数控制台](https://console.cloud.tencent.com/scf/list?rid=16&ns=default)，单击左侧导航栏的【函数服务】。
2. 在主界面上方选择期望创建函数的地域，并单击【新建】，进入函数创建流程。
3. 选择使用【空白函数】或选择使用【函数模板】来新建函数。
4. 在“函数配置”页面，展开【高级设置】，并勾选【异步执行】。

![](https://main.qcloudimg.com/raw/d4c1c700e23db78436ea1cb145a888eb.jpg)

5. 单击【完成】即可创建函数。

---

---
<div id='scf-deploy-iframe-or-md'></div>

---

> **传送门：**
> - GitHub: [github.com/serverless](https://github.com/serverless/serverless/blob/master/README_CN.md)
> - 官网：[serverless.com](https://serverless.com/)

欢迎访问：[Serverless 中文网](https://serverlesscloud.cn/)，您可以在 [最佳实践](https://serverlesscloud.cn/best-practice) 里体验更多关于 Serverless 应用的开发！