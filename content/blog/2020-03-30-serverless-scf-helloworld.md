---
title: 那些年，我学习的腾讯云云函数
description: 云函数就像数学上的函数一样，丢给他一个参数，它返回一个结果。云函数也是接收一个事件参数，然后返回一个处理结果。编写云函数实际上就是在处理一个事件的过程。所以，它很适合用于处理无状态的编程。比如我丢给你一个链接，你给我生成一个二维码，或者我上传一张图片，你给我怎么怎么处理。
keywords: Serverless,Serverless云函数,Serverless应用
date: 2020-03-30
thumbnail: https://img.serverlesscloud.cn/2020522/1590167715160-%E4%BC%81%E4%B8%9A%E5%BE%AE%E4%BF%A1%E6%88%AA%E5%9B%BE_15901677055783.png
categories:
  - user-stories
authors:
  - 浅墨233
authorslink:
  - https://cloud.tencent.com/developer/article/1608075
tags:
  - Serverless
  - 云函数
---

腾讯家的产品我用很久了，而腾讯云函数是让我印象最深刻的，可以说，我见证了腾讯云函数的诞生、成长和发展。

我最初是不太熟悉编程的，虽然是计算机学院的学生，实际上也并没有过多少实践。初见云函数，我便觉得它潜力无限，而在折腾腾讯云函数的过程中，我也渐渐的接触了 js, node, bootstrap 和 vue，也经历了被 js 原型链和异步调用的折磨。恨之深，爱之切，这也大概是我如此钟爱云函数的原因之一吧。

## **为什么是腾讯云函数**

### **便宜甚至免费**

腾讯的云函数在函数调用次数、资源使用和外网流量都是有免费额度的，这些免费额度完全够个人开发者使用。有兴趣的可以看一看我的二月份账单，云函数一共调用了 **70万** 次，最后结算费用时仍然是 **0元**。

三月份账单还没出，但是从目前的花费来看，调用了**160万** 次也就只扣了 **0.08元**，一角钱都不到，可以说很是良心了。

### **可塑性强**

