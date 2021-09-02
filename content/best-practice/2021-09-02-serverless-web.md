---
title: 腾讯云 Serverless 建站方案全新升级！
description: 为开发者提供一种更轻量、开发和维护成本都更低的建站方案。
date: 2021-09-02
thumbnail: https://main.qcloudimg.com/raw/c9a8d5ba6061b0467169de60da18967d.jpg
categories:
  - best-practice
authors:
  - April
tags:
  - Serverless
  - 云函数
---



Serverless WordPress 建站方案的发布，为开发者提供了一种更轻量、开发和维护成本都更低的建站方案，从而体验 Serverless 架构带来的弹性扩缩、按量付费等众多优势。但不少用户在使用的同时，也为我们提出了更的要求：

- 数据库价格高，能不能使用自建的数据库呢？
- 有时请求页面加载时间久，是否可以优化？
- 除了 WordPress，能不能支持更多不同应用？

基于大家反馈的众多问题，**Serverless 建站方案 2.0** 现已发布，整体能力全面升级。



## 01. 全新升级 3 大亮点

- #### 支持自建数据库绑定

不再强依赖自动创建数据库，选择权完全交给用户，已有数据库可以直接完成绑定。

<img src="https://main.qcloudimg.com/raw/cc9b074e12970c8c37a7894bf7951798.png" width="700"/>

- #### Web 函数支持计算能力

底层全面升级，采用 Web 函数作为计算资源完成部署，更高效处理 HTTP 请求。

<img src="https://main.qcloudimg.com/raw/e0a2cc7c45eb51b8416920b32073ff32.png" width="700"/>

- #### 全新支持 Discuz!Q 应用一键部署

 除了 WordPress 外，Serverless 建站 2.0 现已全面支持 Discuz!Q 一键部署，以更轻量的 Serverless 架构实现论坛项目的部署。

<img src="https://main.qcloudimg.com/raw/b8d2624b01faa27ec78157ac86e5ec0a.png" width="500"/>



## 02. 方案优势

#### 1. 更低成本

开放数据库配置，支持绑定云数据库或自建数据库，降低数据库使用成本；底层计算资源全部基于 Serverless 架构实现，最低 1 元即可购买超值云函数计算资源，满足每日约 3000 次访问计算量。

- 了解详情：https://cloud.tencent.com/act/pro/serverless-wordpress?from=14256

#### 2. 更高性能

基于 Web 函数部署，函数可以直接接收并处理 HTTP 请求，无需再做格式转换，大大提升请求效率，页面加载请求速度明显提升，无需再做 Base64 转换，上传文件大小限制提升至 **6MB**。

#### 3. 简化安装步骤

省去传统主机方案安装 PHP、Nginx 等繁琐环境配置步骤，仅需几步点击即可完成，即使没有过于专业的技术背景，也可以完成搭建个人网站的快速体验。



## 03. 部署步骤

以 WordPress 为例，为您介绍部署方案，Discuz!Q 请参考官网文档。

- 文档地址：https://cloud.tencent.com/document/product/1154/60709

1. 登录 Serverless 应用控制台，点击 **新建应用**。

2. 选择 **应用模版** > **快速部署一个 WordPress 框架**，点击 **下一步**。

<img src="https://main.qcloudimg.com/raw/ca35f8ccc77134a5860382e6749982bc.png" width="700"/>



3. 输入应用名，选择数据库和私有网络配置

- 选择连接自建数据库和私有网络

您可以连接有内网 IP 的数据库，也可以连接有公网 IP 的数据库。如果选择连接内网 IP 的数据库，您需要配置私有网络，请注意您的自建数据库所在地域与应用部署地域需要相同。您也可以选择连接公网 IP 的数据库，不启用指定的私有网络，继续使用默认的私有网络。点击 **完成** 完成应用。

<img src="https://main.qcloudimg.com/raw/c6fd039b1aa8492837a411a608da619a.png" width="700"/>



- 选择使用自动创建的数据库和私有网络

如果您选择自动创建的数据库和私有网络，点击**完成**即可完成应用创建，Serverless 将自动为您创建 TDSQL-C Serverless MySQL 数据库完成连接

> ! 注意：使用 TDSQL-C 数据库可能产生额外费用，详情请参考TDSQL-C 数据库计费文档

<img src="https://main.qcloudimg.com/raw/cd26ed3cec3668936c1e9531f905c405.png" width="700"/>



4. 在 Serverless 应用页，点击 **访问应用**，即可访问您的 WordPress 项目。

<img src="https://main.qcloudimg.com/raw/db1ed6aef67d8d639c12c3be9615d6fb.png" width="700"/>



您也可以点击您的应用名称，查看资源列表和部署日志。在资源列表页，您可以点击 **新增** 配置您的自定义域名。

<img src="https://main.qcloudimg.com/raw/3f80dc331b276b66290b1419883b5a0a.png" width="700"/>



## **Web Function 使用体验**

- Web Function 产品文档：

  https://cloud.tencent.com/document/product/583/56123

- Web Function 快速体验链接：

  https://console.cloud.tencent.com/scf/list-create?rid=16&ns=default&keyword=WebFunc



当前已在国内各大区域发布上线，欢迎体验使用！

<img src="https://main.qcloudimg.com/raw/4ee70db1b518d4c0064711d1caf1572c.jpg" width="700"/>



---

> **传送门：**
>
> - GitHub: [github.com/serverless](https://github.com/serverless/serverless/blob/master/README_CN.md)
> - 官网：[serverless.com](https://serverless.com/)



欢迎访问：[Serverless 中文网](https://serverlesscloud.cn/)，您可以在 [最佳实践](https://serverlesscloud.cn/best-practice) 里体验更多关于 Serverless 应用的开发！