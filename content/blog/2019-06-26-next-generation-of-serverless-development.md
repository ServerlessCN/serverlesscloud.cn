---
title: 下一代无服务器的发展形态：Serverless2.0
description: "本文将以 Serverless 的概念、发展、形态、应用及优劣对比展开，进一步介绍腾讯云针对 Serverless 2.0 的形态演进以及发展思考"
keywords: Serverless,serverless framework,腾讯云serverless
date: 2019-06-26
thumbnail: https://img.serverlesscloud.cn/qianyi/YHl6UWa9s62GasZ6EWHCL6LnQ46tI0n5F1Rib8wwmicBP7VpxMUzv5uaYGtfRI7iblC3peiaGg9zPjUl6ZxPhibEd1A.jpg
categories:
  - news
authors:
  - 黄文俊
authorslink:
  - https://zhuanlan.zhihu.com/ServerlessGo
tags:
  - 无服务器
  - Serverless
---
6月25日，在上海召开的KubeCon 2019大会上，腾讯云重磅发布了下一代无服务器的发展形态：Serverless2.0。本文将以 Serverless 的概念、发展、形态、应用及优劣对比展开，进一步介绍腾讯云针对 Serverless 2.0 的形态演进以及发展思考。

_注：文章内容整理自腾讯云高级产品经理黄文俊在KubeCon 2019 上的演讲，演讲主题为《下一代无服务器的发展形态：Serverless2.0》_

