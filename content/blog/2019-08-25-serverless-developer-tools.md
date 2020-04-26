---
title: Serverless 的开发者工具建设
description: 本文将介绍 Serverless 生态下的开发者工具，并简述这些工具是如何贯穿开发、调试、测试和部署的生命周期，提升开发者效率的。
keywords: Serverless 调试,Serverless 测试,Serverless 开发者工具
date: 2019-08-25
thumbnail: https://img.serverlesscloud.cn/20191227/1577410169726-v2-39310147fa3da94245233a204c6144c1_1200x500.jpg
categories:
  - guides-and-tutorials
authors:
  - Tinafang
authorslink:
  - https://github.com/tinafangkunding
tags:
  - 工具建设
  - serverless
---

由于 Serverless 平台具备弹性扩缩、免运维、按需付费等特点，越来越多的公司和个人开始使用 Serverless 承载项目。但对于开发者而言，Serverless 一定程度上减少了开发难度，可以让我们聚焦业务逻辑进行开发；但同时，由于 Serverless 颠覆了传统的开发模式，从而在相关的开发工具，函数编排组织上也面临着重大挑战。

## 面向 Serverless 开发的挑战

从一个开发者的角度而言，Serverless 开发和传统的开发方式相比发生了很大的改变。开发者习惯了在本地进行开发，调试，测试和持续集成，持续部署等流程，在面向 Serverless 进行开发时，免不了会有很多疑问：

*   怎样本地开发一个 Serverless 项目？
*   怎样对 Serverless 函数进行本地调试？
*   开发过程中打印的日志是否可以方便的检索并用于 debug？
*   如何保证本地环境和云端环境的一致？
*   发布时怎样将多个函数一次性发布到云环境中？

## 面向 Serverless 的工具建设逻辑

面临开发过程中的种种挑战，开发者工具将从开发者的视角出发，使 Serverless 的项目开发更贴近用户习惯。

下面是一张项目开发的生命周期流程图，可以看到，在项目的开发过程中，至少要经历需求、编码、构建、测试、发布、部署和运维等几个阶段。

在代码的编码和构建阶段通过持续集成完成代码的自动构建，成为持续集成 CI（Continuous Integration）；在代码的发布和部署阶段，通过配置灰度策略，告警和回滚计划等，从而可以完成代码的持续交付 CD（Continuous Delivery）。

此外，在开发者的开发过程中，也会遇到编码、调试和单元测试，集成测试等场景，这些功能的支持也是面向 Serverless 架构进行开发中必不可少的一环。对开发者工具的建设，则会重点解决在整个生命周期中的痛点。

