---
title: "Serverless 架构与事件规范"
description: "Serverless 架构与事件规范"
keywords: Serverless 架构,Serverless 规范,Serverless 架构与事件规范
date: 2020-02-19
thumbnail: "https://img.serverlesscloud.cn/202031/1583055662380-th.jpeg"
categories:
  - user-stories
  - guides-and-tutorials
authors:
  - Tabor
authorslink:
  - https://canmeng.net
tags:
  - serverless
  - Meetup  
---

## 基础服务架构

本篇内容主要讨论的是 Serverless架构与其事件规范的基础原则。

首先，我们先来了解下在 HTTP/Web 场景下我们的典型的WEB场景是怎样的：

![基础架构](https://img.serverlesscloud.cn/2020219/1582071938229-0ss0kt5k5y.png)

这里，我们不难看出典型的Web场景其实是由三大块内容，客户端，服务器，数据库组成。客户端在服务器侧通过类型apache，nginx等代理服务器来请求数据，代理服务器又通过数据库来写入或拉取数据资料。这个很简单，也是我们最常用的Web场景。

这里面服务器中可能涉及路由规则，鉴权逻辑以及其他各类复杂的业务代码，同时，开发团队要付出很大的精力在这个服务器的运维上面，包括客户量突然增多时是否需要扩容服务器？服务器上的脚本，业务代码等是否还在健康运行？是否有黑客在不断地对服务器发起攻击？

## Serverless服务架构

那么接下来，我们来看下Serverless服务是如何请求数据的吧：

![Serverless架构](https://img.serverlesscloud.cn/2020219/1582071941646-2tk1dkknal.png)

Serverless 场景下，客户端需要通过API网关 Baas 来访问函数 FaaS 服务，然后在通过函数计算做数据库链接实现数据库的写入和拉取。

当客户端和数据库未发生变的前提下，服务器变化巨大，之前需要开发团队维护的路由模块以及鉴权模块都将接入服务商提供的API网关系统以及鉴权系统，开发团队无须再维护这两部分的业务代码，只需要持续维护相关规则即可。同时业务代码也被拆分成了函数粒度，不同函数表示不同的功能。

从上面的例子中，我们不难发现，其实一个完整的Serverless 请求其实是有两大块的，即我们的Faas服务和我们的BaaS服务。那么，简单叙述下Serverless，其实由两部分组成的，即我们的 Faas+Baas。

![Serverless概念](https://img.serverlesscloud.cn/2020219/1582071945749-78hlpxnphq.png)

## Serverless 架构核心

了解完整体Serverless的情况，我们来看下传统Faas的基础架构，其实传统Faas最关键的核心概念是我们的调用，我们可以通过Event Sources事件源调用另一个函数的Function来实现单个函数的扩展，整体的原理图如下所示：

![Faas解决方案](https://img.serverlesscloud.cn/2020219/1582071959211-tdpoeu8650.png)

​

- Event Sources（事件源）：将Event触发或流式传输到一个或多个函数实例中；
- Function Instance（函数实例）：可以根据需要，将单个函数/微服务进行扩展；
- FaaS Controller（Faas 控制器）：部署，控制和监视函数实例及其来源
- 平台服务：FaaS解决方案使用的一般集群或云服务（有时称为后端即服务，或者BaaS等）

## Serverless 架构中的事件

这样，我们引出出来另一个概念，就是事件，什么是事件？事件是怎么定义的？  

我们可以引出来 CloudEvents ，它是⼀种规范，⽤于以通⽤格式描述事件数据，以提供跨服务、平台和系统的交互能⼒。 事件格式指定了如何使⽤某些编码格式来序列化 CloudEvent。⽀持这些编码的兼容 CloudEvents 实现必须遵循在相应的事件格式中指定的编码规则。所有实现都必须⽀持 JSON 格式。

事件 (Event) ⽆处不在,然⽽每个事件源产⽣的事件各不相同。由于缺乏事件的统⼀描述,对于事件的开发者来说,需要不断地重复学习如何消费不同类型的事件。 例如同⼀个⼚商的CMQ产⽣的事件和API⽹关触发器产⽣的事件是不同的,不同⼚商的 API⽹关触发器产⽣的事件也可能是不同的。

必须的事件属性（REQUIRED attributes） 

• ID - 识别事件 

• Source - 识别发⽣事件的上下⽂ 

• Specversion - 事件使⽤该版本的cloudEvents规范 

• Type - 发⽣相关事件的类型值 

• Data - Data的数据内容格式 

• Subject -事件开发者有关的事件上下⽂主题 

• Tiem - 事件发⽣的事件

## Serverless 架构中的调用

聊完我们的事件，我们来谈谈另外一个核心调用，其实在Serverless架构中，调用简单分为四种：

可以根据不同的用例从不同的事件源调用函数，例如：

1. 同步请求（Req / Rep），例如HTTP请求，gRPC调用

- 客户发出请求并等待立即响应。

2. 异步消息队列请求（发布/订阅），例如RabbitMQ，AWS SNS，MQTT，电子邮件，对象（S3）更改，计划事件（如CRON作业）

- 消息发布到交换机并分发给订阅者；
- 没有严格的消息排序，以单次处理为粒度。

3. 消息/记录流：例如Kafka，AWS Kinesis，AWS DynamoDB Streams，数据库CDC

- 一组有序的消息/记录（必须按顺序处理）；
    - 通常，每个分片使用单个工作程序（分片消费者）将流分片为多个分区/分片；
    - 可以从消息，数据库更新（日志）或文件（例如CSV，Json，Parquet）生成流；
    - 事件可以推送到函数运行时或由函数运行时拉动。

4. 批量作业，例如ETL作业，分布式机器学习，HPC模拟

- 作业被调度或提交到队列，并在运行时使用并行的多个函数实例进行处理，每个函数实例处理工作集的一个或多个部分（任务）

不同类型的事件源包括：

- 事件和消息服务，例如：RabbitMQ，MQTT，SNS
- 存储服务，例如：COS，CDB，PGSQL，Cognito，Google云存储，
- 端点服务，例如：物联网，HTTP网关，移动设备，Alexa，
- 配置存储库，例如：Git，CodeCommit
- 使用特定于语言SDK的用户应用程序
- 计划事件，定期启用函数调用。

虽然每个事件提供的数据可能在不同的事件源之间有所不同，但事件结构应该是通用的，能够封装关于事件源的特定信息。


## 总结

如上就是关于Serverless 架构与事件规范的一点思考，希望可以给到大家一些帮助。

> **传送门：**
>
> - GitHub: [github.com/serverless](https://github.com/serverless/serverless/blob/master/README_CN.md) 
> - 官网：[serverless.com](https://serverless.com/)

欢迎访问：[Serverless 中文网](https://serverlesscloud.cn)，您可以在 [最佳实践](https://serverlesscloud.cn/best-practice/) 里体验更多关于 Serverless 应用的开发！

