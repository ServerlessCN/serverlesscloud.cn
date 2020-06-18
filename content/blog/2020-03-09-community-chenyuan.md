---
title: 实验室站迁移 Serverless 之路（上）
description: 本文为 Serverless 社区成员撰稿。作者高晨远，研发工程师，熟悉 Python 开发，常写 Web 和爬虫
keywords: Serverless Flask 框架,Serverless 框架,Serverless 迁移方案
date: 2020-03-09
thumbnail: https://img.serverlesscloud.cn/2020318/1584510373593-lab.jpg
categories:
  - user-stories
authors:
  - 高晨远
authorslink:
  - https://zhuanlan.zhihu.com/ServerlessGo
tags:
  - Serverless
  - Python
---


## 前言

2 月份，TencentServerless 举办了系列在线课堂分享，讲解了 Serverless 概念、架构、最佳实践以及如何开发一个 component 等技术知识。

因为对 Serverless 非常感兴趣，每次都参加了直播学习并提交了课堂作业，一路下来感觉还不错，因此决定把自己的[实验室站](https://lab.yuangezhizao.cn/)迁移到 Serverless 试试看。

## 1. TencentServerless 介绍

不得不感叹互联网时代科技的进步，之前我的实验室站采用的是传统方法发布网站的环境部署，虽然现在熟悉了操作并不觉得很麻烦，但是对于从来没接触过这块的人来说就比较难懂了。

而现在有了 Serverless，就可以完全无视上面的操作步骤了，这里引用官网的两段话：

> Serverless Framework 可以帮您以更少的成本和开销, 快速构建 Serverless 应用。它能够完美支持无服务器应用的开发，部署，测试，监控等环节。Serverless 是面向未来的运维方式。
>
> Serverless 建立在下一代公共云服务之上，该服务仅在使用时自动扩容和收费。当规模，所用容量和成本管理实现自动化时，可节省 99% 的成本管理。
>
> 无服务器架构是全新的，因此我们需要改变先前对老架构和工作流的看法。Serverless Framework 的目标是以一种简单，强大而优雅的使用体验为开发者、团队提供开发和运行 serverless 应用程序所需的所有工具。

这种方式非常方便，本人现在倒是觉得对于个人开发者来说，如果想构建轻量应用的话，用 Serverless 应该会节省非常多的时间。当然 Serverless 对比传统型应用还是有区别的，目前它并不能完美支持，举一个例子：Flask CLI 就不支持，不过相信随着 Serverless 技术的发展，Serverless 的支持将更加全面。

对于企业开发者来说也是同理的，想快速上线一套网站的话，部署在一个服务器上倒是好说，可是当访问量上升之后，需要扩容的时候就比较麻烦了，这时候你得在多个服务器上部署并且配置负载均衡等等。

对我个人来说，我觉得 Serverless 最大的优点在于运维部署方面，通过 Serverless 部署，还是非常方便的。

## 2. 安装 Serverless Framework

Serverless Framework 是基于 Node.js 的开源 CLI，注：需 Node 8+ 全局安装：

```
npm install serverless -g
```

这里没有使用 cnpm 的原因是因为网络还算 ok 没有特别耗时，另外忘记了之前在哪里看到过 cnpm 不会更新 package-lock.json，因此也就没有再去用第三方源。之后更新的话就

```
npm install serverless -g
```

官网的快速开始教程之后快速部署了个 demo，即：

```
serverless create -t tencent-nodejs
```

命令里的 tencent-nodejs 是众多组件中的一个，组件列表：https://github.com/serverless/components

## 3. 部署 Python Flask 框架

因为本人对 Flask 还算熟悉，所以干脆把部署这个 Component 当成 Hello World 好了。其中官网简介里写道：任何支持 WSGI（Web Server Gateway Interface）的 Python 服务端框架都可以通过该组件进行部署，例如 Falcon 框架等。

**1) 创建新项目**

- #### 基于模板

