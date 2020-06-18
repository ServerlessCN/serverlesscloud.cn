---
title: 万物皆可 Serverless 之使用云函数 SCF 快速部署验证码识别接口
description: 验证码识别是搞爬虫实现自动化脚本避不开的一个问题，通常验证码识别程序要么部署在本地，要么部署在服务器端，如果部署在服务器端就需要自己去搭建配置网络环境并编写调用接口，这是一个极其繁琐耗时的过程。但是现在我们通过无服务器云函数 SCF，就可以快速将本地的验证码识别程序发布上线，极大地提高了开发效率。
keywords: Serverless,Serverless SCF,Serverless应用
date: 2020-04-23
thumbnail: https://img.serverlesscloud.cn/2020523/1590208707614-16201.jpg
categories:
  - user-stories
authors:
  - 乂乂又又
authorslink:
  - https://cloud.tencent.com/developer/article/1615839
tags:
  - 爬虫
  - 云函数
---

验证码识别是搞爬虫实现自动化脚本避不开的一个问题。通常验证码识别程序要么部署在本地，要么部署在服务器端。如果部署在服务器端就需要自己去搭建配置网络环境并编写调用接口，这是一个极其繁琐耗时的过程。

但是现在我们通过腾讯云云函数 SCF，就可以快速将本地的验证码识别程序发布上线，极大地提高了开发效率。

## 效果展示

