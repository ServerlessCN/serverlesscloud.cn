---
title: 利用 Serverless，实现 COS & CDN Combo Handler
description: 小 S 维护的一个前端系统，单个页面中有数个没有依赖关系的 js 、css 需要加载，此时浏览器会分别去请求对应的文件。此时小 S 收到 Leader 给的一个任务：优化前端的静态资源请求，尽量做合并。
keywords: Serverless,COS,CDN
date: 2020-04-09
thumbnail: https://img.serverlesscloud.cn/2020522/1590170625843-%E4%BC%81%E4%B8%9A%E5%BE%AE%E4%BF%A1%E6%88%AA%E5%9B%BE_15901706165494.png
categories:
  - user-stories
authors:
  - galenye
authorslink:
  - https://cloud.tencent.com/developer/article/1610316
tags:
  - Serverless
  - 对象存储 COS
---



> 什么是Combo Handler ？相信很多前端同学并不陌生。[2008年7月YUI Team宣布在YAHOO! CDN上对YUI JavaScript组件提供Combo Handler服务](https://yuiblog.com/blog/2008/07/16/combohandler/)。简单讲，当前端有n个 js 需要分别去拉取时，通过 cdn combo 技术能用一个请求把 js 在服务端合并后拉回，同理可用于 css 文件。

## **背景：**

小S维护的一个前端系统，单个页面中有数个没有依赖关系的 js 、css 需要加载，此时浏览器会分别去请求对应的文件。此时小S收到Leader给的一个任务：优化前端的静态资源请求，尽量做合并。

## **现状：**

小S马上开始着手，看了下手头的项目，目前静态资源是经过 [腾讯云CDN ](https://cloud.tencent.com/document/product/228?from=10680)的，静态资源放在了 [腾讯云COS对象存储](https://cloud.tencent.com/document/product/436?from=10680)，js、css文件因为模块的不同，被打包成了多个。而腾讯云 CDN 目前不支持 Combo 的方式。

## **分析：**

小S开始想到了HTTP2.0，但看了CDN的请求配置已开启HTTP2.0，这一块能提升的空间已不大。那是否能做静态的离线合并处理，看似可行的一条路，但改动量不小，且确实涉及到一些历史原因，这块不好动。小S突然想起以前了解过的CDN Combo，那从请求实时合并入手，也是可行的。但可惜，目前接入的CDN没能支持。

此时天空飘来一句秦牛·道格拉斯·正威的话打在了小S身上

> 淡黄的长...不是，计算机科学领域的任何问题都可以通过增加一个间接的中间层来解决

目前静态资源的请求链路是 前端 → CDN → COS，想做实时合并的话，那可以在CDN和COS之间加入一个中间层来实现，这个中间层根据过来的请求，分别去COS上拉取文件做合并后返回给CDN，CDN则可以根据请求的路径做缓存。而适合做这个中间层的，小S首先想到了最近火的不行的 [Serverless](https://cloud.tencent.com/document/product/1154/38787?from=10680)。

小S如梦初醒，甚是感动，简单手动几下便完成了。下面来把实现过程中的关键步骤分享出来。

## **实现：**

###  **原理：**

使用Serverless framework实现一个server，用来给cdn作为源站，server中根据cdn过来的判断是否开启combo特性，这里使用url中的 ?? 双问号开启combo特性，使用 & 连接多个文件路径，如 xxx.com??<pathA>&<pathB>。如果启用，则去COS上拉取对应的文件合并后返回。如果不启用，则跟原始请求单个文件一样，如 xxx.com/<pathA> ，则server返回302 cos链接到cdn，让cdn去follow 302，与原始使用没有差别。

涉及相关产品

- [Serverless framework （通过云API网关开启外网访问）](https://cloud.tencent.com/document/product/1154/38787?from=10680)
- [CDN](https://cloud.tencent.com/document/product/228?from=10680)
- [COS](https://cloud.tencent.com/document/product/436?from=10680)

### **1、安装Serverless framework命令行工具**

```javascript
// 非npm安装可查看 https://cloud.tencent.com/document/product/1154/42990
npm install -g serverless
serverless -v
```

### **2、修改 demo 配置**

下载这个 [cdn-combo demo的代码](https://galenye-1251496585.cos.ap-guangzhou.myqcloud.com/cdn-combo.zip)，解压后得到cdn-combo文件夹，修改里面的几个配置信息，包括SecretId、SecretKey、Bucket以及Region。

其中，Bucket、Region即原本CDN回源的COS源站的桶信息，如果修改了app.js中的Region，也要同时修改serverless.yml中的region的值，这样保证了Serverless服务请求COS时走的是腾讯内网。

SecretId、SecretKey即账号的密钥信息。

（该例子是从一个存储桶中拿不同文件进行合并，如何希望从不同存储桶，乃至从非COS的源站中拿文件进行合并，均可自行参考实现）

![serverless]( https://img.serverlesscloud.cn/2020522/1590170199841-%E4%BC%81%E4%B8%9A%E5%BE%AE%E4%BF%A1%E6%88%AA%E5%9B%BE_15901701049856.png )

示例代码

### **3、Serverless部署**

在cdn-combo文件夹下执行进行serverless的部署

```javascript
sls --debug
```

部署过程中需要扫描二维码进行登录，如果希望持久化登录状态，可参考 [文档](https://cloud.tencent.com/document/product/1154/40493?from=10680#.E8.B4.A6.E5.8F.B7.E9.85.8D.E7.BD.AE.EF.BC.88.E5.8F.AF.E9.80.89.EF.BC.89)

部署完成，在命令行我们会得到如下信息，此时证明中间服务已部署起来，拿到url的host部分 **https://service-xxxxxx-1250000000.gz.apigw.tencentcs.com** 这我们需要的内容，记住它。

![serverless]( https://img.serverlesscloud.cn/2020522/1590170199844-%E4%BC%81%E4%B8%9A%E5%BE%AE%E4%BF%A1%E6%88%AA%E5%9B%BE_15901701049856.png )

部署Serverless framework

### **4、设置CDN回源Serverless Server Url**

登录CDN控制台，找到之前接入的域名，或者接入个新的域名。

以下面作为例子，cdn域名为 cdn-combo.galen-yip.com，修改源站，源站选择自有源，**`回源协议务必选择HTTP`**，源站地址以及回源 host 填写 Serverless server url，待设置成功，至此我们变完成了所有的变更工作。

![serverless]( https://img.serverlesscloud.cn/2020522/1590170199819-%E4%BC%81%E4%B8%9A%E5%BE%AE%E4%BF%A1%E6%88%AA%E5%9B%BE_15901701049856.png )

修改CDN源站配置

同时注意，这两个配置务必如下，过略参数配置需关闭，跟随回源301/302配置打开

![serverless]( https://img.serverlesscloud.cn/2020522/1590170199805-%E4%BC%81%E4%B8%9A%E5%BE%AE%E4%BF%A1%E6%88%AA%E5%9B%BE_15901701049856.png )

过略参数配置关闭

![serverless]( https://img.serverlesscloud.cn/2020522/1590170199782-%E4%BC%81%E4%B8%9A%E5%BE%AE%E4%BF%A1%E6%88%AA%E5%9B%BE_15901701049856.png )

回源跟随打开

### **5、验收成果**

访问 [http://cdn-combo.galen-yip.com/js-combo/foo.js ](http://cdn-combo.galen-yip.com/js-combo/foo.js)返回200 以及单文件内容

访问 [http://cdn-combo.galen-yip.com/??js-combo/foo.js&js-combo/bin.js](http://cdn-combo.galen-yip.com/??js-combo/foo.js&js-combo/bin.js) 返回200 以及文件合并后的内容

最后把页面 [http://cdn-combo-demo-1251496585.cos.ap-guangzhou.myqcloud.com/index.html](http://cdn-combo-demo-1251496585.cos.ap-guangzhou.myqcloud.com/index.html)

 中的静态资源引用，改变成以上 cdn combo 的引用方式

## **结语：** 

以上便完成了CDN Combo Handler 能力。特别注意，CDN源站从COS改为Serverless server，计费这边是有变更的，具体可以查询对应产品的流量计费情况。

Serverless能发挥的作用远不止此，如果有更多玩法，私我。

最后附上demo下载地址：[https://galenye-1251496585.cos.ap-guangzhou.myqcloud.com/cdn-combo.zip](https://galenye-1251496585.cos.ap-guangzhou.myqcloud.com/cdn-combo.zip)

## Serverless Framework 30 天试用计划

我们诚邀您来体验最便捷的 Serverless 开发和部署方式。在试用期内，相关联的产品及服务均提供免费资源和专业的技术支持，帮助您的业务快速、便捷地实现 Serverless！

> 详情可查阅：[Serverless Framework 试用计划](https://cloud.tencent.com/document/product/1154/38792)

## One More Thing
<div id='scf-deploy-iframe-or-md'><div><p>3 秒你能做什么？喝一口水，看一封邮件，还是 —— 部署一个完整的 Serverless 应用？</p><blockquote><p>复制链接至 PC 浏览器访问：<a href="https://serverless.cloud.tencent.com/deploy/express">https://serverless.cloud.tencent.com/deploy/express</a></p></blockquote><p>3 秒极速部署，立即体验史上最快的 Serverless HTTP 实战开发！</p></div></div>

---

> **传送门：**
> - GitHub: [github.com/serverless](https://github.com/serverless/serverless/blob/master/README_CN.md) 
> - 官网：[serverless.com](https://serverless.com/)

欢迎访问：[Serverless 中文网](https://serverlesscloud.cn/)，您可以在 [最佳实践](https://serverlesscloud.cn/best-practice) 里体验更多关于 Serverless 应用的开发！