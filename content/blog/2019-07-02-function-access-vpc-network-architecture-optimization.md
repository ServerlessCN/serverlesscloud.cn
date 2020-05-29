---
title: 腾讯云函数访问 VPC 网络架构优化
description: "文章整理自腾讯云专家工程师周维跃及腾讯云高级工程师李艳博在 Kubecon 2019 上的分享,本篇文章分享云函数访问 VPC 网络方面的优化。"
keywords: Serverless,serverless framework,腾讯云serverless
date: 2019-07-02
thumbnail: https://img.serverlesscloud.cn/qianyi/YHl6UWa9s62sLCrvZhrtRH5BpLicw7aUOFcf8AVCXXFd1r1Gs9AgoXkqPY0icjL9koxzxcJ8RFiagsQnQdc29IKvg.jpg
categories:
  - user-stories
authors:
  - 李艳博
authorslink:
  - https://zhuanlan.zhihu.com/ServerlessGo
tags:
  - 网络架构
  - Serverless
---

[《腾讯云函数计算冷启动优化实践》](https://mp.weixin.qq.com/s?__biz=Mzg4NzEyMzI1NQ==&mid=2247483940&idx=1&sn=33b5db4a0248b35c0bb317068ffb9239&scene=21#wechat_redirect)文章，主要讲解了云函数冷启动方面的优化实践。Serverless中的函数除了计算任务外，绝大部分还有网络访问需求，本篇文章，将详细介绍SCF网络架构优化。

_注：文章整理自腾讯云专家工程师周维跃及腾讯云高级工程师李艳博在 Kubecon 2019 上的分享，原分享主题为《加速：无服务器平台中的冷启动优化》，本篇文章将分享云函数访问 VPC 网络方面的优化。_

![](https://img.serverlesscloud.cn/qianyi/YHl6UWa9s62sLCrvZhrtRH5BpLicw7aUOfWRhclAKugeQ5WsviadTTYerqrHlLwcEicwb4PycSvj5eVj29G6HNDYA.jpg)

 函数的网络访问需求分为两种：

- 一类是访问客户自己的VPC，VPC是腾讯云为客户提供的逻辑隔离的网络空间。客户可在VPC网络中部署自己的CVM、CDB、Redis等服务，业务函数处理业务流程的时候则可能需要访问VPC内的这些服务，比如客户可能需要统计移动app中的某些事件以进行针对性优化，在移动app中通过http请求上报到函数后，函数需要把这些数据上报到VPC的CDB中。
- 另外一类网络需求是访问公网，比如客户通过公网访问自己的数据中心，或者函数流程中通过公网调用了第三方提供的API。

另外客户的函数在访问公网时，有时候还会有一个特殊需求，就是固定公网的出口IP。例如函数通过公网访问数据库，需要使用IP白名单限制访问来源，提高安全性。另外一些敏感的公网API也会要求固定出口IP，例如一些金融支付类的第三方API同样需要固定IP来提升安全性。

![](https://img.serverlesscloud.cn/qianyi/YHl6UWa9s62sLCrvZhrtRH5BpLicw7aUOFcf8AVCXXFd1r1Gs9AgoXkqPY0icjL9koxzxcJ8RFiagsQnQdc29IKvg.jpg)

下面我们分别看看serverless传统网络架构以及SCF网络架构是如何设计以满足这两种网络访问需求的。

**Serverless传统网络访问VPC的设计** 

首先我们看下在函数访问VPC时，传统Serverless网络架构是如何设计的。在Serverless传统网络架构下，客户访问VPC主要有两种实现方式：

- **第一种方式是在容器内直接创建到客户VPC的弹性网卡。**

弹性网卡是关联客户VPC及subnet的虚拟设备。当容器创建该设备后，容器即可通过该设备与客户的VPC互通。这种方式利用了云上现有的弹性网卡产品能力，实现简单。

那么这种实现方式有没有什么问题呢？因为每个运行函数的容器实例都需要创建到客户VPC的弹性网卡，当客户函数的并发提升时，就需要创建新的容器实例及弹性网卡来运行函数。但是创建到客户VPC的弹性网卡涉及到虚拟设备的创建、路由更新等流程，整个弹性网卡创建流程要花费几秒钟的时间。也就是说在该架构下如果函数需要访问VPC，每次函数冷启动时，需要额外消耗几秒的时间用于打通函数到客户VPC的网络。

另外一方面创建弹性网卡时需要消耗客户VPC子网内的IP资源，实际运行函数时可能因为分配不到客户VPC 子网内的ip导致函数运行失败。比如客户可能在对应的子网内批量创建了很多CVM或者CDB等资源耗光子网ip。等运行函数或者说函数并发提升时，就会因为分配不到子网IP导致弹性网卡创建失败，进而导致函数运行失败。

![](https://img.serverlesscloud.cn/qianyi/YHl6UWa9s62sLCrvZhrtRH5BpLicw7aUOsk60vDibrFYo771JfCfHzscibrSohTDVnoyrFG7cRqlX0ficy8RBHW51A.jpg)

- **另外一种方式是在node上创建到客户VPC的弹性网卡。**

容器内访问客户VPC的数据包转发到node的弹性网卡上，node上连接到同一个子网的容器共享该弹性网卡。比如图中两个pod运行同一个函数，连接到同一个VPC子网，这两个pod就会共享node上这一块弹性网卡。

对于在node上创建弹性网卡的方案，函数并发提升时，如果新创建的容器位于同一个node上，则不需要创建到客户VPC的弹性网卡，但是如果新创建的容器落到其他新的node上，那么同样需要在新node上创建到客户VPC的弹性网卡，此时冷启动耗时同样会额外多出几秒钟。

可以看到这种方式相比上面第一种方式有了一定的进步，但是同样可能在冷启动时需要创建到客户VPC的弹性网卡。可能会在函数并发提升时因为分配不到IP资源而导致运行失败。

![](https://img.serverlesscloud.cn/qianyi/YHl6UWa9s62sLCrvZhrtRH5BpLicw7aUOkgZ2STtqdeHVREHIVmfJk9elgk2Vxoq4na2Cvdvz9DEXS3EbF2tPcg.jpg)

上面介绍了Serverless两种传统网络架构下，函数是如何访问VPC的。可以看到传统架构下有两个问题，第一个是弹性网卡都是在运行函数时创建的，会导致冷启动时间大幅增加。另外一个问题是当没有IP资源不能成功创建到客户VPC的弹性网卡的时候，就会导致函数运行失败。

**VPC访问优化实践**

下面看下SCF网络架构是如何支持函数访问VPC的。简单的说就是我们在SCF集群与客户VPC之间添加了一层Proxy代理集群。每个vpc/subnet建立一对主备proxy。主备proxy使用havip进行容灾切换。havip是一个浮动的内网 IP，支持机器通过 ARP 宣告进行绑定，更新 IP 和 MAC 地址的映射关系。

在高可用部署场景下，该 IP 可从主服务器切换至备服务器，从而完成业务容灾。在主备proxy之间可以实现秒级切换，且切换前后TCP连接保持不断。

当客户的函数需要访问VPC时，首先会通过ipip把流量转发到proxy上，proxy解出ipip的内层报文后，在snat成出口的HAVIP，然后转发到客户的VPC中，客户VPC的回包同样沿着相同的路径反向路由到运行函数的容器中。另外我们会依据客户的访问流量对proxy进行自动扩缩容，当流量提升时自动扩容一对主备proxy，当流量下降时，自动对多对主备proxy进行缩容。

在传统架构下，VPC函数冷启动时可能需要创建弹性网卡而增加几秒的冷启动耗时，在SCF新架构下仅需创建函数时，在proxy侧建立客户vpc的弹性网卡，函数调用时运行函数的容器或者node不在需要弹性网卡，仅需配置隧道参数。耗时仅仅几毫秒，因此函数冷启动时，VPC网络的配置时间从秒级下降到毫秒级。同时该方案避免了运行函数时因为客户子网ip资源耗尽而导致的函数运行失败。

![](https://img.serverlesscloud.cn/qianyi/YHl6UWa9s62sLCrvZhrtRH5BpLicw7aUO8cTE5a2Y0GtuGjbmrOqia8K2NxBVTV21jrz8rictQKKB4E2VdCh9cP7Q.jpg)

上面是我们SCF对访问VPC的函数网络架构的优化。接下来看下在对比下函数访问公网时，Serverless传统网络架构和SCF网络架构的设计。

**Serverless传统网络访问公网的设计**

依据函数访问公网是否需要固定IP，公网访问分为两种场景。当函数不需要固定ip访问公网时，公网流量通过集群的公共NAT网关转发出去，这个公共的NAT网关是由SCF部署的，集群内所有函数都是用这个NAT网关。

当函数需要以固定IP访问公网的时候，则需要客户在自己的VPC内创建nat网关，公网流量先路由到客户VPC，然后在从客户自己的nat网关转发出去。可以看到当客户不需要固定IP访问公网时候，仅需要一个公共的NAT网关，所有操作可以在serverless后台完成。当客户需要固定IP访问公网时候，则需要客户自己配置nat网关。

一方面NAT网关会额外增加客户的成本，另外配置复杂度高。因此针对固定IP访问公网的场景需要进一步优化。

![](https://img.serverlesscloud.cn/2020414/1586873385554-640.jpeg)

**SCF公网访问的优化实践**

当函数无需固定IP访问公网时，我们仍然采用Serverless传统网络的共享NAT方案，该方案简单易扩展，利用了云上现有的nat网关产品，已经能较好满足无需固定IP访问公网的需求。对于需要固定IP访问公网的场景，我们则同样采用一对主备proxy。

数据包从函数容器到公网需要进行两次SNAT，第一次SNAT是在proxy这里，将数据包的源ip SNAT成HAVIP，另外这个HAVIP绑定了一个EIP，数据包从虚拟机发出后，会再次被SNAT成固定的EIP，从而实现固定ip访问公网的目的。两次SNAT操作都是由腾讯云负责部署。这样客户无需做额外复杂操作即可实现固定IP的目的。

![](https://img.serverlesscloud.cn/qianyi/YHl6UWa9s62sLCrvZhrtRH5BpLicw7aUOOe5PcW1BicguEYmaDVRGhic3HoSnMgUA2pale8SmeMCBl7dHJVCkGfxw.jpg)


> **传送门：**
> - GitHub: [github.com/serverless](https://github.com/serverless/serverless/blob/master/README_CN.md) 
> - 官网：[serverless.com](https://serverless.com/)

欢迎访问：[Serverless 中文网](https://serverlesscloud.cn/)，您可以在 [最佳实践](https://serverlesscloud.cn/best-practice) 里体验更多关于 Serverless 应用的开发！
