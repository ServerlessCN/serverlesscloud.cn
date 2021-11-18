---
title: WebSocket 八问八答，一文解答云函数 WebSocket 使用疑惑
description: 帮助您更好理解和使用云函数的 WebSocket 功能。
date: 2021-11-09
thumbnail: https://qcloudimg.tencent-cloud.cn/raw/002172dabf2a85410ca15a728a5b4e0f.jpg
categories:
  - best-practice
authors:
  - April
tags:
  - Serverless
  - 云函数
---



云函数 Web Function 支持原生 WebSocket 协议后，受到了众多开发者的关注，与此同时，我们也收到了许多疑问和反馈。本篇文章将大家关注的点总结了七大问题并进行了一一解答，希望可以帮助您更好理解和使用云函数的 WebSocket 功能。



### 01. 事件函数、Web 函数、WebSocket 之间的关系？

目前函数支持了不同类型的函数，写法和支持功能上都有一定区别，几种函数类型关系如图：

<img src="https://qcloudimg.tencent-cloud.cn/raw/cdf969ad905d59825b841e03b1c656b5.png" width="700"/>


由于接收的触发源类型不同，云函数支持了 Web 函数与事件函数为两大类型，Web 函数下又支持不同的 Web 协议，可以根据实际业务选择对应的函数类型。

<img src="https://qcloudimg.tencent-cloud.cn/raw/e1b8ced271d1ca2209855ff22f2f29c7.png" width="700"/>



### 02. 云函数上使用 WebSocket，代码究竟应该怎么写？

对于传统开发者而言，遇到的最大问题是不知道如何在云端写函数，Web 函数提供了最原生的开发方式，以 WebSocket 服务器代码开发为例，除了需要指定监听端口外，本地业务代码和云端业务代码并无其它区别，直接部署上传即可，示例如下：

<img src="https://qcloudimg.tencent-cloud.cn/raw/558a97de328b0c54dfebf2606be75df0.png" width="700"/>

<img src="https://qcloudimg.tencent-cloud.cn/raw/33c43794015fe77f9fdda55a7556ad0f.png" width="700"/>



`scf_bootstrap` 示例：

```
#!/bin/bash
/var/lang/node12/bin/node app.js
```



### 03. 已部署为 http&https 协议的 Web 函数，能否升级为 WebSocket 协议？ 

目前还不支持函数协议的直接转换，建议采用创建新函数的方式体验 WebSocket 的功能。



### 04. 在 WebSocket 场景下，函数的超时时间是如何定义的？

WebSocket 的场景下，超时时间分为三部分，介绍如下：

- 初始化超时时间：函数初始化阶段包括准备函数代码、准备镜像、准备层等相关资源以及执行函数主流程代码，可选值范围为3秒-300秒，镜像部署函数默认90秒，其他函数默认60秒。
- 执行超时时间：函数的最长运行时间，对 WS 协议而言，此处指从发起连接请求到连接断开，完成一次调用的时间，如果您的业务场景对 WS 有长时间保持连接的要求，建议调大该时间
- WS 空闲超时时间：指 WS 的空闲等待时间，可选范围 1~600 秒。



### 05. 对于 WebSocket 函数，应该如何查看运行日志？常见状态码与错误原因？

日志查看的方式与事件函数相同，您可以通过 `console.log()` 、`print()`等通用方式完成日志打印，并在控制台查看到运行日志。

状态码说明：

| 断开情况                                                     | 函数表现                         | 函数状态码                           |
| ------------------------------------------------------------ | -------------------------------- | ------------------------------------ |
| 客户端或服务端发起连接结束、关闭连接操作，结束状态码为 1000、1010（客户端发送）、1011（服务端发送） | 函数正常执行结束，运行状态为成功 | 200                                  |
| 客户端或服务端发起连接结束、关闭连接操作，结束状态码非 1000、1010、1011 | 函数异常结束，运行状态为失败     | 439（服务端关闭）、456（客户端关闭） |
| 在 WS 连接上无消息上行或下行发送，达到配置的空闲超时时间的情况下，连接被函数平台断开 | 函数异常结束，运行状态为失败     | 455                                  |
| 在连接建立后持续使用，函数运行时间达到最大运行时长，连接被函数平台断开 | 函数异常结束，运行状态失败       | 433                                  |

更详细的函数状态码可见[云函数状态码列表](https://cloud.tencent.com/document/product/583/42611)。



### 06. WebSocket 的常见使用场景如聊天室，需要实现连接信息的注册存储，在云函数架构下该如何实现？

云函数为单实例单并发，对于聊天室场景，不同用户的请求访问后台服务时，云函数会根据实际请求数量进行扩缩容调整后台实例数，不同实例之间，需要新增消息队列/Redis 作为中间件层，实现多 Server 之间的通讯，从而实现消息的精准广播：

1. 建立连接模块，函数通过 WS 请求进行连接信息的筛选，并记录到消息队列/Redis 中完成注册：

<img src="https://qcloudimg.tencent-cloud.cn/raw/b8372b26aa1b08f5a54600574b19ec7e.png" width="700"/>

2. 消息传输模块，云函数将发送请求的请求 ID，发送给中间件，根据 ID 决定消息的广播或指定用户发送，网关侧透传请求，不做特殊业务逻辑处理

<img src="https://qcloudimg.tencent-cloud.cn/raw/dfc52fda8eeb99f41c73ee18ce15c5fe.png" width="700"/>



3. 消息清理模块，用户断开连接，函数同步清理中间件层的注册消息

<img src="https://qcloudimg.tencent-cloud.cn/raw/b780beba5d8b159be4166d5c715deda9.png" width="700"/>

### 07. Http 协议和 WS 能否混用？期望用户通过 Http 访问，但 WS 来转发

对于 Web 函数，这种场景是可以实现的，但架构上无法通过单一函数管理，而是需要使用两个函数，并在中间通过一个消息队列/Redis作为中间件来连接，参考架构如图：

<img src="https://qcloudimg.tencent-cloud.cn/raw/76fea653e7ebd91523557c132860e757.png" width="700"/>

### 08. WebSocket 往往需要一直保持心跳，这里如何计费？

WebSocket 的计费项与事件函数相同，各个计费项说明如下：

- Web 函数调用次数：按照每次 WS 建立连接收费，连接后续的心跳次数不做计费；`（Web 函数调用费用即将进行优化，敬请期待）`
- 函数资源量 GBs： 按照连接从 WS 建立到断开的总时间统计函数运行时长，设置合理的超时时间可以有效节省费用；
- 外网出流量：函数对外访问的流量费用，与现有函数统计方式相同。







------



> **传送门：**
>
> - GitHub: [github.com/serverless](https://github.com/serverless/serverless/blob/master/README_CN.md)
> - 官网：[serverless.com](https://serverless.com/)

欢迎访问：[Serverless 中文网](https://serverlesscloud.cn/)，您可以在 [最佳实践](https://serverlesscloud.cn/best-practice) 里体验更多关于 Serverless 应用的开发！





