---
title: Serverless 与 Websocket 的聊天工具
description: 传统业务实现 Websocket 并不难，然而函数计算基本上都是事件驱动，不支持长链接操作。如果将函数计算与 API 网关结合，是否可以有 Websocket 的实现方案呢？
keywords: Serverless 多环境配置,Serverless 管理环境,Serverless配置方案
date: 2020-05-09
thumbnail: https://img.serverlesscloud.cn/2020511/1589207418781-ZalNtxgQAC_small.jpg
categories:
  - best-practice
authors:
  - 刘宇
authorslink:
  - https://zhuanlan.zhihu.com/ServerlessGo
tags:
  - serverless
  - websocket
---

## 前言

传统业务实现 Websocket 并不难，然而函数计算基本上都是事件驱动，不支持长链接操作。如果将函数计算与 API 网关结合，是否可以有 Websocket 的实现方案呢？

## API网关触发器实现Websocket

WebSocket 协议是基于 TCP 的一种新的网络协议。它实现了浏览器与服务器全双工（full-duplex）通信，即允许服务器主动发送信息给客户端。WebSocket 在服务端有数据推送需求时，可以主动发送数据至客户端。而原有 HTTP 协议的服务端对于需推送的数据，仅能通过轮询或 long poll 的方式来让客户端获得。

由于云函数是无状态且以触发式运行，即在有事件到来时才会被触发，因此，为了实现 WebSocket，云函数与 API 网关相结合，通过 API 网关承接及保持与客户端的连接。您可以认为 API 网关与 SCF 一起实现了服务端。当客户端有消息发出时，会先传递给 API 网关，再由 API 网关触发云函数执行。当服务端云函数要向客户端发送消息时，会先由云函数将消息 POST 到 API 网关的反向推送链接，再由 API 网关向客户端完成消息的推送。具体的实现架构如下：

