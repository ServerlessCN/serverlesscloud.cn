---
title: '不适合选择无服务器的情境及原因'
description: '无服务器既有优点也有缺点。那么，哪些情境下不适合选择无服务器？原因又是什么呢？'
date: 2018-03-21
layout: Post
thumbnail: 'https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/why-not/why-not-header.png'
categories:
  - guides-and-tutorials
  - operations-and-observability
  - engineering-culture
heroImage: 'https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/why-not/why-not-header.png'
authors:
  - AndreaPasswater
---

如今，很多人支持向无服务器运动。无服务器不仅可以降低管理成本，而且，由于开发人员无需再维护服务器，服务器成本也会降低。这些优点都是实实在在的。

但它也有缺点。如果您正在考虑选择无服务器，不妨读完本篇文章。

#### 可观测性更为困难

无服务器目前最遭人诟病之处可能是它让使用者无法获得函数的一些关键见解。

无服务器鼓励使用基于事件的架构，而很多人对此类架构并不熟悉。此外，无服务器是一个全新的领域，提供的工具相对而言不太成熟。即使是执行堆栈跟踪这样简单的任务也很困难。

<blockquote class="twitter-tweet" data-conversation="none" data-lang="en"><p lang="en" dir="ltr">关于可观测性的讨论在实践中非常有用，而且在某种程度上也让人放下心来：微服务/无服务器架构仍有需要解决的问题，并不只有我遗漏了显而易见的东西！</p>&mdash; Matthew Jones (@matt_rhys_jones) <a href="https://twitter.com/matt_rhys_jones/status/971046522744983552?ref_src=twsrc%5Etfw">2018 年 3 月 6 日</a></blockquote>
<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

