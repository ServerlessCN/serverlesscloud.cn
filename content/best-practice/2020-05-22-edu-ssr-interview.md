---
title: Serverless SSR 技术在「腾讯在线教育」的实践
description: 腾讯在线教育团队基于腾讯云 Serverless 技术在其项目中应用 SSR
keywords: Serverless,Serverless Framework,SSR
date: 2020-05-22
thumbnail: https://img.serverlesscloud.cn/2020522/1590145638649-%E8%85%BE%E8%AE%AF%E5%9C%A8%E7%BA%BF%E6%95%99%E8%82%B2%E5%89%AF%E6%9C%AC.jpg
categories:
  - best-practice
authors:
  - 蒋林源
authorslink:
  - https://zhuanlan.zhihu.com/ServerlessGo
tags:
  - Serverless SSR
  - 腾讯在线教育
---

![](https://img.serverlesscloud.cn/2020522/1590142488439-%E8%85%BE%E8%AE%AF%E5%9C%A8%E7%BA%BF%E6%95%99%E8%82%B201.jpg)

## 我们的团队

- IMWeb 团队隶属腾讯公司，是国内最专业的前端团队之一。
- 我们专注前端领域多年，负责过 QQ 资料、QQ 注册、QQ 群等亿级业务。
- 目前聚焦于在线教育领域，精心打磨腾讯课堂、腾讯企鹅辅导及 ABCmouse 三大产品。

## 技术方案的摸索尝试

腾讯在线教育团队在传统的 Web 应用方向其实有很多技术方面的尝试，包括传统离线包、PWA 离线应用等，但是每个技术栈都有其优点与缺点，目前团队的技术方案对比如下：

![](https://img.serverlesscloud.cn/2020522/1590144485915-02%E5%89%AF%E6%9C%AC.jpg)


从上述表格可以看到，SSR 在首屏渲染以及 SEO 等方面都有不错的表现，这也是团队想在 SSR 技术方面深挖的初衷。SSR 方案选择上主要考虑:

### 1. SSR 应用的性能

我们知道类 React 的应用的 SSR 的本质为在服务端调用 React 的 renderToString 方法将 React 组件渲染成 HTML 字符串，那么对于复杂的 SSR 应用来说，可能存在大量的 CPU 密集型计算，这并不是 Node 所擅长的领域，那么如何优化这方面的性能问题也是我们所关注的重点。
同时因为离线包的环境依赖性（依赖 App），那么在传统的 Web 环境内是否可以有一套完整的解决方案来缓存相关的页面，从而提高首屏的性能，也是关注点之一。

### 2. SSR 的运维成本

对于大多数前端工程师来说，在服务的运维方面都可能有时并不那么得心应手，所以在服务的可用性方面，也是在做技术选型时所考虑的重点方向之一。

根据以上两个方面，可以把我们的考虑因素总结为以下两个点：

![](https://img.serverlesscloud.cn/2020522/1590142914249-03%E5%89%AF%E6%9C%AC.jpg)

## 腾讯在线教育团队 SSR 架构方案介绍

先从整体来了解下团队 SSR 技术的架构图：
![](https://img.serverlesscloud.cn/2020522/1590142988895-04%E5%89%AF%E6%9C%AC.jpg)

接下来我们从以下几个方面来详细讲解下团队现有方案。

### 代码组织

我们在 PC/H5 项目中均采用了同构的模式来构建 SSR 应用。
![](https://img.serverlesscloud.cn/2020522/1590143026846-05%20%E5%89%AF%E6%9C%AC.jpg)

在同构的模式下面，业务开发者更关注与业务的功能本身，而不用太过关心运行时的问题，但是也要注意以下几个问题：

- 传统浏览器中的常量使用，比如 window 、document 等。
- http 数据请求库必须同时支持服务端和客户端。
- 合理使用 React 应用的生命周期。
- 通过注入环境变量来区分当前运行时环境。

### 性能优化

1. 接口动静分离

我们知道页面的渲染一般要依赖于后端的相关数据，数据这里可以拆分为两个部分：动态数据与静态数据。
静态数据指的是页面中不经常变更的数据，比如企鹅辅导产品产品的课程标题、课程描述等；
动态数据指的是页面种与用户登录态相关的数据，比如课程是否已经购买、当前课程的折扣等。

对接口做动静分离的意义在于，我们可以利用静态数据的时延性敏感度低的特性做缓存，在服务端利用静态数据渲染页面，之后在服务端利用动态数据做二次渲染，主要逻辑如下：

![](https://img.serverlesscloud.cn/2020522/1590143216336-06%E5%89%AF%E6%9C%AC.jpg)

我们利用 Redis 对静态数据渲染出来的页面做缓存，这样不仅可以加快 SSR 的渲染时间，同时可以提高单机的 QPS（`renderToString` 在一定意义上为 CPU 密集型操作）。

2. 浏览器中利用 PWA 做离线缓存

![](https://img.serverlesscloud.cn/2020522/1590143236043-15%E5%89%AF%E6%9C%AC.jpg)

同时在客户端中，我们可以利用 PWA 来做离线缓存，缓存静态数据直出的 HTML 页面，从而进一步的提高了直出页面的首屏性能。

### 运行上下文

因为后端应用的运维复杂性、维护成本较高等问题，这里我们使用了 Serverless（腾讯云 SCF） 来做直出应用的部署。

得益于 Serverless 架构模式的天然优势，我们不用在关心服务的运维、服务的扩容等问题，这也是我们为什么选择其的重要原因。

![](https://img.serverlesscloud.cn/2020522/1590143236868-15%E5%89%AF%E6%9C%AC.jpg)

如上图所示，我们 SSR 应用本质为一个 Node 应用，但是 SCF 的调用本质为一个 Event 事件，那么如何去兼容这两种模式呢？这里我们对自研 Node 框架（imserver）做了一层 Serverless 的封装，由于腾讯云 Serverless Framework 提供了很多标准化的接口，在封装自研 Node 框架（imserver） 的过程中也比较省心。同时在入口做了 Event 到 Koa Request Context 的兼容。

![](https://img.serverlesscloud.cn/2020522/1590144011766-09.png)


## SSR 的技术方案落地过程中遇到的问题

### 1. 云函数拆分

我们业务中有多个页面是通过 SSR 来实现的，采用了腾讯云云函数SCF 来做 SSR 之后，就会遇到一个问题：是合并到一个云函数中（业务级），还是拆分为多个云函数（页面级）。
答案肯定是页面级会比较好，主要的优点如下：

- 云函数互相独立，假设页面 A 云函数 挂掉，并不会影响到业务 B 的云函数。
- 云函数包的大小会降低，因为 SCF 的冷启动过程，代码的包的大小对函数的冷启动时间也有一定的影响。

![](https://img.serverlesscloud.cn/2020522/1590143237084-15%E5%89%AF%E6%9C%AC.jpg)

这里我们基于当前的项目做了云函数的自动化构建，通过 .scfssr.json 的配置文件自动生成相应的云函数，对现有的开发是没有任何影响的，只是在构建的时候生成多个云函数，这样既降低了应用的维护成本，又降级了应用的开发成本。
同时得益于云函数的构建过程，我们可以对单个云函数的代码做瘦身，通过对 package.json 中的依赖分析，剔除一些云函数容器中已经内置的工具包，以及对云函数所依赖的第三方包做相应的引入分析，去重冗余。

### 2. 云函数发布优化

![](https://img.serverlesscloud.cn/2020522/1590144095100-11%E5%89%AF%E6%9C%AC.jpg)

上图为我们设计的基于 SCF 的多云函数直出方案逻辑，可以看到当我们有版本更新的时候，其实发布流程还是比较复杂的，步骤也是相当繁琐：

**配置过程：初始化进行一次**

- 函数中创建 release、prohub 别名，可预先指向 $LATEST 版本。
-  API 网关中创建服务 A，配置 API，指向函数 B release 别名，并发布到 API 服务的 release stage 中
- 修改 API，指向函数 B prehub 别名，并发布到 API 服务的 prehub stage 中
- 修改 API，指向函数 B 的默认流量，并发布到 API 服务的 dev stage 中；至此 API 网关的配置完成，后续无需在 API 网关上再次修改及发布配置

**开发测试发布过程：持续开发测试发布上线**

- 在函数上持续开发，一次发布版本 1，2，3
- 需开发测试最近版本时候，配置$DEFAULT 别名指向 $LATEST 版本，可基于此版本持续开发修改，修改完成后发布版本。
- 版本 3 可进入预发布环境时，配置 prehub 别名指向版本 3，在预发布环境可进行测试和体验
- 版本 2 已经在预发布体验完成，可上线，将 release 别名灰度从版本 1 切换至版本 2 完成
- 通过监控及日志查看灰度过程，版本 2 的流量是否正常上涨，版本 1 的流量是否正常下降；发布过程中的各版本错误情况以及总体错误情况

那么如何去优化云函数的发布流程呢？这里我们基于腾讯云 Serverless 所提供的 Node SDK 做了一键发布 SCF 的工具：

![](https://img.serverlesscloud.cn/2020522/1590143237030-15%E5%89%AF%E6%9C%AC.jpg)

一个完整的 SCF SSR 应用生命周期如下：

![](https://img.serverlesscloud.cn/2020522/1590143236288-15%E5%89%AF%E6%9C%AC.jpg)

## 腾讯云 Serverless SSR 方案的优点和基于自身业务的改进

利用基于腾讯云云函数（SCF） 的 SSR 方案，节省了不少的服务运维成本，得益于腾讯云 Serverless  的日志系统，所有的单个 SSR 应用请求在日志平台都有完整的链路，定位问题与处理问题的速度都有了质的提升。

因为 Serverless 的架构模式会存在冷启动时间较长的问题，虽然腾讯云云函数（SCF） 在这方面已经做了很多的技术优化，比如预启动容器等，但是我们在业务方面也可以尝试优化，我们在接入层做了服务的降级优化：

![](https://img.serverlesscloud.cn/2020522/1590143237225-15%E5%89%AF%E6%9C%AC.jpg)

后续的优化方案可以从灰度、多维降级等方面来做改进。

## 给想使用 SSR 技术的团队建议

如果想追求更好的用户体验，建议针对核心业务做 SSR 优化，搭配 Serverless 来做服务的部署于运维，有了 Serverless 的丰富配套，我们可以不用像以前一样关心机器的运维和扩容，可以大大的提高团队生产力。

同时，有了 SSR 之后，也建议大家可以完善自己业务的 devops 流程，将整个研发链路打通，从开发到测试再到部署都可以高效进行。

最后也推荐大家使用业务接入层来做服务降级，提高 SSR 应用的可用性。

## Serverless Framework 30 天试用计划

我们诚邀您来体验最便捷的 Serverless 开发和部署方式。在试用期内，相关联的产品及服务均提供免费资源和专业的技术支持，帮助您的业务快速、便捷地实现 Serverless！

> 详情可查阅：[Serverless Framework 试用计划](https://cloud.tencent.com/document/product/1154/38792)

---
<div id='scf-deploy-iframe-or-md'></div>

---

> **传送门：**
> - GitHub: [github.com/serverless](https://github.com/serverless/serverless/blob/master/README_CN.md)
> - 官网：[serverless.com](https://serverless.com/)

欢迎访问：[Serverless 中文网](https://serverlesscloud.cn/)，您可以在 [最佳实践](https://serverlesscloud.cn/best-practice) 里体验更多关于 Serverless 应用的开发！



