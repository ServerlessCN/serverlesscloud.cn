---
title: Serverless 的内存配置与超时时间
description: 当我们使用 Serverless 架构的时候，如何设置运行内存和超时时间呢？
keywords: Serverless 内存配置,Serverless 超时时间,Serverless 统计方案
date: 2020-02-22
thumbnail: https://img.serverlesscloud.cn/202033/1583244278485-0.jpg
categories:
  - guides-and-tutorials
authors:
  - Anycodes
authorslink:
  - https://www.zhihu.com/people/liuyu-43-97
tags:
  - serverless
  - 内存配置
---

在上一篇文章[《Serverless 的资源评估与成本探索》](https://serverlesscloud.cn/blog/2019-12-10-resource-cost/)中，我们对性能和成本探索进行了些思考，在此就引出一个新的问题：当我们使用 Serverless 架构的时候，如何设置运行内存和超时时间呢？这里分享下我的评估方法供大家参考。

首先在函数上线时，选择一个稍微大一点的内存。例如，这里执行一次函数，得到下图结果：

![](https://img.serverlesscloud.cn/202033/1583244075920-1.png)

那么将我的函数设置为 128M 或者 256M，超时时间设置成 3S。

让函数跑一段时间，例如该接口每天触发约为 4000 次：

![](https://img.serverlesscloud.cn/202033/1583244075839-1.png)

将这个函数的日志捞出来写成脚本，做统计：

```
    import json, time, numpy, base64
    import matplotlib.pyplot as plt
    from matplotlib import font_manager
    from tencentcloud.common import credential
    from tencentcloud.common.profile.client_profile import ClientProfile
    from tencentcloud.common.profile.http_profile import HttpProfile
    from tencentcloud.common.exception.tencent_cloud_sdk_exception import TencentCloudSDKException
    from tencentcloud.scf.v20180416 import scf_client, models
    
    secretId = ""
    secretKey = ""
    region = "ap-guangzhou"
    namespace = "default"
    functionName = "course"
    
    font = font_manager.FontProperties(fname="./fdbsjw.ttf")
    
    try:
        cred = credential.Credential(secretId, secretKey)
        httpProfile = HttpProfile()
        httpProfile.endpoint = "scf.tencentcloudapi.com"
    
        clientProfile = ClientProfile()
        clientProfile.httpProfile = httpProfile
        client = scf_client.ScfClient(cred, region, clientProfile)
    
        req = models.GetFunctionLogsRequest()
    
        strTimeNow = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime(int(time.time())))
        strTimeLast = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime(int(time.time()) - 86400))
        params = {
            "FunctionName": functionName,
            "Limit": 500,
            "StartTime": strTimeLast,
            "EndTime": strTimeNow,
            "Namespace": namespace
        }
        req.from_json_string(json.dumps(params))
    
        resp = client.GetFunctionLogs(req)
    
        durationList = []
        memUsageList = []
    
        for eveItem in json.loads(resp.to_json_string())["Data"]:
            durationList.append(eveItem['Duration'])
            memUsageList.append(eveItem['MemUsage'] / 1024 / 1024)
    
        durationDict = {
            "min": min(durationList),  # 运行最小时间
            "max": max(durationList),  # 运行最大时间
            "mean": numpy.mean(durationList)  # 运行平均时间
        }
        memUsageDict = {
            "min": min(memUsageList),  # 内存最小使用
            "max": max(memUsageList),  # 内存最大使用
            "mean": numpy.mean(memUsageList)  # 内存平均使用
        }
    
        plt.figure(figsize=(10, 15))
        plt.subplot(4, 1, 1)
        plt.title('运行次数与运行时间图', fontproperties=font)
        x_data = range(0, len(durationList))
        plt.plot(x_data, durationList)
        plt.subplot(4, 1, 2)
        plt.title('运行时间直方分布图', fontproperties=font)
        plt.hist(durationList, bins=20)
        plt.subplot(4, 1, 3)
        plt.title('运行次数与内存使用图', fontproperties=font)
        x_data = range(0, len(memUsageList))
        plt.plot(x_data, memUsageList)
        plt.subplot(4, 1, 4)
        plt.title('内存使用直方分布图', fontproperties=font)
        plt.hist(memUsageList, bins=20)


​        with open("/tmp/result.png", "rb") as f:
​            base64_data = base64.b64encode(f.read())
​    

        print("-" * 10 + "运行时间相关数据" + "-" * 10)
        print("运行最小时间:\t", durationDict["min"], "ms")
        print("运行最大时间:\t", durationDict["max"], "ms")
        print("运行平均时间:\t", durationDict["mean"], "ms")
    
        print("\n")
    
        print("-" * 10 + "内存使用相关数据" + "-" * 10)
        print("内存最小使用:\t", memUsageDict["min"], "MB")
        print("内存最大使用:\t", memUsageDict["max"], "MB")
        print("内存平均使用:\t", memUsageDict["mean"], "MB")
    
        print("\n")
    
        plt.show(dpi=200)
​    except TencentCloudSDKException as err:
​        print(err)
```

运行结果：

```
    ----------运行时间相关数据----------
    运行最小时间:	 6.02 ms
    运行最大时间:	 211.22 ms
    运行平均时间:	 54.79572 ms
​    
    ----------内存使用相关数据----------
    内存最小使用:	 17.94921875 MB
    内存最大使用:	 37.21875190734863 MB
    内存平均使用:	 24.83201559448242 MB
```

![](https://img.serverlesscloud.cn/202033/1583244075858-1.png)

通过该结果可以清楚看出，近 500 次，每次函数的时间消耗和内存使用。

可以看到时间消耗基本在 1S 以下，所以此处「超时时间」设置成 1S 比较合理；而内存使用基本是 64M 以下，所以此时内存设置成 64M 就可以。

再举个例子，对于另外一个函数：

```
    ----------运行时间相关数据----------
    运行最小时间:	 63445.13 ms
    运行最大时间:	 442629.12 ms
    运行平均时间:	 91032.31301886792 ms

​    
​    ----------内存使用相关数据----------
​    内存最小使用:	 26.875 MB
​    内存最大使用:	 58.69140625 MB
​    内存平均使用:	 36.270415755937684 MB
```

![](https://img.serverlesscloud.cn/202033/1583244076054-1.png)

假如说上一个函数，是一个非常平稳和光滑的函数，很容易预估资源使用率，那么这个函数则可以很明显看出波动。

运行时间绝大部分在 150S 以下，部分不到 200S，最高峰值近 450S。这个时候，我们就可以业务需求来判定，450S 的请求波峰是否可以被中止。此时，我推荐将这个函数的超时时间设置为 200S。

至于内存部分，可以看到绝大部分都在 40MB 以内，部分出现在 45-55MB，最高未超过 60MB，所以此时可以将函数设置为 64MB。

就目前来说，云函数在执行时可能会有一定的波动。因此内存使用或超时时间在范围内波动是很正常的，我们可以根据业务需求来做一些设置，将资源使用量压到最低，节约成本。

**我的做法基本就是分为两步走：**

1. 简单运行两次，评估一下基础资源使用量，然后设置一个较高的值；
2. 函数运行一段时间后，获取样本，再进行基本的数据分析和数据可视化，优化得到一个相对稳定的新数值。

> **传送门：**
> - GitHub: [github.com/serverless](https://github.com/serverless/serverless/blob/master/README_CN.md) 
> - 官网：[serverless.com](https://serverless.com/)

欢迎访问：[Serverless 中文网](https://serverlesscloud.cn/)，您可以在 [最佳实践](https://serverlesscloud.cn/best-practice) 里体验更多关于 Serverless 应用的开发！
