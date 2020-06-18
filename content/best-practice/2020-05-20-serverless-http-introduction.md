---
title: 腾讯云 Serverless HTTP 服务指南
description: Serverless HTTP 服务是基于腾讯云 API 网关和云函数的能力，为互联网业务提供 0 配置、高可用、弹性扩展的 API 能力
keywords: Serverless,Serverless Framework,http,API
date: 2020-05-20
thumbnail: https://img.serverlesscloud.cn/2020520/1589974000735-%E6%9C%8D%E5%8A%A1%E6%8C%87%E5%8D%97%E5%89%AF%E6%9C%AC.jpg
categories:
  - best-practice
authors:
  - Tianyun
authorslink:
  - https://zhuanlan.zhihu.com/ServerlessGo
tags:
  - Serverless
  - Serverless HTTP
---

Serverless 是全球流行的应用架构，Serverless 实现了自动伸缩扩容，稳定性好；不需要运维，按运行时间付费，降低了开发成本；门槛降低，让前端工程师有望成为全栈工程师。诸多优点，吸引了云厂商相继布局。

云函数 SCF 是腾讯云 serverless 团队为企业和开发者们提供的无服务器执行环境，目前支持 `Java、node.js、PHP、Python、Golang` 等多种语言，同时 Serverless 团队也在不断的丰富其组件库，目前已经支持 Node.js 的 Express、Koa、Egg 框架，以及 Python 的 Django 框架等。

> 更多参见：[产品概述](https://cloud.tencent.com/document/product/1154/38787)

当用户使用云函数编写自己的业务逻辑时，以 Web 举例，需要通过网关调用接口，开源网关单节点容易宕机，多节点需要创建集群维护成本较高，所以大多数用户会选择腾讯云 API 网关，只需要几行网络请求的代码甚至不需要代码就可以使用，减少了人力成本。

Serverless Http 服务是基于腾讯云 API 网关和云函数的能力，支持 `Swagger/OpenAPI` 等协议，不需要用户配置，部署完成后，可通过 Dashboard 去查看 API 监控管理，如下图所示，极大的方便了用户快速上线自己的业务逻辑，通过规范的 API 支持内外系统的集成和连接。

对于 Web Service，Serverless HTTP 服务提供了标准 API，集成客户内部业务，提供统一、开放、易于管理及配置的 API 服务平台，可以以比较友好的方式呈现给用户使用，也有利于自身业务的安全性。

![](https://img.serverlesscloud.cn/2020520/1589967378198-1589883039380-2c90ba3c63a4572e.png)

## Serverless HTTP 服务体验

**下面以部署 Express 应用为例，一起体验下接入 Serverless HTTP 服务！**

打开链接：[cloud.tencent.com/deploy/express](https://serverless.cloud.tencent.com/deploy/express)，扫码/点击一键部署，登录腾讯云账号授权，部署完成会看到如下页面：

![](https://img.serverlesscloud.cn/2020520/1589978702447-%E7%94%BB%E6%9D%BF.png)

### 修改 API 配置

用户可以通过右上方的`【下载项目代码】`按钮，打开 `serverless.yml` 文件，修改 API 配置，例如修改 environment。
提示：`serverless.yml` 文件里的 `name:expressDemo` 可以修改为和上图 Dashboard 上的 `name:express-ipgze` 一致。

![](https://img.serverlesscloud.cn/2020520/1589967477373-1589892886268-5af7f1fb0288b078.png)

如果您修改为其他，例如下图修改为：`express-test`，跟云端的不一致

![](https://img.serverlesscloud.cn/2020520/1589967478668-1589892886268-5af7f1fb0288b078.png)

通过 `sls deploy` 部署后，会重新创建一个 express 应用，如下图所示

![](https://img.serverlesscloud.cn/2020520/1589967477376-1589892886268-5af7f1fb0288b078.png)

### 移除部署的 API 网关

在 `serverless.yml` 文件所在的目录下，通过 `sls remove` 命令移除部署的 API 网关，移除后该组件会对应删除云上部署时所创建的所有相关资源。



---
<div id='scf-deploy-iframe-or-md'></div>

---

> **传送门：**
> - GitHub: [github.com/serverless](https://github.com/serverless/serverless/blob/master/README_CN.md)
> - 官网：[serverless.com](https://serverless.com/)

欢迎访问：[Serverless 中文网](https://serverlesscloud.cn/)，您可以在 [最佳实践](https://serverlesscloud.cn/best-practice) 里体验更多关于 Serverless 应用的开发！
