---
title: Serverless Framework 发布微信扫码一键登录能力，业务上云只需3min
description: 为了简化账号配置环节，实现本地一键开发部署，Serverless Framework发布微信扫码一键登录能力，支持用户在Serverless Framework环境扫码注册登陆，用户无需登录控制台，可全程在本地完成应用的部署。
date: 2018-01-09
thumbnail: https://uploader.shimo.im/f/cZcLitvciisjf89J.jpg!thumbnail
categories:
  - user-stories
authors:
  - liujiang
---

为了简化账号配置环节，实现本地一键开发部署，Serverless Framework发布了微信扫码一键登录能力，支持用户在Serverless Framework环境扫码注册登陆，用户无需登录控制台，可全程在本地完成应用的部署。

# 快速入门：简单四步，部署你的 Hello Word

## Step1:安装环境

安装前提：
- Node.js (Node.js 版本需不低于 8.6，，建议使用 Node.js 10.0 及以上版本)，具体可参考 [Node.js 安装指南](https://nodejs.org/zh-cn/download/)
- Serverless Framework CLI（1.57.0或以上的版本），
在命令行中运行如下命令即可安装Serverless Framework CLI

```
$ npm install -g serverless
```

## Step2：创建服务

- 使用 Serverless Framework 的 tencent-nodejs 模板创建一个新的服务。通过运行如下命令进行创建，--path 可以指定服务的路径：

```
# 创建一个serverless服务
$ serverless create --template tencent-nodejs --path my-service
```

- 安装依赖。进入服务所在路径，运行如下命令安装依赖：

```
$ cd my-service
$ npm install
```

## Step3：配置触发器

云函数需要通过触发器的事件调用进行触发，因此可以在 serverless.yml 中增加对触发器的配置，以 API 网关触发器为例，配置如下：

```
service: my-service # service name

provider: # provider information
  name: tencent
  runtime: Nodejs8.9
  credentials: ~/credentials  #如不使用二维码一键登录，密钥字段需要和 credentials 文件路径一致

plugins:
  - serverless-tencent-scf

functions:
  hello_world:   # 函数名称
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


```
serverless deploy
```

注：如果希望查看部署详情，可以通过调试模式的命令 serverless --debug 进行部署。

**==如账号未登陆或注册腾讯云，可在运行该命令后，直接通过微信扫描命令行中的二维码，点击【去微信授权】，授权登录和注册。==**

![image](https://uploader.shimo.im/f/DKH9FGQVgZIv9noa.png!thumbnail)

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

大家也可以访问[Serverless](https://github.com/serverless/components) ，部署更多好玩、实用的服务与应用。
