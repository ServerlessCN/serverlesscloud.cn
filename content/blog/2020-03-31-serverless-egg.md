---
title: Serverless + Egg.js + 对象存储 COS 构建图片上传应用
description: 试试用 Serverless 部署一个静态网站！
keywords: Serverless,Serverless egg,Serverless COS
date: 2020-03-31
thumbnail: https://img.serverlesscloud.cn/2020522/1590166461286-%E4%BC%81%E4%B8%9A%E5%BE%AE%E4%BF%A1%E6%88%AA%E5%9B%BE_15901664556770.png
categories:
  - user-stories
authors:
  - i蜻蜓
authorslink:
  - https://cloud.tencent.com/developer/user/2772490/articles
tags:
  - Serverless
  - Egg.js
---


## **从「建站」开始**

以前，当朋友知道我的职业是一名前端工程师的时候，他们总喜欢问一个问题：那你能帮我修一下电脑，不，建一个网站吗？

他们当然不知道「建站」除了编写基础的业务代码外，还包括「服务器购买和 LAMP 等相关环境搭建」「负载均衡」「容器部署」「CDN」「监控」「网络」「容灾备份」「图片视频媒体处理」… 等一堆眼花缭乱的东西，没有一个合理的预算以及整体的技术架构能力，很难把这些事情通通处理好。虽然现在常用到的「Docker」「k8s」等已经极大的帮助我们对基础设施的管理，但 Serverless 架构的出现才似乎真正的将业务开发者从这些繁琐的事情中抽离出来。

0202 年了，建站是否还是一件麻烦的事情？

## **试试用 Serverless 部署一个静态网站**

安装 Serverless cli 和创建一个简单的 html 项目。

```javascript
# 安装 serverless cli
$ npm install -g serverless
# 创建 website 目录并进入
$ mkdir website && cd website
# 创建 serverlss 的配置文件
$ touch serverless.yml
# 将静态网站资源放置到 public 文件夹下面
$ mkdir public && echo 'hello serverless' >> public/index.html
```

配置 Serverless：这里使用了 `tencent-website` Serverless 组件，指定 public 文件夹做为输入目录。

```javascript
# serverless.yml
myWebsite:
  component: '@serverless/tencent-website'
  inputs:
    code:
      src: ./public
      index: index.html
      error: index.html
    region: ap-guangzhou
    bucketName: hello-serverless
```

部署

至此，一个很基础的 serverless 静态网站配置已经完成，在项目根目录下命令行执行  `serverless`（也可以用 `sls` 缩写），在部署的过程中扫描命令行中输出的二维码登录到腾讯云，等待片刻即可完成部署。

访问一下命令行中输出的 http 地址。

