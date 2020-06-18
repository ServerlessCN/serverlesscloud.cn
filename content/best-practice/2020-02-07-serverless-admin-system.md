---
title: Serverless + Egg.js 后台管理系统实战
description: 本文将介绍如何基于 Egg.js 和 Serverless 实现一个后台管理系统
keywords: Egg.js,Serverless后台管理,Serverless Egg.js
date: 2020-02-07
thumbnail: https://img.serverlesscloud.cn/20191226/1577362754931-egg.png
categories:
  - best-practice
authors:
  - yugasun
authorslink:
  - https://github.com/yugasun
tags:
  - Serverless
  - Egg.js
---

作为一名前端开发者，在选择 Nodejs 后端服务框架时，第一时间会想到 [Egg.js](https://github.com/eggjs/egg/)，不得不说 `Egg.js` 是一个非常优秀的企业级框架，它的高扩展性和丰富的插件，极大的提高了开发效率。开发者只需要关注业务就好，比如要使用 `redis`，引入 [egg-redis](https://github.com/eggjs/egg-redis) 插件，然后简单配置就可以了。正因为如此，第一次接触它，我便喜欢上了它，之后也用它开发过不少应用。

有了如此优秀的框架，那么如何将一个 `Egg.js` 的服务迁移到 `Serverless` 架构上呢？

<!--more-->

## 背景

我在文章 [基于 Serverless Component 的全栈解决方案](https://yugasun.com/post/serverless-fullstack-vue-practice.html) 中讲述了，如何将一个基于 `Vue.js` 的前端应用和基于 `Express` 的后端服务，快速部署到腾讯云上。虽然受到不少开发者的喜爱，但是很多开发者私信问我，这还是一个 `Demo` 性质的项目而已，有没有更加实用性的解决方案。而且他们实际开发中，很多使用的正是 `Egg.js` 框架，能不能提供一个 `Egg.js` 的解决方案？

本文将手把手教你结合 `Egg.js` 和 `Serverless` 实现一个后台管理系统。

读完此文你将学到：

1. Egg.js 基本使用
2. 如何使用 Sequelize ORM 模块进行 Mysql 操作
3. 如何使用 Redis
4. 如何使用 JWT 进行用户登录验证
5. [Serverless Framework](https://github.com/serverless/serverless) 的基本使用
6. 如何将本地开发好的 Egg.js 应用部署到腾讯云云函数上
7. 如何基于云端对象存储快速部署静态网站

## Egg.js 入门

初始化 Egg.js 项目：

```bash
$ mkdir egg-example && cd egg-example
$ npm init egg --type=simple
$ npm i
```

启动项目:

```bash
$ npm run dev
```

然后浏览器访问 `http://localhost:7001`，就可以看到亲切的 `hi, egg` 了。

关于 Egg.js 的框架更多知识，建议阅读 [官方文档](https://eggjs.org/zh-cn/intro/quickstart.html)

## 准备

对 Egg.js 有了简单了解，接下来我们来初始化我们的后台管理系统，新建一个项目目录 `admin-system`:

```bash
$ mkdir admin-system
```

将上面创建的 Egg.js 项目复制到 `admin-system` 目录下，重命名为 `backend`。然后将前端模板项目复制到 `frontend` 文件夹中：

```bash
$ git clone https://github.com/PanJiaChen/vue-admin-template.git frontend
```

> 说明： [vue-admin-template](https://github.com/PanJiaChen/vue-admin-template) 是基于 Vue2.0 的管理系统模板，是一个非常优秀的项目，建议对 Vue.js 感兴趣的开发者可以去学习下，当然如果你对 Vue.js 还不是太了解，这里有个基础入门学习教程 [Vuejs 从入门到精通系列文章](https://yugasun.github.io/You-May-Not-Know-Vuejs)

之后你的项目目录结构如下：

```bash
.
├── README.md
├── backend     // 创建的 Egg.js 项目
└── frontend    // 克隆的 Vue.js 前端项目模板
```

启动前端项目熟悉下界面：

```bash
$ cd frontend
$ npm install
$ npm run dev
```

然后访问 `http://localhost:9528` 就可以看到登录界面了。

## 开发后端服务

对于一个后台管理系统服务，我们这里只实现登录鉴权和文章管理功能，剩下的其他功能大同小异，读者可以之后自由补充扩展。

### 1. 添加 Sequelize 插件

在正式开发之前，我们需要引入数据库插件，这里本人偏向于使用 [Sequelize](https://github.com/sequelize/sequelize/) ORM 工具进行数据库操作，正好 Egg.js 提供了 [egg-sequelize](https://github.com/eggjs/egg-sequelize) 插件，于是直接拿来用，需要先安装：

```bash
$ cd frontend
# 因为需要通过 sequelize 链接 mysql 所以这也同时安装 mysql2 模块
$ npm install egg-sequelize mysql2 --save
```

然后在 `backend/config/plugin.js` 中引入该插件：

```js
module.exports = {
  // ....
  sequelize: {
    enable: true,
    package: "egg-sequelize"
  }
  // ....
};
```

在 `backend/config/config.default.js` 中配置数据库连接参数：

```js
// ...
const userConfig = {
  // ...
  sequelize: {
    dialect: "mysql",

    // 这里也可以通过 .env 文件注入环境变量，然后通过 process.env 获取
    host: "xxx",
    port: "xxx",
    database: "xxx",
    username: "xxx",
    password: "xxx"
  }
  // ...
};
// ...
```

### 2. 添加 JWT 插件

系统将使用 JWT token 方式进行登录鉴权，安装配置参考官方文档，[egg-jwt](https://github.com/eggjs/egg-jwt)

### 3. 添加 Redis 插件

系统将使用 redis 来存储和管理用户 token，安装配置参考官方文档，[egg-redis](https://github.com/eggjs/egg-redis)

### 4. 角色 API

定义用户模型，创建 `backend/app/model/role.js` 文件如下：

```js
module.exports = app => {
  const { STRING, INTEGER, DATE } = app.Sequelize;

  const Role = app.model.define("role", {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    name: STRING(30),
    created_at: DATE,
    updated_at: DATE
  });

  // 这里定义与 users 表的关系，一个角色可以含有多个用户，外键相关
  Role.associate = () => {
    app.model.Role.hasMany(app.model.User, { as: "users" });
  };

  return Role;
};
```

实现 Role 相关服务，创建 `backend/app/service/role.js` 文件如下：

```js
const { Service } = require("egg");

class RoleService extends Service {
  // 获取角色列表
  async list(options) {
    const {
      ctx: { model }
    } = this;
    return model.Role.findAndCountAll({
      ...options,
      order: [
        ["created_at", "desc"],
        ["id", "desc"]
      ]
    });
  }

  // 通过 id 获取角色
  async find(id) {
    const {
      ctx: { model }
    } = this;
    const role = await model.Role.findByPk(id);
    if (!role) {
      this.ctx.throw(404, "role not found");
    }
    return role;
  }

  // 创建角色
  async create(role) {
    const {
      ctx: { model }
    } = this;
    return model.Role.create(role);
  }

  // 更新角色
  async update({ id, updates }) {
    const role = await this.ctx.model.Role.findByPk(id);
    if (!role) {
      this.ctx.throw(404, "role not found");
    }
    return role.update(updates);
  }

  // 删除角色
  async destroy(id) {
    const role = await this.ctx.model.Role.findByPk(id);
    if (!role) {
      this.ctx.throw(404, "role not found");
    }
    return role.destroy();
  }
}

module.exports = RoleService;
```

一个完整的 RESTful API 就该包括以上五个方法，然后实现 `RoleController`, 创建 `backend/app/controller/role.js`:

```js
const { Controller } = require("egg");

class RoleController extends Controller {
  async index() {
    const { ctx } = this;
    const { query, service, helper } = ctx;
    const options = {
      limit: helper.parseInt(query.limit),
      offset: helper.parseInt(query.offset)
    };
    const data = await service.role.list(options);
    ctx.body = {
      code: 0,
      data: {
        count: data.count,
        items: data.rows
      }
    };
  }

  async show() {
    const { ctx } = this;
    const { params, service, helper } = ctx;
    const id = helper.parseInt(params.id);
    ctx.body = await service.role.find(id);
  }

  async create() {
    const { ctx } = this;
    const { service } = ctx;
    const body = ctx.request.body;
    const role = await service.role.create(body);
    ctx.status = 201;
    ctx.body = role;
  }

  async update() {
    const { ctx } = this;
    const { params, service, helper } = ctx;
    const body = ctx.request.body;
    const id = helper.parseInt(params.id);
    ctx.body = await service.role.update({
      id,
      updates: body
    });
  }

  async destroy() {
    const { ctx } = this;
    const { params, service, helper } = ctx;
    const id = helper.parseInt(params.id);
    await service.role.destroy(id);
    ctx.status = 200;
  }
}

module.exports = RoleController;
```

之后在 `backend/app/route.js` 路由配置文件中定义 `role` 的 RESTful API:

```js
router.resources("roles", "/roles", controller.role);
```

通过 `router.resources` 方法，我们将 `roles` 这个资源的增删改查接口映射到了 `app/controller/roles.js` 文件。详细说明参考 [官方文档](https://eggjs.org/zh-cn/tutorials/restful.html)

### 5. 用户 API

同 Role 一样定义我们的用户 API，这里就不复制粘贴了，可以参考项目实例源码 [admin-system](https://github.com/yugasun/tencent-serverless-demo/admin-system)。

### 6. 同步数据库表格

上面只是定义好了 `Role` 和 `User` 两个 Schema，那么如何同步到数据库呢？这里先借助 Egg.js 启动的 hooks 来实现，Egg.js 框架提供了统一的入口文件（app.js）进行启动过程自定义，这个文件返回一个 Boot 类，我们可以通过定义 Boot 类中的生命周期方法来执行启动应用过程中的初始化工作。

我们在 `backend` 目录中创建 `app.js` 文件，如下：

```js
"use strict";

class AppBootHook {
  constructor(app) {
    this.app = app;
  }

  async willReady() {
    // 这里只能在开发模式下同步数据库表格
    const isDev = process.env.NODE_ENV === "development";
    if (isDev) {
      try {
        console.log("Start syncing database models...");
        await this.app.model.sync({ logging: console.log, force: isDev });
        console.log("Start init database data...");
        await this.app.model.query(
          "INSERT INTO roles (id, name, created_at, updated_at) VALUES (1, 'admin', '2020-02-04 09:54:25', '2020-02-04 09:54:25'),(2, 'editor', '2020-02-04 09:54:30', '2020-02-04 09:54:30');"
        );
        await this.app.model.query(
          "INSERT INTO users (id, name, password, age, avatar, introduction, created_at, updated_at, role_id) VALUES (1, 'admin', 'e10adc3949ba59abbe56e057f20f883e', 20, 'https://yugasun.com/static/avatar.jpg', 'Fullstack Engineer', '2020-02-04 09:55:23', '2020-02-04 09:55:23', 1);"
        );
        await this.app.model.query(
          "INSERT INTO posts (id, title, content, created_at, updated_at, user_id) VALUES (2, 'Awesome Egg.js', 'Egg.js is a awesome framework', '2020-02-04 09:57:24', '2020-02-04 09:57:24', 1),(3, 'Awesome Serverless', 'Build web, mobile and IoT applications using Tencent Cloud and API Gateway, Tencent Cloud Functions, and more.', '2020-02-04 10:00:23', '2020-02-04 10:00:23', 1);"
        );
        console.log("Successfully init database data.");
        console.log("Successfully sync database models.");
      } catch (e) {
        console.log(e);
        throw new Error("Database migration failed.");
      }
    }
  }
}

module.exports = AppBootHook;
```

通过 `willReady` 生命周期函数，我们可以执行 `this.app.model.sync()` 函数来同步数据表，当然这里同时初始化了角色和用户数据记录，用来做为演示用。

> 注意：这的数据库同步只是本地调试用，如果想要腾讯云的 Mysql 数据库，建议开启远程连接，通过 `sequelize db:migrate` 实现，而不是每次启动 Egg 应用时同步，示例代码已经完成此功能，[参考 Egg Sequelize 文档](https://eggjs.org/zh-cn/tutorials/sequelize.html)。
> 这里本人为了省事，直接开启腾讯云 Mysql 公网连接，然后修改 `config.default.js` 中的 `sequelize` 配置，运行 `npm run dev` 进行开发模式同步。

到这里，我们的用户和角色的 API 都已经定义好了，启动服务 `npm run dev`，访问 `https://127.0.0.1:7001/users` 可以获取所有用户列表了。

### 7. 用户登录/注销 API

这里登录逻辑比较简单，客户端发送 `用户名` 和 `密码` 到 `/login` 路由，后端通过 `login` 函数接受，然后从数据库中查询该用户名，同时比对密码是否正确。如果正确则调用 `app.jwt.sign()` 函数生成 `token`，并将 `token` 存入到 `redis` 中，同时返回该 `token`，之后客户端需要鉴权的请求都会携带 `token`，进行鉴权验证。思路很简单，我们就开始实现了。

流程图如下：

<center>
<img src="https://static.yugasun.com/serverless/login-process.jpg" width="300" alt="Login Process"/>
</center>

首先，在 `backend/app/controller/home.js` 中新增登录处理 `login` 方法：

```js
class HomeController extends Controller {
  // ...
  async login() {
    const { ctx, app, config } = this;
    const { service, helper } = ctx;
    const { username, password } = ctx.request.body;
    const user = await service.user.findByName(username);
    if (!user) {
      ctx.status = 403;
      ctx.body = {
        code: 403,
        message: "Username or password wrong"
      };
    } else {
      if (user.password === helper.encryptPwd(password)) {
        ctx.status = 200;
        const token = app.jwt.sign(
          {
            id: user.id,
            name: user.name,
            role: user.role.name,
            avatar: user.avatar
          },
          config.jwt.secret,
          {
            expiresIn: "1h"
          }
        );
        try {
          await app.redis.set(`token_${user.id}`, token);
          ctx.body = {
            code: 0,
            message: "Get token success",
            token
          };
        } catch (e) {
          console.error(e);
          ctx.body = {
            code: 500,
            message: "Server busy, please try again"
          };
        }
      } else {
        ctx.status = 403;
        ctx.body = {
          code: 403,
          message: "Username or password wrong"
        };
      }
    }
  }
}
```

> 注释：这里有个密码存储逻辑，用户在注册时，密码都是通过 `helper` 函数 `encryptPwd()` 进行加密的（这里用到最简单的 md5 加密方式，实际开发中建议使用更加高级加密方式），所以在校验密码正确性时，也需要先加密一次。至于如何在 Egg.js 框架中新增 `helper` 函数，只需要在 `backend/app/extend` 文件夹中新增 `helper.js` 文件，然后 `modole.exports` 一个包含该函数的对象就行，参考 [Egg 框架扩展文档](https://eggjs.org/zh-cn/basics/extend.html#helper)

然后，在 `backend/app/controller/home.js` 中新增 `userInfo` 方法，获取用户信息：

```js
async userInfo() {
  const { ctx } = this;
  const { user } = ctx.state;
  ctx.status = 200;
  ctx.body = {
    code: 0,
    data: user,
  };
}
```

[egg-jwt](https://github.com/eggjs/egg-jwt) 插件，在鉴权通过的路由对应 controller 函数中，会将 `app.jwt.sign(user, secrete)` 加密的用户信息，添加到 `ctx.state.user` 中，所以 `userInfo` 函数只需要将它返回就行。

之后，在 `backend/app/controller/home.js` 中新增 `logout` 方法：

```js
async logout() {
  const { ctx } = this;
  ctx.status = 200;
  ctx.body = {
    code: 0,
    message: 'Logout success',
  };
}
```

`userInfo` 和 `logout` 函数非常简单，重点是路由中间件如何处理。

接下来，我们来定义登录相关路由，修改 `backend/app/router.js` 文件，新增 `/login`, `/user-info`, `/logout` 三个路由：

```js
const koajwt = require("koa-jwt2");

module.exports = app => {
  const { router, controller, jwt } = app;
  router.get("/", controller.home.index);

  router.post("/login", controller.home.login);
  router.get("/user-info", jwt, controller.home.userInfo);
  const isRevokedAsync = function(req, payload) {
    return new Promise(resolve => {
      try {
        const userId = payload.id;
        const tokenKey = `token_${userId}`;
        const token = app.redis.get(tokenKey);
        if (token) {
          app.redis.del(tokenKey);
        }
        resolve(false);
      } catch (e) {
        resolve(true);
      }
    });
  };
  router.post(
    "/logout",
    koajwt({
      secret: app.config.jwt.secret,
      credentialsRequired: false,
      isRevoked: isRevokedAsync
    }),
    controller.home.logout
  );

  router.resources("roles", "/roles", controller.role);
  router.resources("users", "/users", controller.user);
  router.resources("posts", "/posts", controller.post);
};
```

Egg.js 框架定义路由时，`router.post()` 函数可以接受中间件函数，用来处理一些路由相关的特殊逻辑。

比如 `/user-info`，路由添加了 `app.jwt` 作为 JWT 鉴权中间件函数，至于为什么这么用，[egg-jwt](https://github.com/eggjs/egg-jwt) 插件有明确说明。

这里稍微复杂的是 `/logout` 路由，因为我们在注销登录时，需要将用户的 `token` 从 `redis` 中移除，所以这里借助了 [koa-jwt2](https://github.com/okoala/koa-jwt2) 的 `isRevokded` 参数，来进行 `token` 删除。

## 后端服务部署

到这里，后端服务的登录和注销逻辑基本完成了。那么如何部署到云函数呢？可以直接使用 [tencent-egg](https://github.com/serverless-components/tencent-egg) 组件，它是专门为 Egg.js 框架打造的 Serverless Component，使用它可以快速将我们的 Egg.js 项目部署到腾讯云云函数上。

### 1. 准备

我们先创建一个 `backend/sls.js` 入口文件：

```js
const { Application } = require("egg");
const app = new Application();
module.exports = app;
```

然后修改 `backend/config/config.default.js` 文件:

```js
const config = (exports = {
  env: "prod", // 推荐云函数的 egg 运行环境变量修改为 prod
  rundir: "/tmp",
  logger: {
    dir: "/tmp"
  }
});
```

> 注释：这里之所有需要修改运行和日志目录，是因为云函数运行时，只有 `/tmp` 才有写权限。

全局安装 `serverless` 命令：

```bash
$ npm install serverless -g
```

### 2. 配置 Serverless

在项目根目录下创建 `serverless.yml` 文件，同时新增 `backend` 配置：

```yaml
backend:
  component: "@serverless/tencent-egg"
  inputs:
    code: ./backend
    functionName: admin-system
    # 这里必须指定一个具有操作 mysql 和 redis 的角色，具体角色创建，可访问 https://console.cloud.tencent.com/cam/role
    role: QCS_SCFFull
    functionConf:
      timeout: 120
      # 这里的私有网络必须和 mysql、redis 实例一致
      vpcConfig:
        vpcId: vpc-xxx
        subnetId: subnet-xxx
    apigatewayConf:
      protocols:
        - https
```

此时你的项目目录结构如下：

```bash
.
├── README.md         // 项目说明文件
├── serverless.yml    // serverless yml 配合文件
├── backend           // 创建的 Egg.js 项目
└── frontend          // 克隆的 Vue.js 前端项目模板
```

### 3. 执行部署

执行部署命令：

```bash
$ serverless --debug
```

之后控制台需要进行扫码登录验证腾讯云账号，扫码登录就好。等部署成功会发挥如下信息：

```bash
  backend:
    region:              ap-guangzhou
    functionName:        admin-system
    apiGatewayServiceId: service-f1bhmhk4
    url:                 https://service-f1bhmhk4-1251556596.gz.apigw.tencentcs.com/release/
```

这里输出的 url 就是部署成功的 API 网关接口，可以直接访问测试。

> 注释：云函数部署时，会自动在腾讯云的 API 网关创建一个服务，同时创建一个 API，通过该 API 就可以触发云函数执行了。

### 4. 账号配置（可选）

当前默认支持 Serverless cli 扫描二维码登录，如果希望配置持久的环境变量/秘钥信息，也可以在项目根目录创建 `.env` 文件

在 `.env` 文件中配置腾讯云的 SecretId 和 SecretKey 信息并保存，密钥可以在 [API 密钥管理](https://console.cloud.tencent.com/cam/capi) 中获取或者创建.

```text
# .env
TENCENT_SECRET_ID=123
TENCENT_SECRET_KEY=123
```

### 5. 文章 API

跟用户 API 类似，只需要复制粘贴上面用户相关模块，修改名称为 `posts`， 并修改数据模型就行，这里就不粘贴代码了。

## 前端开发

本实例直接使用的 [vue-admin-template](https://github.com/PanJiaChen/vue-admin-template) 的前端模板。

我们需要做如下几部分修改：

1. 删除接口模拟：更换为真实的后端服务接口
2. 修改接口函数：包括用户相关的 `frontend/src/api/user.js` 和文章相关接口 `frontend/src/api/post.js`。
3. 修改接口工具函数：主要是修改 `frontend/src/utils/request.js` 文件，包括 `axios`请求的 `baseURL` 和请求的 header。
4. UI 界面修改：主要是新增文章管理页面，包括列表页和新增页。

### 1. 删除接口模拟

首先删除 `frontend/mock` 文件夹。然后修改前端入口文件 `frontend/src/main.js`：

```js
// 1. 引入接口变量文件，这个会依赖 @serverless/tencent-website 组件自动生成
import "./env.js";

import Vue from "vue";

import "normalize.css/normalize.css";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import locale from "element-ui/lib/locale/lang/en";
import "@/styles/index.scss";
import App from "./App";
import store from "./store";
import router from "./router";
import "@/icons";
import "@/permission";

// 2. 下面这段就是 mock server 引入，删除就好
// if (process.env.NODE_ENV === 'production') {
//   const { mockXHR } = require('../mock')
//   mockXHR()
// }

Vue.use(ElementUI, { locale });
Vue.config.productionTip = false;

new Vue({
  el: "#app",
  router,
  store,
  render: h => h(App)
});
```

### 2. 修改接口函数

修改 `frontend/src/api/user.js` 文件，包括登录、注销、获取用户信息和获取用户列表函数如下：

```js
import request from "@/utils/request";

// 登录
export function login(data) {
  return request({
    url: "/login",
    method: "post",
    data
  });
}

// 获取用户信息
export function getInfo(token) {
  return request({
    url: "/user-info",
    method: "get"
  });
}

// 注销登录
export function logout() {
  return request({
    url: "/logout",
    method: "post"
  });
}

// 获取用户列表
export function getList() {
  return request({
    url: "/users",
    method: "get"
  });
}
```

新增 `frontend/src/api/post.js` 文件如下：

```js
import request from "@/utils/request";

// 获取文章列表
export function getList(params) {
  return request({
    url: "/posts",
    method: "get",
    params
  });
}

// 创建文章
export function create(data) {
  return request({
    url: "/posts",
    method: "post",
    data
  });
}

// 删除文章
export function destroy(id) {
  return request({
    url: `/posts/${id}`,
    method: "delete"
  });
}
```

### 3. 修改接口工具函数

因为 `@serverless/tencent-website` 组件可以定义 `env` 参数，执行成功后它会在指定 `root` 目录自动生成 `env.js`，然后在 `frontend/src/main.js` 中引入使用。
它会挂载 `env` 中定义的接口变量到 `window` 对象上。比如这生成的 `env.js` 文件如下：

```js
window.env = {};
window.env.apiUrl =
  "https://service-f1bhmhk4-1251556596.gz.apigw.tencentcs.com/release/";
```

根据此文件我们来修改 `frontend/src/utils/request.js` 文件：

```js
import axios from "axios";
import { MessageBox, Message } from "element-ui";
import store from "@/store";
import { getToken } from "@/utils/auth";

// 创建 axios 实例
const service = axios.create({
  // 1. 这里设置为 `env.js` 中的变量 `window.env.apiUrl`
  baseURL: window.env.apiUrl || "/", // url = base url + request url
  timeout: 5000 // request timeout
});

// request 注入
service.interceptors.request.use(
  config => {
    // 2. 添加鉴权token
    if (store.getters.token) {
      config.headers["Authorization"] = `Bearer ${getToken()}`;
    }
    return config;
  },
  error => {
    console.log(error); // for debug
    return Promise.reject(error);
  }
);

// 请求 response 注入
service.interceptors.response.use(
  response => {
    const res = response.data;

    // 只有请求code为0，才是正常返回，否则需要提示接口错误
    if (res.code !== 0) {
      Message({
        message: res.message || "Error",
        type: "error",
        duration: 5 * 1000
      });

      if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
        // to re-login
        MessageBox.confirm(
          "You have been logged out, you can cancel to stay on this page, or log in again",
          "Confirm logout",
          {
            confirmButtonText: "Re-Login",
            cancelButtonText: "Cancel",
            type: "warning"
          }
        ).then(() => {
          store.dispatch("user/resetToken").then(() => {
            location.reload();
          });
        });
      }
      return Promise.reject(new Error(res.message || "Error"));
    } else {
      return res;
    }
  },
  error => {
    console.log("err" + error);
    Message({
      message: error.message,
      type: "error",
      duration: 5 * 1000
    });
    return Promise.reject(error);
  }
);

export default service;
```

### 4. UI 界面修改

关于 UI 界面修改，这里就不做说明了，因为涉及到 Vue.js 的基础使用，如果还不会使用 Vue.js，建议先复制示例代码就好。如果对 Vue.js 感兴趣，可以到 [Vue.js 官网](https://cn.vuejs.org/) 学习。也可以阅读本人的 [Vuejs 从入门到精通系列文章](https://yugasun.github.io/You-May-Not-Know-Vuejs)，喜欢的话，可以送上您宝贵的 `Star (*^▽^*)`

这里只需要复制 [Demo 源码](https://github.com/yugasun/tencent-serverless-demo/tree/master/admin-system) 的 `frontend/router` 和 `frontend/views` 两个文件夹就好。

## 前端部署

因为前端编译后都是静态文件，我们需要将静态文件上传到腾讯云的 COS（对象存储） 服务，然后开启 COS 的静态网站功能就可以了，这些都不需要你手动操作，使用 [@serverless/tencent-website](https://github.com/serverless-components/tencent-website) 组件就可以轻松搞定。

### 1. 修改 Serverless 配置文件

修改项目根目录下 `serverless.yml` 文件，新增前端相关配置：

```yaml
name: admin-system

# 前端配置
frontend:
  component: "@serverless/tencent-website"
  inputs:
    code:
      src: dist
      root: frontend
      envPath: src # 相对于 root 指定目录，这里实际就是 frontend/src
      hook: npm run build
    env:
      # 依赖后端部署成功后生成的 url
      apiUrl: ${backend.url}
    protocol: https
    # TODO: CDN 配置，请修改！！！
    hosts:
      - host: sls-admin.yugasun.com # CDN 加速域名
        https:
          certId: abcdedg # 为加速域名在腾讯云平台申请的免费证书 ID
          http2: off
          httpsType: 4
          forceSwitch: -2

# 后端配置
backend:
  component: "@serverless/tencent-egg"
  inputs:
    code: ./backend
    functionName: admin-system
    role: QCS_SCFFull
    functionConf:
      timeout: 120
      vpcConfig:
        vpcId: vpc-6n5x55kb
        subnetId: subnet-4cvr91js
    apigatewayConf:
      protocols:
        - https
```

### 2. 执行部署

执行部署命令：

```bash
$ serverless --debug
```

输出如下成功结果：

```bash
  frontend:
    url:  https://dtnu69vl-470dpfh-1251556596.cos-website.ap-guangzhou.myqcloud.com
    env:
      apiUrl: https://service-f1bhmhk4-1251556596.gz.apigw.tencentcs.com/release/
    host:
      - https://sls-admin.yugasun.com (CNAME: sls-admin.yugasun.com.cdn.dnsv1.com）
  backend:
    region:              ap-guangzhou
    functionName:        admin-system
    apiGatewayServiceId: service-f1bhmhk4
    url:                 https://service-f1bhmhk4-1251556596.gz.apigw.tencentcs.com/release/
```

> 注释：这里 `frontend` 中多输出了 `host`，是我们的 CDN 加速域名，可以通过配置 `@serverless/tencent-website` 组件的 `inputs.hosts` 来实现。有关 CDN 相关配置说明可以阅读 [基于 Serverless Component 的全栈解决方案 - 续集](https://yugasun.com/post/serverless-fullstack-vue-practice-pro.html)。当然，如果你不想配置 CDN，直接删除，然后访问 COS 生成的静态网站 url。

部署成功后，我们就可以访问 `https://sls-admin.yugasun.com` 登录体验了。

## 源码

本篇涉及到所有源码都维护在开源项目 [tencent-serverless-demo](https://github.com/yugasun/tencent-serverless-demo) 中 [admin-system](https://github.com/yugasun/tencent-serverless-demo/tree/master/admin-system)

## 总结

本文基于腾讯云的无服务器框架 [Serverless Framework](https://cloud.tencent.com/product/sf) 实现，涉及到内容较多，推荐在阅读时，边看边开发，跟着文章节奏一步一步实现。

如果遇到问题，可以参考本文源码。如果你成功实现了，可以到官网进一步熟悉 Egg.js 框架，以便今后可以实现更加复杂的应用。虽然本文使用的是 Vue.js 前端框架，但是你也可以将 `frontend` 更换为任何你喜欢的前端框架项目，开发时只需要将接口请求前缀使用 `@serverless/tencent-website` 组件生成的 `env.js` 文件就行。



---
<div id='scf-deploy-iframe-or-md'></div>

---

> **传送门：**
> - GitHub: [github.com/serverless](https://github.com/serverless/serverless/blob/master/README_CN.md)
> - 官网：[serverless.com](https://serverless.com/)

欢迎访问：[Serverless 中文网](https://serverlesscloud.cn/)，您可以在 [最佳实践](https://serverlesscloud.cn/best-practice) 里体验更多关于 Serverless 应用的开发！
