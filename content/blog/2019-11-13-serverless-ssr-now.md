---
title: Node 部署和运维工作量降低 80%，腾讯 NOW 直播是怎么做到的？
description: 本篇文章，将分享腾讯NOW直播在Serverless技术的探索实践。
keywords: Serverless, Serverless实践, Serverless SSR
date: 2019-11-13
thumbnail: https://img.serverlesscloud.cn/qianyi/images/YHl6UWa9s61qzticncvwNpZulMqH7uWLsJ37JictvIBCibiaU5sDYicicxtKP9bu8PEWPCZyIlpfymbzmbw2geGvPaHw.jpg
categories: 
  - news
authors: 
  - Serverless 中文网
authorslink: 
  - https://github.com/jiangliu5267
tags:
  - NGW
  - 云函数
---

本篇文章，将分享腾讯NOW直播在Serverless技术的探索实践。

**一、背景简介**

首先解释一下几个名词：

- **NGW**（Node Gateway，Node 前端接入层）：IVWEB 团队开发的内部前端业务接入层方案，目前处于腾讯内部开源状态。
- **BFF** (Backend For Frontend) ，通常指服务于前端的后端。
- **SFF** (Severless For Frontend) ， BFF 架构的升华，落地到 Serverless 中。

目前，NOW 直播团队正在逐步接入 NGW，完成 BFF 向 SFF 架构的演进。

从前后端分离到 BFF，前端的能力不断扩大，逐渐涉猎到后端和运维，对前端人员的技术能力要求也越来越高。NOW 直播 IVWEB 团队从提升研发效率的角度，在调研了腾讯云Serverless之后，团队决定接入云函数SCF产品，对 BFF 架构结合 Serverless 进行了新的尝试。

在 SFF 架构下，Node 服务落地到 Serverless，**最大的收益者是前端开发人员**：

- 前端同学不再需要关注服务器的申请/维护/扩容；
- 无需关心生产环境的搭建；
- 真正做到专注业务逻辑的开发；
- 自动扩容，零运维；
- 接入工作量降低了 80%。

此前，团队已经通过开发 Nest 系统的聚合服务（Node 服务的可视化管理）完成了 BFF 架构的演进。NGW 作为新项目，响应腾讯自研上云的号召，抛开历史包袱，全面拥抱上云，并且有幸成为公司内首个和腾讯云 SCF 大规模合作的前端项目，结合 SCF 实现了同构直出和 Node 服务的无服务化，做到自动部署和更新。在这里**感谢腾讯云Serverless团队**和**QQ团队**的大力支持。

**二、从一个故事说起**

阿特是个特别认真的人，但也有汉子柔情的一面，他攒了很久的假期，准备在情人节和小美来一场说走就走的旅行。不巧，就在情人节前一天，新上线的项目被产品挑战了，说“首屏速度不够快”。

作为高级工程师的阿特，有 100 种可以让页面提升首屏的方法；他马上用团队的同构直出框架，半天就撸出来了一个直出服务，部署完之后就可以和心爱的小美去旅行了。

阿特打开运维系统，看了一下业务机的承载，需要扩容才能满足需求。为了不影响线上业务，阿特选了新申请一批机器。半天过去了，新机器终于下来了，这时距离下班时间还有 5 分钟。为了小美的旅行，今天无论如何都要上线。

面对新下来的机器，阿特一把梭装好了所有基础组件，配置和部署好直出服务，现在只需要将原来的静态请求接入到直出服务就可以了；但事情并没有这么简单，现网的域名竟然要经过好几层接入机才能到直出服务。

凭借着高级工程师的一双能手，阿特一步步地终于将业务成功上线了。他松了一口气，看了一下时间，沉默了许久。现在是北京时间 2 月 14 日上午 9:55，距离飞机起飞时间还有 5 分钟，阿特终究还是错过了和小美的旅行。

故事虽然听起来比较夸张，但反映的事实却无比真实：

- 业务不断增多，服务混布导致新老业务的**变更越来越复杂**，全部独立部署则会造成资源浪费；
- 运维系统鱼龙混杂概念繁多，不是老司机很难理清楚，**对小白不友好**；
- 业务模块多、机器多、配置多，**变更全靠配置系统下发**；
- 前后端共用接入机，**转发逻辑复杂**。

我们发现，即使完成了 BFF 架构的演进，但难免会存在服务混布，而且仍需关注复杂的运维，效率的瓶颈始终在运维上。**有没有一种方法可以既能使服务独立部署，并且能有效降低运维成本呢？**

