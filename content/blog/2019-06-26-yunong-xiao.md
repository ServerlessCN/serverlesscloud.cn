---
title: 腾讯云 Yunong Xiao：无服务逐渐开始承载起企业核心业务
description: "据调查报告显示，无服务器架构市场规模在2018年达到42.5亿美元，预计在2023年将达到149.3亿美元，复合年增长率将达29％。成本和效率两大原因促使无服务器架构的市场规模正在快速增长，并将成为下一代云计算服务的主流形态。"
keywords: Serverless,serverless framework,腾讯云serverless
date: 2019-06-26
thumbnail: https://img.serverlesscloud.cn/qianyi/YHl6UWa9s62GasZ6EWHCL6LnQ46tI0n5D1ictQicvlGSBB6joOA3GjLI0hlZfTAyum1xicGf4HbCuKKibzm1crWb9A.jpg
categories:
  - news
authors:
  - Yunong Xiao
authorslink:
  - https://zhuanlan.zhihu.com/ServerlessGo
tags:
  - 核心业务
  - Serverless
---

据调查报告显示，无服务器架构市场规模在2018年达到42.5亿美元，预计在2023年将达到149.3亿美元，复合年增长率将达29％。成本和效率两大原因促使无服务器架构的市场规模正在快速增长，并将成为下一代云计算服务的主流形态。

6月24日，在上海召开的KubeCon 2019大会上，腾讯云技术总监Yunong Xiao发表了《Back From the Future: A Time Traveler's Take on Serverless》的演讲主题。**他表示：Serverless带来了成本和效率的改变，无服务的产品和生态正走向成熟，并逐步承载起企业核心业务。**

![](https://img.serverlesscloud.cn/qianyi/YHl6UWa9s62GasZ6EWHCL6LnQ46tI0n5D1ictQicvlGSBB6joOA3GjLI0hlZfTAyum1xicGf4HbCuKKibzm1crWb9A.jpg)

Serverless服务帮助用户从繁冗的开发配置工作中解放出来，没有任何的基础设施建设、管理与运维开销，开发者仅需关注业务代码逻辑的编写，这种模服务式能够极大降低研发门槛，并提升业务构建效率，获得了大量企业和开发者的支持。

Serverless无疑是下一代云计算服务形态的趋势，但当前复杂的企业业务系统并不能完全基于无服务来实现，我们分析主要有以下几方面的原因：

1. 性能问题。目前无服务尚未完全成熟，在性能方面仍存在诸多问题，如同步业务的冷启动延时、高并发的函数实例扩缩容，大规模业务下函数实例的集群管理等
2. 缺乏成熟的开发者生态。企业和研发采用无服务，需要用监控、Debug调试、DevOps等上下游的支持；
3. 需要理解和管理底层的基础设施。当前Serverless架构下，客户依然会感知到无服务器集群和资源的存在。

作为继虚拟机、容器后的第三代通用计算平台，无服务器架构是腾讯云原生的重点发力领域。针对目前行业遇到的问题，腾讯云持续探索研究，并发布了下一代无服务器计算平台：Severless 2.0，Severless 2.0在已有的事件触发函数的基础之上，根据实际的用户使用场景，进一步提供了面向 HTTP 场景的 HTTP Function 和 HTTP Service，提供了高层次的通用开发框架，不仅更好的支持开发者面向 Web Service 的开发诉求，也可以支持已有业务代码向 Serverless 架构的无缝迁移。

在技术上，我们在控制流和数据流的模块、虚拟化层、网络层、调度层都做了彻底的重构优化，在安全，可用性，性能上也进行了全面升级。通用统一的底层架构通过采用轻量级虚拟化技术、VPC proxy转发方案等多种优化手段，以及针对实时自动扩缩容核心的能力优化，彻底规避了传统无服务器架构中，饱受诟病的冷启动问题。

除此之外，Severless 2.0还关注开发者从本地开发、代码调试、到业务的持续集成、上线运维等整个软件开发生命周期。围绕着 Serverless 产品，腾讯云构建了全面的开发支持、DevOps、运维监控等能力，协助开发者可以更好的向 Serverless 架构迁移，为Serverless承载起企业核心业务奠定基石。

去年腾讯云团队与微信小程序进行了深度合作，推出了小程序云开发Serverless服务，帮助企业和开发者快速构建小程序核心应用。我们相信，随着Serveless 2.0的发展，无服务不仅可以逐渐承载起企业核心业务，并且能帮助打通监控、Debug调试、DevOps等上下游生态，助力互联网和传统企业业务的快速建设与迭代。



> **传送门：**
> - GitHub: [github.com/serverless](https://github.com/serverless/serverless/blob/master/README_CN.md) 
> - 官网：[serverless.com](https://serverless.com/)

欢迎访问：[Serverless 中文网](https://serverlesscloud.cn/)，您可以在 [最佳实践](https://serverlesscloud.cn/best-practice) 里体验更多关于 Serverless 应用的开发！
