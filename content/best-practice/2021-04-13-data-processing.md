---
title: Serverless 在数据处理场景下的最佳应用
description: 如何降低传统海量服务器组件的开发和运维成本？
date: 2021-04-13
thumbnail: https://main.qcloudimg.com/raw/fcf46d4c54dc357e3574b11e684f4015.png
categories:
  - best-prectise
authors:
  - 田梦敏
tags:
  - Serverless
  - 云函数
---

我们知道传统的数据处理无外乎涉及 Kafka、Logstash、File Beats、Spark、Flink、CLS、COS 等组件。这些海量服务器组件承担着从数据源取数据，数据聚合过滤等处理，再到数据流转的任务，不管是开发成本、运维成本以及价格方面都有所欠佳。下面将为大家详细介绍：云函数 SCF 是如何降低传统海量服务器组件的开发和运维成本的。



## 01. 腾讯云云函数 SCF

腾讯云云函数（Serverless Cloud Function，SCF）是腾讯云为企业和开发者们提供的无服务器执行环境，在无需购买和管理服务器的情况下运行代码，是实时文件处理和数据处理等场景下理想的计算平台。只需使用云函数平台支持的语言编写核心代码并设置代码运行的条件，即可在腾讯云基础设施上弹性、安全地运行代码。

云函数具有资源编排，自动伸缩，事件驱动等能力，覆盖编码、调试、测试、部署等全生命周期，同时提供了贴合应用场景的框架，开发者根据实际需求选择对应的框架之后，只需专注于业务逻辑的开发，无需关心底层的资源，帮助开发者通过联动云资源，迅速构建 Serverless 应用。



## 02. 云函数 SCF 在数据处理的位置

云函数作为腾讯云基础的 Serverless Faas 能力，已打通众多云上产品的事件触发，例如 Ckafka、CLS、COS、APIGW、CMQ 等产品，作为各个云产品的 “粘合剂”，从简单的数据转储，到复杂的数据清洗、过滤、聚合等，都有现成的解决方案。

如图所示，在云上产品整个上下游生态图中，云函数处于中间层，起到数据聚合，数据清洗，数据流转的作用。



<img src="https://main.qcloudimg.com/raw/e233b886951afc8f52fbcbb00d2c4958.jpg" width="700"/>

​    

## 03. 消息队列 Ckafka 篇

在普通的流式计算中，技术方案不外乎是主动消费 Ckafka，再使用 Logstash、Spark 等工具进行清洗存储到 HDFS、ES、MySQL 等目标端。这样整套下来，带来的学习成本、维护成本以及价格成本都是巨大的，整体看来这些开源方案还是有所欠缺的。下面来看看云函数是怎么解决以上问题的？



### Ckafka 和云函数 SCF 的碰撞

- **Ckafka + 云函数 + COS/DB/ES/Ckafka**

云函数使用 Ckafka 触发器获取消息，然后承担起数据格式转换、数据清洗过滤、数据重组、格式化等操作，把数据转为目标格式之后转存入 COS、DB、ES 或 Ckafka 等第三方目标中。

<img src="https://main.qcloudimg.com/raw/4c4fcdedb374b791eea10800699ac515.jpg" width="700"/>



通过 Ckafka（源）+ 云函数 + 第三方（目标）组合的解决方案可以给用户带来更低的研发成本、维护成本、价格成本。

| Ckafka 消息转储到 COS               | Ckafka 消息同步到 Ckafka            |
| ----------------------------------- | ----------------------------------- |
| 开发 + 测试周期：0.1 day            | 开发+测试周期：0.3 day              |
| 转存费用：单 Partition，约 15 元/月 | 同步费用：单 Partition，约 15 元/月 |
| 维护成本：0                         | 维护成本：0                         |



- **某知名电商所使用的云函数 + Ckafka 解决方案：**

生产系统生成的用户日志旁路写入 Ckafka，基于云函数 + Ckafka 触发器，实时拉取消费，并代替 Logstash 实现日志清洗逻辑，最终由 ES + Kibana 做存储和展示。

对比传统模式：13 台 * 32C128G，刊例价：2.5W+，云函数月度费用：约 1.2W+，成本至少降低 50%。

<img src="https://main.qcloudimg.com/raw/240f3b6c2010c5a6fc94f324e0bd37f1.jpg" width="700"/>



## 04. 日志服务 CLS 篇

普通的日志数据加工方案，是通过日志 SDK 将日志回传到服务器，第三方服务回写 EMR/ETL 服务平台，然后再通过日志 SDK 转储到最终日志服务实例或永久存储桶，该方案整体处理流程复杂，需要大量开发人力及运维人力，日志同步慢，整体链路过长，延时很高。整体来说也是欠佳的，下面来看看云函数是怎么最优解决这些问题的。

### **CLS 和云函数 SCF 的碰撞**

- CLS 日志投递 + 云函数 + COS/CLS

云函数使用 CLS 触发器自动监听云上日志服务，每个 job 节点完成各自的转换、过滤、分发等 ETL 工作，快速实现日志类场景的数据清洗及数据加工，转为目标格式之后转存入 COS、CLS 等第三方目标中，整体链路短，且无需开发额外数据流逻辑，即可直接在函数对日志内容做处理，并实时投递至日志服务或永久存储服务，日志同步快，延时低。

<img src="https://main.qcloudimg.com/raw/d594be30cde89a0f29c26b5beb80a019.jpg" width="700"/>

通过 CLS（源）+ 云函数 + 第三方（目标）组合的解决方案可以给用户带来更低的研发成本、维护成本、价格成本。

| 传统方案                | Serverless 方案        |
| ----------------------- | ---------------------- |
| 开发 + 测试周期：7 days | 开发 + 测试周期：1 day |
| 维护成本：久            | 维护成本：0            |



<img src="https://main.qcloudimg.com/raw/4829487f18f67e586108889429eed791.jpg" width="700"/>

​    

## 05. 云函数 SCF 在数据处理中的优势

下面统一看一下云函数与传统数据处理方式的优势，如下图所示，不管是架构设计、代码开发、发布部署、还是运维成本以及服务成本来说都有碾压式的优势。其中最大的特点有以下三点：           

**1. 消除传统海量服务器组件的需求，降低开发和运维复杂性。**

**2. 实现按需调用、按需伸缩、按使用付费。** 

**3. 开发者或者企业可以专注业务的开发、提升竞争力。**



<img src="https://main.qcloudimg.com/raw/edc421c39ff8ca01382007fe5b1217c3.jpg" width="700"/>

<img src="https://main.qcloudimg.com/raw/258815b210dbabf8012f79c440896dd7.jpg" width="700"/>



## 06. 云函数 SCF 在数据处理的展望

在这个数据时代，数据处理的场景以及规模越来越大，能够使开发者快速部署一套完整的数据处理、数据分析的应用也越来越 “急迫”，云函数正在逐步打通更多的云上产品，完善更多的应用场景和应用框架供开发者使用，不仅仅局限于 Serverless+ 腾讯云产品，SCF + AI、SCF + IoT、SCF + 游戏等等也是我们下一步探索的方向。



<div id='scf-deploy-iframe-or-md'></div>

---

> **传送门：**
> - GitHub: [github.com/serverless](https://github.com/serverless/serverless/blob/master/README_CN.md)
> - 官网：[serverless.com](https://serverless.com/)

欢迎访问：[Serverless 中文网](https://serverlesscloud.cn/)，您可以在 [最佳实践](https://serverlesscloud.cn/best-practice) 里体验更多关于 Serverless 应用的开发！
