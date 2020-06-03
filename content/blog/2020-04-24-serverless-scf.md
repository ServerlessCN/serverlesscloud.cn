---
title: 万物皆可 Serverless 之关于云函数冷热启动那些事儿
description: 本文带大家了解一下云函数的冷热启动过程，以及面对云函数这种冷热启动模式，开发者需要注意哪些问题。
keywords: Serverless,Serverless冷启动,云函数
date: 2020-04-24
thumbnail: https://img.serverlesscloud.cn/2020523/1590217244198-16200.jpg
categories:
  - user-stories
authors:
  - 乂乂又又
authorslink:
  - https://cloud.tencent.com/developer/article/1619032
tags:
  - 云函数
  - 冷启动
---

# **一、本文介绍**

本以为《万物皆可Serverless》系列文章已经写到了尽头，谁知一不小心又想起了云函数冷热启动这个问题，那么本文就继续带大家来了解一下云函数的冷热启动过程，以及面对云函数这种冷热启动模式，开发者需要注意哪些问题。

废话少说，先上图

![serverless](https://img.serverlesscloud.cn/2020523/1590217244160-16200.jpg)

云函数被第一次调用（冷启动）

![serverless](https://img.serverlesscloud.cn/2020523/1590217244159-16200.jpg)

云函数被多次连续调用（热启动）

# **二、云函数的冷、热启动模式**

先跟大家讲下这里所谓的云函数冷热启动模式是什么意思，

冷启动是指你在服务器中新开辟一块空间供一个函数实例运行，

这个过程有点像你把这个函数放到虚拟机里去运行，

每次运行前都要先启动虚拟机加载这个函数，

这是比较耗时的一个过程，

所以云函数需要尽量减少自身冷启动的次数

热启动则是说如果一个云函数被持续触发，

那我就先不释放这个云函数实例，

下次请求仍然由之前已经创建了的云函数实例来运行，

就好比我们打开虚拟机运行完这个函数之后没有关闭虚拟机，

而是让它待机，等待下一次被重新触发调用运行，

这样做的好处就是省去了给虚拟机“开机”的一个耗时环节，

缺点是要一直维持这个虚拟机的激活状态，系统开销会大一些，

当然这里的云函数资源分配的问题并不需要我们操心，

云函数的底层会通过算法自行调配

然后我们再来看一下腾讯云云函数文档里的简介 [https://cloud.tencent.com/document/product/583/9199](https://cloud.tencent.com/document/product/583/9199?from=10680)

> 腾讯云云函数是腾讯云提供的 Serverless 执行环境。您只需编写简单的、目的单一的云函数即可将它与您的腾讯云基础设施及其他云服务产生的事件关联。
> 使用云函数时，您只需使用平台支持的语言（Python、Node.js、PHP、Golang 及  Java）编写代码。腾讯云将完全管理底层计算资源，包括服务器  CPU、内存、网络和其他配置/资源维护、代码部署、弹性伸缩、负载均衡、安全升级、资源运行情况监控等。但这也意味着您无法登录或管理服务器、无法自定义系统和环境。
> 云函数自动地在同一地域内的多个可用区部署，同时提供极高的容错性。云函数在执行时将根据请求负载扩缩容，从每天几个请求到每秒数千个请求，都由云函数底层自行伸缩。您无需人工配置和介入，只需为运行中的云函数付费，即可满足不同情景下服务的可用性和稳定性。若云函数未运行，则不产生任何费用。
> 您可以自定义运行云函数的时机，例如，在 COS Bucket 上传时、删除文件时运行云函数、应用程序通过 SDK  调用时运行云函数，或指定云函数定期执行。您可以使用云函数作为 COS 服务的数据处理触发程序轻松实现 IFTTT  逻辑，您也可以通过构建灵活的定时自动化任务，用于覆盖手工完成的操作，轻松构建灵活可控的软件架构。

大家注意这一句

> 云函数在执行时将根据请求负载扩缩容，从每天几个请求到每秒数千个请求，都由云函数底层自行伸缩。

可以看到云函数的函数实例个数在系统底层是通过算法自行伸缩的，

我们再往下看

> 在 Serverless 2.0  中，我们不仅在控制流和数据流的模块、虚拟化层、网络层、调度层都做了彻底的重构优化，还在安全性、可用性以及性能方面也进行了全面升级。通过采用轻量级虚拟化技术、VPC  Proxy 转发方案等多种优化手段使用统一的底层架构。针对实时自动扩缩容核心的能力进行优化，彻底规避了传统无服务器架构中饱受诟病的冷启动问题。
> 云函数不再限制运行时长，支持更丰富的应用场景。例如：
> 服务型函数不限制单次请求的时长。当请求持续到来时，服务会保持一个长运行的模式，无温、冷启动时延。
> 服务型函数支持 WebSocket 长连接。
> Event Function（触发器函数）具备单次调用时长限制，但在请求持续到来时，服务是保持长运行模式，并无温、冷启动时延。

注意这句

> 触发器函数具备单次调用时长限制，但在请求持续到来时，服务是保持长运行模式，并无温、冷启动时延。

也就是说我们通过各种方式来触发的云函数实例，并不都是完全冷启动的，也有可能是之前调用的云函数的实例。

下面我们一起来做一个实验

```javascript
import json

global_v=1

# api网关回复消息格式化
def apiReply(reply, code=200):
    return {
        "isBase64Encoded": False,
        "statusCode": code,
        "headers": {'Content-Type': 'application/json', "Access-Control-Allow-Origin": "*"},
        "body": json.dumps(reply, ensure_ascii=False)
    }


def main_handler(event, context):
    global global_v
    global_v+=1
    return apiReply({
        'ok': True,
        'message': global_v-1
    })
```

上面是一个简单的python云函数，我们给它添加一个api网管触发器来试验一下它会返回什么结果

![serverless](https://img.serverlesscloud.cn/2020523/1590217244158-16200.jpg)

第一次调用，返回了1，说明我们的云函数被冷启动了。

![serverless](https://img.serverlesscloud.cn/2020523/1590217244158-16200.jpg)

继续调用，发现这次返回了2，说明我们的云函数是在上一个实例的基础上被热启动的。

![serverless](https://img.serverlesscloud.cn/2020523/1590217244160-16200.jpg)

![serverless](https://img.serverlesscloud.cn/2020523/1590217244157-16200.jpg)

![serverless](https://img.serverlesscloud.cn/2020523/1590217826454-16202.jpg)

再试几次我们发现有的是被热启动，有的依然是被冷启动

但是这种表现显然是与我们的预期不符的，

我们期望前面的请求是不会影响到后面云函数运行结果的

这就是问题所在。

好，我们现在再去看一下官方文档是怎么说的

> SCF 是否会重复使用函数实例？
> 为了提高性能，SCF 会在一定时间内保留您的函数实例，将其再用于服务后续请求。但您的代码不应假设此操作总是发生。
> 为何要保持 SCF 函数无状态？
> 保持函数的无状态性可使函数按需要尽可能多地启动多个实例，从而满足请求的速率。

也就是说，我们在编辑云函数时一定要保证 SCF 函数是无状态的，不然就会出现一些无法预测的奇怪问题

那么啥是无状态嘞？

说白了就是你的云函数不能依赖之前函数运行的状态或者是结果，

并且要尽量避免全局变量的使用！

因为就像我们之前实验中那样，

全局变量的值会在云函数的冷热启动过程中变得无法预测，

这在我们后续的函数调测过程中，无疑是一场灾难~

（ 没错，我就是在这个坑里掉进过很多次的受害者 T^T）

更多关于腾讯云 SCF 使用的常见问题，可参考官方文档 [https://cloud.tencent.com/document/product/583/9180](https://cloud.tencent.com/document/product/583/9180?from=10680)

## Serverless Framework 30 天试用计划

我们诚邀您来体验最便捷的 Serverless 开发和部署方式。在试用期内，相关联的产品及服务均提供免费资源和专业的技术支持，帮助您的业务快速、便捷地实现 Serverless！

> 详情可查阅：[Serverless Framework 试用计划](https://cloud.tencent.com/document/product/1154/38792)

---
<div id='scf-deploy-iframe-or-md'></div>

---

> **传送门：**
> - GitHub: [github.com/serverless](https://github.com/serverless/serverless/blob/master/README_CN.md)
> - 官网：[serverless.com](https://serverless.com/)

欢迎访问：[Serverless 中文网](https://serverlesscloud.cn/)，您可以在 [最佳实践](https://serverlesscloud.cn/best-practice) 里体验更多关于 Serverless 应用的开发！
