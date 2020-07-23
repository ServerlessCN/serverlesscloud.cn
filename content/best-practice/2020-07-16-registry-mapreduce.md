---
title: 通过 Serverless Regsitry 快速开发与部署一个 WordCount 实例
description: 本文介绍了如何通过 Registry 开发与部署一个项目模版
keywords: Serverless Registry,MapReduce
date: 2020-07-16
thumbnail: https://img.serverlesscloud.cn/2020720/1595246883106-%E5%B0%81%E9%9D%A2%E5%9B%BE.jpg
categories:
  - best-practice
authors: 
  - 杜佳辰
authorslink: 
  - https://github.com/Jiachen0417
tags:
  - Registry
  - MapReduce
---

在学习 MapReduce 的过程中，不少人接触的第一个项目就是单词计数。单词计数通过两个函数 Map 和 Reduce，可以快速地统计出文本文件中每个单词出现的个数，它虽然简单，但也是最能体现 MapReduce 思想的程序之一。而 Serverless 的出现，为 MapReduce 进行大数据处理又提供了一个新的部署方案，Serverless 与 MapReduce 究竟如何结合呢？

本文将通过一个简单的教程，指导大家快速开发一个基于 MapReduce 的 WordCount 应用模版，并在 Serverless 应用中心 Registry 里实现复用。

## 前提条件

已安装 **Serverless Framework**，并保证您的 Serverless Framework 不低于以下版本：

```console
$ serverless –v
Framework Core: 1.74.1 (standalone)
Plugin: 3.6.14
SDK: 2.3.1
Components: 2.31.6
```

## 实现概要

下面是该实例的实现流程：

- 创建函数与 COS Bucket。
- 用户将对象上传到 COS 中的源存储桶（对象创建事件）。
- COS Bucket检测到对象创建事件。
- COS 调用函数并将事件数据作为参数传递给函数，由此将 `cos:ObjectCreated:*` 事件发布给函数。
- SCF 平台接收到调用请求，执行函数。
- 函数通过收到的事件数据获得了 Bucket 名称和文件名称，从该源 Bucket中获取该文件，根据代码中实现的 wordcount 进行字数统计，然后将其保存到目标 Bucket 上。

部署成功后，本模版将会为您创建以下资源：

- 两个 SCF 函数：Mapper 和 Reducer。
- 三个 COS Bucket：srcmr、middlestagebucket 和 destmr。
- Mapper 函数将会绑定 srcmr 触发，Reducer 函数将会绑定 middlestagebucket 触发，destmr 将会用来接收最终的统计结果。

## 开发步骤

1. 通过 COS 组件完成创建上传文件的 COS 存储桶的配置文件编写，yml 文件配置如下

```text
# serverless.yml
org: serverless
app: MapReduce_Demo
stage: dev
component: cos
name: destmr

inputs:
  bucket: destmr
  region: ap-guangzhou
```

同理，完成其它两个存储桶配置。

2. 完成函数代码编写，本模版中需要创建两个函数：Map 函数与 Reduce 函数，并为其分别配置 yml 文件

Map 函数 yml 文件示例如下：

```text
component: scf # (必选) 组件名称，在该实例中为scf
name: map_function # 必选) 组件实例名称.
org: serverless # (可选) 用于记录组织信息，
app: MapReduce_Demo # (可选) 用于您的 AP名称
stage: dev # (可选) 用于区分环境信息，默认值是 dev

inputs:
  name: map_function
  src: ./
  handler: map_function.main_handler 
  runtime: Python2.7 
  region: ap-guangzhou 
  description: This is one of the MapReduce function which is map_function
  memorySize: 128 
  timeout: 10
  environment:
    variables:
        Bucket: ${output:${stage}:${app}:middlestagebucket.bucket}
        TENCENT_SECRET_ID: ${env:TENCENT_SECRET_ID}
        TENCENT_SECRET_KEY: ${env:TENCENT_SECRET_KEY}
  
  events: # 触发器
    - cos: # cos触发器
        name: ${output:${stage}:${app}:srcmr.cosOrigin}
        parameters:
          bucket: ${output:${stage}:${app}:srcmr.cosOrigin}
          events: 'cos:ObjectCreated:*'
          enable: true
```

3. 完成配置后，整个应用模版结构如下：

```text
Map_Reduce_Demo
|--bucket_destmr
  |--serverless.yml
|--bucket_middlestage
  |--serverless.yml
|--bucket_srcmr
  |--serverless.yml
|--fun_map
  |--serverless.yml
  |--map_function.py
|--fun_reduce
  |--serverless.yml
  |--reduce_function.py
```

您也可根据您的实际业务逻辑进行更改。

## 模版上传

完成模版开发后，您可以将您的模版上传至 Registry，供大家公开复用。

1. 在项目根目录下配置上传至 Registry 的项目模版信息：

