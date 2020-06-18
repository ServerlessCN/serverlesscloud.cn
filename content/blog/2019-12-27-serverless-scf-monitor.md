---
title: 云函数 SCF 支持自定义监控 监控指标任你 DIY
description: 现在，云函数 SCF 全新升级监控可自定义化功能！用户可以非常简单方便地 DIY 函数运行时想要关注的监控指标，用以监控数据展示和告警！
keywords: Serverless,Serverless云监控,Serverless云函数,
date: 2019-12-27
thumbnail:  https://serverlessimg-1253970226.cos.ap-chengdu.myqcloud.com/qianyi/images/0%20%283%29.jpg
categories:
  - news
authors:
  - 腾讯云监控
authorslink: 
  - https://github.com/jiangliu5267
tags:
  - serverless
  - 监控
---

# **SCF 基础监控指标**

在使用云函数时，相信大家都会留意到在控制台展示的函数运行时的监控数据。通过这些监控数据可以了解到云函数相关信息，如：

1. 函数调用次数 —— 可以关注到业务请求量，又或是操作其他云产品的执行次数；
2. 函数运行内存和运行时间 —— 可以用以评估函数执行性能；
3. 函数错误次数 —— 可以用以发现函数执行的异常问题。

针对这些监控数据，还可以通过配置告警，帮助业务及时发现异常问题。


![serverless](https://img.serverlesscloud.cn/qianyi/images/YHl6UWa9s63pOMMx0c5M1iaGZic692hVUefEZnDTxaXSAvEiccpCfyNUOia627cG0iaHQ0F78F3Bia1ib6d10OdAic7hLA.png)



但这些平台级提供的通用监控，不能完全满足用户的个性化需求。我们经常会遇到这样的咨询：

> _NodeJs开发者：最近我们的Node程序运行太慢，你们有Runtime级别的监控吗？_
> 
> _业务运维：我们更关心调用成功率来评估服务可用性，可以把正确调用次数/调用次数给我们计算个成功率显示更直观吗？_
> 
> _电商产品经理：这个调用次数能再细化到具体业务场景吗？希望关注加入购物车的人数、下单购买的人数、最终付款的人数..……_

现在，云函数 SCF 全新升级监控可自定义化功能！用户可以非常简单方便地 DIY 函数运行时想要关注的监控指标，用以监控数据展示和告警！


# **如何在 SCF 中上报自定义监控指标**

步骤1：无需预注册，直接在函数代码里埋点上报自定义监控指标

![serverless](https://img.serverlesscloud.cn/qianyi/images/YHl6UWa9s63pOMMx0c5M1iaGZic692hVUeIeJmFl74zHTPV7S2sex2ME4fuedgUeaDfPVmrUia4WefBDOIV0sR2RA.png)

步骤2：上报完成后，查看指标视图，按需配置告警策略

![serverless](https://img.serverlesscloud.cn/qianyi/images/YHl6UWa9s63pOMMx0c5M1iaGZic692hVUeobd8xDIKlo1U9U2C8SCk5gSFkbKOiaNBcdepDSSrEc2ddQQWrkNKSLQ.png)

更详细的操作指南，可查看云+社区文章（最佳实践：在SCF中上报自定义监控数据：https://cloud.tencent.com/developer/article/1557566）

**产品正在免费内测中，感兴趣的读者，也可点击阅读原文使用腾讯云主账号登陆申请试用。**

附录：SCF上报自定义监控数据多方案对比

![serverless](https://img.serverlesscloud.cn/qianyi/images/YHl6UWa9s63pOMMx0c5M1iaGZic692hVUe5aKxHal8FHibSlQyyaujKMru3icUV9XxlF0EicOhnChzITEdrwxhnhhwg.png)
#

---

> **传送门：**
> - GitHub: [github.com/serverless](https://github.com/serverless/serverless/blob/master/README_CN.md) 
> - 官网：[serverless.com](https://serverless.com/)

欢迎访问：[Serverless 中文网](https://serverlesscloud.cn/)，您可以在 [最佳实践](https://serverlesscloud.cn/best-practice) 里体验更多关于 Serverless 应用的开发！