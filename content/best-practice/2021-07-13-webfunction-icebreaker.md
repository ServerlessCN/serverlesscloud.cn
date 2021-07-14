---
title: 再探 Web Function - 用数据阐释优势
description: 开发者编写或迁移一个 Web 服务到 Serverless，那么腾讯云 SCF Web函数 就是你的首选！
date: 2021-07-13
thumbnail: https://main.qcloudimg.com/raw/6dc736d735e24b2e9c0d6109db24c771.jpg
categories:
  - best-practice
authors:
  - icebreaker
tags:
  - Serverless
  - 云函数
---



*以下内容来自「腾讯云 Serverless Web Function」征稿活动的用户原创稿，已获得授权。*



## 01. 前言

最近腾讯云 SCF 云函数 , 公测了 Web 函数 ，这种函数类型专注于 Serverless Web 服务场景。

相比于原先的事件 (Event) 函数 , Web 函数转换链路短，性能损耗也较低。

- 原先 Even t函数：ApI 网关 HTTP 请求转换成 SCF 函数事件，事件再在 SCF 内部转化成 HTTP 请求交给 Web 框架处理；

- 现在 Web 函数：在 API 网关那里，直接把 HTTP 请求透传了。函数可以直接通过 HTTP 请求触发，这造就了它在 Web 场景的天然的优势。

在此，笔者针对 **相同代码** 的 `Event 函数` , `Web 函数`， 部署了 **`8`** 个用例，不断提升并发量进行压力测试，以探究不同的函数类型和 Runtime 对 `QPS`,`TPS`,`Latency` 的影响。



## 02. 测试用例

1. **`[event-node10]`** : 使用 `serverless express` 部署的一个 `node10.15` event 类型 SCF；
2. **`[event-node12]`** : 使用 `serverless express` 部署的一个 `node12.16` event 类型 SCF；
3. **`[web-node10]`** : 使用 `serverless scf` 部署的一个 `node10.15` web 类型 SCF；
4. **`[web-node12]`** : 使用 `serverless scf` 部署的一个 `node12.16` web 类型 SCF；
5. **`[web-custom-image-node10]`** : 使用自定义镜像 `node10` 部署的一个 web 类型 SCF；
6. **`[web-custom-image-node12]`** : 使用自定义镜像 `node12` 部署的一个 web 类型 SCF；
7. **`[web-custom-image-node14]`** : 使用自定义镜像 `node14` 部署的一个 web 类型 SCF；
8. **`[web-custom-image-node16]`** : 使用自定义镜像 `node16` 部署的一个 web 类型 SCF；

> 注：使用的 Web 框架为 `nodejs` 最泛用的 `Express`，只含有计算不含 `IO`操作 ， 自定义镜像的 `node.js` 都使用的 `alpine` 版本。



