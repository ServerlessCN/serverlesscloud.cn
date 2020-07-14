---
title: ServerlessDays China：无服务器的未来
description: 本文回顾了腾讯云主办的 ServerlessDays China 活动，阐述了无服务器计算发展的过去，现在及未来。
keywords: ServerlessDays,SCF
date: 2020-07-13
thumbnail: https://img.serverlesscloud.cn/2020618/1592480689193-IMG_1627.JPG
categories:
  - news
authors:
  - Michael Yuan
tags:
  - ServerlessDays
  - Meetup
---

6 月 18 日举办的 ServerlessDays China 活动，技术大咖云集。来自加州大学伯克利分校，serverless.com，腾讯云和谷歌云等云计算领域的学者与专家共同讨论了无服务器计算的最新创新，用例和未来方向。

[O'Reilly](https://www.oreilly.com/radar/oreilly-serverless-survey-2019-concerns-what-works-and-what-to-expect/) 在 2019 年对 1500 名 IT 专业人士的调查中，有 40％ 的受访者在采用无服务器架构的机构中工作。 发布于2020年的 [DataDog 调查](https://www.datadoghq.com/state-of-serverless/)显示，现在有超过 50％ 的 AWS 用户正在使用无服务器的 AWS Lambda 函数即服务（FaaS）。

**无服务器技术正在成为主流。**

Serverless Days 是无服务器技术的国际前沿技术盛会。来自业界和学术界的知名专家，就为什么无服务器风靡一时、以及企业为什么要关注无服务器，分享了很多实际案例与洞见。

Johann Schleier-Smith 谈到了无服务器计算的历史和未来。他是《简化的云编程：Berkeley 关于无服务器计算的观点》论文的作者之一，该报告将无服务器计算定义为无状态 FaaS（函数即服务，例如 AWS Lambda）和有状态存储 BaaS（后端即服务，例如 AWS S3）。

> 在我们的定义中，要使服务被认为是无服务器的，它必须在无需显式配置的情况下自动扩展，并根据使用情况进行计费。 — Berkeley 关于无服务器计算的观点

根据 Schleier-Smith 的说法，无服务器计算已经大大简化了系统或基础架构管理，正进入简化应用程序开发的新阶段。无服务器 FaaS 基础架构有三种主要方法，都可以为执行用户提交的代码提供隔离和安全的沙箱。

- FaaS 基础架构的第一种方法是使用系统或硬件级别的虚拟机，例如 AWS Firecracker。这种方法为应用程序提供了最佳的隔离和安全性，但很慢并且管理起来很复杂。云服务提供商会安装并引导操作系统和运行时软件堆栈（例如，Node.js或 Python）以运行用户的代码。 AWS Lambda 的成功证明了这种方法的可扩展性。
- 第二种方法是使用容器，例如 Docker。容器由 Kubernetes 等解决方案管理。这种方法的安全性较差，但性能比系统级虚拟机高得多。在执行任何用户代码之前，云服务提供商将使用操作系统和运行时堆栈来加载及启动容器镜像。
- 第三种新兴方法是使用特定于应用程序的虚拟机，例如 [WebAssembly](https://www.secondstate.io/articles/why-webassembly-server/)。这种方法提供了高度的抽象。 WebAssembly 虚拟机不需要绑定（bootstrap）自己的操作系统或软件堆栈，只执行编译后的字节码应用程序。 WebAssembly 提供了一个高级的“基于功能”的安全模型，用于访问系统资源（例如，通过WASI 规范），而不是粗粒度的操作系统级隔离。但是，与操作系统容器不同，WebAssembly 的缺点是仅支持编译为 WebAssembly 字节码的应用程序。目前，仅支持 C/C ++，Rust 和AssemblyScript（ TypeScript 的子集）。

> 数据隔离有多种方法，应用程序可以根据需要选择不同的方法。 — Johann Schleier-Smith

这三种方法提供了一系列解决方案，并且在性能，安全性和易用性三者中取得平衡。随着技术的发展，这三种方法之间的界线越来越模糊。例如，在系统级 VM 和容器之间架起了桥梁，LightVM 方法尝试将相关的操作系统函数直接编译到 VM 中以实现更快的性能。

无服务器基础设施创新的另一个例子是谷歌云的 gVisor。来自 Google 的 Wenlei He 在会议上作了关于 Google Cloud Run 的精彩演讲。在后台，Google gVisor 技术提供了用于运行容器的系统级沙箱。gVisor比 Docker 更安全，并且比系统级虚拟机更快。谷歌云的三个最重要的无服务器产品 Cloud Run，Cloud Functions 和 App Engine 都是基于 gVisor 构建的。

> 在 FaaS 语境中，无服务器的常见（但可能被低估）维度之一是，它能为公共云基础架构添加“可编程性”维度。 — 谷歌云 Serverless 首席产品经理 Jason Polites

正如 Schleier-Smith 和 Polites 所提到的那样，无服务器基础架构创新是达到目的的一种手段。无服务器计算的最终目标是简化开发者的互联网应用程序开发。然而，最近，下面的架构图“serverless Twitter”被疯狂转发，该架构图引发了很多人的疑问：这比我们想要取代的“有服务器”技术要简单吗？

![](https://img.serverlesscloud.cn/2020714/1594711927061-0a3dcf521828b50533e26e56dd787065.png)

[Serverless.com](https://github.com/serverless-components/tencent-express) 的首席执行官 Austen Collins 介绍了关于无服务器工具和应用程序架构的最新技术。他创造了“无服务器架构师的崛起”（the rise of the serverless architect）这个短语，来描述对有经验的无服务器技术人才的需求。随着无服务器应用的日益普及，开发者正在使用无服务器技术来构建成熟的企业应用程序，而不仅仅是简单 web 服务或 AWS 服务之间的无状态连接器。例如，开发者正在围绕无服务器的 FaaS 和 BaaS 之间的分界线展开工作。AWS 最近发布了[Lambda](https://github.com/serverless-tencent/serverless-tencent-scf)  Elastic File System，以使 Lambda 函数有状态（stateful）。另一方面，WebAssembly 解决方案正在推动 WASI 或[数据库访问的自定义扩展](https://www.secondstate.io/articles/the-storage-interface-in-ssvm/)来进行安全的文件系统访问。

正如上图所示，FaaS 应用程序的体系结构非常复杂并呈爆炸式增长。为了构建当今的无服务器解决方案，开发者显然需要软件架构师的技能。这是第一个在中国举办的SeverlessDays活动，[Serverless.com](http://serverless.com/) 宣布与腾讯云达成合作，提供软件工具以简化 [Node.js+Express.js apps](https://github.com/serverless-components/tencent-express), [静态网站](https://github.com/serverless-components/tencent-website)，和 [RESTful API 端点](https://github.com/serverless-tencent/serverless-tencent-scf) 在腾讯云无服务器平台上的部署。

与西方的互联网巨头一样，腾讯作为亚洲最大的互联网公司之一，运营着复杂的数据中心业务，并为其应用程序提供动力，因此很自然地将腾讯一部分数据中心作为云服务对外提供。腾讯云 Serverless 总经理Yunong Xiao 也作为大会的讲者之一，讨论了来自腾讯云的无服务器产品，包括[无服务器云函数 (SCF)](https://intl.cloud.tencent.com/product/scf) 和[无服务器框架](https://intl.cloud.tencent.com/product/sf)。

[ServerlessDays China](http://china.serverlessdays.io/)由腾讯云组织和赞助，这一线上大会吸引了 4 万多名观众在线观看。这是无服务器计算的“东西方碰撞”时刻，大会讨论的技术在中国开发者中引起了强烈兴趣。

---

---
<div id='scf-deploy-iframe-or-md'></div>

---

> **传送门：**
> - GitHub: [github.com/serverless](https://github.com/serverless/serverless/blob/master/README_CN.md)
> - 官网：[serverless.com](https://serverless.com/)

欢迎访问：[Serverless 中文网](https://serverlesscloud.cn/)，您可以在 [最佳实践](https://serverlesscloud.cn/best-practice) 里体验更多关于 Serverless 应用的开发！