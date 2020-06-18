---
title: Serverless SSR 技术在猎豹移动的实践
description: 猎豹移动前端团队基于腾讯云 Serverless 技术在其项目中应用 SSR
keywords: Serverless,Serverless Framework,SSR
date: 2020-05-15
thumbnail: https://img.serverlesscloud.cn/2020518/1589791033511-db%E5%89%AF%E6%9C%AC.jpg
categories:
  - best-practice
authors:
  - 董文枭
authorslink:
  - https://zhuanlan.zhihu.com/ServerlessGo
tags:
  - Serverless SSR
  - Koot.js
---

> 作者：董文枭 | 策划：王俊杰

为了追求速度体验和极致的 SEO 效果，越来越多的技术管理者和架构师倾向于采用 SSR (Server Side Rendering) 技术来构建前端项目，以支持同构代码的服务器端渲染。而在云的时代，更多的应用将迁移到云端部署，Serverless 云技术因其降低开发成本、按需自动扩缩容、免运维等诸多优势，已经大量被开发者采用以更快的构建云上应用。

本篇文章整理自猎豹移动负责平台前端部负责人董文枭老师的采访。通过董老师的讲述，我们进一步了解到猎豹移动前端团队是如何基于腾讯云 Serverless 技术在其前端项目中应用 SSR 的。


## 作者简介

![](https://img.serverlesscloud.cn/2020515/1589534502498-wenxiao.jpg)



## 采访实录

**问：董老师您好，请简要介绍一下您所在的团队。**

答：我的团队是平台前端部，负责公司 AI、机器人、广告系统等业务和对外网站业务，团队成员包括前端工程师和 Node 全栈工程师。

**问：基于什么背景和问题，您的团队考虑采用 SSR 的技术方案？**

答：当然是追求极致的用户体验，虽然 HTML、CSS、JS 以及其他资源都做到了按需加载，但这里的 SSR 更是 Isomorphic（前后端同构），把 SSR (Server Side Rendering) 和 CSR (Client Side Render) 的优点结合，让用户浏览网页的时候不管是首屏还是随后操作的其他页都能更快的展示响应。

**问：您的团队使用 SSR 技术方案时，有没有进行一些调研？**

答：我们团队在 2016 年的时候开始使用 React，2017 年就开始研究并尝试 React Server Render，同期 Facebook 的网站已经采用 Isomorphic 技术实现，性能非常好。为了满足公司业务需求和技术传承，我们自研了猎豹的前端技术框架 Koot.js，目前已成为猎豹前端的主要技术方案。

**问：能否从技术的角度介绍一下目前使用的 SSR 方案的前端技术框架 Koot.js，是基于什么样的架构，有哪些模块？**

答：Koot.js 包含了 SSR，也是我们团队自研的方案，所以都是在用它.

Koot.js 是基于 React、Koa、Webpack 来架构的，其中用 Koa 搭建的 Node 作为开发服务和部署时候的 SSR 服务，页面渲染主要是用 React+Redux 完成的一套代码在浏览器环境和 Node 环境通用，利用 Webpack 可编程性动态生成配置并执行，打包出多场景（开发、测试和线上环境等）多端代码（前端、服务端）部署。

同时在开发过程中配合了自研工具和模块来辅助开发，如 koot-router、koot-redux、koot-webpack 进行了封装简化调用方法，提升开发效率；koot-cli 完成脚手架模板选择、项目配置等；koot-i18n 提供了多模式多语言方案，可以做到正常开发，打包后多语言内容按需加载的效果；集成了 koot-analyze 分析代码、预制 eslint 规范的 koot 版本等满足了日常工作所需的大部分技术点。

具体落地的时候，我们把自研的 Koot.js 使用 Serverless Framework 进行了封装，做了一个 Serverless 组件，这样在其他业务场景需要用的时候就可以直接复用，可以节省不少成本，避免了重复造轮子，降低了出错的概率。


**问：SSR 的技术方案在落地时过程是否顺畅，遇到了哪些问题，是如何解决的？**

答：SSR 项目落地的时候通常不是很顺畅，项目部署的时候需要具备服务器技术能力才能和运维顺畅沟通，所以项目落地不仅要前端同学掌握后端开发能力还要对运维技术、并发等问题多方面考虑，这对前端技术同学的技术全面行有较高要求。

在这种情况下，去年我们开始接触 Serverless 技术，Serverless 技术可以降低前端对服务端和运维的技术能力但要求，更适合大部分要做 SSR 的前端团队。调研了几大云厂商 Serverless 服务，最后综合比较后，选择了腾讯云作为我们实现 SSR 的 Serverless 服务支持。

腾讯云 Serverless 提供了比较全面的组件支持，与 Serverless Framework 基本是无缝结合，周边社区和生态支持也比较到位，使用过程应该会少踩一些坑。在选定了平台之后就比较顺畅了，因为 Serverless Framework 提供了很多标准化的接口，在封装 Koot.js Serveless 组件的过程中也比较省心。

**问：目前的 SSR 方案推动了您所在团队哪些协作模式或分工的优化？**

答：我们很早就做了前端分离的开发，前后端完全使用 API 对接，协作改变不大。因为我们做了 Isomorphic，所以对 API 的要求变高，用户的请求不止来源于 Node 服务器，还有来自浏览器的请求，对安全性要求会高一些。

**问：从您的视角，目前 SSR 方案是否还需要一些改进？**

答：我认为将来的 SSR 都应该是 Isomorphic 的模式，带来的好处是减少传输成本，分摊渲染压力，用户体验也会有所提升。体验的提升其实非常小，网路情况好时，用户几乎感知不到，但小小的提升在技术开发中却做出了非常多的工作，因此我们会把技术框架做的越来越完善，让业务开发同学能够快速开发出需求，同时又享有 Isomorphic 带来的技术体验。

**问：对于还未开始做 SSR 的团队您有什么建议吗？**

答：如果要做 ToC 的产品，建议做 SSR 尝试，让用户尽快的看见页面内容总是更好的。

前端的 SSR 一定会考虑是否需要 Isomorphic，如果小团队建议先从比较流行的框架着手尝试，如 Next.js、Nuxt.js 等，也推荐体验我们的 Koot.js。Next.js、Nuxt.js 这些框架在腾讯云 Serverless Framework 都现成的组件支持，Koot.js 也可以用我们的方案。无论是 SSR 还是 Serverless，最好都是基于现有框架，从零开始搭建框架坑太多了，如果没有足够业务支持不要浪费精力自己去做框架，学会一个框架的成本要远小于维护一个框架的成本。

最后，感谢董老师接受 [Serverless 中文社区](https://serverlesscloud.cn)的采访。



---
<div id='scf-deploy-iframe-or-md'></div>

---

> **传送门：**
> - GitHub: [github.com/serverless](https://github.com/serverless/serverless/blob/master/README_CN.md)
> - 官网：[serverless.com](https://serverless.com/)

欢迎访问：[Serverless 中文网](https://serverlesscloud.cn/)，您可以在 [最佳实践](https://serverlesscloud.cn/best-practice) 里体验更多关于 Serverless 应用的开发！
