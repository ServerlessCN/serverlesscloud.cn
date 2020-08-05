---
title: 腾讯云 Serverless 衔接 Kafka 上下游数据流转实战
description: 腾讯云 CKafka 作为大数据架构中的关键组件，起到了数据聚合，流量削峰，消息管道的作用。在 CKafka 上下游中的数据流转中有各种优秀的开源解决方案。如 Logstash，File Beats，Spark，Flink等等。本文将带来一种新的解决方案：Serverless Function，其在学习成本，维护成本，扩缩容能力等方面相对已有开源方案将有优异的表现。
keywords: Serverless, Serverless Kafka, Serverless 实践
date: 2020-08-05
thumbnail: https://img.serverlesscloud.cn/202085/1596628194866-1596598484307-%E4%BC%81%E4%B8%9A%E5%BE%AE%E4%BF%A1%E6%88%AA%E5%9B%BE_15965984707760.jpg
categories: 
  - news
authors: 
  - 许文强
authorslink: 
  - https://github.com/loboxu
tags:
  - Serverless
  - Kafka
---

腾讯云 CKafka 作为大数据架构中的关键组件，起到了数据聚合，流量削峰，消息管道的作用。在 CKafka 上下游中的数据流转中有各种优秀的开源解决方案。如 Logstash，File Beats，Spark，Flink 等等。本文将带来一种新的解决方案：Serverless Function。其在学习成本，维护成本，扩缩容能力等方面相对已有开源方案将有优异的表现。

> 作者简介：许文强，腾讯云 Ckafka 核心研发，精通 Kafka 及其周边生态。对 Serverless，消息队列等领域有较深的理解。专注于 Kafka 在公有云多租户和大规模集群场景下的性能分析和优化、及云上消息队列 serverless 化的相关探索。

## Tencent Cloud Kafka 介绍

Tencent Cloud Kafka 是基于开源 Kafka 引擎研发的适合大规模公有云部署的 Cloud Kafka。是一款适合公有云部署、运行、运维的分布式的、高可靠、高吞吐和高可扩展的消息队列系统。它 100% 兼容开源的 Kafka API，目前主要支持开源的 0.9, 0.10, 1.1.1, 2.4.2 四个大版本 ，并提供向下兼容的能力。

目前 Tencent Cloud Kafka 维护了超过 4000+ 节点的集群，每日吞吐的消息量超过 9 万亿+条，峰值带宽达到了 800GB+/s, 堆积数据达到了 20PB+。是一款集成了租户隔离、限流、鉴权、安全、数据监控告警、故障快速切换、跨可用区容灾等等一系列特性的，历经大流量检验的、可靠的公有云上 Kafka 集群。

## 什么是数据流转

CKafka 作为一款高吞吐，高可靠的消息队列引擎。需要承接大量数据的流入和流出，数据流动的这一过程我们称之它为数据流转。而在处理数据的流入和流出过程中，会有很多成熟丰富的开源的解决方案，如 Logstash，Spark，Fllink等。从简单的数据转储，到复杂的数据清洗，过滤，聚合等，都有现成的解决方案。

如图所示，在 Kafka 上下游生态图中，CKafka 处于中间层，起到数据聚合，流量削峰，消息管道的作用。图左和图上是数据写入的组件概览，图右和图下是下游流式数据处理方案和持久化存储引擎。这些构成了 Kafka 周边的数据流动的生态。

