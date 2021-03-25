---
title: 深度好文：云函数 SCF + KonaJDK11 + Spring + 提速降存一把梭
description: KonaJDK11 如此优秀，我们能不能把它引入到 Serverless 呢？
date: 2021-03-24
thumbnail: https://main.qcloudimg.com/raw/fbb92fa50e4adc7f22e7e0babc61232e.png
categories:
  - best-practice
authors:
  - 臧琳
tags:
  - Serverless
  - KonaJDK
---

## 一、背景

腾讯 KonaJDK 团队最近对外开源了KonaJDK11, 该版本 JDK 是经过内部超大规模生产环境验证的定制 JDK，该版本在启动性能、峰值性能以及事物处理能力方面，相对于前一版本 Kona JDK8 都有了综合性提升，沉淀了腾讯云与大数据团队在大数据/机器学习、云原生场景下的深度优化，并且通过了 JCK 验证，确保充分的 Java SE 标准兼容。通过工业标准 Benchmark 表明，Kona JDK11 对比 Kona JDK8 大多数场景在峰值性能上具有非常明显的提升，个别性能提升接近 50%。

KonaJDK11 如此优秀，我们能不能把它引入到Serverless呢？ 另外，最近笔者也在考虑怎么样让 Java spring 框架在 SCF 中顺滑的跑起来，所以借着这个机会，索性来一把 KonaJDK + Spring 在 SCF 上的实践总结。

多说无用，Show you my code!

## 二、SCF使用JDK11

腾讯云Serverless云函数SCF产品中内置Java8支持，但是并没有高版本JDK的环境支持，那么如何实现SCF的Java11云函数呢？ 

实际上，SCF云函数提供的CustomRuntime功能已经解锁了用户使用编程语言的限制，目前已经有webassembly，swift，rust等成功例子。我们可以同样借助这个功能来将KonaJDK11引入SCF，从而实现高版本Java的支持。

过程如下：

1. 下载KonaJDK11，https://github.com/Tencent/TencentKona-11/releases 
2. 由于KonaJDK11的二进制包比较大，需要使用SCF层的概念来上传KonaJDK11程序包

首先需要创建层，由于KonaJDK11程序包超过50MB，所以可以选择COS方式，现将KonaJDK11安装包上传到腾讯云COS，之后在创建层时指定路径即可， 具体使用可以参考产品说明https://cloud.tencent.com/document/product/583/45760 

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1a393e9081c44f1cbad42bbe7e350c39~tplv-k3u1fbpfcp-zoom-1.image)

3. 创建云函数， 注意这里需要使用CustomRuntime，我们选择Shell函数示例，再次基础上拓展我们的KonaJDK11的支持.

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4c835a6c428a4a008a75ee0ec0232e7b~tplv-k3u1fbpfcp-zoom-1.image)

进入【高级配置】->【层配置】->【添加层】

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4fb4743049694b12901d9fccb3785790~tplv-k3u1fbpfcp-zoom-1.image)

按照下图所示配置好【层】【超时时间】与【内存】点击【完成】

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d4af2963bb624326a303820927b7ade7~tplv-k3u1fbpfcp-zoom-1.image)

4. 根据SCF CustomRuntime的[使用说明](https://cloud.tencent.com/document/product/583/47274)，需要编写CustomRuntime的启动文件 Bootstrap，SCF CustomRuntime会在函数启动时第一步找到并执行这个名为bootstrap的可执行文件。

5. 我们的bootstrap中需要配置环境变量，并启动Java程序. 我们先假设我写了一个名为Hello的class，里面只打印hello SCF 字符串。 之后将bootstrap文件和Hello.class文件一起打包成一个zip文件，上传到SCF部署，这时bootstrap的内容如下：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/44ea8a4ae27243779d79c7994cf6e2de~tplv-k3u1fbpfcp-zoom-1.image)

可以看到就是简单的环境变量配置和执行java -version 与 Hello程序。

之后点击【测试】触发执行，之后我们可以看到函数执行日志如下：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/76847b3e0fc94b0296a59928d437974b~tplv-k3u1fbpfcp-zoom-1.image)

我们已经可以从日志里看到 openjdk version "11.0.9.1-ga"的 Java版本，并且看到了Hello程序正常输出。至此，KonaJDK 11 已经顺利跑在了云函数环境中。

