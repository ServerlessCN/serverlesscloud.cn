---
title: 让 Serverless 为你的头像增加点装饰
description: 无论是国庆还是新年，经常会有一个平台为我们提供一个生成头像的小工具，本文手把手教你实现头像加装饰的工具
keywords: Serverless 多环境配置,Serverless 管理环境,Serverless配置方案
date: 2020-03-12
thumbnail: https://img.serverlesscloud.cn/2020511/1589207418152-ZalNtxgQAC_small.jpg
categories:
  - best-practice
authors:
  - Anycodes
authorslink:
  - https://zhuanlan.zhihu.com/ServerlessGo
tags:
  - Serverless
  - 图像处理
---

无论是国庆还是新年，经常会有一个平台为我们提供一个生成头像的小工具，很是新奇好玩，这类平台/工具，一般都有两个方法给我们制作头像。
* 直接加装饰，例如外面加一个框框，下面加一个 logo 等；
* 通过一些机器学习算法，增加一些装饰，例如增加一个圣诞帽等；

## Serverless直接增加头像装饰

其实这个功能很简单，主要功能就是选择一个图片，上传自己的头像，然后函数部分进行图像的合成，这一部分并没有涉及到机器学习算法，仅仅是图像合成相关算法。

主要通过用户上传的图片，在指定位置增加预定图片/用户选择的图片作为装饰物进行添加，添加过程是：

* 将预定图片/用户选择的图片进行美化，此处仅是将其变成圆形：

```python
def do_circle(base_pic):
    icon_pic = Image.open(base_pic).convert("RGBA")
    icon_pic = icon_pic.resize((500, 500), Image.ANTIALIAS)
    icon_pic_x, icon_pic_y = icon_pic.size
    temp_icon_pic = Image.new('RGBA', (icon_pic_x + 600, icon_pic_y + 600), (255, 255, 255))
    temp_icon_pic.paste(icon_pic, (300, 300), icon_pic)
    ima = temp_icon_pic.resize((200, 200), Image.ANTIALIAS)
    size = ima.size

    # 因为是要圆形，所以需要正方形的图片
    r2 = min(size[0], size[1])
    if size[0] != size[1]:
        ima = ima.resize((r2, r2), Image.ANTIALIAS)

    # 最后生成圆的半径
    r3 = 60
    imb = Image.new('RGBA', (r3 * 2, r3 * 2), (255, 255, 255, 0))
    pima = ima.load()  # 像素的访问对象
    pimb = imb.load()
    r = float(r2 / 2)  # 圆心横坐标

    for i in range(r2):
        for j in range(r2):
            lx = abs(i - r)  # 到圆心距离的横坐标
            ly = abs(j - r)  # 到圆心距离的纵坐标
            l = (pow(lx, 2) + pow(ly, 2)) ** 0.5  # 三角函数 半径

            if l < r3:
                pimb[i - (r - r3), j - (r - r3)] = pima[i, j]
    return imb

```

* 添加该装饰到用户头像上：

```python
def add_decorate(base_pic):
    try:
        base_pic = "./base/%s.png" % (str(base_pic))
        user_pic = Image.open("/tmp/picture.png").convert("RGBA")
        temp_basee_user_pic = Image.new('RGBA', (440, 440), (255, 255, 255))
        user_pic = user_pic.resize((400, 400), Image.ANTIALIAS)
        temp_basee_user_pic.paste(user_pic, (20, 20))
        temp_basee_user_pic.paste(do_circle(base_pic), (295, 295), do_circle(base_pic))
        temp_basee_user_pic.save("/tmp/output.png")
        return True
    except Exception as e:
        print(e)
        return False
```

* 除此之外，为了方便本地测试，项目增加了`test()`方法，模拟API网关传递的数据：

```python
def test():
    with open("test.png", 'rb') as f:
        image = f.read()
        image_base64 = str(base64.b64encode(image), encoding='utf-8')
    event = {
        "requestContext": {
            "serviceId": "service-f94sy04v",
            "path": "/test/{path}",
            "httpMethod": "POST",
            "requestId": "c6af9ac6-7b61-11e6-9a41-93e8deadbeef",
            "identity": {
                "secretId": "abdcdxxxxxxxsdfs"
            },
            "sourceIp": "14.17.22.34",
            "stage": "release"
        },
        "headers": {
            "Accept-Language": "en-US,en,cn",
            "Accept": "text/html,application/xml,application/json",
            "Host": "service-3ei3tii4-251000691.ap-guangzhou.apigateway.myqloud.com",
            "User-Agent": "User Agent String"
        },
        "body": "{\"pic\":\"%s\", \"base\":\"1\"}" % image_base64,
        "pathParameters": {
            "path": "value"
        },
        "queryStringParameters": {
            "foo": "bar"
        },
        "headerParameters": {
            "Refer": "10.0.2.14"
        },
        "stageVariables": {
            "stage": "release"
        },
        "path": "/test/value",
        "queryString": {
            "foo": "bar",
            "bob": "alice"
        },
        "httpMethod": "POST"
    }
    print(main_handler(event, None))


if __name__ == "__main__":
    test()
```

