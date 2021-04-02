---
title: "AO.com：逐渐转向无服务器优先"
description: "AO.com 的 SCV 团队率先尝试无服务器服务。折服于无服务器框架的快速周转时间和低维护成本，整个团队逐渐转向无服务器优先。"
date: 2019-04-24
thumbnail: "https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/ao-com-story/ao-serverless-thumbnail.png"
heroImage: "https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/ao-com-story/ao-serverless-header.png"
category:
  - user-stories
authors:
  - NickGottlieb
---

AO.com 是英国的一家领先线上电器零售商，致力于在客户购买产品的整个过程中为客户提供非凡的体验。从选择满足需求的合适产品，到在网站上下单，再到在适当的时间收货，AO.com 希望能让客户全程满意。

为实现此目标，单一客户检视 (SCV) 团队就此衍生。该团队在帮助公司遵守用户隐私和 GDPR 法规方面发挥着关键作用。不久之前，他们的技术堆栈还是由我们熟悉的容器、EC2、Kafka 和 SQL Server 等模块组成。

但即将出台的 GDPR 法规为他们尝试创新提供了契机。

#### GDPR 合规性促使他们选择无服务器

SCV 团队需要快速构建一项全新的功能，以确保 AO.com 符合即将实施的新 GDPR 法规。

SCV 团队考虑过这对于他们意味着什么。他们需要设置容器，配置服务器资源，还需要考虑负载均衡和安全问题（例如修复系统），并在不到两周的时间内交付无故障的功能；但只有一个规模相对较小的团队。团队知道，通过尝试创新，他们才能产生更大的影响。

因此，他们开始寻找更高效省时的解决方案。团队中有些人员已经在使用 AWS Lambda 和无服务器框架，而这个框架看起来很有潜力。

这使得 AO.com 团队坚定了信心。他们决定以无服务器方式构建新的 GDPR 功能。这是团队构建的首款生产型无服务器应用，并且取得了团队未曾预料到的巨大成功。

此后，他们在构建每一项新功能时都采用无服务器方式，真正形成了无服务器优先的思维模式。

##### 构建首项无服务器功能的过程

Lambda + 无服务器框架使 AO.com 团队在三天内便完成了他们的新功能。

功能发布后，Lambda 会根据需求自动扩展，因此不必持续监控以确保功能不会出现故障。

> 我们在三天内便使功能投入使用。这对于企业而言是非常成功的，它促使我们开始采用无服务器方式构建更多功能。

--Jon Vines，AO.com 软件开发团队负责人

他们继续采用无服务器方式构建基于 API 的新服务，先后构建了数据主体访问请求功能（GDPR 合规性的另一个方面）、被遗忘权请求以及一整套面向用户的其他功能。

这些 API 的架构非常简单：无服务器框架定义了其 Lambda 函数，然后与 SNS 和 S3 存储桶 (bucket) 进行交互。

<img src="https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/ao-com-story/Serverless-Architecture-AO1.png">

它们还能够在短短几天内交付各项后续功能。而这一切的 Lambda 费用是多少呢？

每月只需不到 15 美元。

#### 从 API 到完整的无服务器数据管道

AO.com 团队的一项核心能力是构建数据管道，并将数据发送给合适的团队。他们最初的架构是在 EC2 实例上使用 Kafka，并将服务部署在 ECS 的容器中。

团队对这种解决方案的稳健性非常满意，而现在他们可以进一步提高其效率。这种架构的性质意味着，他们每次想要部署变更时，都必须为整个管道重新部署整个功能。这也意味着功能的扩展涉及整个服务，而不仅是单项功能。

##### 使用无服务器框架将数据管道迁移到 Lambda

AO 团队决定将 Lambda 集成到其数据管道中。这样，他们便能够轻松进行增量部署，并使数据管道根据需要自动扩展。

他们保留了 Kafka，但现在使用 Lambda 和 S3 存储桶与 Kafka 交互。因此，他们当前的无服务器数据管道架构如下所示：

<img src="https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/ao-com-story/Serverless-Architecture-AO2.png">

> “我们不再需要管理服务器、容器，也无需扩展策略，只需使用 S3 存储桶和触发器与 Lambda 交互。由于无需管理或扩展，我们的工作量减轻不少。这对于我们来说是一项巨大的胜利。”

_--Jon Vines，AO.com 软件开发团队负责人_

#### 过程中遇到的各种挑战

AO.com 团队对 .NET 最为熟悉，因此决定在迁移到无服务器和 Lambda 之后继续在 .NET 中进行开发。

无服务器生态系统主要[专注于 JavaScript 和 Python 等语言](https://serverless.com/blog/serverless-by-the-numbers-2018-data-report/#top-languages)。这意味着查找 .NET 示例面临更大的挑战，不过，团队发布总结了[他们的经验](https://medium.com/@jonvines/lessons-learned-in-serverless-6a4acc489d55)。在其他方面，.NET 用于观察和监视的工具虽然不那么先进，但始终在不断改善。

最大的影响是，在处理 Lambda 函数时，开发人员必须解决冷启动问题。在 JavaScript 或 Python 之类的语言中，冷启动问题不大，但在 .NET 中，冷启动可能长达 3-5 秒。AO.com 团队正在通过调整 Lambda 配置来解决此问题。

AO.com 团队负责人 Jon Vines 表示，总体而言，他并不后悔选择 .NET。“我们更熟悉 .NET，它对我们而言更加简单。我们从无服务器中看到的收益值得我们作出这种权衡取舍。”

#### 公司范围的变更

SCV 团队只是 AO.com 的一个团队。在见证了无服务器对 SCV 团队带来的巨大影响后，AO.com 的其他团队也开始尝试并采用无服务器方式。

> “AO.com 距离完全实现无服务器还很遥远。我万分期待明年的进展。”

_--Jon Vines，AO.com 软件开发团队负责人_
