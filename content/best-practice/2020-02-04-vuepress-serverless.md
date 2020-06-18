---
title: 基于 Serverless 的 VuePress 极简静态网站
description: 通过 Serverless Website 组件快速构建一个 VuePress 极简静态网站
keywords: VuePress,静态网站管理系统,VuePress 极简静态网站
date: 2020-02-04
thumbnail: https://img.serverlesscloud.cn/2020219/1582115734254-VuePress_2_%E9%95%BF%E5%89%AF%E6%9C%AC.png
categories:
  - best-practice
authors:
  - Aceyclee
authorslink:
  - https://www.zhihu.com/people/Aceyclee
tags:
  - Serverless
  - VuePress
---

之前用过 [Docsify + Serverless Framework 快速创建个人博客系统](https://serverlesscloud.cn/best-practice/2019-12-14-docsify-with-serverless/)，虽然 docsify 也是基于 Vue，然而它是完全的运行时驱动，因此对 SEO 不够友好。所以这次尝试使用 VuePress 来搭建一个静态网站，依然部署在 Serverless 架构上。

**简单介绍一下：**

- [VuePress](https://www.vuepress.cn)：由两部分组成，第一部分是一个[极简静态网站生成器](https://github.com/vuejs/vuepress/tree/master/packages/%40vuepress/core)；另一个部分是为书写技术文档而优化的[默认主题](https://www.vuepress.cn/theme/default-theme-config.html)。每一个由 VuePress 生成的页面都带有预渲染好的 HTML，也因此具有非常好的加载性能和搜索引擎优化（SEO）。同时，一旦页面被加载，Vue 将接管这些静态内容，并将其转换成一个完整的单页应用（SPA），其他页面则会只在用户浏览到的时候才按需加载。
- [Serverless Framework](https://github.com/serverless/serverless/blob/master/README_CN.md)：在 GitHub 上有三万颗星，业界非常受欢迎的无服务器应用框架，开发者无需关心底层资源即可部署完整可用的 Serverless 应用架构。

接下来我们分三步进行：**创建项目 → 配置 yml 文件 → 部署**

## ▎工具准备

首先确保系统包含以下环境：
- [Node.js](https://nodejs.org/en/) (Node.js 版本需不低于 8.6，建议使用 10.0 及以上版本)
- [Git](https://git-scm.com/)

**1. 安装 Serverless Framework**

```
$ npm install -g serverless
```

**2. 安装 VuePress**

```
$ npm install -g vuepress
```

## ▎创建项目

```bash
# 创建项目目录
mkdir vuepress-starter && cd vuepress-starter

# 新建一个 markdown 文件
echo '# Hello VuePress!' > README.md

# 开始写作
vuepress dev .

# 构建静态文件
vuepress build .
```

这时候可以看到 ./vuepress-starter 目录下创建的 `README.md` 文档，它会做为主页内容渲染，直接编辑 `docsify/README.md` 就能更新网站内容。此时通过浏览器访问 http://localhost:8080/ 即可本地预览。


## ▎配置 yml 文件

在项目目录下，创建 `serverless.yml` 文件：

```
$ touch serverless.yml
```

将以下内容写入上述的 yml 文件里：

```console
# serverless.yml

myvuepress:
  component: "@serverless/tencent-website"
  inputs:
    code:
      src: ./dist # Upload static files
      index: index.html
      error: 404.html
    region: ap-guangzhou
    bucketName: my-bucket
```

配置完成后，文件目录如下：

```
/vuepress-starter
  ├── .vuepress
  |    ├── dist
  |    |   ├── 404.html
  |    |   └── index.html
  |    └── serverless.yml
  └── README.md
```

## ▎部署

通过 `serverless` 命令（可使用命令缩写 `sls` ）进行部署，添加 `--debug` 参数查看部署详情：

```
$ sls --debug
```

如果你的账号未 [登陆](https://cloud.tencent.com/login) 或 [注册](https://cloud.tencent.com/register) 腾讯云，可以直接通过微信扫描命令行中的二维码，从而进行授权登陆和注册。这也是我觉得特别方便的一个地方！

部署过程中，terminal 显示信息示意：

```
$ sls
 （此处有张二维码）
  Please scan QR code login from wechat.
  Wait login...
  Login successful for TencentCloud.

    myvuepress:
      url: http://my-bucket-1256526400.cos-website.ap-guangzhou.myqcloud.com
      env:

  59s › myvuepress › done
```

访问命令行输出的 url，即可查看使用 Serverless Framework 部署的 VuePress 网站啦~

![最终效果](https://img.serverlesscloud.cn/2020219/1582114426945-VuePress.jpg)

## ▎小结

部署过程中要注意，由于 VuePress 生成的 `index.html` 所在目录默认隐藏，因此要在正确的目录层级中创建  `serverless.yml` 文件，不然会导致部署失败。

这次依然使用了腾讯云 [Serverless Framework](https://cloud.tencent.com/product/sf) 作为网站部署的工具，实在是因为太方便了。部署过程不到一分钟，完全不用考虑云上资源如何配置的问题！✌️



---
<div id='scf-deploy-iframe-or-md'></div>

---

> **传送门：**
> - GitHub: [github.com/serverless](https://github.com/serverless/serverless/blob/master/README_CN.md)
> - 官网：[serverless.com](https://serverless.com/)

欢迎访问：[Serverless 中文网](https://serverlesscloud.cn/)，您可以在 [最佳实践](https://serverlesscloud.cn/best-practice) 里体验更多关于 Serverless 应用的开发！
