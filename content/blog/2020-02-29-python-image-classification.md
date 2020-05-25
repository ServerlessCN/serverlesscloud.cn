---
title: 20 行代码：Serverless 架构下用 Python 轻松搞定图像分类
description: 如何快速搭建一个图像分类/识别 API
keywords: Serverless 图像分类,Serverless 识别 API,Serverless Python
date: 2020-02-29
thumbnail: https://img.serverlesscloud.cn/202034/1583317036981-video3.png
categories:
  - user-stories
authors:
  - Anycodes
authorslink:
  - https://www.zhihu.com/people/liuyu-43-97
tags:
  - Serverless
  - Python 
---

「图像分类」是人工智能领域的一个热门话题，我们在实际生活中甚至业务的生产环境里，也经常遇到图像分类相似的需求，如何能快速搭建一个图像分类或者内容识别的 API 呢？

我们考虑使用 [Serverless Framework](https://github.com/serverless/serverless/blob/master/README_CN.md) 将图像识别模块部署到腾讯云云函数 SCF 上。

这里我们会用到一个图像相关的库：`ImageAI`，官方给了一个简单的 demo：

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

接下来分四步进行：**创建项目 → 安装依赖 → 配置 yml 文件 → 部署**

### 本地创建 Python 项目

首先，我们在本地创建一个 Python 的项目：mkdir imageDemo`

然后新建文件：``vim index.py`

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

### 下载安装依赖

项目创建完成之后，下载所依赖的模型： 

```
- SqueezeNet（文件大小：4.82 MB，预测时间最短，精准度适中）
- ResNet50 by Microsoft Research （文件大小：98 MB，预测时间较快，精准度高）
- InceptionV3 by Google Brain team （文件大小：91.6 MB，预测时间慢，精度更高）
- DenseNet121 by Facebook AI Research （文件大小：31.6 MB，预测时间较慢，精度最高）
```

我们先用第一个 `SqueezeNet` 来做测试：

在官方文档复制模型文件地址：

![](http://editor.0duzhan.com/media/editor/WX20200302-144924_20200302064946149139.png)

使用 `wget` 直接安装：

```
wget https://github.com/OlafenwaMoses/ImageAI/releases/download/1.0/squeezenet_weights_tf_dim_ordering_tf_kernels.h5
```

![](http://editor.0duzhan.com/media/editor/WX20200302-145253@2x_20200302065305405982.png)

接下来安装依赖，这里面貌似安装的内容蛮多的：

![](http://editor.0duzhan.com/media/editor/WX20200302-145535_20200302065546714569.png)

这里需要注意：其中一些依赖需要编译，因此要在 centos + python2.7/3.6 的版本下打包才可以，这很复杂，尤其对于 mac/windows 用户，伤不起。

这时候可以直接用我之前的打包网址：

![](http://editor.0duzhan.com/media/editor/WX20200302-145832_20200302065910362439.png)

![](http://editor.0duzhan.com/media/editor/WX20200302-145859_20200302065917936649.png)

下载解压后，直接放到自己的项目中即可：

![](http://editor.0duzhan.com/media/editor/WX20200302-150100@2x_20200302070110872303.png)

### 创建 yml 文件

接着创建 `serverless.yaml` 配置文件

```
imageDemo:
  component: "@serverless/tencent-scf"
  inputs:
    name: imageDemo
    codeUri: ./
    handler: index.main_handler
    runtime: Python3.6
    region: ap-guangzhou
    description: 图像识别/分类Demo
    memorySize: 256
    timeout: 10
    events:
      - apigw:
          name: imageDemo_apigw_service
          parameters:
            protocols:
              - http
            serviceName: serverless
            description: 图像识别/分类DemoAPI
            environment: release
            endpoints:
              - path: /image
                method: ANY
```

### 部署

通过 `serverless` 命令（可使用命令缩写 `sls` ）进行部署，添加 `--debug` 参数查看部署详情：

```text
$ sls --debug
```

如果你的账号未 [登陆](https://cloud.tencent.com/login) 或 [注册](https://cloud.tencent.com/register) 腾讯云，可以直接通过微信扫描命令行中的二维码，从而进行授权登陆和注册。

![](http://editor.0duzhan.com/media/editor/WX20200302-150814@2x_20200302070827866955.png)

访问命令行输出的 URL，URL 就是我们刚才复制的 +`/image`，通过 Python 语言进行测试：

```python
import urllib.request
import base64

with open("1.jpg", 'rb') as f:
    base64_data = base64.b64encode(f.read())
    s = base64_data.decode()

url = 'http://service-9p7hbgvg-1256773370.gz.apigw.tencentcs.com/release/image'

print(urllib.request.urlopen(urllib.request.Request(
    url = url,
    data=s.encode("utf-8")
)).read().decode("utf-8"))
```

例如我们用这张图进行测试：

![](http://editor.0duzhan.com/media/editor/1_20200302070800203686.jpg)

得到运行结果：

```python
{"cheetah": 83.12643766403198, "Irish_terrier": 2.315458096563816, "lion": 1.8476998433470726, "teddy": 1.6655176877975464, "baboon": 1.5562783926725388}
```

将代码修改一下，进行一下简单的耗时测试：

```python
import urllib.request
import base64, time

for i in range(0,10):
    start_time = time.time()
    with open("1.jpg", 'rb') as f:
        base64_data = base64.b64encode(f.read())
        s = base64_data.decode()

    url = 'http://service-hh53d8yz-1256773370.bj.apigw.tencentcs.com/release/test'

    print(urllib.request.urlopen(urllib.request.Request(
        url = url,
        data=s.encode("utf-8")
    )).read().decode("utf-8"))
    print("cost: ", time.time() - start_time)
```

输出结果：

```
{"cheetah": 83.12643766403198, "Irish_terrier": 2.315458096563816, "lion": 1.8476998433470726, "teddy": 1.6655176877975464, "baboon": 1.5562783926725388}
cost:  2.1161561012268066
{"cheetah": 83.12643766403198, "Irish_terrier": 2.315458096563816, "lion": 1.8476998433470726, "teddy": 1.6655176877975464, "baboon": 1.5562783926725388}
cost:  1.1259253025054932
{"cheetah": 83.12643766403198, "Irish_terrier": 2.315458096563816, "lion": 1.8476998433470726, "teddy": 1.6655176877975464, "baboon": 1.5562783926725388}
cost:  1.3322770595550537
{"cheetah": 83.12643766403198, "Irish_terrier": 2.315458096563816, "lion": 1.8476998433470726, "teddy": 1.6655176877975464, "baboon": 1.5562783926725388}
cost:  1.3562259674072266
{"cheetah": 83.12643766403198, "Irish_terrier": 2.315458096563816, "lion": 1.8476998433470726, "teddy": 1.6655176877975464, "baboon": 1.5562783926725388}
cost:  1.0180821418762207
{"cheetah": 83.12643766403198, "Irish_terrier": 2.315458096563816, "lion": 1.8476998433470726, "teddy": 1.6655176877975464, "baboon": 1.5562783926725388}
cost:  1.4290671348571777
{"cheetah": 83.12643766403198, "Irish_terrier": 2.315458096563816, "lion": 1.8476998433470726, "teddy": 1.6655176877975464, "baboon": 1.5562783926725388}
cost:  1.5917718410491943
{"cheetah": 83.12643766403198, "Irish_terrier": 2.315458096563816, "lion": 1.8476998433470726, "teddy": 1.6655176877975464, "baboon": 1.5562783926725388}
cost:  1.1727900505065918
{"cheetah": 83.12643766403198, "Irish_terrier": 2.315458096563816, "lion": 1.8476998433470726, "teddy": 1.6655176877975464, "baboon": 1.5562783926725388}
cost:  2.962592840194702
{"cheetah": 83.12643766403198, "Irish_terrier": 2.315458096563816, "lion": 1.8476998433470726, "teddy": 1.6655176877975464, "baboon": 1.5562783926725388}
cost:  1.2248001098632812
```

这个数据，整体性能基本在可接受范围内。

基于 Serverless 架构搭建的 Python 图像识别/分类 小工具就大功告成啦！

---

> **传送门：**
> - GitHub: [github.com/serverless](https://github.com/serverless/serverless/blob/master/README_CN.md) 
> - 官网：[serverless.com](https://serverless.com/)

欢迎访问：[Serverless 中文网](https://serverlesscloud.cn/)，您可以在 [最佳实践](https://serverlesscloud.cn/best-practice) 里体验更多关于 Serverless 应用的开发！
