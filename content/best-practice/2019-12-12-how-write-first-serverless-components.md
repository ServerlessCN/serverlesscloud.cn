---
title: 如何开发自己的第一个 Serverless Component
description: 我们分享了不少基于 Component 的最佳实践案例，本文教你如何自己开发一个 Component！
keywords: Serverless Component,最佳实践案例,开发Component,实践案例
date: 2019-12-12
thumbnail: https://img.serverlesscloud.cn/20191230/1577673977066-16ef85f25ee1af09.jpg
categories:
  - best-practice
authors:
  - yugasun
authorslink:
  - https://yugasun.com
tags:
  - Wintersmith
  - Component
---

## 前言

上一篇 [基于 Serverless Component 的全栈解决方案](https://serverlesscloud.cn/best-practice/2019-12-5-Full-stack-solution-based-on-serverless-component/) 介绍 Serverless Component 是什么和如何使用 Serverless Component 开发一个全栈应用。但是目前社区还不够完善，当我们需要一个还没有的组件时，怎么办呢？

与其向官方提交  `issue`，说明需求，不如自己动手撸一个，岂不快哉~


##  Serverless Component 运行机制

在开始开发之前，我们先来了解下 Serverless Component 的运行机制：

每个 Serverless Component 实际上就是一个 `npm` 包，你可以通过 `npm install` 命令直接安装。当我们在一个依赖 Serverless Component 的应用中，执行命令 `serverless --debug` 部署时，它首先会读取 `serverless.yml` 文件中的 `component` 参数指定组件模块，它会像安装 `npm` 包一样，自动安装到本地，然后自动注入该组件模块，同时执行组件中的 `default` 函数（之后会讲到），从而完成部署流程。

## 开发步骤

一个完整组件的开发流程应该包括以下流程：

1. 明确功能需求
2. 定义组件配置：输入和输出参数
3. 组件开发：default 函数、remove 函数（可选）
4. 测试组件
5. 发布 npm 包

接下来将按照以上步骤，一步一步实现腾讯云 CDN 组件。

## 1. 明确功能需求

[腾讯云 CDN 控制台](https://console.cloud.tencent.com/cdn) 已经提供了手动配置加速域名的功能，但是作为一名懒惰的程序员，「手动」 一直都是我尝试规避的问题。于是去看了看腾讯云文档，看看官方有没有提供相应便捷的方式。果不其然腾讯云 API 已经提供了相关接口，那么我们为什么不借助 API 实现一个能够帮助我们自动配置的 CDN 组件呢？

需求很明确：开发一个能够自动配置 CDN 加速域名的组件，帮助我们节省手动配置时间。

## 2. 定义组件配置

要实现 CDN 域名的添加，需要借助 2 个腾讯云 API 接口：[新增加速域名](https://cloud.tencent.com/document/product/228/1406)、[HTTPS 配置](https://cloud.tencent.com/document/product/228/12965)。通过阅读这两份接口文档，总结出一份配置说明文件 `config.md` ，内容如下：

```yaml
MyCDN:
  component: '@serverless/tencent-cdn'
  inputs:
    host: abc.com
    hostType: cos
    origin: www.test.com
    backupOrigin: www.test.com
    serviceType: web
    fullUrl: on
    fwdHost: ww.test.com
    cache:
      - type: 0
        rule: all
        time: 1000
      - type: 0
        rule: all
        time: 1000
    cacheMode: simple
    refer:
      - type: 1
        list:
          - 'qq.baidu.com'
          - '*.baidu.com'
    accessIp:
      type: 1
      list:
        - '1.2.3.4'
        - '2.3.4.5'
    https:
      certId: 123
      cert: 123
      privateKey: 123
      http2: off
      httpsType: 2
      forceSwitch: -2
```

其中 `inputs` 就是组件的输入参数，其实这些参数都是从接口文档中拷贝出来而已，实际开发时，需根据自己组件功能，定制化配置就好。

> 无服务框架的配置都是 `yaml` 文件，所以在定义组件配置时，需要将 API 的参数做好 `yaml` 规范映射。比如  `yaml` 文件中，符号 `-`  是用来定义数组的。如果对 yaml 语法还不太熟，可以参考这份 [YAML 语言教程](https://www.ruanyifeng.com/blog/2016/07/yaml.html)。

组件输入定义好了，还需要定义输出内容，只需要大致的组织 API 请求返回结构就行，尽量简洁明了：

```
{
	host: 'abc.com',
	hostId: '123'
	origin: 'www.test.com',
	cname: 'www.test.com.cdn.dnsv1.com',
	https: true
}
```

## 3. 组件开发

对于一个标准的 Serverless Component  ，结构如下：

```js
// serverless.js
const { Component } = require('@serverless/core')
class MyComponent extends Component {
  /*
   * Default (必须)
   * - default 是用来执行、准备和更新你的组建的函数
   * - 执行命令 `$ serverless` 会运行此函数
   * - You can run this function by running the "$ serverless" command
   */
  async default(inputs = {}) {
    return {}
  }

  /*
   * Remove (可选)
   * - 如果你的组件需要删除基础设施，推荐你添加他
   * - 执行命令 `$ serverless remove` 会运行此函数
   */
  async remove(inputs = {}) {
    return {}
  }

  /*
   * Anything (可选)
   * - 如果你想发布带有额外功能的组件，你可以将逻辑写在一个函数里，函数名可以自定义
   * - 执行命令 `$ serverless anything` 会运行此函数
   */
  async anything(inputs = {}) {
    return {}
  }
}
module.exports = MyComponent
```

了解了组件的结构，接下来，就开始开发吧~

#### 3.1 初始化项目

创建项目目录 `tencent-cdn`，执行 `npm init` 初始化项目，根据命令指引，填写相关信息就行：

```shell
$ npm init
This utility will walk you through creating a package.json file.
It only covers the most common items, and tries to guess sensible defaults.

See `npm help json` for definitive documentation on these fields
and exactly what they do.

Use `npm install <pkg>` afterwards to install a package and
save it as a dependency in the package.json file.

Press ^C at any time to quit.
package name: (cdn-module) tencent-cdn
version: (1.0.0)
description: Tencent Cloud CDN Component
entry point: (index.js) serverless.js
test command:
git repository:
keywords: cdn,serverless,serverless-component,serverlesscomponent,tencent
author: yugasun
license: (ISC) MIT
About to write to /Users/yugasun/Desktop/Develop/serverless/cdn-module/package.json:

{
  "name": "tencent-cdn",
  "version": "1.0.0",
  "description": "Tencent Cloud CDN Component",
  "main": "serverless.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [
    "cdn",
    "serverless",
    "serverless-component",
    "serverlesscomponent",
    "tencent"
  ],
  "author": "yugasun",
  "license": "MIT"
}


Is this OK? (yes)
```

然后新建 `serverless.js` 文件，复制上面的模板代码到 `serverless.js` 文件中。

#### 3.2 编写 default 函数

`default` 函数代码，这里就不贴出来了，有点多 o(╯□╰)o。

主要思路就是，根据 `inputs` 输入参数，规范成接口请求参数，然后请求接口，执行配置就好。

对于腾讯云 API，所有的接口请求都需要鉴权，所以这里需要先实例化一个 `Capi`，如下：

```js
import { Capi } from '@tencent-sdk/capi'
const capi = new Capi({
	SecretId: this.context.credentials.tencent.SecretId,
  SecretKey: this.context.credentials.tencent.SecretKey,
  ServiceType: 'cdn',
})
```

> 注意：关于请求云 API 库 [@tencent-sdk/capi](https://www.npmjs.com/package/@tencent-sdk/capi) 说明文档已经很全面了，当然你也可以在这里看到 [源码](https://github.com/yugasun/tencent-sdk/blob/master/packages/capi/README.md).

它需要传入 `SecretId`、`SecretKey`、`ServiceType` 三个参数，`SecretId` 和 `SecretKey` 可以通过 `this.context.credentials.tencent` 来获取，执行  `serverless` 命令在执行时，它会根据用户项目根目录配置的 `.env` 文件，自动注入到 `this.context.credentials.tencent` 上。`ServiceType` 是当前服务类型，这是腾讯云 API 定义的，针对不同业务配置相应参数就行。

> 注意：不同的云服务商挂到 `this.context.credentials` 上的属性也是不一样，比如这里腾讯云是 `tencent`，AWS 是 `aws`，目前支持的所有云服务商的属性配置源码，在这里可以找到，[@serverless/cli](https://github.com/serverless/cli/blob/master/src/Context.js#L105)

然后请求 [新增加速域名](https://cloud.tencent.com/document/product/228/1406) 接口：

```js
// cdnInputs 就是我们组装好的请求参数
await AddCdnHost(capi, cdnInputs)
```

这里有个重点：请求 `新增加速域名` 接口成功返回后，CDN 并不会立即部署成功，这个是需要时间的，所以我们执行后，需要轮训当前新增域名的状态，当为部署成功时，我们才能进行之后的逻辑。

#### 3.3 组件状态保存

 Serverless Component 在执行  `default` 函数时，它会产生一些状态，比如新增 CDN 域名成功后，会产生一个 `hostId`，我们可以保存在 `this.state` 对象中，通过执行 `this.save()` 函数，它会将 `this.state` 保存到项目根目录的 `.serverless` 文件夹中一个名为 `Template.MyCDN.json` （`MyCDN` 是我定义的当前 Serverless 应用的名称）文件中，方便之后在做组件建删除时使用。

#### 3.4 编写 remove 函数

Serverless Component 删除的逻辑，就是再 `serverless remove` 命令时，它会读取 `default` 函数执行保存到 `.serverless` 中的状态文件，并注入到 `this.state` 上 , 然后我们可以根据 `state` 中的值进行移除，比如我这里会用到 `host`, 因为 [删除加速域名接口](https://cloud.tencent.com/document/product/228/1396) 需要传递 `host` 参数。

#### 3.5 完善说明文档

开源项目的 README 一定要写的清晰明了，方便开发者顺利的使用和开发。

## 4. 测试组件

到这里我们组件的基本开发完成了，在发布之前，还得进行本地测试，Serverless Framework 提供了一个很好地本地调试方法，就是应用的 `serverless.yml` 中 `component` 可以指定本地项目路径，比如在 `tencent-cdn` 目录下，创建 `test` 文件夹，然后新增 `serverless.yml` 配置如下：

```yml
MyCDN:
  component: ../
  inputs:
    host: abc.com
    ...
```

这里的 `../` 就是相对路径，因为 `tencent-cdn` 组件的 `serverless.js` 文件在 `tencent-cdn` 根目录下，之后我们就可以进入 `test` 目录，执行部署和移除操作，来测试我们的组件了。

> 注意：虽然一个 Serverless Component 是一个 npm 模块，我们可以通过 `package.json` 中的 `main` 属性指定项目中任意的文件入口，但是如果没有 `serverless.js` 文件，`serverless` 命令是没法通过 `component` 指定的本地路径调试的。

## 5. 发布 npm 包

发布 npm 包，首先需要你拥有一个 npm 账号，请先前往 [npm官网](https://www.npmjs.com) 注册，然后本地执行 `npm login` 登录你的账号。

经过测试没问题，就可以执行 `npm publish` 就可以发布到 npm 仓库了。

## 源码

最终实现源码：[@serverless/tencent-cdn](https://github.com/serverless-components/tencent-cdn)。

## 组件引用

每个组件实例，都会有个 `load` 方法，我们可以通过此方法来加载其他组件，如下：

```js
const cdnComp = await this.load('@serverless/tencent-cdn', 'cdnComp');
```

借助此功能，我们可以实现很多高阶组件，比如 [@serverless/tencent-website](https://github.com/serverless-components/tencent-website) 就是一个很好地案例。

至于如何组合你的组件，实现自己的需求，就靠你自己去天马行空了，是不是已经跃跃欲试了？快来社区贡献你的一份力量吧~

## 组件开发模板

以上基于腾讯云 [Serverless Framework](https://cloud.tencent.com/product/sf) 来实现，这里还有个 Serverless Component 开发模板，可以帮你快速开发一个 Serverless Component：[模板链接](https://github.com/yugasun/serverless-component-template)，英文好的话可以查看这两篇内容[《How to write your first Serverless Component》](https://serverless.com/blog/how-write-first-serverless-component)和[《Building Serverless Components》](https://github.com/serverless/components/#building-components)



---
<div id='scf-deploy-iframe-or-md'></div>

---

> **传送门：**
> - GitHub: [github.com/serverless](https://github.com/serverless/serverless/blob/master/README_CN.md)
> - 官网：[serverless.com](https://serverless.com/)

欢迎访问：[Serverless 中文网](https://serverlesscloud.cn/)，您可以在 [最佳实践](https://serverlesscloud.cn/best-practice) 里体验更多关于 Serverless 应用的开发！