![项目开发生命周期](https://img.serverlesscloud.cn/20191227/1577410168549-v2-39310147fa3da94245233a204c6144c1_1200x500.jpg)

## 面向 Serverless 的开发者工具

在 Serverless 技术趋势大热的今天，已经涌现出很多面向开发者的解决方案和工具，例如开源的 Serverless Framework，Zappa 和 ClaudiaJS 等工具。

开发者工具大部分都通过调用云厂商中 Serverless 产品的 API/SDK，封装底层能力，并提供给客户更加直观便捷的使用方式。目前比较常见的开发工具中，主要分为 CLI 命令行工具以及 IDE 插件这两种形态。虽然展现方式不同，但本质上都是降低了本地开发 Serverless 项目的门槛，并在云平台提供的基础能力上，封装了更多组织和编排的方式。

**本文将以腾讯云的云函数为例，介绍较为典型的开发工具 —— 腾讯云 Serverless 本地开发工具及 VS Code 插件。**

腾讯云 Serverless 本地开发工具（SCF CLI）以开源项目的形式维护，目的在于让用户方便的实现函数打包、部署、本地调试，也可以方便的生成云函数的项目并基于 demo 项目进一步的开发。SCF CLI 通过一个函数模板配置文件，完成函数及相关周边资源的描述，并基于配置文件实现本地代码及配置部署到云端的过程。

下面我们以一个 Serverless 项目为例，展示 Serverless 开发工具的使用流程：

### 1、函数开发和编码

首先，安装并配置了 SCF CLI 后，可以通过 --help 命令查看所支持的命令，之后通过 scf init 命令快速生成一个函数 demo。在创建完毕后，可以看到生成了 index.js 文件和template.yaml 文件。

其中，index.js 是函数的入口文件，tempate.yaml 则是通过特定的格式记录了函数的配置信息，如内存大小，超时时间等信息。tempate.yaml 也是后续对函数进行编排和组织的关键。除了简单的 init 命令之外，SCF CLI 也支持从 git 拉取代码和一些已有的函数模板，便于客户基于特定的场景快速开发。

### 2、代码调试

在开发过程中，开发者会选取自己熟悉的 IDE 代码编辑器进行代码编写。为了便于更快速直观的进行本地开发和调试，通过腾讯云 VS Code 插件支持了一键调试的能力。

首先，可以打开刚创建函数的文件目录，在插件中会自动识别这个函数。之后可以通过 F9 进行断点，F5 启动调试能力。函数调试过程中的输出会打印在 terminal 中，并且支持单步调试，查看变量和堆栈等信息。

![VSCode](https://img.serverlesscloud.cn/20191227/1577410168691-v2-39310147fa3da94245233a204c6144c1_1200x500.jpg)

### 3、代码发布

完成了开发和测试后，也可以分别通过 VS Code 插件或 CLI 进行代码的发布。目前分别支持了zip 打包发布，通过 COS（对象存储）上传并发布，以及通过 git 仓库发布，每次只提交增量修改的文件。在发布完毕后，还可以通过插件中的云端调试，来查看在云端的运行状况和返回日志。

![VSCode 2](https://img.serverlesscloud.cn/20191227/1577410168528-v2-39310147fa3da94245233a204c6144c1_1200x500.jpg)

### 4、多函数部署

在 VS Code 插件及 CLI 中，可以很方便的将单函数部署在云端，那么如果希望快速发布多个函数时，应该怎样操作呢？

目前也可以直接通过 SCF CLI 的 deploy 命令来实现。只需要通过一个 template.yaml 来维护多个函数的信息即可。

除了发布之外，还可以通过 template.yaml 文件中的 Global 字段来定义一些函数的通用配置，从而解决开发过程中，希望多个函数共用相同配置的痛点（例如共用相同的环境变量，超时时间和内存等，不需要重复配置）

例如，在我的工作空间下，有两个函数「hellotinatest234」以及「testscflinux」需批量部署上传，并且两个函数使用公共配置。则可以在 template.yaml 中分别定义两个函数的属性，并且定义 Global 字段指定公共配置。部署过程和 yaml 的样式如下：

![多函数部署](https://img.serverlesscloud.cn/20191227/1577410168641-v2-39310147fa3da94245233a204c6144c1_1200x500.jpg)

### 5、异常排查 - 日志能力

除了开发流程之外，在生产环境异常时，也可以通过 CLI 的 logs --tail 等命令，快速灵活地进行日志查询等，并且可以配合 grep awk 等工具使用。当发布新版本时，采用 tail 模式可以实时打印云端日志，方便开发者快速查看问题。

![异常排查](https://img.serverlesscloud.cn/20191227/1577410168524-v2-39310147fa3da94245233a204c6144c1_1200x500.jpg)

### 6、DevOps 能力

最后是云函数的 DevOps 能力。目前已经支持了和 Jekins，Coding 和蓝鲸平台等对接。并且还在持续对 Coding 平台做更深度的整合，提供开箱即可用的 DevOps 能力。

![DevOps](https://img.serverlesscloud.cn/20191227/1577410168565-v2-39310147fa3da94245233a204c6144c1_1200x500.jpg)

## 开发者工具总结和展望

随着 Serverless 生态的逐步完善，工具可以覆盖的场景会越来越多。例如，可以在本地模拟 API 网关的请求，或是通过集成常用的测试框架，对函数进行单元测试和整体性测试等。开发者也有更广阔的空间可以去参与其中，构建一个面向 Serverless 的开发架构。

后续开发者工具会更加着重于对函数及函数周边资源的组织方式（网关，DB 等），从项目/应用的维度出发，让开发者可以快速通过工具搭建一个常用的使用场景（如 WEB 网站，文件上传工具等），从而更好地了解 Serverless 项目的组织方式。

此外，在持续集成和持续交付的对接中，开发者工具也将支持更便捷，通用的配置，便于规范开发流程，承载大型项目和核心业务。

> **传送门：**
> - GitHub: [github.com/serverless](https://github.com/serverless/serverless/blob/master/README_CN.md) 
> - 官网：[serverless.com](https://serverless.com/)

欢迎访问：[Serverless 中文网](https://serverlesscloud.cn/)，您可以在 [最佳实践](https://serverlesscloud.cn/best-practice) 里体验更多关于 Serverless 应用的开发！
