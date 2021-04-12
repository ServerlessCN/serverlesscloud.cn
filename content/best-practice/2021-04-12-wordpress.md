---
title: Serverless WordPress 建站免费体验
description: 基于腾讯云 Serverless 的低成本、高性能 WordPress 建站解决方案。
date: 2021-04-12
thumbnail: https://main.qcloudimg.com/raw/3496f7e7fc5e9d589ff7802010196591.jpg
categories:
  - best-prectise
authors:
  - April
tags:
  - Serverless
  - 云函数
---

Serverless 作为近几年兴起的新概念，相信不少人都对其有所耳闻，但究竟什么是 Serverless？它真的不需要服务器了吗？传统业务到底如何和 Serverless 适配呢？

本文将通过 WordPress 建站场景，为您介绍基于 Serverless 的低成本、高性能的全新建站方案。



## 01. Serverless 介绍

Serverless 顾名思义，即为 “无服务器”，这里的 “无服务器” 并不是真正不需要服务器，而是将服务器的维护交给云厂商处理，开发者只需要管理业务层代码，并且按照计算使用量计费，大大节省了运维成本。
以下图为例，传统部署方案，开发者必须先预估业务流量，并根据业务流量最大值购买服务器，往往会导致预估偏差导致流量溢出或资源浪费的问题。



<img src="https://main.qcloudimg.com/raw/1a479507125064b2fbf85a7ca6e5a948.jpg" width="700"/>



Serverless 方案则类似于网约车，根据请求量，自动进行扩缩容，真正实现资源都按照请求来计费，不使用不付费。

<img src="" width="700"/>

<img src="https://main.qcloudimg.com/raw/0bd178bc7cedaead515f3472f73b7671.jpg" width="700"/>

目前，Serverless 的应用场景广泛，大部分传统业务均可以在 Serverless 云函数上完美支持，接下来将以部署一个 WordPress 网站为例，具体 Http 服务在 Serverless 架构的具体实现。



## 02. 架构介绍

首先我们看一下传统的 PHP 服务架构：

- 用户请求通过 Apache 或 Ngnix Web 服务器，经 php-fpm 模块传递给服务端解析，最后然后将解析后的结果返回给用户，如下图所示：

<img src="https://main.qcloudimg.com/raw/64377f434841546f4a4f03caef7061b8.jpg" width="700"/>

而在云函数架构下，这套逻辑通过函数的不同模块实现：

- WordPress 原生代码挂载在 CFS 上，用户的请求经过 API 网关到达函数环境，函数通过内置的 PHP 运行环境完成请求的转发和处理，将获取的 WordPress 解析结果返回给用户，如下图所示：

<img src="https://main.qcloudimg.com/raw/61978cc80412df31384e95bc7703d6f6.jpg" width="700"/>

- 传统服务中的 Apache/Nginx 服务器模块，由函数内置环境模块完成，用户不需要再进行配置；
- PHP 环境，可以在函数运行环境内，通过 Custom Runtime 打包自己的环境和代码一起上传部署；
- php-fpm 模块由 PHP 模块替代，由于云函数为单实例单并发，多个请求可自动扩缩容，无需通过 php-fpm 进行进程管理；
- Location 转发管理，由用户函数 handler.php 实现，handler.php 文件和 WordPress 原生代码一起挂载在 CFS 上；



## 03. 方案优势

和传统 Web 应用部署方案对比如下：

|          | **传统虚拟机部署**                                       | **Serverless WordPress**                                     |
| -------- | -------------------------------------------------------- | ------------------------------------------------------------ |
| 部署步骤 | 购买机器 --> 搭建 PHP 环境 --> 配置数据库 --> 安装应用。 | 选择模版 --> 直接部署，自动创建所有云上服务资源。            |
| 成本     | 预付费，需要提前购买机器。                               | 按量计费，只根据使用量付费，一个日访问量 100 的个人博客网站，**运行成本最低不到 10 元/月。** |
| 性能     | 服务器和数据库在同一台虚拟机上部署, 缺少主备容灾。       | 基于底层各个云资源完成部署，数据库和应用分离，同时各个服务均支持容灾备份。 |

对比而言，云函数建站方案主要优势如下：**便宜、简单，对于中长尾的低负载业务，可以做到无请求时不计费；自带弹性伸缩、容灾能力。**



## 04. 部署实践

目前，您可以通过腾讯云 Serverless 应用控制台或 CODING Pages 网站托管服务，一键创建 WordPress 应用，将自动为您创建以下资源：

| 模块                                                         | 说明                                                         |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| [云函数 SCF](https://cloud.tencent.com/document/product/583/9179) | 负责 Serverless WordPress 的接入层实现，从而运行 WordPress。 |
| [API 网关](https://cloud.tencent.com/document/product/628/41654) | WordPress 的对外入口，实现了 RESTful API。                   |
| [文件存储 CFS](https://cloud.tencent.com/document/product/582/9127) | WordPress 的 Serverless 存储仓库。                           |
| [云原生数据库 TDSQL-C Serverless](https://cloud.tencent.com/document/product/1003/50853) | 通过创建 TDSQL-C Serverless (原 CynosDB) 的 MySQL 类型数据库，实现数据库按量计费，自动扩缩容。 |
| [私有网络 VPC](https://cloud.tencent.com/document/product/215/20046) | 内网打通SCF云函数、CFS、TDSQL-C Serverless之间的网络，保障网络隔离。 |

- **Serverless 应用控制台部署**

1. 进入 Serverless 应用控制台，点击 「新建应用」 按钮，选择 「应用模版创建」，填入您的应用名称，并选择 **「WordPress 框架」**创建卡片；

   > 控制台链接：https://console.cloud.tencent.com/sls?from=wx



<img src="https://main.qcloudimg.com/raw/43f9c695d09791f2b78a7004bc7b5944.jpg" width="700"/>

3. 点击 「创建」，自动进入应用部署日志页面，此过程通常需要 90s 左右，请耐心等候；
   
   <img src="https://main.qcloudimg.com/raw/943fc914d130511eefc2629711cec3e3.jpg" width="700"/>

3. 部署完成后，可以在应用详情页登录您的 WordPress 网站，并实现页面监控，绑定自定义域名等后续操作；

   <img src="https://main.qcloudimg.com/raw/ec3a20766da4f7bd9ac6822f115f35f0.jpg" width="700"/>



- **CODING Pages 网站托管服务部署**

除了 Serverless 控制台外，目前 CODING Pages 网站托管服务也已经支持 WordPress 一键部署，如果您已有 CODING 账号，欢迎体验。



------

**Serverless 建站惊喜福利大派送！**

<img src="https://main.qcloudimg.com/raw/b381b207724b05595beb891ca4b3d939.jpg" width="700"/>

建站计算资源云函数 SCF、文件存储 CFS、云原生数据库 TDSQL-C、内容分发 CDN、API 网关资源月月送，[点击查看](https://cloud.tencent.com/act/pro/serverless-wordpress?fromSource=gwzcw.4402331.4402331.4402331&utm_medium=cpc&utm_id=gwzcw.4402331.4402331.4402331) 领取惊喜福利！