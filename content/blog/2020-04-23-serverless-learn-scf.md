---
title: 万物皆可 Serverless 之我的 Serverless 之路
description: 本文主要介绍我和 Serverless 的结缘之路。
keywords: Serverless,Serverless实战,Serverless应用
date: 2020-04-23
thumbnail: https://img.serverlesscloud.cn/2020523/1590216111548-16205.jpg
categories:
  - user-stories
authors:
  - 乂乂又又
authorslink:
  - https://cloud.tencent.com/developer/article/1618591
tags:
  - Serverless
  - 个人博客
---

# **一、缘起**

我最早接触Serverless大概是在18年6月，那时候我在阿里云的学生机刚好到期，

那台机子上我有装宝塔面板，然后在上面只放了一个Typecho的个人博客站，

好像这台服务器似乎一直都是被我拿来当作虚拟主机用，最多也只是登上宝塔面板清一下内存这样子,

所以，在我阿里云一年的学生机到期之后，我就果断选择了放弃续费服务器。

从那时起我就变成了一个彻底的Severlesser。

首先是之前的静态网页的问题，

这个解决起来比较简单，随便找一个对象存储或者pages服务就可以搞定。

这里我是把自己那些静态网页都放到了Coding pages上，

除了某些时候某些地区某些运营商的网络访问会不稳定之外，

其他的一切都让我觉得coding的pages服务都是做的非常棒的。

然后是Typecho博客问题，

这个问题还是比较让人头大的，因为像这种动态的博客系统是很少有pages服务支持的，

所幸在那个时候coding有一个动态pages的服务是允许个人发布动态博客的，包括Wordpress和Typecho之类

只可惜现在coding已经把动态pages的服务给去掉了，

而我的之前放在coding上的动态博客现在也已经被归档了。

