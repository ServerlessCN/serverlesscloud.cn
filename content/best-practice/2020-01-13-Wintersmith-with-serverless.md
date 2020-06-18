---
title: 使用 Wintersmith + Serverless Framework 快速创建个人站点
description: 通过 Serverless Website 组件快速构建一个 Serverless Wintersmith 个人站点。
keywords: Wintersmith,Wintersmith 站点,Serverless Framework 快速创建个人站点
date: 2020-01-13
thumbnail: https://img.serverlesscloud.cn/2020113/1578918119146-WINTERS.png
categories:
  - best-practice
authors:
  - Tabor
authorslink:
  - https://canmeng.net
tags:
  - Serverless
  - Wintersmith
---
首先我们来介绍下，Wintersmith 是一个简单而灵活的静态站点生成器。采用 markdown 构建，这个是我们的基础条件。

- [Serverless Framework](https://github.com/serverless/serverless/blob/master/README_CN.md)：在 GitHub 上有三万颗星，业界非常受欢迎的无服务器应用框架，开发者无需关心底层资源即可部署完整可用的 Serverless 应用架构。

确保系统包含以下环境：

- Node.js (Node.js 版本需不低于 8.6，建议使用 10.0 及以上版本)

这边有详细的视频演示大家也可以直接观看：

<video id="video" controls="" preload="none" poster="https://img.serverlesscloud.cn/2020113/1578918119146-WINTERS.png">
<source id="mp4" src="https://serverlessimg-1253970226.cos.ap-chengdu.myqcloud.com/video/win.mp4">
</video>

## 1. 安装 Serverless Framework

```js
$ npm install -g serverless
```

## 2. 安装 wintersmith

```js
$ npm i wintersmith -g
```

## 3. 新建 wintersmith 项目

可对指定路径进行安装

```js
$ wintersmith new <path>
```

初始化成功后，可以看到路径下创建的项目文件

## 4. 本地预览

运行以下命令，并通过浏览器访问 http://localhost:8080 即可方便地预览效果，而且提供 LiveReload 功能，可以实时预览。

```js
$ wintersmith preview
```

使用如下命令构建网站：

```js
$ wintersmith build
```

## 5. 配置 yml 文件

在项目目录下，创建 serverless.yml 文件：

```js
$ touch serverless.yml
```

将以下内容写入上述的 yml 文件里：

```js
# serverless.yml

myWebsite:
 component: '@serverless/tencent-website'
 inputs:
 code:
 src: ./build
 index: index.html
 error: index.html
 region: ap-guangzhou
 bucketName: my-bucket
```

配置完成后，文件目录如下：

```js
.
├── build
| ├── index.html
| └── README.md
└── serverless.yml
```

## 6. 部署

通过 `sls` 命令进行部署，这里还可以添加 `–debug` 参数来查看部署过程中的信息：

```js
$ sls --debug
```

如您的账号未[登陆](https://cloud.tencent.com/login)或[注册](https://cloud.tencent.com/register)腾讯云，您可以直接通过微信扫描命令行中的二维码进行授权登陆和注册，从而进行授权登陆和注册。这也是我觉得特别方便的一个地方！

部署过程中，terminal 显示信息示意：

访问命令行输出的 url，即可查看使用 Serverless Framework 部署的网站啦~

## 7. 小结

本文使用了腾讯云的无服务器框架 [Serverless Framework](https://cloud.tencent.com/product/sf) 来搭建  Wintersmith 博客系统。

虽然这只是一个非常简单的示例，但是不难看出，Serverless Framework 在快速部署方面的强大能力。比如集成了微信扫描二维码，就直接让我们避开了繁琐的云服务的账号注册、配置的环节。而你需要做的，只是根据 Wintersmith 自身的能力，进行网站的定制。



---
<div id='scf-deploy-iframe-or-md'></div>

---

> **传送门：**
> - GitHub: [github.com/serverless](https://github.com/serverless/serverless/blob/master/README_CN.md)
> - 官网：[serverless.com](https://serverless.com/)

欢迎访问：[Serverless 中文网](https://serverlesscloud.cn/)，您可以在 [最佳实践](https://serverlesscloud.cn/best-practice) 里体验更多关于 Serverless 应用的开发！
