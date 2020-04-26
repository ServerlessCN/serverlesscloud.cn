---
title: 数千台 iPhone 同时送出，刷屏朋友圈的纪念礼有这些黑科技
description: 腾讯云2019年度收入在第三季度破百亿，并且给员工推送了一个 H5，内含领取一部 iPhone 11 pro 作为纪念礼的消息。而在这张包含惊喜的 H5 推送背后，腾讯云云函数为其提供了底层技术支持，完美支撑了短时间内超万名用户的访问请求。
keywords: Serverless,iphone,Serverless云函数,
date: 2019-12-19
thumbnail:  https://serverlessimg-1253970226.cos.ap-chengdu.myqcloud.com/qianyi/images/%E4%BC%81%E4%B8%9A%E5%BE%AE%E4%BF%A1%E6%88%AA%E5%9B%BE_15867969387612.png
categories:
  - news
authors:
  - liujiang
authorslink: 
  - https://github.com/jiangliu5267
tags:
  - Serverless
---

今天，又一张图片刷爆朋友圈

![serverless](https://img.serverlesscloud.cn/qianyi/images/YHl6UWa9s62TicWc2XxDgCXjIibg3ZCzrBc9s2xVjt5eGjiarFbjjunuJtGH0jRxqH3y5LJpia56oWlDoK4RiaJcVzg.jpg)

是的，腾讯云2019年度收入在第三季度破百亿，**并且给员工推送了一个 H5，内含领取一部 iPhone 11 pro 作为纪念礼的消息。**而在这张包含惊喜的 H5 推送背后，腾讯云云函数为其提供了底层技术支持，完美支撑了短时间内超万名用户的访问请求。

# **需求背景**

- 需求描述：腾讯云向员工发放激励，最终需要输出微信 H5 页面；
- 开发挑战：只有1名工程师，两天内完成方案设计，开发，测试，上线！

# **技术实现**

## **系统架构**

![serverless](https://img.serverlesscloud.cn/qianyi/images/YHl6UWa9s62TicWc2XxDgCXjIibg3ZCzrBqibcVXN0ZtCWAre5VEzvI37ueb1Bic7zxianEnf6bIX354bfnm5YxezbQ.png)

系统需要实现：


- 根据员工属性直出H5页面，领手机的员工直接在前端切换至手机页面；
- 考虑到这种内部活动会同时推送，会出现瞬时并发高峰，然后马上趋于平稳。出于成本和架构合理性的考虑，应该选择支持高峰并发请求，又可以自动扩容缩容的服务架构。

结合以上需求，最终选择了腾讯云，以 API 网关+腾讯云云函数为核心的技术架构。腾讯云云函数是腾讯云提供的无服务器执行环境，具备自动扩缩容能力，支持高并发，且不需要操心主机购买、环境搭建等，开发效率高，无需担心运维。

## **并发能力、压力测试**

活动涉及总人数超万人，为了确保万无一失，系统按照2000 QPS 的并发能力设计，云函数并发能力由云函数并发数量和云函数运行时间共同决定。这里，引入了 Redis，把数据库中所有名员工的数据提前写入 Redis 中，提高查询效率。非白名单员工或 Redis 过期后(此时应该已度过高峰期)，再降级查询数据库内的员工信息，此方案下云函数的运行时间低至10ms 以下。

## **实际运行**

活动进行时，监控显示一切正常，系统设计支持2000 QPS 的并发能力，最终平稳支撑项目运行，顺利度过瞬时高峰。

![serverless](https://img.serverlesscloud.cn/qianyi/images/YHl6UWa9s62TicWc2XxDgCXjIibg3ZCzrBwIJ61vqEp0h5zzfhtI3h0WpiapibUOrIvBleYicHVWexetZsvHN8zDicPg.jpg)

API网关监控

![serverless](https://img.serverlesscloud.cn/qianyi/images/YHl6UWa9s62TicWc2XxDgCXjIibg3ZCzrBTMffRl1wcXgvY55n7mk9527P0uVnvB8qjCsPrtIoh3S1MR2JSpg5rg.jpg)

云函数监控

腾讯云里程碑专属 H5 推送项目，需求内容本身并不难，但需要做不少的工作才能确保万无一失。作为前端开发，Serverless 确实让前端更容易向全栈发展，且更容易开发出稳定性好、支持高并发的后端服务。

# 免费试用

腾讯 Serverless Framework 助您快速、简单地构建和部署 Serverless 应用程序。目前，我们已提供免费产品试用方案，欢迎立即试用！
> 立即试用地址： https://github.com/serverless/components/blob/master/README.cn.md

---

> **传送门：**
> - GitHub: [github.com/serverless](https://github.com/serverless/serverless/blob/master/README_CN.md) 
> - 官网：[serverless.com](https://serverless.com/)

欢迎访问：[Serverless 中文网](https://serverlesscloud.cn/)，您可以在 [最佳实践](https://serverlesscloud.cn/best-practice) 里体验更多关于 Serverless 应用的开发！