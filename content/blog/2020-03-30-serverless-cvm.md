---
title: Serverless + CVM 实战
description: Tencent Serverless Toolkit for VS Code 小试牛刀，本次示例利用腾讯云函数 SCF 简单示例下 Serverless 的一小部分功能。
keywords: Serverless,Serverless网站,Serverless应用
date: 2020-03-30
thumbnail: https://img.serverlesscloud.cn/2020522/1590162499020-%E4%BC%81%E4%B8%9A%E5%BE%AE%E4%BF%A1%E6%88%AA%E5%9B%BE_15901624529568.png
categories:
  - user-stories
authors:
  - KaliArch
authorslink:
  - https://cloud.tencent.com/developer/article/1606440
tags:
  - Serverless
  - CVM
---

之前了解过 Tencent Serverless Toolkit for VS Code 的IDE 插件，刚好借此使用下，相较于之前没有 IDE 插件，编码在本地，但是 debug 非常繁琐，需要上传代码到云端控制台操作，现在有了 IDE 插件从本地编码测试上传部署一条路，快速体验下此为 SCF 添翼的神器。

接下来看看 Serverless + CVM 实战

## 项目背景

目前有客户有需求对数量众多的测试环境想通过非工作时间进行关机操作，同时腾讯提供关机不收费的 CVM 操作，一定程度可以节省 IT 开支，每天早上工作时间提前进行开机，如此如果人工来操作重复周期性的操作显然非常不合适，但是共有云目前没有提供这种对服务器定时开关机操作的产品功能，只能利用其 API 来进行，但是需要一台具备公网能力的服务器来发起API调用请求，此时刚好利用 Serverless 的 Tencent Serverless Toolkit for VS Code 小试牛刀，本次示例利用腾讯云函数（SCF）简单示例下 Serverless 的一小部分功能。

