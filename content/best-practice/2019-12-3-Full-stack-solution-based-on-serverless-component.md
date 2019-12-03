---
title: 基于 Serverless Component 的全栈解决方案 
description: 本文将介绍如何借助 Serverless Component 快速开发全栈Web应用。
date: 2019-12-03
thumbnail: https://uploader.shimo.im/f/iDi2bQ9L1J4RLn5b.png
authors:
  - yugasun
authorslink:
  - https://juejin.im/post/5de5e71d6fb9a071771c204a
---

## 什么是 Serverless Component

[Serverless Component](https://github.com/serverless/components) 是基于无服务器框架 （[Serverless Framework](https://github.com/serverless/serverless)）的支持多个云资源编排和组织的场景化解决方案。

Serverless Component 的目标是磨平不同云服务平台之间差异，你可以将它看作是可以更轻松地构建应用程序的依赖模块。目前 Serverless Component 已经形成一个由社区贡献驱动的生态系统，你可以浏览和使用社区的所有组件，快速开发一款自己想要的应用。

<!--more-->

## Serverless Component 工作原理

基于Serverless Component 架构，你可以将任何云服务打包成一个组件。这个组件将含有一份 `serverless.yml` 配置文件，并且通过简单地进行配置就可以使用。我们以 [@serverless/tencent-express](https://github.com/serverless-components/tencent-express) 来举🌰。

如果我们要使用它，只需要新建一个项目 `express-demo`，然后修改 `serverless.yml` 配置如下：

```yaml
express:
  component: '@serverless/tencent-express'
  inputs:
    region: ap-shanghai
```

因为 `serverless` 框架部署到云的鉴权都是基于 [dotenv](https://github.com/bkeepers/dotenv) 注入全局的变量来实现的，所以还得在根目录下新增 `.env` 文件，并配置对应的鉴权参数。

之后我们就可以在 `app.js` 中轻松的编写基于 `express` 的接口服务了：

```js
const express = require('express')
const app = express()
app.get('/', function(req, res) {
  res.send('Hello Express')
})
// 不要忘了导出，因为该组件会对它进行包装，输出成云函数
module.exports = app
```
这背后所有的流程逻辑都是组件内部实现的，包括：云函数的部署，API网关的生成等。

下面是一张简单的组件依赖图：

![Component Dependency Structure](https://static.yugasun.com/serverless/component-framework.png)

通过此图可以清晰地查看组件带来的收益，借助社区现有的 [@serverless/tencent-express](https://github.com/serverless-components/tencent-express) 和 [@serverless/tencent-website](https://github.com/serverless-components/tencent-website) 组件，我们就可以很快构建想要的全栈应用。

## 全栈应用实战

接下来将介绍如何借助 Serverless Component 快速开发全栈Web应用。

开始之前，首先要安装Node.js (Node.js 版本需不低于 8.6，建议使用 Node.js 10.0 及以上版本)，具体可参考 [Node.js 安装指南](https://nodejs.org/zh-cn/download/)。然后在命令行中执行 `npm install -g serverless` 命令，全局安装 `serverless Framework cli`。

### 准备

新建项目目录 `fullstack-application-vue`，在该项目目录下新增 `api` 和 `dashboard` 目录。然后新增 `serverless.yml` 和 `.env` 配置文件，项目目录结构如下：

```text
├── README.md 		// 项目说明文档
├── api					  // Restful api 后端服务
├── dashboard			// 前端页面
├── .env					// 腾讯云相关鉴权参数：TENCENT_APP_ID，TENCENT_SECRET_ID，TENCENT_SECRET_KEY
└── serverless.yml	// serverless 文件
```

### 后端服务开发

进入目录 `api`，新增 `app.js` 文件，编写 `express` 服务代码，这里先新增一个路由 `/`，并返回当前服务器时间：

```js
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.get('/', (req, res) => {
  res.send(JSON.stringfy({ message: `Server time: ${new Date().toString()}` }));
});
module.exports = app;
```

### 前端页面开发

本案例使用的是 `Vue.js` + `Parcel` 的前端模板，当然你可以使用任何前端项目脚手架，比如 Vue.js 官方推荐的 [Vue CLI](https://github.com/vuejs/vue-cli) 生成的项目。进入 `dashboard` 目录，静态资源你可以直接复制我准备好的 [项目模板](https://github.com/yugasun/tencent-serverless-demo/tree/master/fullstack-application-vue)，编写入口文件 `src/index.js`:

```js
// 这里初始是没有 env.js 模块的，第一次部署后会自动生成
require('../env');

const Vue = require('vue');

module.exports = new Vue({
  el: '#root',
  data: {
    message: 'Click me!',
    isVisible: true,
  },
  methods: {
    async queryServer() {
      const response = await fetch(window.env.apiUrl);
      const result = await response.json();
      this.message = result.message;
    },
  },
});
```

### 配置

前后端代码都准备好了，现在我们还需要简单配置下 `serverless.yml` 文件了：

```yaml
name: fullstack-application-vue

frontend:
  component: '@serverless/tencent-website'
  # inputs 为 @serverless/tencent-website 组件的输入
  # 具体配置说明参考：https://github.com/serverless-components/tencent-website/blob/master/docs/configure.md
  inputs:
    code:
      src: dist
      root: frontend
      hook: npm run build
    env:
    	# 下面的 API服务部署后，获取对应的 api 请求路径
      apiUrl: ${api.url}

api:
  component: '@serverless/tencent-express'
  # inputs 为 @serverless/tencent-express 组件的输入
  # 具体配置说明参考：https://github.com/serverless-components/tencent-express/blob/master/docs/configure.md
  inputs:
    code: ./api
    functionName: fullstack-vue-api
    apigatewayConf:
      protocol: https
```

> 简单的介绍下配置：首先，该文件定义了 `frontend` 和 `api` 两个模块，分别通过 `component` 属性指定依赖的 Serverless Framework。对于一个标准的 Serverless Framework，都会接受一个 `inputs` 属性参数，然后组件会根据 `inputs` 的配置进行处理和部署，具体有关配置的参数说明，请参考相关组件的官方配置说明。

### 部署

以上所有的步骤都完成后，接下来就是第一次部署了。

为什么不是直接联调开发呢？因为后端服务是云函数，但是到目前为止，所有代码都是在本地编写，前端页面接口请求链接还不存在。所以需要先将云函数部署到云端，才能进行前后端调试。这个也是本人目前遇到的痛点，因为每次修改后端服务后，都需要重新部署，然后进行前端开发调试。如果你有更好的建议，欢迎评论指教~

部署时，只需要运行 `serverless` 命令就行，当然如果你需要查看部署中的 `DEBUG` 信息，还需要加上 `--debug` 参数，如下：

```bash
$ serverless
# or
$ serverless --debug
```

然后终端会 `balabalabala~`, 输出一大堆 `DEBUG` 信息，最后只需要看到绿色的 `done` 就行了：

![Deploy Success Result](https://static.yugasun.com/serverless/deploy-success.png)

这样一个基于 Serverless Framework 的全栈应用就开发好了。赶紧点击你部署好的链接体验一下吧~

[在线 Demo](https://br1ovx-efmogqe-1251556596.cos-website.ap-guangzhou.myqcloud.com/)

## 数据库连接

既然是全栈，怎么少得了数据库的读写呢？接下来介绍如何添加数据库的读写操作。

### 准备

想要操作数据库，必须先拥有一台数据库实例，[腾讯云Mysql云数据库](https://console.cloud.tencent.com/cdb) 现在也很便宜，可以购买一个最基本按量计费 `1核1G内存` 的 1小时收费不到 `4 毛钱`，是不是非常划算。购买好之后初始化配置，然后新增一个 `serverless` 数据库，同时新增一张 `users` 表：

```sql
CREATE TABLE if not exists `test` ( `name` varchar (32) NOT NULL ,`email` varchar (64) NOT NULL ,`site` varchar (128) NOT NULL ) ENGINE = innodb DEFAULT CHARACTER SET = "utf8mb4" COLLATE = "utf8mb4_general_ci"
```

### 前端修改

首先修改前端入口文件 `frontend/src/index.js` 新增相关函数操作：

```js
require('../env');

const Vue = require('vue');
const axios = require('axios');
module.exports = new Vue({
  el: '#root',
  data: {
    // ...
    form: {
      name: '',
      email: '',
      site: '',
    },
    userList: [],
  },
  methods: {
    // ...
    // 获取用户列表
    async getUsers() {
      const res = await axios.get(window.env.apiUrl + 'users');
      this.userList = res.data && res.data.data || [];
    },
    // 新增一个用户
    async addUser() {
      const data = this.form;
      const res = await axios.post(window.env.apiUrl + 'users', data);
      console.log(res);
      if (res.data) {
        this.getUsers();
      }
    },
  },
  mounted() {
    // 视图挂在后，获取用户列表
    this.getUsers();
  }
});
```

当然你还需要修改视图模板文件 `frontend/index.html`，在页面模板中新增用户列表和用户表单：

```html
<!-- user form -->
<section class="user-form" action="#">
  <div class="form-item">
    <label for="name">
      Name:
    </label>
    <input name="name" v-model="form.name" type="text" /><br />
  </div>
  <div class="form-item">
    <label for="email">
      Email:
    </label>
    <input name="email" v-model="form.email" type="email" /><br />
  </div>
  <div class="form-item">
    <label for="site">
      Site:
    </label>
    <input name="site" v-model="form.site" type="text" /><br />
  </div>
  <button @click="addUser">Submit</button>
</section>

<!-- user list -->
<section class="user-list">
  <ul v-if="userList.length > 0">
    <li v-for="item in userList" :key="item.id">
      <p>
        <b>Name: {{ item.name }}</b>
        <b>Email: {{ item.email }}</b>
        <b>Site: {{ item.site }}</b>
      </p>
    </li>
  </ul>
  <span v-else>No Data</span>
</section>
```

> 注意：如果还不熟悉 Vue.js 语法，请移至 [官方文档](https://cn.vuejs.org/)，当然如果你想快速上手 Vue.js 开发，也可以阅读这份 [Vue 从入门到精通](https://yugasun.github.io/You-May-Not-Know-Vuejs/) 教程。

### 后端修改

这里使用 `.env` 来进行数据库连接参数配置，在 `api` 目录下新增 `.env` 文件，将之前的数据库配置填入文件中，参考 `api/.env.example` 文件。然后添加并安装 `dotenv` 依赖，同时添加 `mysql2` 模块进行数据库操作，`body-parser` 模块进行 `POST` 请求时的 `body` 解析。

之后新增后端api，进行数据库读写，修改后的 `api/app.js` 代码如下：

```js
'use strict';
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

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

  return promisePool;
}

const app = express();
app.use(bodyParser.json());
app.use(cors());

if (!app.promisePool) {
  app.promisePool = initMysqlPool();
}

app.get('/', (req, res) => {
  res.send(JSON.stringify({ message: `Server time: ${new Date().toString()}` }));
});

// get user list
app.get('/users', async (req, res) => {
  const [data] = await app.promisePool.query('select * from users');
  res.send(
    JSON.stringify({
      data: data,
    }),
  );
});

// add new user
app.post('/users', async (req, res) => {
  let result = '';
  try {
    const { name, email, site } = req.body;
    const [res] = await app.promisePool.query('INSERT into users SET ?', {
      name: name,
      email: email,
      site: site,
    });
    result = {
      data: res && res.insertId,
      message: 'Insert Success',
    };
  } catch (e) {
    result = {
      data: e,
      message: 'Insert Fail',
    };
  }

  res.send(JSON.stringify(result));
});

module.exports = app;
```

### 配置修改

这里数据库访问需要通过腾讯云私有网络，所以还需要为云函数配置私有网络（VPC），同时还需要配置能够操作数据库的角色（关于角色配置，可以直接到 [角色管理页面](https://console.cloud.tencent.com/cam/role)），这里我新建了一个 `QCS_SCFFull` 的角色，可以用来访问数据库。然后修改 `serverless.yml` 中的配置：

```yaml
# ...
api:
  component: '@serverless/tencent-express'
  # more configuration for @serverless/tencent-website,
  # refer to: https://github.com/serverless-components/tencent-express/blob/master/docs/configure.md
  inputs:
    code: ./api
    functionName: fullstack-vue-api
    role: QCS_SCFFull # 此角色必须具备访问数据库权限
    functionConf:
      # 这个是用来访问新创建数据库的私有网络，可以在你的数据库实例管理页面查看
      vpcConfig:
          vpcId: vpc-6n5x55kb
          subnetId: subnet-4cvr91js
    apigatewayConf:
      protocol: https
```

最后重新部署一下就行了。

[完整的模板仓库](https://github.com/yugasun/tencent-serverless-demo/tree/master/fullstack-application-vue)

[在线Demo](https://br1ovx-efmogqe-1251556596.cos-website.ap-guangzhou.myqcloud.com)

## 总结

当然全栈方案，并没有这么简单，这里只是简单介绍如何使用 Serverless Component 快速实现一个全栈应用，如果要应用到实际的业务场景，还需考虑更多的问题。目前社区组件还不够完善，很多功能还需要自己去探索发现。也希望更多牛人加入到 Serverless Framework 社区，贡献更多的优秀组件。
