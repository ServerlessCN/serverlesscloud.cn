---
title: Serverless 最佳实践：如何在两周内开发出用户量过亿的微信小程序
description: "本文将从开发背景、技术需求与落地实践三个维度出发，还原腾讯相册小程序的开发历程，以及Serverless是如何助力腾讯相册团队在两周内，开发出承载过亿用户量的微信小程序。"
keywords: Serverless,serverless framework,腾讯云serverless
date: 2019-06-27
thumbnail: https://img.serverlesscloud.cn/qianyi/YHl6UWa9s62icv8Chd3kYictP0lzHOic3Qe0MH6buxiahkojt4FUVbo57F3Jh3NEHic5bP81sQfSOkqNnY09icj7p3oQ.jpg
categories:
  - guides-and-tutorials
authors:
  - 腾讯云中间件
authorslink:
  - https://zhuanlan.zhihu.com/ServerlessGo
tags:
  - 小程序
  - Serverless
---

腾讯相册前身是空间相册，而且空间相册已经在手机APP端，网页端都有了入口。为了增加用户活跃，让客户在各个软件中都能快速触达，腾讯相册团队推出了微信小程序形式的腾讯相册。本文将从开发背景、技术需求与落地实践三个维度出发，还原腾讯相册小程序的开发历程，以及Serverless是如何助力腾讯相册团队在两周内，开发出承载过亿用户量的微信小程序。

_注：文章内容整理自腾讯云产品经理方坤丁和高级架构师卢萌凯在Kubecon 2019上的演讲，演讲主题为《Serverless 云上最佳实践 ：如何在两周内开发出用户量过亿的微信小程序》。_

**腾讯相册微信小程序开发背景说明**

在2019年Q1，微信和WeChat的合并活跃用户为11.12亿，而小程序的活跃用户从17年初发布后，在18年底增长到了2.3亿。小程序主要有以下几个特点：

- 速度快。无需下载安装，加载速度快于app HTML5，随时可用
- 无适配。一次开发，多端兼容，免除了对各种手机机型的适配
- 可分享。支持图文分享、支持分享给微信好友和群聊
- 体验好。可达到近乎与原生app相同的操作体验和流畅度
- 易获取。支持扫码、微信搜索、好友推荐等发起场景
- 低门槛。基于微信的生态。已有公众号的组织可快速注册、可快速生成小程序