答案：**Serverless**。

**三、NGW 的架构**


**NGW**（Node Gateway，Node 前端接入层）是介于 STGW 和真实业务的中间层，用户的请求会通过 统一网关先进入到 NGW 层，再由 NGW 来分发请求到对应业务上。

这里的业务可以是：

- 静态页面
- BFF 架构下的 Node 服务
- SFF 架构下的 Serverless 直出或 Node 服务

咦，这不是 Nginx 做的工作吗？——**Nginx 虽然强大，但缺点是无法做到强逻辑的分发，也不容易进行扩展，而且每次更改配置之后都需要重启服务，查看日志也很困难。**

NGW 使用 TypeScript + Node 开发，对前端同学更友好，能更方便地进行功能的迭代和扩展，转发逻辑可以动态下发，无需重启服务。

整个 NGW 方案主要分为三个模块：

- NGW 分发层：主要专注于业务的分发；
- NGW-Service 层：负责周边服务，如配置管理、Serverless 服务的部署和更新，日志旁路等；
- NGW Platform：管理平台，用于配置管理与日志管理等。


**四、容器化**

作为 9102 年的新项目，响应自研上云的号召，NGW 的全部服务均使用 Orange-CI（自研内部 CI 工具） + TKE 腾讯云容器服务 进行构建和部署，并利用容器编排对 Docker 镜像的构建部署进行了优化。（优化后构建镜像时间缩短为 20秒，大小缩小至 10M 以内）

NGW 分发层作为业务分发的基础服务，性能和稳定性非常重要，有了 Orange-CI 和 STKE 的加持，大大提高了服务部署的敏捷程度，并且在高并发场景下也能做到灵活自动扩容，再也不用提前评估业务量。

TKE 单机满负载运行资源占用（8 核 16G，数据来源 TKE）：

