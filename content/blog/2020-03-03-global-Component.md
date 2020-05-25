---
title: Serverless 组件开发尝试：全局变量组件和单独部署组件
description: 为了方便，我开发了这样的 Component
keywords: Serverless 全局变量组件,Serverless 单独部署组件,Serverless Component
date: 2020-03-03
thumbnail: https://img.serverlesscloud.cn/202034/1583323516946-v2-1a569e74722930de772e470209db3c05_1200x500.jpg
categories:
  - guides-and-tutorials
  - user-stories
authors:
  - Anycodes
authorslink:
  - https://www.zhihu.com/people/liuyu-43-97
tags:
  - Serverless
  - Component
---

## 前言

实事求是地说，Serverless Framework 的 Components 真的好用，原先使用 SCF CLI 和 VSCode 插件部署腾讯云函数尽管也方便，但也只能部署云函数。

假如我有静态资源，想配置 CDN，想绑定域名，或者其他更多的操作......可能都离不开控制台。但是 Serverless Framework 的 Components 几乎可以让我暂时告别控制台。对这样的一个工具，我真的 respect！

然而就在我尝试使用 Components 做稍微大一点的项目，遇到了两个不算问题的问题，但也着实让人抓狂。

1. Component 没有全局变量；
2. Component 不能单独部署；