* 为了让函数更有同一个返回规范，此处增加统一返回的函数：

```python
def return_msg(error, msg):
    return_data = {
        "uuid": str(uuid.uuid1()),
        "error": error,
        "message": msg
    }
    print(return_data)
    return return_data
```

* 最后就是函数中涂口函数的写法：

```python
import base64, json
from PIL import Image
import uuid


def main_handler(event, context):
    try:
        print("将接收到的base64图像转为pic")
        imgData = base64.b64decode(json.loads(event["body"])["pic"].split("base64,")[1])
        with open('/tmp/picture.png', 'wb') as f:
            f.write(imgData)

        basePic = json.loads(event["body"])["base"]
        addResult = add_decorate(basePic)
        if addResult:
            with open("/tmp/output.png", "rb") as f:
                base64Data = str(base64.b64encode(f.read()), encoding='utf-8')
            return return_msg(False, {"picture": base64Data})
        else:
            return return_msg(True, "饰品添加失败")
    except Exception as e:
        return return_msg(True, "数据处理异常： %s" % str(e))
```

完成后端图像合成功能，可以制作前端页面：

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>2020头像大变样 - 头像SHOW - 自豪的采用腾讯云Serverless架构！</title>
    <meta name="viewport" content="width=device-width, initial-scale=1,maximum-scale=1,user-scalable=no">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black">
    <script type="text/javascript">
        thisPic = null
        function getFileUrl(sourceId) {
            var url;
            thisPic = document.getElementById(sourceId).files.item(0)
            if (navigator.userAgent.indexOf("MSIE") >= 1) { // IE
                url = document.getElementById(sourceId).value;
            } else if (navigator.userAgent.indexOf("Firefox") > 0) { // Firefox
                url = window.URL.createObjectURL(document.getElementById(sourceId).files.item(0));
            } else if (navigator.userAgent.indexOf("Chrome") > 0) { // Chrome
                url = window.URL.createObjectURL(document.getElementById(sourceId).files.item(0));
            }
            return url;
        }
        function preImg(sourceId, targetId) {
            var url = getFileUrl(sourceId);
            var imgPre = document.getElementById(targetId);
            imgPre.aaaaaa = url;
            imgPre.style = "display: block;";
        }
        function clickChose() {
            document.getElementById("imgOne").click()
        }
        function getNewPhoto() {
            document.getElementById("result").innerText = "系统处理中，请稍后..."
            var oFReader = new FileReader();
            oFReader.readAsDataURL(thisPic);
            oFReader.onload = function (oFREvent) {
                var xmlhttp;
                if (window.XMLHttpRequest) {
                    // IE7+, Firefox, Chrome, Opera, Safari 浏览器执行代码
                    xmlhttp = new XMLHttpRequest();
                } else {
                    // IE6, IE5 浏览器执行代码
                    xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
                }
                xmlhttp.onreadystatechange = function () {
                    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                        if (JSON.parse(xmlhttp.responseText)["error"]) {
                            document.getElementById("result").innerText = JSON.parse(xmlhttp.responseText)["message"];
                        } else {
                            document.getElementById("result").innerText = "长按保存图像";
                            document.getElementById("new_photo").aaaaaa = "data:image/png;base64," + JSON.parse(xmlhttp.responseText)["message"]["picture"];
                            document.getElementById("new_photo").style = "display: block;";
                        }
                    }
                }
                var url = " http://service-8d3fi753-1256773370.bj.apigw.tencentcs.com/release/new_year_add_photo_decorate"
                var obj = document.getElementsByName("base");
                var baseNum = "1"
                for (var i = 0; i < obj.length; i++) {
                    console.log(obj[i].checked)
                    if (obj[i].checked) {
                        baseNum = obj[i].value;
                    }
                }
                xmlhttp.open("POST", url, true);
                xmlhttp.setRequestHeader("Content-type", "application/json");
                var postData = {
                    pic: oFREvent.target.result,
                    base: baseNum
                }
                xmlhttp.send(JSON.stringify(postData));
            }
        }
    </script>
    <!--标准mui.css-->
    <link rel="stylesheet" href="./css/mui.min.css">
