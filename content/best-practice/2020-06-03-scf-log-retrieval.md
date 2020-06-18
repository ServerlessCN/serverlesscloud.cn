---
title: 腾讯云云函数 SCF 日志检索最佳实践
description: 借助云函数监控日志快速发现并定位问题
keywords: Serverless,scf,Serverless Framework
date: 2020-06-03
thumbnail: https://img.serverlesscloud.cn/202063/1591174404685-%E4%BA%91%E5%87%BD%E6%95%B0%E6%97%A5%E5%BF%97%E6%A3%80%E7%B4%A2.jpg
categories:
  - best-practice
authors:
  - 李婷
tags:
  - 云函数
  - 日志检索
---

开发者在云函数的开发调试、在线运维过程中，难免会遇到函数调用失败需要定位问题的情况，通常我们使用日志作为主要排障手段。

在云函数控制台中，我们可以看到包含函数调用状态的日志列表，直接筛选可过滤查看所有调用失败的日志。

如果我们能够从网关返回信息中拿到某个失败请求的 RequestId ，我们还可以根据 RequestId 检索指定请求的日志。

![](https://img.serverlesscloud.cn/202063/1591168127983-6.jpg)

这是最基础的日志检索使用方法。

**实际定位问题的过程中，有可能出现以下几种场景：**

- 函数里的部分异常有进行捕获，但函数的调用状态依然是成功，此时怎么找到已捕获的异常？
- 函数错误调用非常多，我只想查看某些指定模块的日志信息怎么办？
- 收到告警提示我函数运行时间超过 x 秒，我如何迅速找到指定运行时长范围的调用日志？
- 我要查看的业务日志包含多个不同的关键词，想要一次性找到多个关键词所在的日志怎么办？

针对以上场景，我们可以利用「高级日志」功能解决上述全部问题。


## 高级日志如何使用

下面给大家分享一下`已捕获的异常`，`查找函数运行时间大于 x 的请求`，`关键词组合检索`中如何使用高级日志。

### 1. 已捕获的异常

云函数比较多的使用场景是和 API 网关组合使用实现 REST API ，以下我们结合一个实际的业务场景说明如何使用高级日志。

以下模拟一个 HTTP PUT 请求实现教师录入学生信息的功能。

```python
def teacher_put():
    print('insert info')
    try:
        fh = open("/tmp/testfile", "w")
        fh.write("students info xxxx")
    except IOError:
        print("Error: cannot find the file or open file failed")
    else:
        print("write info success")
        fh.close()
        return('teacher_put success')


def main_handler(event, context):
    print(str(event))
    if event["pathParameters"]["user_type"] == "teacher":
        if event["pathParameters"]["action"] == "get":
            return teacher_get()
        if event["pathParameters"]["action"] == "put":
            return teacher_put()
```

由于上面写文件时的 IO 异常已被捕获，所以当找不到文件时，函数调用结果依然为成功，API 请求返回 null 。如果使用普通调用日志功能，需要逐条查看日志，这将会非常麻烦。

我们在代码捕获异常时有打印 Error 信息，在高级日志里可以直接检索该关键词：

![](https://img.serverlesscloud.cn/202063/1591168216248-2.png)

如果想查看包含该请求的完整日志，则点击该条日志的 RequestId 即可：

![](https://img.serverlesscloud.cn/202063/1591168129971-6.jpg)

上面讲述了如何查找已被捕获的异常，直接检索捕获时打印的关键词即可, 日志输出方法没有特殊要求，使用运行时原生日志即可。

### 2. 查找函数运行时间大于 x 的请求

如果我们收到告警或通过监控图表查看到某个函数的运行时间异常，如何迅速找到这些日志呢？

高级日志里提供了运行时间检索的方法，比如我们想查找运行时间大于 150ms 的日志，我们可以在检索框输入 `SCF_Duration>150`，即可找出该时间范围的日志。

![](https://img.serverlesscloud.cn/202063/1591168129314-6.jpg)

时间范围和关键词检索可组合使用，在上述示例中会将所有日志都过滤出来。

如果我们只想查看有多少请求的运行时间是大于 150 ms ，我们可以组合关键词过滤 `SCF_Duration>150 and "Report RequestId"` 进行检索：

![](https://img.serverlesscloud.cn/202063/1591168128785-6.jpg)

上述表达式的意思是，过滤运行时间大于 150 ms 且 包含 Report RequestId 关键词的日志。Report RequestId这一行是函数每次请求结束后系统打印的语句，所以可以用它来达到筛选唯一请求日志的作用。

如果想过滤出 `150<运行时间≤300` 的日志，则可以使用 `SCF_Duration in (150 300]`。

### 3. 关键词组合检索

如果我们想同时检索多个关键词，比如 `error`，`userid`，`region`我们可以使用 `and` 或者 `or` 连接这些关键词。

如想要过滤出同时包含这些关键词的日志，则可以使用 `error and userid and region` 。

如想要过滤出包含任一关键词的日志，则可以使用 `error or userid or region`。

高级日志服务提供了丰富的检索语法，可参考[日志检索语法教程](https://cloud.tencent.com/document/product/583/40964)



---
<div id='scf-deploy-iframe-or-md'></div>

---

> **传送门：**
> - GitHub: [github.com/serverless](https://github.com/serverless/serverless/blob/master/README_CN.md)
> - 官网：[serverless.com](https://serverless.com/)

欢迎访问：[Serverless 中文网](https://serverlesscloud.cn/)，您可以在 [最佳实践](https://serverlesscloud.cn/best-practice) 里体验更多关于 Serverless 应用的开发！
