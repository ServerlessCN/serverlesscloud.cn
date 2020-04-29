---
title: 腾讯云成为 serverless.com 大中华区独家合作伙伴！
description: 11月6日，在腾讯云主办的首届Techo开发者大会上，腾讯云宣布与全球最流行的Serverless开发平台 Serverless.com 达成战略合作，成为 Serverless.com 的全球战略合作伙伴以及大中华区独家合作伙伴。
keywords: Serverless, Serverless.com, Serverless开发平台
date: 2019-11-08
thumbnail: https://img.serverlesscloud.cn/qianyi/images/c6gqmhWiafyr519Q4ibL1LY9zqlW3GSibwFAh6WJrxiaz6LJYEsGNlNNL53DcfKicib8sonOX6ew8mf3ibWhHWsJNib3ug.jpg
categories: 
  - news
authors: 
  - Serverless 中文网
authorslink: 
  - https://github.com/jiangliu5267
---

11月6日，在腾讯云主办的首届Techo开发者大会上，腾讯云宣布与全球最流行的Serverless开发平台 Serverless.com 达成战略合作，成为 **Serverless.com 的全球战略合作伙伴以及大中华区独家合作伙伴**。

大会下午的Serverless Summit专场上，腾讯云中间件总经理Yunong Xiao、腾讯云专家工程师周维跃分享了腾讯云Serverless最新技术进展与生态建设。

