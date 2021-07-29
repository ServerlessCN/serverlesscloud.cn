---
title: Web 函数自定义镜像实战：构建图象处理函数
description: Web 函数自定义镜像实战
date: 2021-07-27
thumbnail: https://main.qcloudimg.com/raw/a9857711be4667a1aa6a80c3928c22ec.jpg
categories:
  - best-practice
authors:
  - icebreaker
tags:
  - Serverless
  - 云函数
---


作为一名前端工程师，我们经常会在 `H5` , 或者小程序中，使用 `Canvas` 来处理或生成图片。

不过在某些禁用 `javascript` 场景下，我们往往需要在服务端预先把图片处理好，再返回给不同的客户端进行使用。

本篇文章就主要给大家介绍，如何使用腾讯云 SCF，多快好省的搭建一个图象处理函数。

**使用到的技术**

看这篇文章之前，建议同学们可以初步了解一下，下方罗列的一些初级知识：

- [h5 canvas & svg](https://developer.mozilla.org/)
- [Nodejs](https://nodejs.org/en/)
- [Docker](https://www.docker.com/)
- [Serverless Framework Components](https://www.npmjs.com/package/@serverless/components)
- [Tencent SCF Web 函数 + 自定义镜像](https://cloud.tencent.com/document/product/583/56124)

当然不了解以上技术也不影响阅读，此文章涉及的知识较为入门，用例也只是一个一个 `Hello World` 罢了。



## 01. 在服务端构建 Canvas

### 1. Why node-canvas ?

如同 `jsdom` 可以在 `nodejs` 里构建 `window`,`document` 上下文 ， `node-canvas` 也是 `canvas` 在 `nodejs` 环境下的一套实现。

在浏览器中，我们知道 `Canvas` 可以做非常多的事情:

- 简单的随便画点图形，导入几张图片处理一下；
- 复杂的动态图表,游戏，Webgl 渲染等等；

在 `nodejs` 中，我们同样也有生成和处理图像的需求，往常我们会使用 [imagemagick](https://imagemagick.org/script/develop.php)，[GraphicsMagick](http://www.graphicsmagick.org/) 这种已经很成熟的方案。不过，这些库对于我们这些前端开发来说，存在一定的学习成本。反观 `Canvas API`，大家都很熟悉，一下子把学习成本降低了。而且使用这种方式，也可以降低兼容现有 Canvas 前端库的成本。

### 2. 准备编译环境

首先我们需要安装 `node-canvas` 的一个 [编译](https://www.npmjs.com/package/canvas) 环境，如下列表格展示：

| OS      | Command                                                      |
| ------- | ------------------------------------------------------------ |
| OS X    | Using [Homebrew](https://brew.sh/):<br/>`brew install pkg-config cairo pango libpng jpeg giflib librsvg` |
| Ubuntu  | `sudo apt-get install build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev` |
| Fedora  | `sudo yum install gcc-c++ cairo-devel pango-devel libjpeg-turbo-devel giflib-devel` |
| Solaris | `pkgin install cairo pango pkg-config xproto renderproto kbproto xextproto` |
| OpenBSD | `doas pkg_add cairo pango png jpeg giflib`                   |
| Windows | See the [wiki](https://github.com/Automattic/node-canvas/wiki/Installation:-Windows) |
| Others  | See the [wiki](https://github.com/Automattic/node-canvas/wiki) |

从列表中可以看到，它依赖着许多的第三方 `lib` 库。而这些库，并没有被预置在官方的 SCF 镜像里。

此时就需要 **自定义镜像部署** 这个功能上场了，它把构建 `SCF runtime` 的权力，下放到我们用户手中，以此来满足更复杂的业务需求。我们把容器环境搭建好后，配合 **Web 函数** ，只需要对外暴露一个 `http` 监听的端口号，就可以提供服务，实在是非常方便。

### 3. 构建 Dockerfile

首先我们需要构建本地的 `开发容器环境` 和 线上 `SCF的容器环境`，里我使用了最流行的 `Alpine` Linux 发行版。同时我们也从上述依赖表格中，也可以获得 `alpine` 版本需要安装的 [依赖](https://pkgs.alpinelinux.org/packages)。接下来我们就可以写出构建线上 `SCF的容器环境` 的 `Dockerfile`：

```docker
# lts 版本的 nodejs
FROM node:14-alpine

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json yarn.lock /usr/src/app/

# alpinelinux 国内镜像地址,防止下载过慢
RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.aliyun.com/g' /etc/apk/repositories \
  && apk add --no-cache \
  build-base \
  g++ \
  cairo-dev \
  jpeg-dev \
  pango-dev \
  giflib-dev  \
  && apk add --update  --repository http://dl-3.alpinelinux.org/alpine/edge/testing \
  libmount \
  ttf-dejavu \
  ttf-droid \
  ttf-freefont \
  ttf-liberation \
  ttf-ubuntu-font-family \
  fontconfig \
  && yarn --prod

COPY ./src /usr/src/app/src

EXPOSE 9000

ENTRYPOINT ["yarn" ,"start"]
```

上述 `Dockerfile`，主要做的事情就是，准备一下运行环境，拷贝代码，下载字体和暴露一下端口和启动命令。



### Coding

> 代码部分就不贴了，感兴趣文章末尾有源码链接



## 02. 图像生成

接着开始编写我们的代码了，在这里，我们生成以 **2** 种图像为主，`image/svg+xml` 和 `image/png` (jpeg)。

#### Svg

在服务端根据参数：

1. 渲染 antd icon 的 svg 内容；
2. 在服务端生成任意内容的 **二维码**；
3. 生成 **svg** 动画 (无 js)；

#### Png

在服务端根据参数：

1. 调用 `Canvas`，构建图像；
2. 使用 `chartjs-node-canvas` `chart.js`，直接生成图表的图片；

我们也可以在服务端去使用 `echarts`, `@antv/f2` 来生成，本质也是类似的。而且，我们也可以使用一些额外的数据源，来生成更有意义的图片，比如结合 `octokit` ，在服务端去动态的抓取 `Github` 用户数据来生成内容。



## 03. 图像处理

原先 `event 函数` 接受上传文件，需要在 `API 网关` 那里开启 `Base64` 编码的选项。而 `web 函数` 可以直接透传，就不需要考虑这一块（再次说明 web 场景下，开发体验好很多），我们可以直接接收 从客户端组装的 `FormData` ，在服务端解析 `multipart/form-data` 格式，提取文件后进行处理。比如:

- 在前端上传一个图片，给它打水印，去色，裁剪，识别等操作；
- 又或者上传多个图片，进行缝合，对比等等；

这里我写了一个前端上传图片,去色的功能在我的博客站（手机可访问）：[图像去色的在线地址](https://www.icebreaker.top/demos/serverless-canvas)

最后再返回一下处理完成的 `Canvas Buffer` ，标注一下 `Content-Type` 就 OK 了。

<!-- 要客户端缓存的话，就设置个 `Cache-Control`， -->

像 `Github` 本身也可以通过 `Cache-Control` 这个响应头来给 `camo.githubusercontent.com` 设置资源的缓存。



## 04. Serverless 部署

相比普通的部署，自定义镜像部署是不需要上传代码的,所以自然不需要在 `yml` 文件里配置 `src` 这个选项

这里我节选了一段配置文件中的核心片段:

```yaml
# serverless.yml
app: github-node-canvas
stage: dev
component: scf
name: github-node-canvas-scf
inputs:
  name: ${name}
  region: ap-shanghai
  type: web
  image: # 镜像配置
    # registryId: tcr-xxx # 容器镜像服务名称，企业版必须
    imageType: personal # 镜像类型：personal - 个人，enterprise - 企业版，public - 镜像模板
    imageUrl: ${env:IMAGE_URI} # 从环境变量中取 镜像Url
  events:
    - apigw:
        parameters:
          protocols:
            - http
            - https
          environment: release
          endpoints:
            - path: /
              method: ANY
              function:
                type: web
```

其中最重要的就是 `image` 下的 `imageUrl` 配置项，它由 `url`, `tag`, `sha256` 三部分组成，格式类似于 `{url}:{tag}@{sha256}`。

例如 `ccr.ccs.tencentyun.com/tcb-xxxxxxxx-iuit/your-project:v1.0.0@sha256:xxxxxx`

`sha256` 用来标识镜像的一个唯一值，它可以在：

1. docker push 之后，在命令行显示出来，进行复制：

![Image](https://pic4.zhimg.com/80/v2-dd9607fb6c3c3620f5078dbe006d9671.png)



2. 或者 push 成功后，进入`腾讯云控制台` -> `容器服务` -> `个人镜像` -> 进入指定镜像详情中找到版本的镜像 ID(SHA256) ，如图所示：

![Image](https://pic4.zhimg.com/80/v2-5b1249e1451443cc60a22b43144d8cf3.png)

3. docker inspect 指令获取 (感谢`yuga sun`大佬提供)
   <!-- > ps: sha256 太长会被 antd table 组件压成 tooltip, 建议直接 `Ctrl + Shift + I` 来进行 CV -->



最后我们直接执行 `components deploy` 就部署成功了

> ps: 这里笔者直接使用的 `@serverless/components` ，使用 `serverless` 的同学，请使用 `serverless deploy`。

具体配置可以查看 [sonofmagic/ascii-art-avatar](https://github.com/sonofmagic/ascii-art-avatar) 这个仓库的 `serverless.yml` 文件。



## 05. 展现效果

### Github public profile

![github public profile](https://pic4.zhimg.com/80/v2-f0ee984d7f369ad07f08df47f71c228c.png)

上图中的文字，图标，二维码，Svg 动画，雷达图均为服务端生成

### Image grayscale

![image-grayscale](https://pic4.zhimg.com/80/v2-13ed07378d7cfbc4376f68975b9e0387.png)



## 06. 后记

就这样一个简单的 使用 `Web 函数` + `自定义镜像部署` 的案例 就完成了。实际上，它能做到的功能，远远不止如此，更是大大拓宽了 `Serverless` 的能力。不过在使用自定义镜像部署的实践中，笔者也发现目前部署成功的函数，冷启动时间较长，我们往往也需要搭配 , `预制并发实例` 这个功能进行进一步的配合。



**Live Demos**

[图像去色的在线地址](https://www.icebreaker.top/demos/serverless-canvas)

[作者的 Github public profile](https://github.com/sonofmagic)

**Repositories**

[sonofmagic/ascii-art-avatar](https://github.com/sonofmagic/ascii-art-avatar) Host by `tencent cloud scf`

[sonofmagic/github-readme-svg](https://github.com/sonofmagic/github-readme-svg) Host by `vercel`




---



> **传送门：**
>
> - GitHub: [github.com/serverless](https://github.com/serverless/serverless/blob/master/README_CN.md)
> - 官网：[serverless.com](https://serverless.com/)



欢迎访问：[Serverless 中文网](https://serverlesscloud.cn/)，您可以在 [最佳实践](https://serverlesscloud.cn/best-practice) 里体验更多关于 Serverless 应用的开发！