通过 sls 直接根据模板创建服务，Serverless github 上有很多模板 比如：https://github.com/serverless/components/tree/master/templates/tencent-flask

```
serverless create --template-url https://github.com/serverless/components/tree/master/templates/tencent-flask
```

源码如下：

```
# -*- coding: utf8 -*-

import json
from flask import Flask, jsonify, request
app = Flask(__name__)


@app.route("/")
def index():
    return "Hello Flash"

@app.route('/user', methods = ['POST'])
def addUser():
    # we must get request body from clound function event;
    event = request.environ['event']
    user = json.loads(event['body'])
    return jsonify(data=user)


@app.route("/user", methods = ['GET'])
def listUser():
    users = [{'name': 'test1'}, {'name': 'test2'}]
    return jsonify(data=users)


@app.route("/user/<id>", methods = ['GET'])
def getUser(id):
    return jsonify(data={'name': 'test1'})
```

- 不基于模板

在 Pycharm 创建一个新的 Flask 项目：LAB_Serverless 以区别之前的 LAB

![img](https://img.serverlesscloud.cn/2020323/1584939427919-IMG_0276.JPG)



![img](https://img.serverlesscloud.cn/2020323/1584939428092-IMG_0276.JPG)

源码如下：

```
from flask import Flask

app = Flask(__name__)

@app.route('/')
def hello_world():
    return 'Hello World!'

if __name__ == '__main__':
    app.run()
```

**2) 配置Serverless**

- 创建serverless.yml，这里更改了几处配置

```

MyComponent:
  component: '@serverless/tencent-flask'
  inputs:
    region: ap-beijing
    functionName: LAB_Serverless
    code: ./
    functionConf:
      timeout: 10
      memorySize: 128
      environment:
        variables:
          TEST: value
          Version: 2020-2-23_21:01:44
      vpcConfig:
        subnetId: ''
        vpcId: ''
    apigatewayConf:
      protocol: https
      environment: test

```



- 创建.env，写入密匙（因为懒得每次部署都得拿起手机扫一扫授权(^_−)☆

```
TENCENT_SECRET_ID=<rm>
TENCENT_SECRET_KEY=<rm>
```

**3) 部署**

serverless 的缩写是 sls，因此也可以用 sls 简化命令。但是这里报错了……报错的原因是requirements文件夹不存在。

查看终端

```
Microsoft Windows [版本10.0.17763.1039]
(c) 2018 Microsoft Corporation。保留所有权利。

D:\yuangezhizao\Documents\PycharmProjects\LAB_Serverless>sls --debug

  DEBUG─Resolving the template's static variables.
  DEBUG─Collecting components from the template.
  DEBUG─Downloading any NPM components found in the template.
  DEBUG─Analyzing the template's components dependencies.
  DEBUG─Creating the template's components graph.
  DEBUG─Syncing template state.
  DEBUG─Executing the template's components graph.
  DEBUG─Compressing function LAB_Serverless file to D:\yuangezhizao\Documents\PycharmProjects\LAB_Serverless\.serverless/LAB_Serverless.zip.
(node:22500) UnhandledPromiseRejectionWarning: Error: ENOENT: no such file or directory, stat 'D:\yuangezhizao\Documents\PycharmProjects\LAB_Serverless\.
serverless\requirements'eploying
    at Object.statSync (fs.js:946:3)
    at Object.statSync (C:\Users\yuangezhizao\AppData\Roaming\npm\node_modules\serverless\node_modules\_graceful-fs@4.2.3@graceful-fs\polyfills.js:308:16
)
    at WriteStream.<anonymous> (C:\Users\yuangezhizao\.serverless\components\registry\npm\@serverless\tencent-flask@0.2.0\node_modules\@serverless\tencen
t-flask\node_modules\@serverless\tencent-scf\library\utils.js:124:20)
    at WriteStream.emit (events.js:304:20)
    at C:\Users\yuangezhizao\.serverless\components\registry\npm\@serverless\tencent-flask@0.2.0\node_modules\@serverless\tencent-flask\node_modules\grac
eful-fs\graceful-fs.js:298:14
    at C:\Users\yuangezhizao\.serverless\components\registry\npm\@serverless\tencent-flask@0.2.0\node_modules\@serverless\tencent-flask\node_modules\grac
eful-fs\graceful-fs.js:325:16
    at C:\Users\yuangezhizao\AppData\Roaming\npm\node_modules\serverless\node_modules\_graceful-fs@4.2.3@graceful-fs\graceful-fs.js:325:16
    at FSReqCallback.oncomplete (fs.js:152:23)
(node:22500) UnhandledPromiseRejectionWarning: Unhandled promise rejection. This error originated either by throwing inside of an async function without
a catch block, or by rejecting a promise which was not handled with .catch(). (rejection id: 1)
(node:22500) [DEP0018] DeprecationWarning: Unhandled promise rejections are deprecated. In the future, promise rejections that are not handled will termi
nate the Node.js process with a non-zero exit code.

  194s»MyComponent»canceled

终止批处理操作吗(Y/N)? Y

D:\yuangezhizao\Documents\PycharmProjects\LAB_Serverless>
```

