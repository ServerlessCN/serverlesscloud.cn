---
title: 国内首款 Serverless MySQL 数据库重磅发布！
description: 腾讯云 Serverless 生态中 MySQL 数据库版块补齐，试用期间免费！
date: 2021-01-07
thumbnail: https://main.qcloudimg.com/raw/9210c0ec6a7f9bdd76f9e0da399df425.jpg
categories:
  - best-practice
authors:
  - April
tags:
  - Serverless
  - 数据库
---

12 月 20 日的 Techo 大会上，腾讯云重磅发布了自研云原生数据库 **TDSQL-C Serverless**（原 CynosDB Serverless），这是国内首款计算和存储全 Serverless 架构的**云原生 MySQL**， TDSQL-C Serverless能够让企业用户像使用水、电、煤一样使用云数据库，用户不需为数据库的闲时进行付费，而是按照数据库资源响应单元实际使用量进行计费，将腾讯云云原生技术普惠用户。

作为 Serverless 生态中的重要一环，TDSQL-C Serverless 的发布也补齐了 Serverless 架构里 MySQL 数据库的空缺。因此，Serverless Framework 同步发布了 TDSQL-C Serverless 组件。这样，腾讯云就拥有了一套Serverless 全栈的核心解决方案，包括 Serverless API网关、腾讯云的 Serverless 函数计算服务、Serverless 对象存储和数据库。在数据存储层可以通过 TDSQL-C Serverless 直接对数据库连接并进行 SQL 操作。

**TDSQL-C Serverless**（MySQL 数据库），具备完全自动化的扩容能力，能够随着用户业务的请求数的增加和减少，智能化“膨胀”和“缩小”，实现资源的自动“吞吐”。从此以后，开发者可以真正的完成 Serverless 应用的开发，专注于业务本身，免除运维，按需付费，享受 Serverless 架构带来的众多优势。

另外，**TDSQL-C Serverless** 数据库在试用期间完全免费。

## 服务特性

- **自动驾驶（Autopilot）：** 

数据库根据业务负载自动启动停止，无感扩缩容，扩缩容过程不会断开连接。

- **按使用计费（Utility Pricing）：** 

按实际使用的计算和存储量计费，不用不付费，按秒计量，按小时结算。

## 适用场景

- 开发、测试环境等低频数据库使用场景。
- 物联网（IoT）、边缘计算等不确定负载场景。
- 中小企业建站等 SaaS 应用场景。

下面的教程将以 Node.js 开发语言的函数，指导您如何快速创建 TDSQL-C Serverless MySQL 实例，并在云函数中进行调用：

##  操作步骤

1. **配置环境变量** 
2. **配置私有网络：** 通过 Serverless Framework VPC 组件 创建 VPC 和 子网，支持云函数和数据库的网络打通和使用。
3. **配置 Serverless DB：** 通过 Serverless Framework Cynosdb 组件 创建 MySQL 实例，为云函数项目提供数据库服务。
4. **编写业务代码：** 通过 Serverless DB SDK 调用数据库，云函数支持直接调用 Serverless DB SDK，连接 PostgreSQL 数据库进行管理操作。
5. **部署应用：** 通过 Serverless Framework 部署项目至云端，并通过云函数控制台进行测试。
6. **移除项目：** 可通过 Serverless Framework 移除项目。

### 1. 配置环境变量

在本地建立目录，用于存放代码及依赖模块。本文以  `test-MySQL` 文件夹为例。

```
mkdir test-MySQL && cd test-MySQL
```

由于目前 TDSQL-C Serverless 只支持 `ap-beijing-3`，`ap-guangzhou-4`，`ap-shanghai-2` 和 `ap-nanjing-1` 四个区域，所以这里还需要配置下，只需要在项目根目录下创建 `.env` 文件，然后配置 `REGION` 和 `ZONE` 两个环境变量：

```text
# .env
REGION=xxx  
ZONE=xxx 
```

### 2. 配置私有网络

在 `test-MySQL` 目录下创建文件夹 `VPC`。

```
mkdir VPC && cd VPC
```