![serverless]( https://img.serverlesscloud.cn/2020522/1590165837157-%E4%BC%81%E4%B8%9A%E5%BE%AE%E4%BF%A1%E6%88%AA%E5%9B%BE_1590165826102.png )

搞定！一个静态网站就这样便完成了全部的部署（当然你还可以自定义域名、配置 CDN 等，但现在先不考虑这些）

至此，你可能会说这看起来仅仅是把刚才的 `index.html` 上传到了腾讯云，甚至还有可能觉得索然无味？

当然不是，Serverless 架构除了部署，还帮我们搞定了在开篇提到的那一大堆的基础服务设施。也不用担心流量突增要如何扩容，因为它是自动伸缩的，并且根据使用情况付费！这显然可以节约很多的常规服务费用。而做为一线开发者，只需要考虑具体业务如何开发，这极大地提升了开发效率。

现在回过头来回答一下「建站」的问题，好像又不是那么困难了呢。

那么，Serverless 是一个什么东西？让我先从官网抄一份作业：

## **Serverless 简介**

> Serverless 是开发者和企业用户共同推动的，它可以使开发者在构建和运行应用时无需管理服务器等基础设施，将构建应用的成本进一步降低，函数是部署和运行的基本单位。用户只为实际使用的资源付费。这些代码完全由事件触发（event-trigger），平台根据请求自动平行调整服务资源，拥有近乎无限的扩容能力，空闲时则没有任何资源在运行。代码运行无状态，可以更加简单的实现快速迭代、极速部署。Serverless的最终目标，是希望开发者可以将开发重点关注到更有价值的业务代码（而不是浪费时间在其他事情上）。简单的Linux发行版无法为开发者带来更具价值的场景，Kubernetes集群也无法达到轻量化的目标。

一句话：Serverless 可以使开发者只关注自己的代码，而无需重复构建服务器和环境等基础设施。

现在，回到文章标题，我这里会使用 Serverless + Egg.js + 腾讯云 COS 创建一个图片上传服务示例

## **图片上传服务实践**

首先准备一下资源用来放置图片：在[腾讯云对象存储控制台](https://console.cloud.tencent.com/cos5/bucket)新建一个用来上传图片的云对象存储 COS(Cloud Object Storage) 桶

创建完存储桶以后接着开始在本地新建一个 Egg.js 应用

```javascript
$ mkdir egg-example && cd egg-example
$ npm init egg --type=simple
$ npm i
$ npm run dev
```

此时打开 `http://127.0.0.1:7001/` 就可以看到 Egg.js 已经在正常工作了。在 `public` 目录下新建一个 html 文件，用来做上传操作

```javascript
$ touch public/index.html
```

```javascript
<!-- index.html -->
<input type="file" id="input">
<script>
  const handleInputChange = async(e) => {
    const formdata = new FormData()
    formdata.append('image', e.target.files[0])
    const result = await fetch('/upload', {
      method: 'post',
      withCredentials: true,
      body: formdata,
    })
    console.log(result)
  }
  document.querySelector('#input').addEventListener('change', handleInputChange)
</script>
```

接着写后端上传代码，在 `controller/home.js` 中新增一个 `putObject` 的方法

```javascript
import * as cos from './cos'
import path from 'path'

async putObject() {
  const { ctx } = this
  const file = ctx.request.files[0]
  const name = 'egg-multipart-test/' + path.basename(file.filename)
  ctx.body = await cos.putObject(name, file.filepath)
}
```

其中在 `cos.js` 执行了最终的上传逻辑。这里使用了[腾讯云 COS Nodejs SDK](https://github.com/tencentyun/cos-nodejs-sdk-v5/)，`SecretId` 和 `SecretKey` 在 [API 密钥管理](https://console.cloud.tencent.com/cam/capi)中可以查看到，`Bucket` 即为刚才创建的存储桶名称。

```javascript
import COS from 'cos-nodejs-sdk-v5'
import fs from 'fs'
import { sha1 } from 'crypto-hash'
import path from 'path'

const cos = new COS({
  SecretId: 'AKIDjJfbxxxxx',
  SecretKey: 'B1crvhExxxxx',
})

export const putObject = async function(filename, filepath) {
  const fileBody = await fs.readFile(filepath)
  const hash = await sha1(fileBody)
  const fileName = hash + path.extname(filename).toLowerCase()
  return new Promise(resolve => {
    cos.putObject({
      Bucket: 'qingting-1257197216',
      Region: 'ap-guangzhou',
      Key: fileName,
      StorageClass: 'STANDARD',
      Body: fileBody,
    }, function(err, data) {
      resolve(data)
    })
  })
}
```

本地测试一下，已成功将图片上传至 COS 桶中

![serverless]( https://img.serverlesscloud.cn/2020522/1590165837168-%E4%BC%81%E4%B8%9A%E5%BE%AE%E4%BF%A1%E6%88%AA%E5%9B%BE_1590165826102.png )



接下来开始将服务部署至腾讯云，新建 `serverless.yaml` 文件，使用 `tencent-egg` 组件，并将整个项目部署至 nodejs 服务环境中

```javascript
# serverless.yml

MyComponent:
  component: '@serverless/tencent-egg'
  inputs:
    region: ap-guangzhou
    functionName: egg-function
    code: ./
    functionConf:
      timeout: 10
      memorySize: 128
      environment:
        variables:
          TEST: vale
      vpcConfig:
        subnetId: ''
        vpcId: ''
    apigatewayConf:
      protocols:
        - https
      environment: release
```

部署成功以后打开输出 url，整个项目便可以 work 了

试着上传一张图片（it’s worked! 如果你像我一样爱好摄影，可以基于此做一个摄影相册了）

本文内容到这里已结束，感谢阅读。最后罗列几个自己在腾讯云使用 Serverless 中遇到的问题：

## **问题**

1. 静态网站发布后，默认输出是 http 地址，如果你试图访问 https 地址你将会看到地址会从 https 301 到 http…，虽然去 COS 桶中开启强制 https 选项修复掉。但这还是一个很不「技术」的 bug。
2. 在部署 Egg.js 应用前，serverless cli 会将整个项目打包成一个 zip 然后上传（是的，node\_modules 也被打包），这就导致 serverless cli 很容易会处于「卡死」状态，可以在部署前执行 `npm i --production` 来 hack 这个问题，但依然是一种很不好的体验。相信腾讯云团队后面会改成忽略 node\_modules 并在上传后执行 install npm 包的方式。



---
<div id='scf-deploy-iframe-or-md'></div>

---

> **传送门：**
> - GitHub: [github.com/serverless](https://github.com/serverless/serverless/blob/master/README_CN.md)
> - 官网：[serverless.com](https://serverless.com/)

欢迎访问：[Serverless 中文网](https://serverlesscloud.cn/)，您可以在 [最佳实践](https://serverlesscloud.cn/best-practice) 里体验更多关于 Serverless 应用的开发！
