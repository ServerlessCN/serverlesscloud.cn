---
title: 如何用 Serverless 为 Python 云函数打包依赖
description: "在使用无服务器云函数SCF时通常会遇到导入第三方库的问题，很多小伙伴比较头疼是：应该如何打包进去？这里，推荐几个不错的方法。"
keywords: Serverless,Serverless应用,无服务器云函数
date: 2019-06-20
thumbnail: https://img.serverlesscloud.cn/2020414/1586871710979-%E5%85%AC%E5%85%B1%E7%94%A8.png
categories:
  - user-stories
authors:
  - Anycodes
authorslink:
  - https://zhuanlan.zhihu.com/ServerlessGo
tags:
  - 云函数
  - Serverless
---

在使用无服务器云函数SCF时通常会遇到导入第三方库的问题，很多小伙伴比较头疼是：应该如何打包进去？这里，推荐几个不错的方法。

**方法1: 官方方案**

官方方案地址：
https://cloud.tencent.com/document/product/583/9702


在这个方案中，基本上有以下几个步骤：

1. 获得依赖列表
2. 安装依赖到目录
3. 生成zip
4. 测试

以安装Pillow为例： 安装pipreqs，可以使用pip install pipreqs，这个是一个可以获取本文项目中依赖的工具

​

![](https://img.serverlesscloud.cn/qianyi/YHl6UWa9s62nHLuIphTNOZLOY3N97DdJKgrCjKoyrBRKVxic0snnwvksAicm6B9Nicc6YjmUoXNRhHjYqDIibsrQLg.jpg)

建立文件夹，并且建立测试文件：

![](https://img.serverlesscloud.cn/qianyi/YHl6UWa9s62nHLuIphTNOZLOY3N97DdJz7am2sQNeDicWU5fvB9GO4aJ1CVppgAKf4Uvuv9AAShPMHfLxDNAAtA.jpg)

文件内容：

```javascript
import PIL
```

获得需要依赖，生成文件：

![](https://img.serverlesscloud.cn/qianyi/YHl6UWa9s62nHLuIphTNOZLOY3N97DdJl3icwo5XCVwaxFDrHtL13yDw5WB6uDMt4icdzMAicQZHYF9axWbABR7mA.jpg)

文件内容：

![](https://img.serverlesscloud.cn/qianyi/YHl6UWa9s62nHLuIphTNOZLOY3N97DdJ8vXDZWajL7icY2Rd8yHjg0hOhNOAw0KhgLhnz4jEuTrSkYE2YRb9gDA/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

安装requirements：

```javascript
sudo pip3 install -r requirements.txt -t /home/dfounderliu/code/pillowtest
```

![](https://img.serverlesscloud.cn/qianyi/YHl6UWa9s62nHLuIphTNOZLOY3N97DdJIwgl0KznaBcEdjHT3tqkWEoMyN7xZCF0U64fcNicZdibCnAZyMTOKRsg.jpg)

查看结果与本地测试：

![](https://img.serverlesscloud.cn/qianyi/YHl6UWa9s62nHLuIphTNOZLOY3N97DdJuuFn6MDIRkx2kVzXBs87nWjCo0EibbIOWtEUoAsgMg8uXPXiayYIsjZw.jpg)

压缩文档：

![](https://img.serverlesscloud.cn/qianyi/YHl6UWa9s62nHLuIphTNOZLOY3N97DdJeicw4KOQ3O9NWQyJ7icEddI4a6r8vEXumGl7fTeda9yPrjIXqk9dUvYA.jpg)

云函数中测试：

![](https://img.serverlesscloud.cn/qianyi/YHl6UWa9s62nHLuIphTNOZLOY3N97DdJ5njm2M3ve3YdwsBntADiaUiasmgVrYjPJOK65f7Q5iaicrR2BPuK4UaHFg.jpg)

提示错误：

![](https://img.serverlesscloud.cn/qianyi/YHl6UWa9s62nHLuIphTNOZLOY3N97DdJS8WojhAuljBc3BGfHyCBVI0vaQxKtzMvBIMAY69sOqSCWFBBPyMj8Q.jpg)

按照云函数要求写main\_handler：

![](https://img.serverlesscloud.cn/qianyi/YHl6UWa9s62nHLuIphTNOZLOY3N97DdJPJt2JYTyesO1Qj1rS1dniaf8B5XQZzOQ5zLf4MpOWG9DAy7rJuxlW2A.jpg)

![](https://img.serverlesscloud.cn/qianyi/YHl6UWa9s62nHLuIphTNOZLOY3N97DdJ4RdnqyLZDXbuFTaQjaAPUJTQzW9mSRUSj7pu4ibgqicJl5ibKhPHWA1icw.jpg)

至此，通过官方提供的方法安装完成！


**方法2: Pycharm快速安装**

首先，新建项目pillowtest，这里要选择virtualenv

![](https://img.serverlesscloud.cn/qianyi/YHl6UWa9s62nHLuIphTNOZLOY3N97DdJTQslmY8GicDXkdMtDuCZicozH9VSYaic7UwT1hpt9pMBdaZhCZIibrw1nw.jpg)

然后，建立文件index.py：

![](https://img.serverlesscloud.cn/qianyi/YHl6UWa9s62nHLuIphTNOZLOY3N97DdJiaGdYnL2OiabjvLNOeGd9kD7TMfedEpE7XKz0o28zOSsFLKpibO7fI6AA.jpg)

安装Pillow：

![](https://img.serverlesscloud.cn/qianyi/YHl6UWa9s62nHLuIphTNOZLOY3N97DdJx0OyowoxMh7U9aE3BzlyUAuWAbeQ1EaXZFibIuUYUbu6obW8NJYD1jA.jpg)

![](https://img.serverlesscloud.cn/qianyi/YHl6UWa9s62nHLuIphTNOZLOY3N97DdJU9dc89dXxgDN4mCOnHSKib66nO0D7jFrrYR6iaW2GeVanjWiaNt4znyuQ.jpg)

安装完成之后，可以看到：

![](https://img.serverlesscloud.cn/qianyi/YHl6UWa9s62nHLuIphTNOZLOY3N97DdJqEWYcXib0syJ3xC4awkRuLUuQrqIqrCfUEutJXxTts3jiaiahVysqEKiaQ.jpg)

此时我们将安装过来的文档移动到pillowtest的目录下，然后将非venv目录进行压缩：

![](https://img.serverlesscloud.cn/qianyi/YHl6UWa9s62nHLuIphTNOZLOY3N97DdJiaWFUCsSg1YF31pxhFkZYnyk2JoKcDfLqSMk4s9OrpNYvwicx5nOnHOw.jpg)

![](https://img.serverlesscloud.cn/qianyi/YHl6UWa9s62nHLuIphTNOZLOY3N97DdJdDdGrN5L6FEgFrM7ryQydic7t2Fpq4liayR73HHhN6WGbib6DneCVMu6Q.jpg)

此时，我们将结果上传到云函数，并适当修改index.py：

![](https://img.serverlesscloud.cn/qianyi/YHl6UWa9s62nHLuIphTNOZLOY3N97DdJy0OJQfw83b9Iib92oWnNc4RX7kkGlKDJib1XyDEibfjg0FnsTYuASAy3g.jpg)

![](https://img.serverlesscloud.cn/qianyi/YHl6UWa9s62nHLuIphTNOZLOY3N97DdJZH4SppB9U7yhtAfLk2KiccJzRCGkxCxfsMZIlsEC6micmc49B0Gu4aHA.jpg)

​

**方法3: 自行复制法**

​

这种方法是指，我们用了某个包，可以自己下载源码并且将其复制到目录下，具体方法可以参考上一篇实战：


## 《[Serverless实践系列（一）：如何通过SCF与自然语言处理为网站赋能](https://mp.weixin.qq.com/s?__biz=Mzg4NzEyMzI1NQ==&mid=2247483846&idx=1&sn=52b42168950810ba52abbe9f12f9216d&scene=21#wechat_redirect)》

感兴趣的同学可以通过 SCF 进行部署实践~


> **传送门：**
> - GitHub: [github.com/serverless](https://github.com/serverless/serverless/blob/master/README_CN.md) 
> - 官网：[serverless.com](https://serverless.com/)

欢迎访问：[Serverless 中文网](https://serverlesscloud.cn/)，您可以在 [最佳实践](https://serverlesscloud.cn/best-practice) 里体验更多关于 Serverless 应用的开发！
