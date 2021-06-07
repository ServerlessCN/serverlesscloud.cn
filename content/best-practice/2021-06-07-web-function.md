---
title: 下一代 Web 服务开发，就是这么快！
description: 腾讯云 Web Function 助力原生 Web Service 直接上云！
date: 2021-06-07
thumbnail: https://main.qcloudimg.com/raw/c4b005a9695ed3f2c0344eb60ff5e548.png
categories:
  - best-practice
authors:
  - April
tags:
  - Serverless
  - 云函数
---



对于广大开发者而言，搭建一个自己的 Web 服务是最为常见的开发场景之一。无论是全栈网站的搭建，还是创建 API 接口，都需要一个可以快速接收并处理 HTTP 请求的 Web 框架。Serverless 时代来临，既希望享受云计算带来的弹性伸缩、免运维等众多优势，却又囿于基于事件触发带来的改造成本而无法轻易尝试。Web 服务如何与 Serverless 完美适配成了我们需要攻克的难题。



## 01. Web 服务开发发展趋势

从发展历程来看，Web 服务开发可以分为三个阶段：本地服务器部署 - 云主机部署 - Serverless 部署。

第一阶段，开发者需要自己购买服务器，将搭建的 Web 服务部署在机器上，虽然开发者对于机器的可操作范围更大，可对于 Web 场景来看，开发者往往不需要对机器进行多余操作，这样反而带来了额外的机器维护成本。

第二阶段，开发进入云时代，大家更倾向与于在云上购买主机部署服务，免去维护成本后，极大提升了开发效率，这个也是目前使用最为广泛的开发方式，但主机仍基于使用量的预估来提前购买，并且会为未使用的计算资源付费，这样的方式仍有一定资源与成本上的浪费。

第三阶段，Serverless 正式登上舞台，SCF 云函数自身有着自动扩缩容、按量计费等众多优势，完美适应开发者对于低开发&维护成本的需求，是 Web 服务部署的完美平台。但由于云函数是事件型函数，只能接受事件类型触发，无法直接接收处理原生 HTTP 请求，虽然云函数推出了众多解决方案，帮助开发者自动进行格式转换，但转换层的创建以及处理链路长仍是不可忽视的迁移成本。



## 02. 传统 API 网关 + 事件函数方案问题

API 网关会自动对传入的 HTTP 请求进行格式转换，转换为函数可以处理的 JSON 事件格式。函数侧，在原生 Web 服务框架前添加一个适配层函数，将事件 JSON 结构体再转化成标准的 Web 请求，提供给后端框架进行处理。

问题：

1. 改造成本高，需要添加适配层做格式转换，并对 Web 框架的监听方式进行修改。
2. 调试成本高，本地代码和云端代码不⼀致，本地和云端调试体验不统⼀，对于本地调试的实现有阻碍。
3. 转换链路长，性能有损耗，⼀次请求需要多四次转换：
   1. http request -->> event
   2. event -->> http request
   3. http response -->> APIGateway 需要的返回结构
   4. APIGateway 需要的返回结构 -->> http response

针对这些的问题，腾讯云 Serverless 推出的全新函数类型 - Web Function，实现 Serverless 与 Web 服务最优雅的结合。



## 03. Web Function - 下一代建站方案

<img src="https://main.qcloudimg.com/raw/cde114bd2b79e7f895f017b1d69079fe.png" width="700"/>

1. 用户发送的 HTTP 请求经过 API 网关后，网关侧将原生请求直接透传的同时，在请求头部加上了网关触发函数时需要的函数名、函数地域等内容，一起传递到函数环境，触发后端函数执行；
2. 函数环境内，通过内置的 Proxy 实现 Nginx 转发，并去除掉头部非产品规范的请求信息，将原生 HTTP 请求通过指定端口发送给用户的 Web Server 服务；
3. 用户的 Web Server 配置好指定的监听端口（`9000`）和服务启动文件后部署到云端，通过该端口获取 HTTP 请求并进行处理。

<img src="https://main.qcloudimg.com/raw/03c890fc3e6338b0e22b793dc086b96a.png" width="700"/>



## 04. Web Function 优势

- 函数可以直接接收并处理 HTTP 请求，API 网关不再需要做 json 格式转换，减少请求处理环节，提升 Web 服务性能。
- Web 函数的编写体验更贴近编写原生 Web 服务，保证和本地开发服务体验一致。
- 丰富的框架支持，您可以使用常见的 Web 框架（如 Node.js Web 框架：`Express`、`Koa`）编写 Web 函数，也可以将您本地的 Web 框架服务以极小的改造量快速迁移上云。
- Web 函数自动为您创建 API 网关服务，部署完成后，网关侧会自动生成一个默认 URL 供用户访问和调用，简化了学习成本和调试过程。
- 控制台提供了测试能力，您可以在函数控制台快速测试您的服务。



## 05. Web Function 内测申请

Web 函数（Web Function）是云函数的一种函数类型，区别于事件函数（Event Function）对于事件格式的限制，专注于优化 Web 服务场景，用户可以直接发送 HTTP 请求到 URL 触发函数执行。

- 腾讯云 Serverless 即将推出「Web Function」，现开放内测申请，[点击提交申请](https://cloud.tencent.com/apply/p/bq2gg6hddzd)。