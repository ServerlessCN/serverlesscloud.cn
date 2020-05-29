---
title: Serverless 实践：全新命令行工具帮你快速部署云函数
description: SCF CLI 是腾讯云云函数（Serverless Cloud Function，SCF）产品的命令行工具，想必很多小伙伴已经有所了解，或者试用过了。作为一个可以提高开发者效率的工具，腾讯云 Serverless 团队一直在对 SCF CLI 进行优化工作，本文将给大家介绍新版 SCF CLI 增加的有趣功能！
keywords: Serverless, SCF CLI, Serverless云函数
date: 2019-09-18
thumbnail: https://img.serverlesscloud.cn/qianyi/images/YHl6UWa9s63gXEueAufpULb25PiblSh96vULKgk2padpta42yxwdVnqEQPYNn5WVnM3D7FibEvUqWr7LyF5tsCNA.png
categories: 
  - news
authors: 
  - Anycodes
authorslink: 
  - https://github.com/jiangliu5267
tags:
  - SCF CLI
  - 云函数
---

SCF CLI 是腾讯云云函数（Serverless Cloud Function，SCF）产品的命令行工具，想必很多小伙伴已经有所了解，或者试用过了。作为一个可以提高开发者效率的工具，腾讯云 Serverless 团队一直在对 SCF CLI 进行优化工作，**本文将给大家介绍新版 SCF CLI 增加的有趣功能！**


## **一、Deploy 功能优化**

### **1：部署可以选择默认 COS**

只需要在设置的时候，设置 using-cos 就可以，当然也可以 scf configure set --using-cos y 来直接设置：

