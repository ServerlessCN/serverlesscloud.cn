---
title: 'xxxxx(vue.js+express.js)'
description: '了解部署无服务器应用时的一些最佳实践。'
date: 2019-10-14
thumbnail: 'https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/2019-10-deployment-best-practices/safeguard-header.png'
categories:
  - best-practice
authors:
  - FernandoMedinaCorey
authorslink:
  - https://github.com/Aceyclee
translators:
  - Aceyclee_01
translatorslink:
---

## 操作场景

#### xxxx

###### 安装

1. 通过如下命令安装 [Serverless Framework](https://www.github.com/serverless/serverless)：

```console
$ npm i -g serverless
```

2. 新建一个本地文件夹，使用 `create --template-url` ，安装相关 template。您也可以将文件直接下载到本地：

```console
$ serverless create --template-url https://github.com/serverless/components/tree/master/templates/tencent-fullstack-application
```

###### 创建

使用`cd`命令，进入`tencent-fullstack-application` 文件夹，在其根目录创建 `.env` 文件：

```console
$ touch .env # 腾讯云的配置信息
```

在 `.env` 文件中配置腾讯云的 APPID、SecretId 和 SecretKey 信息并保存。

```
# .env
TENCENT_SECRET_ID=123
TENCENT_SECRET_KEY=123
TENCENT_APP_ID=123
```

> - 如果没有腾讯云账号，请先 [注册新账号](https://cloud.tencent.com/register)。
> - 如果已有腾讯云账号，可以在 [API 密钥管理](https://console.cloud.tencent.com/cam/capi) 中获取 APPID、SecretId 和 SecretKey。

您也可以在部署之前手动将它们设置为环境变量。
将 NPM 依赖项分别安装在 `dashboard` 和 `api` 两个文件目录：

```console
$ cd dashboard
$ npm i
```

```
$ cd api
$ npm i
```

完成后的目录结构，如下所示:

```
|- api
|- dashboard
|- serverless.yml      # 使用项目中的 yml 文件
|- .env      # 腾讯云 SecretId/Key/AppId
```

###### 部署

- 可以直接通过 `serverless` 命令来部署应用:

```console
$ serverless
```

- 也可以使用 `--debug` 调试命令来查看所有环境部署的详细情况：

```console
$ serverless --debug
```

###### 使用

首次部署成功后，即可在本地运行服务，并与后端腾讯云服务进行通讯。

```console
$ cd dashboard && npm run start
```
