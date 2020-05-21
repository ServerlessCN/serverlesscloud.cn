---
title: "如何使用 Serverless 实现一个图书查询 App"
description: "基于 Serverless 的轻量级图书检索系统"
keywords: Serverless 轻量级图书检索,Serverless 图书查询,Serverless 检索系统
date: 2020-01-08
thumbnail: "https://img.serverlesscloud.cn/2020218/1582040387776-timg.jpeg"
categories:
  - user-stories
authors:
  - Anycodes
authorslink:
  - https://www.zhihu.com/people/liuyu-43-97
tags:
  - serverless
  - 应用实战  
---

我有一个朋友（这朋友不是我），朋友的单位里有一个小型图书室，图书室中存放了不少书。

尽管每本书都在相应的区域里进行了编号，但是毕竟没有图书馆的管理系统，大家找起来还是要花点时间的。为了让大家更容易地找到这些书，朋友联系我，打算让我帮他做一个简单的图书查询系统（<del>完整的图书馆管理系统</del>）。

Easier said than done，考虑到这还是有一定复杂度的项目，我打算使用腾讯云云函数 SCF，把整个应用部署到 Serverless 架构上。

## ▎整体效果

左边是图书检索系统的首页；右边是检索演示，比方说我们搜索「精神」，App 就会依据返回相关的书籍。看起来还不赖。

