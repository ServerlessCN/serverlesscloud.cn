---
title: 突破传统 OJ 瓶颈，「判题姬」接入云函数
description: 通过 Serverless 实现在线编程
keywords: Serverless 在线编程,Serverless OJ
date: 2019-09-16
thumbnail: https://img.serverlesscloud.cn/2020114/1578989800047-part-00492-780.jpg
categories:
  - guides-and-tutorials
  - user-stories
authors:
  - Anycodes
authorslink:
  - https://www.zhihu.com/people/liuyu-43-97
tags:
  - 在线编程
  - 云函数
---

> Online Judge 系统（简称 OJ）是一个在线的判题系统。用户可以在线提交多种程序（如C、C++、Pascal）源代码，系统对源代码进行编译和执行，并通过预先设计的测试数据来检验程序源代码的正确性。


随着时代的发展，OJ 已经真正地成为了测评工具，其作用不再局限为 ACM 备战，还有老师检测学生能力、学生入学考试、能力评测（例如 ZJU 的 PAT）、找工作刷题和面试（例如牛客）等，而目前 OJ 的开源框架也越来越多，但是很多 OJ 都是基于 HUSTOJ 进行定制或者二次开发。

**无论是什么方法，在关于 OJ 的众多问题中，有一个就是：性能问题。**

说实话，一些 OJ 群里，总会有人问：1 核 1G 的机器，可以同时判多少题目？可以有多少人同时用？如果比赛，大约有多少人需要多高性能的机器？那么『判题姬』是否只能存在传统的宿主机中，能否通过其他方式焕发新的生命力？

**其中一种方法，就是和现有的云函数进行结合。**


## ▎简单思路

通过云函数实现在线编程的思路基本有两个：

1. 每个用户的代码建立一个函数，用后删除；
2. 每个语言建立一个函数，用户传递代码，每次执行；

这两种方法，第一种相对简单的，但是目前对于很多云函数服务商来说，函数数量有一定限制，而且每次执行这个操作相对比较繁琐。

所以，本文采用第二种策略，建立一个函数，每次执行，用户传入代码，系统执行，返回结果。

代码写入系统：

```
def WriteCode(code):
    try:
        with open("/tmp/mytest.py", "w") as f:
            f.write(code)
        return True
    except Exception as e:
        print(e)
        return False
```

执行代码：

```
def RunCode(input_data=None):
    child = subprocess.Popen("python /tmp/mytest.py", stdin=input_data, stdout=subprocess.PIPE, stderr=subprocess.PIPE, close_fds=True, shell=True)
    error = child.stderr.read()
    output = child.stdout.read()
    return error, output
```

代码和用例处理逻辑：

```
def main_handler(event, context):
    if WriteCode(event["code"]):
        try:
            temp_list = []
            for eve in event["input"]:
                result = RunCode()
                temp_list.append({"error":result[0].decode("utf-8"),"result": result[1].decode("utf-8"), "exception":""})
            return json.dumps(temp_list)
        except Exception as e:
            return json.dumps({"error":"","result": "", "exception":str(e)})
```

用户在传入数据的时候，需要注意事件为：

```
{
  "code": "print('hello')",
  "input": ["111","22222"]
}
```

这样就可以每次请求的时候把代码传入（code），每个测试用例的 input 就是 input 内容。

**以本题输出结果：**

![输出结果](https://img.serverlesscloud.cn/2020114/1578989799994-part-00492-780.jpg)

这样就实现了 Python 判题机的基本功能，此时通过 [腾讯云云 API ](https://cloud.tencent.com/document/api/583/17243?from=9253)实现参数传入，通过 [Explorer](https://console.cloud.tencent.com/api/explorer?Product=scf&Version=2018-04-16&Action=Invoke&SignVersion=) 进行代码撰写，直接接入自己的 OJ 就可以了。

## ▎额外的话

虽然这是一个简单的代码执行工具，但是这个小工具还可以应用在很多其他地方。本文只是抛砖引玉，例如我们做了一个 OJ，如果在本地跑代码可能性能和安全性都会受到挑战，那么此时，放入腾讯云云函数中，就会简单、安全、便捷得多，最主要的是腾讯云的函数调用免费额度很高。

此外，如果临时举办比赛，也不用费心费力扩容缩容，只要有云函数，后端的主要压力，都传给 Serverless 搞定，这也算是发挥了云函数的一个优势和特性。

那么，除了在 OJ 中使用的用途，它还有啥用？简单举两个例子：

1. [Anycodes](https://www.anycodes.cn)、[Codepad](http://codepad.org) 这些在线编程网站，之前很多人就问是如何实现的。试想一下，通过这个策略，是不是很好实现了在线编程？确切说，只需要一个前端，就可以实现在线写代码的一个网页。
2. 菜鸟教程这些网站，可以看代码然后点击运行，很炫酷的功能，很多小伙伴也想往自己博客增加一个类似的功能，也可以基于这个方法来实现。

除此之外，还有好多的用途，各位小伙伴们，快来自己挖掘吧！

> **传送门：**
> - GitHub: [github.com/serverless](https://github.com/serverless/serverless/blob/master/README_CN.md) 
> - 官网：[serverless.com](https://serverless.com/)

欢迎访问：[Serverless 中文网](https://serverlesscloud.cn/)，您可以在 [最佳实践](https://serverlesscloud.cn/best-practice) 里体验更多关于 Serverless 应用的开发！
