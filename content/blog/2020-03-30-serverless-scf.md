---
title: 腾讯云云函数 SCF 初探
description: 现在 Serverless 这么火，那么就拿腾讯云的 SCF 云函数作为一个入门的 helloword。
keywords: Serverless,SCF,Serverless应用
date: 2020-03-30
thumbnail: https://img.serverlesscloud.cn/2020522/1590164894454-%E4%BC%81%E4%B8%9A%E5%BE%AE%E4%BF%A1%E6%88%AA%E5%9B%BE_15901648851993.png
categories:
  - user-stories
authors:
  - 槽痞
authorslink:
  - https://cloud.tencent.com/developer/user/1033425
tags:
  - Serverless
  - 云函数
---

前不久的微信开发者大会上在推他们的Serverless架构，即他们的产品**腾讯云函数SCF**。

当然这个也不是新鲜的事物，在亚马逊提供的同类服务叫做**lambda**,阿里云提供的则叫做**函数计算**，Cloudflare的则名为`workers`。

在编程语言的支持上，除了Cloudflare的`workers`只支持`javascript`。

其余几家都支持`python、php、golang、node，java`等主流开发语言。

关于`workers`的描述，Cloudflare官网是这样描述的：

> ……Cloudflare Workers provides a lightweight JavaScript execution environment that allows developers to augment existing applications or create entirely new ones without configuring or maintaining infrastructure.

大意就是**workers提供一个免运维的轻量级的js的运行环境**

现在微信[小程序开发](https://cloud.tencent.com/solution/la?from=10680)这么火，那么就拿腾讯云的SCF云函数作为一个入门的**helloword**。

首先抛出官方文档：[https://cloud.tencent.com/document/product/583/9199](https://cloud.tencent.com/document/product/583/9199?from=10680)

关于无服务器的概述，文档已经说得很清楚:

> 无服务器（Serverless）不是表示没有服务器，而表示当您在使用 Serverless 时，您无需关心底层资源，也无需登录服务器和优化服务器，只需关注最核心的代码片段，即可跳过复杂的、繁琐的基本工作。核心的代码片段完全由事件或者请求触发，平台根据请求自动平行调整服务资源。Serverless 拥有近乎无限的扩容能力，空闲时，不运行任何资源。代码运行无状态，可以轻易实现快速迭代、极速部署。

大意就是运维可以下岗了，老板胆子大的话，后端也可以下岗了，一个前端就可以全干，啊不，是全栈（狗头保命）。

此处注册登录流程省略一千字。

## **创建云函数**

创建函数主要有三种：

- web控制台创建
- 本地命令行CLI创建
- VS Code插件创建

需要注意的是，使用**golang开发在web控制台在线创建自定义代码时会失败**，会报一个`No Match Module: Get lambda file failed`的错误。

如果语言是PHP和Python创建是成功的。

VS Code创建流程差不多，略过。

重点说说本地命令行CLI创建。

说明文档：[https://cloud.tencent.com/document/product/583/37510](https://cloud.tencent.com/document/product/583/37510?from=10680)

大前提：**无论用哪种编程语言作为开发语言，都要先安装好python环境。**

安装scf就一个命令：`pip install scf`

安装好之后可以查看scf版本： `scf --version`

继续执行：`scf configure set`进行配置。

相关的配置信息，可以打开腾讯云的web控制台查看。

接下来就是**编写函数**部分了。

执行项目初始化命令：`scf init -n go_test -r go1`

这个命令中参数`-n`是执行项目名，`-r`是指定开发环境，不指定的话默认初始化用的是Python3，具体可用的环境可以查看文档的相关部分或使用`scf init --help`查看帮助信息。

这样就在当前目录下生成到了一个`go_test`的目录。

`cd go_test`进入目录里面看可以看到初始化好的信息。

本文章选定的是golang，开发环境是windows,关于go的使用文档可以看：[https://cloud.tencent.com/document/product/583/18032](https://cloud.tencent.com/document/product/583/18032?from=10680)。

需要注意的是，**最后生成的二进制文件的名字。**

说明文档中使用的是：

```javascript
set GOOS=linux
set GOARCH=amd64
go build -o main main.go
```

按照说明打包部署执行`scf deploy`,会报错:

```javascript
[x] [ERROR]  default - go_test: Deploy function 'go_test' failure, No Match Modu
le: Get lambda file failed. RequestId: xxxxxxxxxxxxxxxxxxxx-xxxxx
```

最后找原因发现是scf部署时是按照`template.yaml`里面的`handler`字段来匹配的，而这个字段需要和二进制文件以及打压缩包的名字一致。

所以解决办法是要么把yaml配置文件中的`handler`名字改为`main`，或者重新编译

```javascript
go build -o index index.go  //如果没有修改生成的默认文件名index.go
```

此时再去按照流程部署会发现能部署成功。

执行方式有几种，其中云端调用函数执行的命令是`scf remote invoke -n go_test`，具体文档里面也有交代，说明文档：[https://cloud.tencent.com/document/product/583/38310](https://cloud.tencent.com/document/product/583/38310?from=10680)

流程差不多就是这样，别的特性或功能，可以去官方文档去探索。

## **题外话**

关于触发器，某些地区会缺少。

比如我选择创建云函数的地区是「成都」，触发器只有三种：

定时触发，[cos](https://cloud.tencent.com/product/cos?from=10680)触发，kafka触发三种。

而说明文档种提到的[**API网关**](https://cloud.tencent.com/product/apigateway?from=10680)**触发方式**在成都区是没有的，

换到广州区，创建的云函数就多了一个API网触发的选项。

如果刚好你是需要做web服务的话，是需要用到**api网关触发器**的，真要使用的话，除了换区也没啥选择了。

通常来说，很多云服务对内网流量是免费的，比如腾讯云COS，而云函数也有一些内网流量的免计费的说明，如果你的服务器刚好部署在成都区，那么，流量就变成走公网得收费了，当然还有时延问题。

这个也说明云函数还有待完善的地方，不过相信以后还是会越来越好。

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
