---
title: Serverless 实现图片压缩与水印
description: 图片和 Web 服务非常紧密，在 Serverless 架构下，是否有一种方法，可以对图像的压缩与水印实现「一条龙」服务，而且不会因为用户量比较多，而影响用户整体体验呢？
keywords: Serverless 多环境配置,Serverless 管理环境,Serverless配置方案
date: 2020-05-04
thumbnail: https://img.serverlesscloud.cn/2020511/1589207417692-ZalNtxgQAC_small.jpg
categories:
  - best-practice
authors:
  - Anycodes
authorslink:
  - https://zhuanlan.zhihu.com/ServerlessGo
tags:
  - Serverless
  - 图片压缩
---

上传图片是很常见的用户需求，无论是做一个相册系统，还是发布文章中带有图片，都有上传图片的场景，可以说图片和 Web 服务是紧密相连的了。但是图片大小等属性又参差不齐的，而且图片在上传之后，还可能会被其他平台采集并且盗用。这个时候，就需要进行图像压缩、标准化以及添加水印等操作，这一套流程下来很占用计算资源。那么在 Serverless 架构下，是否可以对图像的压缩与水印实现「一条龙」服务，而且不会因为用户量比较多，而影响整体体验呢？

一起试试！

## Serverless 与图像处理

传统的图像处理，会比较占用资源，让服务器压力山大，影响用户体验：

