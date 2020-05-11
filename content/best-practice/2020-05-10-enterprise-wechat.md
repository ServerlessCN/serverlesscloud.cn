---
title: 企业微信机器人：让你每天都可以了解世界
description: 通过定时触发器，可以非常简单快速地建立一个企业微信机器人。我们可以用它来实现喝水、吃饭提醒等小功能，还能实现定时推送新闻、天气，甚至是监控告警的小功能
keywords: Serverless 多环境配置,Serverless 管理环境,Serverless配置方案
date: 2020-05-10
thumbnail: https://img.serverlesscloud.cn/2020511/1589207417699-ZalNtxgQAC_small.jpg
categories:
  - best-practice
authors:
  - 刘宇
authorslink:
  - https://zhuanlan.zhihu.com/ServerlessGo
tags:
  - serverless
  - 企业微信
---

## 前言

通过定时触发器，可以非常简单快速地建立一个企业微信机器人。我们可以用它来实现喝水、吃饭提醒等小功能，还能实现定时推送新闻、天气，甚至是监控告警的小功能。

## 使用企业微信机器人

在企业微信中，可以选择添加机器人：

![](https://img.serverlesscloud.cn/202058/2-9-1.png)

添加机器人之后，我们可以根据文档进行企业微信机器人的基础功能定制：

以下是用curl工具往群组推送文本消息的示例（注意要将url替换成你的机器人webhook地址，content必须是utf8编码）：

```text
curl '企业微信机器人地址' \
   -H 'Content-Type: application/json' \
   -d '
   {
        "msgtype": "text",
        "text": {
            "content": "hello world"
        }
   }'
```

通过Python语言实现：

```python
url = ""
data = {
    "msgtype": "markdown",
    "markdown": {
        "content": "hello world",
    }
}
data = json.dumps(data).encode("utf-8")
req_attr = urllib.request.Request(url, data)
resp_attr = urllib.request.urlopen(req_attr)
return_msg = resp_attr.read().decode("utf-8")
```

此时，我们可以通过Serverless Framework部署一个机器人的基本功能，并且设置好API网关触发器：

`index.py`文件：

```python
import os
import json
import urllib.request

def main_handler(event, context):
    url = os.environ.get("url")
    data = {
        "msgtype": "markdown",
        "markdown": {
            "content": "hello world",
        }
    }
    data = json.dumps(data).encode("utf-8")
    req_attr = urllib.request.Request(url, data)
    resp_attr = urllib.request.urlopen(req_attr)
    return resp_attr.read().decode("utf-8")
```

`serverless.yaml`文件：

```yaml
MyRobot_Base:
  component: '@serverless/tencent-scf'
  inputs:
    name: MyRobot_Base
    runtime: Python3.6
    timeout: 3
    codeUri: ./base_robot
    description: 机器人推送接口
    region: ap-guangzhou
    environment:
      variables:
        url: webhook地址
    handler: index.main_handler
    memorySize: 64
    tags:
      app: myrobot
    events:
      - apigw:
          name: MyRobot
          parameters:
            protocols:
              - http
              - https
            description: 机器人推送接口
            environment: release
            endpoints:
              - path: /push
                method: ANY

```

部署成功之后，可以看到系统给我们的地址：

![](https://img.serverlesscloud.cn/202058/2-9-2.png)

我们通过浏览器打开这个地址，可以看到我们的企业微信机器人被触发：

![](https://img.serverlesscloud.cn/202058/2-9-3.png)

至此，我们完成了一个简单的`hello world`功能，接下来，我们对这个基础函数进行额外的改造：

```python
import os
import json
import urllib.request

def main_handler(event, context):
    url = os.environ.get("url")
    data = {
        "msgtype": "markdown",
        "markdown": {
            "content": event['body'],
        }
    }
    data = json.dumps(data).encode("utf-8")
    req_attr = urllib.request.Request(url, data)
    resp_attr = urllib.request.urlopen(req_attr)
    return resp_attr.read().decode("utf-8")
```

通过将`data`中的`content`字段更改为`event['body']`可以实现其他模块请求该接口，实现机器人推送功能，当然这个基础函数我们还可以进行完善，例如不仅仅是`markdown`格式，封装更多支持的格式：

![](https://img.serverlesscloud.cn/202058/2-9-4.png)

## 机器人功能拓展

### 提醒喝水/吃饭功能

通过定时触发器，访问云函数，可以实现该功能，例如`index.py`代码：

```python
import os
import json
import urllib.request

def main_handler(event, context):
    url = os.environ.get("url")
    data = "每天都要多喝水哦，不要忘记补充水分".encode("utf-8")
    req_attr = urllib.request.Request(url, data)
    resp_attr = urllib.request.urlopen(req_attr)
    return resp_attr.read().decode("utf-8")
```

`serverless.yaml`文件：

```yaml
MyRobot_Water:
  component: '@serverless/tencent-scf'
  inputs:
    name: MyRobot_Water
    runtime: Python3.6
    timeout: 3
    codeUri: ./water
    description: 提醒喝水的机器人
    region: ap-guangzhou
    environment:
      variables:
        url: https://service-lf3ug84s-1256773370.gz.apigw.tencentcs.com/release/push
    handler: index.main_handler
    memorySize: 64
    tags:
      app: myrobot
    events:
      - timer:
          name: timer
          parameters:
            cronExpression: '0 */30 9-17 * * * *'
            enable: true
```

这个函数就是每天上午9点到下午5点，每30分钟提醒我们喝一次水。

![](https://img.serverlesscloud.cn/202058/2-9-5.png)

### 天气预报/当地新闻功能

想要实现天气预报/新闻播报的功能，我们可以通过已有的新闻接口来实现，以腾讯云的云市场为例，寻找一个新闻类的API接口：

![](https://img.serverlesscloud.cn/202058/2-9-6.png)

根据API文档，可以看到请求地址是：`https://service-aqvnjmiq-1257101137.gz.apigw.tencentcs.com/release/news/search`

Get方法可以携带一个参数：`keyword`，作为目标的关键词，代码编写：

```python
import ssl, hmac, base64, hashlib, os, json
from datetime import datetime as pydatetime
from urllib.parse import urlencode
from urllib.request import Request, urlopen


def main_handler(event, context):
    source = "market"

    datetime = pydatetime.utcnow().strftime('%a, %d %b %Y %H:%M:%S GMT')
    signStr = "x-date: %s\nx-source: %s" % (datetime, source)
    sign = base64.b64encode(hmac.new(os.environ.get('secretKey').encode('utf-8'), signStr.encode('utf-8'), hashlib.sha1).digest())
    auth = 'hmac id="%s", algorithm="hmac-sha1", headers="x-date x-source", signature="%s"' % (os.environ.get("secretId"), sign.decode('utf-8'))

    headers = {
        'X-Source': source,
        'X-Date': datetime,
        'Authorization': auth,
    }
    queryParams = {'keyword': '科技新闻'}
    url = 'https://service-aqvnjmiq-1257101137.gz.apigw.tencentcs.com/release/news/search'
    if len(queryParams.keys()) > 0:
        url = url + '?' + urlencode(queryParams)

    content = ""
    for eve in json.loads(urlopen(Request(url, headers=headers)).read().decode("utf-8"))["result"]["list"][0:5]:
        content = content + "* [%s](%s) \n"%(eve['title'], eve['url'])

    if content:
        urlopen(Request(os.environ.get('url'), content.encode("utf-8")))
```

`serverless.yaml`文件：

```yaml
MyRobot_News:
  component: '@serverless/tencent-scf'
  inputs:
    name: MyRobot_News
    runtime: Python3.6
    timeout: 3
    codeUri: ./news
    description: 新闻推送
    region: ap-guangzhou
    environment:
      variables:
        url: https://service-lf3ug84s-1256773370.gz.apigw.tencentcs.com/release/push
        secretId: 云市场密钥信息
        secretKey: 云市场密钥信息
    handler: index.main_handler
    memorySize: 64
    tags:
      app: myrobot
    events:
      - timer:
          name: timer
          parameters:
            cronExpression: '0 0 */8 * * * *'
            enable: true
```

运行效果就是，每天早晨8点为我们推送当日科技新闻：

![](https://img.serverlesscloud.cn/202058/2-9-7.png)

可以通过点击新闻，进入到对应的新闻页面。

### 监控告警功能

企业微信机器人，除了可以被赋予上面的能力，还可以被赋予监控告警的能力：

`index.py`文件：

```python
import os
import urllib.request

def getStatusCode(url):
    return urllib.request.urlopen(url).getcode()

def main_handler(event, context):
    url = "http://www.anycodes.cn"
    if getStatusCode(url) == 200:
        print("您的网站%s可以访问！" % (url))
    else:
        urllib.request.urlopen(urllib.request.Request(os.environ.get('url'), ("您的网站%s 不可以访问！" % (url)).encode("utf-8")))
    return None
```

`serverless.yaml`文件：

```yaml
MyRobot_Monitor:
  component: '@serverless/tencent-scf'
  inputs:
    name: MyRobot_Monitor
    runtime: Python3.6
    timeout: 3
    codeUri: ./monitor
    description: 网站监控
    region: ap-guangzhou
    environment:
      variables:
        url: https://service-lf3ug84s-1256773370.gz.apigw.tencentcs.com/release/push
    handler: index.main_handler
    memorySize: 64
    tags:
      app: myrobot
    events:
      - timer:
          name: timer
          parameters:
            cronExpression: '0 */30 * * * * *'
            enable: true
```

部署完成之后，我们的网站监控脚本就已经启动，每30分钟检查一次自己的网站是否可用，如果不可用，则会发送告警：

![](https://img.serverlesscloud.cn/202058/2-9-8.png)

## 思路发散

企业微信机器人可以通过Serverless架构被赋予更多更有趣的功能，那么我们身边还有那些产品可以和Serverless架构结合，被我们赋予有趣的功能呢？

随着网络技术的不断发展，IoT技术也逐渐走进了千家万户，无论是扫地机器人、智能窗帘等智能家居，还是说智能音箱等娱乐设施，IoT技术都变得可见可及。说出一个耳熟能详的小爱同学，今天通过Serverless架构，快速开发出属于我们自己的小爱同学新功能。
	
在开始之前，我们需要去小爱同学的开放平台注册一个账号，并且提交认证：

![](https://img.serverlesscloud.cn/202058/2-9-9.png)

完成之后，我们开始对小爱同学的定制化功能进行研究。如图所示，在开发文档中，我们可看到小爱同学开发者平台为我们提供的能力信息，同样我们也可以查看到request以及response的详细信息：

![](https://img.serverlesscloud.cn/202058/2-9-10.png)

在对小爱同学的开发者规范等有了一定的了解之后，我们可以开始对项目进行设计。本节目标是通过对小爱同学说出“进入云+社区”关键词，可以为用户返回腾讯云云+社区的最新热门文章的题目和简介。整个流程如图所示：

![](https://img.serverlesscloud.cn/202058/2-9-11.png)

接下来进行函数的代码编写：

```python
# -*- coding: utf8 -*-
import json
import logging
import urllib.request
import urllib.parse

logging.basicConfig(level=logging.NOTSET)


def main_handler(event, context):
    host = "https://cloud.tencent.com/"
    path = "developer/services/ajax/column/article?action=FetchColumnHomeArticleList"
    json_data = {
        "action": "FetchColumnHomeArticleList",
        "payload": {
            "pageNumber": 1,
            "pageSize": 20,
            "version": 1
        }
    }
    data = json.dumps(json_data).encode("utf-8")
    request_attr = urllib.request.Request(url=host + path, data=data)
    response_attr = urllib.request.urlopen(request_attr).read().decode("utf-8")
    json_resp = json.loads(response_attr)
    logging.debug(json_resp)
    temp_str = "文章题目为%s,主要内容是%s"
    list_data = json_resp["data"]["list"][0:5]
    art_list = [temp_str % (eve["title"], eve["abstract"]) for eve in list_data]
    news_str = '''今日腾讯云加社区热门文章如下：%s''' % ("、".join(art_list))
    logging.debug(news_str)

    xiaoai_response = {"version": "1.0",
                       "response": {
                           "open_mic": False,
                           "to_speak": {
                               "type": 0,
                               "text": news_str
                           }
                       },
                       "is_session_end": False
                       }
    return xiaoai_response

```

完成之后，通过Serverless Framework进行部署，并且绑定API网关触发器，然后我们通过请求地址可以看到测试结果：

![](https://img.serverlesscloud.cn/202058/2-9-12.png)

可以看到，我们已经可以获得到目标数据，此时，我们在小爱同学官网，创建技能开发，在填写好和保存好基本信息之后，我们选择配置服务，在配置信息处填写HTTPS中的测试化境地址：

![](https://img.serverlesscloud.cn/202058/2-9-13.png)

配置完成之后，我们进入到测试页面，开始测试，如下图所示，可以看到，当我们输入预定的命令“打开云加社区”，系统会正确回去到结果信息，并且给我们返回：

![](https://img.serverlesscloud.cn/202058/2-9-14.png)

至此为止，我们通过Serverless架构，成功地为我们的小爱同学开发了一项新功能，接下来想要让更多人使用这个新功能就可以去发布，审核，上线了。

## 总结

通过Serverless架构，我们可以快速的为以后的产品增加一些新的功能，赋予新的生机，本文仅仅是抛砖引玉，通过企业微信机器人与Serverless架构的结合，若干代码实现提醒吃饭/喝水功能、新闻/天气功能以及业务的监控告警功能，同时发散思维导小爱同学等设备上，通过Serverless架构，为其赋予新的能力。

## Serverless Framework 30 天试用计划

我们诚邀您来体验最便捷的 Serverless 开发和部署方式。在试用期内，相关联的产品及服务均提供免费资源和专业的技术支持，帮助您的业务快速、便捷地实现 Serverless！

> 详情可查阅：[Serverless Framework 试用计划](https://cloud.tencent.com/document/product/1154/38792)

## One More Thing
<div id='scf-deploy-iframe-or-md'><div><p>3 秒你能做什么？喝一口水，看一封邮件，还是 —— 部署一个完整的 Serverless 应用？</p><blockquote><p>复制链接至 PC 浏览器访问：<a href="https://serverless.cloud.tencent.com/deploy/express">https://serverless.cloud.tencent.com/deploy/express</a></p></blockquote><p>3 秒极速部署，立即体验史上最快的 Serverless HTTP 实战开发！</p></div></div>

<script>
var n = navigator.userAgent.toLowerCase();
if (n.indexOf('android')>-1 || n.indexOf('iphone')>-1 || n.indexOf('iPhone')>-1 || n.indexOf('ipod')>-1 || n.indexOf('ipad')>-1 || n.indexOf('ios')>-1){
  document.getElementById('scf-deploy-iframe-or-md').innerHTML = '<div><p>3 秒你能做什么？喝一口水，看一封邮件，还是 —— 部署一个完整的 Serverless 应用？</p><blockquote><p>复制链接至 PC 浏览器访问：<a href="https://serverless.cloud.tencent.com/deploy/express">https://serverless.cloud.tencent.com/deploy/express</a></p></blockquote><p>3 秒极速部署，立即体验史上最快的 Serverless HTTP 实战开发！</p></div>';
}else{
  document.getElementById('scf-deploy-iframe-or-md').innerHTML = '<p>扫码写代码，这可能是你从未尝试过的开发体验。不来试试吗？</p><p>3 秒极速部署，立即体验史上最快的 <a href="https://serverless.cloud.tencent.com/deploy/express">Serverless  HTTP</a> 实战开发！</p><iframe height="500px" width="100%" src="https://serverless.cloud.tencent.com/deploy/express" frameborder="0"  allowfullscreen></iframe>';
}
</script>

---

> **传送门：**
> - GitHub: [github.com/serverless](https://github.com/serverless/serverless/blob/master/README_CN.md) 
> - 官网：[serverless.com](https://serverless.com/)

欢迎访问：[Serverless 中文网](https://serverlesscloud.cn/)，您可以在 [最佳实践](https://serverlesscloud.cn/best-practice) 里体验更多关于 Serverless 应用的开发！