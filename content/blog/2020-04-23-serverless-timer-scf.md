---
title: 万物皆可 Serverless 之使用云函数 Timer 触发器实现每天自动定时打卡
description: 本文并不探讨如何编写自动化的操作脚本，而是和大家介绍一下如何使用腾讯云函数的 Timer 触发器实现定时任务，来快速、稳定、低成本地实现一些 fancy 的操作。
keywords: Serverless,云函数触发器,Serverless应用
date: 2020-04-23
thumbnail: https://img.serverlesscloud.cn/202068/1591592316812-13ui2js5xx.png
categories:
  - user-stories
authors:
  - 乂乂又又
authorslink:
  - https://cloud.tencent.com/developer/article/1612169
tags:
  - Serverless
  - 云函数
---


不晓得大家有没有遇到过定时打卡的需求，比如商品秒杀，火车票定时开售、每日健康打卡等。这时候我们往往可以通过一些技术手段，编写一些自动化操作的脚本，来实现定时自动打卡的操作。

当然本文并不探讨如何编写自动化的操作脚本，而是和大家介绍一下如何使用腾讯云函数的 Timer 触发器实现定时任务，来快速、稳定、低成本地实现一些 fancy 的操作（~~骚操作~~）

## 效果展示

- 每日健康信息自动更新

