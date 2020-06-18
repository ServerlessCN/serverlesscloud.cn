---
title: 在云函数 SCF 里为 Next.js 跑 SSR
description: 很多时候我们都希望首屏速度快，SEO 友好，那么相比于客户端渲染，SSR 渲染将是这方面的优势。
keywords: Serverless,Serverless SSR,Serverless应用
date: 2020-04-13
thumbnail: https://img.serverlesscloud.cn/2020523/1590205117399-16201.jpg
categories:
  - user-stories
authors:
  - XaDon
authorslink:
  - https://cloud.tencent.com/developer/article/1612986
tags:
  - 云函数
  - Serverless SSR
---

很多时候我们都希望首屏速度快，SEO 友好，那么相比于客户端渲染，SSR 渲染将是这方面的优势。Next.js、Nuxt.js 都是 SSR 框架。本篇文章将介绍 Next.js。

通常我们在部署 SSR 的时候，会担心运维等问题，但如果我们把它部署在云开发上就可以不必担心~

试试看看喽~

## 环境准备

1. 安装[node.js](http://nodejs.cn/download/)
2. 安装云开发工具 @cloudbase/cli

```
npm i @cloudbase/cli
```

## 搭建云环境

1. 首先在打开[云开发](https://console.cloud.tencent.com/tcb/env/index)并新建环境
2. 创建完成后会自动进入环境初始化阶段，这个阶段大概持续 2~3 分钟。

## 初始化项目

当环境初始化完成后我们就可以进行初始化项目啦~

1. 使用 CLI 工具初始化一个云开发项目 `$ tcb init`

```javascript
tcb init
? 选择关联环境 xxx - [xxx-xxx]
? 请输入项目名称 nextSSR
? 选择模板语言 Node
? 选择云开发模板 Hello World
✔ 创建项目 cloudbase-next 成功！
```

初始化结束后的项目目录如下：

```javascript
nextSSR
└─.
    │  .editorconfig
    │  .gitignorev1
    │  a.txt
    │  cloudbaserc.js
    │  README.md
    │
    └─functions
        └─app
                index.js
```

然后我们进入到项目中

```
$ cd nextSSR
```

在 functions 文件夹下创建 next.js 应用：`$ npm init next-app functions/next`

等待初始化 next.js 项目...

初始化完成后在 functions 文件夹下会多出一个 next 的文件夹，这个便是我们的 next 应用

## 配置 next

1. 首先我们进入到 next 项目的根目录 `$ cd functions/next`
2. 然后安装 severless-http `$ npm install --save serverless-http`
3. 在 next 应用的根目录下 `项目根目录/functions/next应用根目录` 新建 `index.js`，并将下列代码添加进去

```javascript
    // index.js
    const next = require('next')
    const serverless = require('serverless-http')

    const app = next({ dev: false })
    const handle = app.getRequestHandler()

    exports.main = async function(...args) {
        await app.prepare()
        return serverless((req, res) => {
            handle(req, res)
        })(...args)
    }// next.config.js
    module.exports = {
        assetPrefix: '/next'
    }
```

在 next 应用的根目录 (/function/next/**next.config.js**) 中新建 `next.config.js` 并将下列代码拷入

```javascript
// next.config.js
module.exports = {
    assetPrefix: '/next'
}
```

这样我们的项目就配置差不多了。

## 项目的构建与发布

- 首先我们进入到 `functions/next` 目录中

执行 `$ npm run build`

- 然后回到项目根目录中，运行 cli 命令将代码上传到云函数

```
$ tcb functions:deploy next
```

- 然后我们创建一个 http 服务

```
$ cloudbase service:create -f next -p /next
```

> -f 表示 HTTP Service 路径绑定的云函数名称 \ -p 表示 Service Path，必须以 `/` 开头

```javascript
$ cloudbase service:create -f next -p /next
✔ 云函数 HTTP service 创建成功！
```

## 我们上传到了哪里了呢？

我们进入到[云开发管理](https://console.cloud.tencent.com/tcb/scf/index)页面

![serverless](https://img.serverlesscloud.cn/2020523/1590205118371-16201.jpg)

我们看到在云函数的函数代码中可以找到我们刚才上传的文件

我们点击预览即可浏览页面啦~

在函数配置可以通过触发云函数来进行浏览我们的页面

![serverless](https://img.serverlesscloud.cn/2020523/1590205117137-16201.jpg)

![serverless](https://img.serverlesscloud.cn/2020523/1590205117399-16201.jpg)

## 对比

我们通过对比查看

- 通过 SSR 渲染的页面加载速度

![serverless](https://img.serverlesscloud.cn/2020523/1590205117618-16201.jpg)

- 非 SSR 的加载速度

![serverless](https://img.serverlesscloud.cn/2020523/1590205118406-16201.jpg)

可以看到有明显的速度提升啦~



---
<div id='scf-deploy-iframe-or-md'></div>

---

> **传送门：**
> - GitHub: [github.com/serverless](https://github.com/serverless/serverless/blob/master/README_CN.md)
> - 官网：[serverless.com](https://serverless.com/)

欢迎访问：[Serverless 中文网](https://serverlesscloud.cn/)，您可以在 [最佳实践](https://serverlesscloud.cn/best-practice) 里体验更多关于 Serverless 应用的开发！
