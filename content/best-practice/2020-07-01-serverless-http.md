---
title: 如何将 Web 框架迁移到 Serverless
description: 传统 Web 服务想迁移到 Serverless 上，需要进行相关改造和特殊处理的。本文将具体帮助大家剖析下，如何 Serverless 化传统的 Web 服务
keywords: Serverless SSR,Serverless Egg.js
date: 2020-07-01
thumbnail: https://img.serverlesscloud.cn/202072/1593676142784-http.jpg
categories:
  - best-practice
authors:
  - Yugasun
authorslink:
  - https://github.com/yugasun
tags:
  - Serverless
  - Web
---

Serverless 通常翻译为「无服务架构」，是一种软件系统设计架构思想和方法，并不是一个开发框架或者工具。他的出现是为了让开发者更加关注业务的开发，而将繁杂的运维和部署交给云厂商。Serverless 由 Faas 和 Baas 组成，Faas 为开发者提供业务运算环境，然后与 Baas 提供的数据和存储服务，进行交互，从而提供与传统服务一致的体验。但是由于 Faas 是无状态的，并且其运行环境是有读写限制的，最重要的是它是基于事件触发的。因此如果传统 Web 服务想迁移到 Serverless 上，是需要进行相关改造和特殊处理的，为此迁移成本是必不可少的。本文将具体帮助大家剖析下，如何 Serverless 化传统的 Web 服务。

读完本文将了解到：

