---
title: "如何使用 WebStorm 简化无服务器工作流程"
description: "在本文中，我将和您分享如何使用 WebStorm 进行无服务器特定的 IDE 设置以及如何利用它来极大地加快无服务器工作流程。"
date: 2018-08-15
thumbnail: 'https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/webstorm-ide/streamline-webstorm-serverless2.jpg'
category:
  - guides-and-tutorials
  - engineering-culture
heroImage: ''
authors:
  - EslamHefnawy
---

如果您也在构建无服务器应用，可以根据本文中介绍的无服务器特定的 IDE 设置来简化工作流程。

过去几年，我很幸运能够专门从事无服务器工具的开发。

在这期间，我建立了一个特定的工作流程，它非常适合集成我选择的 IDE：[WebStorm](https://www.jetbrains.com/webstorm/)。最近，我常常在想：“我敢肯定，很多其他无服务器开发人员也可能觉得它非常有用！”

所以，我将在本文中和您分享如何使用它来进行无服务器特定的 IDE 设置以及如何使用它来极大地加快无服务器工作流程。

本文内容：
- 创建一个全新的无服务器项目
- linter
- 实时模板（用于集成无服务器框架的键盘快捷方式）
- 简化测试和调试的方法

#### 准备工作

如果您尚无平台账户，请安装[无服务器框架](https://serverless.com/framework/)：`npm install serverless -g`，并键入 `serverless login` 创建一个。

然后，使用 `aws-nodejs` 模板创建新项目：`serverless create -t aws-nodejs`。

您还需[下载并安装 WebStorm](https://www.jetbrains.com/webstorm/)。

#### 简化无服务器工作流程

现在基本准备工作已就绪。接下来我们将介绍 WebStorm 中可帮助提高编码（和调试）速度的四个关键功能。

##### 步骤 1：设置 linter

在任何编码会话中，linter 都是必不可少，在集成到 IDE 中时尤其如此。它会针对您可能忽略的拼写错误提供即时反馈，可大量节省纠正基本错误的时间。

设置 linter 后，WebStorm 会提供如下反馈：

<img src="https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/webstorm-ide/serverless-webstorm-linter1.png">

<img src="https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/webstorm-ide/serverless-webstorm-linter2.png">

非常实用，对吧？

您可以使用任何所需的 linter。我个人最喜欢使用[标准 linter](https://standardjs.com/)。它最为简单，且不需要进行任何配置。

要在 WebStorm 上设置 linter，只需将其添加到 `devDependencies` 即可。WebStorm 会检测并询问您是否要将其用作项目 linter。请选择“是”！

现在，您需要禁用 WebStorm 默认检查。打开 **WebStorm Preferences** > **Editor** > **Inspections** > **JavaScript**，然后禁用除 **Standard Code Quality Tool** 以外的所有规则。

<img src="https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/webstorm-ide/serverless-webstorm-linter3.png">

本步骤到此完成。

下面介绍我最喜欢的一个功能：实时模板。

##### 步骤 2：开始使用无服务器实时模板

实时模板可能是 WebStorm 中最有用的一个功能。在您键入触发器关键字时，它会进行自定义式自动代码填充。

下面显示的实时模板示例基于键入的 `fn` + `tab` 自动生成了一个简单函数：

<img src="https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/webstorm-ide/serverless-webstorm-livetemplate4.gif">

非常神奇！我太爱这项功能了！

要设置您自己的实时模板，请转到 **WebStorm Preferences** > **Editor** > **Live Templates** > **JavaScript**，然后您可以在其中查看内置模板及其作用原理，也可以创建自己的模板。

##### 与无服务器框架集成

如果您按下 `COMMAND + SHIFT + D` 就可以立即部署服务，那岂不是太棒了吗？我也是这样想的！

幸运的是，WebStorm 允许您连接外部工具，将其用于 IDE UI，甚至对其分配键盘快捷方式！

实际操作如下所示：

<img src="https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/webstorm-ide/serverless-webstorm-framework5.png">

<img src="https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/webstorm-ide/serverless-webstorm-framework6.png">

要将无服务器框架添加为外部工具，请转到 **WebStorm Preferences** > **Tools** > **External Tools**。单击左下方的 **+** 符号，然后添加以下设置：

<img src="https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/webstorm-ide/serverless-webstorm-framework7.png">

您也可以按照相同步骤来添加 `sls invoke` 之类的其他任务。

##### 步骤 3：简化测试和调试

WebStorm 对许多测试框架提供一流的支持，包括 Jest（我个人的最爱）。这使得通过点击式界面快速运行各个测试案例/套件变得非常容易。

您只需安装要使用的测试框架即可，WebStorm 会进行检测。

<img src="https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/webstorm-ide/serverless-testing-debugging8.png">

测试自己的无服务器应用时，我个人尝试通过单元测试外加一两个处理程序集成测试来实现 80% 左右的代码覆盖率。WebStorm 使这些测试的运行变得轻而易举。与 WebStorm 的内置调试程序一起使用时，它们会变得格外有用。

##### 使用 WebStorm 调试程序

WebStorm 的调试程序功能十分强大。只需设置一次和定义断点，即可运行。

WebStorm 会显示大量有关代码及其上下文的关键信息和数据。习惯该调试程序后，您可能再也不会使用 `console.log()` 进行调试了！

<img src="https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/webstorm-ide/serverless-webstorm-debugging9.png">

<img src="https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/webstorm-ide/serverless-webstorm-debugging10.png">

**注意**：本文不会详细介绍如何设置 WebStorm 调试程序。如需了解详情，请参阅[另一个演练](https://blog.jetbrains.com/webstorm/2018/01/how-to-debug-with-webstorm/)。

##### 测试无服务器 REST API

REST API 是无服务器应用最常见的用例之一。幸运的是，WebStorm 提供了一个内置 REST 客户端，可用于测试已部署的无服务器端点。

WebStorm REST 客户端用起来比 curl 简单得多。它的编辑器中包含了大部分所需的功能，因此无需使用 Insomnia 或 POSTMAN 之类的其他 REST 客户端。

单击 **Tools** > **Test RESTful Web Service** 可打开该客户端：

<img src="https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/webstorm-ide/serverless-webstorm-restapi11.png">

#### 结语

本文介绍了 WebStorm 最基本的无服务器特定设置，希望能对您的工作流程有所帮助！

如果想了解更高级的设置或自定义设置，请参阅 WebStorm 文档。WebStorm 文档中介绍了许多您可能会喜欢的强大功能。欢迎在评论中或 [Twitter](https://twitter.com/eahefnawy?lang=en) 上与我分享您的设置；希望通过您的这些方法我也可以进一步提高自己的工作流程效率。

不要忘记设置适合自己的快捷方式哦！一起来享受快速编程乐趣吧！
