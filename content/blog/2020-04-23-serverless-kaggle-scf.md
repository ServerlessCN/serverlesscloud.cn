---
title: 万物皆可 Serverless 之 Kaggle+SCF 端到端验证码识别从训练到部署
description: 今天本文就尝试带大家借助 Kaggle+SCF，快速训练部署一个端到端的通用验证码识别模型，真正的验证码识别从入门到应用的一条龙服务。
keywords: Serverless,Serverless AI,Serverless应用
date: 2020-04-23
thumbnail: https://img.serverlesscloud.cn/2020523/1590213128368-16200.jpg
categories:
  - user-stories
authors:
  - 乂乂又又
authorslink:
  - https://cloud.tencent.com/developer/article/1618583
tags:
  - Serverless
  - 深度学习
---

# **一、本文介绍**

随着验证码技术的更新换代，传统的验证码识别算法已经越来越无用武之地了。

近些年来人工智能迅速发展，尤其是在深度学习神经网络这一块生态尤为繁荣，各种算法和模型层出不穷。

今天本文就尝试带大家借助Kaggle+SCF

快速训练部署一个端到端的通用验证码识别模型，

真正的验证码识别从入门到应用的一条龙服务，哈哈哈~

废话少说，上图

![serverless](https://img.serverlesscloud.cn/2020523/1590213128482-16200.jpg)

正在kaggle训练模型

![serverless](https://img.serverlesscloud.cn/2020523/1590213128407-16200.jpg)

调用训练好的模型识别验证码

# **二、开始教程**

## **第一步：了解kaggle**

如果你没做过数据科学竞赛这块

可能不太了解kaggle哈，

这里我先跟大家介绍一下kaggle是做什么的

> _Kaggle_ is the world’s largest data science community with powerful tools and resources to help you achieve your data science goals.

这是 kaggle 官网（ [https://www.kaggle.com/ ](https://www.kaggle.com/)）的自我介绍，

简单来说kaggle是全球最大的数据科学交流社区，上面有许多关于数据科学的竞赛和数据集，

并且提供了一些数据科学在线分析的环境和工具，一直以来吸引了全球大批数据科学爱好者，社区极其繁荣。

如果你对kaggle感兴趣可以自行百度详细了解一下。

这里我们主要是用 kaggle 的 Notebooks 服务里的 kernel 环境来快速在云端训练自己的验证码识别模型。

![serverless](https://img.serverlesscloud.cn/2020523/1590213128411-16200.jpg)

一个kernel实例

你可能会问在本地训练不可以吗，为啥非得折腾着上云？

哈哈，这还真不是折腾，普通人的电脑算力其实是有限的，

而训练模型是需要强大GPU算力的支持，不然要训练到猴年马月~

![serverless](https://img.serverlesscloud.cn/2020523/1590213128433-16200.jpg)

训练模型时cpu使用率爆满

像我这种最low的酷睿m3笔记本，

一旦开始训练风扇就转个不停，cpu使用率直接被挤爆，

然后我把笔记本放那跑了一天一夜，愣是1个训练轮次都没跑动。。。。。。。

跑了三天，果断放弃，汗~

然后我们再来看一下kaggle上的kernel环境的配置

CPU 4核心，16 GB 运行内存，GPU 2核心 13 GB 运行内存

每个 kernel 有9 小时的运行时长，GPU资源每周30小时使用时长

除了硬件资源之外，kernel 环境里已经配置好了一些机器学习的常用库，

包括Pytorch， Tensorflow 2等，它的机器学习环境是开箱即用的，零配置，零维护。

> Kaggle Notebooks run in a remote computational environment. We provide the hardware—you need only worry about the code.

正如kaggle notebooks官方文档所言，kaggle免费为你提供硬件和机器学习环境，你唯一需要关心的是你的代码。

这么好的东西关键还是免费提供的啊，果断选它来训练模型就对了。

## **第二步：注册kaggle账号，新建一个kernel环境**

账号注册、新建kernel等相关问题自行百度，网上有很多相关文章，这里我就不再细说了。

## **第三步：克隆git仓库，修改成自己的验证码数据集**

![serverless](https://img.serverlesscloud.cn/2020523/1590213129710-16200.jpg)

模型训练仓库

这里我在 [https://github.com/nickliqian/cnn\_captcha ](https://github.com/nickliqian/cnn_captcha)项目的基础上，把原项目升级更新到了Tensorflow 2.0，然后做了个kaggle训练+SCF部署的通用验证码识别方案。

现在你只需要将我修改好的仓库 [https://gitee.com/LoveWJG/tflite\_train ](https://gitee.com/LoveWJG/tflite_train)克隆到本地，

然后按照项目里的readme说明文件配置一下训练参数，替换一下自己的验证码数据集即可。

## **第四步：上传项目到kaggle开始训练**

然后把配置好的项目压缩上传到kaggle直接解压按照说明文件进行训练即可，

![serverless](https://img.serverlesscloud.cn/2020523/1590213128482-16200.jpg)

模型训练中

我这里用了20000张验证码，训练了10000轮左右，大概耗时30分钟，还是相当给力的。

训练结束后你可以根据仓库里的readme文件，把模型、日志文件打包下载到本地，

然后再在本地将模型转成tflite格式（方便在移动端使用，本地识别验证码），

如果模型文件过大你也可以在本地运行tflite.py程序把tflite模型量化，大概可以把模型文件缩小到原来的1/4

![serverless](https://img.serverlesscloud.cn/2020523/1590213128522-16200.jpg)

最终的模型文件

最终你应该得到一个 .tflite 格式的模型文件

## **第五步：使用云函数快速部署验证码识别模型**

云函数的创建、配置和发布可参考我之前的系列文章，这里就不再结合图文细讲了。

新建一个python空白云函数，然后把scf.py文件里的代码填到index.py里保存

```javascript
# -*- coding:utf-8 -*-
import io
import json
import os
import time

import numpy as np

import tensorflow as tf
from PIL import Image

model_path = "model_quantized.tflite" #模型文件地址
chars = '23456789abcdefghjkmpqrstuvwxy' #验证码字符，顺序要与config.json里的一致

# Load TFLite model and allocate tensors.
interpreter = tf.lite.Interpreter(model_path=model_path)
interpreter.allocate_tensors()

# Get input and output tensors.
input_details = interpreter.get_input_details()
output_details = interpreter.get_output_details()

#将验证码数据转换成模型输入格式
def img2input(img, width, height):
    tmpe_array = [serverless]
    for i in range(height):
        for j in range(width):
            pixel = img.getpixel((j, i))
            tmpe_array.append((0.3*pixel[0]+0.6*pixel[1]+0.1*pixel[2])/255)
    tmpe_array = np.array(tmpe_array).astype('float32')
    input_array = np.expand_dims(tmpe_array, axis=0)
    return input_array

#识别验证码
def predict(image):
    captcha_image = Image.open(io.BytesIO(image))
    image_np_expanded = img2input(captcha_image, 100, 50)
    interpreter.set_tensor(input_details[0]['index'], image_np_expanded)
    interpreter.invoke()
    output_data = interpreter.get_tensor(output_details[0]['index'])
    codes = ''
    for i in output_data[0]:
        codes += chars[i]
    return codes


# api网关响应集成
def apiReply(reply, txt=False, content_type='application/json', code=200):
    return {
        "isBase64Encoded": False,
        "statusCode": code,
        "headers": {'Content-Type': content_type},
        "body": json.dumps(reply, ensure_ascii=False) if not txt else str(reply)
    }

#云函数入口
def main_handler(event, context):
    return apiReply(
        {
            "ok": False if not 'image' in event.keys() else True,
            "message": "请求参数无效" if not 'image' in event.keys() else predict(event['queryString']['image'])
        }
    )
```

把模型文件上传到云函数根目录，然后配置一下自己的验证码识别模型参数

```javascript
model_path = "model_quantized.tflite" #模型文件地址
chars = '23456789abcdefghjkmpqrstuvwxy' #验证码字符，顺序要与config.json里的一致
```

之后给我们的云函数添加一个api网管触发器，并启用响应集成，然后发布上线即可

![serverless](https://img.serverlesscloud.cn/2020523/1590213128407-16200.jpg)

最终结果

没有问题的话，你只需要GET一下

```javascript
api网关+?base64Image=base64编码后的验证码数据
```

就可以返回验证码识别结果了

# **三、文章最后**

以上，本文带大家从头训练并部署了一个通用验证码识别模型。

我们再一次看到基于Serverless的云函数在开发线上应用的过程中是多么方便和迅速！

强烈建议你也来亲自动手实践一下Serverless，

相信我，你会爱死它的~

最后如果你对验证码识别比较感兴趣，想要了解更多的识别方案，

这里我推荐几个 github 仓库，都是可以直接上手应用的程度

use cnn recognize captcha by tensorflow. 本项目针对字符型图片验证码，使用tensorflow实现卷积神经网络，进行验证码识别。         

[https://github.com/nickliqian/cnn\_captcha](https://github.com/nickliqian/cnn_captcha)

[验证码识别-训练] This  project is based on CNN/ResNet/DenseNet+GRU/LSTM+CTC/CrossEntropy to  realize verification code identification. This project is only for  training the model.   

[https://github.com/kerlomz/captcha\_trainer](https://github.com/kerlomz/captcha_trainer)

[验证码识别-部署] This  project is based on CNN+BLSTM+CTC to realize verificationtion. This  projeccode identificat is only for deployment models.     

[https://github.com/kerlomz/captcha\_platform](https://github.com/kerlomz/captcha_platform)

## Serverless Framework 30 天试用计划

我们诚邀您来体验最便捷的 Serverless 开发和部署方式。在试用期内，相关联的产品及服务均提供免费资源和专业的技术支持，帮助您的业务快速、便捷地实现 Serverless！

> 详情可查阅：[Serverless Framework 试用计划](https://cloud.tencent.com/document/product/1154/38792)

## One More Thing
<div id='scf-deploy-iframe-or-md'><div><p>3 秒你能做什么？喝一口水，看一封邮件，还是 —— 部署一个完整的 Serverless 应用？</p><blockquote><p>复制链接至 PC 浏览器访问：<a href="https://serverless.cloud.tencent.com/deploy/express">https://serverless.cloud.tencent.com/deploy/express</a></p></blockquote><p>3 秒极速部署，立即体验史上最快的 Serverless HTTP 实战开发！</p></div></div>

---

> **传送门：**
> - GitHub: [github.com/serverless](https://github.com/serverless/serverless/blob/master/README_CN.md) 
> - 官网：[serverless.com](https://serverless.com/)

欢迎访问：[Serverless 中文网](https://serverlesscloud.cn/)，您可以在 [最佳实践](https://serverlesscloud.cn/best-practice) 里体验更多关于 Serverless 应用的开发！