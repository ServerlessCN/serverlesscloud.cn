---
title: Serverless —— 前端 3.0 时代
description: 《信息简史》中说“进化本身是生物体与环境之间持续不断的信息交换的具体表现”，前端技术的进化也是如此。浩瀚的前端宇宙中，又出现过哪些耀眼的星辰呢？指引前端未来的“北极星”又在何方？腾讯云高级工程师与你畅谈前端的变革史与新时代的希冀。
keywords: Serverless, Serverless前端开发, Serverless云函数
date: 2019-09-30
thumbnail: https://img.serverlesscloud.cn/qianyi/images/l7x0FXB2eW7ibWsCibiaAIeGFC7dLbCTXG7yYebTv238UXXPJCCravianRBePr9qeGGAEB0HRsBVLh5Nvggtq7P08A.jpg
categories: 
  - news
authors: 
  - 周俊鹏
authorslink: 
  - https://github.com/jiangliu5267
tags:
  - 云开发
  - 云函数
---

**导语**

> 《信息简史》中说“进化本身是生物体与环境之间持续不断的信息交换的具体表现”，前端技术的进化也是如此。浩瀚的前端宇宙中，又出现过哪些耀眼的星辰呢？指引前端未来的“北极星”又在何方？腾讯云高级工程师与你畅谈前端的变革史与新时代的希冀。


在正文之前我想简单介绍一下自己的从业背景。

初次接触前端是读书期间的第一份实习工作，在SAP上海研究院TIP BI部门开发基于SVG的Charts库，99%的代码逻辑是将数据用SVG转化为可视化的UI。值得一提的是当时用的构建工具是YUI Compressor搭配Ant调度。

毕业后成为了一名传统的web前端开发者，期间还折腾过富本文编辑器。后来有近一年的时间研究效率工程，也就是大众口中的前端工程化。然后在加入腾讯之前的工作是地图，技术核心是WebGL。

可以说除了音视频以外，5年多的经历基本涵盖了前端领域绝大部分的技术方向。不论是大众的web还是小众的SVG，不论是宏观到web整体的工程化还是微观到像素的图形学。表面看上去似乎每一份新工作跟之前的工作都关联甚微，比如在使用WebGL期间积累的矩阵、向量、三角剖分等数学和图形学知识基本上在现阶段工作中得不到体现。但其实从毕业到加入腾讯之前始终处于一种迷惘的状态中，一直试图在不同的工作类型中寻找真正能够体现前端工程师核心价值的方向，以及辅助这个方向的关键技术。

我想现在我找到了，以全栈为进化方向的前端，以及辅助其落地的Serverless。

如果要探讨一项技术或者一种理念是否具有革命性，必然需要一些参照物，历史是最佳的参考。所以在讨论Serverless对前端的革新之前，有必要先“飞快”地回忆一下前端的变革史。

**前端变革史**

**前端0.0：WWW**