![Serverless](https://img.serverlesscloud.cn/qianyi/images/VY8SELNGe945114xPbxUfS4lnhJicc9fwO6fjjr7iaMosyu0L80qcIXwZxKiav15KDMQgOl7vR25gGHic8MBanXZmA.jpg)

**新产品**

##### **Serverless微服务平台**

当前用户在使用微服务时，仍然需要购买虚拟机，组织虚拟机或容器的集群，才可以来支撑微服务模块或应用的部署。在这个过程中，仍需要选择规格、发起购买、配置系统、监控运维等多方面的工作。

为了进一步简化用户开发成本，让用户专注业务部署。腾讯云发布了Serverless微服务平台（TSF Serverless），TSF Serverless是面向应用和微服务的高性能 Serverless 平台，用户无需学习复杂的服务器、容器管理、运维技术，就可以迅速把应用创建和运行起来；此外，用户无需提前为业务峰值准备资源，按需使用、按量计费，精益成本。

![Serverless](https://img.serverlesscloud.cn/qianyi/images/VY8SELNGe945114xPbxUfS4lnhJicc9fwrXBT9FT6VQnfptJAE8A2mPzXA30siaowdA8pmXTicicU5kibtLguXNgeCg.jpg)

**新能力**

![Serverless](https://img.serverlesscloud.cn/qianyi/images/TN05MmJLxMpgu43QibgJnNSHedaboxGvIic1GYDFA6gzEgob1W7yI7pia1Ecbj6dRkUQTER6C1licUAQutoqxoWAQQ.jpg)

##### **网络连通性**

函数作为计算产品，在代码运行时，避免不了网络的访问。云的网络，区分为了外部访问，和内网 VPC 访问。云函数在最近的一次功能升级中，支持了同时配置外网访问和 VPC 访问，避免了仅能支持配置一种网络访问方式导致的不便。而通过响应客户呼声，而支持的出口固定 IP，对用户使用云函数对接支付接口、微信公众号接口等业务带来了极大的方便。

![Serverless](https://img.serverlesscloud.cn/qianyi/images/VY8SELNGe945114xPbxUfS4lnhJicc9fwhiaadfUolqALNvn1mDLGlZOdz2UH72HtnX9V8zqqMV0hD2kXzIvkWlw.jpg)

##### **共享文件层**

为了支持多个函数间的库或文件共享，云函数推出了共享文件层能力。对于相同的依赖库，不再需要每个函数分别打包上传，而是可以进行统一的管理、版本升级。而通过抽取出通用库，函数的代码包可以进一步减小体积，加快函数加载速度。

![Serverless](https://img.serverlesscloud.cn/qianyi/images/VY8SELNGe945114xPbxUfS4lnhJicc9fw6ZGH6nic4hwuLCuZUvynwmQR3LNrcRVfbhZfcKRn33IZCkGgttLknIg.jpg)

##### **日志排障**

Serverless 架构应用的排障是困扰业界已久的问题，腾讯云也持续尝试提升日志及排障的能力。通过联动多个产品、对接腾讯云的日志服务，来汇总全链路的日志，并基于日志实现多产品的跟踪、分析。

![Serverless](https://img.serverlesscloud.cn/qianyi/images/VY8SELNGe945114xPbxUfS4lnhJicc9fwwIhLr22eBG73fV9sq5AsRhUFwAThmrrTYNib8nJFIqicja8TMiamp4ImA.jpg)

**新技术**

为了解决业界使用Serverless普遍遇到的冷启动，性能，安全问题，腾讯云云函数采用了新一代函数计算平台，使用腾讯云自研的轻量级虚拟化技术，将MicroVm启动时间缩短至90毫秒，函数冷启动减低至200毫秒，并且支持上万台计算节点同时扩容。同时在函数与VPC网络打通中，依托于新的隧道方案，时间也由原来的秒级降低至毫秒级。此外，为了进一步降低冷启动率，腾讯云Serverless团队还重点优化了自动扩缩容的能力，通过秒级的并发监控数据计算，提前进行扩容，使函数冷启动率降低到0.01%。

![Serverless](https://img.serverlesscloud.cn/qianyi/images/TN05MmJLxMpgu43QibgJnNSHedaboxGvIzZELKBiclcFuBNhjCSKDavE3WpbsJtlAn5sW7wr4AFcbxVrmicictn2Rw.jpg)

##### **轻量级虚拟化方案**

此前Serverless架构是基于传统的虚拟机提供计算节点，这种方式下虚拟机的创建、销毁速度太慢，此外，内存资源的消耗比较大，无法很好的提升宿主机的资源利用率。

为了给用户提供更好的性能体验，年初团队启动了轻量级虚拟化的优化项目。从优化KVM和qemu以及虚拟机镜像裁剪方面着手，让轻量级虚拟机和传统虚拟机运行在同一个宿主机上，提升整体的资源利用率。优化后，虚拟机创建耗时降低至90毫秒。

![Serverless](https://img.serverlesscloud.cn/qianyi/images/VY8SELNGe945114xPbxUfS4lnhJicc9fwBlAexSj2ia26C0tn7hMdOuicUzCw7ABBKq5lagibaibYBI7cefPHOtpLRA.jpg)


##### **访问VPC网络架构优化**

传统网络方案，当函数需要访问VPC资源的时候，是通过配置函数指定的VPC及子网，系统在函数的容器中绑定目标子网网段的弹性网卡打通访问路径。这种方式存在冷启动耗时长、可用性等问题。

为了解决此问题腾讯云Serverless率先推出了VPC Proxy的方案，函数的流量基于隧道协议转发到VPC Proxy节点，再通过节点绑定弹性网卡的方式路由到租户指定的VPC，函数调用的过程完全不影响扩容的性能。通过此方案，该场景下的冷启动从原来的几秒优化到5个毫秒左右。优化后，冷启动耗时，从数秒级优化到5毫秒左右。

##### **实时弹性扩缩容**

计算、网络优化之外，为了进一步降低冷启动率，提升首次访问的性能体验，腾讯云Serverless下半年也对自动扩缩容模块进行了优化。除了优化微服务场景下基于负载、请求量、时延等监控数据的扩缩容的性能外，Auto Scaling模块对函数的并发度调用采用了实时计算并扩容的策略。

具体策略是：在Serverless LB接入层将对某个函数访问的并发数据实时上报到Auto Scaling模块，该模块根据并发度和当前函数实例的数量进行比较计算，决策是否需要的扩容量。缩容方面为了避免造成频繁扩缩的抖动，采取了延时加阶梯缩容的策略，通过一定时间的观察逐步缩容，在一定程度上优化计算资源的成本。

![Serverless](https://img.serverlesscloud.cn/qianyi/images/TN05MmJLxMpgu43QibgJnNSHedaboxGvIlNibCcNqgOgYB3ocTKsbjeQbpYMOF1SIgmIxMX4tH1uDtL3iaN4wuJNg.jpg)

经过优化，整体的冷启动率从原来的1%左右优化到了0.01%，只有少部分非常低频调用的函数和并发突增非常大的函数会触发到冷启动。

##### **微服务Serverless化的架构**

同一个FaaS架构整合了Service Mesh的能力支持了TSF的Serverless化，同样受益于轻量级虚拟机的快速启动，VPC Proxy网络的快速连接，Auto Scaling的弹性扩缩容的能力。

**新生态**

大会上，腾讯云宣布与全球最流行的Serverless开发平台Serverless.com达成战略合作，成为 Serverless.com的全球战略合作伙伴以及大中华区独家合作伙伴。截至目前，Serverless.com拥有百万级别的活跃应用程序以及50000+的日下载量。

![Serverless](https://img.serverlesscloud.cn/qianyi/images/YHl6UWa9s61pxxSxibk4MwT2aicg2UUS3f973nDhFLiaLNdUfcCtfEibMdoIhrdTxZaleFTaib4UGyb9iauJlEayvarg.jpg)

腾讯云将与Serverless.com联手打造下一代无服务器计算开发平台—— Serverless Cloud，该平台覆盖从初始化、编码、调试、资源配置到部署发布，再到业务监控告警、故障排查的全生命周期，帮助开发者一站式构建Serverless应用。

演讲最后，腾讯云中间件总经理Yunong Xiao表示：腾讯云将通过持续应用新的技术、提供新的功能、开发新的产品、构筑新的生态，从多方面为开发者听过全面完整的 Serverless 体验，助力开发者实现 Serverless 的架构落地，享受Serverless 带来的极致云端体验。

