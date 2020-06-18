---
title: 通过 SCF Component 轻松构建 REST API，再也不用熬夜加班了
description: 本教程将分享如何通过 Serverless SCF Component 、云函数 SCF 及 API 网关组件，快速构建一个 REST API 并实现 GET/PUT 操作。
keywords: SCF Component,REST API,构建 REST API,Serverless SCF Component
date: 2019-12-03
thumbnail: https://img.serverlesscloud.cn/2020115/1579074115778-1577347088399-website_fang.png
categories:
  - best-practice
authors:
  - liujiang
authorslink:
  - https://github.com/jiangliu5267
tags:
  - Serverless
  - Restful
---

当一个应用需要对第三方提供服务接口时，REST API 无疑是目前最主流的选择。不过，如果自建 REST API，开发者需要购买虚拟机、配置环境等等，等一切都搞定，可能已经又是一个深夜。

REST API 模板使用 Tencent SCF 组件及其触发器能力，方便的在腾讯云创建，配置和管理一个 REST API 应用。您可以通过 Serverless SCF 组件快速构建一个 REST API 应用，实现 GET/PUT 操作。

![Serverless](https://main.qcloudimg.com/raw/918551c66d6fa9c01f3667706d44f1b7.png)

### 1. 安装

**安装 Serverless Framework**

```
$ npm install -g serverless
```

### 2. 配置

通过如下命令直接下载该例子，目录结构如下：

```
serverless create --template-url https://github.com/serverless/components/tree/v1/templates/tencent-python-rest-api
```

```
.
├── code
|   └── index.py
└── serverless.yml
```
目前 SCF 组件已支持 v2 版本，因此修改了 serverless.yml 文件，改为以下内容：
```
# serverless.yml 

component: scf 
name: apidemo 
org: test 
app: scfApp 
stage: dev 

inputs:
  name: myRestAPI
  enableRoleAuth: ture
  src: ./code
  handler: index.main_handler
  runtime: Python3.6
  region: ap-guangzhou
  description: My Serverless Function
  memorySize: 128
  timeout: 20
  events:
      - apigw:
          name: serverless
          parameters:
            protocols:
              - http
            serviceName: serverless
            description: the serverless service
            environment: release
            endpoints:
              - path: /users/{user_type}/{action}
                method: GET
                description: Serverless REST API
                enableCORS: TRUE
                serviceTimeout: 10
                param:
                  - name: user_type
                    position: PATH
                    required: 'TRUE'
                    type: string
                    defaultValue: teacher
                    desc: mytest
                  - name: action
                    position: PATH
                    required: 'TRUE'
                    type: string
                    defaultValue: go
                    desc: mytest
```
查看 code/index.py 代码，可以看到接口的传参和返回逻辑：

```
# -*- coding: utf8 -*-

def teacher_go():
    # todo: teacher_go action
    return {
        "result": "it is student_get action"
    }

def student_go():
    # todo: student_go action
    return {
        "result": "it is teacher_put action"
    }

def student_come():
    # todo: student_come action
    return {
        "result": "it is teacher_put action"
    }

def main_handler(event, context):
    print(str(event))
    if event["pathParameters"]["user_type"] == "teacher":
        if event["pathParameters"]["action"] == "go":
            return teacher_go()
    if event["pathParameters"]["user_type"] == "student":
        if event["pathParameters"]["action"] == "go":
            return student_go()
        if event["pathParameters"]["action"] == "come":
            return student_come()
```

### 3. 部署

通过 `sls deploy` 命令进行部署，并可以添加 `--debug` 参数查看部署过程中的信息

如您的账号未[登陆](https://cloud.tencent.com/login)或[注册](https://cloud.tencent.com/register)腾讯云，您可以直接通过微信扫描命令行中的二维码进行授权登陆和注册。

```
$ sls deploy

serverless ⚡ framework
Action: "deploy" - Stage: "dev" - App: "scfApp" - Instance: "myRestAPI"

FunctionName: myRestAPI
Description:  My Serverless Function
Namespace:    default
Runtime:      Python3.6
Handler:      index.main_handler
MemorySize:   128
Triggers: 
  apigw: 
    - http://service-jyl9i6mc-1258834142.gz.apigw.tencentcs.com/release/users/{user_type}/{action}

31s › myRestAPI › Success

```

### 4. 测试

通过如下命令测试 REST API 的返回情况：
> 注：如 Windows 系统中未安装 `curl`，也可以直接通过浏览器打开对应链接查看返回情况

```
$ curl -XGET http://service-9t28e0tg-1250000000.gz.apigw.tencentcs.com/release/users/teacher/go

{"result": "it is student_get action"}
```

```
$ curl -PUT http://service-9t28e0tg-1250000000.gz.apigw.tencentcs.com/release/users/student/go

{"result": "it is teacher_put action"}
```

### 5. 移除

可以通过以下命令移除 REST API 应用
```
$ sls remove --debug

  DEBUG ─ Flushing template state and removing all components.
  DEBUG ─ Removing any previously deployed API. api-37gk3l8q
  DEBUG ─ Removing any previously deployed service. service-9t28e0tg
  DEBUG ─ Removing function
  DEBUG ─ Request id
  DEBUG ─ Removed function myRestAPI successful

  7s » myRestAPI » done
```


查看：[操作指南](https://cloud.tencent.com/document/product/1154/40216)

---
<div id='scf-deploy-iframe-or-md'></div>

---

> **传送门：**
> - GitHub: [github.com/serverless](https://github.com/serverless/serverless/blob/master/README_CN.md)
> - 官网：[serverless.com](https://serverless.com/)

欢迎访问：[Serverless 中文网](https://serverlesscloud.cn/)，您可以在 [最佳实践](https://serverlesscloud.cn/best-practice) 里体验更多关于 Serverless 应用的开发！



