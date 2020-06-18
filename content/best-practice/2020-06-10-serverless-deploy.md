---
title: 腾讯云 Serverless 部署应用耗时降低了 73%
description: 压缩上传性能得到提升，控制台界面展示数据全面优化，Serverless 部署应用的过程体验更轻松、舒适。
keywords: Serverless,Serverless 应用部署,Serverless Framework
date: 2020-06-10
thumbnail: https://img.serverlesscloud.cn/2020610/1591789849944-%E9%83%A8%E7%BD%B2.jpg
categories:
  - best-practice
authors:
  - susu
tags:
  - serverless
  - 性能监控
---

在使用 Serverless Framework 部署 Next.js，Egg.js 项目时，由于安装的依赖包过大，部署时压缩上传时间很长，可能出现上传超时、控制台卡死等问题。

为此，Serverless 团队近期对部署做了一个性能优化，原来部署一个 Next.js 的 Demo 项目大约需要 **55s** 左右，而现在只需要 **18s** 的时间。

**下面我们一起看一下，优化前后部署方案哪些不同。**

## 一、部署性能对比

本次提速主要做的是压缩上传性能的提升。优化后采用流式上传压缩，并直接在压缩包内注入组件代码，大大的提升了性能。选取三种不同大小的代码包进行测试，优化前后平均部署性能如下所示：

| 代码包大小（MB） | 优化前（秒） | 优化后（秒） |
| ---------------- | ------------ | ------------ |
| 111 MB            | 55 s          | 18 s          |
| 216 MB            | 100 s         | 38 s          |
| 418 MB            | 185 s         | 70 s          |

可见，部署的整体性能提升了将近 **3倍**！对于一个轻量级别的网站或博客（ 200 MB 左右），每次部署只需要 35s 左右的时间！

## 二、CLI 控制台输出对比

在 CLI 控制台输入 `sls deploy` 命令后，CLI 控制台状态的对比，如下图所示：

![](https://img.serverlesscloud.cn/2020610/1591779885918-01.png)


优化前部署全流程仅有 deploying 状态，直到部署结束返回结果。优化后将部署流程的每一步实时反馈到控制台界面上，让用户更清晰的看到整个部署流程，也能方便定位问题（如本地网络问题导致上传失败）。

本次部署性能的提升是不是让小伙伴们已经激动不已了呢？

**下面通过一个实例，我们来一起感受下三倍速性能优化带来的体验！**

## 体验 Next.js 部署实战

### 1. 安装最新版本的 serverless

```bash
 npm install -g serverless
```

### 2. 本地创建一个 Next.js 项目并初始化

```
npm init next-app serverless-next
cd serverless-next
```

### 3. 配置 serverless.yml

```bash
 # serverless.yml
component: nextjs # (必填) 组件名称，此处为nextjs
name: nextjsDemo # (必填) 实例名称
org: orgDemo # (可选) 用于记录组织信息，默认值为您的腾讯云账户 appid
app: appDemo # (可选) 该 next.js 应用名称
stage: dev # (可选) 用于区分环境信息，默认值是 dev

inputs:
  src: 
    src: ./
    exclude:
      - .env
  functionName: nextjsDemo
  region: ap-guangzhou
  runtime: Nodejs10.15
  apigatewayConf:
    protocols:
      - http
      - https
    environment: release
```

### 4. 进入项目目录，构建静态资源

```bash
npm run build
```

### 5. 部署到云端

```bash
sls deploy
```

部署成功，如下图所示：

![](https://img.serverlesscloud.cn/2020610/1591779892363-03.jpeg)



---
<div id='scf-deploy-iframe-or-md'></div>

---

> **传送门：**
> - GitHub: [github.com/serverless](https://github.com/serverless/serverless/blob/master/README_CN.md)
> - 官网：[serverless.com](https://serverless.com/)

欢迎访问：[Serverless 中文网](https://serverlesscloud.cn/)，您可以在 [最佳实践](https://serverlesscloud.cn/best-practice) 里体验更多关于 Serverless 应用的开发！






