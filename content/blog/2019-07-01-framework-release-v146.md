---
title: "无服务器框架 v1.46.0 - 扩展 ALB 可配置性、支持外部 Websocket API 以及通过相对路径引用本地插件等等"
description: "查看无服务器框架 v1.46.0 中包含的功能。"
date: 2019-07-01
thumbnail: "https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/framework-updates/framework-v146-thumb.png"
heroImage: "https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/framework-updates/framework-v146-header.png"
category:
  - news
authors:
  - MariuszNowak
---
 
无服务器框架 v1.46.0 增加了配置 ALB 事件条件的新方法、外部托管 Websocket API 的支持以及可通过相对文件路径引用的本地插件。我们还处理了一些增强功能和错误修复。总共修复了 5 个错误，融合了 5 个增强功能。这些都通过我们的 v1.46.0 版推出。

使用无服务器框架时，请确保您使用的是最新的 Node 版本。

#### 新 ALB 条件的支持

在我们上一次发布的[无服务器框架 v1.45.0 版](https://serverless.com/blog/framework-release-v145/)中，我们引入了对 ALB 事件源的支持，以便很好地替代虽完善但昂贵的 AWS API Gateway 服务。虽然对于复杂的 API 设置，API Gateway 服务仍然是优选，但是人们可以通过实惠很多的 ALB 服务产品实现很多目标。

本版本扩展了 ALB 事件源功能，对于 ALB 将传入的请求路由到连接的 Lambda 函数而需要满足的不同条件提供了更多支持。现在，ALB 事件源可以配置为接受不同的标头、IP 地址、方法、查询字符串和多个路径。

下面显示了我们利用新的配置选项进行的复杂 ALB 设置：

```yaml
functions:
  test:
    handler: handler.hello
    events:
      - alb:
          listenerArn: { Ref: HTTPListener }
          priority: 1
          conditions:
            path:
              - /first-path
              - /second-path
            method:
              - POST
              - PATCH
            query:
              bar: true
            ip:
              - 192.168.0.1/0
            header:
              name: alb-event-source
            host:
              - example.com
```

您是否想了解有关 ALB 的更多信息？如果用其替代 API Gateway 服务，它可以如何为您节省成本？您可以在我们的 [v1.45.0 版的博客文章](https://serverless.com/blog/framework-release-v145/)中了解有关 ALB 事件源及其功能的更多信息。

#### 外部 Websocket API

大多数无服务器框架应用都以一个 `serverless.yml` 文件开始，其中描述了整个应用及其所有基础结构组件。尽管在一开始这些就足够了，但建议将整个应用拆分为不同的服务，并对每个服务使用单独的 `serverless.yml` 文件。

如果将一个应用拆分为不同的服务，则需要在这些服务之间共享某些资源。而 API 是需要跨服务共享的一种非常常见的资源类型。

无服务器框架已经支持向服务引入外部 REST API 的简便方法，以便在服务中重新利用和扩展该 API。

在 v1.46.0 版中，我们扩展了对外部 API 的支持，将 Websocket API 纳入支持。

要将现有的 Websocket API 引入到现有服务中，只需在 `provider.apiGateway` 属性下使用 `websocketApiId` 配置参数，非常简单！

```yaml
provider:
  name: aws
  apiGateway:
    websocketApiId: xxxxxxxxxx # Websocket API resource id
```

您是否想详细了解有关如何将 API 驱动的应用拆分为不同服务的最佳实践？请参阅 [API Gateway 文档](https://serverless.com/framework/docs/providers/aws/events/apigateway/)了解有关此方面的更多见解。

#### 通过相对路径引用本地插件

我们的无服务器框架[插件架构](https://serverless.com/framework/docs/providers/aws/guide/plugins/)可以轻松以各种不同的方式扩展无服务器以满足特定业务需求。

社区已经努力开发[上百种插件](https://serverless.com/plugins/)，以帮助其他无服务器开发人员实现某些目标，并使无服务器开发比以往更加容易。

尽管可以通过 `npm` 轻松分发和使用插件，但有时需要使用项目专属插件或可能尚未通过 `npm` 分发的插件。也许您希望在内部维护自己的插件？

到目前为止，`npm` 托管插件和本地插件之间存在着明显的差异。使用本地插件的唯一方法是利用 `plugin.localPath` 配置。使用该配置意味着整个服务只支持本地插件，而不再支持 `npm` 托管插件。

推出 v1.46.0 版之后，终于可以采用简单的方式混用 `npm` 托管插件和本地插件了。

在以下示例中，我们使用声名狼藉的 [`serverless-offline` 插件](https://serverless.com/plugins/serverless-offline/)和另一个插件，后者是一个项目专属插件，且存储在服务的单独目录中。

```yaml
plugins:
  - serverless-offline
  - ./plugins/acme/auditing
```

#### 错误修复
- [#4427](https://github.com/serverless/serverless/pull/4427) 从 IAM 角色中分离 IAM 策略并改善流的 DependsOn<a href="https://github.com/serverless/serverless/pull/4427/files?utf8=✓&diff=split" style="text-decoration:none;"> <span style="color:#28a647">+120</span>/<span style="color:#cb2431">-51</span></a> <a href="https://github.com/alexcasalboni"> <img src='https://avatars1.githubusercontent.com/u/2457588?v=4' style="vertical-align: middle" alt='' height="20px"> alexcasalboni</a>
- [#6244](https://github.com/serverless/serverless/pull/6244) 修复重复包装问题<a href="https://github.com/serverless/serverless/pull/6244/files?utf8=✓&diff=split" style="text-decoration:none;"> <span style="color:#28a647">+52</span>/<span style="color:#cb2431">-17</span></a> <a href="https://github.com/alexdebrie"> <img src='https://avatars3.githubusercontent.com/u/6509926?v=4' style="vertical-align: middle" alt='' height="20px"> alexdebrie</a>
- [#6255](https://github.com/serverless/serverless/pull/6255) 修复 Lambda 集成超时响应模板<a href="https://github.com/serverless/serverless/pull/6255/files?utf8=✓&diff=split" style="text-decoration:none;"> <span style="color:#28a647">+27</span>/<span style="color:#cb2431">-2</span></a> <a href="https://github.com/medikoo"> <img src='https://avatars3.githubusercontent.com/u/122434?v=4' style="vertical-align: middle" alt='' height="20px"> medikoo</a>
- [#6268](https://github.com/serverless/serverless/pull/6268) 修复 #6267<a href="https://github.com/serverless/serverless/pull/6268/files?utf8=✓&diff=split" style="text-decoration:none;"> <span style="color:#28a647">+1</span>/<span style="color:#cb2431">-1</span></a> <a href="https://github.com/JonathanWilbur"> <img src='https://avatars0.githubusercontent.com/u/20342114?v=4' style="vertical-align: middle" alt='' height="20px"> JonathanWilbur</a>
- [#6281](https://github.com/serverless/serverless/pull/6281) 如果没有 tty 可用，请勿对 stdin 设置 tty<a href="https://github.com/serverless/serverless/pull/6281/files?utf8=✓&diff=split" style="text-decoration:none;"> <span style="color:#28a647">+2</span>/<span style="color:#cb2431">-2</span></a> <a href="https://github.com/jpetitcolas"> <img src='https://avatars0.githubusercontent.com/u/688373?v=4' style="vertical-align: middle" alt='' height="20px"> jpetitcolas</a>
#### 增强功能
- [#6200](https://github.com/serverless/serverless/pull/6200) 删除提供者对象中的默认阶段值<a href="https://github.com/serverless/serverless/pull/6200/files?utf8=✓&diff=split" style="text-decoration:none;"> <span style="color:#28a647">+109</span>/<span style="color:#cb2431">-111</span></a> <a href="https://github.com/mydiemho"> <img src='https://avatars2.githubusercontent.com/u/1634185?v=4' style="vertical-align: middle" alt='' height="20px"> mydiemho</a>
- [#6258](https://github.com/serverless/serverless/pull/6258) 修复：更新 Azure 模板<a href="https://github.com/serverless/serverless/pull/6258/files?utf8=✓&diff=split" style="text-decoration:none;"> <span style="color:#28a647">+6</span>/<span style="color:#cb2431">-138</span></a> <a href="https://github.com/tbarlow12"> <img src='https://avatars0.githubusercontent.com/u/10962815?v=4' style="vertical-align: middle" alt='' height="20px"> tbarlow12</a>
- [#6280](https://github.com/serverless/serverless/pull/6280) 删除 package-lock.json 和 shrinkwrap 脚本<a href="https://github.com/serverless/serverless/pull/6280/files?utf8=✓&diff=split" style="text-decoration:none;"> <span style="color:#28a647">+3</span>/<span style="color:#cb2431">-9384</span></a> <a href="https://github.com/medikoo"> <img src='https://avatars3.githubusercontent.com/u/122434?v=4' style="vertical-align: middle" alt='' height="20px"> medikoo</a>
- [#6285](https://github.com/serverless/serverless/pull/6285) 使用命名获取 stackName<a href="https://github.com/serverless/serverless/pull/6285/files?utf8=✓&diff=split" style="text-decoration:none;"> <span style="color:#28a647">+2</span>/<span style="color:#cb2431">-2</span></a> <a href="https://github.com/joetravis"> <img src='https://avatars1.githubusercontent.com/u/3687269?v=4' style="vertical-align: middle" alt='' height="20px"> joetravis</a>
- [#6293](https://github.com/serverless/serverless/pull/6293) 将 IP、方法、标头和查询条件添加到 ALB 事件<a href="https://github.com/serverless/serverless/pull/6293/files?utf8=✓&diff=split" style="text-decoration:none;"> <span style="color:#28a647">+270</span>/<span style="color:#cb2431">-11</span></a> <a href="https://github.com/cbm-egoubely"> <img src='https://avatars2.githubusercontent.com/u/39260821?v=4' style="vertical-align: middle" alt='' height="20px"> cbm-egoubely</a>
#### 文档
- [#6225](https://github.com/serverless/serverless/pull/6225) 更新文档 | 请勿将 provider.tags 与共享的 API Gateway 一起使用<a href="https://github.com/serverless/serverless/pull/6225/files?utf8=✓&diff=split" style="text-decoration:none;"> <span style="color:#28a647">+2</span>/<span style="color:#cb2431">-0</span></a> <a href="https://github.com/OskarKaminski"> <img src='https://avatars3.githubusercontent.com/u/7963279?v=4' style="vertical-align: middle" alt='' height="20px"> OskarKaminski</a>
- [#6228](https://github.com/serverless/serverless/pull/6228) 修复 Markdown 链接的格式问题<a href="https://github.com/serverless/serverless/pull/6228/files?utf8=✓&diff=split" style="text-decoration:none;"> <span style="color:#28a647">+2</span>/<span style="color:#cb2431">-2</span></a> <a href="https://github.com/awayken"> <img src='https://avatars1.githubusercontent.com/u/156215?v=4' style="vertical-align: middle" alt='' height="20px"> awayken</a>
- [#6275](https://github.com/serverless/serverless/pull/6275) 修正一个拼写错误 🖊<a href="https://github.com/serverless/serverless/pull/6275/files?utf8=✓&diff=split" style="text-decoration:none;"> <span style="color:#28a647">+1</span>/<span style="color:#cb2431">-1</span></a> <a href="https://github.com/floydnoel"> <img src='https://avatars3.githubusercontent.com/u/4154431?v=4' style="vertical-align: middle" alt='' height="20px"> floydnoel</a>
- [#6279](https://github.com/serverless/serverless/pull/6279) 更新 variables.md<a href="https://github.com/serverless/serverless/pull/6279/files?utf8=✓&diff=split" style="text-decoration:none;"> <span style="color:#28a647">+1</span>/<span style="color:#cb2431">-1</span></a> <a href="https://github.com/ElinksFr"> <img src='https://avatars1.githubusercontent.com/u/32840264?v=4' style="vertical-align: middle" alt='' height="20px"> ElinksFr</a>
- [#6286](https://github.com/serverless/serverless/pull/6286) 基于社区反馈增加了修正<a href="https://github.com/serverless/serverless/pull/6286/files?utf8=✓&diff=split" style="text-decoration:none;"> <span style="color:#28a647">+1</span>/<span style="color:#cb2431">-1</span></a> <a href="https://github.com/garethmcc"> <img src='https://avatars1.githubusercontent.com/u/4112280?v=4' style="vertical-align: middle" alt='' height="20px"> garethmcc</a>
- [#6288](https://github.com/serverless/serverless/pull/6288) 删除 README 冗余链路<a href="https://github.com/serverless/serverless/pull/6288/files?utf8=✓&diff=split" style="text-decoration:none;"> <span style="color:#28a647">+0</span>/<span style="color:#cb2431">-1</span></a> <a href="https://github.com/Hazlank"> <img src='https://avatars0.githubusercontent.com/u/15724316?v=4' style="vertical-align: middle" alt='' height="20px"> Hazlank</a>
- [#6292](https://github.com/serverless/serverless/pull/6292) 修复 ALB 文档链接中的拼写错误<a href="https://github.com/serverless/serverless/pull/6292/files?utf8=✓&diff=split" style="text-decoration:none;"> <span style="color:#28a647">+1</span>/<span style="color:#cb2431">-1</span></a> <a href="https://github.com/schellack"> <img src='https://avatars0.githubusercontent.com/u/70819?v=4' style="vertical-align: middle" alt='' height="20px"> schellack</a>
#### 功能
- [#6261](https://github.com/serverless/serverless/pull/6261) #6017 允许从路径加载插件<a href="https://github.com/serverless/serverless/pull/6261/files?utf8=✓&diff=split" style="text-decoration:none;"> <span style="color:#28a647">+18</span>/<span style="color:#cb2431">-7</span></a> <a href="https://github.com/mnapoli"> <img src='https://avatars3.githubusercontent.com/u/720328?v=4' style="vertical-align: middle" alt='' height="20px"> mnapoli</a>
- [#6272](https://github.com/serverless/serverless/pull/6272) 功能/支持外部 WebSocket API<a href="https://github.com/serverless/serverless/pull/6272/files?utf8=✓&diff=split" style="text-decoration:none;"> <span style="color:#28a647">+193</span>/<span style="color:#cb2431">-103</span></a> <a href="https://github.com/christophgysin"> <img src='https://avatars0.githubusercontent.com/u/527924?v=4' style="vertical-align: middle" alt='' height="20px"> christophgysin</a>

### 贡献者致谢

向 18 位其他贡献者致谢，再次感谢参与并成功开发此版本的所有社区成员。