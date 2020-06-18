---
title: 通过 Serverless 加速 Blazor WebAssembly
description: 本文为 Serverless 社区成员撰稿。作者杨舜杰，系统架构研发工程师，开源爱好者，.NET开源项目 shriek-fx 作者
keywords: Serverless Blazor,Blazor WebAssembly,Serverless加速
date: 2020-03-11
thumbnail: https://img.serverlesscloud.cn/2020318/1584508672111-Blazor.jpg
categories:
  - user-stories
authors:
  - Elder James
authorslink:
  - https://zhuanlan.zhihu.com/ServerlessGo
tags:
  - Serverless
  - Blazor
---

## Blazor ❤ Serverless

我正在开发 Ant Design 的 Blazor 版本，预览页面部署在 Github Pages 上，但是加载速度很不理想，往往需要 1 分钟多钟才完成。

项目地址：**[https://github.com/ElderJames/ant-design-blazor](https://link.zhihu.com/?target=https%3A//github.com/ElderJames/ant-design-blazor)**，求 Star。

当寻求解决方案时，了解到了 Serverless 可以轻松地部署静态网站到腾讯云的对象存储服务上，经过尝试之后，体验非常好！访问速度就变成了 3 秒钟，心想 Blazor 与 Serverless 结合后，是一定能成功的。

- **Blazor WebAssembly 简介**

Blazor 是 .NET 实现的前端框架，它使一套代码可分别支持服务端 WebSocket 双向绑定或者是运行在 WebAssembly上。Blazor WebAssembly 可以让开发者使用跟熟悉的 Razor 模版同样的开发模型，来开发基于 WebAssembly 的 SPA 应用。目前 Blazor WebAssembly 已经是在 WebAssembly 领域中发展得最完善的 Web 框架。

- **Serverless 简介**

Serverless 是开发者和企业用户共同推动的,它可以使开发者在构建和运行应用时无需管理服务器等基础设施，将构建应用的成本进一步降低，函数是部署和运行的基本单位。

开发者无需关心底层资源即可部署完整可用的 Serverless 应用架构。

## 创建 Blazor WebAssembly 应用程序

### 前置准备

安装.NET Core SDK 3.1.2 以上版本 **[下载地址](https://link.zhihu.com/?target=https%3A//dotnet.microsoft.com/download/dotnet-core)**

### 安装模板

Blazor WebAssembly 目前还在 preview 阶段，所以正式发布的.NET Core SDK 还没有内置模版，但是我们可以手动安装模版。

运行命令

```text
dotnet new -i Microsoft.AspNetCore.Blazor.Templates::3.2.0-preview1.20073.1
```

### 创建项目

运行命令

```text
dotnet new blazorwasm -o BlazorServerless
```

可以看到在 BlazorServerless 已经创建好了 Web WebAssembly 应用。我们进入目录，：

```text
cd BlazorServerless
dotnet run
```

访问 `https://localhost:5001` 就能浏览了。

![img](https://pic1.zhimg.com/80/v2-34b6f319477e5e8d7179eb4915c6a024_1440w.jpg)

可以看到，加载时要加载 2.1MB 的文件，首次加载时对网速的压力还是很大的。如果部署在境外，例如 Github Pages，可能就需要等上好几分钟了。

所幸，我们可以用 Serverless 把它部署到国内服务器上，解决了加载问题。

### 发布项目

现在，我们需要发布这个项目，生成需要部署的文件。

```text
dotnet publish -o publish
```

这样，`publish\BlazorServerless\dist` 目录里的文件就是我们需要部署的文件了！

![img](https://pic1.zhimg.com/80/v2-9eba0d8682c4407d39ee1e6db250e0c0_1440w.jpg)

## 部署到腾讯云 Serverless 平台

### 前置准备

首先确保系统包含以下环境：

- **[Node.js](https://link.zhihu.com/?target=https%3A//nodejs.org/dist/v12.16.1/node-v12.16.1-x64.msi)** (Node.js 版本需不低于 8.6，建议使用最新版本)

### 安装 serverless cli

```text
npm install -g serverless
```

在 Windows 系统上，如果报错，错误提示是`因为在此系统上禁止运行脚本...`，那么请执行命令开启 `.ps1` 脚本

```text
set-ExecutionPolicy RemoteSigned
```

### 添加配置文件

现在，需要在上面我们的发布目录 `publish\BlazorServerless` （跟 `dist` 目录同级）中，创建 `serverless.yml` 文件，内容如下：

```text
# serverless.yml

blazor-wasm:
  component: "@serverless/tencent-website"
  inputs:
    code:
      src: ./dist # Upload static files
      index: index.html
      error: index.html
    region: ap-guangzhou
    bucketName: blazor-bucket
```

需要注意的是，如果我们部署的是依赖路由系统的 SPA 站点，`error` 项也要指向 `index.html`，这样在直接访问子路由时，还能回到index页面加载路由。否则会有 404 错误。

配置完成后，文件目录如下：

```text
/BlazorServerless
  ├── publish/BlazorServerless
  |    ├── dist
  |    |   ├── _framework
  |    |   ├── css
  |    |   ├── sample-data
  |    |   └── index.html
  |    └── serverless.yml
  └── README.md
```

![img](https://pic1.zhimg.com/80/v2-ec8472a435a87f601c3193ab5c878014_1440w.jpg)

## 部署并浏览

在上图所示，即 `serverless.yml` 文件所在目录下，通过 `serverless` 命令进行部署，添加 --debug 参数查看部署详情：

```text
serverless --debug
```

如果这个目录是第一次授权，或者没有创建环境变量文件设置授权信息，则会出现一个二维码，不管有没有注册过腾讯云，都能通过微信扫码授权开通，非常方便。

以下是输入以上命令后的控制台的输出：

```text
PS D:\code\net\blazor\BlazorServerless\publish\BlazorServerless> serverless --debug

  DEBUG ─ Resolving the template's static variables.
  DEBUG ─ Collecting components from the template.
  DEBUG ─ Downloading any NPM components found in the template.
  DEBUG ─ Analyzing the template's components dependencies.
  DEBUG ─ Creating the template's components graph.
  DEBUG ─ Syncing template state.
  DEBUG ─ Executing the template's components graph.

(此处会出现二维码)

Please scan QR code login from wechat.
Wait login...
Login successful for TencentCloud.
  DEBUG ─ Preparing website Tencent COS bucket blazor-bucket-1256169759.
  DEBUG ─ Bucket "blazor-bucket-1256169759" in the "ap-guangzhou" region already exist.
  DEBUG ─ Setting ACL for "blazor-bucket-1256169759" bucket in the "ap-guangzhou" region.
  DEBUG ─ Ensuring no CORS are set for "blazor-bucket-1256169759" bucket in the "ap-guangzhou" region.
  DEBUG ─ Ensuring no Tags are set for "blazor-bucket-1256169759" bucket in the "ap-guangzhou" region.
  DEBUG ─ Configuring bucket blazor-bucket-1256169759 for website hosting.
  DEBUG ─ Uploading website files from D:\code\net\blazor\BlazorServerless\publish\BlazorServerless\dist to bucket blazor-bucket-1256169759.
  DEBUG ─ Starting upload to bucket blazor-bucket-1256169759 in region ap-guangzhou
  DEBUG ─ Uploading directory D:\code\net\blazor\BlazorServerless\publish\BlazorServerless\dist to bucket blazor-bucket-1256169759
  DEBUG ─ Website deployed successfully to URL: http://blazor-bucket-1256169759.cos-website.ap-guangzhou.myqcloud.com.

  blazor-wasm:
    url: http://blazor-bucket-1256169759.cos-website.ap-guangzhou.myqcloud.com
    env:

  116s » blazor-wasm » done
```

这样，最后出现绿色的 Done 字样，就说明部署成功了！访问给出的url，就能看到部署在腾讯云对象存储服务中的站点了！

![img](https://pic1.zhimg.com/80/v2-fe84c499456921a25b36d59c6910c034_1440w.jpg)

访问时加载速度非常快！



---
<div id='scf-deploy-iframe-or-md'></div>

---

> **传送门：**
> - GitHub: [github.com/serverless](https://github.com/serverless/serverless/blob/master/README_CN.md)
> - 官网：[serverless.com](https://serverless.com/)

欢迎访问：[Serverless 中文网](https://serverlesscloud.cn/)，您可以在 [最佳实践](https://serverlesscloud.cn/best-practice) 里体验更多关于 Serverless 应用的开发！
