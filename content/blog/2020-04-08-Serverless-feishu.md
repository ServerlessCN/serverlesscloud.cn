---
title: 使用 Serverless + 飞书打造你的个性化消息提醒系统
description: 可以将消息集中起来并且及时推送呢？在这里我想向大家推荐一个解决方案，那就是使用 Serverless + 飞书打造属于自己的个性化消息提醒系统。
keywords: Serverless,飞书,Serverless应用
date: 2020-04-08
thumbnail: https://img.serverlesscloud.cn/2020522/1590171266721-%E4%BC%81%E4%B8%9A%E5%BE%AE%E4%BF%A1%E6%88%AA%E5%9B%BE_15901711409297.png
categories:
  - user-stories
authors:
  - 用户1358150
authorslink:
  - https://cloud.tencent.com/developer/article/1610964
tags:
  - Serverless
  - 飞书
---

## 一、前言

在日常工作学习生活中，我们可能会遇到以下情形：

- 自己管理的某台服务器宕机了，但是没有得到及时的提醒，导致业务受到损失
- 某些自己很想注册的网站悄悄开放注册，但是自己并没有及时得知，于是只能继续漫无目的的等待
- ……

如果每件事都花时间去关注，那我们的时间必然会不够用，那有没有什么办法可以让这些消息**集中**起来并且**及时**推送呢？在这里我想向大家推荐一个解决方案，那就是**使用 Serverless + 飞书打造属于自己的个性化消息提醒系统**。

## 二、准备工作

