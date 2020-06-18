---
title: 万物皆可 Serverless 之使用云函数 SCF+COS 快速开发全栈应用
description: 我是在一个前端初学者的背景下，前后仅花了大概三天的时间，就完成了一个比较简单的网页应用，这就是 Severless 的魅力所在，它可以让你快速开发上线全栈应用，无论你是前端或是后端开发者都可以获益许多。
keywords: Serverless,Serverless全栈,Serverless应用
date: 2020-04-23
thumbnail: https://img.serverlesscloud.cn/202068/1591592273724-70zt6hhv58%20%281%29.png
categories:
  - user-stories
authors:
  - 乂乂又又
authorslink:
  - https://cloud.tencent.com/developer/article/1612750
tags:
  - 全栈应用
  - 云函数
---

我一直想做一个网页应用，奈何没有系统学习过前端，直到后来我接触到腾讯云无服务器云函数 SCF，让前端可以快速获得后端的能力同时，一并解决了前端数据请求跨域的问题。

没错，云函数 SCF 就是那种一旦用了就无法回到原来那种神奇的东西，让人不禁感叹为什么没有早点遇到 SCF

然后我花了大概一天的时间编写调试上线发布云函数（应用后端），然后又用了一天的时间学了下前端，主要是确定要用到的技术栈（后面我会再讲到这个问题），然后第三天正式开始开发应用，将云函数引入前端调用，测试数据，调整布局，打包网页发布到 coding pages。

**所以在我是一个前端初学者的背景下，前后仅花了大概三天的时间，就完成了这样一个比较简单的网页应用**

这就是 Severless 的魅力所在，它可以让你快速开发上线全栈应用，无论你是前端或是后端开发者都可以获益许多。

## 效果展示

- 首页