过去一年，[Dashbird、IOpipe 和 X-ray 等日志记录和监视平台](https://serverless.com/blog/best-tools-serverless-observability/)已极大地丰富了其选择。在接下来一两年内，无服务器的可观测性应该会更接近平均水平。但是，有一点需要注意的是，无服务器函数在设计上是无状态的。这使得采用除日志以外的任何其他方法在生产环境调试函数都将变得非常困难。

虽然有一些工具能避免开发人员盲目工作，但无服务器可观测性方面还存在很大的提升空间。

## 延迟

无服务器函数意味着您需要处理冷启动。

需要说明的一点是，许多无服务器开发人员*都*在使用一种相当简单的办法来应对：通过定期命中函数来[使函数保持暖启动](https://serverless.com/blog/keep-your-lambdas-warm/)。

但这对于较小的函数最为有效。当函数较大或工作流程相对较复杂时，[复杂性会加大不少](https://theburningmonk.com/2018/02/aws-lambda-monolithic-functions-wont-help-you-with-cold-starts/)。

为最大程度降低冷启动时间，应注意以下几点：

- 应用架构：使用小而集中的无服务器函数。冷启动时间会随内存和代码大小而线性增加
- 语言的选择：Python 和 Go 语言可显著降低冷启动时间，而 C# 和 Java 具有众所周知的最长冷启动时间
- VPC：配置网络资源的额外运行会导致冷启动时间增加。

#### 更依赖供应商生态系统

采用无服务器，您无需管理服务器。但这也意味着您无法控制服务器软件、运行时和运行时更新（撰写本文时，Node.js 8 已推出，但 AWS 仍在使用 Node.js 6）。提供商还会实施并发和资源限制。

应用架构的细节可能突然交由您使用的提供商决定。例如，如果您使用 AWS Lambda 的无服务器框架，您可以使用的无服务器式数据库只有 DynamoDB 或 Serverless Aurora。（但您也可以将 Lambda 附加到 VPC，然后访问其中的其他数据库，例如 RDS、ElastiCache 和 ElasticSearch 实例。\*）

所以，这就存在供应商锁定的问题。关于全部使用一个提供商的长期影响有很多讨论，但意见分歧很大：

<blockquote class="twitter-tweet" data-conversation="none" data-lang="en"><p lang="en" dir="ltr">Instead of trying to avoid vendor lock-in, concentrate on switching cost. How easy is a solution to adopt now; and migrate away from later?</p>&mdash; Kelsey Hightower (@kelseyhightower) <a href="https://twitter.com/kelseyhightower/status/856606909608194049?ref_src=twsrc%5Etfw">April 24, 2017</a></blockquote>
<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

CNCF 也在[积极提倡跨平台标准化](https://openevents.io/)，以便使迁移应用更为容易，并在大体上缓解供应商锁定的问题。

#### 招聘人才更加困难

很多开发人员不知道无服务器。即便应聘者知道，对他们而言也是一个非常模糊的概念，他们可能很难想象出他们的工作会涉及到什么内容。

在当今的人才市场中，找到合格人才已经相当困难，而在职务头衔中加入“无服务器”这个条件无疑会让候选人更少。即使您愿意录用没有专门的无服务器经验的开发人员，他们可能也会望而却步。

另一方面，对小部分试验者和快节奏环境爱好者来说，新兴技术堆栈是一大吸引点。

#### 那为什么还要采用无服务器呢？

既然无服务器存在诸多缺点，为什么还要用呢？

总体而言，它可以显著提高应用开发和工作流程的效率。

转向无服务器的原因主要有四点：

- 可以按需自动扩展
- 由于无需为空闲资源付费，可显著降低服务器成本 (70-90%)
- 无需服务器维护
- 可解放开发人员资源，使开发人员更专注于能直接创造业务价值的项目，而不是将时间花费在维护上

<blockquote class="twitter-tweet" data-conversation="none" data-lang="en"><p lang="en" dir="ltr">I have had *every* argument thrown at me. I then throw back: &quot;I hardly have to manage anything and it scales and costs a lot less&quot;. <a href="https://twitter.com/hashtag/win?src=hash&amp;ref_src=twsrc%5Etfw">#win</a></p>&mdash; 🦄 Paul Johnston 🦄 (@PaulDJohnston) <a href="https://twitter.com/PaulDJohnston/status/897050658876125184?ref_src=twsrc%5Etfw">August 14, 2017</a></blockquote>
<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

无服务器有一些用例，虽然可能存在一些缺点，但优点却不可否认。无服务器 API 广为使用。

所有这些都表明，利用并逐渐实现*完全无服务器*的数字企业正在增加：

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">As of today <a href="https://twitter.com/bustle?ref_src=twsrc%5Etfw">@bustle</a> has fully adopted serverless. We’re down to 15 ec2 instances mostly comprised of self-managed HA Redis. We serve upwards of a billion requests to 80 million people using SSR preact and react a month. We are a thriving example of modern JavaScript at scale.</p>&mdash; Tyler Love (@tyleralove) <a href="https://twitter.com/tyleralove/status/969446548034785280?ref_src=twsrc%5Etfw">March 2, 2018</a></blockquote>
<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

[我们自己的网站](https://github.com/serverless/site)是使用 Lambda、无服务器框架和 Netlify 构建的一个静态无服务器网站。它永远不会宕机，并且我们每周也无需花时间去维护。

#### 总结

万事万物皆有其两面性。无服务器可以提高效率，但同时也使控制度和可见性降低。

##### 无服务器架构延伸阅读

- [无服务器架构入门](https://serverless.com/learn/)
- [如何将初创公司迁移到无服务器框架](https://read.acloud.guru/our-serverless-journey-part-2-908d76d03716)
- [为什么从 Docker 换用无服务器框架](https://serverless.com/blog/why-we-switched-from-docker-to-serverless/)
- [无服务器 (FaaS) 和容器，如何选择？](https://serverless.com/blog/serverless-faas-vs-containers/)

\*_感谢 [@hotzgaspacho](https://twitter.com/hotgazpacho) 在本文中添加此部分内容。_