![](https://img.serverlesscloud.cn/qianyi/YHl6UWa9s62GasZ6EWHCL6LnQ46tI0n5F1Rib8wwmicBP7VpxMUzv5uaYGtfRI7iblC3peiaGg9zPjUl6ZxPhibEd1A.jpg)

**Serverless及其发展**

Serverless 无服务器概念，是指满足无需购买、管理、运维服务器，用户按需使用、按使用量付费，同时平台或产品可以根据使用量自动弹性扩缩容等这几个特性的产品或服务。

目前，Serverless 又被分为了 BaaS 和 FaaS，Baas 包含了存储、数据库、队列、缓存等各种形态的 Serverless 服务；而 FaaS 通常指的是函数即服务 Function as a Service 产品。

![](https://img.serverlesscloud.cn/qianyi/YHl6UWa9s62GasZ6EWHCL6LnQ46tI0n5cVc1aficrr7lSBf9kdl87sIIq8LmAoHjQtGJ4jUibn368WukhvWINTRA.jpg)

在目前云中提供的计算产品形态中，包含了虚拟机、容器与云函数。无论使用虚拟机还是容器，除了要关注自身业务代码之外，还需要有复杂的运维管理工作，例如管理启动进程、打安全补丁、选择开发框架、控制访问权限等等。

而通过使用云函数，用户仅需按规范进行业务代码的编写，就可以对外提供服务。进程的启动时机以及运行所在的服务器运维可以完全交给平台。但当前的云函数产品，在开发方式上和已有的基于vm 或容器的开发方式有所不同。

在基于 vm 或容器的开发模式中，通过使用框架处理 http 请求，启动监听，并由外部命令或脚本来启动进程，是当前开发者都熟悉的业务编写模式。

![](https://img.serverlesscloud.cn/2020414/1586875087454-001.webp)

而使用云函数，http 请求会被转变为一个个的事件，业务代码可以直接针对事件进行处理，并按要求返回数据即可。这种由事件触发，接收event 消息，并根据业务逻辑进行数据处理的云函数模型，是当前 serverless 的主要模式。这种模式的函数，我们称为event function。

![](https://img.serverlesscloud.cn/2020414/1586875148437-002.webp)

事件驱动的核心要素，是能够有丰富的事件源，通过打通各种产品和云函数，使得各产品均可以成为云函数的事件源。这种情况下，函数就成为了产品间的粘合剂，通过承载事件或数据从一个产品流转到另外一个产品，一个函数流转到另外一个函数，在这个过程中实现数据处理，最终建立业务逻辑。

当前的事件触发的 FaaS 形态，在针对业务的削峰填谷、为无状态应用提供弹性的并行处理能力，以及类似 crontab 定时任务这些场景中，提供了极大的优势。

但是同时，当前的云函数，具有访问延时高、运行时长受限、无法直接访问、状态持久化等问题，同时由于开发方式的变化，导致已有的业务，也无法直接向 Serverless 架构迁移，无法做到类似从虚拟机到容器的迁移。

**腾讯云Serverless 2.0**

对于已有的Serverless 产品，以及在产品推广过程中的业务上线的痛点、客户声音，我们重新梳理了 Serverless 产品的发展路线，并将其定义为 Serverless2.0。

![](https://img.serverlesscloud.cn/qianyi/YHl6UWa9s62GasZ6EWHCL6LnQ46tI0n5YIz4oIZxXYYNSPN66IcQNLklUGwFJJGRtH5VFUODLbOCrvfuZt0XoQ.jpg)

**event function**

在 Serverless 2.0中，团队从客户的实际使用场景出发，进行了产品的梳理。针对事件驱动的函数，定义为event function。

事件函数仍然遵循现有的函数触发模式，并将持续增加与腾讯云其他各产品的对接，持续丰富应用场景，例如与日志服务对接，提供日志记录处理；与数据库对接，由数据修改动作触发函数运行；与云监控告警对接，针对告警事件可以进行自动化代码处理等。

而针对 http 场景，通过提供http function 和 http service 两种形态，更好的支持网络访问处理的场景。

接下来，将对 http function 和 http service 两种模式进行进一步的解读说明。

**http function**

通过使用 http function，函数可以直接提供外部可访问到的 url 地址，无论是 app 应用，web应用，还是微信小程序，都可以通过发起 http 调用，访问 url 来调用函数。

而云函数开发中通常的 event 事件结构，优化为 http request、http response 结构，更符合Web 服务开发的习惯。通过request 结构，可以获取到 http 请求的相关信息，而通过response 结构，可以自行构造出所需的 http 响应。

![](https://img.serverlesscloud.cn/qianyi/YHl6UWa9s62GasZ6EWHCL6LnQ46tI0n55SJkaRWWzRwLCMicLPKghibP5qQGFr7w3qjh9CvxPY8UyJiaZzrpU9rqQ.jpg)

通过这种模式，用户可以专注于业务逻辑的开发，而将原有基于 vm 或容器中需要考虑的扩缩容、进程启动、并发处理等事情都交给平台来解决。

而针对实际业务，通常不仅仅是单个函数就可以实现。在 Serverless 架构中，单个 function通常仅提供独特单一的功能实现，整个应用通常是由多个函数、以及围绕着函数的数据存储、文件存储、消息队列、api 管理等多种资源构成。

团队从面向 Application 角度出发，基于全套 serverless 架构，进行了 serverless编排框架的设计。通过编排框架，我们可以将应用相关的资源统一到一起，不仅包括了函数，同样会包含数据库、文件存储、消息队列、api管理等多种资源。

![](https://img.serverlesscloud.cn/2020414/1586875308817-%E5%B1%8F%E5%B9%95%E5%BF%AB%E7%85%A7%202020-04-14%2022.41.32.png)

无论从应用开发、还是调试部署，开发部署框架均将为我们带来难度的降低、效率的提升。

**http service**

产品形态中提供的 http service，在同样对外提供 url访问地址，支持应用直接访问的基础上，我们提供了针对已有代码或框架的支持。

基于常用框架已经开发完成的业务代码，可以无缝迁移至 http service 中，直接开始以 serverless 模式对外提供服务。而服务中原有提供的高性能通讯协议如 websocket，gRPC，同样可以通过 http service 对外提供。

![](https://img.serverlesscloud.cn/2020414/1586875206360-004.webp)

通过使用 http service 形态，用户无需理解容器、镜像，而是仍然同当前 serverless的使用模式一样，同使用云函数一样，通过提交已经开发完成的代码包，就可以开始对外提供服务。

**Serverless 2.0上下游能力**

Serverless 2.0 ，关注的不仅仅是计算、开发模式、使用方式，而是要从更全面的角度来支持 Serverless 架构或应用的发展。

![](https://img.serverlesscloud.cn/qianyi/YHl6UWa9s62GasZ6EWHCL6LnQ46tI0n55DnVoqaMGicvlfDGZuVniaTAIVzLlQucfXicKCn8NJe0WmvWPZSV1icG6w.jpg)

通过协助开发者更好的使用产品、提供全流程的开发管理支持、运维监控、调试支持等，进行全方面的发力，真正去推动 Serverless 架构或应用的落地。

**工具建设**

为了协助开发者更好的进行开发、调试、上线、发布，腾讯云 serverless 团队从多个方面入手，提供可以满足多种开发场景的相关工具或能力。

![](https://img.serverlesscloud.cn/qianyi/YHl6UWa9s62GasZ6EWHCL6LnQ46tI0n5Hmq9LtRibLZO3awREeuD2iakGerPD2wJWBabgz9dUPYBjhRTNYWGFGIw.jpg)

- 通过提供命令行工具，我们可以在本地开发环境中实现项目创建、本地调试打包、一键部署上线
- 而通过 vscode 插件以及正在持续扩展的更多开发 IDE 插件，函数的本地管理、开发调试、上线发布，可以通过开发 IDE 直接可视化操作。将函数的线上线下管理，与代码的编写调试，都整合在一个界面中完成。
- 为了方便用户进行代码的调整或查看，我们也通过提供 web ide，可以在控制台上实时的开发调试，达到与本地开发调试的相同体验。
- 针对已经进行了 git 托管的代码，团队增加了 git 对接能力；通过与用户 git 打通，以及依赖包的在线安装，提供了更简单的代码提交部署能力，进一步简化操作过程。

**DevOps**

在 Serverless 的 DevOps 方面，通过与 coding.net 的合作，我们提供了 Serverless 的 DevOps 方案。通过打通 coding.net 的 DevOps 平台，从项目创建开始，我们就可以进入完全适配 Serverless 的全管理流程中。

![](https://img.serverlesscloud.cn/2020414/1586875211959-006.webp)

无论是项目管理、需求管理、代码管理，还是 CI 持续集成、test 测试管理、制品库管理、CD持续部署，Serverless 架构应用都可以适配整个 DevOps 流程，协助用户构建完全云原生的Serverless DevOps过程。

而如果已有 DevOps或 CICD 系统的用户，Serverless 2.0 也可以通过提供通用方案及工具，协助用户完成整合及融入，在已有流程中实现针对 Serverless 应用的适配。

由于 serverless本身的平台调度、按需启动的特性，无法提供和虚拟机或容器类似的登录到环境、手工操作的能力。因此，在协助用户排障、保障运行的透明性方面，serverless 平台需要做的更多。

**运维监控**

除了通过对接云的日志服务和监控服务，支持基于日志和监控的多种查询、过滤、告警之外，我们还在规划更多为用户提升调试能力的工具建设，例如通过调用链追踪，可以跟踪请求的经过的各个产品、服务或函数；通过故障现场捕捉，可以抓取函数运行失败时的现场及事件，便于进一步分析代码故障；而应用性能分析，可以了解到函数内部的代码或模块性能，便于进一步提升应用性能。

![](https://img.serverlesscloud.cn/qianyi/YHl6UWa9s62GasZ6EWHCL6LnQ46tI0n5XQghlUsU3n8GPDCOuhVBT0PJj8F4tOhfWn6lQ8pSV1Kfs1iaaV0Y5hA.jpg)

多种工具的建设，目标都是期望为客户提供更多的分析排障支持，提升运行的透明性，降低对于 serverless 架构的运维担忧。

**技术能力**

回到产品实现的底层技术上，针对腾讯云 serverless 2.0中提供的三种形态，目前采用了相同的技术架构，包括了微虚拟机、容器、调度平台等多种基础能力；通过采用相同底层能力，提供了高度的产品可扩展能力。

![](https://img.serverlesscloud.cn/qianyi/YHl6UWa9s62GasZ6EWHCL6LnQ46tI0n5Ooc6my5WT7MTuHspAqeWvxdyPTjqyGjfQicy2A9icKWFrQMUDbQ6RBWg.jpg)

在 Serverless平台通常碰到的延迟性能方面，通过应用机器学习，预热，扩展策略等多种技术，极大的降低了冷启动。通过当前平台分析，目前97%的事件型函数启动延迟均低于200ms，对业务基本做到了极低感知，满足了各种场景的应用。

多可用区、多集群、自动运维、平台监控技术的应用，进一步的在提升整体产品的可靠性及安全性。

**应用案例**

与2018年9月，由腾讯云和微信联合推出的小程序云开发解决方案，将 Serverless 概率推向了广大的国内小程序开发者，获得了大量的客户及使用。小程序云开发解决方案，通过整合腾讯云的对象存储，云数据库，云函数，形成了一套可以直接提供给最终开发者的解决方案，带来了一站式的开发体验。


![](https://img.serverlesscloud.cn/qianyi/YHl6UWa9s62GasZ6EWHCL6LnQ46tI0n5tuDQ6Ryuw84S2kcj725j7FGPYzsyBzQ3MPSu0qF5Xh4K5XbyrQ4LTg.jpg)

- 原有小程序开发过程中，针对后端服务，用户需要自行完成服务器搭建，存储选择，数据库配置、负载均衡配置等各种操作。
- 而通过使用小程序云开发，用户可以直接获得开箱即用的云能力。存储、数据库、以及作为后台服务的函数，直接由小程序端发起调用，而无需自行管理通讯链路、业务扩缩、访问安全等问题。

通过与小程序开发 IDE 整合，用户可以在 IDE 中同时完成小程序端，以及后端云函数的开发、调试、部署，以及文件存储、数据库的的管理工作，大大减轻了开发及管理工作量。小程序云开发为Serverless 概念及应用在国内市场中的推广，起到了及其重要的作用。

![](https://img.serverlesscloud.cn/qianyi/YHl6UWa9s62GasZ6EWHCL6LnQ46tI0n55XwZ297Au5ic3SytsZC2nFzLeOEPHaialX0cVicDBXIsAyGP8rxiaGfoicg.jpg)

最后，再次回顾一下核心内容。针对Serverless当前的访问延迟、开发模式、业务迁移等痛点，腾讯云 Serverless 2.0 将通过 event function、http function、http service 三种形态来分别依据场景提供解决方案。同时，针对 Serverless 架构，将通过开发工具建设，项目管理支持、DevOps 能力、监控运维、性能提升等全方位能力，来不断满足用户诉求，打造极致的产品和技术体验，全面的支持用户向 Serverless 架构发展。

> **传送门：**
> - GitHub: [github.com/serverless](https://github.com/serverless/serverless/blob/master/README_CN.md) 
> - 官网：[serverless.com](https://serverless.com/)

欢迎访问：[Serverless 中文网](https://serverlesscloud.cn/)，您可以在 [最佳实践](https://serverlesscloud.cn/best-practice) 里体验更多关于 Serverless 应用的开发！