![serverless](https://img.serverlesscloud.cn/2020523/1590216110643-16205.jpg)

被清空的工作空间

我也错过了cloud studio升级的提醒通知，

直到旧版cloud studio完全下线我才在邮箱的垃圾邮件里找到当时的升级通知。

这下子我就再也找不到存放着我动态博客的空间入口了，里面的文件也抢救不回来了 T^T

有趣的是，在我的空间被归档后，仍然可以正常访问原来空间里的博客，只是再也找不到也进不去原来的空间了。

于是自己赶紧在网页登录我的Typecho博客后台，把博客数据备份好导出，也算是一场有惊无险的风波了。

就这样，自己没有服务器也过的好好的。

# **二、发展**

似乎一切都很平静的。

自己19年开始自学Flutter，整天忙着写widget，维护state，

时不时看看github trending，逛逛dribbble，刷刷V站之类，

期间自己也独立开发上线了一些小应用，纯粹出于自己的兴趣

![serverless](https://img.serverlesscloud.cn/2020523/1590216109835-16205.jpg)

一款简单的计算器应用

![serverless](https://img.serverlesscloud.cn/2020523/1590216111571-16205.jpg)

一个自动选课应用

![serverless](https://img.serverlesscloud.cn/2020523/1590216110588-16205.jpg)

一个记单词应用

但是这些应用都有一个特点，那就是没有自己的后端，只能向外展示页面，这就比较鸡肋了。。。

所以我也一直在寻找合适的云数据库服务，想要给自己的应用增加后端的能力，方便后期管理会员信息之类。

期间我有用过Bmob，感觉还可以，主要是接入方便，管理起来数据也比较简单，

而且bmob的服务非常好，我在他们SDK群里提问题，都会有人及时处理，比较省心。

这个阶段我是啥服务都尝试过，

域名在西部数码，新网，阿里云，腾讯云都有注册，

对象存储有用七牛云cos和腾讯云cos，

主机用过小学生卖的跑路虚拟空间，阿里云学生机，腾讯云学生机，

视频点播服务用过乐视云和七牛云，

CDN用过知道创宇的加速乐，360CDN，腾讯云CDN，

移动用户数据信息统计有用百度移动信息统计，Growing IO，友盟...

总之我用的服务都很杂，缺少一个东西把他们都整合起来，后面我会讲到这个东西其实就是腾讯云开发。

可能你觉得我扯了半天都还没扯到serverless，不要着急哈，马上就到今天的主角Serverless了

# **三、Sverless全新的世界**

上面我扯了那么一大堆是想告诉大家，

在没有Serverless之前，自己开发上线一款应用

其实大多数的精力都是用在这些第三方服务的选择和适配上的，

搞来搞去基本上都是在瞎折腾，应用开发效率非常差的。

这样的话，作为对比，在这一节里，我就结合自己的开发经历跟大家讲下

**Serverless到底是啥，怎么用，用起来究竟有多爽**

首先我是在bmob翻看官网首页的时候

看到他们有一个叫云函数的服务，

乍一听云函数这个词我也是有些摸不着头脑的，

云函数是什么？云上跑的函数？

我本地函数跑的好好的，干嘛要放到云上跑？

但是出于好奇我还是点进去看了下云函数到底是个啥东东，

原来云函数真的就是放在云上的函数而已，

它可以在本地通过http请求来调用，

但看起来还是蛮不错的，

刚想上手实操一波，发现这个云函数服务是付费的，

额，这个就，

好吧，穷就一个字，我只说一次，

当然是果断关闭页面，忘掉它了，嘿嘿~

就这样我与云函数的第一次见面就以不战而退告终了~

直到后来我一个同学告诉我

腾讯云有一个云函数的服务可以用来解决前端跨域的问题，

而且每月都有很多的免费额度！

**哈哈，顷刻，大喜，遂上手之。**

![serverless](https://img.serverlesscloud.cn/2020523/1590216110304-16205.jpg)

在[《万物皆可Serverless之免费搭建自己的不限速大容量云盘（5TB）》](https://cloud.tencent.com/developer/article/1612098?from=10680)里，

我用腾讯云函数搭建了一个20TB的OneDrive网盘

![serverless](https://img.serverlesscloud.cn/2020523/1590216112586-16205.jpg)

在[《万物皆可Serverless之使用云函数Timer触发器实现每天自动定时打卡》](https://cloud.tencent.com/developer/article/1612169?from=10680)里，

我写了个每日健康信息自动定时打卡的云函数

![serverless](https://img.serverlesscloud.cn/2020523/1590216504470-%E4%BC%81%E4%B8%9A%E5%BE%AE%E4%BF%A1%E6%88%AA%E5%9B%BE_15902165027885.png)

在[《万物皆可Serverless之使用SCF+COS快速开发全栈应用》](https://cloud.tencent.com/developer/article/1612750?from=10680)里，

我用云函数做了个影视搜索的全栈应用

前后用时3天，

第一天写云函数后端接口，

第二天从零入门学习了一下前端，

第三天开始整合前后端并上线发布应用

![serverless](https://img.serverlesscloud.cn/2020523/1590216110728-16205.jpg)

在[《万物皆可Serverless之使用SCF+COS免费运营微信公众号》](https://cloud.tencent.com/developer/article/1612816?from=10680)里，

我用云函数给自己的公众号后台做了个消息自动回复系统

![serverless](https://img.serverlesscloud.cn/2020523/1590216112207-16205.jpg)

在[《万物皆可Serverless之使用SCF快速部署验证码识别接口》](https://cloud.tencent.com/developer/article/1615839?from=10680)里，

我用云函数把本地的验证码识别程序快速上线发布成api，方便调用

整个识别函数从本地到发布到线上可用，也就用时10分钟以内吧

![serverless](https://img.serverlesscloud.cn/2020523/1590216111398-16205.jpg)

在[《万物皆可Serverless之Kaggle+SCF端到端验证码识别从训练到部署》](https://cloud.tencent.com/developer/article/1618583?from=10680)里，

我继续尝试使用Kaggle+SCF从训练到部署发布一个通用验证码识别模型

真正的验证码识别从训练到部署一条龙服务~

![serverless](https://img.serverlesscloud.cn/2020523/1590216111111-16205.jpg)

在[《万物皆可Serverless之借助微信公众号简单管理用户激活码》](https://cloud.tencent.com/developer/article/1618586?from=10680)里，

我尝试使用云函数和对象存储在自己的微信公众号后台管理会员激活码，

在前面SCF+COS实践的基础上，稍微修改并重新上线发布了一下云函数，用时10分钟以内

![serverless](https://img.serverlesscloud.cn/2020523/1590216111337-16205.jpg)

在[《万物皆可Serverless之使用SCF+COS给未来写封信》](https://cloud.tencent.com/developer/article/1618588?from=10680)里，

我使用云函数和对象存储制作了一个类似给未来写封信应用的全栈网页应用

在前面SCF+COS系列实践的基础上，我稍微修改并重新上线发布了一下云函数，

整个应用从制作到上线发布可用，用时不超过30分钟

![serverless](https://img.serverlesscloud.cn/2020523/1590216111138-16205.jpg)

在[《万物皆可Serverless之在Flutter中快速接入腾讯云开发》](https://cloud.tencent.com/developer/article/1618589?from=10680)里，

我尝试在Flutter中接入腾讯云开发加速应用上云，为自己的Flutter应用实现了完整的后端能力

![serverless](https://img.serverlesscloud.cn/2020523/1590216111923-16205.jpg)

在[《万物皆可Serverless之在Flutter中写一个Dart原生腾讯云对象存储插件》](https://cloud.tencent.com/developer/article/1618590?from=10680)里，

我尝试给Flutter写了一个对象存储的dart原生插件，

整个插件可以直接跑在dart VM里，本地调试十分方便

。。。。。。

总之，正如本系列文章标题所言，万物皆可Serverless

过去那些需要自己购买配置服务器才能用的运行的应用，在Serverless云函数里也可以实现。

那么，亲爱的你，为什么还要自己去购买，配置，维护服务器呢？

更多关于serverless的实践，你可以关注serverless中文社区里的[最佳实践 ](https://serverlesscloud.cn/best-practice)，也欢迎大家积极为serverless社区做出自己的贡献

# **四、关于Serverless的一切**

## **What's Serverless?**

乍一听Serverless还是比较懵逼的，

说实话之前我也不清楚最近那么火的serverless技术究竟是啥。

其实简单来说serverless就是单纯的不需要服务器的服务，

比如域名解析、对象存储、CDN这些，不需要你自己购买服务器就可以获得的服务，

当然这里不需要服务器是指你自己不用掏钱去买配置运维服务器，

但是整个服务的运行还是得靠你的serverless服务提供商通过跑在服务器上应用来解决的

看起来有点绕哈，那我再来打个比方吧，

我们把服务器比作房子，你要在服务器上跑的应用比作你在这间房子里要做的买卖，

传统的自行搭建服务器运行服务的模式：

假如你要开一家店做买卖，你就得先租一间房子，然后自己装修房子，费好大劲装修完房子才能开始做买卖，

而且这个房子你从装修开始就得一直按月给房租，即使你在这个房子里什么都不做也要给钱。

Serverless运行服务的模式：

那么Serverless就是，我这里的房子已经装修好了，你直接过来做买卖就可以，

而且你也不用按月交钱，我只在你做买卖的时候才计费，你做一个小时买卖那我就收你一个小时的服务费，

你做一个小时买卖，休息十小时，那我还是只收你一个小时的服务费，怎么样是不是很良心。

这么看其实用电话卡套餐月租和按量付费这种关系来做比喻会更合适一点。

可以看到，Serverless对比传统服务器应用模式最大的优点就是方便、省钱和免运维。

## **Why Serverless？**

**多快好省，但用难回。**

![serverless](https://img.serverlesscloud.cn/2020523/1590216110582-16205.jpg)

用户评价

正如Serverless开发人员所言，

Serverless架构是必然，

Serverless开发应用超级快，超级简单，

Serverless直接面向业务开发，每个前端工程师都可以是全栈的，

Serverless可以更多快好省的开发应用

。。。。。。

[serverless.com](http://serverless.com/) 的CEO--Austen Collins也曾经说过

> Serverless is the future of the cloud. Serverless is like superpowers for developers.
> —— Austen Collins (serverless.com CEO)

**Serverless是云服务的未来！Serverless赋予开发者超能力！**

以前我没亲自体验过Serverless不会相信这句话，

觉得是在吹牛或者不知道他在说些什么，

但是现在我只觉得十分的震撼，

感觉Serverless像是为开发者打开了一扇全新世界的大门，

**Serverless重新赋予了开发者跨越前后端，跨越语言的超级能力。**

**（没错，这句是我说的，不对你过来打我啊~）**

这是未来应用开发的大势所趋，下一代的应用将是Serverless的。

借助Serverless，后端开发者可以快速开发上线发布自己的应用，

借助Serverless，前端开发者可以直接获得后端的全部能力，快速开发全栈应用！

所以我向所有开发者推荐Serverless，

无论你是前端或是后端开发者，你都可以通过Serverless获取到更加强大、更加便捷的能力。

**相信我，你会爱死Serverless的，它会彻底颠覆你的多端应用开发体验。**

## **How Serverless？**

**看到这里的话，相信你已经被Serverless深深吸引了，**

**所以现在抽出一点点时间快速上手体验一下Serverless？**

![serverless](https://img.serverlesscloud.cn/2020523/1590216111591-16205.jpg)

serverless.com

我推荐大家可以先去看一下 serverless.com 中国区官网 [https://serverless.com/cn/](https://serverless.com/cn/)

在这里你可以详细了解关于Serverless的一切，也可以体验一些关于Serverless的最佳实践。

而且就在前不久腾讯 Serverless Framework 正式发布。

这是由腾讯云提供的专为中国开发人员定制的 Serverless Framework 版本，

为 Serverless 应用程序开发提供了顶级的顺畅体验。

试用地址：[https://github.com/serverless/components/blob/master/README.cn.md](https://github.com/serverless/components/blob/master/README.cn.md)

#### **产品官网：**[**https://cloud.tencent.com/product/sls**](https://cloud.tencent.com/product/sls?from=10680)

#### **快速入门：**[**https://cloud.tencent.com/document/product/1154/41775**](https://cloud.tencent.com/document/product/1154/41775?from=10680)

![serverless](https://ask.qcloudimg.com/http-save/yehe-1361327/s4nqs4m342.png?imageView2/2/w/1620)

腾讯云函数

推荐腾讯云函数 SCF，[https://cloud.tencent.com/product/scf](https://cloud.tencent.com/product/scf?from=10680)

现已支持支持Nodejs、php、python、java、golang运行环境！

![serverless](https://img.serverlesscloud.cn/2020523/1590216111114-16205.jpg)

免费额度

每月可免费获得100万次云函数调用+40万GBs资源使用量，超级良心有没有！

![serverless](https://ask.qcloudimg.com/http-save/yehe-1361327/tvurc7zvrh.png?imageView2/2/w/1620)

腾讯云开发

推荐腾讯云开发 CloudBase，[https://cloud.tencent.com/product/tcb](https://cloud.tencent.com/product/tcb?from=10680)

云开发是云端一体化的后端云服务 ，集成了用户登录鉴权、对象存储、云函数和云数据库等能力，

目前提供了H5、小程序、Flutter 等SDK，可以快速构建完整的小程序/小游戏、H5、Web、移动 App 等全端应用！

可免费获得5GB对象存储，2GB数据库，1GB静态网页托管，

对象存储每月有150万次下载+60万次上传+5GB CDN回源流量的免费额度，

CDN每月有5GB流量的免费额度，

云函数每月有4万次调用+1GB外网流量的免费额度，

数据库每天有5万次读+3万次写的免费额度，

静态托管每月有5GB流量的免费额度，

超级心动有没有？

## **Serverless面向未来的运维方式**

![serverless](https://img.serverlesscloud.cn/2020523/1590216111758-16205.jpg)

Serverless面向未来的运维方式

> 网络应用正在慢慢改变世界，但是大多数互联网企业仍然无法顺畅交付工程，更不用说敏捷开发和快速迭代了。**所以我们必须从根本上简化应用工程的交付和操作。**
> 这就是**无服务器架构**所提供的serverless建立在下一代公共云服务之上，该服务仅在使用时自动扩容和收费。当规模， 所用容量和成本管理实现自动化时，可节省99%的成本管理。
> 无服务器架构是全新的，因此我们需要改变先前对老架构和工作流的看法。serverless 的目标是以一种简单，强大 而优雅的使用体验为开发者，团队提供开发和运行serverless应用程序所需的所有工具。

serverless 加油鸭！

## Serverless Framework 30 天试用计划

我们诚邀您来体验最便捷的 Serverless 开发和部署方式。在试用期内，相关联的产品及服务均提供免费资源和专业的技术支持，帮助您的业务快速、便捷地实现 Serverless！

> 详情可查阅：[Serverless Framework 试用计划](https://cloud.tencent.com/document/product/1154/38792)

---
<div id='scf-deploy-iframe-or-md'></div>

---

> **传送门：**
> - GitHub: [github.com/serverless](https://github.com/serverless/serverless/blob/master/README_CN.md)
> - 官网：[serverless.com](https://serverless.com/)

欢迎访问：[Serverless 中文网](https://serverlesscloud.cn/)，您可以在 [最佳实践](https://serverlesscloud.cn/best-practice) 里体验更多关于 Serverless 应用的开发！
