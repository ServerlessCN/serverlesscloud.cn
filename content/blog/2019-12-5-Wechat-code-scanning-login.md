---
title: 极简配置，业务上云只需 3min
description: Serverless Framework 最新发布微信扫码一键登录能力，支持用户在本地环境扫码注册登陆。
keywords: Serverless 微信扫码一键登录,Serverless 本地环境扫码
date: 2019-12-04
thumbnail: https://hello-world-1253970226.cos.ap-chengdu.myqcloud.com/wechat.png
categories:
  - news
authors:
  - liujiang
tags:
  - serverless
---

为了简化账号配置环节，实现本地一键开发部署，Serverless Framework 发布了微信扫码一键登录能力，支持用户在 Serverless Framework 环境扫码注册登陆，用户无需登录控制台，可全程在本地完成应用的部署。

![wechat](https://hello-world-1253970226.cos.ap-chengdu.myqcloud.com/dwft1-fesk0.gif)

# 快速入门：简单四步，部署你的 Hello Word

## Step1：安装环境

安装前提：

- Node.js（Node.js 版本需不低于 8.6，，建议使用 Node.js 10.0 及以上版本），具体可参考 [Node.js 安装指南](https://nodejs.org/zh-cn/download/)
- serverless Framework CLI（1.57.0 或以上的版本），
  在命令行中运行如下命令即可安装 Serverless Framework CLI

```
$ npm install -g serverless
```

## Step2：创建服务

- 使用 Serverless Framework 的 tencent-nodejs 模板创建一个新的服务。通过运行如下命令进行创建，--path 可以指定服务的路径：

```
# 创建一个 serverless 服务
$ serverless create --template tencent-nodejs --path my-service
```

- 安装依赖。进入服务所在路径，运行如下命令安装依赖：

```
$ cd my-service
$ npm install
```

## Step3：配置触发器

云函数需要通过触发器的事件调用进行触发，因此可以在 serverless.yml 中增加对触发器的配置，以 API 网关触发器为例，配置如下：

```yaml
service: my-service # service name

provider: # provider information
  name: tencent
  runtime: Nodejs8.9
  credentials: ~/credentials # 如不使用二维码一键登录，密钥字段需要和 credentials 文件路径一致

plugins:
  - serverless-tencent-scf

functions:
  hello_world: # 函数名称
    handler: index.main_handler
    runtime: Nodejs8.9
    events:
      - apigw:
          name: hello_world_apigw
          parameters:
            stageName: release
            serviceId:
            httpMethod: ANY
```

## Step4：部署服务

通过该命令部署或更新您创建的函数和触发器，资源配置会和 serverless.yml 中保持一致。

```bash
serverless deploy
```

> 注：如果希望查看部署详情，可以通过调试模式的命令 serverless --debug 进行部署。

**如账号未登陆或注册腾讯云，可在运行该命令后，直接通过微信扫描命令行中的二维码，点击「去微信授权」，授权登录和注册。**

![wechat](https://hello-world-1253970226.cos.ap-chengdu.myqcloud.com/de8j1-pz66k.gif)

部署成功后，可以直接在浏览器访问日志中返回的 url 地址，查看部署的 Hello World 效果：

```
Serverless: Service Information
service: my-service
stage: dev
region: ap-guangzhou
stack: my-service-dev
resources: 2
functions:   hello_world: my-service-dev-hello_world
    ANY - https://service-c6pxs4ku-1256386184.gz.apigw.tencentcs.com/release/my-service-dev-hello_world
```

> **传送门：**
> - GitHub: [github.com/serverless](https://github.com/serverless/serverless/blob/master/README_CN.md) 
> - 官网：[serverless.com](https://serverless.com/)

欢迎访问：[Serverless 中文网](https://serverlesscloud.cn/)，您可以在 [最佳实践](https://serverlesscloud.cn/best-practice) 里体验更多关于 Serverless 应用的开发！