![Serverless](https://img.serverlesscloud.cn/qianyi/images/l7x0FXB2eW7ibWsCibiaAIeGFC7dLbCTXG7yYebTv238UXXPJCCravianRBePr9qeGGAEB0HRsBVLh5Nvggtq7P08A.jpg)

如果以世界上第一个web浏览器WorldWideWeb的诞生作为起点，那么90年代初便是前端的0.0时代。彼时没有前端工程师的称谓，前端的工作也很简单，主要是静态UI和表单验证，要么后端工程师兼顾为之，要么由独立的UI Developer全权负责。

其实时至今日很多外企仍然沿袭着UI Developer岗位，与目前大众认知的前端工程师不同的是，UI Developer的能力栈除了HTML/JS/CSS以外，还要具备一定的UI和交互设计能力。

**前端1.0：AJAX**

起源于Microsoft Outlook的AJAX是引起前端第一次革命的关键技术，这是一个重要的转折点，以此为契机网站具备了动态性，前端工程师的能力模型逐渐从UI偏向逻辑和数据。

**前端2.0：Node.js**

然后是广为人知的Node.js成就了前端2.0。

Node.js破除了前后端编程语言的壁垒，令前端开发者能够以相对较小的成本跨界服务端，但是编程语言仅仅是服务端开发最表层也是最易突破的，背后更困难的部分是单纯靠Node.js无法解决的，细节稍后再表。除了服务端以外，Node.js对前端最大的贡献是提供了工程化的土壤。

在此各位不妨思考一个问题：一个构建工具最基本最底层的能力是什么？答案是文件IO。

在Node.js之前，HTML/JS/CSS的构建只有两个途径。第一是借助其他编程语言的工具，比如YUI Compressor；第二是用IE浏览器。这不是笑话，IE浏览器能够在早期占据霸主地位可不完全是因为windows系统的背书，它自身的功能性也非常强大。众所周知早期的IE浏览器是windows系统的一个组件，以它为入口可以调用一些系统级的底层功能，文件IO便在此列，实现的方式是借助ActiveX控件的FileSystemObject对象。细节就不讲了，感兴趣的同学可以自行参阅相关资料。

**前端2.5：React**

有一些声音认为React能够配得上“革命性”一词，因为它一定程度上改变了前端的编程模型，React之前的前端是围绕DOM，React之后是面向数据。诚然如此，但跟AJAX和Node.js相比，React引起的变革仍显轻微。而React对前端组件化生态的影响也是在原有基础上的增强也并不能称为革命性。所以称React为前端3.0缺乏足够的说服力，不过前端2.5还是充分的。说到底，React只是改变了前端领域自身，而AJAX和Node.js无一不是对前后端都有显著影响的技术。

**Serverless-从前端到全栈**

在讨论哪项技术或理念会成就前端3.0之前，必须要确认前端下一步的发展方向。

目前有两种声音：一是前后端包揽的“大前端”，也就是全栈，关键性技术是Node.js；二是以React-Native和Flutter为突破点的“泛前端”，即全端。

以目前的时间节点来看，React-Native也好，Flutter也罢，都还未能够称得上成熟，泛前端之路任重道远。相对来说，前端下一步发展为全栈的可能性更高一些。基于这个前提，Serverless便是成就此道的革命性技术理念。

“全栈”这个词其实一直存在歧义，狭义上的全栈来源于前端技术圈，指的是一个人包揽前端和web服务端；而广义上的全栈应该是在前后端以外还包括数据库并且能够精通围绕三者展开的架构和技术细节，这是几乎不可能的任务，如果真的有人能够达到这种境界，估计就是接近艾伦·图灵一般的计算机之神了吧。在狭义与广义之间，Serverless面向的是广义的全栈。Serverless的理念是将服务器管理、数据库优化等“粗活”交给云平台，从而前端开发者能够将交互逻辑、业务逻辑、数据全部掌控在自己手中，这才是真正意义上的全栈。

为了能够更清晰地理解Serverless，有一种架构模式可以作为对比，即BFF（Backends for Frontend，为前端服务的后端）。

**BFF-从平台无关性到平台差异化**

BFF简单来说就是在原有的一体化服务端基础上，针对不同的业务平台分别开发一层独有的、很薄的服务，见下图。

![Serverless](https://img.serverlesscloud.cn/qianyi/images/l7x0FXB2eW7ibWsCibiaAIeGFC7dLbCTXG7ibibaBVLuic0JG1j4r7h11qGw6KiaMmS8Gl9x8x470dlPvoCticiadiasDfrg.jpg)

BFF承担了一部分的业务逻辑，这部分逻辑通常是平台独有的。举一个现实中的例子：在线视频提供商有多种平台，比如网站、app。由于版权限制有些影片只能在特定的平台播放。具化到技术层面，实现此类逻辑包含分平台鉴权、数据查询策略等等，这些便是典型的平台差异化业务逻辑。独立于核心业务逻辑之外的BFF层能够实现差异化逻辑的松耦合，进而令迭代和维护更高效和安全。

**BFF未解决的问题**

目前业内对BFF普遍实践模式是将BFF分发到负责各平台技术开发的团队，比如App团队负责Mobile BFF、前端团队负责PC web和H5 BFF等等。那么对于前端工程师来说，这种模式是否意味着前端兼顾BFF层？理想的场景是这样的，但现实工作中并非如此。

![Serverless](https://img.serverlesscloud.cn/qianyi/images/l7x0FXB2eW7ibWsCibiaAIeGFC7dLbCTXG7iaz6m3OExEkggfYY3AdxFmYBwr0ViaYUicoicWcyFeZk2FPDI6leQJcic8Q.jpg)

BFF本质上仍然是服务层，除了编程语言之外，一名合格的服务端开发者还需要具备一些独有的领域知识以及服务管理、数据管理理念。所以目前大多数BFF仍然由传统前端之外的专人负责，即便是Node.js BFF。

也就是说，BFF并未解决前端成为全栈的关键性问题，而这些问题便是Serverless的针对点。


**腾讯云 云开发对Serverless的落地实践**

目前业内对于Serverless的普遍认知是FaaS（Function as a service，函数即服务）和BaaS（Backend as a service，后端即服务）的综合体。以此为前提，腾讯云的相关团队将Serverless的具体实现为下图所示的模型。

![Serverless](https://img.serverlesscloud.cn/qianyi/images/l7x0FXB2eW7ibWsCibiaAIeGFC7dLbCTXG7j3Uham8hdKyx5KibSnMibnBlLn0JTY6myH15l7GpAxXLQxbA3H4dfa1A.jpg)

以此为支撑，落地到具体应用场景中的云开发模式如下图：

![Serverless](https://img.serverlesscloud.cn/qianyi/images/l7x0FXB2eW7ibWsCibiaAIeGFC7dLbCTXG7w6kSC8YkqoEbPDrROrdFY8iaBnQTEl3a3D7ht4bApommCHamGDvYzvQ.jpg)

各平台应用的前端集成对应的SDK，涵盖云函数、云数据库和云存储的功能调用API。前端的请求直接送达云平台的接入层，目前是以Node.js作为接入层技术栈；然后经过必要的处理（比如用户鉴权）转至云函数、云数据库以及云存储平台。

以云开发体系提供的功能和服务为基础支撑，前端开发者的关注点除了UI和交互逻辑以外，能够以很小的成本介入以云函数为承载的业务逻辑层和以云数据库、云存储为支撑的数据存储层。简而言之，前端的关注点为：交互逻辑+业务逻辑（云函数）+数据（云数据库/云存储）。

![Serverless](https://img.serverlesscloud.cn/qianyi/images/l7x0FXB2eW7ibWsCibiaAIeGFC7dLbCTXG7Y1BIX1LUIEqnI9dhiahLc811Xy5cWkNVxWgUqUUfvbjwfK1rXSxlFXA.jpg)

从上文的描述中可能有部分同学意识到一个问题：**云存储跟CDN有什么区别？**

云存储提供文件托管服务，本质上与CDN相同。其优势体现在开发者无需申请域名、无需管理服务器，文件被自动托管，并且可以通过鉴权机制保证文件的私密性和安全性。其实针对CDN的话题可以延伸到Serverless，大多数前端开发者在工作中都无需关系CDN服务器的状态，只需要部署文件即可（甚至这一步也可以由CI系统完成），那么CDN对于前端开发者来说就可以被认为是Serverless的。

完整的Serverless体系不仅仅包括CDN，还可以把数据库和服务端也实现Serverless。在这套体系支撑下的工程模型中，一个完整的迭代周期仅仅需要两种职能角色：前端和测试。前端负责所有与业务相关的工作，包括交互层、业务层和数据层；测试负责质量保证；而部署、发布、服务器管理、线上监控等等繁琐的工作则交由云开发平台去完成。

![Serverless](https://img.serverlesscloud.cn/qianyi/images/l7x0FXB2eW7ibWsCibiaAIeGFC7dLbCTXG7bopBCOvuAkI06gibFvgiaDeeibmpOhm8j1A5ttLMVAcS1thBudTOF39tQ.jpg)

**开发生态**

![Serverless](https://img.serverlesscloud.cn/qianyi/images/l7x0FXB2eW7ibWsCibiaAIeGFC7dLbCTXG7sfdDDfV6QvQLy3IH7vH4PUREt3r5n2IEibulzrsOaPnteJ9F1DCpZ0g.jpg)

在以上云开发模式基础上，具体到现实上手开发，开发者们需要了解三种角色：**端**、**云**和**控制台**。

- 端的表现形式是对应各平台的SDK，是与前端开发者关系最紧密的一个角色；

- 云指的是支撑Serverless体系的后台系统，这部分对于开发者来说是无感知的，与其对接的工作由端SDK承担。细化到子角色可以分为接入层和基础服务，接入层负责代理转发和用户鉴权等工作；基础服务提供基本的能力支撑，包括云函数、云数据库和云存储；

- 控制台的功能分为两大类：一是管理功能，比如云函数的部署、数据和文件的管理等等；二是运营，控制台提供产品线上监控以及数据的统计和可视化，以辅助运营。

**场景多样化支撑**

任何一种新技术或者架构落地到具体的业务场景中都难免会遇到由于业务特殊性造成的迁移困难问题，所以在基础的开发生态之外，云开发为支撑多样化的业务场景建立了必要的策略以及对应的工具。

![Serverless](https://img.serverlesscloud.cn/qianyi/images/l7x0FXB2eW7ibWsCibiaAIeGFC7dLbCTXG7Zl7EPvPaBf4h2dLbFgYxM9Kfe1X41gHrYZ4m8MjCHPmOSibhUJqWZ6Q.png)

比如对于数据私密性存在高要求的产品，可以通过控制台选择严格的CURD权限管理策略；并且可以使用wx-service-sdk在云函数中进行私密数据的CURD以保障安全性；再比如对实时性要求较高的场景，比如在线客服、多人游戏等，云数据库的实时推送功能可以保障此类功能的高效表现。

**总结**

Serverless以云计算相关技术为支撑，搭配容器技术和微服务架构，将基础实施的管理从开发者日常工作中解耦。虽然目前无论是理论解读还是实践模式都尚未形成绝对统一，但可以预见前端开发者将成为Serverless的最大受益群体之一，我们有充足的理由相信它将引发前端的第三次变革。

文章转载至公众号：腾讯云云开发