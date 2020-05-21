---
title: 云函数 SCF 与对象存储实现 WordCount
description: 本文将通过 MapReduce 模型实现一个简单的 WordCount 算法，区别于传统使用 Hadoop 等大数据框架，本文使用的是对象存储 COS 与云函数 SCF 的结合
keywords: Serverless 多环境配置,Serverless 管理环境,Serverless配置方案
date: 2020-05-08
thumbnail: https://img.serverlesscloud.cn/2020511/1589207417923-ZalNtxgQAC_small.jpg
categories:
  - best-practice
authors:
  - Anycodes
authorslink:
  - https://zhuanlan.zhihu.com/ServerlessGo
tags:
  - serverless
  - wordcount
---

## 前言

MapReduce在百度百科中的解释如下：
	
> MapReduce是一种编程模型，用于大规模数据集（大于1TB）的并行运算。概念"Map（映射）"和"Reduce（归约）"，是它们的主要思想，都是从函数式编程语言里借来的，还有从矢量编程语言里借来的特性。它极大地方便了编程人员在不会分布式并行编程的情况下，将自己的程序运行在分布式系统上。 当前的软件实现是指定一个Map（映射）函数，用来把一组键值对映射成一组新的键值对，指定并发的Reduce（归约）函数，用来保证所有映射的键值对中的每一个共享相同的键组。
	
通过这段描述，可以明确MapReduce是面向大数据并行处理的计算模型、框架和平台，在传统学习中，通常会在Hadoop等分布式框架下进行MapReduce相关工作，随着云计算的逐渐发展，各个云厂商也都先后推出了在线的MapReduce业务。

本节，通过MapReduce模型实现一个简单的WordCount算法，区别于传统使用Hadoop等大数据框架，我们本节内容使用的是对象存储与云函数的结合。
	
## 理论基础
	
在开始之前，我们根据MapReduce的要求，我们绘制一个简单的流程图:

