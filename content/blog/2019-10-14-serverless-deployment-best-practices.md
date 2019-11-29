---
title: '无服务器部署最佳实践'
description: '了解部署无服务器应用时的一些最佳实践。'
date: 2019-10-14
thumbnail: 'https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/2019-10-deployment-best-practices/safeguard-header.png'
heroImage: 'https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/2019-10-deployment-best-practices/safeguard-hero.png'
categories:
  - guides-and-tutorials
authors:
  - FernandoMedinaCorey
---

### 概述

随着您持续开发无服务器应用，应用的复杂性和范围可能会逐渐增加。这就需要您遵循结构化实践来部署应用，以最大程度减少错误、维护应用安全以及更快地进行开发。下文将介绍各种无服务器部署最佳实践。在介绍过程中，我还会向您展示如何使用新的无服务器仪表板[安全措施](https://serverless.com/framework/docs/dashboard/safeguards/)来帮助您在自己的无服务器框架应用中轻松执行这些实践。如果您还不熟悉该无服务器仪表板，请先参阅[文档](https://serverless.com/framework/docs/dashboard/)。

现在，我们来看看您可以在自己的无服务器应用中执行的一些部署最佳实践！

### 安全

#### 妥善处理密码

API 密钥、数据库凭证或其他密码需要由应用来安全存储和访问。此实践由几个不同的部分组成，但其中最关键的部分是：

1. 将密码与源代码控制分开
2. 限制密码的访问权限（实施最小特权原则）
3. 在不同的应用阶段使用不同的密码（如适用）

我们之前已经[讨论了](https://serverless.com/blog/serverless-secrets-api-keys/)使用无服务器框架时处理密码的几种方法，这些方法对您而言可能很合适。

最近，我们又增加了[参数](https://serverless.com/framework/docs/dashboard/parameters/)这种方法，以允许您在不同的服务、AWS 账户和应用阶段配置密码。您还可以使用[安全措施策略](https://serverless.com/framework/docs/dashboard/safeguards/)来阻止服务部署，前提是明文密码在 `serverless.yml` 中设置为环境变量。

#### 限制允许的 IAM 策略

另一个重要的最佳实践是尝试限制您授予应用的权限范围。对于 AWS，每次为服务创建 IAM 策略时，都应仅向相应角色授予操作所需的最小权限。此外，您还应尝试在策略定义中少用通配符（`*` 字符）。并且，您还可以使用安全措施策略来阻止 IAM 权限中包含通配符的部署：

![Displays the configuration for the no wildcards safeguard](https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/2019-10-deployment-best-practices/no-wildcards.png)

您可以使用这种策略来完全阻止部署，也可以警告开发人员再次检查他们所使用的 IAM 策略。

#### 限制部署时间

假设您所在的电子商务团队正准备参加每年的黑色星期五促销。您对自己代码的现状胸有成竹，但您想要杜绝在销售旺季引入新错误的可能性。一种常用的方法是在此期间锁定您的部署。一些组织也存在类似的情况，他们不希望在周末收到待命通知，因此他们可能会在星期五至星期一早晨锁定部署。

![Displays the configuration for the deploy times restriction policy](https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/2019-10-deployment-best-practices/deploy-times.png)

虽然这些情况可能不适用于您的组织，但如果适用，您可以使用[安全措施](https://serverless.com/framework/docs/dashboard/safeguards/)在环境中应用此策略。

### 一致的约定

#### 阶段

约定发挥巨大作用。它们可以帮助开发人员获悉一系列标准，然后直观地理解系统的其他部分。一个最普遍的开发约定是，客户在一个单独的地方查看代码（生产），开发人员在一个或多个地方处理尚未准备就绪的代码（开发/测试等）。这些不同的地方通常称为“阶段”，它们使您能够通过一致的路径将代码提供给客户。

如果使用无服务器框架，您在处理应用时，应用默认会进入 `dev` 阶段。然后，当应用准备好投入生产时，您可以通过更新 `serverless.yml` 或运行带有 `--stage prod` 选项的部署命令，将它们部署到 `prod` 等阶段。在每个阶段，您可能需要使用迥然不同的配置。

幸运的是，在与阶段进行交互时，您可以使用无服务器仪表板来进行许多新的粒度控制。每个阶段的配置可能包括：

- 部署到哪个 AWS 账户或区域阶段
- 针对部署评估了哪些安全措施
- 使用了哪些参数和密码

您可以使用安全措施来完成很多操作，例如阻止将 `dev` 阶段部署到生产 AWS 账户，或确保生产 API 密钥始终与生产部署捆绑在一起。这些选项非常灵活，可以帮助您支持组织的各种需求和工作流程。

#### 允许的区域

对于地理位置分散的团队，每个开发人员的默认 AWS 区域可能不同。西雅图的开发人员可能默认使用 `us-west-2`，费城的开发人员可能使用 `us-east-1`。当您开始独立部署和开发时，这些差异可能会导致代码出现意外问题。例如，一项服务引用的区域可能与实际需要部署的区域不同，或者不同的区域可能具有不同的支持功能或限制。

为避免此类问题，您可以要求开发人员使用适合您需求的单个区域或区域子集。当然，您也可以使用[安全措施](https://serverless.com/framework/docs/dashboard/safeguards/)来实现。在部署时，它可以确保您的服务仅部署到指定的特定区域或区域列表：

![Displays the configuration for the deploy times restriction policy](https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/2019-10-deployment-best-practices/allowed-regions.png)

#### 函数命名和描述

与阶段和区域控制相结合，在基础结构中保持一致的命名和描述可以帮助新开发人员快速了解服务的功能、它们如何连接到不同的应用阶段，并使他们能够更轻松地构建和调试。

一种常见的模式是要求您的 Lambda 函数在每个函数名称中都使用一致的服务名称、阶段和函数。这样，您将能够更轻松地查找相关函数（前提是位于同一个 AWS 账户中），并且可以更快地将多个函数与特定服务绑定。

我们假设一项服务是处理用户提交的内容、将它们记录在数据库中并为它们建立索引以便搜索。它可能实施了一个 Lambda 函数来接受/拒绝提交并将其存储在 DynamoDB 表中，并实施了另一个 Lambda 函数以在 ElasticSearch 中为新数据建立索引。如果您采用这种简单的架构并将它扩展到 prod 或 dev 环境中，您将需要跟踪 4 个 Lambda 函数。如果我们遵循如下 Lambda 函数命名约定，这将会变得更加容易：`serviceName-stage-functionName`。

在这种情况下，函数名称如下所示：

- `newSubmissions-prod-submissionGrader`
- `newSubmissions-prod-elasticsearchIndexer`
- `newSubmissions-dev-submissionGrader`
- `newSubmissions-dev-elasticsearchIndexer`

这样，您就可以确切地知道需要调用哪个函数，并在需要时快速找到它。而且，如果您不想担心新开发人员部署名称不一致的服务，还可以使用无服务器仪表板中的另一项安全措施强制执行此命名约定。

#### 要点

这些只是我们希望在无服务器仪表板中实现的部分最佳实践。还有许多其他安全措施可以实现更多应用专属实践，例如强制创建死信队列或要求服务位于 VPC 中。

请记住，这些最佳实践不仅适用于无服务器框架。无论您决定如何构建应用，其中的大部分实践都可以帮助您更有效、更安全地完成构建。

如果您觉得我们遗漏了一些其他开发最佳实践，请在评论中告知我们！我们会不断想方设法改善用户的开发体验。
