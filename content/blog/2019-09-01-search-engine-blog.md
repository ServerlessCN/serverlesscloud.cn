---
title: 如何通过 Serverless 与自然语言处理，让搜索引擎「看」到你的博客
description: Serverless 与自然语言处理结合的一个小应用
keywords: Serverless 自然语言处理
date: 2019-09-01
thumbnail: https://img.serverlesscloud.cn/2020114/1578988490344-v2-8b2cd2c5275aa2c5a3c5083a148a7a9f_1200x500.jpg
categories:
  - user-stories
authors:
  - Anycodes
authorslink:
  - https://www.zhihu.com/people/liuyu-43-97
tags:
  - 个人博客
  - serverless
---

自然语言的内容有很多，本文所介绍的自然语言处理部分是「文本摘要」和「关键词提取」。

很多朋友会有自己的博客，在博客上发文章时，这些文章发出去后，有的很容易被搜索引擎检索，有的则很难。那么有没有什么方法，让搜索引擎对博客友好一些呢？这里有一个好方法 —— 那就是填写网页的 Description 还有 Keywords。

但是每次都需要我们自己去填写，非常繁琐。这个过程能否自动化实现？本文将会通过 Python 的 jieba 和 snownlp 进行文本摘要和关键词提取的实现。

## ▎准备资源

下载以下资源：

- [Python 中文分词组件](https://github.com/fxsjy/jieba)
- [Simplified Chinese Text Processing](https://github.com/isnowfy/snownlp)

下载完成后，新建文件夹，拷贝对应的文件：

![拷贝对应文件](https://img.serverlesscloud.cn/2020114/1578989071240-v2-515f13a706f4f66f54ca3f72175be79a_hd.jpg)

拷贝之后，建立文件 index.py

```
# -*- coding: utf8 -*-
import json
import jieba.analyse
from snownlp import SnowNLP


def FromSnowNlp(text, summary_num):
    s = SnowNLP(text)
    return s.summary(summary_num)


def FromJieba(text, keywords_type, keywords_num):
    if keywords_type == "tfidf":
        return jieba.analyse.extract_tags(text, topK=keywords_num)
    elif keywords_type == "textrank":
        return jieba.analyse.textrank(text, topK=keywords_num)
    else:
        return None


def main_handler(event, context):
    text = event["text"]
    summary_num = event["summary_num"]
    keywords_num = event["keywords_num"]
    keywords_type = event["keywords_type"]

    return {"keywords": FromJieba(text, keywords_type, keywords_num),
            "summary": FromSnowNlp(text, summary_num)}
```

超简单的代码有没有！

## ▎上传文件

在云函数 SCF 控制台上新建一个项目：

![新建项目](https://img.serverlesscloud.cn/2020114/1578989070418-v2-515f13a706f4f66f54ca3f72175be79a_hd.jpg)

![新建项目2](https://img.serverlesscloud.cn/2020114/1578989071153-v2-515f13a706f4f66f54ca3f72175be79a_hd.jpg)

提交方法选择上传 zip：

然后我们压缩文件，并改名为 index.zip：

![压缩文件](https://img.serverlesscloud.cn/2020114/1578989070419-v2-515f13a706f4f66f54ca3f72175be79a_hd.jpg)

## ▎测试

测试之前可以适当调整一下我们的配置：

![配置](https://img.serverlesscloud.cn/2020114/1578989070789-v2-515f13a706f4f66f54ca3f72175be79a_hd.jpg)

然后进行 input 模板的输入：

![模板输入](https://img.serverlesscloud.cn/2020114/1578989070772-v2-515f13a706f4f66f54ca3f72175be79a_hd.jpg)

模板可以是：

```
{
  "text": "前来参观的人群络绎不绝。在“两弹历程馆”里……（略）”",
  "summary_num": 5,
  "keywords_num": 5,
  "keywords_type": "tfidf"
}
```

然后点击测试：

![测试](https://img.serverlesscloud.cn/2020114/1578989070876-v2-515f13a706f4f66f54ca3f72175be79a_hd.jpg)

## ▎应用

至此，我们完成了简单的关键词提取功能和抽取式文本摘要过程。

当然，这只是简单的抛砖引玉，因为摘要这里还有声称是文本摘要，而且抽取式摘要也可能会根据不同的文章类型，有着不同的特色方法，所以这里只是通过一个简单的 Demo 来实现一个小功能，帮助大家做一个简单的 SEO 优化。

大家以后自己做博客的时候，可以增加 keywords 或者 description 字段，然后每次从 sql 获得文章数据的时候，将这两个部分放到 meta 中，会大大提高页面被索引的概率哦～！

> **传送门：**
> - GitHub: [github.com/serverless](https://github.com/serverless/serverless/blob/master/README_CN.md) 
> - 官网：[serverless.com](https://serverless.com/)

欢迎访问：[Serverless 中文网](https://serverlesscloud.cn/)，您可以在 [最佳实践](https://serverlesscloud.cn/best-practice) 里体验更多关于 Serverless 应用的开发！