![图 1: Kafka 上下游生态图](https://img.serverlesscloud.cn/202085/1596597854719-7.png)


## 数据流转新方案: Serverless Function

下图是流式计算典型数据流动示意图。其中承接数据流转方案的是各种开源解决方案。单纯从功能和性能的角度来讲，开源解决方案都有很优秀的表现。

![图 2: 流式计算典型数据流动示意图](https://img.serverlesscloud.cn/202085/1596597855336-7.png)

而从学习成本，维护成本，金钱成本，扩缩容能力等角度来看，这些开源方案还是有欠缺的。怎么说呢？开源方案的缺点主要在于如下三点：

- 学习成本
- 调优、维护、解决问题的成本
- 扩缩容能力

以 Logstash 为例，它的入门使用学习门槛不高，进阶使用有一定的成本，主要包括众多 release 版本的使用成本，参数调优和故障处理成本，后续的维护成本（进程可用性，单机的负载处理）等。如果用流式计算引擎，如 spark 和 flink，其虽然具有分布式调度能力和即时的数据处理能力，但是其学习门槛和后期的集群维护成本，将大大提高。

来看 Serverless Function 是怎么处理数据流转的。如图所示，Serverless Function 运行在数据的流入和流出的处理层的位置，代替了开源的解决方案。Serverless Function 是以自定义代码的形式来实现数据清洗、过滤、聚合、转储等能力的。它具有学习成本低、无维护成本、自动扩缩容和按量计费等优秀特性。

![图 3: Serverless Function 实现低成本数据流转](https://img.serverlesscloud.cn/202085/1596597856618-7.png)


接下来我们来看一下 Serverless Function 是怎么实现数据流转的，并且了解一下其底层的运行机制及其优势。

## Serverless Function 实现数据流转

首先来看一下怎么使用 Serverless Function 实现 Kafka To Elasticsearch 的数据流转。下面以 Function 事件触发的方式来说明 Function 是怎么实现低成本的数据清洗、过滤、格式化和转储的：

在业务错误日志采集分析的场景中，会将机器上的日志信息采集并发送到服务端。服务端选择 Kafka 作为消息中间件，起到数据可靠存储，流量削峰的作用。为了保存长时间的数据(月，年)，一般会将数据清洗、格式化、过滤、聚合后，存储到后端的分布式存储系统，如 HDFS，HBASE，Elasticsearch 中。

以下代码段分为三部分：数据源的消息格式，处理后的目标消息格式，功能实现的 Function 代码段

- 源数据格式:

```
        {
            "version": 1,
            "componentName": "trade",
            "timestamp": 1595944295,
            "eventId": 9128499,
            "returnValue": -1,
            "returnCode": 101103,
            "returnMessage": "return has no deal return error[错误：缺少**c参数][seqId:u3Becr8iz*]",
            "data": [],
            "seqId": "@kibana-highlighted-field@u3Becr8iz@/kibana-highlighted-field@*"
        }
```

- 目标数据格式：

```
        {
            "timestamp": "2020-07-28 21:51:35",
            "returnCode": 101103,
            "returnError": "return has no deal return error",
            "returnMessage": "错误：缺少**c参数",
            "requestId": "u3Becr8iz*"
        }
```

- Function 代码

Function 实现的功能是将数据从源格式，通过清洗，过滤，格式化转化为目标数据格式，并转储到 Elasticsearch。代码的逻辑很简单：CKafka 收到消息后，触发了函数的执行，函数接收到信息后会执行 convertAndFilter 函数的过滤，重组，格式化操作，将源数据转化为目标格式，最后数据会被存储到 Elasticsearch。

```
#!/usr/bin/python
# -*- coding: UTF-8 -*-
from datetime import datetime
from elasticsearch import Elasticsearch
from elasticsearch import helpers

esServer = "http://172.16.16.53:9200"  # 修改为 es server 地址+端口 E.g. http://172.16.16.53:9200
esUsr = "elastic"  # 修改为 es 用户名 E.g. elastic
esPw = "PW123"  # 修改为 es 密码 E.g. PW2312321321
esIndex = "pre1"  # es 的 index 设置

# ... or specify common parameters as kwargs
es = Elasticsearch([esServer],
                   http_auth=(esUsr, esPw),
                   sniff_on_start=False,
                   sniff_on_connection_fail=False,
                   sniffer_timeout=None)

def convertAndFilter(sourceStr):
    target = {}
    source = json.loads(sourceStr)
    # 过滤掉returnCode=0的日志
    if source["returnCode"] == 0:
        return
    dateArray = datetime.datetime.fromtimestamp(source["timestamp"])
    target["timestamp"] = dateArray.strftime("%Y-%m-%d %H:%M:%S")
    target["returnCode"] = source["returnCode"]
    message = source["returnMessage"]
    message = message.split("][")
    errorInfo = message[0].split("[")
    target["returnError"] = errorInfo[0]
    target["returnMessage"] = errorInfo[1]
    target["requestId"] = message[1].replace("]", "").replace("seqId:", "")
    return target


def main_handler(event, context):
    # 获取 event Records 字段并做转化操作 数据结构 https://cloud.tencent.com/document/product/583/17530
    for record in event["Records"]:
        target = convertAndFilter(record)
        action = {
            "_index": esIndex,
            "_source": {
                "msgBody": target  # 获取 Ckafka 触发器 msgBody
            }
        }
        helpers.bulk(es, action)
    return ("successful!")
```

看到这里，大家可能会发现，这个代码段平时是处理单机的少量数据的脚本是一样的，就是做转化，转储，很简单。其实很多分布式的系统做的系统从微观的角度看，其实就是做的这么简单的事情。分布式框架本身做的更多的是分布式调度，分布式运行，可靠性，可用性等等工作，细化到执行单元，功能其实和上面的代码段是一样的。

从宏观来看，Serverless Function 做的事情和分布式计算框架 Spark, Flink 等做的事情是一样的，都是调度，执行基本的执行单元，处理业务逻辑。区别在于用开源的方案，需要使用方去学习，使用，维护运行引擎，而 Serverless Function 则是平台来帮用户做这些事情。

接下来我们来看 Serverless Function 在底层是怎么去支持这些功能的，来看一下其底层的运行机制。如图所示：

![图 4: Serverless Function 实现数据流转原理解析](https://img.serverlesscloud.cn/202085/1596597855148-7.png)

Function 作为一个代码片段，提交给平台以后。需要有一种触发函数运行的方式，目前主要有如下三种：事件触发、定时触发和主动触发。

在上面的例子中，我们是以事件触发为例的。当消息提交到 Kafka，就会触发函数的运行。此时 Serverless 调度运行平台就会调度底层的 Container 并发去执行函数，并执行函数的逻辑。此时关于 Container 的并发度是由系统自动调度，自动计算的，当 Kafka 的源数据多的时候，并发量就大，当数据少的时候，相应的就会较少并发数。因为函数是以运行时长计费的，当源消息数据量少的时候，并发量小，自然运行时长就少，自然所需付出的资金成本就降下来。

在函数执行过程当中，函数的可靠性运行，自动扩缩容调度，并发度等都是用户不需要关心的。用户需要 Cover 的只是函数代码段的可运行，无 BUG。这对于研发人员的精力投入成本就降低很多。

值得一谈的是，在开发语言方面，开源方案只支持其相对应的语言，如 Logstash 的嵌入脚本用的是 ruby，spark 主要支持java，scala，python 等。而 Serverless Function 支持的是几乎业界常见到的开发语言，包括不限于 java，golang，python，node JS，php 等等。这点就可以让研发人员用其熟悉的语言去解决数据流转问题，这在无形中就减少了很多代码出错和出问题的机会。

## Serverless Function 在数据流转场景的优势

下面我们来统一看一下 Serverless Function 和开源的方案的主要区别及优势。如图5所示，和开源方案相比。在非实时的数据流转场景中，Serverless Function 相对现有的开源方案，它具有的优势几乎是压倒性的。从功能和性能的角度，它在批式计算（实时）的场景中是完全可以满足的。但是它相对开源方案在学习成本，运维成本几乎可以忽略，其动态扩缩容，按需付费，毫秒级付费对于资金成本的投入也是非常友好的。

![图 5：Serverless Function 对比现有开源方案的优势](https://img.serverlesscloud.cn/202085/1596597854645-7.png)


用一句话总结就是：Serverless Function 能用一段熟悉的语言编写一小段代码去衔接契合流式计算中的数据流转。

## Serverless Function 在批式计算场景的展望

随着流式计算的发展，慢慢演化出了批量计算 (batch computing)、流式计算 (stream computing)、交互计算 (interactive computing)、图计算 (graph computing) 等方向。而架构师在业务中选择批式计算或者流式计算，其核心是希望按需使用批式计算或流式计算，以取得在延时、吞吐、容错、成本投入等方面的平衡。在使用者看来，批式处理可以提供精确的批式数据视图，流式处理可以提供近实时的数据视图。而在批式处理当中，或者说在未来的批式处理和流式处理的底层技术的合流过程中，Lambda 架构是其发展的必然路径。

Serverless Function 以其按需使用，自动扩缩容及近乎无限的横向扩容能力给现阶段的批式处理提供了一种选择，并且在未来批流一体化的过程中，未来可期。

![图 6: 批式处理和流式处理](https://img.serverlesscloud.cn/202085/1596597855844-7.png)

---

---
<div id='scf-deploy-iframe-or-md'></div>

---

> **传送门：**
> - GitHub: [github.com/serverless](https://github.com/serverless/serverless/blob/master/README_CN.md)
> - 官网：[serverless.com](https://serverless.com/)

欢迎访问：[Serverless 中文网](https://serverlesscloud.cn/)，您可以在 [最佳实践](https://serverlesscloud.cn/best-practice) 里体验更多关于 Serverless 应用的开发！