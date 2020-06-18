---
title: Serverless 多环境配置方案探索
description: 业务开发完了，如何管理不同环境的配置呢？
keywords: Serverless 多环境配置,Serverless 管理环境,Serverless配置方案
date: 2020-03-10
thumbnail: https://img.serverlesscloud.cn/20191230/1577673977066-16ef85f25ee1af09.jpg
categories:
  - best-practice
authors:
  - yugasun
authorslink:
  - https://github.com/yugasun
tags:
  - Serverless
  - 管理环境
---

相信读完前面几篇有关 Serverless Component 文章的小伙伴已经体验到，它给我们开发带来的遍历。但是实际我们的日常开发项目中，并不仅仅只是单纯地一个项目部署那么简单，我们的敏捷开发流程中，还有开发、联调、测试、预发布、正式环境等关键词。那么有小伙伴就有疑惑了，我的业务开发完了，如何管理不同环境的配置呢？比如测试环境的数据库配置和正式环境的如何切换？于是抛转引入，写了此篇文章，来跟大家一起学习和探讨。

读完本篇将你将了解到：

1. Serverless Component 部署原理
2. dotenv 模块的基本使用
3. 如何基于 dotenv 来切换多环境配置
4. 如何在 `serverless.yml` 提炼通用配置

## Serverless Component

> 理论指导实践

在介绍方法之前，这里需要先对 `Serverless Component` 部署原理做个简单介绍。当我们在 `serverless.yml` 文件中配置好项目，执行 `sls --debug` 命令后，究竟发生了什么？

核心步骤如下：

```
1. 初始化 context：包括分析component依赖树，通过 dotenv 注入环境变量等。
2. 安装依赖组件模块：不同于 `npm install`, serverless component 会将 `component` 指定的 npm 模块下载并解压放到 `~/.serverless/components/registry/npm/@serverless/xxx@x.x.x` 中。
3. 执行组件模块的 `default` 函数：这个 default 函数就是开发者提供的部署逻辑代码，比如将打包压缩好的代码上传到cos，然后部署到scf。
```

本篇只需要关心第一步的环境变量注入就好。

可以发现，`Serverless Framework` 部署命令默认会帮我们注入 `.env` 文件中的环境变量到部署流程中，这也是为什么我们在使用腾讯云的组件时，需要创建一个内容如下的 `.env` 文件：

```dotenv
TENCENT_SECRET_ID=xxx
TENCENT_SECRET_KEY=xxx
```

> 注意：当然腾讯云的组件都是支持扫码一键登录的，如果你不想配置 `.env` 文件。是不是很炫酷 ~

基于此，我们就可以利用 `.env` 文件做很多事了。 比如在 `serverless.yml` 中可以通过 `${env.xxx}` 方式来获取注入的环境变量。

## dotenv 模块