同时在 `VPC` 中新建 serverless.yml 文件，使用 [VPC 组件](https://github.com/serverless-components/tencent-vpc)完成私有网络和子网的创建。

`serverless.yml` 示例内容如下，全量配置参考[产品文档](https://github.com/serverless-components/tencent-vpc/blob/master/docs/configure.md)

```yml
#serverless.yml
org: mysql-app
app: mysql-app
stage: dev
component: vpc # (required) name of the component. In that case, it's vpc.
name: mysql-app-vpc # (required) name of your vpc component instance.
inputs:
  region: ${env:REGION}
  zone: ${env:ZONE}
  vpcName: serverless-mysql
  subnetName: serverless-mysql
```

### 3. 配置 Serverless DB

在 `test-MySQL` 下创建文件夹 `DB`，并在 `DB` 文件夹下新建 `serverless.yml` 文件，并输入以下内容，通过 Serverless Framework 组件完成云开发环境配置。

`serverless.yml` 示例内容如下，全量配置参考[产品文档](https://github.com/serverless-components/tencent-cynosdb/blob/master/docs/configure.md)

```yml
# serverless.yml 
org: mysql-app
app: mysql-app
stage: dev
component: cynosdb
name: mysql-app-db
inputs:
  region: ${env:REGION}
  zone: ${env:ZONE}
  vpcConfig:
    vpcId: ${output:${stage}:${app}:mysql-app-vpc.vpcId}
    subnetId: ${output:${stage}:${app}:mysql-app-vpc.subnetId}
```

### 4. 编写业务代码与配置文件

在 `test-MySQL` 下创建文件夹 `src`，用于存放业务逻辑代码和相关依赖项。并在 `src` 文件夹下创建文件 `index.js`，输入如下示例代码。在函数中通过 SDK 连接数据库，并在其中完成 MySQL 数据库的调用。

```js
exports.main_handler = async (event, context, callback) => {
  var mysql      = require('mysql2');
  var connection = mysql.createConnection({
    host     : process.env.HOST,
    user     : 'root',
    password : process.env.PASSWORD
  });
  connection.connect();
  connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
    if (error) throw error;
    console.log('The solution is: ', results[0].solution);
  });
  connection.end();
 }
```

安装所需依赖模块：

```
npm install mysql2
```

完成业务代码编写和依赖安装后，创建 `serverless.yml` 文件，示例文件如下：

```yml
org: mysql-app
app: mysql-app
stage: dev
component: scf
name: mysql-app-scf

inputs:
  src: ./
  functionName: ${name}
  region: ${env:REGION}
  runtime: Nodejs10.15
  timeout: 30
  vpcConfig:
    vpcId: ${output:${stage}:${app}:mysql-app-vpc.vpcId}
    subnetId: ${output:${stage}:${app}:mysql-app-vpc.subnetId}
  environment:
    variables:
      HOST: ${output:${stage}:${app}:mysql-app-db.connection.ip}
      PASSWORD: ${output:${stage}:${app}:mysql-app-db.adminPassword}
```

### 5. 快速部署

完成创建后，项目目录结构如下：

```
   ./test-MySQL
   ├── vpc
   │   └── serverless.yml # vpc 配置文件
   ├── db
   │   └── serverless.yml # db 配置文件
   ├── src
   │   ├── serverless.yml # scf 组件配置文件
   │   ├── node_modules # 项目依赖文件
   │   └── index.js # 入口函数
   └── .env # 环境变量文件
```

使用命令行在 `test-MySQL` 下，执行以下命令进行部署。

```bash
sls deploy
```

> - 部署时需要扫码授权，如果没有腾讯云账号，请 [注册新账号](https://cloud.tencent.com/register)。
> - 如果是子账号，请参考[子账号权限配置](https://cloud.tencent.com/document/product/1154/43006#.E5.AD.90.E8.B4.A6.E5.8F.B7.E6.9D.83.E9.99.90.E9.85.8D.E7.BD.AE)完成授权

返回结果如下所示，即为部署成功。

```
mysql-app-vpc: 
  region:        xxx
  zone:          xxx
  vpcId:         xxxx-xxx
  ...

mysql-app-db: 
  dbMode:        xxxx
  region:        xxxx
  zone:          xxxx
  ...

mysql-app-scf: 
  functionName:  xxxx
  description:   xxx
  ...

59s › test-MySQL › "deploy" ran for 3 apps successfully.

```

部署成功后，您可通过 [云函数控制台](https://console.cloud.tencent.com/scf/index?rid=1)，查看并进行函数调试，测试成功如下图所示：

![](https://main.qcloudimg.com/raw/f55346a48e68f78771fb746b58b3c1a0.png)


### 移除项目

在 `test-MySQL` 目录下，执行以下命令可移除项目。

```
sls remove
```

返回如下结果，即为成功移除。

```
serverless ⚡ framework
4s › test-MySQL › Success
```

除了通过组件一键创建所有资源外，您也可以通过控制台完成 Serverless 版本 MySQL 数据库的创建，并在云函数中正常使用 SDK 的方式完成调用。
- 详情参考：https://cloud.tencent.com/document/product/583/38012
- TDSQL-C Serverless 产品文档：https://cloud.tencent.com/document/product/1003/50853

---

欢迎访问：[Serverless 中文网](https://serverlesscloud.cn/)，您可以在 [最佳实践](https://serverlesscloud.cn/best-practice) 里体验更多关于 Serverless 应用的开发！