---
title: 🤸‍♂️👩‍💻 使用腾讯云 Serverless 生成你的 GIT 代码年历！
description: 不要 Github profile 页的统计图！是好程序员就应该自己 Host！
date: 2020-10-26
thumbnail: https://img.serverlesscloud.cn/20201125/1606302161462-QQ20201125-190101.jpg
categories:
  - user-stories
authors:
  - 兰浩
authorslink:
  - https://github.com/LanHao0
tags:
  - Serverless
  - GitHub
---

最近在将平时各项的日常生活数据统计起来，并 host 到自己的站点上。平时走路有步数统计，消费有月度账单，咱们程序员是不是也应该有个属于自己的统计数据呢？

> 作者简介：[兰浩](https://github.com/LanHao0)，目前在一家创业公司做前端开发。平时喜欢探索有意思的站点、app 和设计，从各个地方从 everywhere 学习。

## 前言

每天看代码、写代码、修 Bug，突发奇想做了这么一款小工具「**代码年历**」来统计自己一年提交了多少次代码。~~___（然后就可以跟朋友炫耀了啊哈哈哈哈哈哈哈哈）___~~（是的！不要 Github profile 页的统计图！是好程序员就应该自己 Host！） 

正好最近接触到了腾讯的 Serverless, 就用它了！ 

### 项目组成：

Serverless + [Tencent-express](https://github.com/serverless-components/tencent-express/tree/master/example) + ECharts 以及对接微信公众号（支持直接在公众号查询）

### 效果图：

![代码年历效果图](https://img.serverlesscloud.cn/20201125/1606302304263-%E4%B8%8B%E8%BC%89%20%283%29.png)

### 公众号查询效果图：

![](https://img.serverlesscloud.cn/20201125/1606302303193-%E4%B8%8B%E8%BC%89%20%283%29.png)

## 正题！搭建步骤

### 1. 克隆项目

clone 本项目到本地
 
```
git clone https://github.com/LanHao0/serverless-GITChartOfYear
```

### 2. 微信部分（不需要公众号查询可跳过此步）

1. 在公众号后台 左侧菜单-开发-基本配置 中设置好

- 服务器地址(URL)

填写 serverless 的链接 +/w
例如： 

```
https://您的 Serverless 应用链接/w
```

- 令牌(Token)

- 消息加解密密钥(EncodingAESKey)

2. 更改 sls.js 代码中 27 行开始的 config 中的参数
3. 更改 sls.js 代码中微信回复消息为您的 Serverless 应用链接
 
### 3.部署

运行以下命令

```
serverless deploy
```

### 开始使用

### 网页

直接访问 serverless 应用链接即可, 您可以在网页上输入 id 与年份获取到自己的代码年历图

### 微信

发送任意字符到公众号可获取帮助信息，输入 GITHUB，您的 GITHUB ID，四位数年份来查询年份内您在 github 或 gitlab 上提交代码次数，例如：

```
GITHUB,LanHao0,2020
```

就可以查询 GITHUB 用户 LanHao0 在 2020 年提交代码次数，GITLAB 同理。

## 在线体验！

当然要来个能体验的地址了，对不对！  

网页端：https://service-a4gbsyqw-1251935409.gz.apigw.tencentcs.com

---

欢迎访问：[Serverless 中文网](https://serverlesscloud.cn/)，您可以在 [最佳实践](https://serverlesscloud.cn/best-practice) 里体验更多关于 Serverless 应用的开发！