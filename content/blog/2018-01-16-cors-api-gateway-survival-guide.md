---
title: 生存指南之 CORS + API Gateway
description: 本文介绍了跨域资源共享的基本知识，以及如何避免云函数上 Serverless web API 的问题
keywords: CORS,API Gateway,Serverless web API 
date: 2018-01-16
thumbnail: https://img.serverlesscloud.cn/20191231/1577795409089-CORS_principle.png
categories:
  - guides-and-tutorials
  - operations-and-observability
authors:
  - AlexDeBrie
authorslink:
  - https://serverless.com/author/alexdebrie/
translators: 
  - Aceyclee
translatorslink: 
  - https://www.zhihu.com/people/Aceyclee
tags:
  - CORS
  - API 网关
---

构建 Web API 是 Serverless 应用中最流行的用例之一，您能在不增加其他操作开销的情况下，获得简单、可扩展的后端优势。

然而，如果您的网页正在调用后端 API，那么必须处理 [跨域资源共享 (CORS)](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Access_control_CORS) 的问题 ，如果您的网页向与您当前所在域的不同域发出 HTTP 请求，则它必须是 CORS 友好的。

如果您发现以下错误：

> No 'Access-Control-Allow-Origin' header is present on the requested resource

那么本文可能对您有所帮助。

接下来，我们将介绍 Serverless + CORS 的相关信息，目录如下：

