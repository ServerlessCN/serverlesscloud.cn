---
title: 如何优雅地给搜索引擎去广告！
description: 这真的不是针对友商……
keywords: Serverless 应用服务端,Serverless 应用,Serverless Web 后端
date: 2019-07-23
thumbnail: https://img.serverlesscloud.cn/2020414/1586878208210-search.jpg
categories:
  - user-stories
authors:
  - Anycodes
authorslink:
  - https://www.zhihu.com/people/liuyu-43-97
tags:
  - SEO
  - Serverless
---

众所周知，搜索引擎会有广告主付费推广的内容，这些付费推广常常会干扰到我们的信息获取。例如，搜索「在线编程」这个词条：

![img](https://img.serverlesscloud.cn/tmp/v2-ba2f3c6c50532ce9b953799de8ce38ec_1440w-20200414233121133.jpg)

一页屏幕上就有 5 个搜索结果是推广内容，就问你怕不怕！

同时，其中大部分命中的关键词是「编程」，而非「在线编程」，也会带给我们干扰以及很不友好的体验。那么我们是否可以通过云函数 SCF 来做一个简单的工具，屏蔽掉这些广告呢？

当然可以！本教程将会通过 SCF+COS 来实现一个简单的网页搜索小工具，至于为啥叫「搜索小工具」而不是叫「去广告搜索小工具」，留个悬念，待会儿再说。

```text
SCF：Serverless Cloud Function，云函数
COS：Cloud Object Storage，对象存储
```

## **▎寻找广告特点**

在对列表页代码研究过程中，我们发现，非广告页代码有：

![img](https://img.serverlesscloud.cn/tmp/v2-bbd15e84a48cb68ff2cc23bddd81397d_1440w-20200414233126569.jpg)

而推广内容，则没有这个内容。

所以，我们可以通过正则化，或者 XPATH 等操作来对目标内容进行识别。

## **▎本地实验**

### **一、本地爬虫编写**

对页面分析，我们可以得到这样一组参数：

```python3
ie=utf-8
pn=10
wd=在线编程
```

这组参数中，ie 是控制编码格式，pn 是翻页（偏移量），wd 是搜索词汇，对代码编写如下：

```text
import urllib.request
import re
page = 1
args_pn = (page-1) * 10
url = "http://www.baidu.com/s?ie=utf-8&pn=" + str(args_pn) + "&wd=" + urllib.request.quote("在线编程")
req_attr = urllib.request.urlopen(url)
result_list = re.findall("data-tools='(.*?)'",req_attr.read().decode("utf-8"))
for eve in result_list:
    print(eve)
```

运行结果：

```text
{"title":"代码在线运行 - 在线工具","url":"http://www.baidu.com/link?url=2rtPQM1Yb08uBDUY61IkU3Apr7xkDiP2_zsnZH00HyMsViwBfFR9LJAiXcjqD_EK"}
{"title":"南邮编程在线","url":"http://www.baidu.com/link?url=f_VCURb1ZNe7nVgW3G7IiBBvKDGaeht8SB3hK93jEEddFAtpJC2SGzBoFTs1BLWd"}
{"title":"在线编程 - 编程中国","url":"http://www.baidu.com/link?url=hnYcaMNhRhf5FZfV1vlE5SGS6GjUls4fluKKW52mMIAHwXJd1wey2mOdmtb13ldf"}
{"title":"一个简单的在线集成编程工具 - Anycodes - 随时随地有创意,随时...","url":"http://www.baidu.com/link?url=zMnTtD6cBS_3XT21FMSviS_mzF0T2daHAui6_XC7LAscng2KPt064eej0JqPgfBX"}
{"title":"非常好用的在线编程网站 - yimisiyang - CSDN博客","url":"http://www.baidu.com/link?url=57aywD0Q6WTnl7XKbIHuE7R_FT8mrDBMv8kdi_tomry-X1SrzMnjNVuobcIXjUVnR_ZQrRZQrTHv5uSgfZ-GdR5ud1WK9aOaAKTP-KhFr4e"}
{"title":"十个在线编程网站 _360doc个人图书馆","url":"http://www.baidu.com/link?url=ouVP_VD3EkdRLL-X2bjZNJTdFbVIJgt0jrZL3II0hxj5yT3aTAo56tUA0hUfrCbiZKWcmBNTLKcTiwA7q1bxQJwxdZnKEUzChwQ_nefSJK3"}
{"title":"[转]在线编程刷题网站 - gravely的专栏 - CSDN博客","url":"http://www.baidu.com/link?url=gPgyV9kX2IdYqfifVCn-22OPGWIZqBb3oGfRbl0b_LVRr0MmdgiXoaACk-vRZu6f45q3qsG4X3Zs2wexiex-0K"}
{"title":"c在线编译器,c语言在线解释器,在线编程网站","url":"http://www.baidu.com/link?url=ETluxwW57CgsUIBR7-BKj0bLA65WJr2eipQ5rJOF-1AB3ymP4AGViYXC7AUCrUcW"}
{"title":"8个国外最流行的在线编程练习网站","url":"http://www.baidu.com/link?url=3o0SRtHkYsI2gUjmjsks7dYk00VoljXmVhnkv-CskKh9aiaTAfyDPNa25f4Mj-7AcLrX9eiaObQVChuX5eG0BfWOcE1U-PGsVFWpCFLKSzq"}
{"title":"在线编程_百度百科","url":"http://www.baidu.com/link?url=0uxpDuoQDb_Amx9_6n9PqOpJr10tcRrbU0x-hshhnQNx2mVHyCiDJFsqthe-cEUQNv0AO0KFDYmCZP970sW8mVG02xwha-cNalwKUAogkmpwOQVy5xf9lqKdFROOMqBQ"}
```

可以看到，这个结果是第一页的搜索结果，他包括了：

![img](https://img.serverlesscloud.cn/tmp/v2-d32b3c8a3609ae7faa6341dfcc1d7d44_1440w-20200414233132076.jpg)

首页结果，一对一匹配，并且没有上下的广告内容。证明我们本搜索结果是靠谱的。

### **二、搜索页面制作**

以一个非常简单的基础页面作为示例：

```text
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>新搜索 - Powered by Dfounderliu！</title>
</head>
<body>

<form>
    请输入要搜索的内容：<input type="text"><br>
    <input type="submit">
</form>
<div id="result">
    <ol>
        <li>结果1</li>
        <li>结果2</li>
    </ol>
</div>
</body>
</html>
```

效果大概这个样子：

![img](https://img.serverlesscloud.cn/tmp/v2-0448b26125893e7242f6e64645ded09f_1440w-20200414233143835.jpg)

## **▎发布服务**

### **一、发布 SCF 服务**

```text
# -*- coding: utf8 -*-
import json
import urllib.request
import re
def main_handler(event, context):
    print(event["pathParameters"]["kw"])
    print(event["pathParameters"]["pn"])
    page = int(event["pathParameters"]["pn"])
    args_pn = (page-1) * 10
    url = "http://www.baidu.com/s?ie=utf-8&pn=" + str(args_pn) + "&wd=" + event["pathParameters"]["kw"]
    req_attr = urllib.request.urlopen(url)
    result_list = re.findall("data-tools='(.*?)'",req_attr.read().decode("utf-8"))
    result = ""
    for eve in result_list:
        temp_json = json.loads(eve)
        temp_result = '<li><a href="%s">%s</a></li>'%(temp_json["url"],temp_json["title"])
        result = result + temp_result
    return result
```

### **二、API 网关配置**

![img](https://img.serverlesscloud.cn/tmp/v2-77f5a0a929a8060ce71d77ff1165da5c_1440w-20200414233148764.jpg)

### **三、API 测试**

![img](https://img.serverlesscloud.cn/tmp/v2-7e2687ec26e73329dac9387a8cf8d0e0_1440w-20200414233152448.jpg)

### **四、静态页面**

接下来，对 HTML 页面进行修改，并且上传到 COS。

页面修改为：

```text
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>新搜索 - Powered by Dfounderliu！</title>
    <script src="https://cdn.staticfile.org/jquery/1.10.2/jquery.min.js"></script>
    <script>
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

        function searchKw() {
            var kw = document.getElementById("kw").value;
            var pn = document.getElementById("pn").value;
            $.get("http://service-rnwcbtai-1256773370.gz.apigw.tencentcs.com/release/list/" + kw + "/" + pn, function (data, status) {
                document.getElementById("result").innerHTML = UTFTranslate.ReChange(data)
            });
        }
    </script>
</head>
<body>
<center><h1>在线搜索工具</h1></center>
<hr>
<center>
    请输入要搜索的内容：<input type="text" id="kw"><br>
    请输入要跳转的页面：<input type="text" id="pn"><br><br>
    <button type="reset">重置</button> &nbsp;&nbsp;|&nbsp;&nbsp;<button onclick="searchKw()">搜索</button>
</center>
<div>
    <ol id="result">
    </ol>
</div>
</body>
</html>
```

在对象存储中新建存储桶，并上传刚才的 html 文件：

![img](https://img.serverlesscloud.cn/tmp/v2-0ae831a91b94390538de0991822763b5_1440w-20200414233158158.jpg)

修改权限为公有读，私有写：

![img](https://img.serverlesscloud.cn/tmp/v2-f44da2d1d2a687b2ac01aaa42464c506_1440w-20200414233201792.jpg)

基础配置，开启静态网站：

![img](https://img.serverlesscloud.cn/tmp/v2-91899c3000a5f395f2215e3e42ec2b4b_1440w-20200414233206870.jpg)

### **五、访问域名测试**

![img](https://img.serverlesscloud.cn/tmp/v2-2bd48e56af566b38011b5ca8f3b6c1c3_1440w-20200414233211844.jpg)

## **▎总结**

至此，我们便完成了一个基本的去广告搜索引擎。

有的同学可能就疑惑了：

1. 本分享主要目的何在？
2. 这个例子有什么价值？

关于上面两个问题，简单回复：

本分享主要想告诉大家，有了 SCF 和 COS 以及 CDB 等产品。作为用户，可以暂时不用 CVM 了。静态网页，我们可以放在 COS 中，后端的处理放在 SCF，数据存储到 CDB，然后请求页面的时候，COS 为我们保证了基本的访问功能和足够的带宽，SCF 为我们提供了弹性伸缩的功能，让用户无需考虑流量多少，是否要对 CVM 扩容等。

这样能让我们将更多的精力放到 Coding 上。试想，如果传统的一个 Python 程序员想要做这样一个网页，他需要哪些知识？需要 Django/flask 等基本框架知识，需要一些 Web 端的运维，例如怎么配置环境，怎么配置 Nginx 等操作。现在呢？不需要这些框架知识，你只需要做一个简单的 Html，Ajax 通信。然后，后端就是我们平常的一个爬虫，也不需要很多复杂的配置文件。这不就是一种进步么！

第二点，这个教程表面上就是一个云函数 SCF 运行一个爬虫，接入了 COS 的静态页面，让我们可以不用 CVM 也能做出一个网页。但实际上，这个 demo 意义重大。首先，这么一个简单的页面，就可以完成目标页面预览功能，当鼠标移动到对应的 URL 上面，会浮动出目标网页的样子和关键词命中的位置，这算不算搜索引擎中的一种创新？

此外，除了去除搜索引擎的广告，还可以继续拓展。我们可将 Google、360、bing 等多家搜索数据进行整合，然后统一显示出来，这也是一种方便。或者，我们整合程序员常去的社区论坛，编写多个爬虫，便能实现程序员专用搜索。当然，这只是本例子的一个应用场景。这个 Demo 还是希望能给大家一个思路：

**原来做网站可以不用 CVM 了，直接用 COS+SCF+CDB 就能搞定了啊！**

---

> **传送门：**
> - GitHub: [github.com/serverless](https://github.com/serverless/serverless/blob/master/README_CN.md) 
> - 官网：[serverless.com](https://serverless.com/)

欢迎访问：[Serverless 中文网](https://serverlesscloud.cn/)，您可以在 [最佳实践](https://serverlesscloud.cn/best-practice) 里体验更多关于 Serverless 应用的开发！
