---
title: 腾讯云 Severless-Express 项目开发和灰度发布最佳实践
description: 本文教你快速了解 Severless-Express 项目开发和灰度发布，全是干货！
keywords: Serverless, Serverless Framework
date: 2020-08-12
thumbnail: https://img.serverlesscloud.cn/2020812/1597230581474-002.jpg
categories: 
  - best-practice
authors: 
  - 粟俊娥
authorslink: 
  - https://github.com/June1991
tags:
  - Serverless
  - Express
---

## Serverless 应用基本概念

一个 Serverless 应用是由单个或者多个组件实例构成的。每个组件中都会有一个 `serverless.yml` 文件，该文件定义了组件的一些参数，这些参数在部署时用于生成实例的信息。例如 region 参数，定义了资源的所在区。

组织是在 Serverless 应用上层的概念，主要是为了管理。例如，一个公司会有不同部门进行 Serverless 应用开发，设置不同组织名称，方便做后期的权限管理。

示例：开发一个 express 应用，最基本的是引入 express 组件，业务中间可能会涉及到其他一些云产品（如对象存储 COS），所以整个应用目录如下：

![](https://main.qcloudimg.com/raw/a8f05b681228498b2d41981cd7e5d4fb.svg)

## Serverless.yml 文件

serverless.yml 文件中定义了应用组织描述及组件 inputs 参数，每次部署时会根据 serverless.yml 文件中的配置信息进行资源的创建、更新和编排。

一份简单的 serverless.yml 文件如下：

```
# serverless.yml

org: xxx-department #  用于记录组织信息,默认为您的腾讯云 APPID
app: expressDemoApp #  应用名称，默认为与组件实例名称
stage: ${env:STAGE} #  用于开发环境的隔离，默认为 dev


component: express # (必填) 引用 component 的名称，当前用到的是 express-tencent 组件
name: expressDemo # (必填) 组件创建的实例名称


inputs:
  src:
    src: ./ 
    exclude:
      - .env
  region: ap-guangzhou 
  runtime: Nodejs10.15
  functionName: ${name}-${stage}-${app}-${org} #云函数名称
  apigatewayConf:
    protocols:
      - http
      - https
    environment: release
```

yml 文件中的配置信息：

![](https://img.serverlesscloud.cn/2020812/1597229144629-%E6%88%AA%E5%B1%8F2020-08-12%20%E4%B8%8B%E5%8D%886.45.19.png)


## 操作场景

本文以 Tencent-Express 组件部署一个 Express 网站为例，模拟 Serverless Framework 开发项目、管理项目和部署发布上线全流程。[>> 示例链接](https://github.com/June1991/serverless-express)

## 流程说明

一个项目的开发上线流程大致如下：

![](https://main.qcloudimg.com/raw/af7fe3252a3607f929ad0c6e1736b6dc.svg)

1. 初始化项目：将项目进行初始化。例如选择一些开发框架和模板完成基本的搭建工作。
2. 开发阶段：对产品功能进行研发。可能涉及到多个开发者协作，开发者拉取不同的 feature 分支，开发并测试自己负责的功能模块；最后合并到 dev 分支，联调各个功能模块。
3. 测试阶段：测试人员对产品功能进行测试。
4. 发布上线：对于已完成测试的产品功能发布上线。由于新上线的版本可能有不稳定的风险，所以一般会进行灰度发布，通过配置一些规则监控新版本的稳定性，等到版本稳定后，流量全部切换到新版本。

开发项目过程可能会涉及以下分支：

![](https://img.serverlesscloud.cn/2020812/1597229259283-%E6%88%AA%E5%B1%8F2020-08-12%20%E4%B8%8B%E5%8D%886.47.25.png)


## 操作步骤

### 初始化项目

1. 参考 [部署 Express.js 应用](https://cloud.tencent.com/document/product/1154/43224) 文档，创建一个 `express 项目`，修改 yml 文件为以下内容：

```
#serverless.yml
org: xxx-department #  用于记录组织信息,默认为您的腾讯云appid
app: expressDemoApp #  应用名称，默认为与组件实例名称
stage: ${env:STAGE} #  用于开发环境的隔离，默认为dev


component: express # (必填) 引用 component 的名称，当前用到的是 express-tencent 组件
name: expressDemo # (必填) 组件创建的实例名称

inputs:
  src:
    src: ./ 
    exclude:
      - .env
  region: ap-guangzhou
  runtime: Nodejs10.15
  funcitonName: ${name}-${stage}-${app}-${org} #云函数名称
  apigatewayConf:
    protocols:
      - http
      - https
    environment: release
```

2. 在项目根目录下的 `.env 文件`中配置：

```
TENCENT_SECRET_ID=xxxxxxxxxx #您账号的 SecretId
TENCENT_SECRET_KEY=xxxxxxxx #您账号的 SecretKey
STAGE=prod #STAGE为prod环境，也可以sls deploy --stage=prod 参数传递的方式设置
```

3. 执行 `sls deploy` 部署成功后，访问生成的 url 链接，效果如下：

![](https://main.qcloudimg.com/raw/ed180d13d3010d49ec102567c235d461.svg)

4. 创建远程仓库（[示例链接](https://github.com/June1991/serverless-express)），将项目代码提交到远程 master 分支。同时创建 testing、dev。此时三个分支的代码在同一个版本上（假设为版本0）。
![](https://main.qcloudimg.com/raw/f8ae1d7e0ca59d1b0c49d6878ba4f37d.svg)

### 开发与测试

**背景**

现在需要开发某个功能模块。假设需要有两位开发者：Tom、Jorge。两位开发者分别从 dev（版本 0）上创建特性分支为 feature1、feature2 进行研发。

![](https://main.qcloudimg.com/raw/8716ab86706ce857897d81d2538e9253.svg)

Tom 开始开发 feature1。在本示例中，为新增一个 feature.html，里面写文案「This is a new feature 1.」

**开发**

1. 在 sls.js 文件中新增路由器配置：

```
// Routes
app.get(`/feature`, (req, res) => {
 res.sendFile(path.join(__dirname, 'feature.html'))
})
```

2. 新增 feature.html：

```
<!DOCTYPE html>
<html lang="en">
 <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Serverless Component - Express.js</title>
 </head>
 <body>
  <h1>
   This is a new feature 1.
  </h1>
 </body>
</html>
```

3. 在 `.env` 文件中设置自己的 stage，以便在开发过程中得到独立的运行和调试环境。例如 Tom 在 serverless.yml 的项目目录下配置 .env 如下：

```
TENCENT_SECRET_ID=xxxxxxxxxx
TENCENT_SECRET_KEY=xxxxxxxx
STAGE=feature1
```

4. 执行 `sls deploy` 部署成功后，返回显示如下：

```
region: ap-guangzhou
apigw:
  serviceId:   service-xxxxxx
  subDomain:   service-xxxxxx-123456789.gz.apigw.tencentcs.com
  environment: release
  url:         https://service-xxxxxx-123456789.gz.apigw.tencentcs.com/release/
scf:
  functionName: express-demo-feature1
  runtime:      Nodejs10.15
  namespace:    default
  lastVersion:  $LATEST
  traffic:      1

Full details: https://serverless.cloud.tencent.com/instances/expressDemoApp%3Afeature1%3AexpressDemo

10s » expressDemo » Success
```

5. 访问生成的 url (https://service-xxxxxx-123456789.gz.apigw.tencentcs.com/release/feature)，效果如下：

![](https://main.qcloudimg.com/raw/ca56e34cbc2f1216871e03bd79d250c9.svg)

至此，Tom 开发功能完成并自测通过。

假设同时，Jorge 同时也完成自己的特性开发，并自测通过。在本示例中，为新增一个 feature.html，里面写文案「This is a new feature 2.」。

**联调**

1. 两人把各自 feature 分支的代码合并到 dev 分支。（可能会存在冲突需要人为解决）
![](https://main.qcloudimg.com/raw/fc9297f775bda0eb0bbc7db2b3305285.svg)

2. 在 dev 进行联调。联调环境中的 `.env` 配置如下

```
TENCENT_SECRET_ID=xxxxxxxxxx
TENCENT_SECRET_KEY=xxxxxxxx
STAGE=dev
```

3. 执行 sls deploy 联调部署后，访问 url (ttps://service-xxxxxx-123456789.gz.apigw.tencentcs.com/release/feature)，效果如下。至此联调完成，整个功能已经开发完毕。

![](https://main.qcloudimg.com/raw/c6a28dff690869c62e0a767944150a87.svg)

**测试**

1. 把联调通过的 dev 分支合并到 testing 代码，进入测试。

![](https://main.qcloudimg.com/raw/09d23fc99205b8ac078da6cbf4d7f700.svg)

2. 测试环境中的 .env 配置如下：

```
TENCENT_SECRET_ID=xxxxxxxxxx
TENCENT_SECRET_KEY=xxxxxxxx
STAGE=testing
```

3. 执行 sls deploy 部署成功后，测试人员开始进行相关测试，直至功能稳定通过。

**发布上线**

测试通过后，将测试代码合并到 master 分支，准备发布上线。

![](https://main.qcloudimg.com/raw/dcfb979dd18f198b2764d77d0cb7b517.svg)


设置生产环境中的 `.env` 为：

```
TENCENT_SECRET_ID=xxxxxxxxxx
TENCENT_SECRET_KEY=xxxxxxxx
STAGE=prod
```

执行部署命令：

```
sls deploy 
```

至此，我们完成了一 个`severless-express` 项目的开发和上线发布。

## 灰度发布

### 操作场景

在业务进行版本更新及切换时，为了保证线上业务稳定，建议采取灰度发布的方式。本文以已部署的 express 项目为例，为您介绍灰度发布的操作步骤。

前提条件：已完成 [开发项目](https://cloud.tencent.com/document/product/1154/47288)。

### 操作步骤

1. 设置生产环境中的 `.env`：

```plaintext
TENCENT_SECRET_ID=xxxxxxxxxx
TENCENT_SECRET_KEY=xxxxxxxx
STAGE=prod
```
2. 部署到线上环境 `$latest`，并切换 10% 的流量在 `$latest` 版本（90% 的流量在最后一次发布的云函数版本 N 上）：

```plaintext
sls deploy --inputs.traffic=0.1 
```

3. 对 `$latest` 版本进行监控与观察，等版本稳定之后把流量100%切到该版本上：

```plaintext
sls deploy --inputs.traffic=1.0
```

4. 流量全部切换成功后，对于一个稳定版本，我们需要对它进行标记，以免后续发布新功能时，如果遇到线上问题，方便快速回退版本。部署并发布函数版本 N+1，切换所有流量到版本 N+1：

```plaintext
sls deploy --inputs.publish --inputs.traffic=0 
```

---

---
<div id='scf-deploy-iframe-or-md'></div>

---

> **传送门：**
> - GitHub: [github.com/serverless](https://github.com/serverless/serverless/blob/master/README_CN.md)
> - 官网：[serverless.com](https://serverless.com/)

欢迎访问：[Serverless 中文网](https://serverlesscloud.cn/)，您可以在 [最佳实践](https://serverlesscloud.cn/best-practice) 里体验更多关于 Serverless 应用的开发！


