![每日健康信息自动更新](https://img.serverlesscloud.cn/2020523/1590200988950-16202.jpg)

- 每日定时数据报告

![每日定时数据报告](https://img.serverlesscloud.cn/2020523/1590200988990-16202.jpg)

可以看到，定时任务搭配邮箱发送云函数运行结果，用起来还是蛮舒服的，还可以给自己做一个每日科技资讯推送、数据报告之类的小玩意，自娱自乐。其他的用途请大家大开脑洞，自行脑补吧~

## 实战教程

### 1. 新建云函数

![新建函数](https://img.serverlesscloud.cn/2020523/1590200988916-16202.jpg)

运行环境我们选择 python3，模板函数选择定时拨测，然后点击下一步

![定时拨测模板函数](https://img.serverlesscloud.cn/2020523/1590200988919-16202.jpg)

模板函数的描述里写着「本示例代码的功能是定时拨测 URL 列表中的地址，并通过邮件发送告警」

而这正是我们想要的实现的功能，不过这个模板函数的邮件发送有点问题，我们稍后会详细说明

### 2. 模板函数分析

下面我们来分析一下这段示例代码

```javascript
# -*- coding: utf8 -*-
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)) + "/..")

import logging
import json
import requests
from email.mime.text import MIMEText
from email.header import Header
import smtplib

logger = logging.getLogger()
logger.setLevel(logging.DEBUG)

# Third-party SMTP service for sending alert emails. 第三方 SMTP 服务，用于发送告警邮件
mail_host = "smtp.qq.com"       # SMTP server, such as QQ mailbox, need to open SMTP service in the account. SMTP服务器,如QQ邮箱，需要在账户里开启SMTP服务
mail_user = "XXXXXXXXX@qq.com"  # Username 用户名
mail_pass = "****************"  # Password, SMTP service password. 口令，SMTP服务密码
mail_port = 465  # SMTP service port. SMTP服务端口

# The URL address need to dial test. 需要拨测的URL地址
test_url_list = [
    "http://www.baidu.com",
    "http://www.qq.com",
    "http://wrong.tencent.com",
    "http://unkownurl.com"
]

# The notification list of alert emails. 告警邮件通知列表
email_notify_list = {
    "XXXXXXXXX@qq.com",
    "XXXXXXXXX@qq.com"
}


def sendEmail(fromAddr, toAddr, subject, content):
    sender = fromAddr
    receivers = [toAddr]
    message = MIMEText(content, 'plain', 'utf-8')
    message['From'] = Header(fromAddr, 'utf-8')
    message['To'] = Header(toAddr, 'utf-8')
    message['Subject'] = Header(subject, 'utf-8')
    try:
        smtpObj = smtplib.SMTP_SSL(mail_host, mail_port)
        smtpObj.login(mail_user, mail_pass)
        smtpObj.sendmail(sender, receivers, message.as_string())
        print("send email success")
        return True
    except smtplib.SMTPException as e:
        print(e)
        print("Error: send email fail")
        return False


def test_url(url_list):
    errorinfo = [serverless]
    for url in url_list:
        resp = None
        try:
            resp = requests.get(url, timeout=3)
            print (resp)
        except (
        requests.exceptions.Timeout, requests.exceptions.ConnectionError, requests.exceptions.ConnectTimeout) as e:
            logger.warn("request exceptions:" + str(e))
            errorinfo.append("Access " + url + " timeout")
        else:
            if resp.status_code >= 400:
                logger.warn("response status code fail:" + str(resp.status_code))
                errorinfo.append("Access " + url + " fail, status code:" + str(resp.status_code))
    if len(errorinfo) != 0:
        body = "\r\n".join(errorinfo)
        subject = "Please note: PlayCheck Error"
        for toAddr in email_notify_list:
            print ("send message [%s] to [%s]" % (body, toAddr))
            sendEmail(mail_user, toAddr, subject, body)


def main_handler(event, context):
    test_url(test_url_list)


if __name__ == '__main__':
    main_handler("", "")
```

这里要讲一下云函数的执行入口，

这个模板函数的默认入口是 `main\_handler(event, context)` 这个函数，

这个入口函数是可以自行配置的，具体配置方法可以翻看官方的文档

```javascript
def main_handler(event, context):
    test_url(test_url_list)
```

另外这里的 py 文件的主函数入口，实际上是可以缺省的。这里加上应该是为了方便本地调试和运行函数。

```javascript
if __name__ == '__main__':
    main_handler("", "")
```

然后看一下依赖库的导入部分

```javascript
import requests
from email.mime.text import MIMEText
from email.header import Header
import smtplib
```

注意到有 `import requests`，但本地文件并没有 requests 库，说明腾讯云函数的运行环境中已经安装了 requests 库，并不需要我们再手动上传添加 requests 依赖。

```javascript
def test_url(url_list):
    errorinfo = [serverless]
    for url in url_list:
        resp = None
        try:
            resp = requests.get(url, timeout=3)
            print (resp)
        except (
        requests.exceptions.Timeout, requests.exceptions.ConnectionError, requests.exceptions.ConnectTimeout) as e:
            logger.warn("request exceptions:" + str(e))
            errorinfo.append("Access " + url + " timeout")
        else:
            if resp.status_code >= 400:
                logger.warn("response status code fail:" + str(resp.status_code))
                errorinfo.append("Access " + url + " fail, status code:" + str(resp.status_code))
    if len(errorinfo) != 0:
        body = "\r\n".join(errorinfo)
        subject = "Please note: PlayCheck Error"
        for toAddr in email_notify_list:
            print ("send message [%s] to [%s]" % (body, toAddr))
            sendEmail(mail_user, toAddr, subject, body)
```

这里的 `test\_url` 函数的思路非常清晰，首先请求 `url\_list` 内的目标网页，如果请求超时或者出现错误码就会记录下 errorinfo。

当 errorinfo 列表非空时，也就是有链接的访问出现问题时就会调用 `sendEmail` 函数

```javascript
def sendEmail(fromAddr, toAddr, subject, content):
    sender = fromAddr
    receivers = [toAddr]
    message = MIMEText(content, 'plain', 'utf-8')
    message['From'] = Header(fromAddr, 'utf-8')
    message['To'] = Header(toAddr, 'utf-8')
    message['Subject'] = Header(subject, 'utf-8')
    try:
        smtpObj = smtplib.SMTP_SSL(mail_host, mail_port)
        smtpObj.login(mail_user, mail_pass)
        smtpObj.sendmail(sender, receivers, message.as_string())
        print("send email success")
        return True
    except smtplib.SMTPException as e:
        print(e)
        print("Error: send email fail")
        return False
```

`sendEmail` 函数负责登录邮箱并发送 errorinfo 邮件提醒

```javascript
smtpObj = smtplib.SMTP_SSL(mail_host, mail_port)
smtpObj.login(mail_user, mail_pass)
smtpObj.sendmail(sender, receivers, message.as_string())
```

下面我们再看一下云函数的配置文件

![定时器配置](https://img.serverlesscloud.cn/2020523/1590200988919-16202.jpg)

注意图中画红圈的部分

```javascript
"CronExpression": "* */1 * * * * *",
```

这是 Cron 表达式，用来描述定时任务开始执行时间用的，这里的 `\* \*/1 \* \* \* \* \*` 表示每分钟执行一次云函数，以达到网站监控拨测的功能。有关 Cron 表达式的具体用法可翻阅腾讯云官方文档。

以上就是整个拨测示例云函数的工作流程。下面就让我们来照葫芦画瓢编写自己的云函数吧。

### 3. 请求数据分析

喜闻乐见的抓包环节，看看打卡的时候时手机应用都和服务器交流了些啥

![应用数据首页](https://img.serverlesscloud.cn/2020523/1590200989018-16202.jpg)

点进去看一下

![登陆应用](https://img.serverlesscloud.cn/2020523/1590200989007-16202.jpg)

OK，这里我们已经看到了应用的登录过程，这里提交了 `username`，`password` 和 `type` 三个参数，分别对应我们的用户名，登陆密码和用户类型，后面我们只需要把这些数据重新发送给服务器就可以模拟登陆 App 了

![提交信息](https://img.serverlesscloud.cn/2020523/1590200989530-16202.jpg)

这里就是向服务器发送我们填写的健康信息，一会我们再把这些信息一股脑再重新抛给服务器就好了

### 4. 编写云函数

根据上面的分析，直接上代码

```javascript
def myHealth(user, pwd, email):
    errorinfo = [serverless]
    s = requests.Session()  # 新建一个request对象
    data = {  # 登陆信息
        'username': user,
        'password': pwd,
        'type': 'student',
    }
    r = s.post(server+'/authentication/login', json=data)  # 登录
    if r.json()['ok']:
        errorinfo.append('登陆成功')
    else:
        s.close()
        errorinfo.append('登陆失败')
        return
    data = {  # 健康信息
        "home": "在家",
        "address": "",
        "keepInHome": "否",
        "keepInHomeDate": 'null',
        "contact": "否",
        "health": "否",
        "familyNCP": "否",
        "fever": "否",
        "feverValue": "",
        "cough": "否",
        "diarrhea": "否",
        "homeInHubei": "否",
        "arriveHubei": "无",
        "travel": "无",
        "remark": "无",
        "submitCount": '0'
    }
    r = s.post(server+'/student/healthInfo/save', json=data)  # 提交健康信息
    if r.json()['ok']:
        errorinfo.append('提交健康信息成功')
    else:
        errorinfo.append('提交健康信息失败：'+r.json()['message'])
    s.close()  # 关闭连接
    emailTask(errorinfo, email)  # 发送邮件
```

嗯，替换一下模板函数里面的 `test\_url` 函数就 ok 了

不过前面我有提到邮件发送有问题，下面我们来看下 sendemai 函数里邮件内容编码部分

```javascript
    message['From'] = Header(fromAddr, 'utf-8')
    message['To'] = Header(toAddr, 'utf-8')
    message['Subject'] = Header(subject, 'utf-8')
```

这里的收件人，发件人和主题信息都经过了 `Header(string, 'utf-8')` 来编码。不过在我用 163 邮箱发信时，这种方法只能自己给自己的邮箱发邮件，给别人发会被邮件系统当成垃圾邮件发送失败。所以如果你需要给其他邮箱发邮件的话，这里需要去掉编码，改成

```javascript
    message['From'] = fromAddr
    message['To'] = toAddr
    message['Subject'] = subject
```

这样就可以正常发送邮件了

### 5. 设置触发器

OK，我们把修改好的云函数保存一下

![配置函数](https://img.serverlesscloud.cn/2020523/1590200989387-16202.jpg)

然后把内存改到 64mb，超时时间给个 3s 即可

![添加触发器](https://img.serverlesscloud.cn/2020523/1590200989419-16202.jpg)

最后添加定时触发器，这里我们选择自定义触发周期。

Cron 表达式 `0 0 6 \* \* \* \* ` 代表每天早上 6 点触发一次，注意千万不要写成 `\* \* 6 \* \* \* \* `，不然将会在每天的 6-7 点内每秒触发一次。这样的话就，画面太美不敢想象，哈哈哈 ~

## 写在最后

以上，想必现在你已经 get 了如何使用 Timer 触发器来触发云函数了，何不赶快自己动手尝试一下呢？

发挥你的想象力，试着做些有趣又有用的小东西吧！本文仅供学习交流之用途，不要学来干坏事哦~



---
<div id='scf-deploy-iframe-or-md'></div>

---

> **传送门：**
> - GitHub: [github.com/serverless](https://github.com/serverless/serverless/blob/master/README_CN.md)
> - 官网：[serverless.com](https://serverless.com/)

欢迎访问：[Serverless 中文网](https://serverlesscloud.cn/)，您可以在 [最佳实践](https://serverlesscloud.cn/best-practice) 里体验更多关于 Serverless 应用的开发！
