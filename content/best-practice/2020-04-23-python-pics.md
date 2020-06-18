---
title: Serverless 实战：用 20 行 Python 代码轻松搞定图像分类和预测
description: 本文将尝试通过一个有趣的 Python 库，快速将图像分类的功能搭建在云函数上，并且和 API 网关结合，对外提供 API 功能，实现一个 Serverless 架构的「图像分类 API」
keywords: Serverless 全局变量组件,Serverless 单独部署组件,Serverless Component
date: 2020-04-23
thumbnail: https://img.serverlesscloud.cn/2020512/1589276332053-Python-Programming-Course-The-Complete-Bootcamp.jpg
categories:
  - best-practice
authors:
  - Anycodes
authorslink:
  - https://www.zhihu.com/people/liuyu-43-97
tags:
  - Serverless
  - Python
---

图像分类是人工智能领域的一个热门话题，通俗来讲，就是根据各自在图像信息中反映的不同特征，把不同类别的目标区分开。图像分类利用计算机对图像进行定量分析，把图像或图像中的每个像元或区域划归为若干个类别中的某一种，代替人的视觉判读。

在实际生活中，我们也会遇到图像分类的应用场景，例如我们常用的通过拍照花朵来识别花朵信息，通过人脸匹对人物信息等。通常，图像识别或分类工具都是在客户端进行数据采集，在服务端进行运算获得结果。因此，一般都会有专门的 API 来实现图像识别，云厂商也会有偿提供类似的能力：

- 华为云图像标签

