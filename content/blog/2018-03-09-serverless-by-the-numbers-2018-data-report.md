---
title: "无服务器数据解读：2018 报告"
description: "无服务器框架使用统计数据：事件源、服务结构、运行时等等。"
date: 2018-03-09
thumbnail: "https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/observability-tools/graph-thumb.png"
category:
  - news
  - engineering-culture
authors:
  - AndreaPasswater
---

说起如何使用无服务器框架，有很多趣闻轶事。

“我将所有的 API 整合到了单个无服务 GraphQL 端点中。”“我使用无服务器框架来支持我的机器学习实例。”“再请问下，服务器是什么？我完全不知道。我倒是知道 Lambda，无服务器和 Lambda 差不多吗？”

（免责声明：最后一条是我自己编造的。）

但重点是，这些仅仅是趣闻轶事。那么，无服务器框架的实际统计数据是怎样的呢？

这是一个老生常谈的问题！本文将用*图表*来回答这个问题。

## 事件源

先来解决今天最大问题：开发人员正在部署的所有服务中包含什么？

### API 占据主导地位

答案就是 http。

在我们深入讨论前，先了解一点有用的背景知识。仅包含一种事件类型的服务占所有服务的 79%。所有服务中的 16% 使用两种事件类型，4% 包含三种或更多事件类型。

为了使这些数据更易于理解，我们将从几个不同的方面来剖析。首先，请看下面这张仅显示单事件源服务的数据图（记住，单事件源服务占所有服务的 79%）：

<img src="https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/data-report-2018/services-single-event-type1.jpg">

*含一种事件类型的所有服务（按事件类型）*

大多数包含*两种*事件类型的服务（所有服务的 16%）中都包含 http，例如 http + cron 和 http + sns。“其他”部分占据较大比例，主要原因在于其中有很多种排列方式，因此我们将其作为一种最受欢迎的类型：

<img src="https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/data-report-2018/services-2-types1.jpg">

*含两种事件类型的所有服务（按事件类型）*

包含三种及更多事件类型的服务如要划分所有排列不太现实，但此类服务在所有部署的服务中仅占 4% 多一点。

### 每个服务有多少个函数？

我们来看看开发人员在每个服务中部署了多少个函数。请注意，本图仅包含在三个不同日期存在部署活动的服务，以便排除“Hello, World”应用。

<img src="https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/data-report-2018/functions-per-service1.jpg">

*服务（按函数个数）*

## 热门语言

无服务器开发人员倾向于使用哪些运行时？

### 概况

Node.js 使用比例明显遥遥领先，其次是 Python。

<img src="https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/data-report-2018/services-deployed-pie1.jpg">

*所部署服务的百分比（按语言）*

### 增长最迅速

我们来看看各个语言在不同时间段的使用率（不含占据绝对主导地位的 Node 6.10）。

<img src="https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/data-report-2018/services-by-language-line1.jpg">

*AWS 上使用的语言（排除 Node 6.10；以服务百分比表示）*

Python 3.6 是过去八个月内使用率整体增长最稳定的语言，今年的增长尤为突出。

但是，从相对较长的时间范围来看，Go 仅在上图中右下角呈现暂时性的趋势。这是因为 Lambda 从一月开始才支持 Go（绘制此图时，受支持时间约 2 个月）。

### Golang 采用率曲线

[Golang 支持](https://serverless.com/blog/ultimate-list-serverless-announcements-reinvent/#golang-support)是 re:Invent 2017 大会上备受关注的公告之一（[Serverless Aurora](https://serverless.com/blog/serverless-aurora-future-of-data/) 也是）。但直到 2018 年 1 月，Golang 支持才提供正式可用版本。

那么，Go 的使用率增长有多快呢？

下面这张编程语言（包含各个版本）图表直接比较了 2017 年 8 月和 2018 年 2 月各语言的使用率。

<img src="https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/data-report-2018/services-by-language-full1.jpg">

*AWS 上使用的语言（以服务百分比表示）*

在短短的六周内，Go 的使用率已经达到 Java 的一半左右。同样值得注意的是，从 8 月到 2 月，Node.js 的使用率下降了三个百分点。

为了好玩，我们不妨来看看试验曲线是怎样的。为此，我们以周为时间单位来看看自 1 月 15 日起采用 Go 语言编写的服务的部署次数。（注意，是部署次数而不是服务数量；换而言之，人们使用 Go 的频率有多高。）

<img src="https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/data-report-2018/go-deployments1.jpg">

*Golang 在 AWS 上的使用率（以占所有部署的百分比表示）*

如图所示，Golang 使用率稳定增长，已经增长了两倍。

明年的服务统计图*一定*非常有意思。

## 开发人员在什么时间段进行部署？

早上 7 点？实际并非如此。

事实证明，服务部署的高峰时段是在午餐时间到下班时间之间：

<img src="https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/data-report-2018/deploy-times1.jpg">

## 总结

- Python 3.6 使用率上升速度很快，但 Go 增速也不错
- API 在无服务器用例中占主导地位
- 开发人员不喜欢在早上部署
