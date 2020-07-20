---
title: 从零到一，Serverless 平台在滴滴内部落地
description: 本文整理自 ServerlessDay · China 大会，讲师为滴滴弹性云平台负责人张健、滴滴资深前端开发工程师陈钦辉。滴滴 Serverless FT 成员来自：滴滴基础平台部、车服技术部、金融事业部、普惠产品技术部。
keywords:  Serverless, ServerlessDays, Serverless实践
date: 2020-07-17
thumbnail: https://img.serverlesscloud.cn/2020720/1595231990326-1594107290027-%E6%BB%B4%E6%BB%B4.jpg
categories: 
  - news
authors: 
  - 张健/陈钦辉
tags:
  - ServerlessDays
  - Meetup
---

> 本文整理自 ServerlessDay · China 大会 - 《从零到一，Serverless 平台在滴滴内部落地》分享，讲师滴滴弹性云平台负责人张健、滴滴资深前端开发工程师陈钦辉。滴滴 Serverless FT成员来自：滴滴基础平台部、车服技术部、金融事业部、普惠产品技术部。

## 为什么（前端）要推动建设 Serverless

- 更快地创建一个服务且免运维：大量的 Node.js 服务，创建服务，需要申请节点、申请机器，对接构建、部署、日志、监控，还要持续运维服。我们希望能更快创建一个服务并且免运维。
- 更灵活的隔离能力：前端 BFF 接口聚合、微前端等业务场景，需要创建大量的接口服务，快速创建服务的同时，还希望可以以不同粒度灵活进行接口间的隔离。
- 更低的成本：大量低峰期时间cpu/内存利用率很低，服务不再使用了，资源却仍然占用。

