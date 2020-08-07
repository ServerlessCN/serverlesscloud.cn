---
title: 腾讯云 Serverless CI/CD 自动化部署实战
description: 本文将为大家讲解 Serverless 工作原理、架构优势和 Serverless 应用的开发流程，以及如何使用 Serverless CI/CD 能力进行自动化部署。
keywords:  Serverless, ServerlessDays, Serverless DevOps
date: 2020-07-31
thumbnail: https://img.serverlesscloud.cn/2020731/1596192531300-1596186208253-%E4%BC%81%E4%B8%9A%E5%BE%AE%E4%BF%A1%E6%88%AA%E5%9B%BE_15961861933543.jpg
categories: 
  - best-practice
authors: 
  - 粟俊娥
authorslink: 
  - https://github.com/June1991
tags:
  - CI/CD
  - Meetup
---

本文将为大家讲解 Serverless 工作原理、架构优势和 Serverless 应用的开发流程，以及如何使用 Serverless CI/CD 能力进行自动化部署。

本次和大家分享的提纲如下：

1. 什么是 Serverless CI/CD？
    - Serverless 介绍 
    - Serverless 架构
    - CI/CD 与 Serverless CI/CD

2. Serverless CI/CD 应用
    - Serverless 应用开发流程
    - Serverless CI/CD 优势

3. Serverless CI/CD 实战
    - 基于 Coding CI/CD 的自动化部署
    - 基于 Github CI/CD 的自动化部署

## 什么是 Serverless CI/CD？

### 1. Serverless 介绍

下图一张逻辑架构图，最上面application，下面是系统资源。我们可以通过虚拟机、容器、数据库、存储等来提供系统资源。同时，我们需要对这些系统资源进行维护，比如资源申请、环境搭建、容灾、扩缩容等。

![](https://img.serverlesscloud.cn/2020727/1595849986945-1595507289882.png)

Serverless 是什么呢？Serverless 就是把底层的这些资源以及对这些资源的运维都交给云厂商来维护、这些资源对业务来说是黑盒的，业务只需要关注自己业务逻辑的开发即可。

这种架构思想和方法就是 Serverless。

![]( https://img.serverlesscloud.cn/2020727/1595849806810-1595507411476.png )

Serverless 直译过来叫无服务器，实际上他不是真的不需要服务器，只不过服务器由云厂商来维护。Serverless 是一种软件系统架构思想和方法，不是软件框架、类库或者工具，它的核心思想：无须关注底层资源，比如：CPU、内存和数据库等，只需关注业务开发。

### 2. Serverless 架构

Severless 的架构如下图所示。客户端请求将发送的 API 网关，由云函数进行处理，调用底层资源进行返回。利用云函数自动伸缩的优势，免除用户运维的烦恼。

![](https://img.serverlesscloud.cn/2020727/1595849806956-1595507411476.png) 

使用 Severless 开发应用，能消除传统海量服务器组件需求，降低开发和运维复杂性。Serverless 按需调用，按需伸缩，按使用收费，降低启动成本。由于底层资源调配工作都由云厂商解决，用户只需专注业务逻辑开发即可。

### 3. CI/CD 与 Serverless CI/CD

CI/CD 是 持续集成（Continuous Integration）和持续部署（Continuous Deployment）的简称。指在开发过程中自动执行一系列脚本来减低开发引入 bug 的概率，在新代码从开发到部署的过程中，尽量减少人工的介入。 

Serverless CI/CD 基于 CI/CD 持续集成的 pipeline 机制，实现用户开发部署的全自动化，提升开发效率。

![](https://img.serverlesscloud.cn/2020727/1595849808796-1595507411476.png)

## Serverless CI/CD 应用

### 1. Serverless 应用开发流程

开发一个 serverless 应用，需要进行以下步骤：

1. 引入组件：引入腾讯云封装好的 severless 组件（如 tencent-express），可以快速进行开发。
2. 配置 yml 文件：yml 文件是为了定义您的应用组织资源配置。不同组件对应不同的 yml 配置。
3. 业务开发：进行用户自身业务的开发、调试、测试。
4. 部署上线：把测试通过的功能发布上线。为了业务的稳定，建议进行灰度发布。

更多详细开发部署指南参考官网[《 灰度发布与环境隔离 》](https://cloud.tencent.com/document/product/1154/46330)

![]( https://img.serverlesscloud.cn/2020727/1595849745090-1595577892207.png )

由于 serverless 应用开发过程中调试是直接调用云函数等资源，因此每次修改代码后都需要执行部署命令，反复执行命令行比较繁琐。环境的隔离与灰度发布如果人工配置容易产生错误，因此需要 CI/CD 能力支持。

### 2. Serverless CI/CD 优势

前面讲到 CI/CD 通过在开发过程中自动执行一系列脚本来减低开发引入 bug 的概率，在新代码从开发到部署的过程中，尽量减少人工的介入。

使用 Serverless CI/CD，主要是利用 CI/CD 已有的优势，让 serverless 开发部署自动化，提高开发的效率，减少人工产生的出错。

## Serverless CI/CD 实战

腾讯云 Serverless目前支持多种 CI/CD 部署方式，这里以 tencent-express 组件开发 serverless 应用为例，演示基于 Coding 以及基于 Github 两种方式的 CI/CD 自动化部署实践。

### 1. 基于 Coding CI/CD 的自动化部署

<video id="video" controls="" preload="none" poster="https://img.serverlesscloud.cn/2020731/1596185570994-Serverless_CICD_First_Frame.png">
      <source id="mp4" src="https://serverlessimg-1253970226.cos.ap-chengdu.myqcloud.com/2020630/Serverless%20CICD.mp4" type="video/mp4">
      </video>
​      

### 2. 基于 GitHub CI/CD 的自动化部署

<video id="video" controls="" preload="none" poster="https://serverlessimg-1253970226.cos.ap-chengdu.myqcloud.com/2020630/github_CICD_First_Frame.png">
      <source id="mp4" src="https://serverlessimg-1253970226.cos.ap-chengdu.myqcloud.com/2020630/github%20CICD.mp4" type="video/mp4">
      </video>


> **附：**[Demo 源码地址](https://github.com/June1991/express-demo)

---
<div id='scf-deploy-iframe-or-md'></div>

---

> **传送门：**
> - GitHub: [github.com/serverless](https://github.com/serverless/serverless/blob/master/README_CN.md)
> - 官网：[serverless.com](https://serverless.com/)

欢迎访问：[Serverless 中文网](https://serverlesscloud.cn/)，您可以在 [最佳实践](https://serverlesscloud.cn/best-practice) 里体验更多关于 Serverless 应用的开发！