---
title: 权威指南：Serverless 未来十年发展解读 — 伯克利分校实验室分享（下）
description: Johann 在 ServerlessDays China 的演讲分享！
keywords: Serverless Framework,Serverless,SCF,Berkeley,加州大学,伯克利分校,云计算
date: 2020-09-27
thumbnail: https://img.serverlesscloud.cn/2020927/1601192579846-1601190052484-ServerlessDays%20PPT%E6%A8%A1%E6%9D%BF001.jpg
categories:
  - user-stories
authors:
  - Johann SchleierSmith
authorslink:
  - https://www.zhihu.com/people/Aceyclee
tags:
  - Serverless
  - 伯克利
---

## 编者按

本文整理自 Johann Schleier-Smith 在 [ServerlessDays China 的演讲](https://cloud.tencent.com/developer/salon/live-1224/agenda-10025)，是来自加州大学伯克利分校计算机科学 Riselab 团队的研究成果。

![](https://img.serverlesscloud.cn/2020927/1601191886934-IMG_3020.JPG)

ServerlessDays 是由全球 Serverless 开发者发起的国际技术会议。2020 年由腾讯云 Serverless 团队引入中国，并承办了首届 ServerlessDays China 会议。会上 Johann Schleier-Smith 代表伯克利计算机科学 Riselab 实验室进行了主题发言。

> 本文由腾讯云 Serverless 团队进行翻译和整理，任何问题请与我们联系：  
> - 翻译：丁坤方 | 策划：王俊杰 | 编辑：王天云

![](https://img.serverlesscloud.cn/2020924/1600936012116-image002.jpg)  

接上篇[《权威指南：Serverless 未来十年发展解读 — 伯克利分校实验室分享（上）》](https://serverlesscloud.cn/blog/2020-09-24-slsdays-johann-1)

## Serverless 研究成果和亮点

**第三个研究课题主要是 Serverless 文件系统 —— 状态性方面的优化，也是非常有价值的一个方向。**

下面的图可以解释当前 Serverless 计算的状态共享/存储模式。当前有两个层面，在计算层，主要通过 FaaS 提供服务，其特点是实例之间相互隔离，并且只有短暂的状态性。短暂的状态性指的是 FaaS 服务运行完毕后，实例销毁，状态也随之销毁。如果希望永久存储，则需要持续的写入到存储层（例如对象存储、K-V 存储等）即 BaaS 服务中，实现状态信息的长期存储和共享。

![](https://img.serverlesscloud.cn/2020924/1600938770354-image040.jpg)            

但当前这样的模式面临两个主要的问题：（26:31）

一方面是延迟问题，也是许多 BaaS 服务目前存在的问题；另一方面，对象存储或者 K-V 存储是通过 API 进行服务的，并不能感知到底层的存储情况，因此在开发应用或迁移时难以信任这些存储资源（改变了以往的开发使用方式）。所以我们的诉求很简单，是否可以提供类似本地磁盘一样的存储能力，区别只是在云端呢？

![](https://img.serverlesscloud.cn/2020924/1600938785057-image042.jpg)            

这就是 Serverless 云函数文件系统（CFFS, Cloud Function File System）所要提供的能力。该文件系统有以下几个特点：

1. 基于标准 POSIX API 的文件系统，提供持久化的存储能力。
2. CFFS 提供了透明传输机制，也就是在函数启动时，CFFS 也随之启动一个传输；而当函数销毁时，这个传输会被提交。这样做可以获取到函数执行过程中的许多状态信息。
3. 虽然通常情况下传输会对性能有影响，但如果能够积极利用本地状态和缓存，这种方式相比传统的文件存储系统，对性能有很好的提升。

![](https://img.serverlesscloud.cn/2020924/1600938788524-image044.jpg)            

下面是 CFFS 的架构图，可以看出 CFFS 在云服务商的 FaaS 环境中运行，在前端通过标准的 POSIX API 进行调用，后端的存储系统则利用缓存等，专为云函数 FaaS 设计并提供服务。

![](https://img.serverlesscloud.cn/2020924/1600938791437-image046.jpg)            

> 参考文献：[A File System for
Serverless Computing](http://www.hpts.ws/papers/2019/schleier-smith-hpts-2019.pdf)

**第四个研究课题 Cloudburst 也是致力于解决 Serverless 中状态问题的项目。** Cloudburst 更侧重于怎样将 Serverless 应用在状态敏感、延时敏感的应用场景中。例如社交网络、游戏、机器学习预测等。

Cloudburst 主要基于 Python 环境，能够低延迟的获取共享可变状态（shared mutable state）,和 CFFS 类似， Cloudburst 也在函数执行器中利用了数据缓存来提升性能，但和 CFFS 不同的是，Cloudburst 可以保证因果一致性（Causal Consistency）来达到更好的性能。

![](https://img.serverlesscloud.cn/2020924/1600938795765-image048.jpg)            

实验结果上也表明 Cloudburst 有很强的性能优势。在相同条件下，用了 DynamoDB（K-V 数据库）服务的 Lambda 函数约有 239 ms 的延迟，但用 Cloudburst 的延迟低于 10 ms。

![](https://img.serverlesscloud.cn/2020924/1600938800646-image050.jpg)            

> 参考文献：
> - [hydro-project/cloudburst](https://github.com/hydro-project/cloudburst)
> - [Cloudburst: Stateful Functions-as-a-Service](https://arxiv.org/pdf/2001.04592.pdf)

最后一个研究课题是 Serverless 数据中心。当我们思考服务器的组成时，一般会想到 CPU，内存，有时候还有 GPU 和硬盘这些基本硬件。而千千万万这些硬件组合在一起，之后进行网络连接，就成了数据中心。像个人电脑、服务器集群等都是通过这样的方式构建的。

![](https://img.serverlesscloud.cn/2020924/1600938803247-image052.jpg)            

但是从应用层的角度，这样的组合方式并不是唯一的。所以有一种新的概念叫做分布式集群（distributed datecenter），也叫 Warehouse-scale computer，思路是将同类型的硬件元素（例如 CPU、内容）组合在一起，当应用用到对应的资源时，例如需要 GPU 加速时，才会分配对应的资源。同理，可以用在硬盘或者一些自定义的加速器上面。这个概念类似于将一个数据中心看做一台计算机，来提升资源的利用率。

![](https://img.serverlesscloud.cn/2020924/1600938805922-image054.jpg)            

针对 Warehouse-scale computer 的硬件开发已经在持续进行中了，因此 Serverless 也应该考虑下在这种集群模式下，怎样适配和使用这种集群模式。而且这也将对当前针对单机的应用开发模式做出改变。

> 参考文献：
> - [FireBox: A Hardware Building Block for 2020 Warehouse-Scale Computers](https://www.usenix.org/conference/fast14/technical-sessions/presentation/keynote)
> - [FireBox:	A	Hardware	Building	Block	for	the	2020	WSC](https://www.usenix.org/sites/default/files/conference/protected-files/fast14_asanovic.pdf)


## Serverless 方向预测 

接下来，我将阐述下 Berkeley 对 Serverless 计算未来方向的预测。早在 2009 年，Berkeley 就对云计算的未来做过一次预测。回看当时的分析，发现有些预测是正确的，例如无限大的资源池，无需为前期使用付费等。同时，有一些预测并不那么准确，因为当时的我们并没有看到云计算将进入第二阶段，即 Serverless 阶段。

![](https://img.serverlesscloud.cn/2020924/1600938811964-image056.jpg)            

**以下是我们对 Serverless 计算的预测：**

1. 特定应用场景及通用场景将会成为使用 Serverless 计算的主流。如下图所示，云服务商负责的是粉色区域的部分，而用户只关心粉色区域的上层。在特定应用场景下，你可以在弹性伸缩的平台中实现特定的操作，例如写数据库、实时数据队列、或者机器学习等。这些场景中，用户业务代码需要在遵循平台限制，例如运行环境、运行时长、没有 GPU 加速等，当然这些限制也会随着技术成熟而逐步放宽，从而更好地支持这些场景。

2. 另一种则是更通用的 Serverless 架构，在这种场景下，你的 FaaS 函数会被其他 BaaS 服务所拓展，例如 Starburst、缓存等服务；并且有对象存储或文件存储可以用于长期存储状态信息。之后，在此基础上，用户可以自定义一些软件服务，例如提供 SQL 的能力等，并且将对应的应用运行在上面，从而实现流数据处理、机器学习等各种场景。

![](https://img.serverlesscloud.cn/2020924/1600938815007-image058.jpg)            

通用的 Serverless 几乎能够支持任何应用场景，从底层架构上来看，所有能运行在服务器上的场景，都可以被视为通用 Serverless 场景支持。

![](https://img.serverlesscloud.cn/2020924/1600938817663-image060.jpg)            

3. 我们认为在未来，Serverless 架构比服务器在成本上会更有竞争力，当你用了 serverless 架构时，就已经获得了高可靠，弹性扩缩容的能力。此外，Serverless 的计费模式会更加精确，资源利用率也将逐步提升，确保做到真正的按需使用和付费。因此相比预留资源，在价格上会更有竞争力，更多的人也会因此选择 Serverless 架构。

![](https://img.serverlesscloud.cn/2020924/1600938819754-image062.jpg)            

4. 此外，云服务商会针对机器学习场景做优化，包括性能、效率和可靠性等方面。云服务商会提供一些类似工作流调度，环境配置等能力来实现该场景的支持（例如预置内存）。通过这些上下游能力，也可以进一步帮助通用场景下的平台性能得到提升。


![](https://img.serverlesscloud.cn/2020924/1600938824112-image064.jpg)            

5. 最后，是各类硬件方面的发展。当前云计算已经强依赖 X86 架构，但 Serverless 可以考虑引入新的架构，从而让用户或云服务商自行选择最适合的硬件来处理任务，从而实现更高的利用率和更强的性能。

![](https://img.serverlesscloud.cn/2020924/1600938846349-image066.jpg)            

## 总结 Summary

首先，我们认为 Serverless 计算是云计算的下一个阶段。而 Serverless 最重要的三个特征是：隐藏了服务器的复杂概念、按需付费和弹性伸缩。此外 Serverless 的实现是由 FaaS 和 BaaS 共同组成的（参考上面的经典案例）。直观来说，Serverless 带来的转变就像租车到打车一样。

此外，还分享了几个当前学术界针对 Serverless 的研究方向。包括效率提升（性能、可用性等）、具体应用的抽象（例如机器学习，数据处理等），和通用层面的抽象（让 Serverless 支持更加通用的场景）。

Serverless 计算可能会改变我们对计算机的看法，摆脱了本机硬件的限制，你可以直接从云端获取无限的资源，随取随用。

![](https://img.serverlesscloud.cn/2020924/1600938854355-image068.jpg)

---

欢迎访问：[Serverless 中文网](https://serverlesscloud.cn/)，您可以在 [最佳实践](https://serverlesscloud.cn/best-practice) 里体验更多关于 Serverless 应用的开发！