---
title: 如何借助 Layer 实现云函数快速打包轻松部署
description: 层的功能为依赖库和不经常修改的静态文件提供了新的存储方案，与函数的剥离使得这类文件能够多函数复用，版本化管理；随着层功能的发展，腾讯云 Serverless team 也将进一步拓展层功能的使用
keywords: Serverless 全局变量组件,Serverless 单独部署组件,Serverless Component
date: 2020-05-11
thumbnail: https://img.serverlesscloud.cn/2020514/1589461771804-layer.jpg
categories:
  - guides-and-tutorials
authors:
  - Alfred
authorslink:
  - https://zhuanlan.zhihu.com/ServerlessGo
tags:
  - Serverless
  - layer
---

**在使用云函数进行项目开发的时候，当函数数量变多后，您是否遇到函数的依赖库的管理问题？**

由于云函数在创建或更新时，需要将函数的业务代码，和依赖库一同打包上传，因此在本地开发时，也经常是将依赖库和业务代码放置在一个文件夹下。

**在这种情况下**

每个云函数的代码目录下均有一套依赖库代码，而这其中有很多在若干个函数中都是重复的，不但占用了大量的空间，而且管理麻烦，在某些依赖库需要进行升级时，要进入到每个函数项目中去检查依赖关系和升级操作。

另一方面，这些依赖库通常不会有大的变动，但是却需要在每次函数进行更新时，都要和业务代码一同打包上传，导致实际的代码更新可能就一两行，但是需要生成一个十几兆甚至几十兆的包去上传，在网络环境不好的情况下还需要忍受缓慢的上传速度。

## 解决方案来了

近期，腾讯云的 SCF 云函数推出了层功能，是为了这类不经常变动的依赖库或静态文件而准备的产品功能。

通过使用层功能来存储及管理依赖库，并在使用时按需与函数进行绑定，就可以实现依赖库的多函数共享，仅需上传一份，就可以在多个要使用到的函数中绑定并引用。

通过与云函数绑定的使用方式，也就意味着不需要在云函数的业务代码中再附上相应的依赖库了，可以将业务代码和依赖库分开进行管理和部署，降低云函数每次上传时需要提交的包大小，加快上传更新的速度。

## 层功能介绍