![Serverless](https://img.serverlesscloud.cn/qianyi/images/6aVaON9Kibf4tGcQJIlibvXKlsfS0oZUVTkFDia15PGTSLp0R9hgkTemPQictI0Bich22BzicXDJEWJzMJhre3aFTXqA.jpg)

高并发场景压测下自动扩容至 8 个实例，峰值接近 8000 TPS（数据来源于 WeTest 压测大师）：

![Serverless](https://img.serverlesscloud.cn/qianyi/images/TN05MmJLxMqpZPPtdbqykRRWoicibX5BokYEEHtvCWqcgPHtjvLYaG8IYiaJCCtaIEeGu3urvOlq25EDib7gM0TKFQ.jpg)

为什么峰值只压到 8000 TPS 呢？主要是因为峰值已经达到下层静态服务器的最大承载了，导致转发效率变慢，并不代表 8000 TPS就是 NGW 层的最大承载（逃）。在 STKE 资源充足的前提下，NGW 是可以无限扩容的，无需担心高负载导致服务器宕机。

**五、配置下发**

Nginx 每次更改转发配置，都需要重启 Nginx 服务。

NGW 开发了 NGW-Service 层，结合管理平台对配置进行动态管理，配置更改后通过云 Redis 下发到 NGW 分发层中。配置热重载，平滑过渡。

配置下发流程：

目前已完成分发逻辑的动态下发，后续将陆续支持操作记录和版本管理。

**六、Serverless 无服务**


在 NGW 分发层的基础上，结合腾讯云 SCF，就能更方便灵活地对现有 Node 服务进行 BFF 到 SFF 的演进。

- NGW-Service 负责 Serverless 服务的管理，如部署、更新等；
- NGW 分发层进行业务的转发。

架构：

![Serverless](https://img.serverlesscloud.cn/qianyi/images/TN05MmJLxMqpZPPtdbqykRRWoicibX5BokyopCc2iaibchknNq0bDP53O0l0qiaUlo9tnz5NVS6Ep32vJFRKXZR8BcA.jpg)

目前 NGW 已经支持同构 SSR 的 Serverless 化方案，并且已接入多个项目在线上通过验证，**成功率接近 99.99%**（数据来自内部打点统计系统）。

NGW 目前处于腾讯内部开源状态，待方案完善脱敏后将会逐步进行外部开源。

关于 Serverless 化方案的实现技术细节，后续将会有专门的文章来介绍，本文先不赘述了。

**七、插件体系**


前文说到 Nginx 虽然强大，但缺点是不容易进行扩展。NGW 的分发功能扩展是怎么实现的呢？

除了 Koa 中间件，NGW 还引入了插件的概念来对专用分发逻辑进行模块化：

- Koa 中间件：用于处理统一逻辑；
- 插件：与单次分发过程的生命周期强关联，用于处理专用逻辑。

插件的实现基于 Tapable，通过生命周期钩子来对分发过程进行逻辑干预。

生命周期钩子：

```javascript
// 分为同步和异步钩子两种，以同步钩子为例
interface ApplicationSyncHooks {
   // 收到请求
   didReceiveReq: AsyncSeriesHook<[Application, ProxyConfig]>;
   // 即将转发代理请求
   willSendProxyReq: AsyncSeriesHook<[Application, ProxyConfig]>;
   // 代理请求成功
   proxyReqSucc: AsyncSeriesHook<[Application, TswAjaxResult]>;
   // 代理请求失败
   proxyReqFail: AsyncParallelHook<[Application, TswAjaxResult]>;
   // 接收到代理请求响应
   didReceiveProxyRes: AsyncParallelHook<[Application, IncomingMessage]>;
   // 即将返回代理层响应结果
   willReturnRes: AsyncSeriesHook<[Application, IncomingMessage]>;
   // 返回响应完成
   didReturnRes: AsyncSeriesHook<[Application, TswAjaxResult]>;
}
```

利用插件，可以在基础的分发逻辑上进行一些专用的逻辑处理，比如灰度转发、白名单等。以灰度插件为例，可以在分发配置中添加插件：

```javascript

{
   "origin": "/ngw/index.html",
   "proxyPass": "http://the-path-where-you-want-to-go.com",
   // 添加灰度插件，Application 会在分发前进行插件实例化，并将 args 传入构造函数中
   "plugins": [{
       "name": "AlphaPlugin", "args": ["plan-A"]
   }]
}
```

插件逻辑处理：

```javascript
// 以下为简化代码...

class AlphaPlugin extends AbstractPlugin {
   public name = 'AlphaPlugin';
   public config: AlphaPluginConfig;
   public constructor(args: AlphaPluginConfig) {
       super();
       this.config = args; // 接收配置中的 args 参数
   }
   public apply(application: Application) {
       application.syncHooks.didReceiveReq.tapPromise(this.name, this.didReceiveReq.bind(this));
   }
   public async didReceiveReq(application: Application, proxyConfig: ProxyConfig) {
       const alphaConfig = getAlphaConfig(this.config[0]); // 获取灰度逻辑，入参是配置的 "plan-A"
       proxyConfig.proxyPass = alphaConfig.url; // 修改分发的地址
   }
}
```

这样一来，就可以通过灰度插件实现对现网业务进行灰度上线或 ABTest，比如现网投放的 A 页面，通过 NGW 可以动态分发到 B 或 C 等页面。

**八、日志查看**


NGW 基于 TSW，得益于 TSW 的染色体系，可以轻松地查看实时染色日志，秒杀 Nginx。后续也会将 SCF 中的日志收归到 NGW-Platform 中。

**九、现状**


### **Serverless SSR**

![Serverless](https://img.serverlesscloud.cn/qianyi/images/6aVaON9Kibf4tGcQJIlibvXKlsfS0oZUVTicBUlL4cTFqdSr1awmXTgfXic2wVkqkNVoxeW8NyeTHBVc9RsBg4Pa4A.png)

目前 NGW + Serverless SSR 已经应用到 NOW 直播、手 Q 附近、浏览器直播和手 Q 群送礼等多个项目中。实际业务开发中，**Node 业务的部署和运维工作量降低了 80% 以上**。

以前的业务上线路径：

申请机器 -> 申请 CL5 -> 织云包下发部署服务 -> 更改 Nginx 配置

接入 NGW + Serverless SSR 只需要两步，后续接入团队脚手架后，连这两部都可以省掉了，工作量 down down down：

- 更改 oci 配置，将 CI 制品推送到 SCF
- NGW-Platform 添加分发配置

### **稳定性**

NGW 目前的分发成功率稳定在 3 个 9 以上，单元测试覆盖率已超过 85%。


![Serverless](https://img.serverlesscloud.cn/qianyi/images/TN05MmJLxMqpZPPtdbqykRRWoicibX5BokJJZ38r7Rw00yr7douEWSNJNnDL4YvmPcI8ibjGfeqPHt00ZUvCxH6tg.png)

**十、接下来的计划**

- 和腾讯云 SCF 展开深度合作，提升性能；
- React Chunked 流式渲染方案，结合 SCF 进一步提升首屏速度；
- 接入 Aegis 前端监控体系，实现前端全息日志；