![](https://img.serverlesscloud.cn/202058/2-7-1.png)

在这个结构中，我们可以看到，我们需要2个云函数分别作Mapper和Reducer，以及3个对象存储的存储桶，分别作为输入的存储桶、中间临时缓存的存储桶以及结果存储桶。在实例前，我们现在广州区准备3个对象存储，因为我们函数即将部署在广州区，所以我们在广州区建立三个存储桶：

```text
对象存储1	ap-guangzhou	srcmr
对象存储2	ap-guangzhou	middlestagebucket
对象存储3	ap-guangzhou	destcmr
```

为了让整个Mapper和Reducer逻辑更加清晰，在开始之前先对传统的WordCount结构进行改造，使其更加适合云函数，同时合理分配
Mapper和Reducer的工作：

![](https://img.serverlesscloud.cn/202058/2-7-2.png)

## 功能实现

编写Mapper相关逻辑，Mapper相关逻辑代码如下：

```python
# -*- coding: utf8 -*-
import datetime
from qcloud_cos_v5 import CosConfig
from qcloud_cos_v5 import CosS3Client
from qcloud_cos_v5 import CosServiceError
import re
import os
import sys
import logging
logging.basicConfig(level=logging.INFO, stream=sys.stdout)
logger = logging.getLogger()
logger.setLevel(level=logging.INFO)
region = u'ap-guangzhou'  # 根据实际情况，修改地域
middle_stage_bucket = 'middlestagebucket'  # 根据实际情况，修改bucket名
def delete_file_folder(src):
    if os.path.isfile(src):
        try:
            os.remove(src)
        except:
            pass
    elif os.path.isdir(src):
        for item in os.listdir(src):
            itemsrc = os.path.join(src, item)
            delete_file_folder(itemsrc)
        try:
            os.rmdir(src)
        except:
            pass
def download_file(cos_client, bucket, key, download_path):
    logger.info("Get from [%s] to download file [%s]" % (bucket, key))
    try:
        response = cos_client.get_object(Bucket=bucket, Key=key, )
        response['Body'].get_stream_to_file(download_path)
    except CosServiceError as e:
        print(e.get_error_code())
        print(e.get_error_msg())
        return -1
    return 0
def upload_file(cos_client, bucket, key, local_file_path):
    logger.info("Start to upload file to cos")
    try:
        response = cos_client.put_object_from_local_file(
            Bucket=bucket,
            LocalFilePath=local_file_path,
            Key='{}'.format(key))
    except CosServiceError as e:
        print(e.get_error_code())
        print(e.get_error_msg())
        return -1
    logger.info("Upload data map file [%s] Success" % key)
    return 0
def do_mapping(cos_client, bucket, key, middle_stage_bucket, middle_file_key):
    src_file_path = u'/tmp/' + key.split('/')[-1]
    middle_file_path = u'/tmp/' + u'mapped_' + key.split('/')[-1]
    download_ret = download_file(cos_client, bucket, key, src_file_path)  # download src file
    if download_ret == 0:
        inputfile = open(src_file_path, 'r')  # open local /tmp file
        mapfile = open(middle_file_path, 'w')  # open a new file write stream
        for line in inputfile:
            line = re.sub('[^a-zA-Z0-9]', ' ', line)  # replace non-alphabetic/number characters
            words = line.split()
            for word in words:
                mapfile.write('%s\t%s' % (word, 1))  # count for 1
                mapfile.write('\n')
        inputfile.close()
        mapfile.close()
        upload_ret = upload_file(cos_client, middle_stage_bucket, middle_file_key,
                                 middle_file_path)  # upload the file's each word
        delete_file_folder(src_file_path)
        delete_file_folder(middle_file_path)
        return upload_ret
    else:
        return -1
def map_caller(event, context, cos_client):
    appid = event['Records'][0]['cos']['cosBucket']['appid']
    bucket = event['Records'][0]['cos']['cosBucket']['name'] + '-' + appid
    key = event['Records'][0]['cos']['cosObject']['key']
    key = key.replace('/' + str(appid) + '/' + event['Records'][0]['cos']['cosBucket']['name'] + '/', '', 1)
    logger.info("Key is " + key)
    middle_bucket = middle_stage_bucket + '-' + appid
    middle_file_key = '/' + 'middle_' + key.split('/')[-1]
    return do_mapping(cos_client, bucket, key, middle_bucket, middle_file_key)
def main_handler(event, context):
    logger.info("start main handler")
    if "Records" not in event.keys():
        return {"errorMsg": "event is not come from cos"}
    secret_id = "" 
    secret_key = ""  
    config = CosConfig(Region=region, SecretId=secret_id, SecretKey=secret_key, )
    cos_client = CosS3Client(config)
    start_time = datetime.datetime.now()
    res = map_caller(event, context, cos_client)
    end_time = datetime.datetime.now()
    print("data mapping duration: " + str((end_time - start_time).microseconds / 1000) + "ms")
    if res == 0:
        return "Data mapping SUCCESS"
    else:
        return "Data mapping FAILED"

```

同样的方法，建立reducer.py文件，编写Reducer逻辑，代码如下：

```python
# -*- coding: utf8 -*-
from qcloud_cos_v5 import CosConfig
from qcloud_cos_v5 import CosS3Client
from qcloud_cos_v5 import CosServiceError
from operator import itemgetter
import os
import sys
import datetime
import logging
region = u'ap-guangzhou'  # 根据实际情况，修改地域
result_bucket = u'destmr'  # 根据实际情况，修改bucket名
logging.basicConfig(level=logging.INFO, stream=sys.stdout)
logger = logging.getLogger()
logger.setLevel(level=logging.INFO)
def delete_file_folder(src):
    if os.path.isfile(src):
        try:
            os.remove(src)
        except:
            pass
    elif os.path.isdir(src):
        for item in os.listdir(src):
            itemsrc = os.path.join(src, item)
            delete_file_folder(itemsrc)
        try:
            os.rmdir(src)
        except:
            pass
def download_file(cos_client, bucket, key, download_path):
    logger.info("Get from [%s] to download file [%s]" % (bucket, key))
    try:
        response = cos_client.get_object(Bucket=bucket, Key=key, )
        response['Body'].get_stream_to_file(download_path)
    except CosServiceError as e:
        print(e.get_error_code())
        print(e.get_error_msg())
        return -1
    return 0
def upload_file(cos_client, bucket, key, local_file_path):
    logger.info("Start to upload file to cos")
    try:
        response = cos_client.put_object_from_local_file(
            Bucket=bucket,
            LocalFilePath=local_file_path,
            Key='{}'.format(key))
    except CosServiceError as e:
        print(e.get_error_code())
        print(e.get_error_msg())
        return -1
    logger.info("Upload data map file [%s] Success" % key)
    return 0
def qcloud_reducer(cos_client, bucket, key, result_bucket, result_key):
    word2count = {}
    src_file_path = u'/tmp/' + key.split('/')[-1]
    result_file_path = u'/tmp/' + u'result_' + key.split('/')[-1]
    download_ret = download_file(cos_client, bucket, key, src_file_path)
    if download_ret == 0:
        map_file = open(src_file_path, 'r')
        result_file = open(result_file_path, 'w')
        for line in map_file:
            line = line.strip()
            word, count = line.split('\t', 1)
            try:
                count = int(count)
                word2count[word] = word2count.get(word, 0) + count
            except ValueError:
                logger.error("error value: %s, current line: %s" % (ValueError, line))
                continue
        map_file.close()
        delete_file_folder(src_file_path)
    sorted_word2count = sorted(word2count.items(), key=itemgetter(1))[::-1]
    for wordcount in sorted_word2count:
        res = '%s\t%s' % (wordcount[0], wordcount[1])
        result_file.write(res)
        result_file.write('\n')
    result_file.close()
    upload_ret = upload_file(cos_client, result_bucket, result_key, result_file_path)
    delete_file_folder(result_file_path)
    return upload_ret
def reduce_caller(event, context, cos_client):
    appid = event['Records'][0]['cos']['cosBucket']['appid']
    bucket = event['Records'][0]['cos']['cosBucket']['name'] + '-' + appid
    key = event['Records'][0]['cos']['cosObject']['key']
    key = key.replace('/' + str(appid) + '/' + event['Records'][0]['cos']['cosBucket']['name'] + '/', '', 1)
    logger.info("Key is " + key)
    res_bucket = result_bucket + '-' + appid
    result_key = '/' + 'result_' + key.split('/')[-1]
    return qcloud_reducer(cos_client, bucket, key, res_bucket, result_key)
def main_handler(event, context):
    logger.info("start main handler")
    if "Records" not in event.keys():
        return {"errorMsg": "event is not come from cos"}
    secret_id = "SecretId" 
    secret_key = "SecretKey"  
    config = CosConfig(Region=region, SecretId=secret_id, SecretKey=secret_key, )
    cos_client = CosS3Client(config)
    start_time = datetime.datetime.now()
    res = reduce_caller(event, context, cos_client)
    end_time = datetime.datetime.now()
    print("data reducing duration: " + str((end_time - start_time).microseconds / 1000) + "ms")
    if res == 0:
        return "Data reducing SUCCESS"
    else:
        return "Data reducing FAILED"

```

## 部署与测试

通过`Serverless Framework`的`yaml`规范，编写`serveerless.yaml`:

```yaml
WordCountMapper:
  component: "@serverless/tencent-scf"
  inputs:
    name: mapper
    codeUri: ./code
    handler: index.main_handler
    runtime: Python3.6
    region: ap-guangzhou
    description: 网站监控
    memorySize: 64
    timeout: 20
    events:
      - cos:
          name: srcmr-1256773370.cos.ap-guangzhou.myqcloud.com
          parameters:
            bucket: srcmr-1256773370.cos.ap-guangzhou.myqcloud.com
            filter:
              prefix: ''
              suffix: ''
            events: cos:ObjectCreated:*
            enable: true

WordCountReducer:
  component: "@serverless/tencent-scf"
  inputs:
    name: reducer
    codeUri: ./code
    handler: index.main_handler
    runtime: Python3.6
    region: ap-guangzhou
    description: 网站监控
    memorySize: 64
    timeout: 20
    events:
      - cos:
          name: middlestagebucket-1256773370.cos.ap-guangzhou.myqcloud.com
          parameters:
            bucket: middlestagebucket-1256773370.cos.ap-guangzhou.myqcloud.com
            filter:
              prefix: ''
              suffix: ''
            events: cos:ObjectCreated:*
            enable: true
```

完成之后，通过`sls --debug`指令进行部署，部署成功之后，进行基本的测试：

1. 此时，我们准备一个英文文档:
![](https://img.serverlesscloud.cn/202058/2-7-3.png)
2. 登录腾讯云后台，打开我们最初建立的存储桶：srcmr，并上传该文件;
3. 传成功之后，我们稍等片刻，可以看到我们的Reducer程序已经在Mapper执行之后，产出日志:
![](https://img.serverlesscloud.cn/202058/2-7-4.png)
此时，我们打开结果存储桶，查看结果:
![](https://img.serverlesscloud.cn/202058/2-7-5.png)

至此，可以看到，我们完成了简单的词频统计功能。

## 总结

其实Serverless架构相对来说比较容易做大数据处理的，在腾讯云官网，我们也是可以看到其应用场景中就有数据ETL处理的描述：

一些数据处理系统中，常常需要周期性/计划性地处理庞大的数据量。例如：证券公司每12小时统计一次该时段的交易情况并整理出该时段交易量 top 5，每天处理一遍秒杀网站的交易流日志获取因售罄而导致的错误从而分析商品热度和趋势等。云函数近乎无限扩容的能力可以使您轻松地进行大容量数据的计算。我们利用云函数可以对源数据并发执行多个 mapper 和 reducer 函数，在短时间内完成工作；相比传统的工作方式，使用云函数更能避免资源的闲置浪费从而节省资金。

通过本实例，希望读者可以对Serverless架构的应用场景有更多的启发，不仅仅在监控告警方面有着很好的表现，在大数据领域，也是不甘落后的。本实例，除了在使用SCFCLI工具时相对前两节来说，增加了一件部署多个函数的操作，我们在实际生产中，每个项目都不会是单个函数单打独斗的，而是多个函数组合应用，形成一个Service体系，所以一键部署多个函数就显得尤为重要。希望通过该应用场景，读者们可以对Serverless架构有更深入的了解，并且可以有所启发，将云函数和不同触发器进行组合，应用在更多的领域以及业务中。

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
