---
title: 云函数 SCF 实时备份存储桶 A 中文件到存储桶 B
description: 云函数实时备份存储桶 A 中文件到存储桶 B 踩过的坑和经验。
keywords: Serverless,Serverlessc存储,Serverless应用
date: 2020-04-15
thumbnail: https://img.serverlesscloud.cn/2020523/1590206088309-16201.jpg
categories:
  - user-stories
authors:
  - 我是技术小白
authorslink:
  - https://cloud.tencent.com/developer/article/1614501
tags:
  - Serverless
  - 云函数
---

【注意】发现程序 bug ，假如从 A 存储桶备份至 B 存储桶，只能对上传到 A 中根目录的文件进行实时备份，对上传到 A 中一级及以上目录的文件，备份失败并报错。

**【实时状态更新】已经提交工单反馈问题，等待解决。**

【**无法解决】腾讯云说：这个问题得你自己解决。**

**使用的服务相关说明如下：**

![serverless](https://img.serverlesscloud.cn/2020523/1590206088305-16201.jpg)

**暂时还不支持二级目录的场景。**

**【功能】存储桶 A 的根目录下新增文件实时备份至另一个存储桶 B，不可以备份根目录下的文件夹。**



**1、存储桶A → B 实时备份**

**2、A 删除文件 abc.txt   B 中依旧存在文件abc.txt**

**3、A 中文件 abc.txt 内容由 123 更改为 123456，B中文件 abc.txt 内容也由 123 更改为 123456。**

**函数计算功能简介如下**

> 云函数（Serverless Cloud Function，SCF）是腾讯云为企业和开发者们提供的无服务器执行环境，帮助您在无需购买和管理服务器的情况下运行代码。您只需使用平台支持的语言编写核心代码并设置代码运行的条件，即可在腾讯云基础设施上弹性、安全地运行代码。SCF 是实时文件处理和数据处理等场景下理想的计算平台。 [云函数-腾讯云](https://cloud.tencent.com/document/product/583?from=10680)

最好的地方就是腾讯云提供了一些模板函数，在其中就有一个 COS 文件备份特别适合我。

![serverless](https://img.serverlesscloud.cn/2020523/1590206088666-16201.jpg)

**二、进行基本的配置**

在示例代码中填入存储桶 B 的一些信息再进行一些配置就可以使用了。

这是函数的基本配置

![serverless](https://img.serverlesscloud.cn/2020523/1590206088324-16201.jpg)

这里是触发器的相关设置，直接选择全部类型，这样的话，在存储桶 A 发生变化的时候就会实时同步给存储桶 B，在存储桶 A 中数据被删除时也不会删除存储桶B的文件。

![serverless](https://img.serverlesscloud.cn/2020523/1590206088302-16201.jpg)

**三、测试一下**

向存储桶 A 上传一个文件，很快就备份到了存储桶 B 。

![serverless](https://img.serverlesscloud.cn/2020523/1590206088309-16201.jpg)

文件大小300KB，用了 126 ms，还是很快的。

```javascript
Duration:126ms Memory:64MB MemUsage:64.000000MB
```

用一个 280 MB 大的文件来测试下

```javascript
Result:{"errorCode":-1,"errorMessage":"Task timed out after 10 seconds"}
```

执行超时了，自动终止了，那增加一下超时时间到 60 秒，再试试看。

```javascript
Duration:227ms Memory:64MB MemUsage:17.335938MB
```

嗯，执行成功了，很棒

**四、费用**

每个月有一定的免费额度，足够用了，也没有外网出流量，可以说是免费服务。

但是存储桶存储文件要花钱，北京地区存储价格 0.118 元/ GB /月。

![serverless](https://img.serverlesscloud.cn/2020523/1590206088628-16201.jpg)

云函数相关内容就介绍到这里。



---
<div id='scf-deploy-iframe-or-md'></div>

---

> **传送门：**
> - GitHub: [github.com/serverless](https://github.com/serverless/serverless/blob/master/README_CN.md)
> - 官网：[serverless.com](https://serverless.com/)

欢迎访问：[Serverless 中文网](https://serverlesscloud.cn/)，您可以在 [最佳实践](https://serverlesscloud.cn/best-practice) 里体验更多关于 Serverless 应用的开发！