</head>
<body>
<h3 style="text-align: center; margin-top: 30px">2020头像SHOW</h3>
<div class="mui-card">
    <div class="mui-card-content">
        <div class="mui-card-content-inner">
            第一步：选择一个你喜欢的图片
        </div>
    </div>
    <div class="mui-content">
        <ul class="mui-table-view mui-grid-view mui-grid-9">
            <li class="mui-table-view-cell mui-media mui-col-xs-4 mui-col-sm-3"><label>
                <img aaaaaa="./base/1.png" width="100%"><input type="radio" name="base" value="1" checked></label></li>
            <li class="mui-table-view-cell mui-media mui-col-xs-4 mui-col-sm-3"><label>
                <img aaaaaa="./base/2.png" width="100%"><input type="radio" name="base" value="2"></label></li>
            <li class="mui-table-view-cell mui-media mui-col-xs-4 mui-col-sm-3"><label>
                <img aaaaaa="./base/11.png" width="100%"><input type="radio" name="base" value="11"></label></li>
            <li class="mui-table-view-cell mui-media mui-col-xs-4 mui-col-sm-3"><label>
                <img aaaaaa="./base/4.png" width="100%"><input type="radio" name="base" value="4"></label></li>
            <li class="mui-table-view-cell mui-media mui-col-xs-4 mui-col-sm-3"><label>
                <img aaaaaa="./base/5.png" width="100%"><input type="radio" name="base" value="5"></label></li>
            <li class="mui-table-view-cell mui-media mui-col-xs-4 mui-col-sm-3"><label>
                <img aaaaaa="./base/6.png" width="100%"><input type="radio" name="base" value="6"></label></li>
            <li class="mui-table-view-cell mui-media mui-col-xs-4 mui-col-sm-3"><label>
                <img aaaaaa="./base/12.png" width="100%"><input type="radio" name="base" value="12"></label></li>
            <li class="mui-table-view-cell mui-media mui-col-xs-4 mui-col-sm-3"><label>
                <img aaaaaa="./base/8.png" width="100%"><input type="radio" name="base" value="8"></label></li>
            <li class="mui-table-view-cell mui-media mui-col-xs-4 mui-col-sm-3"><label>
                <img aaaaaa="./base/3.png" width="100%"><input type="radio" name="base" value="3"></label></li>
        </ul>
    </div>
</div>
<div class="mui-card">
    <div class="mui-card-content">
        <div class="mui-card-content-inner">
            第二步：上传一张你的头像
        </div>
        <div>
            <form>
                <input type="file" name="imgOne" id="imgOne" onchange="preImg(this.id, 'photo')" style="display: none;"
                       accept="image/*">
                <center style="margin-bottom: 10px">
                    <input type="button" value="点击此处上传头像" onclick="clickChose()"/>
                    <img id="photo" aaaaaa="" width="300px" , height="300px" style="display: none;"/>
                </center>
            </form>
        </div>
    </div>
</div>
<div class="mui-card">
    <div class="mui-card-content">
        <div class="mui-card-content-inner">
            第三步：点击生成按钮获取新年头像
        </div>
        <div>
            <center style="margin-bottom: 10px">
                <input type="button" value="生成新年头像" onclick="getNewPhoto()"/>
                <p id="result"></p>
                <img id="new_photo" aaaaaa="" width="300px" , height="300px" style="display: none;"/>
            </center>
        </div>
    </div>
</div>
<p style="text-align: center">
    本项目自豪的<br>通过Serverless Framework<br>搭建在腾讯云SCF上
</p>
</body>
</html>
```

完成之后：

```yaml
new_year_add_photo_decorate:
  component: "@serverless/tencent-scf"
  inputs:
    name: myapi_new_year_add_photo_decorate
    codeUri: ./new_year_add_photo_decorate
    handler: index.main_handler
    runtime: Python3.6
    region: ap-beijing
    description: 新年为头像增加饰品
    memorySize: 128
    timeout: 5
    events:
      - apigw:
          name: serverless
          parameters:
            serviceId: service-8d3fi753
            environment: release
            endpoints:
              - path: /new_year_add_photo_decorate
                description: 新年为头像增加饰品
                method: POST
                enableCORS: true
                param:
                  - name: pic
                    position: BODY
                    required: 'FALSE'
                    type: string
                    desc: 原始图片
                  - name: base
                    position: BODY
                    required: 'FALSE'
                    type: string
                    desc: 饰品ID

