---
title: 《世界争霸》聊天 API 迁移至 Serverless 过程中踩过的坑和趟平的路
description: 本文整理自董文强在Techo开发者大会「Serverless Summit」专场的演讲。
keywords: Serverless, Serverless游戏, Serverless API
date: 2019-11-11
thumbnail: https://img.serverlesscloud.cn/qianyi/images/YHl6UWa9s62zicSFHQTm5RAchm5pOdynuj5PhOKpDQ5x70nXbiaR2JImuNRcZmKALEhOAXyxXUIiaQwUWaDoxN3Rg.jpg
categories: 
  - news
authors: 
  - Serverless 中文网
authorslink: 
  - https://github.com/jiangliu5267
tags:
  - API
  - 云函数
---

![serverless](https://img.serverlesscloud.cn/qianyi/images/YHl6UWa9s62zicSFHQTm5RAchm5pOdynuj5PhOKpDQ5x70nXbiaR2JImuNRcZmKALEhOAXyxXUIiaQwUWaDoxN3Rg.jpg)

**为什么要采用云函数？**

云函数SCF是腾讯云为企业和开发者们提供的无服务器执行环境，能够在无需购买和管理服务器的情况下运行代码。

最初，公司的需求是在确保性能的前提下，实现又省事、又省钱。采用云函数，用户不需要关注服务器、不用运维，非常省事。同时，云函数采用按需计费，用多少花多少，省钱。开发者只需要管理好自己的代码，这种模式非常适合中小型需求。

### **迁移过程**

确定这个方向，团队就开始调研，现有聊天API能否无缝迁移至云函数，也就是说现有的需求，能不能都满足。

![serverless](https://img.serverlesscloud.cn/qianyi/images/YHl6UWa9s62zicSFHQTm5RAchm5pOdynukmAoERLcEkHCSx81AePlen7djIpd3aP9F2NJZfGFceSR8gKpia2icyGg.jpg)

- **少改代码**

原来方案，负载均衡加虚拟机加swoole，用composer进行包管理，并用了EasySwoole做HTTP框架。新的方案下，原有的负载均衡变成API网关加云函数，包管理不变，旧框架肯定不能用了，要改的代码部分就是这里。

![serverless](https://img.serverlesscloud.cn/qianyi/images/YHl6UWa9s62zicSFHQTm5RAchm5pOdynuFiaVLhqomxxcXHXmVn9s2Y8FOhL3NFKeicMCOZhZdcScxLGWztl315mw.jpg)

改造代码的过程比较顺利，因为云函数的数量有限，而业务需求是无限的，首先，需要确保所有的请求都进入到同一个云函数。我们来看一个HTTP请求，https://url/controller/action?query，需要的就是在云函数内部才分配路由。这个很简单，云API设置一下即可。

![serverless](https://img.serverlesscloud.cn/qianyi/images/YHl6UWa9s62zicSFHQTm5RAchm5pOdynu1XwusGQpJWYwvAjNtsmDgez1Gk8g0icTibjq55zQG00qZrC8gW86I2vw.jpg)

接下来就是在函数入口处，解析路由，并找到类，调用对应类的方法；基于这样的入口，原有的controller就可以被调用到了；当然，还需要改动controller的父类，比如获取querystring内容、解析body，统一格式的返回值等。下图是一个比较简单的示例。

![serverless](https://img.serverlesscloud.cn/qianyi/images/YHl6UWa9s62zicSFHQTm5RAchm5pOdynujaNo4LwTA84HD33alCOAFmTFD7cNXMuqtZNf5F0kaNHhV9ibic1HqWzw.jpg)

这里用PHP作为示例，不同的语言，思路都类似，主要是适配的问题。

- **快速发布**

API网关和云函数的组合里，正常的发布流程是：开发代码->发布云函数->发布新版本->API网关对应路径切换版本->API网关发布测试版本->API网关线上使用版本切换。这是一个很麻烦的过程，团队一开始采用云函数时，云函数还不支持API调用，无法做自动化步骤，不过，这个功能目前已经支持了。

![serverless](https://img.serverlesscloud.cn/qianyi/images/YHl6UWa9s62zicSFHQTm5RAchm5pOdynuxnPaRz8QTb9sz73g5tEuLSYraqd91pwyMibJWMjgDnic4AaoPQiaJv2yQ.jpg)

也可以用更简单的方案，API网关指向云函数的$LATEST版本，然后部署云函数即可。这个方案适合测试阶段，不适合线上阶段的发布。我是两者结合起来进行，稳定的功能，可以用稳妥的版本发布流程。

发布这里遇到过一个坑，就是发布API网关时，遇到资源超限的情况。因为云函数的并发实例有限，当发布新的API版本时，请求会进入新的实例，而旧实例此时还没有释放，于是就会遇到超限的情况，此时需要申请提高限额。

![serverless](https://img.serverlesscloud.cn/qianyi/images/YHl6UWa9s62zicSFHQTm5RAchm5pOdynutef0PibJHKGktFpejXRXv1Fw8CAVwWXdOUStRL4TiaibVpdzQpd6B6ibwA.jpg)

- **内网互通**

API服务、MySql、Redis、长连接网关，都在同一个内网里，云函数本身可以设置在内网里，互相访问也都没问题。但这个过程中又有一个新问题，我们的API服务需要向外发出请求，但是当时测试时，永远超时。

当时，内网云函数没有访问外网的能力，这时候需要一个NAT网关。而且最好单独给云函数分配一个子网，因为已有的子网，如果去绑定NAT网关，会导致出口IP变化。如果已有的机器的IP刚好在某些白名单下，就会造成影响。

不过，目前腾讯云Serverless团队已经解决了这个问题，提供外网出口IP固定能力，当用户在云函数中访问数据库、微信公众号的 API 接口或其他第三方的服务时，可以使用云函数的固定公网出口 IP 功能，实现云函数网络配置的控制与管理。

- **日志查询**

首先，哪些内容适合进入日志呢？我觉得有这么几个：函数入口的原始信息，url路径、客户端ip、解析后的参数以及业务日志。


![serverless](https://img.serverlesscloud.cn/qianyi/images/YHl6UWa9s62zicSFHQTm5RAchm5pOdynu3hocLH9oTdK7lAyRM74Xge4jPlyVv1Lkwc1DfH6XK4fll7otAfBhnA.jpg)

这里也有一些小建议：

1. 不需要输出返回值日志，云函数自带
2. 开启日志投递后，要打开索引
3. 日志内容中，包含索引分词符，记得从分词符中删除，否则那个内容就被分割了
4. 目前日志还存在着一些不足，比如跟API网关的日志是分离的，HTTP的原始入口是API网关，这就导致一些问题追踪比较困难。不过腾讯云Serverless团队正在优化日志监控一块，这个后面可以期待一下。
- **耗时任务处理**

耗时任务可以用这种方式来做。这里有个实例代码。

 这个进程不归我们管理，我们测试后，发现打印出来的日志，跑到其他请求里去了。也不知道这个进程的计时怎么算，会不会暗地里被干掉。所以保险一点的方案，采用消息队列。

腾讯云的消息队列有CKafka，我们把内容封装一下，发给CKafka，然后CKafka触发另一个云函数。这里也有一些小tips：

1. CKafka主题默认开一个分区。如果消费速度不理想，可以新增分区试试；
2. 新增分区时，需要云函数先删一下触发器，再加回来。

![serverless](https://img.serverlesscloud.cn/qianyi/images/YHl6UWa9s62zicSFHQTm5RAchm5pOdynuMHCP7lmN7uy9Hibbia9qZncgWqa9u4IuoNF9nrcgPMhRCEpbWSHkvxrQ.jpg)

- **配置文件更新**

我们对此做了一个优化：配置文件单独有个git库，策划提交后，执行jenkins，然后由jenkins上传文件到cvm，并进行reload。改成云函数后，没有办法单独上传配置文件，只能将文件放在代码里，这边的步骤就调整为策划提交git，通知程序员，最后程序员发布云函数。

![serverless](https://img.serverlesscloud.cn/qianyi/images/YHl6UWa9s62zicSFHQTm5RAchm5pOdynuKQlVKCML1HhvibwRDRuvwFAw254PZpY0pmDjV5dVeEKKwOlIyicQML5w.jpg)

但这种方式不太优雅，所以我们最终改成了以下方式：策划提交git，jenkins从git拿下来往cos上传，然后云函数去cos拉取。但这里有个性能问题。就是云函数拉取COS时，可能会比较慢，不能每一个请求，都去拉一次文件。

优化方法是，采用静态变量保存文件内容和上一次拉取时间，如果超过5分钟，就去重新拉取一次。这样就可以保证相对的实时性和性能，对于目前的需求来说，完全足够。

![serverless](https://img.serverlesscloud.cn/qianyi/images/YHl6UWa9s62zicSFHQTm5RAchm5pOdynuku8c5KmthgIJxnvayCHkd87hmBiartbT6uWkuepfsaXDvehggbFsRSA.jpg)

截止现在，迁移过程中的所有需求完全搞定。

### **迁移后有哪些好处？**

接下来说一下我们迁移到云函数之后带来的一些好处。

- 第一点就是不用维护API服务器了，不用再考虑CPU是不是满了，内存是否不够，请求量增加也不用想着需不需要再加台服务器，运维非常方便；
- 其实，就是监控内容比较详细，可以更好地看整体的运行效率，是不是有慢请求，访问趋势如何，有没有错误之类的；
- 另外，用消息队列拆分后，解耦彻底，可以确保消息不会丢失，消息队列触发云函数的用法对于这种不断累积形式的慢任务，非常好用；
- 还有版本管理这点，有问题，随时切回版本，不用象以前一样，再重新拉代码分支发布。

除了聊天API之外，可以分享下，我们还有哪些功能也可以使用云函数：

- 第一个，无状态的HTTP服务，比如客服消息接收、支付回调接口；
- 再就是无须返回的异步任务，比如微信小游戏上报玩家排名；
- 还有就是定时任务，比如我们会定期给玩家推送相关的活动信息

这些场景使用云函数，都是比较省事省心的。

### **一些想法和希望**

最后，来说说在云函数使用过程中的一些想法和希望。云函数本质上，是拿一部分CPU和内存出来帮用户执行一次代码，所以代码的时间复杂度和空间复杂度很重要，优化得不好，就会多花钱。

另外，如果云函数可以手动触发安全杀死旧进程就更好了。这意味着用户可以自己管理初始化的时机，可以确保在某一时刻之后，所有实例的内存都是我们想要的状态。

云函数属于被触发型的服务，这也意味着问题追踪时，源头分散在其他服务上，很难追踪全部流程，这就需要厂商提供更完善的日志监控功能，目前，腾讯云在高阶功能之上，也正在逐步完善日志监控和其他基础能力，这些之后可以拭目以待！

总的来说，对于游戏场景的很多业务功能和需求，使用云函数具有绝对的优势。