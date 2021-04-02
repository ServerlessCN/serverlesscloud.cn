---
title: "浅谈无服务器、数据锁定和供应商选择"
description: "供应商选择是如今 IT 领导者需要考虑的最重要事项，而这一点可利用数据可移植性来实现。"
date: 2018-06-20
thumbnail: 'https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/vendor+choice/serverless-data-portability.jpg'
category:
  - engineering-culture
  - guides-and-tutorials
heroImage: ''
authors:
  - NickGottlieb
---

在过去五年多的时间里，无论是先前在 CircleCI 就职还是如今在 Serverless 工作，我都会经常与技术决策者讨论他们的云采用策略。如今，我最常听到的担忧就是组织对*供应商选择*的要求。而在五年前，我很少听到这方面的担忧。

在云初期阶段，主要担忧是供应商锁定。很多组织认为其应用基础结构依赖于第三方是一种相对较新的模式，过于冒险。但从早期阶段到现在，世界已发生了翻天覆地的变化。

现在我们的经济实现了高度数字化，非常注重速度。我们有多种开发人员服务 — AWS、Google、Microsoft、Stripe、Auth0 和 Cloudflare，并且他们在不断地推出新产品和功能。这些产品和功能承诺带来更快的速度和迭代。

无服务器运动本身已经造就了不可胜数的成功案例，证明小规模团队在使用 AWS Lambda 等高度抽象的服务后，能以惊人的速度实现软件创新和交付。在我看来，速度和效率带来的收益前所未有，尽管其中的代价是供应商锁定。

不，问题不再是供应商锁定，而是供应商选择。组织如何能够保持敏捷性和高速度，如何才能利用最佳开发人员工具来加速超越之前认为可能的事情？

<img src="https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/vendor+choice/serverless-speed.png">

供应商选择是如今 IT 领导者需要考虑的最重要事项，而我相信这一点可利用**数据可移植性**来实现。

#### 供应商选择与锁定有何不同

速度和效率至上的组织越来越多地采用无服务器的应用架构。同时，他们也在考虑针对供应商选择进行相应优化的必要性。

这似乎与避免锁定相同，但思路实际上大相径庭。供应商选择意味着达到一种状态，让工程师（以及整个组织）能够尽可能灵活地选择解决手头问题所需工具。

许多无服务器架构都不仅仅是 AWS Lambda 结合一些其他 AWS 服务，还包括一系列其他服务，如处理支付的 Stripe、处理用户身份验证的 Okta 和发送 SMS 的 Twilio。

对于不同的用例，更适合使用不同的工具，供应商选择就是基于用例灵活地选择适用的工具。

#### 未实现供应商选择的代价

根据我的经验，任何限定组织使用单个平台的解决办法都伴随着高昂的代价，尤其是在速度和效率方面。现在的市场发展速度如此之快，不会受限于单个平台。

[Expedia](https://m.subbu.org/cloud-lock-in-and-change-agility-78d63978ddfd)、[JPMorgan](https://www.americanbanker.com/news/unexpected-champion-of-public-clouds-jpmorgan-cio-dana-deasy) 和 [Coca-Cola](https://www.forbes.com/sites/alexkonrad/2016/03/23/why-coca-cola-works-with-google-and-rivals-in-the-cloud-and-warns-against-focusing-on-price/#1a04c9852d87) 等企业的技术领导者们都曾公开谈论过对供应商选择的追求以及由此获得的灵活性和敏捷性。我预测，这种情况在接下来几年内会变得更加普遍，而且技术领导者如果能实现供应商选择，那么其所在组织将拥有获胜的优势。他们能够让软件更快地面市、提供更高水平的创新、降低成本以及保留更优秀的人才。

<img src="https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/vendor+choice/serverless-cocacola.png">

#### 确认真正的问题：数据锁定

供应商锁定的真正危险在于潜在的数据锁定，尤其是对于无服务器而言。数据具有地心引力，会累积。从经济上来看，平台定价的方式不利于数据流走。这是对供应商选择的唯一最大威胁。

例如，虽然 Lambda 为开发人员带来许多价值，但它仅与 DynamoDB 和 S3 等特定于 AWS 的存储选项进行本地集成。Auth0 虽然可以提供开箱即用的强大用户身份验证，但会导致用户数据困在封闭系统中。Stripe 虽然可以实现分钟级的数字支付，但会导致重要支付和客户信息被绑定到付费服务。

因此，我们的*数据*被锁定到这些服务，则会导致数据被锁定到这些服务及其生态系统。

#### 供应商选择的途径

我们的终极梦想是开发人员可以仅专注于增强并改进最核心的工作，而其他部分则由第三方服务包揽。无服务器运动是朝着这个终极梦想迈出的重要一步。

但组织如何在朝着这个目标前进的同时保持供应商选择？答案在于**数据可移植性**。

<img src="https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/vendor+choice/serverless-data.jpg">

数据可移植性意味着组织可以将数据随时迁移到任何地方。这样一来，组织就可以随时换用他们的托管服务或者同时使用几个不同的竞争性服务。这是一个两全其美的方案：组织既可以通过托管服务享受所追求的高效率，又能保持其对所拥有数据的自主权。

但是很明显，大多数供应商都不想其数据具有可移植性。数据锁定有助于他们留住客户，对他们有利（至少短期来说如此）。要实现真正的数据可移植性，进而支持供应商选择，我们需要寻求外部解决方案。

#### 开放源代码可能是解决之道

目前，正在进行的许多开放源代码项目都有这样一个目标：在数据方面提供更多灵活性和选择。

[CloudEvents](https://cloudevents.io/) 就是如此，该项目当前正在 CNCF 中逐渐成形。CloudEvents 的目标是建立描述事件数据的开放规范，使数据以事件形式在云提供商之间具有更高的可移植性。

[![cloudevents](https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/vendor+choice/cloudevents.png)](https://cloudevents.io/)

如果第三方提供商全都使用并理解这种相同的事件格式，开发人员则可以在不同的提供商之间轻松地迁移数据。这对解决数据锁定当前存在的挑战大有益处。

另一个此类项目是 [Event Gateway](https://serverless.com/event-gateway/)，该项目是一种开放源代码事件路由器，由我们 Serverless Inc. 的团队负责。它优于您架构中的各种云和服务，可使开发人员将事件形式的数据路由至所需的*任何*计算中。

[![event gateway](https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/event-gateway-announcement/event-gateway-integrations1.png)](https://serverless.com/event-gateway/)

例如，使用 Event Gateway，开发人员可以将事件从 AWS S3 存储桶路由到 Google Cloud Platform 上的 TensorFlow 服务，然后将结果存储在托管的大数据平台上。或者，开发人员可以使用 AWS Lambda 响应来自 Azure 数据库的事件。

这些仅仅是几个示例工作流，虽然可能具有很高价值，但靠如今可用的工具几乎不可能实现。无服务器运动及其为开发人员带来极致效率的愿景仍然处于早期阶段。除非我们能够找到避免数据锁定和推动供应商选择的方式，否则无服务器运动无法发挥其全部潜力。

（*图片版权归 [Joshua Sortino](https://unsplash.com/@sortino) 和 [Alexandre Godreau](https://unsplash.com/@alexandre_godreau) 所有*）