![Serverless 实战：用20行Python代码轻松搞定图像分类和预测](https://img.serverlesscloud.cn/202057/1588856020422-fcf4a0195d5841d38cf234a508a87684.png)

- 腾讯云图像分析

![Serverless 实战：用20行Python代码轻松搞定图像分类和预测](https://img.serverlesscloud.cn/202057/1588855877612-fcf4a0195d5841d38cf234a508a87684.png)

本文将尝试通过一个有趣的 Python 库，快速将图像分类的功能搭建在云函数上，并且和 API 网关结合，对外提供 API 功能，实现一个 Serverless 架构的 " 图像分类 API"。

## 入门 ImageAI

首先，我们需要一个依赖库：`ImageAI`。

什么是 ImageAI 呢？其官方文档是这样描述的：

> ImageAI 是一个 python 库，旨在使开发人员能够使用简单的几行代码构建具有包含深度学习和计算机视觉功能的应用程序和系统。
> ImageAI 本着简洁的原则，支持最先进的机器学习算法，用于图像预测、自定义图像预测、物体检测、视频检测、视频对象跟踪和图像预测训练。ImageAI 目前支持使用在 ImageNet-1000 数据集上训练的 4 种不同机器学习算法进行图像预测和训练。ImageAI 还支持使用在 COCO 数据集上训练的 RetinaNet 进行对象检测、视频检测和对象跟踪。 最终，ImageAI 将为计算机视觉提供更广泛和更专业化的支持，包括但不限于特殊环境和特殊领域的图像识别。

简单理解，就是 ImageAI 依赖库可以帮助用户完成基本的图像识别和视频的目标提取。不过，ImageAI 虽然提供一些数据集和模型，但我们也可以根据自身需要对其进行额外的训练，进行定制化拓展。

其官方代码给出了这样一个简单的 Demo:

```python
from imageai.Prediction import ImagePrediction
import os
execution_path = os.getcwd()

prediction = ImagePrediction()
prediction.setModelTypeAsResNet()
prediction.setModelPath(os.path.join(execution_path, "resnet50_weights_tf_dim_ordering_tf_kernels.h5"))
prediction.loadModel()

predictions, probabilities = prediction.predictImage(os.path.join(execution_path, "1.jpg"), result_count=5 )
for eachPrediction, eachProbability in zip(predictions, probabilities):
    print(eachPrediction + " : " + eachProbability)
```

我们可以在本地进行初步运行，指定图片`1.jpg`为下图时：

![Serverless 实战：用20行Python代码轻松搞定图像分类和预测](https://img.serverlesscloud.cn/202057/1588855876021-fcf4a0195d5841d38cf234a508a87684.png)

可以得到结果：

```
convertible  :  52.459537982940674
sports_car  :  37.61286735534668
pickup  :  3.175118938088417
car_wheel  :  1.8175017088651657
minivan  :  1.7487028613686562
```

## 让 ImageAI 上云（部署到 Serverless 架构上）

通过上面的 Demo，我们可以考虑将这个模块部署到云函数：

- 首先，在本地创建一个 Python 的项目：`mkdir imageDemo`
- 新建文件：`vim index.py`
- 根据云函数的一些特殊形式，我们对 Demo 进行部分改造
  - 将初始化的代码放在外层；
  - 将预测部分当做触发所需要执行的部分，放在入口方法中（此处是 main_handler）;
  - 云函数与 API 网关结合对二进制文件支持并不是十分的友善，所以此处通过 base64 进行图片传输；
  - 入参定为`{"picture": 图片的 base64}`，出参定为：`{"prediction": 图片分类的结果}`

实现的代码如下：

```python
from imageai.Prediction import ImagePrediction
import os, base64, random

execution_path = os.getcwd()

prediction = ImagePrediction()
prediction.setModelTypeAsSqueezeNet()
prediction.setModelPath(os.path.join(execution_path, "squeezenet_weights_tf_dim_ordering_tf_kernels.h5"))
prediction.loadModel()


def main_handler(event, context):
    imgData = base64.b64decode(event["body"])
    fileName = '/tmp/' + "".join(random.sample('zyxwvutsrqponmlkjihgfedcba', 5))
    with open(fileName, 'wb') as f:
        f.write(imgData)
    resultData = {}
    predictions, probabilities = prediction.predictImage(fileName, result_count=5)
    for eachPrediction, eachProbability in zip(predictions, probabilities):
        resultData[eachPrediction] =  eachProbability
    return resultData

```

创建完成之后，下载所依赖的模型：

- SqueezeNet（文件大小：4.82 MB，预测时间最短，精准度适中）
- ResNet50 by Microsoft Research （文件大小：98 MB，预测时间较快，精准度高）
- InceptionV3 by Google Brain team （文件大小：91.6 MB，预测时间慢，精度更高）
- DenseNet121 by Facebook AI Research （文件大小：31.6 MB，预测时间较慢，精度最高）

因为我们仅用于测试，所以选择一个比较小的模型就可以：`SqueezeNet`：

在官方文档复制模型文件地址：

![Serverless 实战：用20行Python代码轻松搞定图像分类和预测](https://img.serverlesscloud.cn/202057/1588855875322-fcf4a0195d5841d38cf234a508a87684.png)

使用`wget`直接安装：

```
wget https://github.com/OlafenwaMoses/ImageAI/releases/download/1.0/squeezenet_weights_tf_dim_ordering_tf_kernels.h5
```

![Serverless 实战：用20行Python代码轻松搞定图像分类和预测](https://img.serverlesscloud.cn/202057/1588855876947-fcf4a0195d5841d38cf234a508a87684.png)

接下来，进行依赖安装：

![Serverless 实战：用20行Python代码轻松搞定图像分类和预测](https://img.serverlesscloud.cn/202057/1588855875167-fcf4a0195d5841d38cf234a508a87684.png)

由于腾讯云 Serveless 产品，在 Python Runtime 中还不支持在线安装依赖，所以需要手动打包依赖，并且上传。在 Python 的各种依赖库中，有很多依赖可能有编译生成二进制文件的过程，这就会导致不同环境下打包的依赖无法通用。

所以，最好的方法就是通过对应的操作系统 + 语言版本进行打包。我们就是在 CentOS+Python3.6 的环境下进行依赖打包。

对于很多 MacOS 用户和 Windows 用户来说，这确实不是一个很友好的过程，所以为了方便大家使用，我在 Serverless 架构上做了一个在线打包依赖的工具，所以可以直接用该工具进行打包：

![Serverless 实战：用20行Python代码轻松搞定图像分类和预测](https://img.serverlesscloud.cn/202057/1588855875139-fcf4a0195d5841d38cf234a508a87684.png)

![Serverless 实战：用20行Python代码轻松搞定图像分类和预测](https://img.serverlesscloud.cn/202057/1588855877247-fcf4a0195d5841d38cf234a508a87684.png)

生成压缩包之后，直接下载解压，并且放到自己的项目中即可：

![Serverless 实战：用20行Python代码轻松搞定图像分类和预测](https://img.serverlesscloud.cn/202057/1588855875175-fcf4a0195d5841d38cf234a508a87684.png)

最后一步，创建`serverless.yaml`

```
imageDemo:
  component: "@serverless/tencent-scf"
  inputs:
    name: imageDemo
    codeUri: ./
    handler: index.main_handler
    runtime: Python3.6
    region: ap-guangzhou
    description: 图像识别 / 分类 Demo
    memorySize: 256
    timeout: 10
    events:
      - apigw:
          name: imageDemo_apigw_service
          parameters:
            protocols:
              - http
            serviceName: serverless
            description: 图像识别 / 分类 DemoAPI
            environment: release
            endpoints:
              - path: /image
                method: ANY
```

完成之后，执行`sls --debug`部署，部署过程中会有扫码登陆，登陆之后等待即可，完成之后，就可以看到部署地址。

![Serverless 实战：用20行Python代码轻松搞定图像分类和预测](https://img.serverlesscloud.cn/202057/1588855875151-fcf4a0195d5841d38cf234a508a87684.png)

## 基本测试

通过 Python 语言进行测试，接口地址就是刚才复制的 +`/image`，例如：


```python
import json
import urllib.request
import base64

with open("1.jpg", 'rb') as f:
    base64_data = base64.b64encode(f.read())
    s = base64_data.decode()

url = 'http://service-9p7hbgvg-1256773370.gz.apigw.tencentcs.com/release/image'

print(urllib.request.urlopen(urllib.request.Request(
    url = url,
    data= json.dumps({'picture': s}).encode("utf-8")
)).read().decode("utf-8"))
```

通过网络搜索一张图片：

![Serverless 实战：用20行Python代码轻松搞定图像分类和预测](https://img.serverlesscloud.cn/202057/1588855876964-fcf4a0195d5841d38cf234a508a87684.png)

得到运行结果：

```json
{
	"prediction": {
		"cheetah": 83.12643766403198,
		"Irish_terrier": 2.315458096563816,
		"lion": 1.8476998433470726,
		"teddy": 1.6655176877975464,
		"baboon": 1.5562783926725388
	}
}
```

通过这个结果，我们可以看到图片的基础分类 / 预测已经成功了，为了证明这个接口的时延情况，可以对程序进行基本改造：

```python
import urllib.request
import base64, time

for i in range(0,10):
    start_time = time.time()
    with open("1.jpg", 'rb') as f:
        base64_data = base64.b64encode(f.read())
        s = base64_data.decode()

    url = 'http://service-9p7hbgvg-1256773370.gz.apigw.tencentcs.com/release/image'

    print(urllib.request.urlopen(urllib.request.Request(
        url = url,
        data= json.dumps({'picture': s}).encode("utf-8")
    )).read().decode("utf-8"))

    print("cost: ", time.time() - start_time)
```

输出结果：

```
{"prediction":{"cheetah":83.12643766403198,"Irish_terrier":2.315458096563816,"lion":1.8476998433470726,"teddy":1.6655176877975464,"baboon":1.5562783926725388}}
cost:  2.1161561012268066
{"prediction":{"cheetah":83.12643766403198,"Irish_terrier":2.315458096563816,"lion":1.8476998433470726,"teddy":1.6655176877975464,"baboon":1.5562783926725388}}
cost:  1.1259253025054932
{"prediction":{"cheetah":83.12643766403198,"Irish_terrier":2.315458096563816,"lion":1.8476998433470726,"teddy":1.6655176877975464,"baboon":1.5562783926725388}}
cost:  1.3322770595550537
{"prediction":{"cheetah":83.12643766403198,"Irish_terrier":2.315458096563816,"lion":1.8476998433470726,"teddy":1.6655176877975464,"baboon":1.5562783926725388}}
cost:  1.3562259674072266
{"prediction":{"cheetah":83.12643766403198,"Irish_terrier":2.315458096563816,"lion":1.8476998433470726,"teddy":1.6655176877975464,"baboon":1.5562783926725388}}
cost:  1.0180821418762207
{"prediction":{"cheetah":83.12643766403198,"Irish_terrier":2.315458096563816,"lion":1.8476998433470726,"teddy":1.6655176877975464,"baboon":1.5562783926725388}}
cost:  1.4290671348571777
{"prediction":{"cheetah":83.12643766403198,"Irish_terrier":2.315458096563816,"lion":1.8476998433470726,"teddy":1.6655176877975464,"baboon":1.5562783926725388}}
cost:  1.5917718410491943
{"prediction":{"cheetah":83.12643766403198,"Irish_terrier":2.315458096563816,"lion":1.8476998433470726,"teddy":1.6655176877975464,"baboon":1.5562783926725388}}
cost:  1.1727900505065918
{"prediction":{"cheetah":83.12643766403198,"Irish_terrier":2.315458096563816,"lion":1.8476998433470726,"teddy":1.6655176877975464,"baboon":1.5562783926725388}}
cost:  2.962592840194702
{"prediction":{"cheetah":83.12643766403198,"Irish_terrier":2.315458096563816,"lion":1.8476998433470726,"teddy":1.6655176877975464,"baboon":1.5562783926725388}}
cost:  1.2248001098632812
```

通过上面一组数据，我们可以看到整体的耗时基本控制在 1-1.5 秒之间。

当然，如果想要对接口性能进行更多的测试，例如通过并发测试来看并发情况下接口性能表现等。

至此，我们通过 Serveerless 架构搭建的 Python 版本的图像识别 / 分类小工具做好了。

## 总结

Serverless 架构下进行人工智能相关的应用可以是说是非常多的，本文是通过一个已有的依赖库，实现一个图像分类 / 预测的接口。`imageAI`这个依赖库相对来说自由度比较高，可以根据自身需要用来定制化自己的模型。本文算是抛砖引玉，期待更多人通过 Serverless 架构部署自己的"人工智能" API。



---
<div id='scf-deploy-iframe-or-md'></div>

---

> **传送门：**
> - GitHub: [github.com/serverless](https://github.com/serverless/serverless/blob/master/README_CN.md)
> - 官网：[serverless.com](https://serverless.com/)

欢迎访问：[Serverless 中文网](https://serverlesscloud.cn/)，您可以在 [最佳实践](https://serverlesscloud.cn/best-practice) 里体验更多关于 Serverless 应用的开发！
