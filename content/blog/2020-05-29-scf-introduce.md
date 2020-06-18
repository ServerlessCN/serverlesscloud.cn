---
title: 腾讯云云函数快速入门实践
description: 使用云函数，拥有完整的开发、调试、DevOps、监控体验。
keywords: Serverless,scf,Node.js
date: 2020-05-29
thumbnail: https://img.serverlesscloud.cn/2020529/1590722170311-1590666059246-%E4%BA%91%E5%87%BD%E6%95%B0%E5%BF%AB%E9%80%9F%E5%85%A5%E9%97%A8%E5%89%AF%E6%9C%AC%20%281%29.jpg
categories:
  - user-stories
authors:
  - tianyun
authorslink:
  - https://zhuanlan.zhihu.com/ServerlessGo
tags:
  - 云函数
---

云函数 (Serverless Cloud Function，SCF) 是腾讯云为企业和开发者们提供的无服务器执行环境。无服务器并非真的没有服务器，而是说用户无需购买服务器，无需关心服务器 CPU、内存、网络配置、资源维护、代码部署、弹性伸缩、负载均衡、安全升级、资源运行情况监控等，也就是说不用专门安排人力做这些，只需专注于代码编写并上传即可。很大程度上降低了研发门槛，提升业务构建效率。

由于 Serverless 拥有近乎无限的扩容能力，核心的代码片段完全由事件或者请求触发，平台根据请求自动平行调整服务资源，用户只需为运行中的云函数付费，若云函数未运行，则不产生任何费用。

## 使用云函数是一种怎样的体验呢？一起来实践！

> 使用腾讯云函数之前，我们先做一下准备工作：进入[腾讯云注册页面](https://cloud.tencent.com/register)，注册账号，开通云函数服务。

腾讯云云函数提供了满足多种开发场景的工具和能力，目前支持通过控制台、SCF CLI、SCF VS Code 插件完成函数创建，创建函数的详细步骤可参考: https://cloud.tencent.com/document/product/583/19806

### Hello World

**以云函数控制台为例，带领大家一起创建你的第一个模版函数。**

登录[云函数控制台](https://console.cloud.tencent.com/scf)，点击左侧导航栏「函数服务」，在函数服务页面上方选择地域，单击「新建」，如下图所示：

![](https://img.serverlesscloud.cn/2020528/1590665332779-1590661079092-bbe8a37c359b6ad2.png)

在「新建函数」页面填写函数名称，选择「运行环境」，控制台目前已支持的语言包括：`Python 2.7 & 3.6、Node.js 6.10 & Node.js 8.9、Node.js 10.5、Java 8、Php 5 & Php 7`。例如，我们选择运行环境：Python 3.6 ，选择模版函数快速创建，之后点击「下一步」：

![](https://img.serverlesscloud.cn/2020528/1590665332672-1590661079092-bbe8a37c359b6ad2.png)

配置保持默认，单击「完成」，可看到如下图所示：

![](https://img.serverlesscloud.cn/2020528/1590665334182-1590661079092-bbe8a37c359b6ad2.png)

> 说明：`index.main_handler` 参数值表示 SCF 控制台会将此段代码自动保存为 `index.py` 文件，并将该文件压缩和上传至 SCF 平台，用于创建云函数。

> 示例代码中的 `main_handler` 为入口函数，主要参数为：
> - event 参数：可以获取触发源的消息。
> - context 参数：可以获取本函数的环境及配置信息。

### 如何使用控制台部署函数

您只需要在线编辑函数代码，点击「保存」即完成部署。

### 如何配置触发器

在已创建函数的详情页面，选择左侧「触发管理」，单击「创建触发器」

在弹出的「创建触发器」窗口中，将触发方式设置为「API 网关触发器」，其它参数保持默认配置，点击「提交』。如下图所示：

![](https://img.serverlesscloud.cn/2020528/1590665332876-1590661079092-bbe8a37c359b6ad2.png)

### 体验云端测试

1. 函数部署测试：

选择「函数代码」，单击「测试」，运行代码并返回测试结果。如下图所示：

![](https://img.serverlesscloud.cn/2020528/1590665333704-1590661079092-bbe8a37c359b6ad2.png)

2. 触发器配置测试：

触发器创建成功后，会在该函数的触发方式页面生成访问路径。如下图所示：

![](https://img.serverlesscloud.cn/2020528/1590665332633-1590661079092-bbe8a37c359b6ad2.png)

在浏览器里「打开该访问路径」，若有如下显示则说明函数部署成功。

![](https://img.serverlesscloud.cn/2020528/1590665521164-%E4%BC%81%E4%B8%9A%E5%BE%AE%E4%BF%A1%E6%88%AA%E5%9B%BE_7fc92385-c3c0-41dd-b6e4-789fa45c57de.png)


### 查看监控

![](https://img.serverlesscloud.cn/2020528/1590665332475-1590661079092-bbe8a37c359b6ad2.png)

### 查看日志

![](https://img.serverlesscloud.cn/2020528/1590665334057-1590661079092-bbe8a37c359b6ad2.png)

如果您想详细了解「如何借助云函数监控日志快速发现并定位问题」，可报名参加 **6 月 4 日（周四）20:00** 举办的 **[Tencent Serverless Hours 第三期线上分享会](https://cloud.tencent.com/edu/learning/live-2564)。**


### 如何把已有的业务迁移至云函数？

可以通过我们的 Serverless Framework 进行迁移，详情请参考：https://cloud.tencent.com/document/product/1154/40216

**欢迎体验试用云函数**，详情请参考：https://cloud.tencent.com/document/product/583/12282



---
<div id='scf-deploy-iframe-or-md'></div>

---

> **传送门：**
> - GitHub: [github.com/serverless](https://github.com/serverless/serverless/blob/master/README_CN.md)
> - 官网：[serverless.com](https://serverless.com/)

欢迎访问：[Serverless 中文网](https://serverlesscloud.cn/)，您可以在 [最佳实践](https://serverlesscloud.cn/best-practice) 里体验更多关于 Serverless 应用的开发！
