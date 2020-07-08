---
title: 静态网站利用 SCF+API 访问自定义后端接口
description: 本文介绍使用全静态页面的网站如何利用腾讯云的 SCF+API 服务实现简单的后端接口，并提供了一个 Python 出题器的实例演示。
keywords: Serverless,Serverless网站,Serverlessdays应用
date: 2020-03-30
thumbnail: https://img.serverlesscloud.cn/2020522/1590160217283-%E4%BC%81%E4%B8%9A%E5%BE%AE%E4%BF%A1%E6%88%AA%E5%9B%BE_15901601368204.png
categories:
  - user-stories
authors:
  - jessy
authorslink:
  - https://cloud.tencent.com/developer/article/1606163
tags:
  - Serverless
  - 云函数
---

本文介绍使用全静态页面的网站如何利用腾讯云的 **SCF+API** 服务实现简单的后端接口，并提供了一个 Python 出题器的实例演示。

相关服务介绍：

> 云函数（Serverless Cloud Function，SCF）是腾讯云为企业和开发者们提供的无服务器执行环境，帮助您在无需购买和管理服务器的情况下运行代码。 API 网关（API Gateway）是 API 托管服务，提供 API 的完整生命周期管理，包括创建、维护、发布、运行、下线等。

前几天为我家小盆友用 Python 写了个简单的自动数学题出题器，小家伙十分好奇，隔三差五的就要来让我演示一番 😏。只是每次都要拿本出来输命令给他看实在有些麻烦，于是想着能不能加个前端页面调用，直接打开页面就能看到运行效果。

作为一个行动派派，我目标锁定了用 **SCF+API** 的方式，也就是现在很🔥的 serveless 方案。最大的好处当然是不用再伺候服务器了，少了很多搭建的麻烦。而且这个按实际使用量计费，对于小网站再适合不过了。

