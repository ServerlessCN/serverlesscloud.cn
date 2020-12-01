---
title: 不改一行代码！快速部署传统框架到腾讯云 Serverless 
description: 手把手教你部署传统框架，快来一起实践吧！
date: 2020-12-01
thumbnail: https://img.serverlesscloud.cn/2020121/1606807877823-1606807107551-ssr%E5%89%AF%E6%9C%AC2.jpg
categories:
  - best-practice
authors:
  - April
tags:
  - Serverless
  - 传统框架
---

不知您是否会有这样的疑惑，使用 Serverless Framework 部署完应用，却不知道如何管理？现在，Serverless 应用控制台帮您完美解决这个问题！

近日，腾讯云 Serverless 团队正式发布了 [Serverless 应用控制台](https://console.cloud.tencent.com/ssr)，您可以通过应用模版或已有项目，实现传统框架上云的快速迁移与管理。

**产品功能支持：**

- 控制台快速部署
- 代码托管持续构建
- 支持创建层部署
- 监控图表，部署日志查询

**已支持框架：**

- Express
- Koa
- Flask
- Laravel
- Egg.js
- Next.js
- Nuxt.js

后续我们还会增加更多。下面带大家一起快速体验 Serverless 应用控制台的基本功能。

> 部署前提：账号已开通 **[Serverless Framework](https://console.cloud.tencent.com/sls)** 与 **[Coding DevOps](https://console.cloud.tencent.com/coding)** 服务。

## 如何创建应用

基于模版创建

1. 进入 [Serverless 应用控制台](https://console.cloud.tencent.com/ssr)，点击【新建应用】，进入应用创建页。

![](https://img.serverlesscloud.cn/20201130/1606743229153-1606141064704-%E5%B1%8F%E5%B9%95%E5%BF%AB%E7%85%A7%202020-11-22%2018.20.45.png)

2. 填入您的应用名称，【创建方式】选择【应用模版创建】，选择您想要使用的框架模版。

![](https://img.serverlesscloud.cn/20201130/1606743226373-1606141103195-%E5%B1%8F%E5%B9%95%E5%BF%AB%E7%85%A7%202020-11-22%2018.20.57.png)

3. 点击【创建】，Serverless 控制台会自动开始为您部署应用，部署完成后，进入应用详情页，可以查看创建的云上资源、监控日志、部署记录等信息，也支持在“开发部署”页面修改配置，重新部署。

## 如何导入已有项目

1. 进入 [Serverless 应用控制台](https://console.cloud.tencent.com/ssr)，点击【新建应用】，进入应用创建页。

2. 填入您的应用名称，【创建方式】选择【导入已有项目】，选择您使用的框架模版。

![](https://img.serverlesscloud.cn/20201130/1606743224496-1606141243194-%E5%B1%8F%E5%B9%95%E5%BF%AB%E7%85%A7%202020-11-23%2022.19.49.png)

> 部分框架项目需要进行简单项目改造，才可以进行部署，详情请参考[项目改造文档](https://cloud.tencent.com/document/product/1242/50319)

3. 选择代码上传方式，Serverless 控制台支持您直接上传本地项目部署，也可以选择导入代码仓库。

- 代码托管

  目前支持 **GitHub、GitLab、Gitee** 的代码仓库地址，也支持公开的自定义代码库，您可以通过选择应用的触发方式，完成应用的自动更新。

- 文件夹上传

  您可以通过上传文件夹的方式直接导入本地项目，对于 Node.js 框架，Serverless Framework 将自动为您创建层，并将依赖包 node_modules 传入层中完成部署。

4. 点击【创建】，Serverless 控制台会自动开始为您部署应用，部署完成后，进入应用详情页，可以查看创建的云上资源、监控日志、部署记录等信息，也支持在“开发部署”页面修改配置，重新部署。

## 如何管理应用

应用创建完成后，可以在应用详情页，完成查看项目具体信息，主要支持以下几部分管理功能。

1. 资源管理

在【资源列表】页，支持查看当前应用为您创建的云资源，并查看基本配置信息。

![](https://img.serverlesscloud.cn/2020121/1606808273465-b55916d9b944ce1281e5530c1db54115.png)

2. 开发部署

在应用详情页顶部，单击【开发部署】，您可以轻松地实现应用的配置修改与二次部署上传，支持**本地上传、代码托管、CLI 开发**三种方式。

同时，您也可以在该页面修改应用配置信息，点击「保存」完成重新部署。

![](https://img.serverlesscloud.cn/20201130/1606743405067-5b727ac0d6715f339574e37d3580ac89.png)

3. 应用监控

在【应用监控】页面，您可以查看项目部署后输出的基本信息、项目请求次数、项目报错统计等多项监控指标，方便您轻松实现项目的管理运维。

![](<https://img.serverlesscloud.cn/20201130/1606743218604-1606384460049-%E5%B1%8F%E5%B9%95%E5%BF%AB%E7%85%A7%202020-11-26%2016.22.43.png>)

4. 部署日志

在【部署日志】页面，可以看到【通过控制台部署】或【自动触发】的部署日志，以及部署结果。

![](https://img.serverlesscloud.cn/20201130/1606743221297-1606143280152-%E5%B1%8F%E5%B9%95%E5%BF%AB%E7%85%A7%202020-11-23%2022.53.44.png)

到这里，就完成了应用迁移至 Serverless 的操作，更多功能与持续开发教程，欢迎查看[产品文档](https://cloud.tencent.com/document/product/1242/45418)，实现传统框架的云上开发管理。

另外我们准备了一份体验问卷，邀请大家填写：https://wj.qq.com/s2/7596920/7fde，填写问卷有机会获得腾讯云精美礼品。

---

欢迎访问：[Serverless 中文网](https://serverlesscloud.cn/)，您可以在 [最佳实践](https://serverlesscloud.cn/best-practice) 里体验更多关于 Serverless 应用的开发！