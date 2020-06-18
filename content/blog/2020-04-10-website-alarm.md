---
title: Serverless 实战：通过 Serverless 架构实现监控告警
description: Serverless 的一个重要应用场景就是运维、监控与告警，本文将会通过现有的 Serverless 平台，部署一个网站状态监控脚本，对网站的可用性进行监控告警
keywords: Serverless 全局变量组件,Serverless 单独部署组件,Serverless Component
date: 2020-04-10
thumbnail: https://img.serverlesscloud.cn/2020414/1586850670017-%E5%B0%81%E9%9D%A2%E5%9B%BE%20%283%29.png
categories:
  - guides-and-tutorials
  - operations-and-observability
authors:
  - Anycodes
authorslink:
  - https://www.zhihu.com/people/liuyu-43-97
tags:
  - Serverless
  - 监控告警
---

在实际生产中，我们经常需要做一些监控脚本来监控网站服务或者 API 服务是否可用。传统的方法是使用网站监控平台（例如 DNSPod 监控、360 网站服务监控，以及阿里云监控等），它们的原理是通过用户自己设置要监控的服务地址和监测的时间阈值，由监控平台定期发起请求对网站或服务的可用性进行判断。

这些方法很大众化，通用性很强，但也不是所有场景都适合。例如，如果我们的需求是监控网站状态码，不同区域的延时，并且通过监控得到的数据，设定一个阈值，一旦超过阈值就通过邮件等进行统治告警，目前大部分的监控平台是很难满足这些需求的，这时就需要定制开发一个监控工具。

Serverless 服务的一个重要应用场景就是运维、监控与告警，所以本文将会通过现有的 Serverless 平台，部署一个网站状态监控脚本，对目标网站的可用性进行监控告警。

## Web 服务监控告警

针对 Web 服务，我们先设计一个简单的监控告警功能的流程：

