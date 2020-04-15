---
title: 腾讯云一口气发布四大新品，云原生时代真的来了！
description: "6月25日，在上海召开的 KubeCon 2019大会上，腾讯云正式发布了多款云原生技术产品：企业级容器服务平台TKE、容器服务网格 TKE Mesh、Serverless 2.0、一站式 DevOps 平台。"
keywords: Serverless,云原生,Serverless FaaS
date: 2019-06-25
thumbnail: https://img.serverlesscloud.cn/2020414/1586870528612-%E5%B0%81%E9%9D%A2%E5%9B%BE.png
categories:
  - news
authors:
  - 腾讯云
authorslink:
  - https://zhuanlan.zhihu.com/ServerlessGo
---

云原生时代真的来了。

6月25日，在上海召开的KubeCon 2019大会上，腾讯云正式发布了多款云原生技术产品：**企业级容器服务平台TKE、容器服务网格TKE Mesh、Serverless 2.0、一站式DevOps平台。**

![](https://img.serverlesscloud.cn/qianyi/67ufDnLOiaDTHuQ6ib2EuK01shrQ4xVR3iaqpFoZ1m0SyHXIPoOA6l8f89VHHIibyMhrbHMjsibTjFPHPOoocNXmMgg.jpg)

腾讯云副总裁 刘颖

将来，云原生技术将帮助企业从写入第一行代码开始，再到完成开发、部署、运维等工作，全面利用云计算的弹性伸缩、按需使用的优势，在环境、技术、能力方面均为云端充分准备：

**企业级容器云平台TKE: 快速构建私有化容器平台**

资源调度、应用快速部署、上线，是云原生的重头戏。

基于成熟的Kubernetes技术和生态，**TKE（Tencent Kubernetes Engine ）**能够帮助企业快速构建自身的私有化容器管理平台。

这不仅能让企业采用**与腾讯公有云容器服务一致**的架构和管理模式，还能打通云上的容器服务，获得一致的管理体验，实现混合云部署。

此外，我们还充分借鉴了微信、QQ、游戏等重量级业务在容器方面的经验，**提供GPU虚拟化、TAPP应用管理、离线混部技术**等能力，让TKE企业版变得更强大。

**容器服务网格TKE Mesh：构建全链路的观测能力**

部署上线成功后，接下来的应用治理和运维环节，你可以交给TKE Mesh。

![](https://img.serverlesscloud.cn/qianyi/67ufDnLOiaDTHuQ6ib2EuK01shrQ4xVR3iaicjagt9OOnLdTVsyBUKib45JZm2wvvpzXH2icvjPGlQWPtJNgVxgZkzPA.jpg)

这款产品整合了TKE及腾讯云上负载均衡、云监控等能力，几乎是一款**“开箱即用”的云原生服务网络管控平台**：

- **对业务开发透明：**让用户对访问请求进行灵活控制、对调用链路进行全局展示，对服务质量进行全面监测；
- **非侵入性的服务连接方式：**将微服务化的门槛降到最低，让开发者更专注于业务价值的实现；
- **多层级全链路观测能力：**TKE Mesh提供的服务可观测性，可实现故障的快速定位及恢复；

好消息是，TKE Mesh现已接受内测申请！

**Severless 2.0：下一代无服务器计算平台**

![](https://img.serverlesscloud.cn/qianyi/67ufDnLOiaDTHuQ6ib2EuK01shrQ4xVR3iaZDmmfy24bBDRZLuF0RbI5MiaYCibw9Uzqko4w86TfezzxsMJmAia9OqGQ.jpg)

无服务器架构领域，将会是云原生的重点发力对象。全新一代的腾讯云 Serverless2.0，已经具备承载核心互联网应用的能力。

它提供了面向 http 场景的 http function 和 http service，以及高层次的通用开发框架，良好支持开发者面向 web service 的开发诉求。

在技术上，通用统一的底层架构通过采用**轻量级虚拟化技术、VPC proxy转发方案**等多种优化手段，以及针对实时自动扩缩容核心的能力优化，彻底规避了传统无服务器架构中饱受诟病的冷启动问题。

除此之外，Severless2.0还关注开发者从本地开发、代码调试到业务的持续集成、上线运维等整个软件开发生命周期。围绕着 Serverless 产品，腾讯云构建了全面的开发支持、DevOps、运维监控等能力。

**一站式Devops平台：满足开发到交付的一切所需**

最后，是所有人都关心的效率问题：**云原生时代，我们能否提升开发的幸福感？**

答案是肯定的。在大会现场，腾讯云正式宣布**一站式开发运维CODING 2.0**即将正式上线，这也是腾讯云和CODING团队合作的阶段性成果。

CODING 2.0涵盖了软件开发从构想到交付的一切所需。包含项目管理、代码版本管理、持续集成、制品库管理等工具，协助软件研发团队实践敏捷开发与运维，提升软件交付质量与速度。

![](https://img.serverlesscloud.cn/qianyi/67ufDnLOiaDTHuQ6ib2EuK01shrQ4xVR3iaw82T9yTcyka7Y6DBJ3rk33sBETCp8dAOjP7aAUNYdsEFQGZ8G9GBSg.jpg)

值得一提的是，CODING 2.0 还支持轻量级的持续部署，当个人开发者进行 HTML 小游戏的开发时，仅需更新代码游戏，无需担心部署及运维。

看完这些，你最期待用上哪个技能包？

> **传送门：**
> - GitHub: [github.com/serverless](https://github.com/serverless/serverless/blob/master/README_CN.md) 
> - 官网：[serverless.com](https://serverless.com/)

欢迎访问：[Serverless 中文网](https://serverlesscloud.cn/)，您可以在 [最佳实践](https://serverlesscloud.cn/best-practice) 里体验更多关于 Serverless 应用的开发！
