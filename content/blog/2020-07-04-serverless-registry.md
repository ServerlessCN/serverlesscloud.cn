---
title: 回顾 | Serverless Registry 设计解读与实战
description: Serverless Registry 究竟是怎样的一款产品，为我们解决了哪些用户痛点呢？
keywords:  Serverless, Serverless Registry, Serverless网关,
date: 2020-07-04
thumbnail: https://img.serverlesscloud.cn/202073/1593778055211-Registry.jpg
categories: 
  - news
authors: 
  - 杜佳辰
authorslink: 
  - https://github.com/Jiachen0417
tags:
  - Registry
  - Meetup
---

在 6 月 19 日的 ServerlessDays China 大会中，Serverless 发布了一款全新的产品： Serverless Registry，它究竟是怎样的一款产品，为我们解决了哪些用户痛点呢？ 接下来将为大家进行具体解读。

## 一、设计理念

相信大家对 Serverless 的组件化开发流程都不算陌生了，但作为开发者，在使用 Serverless 组件进行项目开发时，各位可能会遇到这样的疑惑：
- Serverless 目前究竟支持哪些组件？
- 除了跳到官网查看文档，有没有其更快捷的方法了解各组件的基本信息？
- 我开发了自己的组件模版后，应该如何分享给他人进行复用？

面对用户的使用痛点，我们希望设计一款组件模版管理产品，它可以：

1. 支持组件或模版的可视化展示与查询，方便用户快速定位目标模版并进行部署；
2. 支持查看组件或模版的详细信息，使用说明，并提供源代码下载路径，保证整个使用流程的透明化；
3. 支持组件的共享与复用，所有上传后的组件模版都是公开的，打造开源生态的 Serverless 模版仓库。

基于这些目标，Serverless Framework 的可视化模版仓库 Serverless Registry 应运而生。

## 二、功能简介

Serverless Regsitry 的基本功能很简洁，主要为以下两点：

![serverless](https://img.serverlesscloud.cn/202072/1593697090121-0%5B1%5D%20%284%29.png)

1. 组件模版的发布上传

在腾讯云官方的文档中已经为大家介绍了组件开发流程规范，作为开发者，用户可以基于官方流程，自主开发组件或模版，通过 Serverless Framework CLI，将其发布到 Registry 上，所有发布到 Registry 的项目均支持复用，其中优秀的项目会作为推荐模版，显示到 Registry 官网上，增加宣传和曝光度。

2. 组件模版的复用

对于组件模版的使用者而言，用户通过 Registry 官网或者 Serverless Framework CLI，都可以快速获取到组件或者模版的信息，并支持项目源代码的下载复用，完成项目的快速部署，操作流程简单方便，对于新手来说也会十分友好。

### Registry 官网介绍

页面目前有三个入口：

1. 直接输入 https://registry.serverless.com/  
2. serverless 中文网「模版仓库」模块进入 
3. Dashboard 控制台

您可以根据使用习惯来进入 Registry 的页面 

![serverless](https://img.serverlesscloud.cn/202072/1593697088766-0%5B1%5D%20%284%29.png)

进入页面后，看到整个界面是非常清晰，您可以迅速掌握目前支持的组件列表以及组件的基本信息。

![serverless](https://img.serverlesscloud.cn/202072/1593697088737-0%5B1%5D%20%284%29.png)

当组件过多的时候，可以通过搜索栏迅速找到您想使用的组件，目前支持组件名称、标签、简介等多个关键词搜索。

![serverless](https://img.serverlesscloud.cn/202072/1593697088844-0%5B1%5D%20%284%29.png)

点开组件详情页，可以看到该组件的全部信息，顶部标签栏介绍了组件的版本、作者、发布日期等基本信息，介绍页具体介绍了组件的产品特性和使用教程，哪怕您对该组件并不了解，也可以通过详情页基本掌握组件的信息和使用方法，对于新手来说是非常友好的部署体验。

![serverless](https://img.serverlesscloud.cn/202072/1593697709781-0%5B1%5D.png)

除此之外，部分组件已经支持一键部署，点击按钮后，直接跳转到 Dashboard 控制台，快速部署一个组件模版。

## 三、有奖实战部署

1. 部署 Case：基于腾讯云 Serverless Registry 快速部署 OCR 的文字识别应用。
- 源码教程：https://github.com/serverless-components/tencent-examples/tree/master/ocr-app

2. 部署福利：

  a. 前 30 名部署成功者可领取腾讯云计算器笔记本一个，30~100 名部署成功者可领取 50 元腾讯云云函数无门槛代金券一张。

  b. 成功提交一个有效 issue，可领取云函数 30 元无门槛代金券一张。issue 提交地址：https://github.com/serverless/serverless/issues

3. 福利领取方式：

成功部署后，点击链接：http://u6uvxlniyxhd4qgj.mikecrm.com/fMWq2Um, 进入礼品领取信息收集表，填写提交相关信息，Serverless 小助手（微信号：serverless_helper）会统一审核并安排礼品发送。

4. 活动截止时间：7 月 5 日 24:00

欢迎大家基于腾讯云 Serverless Regsitry 部署以上 Case，部署完成并提交信息者，小助手审核通过后将为您发放相应礼品。也鼓励各位开发者积极贡献您自己的的优秀模版组件，如果对 Registry 有任何疑问或者改进建议，您可以联系 Serverless 小助手（微信号：serverless_helper）进群，我们会在交流群及时交流、回复。

## 四、往期回顾

- [Tencent Serverless Hours 第一期线上分享会回放](https://cloud.tencent.com/edu/learning/live-2437)
- [Tencent Serverless Hours 第二期线上分享会回放](https://cloud.tencent.com/edu/learning/live-2480)
- [Tencent Serverless Hours 第三期线上分享会回放](https://cloud.tencent.com/edu/learning/live-2564)


---
<div id='scf-deploy-iframe-or-md'></div>

---

> **传送门：**
> - GitHub: [github.com/serverless](https://github.com/serverless/serverless/blob/master/README_CN.md)
> - 官网：[serverless.com](https://serverless.com/)

欢迎访问：[Serverless 中文网](https://serverlesscloud.cn/)，您可以在 [最佳实践](https://serverlesscloud.cn/best-practice) 里体验更多关于 Serverless 应用的开发！

