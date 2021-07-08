---
title: 基于 Web 函数部署您的 Laravel 项目：Web Function 实践教程
description: PHP 是搭建 Web 服务的常用开发语言之一，基于 PHP 也衍生出了众多 Web 开发框架，Laravel 便是其中的优秀代表……
date: 2021-07-08
thumbnail: https://main.qcloudimg.com/raw/fdc6ec010d235e925c5e2f8d200ca919.jpg
categories:
  - best-practice
authors:
  - April
tags:
  - Serverless
  - 云函数
---



PHP 是搭建 Web 服务的常用开发语言之一，基于 PHP 也衍生出了众多 Web 开发框架，Laravel 便是其中的优秀代表，它具有富于表达性且简洁的语法，提供了众多功能，例如模板引擎，MVC 架构支持，安全性高，开发者工具，数据库迁移等，可以满足不同场景或规模的 Web 应用开发。

本篇教程将为您指导，如何通过 `SCF Web Function`，快速部署您的 Laravel 框架上云。



## 01. 模板部署 - 无需改动业务代码，一键部署

1. 登录 Serverless 控制台，单击左侧导航栏的「函数服务」，在主界面上方选择期望创建函数的地域，并单击「新建」，进入函数创建流程。
2. 选择使用**「模版创建」**来新建函数，在搜索框里输入 「**WebFunc**」，筛选所有 Web 函数模版，选择**「Laravel 框架模版」**，点击 「下一步」，如下图所示：

<img src="https://main.qcloudimg.com/raw/263b8016fbd736f75a042e6f2b95fd87.png" width="700"/>



3. 在「配置」页面，您可以查看模版项目的具体配置信息并进行修改；
4. 单击「**完成**」，即可创建函数。函数创建完成后，可在「函数管理」页面，查看 Web 函数的基本信息，并通过 API 网关生成的访问路径 URL 进行访问，查看您部署的 Laravel 项目。

<img src="https://main.qcloudimg.com/raw/f2abb965e40b7ad16772998903a85094.png" width="700"/>



## 02. 自定义部署 - 3 步快速迁移本地项目上云

### 1. 本地开发

1. 首先请在本地环境里，完成 Laravel 的开发环境搭建，参考[官网文档](https://laravel.com/docs/8.x#getting-started-on-macos)


2. 本地创建 Laravel 示例项目，在项目目录下，通过以下指令，初始化 Laravel 示例应用：

```shell
composer create-project --prefer-dist laravel/laravel blog
```

3. 本地启动示例项目后，在浏览器里访问 `http://0.0.0.0:9000`，即可在本地完成Laravel 示例项目的访问

```shell
$ php artisan serve --host 0.0.0.0 --port 9000

   Laravel development server started: <http://0.0.0.0:9000>
   [Wed Jul  7 11:22:05 2021] 127.0.0.1:54350 [200]: /favicon.ico
```

<img src="https://main.qcloudimg.com/raw/1d467a55fcd4210dc6176d2edf701f21.png" width="700"/>



### 2. 部署上云

接下来，我们对本地已经创建完成的项目进行部分修改，使其可以通过 Web Function 快速部署，对于 Laravel，具体改造步骤如下：

**1. 新增 `scf_bootstrap` 启动文件**

在项目根目录下新建 `scf_bootstrap` 启动文件，在里面完成环境变量配置，指定服务启动命令等自定义操作，确保您的服务可以通过该文件正常启动。

> 注意：
>
> - `scf_bootstrap` 必须有 `755` 或者 `777` 的可执行权限



**2. 修改文件读写路径**
由于在 SCF 环境内，只有 `/tmp` 文件可读写，其它目录会由于缺少权限而写入失败，因此需要在 `scf_bootstrap` 里，以环境变量的方式注入，调整 Laravel 框架的输出目录：

```
#!/bin/bash

# 注入 SERVERLESS 标识
export SERVERLESS=1
# 修改模板编译缓存路径，云函数只有 /tmp 目录可读写
export VIEW_COMPILED_PATH=/tmp/storage/framework/views
# 修改 session 以内存方式（数组类型）存储
export SESSION_DRIVER=array
# 日志输出到 stderr
export LOG_CHANNEL=stderr
# 修改应用存储路径
export APP_STORAGE=/tmp/storage

# 初始化模板缓存目录
mkdir -p /tmp/storage/framework/views
```



**3. 修改监听地址与端口**

在 Web 函数内，限制了监听端口必须为 `9000`，因此需要在在 `scf_bootstrap` 中，通过指定监听端口：

```
/var/lang/php7/bin/php artisan serve --host 0.0.0.0 --port 9000
```

完整 `scf_bootstrap` 内容如下：

<img src="https://main.qcloudimg.com/raw/016eb724229919ed7afcf8fc099a4e52.png" width="700"/>



**4. 本地配置完成后，执行启动文件**

确保您的服务可以本地正常启动，接下来，登录腾讯云云函数控制台，新建 Web 函数以部署您的 Laravel 项目：

<img src="https://main.qcloudimg.com/raw/3653f9d6bd7a733dbc835662ac1d0a52.png" width="700"/>



部署完成后，点击生成的 URL，即可访问您的 Laravel 应用：

<img src="https://main.qcloudimg.com/raw/e7e3610a07aeb09dcc0f045d5f529645.png" width="700"/>



### 3. 开发管理

部署完成后，即可在 SCF 控制台快速访问并测试您的 Web 服务，并且体验云函数多项特色功能如层绑定、日志管理等，享受 Serverless 架构带来的低成本、弹性扩缩容等优势。

<img src="https://main.qcloudimg.com/raw/7f912e810597183c493b20fed5eb5f3a.png" width="700"/>



## Web Function 体验官招募令

[**惊喜福利满满，点击查看活动详情**](https://mp.weixin.qq.com/s/YLIknQmXDKL9FzHEQlKQCQ)

<img src="https://main.qcloudimg.com/raw/545c2c8589959c675b8c501e8b41e363.png" width="700"/>



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