myWebsite:
  component: '@serverless/tencent-website'
  inputs:
    code:
      src: ./new_year_add_photo_decorate/web
      index: index.html
      error: index.html
    region: ap-beijing
    bucketName: new-year-add-photo-decorate
```

完成之后就可以实现头像加装饰的功能，效果如下：

![](https://img.serverlesscloud.cn/202058/2-10-1.png)

## Serverless与人工智能联手增加头像装饰

其实第一种直接加装饰的方法，是可以直接在前端来实现，可以不通过后端功能实现，既然用到了后端服务，用到了云函数，那么我们不防将人工智能的方法和Serverless架构结合，共同实现一个增加装饰的小工具，先进行一下效果的预览：

![](https://img.serverlesscloud.cn/202058/2-10-2.png)

这一功能的主要做法就是，通过人工智能算法(此处是通过Dlib实现)，进行人脸的检测：

```python
print("dlib人脸关键点检测器,正脸检测")
predictorPath = "shape_predictor_5_face_landmarks.dat"
predictor = dlib.shape_predictor(predictorPath)
detector = dlib.get_frontal_face_detector()
dets = detector(img, 1)
```

此处做法是，只检测一张脸，检测到即进行返回：

```python
for d in dets:
    x, y, w, h = d.left(), d.top(), d.right() - d.left(), d.bottom() - d.top()

    print("关键点检测，5个关键点")
    shape = predictor(img, d)

    print("选取左右眼眼角的点")
    point1 = shape.part(0)
    point2 = shape.part(2)

    print("求两点中心")
    eyes_center = ((point1.x + point2.x) // 2, (point1.y + point2.y) // 2)

    print("根据人脸大小调整帽子大小")
    factor = 1.5
    resizedHatH = int(round(rgbHat.shape[0] * w / rgbHat.shape[1] * factor))
    resizedHatW = int(round(rgbHat.shape[1] * w / rgbHat.shape[1] * factor))

    if resizedHatH > y:
        resizedHatH = y - 1

    print("根据人脸大小调整帽子大小")
    resizedHat = cv2.resize(rgbHat, (resizedHatW, resizedHatH))

    print("用alpha通道作为mask")
    mask = cv2.resize(a, (resizedHatW, resizedHatH))
    maskInv = cv2.bitwise_not(mask)

    print("帽子相对与人脸框上线的偏移量")
    dh = 0
    bgRoi = img[y + dh - resizedHatH:y + dh,
            (eyes_center[0] - resizedHatW // 3):(eyes_center[0] + resizedHatW // 3 * 2)]

    print("原图ROI中提取放帽子的区域")
    bgRoi = bgRoi.astype(float)
    maskInv = cv2.merge((maskInv, maskInv, maskInv))
    alpha = maskInv.astype(float) / 255

    print("相乘之前保证两者大小一致（可能会由于四舍五入原因不一致）")
    alpha = cv2.resize(alpha, (bgRoi.shape[1], bgRoi.shape[0]))
    bg = cv2.multiply(alpha, bgRoi)
    bg = bg.astype('uint8')

    print("提取帽子区域")
    hat = cv2.bitwise_and(resizedHat, cv2.bitwise_not(maskInv))

    print("相加之前保证两者大小一致（可能会由于四舍五入原因不一致）")
    hat = cv2.resize(hat, (bgRoi.shape[1], bgRoi.shape[0]))
    print("两个ROI区域相加")
    addHat = cv2.add(bg, hat)

    print("把添加好帽子的区域放回原图")
    img[y + dh - resizedHatH:y + dh,
    (eyes_center[0] - resizedHatW // 3):(eyes_center[0] + resizedHatW // 3 * 2)] = addHat

    return img
```

在Serverless架构下的完整代码：

```python
import cv2
import dlib
import base64
import json


def addHat(img, hat_img):
    print("分离rgba通道，合成rgb三通道帽子图，a通道后面做mask用")
    r, g, b, a = cv2.split(hat_img)
    rgbHat = cv2.merge((r, g, b))

    print("dlib人脸关键点检测器,正脸检测")
    predictorPath = "shape_predictor_5_face_landmarks.dat"
    predictor = dlib.shape_predictor(predictorPath)
    detector = dlib.get_frontal_face_detector()
    dets = detector(img, 1)

    print("如果检测到人脸")
    if len(dets) > 0:
        for d in dets:
            x, y, w, h = d.left(), d.top(), d.right() - d.left(), d.bottom() - d.top()

            print("关键点检测，5个关键点")
            shape = predictor(img, d)

            print("选取左右眼眼角的点")
            point1 = shape.part(0)
            point2 = shape.part(2)

            print("求两点中心")
            eyes_center = ((point1.x + point2.x) // 2, (point1.y + point2.y) // 2)

            print("根据人脸大小调整帽子大小")
            factor = 1.5
            resizedHatH = int(round(rgbHat.shape[0] * w / rgbHat.shape[1] * factor))
            resizedHatW = int(round(rgbHat.shape[1] * w / rgbHat.shape[1] * factor))

            if resizedHatH > y:
                resizedHatH = y - 1

            print("根据人脸大小调整帽子大小")
            resizedHat = cv2.resize(rgbHat, (resizedHatW, resizedHatH))

            print("用alpha通道作为mask")
            mask = cv2.resize(a, (resizedHatW, resizedHatH))
            maskInv = cv2.bitwise_not(mask)

            print("帽子相对与人脸框上线的偏移量")
            dh = 0
            bgRoi = img[y + dh - resizedHatH:y + dh,
                    (eyes_center[0] - resizedHatW // 3):(eyes_center[0] + resizedHatW // 3 * 2)]

            print("原图ROI中提取放帽子的区域")
            bgRoi = bgRoi.astype(float)
            maskInv = cv2.merge((maskInv, maskInv, maskInv))
            alpha = maskInv.astype(float) / 255

            print("相乘之前保证两者大小一致（可能会由于四舍五入原因不一致）")
            alpha = cv2.resize(alpha, (bgRoi.shape[1], bgRoi.shape[0]))
            bg = cv2.multiply(alpha, bgRoi)
            bg = bg.astype('uint8')

            print("提取帽子区域")
            hat = cv2.bitwise_and(resizedHat, cv2.bitwise_not(maskInv))

            print("相加之前保证两者大小一致（可能会由于四舍五入原因不一致）")
            hat = cv2.resize(hat, (bgRoi.shape[1], bgRoi.shape[0]))
            print("两个ROI区域相加")
            addHat = cv2.add(bg, hat)

            print("把添加好帽子的区域放回原图")
            img[y + dh - resizedHatH:y + dh,
            (eyes_center[0] - resizedHatW // 3):(eyes_center[0] + resizedHatW // 3 * 2)] = addHat

            return img


def main_handler(event, context):
    try:
        print("将接收到的base64图像转为pic")
        imgData = base64.b64decode(json.loads(event["body"])["pic"])
        with open('/tmp/picture.png', 'wb') as f:
            f.write(imgData)

        print("读取帽子素材以及用户头像")
        hatImg = cv2.imread("hat.png", -1)
        userImg = cv2.imread("/tmp/picture.png")

        output = addHat(userImg, hatImg)
        cv2.imwrite("/tmp/output.jpg", output)

        print("读取头像进行返回给用户，以Base64返回")
        with open("/tmp/output.jpg", "rb") as f:
            base64Data =  str(base64.b64encode(f.read()), encoding='utf-8')

        return {
            "picture": base64Data
        }
    except Exception as e:
        return {
            "error": str(e)
        }
```

至此，即完成了通过用户上传人物头像进行增加圣诞帽的功能。

## 总结

Serverless架构毕竟是一个新的技术，或者说是一个比较新的 Framework，如果刚开始就通过它来做一些很重的产品，可能会让学习者失去兴趣，但是前期可以通过Serverless架构不断的实现一些有趣的功能，小的应用，例如监控告警、图像识别、图像压缩、图像合成、文本摘要、关键词提取、简单的MapReduce等，通过这些小的应用，一方面可以让我们更加深入了解Serverless架构，另一方面也可以让我们对Serverless的实际应用和价值产生更大的信心。

传统情况下，我们如果要做这样的一个工具，可能需要一个服务器，哪怕没有人使用，也要有一台服务器苦苦支撑，那么仅仅就是一个Demo，也要无时无刻的支出成本，但是在Serverless架构下，通过Serverless弹性伸缩特点让我们不惧怕高并发，通过Serverless的按量付费模式，让我们不惧怕成本支出。

希望各位可以通过我的抛砖引玉，更加深入的了解Serverless架构。



---
<div id='scf-deploy-iframe-or-md'></div>

---

> **传送门：**
> - GitHub: [github.com/serverless](https://github.com/serverless/serverless/blob/master/README_CN.md)
> - 官网：[serverless.com](https://serverless.com/)

欢迎访问：[Serverless 中文网](https://serverlesscloud.cn/)，您可以在 [最佳实践](https://serverlesscloud.cn/best-practice) 里体验更多关于 Serverless 应用的开发！
