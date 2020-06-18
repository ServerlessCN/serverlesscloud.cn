---
title: Serverless 实现视频压缩与格式转换
description: 在 Serverless 架构的应用案例中，有这样一个非常实在的应用：视频处理，我们应该如何实现它呢？
keywords: Serverless 多环境配置,Serverless 管理环境,Serverless配置方案
date: 2020-05-03
thumbnail: https://img.serverlesscloud.cn/2020511/1589207417703-ZalNtxgQAC_small.jpg
categories:
  - best-practice
authors:
  - Anycodes
authorslink:
  - https://zhuanlan.zhihu.com/ServerlessGo
tags:
  - Serverless
  - 视频处理
---

在 Serverless 架构的应用案例中，有这样一个非常实在的应用：视频的处理。

腾讯云的函数计算平台对这个领域的描述：

> 视频应用、社交应用等场景下，用户上传的图片、音视频的总量大、频率高，对处理系统的实时性和并发能力都有较高的要求。例如：对于用户上传的视频短片，我们可以使用多个云函数对其分别处理，对应不同的清晰度（1080p、720p 等），以满足不同场景下用户的需求，适应移动网络带宽较小且不稳定的特性。

![](https://img.serverlesscloud.cn/202058/2-6-1.png)

在阿里云的函数计算也有相关的描述：

![](https://img.serverlesscloud.cn/202058/2-6-2.png)

所以可以看到视频的压缩/转码等操作，在 Serverless 架构下确实是一个很好的典型应用。那么有了这样的一个"典型"应用，我们应该如何实现它呢？

## 准备开始 FFmpeg

在百科上可以看到这样的描述：

> FFmpeg 是一套可以用来记录、转换数字音频、视频，并能将其转化为流的开源计算机程序。采用 LGPL 或 GPL 许可证。它提供了录制、转换以及流化音视频的完整解决方案。它包含了非常先进的音频/视频编解码库 libavcodec，为了保证高可移植性和编解码质量，libavcodec 里很多 code 都是从头开发的。
> FFmpeg 在 Linux 平台下开发，但它同样也可以在其它操作系统环境中编译运行，包括 Windows、macOS 等。这个项目最早由Fabrice Bellard 发起，2004 年至 2015 年间由 Michael Niedermayer 主要负责维护。许多 FFmpeg 的开发人员都来自 MPlayer 项目，而且当前 FFmpeg 也是放在 MPlayer 项目组的服务器上。项目的名称来自 MPEG 视频编码标准，前面的「FF」代表「Fast Forward」。

而在实际生产生活中，ffmpeg 确实也是一个非常好的工具，我们可以通过这个工具来进行图像的压缩/转码等操作。

通过 ffmpeg 的官网，我们可以看到不同的操作系统，有着不同的文件供我们选择：

![](https://img.serverlesscloud.cn/202058/2-6-3.png)

也就是说，我们如果要在云函数中使用这个模块，那么我们就要有这样一个模块是在云函数所在的环境下可以运行起来的，根据云函数的文档可以看到：

![](https://img.serverlesscloud.cn/202058/2-6-4.png)

也就是说，我们要有一个在 CentOS 操作系统下可以使用的 ffmpeg，接下来，我们就准备这个文件：

1. 在 CentOS 操作系统上，下载源码包：`wget http://www.ffmpeg.org/releases/ffmpeg-3.1.tar.gz`
2. 解压并进入目录：`tar -zxvf ffmpeg-3.1.tar.gz && cd ffmpeg-3.1`
3. 编译安装： `./configure && make && make install`

在进行 `./configure` 操作的时候，可能出现 `yasm/nasm not found or too old. Use --disable-yasm for a crippledbuild` 错误。

yasm 是汇编编译器，ffmpeg 为了提高效率使用了汇编指令，如 MMX 和 SSE 等。所以系统中未安装 yasm 时，就会报错误，此时可以安装 yasm 编译器来解决：

1. 下载 `wget http://www.tortall.net/projects/yasm/releases/yasm-1.3.0.tar.gz`
2. 解压并进入目录：`tar zxvf yasm-1.3.0.tar.gz && cd yasm-1.3.0`
3. 编译安装：`./configure && make && make install`

完成 ffmpeg 的编译安装，可以在当前目录下看到生成了文件：ffmpeg

此时我们保存这个文件即可在腾讯云的云函数中使用。

## Serverless 助力视频压缩

按照腾讯云提供的时间架构图，我们可以看到其推荐的是对象存储触发器触发函数，也就是说我们将视频存储到对象存储中，然后通过对象存储的相关触发器触发函数，进行视频的处理，处理之后再回传对象存储的操作。

代码实现：

```python
import os
import subprocess
from qcloud_cos_v5 import CosConfig
from qcloud_cos_v5 import CosS3Client

secret_id = os.environ.get('secret_id')
secret_key = os.environ.get('secret_key')
region = os.environ.get('region')
cosClient = CosS3Client(CosConfig(Region=region, SecretId=secret_id, SecretKey=secret_key))

# 移动 ffmpeg 到 tmp 目录，并且赋予权限
with open("./ffmpeg", "rb") as rf:
    with open("/tmp/ffmpeg", "wb") as wf:
        wf.write(rf.read())
subprocess.run('chmod 755 /tmp/ffmpeg', shell=True)

def main_handler(event, context):

    for record in event['Records']:
        bucket = record['cos']['cosBucket']['name'] + '-' + record['cos']['cosBucket']['appid']
        key = "/".join(record['cos']['cosObject']['key'].split("/")[3:])
        download_path = '/tmp/{}'.format(key.split('/')[-1])
        upload_path = '/tmp/new_mp4-{}'.format(key.split('/')[-1])

        # 下载图片
        print("key", key)
        response = cosClient.get_object(Bucket=bucket, Key=key)
        response['Body'].get_stream_to_file(download_path)

        # 执行 ffmpeg 指令压缩视频
        child = subprocess.run('/tmp/ffmpeg  -i %s -r 10 -b:a 32k %s'%(download_path, upload_path), stdout=subprocess.PIPE, stderr=subprocess.PIPE, close_fds=True, shell=True)

        # 上传图片
        cosClient.put_object_from_local_file(
            Bucket=bucket,
            LocalFilePath=upload_path,
            Key="/new_mp4/" + key.split('/')[-1]
        )


```

这里的主要操作就是在容器建立的时候，或者说是函数冷启动的时候，将 ffmpeg 复制到可执行目录，并且设置其权限为 `755`。

完成之后可以进行`serverless.yaml`的编写：

```yaml
MyVideo:
  component: "@serverless/tencent-scf"
  inputs:
    name: MyVideo
    codeUri: ./
    handler: index.main_handler
    runtime: Python3.6
    region: ap-guangzhou
    memorySize: 128
    timeout: 200
    environment:
      variables:
        secret_id: 用户密钥id
        secret_key: 用户密钥key
        region: ap-guangzhou
    events:
      - cos:
          name: video-1256773370.cos.ap-guangzhou.myqcloud.com
          parameters:
            bucket: video-1256773370.cos.ap-guangzhou.myqcloud.com
            filter:
              prefix: source/
            events: cos:ObjectCreated:*
            enable: true
```

部署完成之后，我们将一个测试的MP4文件上传到对应的存储的`source/`文件夹中：

![](https://img.serverlesscloud.cn/202058/2-6-5.png)

稍等片刻，我们可以看到目标文件夹出现了对应的视频：

![](https://img.serverlesscloud.cn/202058/2-6-6.png)

可以看到两个视频文件的差距。

当然，这里仅仅是通过 `/tmp/ffmpeg  -i 原视频 -r 10 -b:a 32k 生成视频` 来进行视频压缩，除此之外，我们还可以使用 ffmpeg 进行额外的操作（以下内容来源于 canmeng 的博客）：

```text
ffmpeg -ss 00:00:00 -t 00:00:30 -i test.mp4 -vcodec copy -acodec copy output.mp4
```

> -ss 指定从什么时间开始
> -t 指定需要截取多长时间
> -i 指定输入文件

这个命令就是从 00 秒开始裁剪到 00+30=30 秒结束，总共 30 秒的视频。这个命令执行很快，因为只是原始数据的拷贝，中间没有什么编码和解码的过程。执行这个命令后你能得到 `output.mp4` 这个输出文件。你可以用视频播放软件播放这个视频看看。

可能有些视频裁剪后的效果，如期望一致，00 秒开始，30 秒结束，总共 30 秒的视频，但是有些视频裁剪后你会发现可能开始和结束都不是很准确，有可能是从 00 秒开始，33 秒结束。这是为什么呢？

因为这些视频里 30 秒处地方刚好不是关键帧，而 ffmpeg 会在你输入的时间点附近圆整到最接近的关键帧处，然后做接下来的事情。如果你不懂什么是关键帧，没关系，这也不影响你使用这个命令。

合并视频

```text
//截取从头开始的30s
ffmpeg -ss 00:00:00 -t 00:00:30 -i keyoutput.mp4 -vcodec copy -acodec copy split.mp4
//截取从30s开始的30s
ffmpeg -ss 00:00:30 -t 00:00:30 -i keyoutput.mp4 -vcodec copy -acodec copy split1.mp4
//进行视频的合并
ffmpeg -f concat -i list.txt -c copy concat.mp4
```
在list.txt文件中，对要合并的视频片段进行了描述。
内容如下
```text
file ./split.mp4
file ./split1.mp4
```
更多常用命令：
```text
ffmpeg -i in.mp4 -filter:v "crop=in_w:in_h-40" -c:a copy out.mp4
// 去掉视频中的音频
ffmpeg -i input.mp4 -vcodec copy -an output.mp4
// -an: 去掉音频；-vcodec:视频选项，一般后面加copy表示拷贝

// 提取视频中的音频
ffmpeg -i input.mp4 -acodec copy -vn output.mp3
// -vn: 去掉视频；-acodec: 音频选项， 一般后面加copy表示拷贝

// 音视频合成
ffmpeg -y –i input.mp4 –i input.mp3 –vcodec copy –acodec copy output.mp4
// -y 覆盖输出文件

//剪切视频
ffmpeg -ss 0:1:30 -t 0:0:20 -i input.mp4 -vcodec copy -acodec copy output.mp4
// -ss 开始时间; -t 持续时间

// 视频截图
ffmpeg –i test.mp4 –f image2 -t 0.001 -s 320x240 image-%3d.jpg
// -s 设置分辨率; -f 强迫采用格式fmt;

// 视频分解为图片
ffmpeg –i test.mp4 –r 1 –f image2 image-%3d.jpg
// -r 指定截屏频率

// 将图片合成视频
ffmpeg -f image2 -i image%d.jpg output.mp4

//视频拼接
ffmpeg -f concat -i filelist.txt -c copy output.mp4

// 将视频转为gif
ffmpeg -i input.mp4 -ss 0:0:30 -t 10 -s 320x240 -pix_fmt rgb24 output.gif
// -pix_fmt 指定编码

// 将视频前30帧转为gif
ffmpeg -i input.mp4 -vframes 30 -f gif output.gif

// 旋转视频
ffmpeg -i input.mp4 -vf rotate=PI/2 output.mp4

// 缩放视频
ffmpeg -i input.mp4 -vf scale=iw/2:-1 output.mp4
// iw 是输入的宽度， iw/2就是一半;-1 为保持宽高比

//视频变速
ffmpeg -i input.mp4 -filter:v setpts=0.5*PTS output.mp4

//音频变速
ffmpeg -i input.mp3 -filter:a atempo=2.0 output.mp3

//音视频同时变速，但是音视频为互倒关系
ffmpeg -i input.mp4 -filter_complex "[0:v]setpts=0.5*PTS[v];[0:a]atempo=2.0[a]" -map "[v]" -map "[a]" output.mp4

// 视频添加水印
ffmpeg -i input.mp4 -i logo.jpg -filter_complex [0:v][1:v]overlay=main_w-overlay_w-10:main_h-overlay_h-10[out] -map [out] -map 0:a -codec:a copy output.mp4
// main_w-overlay_w-10 视频的宽度-水印的宽度-水印边距；

// 截取视频局部
ffmpeg -i in.mp4 -filter:v "crop=out_w:out_h:x:y" out.mp4
// 截取部分视频，从[80,60]的位置开始，截取宽200，高100的视频
ffmpeg -i in.mp4 -filter:v "crop=80:60:200:100" -c:a copy out.mp4
// 截取右下角的四分之一
ffmpeg -i in.mp4 -filter:v "crop=in_w/2:in_h/2:in_w/2:in_h/2" -c:a copy out.mp4
// 截去底部40像素高度
ffmpeg -i in.mp4 -filter:v "crop=in_w:in_h-40" -c:a copy out.mp4

```
参数说明：
>-vcodec xvid 使用xvid压缩
>-s 320×240 指定分辨率
>-r fps 设置帧频 缺省25
>-b <比特率> 指定压缩比特
>-acodec aac 设定声音编码
>-ac <数值> 设定声道数，1就是单声道，2就是立体声
>-ar <采样率> 设定声音采样率，PSP只认24000
>-ab <比特率> 设定声音比特率
>-vol <百分比> 设定音量
>-y 覆盖输出文件
>-t duration 设置纪录时间 hh:mm:ss\[.xxx]格式的记录时间也支持
>-ss position 搜索到指定的时间 \[-]hh:mm:ss\[.xxx]的格式也支持
>-title string 设置标题
>-author string 设置作者
>-copyright string 设置版权
>-hq 激活高质量设置
>-aspect aspect 设置横纵比 4:3 16:9 或 1.3333 1.7777
>-croptop size 设置顶部切除带大小 像素单位
>-cropbottom size -cropleft size -cropright size
>-padtop size 设置顶部补齐的大小 像素单位
>-padbottom size -padleft size -padright size -padcolor color 设置补齐条颜色(hex,6个16进制的数，红:绿:兰排列，比如 000000代表黑色)
>-bt tolerance 设置视频码率容忍度kbit/s
>-maxrate bitrate设置最大视频码率容忍度
>-minrate bitreate 设置最小视频码率容忍度
>-bufsize size 设置码率控制缓冲区大小
>-vcodec codec 强制使用codec编解码方式。 如果用copy表示原始编解码数据必须被拷贝
>-sameq 使用同样视频质量作为源（VBR）
>-pass n 选择处理遍数（1或者2）。两遍编码非常有用。第一遍生成统计信息，第二遍生成精确的请求的码率
>-passlogfile file 选择两遍的纪录文件名为file
>-map file:stream 设置输入流映射
>-debug 打印特定调试信息

## 总结

Serverless 架构在做一些同步的业务是有很不错效果的，同时 Serverless 架构在异步的一些流程上，也有很棒的表现，无论是通过 Serverless 架构做大数据的分析实现 MapReduce，还是做图像的压缩、水印和格式转换，抑或本文分享的视频相关的处理。

通过 Serverless 架构，我们还可以挖掘更多领域的应用，例如通过 Serverless 架构做一个 Word/PPT 转 PDF 的工具等。Serverless 架构的行业应用，领域应用，需要更多人提供更多的实践。



---
<div id='scf-deploy-iframe-or-md'></div>

---

> **传送门：**
> - GitHub: [github.com/serverless](https://github.com/serverless/serverless/blob/master/README_CN.md)
> - 官网：[serverless.com](https://serverless.com/)

欢迎访问：[Serverless 中文网](https://serverlesscloud.cn/)，您可以在 [最佳实践](https://serverlesscloud.cn/best-practice) 里体验更多关于 Serverless 应用的开发！
