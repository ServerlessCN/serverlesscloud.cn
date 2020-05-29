---
title: Serverless 如何帮助前端实现全栈？
description: 从 Web 1.0 开始，我们对前端领域的探索从未停止。Nodejs 的出现更是彻底而深刻的改变了 JavaScript 及前端开发工具的应用场景，那么身处大前端时代的我们，该如何真正由前端转向全栈呢？
keywords: Serverless, Serverless前端开发, Serverless全栈
date: 2019-10-21
thumbnail: https://img.serverlesscloud.cn/qianyi/images/YHl6UWa9s63icwfPNdpmT5N3Mas5icFEDQKNAJkwVpLm930RxFmIR7UTGh5anQFCUiam1T5Y8RRbnvaicGj8icGZzvw.jpg
categories: 
  - news
authors: 
  - Serverless 中文网
authorslink: 
  - https://github.com/jiangliu5267
tags:
  - 全栈应用
  - 云函数
---

从 Web 1.0 开始，我们对前端领域的探索从未停止。Nodejs 的出现更是彻底而深刻的改变了JavaScript 及前端开发工具的应用场景，那么身处大前端时代的我们，该如何真正由前端转向全栈呢？

![Serverless](https://img.serverlesscloud.cn/qianyi/images/YHl6UWa9s63icwfPNdpmT5N3Mas5icFEDQKNAJkwVpLm930RxFmIR7UTGh5anQFCUiam1T5Y8RRbnvaicGj8icGZzvw.jpg)

2019年10月20日，JSConf大会上，腾讯云中间件总经理 Yunong Xiao 发表了关于《Serverless Is Your BFF》主题演讲，从前端发展演进、前端到全栈的路径和问题以及如何利用Severless 实现前端到全栈的发展等维度展开分享，并现场配合Live Code演示，深度剖析前端工程师向全栈演进面临的困境和解决思路。

**前端发展的变革**

在 Web1.0 时代我们只有Web工程师，需要我们做界面，并关注于 Web 服务器，后端逻辑，数据库。

![Serverless](https://img.serverlesscloud.cn/qianyi/images/YHl6UWa9s63icwfPNdpmT5N3Mas5icFEDQ9fbmhNmjTicM2geibhMhGh7w4tkOQNp4SfEmsR4ia8iaq2Xqj3XLuMfvyw.jpg)

Web2.0 导致了前后端分工的细化，前端后端各自关注不同的东西。


分离后，前端迅猛发展，在组件化和脚手架工具链方面发展的很好，现在的前端效果很好，效率也很高，基本是现代化和工业化的开发方式。

但是分离也导致了很多问题，其中最主要的问题就是：

**前端后端的沟通和配合效率很低。**例如一个接口要前后端不同的角色反复确认。联调的效率及其低效。

为了提升业务研发效率，前端工程师希望能够回到之前Web全栈工程师的角色。

**全栈工程师的一个定义：**

前端+后端+数据库的统一集合开发

一些前端工程师认为：除了前端技能，再掌握一门后端语言（例如：php/python/nodejs），再会一种数据库，就是全栈工程师了。

这种认识是非常局限的，因为掌握了上面的这些，虽然可以完成全部界面和业务逻辑的研发，对于产品来说，除了这些还有很多看不见的东西。

除了技术栈，前端在实现一个产品时还需要什么？

首先，我们可以通过一个idea到产品的记录路径，来引出Time to Market 的三个步骤：


1、界面和功能研发


在前端有足够好的框架和工具，可以快速实现UI和功能。使用Nodejs后端无编码障碍，同一种语言提升复用。省去沟通成本，整体开发效率更高。

结论：前端独揽界面和功能研发没有问题，效率更高

2、产品化 —— 那些看不见却很重要的问题

产品化的思维不是一个个单点的技术，而是一个套系统性思考和解决方案，依赖合理高效的应用架构设计来支撑。包括可靠性、速度性能、安全性、架构可扩展性等一些系统层面考虑。

我们可以来看一张很普通的系统架构图，术业有专攻，小编相信不少前端开发者看到这步的时候已经心生退意：

![Serverless](https://img.serverlesscloud.cn/qianyi/images/YHl6UWa9s63icwfPNdpmT5N3Mas5icFEDQptMOSdxicWgdHynwU8FYFtBBj5SXHZRLzPvnVibawiaH7ibLUxZyereHrA.jpg)

结论：以前端工程师目前的能力，很难纵览全局


3、运维 —— 上线只是开始，对于产品来说，保证稳定运行工作很多在上线之后

业务增长带来的扩容。问题是永远不知道什么时候会增长，有的网红APP一两周就火爆了，如果扩容搞不定会错失大机会


流量的分布并不是均匀的，可能一天大部分的时候流量都很低，但是在访问高峰期（例如晚上的小说访问量，大部分人喜欢在睡前看小说）会带来突然的陡峰。还有一些是精心设计的流量高峰，比如秒杀抢购运营活动。

如何解决这些场景下的快速扩容问题呢？

1. 预购资源 —— 成本太高，大量的投入被浪费，并不是明智的做法；
2. auto scaling 技术 —— 相信很多朋友会提到这个，但是这个需要很多云计算的知识背景，对于前端来说并不具备这种技术储备。

认真负责的说，上云真不是一件简单的事情，现在各种企业上云，但真把现有的软件和应用搬到云上，无论是公有云还是私有云，都不是一件简单的事情。

可能你需要上云的代码只有100行，但是上云却需要你看完CVM/容器/K8S各种基础书籍。

结论：以前端工程师目前的能力，很难进行系统的运维工作 —— 当然我们也不会想做。

Serverless 在前端领域的变革

总结而言，前端转全栈不仅需要解决界面和功能的研发，还有产品化之下的安全可靠、架构扩展，以及上线后繁琐的运维等问题。那么Serverless是如何解决这些问题呢？我们在谈Serverless之前，首先来看看Serverless到底是什么，它是如何帮助我们从前端入手更好的跨度到全栈。

![Serverless](https://img.serverlesscloud.cn/qianyi/images/YHl6UWa9s63icwfPNdpmT5N3Mas5icFEDQ9ftnqBCTvDMlPWvQrCtQy9xNpQKHTwZP8dojKruIQ7z7kJLEFnJ1Mg.jpg)

1、Serverless 是什么？

这个问题，我们从上图中就可以得到答案，从IaaS，PaaS到如今的 FaaS，我们负责的组件越来越少，人力成本也相对越来越低。而我们的 Serverless 更像是 FaaS 和 BaaS 的集合。我们无需关注上面提到的可靠性，安全性，容灾，扩容等系统层级的问题，只需要关注我们的代码实现。

2、Serverless的核心优势


总得来说，Serverless有三大特点：**提高效率，降低成本，稳定性提升**。

Serverless 不需要运维，节省人力成本。提升效率，减少了开发的时间，就是降低成本。工程师可以有时间去做更有意义的事情。弹性付费，按需付费，按执行时间付费，只为真正的计算买单。

并且可以使后端架构简化，大大减少出错的概率，腾讯云将负责解决大部分运维问题，更加便捷高效。

Serverless 更像是前端领域的引擎，它可以帮助我们前端工程师快速，便捷，可靠的开发应用，并将大幅度降低人力成本。

**案例实战**

最后，百闻不如一试，大会现场，腾讯云技术专家王俊杰现场通过Code演示，展示了如何在5min内基于 Serverless 制作之前大热的一款微信换头像应用。感兴趣的同学可以亲自动手尝试Serverless 的魅力。

![Serverless](https://img.serverlesscloud.cn/qianyi/images/YHl6UWa9s63icwfPNdpmT5N3Mas5icFEDQyZ7bh4w34LaAJ7WAWn6kiahlDs0OjBlezz9A1BytpmB3azqtF8yPBIg.jpg)

在这个 Demo 中，我们基于腾讯云Serverless ，结合腾讯云的AI能力，实现了一个自动为上传的头像戴上圣诞帽的应用。这个应用的实现只需要六个步骤：

![Serverless](https://img.serverlesscloud.cn/qianyi/images/YHl6UWa9s63icwfPNdpmT5N3Mas5icFEDQbw36zxgibxLvibiayW4776DRibmRtuqHmPDaskwgQ7C68dr26Jwd0k420Q.jpg)

1、将腾讯云的云 api 秘钥，填充至 server/wearChristmasHat/config.js  中

（源码下载请扫描下方的 Github 二维码链接）；

2、进到 wearChristmasHat 这个文件夹，npm run deploy:install 安装依赖；

3、使用vscode插件，或者scf cli，部署 wearChristmasHat 到 scf，同时去腾讯云apigw控制台开启该函数的api网关触发器的 支持cors 的开关；

4、修改 web/index.js 的ajax请求的url 为你的 api 网关触发器的访问路径；

5、web 部分的静态资源，html、css和js等，可以根据你的习惯，部署到 cos或者在本地打开；

6、访问html页面后，就可以选择一张人像图片，点击Generating a Christmas hat的按钮，戴上圣诞帽了。
