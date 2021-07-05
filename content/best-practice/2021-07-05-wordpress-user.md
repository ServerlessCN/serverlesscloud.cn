---
title: 【玩转 WordPress】— 史上最快速搭建 WordPress 教程
description: 基于 Serverless 快速部署一个 Wordpress 框架。
date: 2021-07-05
thumbnail: https://main.qcloudimg.com/raw/9d8d33764b838a0289beaf091a0dea4f.png
categories:
  - best-practice
authors:
  - 落雨
tags:
  - Serverless
  - 云函数
---



*以下内容来自「玩转腾讯云」用户原创文章，已获得授权。*



## 01. 什么是 Serverless？

在《Serverless Architectures》中对 Serverless 是这样子定义的：

> Serverless was first used to describe applications that significantly or fully incorporate third-party, cloud-hosted applications and services, to manage server-side logic and state. These are typically “rich client” applications—think single-page web apps, or mobile apps—that use the vast ecosystem of cloud-accessible databases (e.g., Parse, Firebase), authentication services(e.g., Auth0, AWS Cognito), and so on. These types of services have been previously described as “(Mobile) Backend as a service", and I use “BaaS” as shorthand in the rest of this article. Serverless can also mean applications where server-side logic is still written by the application developer, but, unlike traditional architectures, it’s run in stateless compute containers that are event-triggered, ephemeral (may only last for one invocation), and fully managed by a third party. One way to think of this is “Functions as a Service” or “FaaS”.(Note: The original source for this name—a tweet by @marak—isno longer publicly available.) AWS Lambda is one of the most popular implementations of a Functions-as-a-Service platform at present, but there are many others, too.



这样的描述我相信有很多小伙伴不明白，我们可以这样子来理解 Serverless：

它的中文直译就是「无服务器」，目前对于 Serverless 有几种解读方法：

- **在某些场景可以解读为一种软件系统架构方法，通常称为 Serverless 架构**
- **而在另一些情况下，又可以代表一种产品形态，称为 Serverless 产品**

可以理解为 Severless = FaaS + BaaS  即函数即服务 (Function as a Service) + 后端即服务 (Backend as a Service)。



## 02. 快速搭建 WordPress

第一步：进入 Severless 控制台并完成授权，点击新建应用，选择应用模板 — 快速部署一个 Wordpress 框架

<img src="https://main.qcloudimg.com/raw/4fd680048b9fb2203489300168f672bb.png" width="700"/>



第二步：填写应用名，选择环境和地域；

- 应用名称：最短 2 个字符，最长 63 个字符，只能包含小写字母、数字及分隔符 “-”、且必须以小写字母开头，数字或小写字母结尾。应用名称创建后无法修改。

- 环境分为：部署环境，实现开发、测试和生产环境

- 目前支持广州，上海，北京三个地域

选择完成后点击完成

<img src="https://main.qcloudimg.com/raw/88092a00e589a620d29a153942de0ce2.png" width="700"/>



第三步：等待部署完成。

- 部署时可以查看部署日志，部署通常需要 90 秒。

<img src="https://main.qcloudimg.com/raw/57639684e34be0b09b74c60269ce8839.png" width="700"/>



第四步：配置 WordPress

- 点击右上角的「访问应用」，会打开一个系统自动分配的域名，在此页面完成 WordPress 的基本配置。

<img src="https://main.qcloudimg.com/raw/92a872b9777c6c75f5bff28c8d1fe935.png" width="700"/>



<img src="https://main.qcloudimg.com/raw/f5729b415bbb685199eab1567a2aba00.png" width="700"/>



第五步：绑定自定义域名

在资源列表选项卡中找到基础信息栏

<img src="https://main.qcloudimg.com/raw/0076bbbccac477fd3130509776c93f5d.png" width="700"/>



输入自己的域名（因为部署在国内，需要使用已备案的域名）

<img src="https://main.qcloudimg.com/raw/0076bbbccac477fd3130509776c93f5d.png" width="700"/>

<img src="https://main.qcloudimg.com/raw/d5506a154624112df913ead4f08d27cd.png" width="700"/>



完成后点击保存即可。



------



### Serverless 建站惊喜福利大派送！

<img src="https://main.qcloudimg.com/raw/723b9530da0e913c01346c7bfe0d0abc.png" width="700"/>



建站计算资源云函数 SCF、文件存储 CFS、云原生数据库 TDSQL-C、内容分发 CDN、API 网关资源月月送。

[**点击这里**](https://cloud.tencent.com/act/pro/serverless-wordpress?fromSource=gwzcw.4402331.4402331.4402331&utm_medium=cpc&utm_id=gwzcw.4402331.4402331.4402331)，查看领取惊喜福利！



---

> **传送门：**
>
> - GitHub: [github.com/serverless](https://github.com/serverless/serverless/blob/master/README_CN.md)
> - 官网：[serverless.com](https://serverless.com/)



欢迎访问：[Serverless 中文网](https://serverlesscloud.cn/)，您可以在 [最佳实践](https://serverlesscloud.cn/best-practice) 里体验更多关于 Serverless 应用的开发！