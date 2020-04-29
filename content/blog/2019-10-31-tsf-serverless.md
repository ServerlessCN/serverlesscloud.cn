---
title: 腾讯全球数字生态大会，重磅发布 Serverless 微服务平台
description: 10月29日，在成都举办的腾讯全球数字生态大会城市峰会上，腾讯云重磅发布自研 PaaS 一站式开发平台 TSF Serverless，TSF Serverless 是 TSF 产品的重大升级，是 Serverless 架构和微服务平台的完美融合。
keywords: Serverless, Serverless微服务,TSF Serverless
date: 2019-10-31
thumbnail: https://serverlessimg-1253970226.cos.ap-chengdu.myqcloud.com/qianyi/images/YHl6UWa9s620pOhjwgmHGWLMP2kMEwnHDZchr86SibjNqbHLdcqSupQnFKcgQdCUhmLMXLrEfSQPTV64mT97Jibw.jpg
categories: 
  - news
authors: 
  - Serverless 中文网
authorslink: 
  - https://github.com/jiangliu5267
---

10月29日，在成都举办的腾讯全球数字生态大会城市峰会上，腾讯云重磅发布自研 PaaS 一站式开发平台 TSF Serverless，TSF Serverless 是 TSF 产品的重大升级，是 Serverless 架构和微服务平台的完美融合。

**TSF 是什么？**

TSF 是腾讯云打造的微服务解决方案，提供一站式应用全生命周期管理能力和数据化运营支持，并提供多维度应用和服务的监控数据，助力服务性能优化。

TSF 提供的核心能力包括：服务治理，应用生命周期管理，配置中心，分布式事务，数据化运营能力（日志 / 监控 / 告警 / 调用链等）。

**TSF 技术演进**

17 年 Service Mesh 开源框架 Istio 发布，TSF 在早期就尝试使用，18 年 Istio 发布 1.0 版本，TSF 迅速跟进，推出了自己的 Service Mesh 服务 TSF Mesh 2.0. 总的来说，TSF 在技术上的发展追求的是和业界微服务的主流技术同步，同时在这些技术基础上做了一些创新，团队也一直在探索新技术的落地和应用。

TSF 的容器服务基于腾讯云 TKE 容器 PaaS 平台，TKE 是腾讯云研发的基于 Docker 和 Kubernetes 的公有云 PaaS 平台，提供了完整的 Kubernetes 集群部署能力。

虚拟机环境下，官方的 Istio 并不支持虚拟机，TSF 对官方版本进行了扩展，以提供更多功能，包括平台解耦、新旧兼容、多租户管理隔离和管理支持等能力。

为了进一步帮助企业简化开发流程、降低运维开销以及资源成本，2019年，TSF在平台探索落地Serverless技术，发布TSF Serverless微服务平台，向企业提供TSF Serverless最佳实践。

TSF 适用于想开发微服务，以及进行微服务改造的用户。目前，已有财付通网贷、零售业务中台、汽车物联网等解决方案，另 TSF 已经帮助光大银行、海关总署、广汽等企业在 TSF 上落地了后台系统，使用了微服务前沿技术。

**TSF Serverless**

Serverless微服务平台（Tencent Service Framework Serverless，TSF Serverless），是面向应用和微服务的高性能 Serverless 平台，用户无需学习复杂的服务器、容器管理、运维技术，就可以迅速把应用创建和运行起来；此外，用户无需提前为业务峰值准备资源，按需使用、按量计费，精益成本。

从微服务的角度来看，我们拥抱 Spring Cloud 和 Service Mesh 开源社区，为用户提供高可用、可扩展、灵活的微服务技术中台商业版支持，提供应用全生命周期管理、细粒度微服务治理等能力。

TSF Serverless 兼具微服务和 Serverless 的能力和优势，帮助开发者、企业更低成本、高效可靠地实现核心业务的生产应用。

更多 TSF Serverless 产品介绍：

https://cloud.tencent.com/product/tsf-serverless

**01.平台特性**


- 应用托管

通用的应用托管平台，支持 Express、Koa 等丰富的 Web 框架以及 Spring Cloud、Service Mesh 微服务框架，无需改造业务代码，核心业务平滑上云。

- 精益成本

无需提前为业务峰值准备资源，平台自动根据请求和负载弹性扩缩容免去手动增减机器的运维烦恼，按需使用、按量计费，无需为闲置资源付费。

- 微服务中台

强大的微服务平台，提供应用全生命周期管理、细粒度微服务治理（服务路由、服务限流、服务鉴权规则，分布式配置管理），以及分布式事务等能力。

**02.使用场景**

- Web服务

TSF Serverless 和其他腾讯云云服务紧密结合，开发者能够轻松构建可弹性扩展的移动或 Web 应用程序、小程序应用、BFF（Backend For Frontend）应用。

- 分布式系统

TSF Serverless 帮助用户屏蔽底层资源购买和运维细节，低门槛部署微服务应用，让企业聚焦核心业务本身。