![Serverless 实战：通过 Serverless 架构实现监控告警](https://img.serverlesscloud.cn/tmp/04b46b3c01bb58ee12b3a1a903a8955c-20200414224657802.png)

在这个流程中，我们仅对网站的状态码进行监控，即返回的状态为 200，则判定网站可正常使用，否则进行告警：

```python
# -*- coding: utf8 -*-
import ssl
import json
import smtplib
import urllib.request
from email.mime.text import MIMEText
from email.header import Header

ssl._create_default_https_context = ssl._create_unverified_context


def sendEmail(content, to_user):
    sender = 'service@anycodes.cn'
    receivers = [to_user]

    mail_msg = content
    message = MIMEText(mail_msg, 'html', 'utf-8')
    message['From'] = Header(" 网站监控 ", 'utf-8')
    message['To'] = Header(" 站长 ", 'utf-8')

    subject = " 网站监控告警 "
    message['Subject'] = Header(subject, 'utf-8')

    try:
        smtpObj = smtplib.SMTP_SSL("smtp.exmail.qq.com", 465)
        smtpObj.login('发送邮件的邮箱地址', '密码')
        smtpObj.sendmail(sender, receivers, message.as_string())
    except smtplib.SMTPException as e:
        print(e)


def getStatusCode(url):
    return urllib.request.urlopen(url).getcode()


def main_handler(event, context):
    url = "http://www.anycodes.cn"
    if getStatusCode(url) == 200:
        print(" 您的网站 %s 可以访问！" % (url))
    else:
        sendEmail(" 您的网站 %s 不可以访问！" % (url), " 接受人邮箱地址 ")
    return None
```

通过 ServerlessFramework 可以部署，在部署的时候可以增加时间触发器：

```yaml
MyWebMonitor:
  component: "@serverless/tencent-scf"
  inputs:
    name: MyWebMonitor
    codeUri: ./code
    handler: index.main_handler
    runtime: Python3.6
    region: ap-guangzhou
    description: 网站监控
    memorySize: 64
    timeout: 20
    events:
      - timer:
          name: timer
          parameters:
            cronExpression: '*/5 * * * *'
            enable: true
```

在这里，timer 表示时间触发器，`cronExpression`是表达式：

创建定时触发器时，用户能够使用标准的 Cron 表达式的形式自定义何时触发。定时触发器现已推出秒级触发功能，为了兼容老的定时触发器，因此 Cron 表达式有两种写法。

#### Cron 表达式语法一（推荐）

Cron 表达式有七个必需字段，按空格分隔。
![Serverless 实战：通过 Serverless 架构实现监控告警](https://img.serverlesscloud.cn/tmp/3d2012b3e31f0ef92694e60870d4d213-20200414224748091.png)
其中，每个字段都有相应的取值范围：

![Serverless 实战：通过 Serverless 架构实现监控告警](https://img.serverlesscloud.cn/tmp/f615f5ee168e2330c26ece95e047e57b-20200414224752288.png)

#### Cron 表达式语法二（不推荐）

Cron 表达式有五个必需字段，按空格分隔。
![Serverless 实战：通过 Serverless 架构实现监控告警](https://img.serverlesscloud.cn/tmp/a708facdd3ebb1064a3004876c7867fa-20200414224759391.png)
其中，每个字段都有相应的取值范围：
![Serverless 实战：通过 Serverless 架构实现监控告警](https://img.serverlesscloud.cn/tmp/906d03b9aa5873296cf484b1082e3028-20200414224804297.png)

#### 通配符

![Serverless 实战：通过 Serverless 架构实现监控告警](https://img.serverlesscloud.cn/tmp/0c89cf5d5d9f23d1ab9ffefe34442d7f-20200414224811024.png)

#### 注意事项

在 Cron 表达式中的“日”和“星期”字段同时指定值时，两者为“或”关系，即两者的条件分别均生效。

#### 示例

`*/5 * * * * * *` 表示每 5 秒触发一次
`0 0 2 1 * * *` 表示在每月的 1 日的凌晨 2 点触发
`0 15 10 * * MON-FRI *` 表示在周一到周五每天上午 10：15 触发
`0 0 10,14,16 * * * *` 表示在每天上午 10 点，下午 2 点，4 点触发
`0 */30 9-17 * * * *` 表示在每天上午 9 点到下午 5 点内每半小时触发
`0 0 12 * * WED *` 表示在每个星期三中午 12 点触发

因此，我们上面的代码可以认为是每 5 秒触发一次，当然，也可以根据网站监控密度，自定义设置触发的间隔时间。当我们网站服务不可用时，就可以收到告警：

![Serverless 实战：通过 Serverless 架构实现监控告警](https://img.serverlesscloud.cn/tmp/cd721942167b4dd24203b2b4423e1a7d-20200414224821171.png)

这种网站监控方法比较简单，准确度可能会有问题，对于网站或服务的监控不能简单的看返回值，还要看链接耗时、下载耗时以及不同区域、不同运营商访问网站或者服务的延时信息等。

所以，我们需要对这个代码进行额外的更新与优化：

1. 通过在线网速测试的网站，抓包获取不同地区不同运营商的请求特征；
2. 编写爬虫程序，进行在线网速测试模块的编写；
3. 集成到刚刚的项目中；

下面以站长工具网站中国内网站测速工具 为例，通过网页查阅相关信息。

对网站测速工具进行封装，例如：

![Serverless 实战：通过 Serverless 架构实现监控告警](https://img.serverlesscloud.cn/tmp/41b63003462e9b7c6837c6cf45db3a37-20200414224826020.png)

通过对网页进行分析，获取请求特征，包括 Url，Form data，以及 Headers 等相关信息，其中该网站在使用不同监测点对网站进行请求时，是通过 Form data 中的 guid 的参数实现的，例如部分监测点的 guid：

```text
广东佛山	电信	f403cdf2-27f8-4ccd-8f22-6f5a28a01309
江苏宿迁	多线	74cb6a5c-b044-49d0-abee-bf42beb6ae05
江苏常州	移动	5074fb13-4ab9-4f0a-87d9-f8ae51cb81c5
浙江嘉兴	联通	ddfeba9f-a432-4b9a-b0a9-ef76e9499558
```

此时，我们可以编写基本的爬虫代码，来对 Response 进行初步解析，以`62a55a0e-387e-4d87-bf69-5e0c9dd6b983 江苏宿迁 [电信]`为例，编写代码：

```python
import urllib.request
import urllib.parse

url = "* 某测速网站地址 *"
form_data = {
    'guid': '62a55a0e-387e-4d87-bf69-5e0c9dd6b983',
    'host': 'anycodes.cn',
    'ishost': '1',
    'encode': 'ECvBP9vjbuXRi0CVhnXAbufDNPDryYzO',
    'checktype': '1',
}
headers = {
    'Host': 'tool.chinaz.com',
    'Origin': '* 某测速网站地址 *',
    'Referer': '* 某测速网站地址 *',
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.108 Safari/537.36',
    'X-Requested-With': 'XMLHttpRequest'
}

print(urllib.request.urlopen(
    urllib.request.Request(
        url=url,
        data=urllib.parse.urlencode(form_data).encode('utf-8'),
        headers=headers
    )
).read().decode("utf-8"))

```

获得结果：

```json
({
	state: 1,
	msg: '',
	result: {
		ip: '119.28.190.46',
		httpstate: 200,
		alltime: '212',
		dnstime: '18',
		conntime: '116',
		downtime: '78',
		filesize: '-',
		downspeed: '4.72',
		ipaddress: '新加坡新加坡',
		headers: 'HTTP/1.1 200 OK br>Server: ...',
		pagehtml: ''
	}
})

```

在这个结果中，我们可以提取部分数据，例如江苏宿迁 [电信] 访问目标网站的基础数据：

```text
总耗时：alltime:'212'
链接耗时：conntime:'116'
下载耗时：downtime:'78'

```

此时，我们可以改造代码对更多的节点，进行测试：

```text
江苏宿迁 [电信]	总耗时:223	链接耗时:121	下载耗时:81
广东佛山 [电信]	总耗时:44	链接耗时:27	下载耗时:17
广东惠州 [电信]	总耗时:56	链接耗时:34	下载耗时:22
广东深圳 [电信]	总耗时:149	链接耗时:36	下载耗时:25
浙江湖州 [电信]	总耗时:3190	链接耗时:3115	下载耗时:75
辽宁大连 [电信]	总耗时:468	链接耗时:255	下载耗时:170
江苏泰州 [电信]	总耗时:180	链接耗时:104	下载耗时:69
安徽合肥 [电信]	总耗时:196	链接耗时:110	下载耗时:73
...

```

并对项目中的 index.py 进行代码修改：

```python
# -*- coding: utf8 -*-
import ssl
import json
import re
import socket
import smtplib
import urllib.request
from email.mime.text import MIMEText
from email.header import Header

socket.setdefaulttimeout(2.5)
ssl._create_default_https_context = ssl._create_unverified_context

def getWebTime():

    final_list = []
    final_status = True

    total_list = '''62a55a0e-387e-4d87-bf69-5e0c9dd6b983 江苏宿迁 [电信]
    f403cdf2-27f8-4ccd-8f22-6f5a28a01309 广东佛山 [电信]
    5bea1430-f7c2-4146-88f4-17a7dc73a953 河南新乡 [多线]
    1f430ff0-eae9-413a-af2a-1c2a8986cff0 河南新乡 [多线]
    ea551b59-2609-4ab4-89bc-14b2080f501a 河南新乡 [多线]
    2805fa9f-05ea-46bc-8ac0-1769b782bf52 黑龙江哈尔滨 [联通]
    722e28ca-dd02-4ccd-a134-f9d4218505a5 广东深圳 [移动]
8e7a403c-d998-4efa-b3d1-b67c0dfabc41 广东深圳 [移动]'''

    url = "* 某测速网站地址 *"
    for eve in total_list.split('\n'):
        id_data, node_name = eve.strip().split(" ")
        form_data = {
            'guid': id_data,
            'host': 'anycodes.cn',
            'ishost': '1',
            'encode': 'ECvBP9vjbuXRi0CVhnXAbufDNPDryYzO',
            'checktype': '1',
        }
        headers = {
            'Host': '* 某测速网站地址 *',
            'Origin': '* 某测速网站地址 *',
            'Referer': '* 某测速网站地址 *',
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.108 Safari/537.36',
            'X-Requested-With': 'XMLHttpRequest'
        }
        try:
            result_data = urllib.request.urlopen(
                urllib.request.Request(
                    url=url,
                    data=urllib.parse.urlencode(form_data).encode('utf-8'),
                    headers=headers
                )
            ).read().decode("utf-8")
            try:
                alltime = re.findall("alltime:'(.*?)'", result_data)[0]
                conntime = re.findall("conntime:'(.*?)'", result_data)[0]
                downtime = re.findall("downtime:'(.*?)'", result_data)[0]
                final_string = "%s\t 总耗时:%s\t 链接耗时:%s\t 下载耗时:%s" % (node_name, alltime, conntime, downtime)
            except:
                final_string = "%s 链接异常！" % (node_name)
                final_status = False
        except:
            final_string = "%s 链接超时！" % (node_name)
            final_status = False
        final_list.append(final_string)
        print(final_string)
    return (final_status,final_list)
def sendEmail(content, to_user):
    sender = 'service@anycodes.cn'
    receivers = [to_user]
    mail_msg = content
    message = MIMEText(mail_msg, 'html', 'utf-8')
    message['From'] = Header(" 网站监控 ", 'utf-8')
    message['To'] = Header(" 站长 ", 'utf-8')
    subject = " 网站监控告警 "
    message['Subject'] = Header(subject, 'utf-8')
    try:
        smtpObj = smtplib.SMTP_SSL("smtp.exmail.qq.com", 465)
        smtpObj.login('service@anycodes.cn', '密码')
        smtpObj.sendmail(sender, receivers, message.as_string())
    except smtplib.SMTPException:
        pass

def getStatusCode(url):
    return urllib.request.urlopen(url).getcode()

def main_handler(event, context):
    url = "http://www.anycodes.cn"
    final_status,final_list = getWebTime()
    if not final_status:
        sendEmail(" 您的网站 %s 的状态：<br>%s" % (url, "<br>".join(final_list)), "service@52exe.cn")

```

由于本文是以学习为主，所以我们将节点列表进行缩减，只保留几个。通过部署，可得到结果：

![Serverless 实战：通过 Serverless 架构实现监控告警](https://img.serverlesscloud.cn/tmp/eae0f89c3cb3c61b87841d62424e1322-20200414224848415.png)

告警的灵敏度和监控的频率，在实际生产过程中可以根据自己的需求进行调整。

## 云服务监控告警

前文，我们对网站状态以及健康等信息进行了监控与告警，在实际的生产运维中，还需要对服务进行监控，例如在使用 Hadoop、Spark 的时候对节点的健康进行监控，在使用 K8S 的时候对 API 网关、ETCD 等多维度的指标进行监控，在使用 Kafka 的时候，对数据积压量，以及 Topic、Consumer 等进行监控…

而这些服务的监控，往往不能通过简单的 URL 以及某些状态来进行判断。传统运维的做法是在额外的机器上设置一个定时任务，对相关的服务进行旁路监控。而在本文中，我们则通过 Serverless 技术，对云产品进行相关的监控与告警。

在使用云上的 Kafka 时，我们通常要看数据积压量，因为如果 Consumer 集群挂掉了，或者消费能力突然降低导致数据积压，很可能会对服务产生不可预估的影响，这个时候对 Kafka 的数据积压量进行监控告警，就显得额外重要。

本文以监控腾讯云的 Ckafka 为例进行实践，并通过多个云产品进行组合（包括云监控、Ckafka、云 API 以及云短信等）来实现短信告警、邮件告警以及企业微信告警功能。

首先，可以设计简单的流程图：

![Serverless 实战：通过 Serverless 架构实现监控告警](https://img.serverlesscloud.cn/tmp/a62c48d5aae15c7ab86cafe972024b25-20200414224854871.png)

在开始项目之前，我们要准备一些基础的模块：

- Kafka 数据积压量获取模块：

```python
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

```

- 接入企业微信机器人模块：

```python
def KafkaLagRobot(content):
    url = ""
    data = {
        "msgtype": "markdown",
        "markdown": {
            "content": content,
        }
    }
    data = json.dumps(data).encode("utf-8")
    req_attr = urllib.request.Request(url, data)
    resp_attr = urllib.request.urlopen(req_attr)
    return_msg = resp_attr.read().decode("utf-8")

```

- 接入腾讯云短信服务模块：

```python
def KafkaLagSMS(infor, phone_list):
    url = ""
    strMobile = phone_list
    strAppKey = ""
    strRand = str(random.randint(1, sys.maxsize))
    strTime = int(time.time())
    strSign = "appkey=%s&random=%s&time=%s&mobile=%s" % (strAppKey, strRand, strTime, ",".join(strMobile))
    sig = hashlib.sha256()
    sig.update(strSign.encode("utf-8"))

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
        "sign": " 你的 sign",
        "tel": phone_dict,
        "time": strTime,
        "tpl_id": 你的模板 id
    }
    data = json.dumps(data).encode("utf-8")
    req_attr = urllib.request.Request(url=url, data=data)
    resp_attr = urllib.request.urlopen(req_attr)
    return_msg = resp_attr.read().decode("utf-8")

```

- 发送邮件告警模块：

```python
def sendEmail(content, to_user):
    sender = 'service@anycodes.cn'
    message = MIMEText(content, 'html', 'utf-8')
    message['From'] = Header(" 监控 ", 'utf-8')
    message['To'] = Header(" 站长 ", 'utf-8')
    message['Subject'] = Header(" 告警 ", 'utf-8')
    try:
        smtpObj = smtplib.SMTP_SSL("smtp.exmail.qq.com", 465)
        smtpObj.login('service@anycodes.cn', '密码')
        smtpObj.sendmail(sender, [to_user], message.as_string())
    except smtplib.SMTPException as e:
        logging.debug(e)

```

完成模块编写，和上面的方法一样，进行项目部署。部署成功之后进行测试，测试可看到功能可用：

- 短信告警样式：

![Serverless 实战：通过 Serverless 架构实现监控告警](https://img.serverlesscloud.cn/tmp/1dc5a98c27e4144a40ad6fdd0c4c32ea-20200414224913619.png)

- 企业微信告警样式：

![Serverless 实战：通过 Serverless 架构实现监控告警](https://img.serverlesscloud.cn/tmp/24e1181cc5015f96cf9f6cce437fccf6-20200414224916951.png)

## 总结

通过本文的实践，希望读者可以了解到 Serverless 相关产品在运维行业中的基本应用，尤其是监控告警的基本使用方法和初步灵感。设计一个网站监控程序实际上是一个很初级的入门场景，希望大家可以将更多的监控告警功与 Serverless 技术进行结合，例如监控自己的 MySQL 压力情况、监控已有服务器的数据指标等，通过对这些指标的监控告警，不仅仅可以让管理者及时发现服务的潜在风险，也可以通过一些自动化流程实现项目的自动化运维。

通过本场景实践，我们也可以对项目进行额外的优化或者应用在不同的领域以及场景中。例如，我们可以通过增加短信告警、微信告警、企业微信告警等多个维度，来确保相关人员可以及时收到告警信息；我们也可以通过监控某个小说网站、视频网站等，看到我们关注的小说或者视频的更新情况，便于追更等。



---
<div id='scf-deploy-iframe-or-md'></div>

---

> **传送门：**
> - GitHub: [github.com/serverless](https://github.com/serverless/serverless/blob/master/README_CN.md)
> - 官网：[serverless.com](https://serverless.com/)

欢迎访问：[Serverless 中文网](https://serverlesscloud.cn/)，您可以在 [最佳实践](https://serverlesscloud.cn/best-practice) 里体验更多关于 Serverless 应用的开发！