1. [传统 Web 服务特点](#传统-Web-服务特点)
2. [Serverless 适用场景](#Serverless-适用场景)
3. [Web 框架如何迁移到 Serverless](#Web-框架如何迁移到-Serverless)
4. [使用 Serverless Components 快速部署 Web 框架](#使用-Serverless-Components-快速部署-Web-框架)

## 传统 Web 服务特点

Web 服务定义：

> Web 服务是一种 `面向服务的架构` (SOA) 的技术，通过标准的 Web 协议提供服务，目的是保证不同平台的应用服务可以互操作。

日常生活中，接触最多的就是基于 HTTP 协议的服务，客户端发起请求，服务端接受请求，进行计算处理，然后返回响应，简单示意图如下：

![web-service-flow](https://img.serverlesscloud.cn/202072/1593676142984-http.jpg)

传统 Web 服务部署流程：通常需要将项目代码部署到服务器上，启动服务进程，监听服务器的相关端口，然后等待客户端请求，从而响应返回处理结果。而这个服务进程是常驻的，就算没有客户端请求，也会占用相应服务器资源。

一般我们的服务是由高流量和低流量场景交替组成的，但是为了考虑高流量场景，我们需要提供较高的服务器配置和多台服务进行负载均衡。这就导致服务处在低流量场景时，会多出很多额外的闲置资源，但是购买的资源却需要按照高流量场景进行付费，这是非常不划算的。

如果我们的服务能在高流量场景自动扩容，低流量场景自动缩容，并且只在进行计算处理响应时，才进行收费，而空闲时间不占用任何资源，就不需要收费呢？

答案就是 `Serverless`。

## Serverless 适用场景

上面已经提到了 Serverless 的两个核心特点：`按需使用和收费` 和 `自动扩缩容`。而且近几年 Serverless 的应用也越来越广泛，但是它并不是银弹，任何技术都是有它的适合场景和不适合场景。我们不能因为一项技术的火热，而盲目的追捧。Serverless 是有它的局限性的，一般 Serverless 适合如下几种场景：

1. 异步的并发，组件可独立部署和扩展
2. 应对突发或服务使用量不可预测
3. 无状态，计算耗时较短服务
4. 请求延时不敏感服务
5. 需要快速开发迭代的业务

如果你的服务不满足以上条件，笔者是不推荐迁移到 Serverless。

## Web 框架如何迁移到 Serverless

如果你的服务是以上提到的任何话一个场景，那么就可以尝试迁移到 Serverless 上。

常见的 Serverless HTTP 服务结构图如下：

![serverless-http-framework](https://img.serverlesscloud.cn/202072/1593676142478-http.jpg)

那么我们如何将 Web 服务进行迁移呢？

我们知道 Faas （云函数）是基于事件触发的，也就是云函数被触发运行时，接收到的是一个 `JSON 结构体`，它跟传统 Web 请求时有区别的，这就是为什么需要额外的改造工作。而改造的工作就是围绕`如何将事件 JSON 结构体转化成标准的 Web 请求`。

所以 Serverless 化 Web 服务的核心就是需要开发一个 `适配层`，来帮我们将触发事件转化为标准的 Web 请求。

整个处理流程图如下：

![serverless-http-flow](https://img.serverlesscloud.cn/202072/1593676143735-http.jpg)

接下来将介绍如何为 Express 框架开发一个适配层。

### Serverless Express 适配层开发

#### 实现原理

首先我们先来看看一个标准的云函数结构：

```js
module.exports.handler = (event, context) => {
  // do some culculation
  return res;
};
```

在介绍如何开发一个 Express 的适配层前，我们先来熟悉下 Express 框架。

一个简单的 Node.js Web 服务如下：

```js
const http = require("http");
const server = http.createServer(function (req, res) {
  res.end("helloword");
});
server.listen(3000);
```

Express 就是基于 Node.js 的 Web 框架，而 Express 核心就是 `通过中间件的方式，生成一个回调函数`，然后提供给 `http.createServer()` 方法使用。

Express 核心架构图如下：

![express-framework](https://img.serverlesscloud.cn/202072/1593676143739-http.jpg)

由此可知，我们可以将 Express 框架生成的回调函数，作为 `http.createServer()` 的参数，来创建可控的 HTTP Server，然后将云函数的 `event` 对象转化成一个 `request` 对象，通过 `http.request()` 方法发起 HTTP 请求，获取请求响应，返回给用户，就可以实现我们想要的结果。

### Node.js Server 的监听方式选择

对于 Node.js 的 HTTP Server，可以通过调用 `server.listen()` 方法来启动服务，`listen()` 方法支持多种参数类型，主要有两种监听方式 `从一个TCP端口启动监听` 和 `从一个UNIX Socket套接字启动监听`。

> * `server.listen(port[, hostname][, backlog][, callback])`：从一个TCP端口启动监听
> * `server.listen(path, [callback])`：从一个UNIX Domain Socket启动监听

服务器创建后，我们可以像下面这样启动服务器：

```js
// 从'127.0.0.1'和3000端口开始接收连接
server.listen(3000, '127.0.0.1', () => {});
// 从 UNIX 套接字所在路径 path 上监听连接
server.listen('path/to/socket', () => {})
```

无论是 `TCP Socket` 还是 `Unix Domain Socket`，每个 Socket 都是唯一的。`TCP Socket` 通过 `IP和端口` 描述，而 `Unix Domain Socket` 通过 `文件路径` 描述。

TCP 属于传输层的协议，使用 TCP Socket 进行通讯时，需要经过传输层 TCP/IP 协议的解析。

而 `Unix Domain Socket` 可用于不同进程间的通讯和传递，使用 `Unix Domain Socket` 进行通讯时不需要经过传输层，也不需要使用 `TCP/IP 协议`。所以，理论上讲 `Unix Domain Socket` 具有更好的传输效率。

因此这里在设计启动服务时，采用了 `Unix Domain Socket` 方式，以便减少函数执行时间，节约成本。

> 关于 Node.js 如何实现 IPC 通信，这里就不详细介绍的，感兴趣的小伙伴可以深入研究下，这里有个简单的示例，[nodejs-ipc](https://github.com/yugasun/nodejs-ipc)

#### 代码实现

原理大概介绍清楚了，我们的核心实现代码需要以下三步：

1. 通过 Node.js HTTP Server 监听 Unix Domain Socket，启动服务

```js
function createServer(requestListener, serverListenCallback) {
  const server = http.createServer(requestListener);

  server._socketPathSuffix = getRandomString();
  server.on("listening", () => {
    server._isListening = true;
    if (serverListenCallback) serverListenCallback();
  });
  server
    .on("close", () => {
      server._isListening = false;
    })
    .on("error", (error) => {
      // ...
    });
  server.listen(`/tmp/server-${server._socketPathSuffix}.sock`)
  return server;
}
```

2. 将 Serverless Event 对象转化为 Http 请求

```js
function forwardRequestToNodeServer(server, event, context, resolver) {
  try {
    const requestOptions = mapApiGatewayEventToHttpRequest(
      event,
      context,
      getSocketPath(server._socketPathSuffix),
    );
    // make http request to node server
    const req = http.request(requestOptions, (response) =>
      forwardResponseToApiGateway(server, response, resolver),
    );
    if (event.body) {
      const body = getEventBody(event);
      req.write(body);
    }

    req
      .on('error', (error) =>
        // ...
      )
      .end();
  } catch (error) {
    // ...
    return server;
  }
}
```

3. 将 HTTP 响应转化为 API 网关标准数据结构

```js
function forwardResponseToApiGateway(server, response, resolver) {
  response
    .on("data", (chunk) => buf.push(chunk))
    .on("end", () => {
      // ...
      resolver.succeed({
        statusCode,
        body,
        headers,
        isBase64Encoded,
      });
    });
}
```

最后函数的 handler 将异步请求返回就可以了。

#### 借助 tencent-serverless-http 库实现

如果不想手写这些适配层代码，可以直接使用 [tencent-serverless-http](https://github.com/serverless-plus/tencent-serverless-http) 模块。

它使用起来很简单，创建我们的 Express 应用入口文件 `sls.js`：

```js
const express = require("express");
const app = express();

// Routes
app.get(`/`, (req, res) => {
  res.send({
    msg: `Hello Express`,
  });
});

module.exports = app;
```

然后创建云函数 `sl_handler.js` 文件：

```js
const { createServer, proxy } = require("tencent-serverless-http");
const app = require("./app");

exports.handler = async (event, context) => {
  const server = createServer(app);
  const result = await proxy(server, event, context, "PROMISE").promise;
};
```

接下来，将业务代码和依赖模块一起打包部署到云函数就可以了（记得指定 `执行方法` 为 `sl_handler.handler` ）。

### 其他 Node.js 框架

除了 `Express` 框架，其他的 Node.js 框架也基本类似，只需要按照要求，`exports` 一个 `HTTP Server` 的回调函数就可以。

比如 `Koa`，我们拿到初始化的 `Koa` 应用后，只需要将 `app.callback()` 作为 `createServer()` 方法的参数就可以了，如下：

```js
const { createServer, proxy } = require("tencent-serverless-http");
const app = require("./app");

exports.handler = async (event, context) => {
  // 这里和 Express 略有区别
  const server = createServer(app.callback());
  const result = await proxy(server, event, context, "PROMISE").promise;
};
```

### 其他语言框架

对于非 Node.js 框架，比如 `Python` 的 `Flask` 框架，原理都是一样的，核心只需要做到 `将 Serverless Event 对象转化为 Http 请求`，就可以了。由于笔者对其他语言不太熟悉，这里就不做深入介绍了，感兴趣的小伙伴，可以到 Github 社区搜索下，已经有很多对应的解决方案了，或者自己尝试手撸也是可以的。

## 使用 Serverless Components 快速部署 Web 框架

读到这里，相信你已经清楚，如何将自己的 Node.js 框架迁移到 Serverless 了。但是在这之前，我们都是手动处理的，而且每次都需要自己创建 `handler.js` 文件，还是不够方便。

为此开源社区提供了一套优秀的解决方案 [Serverless Component](https://github.com/serverless/components)，通过组件，我们进行简单的 `yaml` 文件配置后，就可以方便的将我们的框架代码部署到云端。

比如上面提到的 `Express` 框架，就有对应的组件，我们只需要在项目根目录下创建 `serverless.yml` 配置文件：

```yaml
component: express
name: expressDemo

inputs:
  src: ./
  region: ap-guangzhou
  runtime: Nodejs10.15
  apigatewayConf:
    protocols:
      - https
    environment: release
```

然后全局安装 `serverless` 命令 `npm install serverless -g` 之后，执行部署命令即可：

```bash
$ serverless deploy
```

耐心等待几秒，我们的 Express 应用就成功部署到云端了。更多详细信息，请参考 [Express 官方文档](https://github.com/serverless-components/tencent-express/tree/v2)

> 注意：本文 Serverless 服务均基于 `腾讯云` 部署。

Serverless Express 组件不仅能帮我们快速部署 Express 应用，而且它还提供了 `实时日志` 和 `云端调试` 的能力。

只需要在项目目录下执行 `serverless dev` 命令，serverless 命令行工具就会自动监听项目业务代码的更改，并且实时部署，同时我们可以通过打开 Chrome Devtools 来调试 Express 应用。

> 关于云端调试，[腾讯云 Serverless Framework 正式发布公告](https://serverlesscloud.cn/blog/2020-04-07-sfga/) 中有详细的介绍，并且有视频演示。

而且除了 Express 组件，还支持： Koa.js，Egg.js，Next.js，Nuxt.js.....

[发现更多组件](https://registry.serverless.com/)

## 最后

当然 Serverless 化 Web 服务并没有本文介绍的那么简单，比如文件读写，服务日志存储，`Cookie/Session` 存储等......实际开发中，我们还会面临各种未知的坑，但是比起困难，Serverless 带给我们的收益是值得去尝试的。当然传统 Web 服务真的适合迁移到 Serverless 架构上，也是值得我们去思考的问题，毕竟现有的 Web 框架都是面向传统 Web 服务开发实现的 （推荐阅读 [利与弊-传统框架要不要部署在 Serverless 架构上](https://www.serverlesschina.com/post/43.html)）。但是笔者相信，很快就会出现一个专门为 Serverless 而生的 Web 框架，可以帮助我们更好地基于 Serverless 开发应用 ~

---

---
<div id='scf-deploy-iframe-or-md'></div>

---

> **传送门：**
> - GitHub: [github.com/serverless](https://github.com/serverless/serverless/blob/master/README_CN.md)
> - 官网：[serverless.com](https://serverless.com/)

欢迎访问：[Serverless 中文网](https://serverlesscloud.cn/)，您可以在 [最佳实践](https://serverlesscloud.cn/best-practice) 里体验更多关于 Serverless 应用的开发！
