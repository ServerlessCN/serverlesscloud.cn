---
title: Serverless 架构揭秘与静态网站部署实战（附实战源码）
description: Serverless被誉为下一代云计算技术，因为其能带来研发交付速度提升与成本的降低在业内异常火爆。本文主要为大家分享 Serverless Framework 的架构演进、技术解析以及应用发展，并通过 Serverless+Hexo 实战案例，分享如何快速基于 Serverless Framework 进行业务开发部署。
keywords: Serverless,Serverless开发实战,Serverless架构,
date: 2020-02-28
thumbnail:  https://serverlessimg-1253970226.cos.ap-chengdu.myqcloud.com/qianyi/images/0%20%281%29.jpg
categories:
  - news
authors:
  - liujiang
authorslink: 
  - https://github.com/jiangliu5267
tags:
  - Serverless
  - Meetup  
---

Serverless被誉为下一代云计算技术，因为其能带来研发交付速度提升与成本的降低在业内异常火爆。本文主要为大家分享 Serverless Framework 的架构演进、技术解析以及应用发展，并通过 Serverless+Hexo 实战案例，分享如何快速基于 Serverless Framework 进行业务开发部署。

文章整理自Serverless Framework 社区专家陈涛在腾讯云大学的视频分享。

文章大纲：

> 1、Serverless 架构演进
> 
> 2、Serverless 技术解析 
> 
> 3、Serverless 应用与发展 
> 
> 4、Serverless 静态博客实战

# **1、Serverless 架构演进**

单体架构使最原始的站点架构模型，采用单一 VPS 或者服务器做业务支撑，数据库、静态存储和 PAP 脚本打包在一起，提供对外的访问，显著缺陷复杂性高，并且随着业务的增长，其技术载会逐渐上升，部署速度变慢，扩展性能也会受限。所以引出了第二种架构方式即 SOA 架构，最常用的企业架构，通过各个服务模块，将较为复杂的业务拆分治理，是面向服务的架构，也是目前为止用得最多的架构方式。容器架构与 SOA 架构并没有明显的差异。容器架构只是更好的 SOA 载体，是底层计算的革新，但还是会强依赖自身运维能力。Serverless 架构封装了所有的底层资源管理和系统运维工作，使开发人员更容易使用云基础设施。

