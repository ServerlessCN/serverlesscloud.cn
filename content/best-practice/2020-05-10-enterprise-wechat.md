---
title: 从企业微信机器人到小爱同学，用 Serverless 实现生活智能化！
description: 通过定时触发器，可以非常简单快速地建立一个企业微信机器人。我们可以用它来实现喝水、吃饭提醒等小功能，还能实现定时推送新闻、天气，甚至是监控告警的小功能
keywords: Serverless 多环境配置,Serverless 管理环境,Serverless配置方案
date: 2020-05-10
thumbnail: https://img.serverlesscloud.cn/2020511/1589207417699-ZalNtxgQAC_small.jpg
categories:
  - best-practice
authors:
  - Anycodes
authorslink:
  - https://zhuanlan.zhihu.com/ServerlessGo
tags:
  - Serverless
  - 企业微信
---

通过定时触发器，可以简单快速地定制一个企业微信机器人。我们可以用它来实现喝水、吃饭提醒等小功能，还能实现定时推送新闻、天气，甚至是监控告警的小功能。

## 使用企业微信机器人

在企业微信中，选择添加机器人：

![添加机器人](https://img.serverlesscloud.cn/202058/2-9-1.png)

之后，我们可以根据文档进行企业微信机器人的基础功能定制：

以下是用 curl 工具往群组推送文本消息的示例（注意要将 url 替换成机器人的 webhook 地址，content 必须是 utf8 编码）：

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

通过 Python 语言实现：

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

此时，我们可以通过 Serverless Framework 部署一个机器人的基本功能，并且设置好 API 网关触发器：

`index.py` 文件如下：

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

`serverless.yaml` 文件如下：

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

部署成功之后，可以看到命令行中输出的地址：

![](https://img.serverlesscloud.cn/202058/2-9-2.png)

在浏览器中打开，可以看到企业微信机器人已经被触发了：

![](https://img.serverlesscloud.cn/202058/2-9-3.png)

以上就是一个简单的 `hello world` 功能。接下来，好戏开始！

我们对这个基础函数进行进一步的改造：

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

通过将 `data` 中的 `content` 字段更改为 `event['body']` 可以让其他模块请求该接口，实现机器人推送功能，当然这个基础函数我们还可以进行完善，不仅仅是 `markdown` 格式，封装更多支持的格式：

![](https://img.serverlesscloud.cn/202058/2-9-4.png)

## 机器人功能拓展

### 提醒喝水/吃饭功能

通过定时触发器，访问云函数，可以实现该功能。

例如 `index.py` 代码：

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

这个函数就是每天上午 9 点到下午 5 点，每 30 分钟提醒喝一次水。

### 天气预报/当地新闻功能

想要实现天气预报/新闻播报的功能，我们可以通过已有的新闻接口来实现，以腾讯云的云市场为例，寻找一个新闻类 API 接口：

![](https://img.serverlesscloud.cn/202058/2-9-6.png)

根据 API 文档，可以看到请求地址是：https://service-aqvnjmiq-1257101137.gz.apigw.tencentcs.com/release/news/search

Get 方法可以携带一个参数：`keyword`，作为目标的关键词，编写代码：

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

`serverless.yaml` 文件：

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

运行效果如下，每天早晨 8 点为我们推送当日科技新闻：

![](https://img.serverlesscloud.cn/202058/2-9-7.png)

### 监控告警功能

我们还可以赋予企业微信机器人监控告警的能力：

`index.py` 文件：

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

`serverless.yaml` 文件：

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

部署完成后，网站的监控脚本就已经启动，每 30 分钟检查一次网站是否可用。如果不可用，则会发送告警：

![](https://img.serverlesscloud.cn/202058/2-9-8.png)

## 思路发散

企业微信机器人可以通过 Serverless 架构被赋予更多更有趣的功能，那么还有哪些产品可以和 Serverless 架构相结合，变得更有趣呢？

随着网络技术的不断发展，IoT 技术也逐渐走进了千家万户，无论是扫地机器人、智能窗帘等智能家居，还是智能音箱等娱乐设施，IoT 技术都变得可见可及。

小爱同学，也能通过 Serverless 架构，快速开发出专属新功能。

首先我们去「小爱同学」的开放平台注册账号，并且提交认证：

![](https://img.serverlesscloud.cn/202058/2-9-9.png)

接下来对小爱同学的定制化功能进行研究。如图所示，在开发文档中，我们可以看到小爱同学开发者平台为我们提供的能力信息，同样我们也可以查看到 request 以及 response 的详细信息：

![](https://img.serverlesscloud.cn/202058/2-9-10.png)

继续进行项目设计。本文的目标是通过对小爱同学说出「进入云+社区」等关键词，为用户返回腾讯云+社区的最新热门文章的题目和简介。

整个流程如图所示：

![系统流程图](https://img.serverlesscloud.cn/202058/2-9-11.png)

函数代码编写：

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

完成之后，使用 Serverless Framework 进行部署，绑定 API 网关触发器，通过请求地址可以看到测试结果：

![](https://img.serverlesscloud.cn/202058/2-9-12.png)

可以看到，我们已经获得到目标数据。此时，我们在小爱同学官网，创建技能开发，在填写好和保存好基本信息之后，选择配置服务，填写 HTTPS 中的测试化地址：

![](https://img.serverlesscloud.cn/202058/2-9-13.png)

配置完成之后，开始测试，如下图所示，可以看到，当我们输入预定的命令「打开云加社区」，系统会正确回取到结果信息，并且给我们返回：

![](https://img.serverlesscloud.cn/202058/2-9-14.png)

至此，我们通过 Serverless 架构，成功地为「小爱同学」开发了一项新功能，我们还可以将这个新功能就拿去发布和上线！

## 总结

本文仅仅是一次简单的示范，通过企业微信机器人与 Serverless 架构的结合，用若干代码实现提醒功能、新闻推送功能以及业务监控告警功能。同时我们还发散思维，让小爱同学也拥有了新的能力。

不难看出，通过 Serverless 架构，我们可以快速为产品增加一些新的功能，赋予新的生机！



---
<div id='scf-deploy-iframe-or-md'></div>

---

> **传送门：**
> - GitHub: [github.com/serverless](https://github.com/serverless/serverless/blob/master/README_CN.md)
> - 官网：[serverless.com](https://serverless.com/)

欢迎访问：[Serverless 中文网](https://serverlesscloud.cn/)，您可以在 [最佳实践](https://serverlesscloud.cn/best-practice) 里体验更多关于 Serverless 应用的开发！
