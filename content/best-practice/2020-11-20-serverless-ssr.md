---
title: 不改一行代码！快速部署 Next.js 博客到腾讯云 Serverless SSR
description: 手把手教你搭建自己的博客系统，快来一起实践吧！
date: 2020-11-20
thumbnail: https://img.serverlesscloud.cn/20201120/1605839791547-1605788634978-SSR.jpg
categories:
  - best-practice
authors:
  - Tina
tags:
  - Serverless
  - 博客
---

近期，腾讯云 Serverless 团队发布了 Serverless SSR 产品，支持将 Next.js，Nuxt.js 等框架的应用快速部署和托管，那么，今天我们就通过一个 Next.js 官方案例一起，来了解下该产品有哪些特性吧！

## 一、写在前面：Next.js & SSR 是什么关系？

Server-Side-Rendering（SSR）泛指服务端渲染的技术，指的是在 Server 端将 HTML 渲染好，再返回给 Client 端。并且 SSR 是在对页面每个请求发出时，都会重新抓取和生成页面（和 SSG 静态页面生成相比，是更加动态的渲染方式）。

Next.js 是一个轻量级的 React 服务端渲染应用框架。支持多种渲染方式，包括客户端渲染、静态页面生成、服务端渲染。使用 Next.js 可以方便的实现 SSR，即页面的服务端渲染。

## 二、服务端渲染 SSR（Server Side Render）

Next.js 框架支持客户端渲染 CSR (Client Side Render)，静态页面生成 SSG（Static Site Generation）以及服务端渲染 SSR (Server Side Render)。用户可以针对不同的场景，选用不同的渲染方式。

由于 SSR 可以动态渲染页面并加载内容，因此主要有以下两个优势：

- 首屏开启时间更快，SEO 更加友好
- 支持生成用户相关内容，不同用户结果不同

在 Next.js 框架中，SSR 的实现主要通过 `getServerSideProps` 方法获取内容，之后在后端调用 `renderToString()` 的方法，把整个页面渲染成字符串。

## 三、基于 Next.js SSR 的博客系统搭建

接下来我们可以通过实战来验证下效果。通过 Next.js 官方的[博客搭建教程](https://nextjs.org/learn/basics/deploying-nextjs-app)，可以很详细的了解到框架的使用原理，并且涉及了丰富的功能点，如下所示：

 - 搭建单页应用
 - 页面之间相互导航
 - Next.js 对静态资源，元数据和 CSS 的处理
 - 预加载（SSR 和 SSG）及数据获取
 - 动态页面的路由
 - API 路由（Serverless 函数）
 - 和 Github Actions 等 CI 打通

接下来，我们可以将这个博客快速部署到 Serverless SSR 平台中，由于教程前半部分主要是对 Next.js 框架的教学，本文中直接将博客仓库代码下载并部署，步骤如下。

1. 【下载代码】通过下列命令将代码下载到本地，并进行少许更改。

```
npx create-next-app nextjs-blog --use-npm --example "https://github.com/vercel/next-learn-starter/tree/master/basics-final"
```
- 在 `public/images/profile.jpg` 中将图片换为自己的头像
- 在 `components/layout.js` 中，把 `const name = '[Your Name]'` 替换成自己的名字
- 在 `pages/index.js` 中，把 `<p>[Your Self Introduction]</p>` 改成自己的个人简介
  
2. 【新建】登录腾讯云，打开 Serverless SSR [控制台](https://console.cloud.tencent.com/ssr)，如果是全新客户会有个授权的流程，授权完成后，点击新建应用，如下图所示。

![SSR 新建](https://img.serverlesscloud.cn/20201119/1605785794259-image%20%281%29.jpeg)

3. 【配置】在新建页面中，填入博客项目名称，由于我本地已有部署好的 next.js 博客及仓库，因此可以直接选择「导入已有项目」。选择对应的代码托管方式，并进行一键授权。

![导入项目](https://img.serverlesscloud.cn/20201119/1605785800563-image%20%283%29.png)

如果没有 Github 仓库也没关系，可以直接通过本地「文件夹上传」的方式，把第一步下载的文件夹上传并导入。

配置完成后，点击部署，在「部署日志」页面查看和等待即可。

在这个过程中，Serverless SSR 会自动执行 CI 流程，做环境的初始化，安装 Serverless CLI，对项目进行 `npm run build` 构建，并且自动通过 layer 层对依赖进行分离，从而提升部署速度。

4. 【访问】等待约一分钟后，可以看到部署成功，跳转到了配置详情页面。此时点击对应的 URL 或者 「访问应用」 按钮，即可访问并打开博客了！

![访问页面](https://img.serverlesscloud.cn/20201119/1605785804438-image%20%284%29.png)

至此，一行代码都没有改，我把博客无缝部署到了腾讯云 Serverless SSR 平台上托管。

最终的页面展示如下所示，一个基于 Next.js SSR 的博客页面就快速上线完成了！

![页面展示](https://img.serverlesscloud.cn/20201119/1605785799875-image%20%282%29.png)