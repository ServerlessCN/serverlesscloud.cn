---
title:
  使用 Serverless Framework，结合云函数 SCF、API 网关和云数据库 MySQL 构建
  REST API
description: 本文介绍如何创建一个进行自动化面试评估的 Serverless 应用！
date: 2019-12-17
thumbnail: https://img.serverlesscloud.cn/20191231/1577769064015-joshua-aragon-FGXqbqbGt5o-unsplash.jpg
categories:
  - guides-and-tutorials
  - user-stories
authors:
  - Aceyclee
authorslink:
  - https://www.zhihu.com/people/Aceyclee
---

Serverless 字面意思是「无服务器」。根据语境的不同，Serverless 可能有不同的解读方
法：比如它可能意味着使用 Firebase 等第三方托管的服务，也可能是腾讯云等云厂商提供
的计算服务，或者可能是构建 Serverless 应用中所用到的无服务器框架。具体解读可参考
：[Serverless 基础概念入门](https://serverlesscloud.cn/blog/2019-08-01-serverless-basic-concept/)

本文将介绍如何使用云函数 SCF、API 网关、云数据库 MySQL 和 Serverless Framework
构建 REST API。

**简单介绍一下：**

- [云函数 SCF](https://cloud.tencent.com/product/scf)：
  腾讯云为开发者提供的无服务器执行环境，用户只需使用平台支持的语言编写核心代码并
  设置代码运行的条件，即可在腾讯云基础设施上弹性、安全地运行代码。SCF 目前支持
  Java、Python、Node.js 和 PHP 等。
- [Serverless Framework](https://github.com/serverless/serverless)：在 GitHub 上
  有三万颗星，业界非常受欢迎的无服务器应用框架，开发者无需关心底层资源即可部署完
  整可用的 Serverless 应用架构。

## 应用：Serverless 编程面试评估器

在我目前团队的面试中，有一项是测验候选人的代码能力。我们会先给候选人布置一个一周
完成的小作业，然后我们会评估作业的完成情况，来测试候选人是否足够优秀。

我们打算把评估过程自动化，即使没有人干预，也能筛选出不合适的候选人。毕竟，能够自
动化完成的任务就应该自动化。下面是这个应用的工作流程：

1. 团队将候选人的详细信息提交给系统；
2. 系统根据候选人的技能和经验发送出一封带有标记的作业邮件，作业中包含了 Gradle
   或者 Maven project 等；
3. 候选人编写代码并交付作业 (eg: `gradle submitAssignment`)，然后压缩候选人的源
   码并提交到系统；
4. 收到作业后，系统将构建项目并运行所有的测试用例；

- 如果构建失败，候选人状态标记为 failed，并反馈给招聘团队
- 如果构建成功，我们将测试代码覆盖率，如果小于某个值，则标记 failed 并通知团队

5. 如果构建成功并且代码覆盖率达标，那么我们将分析代码并计算代码质量得分，低于某
   个分数则标记 failed。反之则通过代码测试进入终面。

在本教程中，我们将构建一个 REST API 来存储候选者的详细信息，并从头开始构建一个完整的
Serverless 应用。

## 动手准备

完成本教程之前，首先确保系统包含以下环境：

1. 一个可用的[腾讯云账户](https://cloud.tencent.com/login)（Serverless Framework 支持[微信扫码一键登录](https://serverlesscloud.cn/blog/2019-12-5-Wechat-code-scanning-login/)）
2. [Node.js](https://nodejs.org/en/) (版本号不低于 8.6，建议使用 10.0 及以上)
3. [Serverless Framework](https://github.com/serverless/serverless)

通过以下命令安装 Serverless Framework：

```
$ npm install -g serverless
```

你可以使用命令缩写 `sls` 来代替 `serverless`。

## Step 1: 创建一个 Node.js 无服务器项目

创建目录 `coding-round-evaluator` 并进入该目录：

```
$ mkdir coding-round-evaluator && cd coding-round-evaluator
```

在该目录下，我们开始搭建第一个微服务，它将保存候选人的详细信息，列出候选者并获取
单个候选者的信息：

```
$ sls create --template tencent-nodejs --path candidate-service --name candidate
```

文件 `candidate-service` 的目录结构如下：

```bash
.
├── index.js
├── package.json
└── serverless.yml
```

我们来看看这三个文件：

1. **index.js**：定义了你的云函数；
2. **package.json**：定义了该服务所依赖的其他库；
3. **serverless.yml**：定义 Serverless Framework 创建服务所用的资源配置。

## Step 2：创建用于提交候选人的 REST 资源

我们先配置 serverless.yml 文件：

```yaml
service: candidate # 定义服务名称

provider: # 云厂商相关配置
  name: tencent
  runtime: Nodejs8.9 # Nodejs8.9 or Nodejs6.10
  credentials: ~/credentials

plugins:
  - serverless-tencent-scf

functions: # 定义了 candidateSubmission 的功能
  candidateSubmission:
    handler: candidate.submit
    events:
      - apigw:
          name: api
          parameters:
            stageName: release
            serviceId:
            httpMethod: POST
```

现在，在 `candidate-service` 中创建一个新的 `api` 目录，将 `handler.js` 移到 `api` 目录。重命名 `index.js` 为
`candidate.js`；重命名 `handle` 为 `submit`.

```javascript
'use strict';

module.exports.submit = (event, context, callback) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Go Serverless v1.0! Your function executed successfully!',
      input: event,
    }),
  };

  callback(null, response);
};
```

在执行部署前，需要安装 `serverless` 插件 `serverless-tencent-scf`：

```shell
$ npm i serverless-tencent-scf --save-dev
```

执行 `serverless deploy` 命令进行部署：

```
$ sls deploy --debug
```

```bash
Serverless: Packaging service...
Serverless: Excluding development dependencies...
Serverless: Creating Stack...
Serverless: Checking Stack create progress...
.....
Serverless: Uploading service package to cos[sls-cloudfunction-ap-guangzhou]. candidate-dev-FahKxK-2019-12-25-16-54-31.zip
Serverless: Uploaded package successful /Users/yugasun/Desktop/Develop/@yugasun/mysql-demo/.serverless/candidate.zip
Serverless: Creating function candidate-dev-candidateSubmission
Serverless: Created function candidate-dev-candidateSubmission
Serverless: Setting tags for function candidate-dev-candidateSubmission
Serverless: Creating trigger for function candidate-dev-candidateSubmission
Serverless: Created apigw trigger candidate-dev-candidateSubmission_apigw for function candidate-dev-candidateSubmission success. service id service-nld6x64o url https://service-nld6x64o-1251556596.gz.apigw.tencentcs.com/release/candidate-dev-candidateSubmission
Serverless: Deployed function candidate-dev-candidateSubmission successful
Serverless: Service Information
service: candidate
stage: dev
region: ap-guangzhou
stack: candidate-dev
resources: 1
functions:   candidateSubmission: candidate-dev-candidateSubmission
    POST - https://service-nld6x64o-1251556596.gz.apigw.tencentcs.com/release/candidate-dev-candidateSubmission
```

现在，POST 操作可用了，您可以使用 cURL 等工具来发出 POST 请求。

```shell
$ curl -X POST https://service-nld6x64o-1251556596.gz.apigw.tencentcs.com/release/candidate-dev-candidateSubmission
```

```
{"message":"Go Serverless v1.0! Your function executed successfully!", "input":{...}}
```

## Step 3：将数据保存到云数据库 MySQL 上

在开始连接数据库之前，你需要先创建一个 MySQL 实例，然后初始化数据库
`serverless`。


```yaml
provider: # 云厂商相关配置
  name: tencent
  region: ap-guangzhou
  role: QCS_SCFFull # You must add a role who can connect to your clound mysql
  runtime: Nodejs8.9 # Nodejs8.9 or Nodejs6.10
  timeout: 60
  vpcConfig: # you must set vpc config for mysql connnect
    vpcId: vpc-xxx
    subnetId: subnet-xxx
  environment:
    variables:
      DB_HOST: 127.0.0.1
      DB_USER: root
      DB_PORT: 3306
      DB_PASSWORD: 123
      DB_DATABASE: serverless

functions: # 定义了 candidateSubmission 的功能
  candidateSubmission:
    handler: candidate.submit
    events:
      - apigw:
          name: api
          parameters:
            stageName: release
            serviceId: xxx
            httpMethod: POST
```

安装依赖：

```Shell
$ npm install --save mysql2
$ npm install --save uuid
```

更新 `api/candidate.js`：

```javascript
'use strict';

const uuid = require('uuid');
const mysql = require('mysql2');

// init mysql connection
function initMysqlPool() {
  const { DB_HOST, DB_PORT, DB_DATABASE, DB_USER, DB_PASSWORD } = process.env;

  const promisePool = mysql
    .createPool({
      host: DB_HOST,
      user: DB_USER,
      port: DB_PORT,
      password: DB_PASSWORD,
      database: DB_DATABASE,
      connectionLimit: 1,
    })
    .promise();
  promisePool.query(
    `CREATE TABLE IF NOT EXISTS candidates (
    id          VARCHAR(64)        NOT NULL,
    fullname    TEXT          NOT NULL,
    email       VARCHAR(64)      NOT NULL,
    experience  INT UNSIGNED  NOT NULL,
    submittedAt VARCHAR(64)      NOT NULL,
    updatedAt   VARCHAR(64)      NOT NULL
  );`,
  );

  return promisePool;
}

const pool = initMysqlPool();

module.exports.submit = async (event, context, callback) => {
  const requestBody = JSON.parse(event.body);
  const fullname = requestBody.fullname;
  const email = requestBody.email;
  const experience = requestBody.experience;

  if (
    typeof fullname !== 'string' ||
    typeof email !== 'string' ||
    typeof experience !== 'number'
  ) {
    console.error('Validation Failed');
    callback(
      new Error("Couldn't submit candidate because of validation errors."),
    );
    return;
  }

  const timestamp = new Date().getTime();
  const candidate = {
    id: uuid.v4(),
    fullname: fullname,
    email: email,
    experience: experience,
    submittedAt: timestamp,
    updatedAt: timestamp,
  };
  try {
    console.log('Submitting candidate');
    const [data] = await pool.query('INSERT into candidates SET ?', candidate);
    console.log(data);
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: `Sucessfully submitted candidate with email ${email}`,
        candidateId: data.insertedId,
      }),
    };
  } catch (err) {
    console.log(err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: `Unable to submit candidate with email ${email}`,
      }),
    };
  }
};
```

现在，可以执行部署了：

```shell
$ serverless deploy -v
```

这将创建数据表。

要测试 API，可以再次使用 cURL

```bash
$ curl -H "Content-Type: application/json" -X POST -d '{"fullname":"Shekhar Gulati","email": "shekhargulati84@gmail.com", "experience":12}' https://service-6qkg1mbu-1251556596.gz.apigw.tencentcs.com/release/candidate-dev-candidateSubmission
```

您将从 API 收到如下响应：

```json
{
  "message": "Sucessfully submitted candidate with email shekhargulati84@gmail.com",
  "candidateId": "5343f0c0-f773-11e6-84ed-7bf29f824f23"
}
```

## Step 4：获取所有候选人

在 `serverless.yml` 里定义一个新函数：

```yaml
listCandidates:
  handler: candidate.list
  description: List all candidates
  events:
    - apigw:
        name: listApi
        parameters:
          stageName: release
          serviceId: service-6qkg1mbu
          httpMethod: GET
```

在 `api/candidate.js` 里创建新功能：

```javascript
module.exports.list = async (event, context, callback) => {
  console.log('Scanning Candidate table.');
  try {
    const [data] = await pool.query('select * from candidates');
    return {
      statusCode: 200,
      body: JSON.stringify({
        candidates: data,
      }),
    };
  } catch (e) {
    console.log(e);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: `Unable to get candidates`,
      }),
    };
  }
};
```

再次执行部署操作：

```
$ sls deploy
```

部署成功后，您将能够使用 cURL 来测试 API。

```bash
curl https://service-6qkg1mbu-1251556596.gz.apigw.tencentcs.com/release/candidate-dev-listCandidates
{"experience":12,"id":"5343f0c0-f773-11e6-84ed-7bf29f824f23","email":"shekhargulati84@gmail.com","fullname":"Shekhar Gulati","submittedAt":1487598537164,"updatedAt":1487598537164}
```

## Step 5：按照 ID 来获取候选人的详细信息

在 `serverless.yml` 里定义一个新函数：

```Yaml
  candidateDetails:
    handler: candidate.get
    events:
      - apigw:
          name: detailApi
          parameters:
            stageName: release
            serviceId:
            httpMethod: GET
```

在 `api/candidate.js` 里定义一个新功能：

```javascript
module.exports.get = async (event, context, callback) => {
  try {
    const id = event.pathParameters.id;
    const [row] = await pool.query('SELECT * FROM candidates WHERE id = ?', [
      id,
    ]);
    callback(null, row);
  } catch (e) {
    console.log(e);
    callback(null, {
      statusCode: 500,
      body: JSON.stringify({
        message: `Unable to get candidate with id ${id}`,
      }),
    });
  }
};
```

使用 cURL 测试 API：

```bash
curl https://05ccffiraa.execute-api.us-east-1.amazonaws.com/dev/candidates/5343f0c0-f773-11e6-84ed-7bf29f824f23
{"experience":12,"id":"5343f0c0-f773-11e6-84ed-7bf29f824f23","email":"shekhargulati84@gmail.com","fullname":"Shekhar Gulati","submittedAt":1487598537164,"updatedAt":1487598537164}
```

## 小结

至此，本文已经完整地展示了如何通过  [Serverless Framework](https://github.com/serverless/serverless) 来创建 REST API，源码下载：[Serverless With Mysql](https://github.com/yugasun/tencent-serverless-demo/tree/master/serverless-mysql)。您还可以在 [最佳实践](https://serverlesscloud.cn/best-practice) 里体验更多关于 Serverless 应用的开发，
欢迎访问：[Serverless 中文技术社区](https://serverlesscloud.cn/)！😝

> 参考：
> - [Serverless Framework - 产品官网](https://cloud.tencent.com/product/sf) 
> - [Serverless Framework - GitHub](https://github.com/serverless/serverless/blob/master/README_CN.md) 


