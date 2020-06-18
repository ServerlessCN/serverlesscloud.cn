---
title: 万物皆可 Serverless 之使用 SCF+COS 给未来写封信
description: 这次我带大家一起来使用无服务器云函数 SCF 和对象存储 COS，快速开发一个属于自己的给未来写封信应用。
keywords: Serverless,Serverless云函数,Serverless应用
date: 2020-04-13
thumbnail: https://img.serverlesscloud.cn/2020523/1590214762633-2404.jpg
categories:
  - user-stories
authors:
  - 乂乂又又
authorslink:
  - https://cloud.tencent.com/developer/article/1618588
tags:
  - 云函数
  - 对象存储
---


或许你有用过或者听说过《给未来写封信》，这是由全知工坊开发的一款免费应用，你可以在此刻给自己或他人写下一封信，然后选择在未来的某一天寄出，想必那时收到信的人看着这封来自过往的信时一定会十分感动吧。

这次我就带大家一起来使用无服务器云函数 SCF 和对象存储 COS，快速开发一个属于自己的「给未来写封信」应用。

## 效果展示

写下一封信，然后投递：

![写下一封信，然后投递](https://img.serverlesscloud.cn/2020523/1590214762613-2404.jpg)

一封来自很久以前的信：

![一封来自很久以前的信](https://img.serverlesscloud.cn/2020523/1590214762631-2404.jpg)

写给未来的自己

![写给未来的自己](https://img.serverlesscloud.cn/2020523/1590214762627-2404.jpg)

你也可以访问[letter.idoo.top/letter](http://letter.idoo.top/letter)来亲自体验一下（仅供测试之用，不保证服务一直可用）

## 操作步骤

### 第一步：新建 python 云函数

参见我之前的系列文章[《万物皆可 Serverless 之使用 SCF+COS 快速开发全栈应用》](https://serverlesscloud.cn/blog/2020-04-23-serverless-scf-cos/)

### 第二步：编写云函数

> Life is short, show me the code.

老规矩，直接上代码

```javascript
import json
import datetime
import random
from email.mime.text import MIMEText
from email.header import Header
import smtplib

# 是否开启本地debug模式
debug = False

# 腾讯云对象存储依赖
if debug:
    from qcloud_cos import CosConfig
    from qcloud_cos import CosS3Client
    from qcloud_cos import CosServiceError
    from qcloud_cos import CosClientError
else:
    from qcloud_cos_v5 import CosConfig
    from qcloud_cos_v5 import CosS3Client
    from qcloud_cos_v5 import CosServiceError
    from qcloud_cos_v5 import CosClientError

# 配置存储桶
appid = '66666666666'
secret_id = 'xxxxxxxxxxxxxxx'
secret_key = 'xxxxxxxxxxxxxxx'
region = 'ap-chongqing'
bucket = 'name'+'-'+appid

#配置发件邮箱
mail_host = "smtp.163.com"
mail_user = "xxxxxxxxxx@163.com"
mail_pass = "xxxxxxxxxxxxxx"
mail_port = 465

# 对象存储实例
config = CosConfig(Secret_id=secret_id, Secret_key=secret_key, Region=region)
client = CosS3Client(config)

#smtp邮箱实例
smtpObj = smtplib.SMTP_SSL(mail_host, mail_port)

# cos 文件读写
def cosRead(key):
    try:
        response = client.get_object(Bucket=bucket, Key=key)
        txtBytes = response['Body'].get_raw_stream()
        return txtBytes.read().decode()
    except CosServiceError as e:
        return ""


def cosWrite(key, txt):
    try:
        response = client.put_object(
            Bucket=bucket,
            Body=txt.encode(encoding="utf-8"),
            Key=key,
        )
        return True
    except CosServiceError as e:
        return False

#获取所有信件
def getletters():
    letterMap = {}
    letterTxt = cosRead('letters.txt')  # 读取数据
    if len(letterTxt) > 0:
        letterMap = json.loads(letterTxt)
    return letterMap

#添加信件
def addletter(date, email, letter):
    letterMap = getletters()
    if len(letterMap) > 0:
        letterMap[date+'_'+randomKey()] = email+'|'+letter
    return cosWrite('letters.txt', json.dumps(letterMap, ensure_ascii=False)) if len(letterMap) > 0 else False

#删除信件
def delletter(letter):
    letterMap = getletters()
    if len(letterMap) > 0:
        letterMap.pop(letter)
    return cosWrite('letters.txt', json.dumps(letterMap, ensure_ascii=False)) if len(letterMap) > 0 else False


# 获取今日日期
def today():
    return datetime.datetime.now().strftime("%Y-%m-%d")

# 判断信件是否到期
def checkDate(t):
    return t[0:10] == today()

# 根据时间生成uuid
def randomKey():
    return ''.join(random.sample('zyxwvutsrqponmlkjihgfedcba0123456789', 6))

# api网关回复消息格式化
def apiReply(reply, html=False, code=200):
    htmlStr = r'''<!DOCTYPE html>
<html lang="zh-cn">

<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <title>给未来的自己写封信</title>
    <style>
        html,
        body {
            padding: 0px;
            margin: 0px;
            height: 100vh;
        }

        .main {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
        }

        .main_phone {
            display: flex;
            flex-direction: column;
            justify-content: start;
            align-items: center;
        }
    </style>
</head>

<body id='body'>
    <div class="main" style="width: 80vw;">
        <div style="height: 5vh;"></div>
        <div id='letter_top'>
            <p style="text-align: center;">开始写信</p>
            <wired-textarea id="letter" style="height: 320px;width: 300px;" placeholder="此刻平静地写下一封信,给未来的自己一份温暖..." elevation="6" rows="14"></wired-textarea>
        </div>
        <div style="display: flex;align-items: center;justify-content: center;">
            <div id='letter_left'>
                <p style="text-align: center;">开始写信</p>
                <wired-textarea id="letter" style="height: 320px;width: 300px;" placeholder="此刻平静地写下一封信,给未来的自己一份温暖..." elevation="6" rows="14"></wired-textarea>
            </div>
            <div style="width: 16px;"></div>
            <div>
                <p style="text-align: center;">送信日期</p>
                <wired-calendar id="calendar"></wired-calendar>
            </div>
        </div>
        <wired-divider style="margin: 16px 0;"></wired-divider>
        <p id="hitokoto"></p>
        <div>
            <wired-input id="email" placeholder="收件邮箱"></wired-input>
            <wired-button onclick="send()">投递</wired-button>
        </div>
        <div style="height: 5vh;"></div>
    </div>
    <script>
        let datex = '';
        let myEmail = document.getElementById('email');
        let myLetter = document.getElementById('letter');
        let myCalendar = document.getElementById('calendar');

        let width =
            window.innerWidth ||
            document.documentElement.clientWidth ||
            document.body.clientWidth

        let height =
            window.innerHeight ||
            document.documentElement.clientHeight ||
            document.body.clientHeight

        let pc = width >= height

        let today = new Date();
        let info = today.toString().split(' ');
        let selected = `${info[1]} ${today.getDate()}, ${today.getFullYear()}`;

        document.getElementById('body').classList.add(pc ? 'main' : 'main_phone');
        document.getElementById('letter_left').style.display = pc ? 'block' : 'none';
        document.getElementById('letter_top').style.display = pc ? 'none' : 'block';
        myCalendar.setAttribute("selected", selected);
        myCalendar.addEventListener('selected', () => {
            let selectedObject = myCalendar.value;
            let date = new Date(new Date().setDate(selectedObject.date.getDate()));
            datex = date.toISOString().substr(0, 10);
        });

        function send() {
            if (datex.length < 1 || myEmail.value.length < 1 || myLetter.value.length < 1) {
                alert('信件内容、送信日期或投递邮箱不能为空');
                return;
            }
            fetch(window.location.href, {
                    method: 'POST',
                    body: JSON.stringify({
                        date: datex,
                        email: myEmail.value,
                        letter: myLetter.value
                    })
                }).then(res => res.json())
                .catch(error => console.error('Error:', error))
                .then(response => alert(response.ok ? '添加成功:)' : '添加失败:('));
        }
    </script>
    <script src="https://v1.hitokoto.cn/?encode=js&select=%23hitokoto" defer></script>
    <script src="https://unpkg.com/wired-elements@2.0.5/lib/wired-elements-bundled.js "></script>
</body>

</html>'''
    return {
        "isBase64Encoded": False,
        "statusCode": code,
        "headers": {'Content-Type': 'text/html' if html else 'application/json', "Access-Control-Allow-Origin": "*"},
        "body": htmlStr if html else json.dumps(reply, ensure_ascii=False)
    }

#登陆邮箱
def loginEmail():
    try:
        smtpObj.login(mail_user, mail_pass)
        return True
    except smtplib.SMTPException as e:
        print(e)
        return False

#发送邮件
def sendEmail(letter):
    temp=letter.split('|')
    receivers = [temp[0]]
    message = MIMEText(temp[1], 'plain', 'utf-8')
    message['From'] = mail_user
    message['To'] = temp[0]
    message['Subject'] = '一封来自很久以前的信'
    try:
        smtpObj.sendmail(mail_user, receivers, message.as_string())
        print("send email success")
        return True
    except smtplib.SMTPException as e:
        print("Error: send email fail")
        return False

#每天定时检查需要发送的信件
def check_send_letters():
    loginEmail()
    letters = getletters()
    for date in letters.keys():
        if checkDate(date):
            sendEmail(letters[date])


def main_handler(event, context):
    if 'Time' in event.keys():  # 来自定时触发器
        check_send_letters()
        return
    if 'httpMethod' in event.keys():  # 来自api网关触发器
        if event['httpMethod'] == 'GET':
            return apiReply('', html=True)  # 返回网页
        if event['httpMethod'] == 'POST':  # 添加信件
            body = json.loads(event['body'])
            flag = addletter(body['date'], body['email'], body['letter'])
            return apiReply({
                'ok': True if flag else False,
                'message': '添加成功' if flag else '添加失败'
            })
    return apiReply('', html=True)
```

没错，这就是前面展示的网页应用的全部源码了，使用云函数 SCF 构建一个完整的前后端的全栈应用就是这么简单。

代码可能有点长，其实也没多少知识点，下面咱们再一起捋一下这个云函数 ~

```javascript
import json
import datetime
import random
from email.mime.text import MIMEText
from email.header import Header
import smtplib

# 是否开启本地debug模式
debug = False

# 腾讯云对象存储依赖
if debug:
    from qcloud_cos import CosConfig
    from qcloud_cos import CosS3Client
    from qcloud_cos import CosServiceError
    from qcloud_cos import CosClientError
else:
    from qcloud_cos_v5 import CosConfig
    from qcloud_cos_v5 import CosS3Client
    from qcloud_cos_v5 import CosServiceError
    from qcloud_cos_v5 import CosClientError
```

首先是依赖的导入，这里主要导入了 python 自带的 email 模块和腾讯云对象存储 SDK，来实现信件的发送和后端存储需求。

这里需要注意一点，在腾讯云的云函数在线运行环境中，已经安装了 `qcloud\_cos\_v5` 对象存储 SDK，而我在本地环境安装的对象存储 SDK 是 `qcloud\_cos`，为了方便本地调试，这里我设置了一个 debug 开关，来动态导入 `qcloud\_cos` 依赖，这一点我在之前的系列文章[《万物皆可Serverless之使用SCF+COS快速开发全栈应用》](https://cloud.tencent.com/developer/article/1612750?from=10680)中有讲到。

```javascript
# 配置存储桶
appid = '66666666666'
secret_id = 'xxxxxxxxxxxxxxx'
secret_key = 'xxxxxxxxxxxxxxx'
region = 'ap-chongqing'
bucket = 'name'+'-'+appid

#配置发件邮箱
mail_host = "smtp.163.com"
mail_user = "xxxxxxxxxx@163.com"
mail_pass = "xxxxxxxxxxxxxx"
mail_port = 465
```

然后配置一下自己的邮箱信息和腾讯云对象存储桶信息

配置完成之后，我们再来看一下云函数的入口函数 main\_handler(event, context)

```javascript
def main_handler(event, context):
    if 'Time' in event.keys():  # 来自定时触发器
        check_send_letters()
        return
    if 'httpMethod' in event.keys():  # 来自api网关触发器
        if event['httpMethod'] == 'GET':
            return apiReply('', html=True)  # 返回网页
        if event['httpMethod'] == 'POST':  # 添加信件
            body = json.loads(event['body'])
            flag = addletter(body['date'], body['email'], body['letter'])
            return apiReply({
                'ok': True if flag else False,
                'message': '添加成功' if flag else '添加失败'
            })
    return apiReply('', html=True)
```

这里我们根据event的keys里有无'Time'来判断云函数是否是通过定时器来触发的，

这一点我在之前的系列文章[《万物皆可 Serverless 之使用 SCF+COS 快速开发全栈应用》](https://serverlesscloud.cn/blog/2020-04-23-serverless-scf-cos/)中有讲到。

```javascript
#每天定时检查需要发送的信件
def check_send_letters():
    loginEmail()
    letters = getletters()
    for date in letters.keys():
        if checkDate(date):
            sendEmail(letters[date])
```

检查云函数是否是通过定时器触发，是因为在后面我们会给这个云函数添加定时触发器来每天定时检查需要发送的信件。

这里的 `check\_send\_letters` 函数的作用就是登录我们的邮箱并读取在 cos 中的所有信件，然后逐封检查信件的发信日期，如果信件发信日期与当前的日期相符，就会向指定的邮箱发送信件，完成在指定日期投放信件的功能。

```javascript
if event['httpMethod'] == 'GET':
    return apiReply('', html=True)  # 返回网页
if event['httpMethod'] == 'POST':  # 添加信件
    body = json.loads(event['body'])
    flag = addletter(body['date'], body['email'], body['letter'])
    return apiReply({
         'ok': True if flag else False,
         'message': '添加成功' if flag else '添加失败'
    })
```

如果我们的云函数是通过 api 网关触发的话，就判断一下 http 请求的方法是 GET 还是 POST

```javascript
<!DOCTYPE html>
<html lang="zh-cn">

<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <title>给未来的自己写封信</title>
    <style>
        html,
        body {
            padding: 0px;
            margin: 0px;
            height: 100vh;
        }

        .main {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
        }

        .main_phone {
            display: flex;
            flex-direction: column;
            justify-content: start;
            align-items: center;
        }
    </style>
</head>

<body id='body'>
    <div class="main" style="width: 80vw;">
        <div style="height: 5vh;"></div>
        <div id='letter_top'>
            <p style="text-align: center;">开始写信</p>
            <wired-textarea id="letter" style="height: 320px;width: 300px;" placeholder="此刻平静地写下一封信,给未来的自己一份温暖..." elevation="6" rows="14"></wired-textarea>
        </div>
        <div style="display: flex;align-items: center;justify-content: center;">
            <div id='letter_left'>
                <p style="text-align: center;">开始写信</p>
                <wired-textarea id="letter" style="height: 320px;width: 300px;" placeholder="此刻平静地写下一封信,给未来的自己一份温暖..." elevation="6" rows="14"></wired-textarea>
            </div>
            <div style="width: 16px;"></div>
            <div>
                <p style="text-align: center;">送信日期</p>
                <wired-calendar id="calendar"></wired-calendar>
            </div>
        </div>
        <wired-divider style="margin: 16px 0;"></wired-divider>
        <p id="hitokoto"></p>
        <div>
            <wired-input id="email" placeholder="收件邮箱"></wired-input>
            <wired-button onclick="send()">投递</wired-button>
        </div>
        <div style="height: 5vh;"></div>
    </div>
    <script>
        let datex = '';
        let myEmail = document.getElementById('email');
        let myLetter = document.getElementById('letter');
        let myCalendar = document.getElementById('calendar');

        let width =
            window.innerWidth ||
            document.documentElement.clientWidth ||
            document.body.clientWidth

        let height =
            window.innerHeight ||
            document.documentElement.clientHeight ||
            document.body.clientHeight

        let pc = width >= height

        let today = new Date();
        let info = today.toString().split(' ');
        let selected = `${info[1]} ${today.getDate()}, ${today.getFullYear()}`;

        document.getElementById('body').classList.add(pc ? 'main' : 'main_phone');
        document.getElementById('letter_left').style.display = pc ? 'block' : 'none';
        document.getElementById('letter_top').style.display = pc ? 'none' : 'block';
        myCalendar.setAttribute("selected", selected);
        myCalendar.addEventListener('selected', () => {
            let selectedObject = myCalendar.value;
            let date = new Date(new Date().setDate(selectedObject.date.getDate()));
            datex = date.toISOString().substr(0, 10);
        });

        function send() {
            if (datex.length < 1 || myEmail.value.length < 1 || myLetter.value.length < 1) {
                alert('信件内容、送信日期或投递邮箱不能为空');
                return;
            }
            fetch(window.location.href, {
                    method: 'POST',
                    body: JSON.stringify({
                        date: datex,
                        email: myEmail.value,
                        letter: myLetter.value
                    })
                }).then(res => res.json())
                .catch(error => console.error('Error:', error))
                .then(response => alert(response.ok ? '添加成功:)' : '添加失败:('));
        }
    </script>
    <script src="https://v1.hitokoto.cn/?encode=js&select=%23hitokoto" defer></script>
    <script src="https://unpkg.com/wired-elements@2.0.5/lib/wired-elements-bundled.js "></script>
</body>

</html>
```

如果是 GET 请求就返回上面的前端网页，也就是文章开头第一张图，再来瞅一眼

![云函数返回的前端网页](https://img.serverlesscloud.cn/2020523/1590215207162-16200.jpg)

再来看下前端网页的发信过程

```javascript
function send() {
    if (datex.length < 1 || myEmail.value.length < 1 || myLetter.value.length < 1) {
        alert('信件内容、送信日期或投递邮箱不能为空');
        return;
    }
    fetch(window.location.href, {
            method: 'POST',
            body: JSON.stringify({
                date: datex,
                email: myEmail.value,
                letter: myLetter.value
            })
        }).then(res => res.json())
        .catch(error => console.error('Error:', error))
        .then(response => alert(response.ok ? '添加成功:)' : '添加失败:('));
}
```

这里我们是向当前网页地址，也是云函数的 api 网关地址 POST 了一个包含所有信件信息的 json 字符串

```javascript
if event['httpMethod'] == 'POST':  # 添加信件
    body = json.loads(event['body'])
    flag = addletter(body['date'], body['email'], body['letter'])
    return apiReply({
         'ok': True if flag else False,
         'message': '添加成功' if flag else '添加失败'
    })
```

回到云函数后端，我们在收到 POST 请求之后，在 event 里拿到 POST 的请求体，并重新将 json 字符串转成 map 对象，之后将 body 传给 addletter 函数，将信件信息保存到 cos 里，然后向网页前端回复信件是否添加成功。

这样整个应用的前后端只用一个云函数就都实现了，是不是很酸爽呀( •̀ ω •́ )y~

### 第三步：配置云函数触发器

找到本地云函数文件夹下面的 `template.yaml` 配置文件

```javascript
Resources:
  default:
    Type: 'TencentCloud::Serverless::Namespace'
    letter:
      Properties:
        CodeUri: ./
        Type: Event
        Environment:
          Variables:
        Description: 给未来写封信云函数
        Handler: index.main_handler
        MemorySize: 64
        Timeout: 3
        Runtime: Python3.6
        Events:
          timer:
            Type: Timer
            Properties:
              CronExpression: '0 0 8 * * * *'
              Enable: True
          letter_apigw:
            Type: APIGW
            Properties:
              StageName: release
              ServiceId:
              HttpMethod: ANY
      Type: 'TencentCloud::Serverless::Function'
```

这里主要配置了一下云函数的名称，timer 触发器和 api 网关触发器，可以自行设置。

### 第四步：上线发布云函数，api 网关启用响应集成

参见我之前的系列文章[《万物皆可 Serverless 之使用 SCF+COS 快速开发全栈应用》](https://serverlesscloud.cn/blog/2020-04-23-serverless-scf-cos/)

### 第五步：绑定备案域名

如果你有备案域名并且想给 api 网关自定义域名的话，可参考我之前的系列文章[《万物皆可Serverless之免费搭建自己的不限速大容量云盘（5TB）》](https://serverlesscloud.cn/blog/2020-04-23-serverless-cloud-cos/)

## 写在最后

OK，没啥问题的话现在你应该已经成功上线了自己的给未来写封信网页应用，或许你也可以趁热打铁，试着静下心来认真的给未来的自己留几句话呢？

以上，我们可以总结出把一个简单的网页应用前后端都在一个云函数里来实现是完全没有问题的，而且极大缩短了我们应用开发的时间，非常的方便，还省去了购买配置和维护服务器的费用，让开发者可以真正将精力放到业务本身的开发上，这就是 Serverless 最大的魅力！



---
<div id='scf-deploy-iframe-or-md'></div>

---

> **传送门：**
> - GitHub: [github.com/serverless](https://github.com/serverless/serverless/blob/master/README_CN.md)
> - 官网：[serverless.com](https://serverless.com/)

欢迎访问：[Serverless 中文网](https://serverlesscloud.cn/)，您可以在 [最佳实践](https://serverlesscloud.cn/best-practice) 里体验更多关于 Serverless 应用的开发！
