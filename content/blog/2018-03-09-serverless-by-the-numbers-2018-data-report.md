---
title: "Serverless 数据解读：2018 报告"
description: "Serverless Framework 使用统计数据：事件源、服务结构、运行时长等等。"
keywords: Serverless 统计数据,Serverless 事件源,Serverless 服务结构
date: 2018-03-09
thumbnail: "https://main.qcloudimg.com/raw/3cb7b20955d78ced738e0279bb3f6f41.jpg"
categories:
  - news
  - engineering-culture
authors:
  - AndreaPasswater
authorslink:
  - https://serverless.com/author/andreapasswater/
translators: 
  - Aceyclee
translatorslink: 
  - https://www.zhihu.com/people/Aceyclee
tags:
  - 事件源
  - 服务结构
---

说起如何使用 Serverless Framework，大家都有很多想分享的。

“我将所有的 API 整合到了单个无服务 GraphQL 端点中。”
“我使用 Serverless Framework 来支持我的机器学习实例。”
“再请问下，服务器是什么？我完全不知道。我倒是知道云函数，Serverless Framework 和云函数差不多吗？”

（免责声明：最后一条是我自己编的。）

那么话说回来，Serverless Framework 的实际统计数据是怎样的呢？

我们一起来看下：

## 事件源

先来看今天最大的问题：开发者正在部署的所有服务中都包含了什么？

### API 占据主导地位

答案就是 http。

在我们深入讨论前，先了解一点有用的背景知识。仅包含一种事件类型的服务占所有服务的 79%。所有服务中的 16% 使用两种事件类型，4% 包含三种或更多事件类型。

为了使这些数据更易于理解，我们将从几个不同的方面来剖析。
首先，请看下面这张仅显示单事件源服务的数据图（记住，单事件源服务占所有服务的 79%）：

![](https://main.qcloudimg.com/raw/c04b4d37e2bf00b6fe482975c7afd5ff.jpg)

*含一种事件类型的所有服务（按事件类型）*

大多数包含**两种**事件类型的服务（所有服务的 16%）中都包含 http，例如 http + cron 和 http + sns。「其他」部分占据较大比例，主要原因在于其中有很多种排列方式，因此我们将其作为一种最受欢迎的类型：

![](https://main.qcloudimg.com/raw/0d38c16520edf25670502ba4101e17de.jpg)

*含两种事件类型的所有服务（按事件类型）*

包含三种及更多事件类型的服务如要划分所有排列不太现实，但此类服务在所有部署的服务中仅占 4% 多一点。

### 每个服务有多少个函数？

我们来看看开发者在每个服务中部署了多少个函数。请注意，本图仅包含在三个不同日期存在部署活动的服务，以便排除「Hello, World」应用。

![](https://main.qcloudimg.com/raw/756f70e4103dcb64ae866802b364be0a.jpg)

*服务（按函数个数）*

## 热门语言

Serverless 开发者倾向于使用哪些 runtime？

### 概况

Node.js 使用比例遥遥领先，其次是 Python。

![](https://main.qcloudimg.com/raw/80ac8567d4693cf99e10e687eb07bb1a.jpg)

*所部署服务的百分比（按语言）*

### 增长最迅速

我们来看看各个语言在不同时间段的使用率（不含占据绝对主导地位的 Node 6.10）。

![](https://main.qcloudimg.com/raw/50cb0171e66c2dc842eeaeaad77b0e8c.jpg)

*AWS 上使用的语言（排除 Node 6.10；以服务百分比表示）*

Python 3.6 是过去 8 个月内使用率整体增长最稳定的语言，今年的增长尤为突出。

但是，从相对较长的时间范围来看，Go 仅在上图中右下角呈现暂时性的趋势。这是因为 Lambda 从一月开始才支持 Go（绘制此图时，受支持时间约 2 个月）。

### Golang 采用率曲线

[Golang 支持](https://serverless.com/blog/ultimate-list-serverless-announcements-reinvent/#golang-support)是 re:Invent 2017 大会上备受关注的公告之一（[Serverless Aurora](https://serverless.com/blog/serverless-aurora-future-of-data/) 也是）。但直到 2018 年 1 月，Golang 支持才提供正式可用版本。

那么，Go 的使用率增长有多快呢？

下面这张编程语言（包含各个版本）图表直接比较了 2017 年 8 月和 2018 年 2 月各语言的使用率。

![](https://main.qcloudimg.com/raw/655b3cd4fa2f9b80686a5914dc252a1a.jpg)

*AWS 上使用的语言（以服务百分比表示）*

在短短的六周内，Go 的使用率已经达到 Java 的一半左右。同样值得注意的是，从 8 月到 2 月，Node.js 的使用率下降了三个百分点。

我们不妨再来看看试验曲线是怎样的。为此，我们以周为时间单位来看看自 1 月 15 日起采用 Go 语言编写的服务的部署次数。（注意，是部署次数而不是服务数量；换而言之，人们使用 Go 的频率有多高。）

![](https://main.qcloudimg.com/raw/0071513d8731edefa37f8737ecef742c.jpg)

*Golang 在 AWS 上的使用率（以占所有部署的百分比表示）*

如图所示，Golang 使用率稳定增长，已经增长了两倍。

明年的服务统计图**一定**非常有意思。

## 开发人员在什么时间段进行部署？

早上 7 点？实际并非如此。

事实证明，服务部署的高峰时段是在午餐时间到下班时间之间：

![](https://main.qcloudimg.com/raw/55ccea7ef73b1d1ae0a95bd84779ffc0.jpg)

## 总结

- Python 3.6 使用率上升速度很快，但 Go 增速也不错
- API 在无服务器用例中占主导地位
- 开发人员不喜欢在早上部署
