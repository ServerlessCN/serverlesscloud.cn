---
title: 万物皆可 Serverless 之借助微信公众号简单管理用户激活码
description: 本文尝试带大家使用无服务器云函数和对象存储，快速编写上线自己的用户激活码后端管理云函数，然后把自己的微信公众号后台做为应用前台，简单管理用户激活码。
keywords: Serverless,Serverless python,Serverless应用
date: 2020-04-13
thumbnail: https://img.serverlesscloud.cn/2020523/1590214222379-%E4%BC%81%E4%B8%9A%E5%BE%AE%E4%BF%A1%E6%88%AA%E5%9B%BE_159021417080.png
categories:
  - user-stories
authors:
  - 乂乂又又
authorslink:
  - https://cloud.tencent.com/developer/article/1618586
tags:
  - Serverless
  - 微信公众号
---

作为一名独立开发者，最近我在考虑给自己的应用加入付费功能，然后应用的核心功能只需使用激活码付费激活即可。这个需求涉及到了激活码的保存、校验和后台管理，传统的做法可能是自己购买服务器，搭建配置服务器环境，然后创建数据库，编写后端业务逻辑代码，必要的时候还要自己去写一些前端的界面来管理后台数据。

这是一个十分耗时且无趣的工作。本文则独辟蹊径，尝试带大家使用云函数 SCF 和对象存储 COS，快速编写上线自己的用户激活码后端管理云函数，然后把自己的微信公众号后台做为应用前台，简单管理用户激活码。

## 效果展示

