---
title: 腾讯云云函数 Web Function 能力升级，原生支持 WebSocket 协议
description: Web Function 现已支持 WebSocket 协议，实现客户端和函数运行的服务端间建立长连接。
date: 2021-10-11
thumbnail: https://main.qcloudimg.com/raw/f9936a6db0eefbfc365753b0da1dc89f.jpg
categories:
  - best-practice
authors:
  - April
tags:
  - Serverless
  - 云函数
---



[**云函数 Web Function**](http://mp.weixin.qq.com/s?__biz=Mzg4NzEyMzI1NQ==&mid=2247491491&idx=1&sn=dea40a8b6ce9ad90a5ca2fb0d8968fb3&chksm=cf8e63fbf8f9eaede8c084db1b77b7bc61ddacd10a388585bf23c5f0a4f63579bbf4fc5f6d39&scene=21#wechat_redirect) 能力推出后，对于原生框架的无改造直接部署，在性能和开发流程上，都受到了众多开发者的好评。在一期能力的基础上，Web Function 现已支持 WebSocket 协议，实现客户端和函数运行的服务端间建立长连接。



## 01. 工作原理

<img src="https://main.qcloudimg.com/raw/aa3205a9d3f9a134c59f08e00664003b.png" width="700"/>

#### 1. 服务启动与连接建立

与 HTTP 协议一样，Web 函数支持在官方或自定义的运行环境中，使用启动文件启动 WebSocket 服务器，并在指定端口（9000）上进行监听，通过前端 API 网关提供的 WS 路径，接收到客户端连接请求后，完成连接的建立。

连接建立后，客户端及服务端按 WebSocket协议进行正常通讯。

#### 2. WebSocket 连接生命周期

在 Web 函数的 WebSocket 支持的情况下， WebSocket 一次连接的生命周期，等同于一次函数调用请求；WS 连接建立过程等同于请求发起阶段，WS 连接断开等同于请求结束。



## 02. 控制台部署体验



在通过控制台创建函数时，可以通过选择自定义创建、选择 Web 函数、展开高级配置来看到协议支持选项。

<img src="https://main.qcloudimg.com/raw/2e024051c9383420760cf116e62442fc.png" width="700"/>



通过勾选 WebSocket 支持，配置好 WebSocket 空闲超时时间，来完成 WebSocket 协议支持。

<img src="https://main.qcloudimg.com/raw/593cc4ab9133b6b29180f768382ab119.png" width="700"/>



同时在勾选 WebSocket 支持后，API 网关的协议支持同样将自动切换为 WS&WSS 支持，创建的 API 网关所提供的链接地址，也将是 WebSocket 地址。

<img src="https://main.qcloudimg.com/raw/52464e20611f03bdfd0223b236c621ab.png" width="700"/>

在完成创建后，WebSocket 的协议支持不可取消，但可以根据需求修改空闲超时时间配置。



## 03. 示例代码

目前可以通过如下的 Demo 代码来创建函数，体验 WebSocket 效果：

- Python 示例：使用 WebSockets 库实现 WebSocket 服务端；

- - Python 示例获取地址：https://github.com/awesome-scf/scf-python-code-snippet/tree/main/ws_python

- Node.js 示例：使用 WebSockets 库实现 WebSocket 服务端；

- - Node.js 示例获取地址：https://github.com/awesome-scf/scf-nodejs-code-snippet/tree/main/ws_node

- WebSockets 库：https://github.com/websockets/ws



## 04. 云函数 WebSocket 内测体验

现已开启内测，[点击填写信息](https://cloud.tencent.com/apply/p/m8fij6l35x)，立即申请体验！





## **Web Function 使用体验**

- Web Function 产品文档：

  https://cloud.tencent.com/document/product/583/56123

- Web Function 快速体验链接：

  https://console.cloud.tencent.com/scf/list-create?rid=16&ns=default&keyword=WebFunc



当前已在国内各大区域发布上线，欢迎体验使用！

<img src="https://main.qcloudimg.com/raw/4ee70db1b518d4c0064711d1caf1572c.jpg" width="700"/>



---

> **传送门：**
>
> - GitHub: [github.com/serverless](https://github.com/serverless/serverless/blob/master/README_CN.md)
> - 官网：[serverless.com](https://serverless.com/)



欢迎访问：[Serverless 中文网](https://serverlesscloud.cn/)，您可以在 [最佳实践](https://serverlesscloud.cn/best-practice) 里体验更多关于 Serverless 应用的开发！