![一种比较简单的验证码](https://img.serverlesscloud.cn/2020523/1590208707883-16201.jpg)

![识别扭曲变形的验证码](https://img.serverlesscloud.cn/2020523/1590208707787-16201.jpg)

可以看到，识别效果还是蛮好的，甚至超过了肉眼识别率。

## 操作步骤

传统的验证码识别流程是

1. 图像预处理（灰化，去噪，切割，二值化，去干扰线等）
2. 验证码字符特征提取（SVM，CNN 等）
3. 验证码识别

下面我就带大家一起来创建、编写并发布上线一个验证识别云函数

### 第一步：新建 python 云函数

参见系列文章[《万物皆可Serverless之使用 SCF+COS 快速开发全栈应用》](https://serverlesscloud.cn/blog/2020-04-23-serverless-scf-cos/)

### 第二步：编写验证识别云函数

![一个简单的验证码](https://img.serverlesscloud.cn/2020523/1590208707700-16201.jpg)

> Life is short, show me the code.

这里我就以一个最简单的验证码识别程序为例，直接上代码

```javascript
import io
import os
import time
from PIL import Image as image
import json

#字符特征
chars = {
    '1': [1, 1, 1, 0, 1, ...],
    '2': [1, 0, 0, 1, 0, ...],
    '3': [0, 1, 0, 0, 1, ...],
    # 其他字符特征...
}


# 灰度处理
def covergrey(img):
    return img.convert('L')

# 去除验证码边框
def clearedge(img):
    for y in range(img.size[1]):
        img.putpixel((0, y), 255)
        img.putpixel((1, y), 255)
        img.putpixel((2, y), 255)
        img.putpixel((img.size[0]-1, y), 255)
        img.putpixel((img.size[0]-2, y), 255)
        img.putpixel((img.size[0]-3, y), 255)
    for x in range(img.size[0]):
        img.putpixel((x, 0), 255)
        img.putpixel((x, 1), 255)
        img.putpixel((x, 2), 255)
        img.putpixel((x, img.size[1]-1), 255)
        img.putpixel((x, img.size[1]-2), 255)
        img.putpixel((x, img.size[1]-3), 255)
    return img

# 去除干扰线并转换为黑白照片
def clearline(img):
    for y in range(img.size[1]):
        for x in range(img.size[0]):
            if int(img.getpixel((x, y))) >= 110:
                img.putpixel((x, y), 0xff)
            else:
                img.putpixel((x, y), 0x0)
    return img

# 去噪/pnum-去噪效率
def del_noise(im, pnum=3):
    w, h = im.size
    white = 255
    black = 0
    for i in range(0, w):
        im.putpixel((i, 0), white)
        im.putpixel((i, h - 1), white)
    for i in range(0, h):
        im.putpixel((0, i), white)
        im.putpixel((w - 1, i), white)
    for i in range(1, w - 1):
        for j in range(1, h - 1):
            val = im.getpixel((i, j))
            if val == black:
                cnt = 0
                for ii in range(-1, 2):
                    for jj in range(-1, 2):
                        if im.getpixel((i + ii, j + jj)) == black:
                            cnt += 1
                if cnt < pnum:
                    im.putpixel((i, j), white)
            else:
                cnt = 0
                for ii in range(-1, 2):
                    for jj in range(-1, 2):
                        if im.getpixel((i + ii, j + jj)) == black:
                            cnt += 1
                if cnt >= 7:
                    im.putpixel((i, j), black)
    return im

# 图片数据二值化
def two_value(code_data):
    table = [serverless]
    for i in code_data:
        if i < 140:  # 二值化分界线140
            table.append(0)
        else:
            table.append(1)
    return table

# 图片预处理
def pre_img(img):
    img = covergrey(img)  # 去色
    img = clearedge(img)  # 去边
    img = clearline(img)  # 去线
    img = del_noise(img)  # 去噪
    return img

# 处理图片数据
def data_img(img):
    code_data = [serverless]  # 验证码数据列表
    for i in range(4):  # 切割验证码
        x = 5 + i * 18  # 可用PS确定图片切割位置
        code_data.append(img.crop((x, 9, x + 18, 33)).getdata())
        code_data[i] = two_value(code_data[i])  # 二值化数据
    return code_data

# 验证码识别
def identify(data):
    code = ['']*4  # 验证码字符列表
    diff_min = [432]*4  # 初始化最小距离--不符合的数据点个数（共120数据点）
    for char in chars:  # 遍历验证码字符（每个字符比较一次4个验证码）
        diff = [0]*4  # 各验证码差距值(每个字符判断前重置此距离)
        for i in range(4):  # 计算四个验证码
            for j in range(432):  # 逐个像素比较验证码特征
                if data[i][j] != chars[char][j]:
                    diff[i] += 1  # 距离+1
        for i in range(4):
            if diff[i] < diff_min[i]:  # 比已有距离还要小（更加符合）
                diff_min[i] = diff[i]  # 刷新最小距离
                code[i] = char  # 刷新最佳验证码
    return ''.join(code)  # 输出结果


def predict(imgs):
    code = ''
    img = imgs.read()
    img = image.open(io.BytesIO(img))
    img = pre_img(img)  # 预处理图片
    data = data_img(img)  # 获取图片数据
    code = identify(data)  # 识别验证码
    return code


def apiReply(reply, code=200):
    return {
        "isBase64Encoded": False,
        "statusCode": code,
        "headers": {'Content-Type': 'application/json', "Access-Control-Allow-Origin": "*"},
        "body": json.dumps(reply, ensure_ascii=False)
    }


def main_handler(event, context):
    main_start = time.time()
    flag = True if 'image' in event['queryString'] else False
    code = predict(event['queryString']['image']) if 'image' in event['queryString'] else '无效的请求'
    return apiReply({
        'ok': flag,
        'code': code,
        'spendTime': str(time.time()-main_start)
    })
```

老规矩，先捋一下整个云函数的流程。

```javascript
def main_handler(event, context):
    main_start = time.time()
    flag = True if 'image' in event['queryString'] else False
    code = predict(event['queryString']['image']) if 'image' in event['queryString'] else '无效的请求'
    return apiReply({
        'ok': flag,
        'code': code,
        'spendTime': str(time.time()-main_start)
    })
```

首先，我们通过 event 事件拿到 api 请求的验证码 image 数据，然后判断一下 image 参数是否存在，若不存在就返回请求无效的提示

```javascript
def predict(imgs):
    code = ''
    img = imgs.read()
    img = image.open(io.BytesIO(img))
    img = pre_img(img)  # 预处理图片
    data = data_img(img)  # 获取图片数据
    code = identify(data)  # 识别验证码
    return code
```

如果 image 请求参数存在就调用 predict 函数解析识别验证码，流程如下：

1. 读取验证码图像
2. 验证码图像预处理
3. 识别处理后的验证码

```javascript
# 图片预处理
def pre_img(img):
    img = covergrey(img)  # 去色
    img = clearedge(img)  # 去边
    img = clearline(img)  # 去线
    img = del_noise(img)  # 去噪
    return img
```

我们来看一下图像预处理过程

1. 将验证码去色，转为灰度图
2. 去除验证码黑色边框
3. 去除验证码干扰线
4. 去除验证码噪点

```javascript
#字符特征
chars = {
    '1': [1, 1, 1, 0, 1, ...],
    '2': [1, 0, 0, 1, 0, ...],
    '3': [0, 1, 0, 0, 1, ...],
    # 其他字符特征...
}

# 验证码识别
def identify(data):
    code = ['']*4  # 验证码字符列表
    diff_min = [432]*4  # 初始化最小距离--不符合的数据点个数（共120数据点）
    for char in chars:  # 遍历验证码字符（每个字符比较一次4个验证码）
        diff = [0]*4  # 各验证码差距值(每个字符判断前重置此距离)
        for i in range(4):  # 计算四个验证码
            for j in range(432):  # 逐个像素比较验证码特征
                if data[i][j] != chars[char][j]:
                    diff[i] += 1  # 距离+1
        for i in range(4):
            if diff[i] < diff_min[i]:  # 比已有距离还要小（更加符合）
                diff_min[i] = diff[i]  # 刷新最小距离
                code[i] = char  # 刷新最佳验证码
    return ''.join(code)  # 输出结果
```

PS：文章中的字符特征 chars 并不完整，你可能需要自行提取所有特征。

最后来看一下验证码的识别过程：这里我们直接简单粗暴地取处理后图像数据的所有像素点作为字符的特征（所谓大道至简），然后将每个待识别字符处理后图像的数据与所有字符的特征逐个比较，取最相似的那个字符作为识别结果。

![正确的识别结果](https://img.serverlesscloud.cn/2020523/1590208707602-16201.jpg)

嗯，没什么问题的话，你就可以得到正确的识别结果了。

### 第三步：上线发布云函数、添加 API 网关触发器、启用响应集成

参见系列文章[《万物皆可 Serverless 之使用 SCF+COS 快速开发全栈应用》](https://serverlesscloud.cn/blog/2020-04-23-serverless-scf-cos/)

## 写在最后

当然，以上只是以一个简单的验证码识别为例，对于一些比较复杂的验证码，你也可以使用 Tensorflow，Pytorch 等深度学习计算框架搭建、训练模型，然后将训练好的模型借助无服务器云函数快速上线发布使用。



---
<div id='scf-deploy-iframe-or-md'></div>

---

> **传送门：**
> - GitHub: [github.com/serverless](https://github.com/serverless/serverless/blob/master/README_CN.md)
> - 官网：[serverless.com](https://serverless.com/)

欢迎访问：[Serverless 中文网](https://serverlesscloud.cn/)，您可以在 [最佳实践](https://serverlesscloud.cn/best-practice) 里体验更多关于 Serverless 应用的开发！