![](https://img.serverlesscloud.cn/2020511/1589168582373-%E6%88%AA%E5%B1%8F2020-05-11%20%E4%B8%8A%E5%8D%8811.42.24.png)

层作为一个和云函数独立的资源，有独立的创建、管理流程。和函数创建类似，可以通过上传 zip 包，或者控制台上选择文件夹，或者将 zip 包提前上传 cos 后再引用的方式，来将文件内容提交到云上，并创建好层。每一个提交到层中的文件包，都将生成一个新的版本。

因此，在创建好一个层以后，就将具有了第一个版本；而后续如果依赖库或文件内容有升级，可以继续更新层，并生成新的版本，版本号依次增大。在创建层，或发布新版本的时候，还可以指定当前层所可支持的 runtime，这样相应 runtime 的函数，才可以浏览或绑定当前层。

![](https://img.serverlesscloud.cn/2020511/1589168582380-%E6%88%AA%E5%B1%8F2020-05-11%20%E4%B8%8A%E5%8D%8811.42.24.png)


在使用层时，通过云函数与具体层的具体版本绑定，来实现层内容的引入和使用。在函数的配置管理界面，新增加了层的绑定配置界面。通过选择层及期望绑定的版本，就可以完成绑定操作。绑定了层以后，在函数运行时，运行环境中的 /opt 目录下就会有层的内容。当然，系统中的 NODE_PATH，PYTHONPATH 已经指定好了 /opt 目录，绑定好的层中如果包含有依赖库，在函数代码中可以直接通过 import，require 等方法直接引用，与常规写法一致，不需要额外进行路径的指定。同时，目前一个函数支持最多绑定 5 个层的版本，因此可以通过这种方法，将所需的依赖库分别引入到层中。

![](https://img.serverlesscloud.cn/2020511/1589168581412-%E6%88%AA%E5%B1%8F2020-05-11%20%E4%B8%8A%E5%8D%8811.42.24.png)

在多个层绑定到同一个函数时，层之间有一定的顺序关系。层是按照顺序关系依次加载的，如果在相同路径下有同名文件，会产生后加载的文件覆盖先加载文件的问题，需要在此处注意多个层绑定时是否会有内容覆盖，以及加载循序是否是按自身的控制需要来的。另一方面，层与函数的绑定关系，也作为函数的配置保存。$LATEST版本的函数可以按需修改调整绑定配置，而一旦发布版本后，生成的函数版本中的配置就固定了，无法再次修改。因此，通过发布版本来固化已经开发完成的版本，可以避免函数代码或层内容的修改导致的代码不可用。

![](https://img.serverlesscloud.cn/2020511/1589168581362-%E6%88%AA%E5%B1%8F2020-05-11%20%E4%B8%8A%E5%8D%8811.42.24.png)


## 层功能的使用

在这个案例中，我们将实现一个拨测网站，并在检测到异常时发送消息到 cmq 消息队列中的云函数。这个云函数由 python 写成，将使用两个依赖库，requests 库用来实现 url 地址的 http 访问检测，及 cmq 库用来实现向 cmq 的队列发送消息。

在创建函数前，我将使用这两个库分别创建两个层，并在后续将函数与这两个层绑定来使用依赖库。

首先在本地分别创建两个文件夹：  `requests-lib` 和 `cmq-lib`，通过命令行进入 `requests-lib` 文件夹后，执行命令

```
 pip install requests -t
```

在此目录下完成 requests 库的下载安装。而在 cmq-lib 文件夹内，我们通过下载或 clone https://github.com/tencentyun/cmq-python-sdk 项目，将 cmq 的 sdk 下载到本地。

接下来，使用这两个文件夹分别创建两个层，同样命名为 `requests-lib` 和 `cmq-lib`，通过直接选择文件夹创建，并选择好适配 runtime 为 python2。在创建完成两个层后，他们都具有版本 1可供函数绑定。

同时，我在相同地域下也创建好了名字为 `testq` 的 cmq 队列，并根据 sdk 需要准备好了账号 id，secret id，secret key 等信息。

**接下来，我将使用如下代码创建函数 detect-sendmsg，实现 url 的拨测，并向 cmq 消息队列中发送消息**

代码中的 appid、secretid、secretkey，需要替换为自身账号下的相关内容。

```
# -*- coding: utf8 -*-
import json
import logging
import os

from cmq.account import Account
from cmq.cmq_exception import *
from cmq.topic import *
import requests

logger = logging.getLogger()
logger.setLevel(logging.DEBUG)

print('Loading function')

appid = 1252724xxx #please change to your appid. Find it in Account Info
secretId = 'AKIDkkxxxxxxxxxxxxxxx' #please change to your API secret id. Find it in API secret key pair
secretKey = ‘xxxxxxxxxxxxxxxxxx' #please change to your API secret key. Find it in API secret key pair
region = u'gz'
endpoint = 'https://cmq-queue-gz.api.qcloud.com'

my_account = Account(endpoint, secretId, secretKey)
my_account.set_log_level(logging.INFO)
queue_name = 'testq'
my_queue = my_account.get_queue(queue_name)

test_url_list = [
    "http://www.baidu.com",
    "http://www.qq.com",
    "http://cloud.tencent.com",
    "http://unkownurl.com"
]


def test_url(url_list):
    errorinfo = []
    for url in url_list:
        resp = None
        try:
            resp = requests.get(url,timeout=3)
        except (requests.exceptions.Timeout, requests.exceptions.ConnectionError, requests.exceptions.ConnectTimeout) as e:
            logger.warn("request exceptions:"+str(e))
            errorinfo.append("Access "+ url + " timeout")
        else:
            if resp.status_code >= 400:
                logger.warn("response status code fail:"+str(resp.status_code))
                errorinfo.append("Access "+ url + " fail, status code:" + str(resp.status_code))
    if len(errorinfo) != 0:
        send_msg("拨测异常通知:"+"\r\n".join(errorinfo))

def send_msg(msg_body):
    try:
        logger.info("send msg"+msg_body)
        msg = Message(msg_body)
        ret_msg = my_queue.send_message(msg)
    except CMQExceptionBase as e:
        logger.warn("Send msg to queue Fail! Exception:%s\n" % e)
        raise e

def main_handler(event, context):
    test_url(test_url_list)
    return “finish"
```

使用此代码创建好函数，并在函数的层管理中，分别绑定好 requests-lib、cmq-lib 两个层。由于这两个层没有重复部分，因此可以以任意顺序绑定。

完成绑定后，可以直接通过控制台触发函数，查看运行情况。一切正常的情况下，可以看到拨测的过程，以及消息发送到消息队列中的记录。同时，也可以到消息队列的对应 queue 中，通过获取消息，获取到发送到其中的消息记录。

**从这个例子中可以看到**

函数代码中应用了 requests 库，和 cmq 的 sdk，但并未通过和函数一同打包上传来实现，而是将依赖库放置到层里面后，通过绑定关系来引用。通过这种方式，如果下次我们启动一个新的函数也需要使用到 requests 库，直接与已有的层绑定即可使用，而同样不需要再次打包上传。而函数代码仅一个文件，不需要带有较大的依赖库，也可以降低每次更新上传时的包大小，甚至直接快速的使用 WebIDE 来进行编辑就行。

层的功能为依赖库和不经常修改的静态文件提供了新的存储方案，与函数的剥离使得这类文件能够多函数复用，版本化管理；随着层功能的发展，腾讯云 Serverless team 也将进一步拓展层功能的使用，包括了在开发工具中实现自动化的层创建和绑定、层的共享、提供公共层供用户直接复用等，都已经在 roadmap 中，将在接下来的发展中逐步落地，供云函数的开发体验更加便利。

> 回放：点击观看 [Tencent Serverless Hours 线上分享会第一期](https://cloud.tencent.com/edu/learning/live-2437)



---

<div id='scf-deploy-iframe-or-md'></div>

---

> **传送门：**
> - GitHub: [github.com/serverless](https://github.com/serverless/serverless/blob/master/README_CN.md)
> - 官网：[serverless.com](https://serverless.com/)

欢迎访问：[Serverless 中文网](https://serverlesscloud.cn/)，您可以在 [最佳实践](https://serverlesscloud.cn/best-practice) 里体验更多关于 Serverless 应用的开发！
