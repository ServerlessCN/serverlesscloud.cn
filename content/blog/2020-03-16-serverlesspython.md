---
title: Serverless Python 开发实战（附源码）
description: 本文将为大家详细讲解 Serverless 架构的处理规范与处理模型、典型的工作流程，以及 Serverless 工程化的难点与挑战，最后将结合 Python Flask + Serverless 的情人节表白页制作实例
keywords: serverless发展,Serverless 基本概念,Serverless生产力
date: 2020-03-16
thumbnail: https://img.serverlesscloud.cn/2020326/1585234124615-0.jpg
categories:
  - user-stories
  - engineering-culture
authors:
  - serverless 社区
tags:
  - Serverless
  - Python
---

Python是一种热门的编程语言，Serverless 是近年来迅速兴起的一个技术概念，基于 Serverless 架构能构建出多种应用场景，适用于各行各业。

本文将为大家详细讲解 Serverless 架构的处理规范与处理模型、典型的工作流程，以及 Serverless 工程化的难点与挑战。最后将结合 Python Flask + Serverless 的情人节表白页制作实例，展示如何用 Serverless 的方式进行 Python 编程，将热门Python 框架利用Serverless 快速上云。

文章整理自 Serverless Framework 技术专家陈涛在腾讯云大学的视频分享。

本次分享大纲如下：

1. Serverless的架构规范 
2. Serverless的事件与规范 
3. Serverless工程化的难点与挑战 
4. 使用Python Flask 开发情人节表白页

## 一、Serverless 的架构规范

### **1、Serverless Web 场景处理的典型结构**

如下图所示，一般的 Web
场景无非通过客户端，到服务器，然后服务器去调用数据库，这是最常用的一个简单
Web 场景，那么 Serverless
把服务器完全拆解，比如可能会分为两块内容，第一块是鉴权系统，第二块是 API
网关，其实 API 网关和鉴权系统都算 BaaS 里的东西，最后是 FaaS
就是函数，我们通过函数去调用数据库来实现普通的 Web 场景的使用。



这里有一个思考，就是 Serverless
到底为我们做了一些什么，在这个典型架构中为我们做的就是及时扩容服务器、代码是否健康运行、防止黑客攻击服务器等一系列的运维操作。


从下面两个架构图中就可以非常粗浅认知 Serverless 其实是有两个部分：

-   第一个是 FaaS 就是计算层，这一块就对应云函数。

-   第二个是 BaaS，其中包括 API
    网关、身份验证、对象存储，还有时间触发等。