> [Dotenv](https://github.com/motdotla/dotenv) 是一个能够通过 `.env` 文件将环境变量注入到 [process.env](https://nodejs.org/docs/latest/api/process.html#process_process_env) 的模块。

具体使用很简单，先安装 `npm install dotenv --save`，然后在你的项目入口文件中引入即可：

```js
require("dotenv").config();
```

## 管理多环境配置

说了这么多，终于到了本篇的正题。这里以 [tencent-koa](https://github.com/serverless-components/tencent-koa) 组件为例，我们先初始化我们的项目：

```bash
# 此命令会将指定包含 `serverless.yml` 的 github 目录作为项目模板，拷贝到本地
$ serverless create --template-url https://github.com/yugasun/tencent-serverless-demo/tree/master/serverless-env

# 安装依赖
$ cd severless-env && npm install
```

然后新建两个配置文件，分别为：

```dotenv
# .env.test 文件内容
USER_NAME=yugasun_test
USER_EMAIL=yugasun_test@163.com

# .env.release 文件内容
USER_NAME=yugasun_release
USER_EMAIL=yugasun_release@163.com
```

然后新建入口文件 `app.js`：

```js
const dotenv = require("dotenv");
const Koa = require("koa");
const KoaRouter = require("koa-router");

const { CODE_ENV } = process.env;
dotenv.config({
  path: `${__dirname}/.env.${CODE_ENV}`
});

const app = new Koa();
const router = new KoaRouter();

router.get("/", async ctx => {
  ctx.body = {
    name: process.env.USER_NAME,
    email: process.env.USER_EMAIL
  };
});

app.use(router.allowedMethods()).use(router.routes());

// don't forget to export!
module.exports = app;
```

这是一个简单的 demo，通过云函数注入的环境变量 `CODE_ENV`，来读取不同的 `.env.xxx` 配置，从而实现不同环境的配置切换，核心代码就是:

```js
const { CODE_ENV } = process.env;
dotenv.config({
  path: `${__dirname}/.env.${CODE_ENV}`
});
```

> 备注：这里 dotenv 的 config 函数是可以指定 `path` 为目标 `.env` 文件路径。

所以只需要给云函数配置一个环境变量 `CODE_ENV` 就可以了，接下来我们来编写 `serverless.yml` 文件：

```yaml
# 当前运行环境
CODE_ENV: test

MyExpress:
  component: "@serverless/tencent-koa"
  inputs:
    region: ap-guangzhou
    functionName: express-function
    code: ./
    functionConf:
      timeout: 10
      memorySize: 128
      environment:
        variables:
          CODE_ENV: ${CODE_ENV}
    apigatewayConf:
      protocols:
        - http
        - https
      environment: ${CODE_ENV}
```

相信大家都知道可以通过 `functionConf.environment.variables` 来配置环境变量。
这里不仅配置了云函数的环境变量，同时也配置了 `apigatewayConf.environment`，以此来区分 API 网关的测试和发布环境。

> 小技巧：可以在 `yml` 文件的顶端定义公共变量 `CODE_ENV`，然后通过 `${CODE_ENV}` 的方式引用变量。

然后执行部署命令 `sls --debug`，部署成功后访问创建成功的 `url` 链接，就可以看到配置的环境变量结果了：

```json
{
  "name": "yugasun_test",
  "email": "yugasun_test@163.com"
}
```

当我们开发完，需要部署到发布环境，只需要修改 `serverless.yml` 中的 `CODE_ENV` 值为 `release`，然后重新部署就行。

## 配置优化 1

细心的小伙伴会发现：部署成功的云函数，虽然可以成功地读取不同环境配置，但是每次部署都会将 `.env.test` 和 `.env.release` 两份配置文件同时上传。有时我们并不想暴露生产环境的配置在测试环境，因此需要每次部署时，只上传对应配置文件。要做到这一点，只需要在 `serverless.yml` 配置文件中新增 `exclude` 和 `incldue` 配置:

```yml
CODE_ENV: release

MyExpress:
  component: "@serverless/tencent-koa"
  inputs:
    region: ap-guangzhou
    functionName: express-function
    code: ./
    exclude:
      - .env.release
      - .env.test
    include:
      - .env.${CODE_ENV}
    functionConf:
      timeout: 10
      memorySize: 128
      environment:
        variables:
          CODE_ENV: ${CODE_ENV}
    apigatewayConf:
      protocols:
        - http
        - https
      environment: ${CODE_ENV}
```

这里先通过 `exclude` 配置忽略所有配置文件，然后通过 `include` 来包含指定的配置文件。之所以这么做，是因为我们指定了 `code` 字段为 `./ - 项目根目录` ，因此会默认上传项目根目录的所有文件。

## 配置优化 2

当然也可以将 `serverless.yml` 中的任何固定参数写到 `.env` 文件中，比如这里的 `CODE_ENV` 变量，然后通过 `${env.CODE_ENV}` 引用即可。比如我们将 `CODE_ENV` 写入到 `.env` 中：

```dotenv
CODE_ENV=release
```

然后修改 `serverless.yml` 配置：

```yml
MyExpress:
  component: "@serverless/tencent-koa"
  inputs:
    region: ap-guangzhou
    functionName: express-function
    code: ./
    exclude:
      - .env.release
      - .env.test
    include:
      - .env.${env.CODE_ENV}
    functionConf:
      timeout: 10
      memorySize: 128
      environment:
        variables:
          CODE_ENV: ${env.CODE_ENV}
    apigatewayConf:
      protocols:
        - http
        - https
      environment: ${env.CODE_ENV}
```

需要说明的是 `.env` 文件有个缺点，就是无法定义对象和数组。但是对于私密的配置，还是放到 `.env` 中比较合适，这样就可以基于文件去忽略部署。

## 配置优化 3

当需要将同一份业务代码部署到不同的地区，但是函数参数配置和 API 网关配置都是一致时，如何配置呢？这里一样可以提炼出通用配置，如下：

```yml
# global config
CODE_ENV: release

# function config
FUNC_CONF:
  name: express-function
  memorySize: 128
  timeout: 10
  environment:
    variables:
      CODE_ENV: ${CODE_ENV}

# apigw config
API_CONF:
  protocols:
    - http
    - https
  environment: ${CODE_ENV}

# guangzhou service
MyExpressGZ:
  component: "@serverless/tencent-koa"
  inputs:
    region: ap-guangzhou
    functionName: ${FUNC_CONF.name}
    code: ./
    exclude:
      - .env.release
      - .env.test
    include:
      - .env.${CODE_ENV}
    functionConf: ${FUNC_CONF}
    apigatewayConf: ${API_CONF}

# beijing service
MyExpressBJ:
  component: "@serverless/tencent-koa"
  inputs:
    region: ap-beijing
    functionName: ${FUNC_CONF.name}
    code: ./
    exclude:
      - .env.release
      - .env.test
    include:
      - .env.${CODE_ENV}
    functionConf: ${FUNC_CONF}
    apigatewayConf: ${API_CONF}
```

## 如何选择配置方案

本文介绍了两种方案：

1. 通过 `.env` 配置
2. 通过在 `serverless.yml` 中定义变量

他们都可以定义全局变量，那么在实际开发中如何去抉择使用呢？

> 注意：`serverless.yml` 定义的变量，或者 `.env` 中自动注入的变量，只有在执行 `sls --debug` 命令后，才能够获取到。实际部署成功的代码，是需要通过 `dotenv` 模块来指定 `.env` 文件来手动加载注入的。当然如果你也可以通过解析 `serverless.yml` 文件来获取需要的变量也是可以的。

通常我会将跟 `执行部署时的配置` 放到 `serverless.yml` 中，将 `业务相关的配置` 放到 `.env` 文件中。当然，这里只是个人建议，具体如何去配置还是要看个人使用习惯。

## 其他语言

虽然本文只是讲述了如何在 `Nodejs` 项目中管理多环境配置，但是其他语言基本都实现了 `dotenv` 模块，所以此方法是通用的，比如 `Python` 的 `python-dotenv` 模块，使用起来基本差不多：

```python
# settings.py
from dotenv import load_dotenv
from pathlib import Path  # python3 only
env_path = Path('.') / '.env.test'
load_dotenv(dotenv_path=env_path)
```

## 总结

本篇涉及到所有源码都维护在开源项目 [tencent-serverless-demo](https://github.com/yugasun/tencent-serverless-demo) 中 [serverless-env](https://github.com/yugasun/tencent-serverless-demo/tree/master/serverless-env)

全文到这里就结束了，当然这只是本人在日常开发中总结的经验而已，如果你有更好的实践方式，欢迎一起为 Serverless 开源社区做贡献。



---
<div id='scf-deploy-iframe-or-md'></div>

---

> **传送门：**
> - GitHub: [github.com/serverless](https://github.com/serverless/serverless/blob/master/README_CN.md)
> - 官网：[serverless.com](https://serverless.com/)

欢迎访问：[Serverless 中文网](https://serverlesscloud.cn/)，您可以在 [最佳实践](https://serverlesscloud.cn/best-practice) 里体验更多关于 Serverless 应用的开发！
