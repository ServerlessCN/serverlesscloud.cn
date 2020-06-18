---
title: 回顾 | Tencent Serverless Hours 线上分享会第一期
description: 5 月 8 日（周五）15:00 举办的 Tencent Serverless Hours 第一期线上分享会如期举行！
keywords: Serverless;Serverless Framework;Tencent Serverless
date: 2020-05-09
thumbnail: https://img.serverlesscloud.cn/202058/1588940051457-%E4%BC%9A%E5%90%8E%E5%AE%A3%E4%BC%A0banner.png
categories:
  - news
authors:
  - Serverless 社区
authorslink:
  - https://zhuanlan.zhihu.com/ServerlessGo
tags:
  - Serverless
  - Meetup
---

​5 月 8 日 15:00，由腾讯云 Serverless 主办的 Tencent Serverless Hours 第一期线上分享会如期举行。本次分享会主题是云函数，邀请到了腾讯云高级产品经理黄文俊 (Alfred) 和腾讯云高级前端开发工程师蔡卫峰 (Wes) 进行相关分享和实战演示，会议在腾讯云大学平台同步直播，近五百人参加了本次分享会。

## 议题一：如何借助 layer 实现云函数快速打包、轻松部署

**分享会的第一个议题是「如何借助 layer 实现云函数快速打包、轻松部署」**

腾讯云高级产品经理黄文俊 (Alfred) 首先展示了多函数开发常见的一些问题，例如：重复下载和存储、管理复杂、上传耗时，并分享了以下解决思路：

![](https://img.serverlesscloud.cn/202058/1588935800278-%E5%B1%8F%E5%B9%95%E5%BF%AB%E7%85%A7%202020-05-08%2017.51.48.png)

![](https://img.serverlesscloud.cn/202058/1588935804282-%E5%B1%8F%E5%B9%95%E5%BF%AB%E7%85%A7%202020-05-08%2017.51.54.png)

接着简要介绍了解决方案中用到的层的功能特性。最后，Alfred 用两个实际案例，带着参会的同学一起进行了实战：

实战案例 1 拨测并通过邮件发送拨测异常：使用库 requests

实战案例 2 拨测并通过 CMQ 消息队列发送消息：使用库 requests、cmqsdk

讲师 Alfred 会中分享源代码下载：`https://testpage-1252724067.cos.ap-guangzhou.myqcloud.com/share/layer_demo_clean.zip`

> 实操 git 地址：https://github.com/tencentyun/cmq-python-sdk


## 议题二：揭秘 Node.js 12.x Runtime 的实现原理

**分享会的第二个议题是「揭秘 Node.js 12.x Runtime 的实现原理」**

腾讯云高级前端开发工程师蔡卫峰 (Wes) 首先介绍了Node.js12 新特性，包括：V8引擎升级、TLS1.3 更好的安全性、默认堆大小动态分配等，如下图所示：

![](https://img.serverlesscloud.cn/202058/1588935809851-%E5%B1%8F%E5%B9%95%E5%BF%AB%E7%85%A7%202020-05-08%2018.04.16.png)

接着，阐述了 Runtime 工作原理，介绍了入口函数及其 event 参数，context 参数，callback 参数等的使用方法，让参会的同学有了更深入的了解。最后 Wes 用 Node.js 12 编写云函数实例演示。

目前 腾讯云成都区域 Node.js 12 已正式发布，接下来北京、广州、香港、上海金融、多伦多、印度、新加坡、日本等区域会陆续发布。

讲师 Wes 会中分享源代码下载：`https://test-1251133793.cos.ap-guangzhou.myqcloud.com/Nodejs12-demo.zip`

分享结束后，进行 Q&A 环节，大家就实际业务中遇到的问题在会话区和讲师进行了互动交流，主持人陈涛选取了其中三个比较典型的问题请讲师进行详细的解答。

由于时间冲突，不少同学反应没有能够参加本次在线分享会，5月13日开始，本次直播的回放视频会在腾讯云大学上线，可以通过链接 `https://cloud.tencent.com/edu/learning/live` 进行查看。

同时，也可以通过扫描下方二维码，添加小助手微信 `serverless_helper` 回复「1」，加入技术交流群进行技术交流，更多资源也会分享到群里。

![](https://img.serverlesscloud.cn/202058/1588935838439-%E5%B0%8F%E5%8A%A9%E6%89%8B.jpeg)



---
<div id='scf-deploy-iframe-or-md'></div>

---

> **传送门：**
> - GitHub: [github.com/serverless](https://github.com/serverless/serverless/blob/master/README_CN.md)
> - 官网：[serverless.com](https://serverless.com/)

欢迎访问：[Serverless 中文网](https://serverlesscloud.cn/)，您可以在 [最佳实践](https://serverlesscloud.cn/best-practice) 里体验更多关于 Serverless 应用的开发！
