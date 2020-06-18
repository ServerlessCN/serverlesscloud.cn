---
title: 万物皆可 Serverless 之免费搭建不限速 5T 大云盘
description: 不晓得你有没有体验过百度云限速的痛苦，反正我对网盘限速这件事一直深恶痛绝，我行我上，走起！
keywords: Serverless,Serverless实践,Serverless应用
date: 2020-04-23
thumbnail: https://serverlessimg-1253970226.cos.ap-chengdu.myqcloud.com/qianyi/images/162020.jpg
categories:
  - user-stories
authors:
  - 乂乂又又
authorslink:
  - https://cloud.tencent.com/developer/article/1612098
tags:
  - Serverless
  - 网盘
---


![serverless](https://serverlessimg-1253970226.cos.ap-chengdu.myqcloud.com/qianyi/images/162020.jpg)

大家应该都体验过网盘限速的痛苦，当我们在网络上好不容易找到资源准备下载时，却发现下载速度最快不过 200、300KB/S，这不禁让我回想起初中那会儿，家里使用电话线拨号上网时的网速，一个 4GB 的系统镜像要下整整一天。

有人可能会说，你可以充钱开会员啊。

呵，你以为我是差开年费会员的钱吗？开玩笑，我可是~~连月费会员（连续包月最便宜那种）都舍不得开~~的人。

没错，穷就一个字，我只说一次，有钱人的快乐咱想象不到。

那么有什么办法可以曲线救国呢？废话少说，上图片！

## 效果展示

- 搭建好的云盘主页

![搭建好的云盘主页](https://img.serverlesscloud.cn/2020523/1590199188185-2404.jpg)

- 测试一下文件上传速度

![测试一下文件上传速度](https://img.serverlesscloud.cn/2020523/1590199187185-2404.jpg)

- 测试一下文件下载速度

![测试一下文件下载速度](https://img.serverlesscloud.cn/2020523/1590199186433-2404.jpg)

可以看到，整个网盘的上传和下载速度还是可以接受的（我这里是联通的 100M 宽带），会比一般网盘下载限速快许多。除此之外，基于解析出来的是 onedrive 直链，我们可以很轻松地实现文件在线预览的功能，见下图：

- 音频文件可直接在线播放

![音频文件可直接在线播放](https://img.serverlesscloud.cn/2020523/1590199186631-2404.jpg)

- 甚至可以在线预览 office 三件套

![甚至可以在线预览 office 三件套](https://img.serverlesscloud.cn/2020523/1590199186538-2404.jpg)

可以看到我们使用 Serverless+OneDrive 搭建好的云盘功能还是蛮 👌 的，

更详细的体验可以访问我已经搭建好的网盘，地址：[http://onedrive.idoo.top/](http://onedrive.idoo.top/my5t1/)

你是不是已经跃跃欲试了呢？马上开始教程，Let's go~~~

## 实战教程

### 1. 获取 OneDrive

首先， 注册一个 OneDrive 账号。

具体可以参考网上的这篇教程《[免费注册微软 Office365 教育版 OneDrive 网盘 5T 空间](https://lykqq.com/%E6%95%99%E7%A8%8B/10.html)》

### 2. 下载 OneManager

[OneManager-php](https://codeload.github.com/qkqpttgf/OneManager-php/zip/master) 是一个 Onedrive 的列表索引和管理程序，可以部署到 heroku/SCF/normal 空间。

值得注意的是此程序的文件上传下载是走的 OneDrive 服务器，并不会消耗你的云函数流量。

![OneManager-php](https://img.serverlesscloud.cn/2020523/1590199186283-2404.jpg)

下载完之后解压：

![](https://img.serverlesscloud.cn/2020523/1590199186959-2404.jpg)

### 3. 新建云函数

打开[云函数控制台](https://console.cloud.tencent.com/scf/list?rid=4&ns=default)

- 云函数控制台

![云函数控制台]( https://img.serverlesscloud.cn/2020523/1590199189221-2404.jpg )

这里，我们把函数地区选到中国香港，然后点击新建

![新建函数](https://img.serverlesscloud.cn/2020523/1590199186484-2404.jpg)


运行环境选择 php7.2，创建方式选择空白函数，依次点击下一步，完成。

![上传函数](https://img.serverlesscloud.cn/2020523/1590199186015-2404.jpg)

函数创建完成后，打开函数代码，选择本地上传文件夹，将我们之前解压好的 OneManager-php 程序上传，选择保存。

![上传完毕后的云函数](https://img.serverlesscloud.cn/2020523/1590199186340-2404.jpg)

OK，这次函数就正常了

### 4. 配置云函数

云函数创建完成之后，我们还需要配置一下云函数的各种参数

![函数配置](https://img.serverlesscloud.cn/2020523/1590199186583-2404.jpg)

这里我们把内存改到 64MB，超时时间改到 5 秒（随意设置）

最主要的是添加一个 Region=ap-hongkong 的环境变量，然后点击保存。

![serverless](https://img.serverlesscloud.cn/2020523/1590199186120-2404.jpg)

添加函数 api 网关触发器，一定记得勾选启用集成响应，然后保存。

![api 网关访问地址](https://img.serverlesscloud.cn/2020523/1590199185902-2404.jpg)

api 网关添加成功后会得到一个访问地址，我们复制一下在浏览器里打开

### 5. 配置 OneManager

![首次访问](https://img.serverlesscloud.cn/2020523/1590199187550-2404.jpg)

首次访问 OneManager 主页需要安装初始化程序，我们按照提示点击开始安装程序。

![设置腾讯云访问密匙 ID 和 key](https://img.serverlesscloud.cn/2020523/1590199187167-2404.jpg)

SecretId 和 SecretKey 可以在[控制台密匙管理页面](https://console.cloud.tencent.com/cam/capi)找到，然后点击确定，设置好管理登录密码就可以正常访问 OneManager 首页了。

### 6. 绑定 OneDrive

What？为啥我都初始化了程序为啥还是一片空白？

不要着急，这是因为我们还没有绑定自己的 OneDrive 网盘。

首先，点击首页左上角登录，输入自己前面设置的管理员密码后登录，再点击左上角设置选项打开设置页面。

![选择添加 OneDrive 盘](https://img.serverlesscloud.cn/2020523/1590199185898-2404.jpg)

选择添加 OneDrive 盘，按照网页提示登录自己的 OneDrive 授权即可，这里就不再细说了。

### 7. 绑定已备案域名

当然，我们是可以自定义 api 网关的域名的，不过这里的域名前提是已备案的。

假设你已经有已备案的域名，并成功配置好了云函数和 api 网关，下面就再来看下给 api 网关自定义域名的步骤

![api 网关设置](https://img.serverlesscloud.cn/2020523/1590199187843-2404.jpg)

首先打开腾讯云 api 网关后台页面，选择刚刚云函数已经创建的 api 网关，打开自定义域名选项。

![新建域名绑定](https://img.serverlesscloud.cn/2020523/1590199188463-2404.jpg)

然后点击新建，把要绑定的备案域名 cnmae 解析到提示的地址，选择默认的路径映射提交即可

![发布修改后的 api 网关](https://img.serverlesscloud.cn/2020523/1590199185882-2404.jpg)

最后记得修改完自定义域名之后发布更新 api 网关服务，这样自定义域名才会生效。

![自定义域名生效](https://img.serverlesscloud.cn/2020523/1590199188581-2404.jpg)

没有什么意外的话，现在你就可以像我一样通过自己绑定的备案域名访问云盘了。

## 写在最后

本文标题有说免费搭建大容量云盘，免费是指腾讯云函数每月会有一定的免费使用额度，拿来搭建 OneDrive 云盘自用，免费额度绰绰有余。

另外，OneManager 是支持绑定多个 OneDrive 盘的，这里说大容量是因为我一共绑定了 4 个 OneDrive 盘，刚好别名风、雨、雷、电，哈哈(~~是个狠人~~)

![绑定四个盘](https://img.serverlesscloud.cn/2020523/1590199186631-2404.jpg)

每个盘都有 5TB 的容量，合起来就是一共有 20TB 的容量，嘿嘿。

存点啥不行呢，视频音乐文档统统都可以在线预览，简直不要太爽~ 祝各位玩得愉快！



---
<div id='scf-deploy-iframe-or-md'></div>

---

> **传送门：**
> - GitHub: [github.com/serverless](https://github.com/serverless/serverless/blob/master/README_CN.md)
> - 官网：[serverless.com](https://serverless.com/)

欢迎访问：[Serverless 中文网](https://serverlesscloud.cn/)，您可以在 [最佳实践](https://serverlesscloud.cn/best-practice) 里体验更多关于 Serverless 应用的开发！

