---
title: 入门 Serverless：Serverless Framework 开发者工具
description: Serverless 架构是云发展的产物。然而，细心的朋友可能会发现，有一个开发者工具也叫 Serverless，那么这个开发者工具和 Serverless 架构又有什么关系呢？
keywords: Serverless 全局变量组件,Serverless 单独部署组件,Serverless Component
date: 2020-03-25
thumbnail: https://img.serverlesscloud.cn/2020331/1585640629003-office.jpg
categories:
  - guides-and-tutorials
authors:
  - Anycodes
authorslink:
  - https://www.zhihu.com/people/liuyu-43-97
tags:
  - Serverless
  - Component
---

> Serverless 架构是云发展的产物，是一种去服务器化更加明显的架构。然而，细心的朋友可能会发现，有一个开发者工具也叫 Serverless，那么 Serverless 到底是一个架构，还是一个开发者工具呢？这个开发者工具和 Serverless 架构又有什么关系呢？

## 初探 Serverless 开发者工具

Serverless 架构开始发展没多久，就有一群人注册了 serverless.com 的域名，成立了一家叫 Serverless 的公司，同时还开发了一款同名工具。

Serverless 架构和 Serverless 开发者工具是两个不同的东西，如果类比一下的话，就相当于中国电信，一方面指的是中国电信行业，另一方面也指的是中国电信运营商。

