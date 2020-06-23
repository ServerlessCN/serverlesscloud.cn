---
title: 手把手带你利用云函数 SCF 轻松实现一个热点资讯小程序
description: 新技能，手把手带你利用云函数轻松实现一个热点资讯小程序
keywords: Serverless
date: 2020-04-09
thumbnail: https://img.serverlesscloud.cn/2020522/1590168389721-%E4%BC%81%E4%B8%9A%E5%BE%AE%E4%BF%A1%E6%88%AA%E5%9B%BE_15901683546214.png
categories:
  - user-stories
authors:
  - brzhang
authorslink:
  - https://cloud.tencent.com/developer/article/1609581
tags:
  - 云函数
  - 小程序
---

## 第一步，环境配置

打开微信[小程序开发](https://cloud.tencent.com/solution/la?from=10908) IDE，创建一个小程序项目，AppID 需要自己去小程序官网注册一个，然后后端服务注意选择[小程序-云开发](https://cloud.tencent.com/product/tcb?from=10908)。

注意，以前的老版本 IDE，在蓝色框那里会有一个**腾讯云**的选项。实际上都是使用的腾讯云服务，统一选择小程序-云开发就好。

![serverless]( https://img.serverlesscloud.cn/2020522/1590168390127-%E4%BC%81%E4%B8%9A%E5%BE%AE%E4%BF%A1%E6%88%AA%E5%9B%BE_15901683546214.png )

点击**新建**，会出现这样一个界面：

![serverless]( https://img.serverlesscloud.cn/2020522/1590168390210-%E4%BC%81%E4%B8%9A%E5%BE%AE%E4%BF%A1%E6%88%AA%E5%9B%BE_15901683546214.png )

可以看到，微信开发者工具的脚手架已经为我们创建好了一些模板代码，今天，猪脚就是我们的 **cloudfunctions** 部分，即如何利用**腾讯云**为我们即将写的新闻小程序提供数据服务。

在开发之前，我们发现控制台报了一个错误，提示我们没有开通云服务。我们发现微信开发者工具的顶部工具栏中，云开发那个按钮是灰色的，点击进去，提示我们开通，表示我们没有开通云开发服务，点击它，新建一个。

![serverless](  https://img.serverlesscloud.cn/2020522/1590168390129-%E4%BC%81%E4%B8%9A%E5%BE%AE%E4%BF%A1%E6%88%AA%E5%9B%BE_15901683546214.png  )

配置完毕之后，你可能会关系费用问题，不用担心，默认的配置是完全免费的，如果你用户量不太大，基本上够你的日常需求了，对个人开发者来说，相当的友好。

![serverless]( https://img.serverlesscloud.cn/2020522/1590168389290-%E4%BC%81%E4%B8%9A%E5%BE%AE%E4%BF%A1%E6%88%AA%E5%9B%BE_15901683546214.png )

## 第二步：云函数开发及部署

云服务开通完毕，接下来可以部署下脚手架为我们提供的云函数，可以看到 cloudfunctions 文件夹提示未选择环境，我们右键点击，选择我们刚才开通的那个云开发环境。然后展开目录，对准 login 这个目录，右键，选择

![serverless]( https://img.serverlesscloud.cn/2020522/1590168390283-%E4%BC%81%E4%B8%9A%E5%BE%AE%E4%BF%A1%E6%88%AA%E5%9B%BE_15901683546214.png )

然后，关闭 IDE，重启 IDE，在点击第一个按钮，获取 openid，此时可以看到获取 openid 是成功的了。

![serverless]( https://img.serverlesscloud.cn/2020522/1590168389247-%E4%BC%81%E4%B8%9A%E5%BE%AE%E4%BF%A1%E6%88%AA%E5%9B%BE_15901683546214.png )

这里表示我们的云开发环境从开通到部署的链路已经打通了，接下来的事情，当然是写自己的云函数了。我们是要做一个新闻咨询的小程序，所以，一般来说，找一个自己经常看的觉得内容质量不错的新闻内网站看看人家提供了什么接口没，分两步走：

1. **如果有提供了接口**，我们在云函数中直接调用接口，拿到数据，喂给小程序前端即可，这种最方便了。

2. **通常情况下是没有接口的**，此时怎么办？一个思路是使用云函数去爬取新闻网站的内容，存放到云开发 db 上面，然后小程序端来读云开发 db 中的内容，亦或者直接通过通过爬虫程序生成一个 json 返回给小程序端，不通过存储 db 这个过程。其缺点是没有缓存数据，每次都要经过爬虫去爬，用户可能等很久才能看到新闻，体验并不好。目前，云开发套件里面有提供 db 服务，所以，既然提供了，当然就直接拿来使用了，提升用户体验的事，当然就得干了。

本文为了简便期间，目的就是为了介绍如何在小程序中使用腾讯云的云函数功能，因此，就不介绍 db 的存储了。那么，开始吧。

### 新建云函数

直接对这 cloudfunctions 那个文件夹点击新建云函数，成功之后就会看到目录里面有脚手架生成的一些框架代码了。

```javascript
// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  return {
    event,
    data:data
  }
}
```

大多看到是这种，其中 wxContext 是小程序的上下文，这里可以拿到小程序的 AppID 等等一些常量信息。

然后，event 这个参数是干嘛，event 其实就是小程序端传递给这边的参数：

```javascript
getNews:function(){
    wx.cloud.callFunction({
      name: 'news',
      data: {
        hot_type:'views',//hot_type 可接受参数 views（浏览数） | likes（点赞数） | comments（评论数）
        category:'Article',//category 可接受参数 Article | GanHuo | Girl
        count:20
      },
      success: res => {
        console.log('[云函数] [news] 调用')
        console.log(res)
        this.setData({
          news:res.result.data
        })
      },
      fail: err => {
        console.error('[云函数] [news] 调用失败', err)
      }
    })
  },
```

比如，我在小程序端调用 news 这个云函数，传递 data 为

```javascript
{
  hot_type:'views',//hot_type 可接受参数 views（浏览数） | likes（点赞数） | comments（评论数）
  category:'Article',//category 可接受参数 Article | GanHuo | Girl
  count:20
}
```

那么这个 event 其实就是这个 object。

好了，了解了脚手架为我们创建的一些模板及其参数之后，我们就可以编写业务逻辑了。

### 获取新闻逻辑

获取新闻需要发送网络请求，这里我们直接使用 axios，但是微信小程序这里没有提供，所以我们需要在云函数的目录中去执行

```javascript
npm i axios
```

注意，一定是在你生成的按个云函数的目录中去执行 `npm i`

然后，就可以愉快的写网路请求了。

```javascript
// 云函数入口文件
const cloud = require('wx-server-sdk')
const axios = require('axios')
cloud.init()

async function getNews(category,hot_type,count) {
  console.log('start getNews')
  let data = {}
  try {
    const url = `https://gank.io/api/v2/hot/${hot_type}/category/${category}/count/${count}`
    console.log(url)
    var res = await axios.get(url)
    data = res.data.data
  } catch (err) {
    console.log(err)
  }
  return data
}
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const data =  await getNews(event.category,event.hot_type,event.count)
  console.log(data)
  return {
    event,
    data:data
  }
}
```

如上，我在云函数中加了一个 getNews 的方法，接受的三个参数是小程序端传递过来的。然后拿到请求结果之后，在返回给小程序端。需要注意的是，返回的 body 是这样的。

![serverless]( https://img.serverlesscloud.cn/2020522/1590168389721-%E4%BC%81%E4%B8%9A%E5%BE%AE%E4%BF%A1%E6%88%AA%E5%9B%BE_15901683546214.png )

而我们真正从云函数拿到的结果包裹在内层的 result 中。

至此，手把手带你使用云函数进行小程序开发已经结束了，相信这个简单的 demo 可以带你打开对如何利用云函数开发更多有趣的小程序的大门。

比如，你可以做一个小游戏，利用云函数作为中转请求你的后台，让云函数实现权限校验，来保护你自己的服务器。

比如，你可以做一个亲子相册，利用云函数，存储图片到[腾讯云存储](https://cloud.tencent.com/product/cos?from=10908)。

亦或者，你可以做聊天室...


---
<div id='scf-deploy-iframe-or-md'></div>

---

> **传送门：**
> - GitHub: [github.com/serverless](https://github.com/serverless/serverless/blob/master/README_CN.md)
> - 官网：[serverless.com](https://serverless.com/)

欢迎访问：[Serverless 中文网](https://serverlesscloud.cn/)，您可以在 [最佳实践](https://serverlesscloud.cn/best-practice) 里体验更多关于 Serverless 应用的开发！