![添加一个 365 天有效期的激活码]( https://img.serverlesscloud.cn/2020523/1590214222430-%E4%BC%81%E4%B8%9A%E5%BE%AE%E4%BF%A1%E6%88%AA%E5%9B%BE_159021417080.png )

可以看到，现在我们只需要在自己的微信公众号后台回复 会员@激活时长，就可以添加并回复一个指定有效期的会员激活码，实现了在微信公众号简单管理用户激活码的需求。

## 操作步骤

### 第一步：新建 python 云函数

参见之前的系列文章[《万物皆可 Serverless 之使用 SCF+COS 快速开发全栈应用》](https://serverlesscloud.cn/blog/2020-04-23-serverless-scf-cos/)

### 第二步：编写云函数

话不多说，上代码

```javascript
import json
from wechatpy.replies import ArticlesReply
from wechatpy.utils import check_signature
from wechatpy.crypto import WeChatCrypto
from wechatpy import parse_message, create_reply
from wechatpy.exceptions import InvalidSignatureException, InvalidAppIdException
import datetime
import random

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
secret_id = u'xxxxxxxxxxxxxxx'
secret_key = u'xxxxxxxxxxxxxxx'
region = u'ap-chongqing'
bucket = 'name'+'-'+appid

# 微信公众号对接
wecaht_id = 'xxxxxxxxxxxxxxx'
WECHAT_TOKEN = 'xxxxxxxxxxxxxxxxxxx'
encoding_aes_key = 'xxxxxxxxxxxxxxxxxxxxxx'

# 对象存储实例
config = CosConfig(Secret_id=secret_id, Secret_key=secret_key, Region=region)
client = CosS3Client(config)

#微信公众号后台消息加解密实例
crypto = WeChatCrypto(WECHAT_TOKEN, encoding_aes_key, wecaht_id)

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

#获取所有会员激活码
def getvips():
    vipMap = {}
    vipTxt = cosRead('vips.txt')  # 读取数据
    if len(vipTxt) > 0:
        vipMap = json.loads(vipTxt)
    return vipMap

#添加会员激活码
def addvip(days):
    vip=randomKey()
    vipMap = getvips()
    if len(vipMap) > 0:
        vipMap[vip] = (datetime.datetime.now()+datetime.timedelta(days=days)).strftime("%Y-%m-%d")
    return cosWrite('vips.txt', json.dumps(vipMap, ensure_ascii=False)),vip if len(vipMap) > 0 else False,''

#删除会员激活码
def delvip(vip):
    vipMap = getvips()
    if len(vipMap) > 0:
        vipMap.pop(vip)
    return cosWrite('vips.txt', json.dumps(vipMap, ensure_ascii=False)) if len(vipMap) > 0 else False

# 获取今日日期
def today():
    return datetime.datetime.now().strftime("%Y-%m-%d")

# 判断激活码是否到期
def checkVip(t):
    return t == today()

# 随机生成激活码
def randomKey():
    return ''.join(random.sample('zyxwvutsrqponmlkjihgfedcba0123456789', 6))

#每天定时检查删除过期的激活码
def check_del_vips():
    vipMap = getvips()
    if len(vipMap) < 1:
        return
    for vip in vipMap.keys():
        if not checkVip(vipMap[vip]):
            vipMap.pop(vip)
    return cosWrite('vips.txt', json.dumps(vipMap, ensure_ascii=False))


# api网关响应集成
def apiReply(reply, txt=False, content_type='application/json', code=200):
    return {
        "isBase64Encoded": False,
        "statusCode": code,
        "headers": {'Content-Type': content_type},
        "body": json.dumps(reply, ensure_ascii=False) if not txt else str(reply)
    }

def replyMessage(msg):
    txt = msg.content
    if '@' in txt:
        keys = txt.split('@')
        if keys[0] == '会员': # 会员@356 --> 添加一个365天的会员激活码
            flag,vip=addvip(keys[1])
            return create_reply(f"您的激活码:{vip}，有效期:{keys[1]}天" if flag else "添加失败", msg)
    return create_reply("喵呜 ฅ'ω'ฅ", msg)

def wechat(httpMethod, requestParameters, body=''):
    if httpMethod == 'GET':
        signature = requestParameters['signature']
        timestamp = requestParameters['timestamp']
        nonce = requestParameters['nonce']
        echo_str = requestParameters['echostr']
        try:
            check_signature(WECHAT_TOKEN, signature, timestamp, nonce)
        except InvalidSignatureException:
            echo_str = 'error'
        return apiReply(echo_str, txt=True, content_type="text/plain")
    elif httpMethod == 'POST':
        msg_signature = requestParameters['msg_signature']
        timestamp = requestParameters['timestamp']
        nonce = requestParameters['nonce']
        try:
            decrypted_xml = crypto.decrypt_message(
                body,
                msg_signature,
                timestamp,
                nonce
            )
        except (InvalidAppIdException, InvalidSignatureException):
            return
        msg = parse_message(decrypted_xml)
        if msg.type == 'text':
            reply = replyMessage(msg)
        else:
            reply = create_reply('哈◔ ‸◔？\n搞不明白你给我发了啥~', msg)
        reply = reply.render()
        reply = crypto.encrypt_message(reply, nonce, timestamp)
        return apiReply(reply, txt=True, content_type="application/xml")
    else:
        msg = parse_message(body)
        reply = create_reply("喵呜 ฅ'ω'ฅ", msg).render()
        reply = crypto.encrypt_message(reply, nonce, timestamp)
        return apiReply(reply, txt=True, content_type="application/xml")

def main_handler(event, context):
    if 'Time' in event.keys():  # 来自定时触发器
        return check_del_vips()
    httpMethod = event["httpMethod"]
    requestParameters = event['queryString']
    body = event['body'] if 'body' in event.keys() else ''
    response = wechat(httpMethod, requestParameters, body=body)
    return response
```

~~OK, 教程结束，~~

哈？你说没看懂这堆代码？

好吧，我再耐心给大家捋一下，这次可一定要记住了哈~

```javascript
def main_handler(event, context):
    if 'Time' in event.keys():  # 来自定时触发器
        return check_del_vips()
    httpMethod = event["httpMethod"]
    requestParameters = event['queryString']
    body = event['body'] if 'body' in event.keys() else ''
    response = wechat(httpMethod, requestParameters, body=body)
    return response
```

先从云函数入口函数开始，我们可以从 event 的 keys 里是否存在 Time 来判断云函数是否是被定时器触发的

```javascript
#每天定时检查删除过期的激活码
def check_del_vips():
    vipMap = getvips()
    if len(vipMap) < 1:
        return
    for vip in vipMap.keys():
        if not checkVip(vipMap[vip]):
            vipMap.pop(vip)
    return cosWrite('vips.txt', json.dumps(vipMap, ensure_ascii=False))
```

这里设置定时器来触发云函数是为了每天检查一遍有没有激活码失效了，失效的激活码会被删除掉。

```javascript
def wechat(httpMethod, requestParameters, body=''):
    if httpMethod == 'GET':
        signature = requestParameters['signature']
        timestamp = requestParameters['timestamp']
        nonce = requestParameters['nonce']
        echo_str = requestParameters['echostr']
        try:
            check_signature(WECHAT_TOKEN, signature, timestamp, nonce)
        except InvalidSignatureException:
            echo_str = 'error'
        return apiReply(echo_str, txt=True, content_type="text/plain")
    elif httpMethod == 'POST':
        msg_signature = requestParameters['msg_signature']
        timestamp = requestParameters['timestamp']
        nonce = requestParameters['nonce']
        try:
            decrypted_xml = crypto.decrypt_message(
                body,
                msg_signature,
                timestamp,
                nonce
            )
        except (InvalidAppIdException, InvalidSignatureException):
            return
        msg = parse_message(decrypted_xml)
        if msg.type == 'text':
            reply = replyMessage(msg)
        else:
            reply = create_reply('哈◔ ‸◔？\n搞不明白你给我发了啥~', msg)
        reply = reply.render()
        reply = crypto.encrypt_message(reply, nonce, timestamp)
        return apiReply(reply, txt=True, content_type="application/xml")
    else:
        msg = parse_message(body)
        reply = create_reply("喵呜 ฅ'ω'ฅ", msg).render()
        reply = crypto.encrypt_message(reply, nonce, timestamp)
        return apiReply(reply, txt=True, content_type="application/xml")
```

如果云函数不是通过定时器触发，那它就是通过后面我们要设置的 api 网关给触发的，这时候就是我们的微信公众号后台发消息过来了，我们先用 `crypto.decrypt\_message` 来解密一下消息。

```javascript
if msg.type == 'text':
   reply = replyMessage(msg)
else:
   reply = create_reply('哈◔ ‸◔？\n搞不明白你给我发了啥~', msg)
```

然后判断一下消息的类型（文字、图片、语音、视频或者其他类型），如果不是文字消息，我们就先暂不处理啦 ~

```javascript
def replyMessage(msg):
    txt = msg.content
    if '@' in txt:
        keys = txt.split('@')
        if keys[0] == '会员': # 会员@356 --> 添加一个365天的会员激活码
            flag,vip=addvip(keys[1])
            return create_reply(f"您的激活码:{vip}，有效期:{keys[1]}天" if flag else "添加失败", msg)
    return create_reply("喵呜 ฅ'ω'ฅ", msg)
```

然后对于文字消息我们按照自己规定的命令格式来解析处理用户消息即可。

```javascript
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
secret_id = u'xxxxxxxxxxxxxxx'
secret_key = u'xxxxxxxxxxxxxxx'
region = u'ap-chongqing'
bucket = 'name'+'-'+appid


# 对象存储实例
config = CosConfig(Secret_id=secret_id, Secret_key=secret_key, Region=region)
client = CosS3Client(config)


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

# api网关响应集成
def apiReply(reply, txt=False, content_type='application/json', code=200):
    return {
        "isBase64Encoded": False,
        "statusCode": code,
        "headers": {'Content-Type': content_type},
        "body": json.dumps(reply, ensure_ascii=False) if not txt else str(reply)
    }
```

其他的诸如腾讯云 cos 的读写和消息回复的格式之类的问题，就不再细说了，之前的系列文章[《万物皆可 Serverless 之使用 SCF+COS 快速开发全栈应用》](https://serverlesscloud.cn/blog/2020-04-23-serverless-scf-cos/) 里面都有详细讲到。



---
<div id='scf-deploy-iframe-or-md'></div>

---

> **传送门：**
> - GitHub: [github.com/serverless](https://github.com/serverless/serverless/blob/master/README_CN.md)
> - 官网：[serverless.com](https://serverless.com/)

欢迎访问：[Serverless 中文网](https://serverlesscloud.cn/)，您可以在 [最佳实践](https://serverlesscloud.cn/best-practice) 里体验更多关于 Serverless 应用的开发！
