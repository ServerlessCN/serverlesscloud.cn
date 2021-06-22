---
title: Serverless Web Function 实践教程（二）：基于 Web 函数部署您的 Flask 项目
description: Flask 轻量、灵活的特点使得它广受开发人员欢迎，用于快速实现一个网站或 Web 服务的搭建。
date: 2021-06-22
thumbnail: https://main.qcloudimg.com/raw/fdc6ec010d235e925c5e2f8d200ca919.jpg
categories:
  - best-practice
authors:
  - April
tags:
  - Serverless
  - 云函数
---

Flask 是一个基于 Python 的轻量级 Web 框架，它基于一系列第三方依赖包实现业务逻辑，使得 Flask 使用更为灵活，并可通过一系列扩展定制或扩展其能力，其中最主要的两个核心模块是 WSGI 工具集 Werkzeug 和渲染模板框架 Jinja。Flask 轻量、灵活的特点使得它广受开发人员欢迎，用于快速实现一个网站或 Web 服务的搭建。

本篇教程将为您指导，如何通过 `SCF Web Function`，快速部署您的 Flask 业务上云。



## 01. 模板部署 - 无需改动业务代码，一键部署

1. 登录 Serverless 控制台，单击左侧导航栏的「函数服务」，在主界面上方选择期望创建函数的地域，并单击「新建」，进入函数创建流程。

2. 选择使用**「模版创建」**来新建函数，在搜索框里输入 「**WebFunc**」，筛选所有 Web 函数模版，选择**「Flash 框架模版」**，点击 「下一步」，如下图所示：

<img src="https://main.qcloudimg.com/raw/d476714f63f242d18558572cfaa80502.png" width="700"/>



3. 在「配置」页面，您可以查看模版项目的具体配置信息并进行修改；

4. 单击「**完成**」，即可创建函数。函数创建完成后，可在「函数管理」页面，查看 Web 函数的基本信息，并通过 API 网关生成的访问路径 URL 进行访问，查看您部署的 Flash 项目。

<img src="https://main.qcloudimg.com/raw/b93f5a1fdf6256fbe1ab5965100afe31.png" width="700"/>



## 02. 自定义部署 - 3 步快速迁移本地项目上云

### 1. 本地开发

1. 首先，需要确认您本地的环境内已经安装好 Flask

```
pip install Flask
```

2. 本地创建 ` Hello World` 示例项目，在项目目录下，新建 `app.py` 项目，实现最简单的 Hello World 应用，示例代码如下：

```python
from flask import Flask
app = Flask(__name__)

@app.route('/')
def hello_world():
   return 'Hello World'

if __name__ == '__main__':
   app.run()
```

3. 本地运行 app.py 文件，在浏览器里访问 `http://127.0.0.1:5000`，即可在本地完成 Flash 示例项目的访问：

```shell
$ python3 app.py

 * Serving Flask app "app" (lazy loading)
 * Environment: production
   WARNING: Do not use the development server in a production environment.
   Use a production WSGI server instead.
 * Debug mode: off
 * Running on http://127.0.0.1:5000/ (Press CTRL+C to quit)
127.0.0.1 - - [22/Jun/2021 09:41:04] "GET / HTTP/1.1" 200 -
```

<img src="https://main.qcloudimg.com/raw/fac532d98a6fd26cd60bac1fad757bfb.png" width="700"/>



### 2. 部署上云

接下来，我们对本地已经创建完成的项目进行简单修改，使其可以通过 Web Function 快速部署，对于 Flask，具体改造步骤如下：

**1. 安装依赖包**

由于 SCF 云上标准环境内没有 Flask 依赖库，此处您必须将依赖文件安装完成后，与项目代码一起打包上传，首先新建`requirements.txt`文件：

```txt
#requirements.txt

Flask==1.0.2
werkzeug==0.16.0
```

接下来执行安装：

```shell
pip install -r requirements.txt
```



**2. 修改监听地址与端口**

在 Web 函数内，限制了监听端口必须为 9000，因此需要对监听地址端口进行修改，改为 `0.0.0.0:9000`

<img src="https://main.qcloudimg.com/raw/71443ebf1154516162231d160cc4784b.png" width="700"/>

> 您也可以在 `scf_bootstrap` 中，通过环境变量配置监听端口



**3. 新增 `scf_bootstrap` 启动文件**

在项目根目录下新建 `scf_bootstrap` 启动文件，在里面完成环境变量配置，指定服务启动命令等自定义操作，确保您的服务可以通过该文件正常启动

```shell
#!/bin/bash
/var/lang/python3/bin/python3 app.py
```

创建完成后，注意修改您的可执行文件权限，默认需要 `777` 或 `755` 权限

```
chmod 777 scf_bootstrap
```

> 注意
>
> - 在 SCF 环境内，只有 `/tmp` 文件可读写，建议输出文件时选择 `/tmp`，其它目录会由于缺少权限而写入失败
> - 如果想要在日志中输出环境变量，启动命令前需要加 `-u` 参数，示例：`python -u app.py`



**4. 本地配置完成后，执行启动文件**

确保您的服务可以本地正常启动，接下来，登录腾讯云云函数控制台，新建 Web 函数以部署您的 Flash 项目。

<img src="https://main.qcloudimg.com/raw/6b2cbed635dc0deae809a98eb84253d8.png" width="700"/>



### 3.开发管理

部署完成后，即可在 SCF 控制台快速访问并测试您的 Web 服务，并且体验云函数多项特色功能如层绑定、日志管理等，享受 Serverless 架构带来的低成本、弹性扩缩容等优势。 

<img src="https://main.qcloudimg.com/raw/ab4a4b6f904424eed1acd8fb272f68f3.png" width="700"/>



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