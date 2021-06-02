---
title: 云函数 SCF 支持容器镜像交付 - 助力传统应用 Serverless 化
description: 我们会持续运用更开放、更标准的云原生技术，秉承用户为本、科技向善的企业愿景，更好的为客户创造价值。(文末可申请内测)
date: 2021-06-02
thumbnail: https://main.qcloudimg.com/raw/2cecc378e9f156bd73064610f3c6f844.jpg
categories:
  - best-practice
authors:
  - 宋昭文
tags:
  - Serverless
  - 云函数
---

<img src="https://main.qcloudimg.com/raw/2cecc378e9f156bd73064610f3c6f844.jpg" width="700"/>





## 01. FaaS 产品与容器生态的结合

容器镜像已成为云原生时代标准的交付物，并且有其强大的生态来解决 CICD、存储、编排等实际需求。云函数 SCF 从设计之初即是基于云原生架构的 FaaS 产品，同时也是 Serverless 思想的最佳产品化体现之一。在 Runtime 层支持自定义容器镜像后，意味着产品形态整体向容器化生态迈出了第一步。

一方面，解决函数运行时的环境依赖问题，给予用户更大的自由发挥空间；另一方面，产品形态层面的呈现使得用户无需受困于 Kubernetes 集群管理、安全维护、故障诊断等技术门槛，将弹性伸缩、可用性等需求下沉至计算平台，进一步释放云计算能力。



## 02. 云函数 SCF 支持容器镜像交付

### 1. 运行概览

基于自定义镜像部署的函数运行，如下图所示：

<img src="https://main.qcloudimg.com/raw/b255d9a326ccc60eadb266a5ecb97fbe.jpg" width="700"/>



整体分为两条路线：研发路线和用户访问路线。

- 研发路线：

1. 开发者在开发完成代码后，构建镜像并将其推送至镜像仓库 TCR；

2. 函数运行时会从镜像仓库拉取镜像，并根据容器运行参数、函数运作配置来 run 函数实例；

3. 开发者也可以配置函数实例向分布式协调组件进行注册，或访问数据库服务，以此来形成完整的微服务应用生产体系。

- 用户访问路线

开发者可通过 HTTP 请求，或触发相应的事件触发器，达到访问函数实例所承载服务的目的。



### 2. 工作原理

<img src="https://main.qcloudimg.com/raw/cce0505d9eb2a1dc2ad79fb0e6a6038a.jpg" width="700"/>



1. 云函数在函数实例初始化阶段，获得镜像仓库的临时用户名和密码作为访问凭证来拉取镜像；

2. 镜像拉取成功后，根据指定开发者所定义的启动命令 Command、参数 Args 及端口（固定为9000）启动开发者定义的 HTTP Server；

3. 最后，HTTP Server 将接收云函数的所有入口请求，包括事件函数调用及 Web 函数调用。



### 3. 功能优势

容器技术本身解决的是「**应用上线前**」问题，即软件应该如何更好的交付。云函数 SCF 的特征免运维、降低资源成本以及云服务集成，应对的是「**应用上线后**」的痛点。二者以一定的形式结合，为开发者带来更好的 Serverless 体验。

<img src="https://main.qcloudimg.com/raw/cb8f5a4416cf3cb5fffeebbb78f58f58.jpg" width="700"/>



- **更丰富镜像仓库类型的支持**

开发者可根据自己的需求，来选择镜像仓库的企业版或个人版。

- **无侵入的日志采集聚合**

云函数 SCF 实现了在容器外收集开发者在容器内所产生的 `stdout、stderr` 等标准输出日志，并与系统日志聚合展示至控制台日志模块。

- **基于镜像 Digest 的镜像拉取**

鉴于开发者`push`镜像时可能会以相同的 `Tag `推送不同内容的镜像，云函数 SCF 基于镜像唯一标识 Digest 来拉取镜像，进一步明确应用运行时所使用的镜像。

- **更加明确的平台与开发者边界**

其它函数运行实例 `Runtime` 中存在云函数 SCF 的系统进程，承担获取触发事件、日志收集等作用。在综合技术架构演进、实际线上问题后，决定在平台侧与用户侧建立明确的边界，即  `Runtime`  内不再运行云函数 SCF 任何的进程。

- **加速应用 Serverless 化**

支持开发者自定义镜像，无需改造代码或重新编译二进制依赖，达到应用快速上线的目的。



### 4. 冷启动加速

镜像由于增加了基础环境、系统依赖等文件层，相较于基于代码包部署的完全内置，无疑带来了额外的文件下载和镜像解压的时间。为了进一步降低冷启动时间，推荐您使用以下策略：

- 在同一地域创建镜像仓库与函数，这样在函数触发镜像拉取时会使用 VPC 网络进行拉取，以此获得更快更稳定的镜像拉取效率；
- 镜像制作秉承最小化原则，即仅包含必要基础环境、运行依赖，去除不必要的文件等；
- 镜像部署搭配预置并发功能，预先启动函数实例，达到最优降低冷启动的体验。



## 03. 业务应用场景

### 1. 音视频处理

