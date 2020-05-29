---
title: 网站监控脚本的实现
description: 本文将分享如何通过腾讯云云函数 SCF 开发一个简单的脚本，进行网站监控
keywords: Serverless 应用服务端,Serverless 应用,Serverless Web 后端
date: 2019-07-15
thumbnail: https://img.serverlesscloud.cn/2020414/1586850670017-%E5%B0%81%E9%9D%A2%E5%9B%BE%20%283%29.png
categories:
  - user-stories
authors:
  - Anycodes
authorslink:
  - https://www.zhihu.com/people/liuyu-43-97
tags:
  - 监控脚本
  - Serverless
---

很多小伙伴都有自己的博客，或者做过 Web，但是自己的 Web 是否健康？当前状态是否可访问？网站挂了谁的锅？这些问题都可以用相关的[网站监控](https://link.zhihu.com/?target=https%3A//cloud.tencent.com/product/cat%3Ffrom%3D10680)脚本进行监测。

## **▎基**本监控脚本

假如说，目前想要监控的网站是 [https://www.anycodes.cn](https://link.zhihu.com/?target=https%3A//www.anycodes.cn/)，想知道这个网站是否可用，那么可以通过 Python 语言编写一个脚本，来查看这个网站的状态，获取他的 http_status_code，如果该数值为 200，则说明网站可用，如果非 200，则说明网站不可用。

首先，打开腾讯云，登陆并选择无服务器云函数业务，创建我们的监控脚本：

![img](https://img.serverlesscloud.cn/tmp/v2-7eb0d6a8ec82104052643d090753eea2_1440w-20200414233841480.jpg)

编写代码：

```python3
# -*- coding: utf8 -*-
import json
import urllib.request

def getStatusCode(url):
    return urllib.request.urlopen(url).getcode()

def main_handler(event, context):
    if getStatusCode("https://www.anycodes.cn") == 200:
        print("网站可访问")
```

测试结果：

![img](https://img.serverlesscloud.cn/tmp/v2-64423fd347a898570a902e3a317fdafc_1440w-20200414233849717.jpg)

可以看到网站是通的，在控制台输出相对应的结果。

但如果网站返回的不是 200，应该怎么办呢？可否通过短信或者邮件进行告警？

以邮件告警方法为例，我们再写一个发送邮件的方法并整合进去：

```text
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
    message['From'] = Header("网站监控", 'utf-8')
    message['To'] = Header("站长", 'utf-8')

    subject = "网站监控告警"
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
    if getStatusCode(url) == 200:
        sendEmail("您的网站%s可以访问！" % (url), "service@52exe.cn")
```

点击测试查看结果：

![img](https://img.serverlesscloud.cn/tmp/v2-e25a3f7289ca5f069d9ee34f53a3c2a8_1440w-20200414233904396.jpg)

此时，手机上面会接收到以下提醒：

![img](https://img.serverlesscloud.cn/tmp/v2-c47c365f143a582f5986d2463f095c75_1440w-20200414233859973.jpg)

由于要监控网站不可访问的状态，所以修改一下判断：

![img](https://img.serverlesscloud.cn/tmp/v2-ee9489b490287c2bf4b3a9e0fe3df384_1440w-20200414233911031.png)

修改完成之后，就可以保存了。考虑到这个脚本需要每隔一段时间都要触发一次，因此可以设置一个定时触发。

![img](https://img.serverlesscloud.cn/tmp/v2-4bd4c5de90d380e4ac6ce2733bdc479b_1440w-20200414233915578.jpg)

触发方式里面增加定时触发，并且保存即可，同时点击右上角的发布新版本：

![img](https://img.serverlesscloud.cn/tmp/v2-eb8a96d514cfd20d18d278a91a9105b4_1440w-20200414233920416.jpg)

此时，网站状态监控就已经上线了！

## **▎**升级监控脚本

有人问了，这样简单的一个脚本，意义大么？

其实意义很大，因为这个脚本，只是抛砖引玉，还有 Plus 版本 —— 单纯根据状态判断靠谱么？要不要再做一个访问时间统计？

我们尝试融合一个爬虫进入：以网站测速网站：[http://tool.chinaz.com/speedtest/anycodes.cn](https://link.zhihu.com/?target=http%3A//tool.chinaz.com/speedtest/anycodes.cn) 为例，可以看到：

![img](https://img.serverlesscloud.cn/tmp/v2-72201e99b6a00deee98e473bfe9b2bf8_1440w-20200414233925435.jpg)

是否可以获得每个请求看看耗时呢？

通过网页分析，我们获得了每个测试点的 id 对应关系：

```text
62a55a0e-387e-4d87-bf69-5e0c9dd6b983 江苏宿迁[电信]
f403cdf2-27f8-4ccd-8f22-6f5a28a01309 广东佛山[电信]
bcff47de-61bb-4bf7-9fe6-4e456067e540 广东惠州[电信]
7740099a-6b60-49e0-9913-2f0b416ae63b 广东深圳[电信]
2bfd90a0-4661-4920-9963-0241cd3fc0db 浙江湖州[电信]
b698f5c4-0c88-4ae4-b123-ef57293ce442 辽宁大连[电信]
7253644b-58d3-48bb-808a-3c8b9416cfd5 江苏泰州[电信]
d8c0d1d1-9da8-4480-a9df-555731cdd7b8 安徽合肥[电信]
299f5043-d454-4485-945f-a331d960d86e 江苏镇江[电信]
38522b83-8893-4ca6-b45f-b6588b034462 云南昆明[电信]
19705ba7-3816-4b35-976b-c3b8d69e78d2 湖南长沙[电信]
8081b399-499a-4680-9a5a-723977cfea04 湖南衡阳[电信]
5713f157-3378-495a-9c55-7172187e9f36 江苏宿迁[电信]
a80cd07e-5508-4be6-8c83-524fe59318b8 江苏泰州[电信]
4daa81e2-f397-4cde-bf74-b2bee84a4ea5 江苏宿迁[电信]
bdd1ecd4-5516-44f8-8022-d83e4ac102f2 广东佛山[电信]
6b6f9b1c-6154-4696-96d6-112248f902dc 北京[电信]
8292e59e-ffde-4988-814f-4fe7fc4ec888 贵州兴义[电信]
be09c5ce-3031-4565-8f6a-3e328e256e16 江苏扬州[电信]
524906a3-2749-4469-aee3-48885f042a3a 江苏徐州[电信]
fce17d47-07c3-4315-892b-acd76d918ada 广西南宁[电信]
21cf6110-400c-4c6b-87c8-cada4ec3f6a7 浙江台州[电信]
0c8ca9bf-fa7a-42a3-9148-f15ead65f45e 广东深圳[电信]
b1499d95-7e3c-472a-9682-e58e1b362633 江西九江[电信]
4130a733-57c7-432b-ab8d-735ccbefbc0a 山东枣庄[电信]
066ab75f-0a74-40e8-b717-d17a71eda942 广东惠州[电信]
1befa95d-cde1-473e-b851-38440d034f1c 江苏泰州[电信]
c5ae6abd-901b-47c7-9018-7eda8b4441c6 陕西西安[电信]
d1e4fc25-16e5-4651-a8d7-b8df50dda396 江苏镇江[电信]
70a537ed-95b2-4bfd-b6b0-64c3920d9910 重庆[电信]
e6a3a9b7-2088-41be-bf1d-6a25276ab1ed 江西吉安[电信]
0e34cba2-fe5c-40d2-9ec7-e497f99365b8 广东广州[电信]
547e8248-6dfb-4f4f-b52d-8a287e89b844 湖北随州[电信]
df8bdd7a-b928-41f8-959f-d0d56fadea64 四川绵阳[电信]
4e5d43e6-9d6a-4e5a-b495-a78c0921d26d 四川成都[电信]
36d59519-d4bb-4635-8476-1d6ea27f62b2 江苏镇江[电信]
bc25c8fd-62a1-4c57-a44d-0855b6c67714 四川绵阳[电信]
0d3fd0b2-1255-4e5d-b94e-717569d2e8bd 江苏扬州[电信]
47a0f82f-7dbb-48f4-96e0-d7a279ebba11 浙江宁波[电信]
61d76c8c-b681-4196-b734-7d8e60f1e3ae 浙江绍兴[电信]
da8bc796-4e65-48ef-beaa-d2ee1a7dd4bf 广东佛山[电信]
cd787783-c0f5-486c-ac9f-34a80e386c34 广东佛山[电信]
0e8d2e22-74db-4b31-9edd-fdda946dcd03 江苏常州[电信]
5daad9ff-ced5-426a-8216-bf2aad097de0 浙江温州[电信]
91a304a7-f91b-49ac-abbe-b77442cbc48c 上海[电信]
12b16bb6-d42d-4296-a394-b96b22bca9c3 陕西咸阳[电信]
bf9f80ef-1ef7-4267-aece-4fb1e5fe45bf 湖北荆门[电信]
cd442c9e-de26-470f-bba2-33a8e71e4639 福建泉州[电信]
9fef7898-e2d3-4c02-ab2a-5dc780f5a65c 河南新乡[电信]
65078859-3e99-48eb-b170-7463fc53a98e 辽宁大连[电信]
0165e09b-aad3-46c2-87e8-160432229f60 贵州兴义[电信]
817bc339-c6f6-479c-9708-01ca54f2be80 江西新余[电信]
1edc7af0-68ac-427b-a368-c27610797971 广东佛山[电信]
9bc90d67-d208-434d-b680-294ae4288571 新疆哈密[电信]
b44faece-c6fe-4cc1-ab9a-ae7dcf37f146 辽宁鞍山[电信]
7fb11d87-1029-487b-8345-27e12a6acf1e 江苏镇江[电信]
04d82618-d562-4aa7-9db6-4600dd7f4780 湖南衡阳[电信]
252167a8-eaeb-491b-a4f3-319d25680f48 江苏宿迁[电信]
22456bec-ad37-49e8-ba6f-032b3faaa0a0 湖北武汉[电信]
5802da93-4e05-4932-9bc6-20d5d75b7af5 江苏宿迁[电信]
a083795a-b69f-49fe-a905-cd8838c09553 浙江温州[电信]
9c3b9aed-4b8a-4258-9b1f-55016211ced9 广东深圳[电信]
2140cc66-e5ea-4f56-981a-8f044a98c92a 浙江绍兴[电信]
9a8406ca-8a2d-44b7-a60e-4fe0ff6dd3aa 陕西西安[电信]
8df24006-5e55-428c-9f29-9a2386480a4d 湖北仙桃[电信]
cb2be8e0-670f-4922-8dd8-a1dd155cbf97 广东深圳[多线]
c5964a0d-c49f-4fac-833d-2348b3b1304b 江苏常州[多线]
19ef9d71-e0cb-4b79-a416-8fd670f6e7ca 江苏泰州[多线]
5bea1430-f7c2-4146-88f4-17a7dc73a953 河南新乡[多线]
1f430ff0-eae9-413a-af2a-1c2a8986cff0 河南新乡[多线]
ea551b59-2609-4ab4-89bc-14b2080f501a 河南新乡[多线]
4d462057-4581-4ae1-974d-ca7ca019e700 河南新乡[多线]
9c137190-5a57-4ef5-be4b-b9add998ad52 河南新乡[多线]
120ec517-1b0f-4b6e-841d-61116f73099a 广东东莞[多线]
cbc3caa1-9faf-438c-abde-fbd5c64c8036 辽宁大连[多线]
ba9e31d2-918a-41ad-9d0b-99175e365583 江苏扬州[多线]
74cb6a5c-b044-49d0-abee-bf42beb6ae05 江苏宿迁[多线]
e0cf79c5-9159-4ea6-a2a7-1bcaf9bfb292 山西运城[联通]
2805fa9f-05ea-46bc-8ac0-1769b782bf52 黑龙江哈尔滨[联通]
5439460c-0115-421a-b8ad-449eb2b4c28a 广东深圳[联通]
9b7cbf0a-76b8-4308-8b66-9093dbe22541 浙江金华[联通]
a4800428-7ed4-4c8a-a049-4b90df6919f0 河南郑州[联通]
654abac8-7b37-4a64-9a84-2d190db3d060 山东枣庄[联通]
1b6a98df-c2f4-4a29-b5b5-1e44ce6d1309 浙江金华[联通]
32574c06-d0fc-4709-8fc9-fce30596efd3 河南郑州[联通]
87068aa4-3b0e-4e22-814e-8ff838036e1b 浙江金华[联通]
457575e4-cbbd-4796-89df-ad9707f19254 河南新乡[联通]
4d7637d7-4950-4b79-9741-c397789bcf05 山东济南[联通]
7f46f5c9-d719-4886-b3c0-6b6427908791 福建福州[联通]
c48a380c-bac5-4976-b56c-53e9e5ebb691 江苏徐州[联通]
b615642c-ac86-4322-9fbe-4bd79e175a99 广东深圳[联通]
ddfeba9f-a432-4b9a-b0a9-ef76e9499558 浙江嘉兴[联通]
102df90c-0bcc-404a-97cd-475fd408ff6f 江苏宿迁[联通]
62909299-548b-4bbc-a92a-959e6104fc2c 江苏徐州[联通]
de221437-2390-4404-9a00-26b0853cf943 江苏宿迁[联通]
7a23256e-1121-4c39-ba12-1ff663ba952a 福建福州[联通]
5074fb13-4ab9-4f0a-87d9-f8ae51cb81c5 江苏常州[移动]
722e28ca-dd02-4ccd-a134-f9d4218505a5 广东深圳[移动]
8e7a403c-d998-4efa-b3d1-b67c0dfabc41 广东深圳[移动]
```

然后，我们可以根据这些关系，在本地测试：

以『62a55a0e-387e-4d87-bf69-5e0c9dd6b983 江苏宿迁[电信]』为例编写代码：

```text
import urllib.request
import urllib.parse

url = "http://tool.chinaz.com/iframe.ashx?t=ping"
form_data = {
    'guid': '62a55a0e-387e-4d87-bf69-5e0c9dd6b983',
    'host': 'anycodes.cn',
    'ishost': '1',
    'encode': 'ECvBP9vjbuXRi0CVhnXAbufDNPDryYzO',
    'checktype': '1',
}
headers = {
    'Host': 'tool.chinaz.com',
    'Origin': 'http://tool.chinaz.com',
    'Referer': 'http://tool.chinaz.com/speedtest/anycodes.cn',
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

```text
({state:1,msg:'',result:{ip:'119.28.190.46',httpstate:200,alltime:'212',dnstime:'18',conntime:'116',downtime:'78',filesize:'-',downspeed:'4.72',ipaddress:'新加坡新加坡',headers:'\u0048\u0054\u0054\u0050\u002f\u0031\u002e\u0031\u0020\u0032\u0030\u0030\u0020\u004f\u004b \u0062\u0072\u003e\u0053\u0065\u0072\u0076\u0065\u0072\u003a\u0020\u006e\u0067\u0069\u006e\u0078\u002f\u0031\u002e\u0031\u0030\u002e\u0033\u0020\u0028\u0055\u0062\u0075\u006e\u0074\u0075\u0029 \u0062\u0072\u003e\u0044\u0061\u0074\u0065\u003a\u0020\u0053\u0075\u006e\u002c\u0020\u0032\u0038\u0020\u0041\u0070\u0072\u0020\u0032\u0030\u0031\u0039\u0020\u0030\u0033\u003a\u0032\u0031\u003a\u0033\u0030\u0020\u0047\u004d\u0054 \u0062\u0072\u003e\u0043\u006f\u006e\u0074\u0065\u006e\u0074\u002d\u0054\u0079\u0070\u0065\u003a\u0020\u0074\u0065\u0078\u0074\u002f\u0068\u0074\u006d\u006c \u0062\u0072\u003e\u004c\u0061\u0073\u0074\u002d\u004d\u006f\u0064\u0069\u0066\u0069\u0065\u0064\u003a\u0020\u0054\u0068\u0075\u002c\u0020\u0032\u0035\u0020\u0041\u0070\u0072\u0020\u0032\u0030\u0031\u0039\u0020\u0030\u0037\u003a\u0033\u0033\u003a\u0035\u0035\u0020\u0047\u004d\u0054 \u0062\u0072\u003e\u0054\u0072\u0061\u006e\u0073\u0066\u0065\u0072\u002d\u0045\u006e\u0063\u006f\u0064\u0069\u006e\u0067\u003a\u0020\u0063\u0068\u0075\u006e\u006b\u0065\u0064 \u0062\u0072\u003e\u0043\u006f\u006e\u006e\u0065\u0063\u0074\u0069\u006f\u006e\u003a\u0020\u0063\u006c\u006f\u0073\u0065 \u0062\u0072\u003e\u0045\u0054\u0061\u0067\u003a\u0020\u0057\u002f\u0022\u0035\u0063\u0063\u0031\u0036\u0032\u0065\u0033\u002d\u0038\u0038\u0061\u0022 \u0062\u0072\u003e\u0043\u006f\u006e\u0074\u0065\u006e\u0074\u002d\u0045\u006e\u0063\u006f\u0064\u0069\u006e\u0067\u003a\u0020\u0067\u007a\u0069\u0070 \u0062\u0072\u003e \u0062\u0072\u003e',pagehtml:''}})
```

拿到结果后就可以知道江苏宿迁[电信]访问 anycodes 的：

- 总耗时：alltime:'212'
- 链接耗时：conntime:'116'
- 下载耗时：downtime:'78'

整合程序，对每个请求进行处理：

```text
import urllib.request
import urllib.parse
import re

total_list = '''62a55a0e-387e-4d87-bf69-5e0c9dd6b983 江苏宿迁[电信]
f403cdf2-27f8-4ccd-8f22-6f5a28a01309 广东佛山[电信]
bcff47de-61bb-4bf7-9fe6-4e456067e540 广东惠州[电信]
7740099a-6b60-49e0-9913-2f0b416ae63b 广东深圳[电信]
2bfd90a0-4661-4920-9963-0241cd3fc0db 浙江湖州[电信]
b698f5c4-0c88-4ae4-b123-ef57293ce442 辽宁大连[电信]
7253644b-58d3-48bb-808a-3c8b9416cfd5 江苏泰州[电信]
d8c0d1d1-9da8-4480-a9df-555731cdd7b8 安徽合肥[电信]
299f5043-d454-4485-945f-a331d960d86e 江苏镇江[电信]
38522b83-8893-4ca6-b45f-b6588b034462 云南昆明[电信]
19705ba7-3816-4b35-976b-c3b8d69e78d2 湖南长沙[电信]
8081b399-499a-4680-9a5a-723977cfea04 湖南衡阳[电信]
5713f157-3378-495a-9c55-7172187e9f36 江苏宿迁[电信]
a80cd07e-5508-4be6-8c83-524fe59318b8 江苏泰州[电信]
4daa81e2-f397-4cde-bf74-b2bee84a4ea5 江苏宿迁[电信]
bdd1ecd4-5516-44f8-8022-d83e4ac102f2 广东佛山[电信]
6b6f9b1c-6154-4696-96d6-112248f902dc 北京[电信]
8292e59e-ffde-4988-814f-4fe7fc4ec888 贵州兴义[电信]
be09c5ce-3031-4565-8f6a-3e328e256e16 江苏扬州[电信]
524906a3-2749-4469-aee3-48885f042a3a 江苏徐州[电信]
fce17d47-07c3-4315-892b-acd76d918ada 广西南宁[电信]
21cf6110-400c-4c6b-87c8-cada4ec3f6a7 浙江台州[电信]
0c8ca9bf-fa7a-42a3-9148-f15ead65f45e 广东深圳[电信]
b1499d95-7e3c-472a-9682-e58e1b362633 江西九江[电信]
4130a733-57c7-432b-ab8d-735ccbefbc0a 山东枣庄[电信]
066ab75f-0a74-40e8-b717-d17a71eda942 广东惠州[电信]
1befa95d-cde1-473e-b851-38440d034f1c 江苏泰州[电信]
c5ae6abd-901b-47c7-9018-7eda8b4441c6 陕西西安[电信]
d1e4fc25-16e5-4651-a8d7-b8df50dda396 江苏镇江[电信]
70a537ed-95b2-4bfd-b6b0-64c3920d9910 重庆[电信]
e6a3a9b7-2088-41be-bf1d-6a25276ab1ed 江西吉安[电信]
0e34cba2-fe5c-40d2-9ec7-e497f99365b8 广东广州[电信]
547e8248-6dfb-4f4f-b52d-8a287e89b844 湖北随州[电信]
df8bdd7a-b928-41f8-959f-d0d56fadea64 四川绵阳[电信]
4e5d43e6-9d6a-4e5a-b495-a78c0921d26d 四川成都[电信]
36d59519-d4bb-4635-8476-1d6ea27f62b2 江苏镇江[电信]
bc25c8fd-62a1-4c57-a44d-0855b6c67714 四川绵阳[电信]
0d3fd0b2-1255-4e5d-b94e-717569d2e8bd 江苏扬州[电信]
47a0f82f-7dbb-48f4-96e0-d7a279ebba11 浙江宁波[电信]
61d76c8c-b681-4196-b734-7d8e60f1e3ae 浙江绍兴[电信]
da8bc796-4e65-48ef-beaa-d2ee1a7dd4bf 广东佛山[电信]
cd787783-c0f5-486c-ac9f-34a80e386c34 广东佛山[电信]
0e8d2e22-74db-4b31-9edd-fdda946dcd03 江苏常州[电信]
5daad9ff-ced5-426a-8216-bf2aad097de0 浙江温州[电信]
91a304a7-f91b-49ac-abbe-b77442cbc48c 上海[电信]
12b16bb6-d42d-4296-a394-b96b22bca9c3 陕西咸阳[电信]
bf9f80ef-1ef7-4267-aece-4fb1e5fe45bf 湖北荆门[电信]
cd442c9e-de26-470f-bba2-33a8e71e4639 福建泉州[电信]
9fef7898-e2d3-4c02-ab2a-5dc780f5a65c 河南新乡[电信]
65078859-3e99-48eb-b170-7463fc53a98e 辽宁大连[电信]
0165e09b-aad3-46c2-87e8-160432229f60 贵州兴义[电信]
817bc339-c6f6-479c-9708-01ca54f2be80 江西新余[电信]
1edc7af0-68ac-427b-a368-c27610797971 广东佛山[电信]
9bc90d67-d208-434d-b680-294ae4288571 新疆哈密[电信]
b44faece-c6fe-4cc1-ab9a-ae7dcf37f146 辽宁鞍山[电信]
7fb11d87-1029-487b-8345-27e12a6acf1e 江苏镇江[电信]
04d82618-d562-4aa7-9db6-4600dd7f4780 湖南衡阳[电信]
252167a8-eaeb-491b-a4f3-319d25680f48 江苏宿迁[电信]
22456bec-ad37-49e8-ba6f-032b3faaa0a0 湖北武汉[电信]
5802da93-4e05-4932-9bc6-20d5d75b7af5 江苏宿迁[电信]
a083795a-b69f-49fe-a905-cd8838c09553 浙江温州[电信]
9c3b9aed-4b8a-4258-9b1f-55016211ced9 广东深圳[电信]
2140cc66-e5ea-4f56-981a-8f044a98c92a 浙江绍兴[电信]
9a8406ca-8a2d-44b7-a60e-4fe0ff6dd3aa 陕西西安[电信]
8df24006-5e55-428c-9f29-9a2386480a4d 湖北仙桃[电信]
cb2be8e0-670f-4922-8dd8-a1dd155cbf97 广东深圳[多线]
c5964a0d-c49f-4fac-833d-2348b3b1304b 江苏常州[多线]
19ef9d71-e0cb-4b79-a416-8fd670f6e7ca 江苏泰州[多线]
5bea1430-f7c2-4146-88f4-17a7dc73a953 河南新乡[多线]
1f430ff0-eae9-413a-af2a-1c2a8986cff0 河南新乡[多线]
ea551b59-2609-4ab4-89bc-14b2080f501a 河南新乡[多线]
4d462057-4581-4ae1-974d-ca7ca019e700 河南新乡[多线]
9c137190-5a57-4ef5-be4b-b9add998ad52 河南新乡[多线]
120ec517-1b0f-4b6e-841d-61116f73099a 广东东莞[多线]
cbc3caa1-9faf-438c-abde-fbd5c64c8036 辽宁大连[多线]
ba9e31d2-918a-41ad-9d0b-99175e365583 江苏扬州[多线]
74cb6a5c-b044-49d0-abee-bf42beb6ae05 江苏宿迁[多线]
e0cf79c5-9159-4ea6-a2a7-1bcaf9bfb292 山西运城[联通]
2805fa9f-05ea-46bc-8ac0-1769b782bf52 黑龙江哈尔滨[联通]
5439460c-0115-421a-b8ad-449eb2b4c28a 广东深圳[联通]
9b7cbf0a-76b8-4308-8b66-9093dbe22541 浙江金华[联通]
a4800428-7ed4-4c8a-a049-4b90df6919f0 河南郑州[联通]
654abac8-7b37-4a64-9a84-2d190db3d060 山东枣庄[联通]
1b6a98df-c2f4-4a29-b5b5-1e44ce6d1309 浙江金华[联通]
32574c06-d0fc-4709-8fc9-fce30596efd3 河南郑州[联通]
87068aa4-3b0e-4e22-814e-8ff838036e1b 浙江金华[联通]
457575e4-cbbd-4796-89df-ad9707f19254 河南新乡[联通]
4d7637d7-4950-4b79-9741-c397789bcf05 山东济南[联通]
7f46f5c9-d719-4886-b3c0-6b6427908791 福建福州[联通]
c48a380c-bac5-4976-b56c-53e9e5ebb691 江苏徐州[联通]
b615642c-ac86-4322-9fbe-4bd79e175a99 广东深圳[联通]
ddfeba9f-a432-4b9a-b0a9-ef76e9499558 浙江嘉兴[联通]
102df90c-0bcc-404a-97cd-475fd408ff6f 江苏宿迁[联通]
62909299-548b-4bbc-a92a-959e6104fc2c 江苏徐州[联通]
de221437-2390-4404-9a00-26b0853cf943 江苏宿迁[联通]
7a23256e-1121-4c39-ba12-1ff663ba952a 福建福州[联通]
5074fb13-4ab9-4f0a-87d9-f8ae51cb81c5 江苏常州[移动]
722e28ca-dd02-4ccd-a134-f9d4218505a5 广东深圳[移动]
8e7a403c-d998-4efa-b3d1-b67c0dfabc41 广东深圳[移动]'''

url = "http://tool.chinaz.com/iframe.ashx?t=ping"

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
        'Host': 'tool.chinaz.com',
        'Origin': 'http://tool.chinaz.com',
        'Referer': 'http://tool.chinaz.com/speedtest/anycodes.cn',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.108 Safari/537.36',
        'X-Requested-With': 'XMLHttpRequest'
    }

    result_data = urllib.request.urlopen(
        urllib.request.Request(
            url=url,
            data=urllib.parse.urlencode(form_data).encode('utf-8'),
            headers=headers
        )
    ).read().decode("utf-8")

    # print(result_data)

    try:
        alltime = re.findall("alltime:'(.*?)'",result_data)[0]
        conntime = re.findall("conntime:'(.*?)'", result_data)[0]
        downtime = re.findall("downtime:'(.*?)'", result_data)[0]
        final_string = "%s\t总耗时:%s\t链接耗时:%s\t下载耗时:%s"%(node_name, alltime, conntime, downtime)
    except:
        final_string = "%s链接异常！"

    print(final_string)
```

运行结果：

```text
江苏宿迁[电信]	总耗时:223	链接耗时:121	下载耗时:81
广东佛山[电信]	总耗时:44	链接耗时:27	下载耗时:17
广东惠州[电信]	总耗时:56	链接耗时:34	下载耗时:22
广东深圳[电信]	总耗时:149	链接耗时:36	下载耗时:25
浙江湖州[电信]	总耗时:3190	链接耗时:3115	下载耗时:75
辽宁大连[电信]	总耗时:468	链接耗时:255	下载耗时:170
江苏泰州[电信]	总耗时:180	链接耗时:104	下载耗时:69
安徽合肥[电信]	总耗时:196	链接耗时:110	下载耗时:73
...
```

将该部分内容融合之前的脚本中：

```text
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

    total_list = '''62a55a0e-387e-4d87-bf69-5e0c9dd6b983 江苏宿迁[电信]
    f403cdf2-27f8-4ccd-8f22-6f5a28a01309 广东佛山[电信]
    bcff47de-61bb-4bf7-9fe6-4e456067e540 广东惠州[电信]
    7740099a-6b60-49e0-9913-2f0b416ae63b 广东深圳[电信]
    2bfd90a0-4661-4920-9963-0241cd3fc0db 浙江湖州[电信]
    b698f5c4-0c88-4ae4-b123-ef57293ce442 辽宁大连[电信]
    7253644b-58d3-48bb-808a-3c8b9416cfd5 江苏泰州[电信]
    d8c0d1d1-9da8-4480-a9df-555731cdd7b8 安徽合肥[电信]
    299f5043-d454-4485-945f-a331d960d86e 江苏镇江[电信]
    38522b83-8893-4ca6-b45f-b6588b034462 云南昆明[电信]
    19705ba7-3816-4b35-976b-c3b8d69e78d2 湖南长沙[电信]
    8081b399-499a-4680-9a5a-723977cfea04 湖南衡阳[电信]
    5713f157-3378-495a-9c55-7172187e9f36 江苏宿迁[电信]
    a80cd07e-5508-4be6-8c83-524fe59318b8 江苏泰州[电信]
    4daa81e2-f397-4cde-bf74-b2bee84a4ea5 江苏宿迁[电信]
    bdd1ecd4-5516-44f8-8022-d83e4ac102f2 广东佛山[电信]
    6b6f9b1c-6154-4696-96d6-112248f902dc 北京[电信]
    8292e59e-ffde-4988-814f-4fe7fc4ec888 贵州兴义[电信]
    be09c5ce-3031-4565-8f6a-3e328e256e16 江苏扬州[电信]
    524906a3-2749-4469-aee3-48885f042a3a 江苏徐州[电信]
    fce17d47-07c3-4315-892b-acd76d918ada 广西南宁[电信]
    21cf6110-400c-4c6b-87c8-cada4ec3f6a7 浙江台州[电信]
    0c8ca9bf-fa7a-42a3-9148-f15ead65f45e 广东深圳[电信]
    b1499d95-7e3c-472a-9682-e58e1b362633 江西九江[电信]
    4130a733-57c7-432b-ab8d-735ccbefbc0a 山东枣庄[电信]
    066ab75f-0a74-40e8-b717-d17a71eda942 广东惠州[电信]
    1befa95d-cde1-473e-b851-38440d034f1c 江苏泰州[电信]
    c5ae6abd-901b-47c7-9018-7eda8b4441c6 陕西西安[电信]
    d1e4fc25-16e5-4651-a8d7-b8df50dda396 江苏镇江[电信]
    70a537ed-95b2-4bfd-b6b0-64c3920d9910 重庆[电信]
    e6a3a9b7-2088-41be-bf1d-6a25276ab1ed 江西吉安[电信]
    0e34cba2-fe5c-40d2-9ec7-e497f99365b8 广东广州[电信]
    547e8248-6dfb-4f4f-b52d-8a287e89b844 湖北随州[电信]
    df8bdd7a-b928-41f8-959f-d0d56fadea64 四川绵阳[电信]
    4e5d43e6-9d6a-4e5a-b495-a78c0921d26d 四川成都[电信]
    36d59519-d4bb-4635-8476-1d6ea27f62b2 江苏镇江[电信]
    bc25c8fd-62a1-4c57-a44d-0855b6c67714 四川绵阳[电信]
    0d3fd0b2-1255-4e5d-b94e-717569d2e8bd 江苏扬州[电信]
    47a0f82f-7dbb-48f4-96e0-d7a279ebba11 浙江宁波[电信]
    61d76c8c-b681-4196-b734-7d8e60f1e3ae 浙江绍兴[电信]
    da8bc796-4e65-48ef-beaa-d2ee1a7dd4bf 广东佛山[电信]
    cd787783-c0f5-486c-ac9f-34a80e386c34 广东佛山[电信]
    0e8d2e22-74db-4b31-9edd-fdda946dcd03 江苏常州[电信]
    5daad9ff-ced5-426a-8216-bf2aad097de0 浙江温州[电信]
    91a304a7-f91b-49ac-abbe-b77442cbc48c 上海[电信]
    12b16bb6-d42d-4296-a394-b96b22bca9c3 陕西咸阳[电信]
    bf9f80ef-1ef7-4267-aece-4fb1e5fe45bf 湖北荆门[电信]
    cd442c9e-de26-470f-bba2-33a8e71e4639 福建泉州[电信]
    9fef7898-e2d3-4c02-ab2a-5dc780f5a65c 河南新乡[电信]
    65078859-3e99-48eb-b170-7463fc53a98e 辽宁大连[电信]
    0165e09b-aad3-46c2-87e8-160432229f60 贵州兴义[电信]
    817bc339-c6f6-479c-9708-01ca54f2be80 江西新余[电信]
    1edc7af0-68ac-427b-a368-c27610797971 广东佛山[电信]
    9bc90d67-d208-434d-b680-294ae4288571 新疆哈密[电信]
    b44faece-c6fe-4cc1-ab9a-ae7dcf37f146 辽宁鞍山[电信]
    7fb11d87-1029-487b-8345-27e12a6acf1e 江苏镇江[电信]
    04d82618-d562-4aa7-9db6-4600dd7f4780 湖南衡阳[电信]
    252167a8-eaeb-491b-a4f3-319d25680f48 江苏宿迁[电信]
    22456bec-ad37-49e8-ba6f-032b3faaa0a0 湖北武汉[电信]
    5802da93-4e05-4932-9bc6-20d5d75b7af5 江苏宿迁[电信]
    a083795a-b69f-49fe-a905-cd8838c09553 浙江温州[电信]
    9c3b9aed-4b8a-4258-9b1f-55016211ced9 广东深圳[电信]
    2140cc66-e5ea-4f56-981a-8f044a98c92a 浙江绍兴[电信]
    9a8406ca-8a2d-44b7-a60e-4fe0ff6dd3aa 陕西西安[电信]
    8df24006-5e55-428c-9f29-9a2386480a4d 湖北仙桃[电信]
    cb2be8e0-670f-4922-8dd8-a1dd155cbf97 广东深圳[多线]
    c5964a0d-c49f-4fac-833d-2348b3b1304b 江苏常州[多线]
    19ef9d71-e0cb-4b79-a416-8fd670f6e7ca 江苏泰州[多线]
    5bea1430-f7c2-4146-88f4-17a7dc73a953 河南新乡[多线]
    1f430ff0-eae9-413a-af2a-1c2a8986cff0 河南新乡[多线]
    ea551b59-2609-4ab4-89bc-14b2080f501a 河南新乡[多线]
    4d462057-4581-4ae1-974d-ca7ca019e700 河南新乡[多线]
    9c137190-5a57-4ef5-be4b-b9add998ad52 河南新乡[多线]
    120ec517-1b0f-4b6e-841d-61116f73099a 广东东莞[多线]
    cbc3caa1-9faf-438c-abde-fbd5c64c8036 辽宁大连[多线]
    ba9e31d2-918a-41ad-9d0b-99175e365583 江苏扬州[多线]
    74cb6a5c-b044-49d0-abee-bf42beb6ae05 江苏宿迁[多线]
    e0cf79c5-9159-4ea6-a2a7-1bcaf9bfb292 山西运城[联通]
    2805fa9f-05ea-46bc-8ac0-1769b782bf52 黑龙江哈尔滨[联通]
    5439460c-0115-421a-b8ad-449eb2b4c28a 广东深圳[联通]
    9b7cbf0a-76b8-4308-8b66-9093dbe22541 浙江金华[联通]
    a4800428-7ed4-4c8a-a049-4b90df6919f0 河南郑州[联通]
    654abac8-7b37-4a64-9a84-2d190db3d060 山东枣庄[联通]
    1b6a98df-c2f4-4a29-b5b5-1e44ce6d1309 浙江金华[联通]
    32574c06-d0fc-4709-8fc9-fce30596efd3 河南郑州[联通]
    87068aa4-3b0e-4e22-814e-8ff838036e1b 浙江金华[联通]
    457575e4-cbbd-4796-89df-ad9707f19254 河南新乡[联通]
    4d7637d7-4950-4b79-9741-c397789bcf05 山东济南[联通]
    7f46f5c9-d719-4886-b3c0-6b6427908791 福建福州[联通]
    c48a380c-bac5-4976-b56c-53e9e5ebb691 江苏徐州[联通]
    b615642c-ac86-4322-9fbe-4bd79e175a99 广东深圳[联通]
    ddfeba9f-a432-4b9a-b0a9-ef76e9499558 浙江嘉兴[联通]
    102df90c-0bcc-404a-97cd-475fd408ff6f 江苏宿迁[联通]
    62909299-548b-4bbc-a92a-959e6104fc2c 江苏徐州[联通]
    de221437-2390-4404-9a00-26b0853cf943 江苏宿迁[联通]
    7a23256e-1121-4c39-ba12-1ff663ba952a 福建福州[联通]
    5074fb13-4ab9-4f0a-87d9-f8ae51cb81c5 江苏常州[移动]
    722e28ca-dd02-4ccd-a134-f9d4218505a5 广东深圳[移动]
    8e7a403c-d998-4efa-b3d1-b67c0dfabc41 广东深圳[移动]'''

    url = "http://tool.chinaz.com/iframe.ashx?t=ping"

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
            'Host': 'tool.chinaz.com',
            'Origin': 'http://tool.chinaz.com',
            'Referer': 'http://tool.chinaz.com/speedtest/anycodes.cn',
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
                final_string = "%s\t总耗时:%s\t链接耗时:%s\t下载耗时:%s" % (node_name, alltime, conntime, downtime)
            except:
                final_string = "%s链接异常！" % (node_name)
                final_status = False
        except:
            final_string = "%s链接超时！" % (node_name)
            final_status = False
        final_list.append(final_string)
        print(final_string)
    return (final_status,final_list)


def sendEmail(content, to_user):
    sender = 'service@anycodes.cn'
    receivers = [to_user]

    mail_msg = content
    message = MIMEText(mail_msg, 'html', 'utf-8')
    message['From'] = Header("网站监控", 'utf-8')
    message['To'] = Header("站长", 'utf-8')

    subject = "网站监控告警"
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
    # if getStatusCode(url) == 200:
    #     sendEmail("您的网站%s可以访问！" % (url), "service@52exe.cn")
    final_status,final_list = getWebTime()
    if final_status:
        sendEmail("您的网站%s的状态：<br>%s" % (url, "<br>".join(final_list)), "service@52exe.cn")
    else:
        sendEmail("您的网站%s的状态：<br>%s" % (url, "<br>".join(final_list)), "service@52exe.cn")
```

这个程序运行的时间可能会有点长，所以需要对云函数的 timeout 进行修改：

![img](https://img.serverlesscloud.cn/tmp/v2-efd3ba124d7a3e0788d30c418be63eed_1440w-20200414234032458.jpg)

修改之后，进行测试和部署：

![img](https://img.serverlesscloud.cn/tmp/v2-ca02b9edb487827e9bbac1c65c439edc_1440w-20200414234037150.jpg)

之后便可以部署到线上：

![img](https://img.serverlesscloud.cn/tmp/v2-621d034d191f2d1b2d3f93432b785405_1440w-20200414234040596.jpg)

当然，这里可能还有一些小问题。那就是，某些测试节点容易出问题，导致我们网站无法访问，所以这个告警机制可以重新编排一下：

当 n 个节点出现问题，再进行告警：

```text
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
    final_status_time = 6
    start_time = 0

    total_list = '''62a55a0e-387e-4d87-bf69-5e0c9dd6b983 江苏宿迁[电信]
    f403cdf2-27f8-4ccd-8f22-6f5a28a01309 广东佛山[电信]
    bcff47de-61bb-4bf7-9fe6-4e456067e540 广东惠州[电信]
    7740099a-6b60-49e0-9913-2f0b416ae63b 广东深圳[电信]
    2bfd90a0-4661-4920-9963-0241cd3fc0db 浙江湖州[电信]
    b698f5c4-0c88-4ae4-b123-ef57293ce442 辽宁大连[电信]
    7253644b-58d3-48bb-808a-3c8b9416cfd5 江苏泰州[电信]
    d8c0d1d1-9da8-4480-a9df-555731cdd7b8 安徽合肥[电信]
    299f5043-d454-4485-945f-a331d960d86e 江苏镇江[电信]
    38522b83-8893-4ca6-b45f-b6588b034462 云南昆明[电信]
    19705ba7-3816-4b35-976b-c3b8d69e78d2 湖南长沙[电信]
    8081b399-499a-4680-9a5a-723977cfea04 湖南衡阳[电信]
    5713f157-3378-495a-9c55-7172187e9f36 江苏宿迁[电信]
    a80cd07e-5508-4be6-8c83-524fe59318b8 江苏泰州[电信]
    4daa81e2-f397-4cde-bf74-b2bee84a4ea5 江苏宿迁[电信]
    bdd1ecd4-5516-44f8-8022-d83e4ac102f2 广东佛山[电信]
    6b6f9b1c-6154-4696-96d6-112248f902dc 北京[电信]
    8292e59e-ffde-4988-814f-4fe7fc4ec888 贵州兴义[电信]
    be09c5ce-3031-4565-8f6a-3e328e256e16 江苏扬州[电信]
    524906a3-2749-4469-aee3-48885f042a3a 江苏徐州[电信]
    fce17d47-07c3-4315-892b-acd76d918ada 广西南宁[电信]
    21cf6110-400c-4c6b-87c8-cada4ec3f6a7 浙江台州[电信]
    0c8ca9bf-fa7a-42a3-9148-f15ead65f45e 广东深圳[电信]
    b1499d95-7e3c-472a-9682-e58e1b362633 江西九江[电信]
    4130a733-57c7-432b-ab8d-735ccbefbc0a 山东枣庄[电信]
    066ab75f-0a74-40e8-b717-d17a71eda942 广东惠州[电信]
    1befa95d-cde1-473e-b851-38440d034f1c 江苏泰州[电信]
    c5ae6abd-901b-47c7-9018-7eda8b4441c6 陕西西安[电信]
    d1e4fc25-16e5-4651-a8d7-b8df50dda396 江苏镇江[电信]
    70a537ed-95b2-4bfd-b6b0-64c3920d9910 重庆[电信]
    e6a3a9b7-2088-41be-bf1d-6a25276ab1ed 江西吉安[电信]
    0e34cba2-fe5c-40d2-9ec7-e497f99365b8 广东广州[电信]
    547e8248-6dfb-4f4f-b52d-8a287e89b844 湖北随州[电信]
    df8bdd7a-b928-41f8-959f-d0d56fadea64 四川绵阳[电信]
    4e5d43e6-9d6a-4e5a-b495-a78c0921d26d 四川成都[电信]
    36d59519-d4bb-4635-8476-1d6ea27f62b2 江苏镇江[电信]
    bc25c8fd-62a1-4c57-a44d-0855b6c67714 四川绵阳[电信]
    0d3fd0b2-1255-4e5d-b94e-717569d2e8bd 江苏扬州[电信]
    47a0f82f-7dbb-48f4-96e0-d7a279ebba11 浙江宁波[电信]
    61d76c8c-b681-4196-b734-7d8e60f1e3ae 浙江绍兴[电信]
    da8bc796-4e65-48ef-beaa-d2ee1a7dd4bf 广东佛山[电信]
    cd787783-c0f5-486c-ac9f-34a80e386c34 广东佛山[电信]
    0e8d2e22-74db-4b31-9edd-fdda946dcd03 江苏常州[电信]
    5daad9ff-ced5-426a-8216-bf2aad097de0 浙江温州[电信]
    91a304a7-f91b-49ac-abbe-b77442cbc48c 上海[电信]
    12b16bb6-d42d-4296-a394-b96b22bca9c3 陕西咸阳[电信]
    bf9f80ef-1ef7-4267-aece-4fb1e5fe45bf 湖北荆门[电信]
    cd442c9e-de26-470f-bba2-33a8e71e4639 福建泉州[电信]
    9fef7898-e2d3-4c02-ab2a-5dc780f5a65c 河南新乡[电信]
    65078859-3e99-48eb-b170-7463fc53a98e 辽宁大连[电信]
    0165e09b-aad3-46c2-87e8-160432229f60 贵州兴义[电信]
    817bc339-c6f6-479c-9708-01ca54f2be80 江西新余[电信]
    1edc7af0-68ac-427b-a368-c27610797971 广东佛山[电信]
    9bc90d67-d208-434d-b680-294ae4288571 新疆哈密[电信]
    b44faece-c6fe-4cc1-ab9a-ae7dcf37f146 辽宁鞍山[电信]
    7fb11d87-1029-487b-8345-27e12a6acf1e 江苏镇江[电信]
    04d82618-d562-4aa7-9db6-4600dd7f4780 湖南衡阳[电信]
    252167a8-eaeb-491b-a4f3-319d25680f48 江苏宿迁[电信]
    22456bec-ad37-49e8-ba6f-032b3faaa0a0 湖北武汉[电信]
    5802da93-4e05-4932-9bc6-20d5d75b7af5 江苏宿迁[电信]
    a083795a-b69f-49fe-a905-cd8838c09553 浙江温州[电信]
    9c3b9aed-4b8a-4258-9b1f-55016211ced9 广东深圳[电信]
    2140cc66-e5ea-4f56-981a-8f044a98c92a 浙江绍兴[电信]
    9a8406ca-8a2d-44b7-a60e-4fe0ff6dd3aa 陕西西安[电信]
    8df24006-5e55-428c-9f29-9a2386480a4d 湖北仙桃[电信]
    cb2be8e0-670f-4922-8dd8-a1dd155cbf97 广东深圳[多线]
    c5964a0d-c49f-4fac-833d-2348b3b1304b 江苏常州[多线]
    19ef9d71-e0cb-4b79-a416-8fd670f6e7ca 江苏泰州[多线]
    5bea1430-f7c2-4146-88f4-17a7dc73a953 河南新乡[多线]
    1f430ff0-eae9-413a-af2a-1c2a8986cff0 河南新乡[多线]
    ea551b59-2609-4ab4-89bc-14b2080f501a 河南新乡[多线]
    4d462057-4581-4ae1-974d-ca7ca019e700 河南新乡[多线]
    9c137190-5a57-4ef5-be4b-b9add998ad52 河南新乡[多线]
    120ec517-1b0f-4b6e-841d-61116f73099a 广东东莞[多线]
    cbc3caa1-9faf-438c-abde-fbd5c64c8036 辽宁大连[多线]
    ba9e31d2-918a-41ad-9d0b-99175e365583 江苏扬州[多线]
    74cb6a5c-b044-49d0-abee-bf42beb6ae05 江苏宿迁[多线]
    e0cf79c5-9159-4ea6-a2a7-1bcaf9bfb292 山西运城[联通]
    2805fa9f-05ea-46bc-8ac0-1769b782bf52 黑龙江哈尔滨[联通]
    5439460c-0115-421a-b8ad-449eb2b4c28a 广东深圳[联通]
    9b7cbf0a-76b8-4308-8b66-9093dbe22541 浙江金华[联通]
    a4800428-7ed4-4c8a-a049-4b90df6919f0 河南郑州[联通]
    654abac8-7b37-4a64-9a84-2d190db3d060 山东枣庄[联通]
    1b6a98df-c2f4-4a29-b5b5-1e44ce6d1309 浙江金华[联通]
    32574c06-d0fc-4709-8fc9-fce30596efd3 河南郑州[联通]
    87068aa4-3b0e-4e22-814e-8ff838036e1b 浙江金华[联通]
    457575e4-cbbd-4796-89df-ad9707f19254 河南新乡[联通]
    4d7637d7-4950-4b79-9741-c397789bcf05 山东济南[联通]
    7f46f5c9-d719-4886-b3c0-6b6427908791 福建福州[联通]
    c48a380c-bac5-4976-b56c-53e9e5ebb691 江苏徐州[联通]
    b615642c-ac86-4322-9fbe-4bd79e175a99 广东深圳[联通]
    ddfeba9f-a432-4b9a-b0a9-ef76e9499558 浙江嘉兴[联通]
    102df90c-0bcc-404a-97cd-475fd408ff6f 江苏宿迁[联通]
    62909299-548b-4bbc-a92a-959e6104fc2c 江苏徐州[联通]
    de221437-2390-4404-9a00-26b0853cf943 江苏宿迁[联通]
    7a23256e-1121-4c39-ba12-1ff663ba952a 福建福州[联通]
    5074fb13-4ab9-4f0a-87d9-f8ae51cb81c5 江苏常州[移动]
    722e28ca-dd02-4ccd-a134-f9d4218505a5 广东深圳[移动]
    8e7a403c-d998-4efa-b3d1-b67c0dfabc41 广东深圳[移动]'''

    url = "http://tool.chinaz.com/iframe.ashx?t=ping"

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
            'Host': 'tool.chinaz.com',
            'Origin': 'http://tool.chinaz.com',
            'Referer': 'http://tool.chinaz.com/speedtest/anycodes.cn',
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
                final_string = "%s\t总耗时:%s\t链接耗时:%s\t下载耗时:%s" % (node_name, alltime, conntime, downtime)
            except:
                final_string = "%s链接异常！" % (node_name)
                start_time = start_time + 1
        except:
            final_string = "%s链接超时！" % (node_name)
            start_time = start_time + 1
        final_list.append(final_string)
        print(final_string)
    if start_time > final_status_time:
        return (False,final_list)
    else:
        return (True, final_list)

def sendEmail(content, to_user):
    sender = 'service@anycodes.cn'
    receivers = [to_user]

    mail_msg = content
    message = MIMEText(mail_msg, 'html', 'utf-8')
    message['From'] = Header("网站监控", 'utf-8')
    message['To'] = Header("站长", 'utf-8')

    subject = "网站监控告警"
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
    # if getStatusCode(url) == 200:
    #     sendEmail("您的网站%s可以访问！" % (url), "service@52exe.cn")
    final_status,final_list = getWebTime()
    if final_status:
        sendEmail("您的网站%s的状态：<br>%s" % (url, "<br>".join(final_list)), "service@52exe.cn")
    else:
        sendEmail("您的网站%s的状态：<br>%s" % (url, "<br>".join(final_list)), "service@52exe.cn")



main_handler(None,None)
```

## **▎**灵感启发 PPPlus 版本

有很多同学，可能有时候不是监控自己的网站，而是要监控其他网站的某些行为。例如某个小说是否更新了，某个视频是否更新了，某个产品是否发布了，某个成绩是否出来了……其实这些情景都可以用腾讯云 Serverless 来开发，感兴趣的同学可以尝试一下！！

---

> **传送门：**
> - GitHub: [github.com/serverless](https://github.com/serverless/serverless/blob/master/README_CN.md) 
> - 官网：[serverless.com](https://serverless.com/)

欢迎访问：[Serverless 中文网](https://serverlesscloud.cn/)，您可以在 [最佳实践](https://serverlesscloud.cn/best-practice) 里体验更多关于 Serverless 应用的开发！
