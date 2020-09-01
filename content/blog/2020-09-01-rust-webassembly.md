---
title: 基于腾讯云的 Rust 和 WebAssembly 函数即服务
description: 本文将介绍如何在云函数 SCF 中运行用 Rust 编写的 WebAssembly 函数。
keywords: Serverless, Serverless Framework
date: 2020-09-01
thumbnail: https://img.serverlesscloud.cn/202091/1598950750395-origin_img_6f483a12-6885-4499-b35b-2e23c949ef8g.jpg
categories: 
  - user-stories
authors: 
  - Michael Yuan
authorslink: 
  - https://www.freecodecamp.org/news/author/michael
tags:
  - Serverless
  - WebAssembly
---

腾讯云云函数 (SCF) 已经支持十多种编程语言和运行时框架。腾讯云最近发布的 SCF custom runtime（自定义运行时）更进一步 —— SCF 现在可以支持用任何编程语言编写的函数。

本文将介绍如何在云函数 SCF 中运行用 Rust 编写的 WebAssembly 函数。

我们先介绍一些基本概念，然后回顾一个完整但简单的 hello world 示例，部署您的第一个 WebAssembly 无服务器函数。最后，我们将用一个机器学习即服务 (MLaaS) 示例来做一些有用的事情。该示例接受数据并以 SVG 格式返回拟合模型和可视化。