![Python](https://img.serverlesscloud.cn/2020326/1585233027593-%E4%BC%81%E4%B8%9A%E5%BE%AE%E4%BF%A1%E6%88%AA%E5%9B%BE_15852330258136.png)



### **2、Serverless处理模型**


事件源通过同步或异步来调用被调函数，然后 FaaS
做一些平台化的服务，包括身份、数据、鉴权等，这是典型的 FaaS
解决方案示意图。



从下图我们可以非常粗浅了解到一个概念调用，函数最关键的概念是调用，就是事件源去调用函数，然后来完成我们一系列的操作。



状态/运行时是在电脑上所描述的运行执行环境，比方说我们平常用的Python、PHP、Node.js
都是有运行时，就是这个函数在运行时间内所做的一些环境的搭建或者处理。



这是我们 Serverless
处理的一个简单模型，我们在里面可以知道是有同步或者异步的调用。



![](https://img.serverlesscloud.cn/2020326/1585233251397-%E4%BC%81%E4%B8%9A%E5%BE%AE%E4%BF%A1%E6%88%AA%E5%9B%BE_15852332173310.png)



### **3、Serverless场景典型的工作流程**

它有涉及到这个概念，第一个概念是事件状态，表示允许等待来自事件源的一个事件。第二个是操作/任务状态，表示这个状态下允许按照顺序或者并行运行一个函数。第三个是切换状态，它允许切换到多个其他状态，比方说前一个函数的结果，然后触发分支，转换到不同的一个状态。第四个是停止状态，用来终止工作流程。



然后让我们看一下工作流程，他其实是通过我们的一个事件触发，然后判断事件状态，通过事件状态调用函数。从函数A中拿到结果，然后再到切换状态，完成后可能会有两个结果，结果2、结果3，这是
Function 的结果，其实是调取的 Function
的前一个函数的事件或者是前一个函数的数值，然后再去做操作任务，最后来到
FunctionB 或者
FunctionC，这个流程就结束了。这是我们典型的事件状态，包括函数调用的一个工作流程。



![Python](https://img.serverlesscloud.cn/2020326/1585233251430-%E4%BC%81%E4%B8%9A%E5%BE%AE%E4%BF%A1%E6%88%AA%E5%9B%BE_15852332173310.png)



### **4、Serverless 函数架构规范**

现在我们来看一下 Serverless 的底层的 FaaS
函数、调用模型如何定义，包括约束。

首先看函数定义，下图表示比较清楚。函数定义是包括几个概念，第一个概念是
ID，这很好理解，名称、标签、版本
ID，其实刚刚所讲的运行时，也是函数定义里面的；还有函数处理的一个程序，就是函数所拿到的事件去做一些处理；以及里面所包括的代码，还有包括依赖，比方说我们今天所有有英文的实践，可能就需要去用依赖，然后统一上传到函数，以及环境变量。


元数据详情，有几个概念，第一个是版本的概念，第二个是环境变量，第三个是执行角色，第四个是资源，第五个是超时，其实元数据详情这里面的一些都是最基础、可能最常用的一些数据详情的结构。



第三点数据绑定，其实是一些无服务器框架允许用户去指定函数使用的输入输出的一些数据资源。这样就可以让开发人员去帮助函数资源的简化，来提高性能来获取更好的安全性，当然作为开发者来讲，并不是很关键。



函数约束，是代表运行Serverless函数时满足的通用的条件，比方说我们的函数必须与不同的事件类的底层来实现分离，是很基础的一些东西，包括每次调用的方法，不需要不同的函数，就意思说，我们的函数其实它是可复用的，以及事件源是可以去调用多个函数，这些是函数的约束，还有包括它的特性。



函数调用类型，函数调用分四种，第一种是同步请求，第二种是异步请求，第三种是信息流，或者叫记录流，第四种是批量作业。



同步请求很好理解，就比方APP请求，GIPC的调用，它代表客户端发出的一个请求等待并立即响应，包括我们这次的实践，所用的方式也就是同步请求。



异步请求，异步请求就有很多，就比方说在SF上看到的触发、MQTT的触发、电子邮件，还有cos更改的命令触发，以及计划事件，比方说用我们的时间触发器，去写一个时间，自动触发任务，这都叫异步消息队列请求。



![Python](https://img.serverlesscloud.cn/2020326/1585233251502-%E4%BC%81%E4%B8%9A%E5%BE%AE%E4%BF%A1%E6%88%AA%E5%9B%BE_15852332173310.png)



##  二、Serverless 的事件与规范



什么是 Severless
的事件，然后是怎么去定义的，我觉得这是所需要知道的一个重点。



### **1、什么是 CloudEvents？**



CloudEvents 是一个规范，它是由先 CSF
提出的规范，主要是以通用的格式来描述事件数据以提供跨服务、跨平台、跨系统的交互能力，我们可以去
CloudEvents 的 GitHub 主页去看关于 FaaS
的详的事件，包括事件规范。比较重要的一点就是他的所有实现都必须要支持
JSON 格式，这也是 FaaS 和其他不太相同的一个地方。



### **2、什么是事件？**



事件其实无处不在，每个事件源所产生的事件都各不相同，所以这对于开发者来说需要不断的去重复学习如何消费不同类型的事件。就比方说可能腾讯云
CMQ 产生的事件，还有 API
网关的产生的事件或其他厂商的事件，是不太一样的，就可能一些入参、出参值都是不太一样的。



不同厂商的 API 网关的触发器，它所产生的事件也可能不是很相同的，这可以在
SLF
里面去验证一下，我也给到腾讯云的事件的一些基础参考。但是事件是基于触发，触发器达到某项特定事件之后，去入参给
FaaS 层，云函数去做一些操作。



### **3、必须的事件属性。**



这其实也是
SCF 的一个统一的管理委员会去制定的一个必须的事件属性，比方说第一个很简单，就是
ID，所有的事件都是需要有个 ID
来帮助我们进行事件的查询，还有包括事件的一些处理，以及识别事件所发生的上下文，这块很简单，就是入参和传参。



还包括事件所使用的该版本的 CloudEvents
的规范，这块可以去腾讯云官网参考一下这块的一些属性。以及发生相关事件的类型值，还有
Data 的数据内容格式，以及事件上下文主题，发生事件的时间节点。



我还想在这里为家补充的几个点就是事件也是有分类的，大致可以分为几类：

-   第一类，是事件、消息服务，这块内容就很多，比方说 MPL、MQTT。

-   第二类是存储服务，很简单，就比方说 COS。

-   第三类是端点服务，比方说物联网、ATP 网关、移动设备。

-   第四类是配置数据库，比方说地图就是一种配置数据库。

-   第五类是使用特定语言去做的一些 SDK 的用户程序，这也算作事件源。

-   第六类是计划事件，可以具象的说计划事件其实就是定制触发，就是定期去启用函数的一个功能。



虽然我们每个事件所提供的数据，其实在不同事件源之间都是有不同的，但事件的结构应该是通用的，所以我们能够分装关于事件的一些特定的信息。



## **三、Serverless工程化的难点与挑战**


说到Serverless工程化的难点、挑战，这块我其实都没怎么写，就直接在百度上一搜，这东西其实大家都可以搜到的，所以我也不给大家多讲，我需要讲的是面对Serverless工程化的难点，我们需要做什么以及怎么去做，或者是有没有什么工具或者方式，去攻克这些难点。



![Python](https://img.serverlesscloud.cn/2020326/1585233251437-%E4%BC%81%E4%B8%9A%E5%BE%AE%E4%BF%A1%E6%88%AA%E5%9B%BE_15852332173310.png)



### **第一点：长时间问题**



在FaaS层，因为它就是通过事件触发，或者是有一个运行时的概念或者是用完即走的概念，所以说不太适合在长时间去运行应用。这其实是不可否认的，但是我们有一个方案，是ServerlessFramework下的一个component，我们其实是有一定的方案去解决长时间运行运用的难点，但怎么说我还是不建议大家用FaaS去做长时间，这是我的非常固执的一个观点，但我们是有解决方案的。



![Python](https://img.serverlesscloud.cn/2020326/1585233251474-%E4%BC%81%E4%B8%9A%E5%BE%AE%E4%BF%A1%E6%88%AA%E5%9B%BE_15852332173310.png)


### **第二点：完全依赖于第三方服务**



其实说到底我们 Serverless
其实就是免运维，所以说依赖于升第三方服务的时候，第三方是可以提供我们一站式的解决方案。



![Python](https://img.serverlesscloud.cn/2020326/1585233251532-%E4%BC%81%E4%B8%9A%E5%BE%AE%E4%BF%A1%E6%88%AA%E5%9B%BE_15852332173310.png)



意思就是说，我觉得依赖于第三方其实是一件好事，因为它可以帮助我们去做一些监控、负载均衡、业务集群，最关键的是弹性的扩缩容，并且可以帮助我们免运维，所以我觉得完全依赖于第三方，其实这不应该是他的一个缺点，应该算作一个优势，尤其在云原生的时代，他其实是我们的一个优势。



### **第三点：冷启动的时间**



因为我们的函数在你运行的时候，才会启动，所以说不是你启完之后一直都是在线的，Serverless是只有你在运行就是有事件触发的时候，才会去调用函数，去做计算的运行，导致一个冷启动时间会特别长。



但这块其实我做了一个测试，这个其实是有关于云厂商的优化的建议，我测了腾讯云还有包括国内的A厂商、B厂商，其实在我的测试中会发现，其实腾讯云的耗时是最短的，我可以给大家共享出这块测试的代码，然后大家可以自己去在同区域，同网络环境，同配置下去跑冷启动的时间，其实腾讯云在其他厂商中相比来说，它的冷启动时间最短。



![Python](https://img.serverlesscloud.cn/2020326/1585233251697-%E4%BC%81%E4%B8%9A%E5%BE%AE%E4%BF%A1%E6%88%AA%E5%9B%BE_15852332173310.png)



其次冷启动时间有什么解决方案，基本解决方案主要就两大块。

-   第一块就是复用，可以使用容器的一些复用技术。

-   第二块是预热，可以去做一些预创建，热门代码的缓存、网络优化，预启动来做一些预热解决冷启动



这块的话我其实还是建议大家就是不要过分关于论启动的基本方案，因为基本方案其实是云厂商一直在做的一些优化点。所以说大家尽量不要去纠结于这种特别底层的技术实现。



![Python](https://img.serverlesscloud.cn/2020326/1585233251675-%E4%BC%81%E4%B8%9A%E5%BE%AE%E4%BF%A1%E6%88%AA%E5%9B%BE_15852332173310.png)



### **第四点：缺乏调试和开发工具**



其实我们最近出了一个特别好用的工具，推出了 Serverless Framework
是可以贯穿到我们整体的 Serverless
应用的生命周期，有包括我们非常健全的开发部署环节的。



测试环节的测试监控，还包括安全环节的，以及 debug
的时候所用到的一些的debug方案，还有包括一些具体的的debug的一个解决实现，还有包括详细的Dashboard，最后还包括审计、操作记录、告警信息、团队协作。



![Python](https://img.serverlesscloud.cn/2020326/1585233251760-%E4%BC%81%E4%B8%9A%E5%BE%AE%E4%BF%A1%E6%88%AA%E5%9B%BE_15852332173310.png)



他其实是贯穿了整体的Serverless的一个整合应用生命周期，所以这块的调试工具，还有开发工具其实是很好解决的事情。



### **第五点：语言版本的落后**



反正我是可以看到基本上主流的版本，比方说
Python2.7、Python3.6，还有Node.js8.9，包括 PHP
这些常用的新的稳定的原版本，其实都是有在支持我们的 runtime。



当然这块的话，有的同学可能就会问到一个点，就是很尴尬一点，比方说你Python虽然
3.6 但现在 Python 都已经到
3.8，你为什么不用？这个我的观点就是并不是所有语言的语言版本越高越好，我觉得这点还是需要去寻求一个稳定，意思就是说我们需要去找到一个长期维护，并且稳定的版本，然后再给大家去用。



我举个比较简单的例子，就是PHP7.0的时候出了N多个bug，可能达到了7.1\\7.2之后，这些东西才渐渐地稳定下来，这些新特性才有人去用,我是这么看待语言版本落后的问题。



![Python](https://img.serverlesscloud.cn/2020326/1585233251775-%E4%BC%81%E4%B8%9A%E5%BE%AE%E4%BF%A1%E6%88%AA%E5%9B%BE_15852332173310.png)



然后我们来看一下有哪些人在用 Serverless
的架构，就如下图所示，基本上现有的主流的一些互联网公司，它其实都是在有用
Serverless 架构，其实Serverless
架构也是势在必行。所以我觉得开发者一定是要懂得并且学习Serverless的架构才能在我们的行业中有一定的竞争力，我是保持我这个观点的。


最后就是 Serverless 的架构应用。我们现在和 Framework 推出了很多的
Component，你也可以成为我们开源社区的贡献者，可以去直接去搜Serverless
官方网站，在最底下订阅我们的公众号，假如你有问题的话也可以将问题提交给小助手，我们会有专门的一些工作人员为大家去做一些更多详细的解答。



![Python](https://img.serverlesscloud.cn/2020326/1585233251963-%E4%BC%81%E4%B8%9A%E5%BE%AE%E4%BF%A1%E6%88%AA%E5%9B%BE_15852332173310.png)



## **实战：Python+Serverless 开发情人节表白页**




然后那么最后我们来去看一下 Python+Serverless 怎么去开发情人节表白页。

### 1. 安装

-   通过 npm 安装 serverless

```
$ npm install -g serverless
```

### 2. 创建

-   本地创建 serverless.yml 文件：

```
$ touch serverless.yml
```


-   初始化一个新的 npm 包，并安装 Express：

```
npm init              # 创建后持续回车npm i --save express  # 安装express
```

-   创建一个 `app.js`文件，并在其中创建您的
    Express App：

```
const express = require('express')const app = express()app.get('/', function(req, res) {  res.send('Hello Express')})// don't forget to export!module.exports = app
```

### 3. 配置

-   在 serverless.yml 中进行如下配置

```
# serverless.ymlexpress:  component: '@serverless/tencent-express'  inputs:    region: ap-shanghai
```

### 4. 部署

-   通过`sls`命令进行部署，并可以添加`--debug`参数查看部署过程中的信息


```
$ sls --debug  DEBUG ─ Resolving the template's static variables.  DEBUG ─ Collecting components from the template.  DEBUG ─ Downloading any NPM components found in the template.  DEBUG ─ Analyzing the template's components dependencies.  DEBUG ─ Creating the template's components graph.  DEBUG ─ Syncing template state.  DEBUG ─ Executing the template's components graph.  DEBUG ─ Compressing function ExpressComponent_7xRrrd file to /Users/dfounderliu/Desktop/temp/code/.serverless/ExpressComponent_7xRrrd.zip.  DEBUG ─ Compressed function ExpressComponent_7xRrrd file successful  DEBUG ─ Uploading service package to cos[sls-cloudfunction-ap-shanghai-code]. sls-cloudfunction-default-ExpressComponent_7xRrrd-1572512568.zip  DEBUG ─ Uploaded package successful /Users/dfounderliu/Desktop/temp/code/.serverless/ExpressComponent_7xRrrd.zip  DEBUG ─ Creating function ExpressComponent_7xRrrd  DEBUG ─ Created function ExpressComponent_7xRrrd successful  DEBUG ─ Starting API-Gateway deployment with name express.TencentApiGateway in the ap-shanghai region  DEBUG ─ Using last time deploy service id service-n0vs2ohb  DEBUG ─ Updating service with serviceId service-n0vs2ohb.  DEBUG ─ Endpoint ANY / already exists with id api-9z60urs4.  DEBUG ─ Updating api with api id api-9z60urs4.  DEBUG ─ Service with id api-9z60urs4 updated.  DEBUG ─ Deploying service with id service-n0vs2ohb.  DEBUG ─ Deployment successful for the api named express.TencentApiGateway in the ap-shanghai region.  express:    region:              ap-shanghai    functionName:        ExpressComponent_7xRrrd    apiGatewayServiceId: service-n0vs2ohb    url:                 http://service-n0vs2ohb-1300415943.ap-shanghai.apigateway.myqcloud.com/release/  36s › express › done
```

部署完毕后，可以在浏览器中访问返回的链接，看到对应的express返回值。

实践相关源码：https://docs.qq.com/doc/DVURnWFp3SFNGd3N



---
<div id='scf-deploy-iframe-or-md'></div>

---

> **传送门：**
> - GitHub: [github.com/serverless](https://github.com/serverless/serverless/blob/master/README_CN.md)
> - 官网：[serverless.com](https://serverless.com/)

欢迎访问：[Serverless 中文网](https://serverlesscloud.cn/)，您可以在 [最佳实践](https://serverlesscloud.cn/best-practice) 里体验更多关于 Serverless 应用的开发！
