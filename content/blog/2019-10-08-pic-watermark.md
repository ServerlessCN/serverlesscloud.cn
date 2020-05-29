---
title: 如何优雅地给网站图片加水印
description: Serverless 在 Web 后端与应用服务端的应用
keywords: Serverless 应用服务端,Serverless 应用,Serverless Web 后端
date: 2019-10-08
thumbnail: https://img.serverlesscloud.cn/2020114/1578990760585-v2-7d9090260d7f4a17539902a2c1ef8264_r.jpg
categories:
  - guides-and-tutorials
  - user-stories
authors:
  - Anycodes
authorslink:
  - https://www.zhihu.com/people/liuyu-43-97
tags:
  - 图像处理
  - Serverless
---

> 很多论坛、博客在进行图片上传之后，都会给自己的图像加上水印，这样可以证明这张图片「属于我」或者是「来自我的博客/网站」。那么使用 Serverless 技术来加水印的方法比传统方法好在哪儿呢，本文将对此进行一个简单的分享。

传统的加水印的方法，通常是在流程内进行。即：

![传统方法](https://img.serverlesscloud.cn/2020114/1578990849743-v2-662ba51a47abe18f335bce253dea244e_hd.png)

这种做法虽然可行，但是无疑会增加单次请求，服务端的压力，如果是高并发的情况下，或者多人上传多张大图的时候，那么可能就会造成自身服务器资源效果过大。

如果在加水印过程中失败，就有可能导致图像存储失败，致使数据丢失，并不理智。所以后来有人做了如下改进：

![传统方法改进版](https://img.serverlesscloud.cn/2020114/1578990849939-v2-662ba51a47abe18f335bce253dea244e_hd.png)

这样做法的好处就是 —— 我们可以快速将图片存储，存储之后通过一个单独处理的线程，对任务列表进行处理，这样一方面是可以保证我们马上把用户上传的图片存储，并且可以显示，同时也可以在后台进行水印处理，待处理之后，再将图片覆盖或者单独存储，用户如果需要读取图片时，可以自动变为已经水印后的图片。

这种做法相对于前者来说可能稍微复杂一些，但是实际上却是在数据上更加稳定，服务端压力更小，更加可控的一种操作。但是，这整个流程还是要在自己的服务器上做完，现在已经有很多人将图片等资源存储到腾讯云的 [对象存储（COS）](https://cloud.tencent.com/product/cos?from=10680)中，那么可不可以通过某些 COS 触发器与云函数 SCF 结合，实现一个不在自己服务器加水印的流程呢？

本文将以腾讯云函数 SCF 的函数模板（Python 语言）为例，进行一个简单的分享。

## ▎实验

#### 新建函数

在无服务器云函数中，选择模板函数：

![新建函数](https://img.serverlesscloud.cn/2020114/1578990849988-v2-662ba51a47abe18f335bce253dea244e_hd.png)

通过搜索「图像」关键词，选中图像压缩，并且确定建立。保存之后，点击函数代码，进行代码编写。

![编写代码](https://img.serverlesscloud.cn/2020114/1578990849634-v2-662ba51a47abe18f335bce253dea244e_hd.png)

#### COS 触发器

有些人可能对 COS 触发器还不是很了解，此时可以点击配置，来熟悉 COS 触发器样式：

![触发器](https://img.serverlesscloud.cn/2020114/1578990849769-v2-662ba51a47abe18f335bce253dea244e_hd.png)

可以看到如下：


```
{
   "Records":[
      {
        "event": {
          "eventVersion":"1.0",
          "eventSource":"qcs::cos",
          "eventName":"cos: ObjectCreated: *",
          "eventTime":1501054710,
          "eventQueue":"qcs:0:cos:gz:1251111111:cos",
          "requestParameters":{
            "requestSourceIP": "111.111.111.111",
            "requestHeaders":{
              "Authorization": "上传的鉴权信息"
            }
          }
         },
         "cos":{
            "cosSchemaVersion":"1.0",
            "cosNotificationId":"设置的或返回的 ID",
            "cosBucket":{
               "name":"bucketname",
               "appid":"appId",
               "region":"gz"
            },
            "cosObject":{
               "key":"/appid/bucketname/DSC_0002.JPG",
               "size":2598526,
               "meta":{
                 "Content-Type": "text/plain",
                 "x-cos-meta-test": "自定义的 meta",
                 "x-image-test": "自定义的 meta"
               },
               "url": "访问文件的源站url"
            }
         }
      }
   ]
}
```

这里面可以看到整个一个数据结构，需要注意 Records 是一个数组格式，其次就是：

"cosBucket":{"name":"bucketname","appid":"appId","region":"gz"}

这里面是由该 bucket 触发

"cosObject":{"key":"/appid/bucketname/DSC_0002.JPG","size":2598526,"meta":{"Content-Type":"text/plain","x-cos-meta-test":"自定义的 meta","x-image-test":"自定义的 meta"},"url":"访问文件的源站 url"}

这里面的 key 是在上述 bucket 中新建的文件名字。

所以，我们可以按照我们的实际情况，将上面的内容简单修改一下，成为我们格式，以便测试（在生产中，这个是自动生成的触发格式，并不需要我们修改，我们修改只是为了测试.

```
{
   "Records":[
      {
        "event": {
          "eventVersion":"1.0",
          "eventSource":"qcs::cos",
          "eventName":"cos: ObjectCreated: *",
          "eventTime":1501054710,
          "eventQueue":"qcs:0:cos:gz:1251111111:cos",
          "requestParameters":{
            "requestSourceIP": "111.111.111.111",
            "requestHeaders":{
              "Authorization": "上传的鉴权信息"
            }
          }
         },
         "cos":{
            "cosSchemaVersion":"1.0",
            "cosNotificationId":"设置的或返回的 ID",
            "cosBucket":{
               "name":"mytestcos",
               "appid":"appId",
               "region":"gz"
            },
            "cosObject":{
               "key":"test.png",
               "size":2598526,
               "meta":{
                 "Content-Type": "text/plain",
                 "x-cos-meta-test": "自定义的 meta",
                 "x-image-test": "自定义的 meta"
               },
               "url": "访问文件的源站url"
            }
         }
      }
   ]
}
```

这里主要修改了我的 cosBucket-name: mytestcos，以及 key: test.png

![cos 修改](https://img.serverlesscloud.cn/2020114/1578990849468-v2-662ba51a47abe18f335bce253dea244e_hd.png)

#### 代码修改

之所以使用现有的模板，是因为该模板的有 PIL 和 qcloud_cos_v5 等相关 package，而这两个 package 正是我们即将需要的，这样就可以省去我们打包函数的流程，只需要进行简单修改即可实现。

添加水印：

```
def add_word(pic_path, save_path):
    # 打开图片
    im = Image.open(pic_path).convert('RGBA')
    # 新建一个空白图片,尺寸与打开图片一样
    txt = Image.new('RGBA', im.size, (0, 0, 0, 0))
    # 设置字体
    fnt = ImageFont.truetype("/tmp/font.ttf", 40)
    # 操作新建的空白图片>>将新建的图片添入画板
    d = ImageDraw.Draw(txt)
    # 在新建的图片上添加字体
    d.text((txt.size[0] - 220, txt.size[1] - 80), "By Dfounder", font=fnt,  fill=(255, 255, 255, 255))
    # 合并两个图片
    out = Image.alpha_composite(im, txt)
    # 保存图像
    out.save(save_path)
```

在添加水印的时候，我们设置的是文字水印，所以需要设置字体和字号：

`fnt = ImageFont.truetype("/tmp/font.ttf",40)`

此时，我们需要在执行之前，先将字体文件传入到 /tmp/ 文件夹下：

`response = client.get_object(Bucket="mytestcos-12567****", Key="font.ttf", )
response['Body'].get_stream_to_file('/tmp/font.ttf')`

以我的 cos 为例：

![例子](https://img.serverlesscloud.cn/2020114/1578991065314-v2-676a50ad79018e0ab79bcb786c670c0f_hd.jpg)

然后，接下来就是对触发的 event 进行解析，包括获得新建的图像名称，从 COS 拉取，放到本地，然后进行水印等，再上传回新的 COS 中：

```
for record in event['Records']:
        try:
            bucket = record['cos']['cosBucket']['name'] + '-' + str(appid)
            key = record['cos']['cosObject']['key']
            key = key.replace('/' + str(appid) + '/' + record['cos']['cosBucket']['name'] + '/', '', 1)
            download_path = '/tmp/{}'.format(key)
            upload_path = '/tmp/new_pic-{}'.format(key)

            # 下载图片
            try:
                response = client.get_object(Bucket=bucket, Key=key, )
                response['Body'].get_stream_to_file(download_path)
            except CosServiceError as e:
                print(e.get_error_code())
                print(e.get_error_msg())
                print(e.get_resource_location())

            # 图像增加水印
            add_word(download_path, upload_path)


            # 图像上传
            response = client.put_object_from_local_file(
                Bucket=to_bucket,
                LocalFilePath=upload_path.decode('utf-8'),
                Key=("upload-" + key).decode('utf-8')
            )

        except Exception as e:
            print(e)
```

此处说明一下，为什么要有两个存储桶？

因为我们要把一个存储桶作为触发 SCF 函数的「工具」，如果我们将水印结果再次写回这个存储桶，在不进行额外判断和处理的前提下，那么这个水印后的图片会再次水印，反反复复造成恶劣的循环，所以此处建立两个存储桶，可以降低难度，也可以保护性能，减少 BUG 诞生。

完整代码如下：

```
# -*- coding: utf-8 -*-

from PIL import Image, ImageFont, ImageDraw
from qcloud_cos_v5 import CosConfig
from qcloud_cos_v5 import CosS3Client
from qcloud_cos_v5 import CosServiceError
from qcloud_cos_v5 import CosClientError

appid = **  # 请替换为您的 APPID
secret_id = ***'  # 请替换为您的 SecretId
secret_key = **'  # 请替换为您的 SecretKey
region = u'ap-chengdu'  # 请替换为您bucket 所在的地域
token = ''
to_bucket = 'tobucket-12567***'  # 请替换为您用于存放压缩后图片的bucket

config = CosConfig(Secret_id=secret_id, Secret_key=secret_key, Region=region, Token=token)
client = CosS3Client(config)

response = client.get_object(Bucket="mytestcos-12567***", Key="font.ttf", )
response['Body'].get_stream_to_file('/tmp/font.ttf')

def add_word(pic_path, save_path):
    # 打开图片
    im = Image.open(pic_path).convert('RGBA')
    # 新建一个空白图片,尺寸与打开图片一样
    txt = Image.new('RGBA', im.size, (0, 0, 0, 0))
    # 设置字体
    fnt = ImageFont.truetype("/tmp/font.ttf", 40)
    # 操作新建的空白图片>>将新建的图片添入画板
    d = ImageDraw.Draw(txt)
    # 在新建的图片上添加字体
    d.text((txt.size[0] - 220, txt.size[1] - 80), "By Dfounder", font=fnt,  fill=(255, 255, 255, 255))
    # 合并两个图片
    out = Image.alpha_composite(im, txt)
    # 保存图像
    out.save(save_path)

def main_handler(event, context):
    for record in event['Records']:
        try:
            bucket = record['cos']['cosBucket']['name'] + '-' + str(appid)
            key = record['cos']['cosObject']['key']
            key = key.replace('/' + str(appid) + '/' + record['cos']['cosBucket']['name'] + '/', '', 1)
            download_path = '/tmp/{}'.format(key)
            upload_path = '/tmp/new_pic-{}'.format(key)

            # 下载图片
            try:
                response = client.get_object(Bucket=bucket, Key=key, )
                response['Body'].get_stream_to_file(download_path)
            except CosServiceError as e:
                print(e.get_error_code())
                print(e.get_error_msg())
                print(e.get_resource_location())

            # 图像增加水印
            add_word(download_path, upload_path)


            # 图像上传
            response = client.put_object_from_local_file(
                Bucket=to_bucket,
                LocalFilePath=upload_path.decode('utf-8'),
                Key=("upload-" + key).decode('utf-8')
            )

        except Exception as e:
            print(e)
```

这里面需要注意这几个参数：appid、secret_id、secret_key、to_bucket

这几个参数的来源如下：

![参数来源](https://img.serverlesscloud.cn/2020114/1578990849480-v2-662ba51a47abe18f335bce253dea244e_hd.png)

而 secretid，secretkey 则需要在这里获取：

![id 获取](https://img.serverlesscloud.cn/2020114/1578990849750-v2-662ba51a47abe18f335bce253dea244e_hd.png)

#### 测试

之前我已经上传了一个测试图片在这个 bucket 中，名字是：test.png

![test 图片](https://img.serverlesscloud.cn/2020114/1578990849100-v2-662ba51a47abe18f335bce253dea244e_hd.png)

图片是这样子：

![test 图片 2](https://img.serverlesscloud.cn/2020114/1578990849099-v2-662ba51a47abe18f335bce253dea244e_hd.png)

然后我们进行一下测试：

![测试](https://img.serverlesscloud.cn/2020114/1578990849528-v2-662ba51a47abe18f335bce253dea244e_hd.png)

可以看到，已经测试成功，接下来我们可以去我们的目标 bucket 中看看：

![目标 bucket](https://img.serverlesscloud.cn/2020114/1578990849101-v2-662ba51a47abe18f335bce253dea244e_hd.png)

可以看到成功生成了一个图片：

![生成图片](https://img.serverlesscloud.cn/2020114/1578990849857-v2-662ba51a47abe18f335bce253dea244e_hd.png)

可以看到图片的右下角，有我们代码中添加的水印：

![水印代码](https://img.serverlesscloud.cn/2020114/1578990849632-v2-662ba51a47abe18f335bce253dea244e_hd.png)

至此，我们完成了通过云函数 SCF 为您的网站图片添加水印的基本流程。

## ▎额外想说的

其实，这篇文章也算是抛砖引玉，大家不仅可以通过这个流程压缩图像、添加水印，甚至还可以对图像进行其他操作。例如图像风格化处理等一些深加工，而这一切过程，都不会占用自身服务器资源，而是通过云函数 SCF 来完成的。

即使面对高并发，有大量的图片上传时，我们要做的也仅仅是通过 SDK，将图片传入到腾讯云对象存储 COS 中。

> **传送门：**
> - GitHub: [github.com/serverless](https://github.com/serverless/serverless/blob/master/README_CN.md) 
> - 官网：[serverless.com](https://serverless.com/)

欢迎访问：[Serverless 中文网](https://serverlesscloud.cn/)，您可以在 [最佳实践](https://serverlesscloud.cn/best-practice) 里体验更多关于 Serverless 应用的开发！
