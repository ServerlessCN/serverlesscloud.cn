---
title: 以微信小程序相册为例，看 Serverless DevOps 最佳实践
description: 本文是孔令飞老师关于腾讯云 Serverless 的运维能力，Serverless 对运维的影响，微信小程序相册的运维案例等内容的分享。
date: 2019-11-25
thumbnail:  https://img.serverlesscloud.cn/qianyi/images/YHl6UWa9s62w4ruXJfGC1cyrvghGLP4Soo8yKbof3TCsEBicDNtJzaA57rCz65AybR3q14luVvG8kicVMibmcrXMg.jpg
categories:
  - news
authors:
  - liujiang
authorslink: 
  - https://github.com/jiangliu5267
tags:
  - 小程序
  - DevOps
---

> 近日，云+社区技术沙龙“高效智能运维”圆满落幕。本期沙龙围绕运维展开了一场技术盛宴，从 AIOps、Serverless DevOps、蓝鲸 PaaS平台、K8S等分享关于业务运维的技术实践干货，同时带来腾讯海量业务自研上云实践，推动传统运维向云运维转型。本文是孔令飞老师关于腾讯云 Serverless 的运维能力，Serverless 对运维的影响，微信小程序相册的运维案例等内容的分享。

# **一、前言**

在开始讲之前，先来看下，在互联网时代我们的核心诉求是什么？——我们的核心诉求是应用，能够提供业务能力的**应用**。

如下图所示，为了能让应用对外提供服务，我们还需要能在某个地方**部署应用**，需要一系列的系统资源，比如计算、网络、存储、数据库等；等应用部署起来之后，我们还要**更新应用、监控应用**的运行状态等，这几个维度基本涵盖了我们的所有需求。

