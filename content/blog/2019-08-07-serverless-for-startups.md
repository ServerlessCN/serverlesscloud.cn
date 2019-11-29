---
title: '无服务器：初创企业的理想选择？（CloudForecast 案例研究）'
description: 'CloudForecast 是 2018 年成立的一家独立初创企业。本文将介绍他们决定选择无服务器的原因。'
date: 2019-08-07
thumbnail: 'https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/cloudforecast/thumbnail.png'
heroImage: 'https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/cloudforecast/header.png'
categories:
  - user-stories
authors:
  - FrancoisLagier
---

2018 年，在决定创立 [CloudForecast](https://www.cloudforecast.io/?utm_source=serverless.com&utm_medium=blog&utm_campaign=serverless) 时，我们面临着每个初创企业都存在的问题，包括“如何正确地用我们的资源来构建该产品而又不为未来造成技术负担？”

#### “100 美元创业”理念

在创立 [CloudForecast](https://www.cloudforecast.io/?utm_source=serverless.com&utm_medium=blog&utm_campaign=serverless) 前后，我读到了 Chris Guillebeau 的著作《100 美元创业》。Chris 在书中建议读者尽快推出产品，同时以具备成本效益的方式限制因想法失败而造成的损失（不幸的是这种情况无法避免！）。我们尝试将此建议应用于业务的各个方面，包括技术决策。

#### 我们的目标/要求

抱着“100 美元创业”的理念，我们首先列出了在创立 CloudForecast 时至关重要的要求：

- 快速交付：我们很高兴能构建 CloudForecast 来帮助公司节省 AWS 方面的开支。我们希望尽快将其交付给客户，并继续保持我们的劲头。花时间调试配置和部署流程等不会使最终产品更好。我们一直在寻找可以扩展的即用型解决方案，让我们立即专注于我们的 MVP
- 成本效益：作为一家初创公司，我们希望通过构建可根据客户群无缝扩展的系统来避免产生固定成本。

**AWS Lambda + 无服务器 = 简单 + 专注 + 成本效益**

我们就如何实现目标和要求集思广益，讨论了管理自己的实例、使用容器和六种其他想法，但是我们需要一些简单的方法，因此我们决定使用无服务器解决方案（即 FaaS）。尽管存在一些弊端（例如冷启动等），但我们认为无服务器更适合我们的用例（几乎无需管理，按执行付费，无闲置成本且具备自动扩展能力）。冷启动是 Lambda 众所周知的一个缺点，但是由于我们主要是通过脱机方式转换和从 S3 加载数据，因此我们认为冷启动问题不大。

对于开发设置和部署过程，出于以下原因，我们决定将无服务器框架与 AWS Lambda 结合使用：

- 我们可以专注于编写产品，让无服务器框架管理其余内容（权限、事件管理）
- 易于配置和部署
- 无服务器框架支持多种平台（GCP、AWS 等），这可以防止将来出现麻烦。我们之所以选择 AWS Lambda，是因为我们的客户数据将存储在 S3 中。为了降低网络成本，这是一个合理的决定
- 无服务器框架提供了丰富的插件（请参阅 [https://serverless.com/plugins/](https://serverless.com/plugins/)）
- 最后同样重要的是：非常有用的文档和社区（[Github](https://github.com/serverless/serverless)、[Gitter](https://gitter.im/serverless/serverless)、[Slack](https://serverless.com/slack) 和[论坛](https://forum.serverless.com)）

我们最初的要求非常简单：我们需要 4 个 AWS Lambda 函数，每个 Lambda 函数都负责自己的计划任务，并且每个 Lambda 函数需要与各种 AWS 产品（RDS、DynamoDb、SQS 等）进行通信。另外，还要通过简单的方法来管理多个环境（开发与生产）以及采用简单/有效的方法来管理资源权限。

下面介绍我们如何实现这一点：

- 我们使用 4 个函数：

![Functions](https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/cloudforecast/CloudForecastFunctions.png)

- 使用 iamRoleStatements 来配置所有权限：

![IAM](https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/cloudforecast/CloudforecastIam.png)

利用这两个代码段，我们就可以设置大多数的架构。4 个函数将通过 SNS 相互交互。两个函数将按照计划运行检查（通过“schedule.rate”参数），以检查是否需要重新处理文件并通过 SNS 触发另一个函数。这种配置将能轻松扩展，同时控制我们的成本。我们能够使用 iamRoleStatements 来完全隔离环境以配置权限。

我们最初使用一个简单的 YAML 文件来控制环境变量，但是我们很快换用 `DotEnv` 文件，使用 [DotEnv](https://serverless.com/plugins/serverless-dotenv-plugin/) 插件。

我们曾考虑运行几个小型实例来完成这项工作，这样一年至少要花掉我们 1000 美元。而 AWS Lambda 的成本几乎是 0 美元，因为我们每天仅运行几个函数，这些可以由 AWS 免费层级轻松涵盖。

#### 回顾历程！

像每个初创公司一样，我们在此过程中犯了一些错误，而且可能仍然会犯错，但是选择 AWS Lambda 和无服务器框架是正确之举，原因有以下几点：

- **CloudForecast 借助 AWS Lambda 可以轻松扩展：**随着不断招揽客户，我们将自动运行更多函数，成本将随着收入线性增长。
- **无服务器框架一直在改善，并且与 AWS Lambda 保持同步。**最近的[完整生命周期](https://serverless.com/blog/serverless-now-full-lifecycle/)功能公告可以完美地体现无服务器框架在不断发展。

随着时间的推移，我们的产品和函数都在不断发展，但是无服务器框架和 Lambda 始终能够胜任。

如果您对这篇文章或者我们在 [CloudForecast.io](https://www.cloudforecast.io/?utm_source=serverless.com&utm_medium=blog&utm_campaign=serverless) 的工作有任何疑问，请随时通过 francois@cloudforecast.io 联系我。我们非常乐意收到您的反馈！
