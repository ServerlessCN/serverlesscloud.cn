---
title: 腾讯云正式发布 Serverless Framework
description: 该版中发布了全新的组件（Component）机制、云引擎部署支持、实时日志和调试等能力，这些新功能为 Serverless 应用程序开发提供了顶级的顺畅体验！
keywords: Serverless,Serverless Framework,全栈解决方案
date: 2020-04-22
thumbnail: https://img.serverlesscloud.cn/2020421/1587478396860-bannner.jpg
categories:
  - news
authors:
  -  腾讯云
authorslink:
  - https://serverlesscloud.cn
tags:
  - Serverless
  - 全栈应用
---

4 月 21 日 14:00，腾讯云召开了 Serverless Framework 线上发布会，会议邀请到了 serverless.com CEO Austen Collins 、腾讯云中间件总经理 & 首席架构师 Yunong Xiao 等重磅嘉宾进行相关分享和探讨，本次发布会在腾讯云大学、哔哩哔哩、知乎平台同步直播，近千人观看了本次发布会。

产品发布会上，首先，腾讯云中间件总经理&首席架构师 Yunong Xiao 从宏观的角度阐述了 Serverless Framework 的特性，宣布产品正式发布。他指出 Serverless 的核心价值在于聚焦业务，不需关注底层资源 (Focus on outcomes, not Infrastructure)，此次产品发布，为开发者提供基于 Full Stack 全栈以及 HTTP API 的一站式解决方案。

![](https://img.serverlesscloud.cn/2020421/1587471829252-1587467770716-e7f6949c9d8151ab.png)

接着，serverless.com CEO Austen Collins 讲述了新版本 Serverless Framework 的价值和目标，他希望能帮企业在仅有很少的开发和运维人员的情况下管理大型的线上系统，并提到 serverless 将和腾讯云一起为中国开发者提供最佳的 serverless 开发者体验以及基础架构。


![](https://img.serverlesscloud.cn/2020421/1587477253237-aus.jpg)

第三位分享嘉宾，来自 serverless.com 中国区研发的负责人 Ke Huang 老师，Ke Huang 老师分享了 Serverless Framework 的演进，从 plugin 到 component 再到 platform，提到未来 serverless 产品路线将提供更完善的 Serverless 组件库生态，提供差量部署，极速部署体验，包含线上运维工具的 Serverless Dashboard，以及上线各种开箱即用的线上运维的工具，让开发者开发完成即部署完成并且已为产线环境准备就绪。

![](https://img.serverlesscloud.cn/2020421/1587472155885-1587467998313-fd543b7dae7c2d21.png)

最后一位分享嘉宾是来自腾讯云的高级产品经理方坤丁 (Tina)，Tina 详细介绍了 Serverless Framework 新版本的特性和优化内容，以及在实际业务场景中使用 Serverless Component 的便利。同时，Tina 现场进行了 Serverless Framework 新功能的代码实战，基于 Express.js 框架演示了一键部署、实时日志、远端调试等能力。并通过 Serverless Framework 平台快速部署了一个具备前端、后端和数据库的 Serverless Full Stack 全栈应用。

![](https://img.serverlesscloud.cn/2020421/1587477685086-%E5%B1%8F%E5%B9%95%E5%BF%AB%E7%85%A7%202020-04-21%2022.00.20.png)

发布会嘉宾分享结束后，进行 Q&A 环节，大家就实际业务中遇到的问题在会话区踊跃提问，主持人王俊杰组织嘉宾解答大家的问题，其中有参会者 Jovi 提到「目前 Tencent Serverless 是否支持用户自定义 DB，比如 elasticsearch，couchbase，redis，mongoDB 等其他 NoSQL，未来是否有这方面的支持和拓展计划，以及可能上线的时间点」。可见大家对腾讯云 Serverless Framework 产品以及其未来的发展非常关注。

## 立即使用 Serverless，只需三步

Serverless Framework 是构建和运维 Serverless 应用的框架。简单三步，即可通过 Serverless Framework 快速实现服务部署。

**1. 安装 Serverless**

macOS/Linux 系统：推荐使用二进制安装

```
$ curl -o- -L https://slss.io/install | bash
```

Windows 系统：可通过 npm 安装

```
$ npm install -g serverless
```

**2. 创建云上应用**

在空文件夹下输入 `serverless` 命令：

```
$ serverless
```

访问命令行中输出的网页链接，即可访问成功部署后的应用。

**3. 查看部署信息**

进入到部署成功的文件夹，运行如下命令，查看部署状态和资源信息：

```
$ sls info
```



---
<div id='scf-deploy-iframe-or-md'></div>

---

> **传送门：**
> - GitHub: [github.com/serverless](https://github.com/serverless/serverless/blob/master/README_CN.md)
> - 官网：[serverless.com](https://serverless.com/)

欢迎访问：[Serverless 中文网](https://serverlesscloud.cn/)，您可以在 [最佳实践](https://serverlesscloud.cn/best-practice) 里体验更多关于 Serverless 应用的开发！
