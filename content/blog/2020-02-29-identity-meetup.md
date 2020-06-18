---
title: 国产 Serverless Identity 开源组件工作坊 - 在线分享
description: Authing 联合腾讯云、Serverless 中文社区专家分享 Serverless Framework 组件的开发及应用
keywords: Serverless 全局变量组件,Serverless 单独部署组件,Serverless Component
date: 2020-02-29
thumbnail: https://img.serverlesscloud.cn/2020327/1585306882234-9.jpg
categories:
  - meetup
authors:
  - serverless 社区
authorslink:
  - https://serverlesscloud.cn
location:
  - 线上直播 | Authing & 腾讯云 & Serverless 社区
tags:
  - Serverless
  - Identity
---

疫情肆虐，不仅对老百姓生命健康造成重大威胁，对各行各业的发展也造成重大影响。同时，开学、复工在即，疫情防控进入了关键阶段，「居家隔离、远程办公」是当下遏制疫情扩散的最佳防控措施。

2019 新型冠状病毒（2019-nCoV）使得中国一夜之间成了「全球最大的远程办公数字社会」，但是如此大规模的，敦刻尔克式的“数字化转型”，对「企业协同」、「企业 VPN 性能及安全性」、网络信息安全迎来重要考验， 也难免会出现大量次生安全问题，尤其在春节假期延长，大量企事业单位启动「远程办公」，原本在防火墙内，使用公司设备办公的员工，使用家用 PC 开始办公，并通过公共 WiFi 访问企业内部的数据和应用时，企业网络安全部门面临着空前的安全威胁，其中，「身份安全」是至关重要的一环。

于是，我们发起 \# Shape Identity 系列线上技术公开课，旨在倡议：在阻击物理世界「新冠」病毒的同时，不要忽视数字空间的安全。我们将定期邀请业界 Identity 专家一起探讨 Identity 技术的发展！主题涵盖：IDaaS/IAM、Serverless、ZeroTrust、Cloud Native 等开源技术。

第 001 期，定在本周六，2月29日，四年独一无二的日子，也是 2020年的第60天。 本次线上直播 Authing 联合腾讯云、Serverless Framework中文社区，与大家共同探讨：Serverless Framework 组件的开发及应用。**本周六（2020-02-29 ）13:00——17:00**，通过「腾讯会议」 300人在线分享及 Q\&A 视频互动、B站直播弹幕互动， 参与互动将送出「腾讯云」赞助纪念品。

近些年 Serverless 风起云涌，它正在深刻的改变未来软件开发的模式和流程，对于大多数应用而言，借助 Serverless 服务，开发者可以将绝大多数精力投入在业务逻辑的开发整合上，大大缩短开发周期，降低运维成本。Serverless Framework 当属时下最火热的开源框架，本期就与大家共同探讨：**Serverless Framework 组件的开发及应用。**

## 线上分享议程

主持人：晋剑 Authing 联合创始人兼COO

### 一、如何开发自己的第一个 Serverless Component？

陈涛：Serverless Framework 社区专家 

参与 Serverless 社区及开源的相关研发工作。拥有丰富前端、JavaScript 技术经验，以及网站及小程序等项目开发经验，腾讯云 Serverless 系列课程特约讲师。 
内容简介：

- serverless Component 运行机制
- serverless Component 开发步骤（功能需求，组建配置）
- serverless Component 组件开发（default 函数，remove 函数）
- serverless Component 运行，调试与发布

### 二、Authing 是如何开发 Serverless-OIDC 组件？

高鹏洋：Authing 全栈工程师 

曾就职于中科红旗，负责容器云研发。曾参与中国移动 HA 系统研发，CNCF 贡献者，郑州 TFUG 组织者。热爱创造，喜欢探索未知，乐于与人交流，是一名 Acmer 。

内容简介： **OIDC 是 OAuth 2.0 的超集，同时是 Authing 推荐的身份认证最佳实践。**在没有 Serverless 的情况下，开发者需要架设一个服务器用来在后端处理 OIDC code 换 Token 和 Token 换用户信息的流程，有了 Serverless 之后，开发者不需要编写任何路由就可以获取用户信息。本次主题将分享如何通过使用腾讯提供的 SCF 和 API 网关 Serverless Component 来快速创造一个 由多个原生 SCF 组成的 Serverless Component：欢迎 Star ：https://github.com/Authing/serverless-oidc

### 三、基于Serverless Framework和OIDC 组件设计一个图床应用

谢扬：Authing 创始人
SoLiD 中文社区（learnsolid.cn）发起人 

曾任职字节跳动 LarkCloud 云服务部门核心 Hacker，负责⽇活过亿 Serverless 平台产品设计和技术研发，该平台支撑来头条系全产品矩阵：今日头条、抖音、西瓜视频、飞书等。⻓期关注生产⼒科技，以提⾼社会生产⼒为个⼈使命。

内容简介： 基于 Serverless Framework 和 Authing 完成一个可以共享和配置访问权限的图床管理应用。

### 四、线上自由 Q \& A 环节

朋友们也可通过B站直播链接参与互动

Authing Live 直播间：https://live.bilibili.com/4850077

- 欢迎 Star ：https://github.com/Authing/serverless-oidc



---
<div id='scf-deploy-iframe-or-md'></div>

---

> **传送门：**
> - GitHub: [github.com/serverless](https://github.com/serverless/serverless/blob/master/README_CN.md)
> - 官网：[serverless.com](https://serverless.com/)

欢迎访问：[Serverless 中文网](https://serverlesscloud.cn/)，您可以在 [最佳实践](https://serverlesscloud.cn/best-practice) 里体验更多关于 Serverless 应用的开发！