下面介绍下要怎么实现了。首先，你要有个[腾讯云](https://cloud.tencent.com/?from=10680)账号，然后参考👇的简单步骤：

1. 创建云函数 SCF。
2. 创建 API Gateway，后台指定调用步骤 1 建好的云函数。
3. API gateway中 新建密钥，使用计划，实现访问控制并发布。
4. 写前端页面，调用刚写好的 API。
5. 测试，解决各种 bug，大功告成！

----

## 创建云函数 SCF

照着这个文档 [云函数快速入门](https://cloud.tencent.com/document/product/583/9179?from=10680) 按里面的步骤来创建自己业务函数。第一次可以选择使用控制台创建函数，运行环境中选择自己熟悉的编程语言，当前支持 **python, php, golang, java, nodejs** 几种，然后就可以在**函数代码**下愉快的开始了。这里以运行环境 **Python3.6** 为例。默认的入口函数是 `index.main_handler`，有两个输入参数:

- event：可以获取触发源的消息 - **主要用来获取传入参数**。
- context：可以获取本函数的环境及配置信息。

不清楚参数里有什么的，或怎么用的，可以直接打印出来看看，都是 dict 类型，一目了然。建议加上传入参数检查和限制，毕竟我们不知道调用接口的人会传些什么奇怪的东西。返回类型包装成 json 格式，对前端调用更友好。给出改好的代码👇：

```javascript
# -*- coding: utf8 -*-
import sys, getopt, random
import json
def main_handler(event, context):
    print("Received event: %s" % event)
    print("Received context: %s" % context)
    params = event["queryString"]
    return auto_cal_generator(int(params["limit"]), int(params["op_count"]), params["op_type"].split(","), int(params["total"]))

def auto_cal_generator(limit=100, op_count=1, op_type=["+"], total=100):
    if limit>999 or op_count>9 or total>99:
        return "exceed max input limit"
    res = {}
    res["msg"] = "Here are today's %d works, good luck!" % total
    questions = []
    l = len(op_type)-1
    for j in range(0, total):
        up = limit
        question = ""
        for i in range(0, op_count+1):
            num = 0
            if i == 0:
                num = random.randint(1,max(1,min(limit,up)))
                question = "%s%d" % (question, num)
                up -= num
                continue
            op = "+"
            if limit - up > 0:
                op_i = random.randint(0,l)
                op = op_type[op_i]
            question = "%s%s" % (question, op)
            if op =="+":
                num = random.randint(1,max(1,min(limit,up)))
                up -= num
            elif op == "-":
                num = random.randint(1,max(limit-up, 1))
                up += num
            else:
                print("operator error: %s" % op)
                sys.exit(1)
            question = "%s%d" % (question, num)
        questions.append("%d: %s=" % (j+1, question))
    res["questions"] = questions
    return json.dumps(res)
```

写完 code 后当然不能忘了最重要的**测试**工作，代码输入框下就是测试的入口，需要创建测试模板。系统已经预置了好几种模板类型，直接拿来改成你需要的就好。我们用 **API Gateway 事件模板**为原型修改刚写好的出题器的测试模板。由于我们 code 获取的是 event 里的 `queryString`，这里只用修改里面的 `queryString` 这块：

```javascript
"queryString": {
  "op\_type" : "+,-",
  "op\_count" : 2,
  "limit":100,
  "total":10
 },
```

创建完测试模板后，点击左侧**测试**，瞬间返回结果：

```javascript
返回结果
"{\"msg\": \"Here are today's 10 works, good luck!\", \"questions\": \"1: 76-4-44=\", \"2: 52-42+67=\", \"3: 95+4-50=\", \"4: 84-78-1=\", \"5: 29-20-9=\", \"6: 19+37+38=\", \"7: 93-53+57=\", \"8: 80+7+7=\", \"9: 90-74-11=\", \"10: 7+34+52=\"}"
```

结果下方还有**执行摘要**和**执行日志**，方便调试。

## 创建 API Gateway

云函数 SCF 写完后，如果想要能通过网络 http(s) 请求直接访问，就要为其添加触发方式为 [**API 网关**](https://cloud.tencent.com/product/apigateway?from=10680)**触发器**。同时强烈建议将鉴权方法置为 **API 网关密钥对**。然后就会在 API Gateway 下自动创建出一个对应的 service API。这一步如果遇到权限问题无法自动创建 API 的话，也不要着急，可以直接在 API gateway 的控制台操作。

> 参考：[API 网关快速入门](https://cloud.tencent.com/document/product/628/41654?from=10680)。

创建 API 时注意将鉴权类型改成**密钥对**。下方有个**支持CORS**的选项，如果需要跨域访问就勾上，反之可以忽略。设置完需要接收的参数后，在下一步的**后端配置**中选后端类型为 **cloud function** 后，选中刚建好的云函数，就做好了这两者的关联。

建好 API 后，来到对应服务下的**管理 API** 标签就能看到刚建好的 API。在列表的右侧有**调试**入口，千万不要忘了点进去做下测试。测试完成后，再到服务页完成**发布**，这样 API 就可以被访问到了。

## 访问控制

然后，就来到了相当重要但也容易被忽略的访问控制这步。在前面我们已经选择了**密钥对**的方式作为鉴权类型。虽然有密钥泄露的风险，但对于小网站来说这个验证也是足够了，记得保存好密钥并定期修改就好。

之后的步骤就是创建密钥对，创建**使用计划**绑定密钥对，再把使用计划绑定服务或 API。下面直接甩出文档：[使用计划](https://cloud.tencent.com/document/product/628/11816?from=10680)。使用计划中除了可以绑定密钥对，还可以进行流量控制，可按需设置。

## 前端调用

配置完后端服务后，要解决的就是访问的问题了。由于没钱供服务器，用的是静态页面托管的方式建的站。前端直接 ajax 访问 API 来获取结果。参考文档在此：[密钥对认证](https://cloud.tencent.com/document/product/628/11819?from=10680)，[如何生成签名](https://cloud.tencent.com/document/product/628/42189?from=10680)（里面给出了用不同语言生成签名的例子）。

由于没写前端好多年，对前端的认知还停留在 js 和 jquery 阶段，这里只能给出改好的 jquery 写法。用的是 [crypto-js](https://github.com/brix/crypto-js) 加密。

```javascript
//<script src="https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.0.0/crypto-js.min.js"></script>

function getHeader(){
	var nowDate = new Date();
	var dateTime = nowDate.toGMTString();
	var SecretId = '****';
	var SecretKey = '****';
	var source = 'your_source';
	var auth = "hmac id=\"" + SecretId + "\", algorithm=\"hmac-sha1\", headers=\"x-date source\", signature=\"";
	var signStr = "x-date: " + dateTime + "\n" + "source: " + source;
	var sign = CryptoJS.HmacSHA1(signStr, SecretKey)
	sign = CryptoJS.enc.Base64.stringify(sign)
	sign = auth + sign + "\""
	var header = {"Source": source , "X-Date": dateTime , "Authorization":sign}
	return header
}

function getQ(){
	$.ajax({
		url: "https://xxxx/xx",
		type: "get",
		data:{
			"op_count" : 1,
			"op_type" : "+,-",
			"limit" : 100,
			"total" : 10
		},
		dataType: "json",
		crossDomain: true,
		headers: getHeader(),
		success: function (data) {
			if (data.errorCode < 0){
				//deal function error: data.errorMessage
				return
			}
			data= $.parseJSON(data);
			//show result in page
		},
		error: function(jqXHR, textStatus, errorThrown){
			//deal api error
		}
	})
}
```

如果在前面创建 API gateway 的 service 时候没有指定自定义域名，或是自定义域名和调用页面的域名不是同一个，就会涉及到**跨域**的问题。解决跨域问题传统的方法可以用 **jsonp**。但它没办法在 request 的 Header 里加参数，也就传不了鉴权所需的字段。所以这里只能用 **CORS** 来解决跨域：

对于服务端，只要前面建 API 的时候勾选了**支持 CORS** 选项，就会自动开启，参考 [API 控制台相关问题](https://cloud.tencent.com/document/product/628/11939?from=10680) 。对于客户端，在 ajax 参数中设置 `crossDomain: true` 就可以了。

## 完成

最后，解决一下页面上的 bug，测试通过后就大功告成了！给出演示地址：[演示](https://kiwijia.top/lab/calculator.html)，还加上了打印功能，不用再复制粘贴了😀

---

---
<div id='scf-deploy-iframe-or-md'></div>

---

> **传送门：**
> - GitHub: [github.com/serverless](https://github.com/serverless/serverless/blob/master/README_CN.md)
> - 官网：[serverless.com](https://serverless.com/)

欢迎访问：[Serverless 中文网](https://serverlesscloud.cn/)，您可以在 [最佳实践](https://serverlesscloud.cn/best-practice) 里体验更多关于 Serverless 应用的开发！