- **难题痛点**

音视频处理的应用运行时，通常有 **请求波动大、对算力弹性要求高、接收非结构化数据变更事件、需要工作流工具编排计算任务** 等方面的特征，使得云函数 SCF 成为音视频处理类应用上云的首选。

但在运行的过程中发现，为了满足不同的场景，往往需要用户自定义编译上传工具库 FFmpeg 及编码器。编译时，会对环境中的共享对象（*.so）和 glibc 等库有依赖关系，此前云函数 SCF 运行环境不支持镜像交付，不能高度自定义环境依赖，在运行支撑的过程中多有痛点。

- **解决方案**

往后，云函数 SCF 通过自定义镜像的方式解决该类问题。如下所示，可以在 Dockerfile 中定义运行环境、系统依赖以及增加业务处理逻辑，而后以镜像交付部署为云函数。

```
FROM csighub.tencentyun.com/scf-base:latest
MAINTAINER scf.example@tencent.com
# 安装xvfb、pulse-audio等必备依赖软件
RUN yum clean all \
    && yum makecache \
    && rpm --rebuilddb \
    && yum -y install unzip which \
        xorg-x11-server-Xvfb \
        pulseaudio pulseaudio-utils alsa-plugins-pulseaudio \
    && yum clean all
# 安装ffmpeg
COPY ffmpeg-4.2-linux-64.zip /tmp/
RUN unzip /tmp/ffmpeg-4.2-linux-64.zip -d /usr/local/bin
# 增加业务代码
COPY app.zip /tmp/
RUN unzip /tmp/app.zip -d /opt/app/
···
```



### 2. 大数据推理分析

- **难题痛点**

TensorFlow 是当下最为流行的 AI 推理分析框架。推理类任务的运行需求，与音视频处理是类似的，同样是请求量驱动，既要求能快速响应激增流量，又要能在请求低峰释放资源，甚至是缩容至 0 节省成本。这些需求天然就是 FaaS 类产品云函数 SCF 所擅长的。但由于 TensorFlow 标准版本对 `linux standard library` 有要求（需要 `glibc 2.29` 以上），此前云函数只能部署 TensorFlow lite 版本以覆盖一定范围的需求，同时开发者还需要自己编译，把 `standard library` 静态链接进去。

- **解决方案**

支持了容器镜像交付函数能力的云函数 SCF，只需要简短的 Dockerfile 就可以跑起来 TensorFlow Serving 的 DEMO。

```
FROM tensorflow/serving
MAINTAINER scf.example@tencent.com
ENV MODEL_NAME=half_plus_two
COPY ./testdata/saved_model_half_plus_two_cpu /models/half_plus_two
ENTRYPOINT ["/usr/bin/tf_serving_entrypoint.sh"]
```



### 3. 传统巨石型 Web 应用 Serverless 化

- **难题痛点**

传统巨石型 Web 应用，往往存在运行环境（容器镜像）和业务逻辑耦合度高且解耦代价较高的现状。为了应用 Serverless 化，迫不得已根据云厂商的供应环境，来适配升级操作系统、依赖库版本、并重新编译，迁移至 Serverless 架构有较高的时间成本和稳定性风险。

- **解决方案**

通过云函数 SCF 的镜像交付能力，传统容器化 Web 应用几乎无需代码改造，即可实现应用快速 Serverless 化，将更多的时间和精力专注于业务逻辑的创新和迭代。



## 04. 关于云函数 SCF & 容器的未来设想

容器镜像，已经成功解决了**「应用交付」**所面临的最关键的技术问题，但在如何定义和管理应用这个更为上层的问题上，容器技术并不是「银弹」。然，支持镜像交付的云函数 SCF，封装了对容器的隔离、文件挂载、启停配置，容器集群调度、弹性伸缩对用户完全透明，使得开发者能更加聚焦于应用业务逻辑的定义。

我们将从以下三个维度出发，推动容器化的应用以更高效的方式 Serverless 化。

- 周边生态配套，如运维可观测能力的完善改进；
- 研发流程对接，联合腾讯云 DevOps 产品，提供 Step 级的函数管理能力；
- 底层技术支撑，如通过按需加载的镜像加速技术，进一步提高函数冷启动效率。

未来，腾讯云坚信 FaaS 与容器生态的结合将会更加紧密，我们将运用更开放、更标准的云原生技术，秉承用户为本、科技向善的企业愿景，更好的为客户创造价值。



## 05. Serverless 云函数支持镜像交付 - 内测申请

腾讯云 Serverless 云函数将推出自定义镜像功能，现开放内测申请，[点击提交申请](https://cloud.tencent.com/apply/p/ox0h1yv3r9e)。





------



> **传送门：**
>
> - GitHub: [github.com/serverless](https://github.com/serverless/serverless/blob/master/README_CN.md)
> - 官网：[serverless.com](https://serverless.com/)

欢迎访问：[Serverless 中文网](https://serverlesscloud.cn/)，您可以在 [最佳实践](https://serverlesscloud.cn/best-practice) 里体验更多关于 Serverless 应用的开发！

