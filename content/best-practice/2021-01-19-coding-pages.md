---
title: 成为技术影响力大牛？CODING Pages 快速搭建个人专属博客
description: 博客教程有很多，这一篇又有什么特别？—— 特别简单
date: 2021-01-19
thumbnail: https://main.qcloudimg.com/raw/2547283cf5d9ade937c1d81a75fa8948.png
categories:
  - best-practice
authors:
  - 吴宜展
tags:
  - Serverless
  - CODING
---

## 服务简介

CODING 静态网站服务是腾讯云 Serverless 团队联合 CODING 为开发者提供的便捷、稳定、高拓展性的静态网站资源托管服务，结合了 Tencent Serverless Framework 完整、高效的部署流程和 CODING 强劲的 Jenkins 构建队列，支持 Jekyll、Hexo 等多种部署框架。您无需自建服务器，即可一键部署网站应用，将静态网站分发至全网节点。
现在新用户首次部署成功后还将获得腾讯云无门槛代金券，可0元使用180天。

## 开始搭建静态网站

### 一、创建 CODING 项目

1. 在 [CODING 控制台](https://coding.net/)左侧导航栏中点击【项目】，来到项目列表页，在项目列表页点击【创建项目】按钮。

![](https://main.qcloudimg.com/raw/dac78d03f05d3888c93790be3e826df6.png)

2. 选择创建 DevOps 项目。填写项目名称后，点击【完成创建】按钮，即可完成 CODING 项目的创建。

![](https://main.qcloudimg.com/raw/ca06bde2bb0febb173a470ba83aeb099.png)

### 二、准备静态网站资源

在开始部署静态网站前需要准备静态网站资源，您可以方便的从各类资源站上找到静态网站资源，或将您已有的静态网站迁移至 CODING 。如果您没有准备静态网站资源，CODING 还提供了网站模板供您选择。
CODING 静态网站目前支持传统静态网站资源和 Jekyll，Hexo，Gatsby，Zola 等需要预编译的静态网站资源。

![](https://main.qcloudimg.com/raw/c26f4efdc794e9e84adc21237ad7f42f.png)

### 三、创建代码仓库并推送代码

1. 进入第一步已创建好的项目，在左侧导航栏中选择【代码仓库】，点击左上角的【新建代码仓库】按钮。
2. 填写新建代码仓库表单，使用“普通新建”、“模版新建”、“导入外部仓库”等方式创建一个新的代码仓库。
   
![](https://main.qcloudimg.com/raw/bd0855aa2d813ecfe50e0c97a2767da7.png)

3. 使用git命令将第二步中已经准备好的静态网站资源推送至代码仓库。

### 四、新建静态网站

1. 在项目左侧导航栏中选择【持续部署—静态网站】，点击左上角的【新建网站】按钮。

![](https://main.qcloudimg.com/raw/a602fc68475f74efe8d7679766b7228d.png)

2. 在新建网站页面中输入网站名，选择代码仓库、部署的分支，部署的路径。最后选择部署的网站类型和节点。

![](https://main.qcloudimg.com/raw/7cdd75e4db9859dd56c68485da646f54.png)

3. 点击【确定】按钮，等待网站部署完成。

### 五、访问静态网站

网站部署成功后，您可以前往网站基本信息页查看默认访问地址，并通过默认地址访问已经部署好的静态网站，快来试试吧~

![](https://main.qcloudimg.com/raw/2390946c98400bc3506ccd13ef09d1ff.png)

## 后续规划，敬请期待

- CODING Wiki集成：支持将同一项目下的 CODING Wiki 的页面直接部署为静态网站页面对外部开放，知识分享更容易；
- 其他代码托管平台集成：提供与Github、Gitlab、Gitee等主流代码托管平台的集成，可轻松将其他平台的静态网站资源部署到 CODING 中；
- 监控统计能力：提供监控面板，无需额外付费，即可查看网站UV、PV、流量、调用等监控指标。

---

---
<div id='scf-deploy-iframe-or-md'></div>

---

> **传送门：**
> - GitHub: [github.com/serverless](https://github.com/serverless/serverless/blob/master/README_CN.md)
> - 官网：[serverless.com](https://serverless.com/)

欢迎访问：[Serverless 中文网](https://serverlesscloud.cn/)，您可以在 [最佳实践](https://serverlesscloud.cn/best-practice) 里体验更多关于 Serverless 应用的开发！