注意此处显示【测试失败】是正常的，因为我们还没有编写处理【函数事件】的逻辑，也就是还没有实现具体的云函数。

## 三、实现spring云函数

现在让我们来用spring框架实现一个能跑在KonaJDK11上的云函数。为了清晰，我们写一个最简单的springboot Demo, 它的controller长这样：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/28dbb153d52a4394982878e571a2b6af~tplv-k3u1fbpfcp-zoom-1.image)

入口函数长这样：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bbd23d9c334d41ffb22bdd9318966a54~tplv-k3u1fbpfcp-zoom-1.image)

OK,目前这个Demo可以接受 `http Get localhost:8080/hello` 请求并返回 `hello, this is a springboot demo!` 字符串。 那么如何将它改编成云函数呢？ 

从 SCF CustomRuntime 文档以及一些公开的资料，可以看到编写CustomRuntime的函数，只需要两个关键步骤：

1. 编写可执行启动程序bootstrap，在bootstrap里面启动我们的spring云函数
2. 编写云函数。这一步首先需要了解CustomRuntime工作的流程，从[这篇](https://cloud.tencent.com/developer/article/1690709)文章可以看到，主要流程如下：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b0ce3625e05a46ed9e23ce59ef78f518~tplv-k3u1fbpfcp-zoom-1.image)

具体说来，就是在bootstrap启动云函数以后，sping云函数在自身初始化时需要先POST一个Ready的httpRequest给 SCF服务端， 目的是通知SCF函数初始化完毕，可以获得下发的事件了。

之后，spring需要一个循环，循环内部通过向SCF服务端发送HTTP GET请求，获得待处理事件，再调用内部逻辑，处理完事件之后通过POST请求发送给SCF服务端，循环等待下一次事件下发。

针对Springboot， 我们的云函数主要有以下几个需要处理的地方：

1. 事件下发： Springboot云函数主要是启动并监听云函数内部的一个自定义http端口，通过http请求完成处理任务。 SCF云函数目前http请求主要通过API Gateway事件下发，也就是说，spring云函数的逻辑里面，需要将API Gateway事件转换成http事件之后再发给函数内部的springboot监听的端口。好在整个这一套逻辑的转换SCF其实已经提供给了我们，就在SCF java event的代码中，可以从 https://github.com/tencentyun/SCF-java-libs/blob/master/SCF-java-events/src/main/java/com/qcloud/SCF/runtime/AbstractSpringHandler.java 这个代码直接抽取复用。

2. 初始化： 也就是在第一次启动云函数的时候，我们需要启动springboot，另其建立httpserver并监听端口。 之后每次事件下发，只需要发送httprequest即可。

3. 监听事件： 这里就是按照 SCF CustomRutime 的要求，写一个循环，使用http GET请求获取event，并发送给内部springboot监听的端口。

经过上面的梳理，逻辑已经基本上清晰了：首先，需要在 cold launch阶段启动springboot入口函数， 通知SCF服务端，springboot云函数初始化完毕，等待接收消息。之后就是一个大循环，循环里面工作如下：

- 通过 `Http GET` 请求从SCF服务端获得 ApiGateway 下发的event

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/22775122c15c402dae03e9a55647b259~tplv-k3u1fbpfcp-zoom-1.image)

- Api GW event转换成 http request 并发送到 springboot 监听的端口，等待返回处理结果
- springboot 返回的 event 转换为 ApiGateway Response， 通过POST请求返回给SCF 服务端
- 进入下一次循环，等待下一次事件下发.

处理流程代码也很简单：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8a3e98843b234d1a88930ebd435153d3~tplv-k3u1fbpfcp-zoom-1.image)

至此，我们已经完成了云函数的编写，之后我们可以测试一下，将bootstrap和编译后的 `springboot-application.jar` 打包到一个zip文件，然后上传到SCF云函数进行部署。

之后按照如下配置 apiGW 的 event，注意这里配置 Get，“/hello” 是由于我们的springboot 云函数的controller配置成了接收Get， “/hello” 请求并打印和返回字符串，实际上用户需要根据自己的业务，修改apiGW这里event相应的内容。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e8d2275a12004cb5b52e147b79013c94~tplv-k3u1fbpfcp-zoom-1.image)

然后点击[测试]: 稍等一下就可以看到如下log：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/908ae59d6ce9417db6480f3f9de181ee~tplv-k3u1fbpfcp-zoom-1.image)