其中，函数的预制并发实例都为 `10` , 并提前做好 `warm up`，内存都为 `128MB` (自定义镜像不同，有自己的[内存规则](https://link.zhihu.com/?target=https%3A//cloud.tencent.com/document/product/583/56051))，本地压测代码都是相同的配置：

- 每个函数压测时间为 `10s` , 并发数以 `10` 为一梯度，累加到 `100`。`Fire Request` 为 Get 请求。



## 03. 测试结果数据图表

> 本图表可交互 (建议用 PC打开，笔者没有做移动端兼容)
>
> - 访问地址：https://icebreaker.top/chart/scf-event-vs-web-vs-custom-image/



**1. 平均 QPS (Avg Req/Sec)**

- **Req_Sec 平均折线图**

从下方折线图中，我们可以看出，随着并发量的增加, 每秒处理过的请求一直在提升。同时也能看到 Web 函数随着并发量变大，逐渐和 Event 函数，拉开差距。

<img src="https://main.qcloudimg.com/raw/6b29f80c319ceb053c28a298c031ad93.png" width="700"/>



- **Req_Sec 平均累加柱状图**

从下方累加柱状图中，可以明显看出 Web 类型的平均 QPS 同比 高于 Event 类型。其中 Runtime 使用 Node12 也比 Node10 高一点点，可能高版本的 Node.js 做了一些优化吧。

 <img src="https://main.qcloudimg.com/raw/8a28dbb7bebbf1cd1f27bca725231a3b.png" width="700"/>




**2. 平均 TPS (Avg Bytes/Sec)**

- **Bytes_Sec 吞吐量 (KB) 平均折线图**

从下方折线图中，我们可以看出，随着并发量的增加，吞吐量也一直在提升。同时也能看到 Web 函数随着并发量变大，也逐渐和 Event 函数，拉开差距，不过这个差距相比 QPS 要小很多。

<img src="https://main.qcloudimg.com/raw/bb1001fe21f9f90652ff753c8bb28ac8.png" width="700"/>



- **Bytes_Sec 吞吐量 (KB) 平均累加柱状图**

从下方累加柱状图中，可以明显看出 Web 类型的平均 TPS 高于 Event 类型，但差距相对来说不是那么大。同样 Node12 也比 Node10 高一点点。

<img src="https://main.qcloudimg.com/raw/1aa3e32ca5516eaf816857a0033de95a.png" width="700"/>



**3. 平均延迟 (Avg Latency)**

- **Latency 延迟平均折线图**

从下图中，我们可以明显看出，随着并发量的增加, 延迟并没有增加，逐渐趋于稳定。平均延迟都在 `30-50ms` 左右，其中 Web 类型的平均延迟，也明显要比 Event 类型要低。

这意味着，函数响应用户请求也更快，同样 Node12 也比 Node10 稍稍快一点点（可忽略不计）。

<img src="https://main.qcloudimg.com/raw/c11d832440eca08d676de1d22031684e.png" width="700"/>



## 04. 总结

**1. 性能的提升**

1. SCF 单个函数 承受的并发量，和 QPS，TPS 正比例相关（自动伸缩扩容）；
2. Web 函数和 Event 函数相比, 在处理 HTTP 请求上, 随着并发量的增长，优势越大；
3. Web 函数处理 HTTP 请求的延迟比 Event 函数 更低；
4. Node.js 的 Runtime 版本也有影响，Node.js12.16 在各方面数值均优于 Node10.15；



**2. 开发者体验的提升**

**Web 函数 也大大提升了，我们开发者在本地的开发和调试体验。**

- **Before**

我们原先部署一个 Event 函数 来处理 http请求 , 往往需要写代码来导出一个某某框架实例(比如`express`,`koa`,`nuxt`,`next` ...) 交给 Serverless 组件进行部署，然而不同的 Web 框架，往往部署时需要不同的垫片（事件转化 HTTP），这导致了「Event 函数」和「Serverless 组件」的高耦合度。

- **After**

而 Web 函数 就不需要和 那些 Web 框架 做强关联了， 它只需要被告知一个监听的端口号，不在乎我们开发者到底使用什么框架来 Host 我们的 Web 服务。我们可以随意在本地安装任何的框架进行部署，而不用再去寻找对应框架的 Serverless 组件了。

同时，它对于部分现有系统的迁移非常的友好，甚至可以简单到，只改个监听端口号，就能一键式部署上云，减少了大量花在运维部署上的时间。



这么看来 Web 函数 也是一次革命！

它让那些原先基于 event 的 Serverless Components Web 组件们变得 `useless` ，是时候抛弃他们，拥抱 Web 函数了。



一句话概括：

假如我们开发者要 **编写** 或 **迁移** 一个 Web 服务 到 Serverless ，那么腾讯云 SCF `Web函数` 就是你的首选！



### 附言

> 笔者非专业的测试，所有测试结果仅供参考，也欢迎专业人员提供建议和意见。
>
> 此次也测试了一下 `Web 函数 + 自定义镜像` 的方式部署，不过测试结果比较杂乱，没找到规律,后续会针对这个场景进行进一步的测试。
>
> 新技术是飞速发展的，本文写于 2021.07.08 ，存在一定的历史局限性，如一定时间后，结果有所不同，也难免正常。



### 相关链接

[部署代码和压测代码](https://link.zhihu.com/?target=https%3A//github.com/sonofmagic/tencent-web-function-benchmark)

[图表地址](https://link.zhihu.com/?target=https%3A//icebreaker.top/chart/scf-event-vs-web-vs-custom-image)

[基于 event 的serverless components web 框架地址](https://link.zhihu.com/?target=https%3A//github.com/serverless-components/tencent-framework-components)



## Web Function 体验官招募令

[**惊喜福利满满，点击查看活动详情**](https://mp.weixin.qq.com/s/YLIknQmXDKL9FzHEQlKQCQ)

<img src="https://main.qcloudimg.com/raw/545c2c8589959c675b8c501e8b41e363.png" width="700"/>



## **Web Function 使用体验**

- Web Function 产品文档：

  https://cloud.tencent.com/document/product/583/56123

- Web Function 快速体验链接：

  https://console.cloud.tencent.com/scf/list-create?rid=16&ns=default&keyword=WebFunc



当前已在国内各大区域发布上线，欢迎体验使用！

<img src="https://main.qcloudimg.com/raw/4ee70db1b518d4c0064711d1caf1572c.jpg" width="700"/>



---

> **传送门：**
>
> - GitHub: [github.com/serverless](https://github.com/serverless/serverless/blob/master/README_CN.md)
> - 官网：[serverless.com](https://serverless.com/)



欢迎访问：[Serverless 中文网](https://serverlesscloud.cn/)，您可以在 [最佳实践](https://serverlesscloud.cn/best-practice) 里体验更多关于 Serverless 应用的开发！