---
title: 一图解读腾讯云 Serverless 2.0
description: "Severless 2.0 在已有的事件触发函数的基础之上，根据实际的用户使用场景，进一步提供了面向 HTTP 场景的 HTTP Function 和 HTTP Service，提供了高层次的通用开发框架，不仅更好的支持开发者面向 Web Service 的开发诉求，也可以支持已有业务代码向 Serverless 架构的无缝迁移"
keywords: Serverless,serverless framework,腾讯云serverless
date: 2019-07-09
thumbnail: https://img.serverlesscloud.cn/2020414/1586872053915-%E5%B0%81%E9%9D%A2%E5%9B%BE%20%282%29.png
categories:
  - guides-and-tutorials
authors:
  - 腾讯云中间件
authorslink:
  - https://zhuanlan.zhihu.com/ServerlessGo
tags:
  - 架构迁移
  - serverless
---

作为继虚拟机、容器后的第三代通用计算平台，无服务器架构是腾讯云原生的重点发力领域。针对目前行业遇到的问题，腾讯云持续探索研究，并发布了下一代无服务器计算平台：Severless 2.0，Severless 2.0在已有的事件触发函数的基础之上，根据实际的用户使用场景，进一步提供了面向 HTTP 场景的 HTTP Function 和 HTTP Service，提供了高层次的通用开发框架，不仅更好的支持开发者面向 Web Service 的开发诉求，也可以支持已有业务代码向 Serverless 架构的无缝迁移。

除此之外，Severless 2.0还关注开发者从本地开发、代码调试、到业务的持续集成、上线运维等整个软件开发生命周期。围绕着 Serverless 产品，腾讯云构建了全面的开发支持、DevOps、运维监控等能力，协助开发者可以更好的向 Serverless 架构迁移，为Serverless承载起企业核心业务奠定基石。

我们从产品价值、产品形态、应用方案、工具建设、技术架构和优势特性几个维度对Serverless 2.0进行了全面的梳理，帮助开发者更好的理解腾讯云Serverless 2.0的价值及应用。

![](https://img.serverlesscloud.cn/qianyi/YHl6UWa9s601O12HjmuLZssst8o5BoSmicBEOAJGSicOq2pw82tqAosbE8ibJXrR0riabxWRaMPkTdAoIG2Aw4Ycsw.jpg)

> **传送门：**
> - GitHub: [github.com/serverless](https://github.com/serverless/serverless/blob/master/README_CN.md) 
> - 官网：[serverless.com](https://serverless.com/)

欢迎访问：[Serverless 中文网](https://serverlesscloud.cn/)，您可以在 [最佳实践](https://serverlesscloud.cn/best-practice) 里体验更多关于 Serverless 应用的开发！