springboot已经启动， 然后我们还可以看到：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/62a459d8a54842b3b6ad84892a71efd6~tplv-k3u1fbpfcp-zoom-1.image)

函数已经正常响应了GET /hello的请求。

## 四、利用appCDS特性提速降存

在上面的springboot云函数中，我们可以看到一次冷启动耗时和内存如下：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/44ac1d7355bc4bfabe34bf4b06dca0f6~tplv-k3u1fbpfcp-zoom-1.image)

同时log中也包含了springboot的启动时间

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/026157cfb4474b238b669fbfcbc133ef~tplv-k3u1fbpfcp-zoom-1.image)

总体来说就是耗时6秒多，使用了168MB的内存。

那么，如何提高启动速度减少内存使用呢？

JDK11里面自带appCDS功能，具openJDK官方说法，该功能可以减少java类加载时间同时减少内存占用量，提高启动速度。 这不正是我们想要的么，我们现在已经有了KonaJDK+springboot的云函数，那么怎么在KonaJDK中使用起来这个功能呢？

1. appCDS功能使用步骤：

按照JDK官方文档， appCDS使用方式主要是以下几个步骤：

- 生成待 `dump` 的类文件列表， 使用 `-Xshare:off -XX:+UseAppCDS -XX:DumpLoadedClassList=classes.lst` JVM选项运行程序，会生成classes.lst文件
- 使用 `-Xshare:dump -XX:+UseAppCDS -XX:SharedClassListFile=classes.lst \ -XX:SharedArchiveFile=dump.jsa` 生成dump.jsa文件
- 使用appCDS正常启动java程序，使用JVM选项 `-Xshare:on -XX:+UseAppCDS -XX:SharedArchiveFile=dump.jsa`

2. 云函数中enable appCDS

针对云函数SCF的场景，主要需要以下适配工作

- 由于在云函数中，目前只有/tmp目录是可写目录，所以1中的步骤我们需要将所有涉及到的文件路径变更为 `/tmp/classes.list` 和 `/tmp/dump.jsa`
- 由于我们期望最终生成的dump.jsa可以在多个云函数实例中使用，我们需要得到/tmp/dump.jsa文件，然后将其和云函数一起打包，这样在使用时候，我们只需要指定Jvm参数 `-XX:SharedArchiveFile=dump.jsa` 即可复用 `dump.jsa` 文件。 所以我们需要获得生成的 `/tmp/dump.jsa` 文件，由于SCF不能直接下载 `/tmp`目录的文件，所以我们根据COS的文档写了一小段程序，帮助我们在生成 `/tmp/dump.jsa` 文件后上传到指定的COS中，具体可以参考[COS java 的sdk ](https://cloud.tencent.com/document/product/436/6273)
- 在得到 `dump.jsa`之后，我们就可以对整个云函数重新打包，最终打包的文件中包含3个子文件， 云函数 CustomRuntime的启动脚本bootstrap, springboot云函数的实现 `SCF-springboot-web-1.0-SNAPSHOT.jar` ,以及appCDS的archive文件 dump.jsa，我们将这3个文件打包重新部署。
- 再部署之后，我们需要添加 `JAVA_TOOL_OPTIONS` 环境变量 `JAVA_TOOL_OPTIONS=-Xshare:on -XX:SharedArchiveFile=dump.jsa`

这样就可以在启动云函数时使用这些 jvm 选项了。

3. 效果

在使用AppCDS之后出发云函数的冷启动，可以看到如下效果：

- 内存使用 从原来的**169MB降低到了100MB**

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7d8b6f7b99794f7b8a7b99191c3deb1f~tplv-k3u1fbpfcp-zoom-1.image)

- springboot启动时间从原来的**6.137s提高到了4.772s**

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/aa8783a3658d4047beac48d279684e88~tplv-k3u1fbpfcp-zoom-1.image)

## 总结

至此，我们在腾讯 Serverless 云函数上借助 CustomRuntime 完成了KonaJDK11 + SpringBoot云函数的使用，并利用KonaJDK11中AppCDS特性优化了云函数冷启动的速度与内存损耗。 文中利用CustomeRuntime引入KonaJDK11的方法可以作为腾讯云Faas上解锁多语言或高版本Java语言runtime的一种通用方式。

在未来腾讯KonaJDK团队会进一步针对腾讯云业务Faas场景的特点提供更多的功能与性能提升，敬请关注。