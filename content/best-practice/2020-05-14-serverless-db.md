---
title: Serverless DB 设计解读与实战
description: Serverless PostgreSQL 组件和 Serverless TCB 组件满足了用户通过云上资源使用数据库的需求
keywords: Serverless,Serverless Framework,DB,PostgreSQL,TCB
date: 2020-05-14
thumbnail: https://img.serverlesscloud.cn/2020518/1589791034615-db%E5%89%AF%E6%9C%AC.jpg
categories:
  - best-practice
authors:
  - April
authorslink:
  - https://zhuanlan.zhihu.com/ServerlessGo
tags:
  - Serverless DB
  - PostgreSQL
---

哈喽小伙伴们，我们都知道数据库在项目开发中往往是不可或缺的一环，而在云计算热度不断提升的背景之下，我们对于使用数据库的成本以及灵活性有了更高的要求。

**Serverless 团队近期新发布了两款组件来填补这最关键的一块拼图 —— Serverless DB！**

下面我们一起来看看吧！

## Serverless PostgreSQL 组件

PostgreSQL for Serverless 是一款基于 PostgreSQL 数据库实现的按需分配资源的数据库产品，其数据库将根据用户的实际请求数来自动分配资源。通过 PostgreSQL ServerlessDB 组件，用户可以快速方便地创建、配置和管理腾讯云的 PostgreSQL 实例。

**产品有以下特性：**

1. 低成本：产品按照用户使用的计算资源和容量来计费，没有请求时无需付费，减少使用成本。
2. 方便配置：默认配置将由 Serverless 为用户完成，用户也可自行在yaml文件中更改，短短几行即可完成配置工作，方便用户更好地关注自身业务逻辑。
3. 极速部署：部署过程流畅快捷，仅需几秒，即可创建或更新数据库。
4. 高可用：PostgreSQL for Serverless 支持一主一备高可用，当主实例出现意外导致不可用时，数据库将自动启动备用实例，此时业务连接将转移至备用实例当中，避免业务因意外情况而导致数据库无法使用。

## Serverless TCB 组件

用户在处理大数据时常常需要面临高并发读写、海量数据高效存储、高可扩展性等问题，传统的 RMDB 数据库难以满足用户需求，SLS 需要对创建 NoSQL DB 进行支持。有了基于云开发 TCB 的Serverless TCB 组件，用户通过该组件创建 tcb 环境，在代码中直接调用 tcb 的 SDK，实现 tcb 环境中 NoSQL DB 的创建和调用。

**产品有如下优势：**

1. 完全兼容：数据库完全兼容 MongoDB 协议，既适用于传统表结构的场景，更适用于缓存、非关系型数据以及利用 MapReduce 进行大规模数据集的并行运算的场景。
2. 安全性高：云数据库通过备份机制保存多天的备份数据，以便于在灾难情况下进行数据恢复。
3. 低成本：按量计费，用户无需为未使用资源进行额外付费。
4. 极速部署，操作简便：用户仅需几行代码便可完成配置，部署速度快，效率高。

---

**说了这么多，不如一起来试试吧！**

准备工作：安装好 Node.js（Node.js 版本需不低于 8.6，建议使用 Node.js10.0 及以上版本）

> Nodejs 下载地址：https://nodejs.org/en/download/