然后去 .serverless 文件下的 Template.MyComponent.pyRequirements.json 文件中看到了requirements.txt。这里其实是故意操作的（特意没添加requirements.txt），说明 requirements.txt 必须存在！

![img](https://img.serverlesscloud.cn/2020323/1584939428805-IMG_0276.JPG)

因此，去创建文件内容为 Flask 的 requirements.txt

```
D:\yuangezhizao\Documents\PycharmProjects\LAB_Serverless>sls --debug

  DEBUG─Resolving the template's static variables.
  DEBUG─Collecting components from the template.
  DEBUG─Downloading any NPM components found in the template.
  DEBUG─Analyzing the template's components dependencies.
  DEBUG─Creating the template's components graph.
  DEBUG─Syncing template state.
  DEBUG─Executing the template's components graph.
  DEBUG─Generated requirements from D:\yuangezhizao\Documents\PycharmProjects\LAB_Serverless\requirements.txt in D:\yuangezhizao\Documents\PycharmProje
cts\LAB_Serverless\.serverless\requirements.txt...
  DEBUG─Installing requirements from C:\Users\yuangezhizao\AppData\Local\Yugasun\serverless-python-requirements\Cache\2a1a661c4e3e6faadab5d001bc10cc3ac
ccf648921aad7c279d94f138eaaf833_slspyc\requirements.txt ...
  DEBUG─Using download cache directory C:\Users\yuangezhizao\AppData\Local\Yugasun\serverless-python-requirements\Cache\downloadCacheslspyc
  DEBUG─Running ...
  DEBUG─Compressing function LAB_Serverless file to D:\yuangezhizao\Documents\PycharmProjects\LAB_Serverless\.serverless/LAB_Serverless.zip.
  DEBUG─Compressed function LAB_Serverless file successful
  DEBUG─Uploading service package to cos[sls-cloudfunction-ap-beijing-code]. sls-cloudfunction-default-LAB_Serverless-1582464464.zip
  DEBUG─Uploaded package successful D:\yuangezhizao\Documents\PycharmProjects\LAB_Serverless\.serverless/LAB_Serverless.zip
  DEBUG─Creating function LAB_Serverless
  DEBUG─Created function LAB_Serverless successful
  DEBUG─Setting tags for function LAB_Serverless
  DEBUG─Creating trigger for function LAB_Serverless
  DEBUG─Deployed function LAB_Serverless successful
  DEBUG─Starting API-Gateway deployment with name MyComponent.TencentApiGateway in the ap-beijing region
  DEBUG─Service with ID service-0ok85tqh created.
  DEBUG─API with id api-ivk6tk0y created.
  DEBUG─Deploying service with id service-0ok85tqh.
  DEBUG─Deployment successful for the api named MyComponent.TencentApiGateway in the ap-beijing region.

  MyComponent:
    region:              ap-beijing
    functionName:        LAB_Serverless
    apiGatewayServiceId: service-0ok85tqh
    url:                 http://service-0ok85tqh-1251901037.bj.apigw.tencentcs.com/test/

  44s»MyComponent»done


D:\yuangezhizao\Documents\PycharmProjects\LAB_Serverless>
```

趁机看下部署成功之后的 .serverless 文件夹：

![img](https://img.serverlesscloud.cn/2020323/1584939428147-IMG_0276.JPG)

这里 Template.MyComponent.TencentCloudFunction.json 即云函数

```
{
  "deployed": {
    "Name": "LAB_Serverless",
    "Runtime": "Python3.6",
    "Handler": "api_service.handler",
    "MemorySize": 128,
    "Timeout": 10,
    "Region": "ap-beijing",
    "Description": "This is a template function"
  }
}
```

第三方包全在这里：

![img](https://img.serverlesscloud.cn/2020323/1584939428188-IMG_0276.JPG)

Template.MyComponent.TencentApiGateway.json 即 API 网关

```
{
  "protocols": [
    "http"
  ],
  "subDomain": "service-0ok85tqh-1251901037.bj.apigw.tencentcs.com",
  "environment": "test",
  "region": "ap-beijing",
  "service": {
    "value": "service-0ok85tqh",
    "created": true
  },
  "apis": [
    {
      "path": "/",
      "method": "ANY",
      "apiId": {
        "value": "api-ivk6tk0y",
        "created": true
      }
    }
  ]
}
```

也就是说CLI自动帮我们创建SCF并将运行环境一并上传，再创建API 网关配置到SCF的触发器上。

```
apigatewayConf:
    protocol: https
    environment: test
```

到这里demo就搞定了，已经可以正常访问了 。

![img](https://img.serverlesscloud.cn/2020323/1584939427902-IMG_0276.JPG)



## 4. 原理深入

去云函数看实际运行环境，发现把.idea文件夹也给上传了 另外，多了如下俩本地没有的文件：

![img](https://img.serverlesscloud.cn/2020323/1584939428669-IMG_0276.JPG)



![img](https://img.serverlesscloud.cn/2020323/1584939427932-IMG_0276.JPG)



其实这就是Serverless的核心了，Serverless配置静态页面的原理自己是清楚的。比如Hexo就是生成页面之后上传到COS上就能访问了。

但是，对于动态页面就比较好奇了，这是怎么实现的呢？其实就是靠着serverless.wsgi 这个文件等等。能看到这个模块描述：此模块将 AWS APIGateway 代理请求转换为 WSGI 请求。

```
"""
This module converts an AWS API Gateway proxied request to a WSGI request.

Inspired by: https://github.com/miserlou/zappa

Author: Logan Raarup <logan@logan.dk>
"""
```

还是相当有意思的。

## 5. 迁移 LAB

接下来就得一点儿一点儿进行迁移了，不难想到应该有非常多的坑的，比如如何访问自己的 MySQL、Redis、 MongoDB，再比如Celery计划任务，自己是用RabbitMQ 的消息队列，这东西要怎么上云？这些问题都是自己需要后期去解决的。毕竟上大学就开始写的网站，有非常非常多的依赖……

更新日志：当前 git 版本：7a65018，总提交 824 次

迁移注定是一个大工程，下一篇将详细介绍迁移遇到的各种坑和填坑操作。



---
<div id='scf-deploy-iframe-or-md'></div>

---

> **传送门：**
> - GitHub: [github.com/serverless](https://github.com/serverless/serverless/blob/master/README_CN.md)
> - 官网：[serverless.com](https://serverless.com/)

欢迎访问：[Serverless 中文网](https://serverlesscloud.cn/)，您可以在 [最佳实践](https://serverlesscloud.cn/best-practice) 里体验更多关于 Serverless 应用的开发！