![serverless](https://img.serverlesscloud.cn/qianyi/images/VY8SELNGe95Q1KvZ6icJib5Ea8dvmh4Yr3BAZor8WH8TdomFX5sSofU7kcmibfUXa3wAMFJqMturN3OUhOc1bQwZQ.jpg)

为了满足这些需求，**在应用层面**，我们引入了软件架构，比如单体架构和微服务开发框架。借助 Doker、KVM 等来提供系统资源。借助 EFK、Promethus、Coding 来实现应用生命周期管理。随着这些组件的引入，我们需要花费人力来对这些资源进行运维。底层的系统资源我们需要系统运维、虽然 EFK，Promethus 组件可以提供业务运维能力，但我们也需要对这些平台进行运维。其实我们真正需要的运维是业务运维。

那么有没有一种手段，让我们尽可能少或者不进行系统系统和平台运维呢？答案是有的，我们可以采用 Serverless 的技术方案。本次分享，我会借助腾讯云 Serverless 产品，来说明 Serverless 技术是如何淡化用户的平台运维和系统运维的。

本次分享将从以下几方面讲解：

- 什么是 Serverless
- Serverless 的业务运维能力
- Serverless 与 IaaS 层运维能力对比
- 微信小程序相册是如何在 Serverless 技术下做运维

# **二、Serverless 介绍**

**1.Serverless：云计算新趋势**


在讲什么是 Serverless 之前，我想先给大家展示下 Serverless 目前有多火。

最近几年微服务和 k8s 很火，这是一张 Serverless 跟他们的热度对比图，蓝色的曲线是 Serverless 的热度曲线图，可以看到从 2016 年开始，Serverless 的热度是要大于微服务和 k8s 的。右边这张图展示了 Serverless 产品化落地情况。，Serverless 最初是在 2010 年被提出，2014 年 aws 推出了 lambda 服务，把 Serverless 产品化，并收到了很好的效果，微软、google 和 IBM 看到后，也分别在 2016 年推出了自己的 Serverless 产品。阿里云和腾讯云也分别在 2017 年推出了自己的 Serverless 产品。

![serverless](https://img.serverlesscloud.cn/qianyi/images/VY8SELNGe95Q1KvZ6icJib5Ea8dvmh4Yr3mY7w5zV910HdYcJaLZbfcGDI7X5sLVibopaoW7wjzXNjRwVycibTHjQg.jpg)

**2. 什么是 Serverless？**

这里介绍下什么是 Serverless。这是一张逻辑架构图，最上面是我们的 application，下面是系统资源。我们可以通过虚拟机、容器、数据库、存储等来提供系统资源。同时，我们需要对这些系统资源进行维护，比如：资源申请、环境搭建、容灾、扩缩容等。Serverless 是什么呢，Serverless 就是把底层的这些资源以及对这些资源的运维都交给云厂商来维护、这些资源对业务来说是黑盒的，业务只需要关注自己业务逻辑的开发即可。这种架构思想和方法就是 Serverless。

![serverless](https://img.serverlesscloud.cn/qianyi/images/VY8SELNGe95Q1KvZ6icJib5Ea8dvmh4Yr37cmicB1JhmzCvgSVGgxVleF2A5bV87gEUspoQZUZyawaDSkf3lsJsqg.jpg)

Serverless 直译过来叫无服务器，实际上他不是真的不需要服务器，只不过服务器由云厂商来维护，Serverless 是一种软件系统架构思想和方法，不是软件框架、类库或者工具，它的核心思想：无须关注底层资源，比如：CPU、内存和数据库等，只需关注业务开发。

我们把系统资源进行 Serverless 化，这些系统资源大概分为 2 大类，一种是 CaaS：compute as a service 用来提供计算能力，一种是 BaaS：backend as a service，相当于把第三方组件也 Serverless 化，用户也不用去关注第三方组建的搭建和运维，只需要调用 api 去使用即可。所以 Serverless 大概可以理解为：CaaS + BaaS。

**3. Physical Machine vs. Virtaul Machine vs. Container vs. Serverless**

这里我们通过对比来看下 Serverless 所能提供的价值。在软件研发领域，我们绕不开的 2 个环节是软件的部署和运维。如果我们要上线一个业务，在物理机阶段，我们要去购买物理服务器，然后还可能需要去建自己的机房，安装制冷设备，招聘运维人员，然后在上面搭建一系列的基础设施，比如：虚拟化，操作系统，容器等，有很多工作要去做。到了虚拟机这一阶段，云厂商维护了硬件和虚拟化这 2 个基础设施，到了容器这一阶段云厂商又维护了 OS、容器和 Runtime，可以看到用户需要做的运维工作越来越少。然后到了 Serverless 这个阶段，用户只需要关注 Function，也就是只需要关注自己的业务逻辑。可以看到随着阶段的演进用户需要关注的点越来越少，越来越聚焦于自己的业务逻辑。所以在 物理机阶段我们开发一个业务可能需要 8 个人，在 Serverless 阶段，我们只需要 2 个人，节省了很多人力，我们可以把节省的人力投入到业务研发这块儿，提高产品的迭代速度，进而提高产品的竞争力。

![serverless](https://img.serverlesscloud.cn/qianyi/images/VY8SELNGe95Q1KvZ6icJib5Ea8dvmh4Yr37Epa7x1wUKUYE2rCbvKQvfnzMbKvPkNeKD0icjxN8S1sjPchMIGOkog.jpg)

由这张图我们也可以看到，过去十多年云计算其实是一个“去基础架构”的过程。这个过程可以让用户聚焦于自己真正需要的业务开发上，而不是底层的计算资源上。Serverless 符合云计算发展的方向，这种特有的模式使 Serverless 存在潜在的巨大价值。用一张图来形容下，就是 Serverless 可以认为是云计算的终极形态。


**4. Serverless 运行示例**

前面说的可能比较抽象这里，来举个在腾讯云 Serverless 平台上运行函数的例子。

如果一个用户想用云函数，首先要在本地做业务开发，当研发把函数编码完成后通过我们提供的 VSCode 插件可以很方便的把代码部署到我们的平台上，函数里面可能会调用第三方的 BaaS 服务。接下来，会将该函数绑定各种触发器，比如：API 网关、Ckafka、COS 等。然后我们通过调用 API 网关、往 COS 上传文件等方式，来产生触发事件，进而触发绑定的函数，执行业务逻辑。当请求来的时候，平台会根据请求量的大小，去自动或缩容后端的 Function 实例。可以看到整个过程用户是不需要做任何系统层面的运维工作。

![serverless](https://img.serverlesscloud.cn/qianyi/images/VY8SELNGe95Q1KvZ6icJib5Ea8dvmh4Yr3ef7WeGJfFKOUacgKibQBBiaSBkxHunoNjzn7LJ2Z092vWeTvYyyQic1hg.jpg)

# **三、Serverless 业务运维能力**

接下来介绍下，腾讯云 Serverless 平台是如何提供开箱即用的业务运维能力。主要通过 4 个方面来介绍：工具建设、DevOps、日志、监控告警。

![serverless](https://img.serverlesscloud.cn/qianyi/images/VY8SELNGe95Q1KvZ6icJib5Ea8dvmh4Yr3NRqEYpP1ohs3DqTBtZr16gNL8XLMiaiblV4YuM6xZica8jicCjcjOZHMag.jpg)

**1.工具建设**


腾讯云 Serverless 提供了多个工具来协助研发进行开发和调试、帮助运维更容易的将函数部署上线。国内用户用的比较多的 IDE 是 VS CODE，为此，我们开发了 VS CODE 插件，可以方便开发进行函数的开发和部署。我们也提供 web 版本的 IDE，可以直接在网页上做开发，我们还提供命令行工具，可以使开发直接在 Linux 终端进行开发和运维工作，同时基于命令行工具，还可以对接各种 DevOps 平台或者做一些自动化的工作。

![serverless](https://img.serverlesscloud.cn/qianyi/images/VY8SELNGe95Q1KvZ6icJib5Ea8dvmh4Yr3DPAnuiaUdwekiaUUOxtwcbRxZmCw3nzZia6dsvcGCowxZx68OncBTkpzA.jpg)

### **2. DevOps 解决方案**

除了开发者工具，我们也提供完善的 DevOps 支持，从最佳实战，到工作流，到工具链，以及产品打通，我们都提供了很多方案和支持。

比如工作流这里，我们支持编码、构建、打包、部署、测试和发布等一系列流程。在工具这里，我们提供了：CLI、应用模型等。产品这里，我们打通了很多产品供用户很方便的跟这些产品进行交互，利用这些产品提供的能力，比如：Git 仓库，API 网关 等。这个是 DevOps 支持。

![serverless](https://img.serverlesscloud.cn/qianyi/images/VY8SELNGe95Q1KvZ6icJib5Ea8dvmh4Yr3p23OXSuX6NWfxddibmiakiaictWIRm0asdvHyq4w8JPWLSWWjDAiak0msVg.jpg)

**3. Coding DevOps**


这是通过 Coding DevOps 来管理 Serverless 应用 CICD 的几个截图。通过 Coding 的持续集成，可以记录每一个函数应用的构建日志，测试日志。Coding 的制品库可以对函数镜像做集中存储以及做历史版本追溯。最后运维人员可以通过 Coding 部署将函数部署到不同的环境中。

![serverless](https://img.serverlesscloud.cn/qianyi/images/VY8SELNGe95Q1KvZ6icJib5Ea8dvmh4Yr3huCE5KKnUryrHAeFCYwRNTdE9ib0gyXU3s6ExxqVB7ibicmYM2Pl4eiaZQ.jpg)

**4. 日志**


日志这里我们支持 2 种日志查询方式。一种是可以直接在我们的 Serverless 平台进行查询，能够查看函数调用成功与否，各阶段的调用时间，以及用户打印在日志或者标准输出的日志，支持用户按 RequestId 去搜索日志。另外我们还支持用户将日志输出到腾讯云日志服务系统，将日志持久化存储，在日志服务系统中，用户可以根据正则表达式来搜索日志，也可以自定义检索规则，方便下次检索，还可以基于日志进行告警。

![serverless](https://img.serverlesscloud.cn/qianyi/images/VY8SELNGe95Q1KvZ6icJib5Ea8dvmh4Yr3Lq5JVg8RR0CS3NHXibibwpalV9KAWtRp7PAUls49kCxIMjw4srSCneZg.jpg)

**5. 监控告警**


我们提供 3 个维度的监控。提供本月调用次数、本月资源量、本月出流量的监控。提供按地域划分的调用次数、运行时间、错误次数、并发个数、受限次数监控，这些监控指标都是用户很关心的指标。另外我们也提供函数级别的监控：调用次数、资源超过限制次数、函数执行超时时间、内存超过限制次数等监控指标。所有这些监控指标都可以在腾讯云监控系统上配置告警，提供业务级别的监控能力。

## **四、 Serverless 系统运维能力**

这里来看下 Serverless 提供的系统运维能力。Serverless 底层会为每个用户创建一个 mvm，mvm 是轻量级的虚拟机，提供最强的安全隔离，轻量化虚拟机可以做到毫秒级启动，延时非常低。在 mvm 中创建 docker 容器，然后将用户的函数调度到 docker 容器中执行，通过 docker 进行进程级别的隔离同时通过容器来分配更细力度的资源，从而提高系统资源利用率，降低成本。同时在函数执行时会有一套调度算法，可以实时的根据 CPU、内存、网络 IO、请求量指标来进行扩容。满足用户业务高峰期的请求需求。当用户请求量降下来后，也会定时的进行缩容，释放资源，减少成本。所有这些能力都是云厂商来运维，不需要用户运维，用户只需要关注自己的业务逻辑即可。也就是说用户可以省去系统运维这方面的工作，只需要关注业务运维即可。

![serverless](https://img.serverlesscloud.cn/qianyi/images/VY8SELNGe95Q1KvZ6icJib5Ea8dvmh4Yr3rSv7OWXaWmz3kWumN9Zvrf5oIXexAU5KbDFMZYACkkonL8ibZxOuoBA.jpg)

# **五、Serverless 与 IaaS 运维能力对比**

这里通过跟 IaaS 层提供的运维能力进行对比，来更直观的体验一下 Serverless 所带来的运维效率的提升。运维能力对比，主要按 2 个维度来对比：1. 基本运维能力 2. 核心运维能力


![serverless](https://img.serverlesscloud.cn/qianyi/images/VY8SELNGe95Q1KvZ6icJib5Ea8dvmh4Yr3tKKLICdf8QMGOG8Xox3aDm1Sk4S3wJPBjCxAOM50oerHTaIvD2KAew.jpg)

**1. 资源创建**

**（1） IaaS**

先说说传统的 IaaS 应用，运维是如何开展的。首先是资源创建的阶段，这一阶段一般开始于开发部门对运维部门发起新应用的上线申请。收到申请后，运维部门一般会，根据需求文档，在各个可用区内，创建一批虚拟机，然后配置好网络，防火墙和路由规则。由于跨部门，就涉及排期的问题，速度并不会很快。

集群创建好后，再安装开发部门声明的软件比如运行时 JDK，服务器 Tomcat。然后运维部门会安装一些运维软件比如监控工具 Prometheus，日志工具 logstash，或者一些其他的软件比如安全软件，全链路追踪软件。

![serverless](https://img.serverlesscloud.cn/qianyi/images/VY8SELNGe95Q1KvZ6icJib5Ea8dvmh4Yr3uMm1xnxO5mmnKZ04fK5AOszatsFuBSNoQPXwBhhibgQZm0btAAJQN0g.jpg)

机器安装好后，就需要配置 DevOps 流程线。把机器加入到流水线的各个环境中，比如开发环境，预发环境，如果开发者比较多可能还会有第二套开发环境和第二套预发环境。最后就是生产环境，运维人员，为了高可用和容错，事先会将生产环境分为几个不同的小集群，分别部署在不同的可用区内。至此在运维人员的努力下，快的可能需要几天，比如企业内部有自动化运维平台。慢的可能需要几个星期，全部手动配置，才能把所有的环境给搭建起来。并且 CICD 的工具的部署及维护也需要运维部门花费大量的人力，比如，Jenkins 集群，GitLab 服务器，Chef 服务器等。

并且环境的验收来来回回又可能再花上几天。所以整个流程下来可能需要好几周时间。最后才会进入开发流程。

**（2）Serverless**

我们来看下 Serverless 技术，是如何提供系统资源的，在介绍 Serverless 的时候我们说到，Serverless 底层的系统资源不需要用户去申请和运维，所以就不需要资源的申请和软件的按照这个阶段，同时 Serverless 平台提供了开箱即可用的 DevOps 功能。在 Serverless 下，用户只需要进行最后一步的开发即可。

![serverless](https://img.serverlesscloud.cn/qianyi/images/VY8SELNGe95Q1KvZ6icJib5Ea8dvmh4Yr3IvicusDFC9cNhwghWlB1Q4ibduxXyL10ILzbMTI8qMiaWWbcd2nLbONHg.jpg)

可以看到在 Serverless 下，我们不需要创建任何资源，因为无需运维所以可以提高研发效率进而提高产品的竞争力。

**2.业务部署**

在虚拟机时代，部署一个业务，需要运维介入，同时需要配置操作系统环境、然后再对业务组件进行配置。同时业务运维还需要自己实现蓝绿发布和回滚的逻辑，比较复杂。

在容器时代、部署一个业务也需要运维介入，同时运维需要编写复杂的 yaml 文件，对运维人员有了更多的技能要求。每次部署的时候，还需要修改 yaml 文件，然后执行一堆命令部署业务，虽然要比虚拟机时代要简单很多，但是还是有一定的工作量。

![serverless](https://img.serverlesscloud.cn/qianyi/images/VY8SELNGe95Q1KvZ6icJib5Ea8dvmh4Yr3N7HvCKP5Liaq5eLK4gicZteYvTh3vPl9EVyic5H0K4aEnCzcywKG1AMPQ.jpg)

在 Serverless 平台上，只需要开发上传代码，即可完成部署。同时，Serverless 平台已经实现了蓝绿发布和回滚的功能，不需要研发去关注这块儿，把业务部署的复杂度降到最低。

**3.监控告警**

在传统的应用中，绝大多数的监控都依赖于运维人员来配置，包括网络监控，系统监控，应用监控，和业务监控。但是在 Serverless 应用中，首先应用监控，系统监控，网络监控里面的绝大部分监控，都不需要再关注了，并且平台不会将其暴露出来，暴露出来的会是些更高级别的指标，比如调用次数，运行时间，运行内存，并发执行数，受限次数等。但是业务监控还是需要自行收集，通过捞日志的方式。

![serverless](https://img.serverlesscloud.cn/qianyi/images/VY8SELNGe95Q1KvZ6icJib5Ea8dvmh4Yr3Gn77LzeXp0WLIkfTsntDF7kFTqzRaoGnFvGuiaot0Szib9KYjOqBzyVg.jpg)

**4. 故障排查**

传统的应用故障排查的手段一般都非常丰富，比如全链路追踪，各类监控等。但是这仅仅限于大公司拥有比较强的技术实力，因为这些故障排查工具集的搭建和维护也是一个耗费人力的过程。在小公司内一般通常只能通过日志和走查代码来排查。

![serverless](https://img.serverlesscloud.cn/qianyi/images/VY8SELNGe95Q1KvZ6icJib5Ea8dvmh4Yr3yXo7VgHHboWZnpRSHEGaC9YL3GWuTOcfJF67ZBzapZeJTgF8NGKiaTQ.jpg)

腾讯云 Serverless 平台提供了非常多的故障排查工具。比如全链路追踪功能，各个维度的监控，以及专业的日志查询功能。所以 Serverless 时代故障排查工具也不需要运维人员来搭建了。

 **5. 弹性扩缩**

弹性伸缩是运维一个核心的能力，弹性伸缩大家一般关注的是扩缩时间。在虚拟机阶段，如果资源不够了，需要申请虚拟机，申请完之后需要登陆虚拟机做一些系统级别的配置和部署，一般是小时级。在容器阶段，借助于k8s的弹性扩缩能力，但 k8s 的弹性扩缩容策略一般也只能做到分钟级。但在 Serverless 这个阶段，可以做到实时的毫秒级的扩缩容。

![serverless](https://img.serverlesscloud.cn/qianyi/images/VY8SELNGe95Q1KvZ6icJib5Ea8dvmh4Yr3rXcj8XXFkdRKrIOt9ZgeIxvRqCCSaia9FzgqoQk6CGPXFvbDSEia2iboQ.jpg)

**6. 故障恢复**


故障恢复是另一个运维需要关注的点。在虚拟机阶段，故障恢复逻辑需要运维实现，如果运维没有一些故障恢复逻辑，出故障后需要运维介入，如果运维手工介入响应会很慢，同时也可能因为认为的一些失误导致业务异常，有风险。在容器阶段，借助 K8s 的自愈能力，可以实现秒级的故障恢复，但是在 Serverless 阶段，因为每次请求都是一个新的实例，所以就不存在故障恢复这一工作。

![serverless](https://img.serverlesscloud.cn/qianyi/images/VY8SELNGe95Q1KvZ6icJib5Ea8dvmh4Yr3ribLvH2k76DZvqw6PXBib2x86j4dBS1dVJvsEIteonMia1oG8yXY8uxGA.jpg)

**7. 性能调优**


性能调优一直就是个比较高级的问题，需要丰富经验。传统应用的调优一般涉及，虚拟机参数，数据库参数，网络参数，Linux 参数，运行时参数，服务器参数。但是由于 Serverless 应用的特殊性，此类底层参数的调优由云厂商来进行调优。用户只需要进行代码级别的性能调优即可。

![serverless](https://img.serverlesscloud.cn/qianyi/images/VY8SELNGe95Q1KvZ6icJib5Ea8dvmh4Yr3Yj1oIwXbOnw97wBLLCEG6ybnaPGe1Pm4YE6CwHib7gyUaxIUz1KE2Cw.jpg)

**8. 安全保障**


传统的 IaaS 应用由于技术栈复杂，灵活度很大所以安全需要保障的领域也非常多。比如主机和网络安全，应用安全，访问控制管理，终端安全，数据安全等都需要运维安全人员来关注。大公司一般会为此保持一个大的安全部门来保障集团的安全。但是小公司如果也要维持这样一个部门，业务就会被极大的拖累，以致于小公司业务的安全非常难保障。比如有些数据库不改密码，或者暴露公网 IP 等，小公司不可能有精力去对这些产品进行充分调研。

但是 Serverless 下，底层资源由云厂商来进行维护，安全性由云厂商提供专业的保障，比如，腾讯云 Serverless 平台会提供网络隔离，执行环境与管理环境隔离，函数资源限制，文件系统目录限制，系统调用也会有限制。可以在提高安全保障的同时，节省这一部分人力。运维安全就主要用户代码的安全维护了。

![serverless](https://img.serverlesscloud.cn/qianyi/images/VY8SELNGe95Q1KvZ6icJib5Ea8dvmh4Yr3sFv7gTJeqaxgGAe3TLQYUVTEOIKFGicWAddNiaMuW7Rod9nH8A0mAicrg.jpg)

# **六、微信小程序相册的 Serverless 运维实践**

这里举一个微信小程序相册的例子，看一下如何在 Serverless 下去做运维，如果没有 Serverless 的话，我们想开发一个相册小程序，首先要去组件 Team 可能需要N周，然后要注册各种账号，需要几天。接下来我们要做一些跟运维相关的工作，比如：购买域名、购买 CVM、域名备案等，购买完资源之后还需要安装 Nginx、安装 MySQL、安装监控和日志系统等，这块儿大概需要 3 周时间，甚至更多时间。接下来才会进入到真正的业务开发阶段。所以像如果开发一个小程序的话，一般是需要一两个月的时间。

![serverless](https://img.serverlesscloud.cn/qianyi/images/VY8SELNGe95Q1KvZ6icJib5Ea8dvmh4Yr3hxLxQibc54fXydXS4bOA0kyDFSJzLTVSoJTic3yzQKLThq3FqiarnibXbQ.jpg)

当我们把小程序开发完成后，还面临各种复杂的运维工作。比如要运维一大堆服务器相关的组件、测试复杂、还要花费很多人力保障安全和稳定性。



![serverless](https://img.serverlesscloud.cn/qianyi/images/VY8SELNGe95Q1KvZ6icJib5Ea8dvmh4Yr3dPJn0zNXCnrCovDAUK6DhagDbJnRBkCwy05IFWwSXIRXEJUPPxVhgA.jpg)

这张图是 Serverless 下的解决方案，可以看到，云厂商将资源申请和相关组件的部署都 Serverless 化了，这部分运维工作由云厂商来维护，不需要用户关心，用户只需要关注核心业务逻辑开发和数据库相关的 CRUD 即可。大大简化了开发流程和运维工作量。

![serverless](https://img.serverlesscloud.cn/qianyi/images/VY8SELNGe95Q1KvZ6icJib5Ea8dvmh4Yr3XZwblM9DBPEjtejN0BFOUJFOT5ThZU8EpV2ELsOiaU5OIPX9rVFuhqQ.jpg)

微信小程序相册在 Serverless 解决方案下，一个同事只花了 2 周时间便完成了核心业务逻辑的开发。


**讲师介绍**

![serverless](https://img.serverlesscloud.cn/qianyi/images/VY8SELNGe95Q1KvZ6icJib5Ea8dvmh4Yr3YDNAlpayYb3TibZMwx33jhyqJSsGicNkkibW18JmSBtCkOX6CM5LNsToQ.jpg)

孔令飞，腾讯云高级架构师，负责腾讯云云函数的产品拓展工作，协助用户一起搭建基于Serverless的系统架构，和产品经理一起完成云函数平台的规划建设。之前在Red Hat和联想做过虚拟化相关的测试和研发工作，有过大规模容器集群的研发和架构经验，对虚拟化、容器等云计算相关技术有深层次的理解。

# 免费试用

腾讯 Serverless Framework 助您快速、简单地构建和部署 Serverless 应用程序。目前，我们已提供免费产品试用方案，欢迎立即试用！

> 立即试用地址： https://github.com/serverless/components/blob/master/README.cn.md

---

> **传送门：**
> - GitHub: [github.com/serverless](https://github.com/serverless/serverless/blob/master/README_CN.md) 
> - 官网：[serverless.com](https://serverless.com/)

欢迎访问：[Serverless 中文网](https://serverlesscloud.cn/)，您可以在 [最佳实践](https://serverlesscloud.cn/best-practice) 里体验更多关于 Serverless 应用的开发！