---
title: 再见，本地环境！腾讯云全球首发：Serverless 在线远程调试
description: 本文将以一段内存泄漏的代码为例，给大家展示如何使用在线调试功能定位和解决问题
date: 2021-01-06
thumbnail: https://main.qcloudimg.com/raw/007bbdc60ded777b71353a480bb6cb66.jpg
categories:
  - best-practice
authors:
  - 松鹅
tags:
  - Serverless
  - 在线调试
---

在线调试是云函数为了解决用户在本地搭建调试环境复杂，云上环境不便于定位等问题推出的功能。

云上的各种服务，在本地无法完全模拟，程序员大都遇到过本地和远程环境运行结果不一致的情形，追查起来费时费力，不仅效率低下，也造成非常郁闷的工作体验。

所以，能否直接在远程环境中完成全部的开发流程，是提升开发体验的最直接手段，然而在其他问题都解决后，远程调试功能是最后的一公里。

本篇文章将以一段内存泄漏的代码为例，给大家展示如何使用云函数在线调试功能定位和解决问题。Node10 及以上版本的 runtime，使用 Chrome 浏览器打开云函数控制台，在函数代码页即可看到在线调试的入口。

## 开启调试模式

使用Chrome浏览器打开函数代码编辑页，可以看到在【远程调试】页。为保障调试的体验，开启调试模式将修改函数的部分配置，包括函数进入单实例模式、函数超时时间修改为900秒等。开启前请务必确认这些调整。

![](https://main.qcloudimg.com/raw/a0f3bc3fcb92b6f2ce15e5fb4ce6f6d3.png)

待加载完成后，页面将自动展示入口文件。

## 找不到需要的文件？

使用快捷键 Cmd + P（Mac）或 Ctrl + P（Windows）可以打开所需要的文件。但大家可能会发现，刚开启调试模式时，打开文件的列表中找不到所需要的文件。
这是因为对于动态脚本语言来说，调试器不会加载所有的内容，只会加载执行过的文件。我们先点击测试，让函数运行一次。在运行一次后，我们就可以打开所需要的文件了。

![](https://main.qcloudimg.com/raw/92dc6684760ab1494d92fc3ecd15a3d8.png)



## 设置断点

在代码前点击即可设置断点，在右上角的工具中可以进行继续执行、跨步执行、单步执行等操作，也可以灵活地启动或禁用断点。

![](https://main.qcloudimg.com/raw/9011a1f90d376cdb09490c9292fd31ba.png)

## 内存泄漏排查 - 内存快照

这部分介绍如何使用内存快照功能排查内存泄漏的问题。内存泄漏的排查方法大致为：找准内存泄漏的时机，在泄漏的前后对内存进行快照，通过对比快照的内容判断内存泄漏的问题点。

首先，我们将调试的窗口切换到 Memory 页面，点击左上方的实心圆形按钮捕捉内存快照。

![](https://main.qcloudimg.com/raw/a0e7d82647a863614d53c8fa38720059.png)

这样，我们就有了运行前的内存快照。现在我们执行存在内存泄漏的代码。这行代码有一个从未清理的全局缓存，随着调用的增加，越来越占内存。

![](https://main.qcloudimg.com/raw/44cc6ed0029efe5b4e1b793cec8b7e8e.png)

随后，我们进行第二次内存快照，打开对比页面，通过对Delta值的分析，可以发现 concatenated string 这个部分增加了很多，很有可能有问题。


![](https://main.qcloudimg.com/raw/45e324ad9269a17f5082adc9812e2420.png)

打开以后，便可以发现内存中多存储了很多“recording time”的数据。

![](https://main.qcloudimg.com/raw/d24d71be88c697bc85096bf476a35b18.png)

这些重复性的数据也就意味着代码中出现了内存泄漏，在代码中找到相关内容，进行调整，解决内存泄漏的问题。

除了云函数的控制台，也可以使用 **Serverless Framework Dev 模式**开启在线调试的功能。

---

---
<div id='scf-deploy-iframe-or-md'></div>

---

欢迎访问：[Serverless 中文网](https://serverlesscloud.cn/)，您可以在 [最佳实践](https://serverlesscloud.cn/best-practice) 里体验更多关于 Serverless 应用的开发！