---
title: "Serverless Component 是什么，我怎样使用它？"
description: "Serverless Component 介绍和使用指南"
keywords: Serverless 使用指南,Serverless Component介绍,Serverless Component使用
date: 2018-04-25
thumbnail: "https://img.serverlesscloud.cn/20191213/1576236926383-serverless-components.gif"
categories:
  - news
  - guides-and-tutorials
authors:
  - BrianNeisler
authorslink:
  - https://serverless.com/author/brianneisler/
translators: 
  - Tinafangkunding
translatorslink: 
  - http://github.com/tinafangkunding/
tags:
  - Component
  - Serverless
---

## Serverless Components 的目标是什么？

我们希望通过 Serverless Components 让广大开发者更加便捷，平滑的联动云厂商提供的种种服务。

当前，构建一个应用意味着你可以挑选种种 SaaS 服务并且管理他们（例如 serverless 服务），之后将其整合为一个适用的解决方案。这很棒，因为这样做更快并且开销更小。

但这样的做法也会十分复杂。为了将这些服务整合在一起，你需要大量的手工配置，并且当前没有很多工具可以帮你来构建和管理自己的应用架构。

## 初识 Serverless Components 

[Serverless Components](https://github.com/serverless/components) 目标就是改变当前开发者面对的这一切。

针对各个云厂商/SaaS 厂商的基础服务，Components 提供了编排这些资源和业务代码的统一标准。就像乐高积木一样，你可以使用多个 Components 非常轻松的搭建你的应用。

Serverless Components 还提供了完善的，由社区贡献驱动的开发者生态。你可以很方便的浏览和优化这些 Components。最终的结果就是你可以极大的节省开发时间，不需要从头开始构建你的 Full Stack 应用，取而代之的是可以利用已有的组件快速构建并按自己的需求调整。

## Serverless Components 运行机制 

接下来让我们来看一下，怎样使用 Serverless Components 来快速构建一个完整的 Serverless 应用。

### 统一的体验

所有的云服务都可以被封装为一个 Serverless Component。

每个 Component 都支持对相应云服务的创建，回滚和移除操作，这些都可以通过 [Serverless Components CLI](https://github.com/serverless/components) 实现。

开发者只需要配置 Components 提供该服务所需的最少配置，其余的都会采用默认配置的方式提供。这样可以更方便的创建对应的资源。引用一个 Component 的时候，只需要在 `serverless.yml` 文件中增加 “components” 属性，并且引用这个 Component，如图所示。

![serverless components](https://img.serverlesscloud.cn/20191212/1576154026283-yaml0.png)

如上所示，可以通过运行 `serverless` 命令来创建一个对象存储的存储桶资源。

### 组合更高维度的 Components

假设你希望在腾讯云部署一个基于 Serverless 架构的 Express.js 框架。为了完成这个框架的搭建，你需要在 API 网关服务中创建新的 API ，并且用这个 API 来调用云函数服务；为了完成基本的数据操作，还需要创建、连接并且调用数据库服务（假设为 PostgreSQL ）进行增删改查。

[我们当前支持了该框架所需的所有 Components ](https://github.com/serverless-components/)。每个组件都可以通过十分简单参数进行配置，你可以根据这些配置编排底层对应的云资源，并且快速、方便的进行服务的部署。

所有的 Serverless Components 都可以结合在一起，并且构成一个更大、功能更丰富的 Component。

我们把这三个基础的 Components (PostgreSQL、API Gateway、SCF）组合起来构造一个 Express.js 的框架，并且他们将组成一个新的、更高维度的 Express Component。如图所示，这些配置也都会在 `serverless.yml` 文件中体现。

![serverless components](https://img.serverlesscloud.cn/20191212/1576151252404-yaml2.png)

根据这张图可以看出 Components 的价值。当你构建一个 Express 框架的时候，你需要做很多准备工作，需要开通、配置很多产品，比如创建函数，配置 REST API，配置和连接 DB等。

但事实上你可以通过抽象这些基础 Components 来节省很多类似的配置工作，并且 Express.js 这些框架组件可以使用很多默认配置进行部署，并且只暴露最简单的，面向业务的配置项。

![serverless components](https://img.serverlesscloud.cn/20191212/1576152599672-yaml4.png)

此外，你还可以在其他项目中复用这个 Express Component。或者其他的开发者也可以在自己的项目中使用它，并且只需要根据自己的业务简单调整下配置。例如，他们可能会修改 REST API 的路径或者支持的协议等。

![serverless components](https://img.serverlesscloud.cn/20191212/1576152619839-yaml5.png)

最终，这些更高维度的 Components 变成来各种常用场景，可以被开发者快速使用并且复用、整合。

### 组合 Components 构建整个应用

现在让我们从更加宏观的角度来看这个 Express 框架。当你希望部署整个应用的时候，需求会变得更加复杂和全面。例如你需要对动态资源和静态资源做隔离，优化页面的访问速度，提供更丰富的 API 等。

别担心，你依然可以利用 Serverless Components 进一步扩展和完善你的应用。只需要把这个高维度的 Component 和更多其他 Components 组合，就可以构建更加完整的应用。如下图所示，一个完整的 Full-Stack 应用可以通过持续组合 Serverless Components 实现。

![serverless components](https://img.serverlesscloud.cn/20191212/1576151240859-yaml3.png)

像所有其他的 Components 一样，其他开发者也可以轻松的复用这个 Full-Stack 组件，并且只需要暴露出最简单的配置信息。

**我们认为 Serverless 是围绕场景的，无需对基础资源做过多对配置和管理。我们希望 Components 可以让基础设施对开发者更加透明，开发者可以专注于业务逻辑和场景，并且通过开源社区的方式，让这些场景可共享、可复用，同时进一步促进开发者生态。**

## 准备好体验 Serverless Components 了吗?

刚刚我们演示了一个全栈应用的部署方式，如果你希望进一步了解 Components, 欢迎访问 [Serverless Components](https://github.com/serverless/components) 的 Github 主页，并且查看当前支持的场景[模板](https://github.com/serverless/components/tree/master/templates)。

我们当前提供了几种基础 Components，你可以灵活组合他们，并且创建自己所需的高维度的应用场景。我们十分欢迎对 [Serverless Components 仓库](https://github.com/serverless-components/) 的开源贡献，也非常期待开发者的建议和反馈！

如果你对 Serverless Components 感兴趣，这里有一些实践文章可以进一步参考：
- [通过 SCF Component 轻松构建 REST API](https://serverlesscloud.cn/best-practice/2019-12-3-Easy-to-build-REST-API) 
- [基于 Serverless Component 全栈解决方案](https://serverlesscloud.cn/best-practice/2019-12-5-Full-stack-solution-based-on-serverless-component) 
- [Hexo + Serverless Framework，简单三步搭建你的个人博客](https://serverlesscloud.cn/best-practice/2019-12-4-Quickly-build-personal-blog) 

当前 Serverless Component 也支持多语言开发框架的快速部署，可以移步[组件](https://serverlesscloud.cn/component)页面进一步查看：

[![serverless components](https://img.serverlesscloud.cn/20191213/1576236739852-Component%20Gallery.png)](https://serverlesscloud.cn/component)

### Serverless Components 的下一步规划

我们相信 Components 可以带来非常理想的 Serverless 开发体验，并且我们计划将该能力和当前的 [Serverless Framework](https://github.com/serverless/serverless) 整合在一起。此外，我们计划提供公共的 Components 注册中心，通过该能力，开发者可以更加迅速的进行部署，并且也更方便进行版本管理和团队协作。