![serverless](https://img.serverlesscloud.cn/qianyi/images/YHl6UWa9s63Cico1xISoyNt4dsb6jIVbUtm2T1VkaBODwgiaGD9yIzdSZkkFko7ZrHgY2Y7V2ibOoU3BIYDmyibKdg.jpg)

首先是从最原始的 SOA，有一个管理机构完成功能、接口的定义，然后各个系统统一调用接口，通过服务器进行访问，从而需要运维一个服务器集群。


![serverless](https://img.serverlesscloud.cn/qianyi/images/YHl6UWa9s63Cico1xISoyNt4dsb6jIVbUsrYYGNCcRibSZqs9nTScRsNeOFDu0lbUVOKBHaicAeq0xxrs3iaicoZviaA.jpg)

接下来看Kubernetes容器编排，它是属于主从分布式的架构，主要是由Master节点和工作节点组成的，它主要的意义是对传统 SOA 的服务层做改造，来实现自动化部署容器、水平扩展、负载均衡等，总的来说，不论是Docker还是Kubernetes，其实现的意义主要是替代服务层级的使用调度分布式方面的改造。

![serverless](https://img.serverlesscloud.cn/qianyi/images/YHl6UWa9s63Cico1xISoyNt4dsb6jIVbUgSzYFibTsRR91hibVuTaEq3YUCsBEHLbp4WDNm5EM3m3XbdfDGJZzkZw.jpg)

下图是 Serverless 架构的简单模型，Serverless 架构封装了所有底层资源，包括MVM、Docker和 BaaS 的功能，进行集成封装，只需要关注 Serverless 应用的架构模型等，简化了运维，具有弹性伸缩的能力。

![serverless](https://img.serverlesscloud.cn/qianyi/images/YHl6UWa9s63Cico1xISoyNt4dsb6jIVbUxgy2EHnqpAIsjg6jlEXVIwHhmARDbibickOroXCtt77yJUibqooet2GEg.jpg)

开发一个全栈应用需要了解的东西，首先是最底层的 K8S、系统安全、网络安全、备份等，中间需要留意到监控、日志报警、负载均衡、可靠性等，再上一层是DB、框架、文件存储、CDN，这样开发出一个 Full-stack 网站，对于一个普通的开发者来说是不可接受的，因为需要学习大量底层又不是很必要的知识，而Serverless 架构最核心的价值是让开发者可以聚焦到最核心最关键的业务能力上，而无需关注通用、底层、标准化的东西。

![serverless](https://img.serverlesscloud.cn/qianyi/images/YHl6UWa9s63Cico1xISoyNt4dsb6jIVbUpE4AS3liazmdNF9tCzcOEMOXxfI44nxh8k0TW151RI0YGCd6iazL33qw.jpg)

最后，总结一下，Serverless 是什么？

无服务器云计算（Serverless Computing）几乎封装了所有的底层资源管理和系统运维工作，使开发人员更容易使用云基础设施。Serverless 提供了一种方式，极大地简化了基于云服务的编程，犹如汇编语言到高级编程语言般的转换。

Serverless一定是未来的架构方式，而且更方便企业层级做出更好的架构和应用。

![serverless](https://img.serverlesscloud.cn/qianyi/images/YHl6UWa9s63Cico1xISoyNt4dsb6jIVbUVJTMuQqZ34VBpLtOTCAibrg7Jp9Fkj1Ggic3wcCVj2cLcUaiaaRc1iaTZw.jpg)

# **2、Serverless 架构演进**

Serverless的开发模型，应用层有 REST API、BFF、 SSR、Website、Full-Stack APP，需要研发团队与 TencentCloud 进行功能的对接，如API、SCF、存储、DB，这只是现有的 Serverless 的开发模型，现在看来是还不够优雅的，需要庞大的研发团队来支撑。

![serverless](https://img.serverlesscloud.cn/qianyi/images/YHl6UWa9s63Cico1xISoyNt4dsb6jIVbU21XlxicsXU7aEOUgT3CKQDLhRM0NYFuKYxlj9oj0fGpIO2HgBRyvzpA.jpg)

于是引出了一个问题，有没有办法可以改善团队研发的进程，或是中间对接的环节呢，那么也就是引出了今天的主题我们需不需要框架？

![serverless](https://img.serverlesscloud.cn/qianyi/images/YHl6UWa9s63Cico1xISoyNt4dsb6jIVbUwL3wr9eyT1LNShW8v8kmnMVtb97vQOCKDlbFEeoicngoglohTXD2wiaA.jpg)

先看一下Serverless Framework 框架能带来什么效益，我个人认为框架的帮助有两个部分，第一部分是组件化开发，第二部分是标准化框架。组件化开发通常是跨业务的可复用性来提高业务能力，对上通过组件化来提高代码复用的能力跨产品的。标准化框架的作用是帮助我们对接更多的云服务，如 COS、SAF、API 等一系列云服务。

![serverless](https://img.serverlesscloud.cn/qianyi/images/YHl6UWa9s63Cico1xISoyNt4dsb6jIVbU7YWSHmcsH0ZgVUpXHicozAhxC5k0cod3ibLv0gAIDGA6NSSibayMbjN3g.jpg)

那么组件化和标准化具体是替代哪些功能？组件化能够提供一些component来制作一些组件化的轮子，如 Express、website、FullStack 、Next.js等，帮助我们完成组件化的功能。标准化做的是部署、调试、架构、资源整合、应用、监控、告警等，对上是承接应用层，如REST API、BFF、SSR、Website、Full-Stack App；对下是接入云服务，如 API、COS、DB 等。以上是我们技术大纲，帮助大家理解Serverless Framework到底是做什么，可以帮助实现什么东西。

![serverless](https://img.serverlesscloud.cn/qianyi/images/YHl6UWa9s63Cico1xISoyNt4dsb6jIVbUfiaicKzyNyKpR3rem7t5U8n9gyac1zsVrC7tp4oQDAasw6icaGB8A6sVg.jpg)

- serverless Framework 应用生命周期管理是由CLI和Dashboard组成，覆盖了serverless的整个应用生命周期，如服务的部署/删除/查看/回滚、调试、查看日志、统计运行数据、DevOps支持。
- serverless 应用，也就是上述提到的标准化框架和组件化开发。
- Serverless资源，是可以无缝对接腾讯云Serverless资源。Serverless Framework 其实类似一个承接层或开发组件或包管理的工具。

![serverless](https://img.serverlesscloud.cn/qianyi/images/YHl6UWa9s63Cico1xISoyNt4dsb6jIVbUKJtSySDibcLia2ibym5AwewpXnVnic7Cr9fqgiaLLASO7212oRbpcmzvS8g.jpg)

# **3、Serverless 应用与发展**

下图是 IVWEB 团队在 Serverless 的业务落地，用到了 Serverless 值出渲染。首先是在客户端层，然后到 NGW 接入层完成业务转发、灰度、鉴权、统计，再接到 Apigateway 完成最终的访问环节，涉及到云函数同构环境，Koa 业务逻辑，最后直出返回结果。那么这一套应用架构最方便最可取之处是免运维、全量日志、多维度数据统计、云 API 打通工作流，使得业务上线&维护工作量降低了80%。

![serverless](https://img.serverlesscloud.cn/qianyi/images/YHl6UWa9s63Cico1xISoyNt4dsb6jIVbUpnHdnMrLiar7iajrVuTjyuiavP6QBXUBk34VMsdCqNSRlFS93u5p23lQw.jpg)

下图是NOW直播B侧运营平台的架构图，主要是实现了 BFF 到 SFF，Serverless 主要包括创建、更新代码、删除、容灾，达到了提高迭代效率、按需取用，用完即走、分离部署，安全可靠、细粒度的业务逻辑拆分。

![serverless](https://img.serverlesscloud.cn/qianyi/images/YHl6UWa9s63Cico1xISoyNt4dsb6jIVbUxJvtP86OZHoMS1Oh3x8Oq2CG6csUFXXMAmDoKxJkhnDPLI4uaxLREg.jpg)

下图是挑选的具有代表性的 component，可供使用，可以在 Serverless 官网站找到 component 文档。

![serverless](https://img.serverlesscloud.cn/qianyi/images/YHl6UWa9s63Cico1xISoyNt4dsb6jIVbUyDzt2BprP4a8KSM8kLrWluZZpicNdicMqSnwA8t5l2GncrEuNaT8KMRw.jpg)

总结一下Framework的功能：

- 代码重用，减少代码重复的开发量
- 统一规范，Framework是对下进行标准化，通过它可以直接对接到基础产品的功能
- 降低运维门槛和难度
- 专注业务逻辑
- 社区优势，Serverless Framework其实是北美完成了主力开发，由很多开发者进行维护，具体可以在GitHub搜索Serverless Framework进行了解。
- 易于维护，其实serverless不需要维护的，是将维护的工作交给云端。
- 提升效率，提高工作和应用效率。

![](https://mmbiz.qpic.cn/mmbiz_png/YHl6UWa9s63Cico1xISoyNt4dsb6jIVbUUPJibeyb1LDwgfkTvKJ4QmHRUiauxvAjGj98w9YxxWu7lVF3UtibqVLjQ/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

# **4、Serverless 静态博客实战**

接下来以一个 Serverless +Hexo 的案例，分享下如何基于 Serverless Framework 快速进行开发部署。实战步骤很简单，只有3步：

1. 安装 Serverless Framework、HEXO
2. 配置 YML 文件
3. 部署到腾讯云 其中的环节很多是免费的，所以大家可以大胆放心地部署项目。

![serverless](https://img.serverlesscloud.cn/qianyi/images/YHl6UWa9s63Cico1xISoyNt4dsb6jIVbUnOvmiaV4aw7uuneWMLbcPHC1bhKdlttJ0XbiarWuuW9xza7HaKN7xd8A.jpg)

1. 安装

安装前提：

- 安装Node.js (Node.js 版本需不低于 8.6，建议使用 Node.js 10.0 及以上版本)
- 安装Git

首先，安装 Serverless Framework

```javascript
$ npm install -g serverless
```

安装 Hexo

```javascript
$ npm install -g hexo-cli
```

安装 Hexo 完成后，请执行下列命令，Hexo 将会在指定文件夹中新建所需要的文件。

```javascript
$ hexo init hexo   # 生成hexo目录$ cd hexo$ npm install
```

新建完成后，指定文件夹的目录如下：

```javascript
.
 ├── _config.yml
 ├── package.json
 ├── scaffolds
 ├── source
 |   ├── _drafts
 |   └── _posts
 └── themes
```

安装完成后，可以通过hexo g命令生成静态页面

```javascript
$ hexo g   # generate
```

> 注：如果希望在本地查看效果，也可以运行下列命令，通过浏览器访问 localhost:4000 查看页面效果。

```javascript
$ hexo s   # server
```

### 2. 配置

在 hexo 目录下，创建 serverless.yml 文件

```javascript
$ touch serverless.yml
```

在 serverless.yml 文件中进行如下配置

```javascript

# serverless.yml

myWebsite:
  component: '@serverless/tencent-website'
  inputs:
    code:
      src: ./localhexo/public # Upload static files generated by HEXO
      index: index.html
      error: index.html
    region: ap-guangzhou
    bucketName: my-bucket
```

配置完成后，文件目录如下：

```javascript
.
├── .serverless
├── hexo
|   ├── public
|   ├── ...
|   ├── _config.yml
|   ├── ...
|   └── source
└── serverless.yml
```

### 3. 部署

通过 serverless deploy 命令（或者 sls 命令）进行部署，并可以添加--debug参数查看部署过程中的信息。

如您的账号未登陆或注册腾讯云，您可以直接通过微信扫描命令行中的二维码进行授权登陆和注册。

```javascript
$ serverless --debug

  DEBUG ─ Resolving the template's static variables.
  DEBUG ─ Collecting components from the template.
  DEBUG ─ Downloading any NPM components found in the template.
  DEBUG ─ Analyzing the template's components dependencies.
  DEBUG ─ Creating the template's components graph.
  DEBUG ─ Syncing template state.
  DEBUG ─ Executing the template's components graph.
  DEBUG ─ Starting Website Component.

Please scan QR code login from wechat
Wait login...
Login successful for TencentCloud
  DEBUG ─ Preparing website Tencent COS bucket my-bucket-1250000000.
  DEBUG ─ Deploying "my-bucket-1250000000" bucket in the "ap-guangzhou" region.
  DEBUG ─ "my-bucket-1250000000" bucket was successfully deployed to the "ap-guangzhou" region.
  DEBUG ─ Setting ACL for "my-bucket-1250000000" bucket in the "ap-guangzhou" region.
  DEBUG ─ Ensuring no CORS are set for "my-bucket-1250000000" bucket in the "ap-guangzhou" region.
  DEBUG ─ Ensuring no Tags are set for "my-bucket-1250000000" bucket in the "ap-guangzhou" region.
  DEBUG ─ Configuring bucket my-bucket-1250000000 for website hosting.
  DEBUG ─ Uploading website files from D:\hexotina\localhexo\public to bucket my-bucket-1250000000.
  DEBUG ─ Starting upload to bucket my-bucket-1250000000 in region ap-guangzhou
  DEBUG ─ Uploading directory D:\hexotina\localhexo\public to bucket my-bucket-1250000000
  DEBUG ─ Website deployed successfully to URL: https://my-bucket-1250000000.cos-website.ap-guangzhou.myqcloud.com.

  myWebsite:
    url: https://my-bucket-1250000000.cos-website.ap-guangzhou.myqcloud.com
    env:

  13s » myWebsite » done
```


访问命令行输出的 website url，即可查看您的 Serverless Hexo 站点。


> 注：如果希望更新 hexo 站点中的文章，需要在本地重新运行hexo g进行生成静态页面，再运行serverless更新到页面

### 4. 移除

可以通过以下命令移除 hexo 网站

```javascript
$ sls remove --debug

  DEBUG ─ Flushing template state and removing all components.
  DEBUG ─ Starting Website Removal.
  DEBUG ─ Removing Website bucket.
  DEBUG ─ Removing files from the "my-bucket-1250000000" bucket.
  DEBUG ─ Removing "my-bucket-1250000000" bucket from the "ap-guangzhou" region.
  DEBUG ─ "my-bucket-1250000000" bucket was successfully removed from the "ap-guangzhou" region.
  DEBUG ─ Finished Website Removal.

  6s » myWebsite » done
```

最后，奉上实战源码地址：

https://serverlesscloud.cn/doc/providers/tencent/templates/hexo



---

> **传送门：**
> - GitHub: [github.com/serverless](https://github.com/serverless/serverless/blob/master/README_CN.md) 
> - 官网：[serverless.com](https://serverless.com/)

欢迎访问：[Serverless 中文网](https://serverlesscloud.cn/)，您可以在 [最佳实践](https://serverlesscloud.cn/best-practice) 里体验更多关于 Serverless 应用的开发！