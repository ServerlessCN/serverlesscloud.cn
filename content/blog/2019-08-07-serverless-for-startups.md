---
title: "Serverless：初创企业的理想选择？（CloudForecast 案例分析）"
description: "CloudForecast 是 2018 年成立的一家独立初创企业，本文将介绍他们决定选择 Serverless 的原因。"
date: 2019-08-07
thumbnail: 'https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/cloudforecast/thumbnail.png'
heroImage: 'https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/cloudforecast/header.png'
categories:
  - user-stories
authors: 
  - FrancoisLagier
authorslink:
  - https://serverless.com/author/francoislagier/
translators: 
  - Aceyclee
translatorslink: 
  - https://www.zhihu.com/people/Aceyclee
---

2018 年，在决定创立 [CloudForecast](https://www.cloudforecast.io/?utm_source=serverless.com&utm_medium=blog&utm_campaign=serverless) 时，我们面临着每个初创企业都存在的问题 —— 如何正确地利用我们的资源来构建产品，而又不为未来造成技术负担？

#### 「100 美元创业」理念

在创立 [CloudForecast](https://www.cloudforecast.io/?utm_source=serverless.com&utm_medium=blog&utm_campaign=serverless) 前后，我读到了 Chris Guillebeau 的著作《100 美元创业》。Chris 建议尽快推出产品，以更划算的方式减少因想法失败而造成的损失（不幸的是这种情况无法避免！）。我们尝试将此建议应用于业务的各个方面，包括技术决策。

#### 我们的目标和需求

抱着「100 美元创业」的理念，我们首先列出了在创立 CloudForecast 时至关重要的需求：

* 快速交付：我们很高兴能构建 CloudForecast 来帮助公司节省云厂商 方面的开支。我们希望尽快将其交付给客户，并继续保持我们的劲头。花时间调试配置和部署流程等不会使最终产品更好。我们一直在寻找可以扩展的即用型解决方案，让我们立即专注于我们的 MVP
* 成本效益：作为一家初创公司，我们希望通过构建可根据客户群无缝扩展的系统来避免产生固定成本。

**云函数 + Serverless = 简单 + 专注 + 成本效益**

我们讨论了管理自己的实例、使用容器和其他 6 种想法，但是我们需要一些简单的方法，因此我们决定使用 Serverless 解决方案（即 FaaS）。尽管存在一些弊端（例如冷启动等），但我们认为 Serverless 更适合我们的用例（几乎免运维，按需付费，无闲置成本且具备自动扩缩容能力）。冷启动是 云函数 众所周知的一个缺点，但是由于我们主要是通过脱机方式转换和从 S3 加载数据，因此我们认为冷启动问题不大。

对于开发设置和部署过程，出于以下原因，我们决定将 Serverless Framework 与云函数结合使用：

* 我们可以专注于编写产品，让 Serverless 管理其余内容（权限、事件管理）
* 易于配置和部署
* Serverless 支持多种平台，这可以防止将来出现麻烦。我们之所以选择云函数，是因为我们的客户将数据存储在其对象存储中。为了降低网络成本，这是一个合理的决定
* Serverless Framework 提供了丰富的插件（请参阅 [https://serverless.com/plugins/](https://serverless.com/plugins/)）
* 最后同样重要的是：非常有用的文档和社区（[Github](https://github.com/serverless/serverless)、[Gitter](https://gitter.im/serverless/serverless)、[Slack](https://serverless.com/slack) 和[论坛](https://forum.serverless.com)）

我们最初的要求非常简单：我们需要 4 个云函数，每个云函数都负责自己的计划任务，并且每个云函数需要与各种相关产品进行通信。另外，还要通过简单的方法来管理多个环境（开发与生产）以及采用简单/有效的方法来管理资源权限。

下面介绍我们如何实现这一点：

* 我们使用 4 个函数：

![Functions](https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/cloudforecast/CloudForecastFunctions.png)

* 使用 iamRoleStatements 来配置所有权限：

![IAM](https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/cloudforecast/CloudforecastIam.png)
  
利用这两个代码段，我们就可以设置大多数的架构。4 个函数将通过 SNS 相互交互。两个函数将按照计划运行检查（通过“schedule.rate”参数），以检查是否需要重新处理文件并通过 SNS 触发另一个函数。这种配置将能轻松扩展，同时控制我们的成本。我们能够使用 iamRoleStatements 来完全隔离环境以配置权限。

我们最初使用一个简单的 YAML 文件来控制环境变量，但是我们很快换用 `DotEnv` 文件，使用 [DotEnv](https://serverless.com/plugins/serverless-dotenv-plugin/) 插件。

我们曾考虑运行几个小型实例来完成这项工作，这样一年至少要花掉我们 1000 美元。而云函数的成本几乎是 0 美元，因为我们每天仅运行几个函数，这些可以由云函数免费额度轻松涵盖。

#### 小结

像每个初创公司一样，我们在此过程中犯了一些错误，而且可能仍然会犯错，但是选择云函数 和 Serverless Framework 是正确之举，原因有以下几点：

* **CloudForecast 借助云函数可以轻松扩展：** 随着不断招揽客户，我们将自动运行更多函数，成本将随着收入线性增长。
* **Serverless Framework 一直在改善，并且与云函数 保持同步。** 最近的 [Full Lifecycle](https://serverless.com/blog/serverless-now-full-lifecycle/) 功能公告可以完美地体现 Serverless Framework 在不断发展。

随着时间的推移，我们的产品和函数都在不断发展，但是 Serverless Framework 和云函数始终能够胜任。