> 再进行下文阅读前，可以先了解这些背景知识：
>
> - [Serverless Component 是什么，我怎样使用它？](https://serverlesscloud.cn/blog/2018-04-25-what-are-serverless-components-how-use/)
> - [如何开发自己的第一个 Serverless Component](https://serverlesscloud.cn/best-practice/2019-12-12-how-write-first-serverless-component/)

## 全局变量组件

如果只有一个组件需要部署，例如下面这个 Yaml，那么全局变量存在的意义的确不大。

```yaml
hello_world:
  component: "@serverless/tencent-website"
  inputs:
    code:
      src: ./public
      index: index.html
      error: index.html
    region: ap-shanghai
    bucketName: hello_world
```

但是实际生产中，一个 Yaml 中会写很多的部分。

例如我的 Blog 的 Yaml：https://github.com/anycodes/ServerlessBlog/blob/master/serverless.yaml。这里面共有十几个函数，如果没有全局变量的话，那可能真的是噩梦。

比方有 10 个函数，这些函数都要部署在 ap-guangzhou。部署完成之后，我又要把它们部署到 ap-shanghai 区，如果没有全局变量，就要修改十几个函数的配置。即使批量替换修改，也可能出现问题。所以，此时若有全局变量的组件，就显得尤为重要。

为此，我贡献了这样一个组件：serverless-global。通过这个组件，我们可以设置一些全局变量，在程序中使用：

```yaml

Conf:
  component: "serverless-global"
  inputs:
    region: ap-shanghai
    mysql_host: gz-cdb-mytest.sql.tencentcdb.com
    mysql_user: mytest
    mysql_password: mytest
    mysql_port: 62580
    mysql_db: mytest

Album_Login:
  component: "@serverless/tencent-scf"
  inputs:
    name: Album_Login
    codeUri: ./album/login
    handler: index.main_handler
    runtime: Python3.6
    region: ${Conf.region}
    environment:
      variables:
        mysql_host: ${Conf.mysql_host}
        mysql_port: ${Conf.mysql_port}
        mysql_user: ${Conf.mysql_user}
        mysql_password: ${Conf.mysql_password}
        mysql_db: ${Conf.mysql_db}
```

通过 serverless-global，我们可以定义一些全局的公共参数，并且通过变量的方法引用这些参数，例如 `${Conf.region}` 就是引用 Conf-inputs 中定义的 region 变量。期待 Serverless 团队在未来能支持全局变量的功能。

## 单独部署组件

还是 Serverless Blog 这个例子，里面有多个模块，包括十几个函数、API 网关以及 Website 等。初次部署真的爽歪歪+美滋滋：一键部署就是爽！

但是，当我修改其中的某个函数，仅仅修改了一个配置信息，我再执行 `sls --debug` 部署的时候，它竟然又为我重新部署了一次！部署一次约 10min，可我仅仅修改了一行代码。虽说不是什么大问题，但体验也不如人意：为什么 Component 没有指定部署某个资源的功能？

我猜想：如果可通过某个参数，来控制我要部署那个资源，该有多好？

例如：我用命令 `sls --debug -n website` 可以只部署 website，而不是全部资源再跑一次部署，那多方便啊！于是我思前想后，通过简单的几行代码，实现了一套非常简单的 Component：

![流程图](https://img.serverlesscloud.cn/202034/1583327304232-liucheng.png)

是的，我就是在官方 Component 上层，嵌套了一个 tempComponent。使用方法很简单，例如，有这么一个 website 的部分：

```yaml
test1:
  component: "@serverless/tencent-website"
  inputs:
    code:
      src: ./public
      index: index.html
      error: index.html
    region: ap-shanghai
    bucketName: test1
```

把里面 component 的名字改一下，改成@gosls：

```yaml
test1:
  component: "@gosls/tencent-website"
  inputs:
    code:
      src: ./public
      index: index.html
      error: index.html
    region: ap-shanghai
    bucketName: test1
```

这样就变成了支持部署单个组件的 component 了，并且所有腾讯云的组件都可以通过修改前面的前缀进行变化，如果不想用了，可以随时修改回 @serverless，下面的 inputs 的内容和格式，和官方的一模一样，直接转发给对应的 @serverless/tencent-website。例如：

```yaml
# serverless.yml

test1:
  component: "@gosls/tencent-website"
  inputs:
    code:
      src: ./public
      index: index.html
      error: index.html
    region: ap-shanghai
    bucketName: test1


test2:
  component: "@gosls/tencent-website"
  inputs:
    code:
      src: ./public
      index: index.html
      error: index.html
    region: ap-shanghai
    bucketName: test2


test3:
  component: "@gosls/tencent-website"
  inputs:
    code:
      src: ./public
      index: index.html
      error: index.html
    region: ap-shanghai
    bucketName: test3

```

执行 `sls --debug`：

```
DFOUNDERLIU-MB0:website_test dfounderliu$ sls --debug

  DEBUG ─ Resolving the template's static variables.
  DEBUG ─ Collecting components from the template.
  DEBUG ─ Downloading any NPM components found in the template.
  DEBUG ─ Analyzing the template's components dependencies.
  .....
  DEBUG ─ Website deployed successfully to URL: http://test2-1256773370.cos-website.ap-shanghai.myqcloud.com.
  DEBUG ─ Website deployed successfully to URL: http://test3-1256773370.cos-website.ap-shanghai.myqcloud.com.

  test1: 
    url: http://test1-1256773370.cos-website.ap-shanghai.myqcloud.com
    env: 
  test2: 
    url: http://test2-1256773370.cos-website.ap-shanghai.myqcloud.com
    env: 
  test3: 
    url: http://test3-1256773370.cos-website.ap-shanghai.myqcloud.com
    env: 

  19s › test1 › done
```

可以看到完成了三个的部署，当我使用参数，执行部署 test2 的时候：

```

DFOUNDERLIU-MB0:website_test dfounderliu$ sls --debug -n test2

  DEBUG ─ Resolving the template's static variables.
  DEBUG ─ Collecting components from the template.
  DEBUG ─ Downloading any NPM components found in the template.
  DEBUG ─ Analyzing the template's components dependencies.
  DEBUG ─ Creating the template's components graph.
  ......
  DEBUG ─ Uploading directory /Users/dfounderliu/Desktop/ServerlessComponents/test/website_test/public to bucket test2-1256773370
  DEBUG ─ Website deployed successfully to URL: http://test2-1256773370.cos-website.ap-shanghai.myqcloud.com.

  test1: 
  test2: 
    url: http://test2-1256773370.cos-website.ap-shanghai.myqcloud.com
    env: 
  test3: 

  6s › test3 › done
```

可以看到，通过 -n 参数，只部署了 test2，其他的组件没有发生任何变化。
目前这个功能支持绝大部分 Tencent 官方提供的组件（https://github.com/gosls ）：

```
@serverless/tencent-apigateway
@serverless/tencent-cam-policy
@serverless/tencent-cam-role
@serverless/tencent-cdn
@serverless/tencent-cos
@serverless/tencent-egg
@serverless/tencent-express
@serverless/tencent-flask
@serverless/tencent-koa
@serverless/tencent-laravel
@serverless/tencent-scf
@serverless/tencent-website
```

快来开始动手吧～

---

> **传送门：**
>
> - GitHub: [github.com/serverless](https://github.com/serverless/serverless/blob/master/README_CN.md) 
> - 官网：[serverless.com](https://serverless.com/)

欢迎访问：[Serverless 中文网](https://serverlesscloud.cn/)，您可以在 [最佳实践](https://serverlesscloud.cn/best-practice) 里体验更多关于 Serverless 应用的开发！