![](https://img.serverlesscloud.cn/qianyi/YHl6UWa9s62icv8Chd3kYictP0lzHOic3Qex06nuel46gh2XU0QRljBB6biaq4h9cfUPD3f1zqqzyYlAmics5d6FGPg.jpg)

微信小程序的这些特性，能够与腾讯相册这类社交性工具完美结合。那么，这个小程序应该怎样设计？作为一名产品经理，我们想到了如下几个需求：

- 基本能力：图片及视频获取、展示、管理、上传、下载、图片集
- 社交属性：点赞、评论
- 传播能力：分享
- 用户规模：千万级
- 上线时间：4周。时间对于产品占领用户的心来说十分重要，因此，时间目标定了4周上线。

![](https://img.serverlesscloud.cn/qianyi/YHl6UWa9s62icv8Chd3kYictP0lzHOic3QetI62Um77n2jabnqde8flVCHAV1fQ86Nm1u3fw0BHTTjmZM1bIEHmHA.jpg)

需求明确之后，就是怎样用高效、快速并省成本的方式实现腾讯相册小程序。

**腾讯相册小程序基于 Serverless 落地实践**

**传统模式开发流程**

产品的开发需求非常明确，总结4个字就是“多快好省”。承载千万级用户的小程序，对后台架构的性能和稳定性要求非常高，如果有足够的时间和资源，这些都不是问题。但是想要在4周的时间内完成开发并上线，压力非常大。如果按照传统的开发模式下，这样一款小程序需要

1. 项目人员准备：至少1个前端工程师，2个后台工程师，加一个测试和2个运维。
2. 当人员Ready后，开始着手环境搭建，需要运维购买资源，如主机，数据库，负载均衡等，并协助部署运行环境、域名备案、搭建监控告警系统等。
3. 环境Ready后，前端和后台开始开发，然后测试介入、运维完成线上部署，最后申请发布。

即使顺利的情况下，整套流程都很顺利的走完，也需要至少8周的时间，如果人员不到位，需要的时间更久。可以发现，耗时主要是在环境搭建和开发流程当中，而且人力耗费也在这一块。

![](https://img.serverlesscloud.cn/qianyi/YHl6UWa9s62icv8Chd3kYictP0lzHOic3Qeibdwa07OU7jduNYGXlaHs2D17mw4JJEruZq9UCiaho50s3HK2FbJCPkg.jpg)

在开发流程这块，后端开发除了需要关注核心业务逻辑之外，还需要做框架选型，了解数据库和文件存储等。并且还需要耗费精力对性能进行优化，比如高并发。那么必然也要去了解底层的运行机制，比如容器服务。同时运维也要花大量的时间来保障安全和容灾等能力。

![](https://img.serverlesscloud.cn/qianyi/YHl6UWa9s62icv8Chd3kYictP0lzHOic3Qe3BjR3ia4onCHnxgCEGaBLVjerhmIVZp1zOEq6xVvsIFqo8C5k2BicibOw.jpg)

因此，自上而下，对团队成员的专业技能要求越来越高。同时，花费的时间也越来越多。

环境和开发工作全部完成后，需要进行架构维护，不仅需要维护业务集群，还需要关注各个组件的稳定性。测试方面，除了产品功能验证外，还需要压测各个组件的性能。最后，还需要随时保障整个系统的稳定性和安全性。

![](https://img.serverlesscloud.cn/qianyi/YHl6UWa9s62icv8Chd3kYictP0lzHOic3QevDlQOg8Zqw0KaC0bEVkBHKIGMgicL8zaz4qiaHDQhXwwpkJfible4EwqQ.jpg)

**基于Serverless 模式的开发流程**

如果将刚才提到的和核心业务逻辑不相关的事情都交给微信和腾讯云，系统架构将会大大简化，而且能够节省不少人力。最终，只需要关注的只剩下小程序端+核心业务，整个开发流程将会变得无比简洁。通过Serverless，这种想法可以得以实现。Serverless其实是一种架构理念，他是把底层资源抽象成API的形式对用户提供服务。

![](https://img.serverlesscloud.cn/qianyi/YHl6UWa9s62icv8Chd3kYictP0lzHOic3Qe6HZ0ToEgfjKvtsPRUibwLk8M4mVGztia28HZRz1WzMYT47xc4hLpKTjQ.jpg)

在去年年初，微信团队和腾讯云团队开始尝试将Serverless和小程序开发结合起来并提供一套小程序 · 云开发解决方案，这还要归功于Faas在国内的兴起。有了Faas之后，用户核心计算逻辑的承载平台真正实现了Serverless化。

![](https://img.serverlesscloud.cn/qianyi/YHl6UWa9s62icv8Chd3kYictP0lzHOic3Qe0MH6buxiahkojt4FUVbo57F3Jh3NEHic5bP81sQfSOkqNnY09icj7p3oQ.jpg)

- 首先云开发封装了用户需要用到的云函数、数据库和文件存储资源，开发不用再去关心环境问题；
- 其次，从小程序端到云开发后台的请求，走的是微信和腾讯云之间的专线，并且用的是私有协议，所以用户也不用担心安全问题；
- 最后，云开发整个后台提供了完善的监控和日志系统，也省去了运维同学的部分工作。因此，新的方案不仅省去了很多运维的工作，同时也有效的加速了开发流程。

![](https://img.serverlesscloud.cn/2020414/1586874061017-640%20%282%29.jpeg)

**如何使用**

新的架构或者方案具体该怎么使用呢？之前有提到，整个方案里最核心的是计算模块。当有用户在小程序端发起后台请求的时候，云函数平台会根据用户的请求量动态的伸缩实例，以保证用户的请求能够被及时响应，同时用户可以在云函数里发起数据库以及文件存储的读写操作。下图展示的完整架构是Serverless的具体表现形式。用户不再需要部署服务器，通过无服务器云函数即可实现核心业务逻辑。

![](https://img.serverlesscloud.cn/qianyi/YHl6UWa9s62icv8Chd3kYictP0lzHOic3Qemt5ZKcAibDfH4G1WDibbOSSdomwvn9icPZG9zWX7PCuJyaUhaquial9s9A.jpg)

这一套基于Serverless的架构将会具备以下优势：1、无穷的弹性计算能力；2、让用户聚焦核心业务逻辑的编写；3、根据请求自动运行；4、秒级上传部署；5、几乎不需要运维运维。

![](https://img.serverlesscloud.cn/qianyi/YHl6UWa9s62icv8Chd3kYictP0lzHOic3Qee3ibODcYvXfWia1kXFu3rKE5iaqGrODf5NF1AJ4cU4k0CP0EFNZ67iaoRQ.jpg)

**如何基于Serverless实现腾讯相册小程序开发**

以最核心的社交功能为例。按照传统的开发模式，研发团队会面临几个挑战，运维人力，开发复杂度，历史包袱等。

![](https://img.serverlesscloud.cn/qianyi/YHl6UWa9s62icv8Chd3kYictP0lzHOic3Qe0soTAsFM1aM6H1kxl4e31VDldrdZGQhFKiblfyanXwzwjgzAQibOtKHQ.jpg)

借助云开发的能力，架构设计将会变得非常简单。举个例子，按照传统的开发方式，需要花费大量的时间在框架路由设计和安全设计，以及后台的性能优化上面。而基于Serverless的方案，只需引用SDK，就能直接callfunction，运行业务代码。

![](https://img.serverlesscloud.cn/qianyi/YHl6UWa9s62icv8Chd3kYictP0lzHOic3QegHnVWo8M7gxN1UEFDO6BZpXK1NnN8j8KicW1gOZuFRKSSYmvU9uu1ZQ.jpg)

再来看下性能方面，根据现网的运行数据，发现无论波峰还是波谷，后台的响应延迟都在70ms以下。

![](https://img.serverlesscloud.cn/qianyi/YHl6UWa9s62icv8Chd3kYictP0lzHOic3QeF5IAZUtAWWAmafdhH0kwviaeggLlwFfwjdZmHm6AIjiaFb4FJEa6WyTA.jpg)

可以看到，对比传统的开发模式，需要大约1人10周的人力完成开发，而借助Serverless，只需要1人3周就能完成基础开发和测试。因为，系统架构变的非常简单，并且和原有的空间后台完美兼容，极大的提升了开发效率。

![](https://img.serverlesscloud.cn/2020414/1586874150940-%E5%B1%8F%E5%B9%95%E5%BF%AB%E7%85%A7%202020-04-14%2022.22.16.png)

**总结**

对于公司/个人来说，通过云的Serverless架构开发微信小程序，有下面几个非常显著的优势：

1. 加快了产品的迭代效率
2. 稳定，高可用，弹性伸缩，完全不需要自己关心底层的运维
3. 降低了资源的投入，这里包括了人力和财力

腾讯云Serverless，可以助力微信小程序开发！用户后续在开发小程序，或者有任何想法需要快速落地时，可以想到采用Serverless架构来开发 ，非常的惊喜、简单。

> **传送门：**
> - GitHub: [github.com/serverless](https://github.com/serverless/serverless/blob/master/README_CN.md) 
> - 官网：[serverless.com](https://serverless.com/)

欢迎访问：[Serverless 中文网](https://serverlesscloud.cn/)，您可以在 [最佳实践](https://serverlesscloud.cn/best-practice) 里体验更多关于 Serverless 应用的开发！