1. 首先注册一个飞书账号，然后在[飞书网页版](https://www.feishu.cn/)登录

2. 打开[飞书开放平台](https://open.feishu.cn/app/)，点击**创建企业自建应用**，并输入**应用名称**和**应用副标题**，然后点击**确定创建**

![点击创建企业自建应用](  https://img.serverlesscloud.cn/2020522/1590171266341-%E4%BC%81%E4%B8%9A%E5%BE%AE%E4%BF%A1%E6%88%AA%E5%9B%BE_15901711409297.png)

![输入应用名称和应用副标题，然后点击确定创建]( https://img.serverlesscloud.cn/2020522/1590171266312-%E4%BC%81%E4%B8%9A%E5%BE%AE%E4%BF%A1%E6%88%AA%E5%9B%BE_15901711409297.png )

3. 在企业自建应用列表中点击刚刚创建成功的应用，并记录 **App ID** 和 **App Secret**

![记录 App ID 和 App Secret]( https://img.serverlesscloud.cn/2020522/1590171266328-%E4%BC%81%E4%B8%9A%E5%BE%AE%E4%BF%A1%E6%88%AA%E5%9B%BE_15901711409297.png )

## 二、编写代码

1. 在本地新建一个项目目录，名称随意，这里以 `feishu-notify` 为例

2. 分别创建 3 个文件：`.env`，`index.py` 和 `serverless.yml`

3. 按如下说明进行编码

### .env

```javascript
TENCENT_SECRET_ID=AKID********************************
TENCENT_SECRET_KEY=********************************
```

> 注：这里的 `TENCENT_SECRET_ID` 和 `TENCENT_SECRET_KEY` 可在腾讯云控制台的[访问密钥](https://console.cloud.tencent.com/cam/capi)中获取，如果没有密钥则需要自己新建一个

### serverless.yml

```javascript
myFunction:
  component: "@serverless/tencent-scf"
  inputs:
    name: feishu-notify-py
    codeUri: "./"
    handler: index.main_handler
    runtime: Python3.6
    region: ap-guangzhou
    description: My Serverless Function Used to Notify Myself
    memorySize: 128
    events:
    - apigw:
        name: serverless
        parameters:
          protocols:
          - https
          endpoints:
          - path: "/"
            method: POST
```

> 注：可以点击[这里](https://github.com/serverless-components/tencent-scf/blob/master/docs/configure.md)查看`serverless.yml`中所有可用属性的属性列表

### index.py

```javascript
def main_handler(event, context):
    import requests
    import json
    print(event)
    CONFIG = {
        "app_id": "********************",
        "app_secret": "********************************"
    }
    # my auth
    if 'myauth' not in event['queryString'] or event['queryString']['myauth'] != 'feishu1':
        return 'forbidden'
    # Get content
    postContent = event['body']
    try:
        postContent = json.loads(postContent)
    except:
        return 'error in json_loads(line: 19)'
    if 'content' not in postContent:
        return 'invalid params'
    content = postContent['content']
    # Get tenant_access_token
    try:
        res = requests.post('https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal/', {
            "app_id": CONFIG['app_id'],
            "app_secret": CONFIG['app_secret']
        })
    except:
        return 'error in get_tenant_access_token'
    data = json.loads(res.text)
    if data['code'] != 0:
        return data['msg']
    token = data['tenant_access_token']
    # Get chat_id
    try:
        res = requests.get('https://open.feishu.cn/open-apis/chat/v4/list', headers={
            'Authorization': 'Bearer %s' % (token)
        })
    except:
        return 'error in get_chat_id'
    data = json.loads(res.text)
    if data['code'] != 0:
        return data['msg']
    groupList = data['data']['groups']
    myGroupId = groupList[0]['chat_id']
    # Send message
    try:
        res = requests.post('https://open.feishu.cn/open-apis/message/v4/send/', json={
            "chat_id": myGroupId,
            "msg_type": "text",
            "content": {
                "text": content
            }
        }, headers={
            'Authorization': 'Bearer %s' % (token),
            'Content-Type': 'application/json'
        })
    except:
        return 'error in send message'
    data = json.loads(res.text)
    if data['code'] != 0:
        return data['msg']
    return 'success'
```

关于 `index.py`，这里有几点需要作出说明：

1. 代码中的 `app_id` 和 `app_secret` 项需填写在准备工作记录的 **App ID** 和 **App Secret**
2. 最终我们使用 `POST` 方法发送消息
3. 在调用时，我们还需要在 `query` 处加上 `?myauth=feishu1`，目的是作简单验证以防止他人发送，例如 `https://service-********-**********.**.apigw.tencentcs.com/release/?myauth=feishu1`

## 三、部署 Serverless 服务

1. 通过 npm 安装 Serverless

```javascript
$ npm install -g serverless
```

2. 通过`serverless`命令进行部署，并添加`--debug`参数查看部署过程中的信息

```javascript
$ serverless --debug
```

3. 从终端获取 API 网关的 URL

![serverless]( https://img.serverlesscloud.cn/2020522/1590171266346-%E4%BC%81%E4%B8%9A%E5%BE%AE%E4%BF%A1%E6%88%AA%E5%9B%BE_15901711409297.png )

获取 API 网关的 URL

## 四、上线应用

1. 回到[飞书开放平台](https://open.feishu.cn/app/)，在企业自建应用列表中点击刚刚创建成功的应用

2. 点击**应用功能**-**机器人**，点击**启用机器人**

![启用机器人]( https://img.serverlesscloud.cn/2020522/1590171266342-%E4%BC%81%E4%B8%9A%E5%BE%AE%E4%BF%A1%E6%88%AA%E5%9B%BE_15901711409297.png )

3. 点击**版本管理与发布**-**创建版本**，参考下图进行配置（先不要点保存）

![创建版本]( https://img.serverlesscloud.cn/2020522/1590171266347-%E4%BC%81%E4%B8%9A%E5%BE%AE%E4%BF%A1%E6%88%AA%E5%9B%BE_15901711409297.png )

4. 在**可用性状态**处点击**编辑**，选择所有员工，然后点击**保存**

![配置可用性状态]( https://img.serverlesscloud.cn/2020522/1590171267537-%E4%BC%81%E4%B8%9A%E5%BE%AE%E4%BF%A1%E6%88%AA%E5%9B%BE_15901711409297.png  )

5. 点击**申请发布**

![申请发布](  https://img.serverlesscloud.cn/2020522/1590171267505-%E4%BC%81%E4%B8%9A%E5%BE%AE%E4%BF%A1%E6%88%AA%E5%9B%BE_15901711409297.png  )

6. 点击飞书网页版的头像，进入飞书管理后台

![进入管理后台]( https://img.serverlesscloud.cn/2020522/1590171266679-%E4%BC%81%E4%B8%9A%E5%BE%AE%E4%BF%A1%E6%88%AA%E5%9B%BE_15901711409297.png  )


7. 点击**工作台**-**应用审核**，然后点击**审核**

![审核应用]( https://img.serverlesscloud.cn/2020522/1590171266665-%E4%BC%81%E4%B8%9A%E5%BE%AE%E4%BF%A1%E6%88%AA%E5%9B%BE_15901711409297.png)


8. 点击**通过**

## 五、调用接口

**请求方式：** POST

**请求地址：** 上面获取的 APIGateway 的 URL

**请求 Header：**

| 参数         | 类型   | 必填/选填 | 说明         | 默认值 | 实例             |
| :----------- | :----- | :-------- | :----------- | :----- | :--------------- |
| Content-Type | string | 必填      | Content-Type |        | application/json |


**请求 Query：**

| 参数   | 类型   | 必填/选填 | 说明     | 默认值 | 实例    |
| :----- | :----- | :-------- | :------- | :----- | :------ |
| myauth | string | 必填      | 简单验证 |        | feishu1 |


**请求 Body：**

```javascript
{
    "content": "这里填入你想要发送的信息"
}
```

## 六、效果

为了方便，这里使用 Chrome 浏览器插件 **Talend API Tester** 进行调用

![使用 Talend API Tester 调用接口](https://img.serverlesscloud.cn/2020522/1590171267436-%E4%BC%81%E4%B8%9A%E5%BE%AE%E4%BF%A1%E6%88%AA%E5%9B%BE_15901711409297.png)

可以看到，飞书的消息推送很及时

![电脑端效果](https://img.serverlesscloud.cn/2020522/1590171266721-%E4%BC%81%E4%B8%9A%E5%BE%AE%E4%BF%A1%E6%88%AA%E5%9B%BE_15901711409297.png)



## 七、结语

其实利用飞书能实现的并不只有这些而已，我相信聪明的你一定能开发出更加好玩的应用。本次的分享到此结束，感谢各位的浏览！下面分享一些实用的链接：

- 腾讯云云函数（SCF）文档：[https://cloud.tencent.com/document/product/583](https://cloud.tencent.com/document/product/583?from=10680)
- 腾讯云 Serverless Framework 文档：[https://cloud.tencent.com/document/product/1154](https://cloud.tencent.com/document/product/1154?from=10680)
- 腾讯云 API 网关文档：[https://cloud.tencent.com/document/product/628](https://cloud.tencent.com/document/product/628?from=10680)
- 飞书开放平台开发文档：[https://open.feishu.cn/document/](https://open.feishu.cn/document/)

---
<div id='scf-deploy-iframe-or-md'></div>

---

> **传送门：**
> - GitHub: [github.com/serverless](https://github.com/serverless/serverless/blob/master/README_CN.md)
> - 官网：[serverless.com](https://serverless.com/)

欢迎访问：[Serverless 中文网](https://serverlesscloud.cn/)，您可以在 [最佳实践](https://serverlesscloud.cn/best-practice) 里体验更多关于 Serverless 应用的开发！