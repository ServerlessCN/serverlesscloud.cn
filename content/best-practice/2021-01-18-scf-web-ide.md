---
title: 全云端开发体验！腾讯云发布 Serverless 云函数 Web IDE
description: 随时随地编写代码，拥有和本地 IDE 一样的流畅编辑体验！
date: 2021-01-18
thumbnail: https://main.qcloudimg.com/raw/9bf5d90a2ac1a5483256795d6db370c6.jpg
categories:
  - best-practice
authors:
  - Dora
tags:
  - Serverless
  - WebIDE
---

Serverless 云函数 SCF 在线编辑器没有终端？本地开发常用工具不能安装和使用？无法查看大文件？ Serverless Web IDE 的发布将为您解决以上所有问题。

Serverless Web IDE 是腾讯云 Serverless 和 CODING 深度合作推出的在线 IDE，基于 CODING 团队自主研发的在线集成开发环境 Cloud Studio，能够帮助开发者随时随地打开浏览器即可编写代码、拥有和本地 IDE 一样的流畅编辑体验，且无需繁杂的配置工作。

登录云函数 SCF 控制台查看函数代码立即体验：https://console.cloud.tencent.com/scf/list?rid=5&ns=default

## 功能优势

- **IDE 中闭环函数操作**：在 Serverless Web IDE 中，您可以完成函数从开发、部署到测试的全流程操作，获得在线开发的沉浸式体验；
- **终端能力**：Serverless Web IDE 提供了和本地开发体验一致的终端能力，并且预置了常用的 pip，npm，Git 等开发工具和 SCF 已经支持的编程语言开发环境；
- **扩展能力**：预置了常用的 VS Code 扩展，如 Python、ESLint、Prettier 等，在线开发也可获得智能提示、代码自动补全等能力；
- **有状态**：Serverless Web IDE 为每个用户提供一个工作空间，工作空间相互隔离，在工作空间中进行的操作为您保留。如果在编辑过程中误操作退出了编辑器也无需担心，下次使用 IDE 可以继续进行上次未完成的工作；如果在 IDE 中进行了自定义配置，在不同时间、不同函数的在线开发中也同样可以获得一致的 IDE 使用体验

![](https://main.qcloudimg.com/raw/0f4cbb6f9787189731e883faeb2bd2d6.jpg)


> **注意：**
> - 我们会为您保留 Serverless Web IDE 中的个性化配置以及代码状态，为了确保函数修改生效，请及时将修改部署到云端。
> - 建议使用最新版本的 Google Chrome 浏览器以获得最佳的 IDE 使用体验。

## 快速体验

在 Serverless Web IDE 中修改、部署和测试一个函数的使用流程如下：

**在线开发**

登录云函数 SCF 控制台，新建一个函数或打开一个已有函数，本文以一个名为 Serverless-Web-IDE 的函数为例：

![](https://main.qcloudimg.com/raw/ad6396370ae22a9b5bdc79f56b197769.png)

在【函数代码】页签即可体验 Serverless Web IDE

![](https://main.qcloudimg.com/raw/587bee73fd3f1fccb7bb85c81c2e4927.png)

**函数部署：**

开发完成后，可点击 IDE 右上角的【部署】按钮将函数部署到云端。Serverless Web IDE 提供手动部署和自动部署两种函数部署方式，支持在线安装依赖。

**1. 手动部署**：手动部署模式下，您可以通过点击 IDE 右上角【部署】按钮触发函数部署到云端。

**2. 自动部署**：自动部署模式下，保存（ctrl+s 或 command+s）即可触发函数部署到云端。

**在线安装依赖**：目前只支持 Node.js 运行环境，在线安装依赖开启后，在函数部署时会根据 package.json 中的配置自动安装依赖，详情可参考**在线依赖安装**:`https://cloud.tencent.com/document/product/583/37920`。

切换部署方式和启用在线依赖安装可通过点击 IDE 右上角操作区箭头的下拉列表中的【自动部署】和【自动安装依赖】进行切换，【自动部署：关闭】则代表手动部署模式。

![](https://main.qcloudimg.com/raw/e3dedac5c8a263867af702f3bc553f81.png)


> **注意：**
> - 函数的根目录为 /src，部署操作默认将 /src 目录下的文件打包上传，请将需要部署到云端的文件放在 /src 目录下
> - 自动部署模式下保存即触发函数部署到云端，不建议在有流量的函数上开启。

**函数测试**

您可以点击 IDE 右上角操作区【测试】按钮触发函数运行，并在输出中查看函数运行结果。

**1. 选择测试模版**：点击 IDE 操作区的【测试模版】选择函数测试触发事件；

**2. 新增测试模版**：如果现有的测试模版不能满足您的测试需求，可以在测试模版下拉列表中选择【新增测试模版】自定义测试事件，新增测试事件将以 JSON 文件的格式存储在函数根目录 /src 下的 `scf\_test\_event` 文件夹中，跟随函数一起部署到云端，已经创建好的测试模版会自动检测并添加到 IDE 测试模版列表中，无需重复添加。

![](https://main.qcloudimg.com/raw/bc764b668bb23c1d9931a4c8c03ead41.png)

**查看日志**

您可以在输出中查看函数测试结果，包括返回数据 Response、日志 Output 和函数执行摘要 Summary。

![](https://main.qcloudimg.com/raw/88b65aecadd3fcda79fca3d0544a34ca.png)

**更多操作**

在资源管理器函数文件上单击右键展开的列表中，包含了函数相关的全部操作。除部署、测试、新增测试模版等操作外，还提供了：

- **生成 serverless.yml**：将函数当前的配置写入配置文件 serverless.yml，可以使用 Serverless Framework 命令行工具进行二次开发；
- **丢弃当前修改**：重新拉取云端已经部署的函数覆盖当前工作区。

腾讯云 Serverless 提供完整的在线开发、在线调试全生命周期能力：[《再见，本地环境！腾讯云全球首发：Serverless 在线远程调试》](https://serverlesscloud.cn/best-practice/2021-01-06-remote-debugging)

使用过程中遇到的任何问题都可以反馈至 [这里](https://wj.qq.com/s2/7781179/60f4)

---

---
<div id='scf-deploy-iframe-or-md'></div>

---

> **传送门：**
> - GitHub: [github.com/serverless](https://github.com/serverless/serverless/blob/master/README_CN.md)
> - 官网：[serverless.com](https://serverless.com/)

欢迎访问：[Serverless 中文网](https://serverlesscloud.cn/)，您可以在 [最佳实践](https://serverlesscloud.cn/best-practice) 里体验更多关于 Serverless 应用的开发！