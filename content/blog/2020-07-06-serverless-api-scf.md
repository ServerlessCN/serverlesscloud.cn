---
title: 基于 API 网关 + 云函数 SCF 部署 Serverless 外卖订单系统 
description: API 网关结合云函数 SCF 的使用场景非常丰富，本文将介绍基于 API 网关 + 云函数 SCF 部署 Serverless 的外卖订单系统。
keywords:  Serverless, Serverless Registry, Serverless网关
date: 2020-07-06
thumbnail: https://img.serverlesscloud.cn/202077/1594104885073-1594024750794-%E4%BC%81%E4%B8%9A%E5%BE%AE%E4%BF%A1%E6%88%AA%E5%9B%BE_15940247379968.jpg
categories: 
  - news
authors: 
  - 金鑫
authorslink: 
  - https://github.com/leonardjin
tags:
  - API 网关
  - Meetup
---


API 网关结合云函数 SCF 的使用场景非常丰富，本文将介绍如何基于 API 网关+云函数 SCF 快速部署 Serverless 的外卖订单系统。

## 消息推送使用的典型场景

![](https://img.serverlesscloud.cn/202076/1594024023960-0%5B1%5D%20%285%29.png)

## 外卖订单系统架构图

![](https://img.serverlesscloud.cn/202076/1594024023933-0%5B1%5D%20%285%29.png)

## Demo 实战

1. 安装Serverless Framework

```
npm install -g serverless
```

2. 初始化项目模板

```
sls init -t websocket-order
```

3. 查看项目目录

下载到本地后，查看项目目录结构如下：

![](https://img.serverlesscloud.cn/202076/1594024023722-0%5B1%5D%20%285%29.png)
    
包含 DB、网关、函数等多个子模块。
    
- db 目录用于创建 PG Serverless 数据库实例
- apigateway 用于创建对应的 API ：
    - /bill  下单 API，HTTP 类型
    - /get_shop_info，获取店铺菜单 API
    - /pgws，用于做消息推送的 websocket API
    
- 函数列表如下：
    - 消息推送相关函数：
        - 注册函数  ws_register.py， 配置 DB 的环境变量
        - 传输函数  ws_trans.py ，配置 DB 的环境变量以及 apiid= 消息推送API
        - 注销函数  ws_unregister.py ，配置 DB 的环境变量以及 apiid= 消息推送API
    - 下单函数  bill.py ，    配置 DB 的环境变量以及 apiid= 消息推送API
    - 拉取店铺信息函数  get_shop_info.py，配置 DB 的环境变量
    - 初始化 DB 函数 init_db.py ，配置 DB 的环境变量

4. 修改配置信息。将 .env.example 文件为 .env 文件，在 API 密钥管理 中获取 SecretId 和 SecretKey。

```
# secret for credential
TENCENT_SECRET_ID=xxxxxx
TENCENT_SECRET_KEY=xxxxxx

# global config
REGION=ap-shanghai
```

5. 项目部署

```
sls deploy --all
```

6. 更新配置及部署
  - 执行 init_db-dev 函数，进行数据库初始化。在控制台或者 vscode 插件中，点击测试 init_db-dev 函数，对数据库进行初始化的建表等操作
  - 更新 apiid 配置，再次部署
  ![serverless](https://img.serverlesscloud.cn/202076/1594024023605-0%5B1%5D%20%285%29.png)
  查看输出信息，在 function_bill 目录和 function_ws_trans 目录的 serverless.yml 中，分别配置 websocket API 的 apiid ，并重新部署两个函数，刷新环境变量配置。
  ![serverless](https://img.serverlesscloud.cn/202076/1594024024246-0%5B1%5D%20%285%29.png)
    
  ```
  sls deploy --target=./function_ws_trans 
  sls deploy --target=./function_bill
  ```

7. 更改客户端与厨房订单系统的地址

  App点单系统.html 更改 29 行 以及 88 行中 xxxx 为：生成的 API 网关服务域名
    
  店家厨房系统.html 更改 17 行 xxxx 为 API 网关服务域名
    
  效果演示：
  ![效果演示](https://img.serverlesscloud.cn/202076/1594024024216-0%5B1%5D%20%285%29.png)

**附录：参考文档和配置**

1. [安装 Serverless Framework](https://cloud.tencent.com/document/product/583/44753)

2. [安装 Serverless DB](https://cloud.tencent.com/document/product/1154/45447)

3. [API 网关的 yaml 完整配置](https://github.com/serverless-components/tencent-apigateway/blob/master/docs/configure.md)

4. [SCF 的 yaml 完整配置](https://github.com/serverless-components/tencent-scf/blob/master/docs/configure.md)

## 往期回顾

- [Tencent Serverless Hours 第一期线上分享会回放](https://cloud.tencent.com/edu/learning/live-2437)
- [Tencent Serverless Hours 第二期线上分享会回放](https://cloud.tencent.com/edu/learning/live-2480)
- [Tencent Serverless Hours 第三期线上分享会回放](https://cloud.tencent.com/edu/learning/live-2564)
- [Tencent Serverless Hours 第四期线上分享会回放](https://cloud.tencent.com/edu/learning/live-2735)

---
<div id='scf-deploy-iframe-or-md'></div>

---

> **传送门：**
> - GitHub: [github.com/serverless](https://github.com/serverless/serverless/blob/master/README_CN.md)
> - 官网：[serverless.com](https://serverless.com/)

欢迎访问：[Serverless 中文网](https://serverlesscloud.cn/)，您可以在 [最佳实践](https://serverlesscloud.cn/best-practice) 里体验更多关于 Serverless 应用的开发！