之前由于没有IDE，将程序部署到SCF后运行不便与调试，现在有了神器Tencent Serverless Toolkit for VS Code，简单方便的本地配置，快速拉取云端函数并可以在本地模拟[COS](https://cloud.tencent.com/product/cos?from=10680)，CMQ，API网关等出发事件运行还书，本地化的开发，调试，可谓补齐了SCF不便于代码上传调试的缺点，利用此插件可在本地快捷调试代码，一键上传程序，为SCF如虎添翼。

## 项目编写

### 1. 根据模版创建项目

![serverless](https://img.serverlesscloud.cn/2020522/1590162499364-%E4%BC%81%E4%B8%9A%E5%BE%AE%E4%BF%A1%E6%88%AA%E5%9B%BE_15901624529568.png)

### 2. 填写项目名称

填写项目名称完成项目创建

![serverless]( https://img.serverlesscloud.cn/2020522/1590162499985-%E4%BC%81%E4%B8%9A%E5%BE%AE%E4%BF%A1%E6%88%AA%E5%9B%BE_15901624529568.png )

### 3. 了解项目结构

在项目模版中，主要关注index.py 和template.yaml

- Index.py 为业务逻辑代码
- Template.yaml 为腾讯云SCF配置相关，如下为我的定时任务配置

  为提高安全性其中由于使用的了腾讯云的secretid/secretkey，将其作为变量放置在配置中，业务代码从配置中获取，

  其中也配置了超时时间以及定时cron

```javascript
Resources:
  default:
    Type: TencentCloud::Serverless::Namespace
    cvm_oper:
      Properties:
        CodeUri: .
        Description: cvm oper
        Environment:
          Variables:
            secretid: AKIDZyGxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
            secretkey: kFUTDkxxxxxxxxxxxxxxxxxxxxxxxx
        Events:
          stop_cvm:
            Properties:
              CronExpression: 0 59 11 * * MON-FRI *
              Enable: true
            Type: Timer
        Handler: index.main_handler
        MemorySize: 128
        Runtime: Python3.6
        Timeout: 10
        VpcConfig:
          SubnetId: ''
          VpcId: ''
      Type: TencentCloud::Serverless::Function
```

![serverless]( https://img.serverlesscloud.cn/2020522/1590162499091-%E4%BC%81%E4%B8%9A%E5%BE%AE%E4%BF%A1%E6%88%AA%E5%9B%BE_15901624529568.png )

## 编写代码

### 1. 代码程序

在此我利用腾讯云的[CVM](https://cloud.tencent.com/product/cvm?from=10680)的SDK进行了[云服务器](https://cloud.tencent.com/product/cvm?from=10680)的停止与开机操作，在此简单实例下cvm启动

![serverless]( https://img.serverlesscloud.cn/2020522/1590162499924-%E4%BC%81%E4%B8%9A%E5%BE%AE%E4%BF%A1%E6%88%AA%E5%9B%BE_15901624529568.png )

其中有event，正式环境可以为其传入自己业务需求的参数来处理具体业务逻辑。

### 2. 本地测试

在本地 IDE 进行运行测试

![serverless]( https://img.serverlesscloud.cn/2020522/1590162499968-%E4%BC%81%E4%B8%9A%E5%BE%AE%E4%BF%A1%E6%88%AA%E5%9B%BE_15901624529568.png )

查看以及运行成功，服务器也正常启动

![serverless]( https://img.serverlesscloud.cn/2020522/1590162498615-%E4%BC%81%E4%B8%9A%E5%BE%AE%E4%BF%A1%E6%88%AA%E5%9B%BE_15901624529568.png )

## 上传项目到云端

### 1. 上传到云端进行测试

![serverless]( https://img.serverlesscloud.cn/2020522/1590162498739-%E4%BC%81%E4%B8%9A%E5%BE%AE%E4%BF%A1%E6%88%AA%E5%9B%BE_15901624529568.png )

### 2. 云端查看项目

![serverless]( https://img.serverlesscloud.cn/2020522/1590162498573-%E4%BC%81%E4%B8%9A%E5%BE%AE%E4%BF%A1%E6%88%AA%E5%9B%BE_15901624529568.png )

![serverless]( https://img.serverlesscloud.cn/2020522/1590162498717-%E4%BC%81%E4%B8%9A%E5%BE%AE%E4%BF%A1%E6%88%AA%E5%9B%BE_15901624529568.png )

![serverless]( https://img.serverlesscloud.cn/2020522/1590162500055-%E4%BC%81%E4%B8%9A%E5%BE%AE%E4%BF%A1%E6%88%AA%E5%9B%BE_15901624529568.png )

## 云端测试

![serverless]( https://img.serverlesscloud.cn/2020522/1590162498671-%E4%BC%81%E4%B8%9A%E5%BE%AE%E4%BF%A1%E6%88%AA%E5%9B%BE_15901624529568.png )

## 查看运行日志

![serverless]( https://img.serverlesscloud.cn/2020522/1590162499020-%E4%BC%81%E4%B8%9A%E5%BE%AE%E4%BF%A1%E6%88%AA%E5%9B%BE_15901624529568.png )

至此我们以及利用Tencent Serverless Toolkit for VS Cod完成了简单的项目编写部署，在此只是抛砖引玉，实际代码需要考虑到传入参数，多项目协调部署等。

## 思考

从裸金属物理服务器到虚拟化平台，再到云服务器，现在到容器技术，Serverless 以函数为扩展单位，虚拟化运行时环境 （Runtime）。是现有计算资源的最小单位，具有完全自动、一键部署、高度可扩展等特点。开发者在构建和运行应用时无需管理服务器等基础设施，应用被解耦为细粒度的函数，函数是部署和运行的基本单位。用户只为实际使用的资源付费。

拥有了 Tencent Serverless Toolkit for VS Code，对于 SCF 如鱼得水，本地化代码编写测试上传部署一条龙，配置也托管在代码中，无需在登录云平台进行配置，config as code 模式大大提升了 SCF 的效率，简化操作，适用于开发人员。

在此只是最简单的试用了一下 SCF，其更强大的功能及优势在云计算的潮流下后期会越显明显，适用场景众多，业务进行拆分，分工更加精细。截取官网的一张最常用的移动与 WEB 应用图，业务各模块分离，函数具有[弹性伸缩](https://cloud.tencent.com/product/as?from=10680)，前端入口为各业务模块的 API 网关，配合 CDB/COS 完成总体架构。

> 参考链接：[https://cloud.tencent.com/act/event/vscode](https://cloud.tencent.com/act/event/vscode?from=10680)


---
<div id='scf-deploy-iframe-or-md'></div>

---

> **传送门：**
> - GitHub: [github.com/serverless](https://github.com/serverless/serverless/blob/master/README_CN.md)
> - 官网：[serverless.com](https://serverless.com/)

欢迎访问：[Serverless 中文网](https://serverlesscloud.cn/)，您可以在 [最佳实践](https://serverlesscloud.cn/best-practice) 里体验更多关于 Serverless 应用的开发！
