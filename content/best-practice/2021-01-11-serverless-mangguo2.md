---
title: Serverless 音视频转码 —— 芒果 TV 落地实践（下）
description: 实现音视频转码服务的详细操作步骤，两种方案任你选！
date: 2021-01-11
thumbnail: https://main.qcloudimg.com/raw/0693730f68cc5d3b3a9398bb02b863dc.jpg
categories:
  - best-practice
authors:
  - susu
tags:
  - Serverless
  - 转码
---

在 [《Serverless 音视频转码——芒果 TV 落地实践（上）》](https://serverlesscloud.cn/best-practice/2021-01-08-serverless-mangguo)中，我们回顾了芒果 TV 吴坚强老师在 techo 大会的精彩分享，芒果TV 音视频编解码业务团队通过使用腾讯云 Serverless 音视频转码服务，成本降低 45% 以上，引起大家的广泛关注，小伙伴们都跃跃欲试！

本文我们将带领大家一起使用云函数 + COS + CLS + FFmpeg 构建高可用、并行处理、实时日志、高度自定义的视频转码服务。我们在此提供了两种方案，您可以直接用转码应用，一键部署，也可以通过
用函数的长运行方案来自己处理。

## 实现方案

**方案一：** 使用官网的流式音视频转码，一键部署。查看[详情](https://cloud.tencent.com/document/product/583/51451)

**方案二：** 利用云函数的异步执行机制，自主研发。查看[详情](https://cloud.tencent.com/document/product/583/51519)

## 流式音视频转码方案

通过云函数创建 FFmpeg 任务进程，云函数进程与 FFmpeg 任务进程通过 pipe 和 FIFO 的方式进行数据传输。云函数进程中的两个任务线程分别接收 FFmpeg 任务进程向函数进程输出的 FFmpeg 日志流与转码后的文件流，从而实现流式读写 COS 和实时日志输出的转码应用场景。

![](https://main.qcloudimg.com/raw/749ac11a39c98a1ffbf5bb6d4b758e5a.svg)

## 方案优势

- **流式转码**
  采用流式拉取源视频文件，流式上传转码文件的工作方式，突破了本地存储的限制，且不需要额外部署 CFS 等产品。
- **实时日志**
  视频转码过程中，可通过 CLS 日志实时查看转码进度。同时支持输出 FFmpeg 应用的完整日志。
- **长时运行**
  利用云函数的长时运行机制，支持 12h-24h 的运行时长，可覆盖大文件耗时较长的转码场景。
- **自定义参数**
  支持用户自定义配置 FFmpeg 命令参数。

**前提条件**

1. 安装 [Serverlesss Framework](https://cloud.tencent.com/document/product/1154/42990)。
2. 函数长时运行 [白名单申请](https://cloud.tencent.com/apply/p/hz85krvp8s8)。
3. 配置部署账号权限。参考 [账号和权限配置](https://cloud.tencent.com/document/product/1154/43006) 
4. 配置 [运行角色](https://cloud.tencent.com/document/product/583/51451#.E8.BF.90.E8.A1.8C.E8.A7.92.E8.89.B2.3Ca-id.3D.22role.22.3E.3C.2Fa.3E) 权限。

## 操作步骤

### 1. 下载转码应用

```
sls init transcode-app
```

进入项目目录 `transcode-app`，将看到目录结构如下：

```
transcode-app
|- .env  #环境配置
|- serverless.yml # 应用配置
|- log/ #log 日志配置
|  └── serverless.yml
└──transcode/  #转码函数配置
       |- src/
       |   |- ffmpeg   #转码 FFmpeg 工具
       |   └── index.py
       └── serverless.yml
```

 - `log/serverless.yml` 定义一个 CLS 日志集和主题，用于转码过程输出的日志保存，目前采用腾讯云 CLS 日志存储。每个转码应用将会根据配置的 CLS 日志集和主题去创建相关资源，CLS 的使用会产生计费，具体参考 [CLS 计费规则](https://cloud.tencent.com/document/product/614/47116)。
 - `transcode/serverless.yml` 定义函数的基础配置及转码参数配置。
 - `transcode/src/index.py` 转码功能实现。
 - `transcode/src/ffmpeg` 转码工具 FFmpeg。

### 2. 配置环境变量和应用参数

- 应用参数，文件 `transcode-app/serverless.yml`

```
#应用信息
app: transcodeApp # 您需要配置成您的应用名称
stage: dev # 环境名称，默认为 dev
```

- 环境变量，文件`transcode-app/.env`

```
REGION=ap-shanghai  # 应用创建所在区，目前只支持上海区
TENCENT_SECRET_ID=xxxxxxxxxxxx # 您的腾讯云sercretId
TENCENT_SECRET_KEY=xxxxxxxxxxxx # 您的腾讯云sercretKey
```
> 说明：
>- 您可以登录腾讯云控制台，可以在 [API 密钥管理](https://console.cloud.tencent.com/cam/capi) 中获取 SecretId 和 SecretKey。
>- 如果您的账号为主账号，或者子账号具有扫码权限，也可以不配置 SercretId 与 SercretKey，直接扫码部署应用。更多详情参考 [账号和权限配置](https://cloud.tencent.com/document/product/1154/43006)。

### 3. 配置转码需要的参数信息

- CLS 日志定义，文件`transcode-app/log/serverless.yml`

  ```
  #组件信息
  component: cls # 引用 component 的名称
  name: cls-video # 创建的实例名称，请修改成您的实例名称
  
  #组件参数
  inputs:
    name: cls-log  # 您需要配置一个name，作为您的cls日志集名称
    topic: video-log # 您需要配置一个topic，作为您的cls日志主题名称
    region: ${env:REGION} # 区域，统一在环境变量中定义
    period: 7 # 日志保存时间，单位天
  ```

- 云函数及转码配置，文件`transcode-app/transcode/serverless.yml` 

  ```
  #组件信息
  component: scf # 引用 component 的名称
  name: transcode-video # 创建的实例名称，请修改成您的实例名称
  
  #组件参数
  inputs:
    name: transcode-video-${app}-${stage}
    src: ./src
    handler: index.main_handler 
    role: transcodeRole # 函数执行角色，已授予cos对应桶全读写权限
    runtime: Python3.6 
    memorySize: 3072 # 内存大小，单位MB
    timeout: 43200 # 函数执行超时时间, 单位秒, 即本demo目前最大支持12h运行时长
    region: ${env:REGION} # 函数区域，统一在环境变量中定义
    asyncRunEnable: true # 开启长时运行，目前只支持上海区
    cls: # 函数日志
      logsetId: ${output:${stage}:${app}:cls-video.logsetId}  # cls日志集  cls-video为cls组件的实例名称
      topicId: ${output:${stage}:${app}:cls-video.topicId}  # cls日志主题
    environment: 
      variables:  # 转码参数
        REGION: ${env:REGION} # 输出桶区域
        DST_BUCKET: test-123456789 # 输出桶名称
        DST_PATH: video/outputs/ # 输出桶路径
        DST_FORMATS: avi # 转码生成格式
        FFMPEG_CMD: ffmpeg -i {inputs} -y -f {dst_format} {outputs}  # 转码基础命令，您可自定义配置，但必须包含ffmpeg配置参数和格式化部分，否则会造成转码任务失败。
        FFMPEG_DEBUG: 0 # 是否输出ffmpeg日志 0为不输出 1为输出
        TZ: Aisa/Shanghai # cls日志输出时间的时区
    events:
      - cos: # cos触发器    	
          parameters:          
            bucket: test-123456789.cos.ap-shanghai.myqcloud.com  # 输入文件桶
            filter:
              prefix: video/inputs/  # 桶内路径
            events: 'cos:ObjectCreated:*'  # 触发事件
            enable: true
  ```

>- 输出桶与函数建议配置在同一区域，跨区域配置应用稳定性及效率都会降低，并且会产生跨区流量费用。
>- 内存大小上限为3072MB，运行时长上限为43200s。如需调整，请 [提交工单](https://console.cloud.tencent.com/workorder/category?level1_id=6&level2_id=668&source=0&data_title=%E6%97%A0%E6%9C%8D%E5%8A%A1%E5%99%A8%E4%BA%91%E5%87%BD%E6%95%B0%20SCF&step=1) 申请配额调整。
>- 转码应用必须开启函数长时运行 asyncRunEnable: true。
>- 运行角色请根据 [运行角色](https://cloud.tencent.com/document/product/583/51451#.E8.BF.90.E8.A1.8C.E8.A7.92.E8.89.B2.3Ca-id.3D.22role.22.3E.3C.2Fa.3E) 创建并授权。
>- 示例配置的 FFmpeg 指令仅适用于 AVI 转码场景，详细介绍参考 [FFmpeg 指令](https://cloud.tencent.com/document/product/583/51451#ffmpeg-.E6.8C.87.E4.BB.A4.3Ca-id.3D.22ffmpeg.22.3E.3C.2Fa.3E)。

### 4. 部署项目

在 `transcode-app` 项目目录下，执行 `sls deploy` 部署项目。

```
cd transcode-app && sls deploy
```

### 5. 上传视频文件

上传视频文件到已经配置好的cos桶指定路径，则会自动转码。本示例中是cos桶`test-123456789.cos.ap-shanghai.myqcloud.com`下的`/video/inputs/`

转码成功后，文件将保存在您配置的输出桶路径中。本示例中是cos桶`test-123456789.cos.ap-shanghai.myqcloud.com`下的`/video/outputs/`

### 6. 重新部署

如果需要调整转码配置，修改文件 `transcode/serverless.yml` 后，重新部署云函数即可：

```
cd transcode && sls deploy
```

## 监控与日志服务

批量文件上传到 COS 会并行触发转码执行。

1. 登录 [云函数控制台](https://console.cloud.tencent.com/scf/index?rid=1) 的【函数服务】页面中，单击函数名进入函数管理页面。
2. 单击【日志查询】，即可查看日志监控。
   ![](https://main.qcloudimg.com/raw/366b8d44b84205d580af18703a1cd511.png)
3. 单击【函数管理】>【函数配置】，单击日志主题的链接，跳转至日志服务控制台。
   ![](https://main.qcloudimg.com/raw/a86502f7ecc77473501ce654a23435de.jpg)
4. 在日志服务控制台的【检索分析】页面中，选择日志集合日志主题，即可查看日志检索分析 。
   ![](https://main.qcloudimg.com/raw/caca6a584b5abe864559379fac8f3346.png)



## 借助函数异步运行能力自主研发方案

在音视频转码、ETL 大体量数据处理、AI 推理等单任务重计算的场景下，函数的单实例运行时需要更多算力及更长时间的稳定运行。若函数的调用端长时间阻塞等待执行结果，不仅会持续占用调用方资源，还会对调用链路的稳定性产生较高要求。
云函数 SCF 提供了一种全新的函数运行机制，您可通过 SCF 提供的函数异步执行模式，提升执行超时时间上限和解决现有运行机制的问题。

## 操作步骤

1. 登录 [云函数控制台](https://console.cloud.tencent.com/scf/list?rid=16&ns=default)，单击左侧导航栏的【函数服务】。
2. 在主界面上方选择期望创建函数的地域，并单击【新建】，进入函数创建流程。
3. 选择使用【空白函数】或选择使用【函数模板】来新建函数。
4. 在“函数配置”页面，展开【高级设置】，并勾选【异步执行】。
5. 单击【完成】即可创建函数。  

## 运行机制原理

函数启用异步执行后，通过同步（例如 API 网关）或异步（例如 COS、CKafka、Timer 等）调用端进行事件调用，函数将以异步执行模式响应事件。
即完成事件调度后立即返回事件的调用标识 RequestId，并结束调用操作，调用端无需阻塞等待。返回 RequestId 的同时，调用引擎将并行下发事件到函数运行时，开启函数逻辑执行。进入异步执行状态后，执行日志将实时上报至日志服务，提供对异步执行事件运行情况的实时反馈。其原理如图所示：

![](https://main.qcloudimg.com/raw/36557e028090175f79b879ac0ad6f66b.png)

> 注意事项：
> - 由于运行机制差异，暂不支持切换同步/异步执行模式。仅支持创建函数时选择是否开启“异步执行”功能，函数创建后该配置将锁定，不提供修改更新操作。
> - 事件调用成功，返回信息只包含 RequestId。事件执行结果需要在函数代码逻辑中自行实现回调特定的 API 或者发送通知消息。
> - 实时日志强依赖于日志服务，系统将默认开启日志服务 CLS，您需要在函数高级配置中选定已有日志集及主题。
>   - 如果没有日志集或日志主题，则需要新建。
>   - 如果不开启日志服务 CLS，将无法获取实时日志。
> - 异步执行目前支持最长执行时长为24小时。如需更长运行时长，可 [提交工单](https://console.cloud.tencent.com/workorder/category) 申请。
> - 如果通过函数运行角色获取对其他云服务组件的访问权限，角色密钥有效期最长为12小时，需要考虑延长有效期策略或使用长期有效密钥。

## 状态追踪原理

函数高级配置启用状态追踪后，针对异步执行的事件，将开始记录并上报事件响应的实时状态，并提供事件状态的统计、查询及终止等事件管理相关服务。其原理如下图所示：
![](https://main.qcloudimg.com/raw/d06476734d27d3308783e78af85897a2.png)

## 相关接口

事件管理相关服务 API 通过云 API 的方式提供，详情参考[官网](https://cloud.tencent.com/document/product/583/51519)


## 温馨提示

- 产生的事件状态数据仅保留3天，将以3天为时间窗口滑动清理。如需保留全部记录，则需要定期拉取并保存至自有存储。
- 关闭状态追踪后，将停止提供异步执行事件相关记录、统计、查询、终止等事件管理相关服务，已产生的事件状态数据将在3天内清空。
- 异步运行函数的事件调用 QPS 限制为并发数量的十分之一，超出部分将被限制，造成响应失败。
- 由于请求 QPS 超限、账户欠费等原因，事件调用将由调度引擎直接返回对应异常，不会生成事件状态记录。

---

欢迎访问：[Serverless 中文网](https://serverlesscloud.cn/)，您可以在 [最佳实践](https://serverlesscloud.cn/best-practice) 里体验更多关于 Serverless 应用的开发！