这是本教程结束时你将创建的[最终应用](https://www.secondstate.io/demo/2020-tencentcloud.html)。它完全是「无服务器」的，只有使用时会产生成本。

HTML 和 JavaScript UI 可以托管在任何计算机上，包括笔记本电脑上。在腾讯云 Serverless 上的后端函数执行机器学习和 SVG 绘图。

## 为什么选择 WebAssembly 和 Rust

传统的无服务器函数基于重量级的框架。开发者必须在特定的应用框架中编写函数，比如 Node.js 中的 JavaScript 或 Python Boto。

腾讯云 SCF Custom Runtime 打破了这种模式，允许开发者用任何语言编写无服务器函数。

为了演示这个优势，本文提供了基于 Bash 脚本的函数、基于 Deno 的 TypeScript 函数和基于 Rust 的本机二进制函数的示例。这使我们能够在腾讯云上创建和部署基于 web 组件的无服务器函数。

### 为什么要这么做？

以下是一些原因：

- WebAssembly 是为性能而设计的。 WebAssembly 函数可以比用JavaScript 或者 Python 快 10 倍。
- WebAssembly 函数是可移植的。虽然可以在 SCF Custom runtime上运行本地二进制文件，但必须将这些二进制文件编译到 Custom runtime 的确切操作系统环境中。目前在 X86 CPU 上使用的是 CentOS 7.6，之后可能会更改。正如我们将要看到的，WebAssembly 函数是可移植的，并且非常容易部署和管理。
- WebAssembly 函数是安全的。众所周知，即使使用 Docker，本地二进制应用程序也可能会破坏容器。由于你的应用程序可能依赖于许多第三方库，因此你的依赖项中存在危险代码的风险真实存在。 WebAssembly 有着基于能力的安全模型, 为你的代码提供更好的运行时保护。
- 虽然 WebAssembly 兼容各种编程语言，但 Rust、AssemblyScript (TypeScript)、C/C++ 和 Go 是写 WebAssembly 函数的最佳语言，尤其是 Rust。Rust 是一种流行且越来越受瞩目的编程语言，社区非常活跃。Rust 让我们能够写一个高效但内存安全的函数。

最后，在腾讯云上编写和部署 WebAssembly 函数实际上非常简单，在一个小时内就可以完成。

## 前期准备

首先，注册一个腾讯云账户。对大多数开发和个人项目来说，开发工作都可以在免费额度内进行。 

确保你已经在地开发计算机或 Docker 容器上安装了 Rust 和 ssvmup 工具链。ssvmup 工具链将 Rust 程序编译并优化为 WebAssembly 字节码。只需使用以下简单命令即可安装。你也可以参考这个指南。

```
$ curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
$ source $HOME/.cargo/env
... ...
$ curl https://raw.githubusercontent.com/second-state/ssvmup/master/installer/init.sh -sSf | sh
```

WebAssembly 函数是在 Second State 虚拟机 SSVM 里执行的。SSVM 是专为服务端的用例和应用优化的高性能 WebAssembly 虚拟机。

## Hello, world

要在腾讯云上部署 Rust 和 WebAssembly 函数, 我们建议 clone 或者 fork GitHub 上的[模板 repo](https://github.com/second-state/ssvm-tencent-starter)，并把这个模板作为你自己应用的基础。 

在 `main.rs` 上的 Rust 函数是我们将部署到 SCF 的无服务函数。正如你能从源代码看到的那样，它能从 STDIN 读取函数的输入, 然后用 println! macro 把结果发送到 STDOUT。

```
use std::io::{self, Read};
use serde::Deserialize;

fn main() {    
    let mut buffer = String::new();    
    io::stdin().read_to_string(&mut buffer).expect("Error reading from STDIN");    
    let obj: FaasInput = serde_json::from_str(&buffer).unwrap();    
    let key1 = &(obj.key1);    
    let key2 = &(obj.key2);    
    println!("Hello! {}, {}", key1, key2);
}

#[derive(Deserialize, Debug)]
struct FaasInput {    
    key1: String,    
    key2: String
}
```

Rust main() 函数使用 serde 库来从 STDIN 解析一个 JSON 字符串。

JSON 看起来像下面这样。 我们之所以用这种方式编写函数，是因为SCF 使用内置的 hello world JSON 模板来测试部署好的函数。

```
{  
    "key1": "test value 1",  
    "key2": "test value 2"
}
```

函数提取 key1 和 key2 值并输出下面的 hello 消息到 STDOUT。 

```
Hello! test value 1, test value 2
```

但是，这个函数的 web 请求是如何被转换成 STDIN 的？如何将 STDOUT 中的函数响应转换为 HTTP 响应？

这是通过我们模板中的 SCF custom runtime 基础设施和引导 (bootstrap) 程序完成的。

正如你所看到的那样，引导程序只是一个 bash shell 程序，它不断地轮询云函数 SCF 以查找传入的请求。它将传入的请求转换为 STDIN，并通过 SSVM 调用 WebAssembly 函数。然后，它接受 STDOUT 输出，并将其作为函数的响应发给 SCF。

如果你使用我们的模板，就不需要修改引导程序。

现在，可以使用 ssvmup 将 Rust 函数构建到 WebAssembly 字节码中，然后将 zip 文件打包，从而在腾讯云 SCF Custom Runtime 上进行部署。

```
$ ssvmup build
... ...

$ cp pkg/hello_bg.wasm cloud/
$ cd cloud
$ zip hello.zip *
```

按照这个说明和截图来部署并测试上面 `hello.zip` 文件。现在已经成功地部署了一个 WebAssembly 无服务器函数！

接下来，让我们用 Rust 函数创建一个有价值的 web 服务。

## 机器学习即服务

这个例子中，我们选择了一个计算密集型的机器学习任务来演示 Rust WebAssembly 函数的性能。

无服务器函数采用以逗号分隔的数字输入字符串，这些数字表示二维平面上的一组点。输入的数据格式是 `x1,y1,x2,y2,...`

该函数分析数据并计算两个特征向量，指示数据中最大方差的方向。特征向量为数据科学家提供了关于驱动数据变化的潜在因素的线索。这就是所谓的主成分分析。

我们的函数创建一个 SVG 图，并且在这个图上绘制输入的数据点以及上面计算得到的特征向量。该函数最后以 XML 文本的形式返回这个 SVG 图。

要开始这个例子，你可以 clone 或者 fork 这个 [repo](https://github.com/second-state/wasm-learning/tree/master/tencentcloud)。该项目在 `tencentcloud/ssvm/pca` 文件夹中。或者你可以复制 `Cargo.toml` 和 `src/*` 的内容到上文的 hello world 模板。如果你选择后者，确保你修改了 `Cargo.toml`，将其指向 Rust 机器学习库的正确源代码文件夹。

本教程中不会深入探讨 PCA 或 SVG 生成的 Rust 源代码的细节，因为它们涉及大量的计算代码。

遵照与 hello world 示例中相同的步骤。使用 ssvmup 构建一个 `pca.zip` 包，并将其部署到腾讯云 SCF custom runtime 上。

接下来，我们将部署好的函数与 web API 网关关联起来，以便可以从 web HTTP 或 HTTPS 请求调用它。在 SCF 的 web 控制台的触发管理选项卡中执行此操作。这里可以查看[教程和截图](https://github.com/second-state/wasm-learning/tree/master/tencentcloud/ssvm/pca#create-a-web-service)

API 控制台将 HTTP 请求转换为无服务器函数的 JSON 输入。例如，这里有一个对 API 网关 URL 的 HTTP POST 请求。我们将来自 `iris.csv` 文件的以逗号分隔的数据点放在 POST 主体中。

```
$ curl -d @iris.csv -X POST https://service-m9pxktbc-1302315972.hk.apigw.tencentcs.com/release/PCASVG
```

API 网关将以下 JSON 传到 Rust 函数的 STDIN。POST body 现在是 JSON 中的 body 属性。

```
{
  "body": "3.5,0.2,3,0.2,...",
  "headerParameters": {},
  "headers": {
    "accept": "/",
    "content-length": "11",
    "content-type": "application/x-www-form-urlencoded",
    "host": "service-aj0plx8u-1302315972.hk.apigw.tencentcs.com",
    "user-agent": "curl/7.54.0",
    "x-anonymous-consumer": "true",
    "x-api-requestid": "e3123014742e7dd79f0652968bf1f62e",
    "x-b3-traceid": "e3123014742e7dd79f0652968bf1f62e",
    "x-qualifier": "$DEFAULT"
  },
  "httpMethod": "POST",
  "path": "/my_hk",
  "pathParameters": {},
  "queryString": {},
  "queryStringParameters": {},
  "requestContext": {
    "httpMethod": "ANY",
    "identity": {},
    "path": "/my_hk",
    "serviceId": "service-aj0plx8u",
    "sourceIp": "136.49.211.114",
    "stage": "release"
  }
}
```

Rust 函数解析主体中的数据，执行 PCA，并生成 SVG 图形。它将 SVG 内容打印到 STDOUT，后者由 API 网关获取并作为 HTTP 响应发送回来。

要在 AJAX 请求中使用此 API 网关 URL，还必须配置腾讯云网关以接受 CORS web 请求。查看[指南](https://www.secondstate.io/articles/tencentcloud-api-gateway-cors/)，了解如何做到这一点。

下面的 HTML JavaScript 例子展示了如何在网页中使用这个无服务器函数。

它通过 ID `csv_data` 从 `textarea` 字段获取 CSV 数据，向无服务器函数发出 AJAX HTTP POST 请求，然后把返回值（一个 SVG 图形）放入 ID 为 `svg_img` 的 HTML 元素中。点击这里查看 [demo](https://www.secondstate.io/demo/2020-tencentcloud.html)。

```
$.ajax({
  method: "POST",
  url: "https://service-m9pxktbc-1302315972.hk.apigw.tencentcs.com/release/PCASVG",
  data: $('#csv_data').val(),
  dataType: "text"
}).done(function(data) {
  $('#svg_img').html(data);
})
```

![运行中的 Web 应用](https://img.serverlesscloud.cn/202091/1598949770276-tencentcloud_pca_webapp.png)

## 接下来

腾讯的 SCF Custom runtime 是一个非常强大的无服务运行环境。它为你想要编写的任何应用程序函数提供了一个通用的 Linux 环境，并提供了标准的 web 接口来与函数的输入和输出进行交互。这绝对值得一试。

正如本文所讨论的，我们相信 Rust 和 WebAssembly 为无服务器函数提供了一个高性能、安全、可移植、面向未来的堆栈。Rust、WebAssembly 与 SCF costum runtime 代表了未来！

> **作者简介：** Michael Yuan 博士是 5 本软件工程书籍的作者。最新著作《Building Blockchain Apps》由 Addison-Wesley 于 2019 年 12 月出版。Michael 还担任 Second State 的 CEO，Second State 是一家致力于将 WebAssembly 和 Rust 技术引入云计算，AI 与区块链的公司。

---

---
<div id='scf-deploy-iframe-or-md'></div>

---

> **传送门：**
> - GitHub: [github.com/serverless](https://github.com/serverless/serverless/blob/master/README_CN.md)
> - 官网：[serverless.com](https://serverless.com/)

欢迎访问：[Serverless 中文网](https://serverlesscloud.cn/)，您可以在 [最佳实践](https://serverlesscloud.cn/best-practice) 里体验更多关于 Serverless 应用的开发！