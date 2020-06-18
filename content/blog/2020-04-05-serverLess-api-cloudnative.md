---
title: 使用 ServerLess 实现云原生
description: 今天来聊聊 ServerLess，也就是所谓的 FaaS，笔者有幸经历了 IaaS (OS)、CaaS (Container)，在这两年又听到了 FaaS (Funtion)，这也是运维开发领域里的第三个阶段了吧，今天我将从一个不懂得开发的系统工程师视角尝试诠释这个概念。
keywords: Serverless,Serverless网站,Serverless云原生
date: 2020-04-05
thumbnail: https://img.serverlesscloud.cn/2020522/1590169274977-%E4%BC%81%E4%B8%9A%E5%BE%AE%E4%BF%A1%E6%88%AA%E5%9B%BE_15901691298526.png
categories:
  - user-stories
authors:
  - StatLee
authorslink:
  - https://cloud.tencent.com/developer/article/1609585
tags:
  - Serverless
  - 云原生
---



_本文为《冲上云霄——云从业随笔》系列之五——浅谈ServerLess_

> 在云从业随笔系列中，我们介绍了TKE、AS、CVM等等，今天来聊聊ServerLess，也就是所谓的FaaS，笔者有幸经历了IaaS（OS）、CaaS（Container），在这两年又听到了FaaS（Funtion），这也是运维开发领域里的第三个阶段了吧，今天我将从一个不懂得开发的系统工程师视角以及结合之前的几篇系列文章为各位诠释这个概念。
>
> By StatLee

# **一、简述**

一开始听到ServerLess我以为是类似于VPS(建站主机)亦或者是VM、Container之类的具备完整OS或半完整OS生态的一个全新开发方式，后来发现我完全理解错了，如果说传统的云计算是这样分层的：

![serverless]( https://img.serverlesscloud.cn/2020522/1590169274965-%E4%BC%81%E4%B8%9A%E5%BE%AE%E4%BF%A1%E6%88%AA%E5%9B%BE_15901691298526.png )

那么FaaS（ServerLess 为代表的的Funtion As A Service）就是把SaaS再进行精细化拆分，可以看这张图就明白了（特别是红圈部分）：

![serverless]( https://img.serverlesscloud.cn/2020522/1590169274977-%E4%BC%81%E4%B8%9A%E5%BE%AE%E4%BF%A1%E6%88%AA%E5%9B%BE_15901691298526.png )

FaaS

传统以为Application就是业务的最终形态，可是随着以开发领域为首的“微服务”及运维领域为首的“SRE/DevOps”理念出来后，传统的业务运维明显已经不能满足新一代业务的需求，为了更贴合这些新的需求，实现：

- 模块拆分化（即一个功能作为一个模块，而非一个业务作为一个模块）
- 最小颗粒化变更（即分层变更，变更时通过合理调度时变更间隔缩短，实现快速迭代）的目的

云厂商最终在以往的“最终形态”上又拆分了Function出来，多个Function再组成Application，除了业务上的好处，这样做的好处还可以支持将Function拆分单独作为某个服务通过简单的加壳（API化）提供给外部调用，从商业角度讲，这样的模式能够给Application本身创造的价值之外提供了更多的细分变现领域。

所以，为什么ServerLess这么火（至少表面看），就是因为ServerLess是上述所说FaaS的最佳体现。

# **二、实操**



1、我们开始创建今天的主角，ServerLess（python版本随自身业务需求而变）创建一个云函数：

![serverless]( https://img.serverlesscloud.cn/2020522/1590169274926-%E4%BC%81%E4%B8%9A%E5%BE%AE%E4%BF%A1%E6%88%AA%E5%9B%BE_15901691298526.png )

创建SCF(云函数，ServerLess)

从云函数的功能上来看，与腾讯云的功能整合度还是比较高的，在规划上笔者建议通过私有网络来构造云函数应用。

2、对接cvm apiv3 sdk来实现拉取cvm列表，首先将用到的SDK文件放在云函数所在目录下。

3、通过vscode插件一键部署。这里推荐使用VSCode来作为主IDE，无论是构造API的Django所用的TKE可以通过Remote Development插件来进行远程开发，还是ServerLess也可以通过腾讯云提供的ServerLess ToolKit（当然大部分提供ServerLess的云厂商都有提供Toolkit，安装ToolKit时主要不要在Remote IDE窗口下点击，否则就变成为远端安装了）进行开发，基本上做到完全体验一致。

4、通过CVM SDK获取ins-id、内网ip，再调用django构造的接口进行传参。

5、结果调用成功添加数据：

![serverless]( https://img.serverlesscloud.cn/2020522/1590169515300-%E4%BC%81%E4%B8%9A%E5%BE%AE%E4%BF%A1%E6%88%AA%E5%9B%BE_15901695028122.png )

至此，实操完成，这样相当把后端一个“同步信息”的接口搬上了ServerLess

# **三、场景**

如实验所述，ServerLess只能是一个类似于“转发器”的玩意吗？并不是的，除了业务模块是处于“中间（转发、同步）”的模块类型之外，其实ServerLess也是可以结合其他产品来实现对外输出功能的。

本身ServerLess是没有对外发布能力的，怎么理解呢？就是一般运维同学上手一看，这玩意儿为什么连个ip都没有，域名哪里定义的，端口又在哪里，如何定义协议类型？

实际上ServerLess确实这些都没有，因为如简述所说，这是一个细粒化到只需要关注其上App中的某个Function的一个产品，所以Function之下的所有包括OS、网络、App都是不具备定制化的。

虽然ServerLess本身没有对外发布能力，但是**结合API网关**就不是这回事儿了，当ServerLess遇到API网关，通常云厂商是支持ServerLess添加（或叫注册）到API网关的，这就相当于你可以**借API网关的“力”来使ServerLess实现对外发布**的功能。



# **四、总结**

ServerLess的开发模式业界已经很多公司采用，相比于还在使用传统环境（OS、中间件、选择应用语言、构建数据层、前后端）来说：

1. 运维压力小了很多，因为只需要专注在ServerLess本身的运行参数以及架构上的调整、运维，而不再需要关注Function以下的运维难点；
2. 开发人员由于ServerLess一般由云厂商提供全链路的整合，加上IDE插件的支持基本上全程实现云上开发，灵活的版本、环境也可以保证发布出现问题的几率最小化，同时**开发职能的交叉度降到最低**，**开发人员之间的干扰依赖降低**；
3. 对于公司的商业模式来说，像拥有大量访问量、市场受众的企业客户不单单可以在业务上实现盈利，**某些业务系统模块**的优势也可以借助ServerLess拆分出来实现内部IT支撑系统的**变现**。

ServerLess也存在一些问题，比如由于ServerLess基本上是**依托在云厂商**之上，对于有混合云的场景，对于**S2S的链接质量要求更高**，当然这些在ServerLess的不断优化迭代情况下会越来越顺畅，所以，无论是Dev还是Ops，拥抱并享受ServerLess吧。



---
<div id='scf-deploy-iframe-or-md'></div>

---

> **传送门：**
> - GitHub: [github.com/serverless](https://github.com/serverless/serverless/blob/master/README_CN.md)
> - 官网：[serverless.com](https://serverless.com/)

欢迎访问：[Serverless 中文网](https://serverlesscloud.cn/)，您可以在 [最佳实践](https://serverlesscloud.cn/best-practice) 里体验更多关于 Serverless 应用的开发！