![首页](https://img.serverlesscloud.cn/2020523/1590202785387-16206.jpg)

- 视频播放页

![视频播放页](https://img.serverlesscloud.cn/2020523/1590202785551-16206.jpg)

更详细的体验可访问 https://wo-cao.cn/ ，仅做测试之用，不要乱搞哦~

是不是有点跃跃欲试涅？让我们开始吧~

## 前端部分

由于初涉前端，前端丰富得让人眼花缭乱的生态让我花费了一整天的时间来确定所要用的框架。

这里大体说下我用到的前端技术栈，帮助小伙伴快速进入实际开发状态，不要像我这个前端小白一样在框架的选择上耗费太多时间

| 需求       | 第三方库          |
| :--------- | :---------------- |
| html预编译 | Pug               |
| css预编译  | Stylus            |
| js预编译   | TypeScript、Bable |
| 开发框架   | Vue               |
| 代码美化   | ESlint、Prettier  |
| 网页打包   | Parcel            |
| 状态管理   | Vuex              |
| UI组件     | Wired-Elements    |
| 视频播放   | Dplayer、Hls.js   |
| 数据请求   | Axios             |


然后贴一下搜索列表页面的源码，展示一下 **Vue+Pug+TypeScript+Stylus** 写起网页来有多~~酸爽~~

```javascript
<template lang="pug">
  div(style="margin:2.5vw;display: flex;flex-wrap: wrap;")
    div#box(v-bind:class="pc ? 'box_pc' : 'box_phone'" v-bind:value="item.title" v-for="(item,index) in items" @click="playx(index)")
      wired-image(v-bind:class="pc ? 'img_pc' : 'img_phone'" elevation="2" :src="item.cover")
      div(style='width:100%;')
        p(style="text-align: center;font-size:1rem;") {{ item.title }}
</template>

<script lang="ts">
import 'wired-elements'
import { open, pc, refreshPath } from '../app/tools/window'

export default {
  name: 'ResultList',
  data() {
    return {
      pc: true,
      items: this.$store.getters.getJsonState
    }
  },
  mounted() {
    this.pc = pc ? true : false
  },
  methods: {
    playx(index: number) {
      let video = this.items[index]
      this.$store.commit('setPlayState', video)
      open(this, video.title, '/play')
    }
  }
}
</script>

<style lang="stylus" scoped>
.img_pc
  max-width 17vw
.img_phone
  max-width 22vw
.box_pc
  margin:3vw;
  flex: 0 0 13%;
.box_phone
  margin:2.5vw;
  flex: 0 0 28%;
</style>
```

具体的开发过程就不细讲了，因为我本身只是前端初学者，继续讲下去难免有班门弄斧，误导他人的嫌疑~

然后这篇文章主要是讲如何借助腾讯云 SCF+[COS](https://cloud.tencent.com/product/cos?from=10680)快速实现网页的后端能力，下面我们就直接进入后端部分了。

## 后端部分

这一部分那我会分成两点展开，一个是腾讯云 Severless 开发环境的配置，另一个是本地云函数的开发调试和上线过程。

下面就让我们一起来解开 Severless 的神秘面纱一探究竟吧~

### 1. 安装 Tencent Serverless Toolkit for VS Code

所谓工欲善其事，必先利其器。为了更快速的开发调试发布云函数，我们需要先安装腾讯云官方的 Tencent Serverless 插件

相信我，你会爱死它的，它打通了云函数编写、调试和上线发布的所有流程，真正做到了一条龙服务

![云函数官方文档](https://img.serverlesscloud.cn/2020523/1590202785786-16206.jpg)

官方文档在这一块讲的还是蛮细致用心的，赞！感兴趣的同学可以去看下[《使用VS Code插件创建函数 》](https://cloud.tencent.com/document/product/583/37511?from=10680)

### 2. 编写云函数

安装好了 Tencent Serverless Toolkit for VS Code 插件，接着新建一个 python 环境下的 demo 云函数

![demo](https://img.serverlesscloud.cn/2020523/1590202785385-16206.jpg)

再来看下 template.yamal 文件里的函数配置

```javascript
Resources:
  default:
    Type: 'TencentCloud::Serverless::Namespace'
    demo:
      Properties:
        CodeUri: ./
        Description: This is a template function
        Environment:
          Variables:
            ENV_FIRST: env1
            ENV_SECOND: env2
        Handler: index.main_handler
        MemorySize: 128
        Timeout: 3
        Role: QCS_SCFExcuteRole
        Runtime: Python3.6
        # VpcConfig:
        #   VpcId: 'vpc-qdqc5k2p'
        #   SubnetId: 'subnet-pad6l61i'
        # Events:
        #   timer:
        #     Type: Timer
        #     Properties:
        #       CronExpression: '*/5 * * * *'
        #       Enable: True
        #   cli-appid.cos.ap-beijing.myqcloud.com: # full bucket name
        #     Type: COS
        #     Properties:
        #       Bucket: cli-appid.cos.ap-beijing.myqcloud.com
        #       Filter:
        #         Prefix: filterdir/
        #         Suffix: .jpg
        #       Events: cos:ObjectCreated:*
        #       Enable: True
        #   topic:            # topic name
        #     Type: CMQ
        #     Properties:
        #       Name: qname
        #   hello_world_apigw:  # ${FunctionName} + '_apigw'
        #     Type: APIGW
        #     Properties:
        #       StageName: release
        #       ServiceId:
        #       HttpMethod: ANY
      Type: 'TencentCloud::Serverless::Function'
Globals:
  Function:
    Timeout: 10
```

OK，这样我们就创建好了一个新的云函数，下面开始编写业务逻辑。

首先我们来看一下函数上线后，通过 Timer 或者 Api 网关触发函数时，`main\_handler(event, context)` 入口函数里的 event 长啥样？

假设我们通过访问 api 网关

```javascript
https://service-xxxxx-66666666.sh.apigw.tencentcs.com/release/demo?key=叶问
```

POST 提交了

```javascript
我是请求体
```

来触发云函数，那么通过打印 event 变量我们发现，这里的 event 大概长这个模样，它是一个 map

![event](https://img.serverlesscloud.cn/2020523/1590202785707-16206.jpg)

这样的话我们就可以得到以下对应关系

| 结果             | 对应值                              |
| :--------------- | :---------------------------------- |
| 请求方法         | event['httpMethod']                 |
| 请求头           | event['header']                     |
| 请求体           | event['body']                       |
| 链接内请求参数   | event['queryString']                |
| 请求来源IP地址   | event['requestContext']['sourceIp'] |
| 定时器触发时间戳 | event['Time']                       |


注意，API 网关触发函数时 event 里没有 Time 键值对这一项，这一点可以用来鉴别云函数是否是通过 Timer 定时器触发的

OK，知道 event 长啥样之后我们就可以解析前端发过来的请求，然后根据请求的参数返回结果了，但是需要注意的是，我们需要按照特定的格式给前端返回数据（API 网关需要开启响应集成）。

假设我们要返回一段 json 数据

```javascript
json = {
    "flag":"true",
    "message":"请求成功"
}
```

现在来定义一个函数处理一下返回数据的格式

```javascript
def apiReply(reply, code=200):
    return {
        "isBase64Encoded": False,
        "statusCode": code,
        "headers": {'Content-Type': 'application/json', "Access-Control-Allow-Origin": "*"},
        "body": json.dumps(reply, ensure_ascii=False)
    }
```

'Content-Type': 'application/json' 声明我们返回的数据格式是json

"Access-Control-Allow-Origin": "\*" 声明我们返回的数据是允许跨域调用的

json.dumps() 将我们要返回的 json 对象（一个 map）转成字符串

ensure\_ascii=False 是为了防止 json 中的中文在 json.dumps 之后乱码

![修改后的 index.py](https://img.serverlesscloud.cn/202063/1591167832655-kikunlj6ou.png)

之后网页前端就可以拿到我们返回的 json 了

```javascript
{
    "flag":"true",
    "message":"请求成功"
}
```

当然一个完整的后端是需要数据的增删查改功能的，这里刚好我也需要做一个搜索黑名单的功能。

（有些影视资源可能是侵犯版权的，我们要第一时间给予下架，保护正版，打击盗版）

考虑到搜索关键词黑名单管理起来比较简单，这里我们直接接入腾讯云 COS[对象存储](https://cloud.tencent.com/product/cos?from=10680)来读写黑名单

相关代码如下

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
```

这里需要注意一点，我在本地 python 环境安装的腾讯云对象存储依赖库是 `qcloud\_cos`，但是在云函数在线运行环境中，已经安装的是 `qcloud\_cos\_v5` 的依赖库，

为了方便本地调试，这里我设置了一个 debug 开关，来动态导入 `qcloud\_cos` 依赖。这样我们现在就可以读写 cos 存储桶里的文件了，像黑名单这种数据可以直接保存成文本，每行记录一个黑名单关键词即可，用的时候可以按行分割成黑名单 List，也可以直接判断黑名单中是否有当前请求的关键词。

这样我们就实现了后端云函数的数据存取问题，不过这种方法也有一些缺点，比如不方便更改数据等。这里我建议大家可以把数据处理成 map 键值对，然后使用 `json.dumps` 转成字符串存储到 cos 存储桶里，

这样最大的好处就是在后面用到之前的数据时可以直接 json.loads 加载回来，方便增删查改数据（对应 map 键值的增删查改）

例如

```javascript
def getBlacks():
    blackMap = {}
    blackTxt = cosRead('blacks.txt')  # 读取数据
    if len(blackTxt) > 0:
        blackMap = json.loads(blackTxt)
    return blackMap

def addBlacks(black):
    blackMap = getBlacks()
    if len(blackMap) > 0:
        blackMap[black]='我是黑名单'
    return cosWrite('blacks.txt', json.dumps(blackMap, ensure_ascii=False)) if len(blackMap) > 0 else False


def delBlacks(black):
    blackMap = getBlacks()
    if len(blackMap) > 0:
        blackMap.pop(black)
    return cosWrite('blacks.txt', json.dumps(blackMap, ensure_ascii=False)) if len(blackMap) > 0 else False
```

### 3. 云函数上线发布

OK，终于来到最后一步了，下面我们再去看一下前面提到的 template.yaml 云函数配置文件

```javascript
Resources:
  default:
    Type: 'TencentCloud::Serverless::Namespace'
    demo:
      Properties:
        CodeUri: ./
        Type: Event
        Environment:
          Variables:
        Description: 这是一个测试函数
        Handler: index.main_handler
        MemorySize: 64
        Timeout: 3
        Runtime: Python3.6
        Events:
          demo_apigw:  # ${FunctionName} + '_apigw'
            Type: APIGW
            Properties:
              StageName: release
              ServiceId:
              HttpMethod: ANY
      Type: 'TencentCloud::Serverless::Function'
```

可以看到，这里我们已经配置好了 API 网关触发器，如果你们没有创建过 API 网关的话，这里 ServiceId 可以先留空，记得等云函数上传发布成功后在腾讯云控制台拿到 ServiceId 再填上就好了

![上传云函数](https://ask.qcloudimg.com/http-save/yehe-1361327/09s73o9lba.png?imageView2/2/w/1620)

云函上传成功后会有提示，并帮我们自动创建了 API 网关触发器

![上传成功](https://img.serverlesscloud.cn/2020523/1590202785362-16206.jpg)

这里我们登录腾讯云控制台去看一下云函数有没有创建好，顺便配置一下 API 网关

![云函数触发方式](https://img.serverlesscloud.cn/2020523/1590202785741-16206.jpg)

现在我们就可以把生成的 ServiceId 填到本地的云函数配置文件里了，不然下次上传云函数系统还会自动帮我们新建 API 网关，然后我们先打开最底下那个蓝色的访问路径看下返回了什么

![未开启响应集成前返回的数据](https://img.serverlesscloud.cn/2020523/1590202785943-16206.jpg)

可以看到，云函数响应了我们 `main\_handler` 函数返回的 map 数据，不过我们想要的只是 body 部分，headers 之类的是要告诉浏览器的，这是因为我们的 API 网关还没有开启响应集成，下面打开云函数触发方式页面的第一个蓝色的箭头，转到 API 网关管理页面，选择编辑。

找到 demo 的 API 然后点击右边的编辑按钮

![启用响应集成](https://img.serverlesscloud.cn/2020523/1590202785926-16206.jpg)

然后来到第二步，勾选启用响应集成选项后点击下一步保存

![发布页](https://img.serverlesscloud.cn/2020523/1590202785701-16206.jpg)

回到发布页点击右上角发布，填写备注后，点击提交即可。

![正常返回](https://img.serverlesscloud.cn/2020523/1590202785364-16206.jpg)

我们这次再刷新一下网页就可以正常返回数据了。

## 写在最后

看到这里想必你已经学会使用腾讯云 SCF+COS 快速开发自己的后端 API，加速全栈应用的开发了。

耶( •̀ ω •́ )y



---
<div id='scf-deploy-iframe-or-md'></div>

---

> **传送门：**
> - GitHub: [github.com/serverless](https://github.com/serverless/serverless/blob/master/README_CN.md)
> - 官网：[serverless.com](https://serverless.com/)

欢迎访问：[Serverless 中文网](https://serverlesscloud.cn/)，您可以在 [最佳实践](https://serverlesscloud.cn/best-practice) 里体验更多关于 Serverless 应用的开发！
