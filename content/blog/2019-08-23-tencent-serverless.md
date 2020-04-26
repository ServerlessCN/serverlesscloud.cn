---
title: 腾讯云 Serverless 技术演进
description: 本文将从产品层面来介绍腾讯云是如何落地 Serverless 技术以及 Serverless 的技术演进
keywords: Serverless
date: 2019-08-23
thumbnail: https://img.serverlesscloud.cn/2020414/1586849656143-%E5%B0%81%E9%9D%A2%E5%9B%BE.png
categories:
  - news
authors:
  - 孔令飞
authorslink:
  - https://zhuanlan.zhihu.com/ServerlessGo
tags:
  - 技术演进
  - serverless
---

> 注：本文整理自上周六举办的「Hello Serverless」技术沙龙深圳站演讲内容，讲师是腾讯云 Serverless 产品架构师孔令飞，文末提供了讲师演讲 PDF 的下载，回复「Serverless 深圳」免费可得。

## 前言

Serverless 是一项新技术，可能有朋友不是很熟悉。所以我们先介绍下 Serverless 的概念和发展历史，接着介绍腾讯云 Serverless 从 1.0 到 2.0 的技术演进，以及我们如何支持 Serverless 这种技术的，也就是技术生态。最后再介绍下 Serverless 的应用场景和具体的应用案例。

## Serverless：云计算新趋势

这是 Serverless 目前的发展情况。