云函数支持多种功能，定时任务，队列任务，网关访问等等。定时任务可以用来做一些定时监控、自动签到、定时文件处理。队列任务适合耗时比较大但又不是即时的操作，比如邮件发送，就可以先把邮件发送任务放置到腾讯的[消息队列](https://cloud.tencent.com/product/cmq?from=10680)里面，然后再使用云函数完成处理。网关访问是我个人用的比较多的一种，可以根据访问链接完成特定的处理，拿来做个人博客、开放 api 都是不错的选择。

### **文档细致**

文档一直有团队在维护，我曾提过意见，还有幸被选中了，收到了一份小礼品。文档之外，还有一个官方 QQ 群，**群内的朋友个个都是人才，说话又好听，超喜欢在里面**。有什么问题、建议、意见都可以很快的得到解决方法，很方便。

### **上手快**

官方给出了很多 demo ，简单又好理解。github 也有很多实例，也能帮助理解。

## **如何上手**

官方文档里面写的很详细，这里我写一下个人的一点小经验。

云函数有两个关键词 **事件驱动 和 无状态**。

云函数就像数学上的函数一样，丢给他一个参数，它返回一个结果。云函数也是接收一个事件参数，然后返回一个处理结果。编写云函数实际上就是在处理一个事件的过程。所以，它很适合用于处理无状态的编程。比如我丢给你一个链接，你给我生成一个二维码，或者我上传一张图片，你给我怎么怎么处理。

### **无状态？**

完全无状态的函数有时侯并不方便，所以经常需要配合数据库使用，数据库负责记录状态。但除了使用数据库之外，我们还知道，腾讯云函数是包括冷启动和热启动两种方式。按照局部性观点，当我们调用了一次函数后，接下来我们很有可能还会再次调用函数。基于这样的思想，云函数在第一次调用时负责分配资源（冷启动），而第一次调用完成后，这些资源将会被暂时保留一小段时间（大概是几分钟），而在这期间如果再次有函数调用，就可以直接使用之前的资源（热启动）。如果同一时间调用太多，还会触发并发机制，冷启动分配多个新的资源。

这就意味着，我们可以在内存中或者在文件系统中（ /tmp 文件夹下）保留一些缓存信息，以提高我们云函数的访问速度。**但仅适合用于做缓存，保存永久性文件还是需要配合其他产品才行。**

## **简单实例**

官方给出的`hello world`实例

简单，有助于理解事件驱动，很适合入门。

```javascript
'use strict';
exports.main_handler = async (event, context, callback) => {
    console.log("Hello World")
    console.log(event)
    console.log(event["non-exist"])
    console.log(context)
    return event
};
```

event 就是我们触发事件，context 就是发生该事件时系统所处的状态，最后需要返回处理结果。

## **一些妙用**

### **如何处理无状态**

配合同地域的 cos 使用，利用 cos 存储经常变动的但又需要保存的信息，比如配置信息。内网流量免费，基本也不会有额外的花费。

## **遇到的坑**

很多坑都是 js 这门语言的，毕竟是现学的嘛。

关于云函数，目前为止并没有遇到太大的坑，唯一需要注意的就是在利用网关触发器上传或下载二进制文件时，比如图片，需要 base64 转码处理，要不系统会因为自动的转移反转义导致无法正确解码。

### **个人项目**

利用腾讯云函数开发的一个简单网盘索引工具。

[https://github.com/ukuq/onepoint](https://github.com/ukuq/onepoint)

腾讯云函数部分还使用了 cos 用于读取保存配置文件。

最初版本是挺简单的，没有什么麻烦的功能，后来竟然还为此简单地学习了 node, bootstrap 和 vue。

## **附**

云函数文档地址：

[https://cloud.tencent.com/document/product/583/9199](https://cloud.tencent.com/document/product/583/9199?from=10680)

 晒一晒腾讯云函数 scf 2月账单：

[https://www.onesrc.cn/p/print-tencent-cloud-function-scf-bill-in-february.html](https://www.onesrc.cn/p/print-tencent-cloud-function-scf-bill-in-february.html)

3 月调用次数截图：

![serverless]( https://img.serverlesscloud.cn/2020522/1590167715160-%E4%BC%81%E4%B8%9A%E5%BE%AE%E4%BF%A1%E6%88%AA%E5%9B%BE_15901677055783.png )

3 月调用次数截图

12号左右，开启了限流。

个人项目的第一个版本:

[https://github.com/ukuq/onepoint/tree/fc1a3f28f570d55945b60bd250c40cc8f92162a7](https://github.com/ukuq/onepoint/tree/fc1a3f28f570d55945b60bd250c40cc8f92162a7)

## Serverless Framework 30 天试用计划

我们诚邀您来体验最便捷的 Serverless 开发和部署方式。在试用期内，相关联的产品及服务均提供免费资源和专业的技术支持，帮助您的业务快速、便捷地实现 Serverless！

> 详情可查阅：[Serverless Framework 试用计划](https://cloud.tencent.com/document/product/1154/38792)

## One More Thing
<div id='scf-deploy-iframe-or-md'><div><p>3 秒你能做什么？喝一口水，看一封邮件，还是 —— 部署一个完整的 Serverless 应用？</p><blockquote><p>复制链接至 PC 浏览器访问：<a href="https://serverless.cloud.tencent.com/deploy/express">https://serverless.cloud.tencent.com/deploy/express</a></p></blockquote><p>3 秒极速部署，立即体验史上最快的 Serverless HTTP 实战开发！</p></div></div>

---

> **传送门：**
> - GitHub: [github.com/serverless](https://github.com/serverless/serverless/blob/master/README_CN.md) 
> - 官网：[serverless.com](https://serverless.com/)

欢迎访问：[Serverless 中文网](https://serverlesscloud.cn/)，您可以在 [最佳实践](https://serverlesscloud.cn/best-practice) 里体验更多关于 Serverless 应用的开发！