![图书查询 app](https://img.serverlesscloud.cn/2020218/1582038622515-%E5%9B%BE%E4%B9%A6.jpg)

## ▎功能设计

1. 将包含书籍信息的 Excel 表存放至腾讯云对象存储 COS 中；
2. 使用腾讯云云函数读取并解析表格；
3. 根据词语相似性检索对应的图书；
4. 通过 MUI 制作前端页面，页面也存放在 COS 中。

## ▎具体实现

1. Excel 样式（包含书名和编号）

![Excel 样式](https://img.serverlesscloud.cn/2020218/1582040581779-v2-dae1a86ecb2357fa30e8c13de21ee9a6_hd.jpg)

分类 tab：

![分类 tab](https://img.serverlesscloud.cn/2020218/1582040581528-v2-dae1a86ecb2357fa30e8c13de21ee9a6_hd.jpg)

2. 核心代码实现：

```text
import jieba
import openpyxl
from gensim import corpora, models, similarities
from collections import defaultdict
import urllib.request

with open("/tmp/book.xlsx", "wb") as f:
    f.write(
        urllib.request.urlopen("https://********").read()
    )


top_str = "abcdefghijklmn"
book_dict = {}
book_list = []
wb = openpyxl.load_workbook('/tmp/book.xlsx')
sheets = wb.sheetnames
for eve_sheet in sheets:
    print(eve_sheet)
    sheet = wb.get_sheet_by_name(eve_sheet)
    this_book_name_index = None
    this_book_number_index = None
    for eve_header in top_str:
        if sheet[eve_header][0].value == "书名":
            this_book_name_index = eve_header
        if sheet[eve_header][0].value == "编号":
            this_book_number_index = eve_header
    print(this_book_name_index, this_book_number_index)
    if this_book_name_index and this_book_number_index:
        this_book_list_len = len(sheet[this_book_name_index])
        for i in range(1, this_book_list_len):
            add_key = "%s_%s_%s" % (
                sheet[this_book_name_index][i].value, eve_sheet, sheet[this_book_number_index][i].value)
            add_value = {
                "category": eve_sheet,
                "name": sheet[this_book_name_index][i].value,
                "number": sheet[this_book_number_index][i].value
            }
            book_dict[add_key] = add_value
            book_list.append(add_key)


def getBookList(book, book_list):
    documents = []
    for eve_sentence in book_list:
        tempData = " ".join(jieba.cut(eve_sentence))
        documents.append(tempData)
    texts = [[word for word in document.split()] for document in documents]
    frequency = defaultdict(int)
    for text in texts:
        for word in text:
            frequency[word] += 1
    dictionary = corpora.Dictionary(texts)
    new_xs = dictionary.doc2bow(jieba.cut(book))
    corpus = [dictionary.doc2bow(text) for text in texts]
    tfidf = models.TfidfModel(corpus)
    featurenum = len(dictionary.token2id.keys())
    sim = similarities.SparseMatrixSimilarity(
        tfidf[corpus],
        num_features=featurenum
    )[tfidf[new_xs]]
    book_result_list = [(sim[i], book_list[i]) for i in range(0, len(book_list))]
    book_result_list.sort(key=lambda x: x[0], reverse=True)
    result = []
    for eve in book_result_list:
        if eve[0] >= 0.25:
            result.append(eve)
    return result


def main_handler(event, context):
    try:
        print(event)
        name = event["body"]
        print(name)
        base_html = '''<div class='mui-card'><div class='mui-card-header'>{{book_name}}</div><div class='mui-card-content'><div class='mui-card-content-inner'>分类：{{book_category}}<br>编号：{{book_number}}</div></div></div>'''
        result_str = ""
        for eve_book in getBookList(name, book_list):
            book_infor = book_dict[eve_book[1]]
            result_str = result_str + base_html.replace("{{book_name}}", book_infor['name']) \
                .replace("{{book_category}}", book_infor['category']) \
                .replace("{{book_number}}", book_infor['number'] if book_infor['number'] else "")
        if result_str:
            return result_str
    except Exception as e:
        print(e)
    return '''<div class='mui-card' style='margin-top: 25px'><div class='mui-card-content'><div class='mui-card-content-inner'>未找到图书信息，请您重新搜索。</div></div></div>'''
```

3. APIGW 配置：

![APIGW](https://img.serverlesscloud.cn/2020218/1582040581495-v2-dae1a86ecb2357fa30e8c13de21ee9a6_hd.jpg)

4. 首页代码：

```text
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>图书检索系统</title>
    <meta name="viewport" content="width=device-width, initial-scale=1,maximum-scale=1,user-scalable=no">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black">

    <link rel="stylesheet" href="https://others-1256773370.cos.ap-chengdu.myqcloud.com/booksearch/css/mui.min.css">
    <style>
        html,
        body {
            background-color: #efeff4;
        }
    </style>
    <script>
        function getResult() {
            var UTFTranslate = {
                Change: function (pValue) {
                    return pValue.replace(/[^\u0000-\u00FF]/g, function ($0) {
                        return escape($0).replace(/(%u)(\w{4})/gi, "&#x$2;")
                    });
                },
                ReChange: function (pValue) {
                    return unescape(pValue.replace(/&#x/g, '%u').replace(/\\u/g, '%u').replace(/;/g, ''));
                }
            };

            var xmlhttp;
            if (window.XMLHttpRequest) {
                // IE7+, Firefox, Chrome, Opera, Safari 浏览器执行代码
                xmlhttp = new XMLHttpRequest();
            } else {
                // IE6, IE5 浏览器执行代码
                xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
            }
            xmlhttp.onreadystatechange = function () {
                if (xmlhttp.readyState == 4 && xmlhttp.status == 200 && xmlhttp.responseText) {
                    document.getElementById("result").innerHTML = UTFTranslate.ReChange(xmlhttp.responseText).slice(1, -1).replace("\"",'"');
                }
            }
            xmlhttp.open("POST", "https://********", true);
            xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xmlhttp.send(document.getElementById("book").value);
        }
    </script>
</head>
<body>
<div class="mui-content" style="margin-top: 50px">
    <h3 style="text-align: center">图书检索系统</h3>
    <div class="mui-content-padded" style="margin: 10px; margin-top: 20px">
        <div class="mui-input-row mui-search">
            <input type="search" class="mui-input-clear" placeholder="请输入图书名" id="book">
        </div>
        <div class="mui-button-row">
            <button type="button" class="mui-btn mui-btn-numbox-plus" style="width: 100%" onclick="getResult()">检索
            </button>&nbsp;&nbsp;
        </div>
    </div>
    <div id="result">
        <div class="mui-card" style="margin-top: 25px">
            <div class="mui-card-content">
                <div class="mui-card-content-inner">
                    可以在搜索框内输入书籍的全称，或者书籍的简称，系统支持智能检索功能。
                </div>
            </div>
        </div>
    </div>
</div>
<script src="https://others-1256773370.cos.ap-chengdu.myqcloud.com/booksearch/js/mui.min.js"></script>
</body>
</html>
```

5. 最后通过 Webview 封装成一个 App。

## ▎总结

其实这是一个低频使用的 App，毕竟单位图书室藏书不多，人流量也不大。如果将它部署在一个传统服务器上，可能不是个好的选择，毕竟服务器放在那里不管用不用都得花钱。

所以这里选择了 Serverless 架构，部署在云函数上，按量付费的特点可以节省不少成本。同时，通过 APIGW 和 COS 的结合，完美解决了资源浪费的问题。[腾讯云 Serverless Framework](https://cloud.tencent.com/product/sf) 也是一个很好用的开发者工具，除此之外，这里还使用了云函数的 APIGW 触发器，轻巧地替代了传统 Web 框架和部分服务器软件的安装、使用和维护。

这只是一个小应用，不过稍加改造，也能做成查询成绩的 App。Serverless 的应用场景还是很有想象力的。

> **传送门：**
>
> - GitHub: [github.com/serverless](https://github.com/serverless/serverless/blob/master/README_CN.md) 
> - 官网：[serverless.com](https://serverless.com/)

欢迎访问：[Serverless 中文网](https://serverlesscloud.cn/)，您可以在 [最佳实践](https://serverlesscloud.cn/) 里体验更多关于 Serverless 应用的开发！