![Serverless](https://img.serverlesscloud.cn/qianyi/images/YHl6UWa9s63gXEueAufpULb25PiblSh96oRpibnvKVVKO17wt2KnpwKBHR2JgS6TQNicX3BYFWJl511iby8Tq1pnkw.png)

选择之后，可以在接下来的部署中，默认上传代码到你的 cos，提高部署速度：

![Serverless](https://img.serverlesscloud.cn/qianyi/images/YHl6UWa9s63gXEueAufpULb25PiblSh96XVz8j9yonfBjrJ780SrJ4BLiaRNwAV2xVmzsVdMDd7aSfxczdFYzYfg.jpg)

即使设置了 cos，在某次 Deploy 时，不想使用 cos，也可以选择不通过 cos 部署，增加 --without-cos:

![Serverless](https://img.serverlesscloud.cn/qianyi/images/YHl6UWa9s63gXEueAufpULb25PiblSh96JDnyY0T5CmwYWNnic1smkZJQN2DJShnzv5wHspXPXv8icmQTTaItRDtA.png)

想自定义 COS 也可以：--cos-bucket：

![Serverless](https://img.serverlesscloud.cn/qianyi/images/YHl6UWa9s63gXEueAufpULb25PiblSh96sTACYzuGZXFN5niaEQFc0RzUyZQnxJtc7sQyfbDt9qraIscGvoLxvXg.png)

（由于没有这个 cos，所以上传失败）

在日常使用过程中，可能会存在部署同样一段代码的情况。

比如，我部署了 A 代码，又部署了 B 代码。之后，我想重新部署 A 代码，按照传统方法是可以再次上传 A 代码，但如果 Package 比较大，就比较难受了。而新版本的 CLI 经过测试，130M 的 Package 首次部署使用 25s，第二次部署同样的文件，只需要 2s。

**附：COS 的相关计费链接**

- 免费额度：

https://cloud.tencent.com/document/product/436/6240

- 计费概述：

https://cloud.tencent.com/document/product/436/16871

- 计费方法：

https://cloud.tencent.com/document/product/436/36522

- 产品定价

https://cloud.tencent.com/document/product/436/6239

### **2：部署历史版本**

代码部署过程中，如果出现问题，需要恢复历史版本。新版本的 SCF CLI 支持部署历史版本，在大家使用了 using-cos 之后，可以通过 deploy 的参数 --history 来部署历史版本：

![Serverless](https://img.serverlesscloud.cn/qianyi/images/YHl6UWa9s63gXEueAufpULb25PiblSh96iauREHKWb1SQzGyMaVl1OQXAODxz4ia9KsZmrWodQC3NQovBVNeGoK7w.png)

选择一个历史版本，就可以直接实现文档回滚：

![Serverless](https://img.serverlesscloud.cn/qianyi/images/YHl6UWa9s63gXEueAufpULb25PiblSh96Uk1xQGS42XtJO6hq2c4nZkp583icT68uP88xa4vwomPZMPgtLRK5Tibw.png)

### **3：打包功能优化**

旧版 SCF CLI 会把用户目录下的全部文件打包，新版 SCFCLI 在这方面也做了重点优化，可以直接指定 ZIP，指定某文件，并且打包的时候会默认去除 .git 等隐藏目录，并且在 deploy 之后，默认删除之前的打包信息。

Yaml 文件可以这样：

![Serverless](https://img.serverlesscloud.cn/qianyi/images/YHl6UWa9s63gXEueAufpULb25PiblSh96uv0Zkaib7sibX0S8cvfwDiaxuufSyCQTLK8ghx5pNicJG6qoicnKnEPJuwA.jpg)

## **二、新增 Delete 功能**

旧版 SCF CLI 不支持 Delete 功能，在新版中，大家可以轻松自在地使用：

![Serverless](https://img.serverlesscloud.cn/qianyi/images/YHl6UWa9s63gXEueAufpULb25PiblSh96CSO9LdzKgvwYMzyEehUx0Qfwq7BmLibHALIXs58XZwcnuKs9OZptFjg.png)

只需要输入 scf delete --help 就可以看到使用方法和参数描述哦！

## **三、新增 List 功能**

以往，如果想查看云函数的内容，或者我部署了哪些函数，是需要去控制台挨个区域、挨个 namespace 查看。现在无需繁琐，通过 List 指令即可实现：

![Serverless](https://img.serverlesscloud.cn/qianyi/images/YHl6UWa9s63gXEueAufpULb25PiblSh96jRoZLlMoYjKViaYjS7BnygORWyP09aEKqEMaIMyHYQMWwd6O4k5YXibw.png)

同样可以通过 SCF 的 --help 来查看所有用法：scf list --help

## **四、帮助文档的优化**

上面的很多说明，都是让大家使用 --help 来查看帮助，那么在新版中，--help 有哪些大的优化呢 —— 全局的帮助文档优化，在任何指令下都可以 --help 查看帮助：

![Serverless](https://img.serverlesscloud.cn/qianyi/images/YHl6UWa9s63gXEueAufpULb25PiblSh966w7Vpzewq0pJ74TdXflJW22FTPhx1TsOovCkG7aP9J1AjPdY0gUW4w.png)

在指令页面可以进行例子查看：

![Serverless](https://img.serverlesscloud.cn/qianyi/images/YHl6UWa9s63gXEueAufpULb25PiblSh96pPkmXydaDTSgNBfpibysHrGl3icj5Xe6qicoX7LhafibgracKdVicwJtf3Q.jpg)

每个主要的指令，都会有指令的描述以及使用例子，同时规范了参数描述。

## **五、API 网关部分**

现有 SCF CLI 在使用 API 网关的时候每次都需要新建，如果不想新建，就需要注释配置文件或者使用 --skip-event，这让很多用户头疼。新版 SCF CLI 在 API 网关部分增加了 ServiceId 字段：

![Serverless](https://img.serverlesscloud.cn/qianyi/images/YHl6UWa9s63gXEueAufpULb25PiblSh96Ku9Afpqr8CnT4C7FqicnEXRSMBf0wUfDGmK93YhiaJNibWtqJ76H2FtnA.png)

有了这个字段，大家使用的时候可以直接选择绑定已有网关。新建网关之后，系统会进行提示：

![Serverless](https://img.serverlesscloud.cn/qianyi/images/YHl6UWa9s63gXEueAufpULb25PiblSh96YDBYWaIF9qlIvicRELqUy61XatG8ks1Kanc7UQhrhTZRL8to5WibpvJw.png)

把对应的网关 ID 填写上即可避免下次创建。这样一个简单的字段增加，给小伙伴们带来了两个优秀的体验：

    1：可以绑定现有的 API 网关，不需要新建

    2：可以保证现有网关形态，不会每次新建

## **六、输出信息优化**

有心的小伙伴应该注意到了，本次更新，UI 变化非常大。在我们使用云函数的时候，不同表达会用不同的颜色显示：

![Serverless](https://img.serverlesscloud.cn/qianyi/images/YHl6UWa9s63gXEueAufpULb25PiblSh96TeaLxkmnfbNTt5toAnfpy0RN4GKEUcac5PEQTf74AhfmJvcKib14feA.jpg)

同时，Deploy 之后，大家不用打开网页看云函数信息，而是通过控制台直接看到：

![Serverless](https://img.serverlesscloud.cn/qianyi/images/YHl6UWa9s63gXEueAufpULb25PiblSh96hXeEeMk0tLHunctaROXEuGibLcicOaVwZJIJ3GghZiaNjQg6Hm7KQ0ictw.png)

# **实验**

## **Hello world**

以 Hello World 为例，通过帮助查看 init 创建指令：

scf init --help

![Serverless](https://img.serverlesscloud.cn/qianyi/images/YHl6UWa9s63gXEueAufpULb25PiblSh96AarTsFfKgyxUMqYrAibSXYn4aU69nujprzw2wGWficvNsLYTROhM8kTw.png)

根据例子创建 Python 语言的 hello world：

scf init --runtime python3.6

![Serverless](https://img.serverlesscloud.cn/qianyi/images/YHl6UWa9s63gXEueAufpULb25PiblSh96DCRnl3ObQYzibibG8dDLs6mH3M7tEdcbBcibCOLQN4D50q0yH8RU5RdVQ.png)

按照提示：cd hello\_world 进行项目编辑

![Serverless](https://img.serverlesscloud.cn/qianyi/images/YHl6UWa9s63gXEueAufpULb25PiblSh96X2Dib8q8brTyrcCxAS1jk8UjOL4ia07QdCtTRfNDWicaoA0o6gn6ib9fuA.png)

修改代码和配置网关：

![Serverless](https://img.serverlesscloud.cn/qianyi/images/YHl6UWa9s63gXEueAufpULb25PiblSh96NjGicicnNK4sfIoH7Nnl7owr8ZMntGPTHG18xkID6qOvA34TQKtibPtHA.png)

网关这里要用，我不想新建网关，而是想要用已经有的一个 API 网关：

![Serverless](https://img.serverlesscloud.cn/qianyi/images/YHl6UWa9s63gXEueAufpULb25PiblSh96c3R13zffl2gI58xFsgUGavWv32XFicvWLB3Fdg2rR3SEzltHZ7cFEgg.jpg)

填写好 serviceeId：

![Serverless](https://img.serverlesscloud.cn/qianyi/images/YHl6UWa9s63gXEueAufpULb25PiblSh96EAaN7BsGZ0nsrr4guPug8CZb9WkccFKmRGyKva1bVHpLJJNoppKDMQ.png)

然后保存退出，Deploy:

![Serverless](https://img.serverlesscloud.cn/qianyi/images/YHl6UWa9s63gXEueAufpULb25PiblSh96euukc42jyhqAdQYW8rZYwRRKbCkrMW4iaznXgKF5pXQyzoY28a8GIaA.jpg)

部署之后，输出函数信息：

![Serverless](https://img.serverlesscloud.cn/qianyi/images/YHl6UWa9s63gXEueAufpULb25PiblSh96niaVOpCbUB8Md9Bn3Mkysic7evFQ0Bz0YnHfPd8xxjBoYibX2CXcE8IbQ.png)

打开 API 网关中 subDomain：

![Serverless](https://img.serverlesscloud.cn/qianyi/images/YHl6UWa9s63gXEueAufpULb25PiblSh969CYQNv2UtzebCwlwoXxLfqbPRl6WRum6tNejOZXybKkicCUkRQIlNWA.png)

部署成功！

## **查看函数列表**

只需要输入 scf list

![Serverless](https://img.serverlesscloud.cn/qianyi/images/YHl6UWa9s63gXEueAufpULb25PiblSh96vULKgk2padpta42yxwdVnqEQPYNn5WVnM3D7FibEvUqWr7LyF5tsCNA.png)

## **删除函数**

只需要输入需要删除的函数相关信息：

scf delete --name hello\_world --region ap-shanghai --namespace default

![Serverless](https://img.serverlesscloud.cn/qianyi/images/YHl6UWa9s63gXEueAufpULb25PiblSh964n04flqku2B3jEvAxehwhXnTb2w4nmpvWYtnCqgfE3wYFFDHWSSS7g.png)

本文关于命令行工具的介绍和实践就暂告一段落。更多功能，等待各位小伙伴自行挖掘哦！