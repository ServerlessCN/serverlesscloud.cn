---
title: "BuildCenter 和 Serverless Guru 如何简化无服务器开发周期"
description: "BuildCenter 为构建者提供数字工具。了解 Serverless Guru 如何使用无服务器框架帮助构建者简化操作。"
date: 2019-07-09
thumbnail: "https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/serverless-guru-case-study/serverless-guru-case-study-thumb.png"
heroImage: "https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/serverless-guru-case-study/serverless-guru-case-study-header.png"
category:
  - user-stories
authors:
  - NickGottlieb
---

BuildCenter 为构建者提供智能、易用的数字工具来简化其操作。

<img src="https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/serverless-guru-case-study/serverless-guru-case-study-1.png">

#### 为何选择无服务器？

BuildCenter 之所以选择使用无服务器而不是更为传统的框架，是因为他们希望能够轻松扩展，并且不会为未使用的资源付费。他们也是一个小型团队，需要的是随着需求的扩展能在中心位置轻松维护的框架。

#### Serverless Guru 何时介入？

在决定选择无服务器之后，BuildCenter 联系了 [Serverless Guru](https://serverlessguru.com/)，讨论最佳的发展计划。在后来的几天里，Serverless Guru 团队开始评估 BuildCenter 的要求和项目涵盖的范围。

BuildCenter 评估了 Serverless Guru 的提案，并确定该团队是开展其项目的不二之选。Serverless Guru 在无服务器、云开发、自动化和应用开发方面拥有丰富的经验，因此 BuildCenter 进一步对 Serverless Guru 团队提出了整个后端开发和 DevOps 需求。

#### 获得许可

Serverless Guru 开始将 BuildCenter 现有的 Terraform 基础结构转换为使用无服务器框架。该项目仍处于初期阶段，因此转换 Terraform 仅需简单的重写。 

仅这项快速变更便让基础结构的规模和复杂性大大降低，通过这种转换，无服务器框架会自动在后台生成多数代码，这意味着花费在产品之外的时间更少了。  

当 Serverless Guru 将现有 Terraform 项目转换为使用无服务器框架后，该团队又开始扩展 BuildCenter 后端和前端基础结构。

前端是使用 AngularJS 编写的 SPA（单页应用）。为前端应用提供服务的支持性前端基础结构由以下服务组成：

* 用于静态托管的 AWS S3
* 用于缓存的 AWS Cloudfront 
* 用于 HTTPS 的 AWS ACM 
* 用于 DNS 的 AWS Route53 

上述每一项服务都通过无服务器框架自动执行，并且均可通过单个终端命令进行部署和连接。

后端是使用 NodeJS 编写的，并拆分到一个微服务架构中，在该架构中，每个微服务都是一个 AWS Lambda 函数。支持性后端基础结构需要以下服务：

* 用于业务逻辑的 AWS Lambda
* 用于 MySQL 数据库的 Amazon Aurora Serverless 
* 用于向 REST API 添加身份验证层的 AWS Cognito 
* 用于托管 REST API 的 Amazon API 网关 
* 用于向用户发送电子邮件的 AWS SES

#### 自动化优点

在构建前端和后端基础结构时，Serverless Guru 能够达到高达 100% 的自动化水平。有时，无服务器框架或基础的 AWS Cloudformation 不支持这些高水平自动化所需的功能，因此 Serverless Guru 需要寻求第三方无服务器框架插件并利用 AWS CLI。

每当 AWS Cloudformation 不存在相关功能时，Serverless Guru 都会将极端情况打包到部署脚本中，这将启动一系列事件；包括拉取值、写出文件、将这些文件传递到无服务器框架中，最后部署到 AWS。这使得 BuildCenter 相信，不管出现任何故障或意外删除任何内容，均可在几分钟内轻松恢复，而无需任何手动干预。

#### 多阶段部署

Serverless Guru 团队花了大量时间来确保 BuildCenter 用于生产的基础结构的每个部分都可以在精确镜像环境中重新部署。通过使用提供的内置[无服务器框架](https://serverless.com/framework/docs/providers/aws/guide/variables/)标志即可实现。我们来具体看看：

<img src="https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/serverless-guru-case-study/serverless-guru-case-study-2.png">

此命令将部署到测试阶段。通过替换单个字词，我们可以轻松地将生产环境中使用的每个细节（包括数据库、身份验证等）转换到一个全新的环境。在后台，无服务器框架会接收该阶段名称并将其设置为变量。

<img src="https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/serverless-guru-case-study/serverless-guru-case-study-3.png">

然后，Serverless Guru 会执行以下操作来引用该变量：

<img src="https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/serverless-guru-case-study/serverless-guru-case-study-4.png">

Serverless Guru 在其[培训网站](https://training.serverlessguru.com)和[博客](https://medium.com/serverlessguru)上撰写了有关此类主题的文章。如果您想了解比这些基本示例更深入的内容，请参阅这些文章。

#### 分离无服务器堆栈：无状态与有状态

在使用无服务器框架组织项目时，Serverless Guru 会围绕“这些 AWS 资源是无状态还是有状态的？”这一问题来定义无服务器堆栈，从而获得成功。

#### 如何识别组件是有状态还是无状态

无状态资源可以轻松拆分（例如 AWS Lambda 函数）并重新创建。在两次 AWS Lambda 调用之间，没有共享数据。如果拆分有状态资源（例如，数据库、AWS S3 存储桶、AWS Cognito 用户池），可能会对业务造成严重影响，因此需要更加谨慎。

如果不谨慎，那么您为简化部署而构建的自动化功能可能很容易起到相反作用，造成严重的故障和数据丢失。这是因为删除无服务器堆栈时，也会删除该堆栈中包含的所有资源。

为确保 BuildCenter 不会出现此问题，Serverless Guru 实施了安全措施来避免出现各种问题。

Serverless Guru 采取的第一种方法是资源隔离。他们根据内容的重要性来分离 BuildCenter 的无服务器堆栈，以防止开发人员错误影响到应用的核心组件。例如，一个无服务器堆栈可能包含一些 AWS Lambda 函数和一个 API 定义：这个堆栈将被视为无状态的，即使损坏后重新部署也不会产生影响。另一个堆栈可能包含数据库或用户文件存储：这个堆栈将被视为有状态的，任何篡改都将导致严重故障。

保护有状态资源的第二种方法是使用[终止保护](https://aws.amazon.com/about-aws/whats-new/2017/09/aws-cloudformation-provides-stack-termination-protection/)来阻止任何开发人员意外运行 `serverless remove --stage prod` 并拆分生产堆栈。由于这是一种普遍存在的担忧，因此 Serverless Guru 创建了无服务器插件，以帮助公司基于特定阶段对无服务器堆栈启用终止保护。如果您想进一步了解他们的插件，请参阅[此处](https://www.npmjs.com/package/serverless-termination-protection)。终止保护插件最近已在 npm 上发布，并将用于 BuildCenter 项目！

第三种安全措施是通过称为 DeletionPolicy 的 AWS Cloudformation 属性使用资源级别的保护。Serverless Guru 通过它来告知 AWS Cloudformation 在删除 BuildCenter 堆栈时切勿删除此特定资源。代码片段如下所示：`“DeletionPolicy" : "Retain”`。

这些安全措施提供了重要的开发保护，但是当有人删除 AWS 资源本身时会出现什么情况呢？对于这些情况，Serverless Guru 会确保针对全部有状态资源制定备份策略。在某些情况下，AWS Cloudformation 可为此提供易于使用的内置解决方案，而在其他情况下，Serverless Guru 会推出自定义解决方案以达到 BuildCenter 所需的可靠性级别。

#### 要点

对于 AWS Cloudformation 不支持某些功能的极端情况，请务必要花更多的时间来找到解决这些缺口的方法，以实现自动化。Serverless Guru 通常将利用无服务器框架插件或 AWS CLI 来处理 AWS Cloudformation 缺少的不受支持的功能。这样可以确保，无论出现任何情况，在需要完全重新创建生产应用时，您都可以通过单个终端命令来完成操作。

这种主动方法还简化了对新团队成员的培训，因为您将所有内容都保持在源代码管理中，避免了黑盒开发。

另一个关键方面是拥有可靠的本地测试工作流程。使用 AWS Lambda 函数和 Amazon API 网关时，请务必先在本地查找并修复漏洞，然后再部署到云中。

BuildCenter 使用具有热重载功能的轻量级 ExpressJS 服务器，该服务器将根据 URL 中的路径指向不同的 AWS Lambda 函数文件。例如，当开发人员将 POST 请求发送到 `localhost:3000/register` 时，ExpressJS 服务器会接收请求主体并将其传递到事件对象中，然后将请求指向 register.js 文件，所有这些就像部署在 AWS 上一样运作。

通过将精力集中在可靠的本地测试上，您可以提高开发人员的速度，而当开发人员的行动更快、调试效率更高时，您便可节省时间和成本。

#### 您与 Serverless Guru 合作有什么体验？

“一切都很棒。让 Serverless Guru 开发后端并自动执行后端和前端的部署确实帮助简化了我们的开发周期。随着我们通过测试和 CI/CD 等操作构建越来越多的应用并实现更多自动化，我们为现有团队可实现的潜力以及轻松使用当前工具集发展团队而感到高兴。”- Jason Alcaraz，BuildCenter 项目经理。
