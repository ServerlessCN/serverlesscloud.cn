---
title: SpringBoot + SCF 最佳实践：实现待办应用
description: 本文将介绍如何通过 Serverless 云函数 的 Web 函数使用 SpringBoot 搭建一个待办应用。
date: 2021-11-18
thumbnail: https://qcloudimg.tencent-cloud.cn/raw/49bb9d642f89800cd3d6fd8de7905300.jpg
categories:
  - best-practice
authors:
  - 颜松柏
tags:
  - Serverless
  - 云函数
---



SpringBoot 是由 Pivotal 团队提供的框架，用来简化新 Spring 应用的初始搭建以及开发过程。该框架使用了特定的方式来进行配置，从而使开发人员不再需要定义样板化的配置。Serverless 对于微服务的价值在于：

1. 每个微服务 API 被调用的频率不一样，可以利用 Serverless 精准管理成本和弹性。

2. 不用担心一个 API 调用量大而需要扩容整个服务，Serverless 可以自动扩缩容。

3. 不需要去运维每个服务背后部署多少个容器，多少个服务器，不用做负载均衡。

4. 屏蔽了 K8s 等容器编排的复杂学习成本。

5. Serverless 这种无状态的特性也非常符合微服务使用 Restful API 的特性。

本文将介绍如何通过 Serverless 云函数 的 Web 函数使用 SpringBoot 搭建一个待办应用。



### 01. 前提条件

请参考云函数 JAVA 开发指南准备开发环境和工具。

### 02. 创建待办应用

SCF 提供模板函数，按照如下流程操作可快速创建一个待办应用并体验待办事项的增删改查功能。注意：本模板仅作为示例提供，待办事项数据实际存储在实例内存中，不作为持久化存储。

1. 登录云函数 SCF 控制台；

- 云函数控制台地址：https://console.cloud.tencent.com/scf

2. 选择函数服务 -> 新建 -> 模板创建 -> 搜索关键词`springboot`，在查询结果中选择「SpringBoot 待办应用」并单击「下一步」，保持默认配置，完成函数创建。

<img src="https://qcloudimg.tencent-cloud.cn/raw/77c32b86948dd322c896b10dda7aab29.png" width="700"/>



3. 切换到「函数代码」页签，按照如下流程操作，通过测试模板发起模拟请求体验待办应用增删改查功能：

- 查询待办列表：

请求方式选择 GET，path 填写 /todos，点击「测试」后，在响应 Body 中可以查看到当前的待办事项。

<img src="https://qcloudimg.tencent-cloud.cn/raw/2aab8fe20d41811eca39b2f35fe7bddd.png" width="700"/>

- 增加待办事项：

请求方式选择 POST，path 填写/todos，body 填写{"key":"3","content":"Third todo","done":false}，点击「测试」增加一个待办事项。

<img src="https://qcloudimg.tencent-cloud.cn/raw/2aab8fe20d41811eca39b2f35fe7bddd.png" width="700"/>



- 删除待办事项：

请求方式选择 DELETE，以删除 key 为 2 的待办事项为例，path 填写 /todos/2，点击「测试」。

<img src="https://qcloudimg.tencent-cloud.cn/raw/4254f7b614e0c92d9e6ab8018e9b20f9.png" width="700"/>



- 修改待办事项：

请求方式选择 PUT，以将 key 为 3 的待办事项由未完成改为完成为例，path 填写 /todos/3，body 填写 {"key":"3","content":"Third todo","done":true}，点击「测试」。

<img src="https://qcloudimg.tencent-cloud.cn/raw/627657aa8983da727cbf4f2d3ec3072e.png" width="700"/>



**03. 代码示例**

在 「02.创建待办应用」的第二步模板选择页面，点击模板卡片右上角的「查看详情」，在展开的页面中单击「点击下载模板函数」即可获取模板函数源码。

原生 SpringBoot 项目迁移到 Web 几乎没有改造成本，只需要：

1. 确保 Spring 监听端口为 9000（SCF Web 函数指定监听端口）

<img src="https://qcloudimg.tencent-cloud.cn/raw/3abc1423c4df3f9cd7304af5c3383822.png" width="700"/>

2. 编译 JAR 包

下载代码之后，在目录`Webfunc-Java8-SpringBoot`下运行编译命令：

```
gradle build
```

编译完成后可在`build/libs`目录下获取到打包完成的 jar 包，选择后缀为`-all`的 jar 包。



3. 准备一个可执行文件 `scf_bootstrap` 用于启动 Web Server，文件内容可参考下文：

```
#!/bin/bash/var/lang/java8/bin/java -Dserver.port=9000 -jar scf-springboot-java8-0.0.2-SNAPSHOT-all.jar
```

注意：在 scf_bootstrap 文件所在目录执行`chmod 755 scf_bootstrap`来保证scf_bootstrap 文件具有可执行权限。



4. 将 `scf_bootstrap`文件与生成的 jar 包一起打包为 zip 部署到云函数。

- 登录云函数 SCF 控制台；

- - 云函数控制台地址：https://console.cloud.tencent.com/scf

- 选择函数服务->新建->自定义创建；
- 函数类型：web 函数
- 运行环境：Java8
- 提交方法：本地上传 zip 包
- 单击上传选择打包好的 zip 文件
- 其他保持默认配置，单击「完成」即可完成函数创建。

<img src="https://qcloudimg.tencent-cloud.cn/raw/3945aa8512d78c7e80a0ebaf9609a605.png" width="700"/>





------



> **传送门：**
>
> - GitHub: [github.com/serverless](https://github.com/serverless/serverless/blob/master/README_CN.md)
> - 官网：[serverless.com](https://serverless.com/)

欢迎访问：[Serverless 中文网](https://serverlesscloud.cn/)，您可以在 [最佳实践](https://serverlesscloud.cn/best-practice) 里体验更多关于 Serverless 应用的开发！



