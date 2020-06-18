---
title: Serverless Dashboard 设计解读与实战
description: 基于用户需求推出了可视化的运维界，应用部署后可直观地进行应用监控、告警、日志排障等操作
keywords: Serverless 多环境配置,Serverless 管理环境,Serverless配置方案
date: 2020-05-13
thumbnail: https://img.serverlesscloud.cn/2020518/1589791033503-db%E5%89%AF%E6%9C%AC.jpg
categories:
  - best-practice
authors:
  - Tina
authorslink:
  - https://zhuanlan.zhihu.com/ServerlessGo
tags:
  - Serverless
  - Dashboard
---

作为腾讯云 Serverless 的产品经理，我经常会收集到小伙伴们在使用 Serverless Framework 的一些问题和吐槽，比如近期小伙伴们反馈：

1. 依赖库安装和本地调试成功，但在云端部署为何失败？
2. Serverless 应用内部的监控，无法直接查看，每次定位问题的流程好长啊！
3. 怎样组织 Serverless 应用？
4. 不同的函数之间的调用关系、环境划分、资源的管理及权限控制是怎样的呢？

近期 Serverless 团队发布了一款里程碑新特性产品，产品通过支持应用级别监控和 Dashboard 资源管理，有效解决小伙伴们的痛点问题，一起来看看吧！

## Serverless Dashboard 新特性

### 1. 应用管理

本次发布的应用管理页面则以 Component 为粒度，聚合了所有 Serverless Framework 部署的资源，并且展示了实例状态、访问链接以及上次的部署信息。此外，在管理详情中还支持删除 Serverless 应用、下载项目代码进行二次开发等操作，开发者可以更方便、集中的管理账号下的 Serverless 应用。如下图所示：

![](https://img.serverlesscloud.cn/2020513/1589373435394-005.jpg)

### 2. 部署详情及输出

Serverless Framework 的特性之一就是可以便捷的联动关联的云上资源，因此不同的 Serverless Component，可能会联动不同的云上资源，如网关、云函数、COS等。相信许多小伙伴在进行二次开发时，都想要了解每个 Component 具体创建了的资源信息。
在本次发布的部署详情页中，不仅可以查看到 Serverless 实例的基本信息，还可以在输出（output）页面中查看到 Serverless Component 对应的输入、输出信息。通过该页面，可以查看到对应的资源配置，如：地域信息、资源id、使用的语言环境、支持的协议信息等。有了这个页面，可以直观的看到对应的资源配置，再也不担心不同应用之间搞混配置啦。

![](https://img.serverlesscloud.cn/2020513/1589373436586-005.jpg)

### 3. 应用级别监控

当前 Serverless Framework 已经支持了多种 Web 框架的一键部署。在部署完毕后，相信许多开发者会希望查看到基于应用级别的监控数据。而这往往在基础资源的监控中是难以体现出来的。

那么本次发布最为亮眼的能力，即支持了应用级别的监控页面，实现了”0“配置的监控指标展示。当前已经支持 Express.js Component 的应用级别监控。无需去多个产品的控制台查看监控，无需自助上报数据，无需借助第三方 APM 插件，只需一次部署，立刻查看 Express 应用的监控信息！

**当前的 Express.js 组件监控主要支持下列指标：**

- 函数触发次数/错误次数：function invocations & errors
- 函数延迟：function latency
- API 请求次数/错误次数：api requests & errors
- API 请求延迟：api latency
- API 5xx 错误次数：api 5xx errors
- API 4xx 错误次数：api 4xx errors
- API 错误次数统计：api errors
- 不同路径下 API 的请求方法、请求次数和平均延迟统计：api path requests

![](https://img.serverlesscloud.cn/2020513/1589373436732-005.jpg)


**由于 Serverless Dashboard 是基于新版的 Serverless Component 开发，因此同样支持新版 Serverless Component 的特性：**

1. 【门槛低】交互式的一键部署指引：对于新用户而言，只需要在终端输入 serverless 命令，即可按照引导快速部署一个 Express 或 静态网站应用。
2. 【部署快】将一个 Express.js 应用部署到云端只需要 5-6s 的时间，使本地和云端代码可以顺畅、快速同步。
3. 【可复用】支持云端注册中心，每位开发者都可以贡献自己的组件到注册中心中，便于团队进行复用。
4. 【实时日志查看】支持部署阶段实时输出请求日志、错误等信息，此外支持检测本地代码变化并自动部署云端，方便的进行云端代码开发。
5. 【云端调试】针对 Node.js 应用，支持一键开启云端 debug 能力，对云端代码打断点调试，真正实现了在云端进行开发和调试的能力，无需考虑本地环境和远端环境的不一致问题。
6. 【状态共享】通过云端部署引擎存储应用部署状态，便于账号和团队之间共享资源，协作开发。

针对 Express.js 框架的应用级别监控主要基于腾讯云自定义监控能力实现。在部署过程中，框架中使用 Serverless SDK，收集应用级别的监控信息进行自定义上报和展示。因此用户可以做到 “0”配置 查看应用级别监控指标。真正实现快速部署一个开箱即用的 Serverless 应用框架。

下面让我带大家一起实战体验一下我们的新产品吧！

## 玩转 Dashboard 使用实战

本次实战，我们将通过一个 Express.js 框架的部署，来体验 最新发布的 Dashboard 应用管理、监控视图等能力。

首先，点击 [Express 链接](https://serverless.cloud.tencent.com/deploy/express/)，扫码，登录腾讯云账号授权，一键部署你的 Express 应用。

完成后，可以看到如下图所示：

![](https://img.serverlesscloud.cn/2020513/1589373436498-005.jpg)

你的 Express 应用已经部署好了！

等待几分钟，就可以在 Dashboard 上看到对应的监控数据啦！

如下图所示：

![](https://img.serverlesscloud.cn/2020513/1589373435345-005.jpg)

当前支持 15 分钟，60 分钟，24 小时和 7 天的监控数据。

**如果您希望进行二次开发，则在本地安装 Serverless Framework，并点击右上角的`【下载项目代码】`，对代码进行修改和部署。**

> 参考：[更多文档资料](https://cloud.tencent.com/product/sls)




---
<div id='scf-deploy-iframe-or-md'></div>

---

> **传送门：**
> - GitHub: [github.com/serverless](https://github.com/serverless/serverless/blob/master/README_CN.md)
> - 官网：[serverless.com](https://serverless.com/)

欢迎访问：[Serverless 中文网](https://serverlesscloud.cn/)，您可以在 [最佳实践](https://serverlesscloud.cn/best-practice) 里体验更多关于 Serverless 应用的开发！