![入门 Serverless ：Serverless Framework开发者工具](https://img.serverlesscloud.cn/2020-03-31-071949.png)

从 Serverless 的公司名称，我们也可以推断出其推出的产品与 Serverless 架构紧密相关。在各个云厂商都有自己函数计算业务的时候，Serverless 团队做了一个类似多云管理平台的工具，可以认为是多 Serverless 管理的工具。利用这个工具，可以快速直接使用 AWS 的 Lambda、Azure 的 Funtions 以及腾讯云 SCF 等众多云厂商的函数计算相关服务，大体支持的功能如下：

![入门 Serverless ：Serverless Framework开发者工具](https://img.serverlesscloud.cn/2020-03-31-071956.png)

通过这个上表，大家也可以感觉到这其实是个开发者工具，帮助用户快速使用多个云厂商的函数服务，打包、部署、回滚…当然，各个厂商也都推出类似的工具，例如 AWS 的 SAM、腾讯云的 SCFCLI 等。

除了一个以函数计算为核心的多云开发者工具之外，Serverless 公司还推出了组件化工具：Components。换句话说，Serverless 开发者工具不仅仅关注 Serverless 中的 FaaS，也要关注 BaaS，将 API 网关、对象存储、CDN、数据库等众多的后端服务和函数计算有机集合，让用户可以一站式开发，一站式部署，一站式更新，一站式维。

Serverless Framework 开发者工具可以被一分为二：Plugin 和 Components。

![入门 Serverless ：Serverless Framework开发者工具](https://img.serverlesscloud.cn/2020-03-31-071955.png)

如果说最初的 Serverless Cli 更多是一种以插件（Plugin）形式提供各个云厂商的函数计算功能，那么这个叫 Components 的功能更多就是以各个云厂商整体服务为基础，来帮助用户快速将项目部署到 Serverless 架构上。

所谓的 Components 可以认为是很多 Component 的组合，例如如果部署一个网站，可能会需要有以下部分：静态资源部分、函数计算部分、API 网关部分、CDN 部分、域名解析部分等，而 Components 就可以帮我们一站式部署这些资源，将静态资源部署到对象存储中，将函数计算部分部署到函数中，将 API 网关、CDN 等业务部署到对应的产品或者服务中，如果有域名解析需求，会自动解析域名，同时将整个项目的所有资源进行关联。

除了一键部署、自动关联之外，Components 还提供了若干的传统 Web 框架部署到 Serverless 架构的解决方案，用户可将自己已有的或者使用这些框架新开发的项目，直接一键部署到云端，对开发者来说这是一个巨大的便利。

用户如何使用 Plugin 和 Components 呢？其实这两个功能都是 Serverless Cli 作为承载，也就是说，只要我们安装了 Serverless Framework 这个开发者工具，就可以同时使用这两个功能。

安装 Serverless Framework 开发者工具的过程也很简单：

- 安装 Nodejs，官方说的 nodejs 只需要 6 以上就好，但是在实际使用过程中，发现 6 不行，至少 8 以上才可以。
- 安装 Serverless 开发者工具：`npm install -g serverless`，安装完成之后可以通过`serverless -v`查看版本号，来确定是否成功的安装该工具。

至于如何使用 Serverless Framework 开发者工具，可以参考接下来的 Plugin 和 Components 部分。

## 什么是 Serverless Plugin

首先，什么是 Plugin，Serverless Framework Plugin 实际上是一个函数的管理工具，使用这个工具，可以很轻松的部署函数、删除函数、触发函数、查看函数信息、查看函数日志、回滚函数、查看函数数据等。

Plugin 的使用比较简单，可以直接使用 Serverlss Framework 进行创建，例如：

```
    serverless create -t tencent-python -p mytest
```

然后就会生成下图：

![入门 Serverless ：Serverless Framework开发者工具](https://img.serverlesscloud.cn/2020-03-31-072000.png)

这其中，-t 指的是模板，-p 指的是路径，在 Serverless Plugin 操作下，可以在任何指令中使用 -h 查看帮助信息，例如查看 Serverless Plugin 的全部指令，可以直接：

![入门 Serverless ：Serverless Framework开发者工具](https://img.serverlesscloud.cn/2020-03-31-071950.png)

如果想查看 Create 的帮助：

![入门 Serverless ：Serverless Framework开发者工具](https://img.serverlesscloud.cn/2020-03-31-071957.png)

创建完 Serverless Plugin 的项目之后，我们可以看一下它的 Yaml 长什么样子：

![入门 Serverless ：Serverless Framework开发者工具](https://img.serverlesscloud.cn/2020-03-31-71953.png)

通过 Yaml，我们可以看到其从上到下包括了几个主要的 Key：Service、Provider、Plugins 以及 Functions。

Service 可以认为是一个服务或分组，即在一个 Service 下面的函数是可以被统一管理的，例如部署、删除、查看统计信息等。

Provider 可以认为是供应商以及全局变量的定义场景，这里使用的是腾讯云的云函数，供应商是腾讯云，所以就要写 tencent，同时在这里还可以定义全局变量，这样在部署的时候，会将这些全局变量分别配置到不同的函数中。

Plugin 就是插件，Serverless 团队提供了超级多的 Plugin，例如上文提到的 serverless-tencent-scf。

最后就是 Functions，是定义函数的地方。

创建项目，完成代码编写和 Yaml 的配置之后，接下来就是安装 Plugin：


```
	npm install
```

![入门 Serverless ：Serverless Framework开发者工具](https://img.serverlesscloud.cn/2020-03-31-071954.png)

使用相关功能，例如部署服务：

```
	serverless deploy
```

在使用这个工具部署的时候，我们并没事先指定账号信息，所以它会自动唤起扫码登录，登陆之后会继续进行操作：

![入门 Serverless ：Serverless Framework开发者工具](https://img.serverlesscloud.cn/2020-03-31-071951.png)

操作完成会看到 Service 信息，这里要注意，如果是使用 CICD，就没办法扫码了，必须手动配置账户信息，格式是：


```
    [default]
    tencent_appid = appid
    tencent_secret_id = secretid
    tencent_secret_key = secretkey
```

配置完成之后，在 Yaml 中指定这个文件路径：

![入门 Serverless ：Serverless Framework开发者工具](https://img.serverlesscloud.cn/2020-03-31-071959.png)

完成部署之后，触发函数：

![入门 Serverless ：Serverless Framework开发者工具](https://img.serverlesscloud.cn/2020-03-31-071952.png)

服务信息：

![入门 Serverless ：Serverless Framework开发者工具](https://img.serverlesscloud.cn/2020-03-31-71956.png)

除此之外，还有很多其它操作，大家有兴趣可以都试一下：

- 创建服务
- 打包服务
- 部署服务
- 部署函数
- 云端调用
- 查看日志
- 回滚服务
- 删除服务
- 获取部署列表
- 获取服务详情
- 获取统计数据

…

需要注意的是，Plugin 是函数开发者工具，只针对对函数资源的管理（触发器除外），不包括 API 网关、COS、数据库、CDN 等。另外，在腾讯云函数中只有命名空间和函数的概念，但是在 Serverless Framework Plugin 中却有 Service、Stage 以及函数的三层概念，同时云函数在 Plugin 不支持命名空间，所以我们可以理解为，云函数只有函数的概念，而工具却有服务、阶段和函数的三层概念，这就会产生问题：Service 和 Stage 是什么？在函数中怎么体现？

以我们刚才部署的 hello_world 为例：

![入门 Serverless ：Serverless Framework开发者工具](https://img.serverlesscloud.cn/2020-03-31-071953.png)

从上图可以看到，Service 和 Stage 体现在函数名和标签两个地方。函数名在简单使用时可能没有影响，但如果涉及到函数间调用或者是云 API 使用函数时，就要注意，这里的函数名并不是在 Yaml 中的函数名！

当然，这里也会出现另一个问题，即如果用户已经有一个函数，且这个函数不是按照三段式命名的，那么可能没有办法使用 Plugin 进行部署，除非把函数进行迁移，将原函数删掉，使用 Serverless 重新进行部署。

## 什么是 Serverless Component

Plugin 主要是对函数的管理，那么 Component 呢？Component 可以认为是云产品的工具，因为通过 Componnt 可以对所有的组件进行组合使用，甚至还可以很简单开发出自己的 Component 来满足需求。

Component 的 Yaml 是一段一段的，而 Plugin 的 Yaml 是一个整体，Component 中前后两个组件可能是完全没有任何关系的，例如：

```yaml
test1:
  component: "@gosls/tencent-website"
  inputs:
    code:
      src: ./public
      index: index.html
      error: index.html
    region: ap-shanghai
    bucketName: test1


test2:
  component: "@gosls/tencent-website"
  inputs:
    code:
      src: ./public
      index: index.html
      error: index.html
    region: ap-shanghai
    bucketName: test2
```

通过 Yaml 我们可以看到整个的代码可以分为两部分，是把一个网站的代码放到了不同的 Bucket。

目前腾讯云的 Component 的基础组件包括：


```yaml
@serverless/tencnet-scf
@serverless/tencnet-cos
@serverless/tencnet-cdn
@serverless/tencnet-apigateway
@serverless/tencnet-cam-role
@serverless/tencnet-cam-policy
```

封装的上层 Component 包括：


```yaml
@serverless/tencnet-express
@serverless/tencnet-bottle
@serverless/tencnet-django
@serverless/tencnet-egg
@serverless/tencnet-fastify
@serverless/tencnet-flask
@serverless/tencnet-koa
@serverless/tencnet-laravel
@serverless/tencnet-php-slim
@serverless/tencnet-pyramid
@serverless/tencnet-tornado
@serverless/tencnet-website
```

基础 Component 指的是可通过相关的 Component 部署相关的资源，例如 tencent-scf 就可以部署云函数，tencent-cos 就可以部署一个存储桶；上层的 Component 实际上就是对底层 Component 的组合，同时增加一些额外的逻辑，实现一些高阶功能，例如 tencent-django 就可以通过对请求的 WSGI 转换，将 Django 框架部署到云函数上，其底层依赖了 tencent-scf/tencent-apigateway 等组件。

相对于 Plugin 而言，Component 并没有那么多的操作，只有两个：部署和移除。

例如部署操作：


```
serverless --debug
```

![入门 Serverless ：Serverless Framework开发者工具](https://img.serverlesscloud.cn/2020-03-31-71959.png)

移除操作：


```
serverless remove --debug
```

![入门 Serverless ：Serverless Framework开发者工具](https://img.serverlesscloud.cn/2020-03-31-071958.png)

相对于 Plugin 而言，Component 的产品纬度是增加了，但是实际功能数量是缩减了。不过，这也不是大的问题，毕竟 Plugin 可以和 Component 混用，真正需要解决的问题是，这两者的 Yaml 不一样，如何混用？

## 总结

- Plugin 部署到线上的函数，会自动变更名字，例如函数是 myFunction，服务和阶段是 myService-Dev，那么函数部署到线上就是 myService-Dev-myFunction，这样的函数名，很可能会让函数间调用产生很多不可控因素：如果环境是 Dev，函数间调用就要写函数名是 myService-Dev-myFunction，如果环境是 Test，此时就要写 myService-Test-myFunction。在我看来，环境更改只需要更改配置，无需更改更深入的代码逻辑，因此这一点会让我觉得不友好；
- Plugin 也是有优势的，例如如果有 Invoke、Remove 以及部署单个函数的功能，同时 Plugin 也有全局变量，它像是一个开发者工具，可以进行开发、部署、调用、查看信息、指标以及删除回滚等操作；
- Components 可以看作是一个组件集，这里面包括了很多的 Components，有基础的 Components，例如 cos、scf、apigateway 等，也有一些拓展的 Components，例如在 cos 上拓展出来的 website，可以直接部署静态网站等，还有一些框架级的，例如 Koa，Express；
- Components 除了支持的产品多，可以部署框架之外，对我来说，最大吸引力在于其部署到线上的函数名字就是指定的名字，不会出现额外的东西；
- Components 相对 Plugin 在功能上略显单薄，除了部署和删除，再没有其他功能。当你需要部署多个东西，并写在了某个 Components 的 yaml 上，那么即使你只修改了一个函数，它都需要全部重新部署一遍；
- Components 更多的定义是组件，所以在 Components 中是没有全局变量的。



---
<div id='scf-deploy-iframe-or-md'></div>

---

> **传送门：**
> - GitHub: [github.com/serverless](https://github.com/serverless/serverless/blob/master/README_CN.md)
> - 官网：[serverless.com](https://serverless.com/)

欢迎访问：[Serverless 中文网](https://serverlesscloud.cn/)，您可以在 [最佳实践](https://serverlesscloud.cn/best-practice) 里体验更多关于 Serverless 应用的开发！