- [预检请求 (Preflight requests)](#cors-preflight-requests)
- [响应头 (Response headers)](#cors-response-headers)
- [CORS with cookie credentials](#cors-with-cookie-credentials)


## TL;DR

快速开始 🔜 如果您想快速解决 Serverless 应用中的 CORS，可以执行以下操作：

1. 要处理 [preflight requests](#cors-preflight-requests)，在每个 HTTP 端点中添加 `enableCORS: true` 和  `integratedResponse: true` 标记：

```yml
# serverless.yml
service: products-service

provider:
  name: tencent
  region: ap-guangzhou
  runtime: Nodejs8.9 # Nodejs8.9 or Nodejs6.10

plugins:
  - serverless-tencent-scf

functions:
  getProduct:
    handler: handler.getProduct
    events:
      - apigw:
          name: api
          parameters:
            path: /product
            stageName: release
            # 修改成你的 API 服务 ID
            serviceId: service-xxx
            httpMethod: GET
            # 开启集成相应，这里必须开启，才能自定义响应 headers
            integratedResponse: true,
            # 开启 CORS
            enableCORS: true
  createProduct:
    handler: handler.createProduct
    events:
      - apigw:
          name: api
          parameters:
            path: /product
            stageName: release
            # 修改成你的 API 服务 ID
            serviceId: service-xxx
            httpMethod: POST
            # 开启集成相应，这里必须开启，才能自定义响应 headers
            integratedResponse: true,
            # 开启 CORS
            enableCORS: false
```

2. 要处理 [CORS headers](#cors-response-headers)，请在响应中返回 CORS headers。主要标头是 `Access-Control-Allow-Origin` 和 `Access-Control-Allow-Credentials`。示例如下：

```javascript
'use strict';

// mock function
function retrieveProduct(event) {
  return {
    id: 1,
    name: 'good1',
    price: 10,
  };
}

// mock function
function createProduct(event) {
  const { queryString } = event;
  return {
    id: Number(queryString.id),
    name: 'good1',
    price: 10,
  };
}

module.exports.getProduct = (event, context, callback) => {
  const product = retrieveProduct(event);

  const response = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify({
      product: product,
    }),
  };

  callback(null, response);
};

module.exports.createProduct = (event, context, callback) => {
  // Do work to create Product
  const product = createProduct(event);

  const response = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify({
      product: product,
    }),
  };

  callback(null, response);
};
```

## CORS preflight requests

如果您不是在进行「simple request」，那么浏览器会用  `OPTIONS` 方法，发送 **preflight
request** 到资源里，您请求的资源将使用 安全发送到资源 的方法返回，并且可以选择返回有效发送的标头。


我们拆开来看看：

### 浏览器什么时候发送 preflight requests?

您的浏览器会对几乎所有的跨域请求发送一个 preflight requests。（例外是「simple requests」，但这只是请求的一小部分）。大体上看，一个简单请求只是一个 `GET` request 或者 `POST` request，如果您不在此范围内，则需要进行预检。


### 对 preflight requests 的响应是什么？

对一个 preflight requests 的 响应包括其允许访问的资源，它允许在该资源的方法，如 `GET`, `POST`,
`PUT` 等。还可以包括被允许在该资源标头，如 `Authentication`。


### 如何处理 Serverless 中的 preflight requests?

要设置 preflight requests，您只需要在 API Gateway 的端点上配置一个 `OPTIONS` 。幸运的是，你可以非常简单地使用 Serverless Framework 来完成。

只需要在 `serverless.yml` 添加设置 `enableCORS: true`：


```yml
# serverless.yml

service: products-service

provider:
  name: tencent
  region: ap-guangzhou
  runtime: Nodejs8.9 # Nodejs8.9 or Nodejs6.10

plugins:
  - serverless-tencent-scf

functions:
  getProduct:
    handler: handler.getProduct
    events:
      - apigw:
          name: api
          parameters:
            path: /product
            stageName: release
            serviceId: service-lanyfiga
            httpMethod: GET
            # 开启集成相应，这里必须开启，才能自定义响应 headers
            integratedResponse: true,
            # 开启 CORS
            enableCORS: true
  createProduct:
    handler: handler.createProduct
    events:
      - apigw:
          name: api
          parameters:
            path: /product
            stageName: release
            serviceId: service-lanyfiga
            httpMethod: POST
            # 开启集成相应，这里必须开启，才能自定义响应 headers
            integratedResponse: true,
            # 开启 CORS
            enableCORS: false
```

## CORS Response Headers

尽管 preflight request 仅适用于某些跨域请求，但每个跨域请求中都必须存在 CORS Response Headers，这意味着您必须将 `Access-Control-Allow-Origin` 添加进 handlers 的响应中。

如果您使用 cookies，还需要添加 `Access-Control-Allow-Credentials`。

要与上面的 `serverless.yml` 匹配，`handler.js` 文件应该如下设置：

```javascript
// handler.js

'use strict';

module.exports.getProduct = (event, context, callback) => {
  // Do work to retrieve Product
  const product = retrieveProduct(event);

  const response = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify({
      product: product,
    }),
  };

  callback(null, response);
};

module.exports.createProduct = (event, context, callback) => {
  // Do work to create Product
  const product = createProduct(event);

  const response = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify({
      product: product,
    }),
  };

  callback(null, response);
};
```

这里需要注意 `response` 的 `headers` 属性，其中包含 `Access-Control-Allow-Origin` 和 `Access-Control-Allow-Credentials`。

下面是一个简单的示例：

```javascript
// hello.js

const middy = require('middy');
const { cors } = require('middy/middlewares');

// This is your common handler, no way different than what you are used to do every day
const hello = (event, context, callback) => {
  const response = {
    statusCode: 200,
    body: 'Hello, world!',
  };

  return callback(null, response);
};

// Let's "middyfy" our handler, then we will be able to attach middlewares to it
const handler = middy(hello).use(cors()); // Adds CORS headers to responses

module.exports = { handler };
```


## CORS with Cookie credentials

在上面的示例中，我们给定了 "\*" 作为 `Access-Control-Allow-Origin` 的值。但是，如果您使用 [request using credentials](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS#Requests_with_credentials) 则不被允许。为了使浏览器能够响应，`Access-Control-Allow-Origin` 需要包含发出请求的特定来源。有两种方法可以解决。

首先，如果只有一个发出请求的原始网站，则可以将其硬编码到云函数的响应中：

```javascript
// handler.js

'use strict';

module.exports.getProduct = (event, context, callback) => {
  // Do work to retrieve Product
  const product = retrieveProduct(event);

  const response = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': 'https://myorigin.com', // <-- Add your specific origin here
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify({
      product: product,
    }),
  };

  callback(null, response);
};
```

如果有多个原始网站使用您的 API，那么需要采用一种更加动态的方法。你可以检查 `origin` header 看看是否在被批准的来源列表中，如果是，则在 `Access-Control-Allow-Origin` 返回原点值。

```javascript
// handler.js

'use strict';

const ALLOWED_ORIGINS = [
	'https://myfirstorigin.com',
	'https://mysecondorigin.com'
];

module.exports.getProduct = (event, context, callback) => {

  const origin = event.headers.origin;
  let headers;

  if (ALLOWED_ORIGINS.includes(origin) {
    headers = {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Credentials': true,
    },
  } else {
    headers = {
      'Access-Control-Allow-Origin': '*',
    },
  }

  // Do work to retrieve Product
  const product = retrieveProduct(event);

  const response = {
    isBase64Encoded: false,
    statusCode: 200,
    headers
    body: JSON.stringify({
      product: product
    }),
  };

  callback(null, response);
};
```
在这个示例中，我们检查 `origin` header 是否匹配。如果匹配，我们会在 `Access-Control-Allow-Origin` 包含特定来源，并声明 `Access-Control-Allow-Credentials` 允许的来源。如果 `origin` 不是我们允许的来源之一，则我们将包含标准 headers，如果来源尝试进行凭据请求，则将被拒绝。

## 小结

处理 CORS 确实是一件麻烦的事情，但是使用 Serverless Framework 会让处理步骤变得简单得多！而这也就意味着再也不会出现 `No 'Access-Control-Allow-Origin' header is present on the requested resource` 这样的错误啦！👋

> 参考：
> - [Serverless Framework - 产品官网](www.serverless.com) 
> - [Serverless Framework - GitHub](https://github.com/serverless/serverless/blob/master/README_CN.md) 

欢迎访问：[Serverless 中文技术社区](https://serverlesscloud.cn/)，您可以在 [最佳实践](https://serverlesscloud.cn/best-practice) 里体验更多关于 Serverless 应用的开发！
