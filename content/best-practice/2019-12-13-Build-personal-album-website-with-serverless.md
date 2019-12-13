
<!--
title: 用 Serverless 搭建个人静态相册网站
description: "通过 Serverless 组件,基于 ThumbsUp 快速搭建个人静态相册网站"
date: 2019-12-10
thumbnail: 'https://img.serverlesscloud.cn/20191212/1576141517135-123.png'
categories:
  - 指南和教程
authors:
  - alanoluo
authorslink: 
  - https://github.com/jiangliu5267
translators: 
  - None
translatorslink: 
  - None
-->

# 用 Serverless 快速搭建个人相册网站
我们可以利用一些开源工具将照片、视频等文件放到云服务上，来降低存储成本。本文将介绍一种方法：利用 ThumbsUp 工具，结合 Serverless Framework 的component 快速搭建一个个人相册网站，为你的存储空间减压。

ThumbsUp 是一款让使用者方便检索及管理图片的看图软件，不但具有可以快速的操作图片切换预览的使用介面，而且对于图片的简单影像处理也有相当直接、便捷的操作方式。

## 四步开发

1. [安装 Serverless Framework 以及 ThumbsUp 软件](#1-安装)
2. [创建应用](#2-创建)
3. [配置 yml 文件](#3-配置)
4. [部署网站至云服务](#4-部署)

## 最终效果

![thumbsup](https://img.serverlesscloud.cn/20191212/1576140001871-1234.png)

<video id="video" controls="" preload="none" poster="https://thumbsup-1253970226.cos.ap-chengdu.myqcloud.com/1234.png">
<source id="mp4" src="https://thumbsup-1253970226.cos.ap-chengdu.myqcloud.com/%E5%90%88%E5%B9%B6%E5%90%8E%E6%96%87%E4%BB%B6.mp4" type="video/mp4">
</video>

## 快速开始

结合 ThumbsUp 工具，通过 Serverless Website 组件，快速构建一个个人静态相册网站 <p/>

### 1. 安装

**安装前提：**

- [Node.js](https://nodejs.org/en/) (Node.js 版本需不低于 8.6，建议使用 Node.js 10.0 及以上版本)
- [Exiftool](https://exiftool.org/)
- [图形Magick](http://www.graphicsmagick.org/)

如您未安装上述应用程序，可以参考[安装说明](https://thumbsup.github.io/docs/2-installation/npm/)。

**安装 Serverless Framework**
```
$ npm install -g serverless
```

**安装 ThumbsUp**
```
$ npm install -g thumbsup
```

### 2. 创建

安装 ThumbsUp 后，即可创建应用。在本地新建 thumbsup 项目文件夹，将需要上传的照片放入文件夹里。为了区分，我在 thumbsup 项目文件里创建了photos\Scenery 文件夹，并放了两张风景照：
![Thumbsup](https://img.serverlesscloud.cn/20191212/1576140091940-thumbsup.png)

然后通过`thumbsup --input .\photos\ --output website`命令生成静态页面
```
thumbsup --input .\photos\ --output website
```

> 注：`input`  需指向放置照片的文件夹名。

### 3. 配置

在 thumbsup 项目目录下，创建 `serverless.yml` 文件，并在其中进行如下配置

```yaml
# serverless.yml

myWebsite:
  component: "@serverless/tencent-website"
  inputs:
    code:
      src: ./website
      index: index.html
      error: index.html
    region: ap-guangzhou
    bucketName: my-bucket-abc
```

### 4. 部署

通过 `sls` 命令进行部署，并可以添加 `--debug` 参数查看部署过程中的信息

如您的账号未[登陆](https://cloud.tencent.com/login)或[注册](https://cloud.tencent.com/register)腾讯云，您可以直接通过微信扫描命令行中的二维码进行授权登陆和注册。

```
serverless --debug

  DEBUG ─ Resolving the template's static variables.
  DEBUG ─ Collecting components from the template.
  DEBUG ─ Downloading any NPM components found in the template.
  DEBUG ─ Analyzing the template's components dependencies.
  DEBUG ─ Creating the template's components graph.
  DEBUG ─ Syncing template state.
  DEBUG ─ Executing the template's components graph.
  DEBUG ─ Starting Website Component.
  DEBUG ─ Preparing website Tencent COS bucket my-bucket-abc-1256386184.
  DEBUG ─ Deploying "my-bucket-abc-1256386184" bucket in the "ap-guangzhou" region.
  DEBUG ─ "my-bucket-abc-1256386184" bucket was successfully deployed to the "ap-guangzhou" region.
  DEBUG ─ Setting ACL for "my-bucket-abc-1256386184" bucket in the "ap-guangzhou" region.
  DEBUG ─ Ensuring no CORS are set for "my-bucket-abc-1256386184" bucket in the "ap-guangzhou" region.
  DEBUG ─ Ensuring no Tags are set for "my-bucket-abc-1256386184" bucket in the "ap-guangzhou" region.
  DEBUG ─ Configuring bucket my-bucket-abc-1256386184 for website hosting.
  DEBUG ─ Uploading website files from D:\sf\liujiang\use case\thumbsup\website to bucket my-bucket-abc-1256386184.
  DEBUG ─ Starting upload to bucket my-bucket-abc-1256386184 in region ap-guangzhou
  DEBUG ─ Uploading directory D:\sf\liujiang\use case\thumbsup\website to bucket my-bucket-abc-1256386184
  DEBUG ─ Website deployed successfully to URL: https://my-bucket-abc-1256386184.cos-website.ap-guangzhou.myqcloud.com.

  myWebsite:
    url: https://my-bucket-abc-1256386184.cos-website.ap-guangzhou.myqcloud.com
    env:

  4s » myWebsite » done
```

访问命令行输出的 website url，即可查看照片墙。
![thumbsup](https://img.serverlesscloud.cn/20191212/1576140001871-1234.png)

> 注：如果希望更新网站中的照片或者视频等文件，需要在本地重新运行 `thumbsup --input .\photos\ --output website` 进行生成静态页面，再运行 `serverless` 更新到页面。

### 5. 移除

可以通过以下命令移除 ThumbsUp 网站
```
$ sls remove --debug

  DEBUG ─ Flushing template state and removing all components.
  DEBUG ─ Starting Website Removal.
  DEBUG ─ Removing Website bucket.
  DEBUG ─ Removing files from the "my-bucket-abc-1256386184" bucket.
  DEBUG ─ Removing "my-bucket-abc-1256386184" bucket from the "ap-guangzhou" region.
  DEBUG ─ "my-bucket-abc-1256386184" bucket was successfully removed from the "ap-guangzhou" region.
  DEBUG ─ Finished Website Removal.

  3s » myWebsite » done

```

本文主要介绍了如果利用 ThumbsUp 和 Serverless Framework 快速部署一个个人照片墙，通过 Serverless Framework CLI，只需要编写一个 yml 文件就可以快速的将本地的 Web 应用部署到云端。本文仅演示了一个简单的 Demo，大家可以访问 [ThumbsUp](https://thumbsup.github.io/docs/1-introduction/concepts/)，尝试更多玩法。

Serverless Framework 提供了云上资源的能力，包含有云函数、API 网关、COS、DB 等资源的创建、部署和修改，结合云上产品，既可以提供快速的解决方案，也可以提供更优秀的产品能力。