![](https://img.serverlesscloud.cn/tmp/2-8-2.png)

对于 WebSocket 的整个生命周期，主要由以下几个事件组成：

* 连接建立：客户端向服务端请求建立连接并完成连接建立。
* 数据上行：客户端通过已经建立的连接向服务端发送数据。
* 数据下行：服务端通过已经建立的连接向客户端发送数据。
* 客户端断开：客户端要求断开已经建立的连接。
* 服务端断开：服务端要求断开已经建立的连接。

对于 WebSocket 整个生命周期的事件，云函数和 API 网关的处理过程如下：

* 连接建立：客户端与 API 网关建立 WebSocket 连接，API 网关将连接建立事件发送给 SCF。
* 数据上行：客户端通过 WebSocket 发送数据，API 网关将数据转发送给 SCF。
* 数据下行：SCF 通过向 API 网关指定的推送地址发送请求，API 网关收到后会将数据通过 WebSocket 发送给客户端。
* 客户端断开：客户端请求断开连接，API 网关将连接断开事件发送给 SCF。
* 服务端断开：SCF 通过向 API 网关指定的推送地址发送断开请求，API 网关收到后断开 WebSocket 连接。

因此，API 网关与 SCF 之间的交互，需要由3类云函数来承载：

* 注册函数：在客户端发起和 API 网关之间建立 WebSocket 连接时触发该函数，通知 SCF WebSocket 连接的 secConnectionID。通常会在该函数记录 secConnectionID 到持久存储中，用于后续数据的反向推送。
* 清理函数：在客户端主动发起 WebSocket 连接中断请求时触发该函数，通知 SCF 准备断开连接的 secConnectionID。通常会在该函数清理持久存储中记录的该 secConnectionID。
* 传输函数：在客户端通过 WebSocket 连接发送数据时触发该函数，告知 SCF 连接的 secConnectionID 以及发送的数据。通常会在该函数处理业务数据。例如，是否将数据推送给持久存储中的其他 secConnectionID。


## Websocket功能实现

根据腾讯云官网提供的该动能的整体架构图：

![](https://img.serverlesscloud.cn/202058/2-8-3.png)

这里我们可以使用COS（对象存储）作为持久化的方案，当用户建立链接存储ConnectionId到COS中，当用户断开连接删除该链接Id。

其中注册函数：

```python
# -*- coding: utf8 -*-
import os
from qcloud_cos_v5 import CosConfig
from qcloud_cos_v5 import CosS3Client

bucket = os.environ.get('bucket')
region = os.environ.get('region')
secret_id = os.environ.get('secret_id')
secret_key = os.environ.get('secret_key')
cosClient = CosS3Client(CosConfig(Region=region, SecretId=secret_id, SecretKey=secret_key))


def main_handler(event, context):
    print("event is %s" % event)

    connectionID = event['websocket']['secConnectionID']

    retmsg = {}
    retmsg['errNo'] = 0
    retmsg['errMsg'] = "ok"
    retmsg['websocket'] = {
        "action": "connecting",
        "secConnectionID": connectionID
    }

    cosClient.put_object(
        Bucket=bucket,
        Body='websocket'.encode("utf-8"),
        Key=str(connectionID),
        EnableMD5=False
    )

    return retmsg

```

传输函数：

```python
# -*- coding: utf8 -*-
import os
import json
import requests
from qcloud_cos_v5 import CosConfig
from qcloud_cos_v5 import CosS3Client

bucket = os.environ.get('bucket')
region = os.environ.get('region')
secret_id = os.environ.get('secret_id')
secret_key = os.environ.get('secret_key')
cosClient = CosS3Client(CosConfig(Region=region, SecretId=secret_id, SecretKey=secret_key))

sendbackHost = os.environ.get("url")


def Get_ConnectionID_List():
    response = cosClient.list_objects(
        Bucket=bucket,
    )
    return [eve['Key'] for eve in response['Contents']]


def send(connectionID, data):
    retmsg = {}
    retmsg['websocket'] = {}
    retmsg['websocket']['action'] = "data send"
    retmsg['websocket']['secConnectionID'] = connectionID
    retmsg['websocket']['dataType'] = 'text'
    retmsg['websocket']['data'] = data
    requests.post(sendbackHost, json=retmsg)


def main_handler(event, context):
    print("event is %s" % event)

    connectionID_List = Get_ConnectionID_List()
    connectionID = event['websocket']['secConnectionID']
    count = len(connectionID_List)
    data = event['websocket']['data'] + "(===Online people:" + str(count) + "===)"
    for ID in connectionID_List:
        if ID != connectionID:
            send(ID, data)

    return "send success"

```

清理函数：

```python
# -*- coding: utf8 -*-
import os
import requests
from qcloud_cos_v5 import CosConfig
from qcloud_cos_v5 import CosS3Client

bucket = os.environ.get('bucket')
region = os.environ.get('region')
secret_id = os.environ.get('secret_id')
secret_key = os.environ.get('secret_key')
cosClient = CosS3Client(CosConfig(Region=region, SecretId=secret_id, SecretKey=secret_key))

sendbackHost = os.environ.get("url")


def main_handler(event, context):
    print("event is %s" % event)

    connectionID = event['websocket']['secConnectionID']

    retmsg = {}
    retmsg['websocket'] = {}
    retmsg['websocket']['action'] = "closing"
    retmsg['websocket']['secConnectionID'] = connectionID
    requests.post(sendbackHost, json=retmsg)

    cosClient.delete_object(
        Bucket=bucket,
        Key=str(connectionID),
    )

    return event

```

我们的Yaml格式可以如下：

```yaml
Conf:
  component: "serverless-global"
  inputs:
    region: ap-guangzhou
    bucket: chat-cos-1256773370
    secret_id: 
    secret_key: 

myBucket:
  component: '@serverless/tencent-cos'
  inputs:
    bucket: ${Conf.bucket}
    region: ${Conf.region}

restApi:
  component: '@serverless/tencent-apigateway'
  inputs:
    region: ${Conf.region}
    protocols:
      - http
      - https
    serviceName: ChatDemo
    environment: release
    endpoints:
      - path: /
        method: GET
        protocol: WEBSOCKET
        serviceTimeout: 800
        function:
          transportFunctionName: ChatTrans
          registerFunctionName: ChatReg
          cleanupFunctionName: ChatClean


ChatReg:
  component: "@serverless/tencent-scf"
  inputs:
    name: ChatReg
    codeUri: ./code
    handler: reg.main_handler
    runtime: Python3.6
    region:  ${Conf.region}
    environment:
      variables:
        region: ${Conf.region}
        bucket: ${Conf.bucket}
        secret_id: ${Conf.secret_id}
        secret_key: ${Conf.secret_key}
        url: http://set-gwm9thyc.cb-guangzhou.apigateway.tencentyun.com/api-etj7lhtw

ChatTrans:
  component: "@serverless/tencent-scf"
  inputs:
    name: ChatTrans
    codeUri: ./code
    handler: trans.main_handler
    runtime: Python3.6
    region:  ${Conf.region}
    environment:
      variables:
        region: ${Conf.region}
        bucket: ${Conf.bucket}
        secret_id: ${Conf.secret_id}
        secret_key: ${Conf.secret_key}
        url: http://set-gwm9thyc.cb-guangzhou.apigateway.tencentyun.com/api-etj7lhtw

ChatClean:
  component: "@serverless/tencent-scf"
  inputs:
    name: ChatClean
    codeUri: ./code
    handler: clean.main_handler
    runtime: Python3.6
    region:  ${Conf.region}
    environment:
      variables:
        region: ${Conf.region}
        bucket: ${Conf.bucket}
        secret_id: ${Conf.secret_id}
        secret_key: ${Conf.secret_key}
        url: http://set-gwm9thyc.cb-guangzhou.apigateway.tencentyun.com/api-etj7lhtw
```

这里要注意，我们需要先部署API网关，部署完成，获得到回推地址，将回推地址以url的形式写入到对应函数的环境变量中：

![](https://img.serverlesscloud.cn/202058/3-8-4.png)

这里理论上设计的不是很合理，按照道理是可以通过`${restApi.url[0].internalDomain}`自动获得到url的，但是我并没有成功获得到这个url，所以只能先部署API网关，获得到这个地址之后，再重新部署。

部署完成之后，我们可以编写HTML代码，实现可视化的Websocket Client，其核心的JavaScript代码为：

```javascript
window.onload = function () {
    var conn;
    var msg = document.getElementById("msg");
    var log = document.getElementById("log");

    function appendLog(item) {
        var doScroll = log.scrollTop === log.scrollHeight - log.clientHeight;
        log.appendChild(item);
        if (doScroll) {
            log.scrollTop = log.scrollHeight - log.clientHeight;
        }
    }

    document.getElementById("form").onsubmit = function () {
        if (!conn) {
            return false;
        }
        if (!msg.value) {
            return false;
        }
        conn.send(msg.value);
        //msg.value = "";
		
		var item = document.createElement("div");
		item.innerText = "发送↑:";
		appendLog(item);
		
		var item = document.createElement("div");
		item.innerText = msg.value;
		appendLog(item);
		
        return false;
    };

    if (window["WebSocket"]) {
        //替换为websocket连接地址
        conn = new WebSocket("ws://service-01era6ni-1256773370.gz.apigw.tencentcs.com/release/");
        conn.onclose = function (evt) {
            var item = document.createElement("div");
            item.innerHTML = "<b>Connection closed.</b>";
            appendLog(item);
        };
        conn.onmessage = function (evt) {
			var item = document.createElement("div");
			item.innerText = "接收↓:";
			appendLog(item);
		
            var messages = evt.data.split('\n');
            for (var i = 0; i < messages.length; i++) {
                var item = document.createElement("div");
                item.innerText = messages[i];
                appendLog(item);
            }
        };
    } else {
        var item = document.createElement("div");
        item.innerHTML = "<b>Your browser does not support WebSockets.</b>";
        appendLog(item);
    }
};
```

完成之后，我们打开两个页面，进行测试：

![](https://img.serverlesscloud.cn/202058/3-8-5.png)

## 总结

通过云函数 + API网关进行Websocket的实践，绝对不仅仅是一个聊天工具这么简单，他可以用在很多方面，例如通过Websocket进行实时日志系统的制作等。

单独的函数计算，仅仅是一个计算平台，只有和周边的BaaS结合，才能展示出Serverless架构的价值和真正的能力，意义。这也是为什么很多人说Serverless=FaaS+BaaS的一个原因。

期待更多人，可以通过Serverless架构，创造出更多有趣的应用。

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