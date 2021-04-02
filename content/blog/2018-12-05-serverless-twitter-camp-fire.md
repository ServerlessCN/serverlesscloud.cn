---
title: "Serverless Twitter 机器人帮助为坎普山火受灾者安置住房"
description: "加利福尼亚州的坎普山火致使数千人流离失所，为此，我构建了一个简单的 Serverless Twitter 机器人来帮助将受灾者安置在临时住房！"
date: 2018-12-05
thumbnail: 'https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/camp-fire/camp-fire-housing-thumb.jpg'
heroImage: 'https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/camp-fire/camp-fire-housing.jpg'
category:
  - guides-and-tutorials
  - user-stories
authors: 
  - EricWyne
authorslink:
  - https://serverless.com/author/ericwyne/
translators: 
  - Aceyclee
translatorslink: 
  - zhihu.com/people/Aceyclee
---

即使不住在北加州，您也肯定听说过迄今为止最具毁灭性的一场山火：坎普山火。这场山火蔓延到萨克拉门托北部，席卷天堂、康考和马加利亚等城镇。

我住在奇科，驱车只需二十分钟便可抵达天堂镇，那里的数千人在几个小时内便失去了家园。正因为很近，我亲眼目睹了山火的无情，感受到了受灾者的无助。他们当中的许多人正是我的朋友。

我想要尽我所能为提供帮助，而他们最需要的就是住房。

[nvpoa.org](https://www.nvpoa.org/) 创建了一个名为 [campfirehousing.org](https://www.campfirehousing.org/) 的网站，人们可以发布为受灾者提供临时住房的信息（如家中的空余卧室等）。这个网站的想法很棒，但缺少一些可以帮助受灾者更快找到住房的关键功能。

例如，当有新的住房发布时，人们没有办法得到通知，并且很难确定哪些住房仍然空置。寻找住处的人们很难看到哪些住房真正可用，并且不能在网站上发布新的住房时跳转到相应的位置。

所以我在想，不如添加一些代码，以便在有新的住房发布时立即通知受灾者！

####  Serverless Twitter 机器人

我决定创建一个基于 Serverless 的 Twitter 机器人，每当有人在 campfirehousing.org 中发布新的住房时，就通过机器人将消息推送出去。感兴趣的人可以在 Twitter 上关注这个机器人，这样他们便可以掌握新增的可用住房信息。

我选择使用 Serverless  后端来为这个应用提供支持，原因有两点：首先，Serverless 后端可以确保应用最快地投入使用，并为受灾者提供帮助；其次，也是最重要的，云函数提供免费额度，几乎可以肯定构建这个应用不会产生任何费用。

整个应用全部使用 Serverless Framework + 云函数 构建。从最初的研究到第一次成功推送，我仅用了两个小时就让整个项目运转起来了。

#### 构建机器人：只需一个函数

Campfirehousing.org 没有 RSS 源，因此我必须设置 CRON（[计划函数](https://serverless.com/framework/docs/providers/aws/events/schedule/)），这项函数每 5 分钟就会检查一次网站更新，并从 Google 表格中读取值。当有新房发布时，Twitter 机器人便将消息推送出去。

推送的消息包括价格、城市、可用日期、是否允许携带宠物等重要信息以及概要。我直接从 campfirehousing.org 抓取所有这些数据，并将全文截断为 280 个字符。

![](https://main.qcloudimg.com/raw/9a6b431fd1e796658b5963ac5f3b2bce.png)

总的来说，代码只是一个非常简单的函数；[单击此处查看](https://gist.github.com/ecwyne/0438408804cd6e1023ba381c4cb5efc9)，如果您需要，请随意使用！

您还可以在 [@CampFireHousing](https://twitter.com/CampFireHousing) 中找到完整的 Twitter 流。

#### 过程中遇到的各种挑战

整个项目中最难的部分，实际上是弄清楚如何处理日期。我是在太平洋标准时间 (PST) 的计算机本地工作，但当我在 AWS 中运行代码时，默认为格林尼治标准时间 (GMT)。

最后，我不得不将 Lambda 函数设置为假设在 PST 中运行，这样我才能在本地和云中获得相同的体验。

#### 向无服务器框架和开放源代码致敬

此类业余项目的工作经历使我意识到了开源社区的强大。

得益于开源项目的日期处理和快速推文集成，以及 Serverless fFramework 的便捷，我才能这么快地交付代码投入使用。例如，[serverless-plugin-typescript](https://github.com/prisma/serverless-plugin-typescript) 插件使得在 Lambda 中编写 TypeScript 函数变得超级简单。

我能想到这个项目，并且能够依靠这样的开源代码贡献来（比独自一人）更快、更轻松地实现整个项目简直太棒了！

#### 来自 Serverless 中文社区的结语

看到 Serverless 技术能够帮助人们构建为社区服务的应用，我们真的很高兴！

如果您也曾使用 Serverless 做过一些善事，请随时告知我们，我们会分享您的故事。希望您的代码也可以帮助其他人做同样的事情。

#opensourceforever