![](https://img.serverlesscloud.cn/qianyi/YHl6UWa9s61J3ao4WkaF3iaqVnxFmCvgZpSqI96icwoic2ZLx6NSTH9xicBCv9xic5MSsa95jzpP53Iv9RpEfKfOOMQ.jpg)

最近几年，微服务和 k8s 很火。上图可以看到 Serverless 跟他们的热度对比，其中蓝色曲线是 Serverless 的热度曲线图。从 2016 年开始，Serverless 的热度是要大于微服务和 k8s 的。

Serverless 最初在 2010 年被提出，2014 年 AWS 推出了 lambda 服务，把 Serverless 产品化，并收到了很好的效果，微软、Google 和 IBM 看到后，也分别在 2016 年推出了自己的 Serverless 产品：Azure function、GCP 和 OpenWisk。阿里云和腾讯云也分别在 2017 年推出了自己的 Serverless 产品，腾讯云要早阿里云一天推出。

在 2018 年，我们联合微信，推出了基于 Serverless 的产品小程序云开发，用来协助用户快速的开发小程序。在 2019 年，我们推出了 Serverless 2.0 产品，后面会介绍 Serverless 2.0 和 Serverless1.0 在技术形态及计算资源上的区别。

## 什么是 Serverless

Serverless 直译过来就是无服务器，无服务器并不代表 Serverless 真的不需要服务器，只不过服务器的管理以及资源分配部分对用户不可见，由平台开发商维护，用户只需要关注业务逻辑的开发即可。Serverless 不是具体的一个编程框架、类库或者工具，它是一种软件系统架构思想和方法。它的核心思想是用户无须关注支撑应用服务运行的底层资源，比如：CPU、内存和数据库等，只需要关注自己的业务开发即可。

那么 Serverless 为什么这么火？

从云计算的发展阶段说起，一开始是 On-Premise 层，接着是 IaaS 层，之后再到 PaaS 层。最后是 FaaS 层，Serverless 就是在这一层。

![](https://img.serverlesscloud.cn/qianyi/YHl6UWa9s61J3ao4WkaF3iaqVnxFmCvgZhHTKPASqenqBceZTY9C1LqKQfS6Y2WS6wfOJeQljx5DyCqAaNmJ1Vg.jpg)

在软件研发领域，绕不开的 2 个环节是软件的部署和运维。如果我们要上线一个业务，在 On-Premise 阶段，需要购买物理服务器，可能还需要自建机房、安装制冷设备、招聘运维人员，然后再在上面搭建一系列的基础设施，比如：虚拟化、操作系统、容器、Runtime，Runtime 可以理解为像 Python、golang、Node.js 这类软件。接下来我们要去安装软件类的开发框架。最后，我们才会去编写我们真正需要的业务函数。

到了 IaaS 层这一阶段，云厂商维护了硬件和虚拟化这 2 个基础设施，到了 PaaS 层云厂商又维护了 OS、容器和 Runtime，然后到了 FaaS 这个阶段，用户只需要关注 Function，也就是只需要关注自己的业务逻辑。可以看到随着阶段的演进用户需要关注的点越来越少，越来越聚焦于自己的业务逻辑。所以在 On-Premise 阶段我们开发一个业务可能需要 8 个人，在 FaaS 阶段，我们只需要 2 个业务，节省的人力可以投入到业务研发这块儿，提高产品的迭代速度，进而提高产品竞争力。

过去十多年，云计算其实是一个「去基础架构」的过程。这个过程可以让用户聚焦于自己真正需要的业务开发上，而不是底层的计算资源上。Serverless 符合云计算发展的方向，是云的终极形态，这种特有的模式使 Serverless 存在潜在的巨大价值。

## Serverless 2.0 组件架构

这张图描述了 Serverless 的组件架构。最底层是基础设施层，底层计算资源我们用到了 docker 和轻量化虚拟机技术，其中 docker 是 Serverless 1.0 的计算资源展现形态，轻量化虚拟机是 Serverless 2.0 的计算资源展现形式，相比于 docker，轻量化虚拟机性能得到了非常显著的提升，可以在几毫秒就可以启动一个业务进程。在最底层我们也做了双活，并且对底层资源做了严格的安全保护。

![](https://img.serverlesscloud.cn/qianyi/YHl6UWa9s61J3ao4WkaF3iaqVnxFmCvgZ43VBL0icvWE5fn17LWYAjsibv6KW9Lovw4FaL5djy4yibD7nf8Aaicmia3A.jpg)

再上一层就是资源管理层，比如说我们有集群监控，监控我们的集群监控状况，如果有集群不可用，会立马安排运维人员去排障。当然了，我们底层是有双活的，当一个集群出故障的时候，我们可以把流量切换到另一个集群，用户是无感知的，也不会影响用户的请求。这一层我们有专门的自动扩缩容算法，来应对用户的请求变化。

再往上，我们有认证和授权系统，通过认证和授权来保证函数的安全。最上面就是接入层，接入层主要用来触发 Function 的调度和分配。接着往上是架构层，主要用来做一些流程上的调度。最上面这 2 层是用户需要关心的，用户主需要关注自己的业务代码，以及跟数据库，存储等的调用，还有自己使用的一些框架，其它底层的设施用户完全不用关心，全是由云厂商来提供专业的保障和维护。

我们还提供了很多外围的工具系统，来支持用户的研发、部署和排障。比如：DevOps 支持，日志、监控、告警支持。后面会有介绍。

## Serverless 2.0 技术形态

如图，左边是 Serverless 1.0 的技术形态，右边这部分是 Serverless 2.0 的技术形态。1.0 的时候，只有 event function，event function 是基于事件驱动型的，大概意思就是外界触发一个事件给 Serverless 平台，Serverless 平台收到触发事件后会调用函数并传入触发事件数据和参数信息，函数内部做业务逻辑处理之后返回给调用方。event function 可以对接多种云上的产品，比如：api 网关、ckafka、cmq、cos 等。

![](https://img.serverlesscloud.cn/qianyi/YHl6UWa9s61J3ao4WkaF3iaqVnxFmCvgZ2DhkfU9vb8sTQic2tC6tg5URCqCrKjhhr12YWIurp7KXI4Bheq4PmKQ.jpg)

event function 是一种开发模式，要求业务将业务逻辑拆分成 function 这种粒度，这种方式国外接受程度比较高，但是国内很多用户都还停留在 HTTP 这个阶段，为了能够方便现有的业务迁移到 Serverless 平台，适配现有业务的调用方式以及扩展 serverless的使用场景，我们又开发了 2 个新的技术形态，http function 和 http service。

http function 这种形态可以理解为通过 HTTP 请求来触发函数的运行，通过 HTTP Request 传递参数，通过 HTTP Response 来返回参数。同时在创建 HTTP Function 的时候会自动生成外网域名，供用户直接调用。

event function 和 HTTP Function 都是只有在请求的时候才会调用，函数完成之后便不再运行，也就是不再占用资源，换句话说不用再为这些资源付费，后面会有一页 PPT 介绍，serverless 是如何节省资源，以及跟 CVM 比 Serverless 这个技术的价格优势在哪里。

接着介绍一下 HTTP Service，Service 这种形态可以理解为我们通常意义上的 HTTP 服务，简单理解就是把 HTTP 服务的运行环境从物理机或者虚拟机或者容器换成 Serverless 计算资源。这种形态服务进程常驻，不限制运行时间，因为服务进程常驻，所以它一直在监听请求，所以请求延时更低。因为 service 这种形态，跟我们现在的服务运行方式是一致的，所以业务可以无缝迁移到 Serverless 平台上，不需要做过多的改造。同时在用户创建 service 之后平台会自动创建一个外网域名供调用。

3 种形态各有使用场景。比如：event function 适合基于事件触发型的请求，比如：cos, ckafka, cmq， api 网关，也适合用完即走的请求。http function 适合期望函数以 http 请求的方式调用的场景，http service 适合期望服务以 HTTP 服务持久监听请求的场景。

到 2.0 的时候我们跟友商已经形成了一个差异，像 AWS 和阿里的 FaaS 还停留在这个阶段，这边业界有个比较好的产品叫 Google Cloud Run。所以我们跟其他友商的优势是他们是割裂开的 2 款产品，我们把他放到同一个入口了，更方便用户去使用。

## Serverless 2.0 运行过程

这两种技术形态，又是如何支持用户请求的呢？

![](https://img.serverlesscloud.cn/qianyi/YHl6UWa9s61J3ao4WkaF3iaqVnxFmCvgZiaMstyt8BtmFE0MJmS9P4lia1hicvIBE6HJeIFlh2VpxkCPW8jYzyVc3w.jpg)

如果一个用户想用云函数，首先要在本地做开业务开发，目前用的比较多的是 VS Code IDE，当研发把代码和依赖编码完成后通过我们提供的 VS Code 插件可以很方便的把代码部署到我们的平台上，或者通过我们提供的 SCF 命令行工具，也可以很方便的把代码部署到云端，也可以通过我们的控制台进行代码提交。这是我们的云函数平台，分为 function 和 service 2 种形态。因为他是一个完整的业务逻辑，势必会用到像数据库，对象存储这些服务，云函数已经把相关产品的 sdk 内置到我们的 runtime 中了，用户在使用这些后端服务时，直接 import sdk，然后掉 SDK 相关接口即可，用起来会更方便一些。后端的这些服务在 Serverless 中统一称为 BaaS (Backend as a Service)。也就是把像数据库，对象存储等能力统一通过 API 的形式供用户使用，至于这些组件的高可用，扩缩容也不需要用户去关心，用户只需要去使用即可。

用户把业务逻辑部署完成之后，可以通过终端去发起请求，比如浏览器、安卓或者 IOS，Serverless 提供不同的触发方式，比如 HTTP，也就是通过 HTTP 请求来直接触发。通过 COS 触发，举个简单的例子，用户把一张图片上传到 COS 平台，COS 平台收到用户上传图片的时间后，会去请求配置的云函数，并且传入事件的数据，和用户自定义的数据，业务在云函数中通过解析这些数据和参数完成业务逻辑。

当请求来的时候，我们平台会根据请求量的大小，去自动或缩容。像 Function 这种，我们会瞬时拉取足够的函数实例来满足所有的请求，我们有一个调度层，会根据请求量的大小来判断需要起多少个 function 实例，同时我们也有一套算法，根据用户每天的请求情况，提前创建好一些资源，当用户请求过来时，直接将请求切换到已经创建好的资源上，减少请求延时。像 Service 这种，我们也会根据请求流量动态的做水平扩容，业务无须感知。

## Serverless 2.0 技术生态

Serverless 更多的是解决计算资源的按需分配，无须运维，但如果想真正在 Serverless 平台上跑业务，还需要其它系统的支持，来满足业务对开发、运维和排障的需求。我们从开发者工具，DevOps、监控运维 3 个方面，来介绍下我们是如何支持函数的研发、运维和排障的。

![](data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==)

**开发者工具**

首先来介绍下开发工具，为了支持开发者能够方便高效的开发和部署云函数，我们开发了一系列的工具，比如：我们提供 VS Code 插件，通过 VS Code 插件，开发者可以很方便的通过 IDE 直接部署、更新和调试云函数。我们也提供了 Web IDE 来方便用户直接在网页开发代码。此外我们还提供 CLI 工具，通过 CLI 用户可以在终端很方便的通过命令调用完成诸如配置、部署、调试、调用等功能。最后我们还提供 API 接口来满足用户对自动化和定制化的需求。最后我们还提供 SDK 供用户更方便的调用云函数的接口。所以可以看到要将 serverless 产品化，还需要做很多其它工作来支撑 Serverless 这个技术，尤其是工具这块儿。

**DevOps 支持**

除了开发者工具，我们也提供完善的 DevOps 支持，从最佳实战，到工作流，到工具链，以及产品打通，我们都提供了很多方案和支持。

比如工作流这里，我们支持编码、构建、打包、部署、测试和发布等一系列流程。在工具这里，我们提供了：CLI、应用模型等。产品这里，我们打通了很多产品供用户很方便的跟这些产品进行交互，利用这些产品提供的能力，比如：Git 仓库，API 网关，Serverless DB 等。这个是 DevOps 支持。

**日志**

日志这里我们支持 2 种日志查询方式，方便用户查看日志。在 scf 控制台上，能够查看函数调用成功与否，各阶段的调用时间，以及用户打印在日志或者标准输出的日志，支持用户按 RequestId 去搜索日志。另外我们还支持用户将日志输出到腾讯云日志服务系统，将日志持久化存储，在日志服务系统中，用户可以根据正则表达式来搜索日志，也可以自定义检索规则，方便下次检索。

**监控**

我们提供 3 个维度的监控。提供本月调用次数、本月资源量、本月出流量的监控。提供按地域划分的调用次数、运行时间、错误次数、并发个数、受限次数监控，这些监控指标都是用户很关心的指标。另外我们也提供函数级别的监控：：调用次数、资源超过限制次数、函数执行超时时间、内存超过限制次数等监控指标。所有这些监控指标都可以在腾讯云监控系统上配置告警。

**性能监控**

我们还提供一些更高阶的监控，现在在启动开发，大概在 8 月底或者 9 月初的时候会发布。我们会提供函数与函数之间的调用链追踪，展示每个调用节点函数的执行情况、函数执行的性能分析，以及支持对失败函数进行流量重放。所谓的流量重放，就是说，我们会把调用失败的函数放在 DLQ 队列中，用户可以很方便的从 DLQ 队列中重试该失败的函数，方便用户 Debug。

**计费模型**

之前有提到过，我们会有一页 PPT 来专门分析下 Serverless 下的计费模式和优势。Serverless 平台下的计费按如下 3 个维度进行计费：

1. 资源使用费用：（资源使用量 - 免费资源额度） X 资源使用单价
2. 调用次数：（函数调用量 - 免费调用额度） X 调用次数单价
3. 外网流量费用：外网出流量 X 流量单价

但是这种比较难理解，所以我们一般会跟 CVM 进行对比：如果用户部署业务，需要购买 CVM，可能需要 10 台 CVM，那对计算资源的投入就是这条黄线，相当于计算资源一直在使用这些计算资源。对于云函数来讲，当没有请求的时候是不占用计算资源的，不会产生任何费用，只有请求的时候才占用计算资源，白天会有个波峰，晚上会有个波谷，大部分业务都是这种模式，可以看到这些阴影面积就是云函数的实际使用资源，我们只会对这些阴影面积进行收费。

这个是跟 CVM 的计费对比，当资源使用率小 60% 的时候 serverless 下的费用比 CVM 小很多，一般业务很难达到资源使用率 60%，能达到 30% 就已经很不错了。

## Serverless Event Function 应用场景

这里介绍一下应用场景，先介绍下 event function 的应用场景，通过这张图，我们可以看到，云函数可以作为浏览器、APP 和小程序的后端服务。通过我们提供的不同触发器可以支持不同的场景，比如通过 API 网关触发器，可以匹配 websockt 的应用场景，通过 cos/cmq/ckafka 触发器可以支持像：消息处理、流失计算，事件通知这类的应用场景。

![](https://img.serverlesscloud.cn/qianyi/YHl6UWa9s61J3ao4WkaF3iaqVnxFmCvgZPbVP2vWOoRAgmnCkFrab3O3goXUHuPf0MFz8QJiaImiaicjrqZpnibEH6A.jpg)

## Serverless HTTP Service 应用场景：BFF

刚才那个是比较简单的一个 Demo，这个就是一个比较复杂的场景。假设我有一个 APP 应用跨多端的，比如 Android，iOS，Web。如果想写后台的话，我可能要写多个接口，去适配不同的终端。这样如果后端有变更，需要去更改 3 个终端的 API 接口，与此同时，当我们需要对一个字符串进行处理，如限定 140 个字符的时候，我们需要在每一个客户端（Android，iOS，Web）分别实现一遍，这样的代价显然相当大。。现在有一个比较流行的解决方案就是在前后端加一个 BFF 层（Backend For Frontend）将前后端解耦，这里是 BFF 层可以承载的能力比如：身份校验，日志记录，数据组合等。BFF 一般由前端工程师去编写，适配不同的后端当后端有变更的时候，只需要改 BFF 层就可以，不用去更改客户端。BFF 层可以部署成 HTTP Service，也就是可以直接利用我们提供的 HTTP Service 技术形态来部署。通过 BFF，可以让前端工程师变成全栈工程师，开发不用去关注底层的资源。

## Serverless 助力微信小程序云开发

这个是小程序云开发了，是腾讯云和微信合作的一个标杆场景。左边是传统模式，首先是小程序前端，后面对应一个后端，这个后端可能是一个 API 服务器，后端又对接了很多其它子系统比如：数据库、存储、负载均衡、网络、容灾等。需要考虑很多因素，但是用云开发，就可以简化成右边这种架构，前端页面，然后到微信后台，微信后台会走专线的形式，将用户的请求转到 Tencent Cloud Base 组件，简称 TCB，TCB 后边挂接了数据库、存储、网络、容灾等系统，后端这些都不需要工程师去考虑，全都有 TCB 进行对接。TCB 相对纯云函数来讲它屏蔽了更多的东西比如：云函数、存储和数据库，做小程序开发会更简单。

![](data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==)

接下来我们看下 serverless 的具体落地情况。

## Serverless 助力腾讯六大业务线

这里先介绍下腾讯云 serverless 产品在内部的使用情况。目前在腾讯内部已经有大量业务在用，比如微信小程序云开发底层用的是 serverless 做计算资源，企业微信的机器人。QQ 小程序相册，腾讯新闻底层也用到了 serverless 等。

![](https://img.serverlesscloud.cn/qianyi/YHl6UWa9s61J3ao4WkaF3iaqVnxFmCvgZjbjQngvd1UFOzETIhWgo2icHUv86tjjvHwQBQ5r3iapoiaaUofmOr8Srw.jpg)

**客户案例 - 腾讯地图：100 亿条消息/天**

这个是腾讯地图的客户案例，走的是 event function 这种方式。场景是这样的：用户在访问腾讯地图时会产生一些数据库，腾讯地图会将这些数据进行整理并保存到 Hbase 和 ES 上，然后再配上一个 UI 用来查询数据。当用户产生一条数据时，会将这条数据放在 kafka 队列中，kafka 触发后端的云函数，云函数做数据处理之后又将数据放入 kafka 队列中，由另外一个进程从 kafka 队列中取走处理后的数据，放入 ES 和 Hbase 中。

**客户案例 - 企业辅导背单词**

企业辅导背单词没有用云开发那一套去做这个小程序，是因为他有多端，有 QQ 小程序，有微信小程序。这个是企业背单词的逻辑架构，这边是小程序的功能侧，这边是管理后台，它所有跟后台的交互都是用 API 网关去跟后端的 Function 交互，然后后端的 Function 去跟后端的 BaaS 交互。这个是背单词的的技术架构，小程序端会实现听、读、学习等逻辑，小程序端调用后端的 Function 会去完成鉴权、语音合成、学习记录存储等工作。像语音合成是直接调用 Baa S层的 AI 接口，学习存储是直接调用 BaaS 层的数据库接口把单词等信息存入数据库的。

**客户案例 - 腾讯相册小程序**

这个是小程序的案例，去年发布小程序云开发的时候，这个是我们第一家用户，也是调用量最大的，这个小程序是把腾讯相册和 QQ 空间做了打通，在微信端用相册小程序，就可以把原来放在空间的相册、图片下载出来，也可以在手机端去做一些图片的上传和分享等，相册小程序用户量是比较大的，目前的注册用户是 1 个亿，月活 1200 万，如果用传统的形式去实现，他要搭业务集群，域名备案，负载均衡，监控，包括日志，会话管理还有数据库，它全部都要自己搞一套，比较复杂。当时他们选云开发时因为他们人力不够，包括测试、研发人力都不够，就几个前端工程师。用云开发之后，架构就比较简单了，微信端开发完之后，然后到业务集群，业务集群就相当于后端的云函数，去写业务逻辑，最后到数据库，对象存储。

这个小程序最初是一个前端工程师花了 2 周时间写了一个 Beta 版本，基本上就把相册的上传下载分享等逻辑全部写好。

## Serverless 带来的用户价值

业务迁移到 serverless 平台可以带来如下价值：

1. 用户不需要去购买和维护计算资源，并且不需要关注高可用、负载均衡等问题，用户只需要去编写数据处理的业务代码即可
2. 我们天然的支持了基于ckafka的触发器，用户不需要再去实现这一套逻辑，节省了很多工作量
3. 资源按需分配，只有用户浏览地图的时候才会触发底层资源的分配
4. 借助于云的能力，我们提供了非常大的资源池，用户不需要去担心后台计算资源的问题

---

> **传送门：**
>
> - GitHub: [github.com/serverless](https://github.com/serverless/serverless/blob/master/README_CN.md) 
> - 官网：[serverless.com](https://serverless.com/)

欢迎访问：[Serverless 中文网](https://serverlesscloud.cn/)，您可以在 [最佳实践](https://serverlesscloud.cn/best-practice) 里体验更多关于 Serverless 应用的开发！
