---
title: 云函数 SCF Node.js Runtime 最佳实践
description: 如何使用腾讯云云函数来开发 Node.js 应用以及云函数的 Node.js runtime 实现原理
keywords: Serverless,scf,Node.js
date: 2020-05-12
thumbnail: https://img.serverlesscloud.cn/2020518/1589791111276-node12%E5%89%AF%E6%9C%AC.jpg
categories:
  - guides-and-tutorials
authors:
  - Wes
authorslink:
  - https://zhuanlan.zhihu.com/ServerlessGo
tags:
  - Node.js
  - 云函数
---

腾讯云云函数 SCF 最近新发布了 Node.js 12.16 的 runtime，也是国内首家支持 Node.js 12.x 的主流云服务商。

Node.js 版本的升级带来了新的特性以及性能方面的提升，有兴趣的同学可以参考国外一博主总结的文章[《Node.js 12: The future of server-side JavaScript》](https://blog.logrocket.com/node-js-12/)了解具体内容。

其中比较重要的一点是启动速度提升，通过 `v8 code cache` 的支持，构建时提前为内置库生成代码缓存，提升 30% 的启动耗时。

腾讯云云函数 SCF 为了让 Serverless 更加符合 Node.js 原生的使用体验，针对 Node.js runtime 做了针对性的优化。
借这个机会，我想和大家分享一下如何使用腾讯云云函数来开发 Node.js 应用以及 scf 的 Node.js runtime 实现的原理。

## 入口函数的参数

首先我们看一下最基本的 Node.js 入口函数：

```javascript
exports.main_handler = (event, context, callback) => {
  console.log("Hello World");
  console.log(event);
  console.log(context);
  callback(null, event);
};
```
runtime 会将三个参数传递到处理程序方法。

### 第一个参数是 event，用来传递触发事件数据

包含来自调用程序的信息。调用程序在调用时将该信息作为 JSON 格式字符串传递，事件结构因服务而异。

- 定时触发器的 event 对象就包括了触发的时间，触发器的名称
`{Message: "", Time: "2020-05-08T14:30:00Z", TriggerName: "time_5", Type: "Timer"}`

- apigateway 触发器的 event 对象透传了 http 请求的完整内容以及 apigateway 定制化的 http 请求头部信息

`{"headerParameters":{},"headers":{...},"httpMethod":"GET","path":"/params_log","pathParameters":{},"queryString":{},"queryStringParameters":{},"requestContext":{"httpMethod":"ANY","identity":{},"path":"/params_log","serviceId":"service-9khp96qy","sourceIp":"120.229.9.165","stage":"release"}}`

- cos 触发器的 event 对象包括了触发执行的具体 cos 操作以及 cos 对象

`{"Records":[{"cos":{"cosBucket":{"appid":"1251133793","name":"test","region":"gz"},"cosNotificationId":"unkown","cosObject":{"key":"/1251133793/test/xxx.png","meta":{"Content-Type":"image/png","x-cos-request-id":"NWViNTZmMmFfOTJhODQwYV80MGZmXzI0Y2ZkYmM="},"size":6545739,"url":"...","vid":""},"cosSchemaVersion":"1.0"},"event":{"eventName":"cos:ObjectCreated:Put","eventQueue":"qcs:0:scf:ap-guangzhou:appid/1251133793:default.params_log.$DEFAULT","eventSource":"qcs::cos","eventTime":1588948779,"eventVersion":"1.0","reqid":1038862404,"requestParameters":{"requestHeaders":{"Authorization":"..."},"requestSourceIP":"120.229.9.165"},"reservedInfo":""}}]}`

### 第二个参数 context，函数运行时信息

我们来看一下一个完整的 context 包含的内容：

```javascript
callbackWaitsForEmptyEventLoop: true,
getRemainingTimeInMillis: 200,
memory_limit_in_mb: 128,
time_limit_in_ms: 3000,
environment: "{"SCF_NAMESPACE":"demo","TENCENTCLOUD_SECRETID":"...","TENCENTCLOUD_SECRETKEY":"...","TENCENTCLOUD_SESSIONTOKEN":"..."}"
function_name: "params",
function_version: "$LATEST",
namespace: "demo",
request_id: "ab42b693-8bfd-4dc1-b228-60360a63e06c",
tencentcloud_appid: "...",
tencentcloud_region: "ap-chengdu",
tencentcloud_uin: "..."
```

从上面的内容可以看到，该对象包含的内容有：

- 函数配置信息，比如设置的内容大小，超时时间等
- 执行身份认证信息。如果设置了函数的**运行角色**（角色必须要包含对应操作的授权策略），在环境变量中会注入 secretId，secretKey，sessionToken，在访问第三方云服务，比如 cos、自定义监控数据上报时就可以使用这几个值直接调用云 api，而不用在代码里面去 hard code 各种密钥信息
- 环境变量：包括了用户自定义的环境变量以及一些系统环境变量
- 执行环境基本信息：包括了当前函数调用的地域，用户的 appId，uin

### 第三个参数 callback 是一个可选参数，在非异步函数中返回执行结果

回调函数采用两个参数：一个 Error 和一个返回。返回对象必须与 `JSON.stringify` 兼容。异步函数将忽略 callback 的返回，必须通过 return、throw exception 或者 promise 来处理返回或错误

```javascript
const https = require('https')
let url = "https://cloud.tencent.com/"

exports.main_handler = function(event, context, callback) {
  https.get(url, (res) => {
    callback(null, res.statusCode)
  }).on('error', (e) => {
    callback(Error(e))
  })
}
```

## 函数返回

我们来看一下，针对异步场景（async 函数）和非异步场景，云函数怎么把返回值传递出去

### 异步函数

对于异步函数，可以使用 return 和 throw 来发送返回或错误。函数必须使用 async 关键字。在异步函数中，第三个参数 callback 没有定义

示例：异步函数

```javascript
const https = require('https')
let url = "https://cloud.tencent.com/"

const httpRequest = url => {
  const promise = new Promise(function(resolve, reject) {
    https
      .get(url, res => {
        resolve(res.statusCode)
      })
      .on('error', e => {
        reject(Error(e))
      })
  })
  return promise
}

exports.handler =  async function(event, context) {
  try{
    const result = await httpRequest(url)
    // 在async函数中callback未定义
    // callback(null, result)
    return result
  }catch(e) {
    throw e
  }
}
```

### 同步函数

还是上面的例子，发起一个 http 请求，如果用同步函数实现，参照以下示例

示例：同步函数，callback 返回

```javascript
const https = require('https')
let url = "https://cloud.tencent.com/"

exports.handler = function(event, context, callback) {
  https.get(url, (res) => {
    // 只能通过callback返回，return会被忽略
    callback(null, res.statusCode)
  }).on('error', (e) => {
    callback(Error(e))
  })
}
```

### 返回的时机

正常的 Node.js web framework 在 response 返回后，异步逻辑还是继续在执行的。而 Serverless 场景下，由于机制和 framework的差别，对于已经返回 responese 的情况，一种是等着异步都处理完再来返回，这样保证了一次调用的完整性。另外一种就是在返回后就直接结束当次调用，直接挂起异步处理。

腾讯云云函数针对 Node.js 的异步场景，实现了**返回和结束分离**的特殊机制。

![](https://img.serverlesscloud.cn/2020518/1589773269819-7B57B0C624042275E5113E8BE1DCB305.jpg)

- 入口函数的同步执行过程完成及返回后，云函数的调用将立刻返回，并将代码的返回信息返回给函数调用方
- 同步流程处理并返回后，代码中的异步逻辑可以继续执行和处理，直到异步事件执行完成后，云函数的实际执行过程才完成和退出。

默认情况下，函数执行会等待所有异步执行结束才算一次调用结束，但也给用户提供了关闭事件循环等待的选项，用户可以关闭事件循环等待来自行控制函数的返回时机。通过在 callback 回调执行前设置 `context.callbackWaitsForEmptyEventLoop = false`，可以使云函数在执行返回后立刻冻结进程，不再等待异步循环内的事件

比如一下示例代码，代码里面发起了一个异步 http 请求，另外有一个 2s 后执行的 setTimeout

```javascript
const https = require('https')
let url = "https://cloud.tencent.com/"

const httpRequest = url => {
  const promise = new Promise(function(resolve, reject) {
    https
      .get(url, res => {
        resolve(res.statusCode)
      })
      .on('error', e => {
        reject(Error(e))
      })
  })
  return promise
}

exports.main_handler =  async function(event, context) {
  // 设置该选项为false会不等待异步队列执行完，而是在返回后直接冻结process
  //context.callbackWaitsForEmptyEventLoop = false
  try{
    const result = await httpRequest(url)
    setTimeout(() => {
        console.log('timeout log')
    }, 2000)
    return result
  }catch(e) {
    throw e
  }
}
```

在 http 请求完成后，会立即返回给调用方，不会等待 setTimeout 的异步实践执行完。而在返回后，程序会继续执行，直到 setTimeout 的事件执行完才算本次调用结束。

在设置了 `context.callbackWaitsForEmptyEventLoop = false` 后，在 return 后进程会被冻结，setTimeout 里面的执行逻辑会被挂起

## 完整流程图

以下是单实例内 runtime 运行的完整流程图

![流程图](https://img.serverlesscloud.cn/2020518/1589773295474-E490E0A9A112F9E5B0F54C2421D891E8%E5%89%AF%E6%9C%AC.jpg)

针对 Node.js应用，有以下几个实践建议：

- 日志：runtime重写了 console 的几个主要方法，而且是在 require 用户文件之后，所以用户自定义日志选项会无效
- 缓存复用：在入口函数外可以定义变量，存储可以复用的缓存对象，比如数据库的连接等
  Node.js 的模块实现逻辑中，如果一个 module 被 require 过，该模块就会被 cache 到内存中，再次被 require时不会重新初始化。针对这一特性，如果实例一直再复用，那么在入口文件中，入口函数外定义的变量都不会被销毁，可以达到复用的效果
- 内置部分 npm 包，可以直接使用，具体参照文档。部署云函数代码时推荐 `npm install --production`，减少代码包的体积，提升上传速度和执行速度
- 执行角色：配置执行角色，从 context 中可以获取临时的密钥信息，可以用了访问有相应权限的第三方服务，而不用在代码内写死密钥信息

> 回放：点击观看 [Tencent Serverless Hours 线上分享会第一期](https://cloud.tencent.com/edu/learning/live-2437)



---

<div id='scf-deploy-iframe-or-md'></div>

---

> **传送门：**
> - GitHub: [github.com/serverless](https://github.com/serverless/serverless/blob/master/README_CN.md)
> - 官网：[serverless.com](https://serverless.com/)

欢迎访问：[Serverless 中文网](https://serverlesscloud.cn/)，您可以在 [最佳实践](https://serverlesscloud.cn/best-practice) 里体验更多关于 Serverless 应用的开发！
