---
title: 不改一行代码！快速迁移 Flask 应用上云
description: 手把手教你部署 Flask 应用，快来一起实践吧！
date: 2020-12-24
thumbnail: https://img.serverlesscloud.cn/2020512/1589274779819-flask.jpg
categories:
  - best-practice
authors:
  - April
tags:
  - Serverless
  - Flask
---

目前大部分应用都以 Web 形式提供，因此 Web 框架开发已经成了不少开发者必不可少的技能。而 Flask 是一种非常容易上手的 Python Web 开发框架，开发者只需要具备基本的 python 开发技能，就可以开发出一个 web 应用，因此 Flask 框架也成为了当前非常流行的 Web 框架。

如今，您可以通过 [Serverless 应用控制台](https://console.cloud.tencent.com/ssr)，不改一行代码，完美迁移您的 Flask 应用上云。

## 功能优势

- **低改造成本：** Serverless 组件自动帮助用户完成框架上云的适配转换，用户只需聚焦业务代码，部分框架甚至不需要改造一行代码，即可完成云端部署。

- **应用层级资源展示与管理:** 部署成功后，用户可以方便地通过 Serverless 应用控制台将查看和管理创建的云端资源，无需多个页面切换，实现多资源的集中管理。

- **基于代码托管持续构建：** 支持持续构建，当从代码仓库导入的项目有更新时，可以自动触发重新部署。

- **应用层级监控图表:** 提供了应用层级的监控能力，用户不仅可以看到每个资源的调用次数、错误次数等信息，还可以看到应用层级的监控指标，方便运维。

## 快速体验框架迁移教程


> **部署前提**：您的账号已开通 [Serverless Framework](https://console.cloud.tencent.com/sls) 与 [Coding DevOps](https://console.cloud.tencent.com/coding) 服务。
>
> 开通非常简单，只要您登陆到Serverless 控制台：https://console.cloud.tencent.com/sls，系统会提示您按照指引步骤完成开通，开通过程不会产生何费用。


## 创建应用

### 基于模版创建

1. 进入 [Serverless 应用控制台](https://console.cloud.tencent.com/ssr)，点击【新建应用】，进入应用创建页。

![](https://img.serverlesscloud.cn/20201123/1606141064704-%E5%B1%8F%E5%B9%95%E5%BF%AB%E7%85%A7%202020-11-22%2018.20.45.png)

2. 填入您的应用名称，【创建方式】选择【应用模版创建】，选择 **Flask 框架**。

![](https://img.serverlesscloud.cn/20201123/1606141064704-%E5%B1%8F%E5%B9%95%E5%BF%AB%E7%85%A7%202020-11-22%2018.20.45.png)

3. 点击【创建】，Serverless 控制台会自动开始为您部署应用，部署完成后，进入应用详情页，可以 **查看创建的云上资源、监控日志、部署记录** 等信息，也支持在“开发部署”页面修改配置，重新部署。



### 导入已有项目

1. 进入 [Serverless 应用控制台](https://console.cloud.tencent.com/ssr)，点击【新建应用】，进入应用创建页。

2. 填入您的应用名称，【创建方式】选择【导入已有项目】，选择 **Flask 应用**，直接导入您的已有项目，无需做任何改造，Serverless 将自动为您完成适配转换。

![](https://main.qcloudimg.com/raw/3e6baf9f29c0cc2f0603ba5050f923fc.png)

3. 选择代码上传方式，Serverless 控制台支持您直接上传本地项目部署，也可以选择导入代码仓库。

   - 代码托管

     目前支持 **GitHub、GitLab、Gitee** 的代码仓库地址，也支持公开的自定义代码库，您可以通过选择应用的触发方式，完成应用的自动更新。

   - 文件夹上传


4. 点击【创建】，Serverless 控制台会自动开始为您部署应用，部署完成后，进入应用详情页，可以查看创建的云上资源、监控日志、部署记录等信息，也支持在“开发部署”页面修改配置，重新部署。

## 管理应用

应用创建完成后，可以在应用详情页，完成查看项目具体信息，主要支持以下几部分管理功能。

### 1. 资源管理

在【资源列表】页，支持查看当前应用为您创建的云资源，并查看基本配置信息。
![](https://main.qcloudimg.com/raw/47b45e7240d6a766526d97840a03013b.png)

### 2. 开发部署

在应用详情页顶部，单击【开发部署】，您可以轻松地实现应用的配置修改与二次部署上传，支持**本地上传、代码托管、CLI 开发**三种方式。

同时，您也可以在该页面修改应用配置信息，点击“保存”完成重新部署。
<img src="https://main.qcloudimg.com/raw/5b727ac0d6715f339574e37d3580ac89.png" width="770px">

### 3. 应用监控

在【应用监控】页面，您可以查看项目部署后输出的基本信息、项目请求次数、项目报错统计等多项监控指标，方便您轻松实现项目的管理运维。
<img src="https://img.serverlesscloud.cn/20201126/1606384460049-%E5%B1%8F%E5%B9%95%E5%BF%AB%E7%85%A7%202020-11-26%2016.22.43.png" width="770px">

### 4. 部署日志

在【部署日志】页面，可以看到【通过控制台部署】或【自动触发】的部署日志，以及部署结果。

![](https://img.serverlesscloud.cn/20201123/1606143280152-%E5%B1%8F%E5%B9%95%E5%BF%AB%E7%85%A7%202020-11-23%2022.53.44.png)


到这里，无需一行代码更改，就完成了将您的 Flask 应用迁移至 Serverless 的操作，并可以进行应用的监控管理，持续开发，享受 Serverless 带来的众多优势。

---

欢迎访问：[Serverless 中文网](https://serverlesscloud.cn/)，您可以在 [最佳实践](https://serverlesscloud.cn/best-practice) 里体验更多关于 Serverless 应用的开发！