![](https://img.serverlesscloud.cn/tmp/2-5-1.png)

我们尝试通过 Serverless 架构，实现一个异步处理流程 —— 用户直接上传图片到对象存储，将图片等资源进行持久化，然后通过对象存储相关的触发器，触发指定函数，函数进行图像压缩以及水印等相关处理，再次进行持久化。

![](https://img.serverlesscloud.cn/202058/2-5-2.png)

以相册系统为例：用户上传图片之后，系统进行压缩以及水印并生成缩略图，存储到对象存储中。当用户浏览图片列表时，展示带有水印的缩略图，可以大大提升加载速度。水印还可以看作图像的一种版权保护，当用户点击图片查看原图时，可以为用户展示原始图片。这样既能保证原图的存在，也可以浏览列表加载速度，还具备初步的版权保护能力。

### 一、图像压缩

这里只用图像的大小作为压缩依据，除此之外还可以对图像的质量进行处理。

单以尺寸进行压缩处理，可以看作是将一个 `image` 对象的宽度传入，通过 `resize` 方法进行大小调整，实现压缩功能。

```python
def compressImage(image, width):
    height = image.size[1] / (image.size[0] / width)
    return image.resize((int(width), int(height)))
```

### 二、图像水印

这部分采用文字水印，当然也可以使用图片水印等。

此处为了将水印放在图像的右下角，并且不超出图像范围，进行了每个字符大小的获取：

```python
height = []
width = []
for eveStr in watermarkStr:
    thisWidth, thisHeight = drawImage.textsize(eveStr, font)
    height.append(thisHeight)
    width.append(thisWidth)
```

通过这样处理之后，得到的 `height` 列表就是所有即将水印文字的高度，`width` 列表是所有即将水印文字的宽度。此处要将水印放在右下角只需要在图片整体高度上减去 `height` 列表最大值，图片整体宽度基础上减去 `width` 列表的总和即可：

```python
def watermarImage(image, watermarkStr):
    txtImage = Image.new('RGBA', image.size, (0, 0, 0, 0))
    font = ImageFont.truetype("Brimborion.TTF", 40)
    drawImage = ImageDraw.Draw(txtImage)
    height = []
    width = []
    for eveStr in watermarkStr:
        thisWidth, thisHeight = drawImage.textsize(eveStr, font)
        height.append(thisHeight)
        width.append(thisWidth)
    drawImage.text((txtImage.size[0] - sum(width) - 10, txtImage.size[1] - max(height) - 10),
                   watermarkStr, font=font,
                   fill=(255, 255, 255, 255))
    return Image.alpha_composite(image, txtImage)
```

### 三、部署到云函数 SCF 中

通过函数的事件描述，可以确定腾讯云函数的对象存储触发器事件结果为：

```json
{
  "Records": [
  {
      "cos": {
          "cosSchemaVersion": "1.0",
          "cosObject": {
              "url": "http://testpic-1253970026.cos.ap-chengdu.myqcloud.com/testfile",
              "meta": {
                  "x-cos-request-id": "NWMxOWY4MGFfMjViMjU4NjRfMTUyMV8yNzhhZjM=",
                  "Content-Type": ""
              },
              "vid": "",
              "key": "/1253970026/testpic/testfile",
              "size": 1029
          },
          "cosBucket": {
              "region": "cd",
              "name": "testpic",
              "appid": "1253970026"
          },
          "cosNotificationId": "unkown"
      },
      "event": {
          "eventName": "cos: ObjectCreated:Post",
          "eventVersion": "1.0",
          "eventTime": 1545205770,
          "eventSource": "qcs::cos",
          "requestParameters": {
              "requestSourceIP": "192.168.15.101",
              "requestHeaders": {
                  "Authorization": "q-sign-algorithm=sha1&q-ak=AKIDQm6iUh2NJ6jL41tVUis9KpY5Rgv49zyC&q-sign-time=1545205709;1545215769&q-key-time=1545205709;1545215769&q-header-list=host;x-cos-storage-class&q-url-param-list=&q-signature=098ac7dfe9cf21116f946c4b4c29001c2b449b14"
              }
          },
          "eventQueue": "qcs:0:lambda:cd:appid/1253970026:default.printevent.$LATEST",
          "reservedInfo": "",
          "reqid": 179398952
      }
  }]
}
```

根据这个结构，我们可以确定出相关详细信息，例如存储桶、APPID，以及图片 Key 等信息。将上面的代码按照函数计算的格式进行改写：

```python
# -*- coding: utf8 -*-
import os
from PIL import Image, ImageFont, ImageDraw
from qcloud_cos_v5 import CosConfig
from qcloud_cos_v5 import CosS3Client

secret_id = os.environ.get('secret_id')
secret_key = os.environ.get('secret_key')
region = os.environ.get('region')
cosClient = CosS3Client(CosConfig(Region=region, SecretId=secret_id, SecretKey=secret_key))


def compressImage(image, width):
    height = image.size[1] / (image.size[0] / width)
    return image.resize((int(width), int(height)))


def watermarImage(image, watermarkStr):
    txtImage = Image.new('RGBA', image.size, (0, 0, 0, 0))
    font = ImageFont.truetype("Brimborion.TTF", 40)
    drawImage = ImageDraw.Draw(txtImage)
    height = []
    width = []
    for eveStr in watermarkStr:
        thisWidth, thisHeight = drawImage.textsize(eveStr, font)
        height.append(thisHeight)
        width.append(thisWidth)
    drawImage.text((txtImage.size[0] - sum(width) - 10, txtImage.size[1] - max(height) - 10),
                   watermarkStr, font=font,
                   fill=(255, 255, 255, 255))
    return Image.alpha_composite(image, txtImage)


def main_handler(event, context):
    for record in event['Records']:
        bucket = record['cos']['cosBucket']['name'] + '-' + record['cos']['cosBucket']['appid']
        key = "/".join(record['cos']['cosObject']['key'].split("/")[3:])
        download_path = '/tmp/{}'.format(key.split('/')[-1])
        download_path = '/tmp/{}'.format(key.split('/')[-1])
        upload_path = '/tmp/new_mp4-{}'.format(key.split('/')[-1])

        # 下载图片
        response = cosClient.get_object(Bucket=bucket, Key=key)
        response['Body'].get_stream_to_file(download_path)

        # 图片处理
        image = Image.open(download_path)
        image = compressImage(image, width=500)
        image = watermarImage(image, "Hello Serverless")
        image.save(upload_path)

        # 上传图片
        cosClient.put_object_from_local_file(
            Bucket=bucket,
            LocalFilePath=upload_path,
            Key="/compress-watermark/" + key.split('/')[-1]
        )

```

新建 `serverless.yaml` 文件：

```yaml
MyPicture:
  component: "@serverless/tencent-scf"
  inputs:
    name: MyPicture
    codeUri: ./
    handler: index.main_handler
    runtime: Python3.6
    region: ap-guangzhou
    description: My Picture Compress And Watermark
    memorySize: 128
    timeout: 20
    environment:
      variables:
        secret_id: 用户密钥id
        secret_key: 用户密钥key
        region: ap-guangzhou
    events:
      - cos:
          name: picture-1256773370.cos.ap-guangzhou.myqcloud.com
          parameters:
            bucket: picture-1256773370.cos.ap-guangzhou.myqcloud.com
            filter:
              prefix: source/
            events: cos:ObjectCreated:*
            enable: true
```

可以看到，这个函数有一个 `cos` 触发器，触发器是针对存储桶 `picture-1256773370` 下面 `source/` 目录下的资源创建进行触发。

### 四、简单测试

通过 `serverless` 进行部署：

![](https://img.serverlesscloud.cn/202058/2-5-3.png)

部署完成之后，我们在存储桶 `picture-1256773370` 中，新建 `source/` 目录与 `compress-watermark/` 目录。

前者用来上传文件，后者用来生成新的文件。随机搜索一张图片：

![](https://img.serverlesscloud.cn/202058/2-5-4.png)

可以看到这张图片 4.5M，还是蛮大的，将这个图片上传到 `source/` 目录下：

![](https://img.serverlesscloud.cn/202058/2-5-5.png)

稍等片刻，可以在 `compress-watermark/` 目录下发现有一个新的文件生成：

![](https://img.serverlesscloud.cn/202058/2-5-6.png)

将文件下载下来，查看详情：

![](https://img.serverlesscloud.cn/202058/2-5-7.png)

可以看到，图片尺寸明显变小，从 4.5M 压缩到了 340K。同时，图像右下角出现了预设的水印标志。

我们终于完成了通过 COS 触发器实现的图片压缩与水印功能。

## 总结

本示例实现了用户上传图像，通过 Serverless 架构对其进行压缩与增加水印的功能。

在这个功能中，我们可以看到，通过 Serverless 架构可以解决很多传统生产中遇到的问题，并且可以以更少的资源对常见问题进行新策略的定制。以本文为例，当函数服务面临高并发时，传统情况下，很可能会由于图像压缩、水印的操作导致服务宕机，但是通过这样的策略，在高并发的场景，也仅仅是将图片传入对象存储。至于转换逻辑、压缩逻辑以及水印逻辑等都是由 Serverless 架构进行实现，可以说是既安全稳定，又节约成本和资源。

除此之外，视频制作、深度学习下的标签处理等，也都可以异步完成，交给 Serverless 架构实现。



---
<div id='scf-deploy-iframe-or-md'></div>

---

> **传送门：**
> - GitHub: [github.com/serverless](https://github.com/serverless/serverless/blob/master/README_CN.md)
> - 官网：[serverless.com](https://serverless.com/)

欢迎访问：[Serverless 中文网](https://serverlesscloud.cn/)，您可以在 [最佳实践](https://serverlesscloud.cn/best-practice) 里体验更多关于 Serverless 应用的开发！
