---
title: Serverless Web Function 实践教程（一）：快速部署 Node.js Web 服务
description: 作为目前广受欢迎的 Web 服务开发语言，Node.js 提供了众多支持 HTTP 场景的相关功能，可以说是为 Web 构建而生。
date: 2021-06-16
thumbnail: https://main.qcloudimg.com/raw/fdc6ec010d235e925c5e2f8d200ca919.jpg
categories:
  - best-practice
authors:
  - April
tags:
  - Serverless
  - 云函数
---

作为目前广受欢迎的 Web 服务开发语言，Node.js 提供了众多支持 HTTP 场景的相关功能，可以说是为 Web 构建而生。因此，基于 Node.js，也诞生了多种 Web 服务框架，它们对 Node.js 的内容进行扩展，专注于 Web 服务的直接构建和开发，如 Express、Koa 等，成为了开发 Web 服务的第一首选。

云函数 Web Function 的发布，也为开发者带来了 Web 服务上云的全新方案，只需简单修改监听端口，即可将目前流行的 Node.js 框架直接部署上云，享受 Serverless 技术带来的免运维、低成本、按需扩缩容的众多优势。

**本篇文档将为您指导，如何通过 Web Function，将您的本地 Express 项目快速部署到云端。**



## 01. 模板部署 - 无需改动业务代码，一键部署

1. 登录 Serverless 控制台，单击左侧导航栏的「函数服务」，在主界面上方选择期望创建函数的地域，并单击「新建」，进入函数创建流程。

2. 选择使用**「模版创建」**来新建函数，在搜索框里输入 「**WebFunc**」，筛选所有 Web 函数模版，选择 Express 框架模版，点击 「下一步」，如下图所示：

<img src="https://main.qcloudimg.com/raw/cbe10cf6cb2186d075dcdfef2c7a07b6.png" width="700"/>

3. 在「配置」页面，您可以查看模版项目的具体配置信息并进行修改；

4. 单击「**完成**」，即可创建函数。函数创建完成后，可在「函数管理」页面，查看 Web 函数的基本信息，并通过 API 网关生成的访问路径 URL 进行访问，查看您部署的 Express 项目。

<img src="https://main.qcloudimg.com/raw/b296b2b9c48cdd5be2b42fa8d01b4fd1.png" width="700"/>





## 02. 自定义部署 - 3 步快速迁移本地项目上云

#### 1. 本地开发

1. 首先，在确保您的本地已安装 Node.js 运行环境后，安装 Express 框架和express-generator 脚手架，初始化您的 Express 示例项目

```shell
npm install express --save
npm install express-generator --save
express WebApp
```

2. 进入项目目录，安装依赖包

```
cd WebApp
npm install
```

3. 安装完成后，本地直接启动，在浏览器里访问 `http://localhost:3000`，即可在本地完成Express 示例项目的访问

```
npm start
```

#### 2. 部署上云

接下来，我们对已初始化的项目进行简单修改，使其可以通过 Web Function 快速部署，此处项目改造通常分为两步：

- 修改监听地址与端口，改为 `0.0.0.0:9000`
- 新增 `scf_bootstrap` 启动文件

具体步骤如下：

1. 已知在 Express 示例项目中，通过 `./bin/www` 设置监听地址与端口，打开该文件可以发现，我们可以通过环境变量，设置指定监听端口，否则将自动监听 `3000`

<img src="https://main.qcloudimg.com/raw/d3e80d8555306d6d4f9033c86fe7c4cb.png" width="700"/>



2. 接下来，在项目根目录下新建 `scf_bootstrap` 启动文件，在里面配置环境变量，并指定服务启动命令

```shell
#!/bin/bash
export PORT=9000
npm run start
```

创建完成后，注意修改您的可执行文件权限，默认需要 `777` 或 `755` 权限才可以正常启动

```
chmod 777 scf_bootstrap
```

3. 本地配置完成后，执行启动文件，确保您的服务可以本地正常启动，接下来，登陆腾讯云云函数控制台，新建 Web 函数以部署您的 Express 项目：

<img src="https://main.qcloudimg.com/raw/89772d67cf75b7a211bb56122377b6bd.png" width="700"/>



#### 3.开发管理

部署完成后，即可在 SCF 控制台快速访问并测试您的 Web 服务，并且体验云函数多项特色功能如层绑定、日志管理等，享受 Serverless 架构带来的低成本、弹性扩缩容等优势。

<img src="https://main.qcloudimg.com/raw/2af00d3765fbb9f8683b565b97954c6a.png" width="700"/>



## **Web Function 使用体验**

- Web Function 产品文档：

  https://cloud.tencent.com/document/product/583/56123

- Web Function 快速体验链接：

  https://console.cloud.tencent.com/scf/list-create?rid=16&ns=default&keyword=WebFunc

Web Function 当前已在「成都地域」灰度发布，其他地域将陆续开放，敬请期待！

<img src="https://main.qcloudimg.com/raw/4ee70db1b518d4c0064711d1caf1572c.jpg" width="700"/>



---

> **传送门：**
>
> - GitHub: [github.com/serverless](https://github.com/serverless/serverless/blob/master/README_CN.md)
> - 官网：[serverless.com](https://serverless.com/)



欢迎访问：[Serverless 中文网](https://serverlesscloud.cn/)，您可以在 [最佳实践](https://serverlesscloud.cn/best-practice) 里体验更多关于 Serverless 应用的开发！