还未安装的小伙伴，可以通以下文档指引安装完成：[Serverless Framework 快速开始](https://www.serverless.com/cn/framework/docs/getting-started/)

## 实战一：部署 Vue + Express + PostgreSQL 全栈网站

1. 通过 npm 全局安装 Serverless Framework：

```
$ npm install -g serverless
```

安装完毕后，用如下命令查看 Serverless Framework 的版本信息，确保版本不低于 Components: 2.30.1

```
$ serverless -v
```

2. 新建本地文件夹 `serverless-wty`，下载相关的 template。

```
$ mkdir serverless-wty && cd serverless-wty
$ serverless create --template-url https://github.com/serverless-components/tencent-fullstack
```

目前 PostgreSQL 还不支持扫码一键部署，请在本地创建 `.env文件`，并在其中配置对应的腾讯云 SecretId、SecretKey、地域和可用区信息。

```
$ touch .env 
vim.env
```

> .env
TENCENT_SECRET_ID=xxx  // 您账号的 SecretId
TENCENT_SECRET_KEY=xxx // 您账号的 SecretKey
地域可用区配置
REGION=ap-guangzhou //资源部署区，该项目中指云函数与静态页面部署区
ZONE=ap-guangzhou-2 //资源部署可用区 ，该项目中指 DB 部署所在的可用区

*说明：如果没有腾讯云账号，请先[注册新账号](https://url.cn/UVqywKDk)。如果已有腾讯云账号，请保证您的账号已经授权了 AdministratorAccess 权限。您可以在 API 密钥管理中获取 SecretId 和 SecretKey。*

*ZONE 目前只支持 ap-beijing-3 、ap-guangzhou-2、ap-shanghai-2.*


3. 通过执行以下命令，安装所需依赖

```
$ npm run bootstrap
```

4. 执行以下命令，进行部署

```
$ sls deploy --all
```

部署成功后，您可以使用浏览器访问项目产生的 website 链接，即可看到生成的网站。

5. 执行如下命令，查看部署信息，该项目部署的信息：vpc、db、api、frontend（前端网站）

```
$ npm run info
```

6. 执行如下命令，可移除项目

```
$  sls remove --all
```

**上述实战主要包含以下组件:**

- Serverless RESTful API：通过云函数和 API 网关构建的 Express 框架实现
RESTful API。
- Serverless 静态网站：前端通过托管 Vue.js 静态页面到 COS 对象存储中。
- PostgreSQL Serverless：通过创建 PostgreSQL DB 为全栈网站提供数据库服务。
VPC：通过创建 VPC 和 子网，提供 SCF 云函数和数据库的网络打通和使用。

## 实战二：部署支持 NoSQL 数据库的全栈网站

1. 通过 npm 全局安装 Serverless CLI：

```
$ npm install -g serverless
```

安装完毕后，用如下命令查看 Serverless Framework 的版本信息，确保版本不低于 `Components: 2.30.1`

```
$ serverless -v
```

2. 新建一个本地文件夹，使用 `create --template-url` 命令，下载相关 template：

```
$ mkdir my_tcbdemo && cd my_tcbdemo
$ serverless create --template-url https://github.com/serverless-components/tencent-mongodb/tree/master/example/fullstack-demo
```

找到 `function->serverless.yaml` 文件，填入自己的 SecretId 和 SecretKey，再进入 `function->src` 文件夹目录下，通过以下命令安装所需依赖完成配置：

```
$ npm install
```

*说明：如果没有腾讯云账号，请先[注册新账号](https://url.cn/UVqywKDk)。如果已有腾讯云账号，可以在 API 密钥管理 中获取 SecretId 和 SecretKey。目前 sls（serverless 的简称）支持在国内区域访问 TCB，部署时请注意 yaml 文件里的地域设置，其他地域可能会报错。*

3. 配置完成后，进入根目录下，通过以下命令进行部署，创建一个新的云开发环境，将后台代码部署到云函数 SCF 平台，并通过 website 组件部署静态网站：

```
$ sls deploy --all
```

访问命令行输出的 website url，即可查看您的 Serverless 站点。

**注意：**

- 由于 sls 运行角色限制，需要用户登录 访问管理角色页面，手动为 SLS_QcsRole 添加 TCBFullAccess 的策略，否则无法正常运行。
- 当前 deploy --all 指令只支持2.30.1及以上版本 Serverless Framework Component，请确保您的组件已更新至最新版本。
- 目前 TCB 端仅支持每月最多创建销毁4次环境，请谨慎创建，若超过4次部署将会报错。
- DB组件默认为用户创建一个免费云开发环境，如您已有该环境，部署时会报错，请删去db文件夹中的yaml文件，并在function的yaml文件中MongoId参数里输入您已有TCB环境的ID，完成项目的部属。

4. 部署结束后，您可通过以下命令移除项目：

```
$ sls remove --debug
```

**上述实战主要包含以下组件：**

- Serverless Website： 前端通过托管 HTML 静态页面到对象存储 COS 中。
- Serverless Cloud Function： 后端函数部署到云端，通过 HTTP 进行触发调用。
- 云开发 TCB 环境： 通过创建云开发环境并调用 NoSQL DB，为全栈网站提供数据库服务。

Serverless PostgreSQL 组件和 Serverless TCB 组件不仅满足了大家通过云上资源使用数据库的需求，还同时支持 PostgreSQL 与 NoSQL 两种数据库类型，大家可以按照自己的使用习惯选择合适的组件完成部署。

更多文档资料参考：https://cloud.tencent.com/product/sls



---
<div id='scf-deploy-iframe-or-md'></div>

---

> **传送门：**
> - GitHub: [github.com/serverless](https://github.com/serverless/serverless/blob/master/README_CN.md)
> - 官网：[serverless.com](https://serverless.com/)

欢迎访问：[Serverless 中文网](https://serverlesscloud.cn/)，您可以在 [最佳实践](https://serverlesscloud.cn/best-practice) 里体验更多关于 Serverless 应用的开发！