```text
# serverless.yml
name: mapreduce-demo # 项目模板的名字
displayName: 基于 MapReduce 统计字数  #项目模板展示在控制台的名称（中文）
author: Tencent Cloud, Inc. # 作者的名字
org: Tencent Cloud, Inc. # 组织名称，可选
type: template #项目类型，可填 template 或 component，此处为模版
description: Deploy a MapReduce wordcount application. # 描述您的项目模板
description-i18n:
  zh-cn: 本示例Demo演示怎么利用COS来做MapReduce，一共需要2个函数：map_function和reduce_function，3个COS Bucket：srcmr、middlestagebucket 和 destmr # 中文描述
keywords: tencent, serverless, cos, scf, mapreduce # 关键字
repo: # 源代码 Repo
readme: # 详细的说明文件
license: MIT # 版权声明
src: # 描述项目中的哪些文件需要作为模板发布
  src: ./ # 指定具体的相对目录，此目录下的文件将作为模板发布
  exclude: #描述在指定的目录内哪些文件应该被排除
    - .env
    - serverless.yml
```

2. 上传模版

```console
$ sls registry publish
serverless ⚡ registry
Publishing "mapreduce-demo@0.0.0"...

Serverless › Successfully published mapreduce-demo
```

## 模版复用

所有上传到 Registry的模版都支持公开下载与复用的，操作如下：

1. 下载模版

```console
$ sls init -t mapreduce-demo
serverless ⚡ framework

- Successfully created "mapreduce-demo" instance in the currennt working directory.
- Don't forget to update serverless.yml and install dependencies if needed.
- Whenever you're ready, run "serverless deploy" to deploy your new instance.

mapreduce-demo › Created
```

2. 在环境配置 .env 文件中填入您自己的密钥信息

```text
# .env
TENCENT_SECRET_ID=123
TENCENT_SECRET_KEY=123
```

3. 部署项目

```console
$ cd mapreduce-demo
$ sls deploy --all
serverless ⚡ framework

srcmr: 
  region:        ap-guangzhou
  bucket:        srcmr-0000000000
  cosOrigin:     srcmr-0000000000.cos.ap-guangzhou.myqcloud.com
  url:           http://srcmr-0000000000.cos.ap-guangzhou.myqcloud.com
  vendorMessage: null

destmr: 
  region:        ap-guangzhou
  bucket:        destmr-0000000000
  cosOrigin:     destmr-0000000000.cos.ap-guangzhou.myqcloud.com
  url:           http://destmr-0000000000.cos.ap-guangzhou.myqcloud.com
  vendorMessage: null

middlestagebucket: 
  region:        ap-guangzhou
  bucket:        middlestagebucket-0000000000
  cosOrigin:     middlestagebucket-0000000000.cos.ap-guangzhou.myqcloud.com
  url:           http://middlestagebucket-0000000000.cos.ap-guangzhou.myqcloud.com
  vendorMessage: null

map_function: 
  functionName:  map_function
  description:   This is one of the MapReduce function which is map_function
  namespace:     default
  runtime:       Python2.7
  handler:       map_function.main_handler
  memorySize:    128
  lastVersion:   $LATEST
  traffic:       1
  triggers: 
    cos: 
      - srcmr-0000000000.cos.ap-guangzhou.myqcloud.com
  vendorMessage: null

reduce-function: 
  functionName:  reduce_function
  description:   This is one of the MapReduce function which is reduce_function
  namespace:     default
  runtime:       Python2.7
  handler:       reduce_function.main_handler
  memorySize:    128
  lastVersion:   $LATEST
  traffic:       1
  triggers: 
    cos: 
      - middlestagebucket-0000000000.cos.ap-guangzhou.myqcloud.com
  vendorMessage: null

8s › mapreduce-demo › Success
```


## 项目测试

1. 找到模版文档中的 test.txt 文件。
2. 切换至[对象存储控制台](https://console.cloud.tencent.com/cos/bucket)，选择创建好的 Bucket：srcmr，单击「上传文件」。
3. 在弹出的「上传文件」窗口中，选择 test.txt，单击「确定上传」。
4. 切换至[云函数控制台](https://console.cloud.tencent.com/scf/list?rid=8&ns=default)，查看执行结果。在运行日志中可以看到打印出来的日志信息。
5. 切换至 [对象存储控制台](https://console.cloud.tencent.com/cos/bucket)，选择创建好的 Bucket：destmr，查看生成的文件。


## 项目移除

可以通过以下命令移除应用

```console
$ sls remove --all

serverless ⚡ framework

8s › maprecude › Success
  
```

---

---
<div id='scf-deploy-iframe-or-md'></div>

---

> **传送门：**
> - GitHub: [github.com/serverless](https://github.com/serverless/serverless/blob/master/README_CN.md)
> - 官网：[serverless.com](https://serverless.com/)

欢迎访问：[Serverless 中文网](https://serverlesscloud.cn/)，您可以在 [最佳实践](https://serverlesscloud.cn/best-practice) 里体验更多关于 Serverless 应用的开发！