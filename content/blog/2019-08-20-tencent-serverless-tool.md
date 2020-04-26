---
title: 腾讯云 Serverless 开发者工具最佳实践
description: 本文整理自上周六举办的「Hello Serverless」技术沙龙深圳站演讲内容
keywords: Serverless
date: 2019-08-20
thumbnail: https://img.serverlesscloud.cn/2020414/1586865925984-lishuai.jpg
categories:
  - news
authors:
  - 李帅
authorslink:
  - https://zhuanlan.zhihu.com/ServerlessGo
tags:
  - 最佳实践
  - serverless
---

> 注：本文整理自上周六举办的「Hello Serverless」技术沙龙深圳站演讲内容，文章核心内容包括四部分：第一，什么是 Serverless；第二，在面向 Serverless 的开发模式中，开发者将会面对哪些困难；第三，我们如何通过开发者工具来提升开发者们的开发体验；最后是工具的一些衍生价值。

## 什么是 Serverless？

![](https://img.serverlesscloud.cn/qianyi/YHl6UWa9s63rNpCMLJdftktrWkHRlpXDeia9iaKX1mMj7FTickOkd4Yicud89yMLvhvuBbgsxDZJwladmAibvlhbUjQ.jpg)

简单来说，Serverless 就是开发者开发好自己的代码，上传到云端。假设我们配置了 apigw 来对外提供服务，那么开发者上传完代码后即可对外提供服务。除了代码本身，开发者不需要关注其他问题。

**Serverless 有如下三个特点：**

1. 计算，存储，网络资源和环境全部由云厂商托管，用户只关心业务代码
2. 免运维，平台根据服务负载进行自动伸缩
3. 按需付费，就像水和电一样

上述 Serverless 的特点或优势，有简单、便宜和省心。这些可能是从老板们的角度出发，老板们会非常喜欢 Serverless 的价值。但是从开发者角度来看，Serverless 能为我们带来哪些便利呢？

首先，Serverless 架构的系统与传统开发模式生命周期的相似点，都包括开发、测试、发布、运维、监控几个环节。不同的是，在 Serverless 架构下，平台帮我们完成了监控和运维的工作。但是开发，测试，发布依然需要开发者自己来完成。

那么，在面向 Serverless 架构的开发、测试、发布中会遇到哪些问题呢？

## Serverless 的问题与挑战

**开发的第一步，就是敲代码。**

云端开发虽然可以在浏览器中直接编辑代码，但是缺点也显而易见 —— 它只能编辑入口文件，而且受限于网络因素、浏览器限制、代码文件大小等，在浏览器中不太可能实现一个媲美桌面客户端的 IDE。业界厂商都在尽量做好 WebIED，但整体效果跟本地 IDE 还相差甚远。像一些很有用的插件，在 WebIDE 中都无法流畅享受，比如差异对比、代码补全等等。

![](data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==)

无法协同开发也是一个很明显的问题。

**既然远程开发体验太差，那我们换成本地开发。**先在本地环境开发，再打包上传到云端。但是问题又来了，这个发布流程并不简单。每次发布都要经历打包、打开浏览器、打开控制台、load 代码、提交到云端等一系列操作。

作为开发者，我相信大家一定有过类似的经历，代码发布到测试环境后不符合预期，反复修改提交。如果每次提交都需要这么冗长的流程，那开发效率就大打折扣了。更重要的是，它无法做一些自动化发布的事情。

![](https://img.serverlesscloud.cn/qianyi/YHl6UWa9s63rNpCMLJdftktrWkHRlpXDpgAIfS7u2qjbHGlM43UeqrDuwdnh4EPdHbicXnY72WNY4TGMgUN8hag.jpg)

**开发完成后，就要进入测试阶段了。**没有人能保证自己的代码没有 bug，所以测试必不可少。云函数需要按照规定的格式编写，上传到云端后跑在云端定制的 runtime 上下文中，runtime 中做了一些环境的初始化，例如环境变量的设置。本地没有 runtime 环境所以无法直接运行。调试也就无从谈起了。同样的，研发同学可能都有过类似的经历 —— 写完代码运行总是不符合预期，但是 view 代码又找不到原因，这个时候如果是传统模式我们会选择 debug，单步调试有问题的代码。但是在 Serverless 的场景下，不可能登录服务商的后台集群去调试。那这个问题就无解了。

当我们生产环境的代码不符合预期时，我们往往会通过日志来收集一些异常信息，帮助我们排查故障。官网控制台虽然可以看日志，但功能很弱。只提供按时间范围搜索或者根据平台的 requested 搜索，这根本满足不了需求。大部分时间，我们用代码中打印的一些信息来搜索想要的日志。

![](https://img.serverlesscloud.cn/qianyi/YHl6UWa9s63rNpCMLJdftktrWkHRlpXDvib1RWWh0Bpr786IG0FcExsem8hAcHib2gMR6AUkXWNRCPXicibJYibjwTg.jpg)

于是，我们会发现面向 Serverless 架构的开发会很困难。说完了问题，接下来我们看看如何解决。

## 解决方案 —— 开发者工具

为了解决面向 Serverless 的开发者的困扰，我们推出了两款开发者工具 —— SCF CLI 和VS Code 插件 —— SCF CLI 是一款为方便云函数开发者而开发的命令行工具，具备本地创建函数、调试函数、发布函数到云端、检索线上 log 等能力。Tencent Serverless Toolkit for VS Code：一款 VS Code 插件，基于 SCF CLI 开发满足开发者可视化操作的需求。

![](https://img.serverlesscloud.cn/qianyi/YHl6UWa9s63rNpCMLJdftktrWkHRlpXDLWD0Cumw629IL1dj6vYmXJlzWu7RvD9MSP7HygMcHdMkaKQyXYdonw.jpg)

**接下来，我们逐一了解下命令行工具的核心功能，顺便解答上节的问题。**

首先，我们可以用 SCF init 一个项目。类似于用 Eclipse 或其他智能 IDE 创建项目。他会帮你生成好主代码文件和 main 函数。其中 index 就是入口代码文件。Template 文件里记录了函数的一些元信息，例如超时时间、内存大小、环境变量等。我们可以基于这个 Helloworld 代码编写自己的业务代码。目前支持 nodejs6、nodejs8、python2、python3、 php5、php7、go 这些语言。

我们也支持从 git 拉取代码。这种用法的典型场景就是可以开发者可以写一些具有通用性的云函数。上传到 git 仓库分享给其他开发者。其他开发者可以拉去这份函数代码做少量改动或者不改动作为自己的云函数发布。

开发完代码，我们就可以本地运行代码测试。这个是通过 invoke 命令来实现的。目前我们支持 Docker 模式和 process 模式运行。

Docker 模式要求客户必须在本地安装 docker 环境，然后运行云函数时命令行工具会用我们准备好的镜像启动 docker 实例，将用户代码载入 docker 运行。这样做的好处是可以完全模拟云端的运行环境。

但是有部分用户反馈，在 Windows 系统上安装 docker 会比较困难，于是我们又开发出了不依赖于 dpocker 的 process 模式。顾名思义，process 模式就是命令行工具启动一个子进程来运行用户代码，最终将结果和输出打印到终端上。作为代价，客户环境必须具备对应语言的执行环境。

一般的问题，我们可以通过打印 log，view 代码来发现问题。但在开发过程中往往会有一些比较隐晦的 bug 比较难定位。这个时候我们需要用 debug 来定位问题。 

相对于直接调用，我们只需要加上 -d 加上端口号，命令行便进入了 debug 模式。你可以通过语言对应的调试 client connect 上来进行调试。例如开发 js 的同学可能会用浏览器来做调试，然后支持单步调试，查看变量，查看堆栈等等基本的调试指令。这样 debug 的功能就实现了，但谈不上易用。

**接下来该介绍 VS Code 插件了。**通过VS Code 插件，我们可以用VS Code 原生的调试入口调试云函数。F9 打断点，F5 启动调试，函数的输出会打印在 terminal 里。可以看到右上角支持单步，可以查看变量，可以查看堆栈。这样用 VS Code 开发云函数就很方便了。改完代码，F5 启动。就可以开始测试了。

**当我们完成开发测试，就可以发布代码了。**

![](data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==)

**目前支持三种发布方法：**

- 最简单是直接上传，但这种上传方式大小会受到限制，上传速度比较慢。
- 我们更推荐用户通过 cos 上传。通过 cos 上传速度快，代码包也不会有大小限制。而且 cos中会存储所有历史的发布版本包，可以满足回滚，回溯的需求。
- 同时，我们也支持了通过 git 上传，每次只需要提交增量修改的文件，也可以复用 git 强大的版本管理能力。这也更符合开发者的习惯。

最后，当我们生产环境异常时，我们可以通过命令行工具来拉取 log。相对于控制台，用命令拉取 log 可以支持我们更复杂的检索需求。使用方式也更贴近 linux 下的风格。例如搭配、管道、重定向，这些机制配合 grep awk 这个工具一起使用。比如说，客户反馈昨晚有段时间页面打不开。需要定位下问题。这个时候可以指定该时间段用 grep 搜索错误的请求。

**另外我们还支持 tail 模式。**这个模式是我个人比较喜欢的。当我们发布新版本时，我们往往需要盯着日志看发布后的日志是否符合预期。这个时候 tail 就很有用了。他会一直阻塞，当云端有新的日志产生时，会在最新的日志显示出来。

既然我们整个研发周期都不用去控制台操作了，那我们就更纯粹点。云端资源的管理也集成进了命令行工具。

再来看下 VS Code 插件，因为 VS Code 插件是基于 CLI 的能力做的。因此功能上是完全一样的。所以从创建项目、开发测试、调试，到发布包括云端管理都可以在 VS Code 中一站完成。你可以在 VS Code 插件市场上搜索 Tencent Serverless Toolkit for VS 安装并使用它。

## 更多特性

基于本节的介绍，我们会发现在 Serverless 架构下，开发者的痛点问题已经得到了解决。但是这还不够，最后再介绍一些衍生用法。

我们规范了 SCF CLI 的退出码和输出，这样就可以支持通过写脚本来完成自动化测试和发布的流程。

因此命令行工具也可以用来对接现有 DevOps 平台。一个经典的 DevOps 的 pipeline 包括了检出代码、依赖安装、测试、审批、发布上线这些环节。可以看到 SCF 场景下的 DevOps 和传统架构并无不同。唯一的区别在于在测试，发布阶段需要依赖命令行工具提供的基础原子能力。所以可以很方便地将云函数接入现有 DevOps 平台。

![](https://img.serverlesscloud.cn/qianyi/YHl6UWa9s63rNpCMLJdftktrWkHRlpXDatbUGMPYho69yBUkPWk602X16icN0GEgBemOFUwXs8DAiaPUrVYxA3Yg.jpg)

后续，我们也会推出云函数官方的 DevOps 流程，敬请期待。

---

> **传送门：**
>
> - GitHub: [github.com/serverless](https://github.com/serverless/serverless/blob/master/README_CN.md) 
> - 官网：[serverless.com](https://serverless.com/)

欢迎访问：[Serverless 中文网](https://serverlesscloud.cn/)，您可以在 [最佳实践](https://serverlesscloud.cn/best-practice) 里体验更多关于 Serverless 应用的开发！