![](https://img.serverlesscloud.cn/202077/1594108194995-%E4%BC%81%E4%B8%9A%E5%BE%AE%E4%BF%A1%E6%88%AA%E5%9B%BE_15941081788086.png)

## 我们的方案

我们调研了业界的 Serverless 方案，最终决定了自己的方案： K8s + Knative + Istio 搭建应用级 Serverless。他的优势是：

- 社区相对繁荣，未来充满希望。
- 应用级 Serverless, 和传统通过 Docker 镜像开发，部署相近，现有服务迁移成本低。
- 应用级 Serverless, 通过 Serverless。 路由，可以灵活控制隔离的粒度。

![](https://img.serverlesscloud.cn/202077/1594108195018-%E4%BC%81%E4%B8%9A%E5%BE%AE%E4%BF%A1%E6%88%AA%E5%9B%BE_15941081788086.png)

## 通过 Serverless 升级研发模式

那有了 Severless 基础能力，如何通过他来升级我们的研发模式呢？

- 我们提供 npm 包打通公司的基础能力，包括数据存储相关、通信相关
- 上层封装层 各种框架的中间件
- 再上层是面向业务领域的框架，express/koa/以及我们基于egg打造的degg框架，他一定程度上方便了从零到一创建一个公司内部标准的服务。
现在我们称之为面向 Serverless 的高级模式，业务同学可以更专注于业务编码，简单、高效完成这么一个日常开发迭代的流程

![](https://img.serverlesscloud.cn/202077/1594108194989-%E4%BC%81%E4%B8%9A%E5%BE%AE%E4%BF%A1%E6%88%AA%E5%9B%BE_15941081788086.png)

## Serverless 全局图 - 研发视角

从研发视角看下，整个 Serverless的全局，自上而下是：

- 业务场景解决方案 ，基于 Serverless 平台，在Serverless-cli 插件规范下的场景解决方案
- Serverless -cli 和 Vscode 插件，作为面向开发者的统一入口
- 面向业务的研发层，开发IDE, 包括本地的、云端的
- 两层网关，业务层网关到 Istio 打造的Serverless网关
- Bass SDK，用来与后台基础能力通信
- 运行在集群里的应用，包含三类
- 右侧是Appication是传统服务
- 左下是Runtime, Application, 他是将日常业务场景进行抽象，将不变的沉淀到Runtime里。
- 业务工程里只有变的东西，云函数情况下就可以是上面这个Funciton
- Nodejs 框架
- 底层集群， K8s /Knative 集群

右侧： 是业务服务环境，下面是常规的日志、监控、报警、性能分析的能力

左下侧：是Nodejs生态体系，包括业务框架、SDK、Nodejs性能分析平台

左上侧：是面向Serverless 研发体系的共享市场

**在虚线框里，就是面向一个业务场景，基于 Serverless 能力打造的一个通用解决方案。**

![](https://img.serverlesscloud.cn/202077/1594108194249-%E4%BC%81%E4%B8%9A%E5%BE%AE%E4%BF%A1%E6%88%AA%E5%9B%BE_15941081788086.png)

## Serverless 流程图 - 研发视角

将上面 Serverless 全局图拆分，我们把它分成三部分，这三部分也是我们年初立项，多个团队合作做这件事的一个模块分工，分为底层、平台层，和面向业务的研发层。

在开发者使用过程中，他们的流程是这样的：

- 上层不同场景的工程，使用统一的cli, 也可以通过Vscode插件可视化来完成整个开发流程，Vscode也调用cli能力
- 然后由cli调用平台的能力，再由平台进行权限验证，调用下层通用构建、部署能力
- 最后调用Serverless底层接口，将服务部署到KNative+K8s集群上

![](https://img.serverlesscloud.cn/202077/1594108194762-%E4%BC%81%E4%B8%9A%E5%BE%AE%E4%BF%A1%E6%88%AA%E5%9B%BE_15941081788086.png)

### Serverless-cli 的定位

我们再来看下 Serverless-cli,  它的定位是，基于插件式命令行扩展框架。他包含如下3个核心能力：

- 与Serverless平台联动，完成服务构建、部署等操作
- 提供规范，灵活的命令扩展能力
- 打造开发者生态，场景方案共享，并保持开发体验的一致性

![Serverless](https://img.serverlesscloud.cn/202077/1594108195026-%E4%BC%81%E4%B8%9A%E5%BE%AE%E4%BF%A1%E6%88%AA%E5%9B%BE_15941081788086.png)

### serverless-cli 的设计

cli 设计包含核心模块、默认命令、webpack相关、配置规范、以及基于cli 框架上层打造的插件生态。

![Serverless](https://img.serverlesscloud.cn/202077/1594108194752-%E4%BC%81%E4%B8%9A%E5%BE%AE%E4%BF%A1%E6%88%AA%E5%9B%BE_15941081788086.png)

## 场景方案

### 场景方案 - FaaS（云函数）

第一个场景方案：云函数。
函数即服务，用户快速编写一个函数接口，这里创建了两个接口, 每个接口暴露一个函数，入参为param 和 context, 通过 async 返回函数同步异步结果。这个场景的插件为 @didi/sls-cli-plugin-faas, 用户通过 package.json 中声明依赖即可。 FaaS工程类型的优势，是简单高效，并且通过Serverless 路由可以灵活控制隔离粒度。

![Serverless](https://img.serverlesscloud.cn/202077/1594108194187-%E4%BC%81%E4%B8%9A%E5%BE%AE%E4%BF%A1%E6%88%AA%E5%9B%BE_15941081788086.png)

![Serverless](https://img.serverlesscloud.cn/202077/1594108195331-%E4%BC%81%E4%B8%9A%E5%BE%AE%E4%BF%A1%E6%88%AA%E5%9B%BE_15941081788086.png)

### 场景方案 - Sma（微应用）

第二个场景方案：微应用。
页面即服务，前后端代码一体化，service.js 里保留出两个接口 list 和 add， 此时可以在前端组件中，类似远程调用，直接调用这两个方法，如同本地函数一样。另外它的服务端代码上下文和 FaaS 保持一致。

![Serverless](https://img.serverlesscloud.cn/202077/1594108194996-%E4%BC%81%E4%B8%9A%E5%BE%AE%E4%BF%A1%E6%88%AA%E5%9B%BE_15941081788086.png)


### 场景方案 - Sma-light（微应用-轻量版）

因为是应用级Severless方案，服务部署过程还是需要经历构建代码、编译镜像、以及整个应用级的部署。故我们基于Runtime的设计，结合Nodejs热更新能力，来支持页面级发布能力，轻量微应用类型工程。它支持

- 静态页面、接口
- 动态页面、接口
- 页面模板、中间件等抽象，打造该工程类型的物料生态

![Severless](https://img.serverlesscloud.cn/202077/1594108195057-%E4%BC%81%E4%B8%9A%E5%BE%AE%E4%BF%A1%E6%88%AA%E5%9B%BE_15941081788086.png)


### 不同场景方案，一致开发体验

我们来感受下，不同场景下一致的开发体验，包括创建、构建、开发、部署等
执行dev 时会一件启动前端资源webpack服务，同时启动服务端runtime服务，打开导航页面。

另外部署，可以执行 sls deploy, 通过 cli 将服务、按场景先后，按流量分组部署到 Severless 平台。
也可以通过 Vscode 插件可视化方式进行操作，进行部署、回滚。

![Severless](https://img.serverlesscloud.cn/202077/1594108195298-%E4%BC%81%E4%B8%9A%E5%BE%AE%E4%BF%A1%E6%88%AA%E5%9B%BE_15941081788086.png)

![Severless](https://img.serverlesscloud.cn/202077/1594108195614-%E4%BC%81%E4%B8%9A%E5%BE%AE%E4%BF%A1%E6%88%AA%E5%9B%BE_15941081788086.png)

### 云端开发

更进一步，我们提供了云端开发能力，来满足一些如云函数，这类轻量创建服务的方式，开发者可以通过平台创建函数、页面，完成开发、调试，上线，且它的开发体验与本地是完全环境一致，并且是复用的。

![Severless](https://img.serverlesscloud.cn/202077/1594108195592-%E4%BC%81%E4%B8%9A%E5%BE%AE%E4%BF%A1%E6%88%AA%E5%9B%BE_15941081788086.png)

## 基于 Serverless 面向业务聚合

我们来看一个业务使用案例。
这是我们普惠的工作台，是一个面向运营，集合了多个业务线后台系统。这里的菜单栏是配置集成起来的，每个菜单项是一个独立的页面，目前我们还没有采用微前端的一些轻量的隔离方案，使用的是简单、有效的iframe来进行隔离的。每个页面即服务，由每个业务线团队里的每个同学，用他们熟悉的技术栈，通过的前面介绍的微应用解决方案，独立运维。

![Serverless](https://img.serverlesscloud.cn/202077/1594108195607-%E4%BC%81%E4%B8%9A%E5%BE%AE%E4%BF%A1%E6%88%AA%E5%9B%BE_15941081788086.png)

## 最后

最后，我们也在积极探索用 V8 Isolate 与我们现有应用级Serverless + Runtime设计结合，实现面向nodejs更轻量高效的Serverless 隔离方案。


---
<div id='scf-deploy-iframe-or-md'></div>

---

> **传送门：**
> - GitHub: [github.com/serverless](https://github.com/serverless/serverless/blob/master/README_CN.md)
> - 官网：[serverless.com](https://serverless.com/)

欢迎访问：[Serverless 中文网](https://serverlesscloud.cn/)，您可以在 [最佳实践](https://serverlesscloud.cn/best-practice) 里体验更多关于 Serverless 应用的开发！