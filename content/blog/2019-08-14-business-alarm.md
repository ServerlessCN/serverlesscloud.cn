---
title: 如何用 Serverless 定制业务告警功能
description: 在使用云产品的时候，我们可能会需要一些业务告警，本文将告诉你如何快速做一个定制化的告警系统。
keywords: Serverless
date: 2019-08-14
thumbnail: https://img.serverlesscloud.cn/2020414/1586850670017-%E5%B0%81%E9%9D%A2%E5%9B%BE%20%283%29.png
categories:
  - user-stories
authors:
  - Anycodes
authorslink:
  - https://zhuanlan.zhihu.com/ServerlessGo
tags:
  - 业务告警
  - Serverless
---

尽管腾讯云提供了监控告警功能，但并不是「定制化」的。本文将会通过腾讯云云 API 对 Kafka 消息积压数量进行监控（在云监控部分并不提供这个指标的告警），当超过阈值时，通过 Email、企业微信和[短信](https://link.zhihu.com/?target=https%3A//cloud.tencent.com/product/sms%3Ffrom%3D9253)等进行业务告警。

## ▎云 API 对数据进行获取

说到云 API 数据获取部分，非常推荐 Explorer。它能帮我们节省很多力气，本文也是通过 Explorer 来进行鉴权和监控数据获取的工作：

鉴权部分（已去掉了个人 SecretId 和 Key，如果使用请自行添加，但是注意不要泄漏）：

API 2.0 签名地址：[私有网络 签名方法](https://link.zhihu.com/?target=https%3A//cloud.tencent.com/document/product/215/1693%3Ffrom%3D9253)

```javascript
def GetSignature(param):
    # 公共参数
    param["SecretId"] = ""
    param["Timestamp"] = int(time.time())
    param["Nonce"] = random.randint(1, sys.maxsize)
    param["Region"] = "ap-guangzhou"
    # param["SignatureMethod"] = "HmacSHA256"

    # 生成待签名字符串
    sign_str = "GETckafka.api.qcloud.com/v2/index.php?"
    sign_str += "&".join("%s=%s" % (k, param[k]) for k in sorted(param))

    # 生成签名
    secret_key = ""
    if sys.version_info[0] > 2:
        sign_str = bytes(sign_str, "utf-8")
        secret_key = bytes(secret_key, "utf-8")
    hashed = hmac.new(secret_key, sign_str, hashlib.sha1)
    signature = binascii.b2a_base64(hashed.digest())[:-1]
    if sys.version_info[0] > 2:
        signature = signature.decode()

    # 签名串编码
    signature = urllib.parse.quote(signature)
    return signature
```

## ▎获取 Kafka 数据积压量

Kafka 地址文档：[消息队列 CKafka](https://link.zhihu.com/?target=https%3A//cloud.tencent.com/product/ckafka%3Ffrom%3D9253)

获取积压数据的 API：[消息队列 CKafka 获取消费分组 offset](https://link.zhihu.com/?target=https%3A//cloud.tencent.com/document/product/597/30030%3Ffrom%3D9253)

```javascript
def GetGroupOffsets(max_lag, phoneList):
    param = {}
    param["Action"] = "GetGroupOffsets"
    param["instanceId"] = ""
    param["group"] = ""
    signature = GetSignature(param)

    # 生成请求地址
    param["Signature"] = signature
    url = "https://ckafka.api.qcloud.com/v2/index.php?Action=GetGroupOffsets&"
    url += "&".join("%s=%s" % (k, param[k]) for k in sorted(param))

    req_attr = urllib.request.urlopen(url)
    res_data = req_attr.read().decode("utf-8")
    json_data = json.loads(res_data)

    for eve_topic in json_data['data']['topicList']:
        temp_lag = 0
        result_list = []
        for eve_partition in eve_topic["partitions"]:
            lag = eve_partition["lag"]
            temp_lag = temp_lag + lag

        if temp_lag > max_lag:
            result_list.append(
                {
                    "topic": eve_topic["topic"],
                    "lag": lag
                }
            )
        
        print(result_list)
        if len(result_list)>0:
            KafkaLagRobot(result_list)
            KafkaLagSMS(result_list,phoneList)
```

## ▎接入企业微信

先贴一个企业微信机器人地址：[https://work.weixin.qq.com/api/doc#search](https://link.zhihu.com/?target=https%3A//work.weixin.qq.com/api/doc%23search)

通过企业微信机器人配置，可以获得一个 Webhook，编写告警代码：

（已删除企业微信的 webhook，请自行添加到 url 中）

```javascript
def KafkaLagRobot(content):

    url = ""
    data = {
        "msgtype": "markdown",
        "markdown": {
            "content": content,
        }
    }
    data = str(json.dumps(data)).encode("utf-8")
    print(urllib.request.urlopen(urllib.request.Request(url, data)).read().decode("utf-8"))
```

## ▎接入腾讯云短信服务

已脱敏。短信页面地址：[短信 SMS](https://link.zhihu.com/?target=https%3A//cloud.tencent.com/product/sms%3Ffrom%3D9253)

```javascript
def KafkaLagSMS(infor, phone_list):

    random_data = random.randint(1, sys.maxsize)
    url = ""
    strMobile = phone_list
    strAppKey = ""
    strRand = str(random_data)
    strTime = int(time.time())
    sig = hashlib.sha256()
    sig.update(
        ("appkey=%s&random=%s&time=%s&mobile=%s" % (strAppKey, random_data, strTime, ",".join(strMobile))).encode(
            "utf-8"))

    phone_dict = []
    for eve_phone in phone_list:
        phone_dict.append(
            {
                "mobile": eve_phone,
                "nationcode": "86"
            }
        )

    data = {
        "ext": "",
        "extend": "",
        "params": [
            infor,
        ],
        "sig": sig.hexdigest(),
        "sign": "你的sign",
        "tel": phone_dict,
        "time": strTime,
        "tpl_id": 你的模板id
    }
    data = str(json.dumps(data)).encode("utf-8")
    print(urllib.request.urlopen(urllib.request.Request(url=url, data=data)).read().decode("utf-8"))
```

## ▎发送邮件告警

可参考之前的 Demo：[「实践」网站监控脚本的实现](https://zhuanlan.zhihu.com/p/83025871)

```javascript
def sendEmail(content, to_user):
    sender = 'service@anycodes.cn'
    receivers = [to_user]

    mail_msg = content
    message = MIMEText(mail_msg, 'html', 'utf-8')
    message['From'] = Header("监控", 'utf-8')
    message['To'] = Header("站长", 'utf-8')

    subject = "告警"
    message['Subject'] = Header(subject, 'utf-8')

    try:
        smtpObj = smtplib.SMTP_SSL("smtp.exmail.qq.com", 465)
        smtpObj.login('service@anycodes.cn', '密码')
        smtpObj.sendmail(sender, receivers, message.as_string())
    except smtplib.SMTPException:
        pass
```

## ▎整合代码

通过一些逻辑整合所有代码即可：

```javascript
# -*- coding: utf8 -*-
import json
import binascii
import hashlib
import hmac
import random
import sys
import ssl
import time
import urllib.parse
import urllib.request
import smtplib
from email.mime.text import MIMEText
from email.header import Header
ssl._create_default_https_context = ssl._create_unverified_context

def sendEmail(infor):

    temp_str = 'Topic:%s，积压数据量:%d；'
    content = ""
    for eve_infor in infor:
        content = content + temp_str % (eve_infor["topic"], eve_infor["lag"])

    sender = 'service@anycodes.cn'
    receivers = ["service@anycodes.cn"]

    mail_msg = content
    message = MIMEText(mail_msg, 'html', 'utf-8')
    message['From'] = Header("监控", 'utf-8')
    message['To'] = Header("站长", 'utf-8')

    subject = "告警"
    message['Subject'] = Header(subject, 'utf-8')

    try:
        smtpObj = smtplib.SMTP_SSL("smtp.exmail.qq.com", 465)
        smtpObj.login('service@anycodes.cn', '密码')
        smtpObj.sendmail(sender, receivers, message.as_string())
    except smtplib.SMTPException:
        pass

def KafkaLagRobot(infor):
    base_str = "Kafka消费者监控提醒：\n"
    temp_str = '>Topic:<font color="comment">%s</font>，积压数据量:<font color="warning">%d</font>条；\n'
    content = ""
    for eve_infor in infor:
        content = content + temp_str % (eve_infor["topic"], eve_infor["lag"])

    content = base_str + content

    url = ""
    data = {
        "msgtype": "markdown",
        "markdown": {
            "content": content,
        }
    }
    data = str(json.dumps(data)).encode("utf-8")
    print(urllib.request.urlopen(urllib.request.Request(url, data)).read().decode("utf-8"))


def KafkaLagSMS(infor, phone_list):

    temp_str = 'Topic:%s，积压数据量:%d；'
    content = ""
    for eve_infor in infor:
        content = content + temp_str % (eve_infor["topic"], eve_infor["lag"])

    random_data = random.randint(1, sys.maxsize)
    url = ""
    strMobile = phone_list
    strAppKey = ""
    strRand = str(random_data)
    strTime = int(time.time())
    sig = hashlib.sha256()
    sig.update(
        ("appkey=%s&random=%s&time=%s&mobile=%s" % (strAppKey, random_data, strTime, ",".join(strMobile))).encode(
            "utf-8"))

    phone_dict = []
    for eve_phone in phone_list:
        phone_dict.append(
            {
                "mobile": eve_phone,
                "nationcode": "86"
            }
        )

    data = {
        "ext": "",
        "extend": "",
        "params": [
            content,
        ],
        "sig": sig.hexdigest(),
        "sign": "",
        "tel": phone_dict,
        "time": strTime,
        "tpl_id": 
    }
    data = str(json.dumps(data)).encode("utf-8")
    print(urllib.request.urlopen(urllib.request.Request(url=url, data=data)).read().decode("utf-8"))


def GetSignature(param):
    # 公共参数
    param["SecretId"] = ""
    param["Timestamp"] = int(time.time())
    param["Nonce"] = random.randint(1, sys.maxsize)
    param["Region"] = "ap-guangzhou"
    # param["SignatureMethod"] = "HmacSHA256"

    # 生成待签名字符串
    sign_str = "GETckafka.api.qcloud.com/v2/index.php?"
    sign_str += "&".join("%s=%s" % (k, param[k]) for k in sorted(param))

    # 生成签名
    secret_key = ""
    if sys.version_info[0] > 2:
        sign_str = bytes(sign_str, "utf-8")
        secret_key = bytes(secret_key, "utf-8")
    hashed = hmac.new(secret_key, sign_str, hashlib.sha1)
    signature = binascii.b2a_base64(hashed.digest())[:-1]
    if sys.version_info[0] > 2:
        signature = signature.decode()

    # 签名串编码
    signature = urllib.parse.quote(signature)
    return signature


def GetGroupOffsets(max_lag, phoneList):
    param = {}
    param["Action"] = "GetGroupOffsets"
    param["instanceId"] = ""
    param["group"] = ""
    signature = GetSignature(param)

    # 生成请求地址
    param["Signature"] = signature
    url = "https://ckafka.api.qcloud.com/v2/index.php?Action=GetGroupOffsets&"
    url += "&".join("%s=%s" % (k, param[k]) for k in sorted(param))

    req_attr = urllib.request.urlopen(url)
    res_data = req_attr.read().decode("utf-8")
    json_data = json.loads(res_data)

    for eve_topic in json_data['data']['topicList']:
        temp_lag = 0
        result_list = []
        for eve_partition in eve_topic["partitions"]:
            lag = eve_partition["lag"]
            temp_lag = temp_lag + lag

        if temp_lag > max_lag:
            result_list.append(
                {
                    "topic": eve_topic["topic"],
                    "lag": lag
                }
            )
        
        print(result_list)
        if len(result_list)>0:
            KafkaLagRobot(result_list)
            KafkaLagSMS(result_list,phoneList)
            sendEmail(result_list)

def main_handler(event, context):
    # 发送短信的列表
    phone_list = ["PhoneNumber"]
    GetGroupOffsets(2000, phone_list)
    return True
```

## ▎总结

本文主要通过云 API 对云监控数据进行获取，从而得到 Kafka 数据的积压量，进行一个逻辑处理，然后调用了发送邮件、企业微信和短信的方法，实现了监控告警功能。

经过使用时间触发器，效果良好，也成功实现了基本告警功能。

![](https://img.serverlesscloud.cn/tmp/v2-7c335d92d5474175ebd4c7ce9a10c90f_1440w.png)

![](https://img.serverlesscloud.cn/tmp/v2-0f4bd86130c0a5184b3fde2c08dd380d_1440w-20200414185748496.jpg)

不难看出，腾讯云云函数 SCF 是一个非常有趣，而且有价值的产品。

比如说，用户的某个项目，需要临时加一个模块，可以直接通过 SCF 对数据库进行增删改查，增加点逻辑代码，与 [API 网关](https://link.zhihu.com/?target=https%3A//cloud.tencent.com/product/apigateway%3Ffrom%3D9253)结合，便能很快上线，而不用繁琐地修改源代码，开发过程非常愉快。

正确地应用一款产品，或者结合几个产品灵活使用，能让开发者事半功倍。

---

> **传送门：**
>
> - GitHub: [github.com/serverless](https://github.com/serverless/serverless/blob/master/README_CN.md) 
> - 官网：[serverless.com](https://serverless.com/)

欢迎访问：[Serverless 中文网](https://serverlesscloud.cn/)，您可以在 [最佳实践](https://serverlesscloud.cn/best-practice) 里体验更多关于 Serverless 应用的开发！
