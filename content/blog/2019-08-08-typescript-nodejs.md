---
title: 云函数 + TypeScript + Node.js 最佳实践探索
description: 本文使用了 Typescript 和 nodejs 开发，实现一个部署在腾讯云云函数 SCF 上的小工具
keywords: Serverless
date: 2019-08-08
thumbnail: https://img.serverlesscloud.cn/2020414/1586850934183-%E5%B0%81%E9%9D%A2%E5%9B%BE%20%285%29.png
categories:
  - guides-and-tutorials
  - user-stories
authors:
  - 朱理锋
authorslink:
  - https://zhuanlan.zhihu.com/ServerlessGo
tags:
  - TypeScript
  - Node.js
---

## 目的

最近 Serverless 愈来愈火，我刚好在培训，比较有时间去尝试一些新东西，所以趁这个时候去使用下 Serverless，尝试使用 Typescript 和 nodejs 开发，部署在腾讯云 SCF 上的一个小工具，探讨下 Typescript+ Node.js + SCF 的最好实践模式，并同时抛钻引玉，希望有同学提供更好的方案。

## 项目介绍

### 一、想法


本人有时候会追剧，但是剧集更新时，我一般都是不知道的。只有空闲的时候，才会特地去查看它们有没有更新。如果有这么一个工具，能够在剧集更新的时候，主动告诉我，那么我就不用时不时去查询，对我来说就会方便很多。

在我没有接触到 Serverless 之前，我的想法是这样的 —— 写这样的程序并不难，但是我得买个机器部署啊？如果有问题不能及时发现，还得上机器查日志，或者自己去控制程序定时爬取的逻辑等等。

**总的来说就是，实现与维护一个这样的程序的成本远大于了其带给我的便利，让我有想法却懒于行动。**

但是有了 Serverless 后，以上问题将不再是问题。例如部署难题，使用 Serverless 就是使用云供应商提供的开发者工具，用它创建函数，打包上传代码即部署成功；又例如定时爬取逻辑，使用其提供的定时触发器能力即可。这让我能更专注于代码实现。

在此，我不会很官方地去讲 Serverless 的概念以及好处，仅仅是从一个开发者的角度来阐述我的想法。

### 二、实践

**1、流程图**

程序的整个流程图如下图所示，逻辑很简单，这个项目的目的不在于实现一个多厉害的功能，而在于 Typescript + Node.js + SCF 的实践方式的探索。

![](https://img.serverlesscloud.cn/tmp/640-20200414190824497.png)

**2、开发**

开发能在 SCF 运行的Node.js 程序的其实与传统的开发Node.js 程序在语言编写上并没有太大区别。比较明显的不同在于，我们开发时得有一个入口的函数，比如像这样：

![](https://img.serverlesscloud.cn/tmp/640-20200414190829367.png)

更具体的入门文档，可以看[此处](https://cloud.tencent.com/product/scf/getting-started)，跟着文档一步步学习编写一个简单的函数。接下来回归正题。

**a. 环境搭建**

首先为了方便开发，建议安装腾讯云 SCF 提供的命令行工具或者 vscode 插件。但是这里我开发的时候 vscode 插件还没发布，所以这里主要使用命令行工具，命令行工具的安装与使用的文档，具体可以看[此处](https://cloud.tencent.com/document/product/583/33445)。

安装好后，使用 scf init（**具体参数得去看文档填写，这个提个建议，scf init提供交互式操作，采取问答的模式去创建**）创建一个项目、项目文件很简单，一共就四个文件，前三个，应该不多做介绍。第四个文件 template.yaml 称为模板文件，简单来说是描述这个函数的文件，比如函数的环境变量，触发器类型等等，具体还是前往[文档处](https://cloud.tencent.com/document/product/583/33454)查看吧。

![](https://img.serverlesscloud.cn/tmp/640-20200414190339028.png)

接下来，就是正常配置 tsconfig.json，如果没有安装 typescript 的同学请去官网安装，然后 tsc --init 就可以快速生成一个 tsconfig.json，然后根据自己的需求配置即可。

然后，就是编写 npm scripts。

主要就三个操作，build，dev，deploy。

可以使用 npm scripts 把 typescript 的编译和 SCF CLI 的本地调试，打包和部署串联在一起，使需要敲打的命令简洁和语义化

![](data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==)

最后，将本地仓库与远程仓库关联起来。（**这里提一个优化：有一种场景是用户已经创建了一个 git 仓库，现在需要将仓库里的代码写成 SCF 模式下的代码，并配合 SCF CLI 使用，目前 SCF CLI 只支持 init 一个完整的项目，如果支持在一个已有项目中快速生成调试和部署的 yaml，对开发者来说是一个比较方便的功能**）

**b. 编码**

![](https://img.serverlesscloud.cn/tmp/640-20200414190346222.png)

我的主要逻辑代码分为上面的文件。

- index，没什么好说的，就是一个入口文件，负责组合其余模块的逻辑。
- config 以及 config\_extra，config\_extra 文件放了我的隐私配置，例如 redis 的 host，port 和密码以及邮件服务的授权码等，这些配置通过配合 .gitignore 是不会提交到远程 git 仓库，而 config 文件 则是引入 config\_extra 文件中的配置，并与一些通用配置进行 merge，然后输出到各个模块。（注：此处也可以好好利用scf提供的环境变量功能，很适合这种场景，[具体文档](https://cloud.tencent.com/document/product/583/30228)）
- config\_extra\_demo，告诉别的开发者，config\_extra 文件应该如何编写
- mailer，封装邮件服务的初始化以及发送邮件方法
- redis，封装 redis 的连接以及同步 set 以及 get 方法
- task，暂时简单封装了下初始化以及执行的通用逻辑。但日后该工具扩展，此处仍得考虑如何抽象以及通用化。
- util，封装了一些公用方法，例如封装了 retry 方法，来包装一些异步函数。

上面简单介绍下主要逻辑代码的文件，具体的实现，有兴趣可以移步到 [Github 地址](https://github.com/Juliiii/scf-crawler) 查看

**3、调试**

上面也有提到我编写的 npm scripts 里有 npm run dev 的一条。本人开发这个项目时，调试都执行 npm run dev 来进行调试。这里提一下，测试环境一般是需要和正式环境隔离的。所以可以新建一个 env.json 文件，里面填写

```javascript
  {    "NODE_ENV": development  }
```

并将 npm script 中的 dev 命令改成 npm run build && scf local generate-event timer timeup | scf native invoke --template template.yaml --env-vars env.json

然后在配置文件中根据 process.env.NODE\_ENV 变量来判断是测试环境还是正式环境，并填写对应环境依赖的服务的配置即可。

**4、部署**

上面讲了这么多，其实都不是我最想表达的，因为我并没有在上面遇到一些很棘手的问题。而在部署的时候，我才发现在使用 typescript 时，~~无法在~~~~**腾讯云 SCF 目前的部署要求**~~~~以及~~~~**项目的文件目录管理**~~~~中做到完美的配合~~。

![](https://img.serverlesscloud.cn/tmp/640-20200414190354330.png)

后面和同事讨论后，还是有不错的方法是达到两者的平衡。**下面是我的多次尝试的一个过程**。

如果不使用 typescript，仅使用 js 编写 nodejs 程序，则不需要编译的过程，部署函数时，只需要打包然后部署即可；但是使用 typescript 后，则多了一步将 ts 代码编译成 js 代码的步骤。为了管理好项目的文件目录，我倾向于 ts 和 js 文件分别存放在不同的文件夹，例如，src 文件夹存放 ts 文件，dist 则是编译后得到的 js 文件。我一开始的文件目录便是如此。

**第一次尝试**

→ 文件目录：

![](https://img.serverlesscloud.cn/tmp/640-20200414190400410.png)

→ tsconfig.json 指定编译 src 文件夹下的 ts 文件，输出到 dist 文件夹

![](https://img.serverlesscloud.cn/tmp/640-20200414190406007.png)

→ template.yaml CodeUri 指向 dist 文件夹

![](https://img.serverlesscloud.cn/tmp/640-20200414190409495.png)

根据上面的配置，在本地调试是可以的。但是当部署到云上，测试是失败的。如果大家熟练的话可以立刻发现问题所在，打包没有把 node\_modules 打包进去。主要逻辑代码依赖的第三方库全都找不到，测试当然失败了。

**第二次尝试**

根据第一次尝试，我使用 npm scripts 的 pre 钩子，在执行部署前，编辑 ts 代码，同时把 node\_modules 拷贝到 dist 文件夹，然后再打包部署解决了这个问题。

→ package.json

![](https://img.serverlesscloud.cn/tmp/640-20200414190416798.png)

→ copy\_node\_modules.js

![](https://img.serverlesscloud.cn/tmp/640-20200414190421368.png)

→ dist 文件夹下的文件

![](https://img.serverlesscloud.cn/tmp/640-20200414190425716.png)

虽然这样做可以运行了，在本地文件目录管理合理，但是提交到云上的代码是编译后的，基本没啥可读性，就是一坨能运行的东西，项目代码也不完整。所以个人认为，**最完美的是本地开发的项目代码和交到云上的项目代码是一致的，不需要通过额外的脚本去阉割**。虽然目前腾讯云 SCF 控制台的 webIDE 还只是能看入口文件，不过之后会接入 Cloud Studio，起码可以看到整个代码文件夹的每个文件，说不定以后就支持在线支持 typescript 编译（虽然不知道可不可能）。所以本人开始了第三次尝试。

**第三次尝试**

我有一个想法：**template.yaml 中指定的 Handler，即入口函数，从 index.main\_handler 写成 文件夹 /index.main\_handler，即入口函数可以在某个文件夹里**。

我在 template.yaml 处的 Handler 写成 dist/index.main\_handler，CodeUri 写成了根目录，这样就可以打包整个文件夹，然后指定 Handler 为 dist 文件夹的 index 文件的 main\_handler 函数。

→ template.yaml

![](https://img.serverlesscloud.cn/tmp/640-20200414190431134.png)

**本地调试时，是成功的！**

但是在部署的时候，

![](https://img.serverlesscloud.cn/tmp/640-20200414190436409.png)

额，好吧，我觉得是这个方案是不行的了，因为不符合 SCF 的要求，通过不了校验。

**第四次尝试**

这是我第四次尝试。但是不是最完美的，在**文件管理退了一步，允许 ts 和编译后的 js 放在一起**。这样能做到把整个项目都打包上去，而且可运行，但是 ts 和 js 放在一起，文件管理不太合理。修改的地方如下：

index.ts 文件从 src 文件夹移动到根目录

→ tsconfig.json

编辑根目录下的 index.ts 和 src 文件夹下的 ts 文件，剔除 node\_modules，输出到根目录

![](https://img.serverlesscloud.cn/tmp/640-20200414190441537.png)

![](data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==)

→ template.yaml

CodeUri 改成根目录，Handler 改成 index.main\_handler，即跟 CLI 生成的一样

![](data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==)

编译后结果

![](data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==)

最后部署到云上 SCF，是可以运行的，而且是把整个项目都打包了上去，日后腾讯云 SCF 接入了 Cloud Studio，WebIDE 看到的文件架构和本地看到的文件架构是一致的。

**第五次尝试**

兜兜转转，有时候问题解决很简单。和组内同事讨论后，一位大佬同事点出 —— **可不可以在根目录写一个 index 文件，然后调用编译后的 index 文件的入口方法?**。

一语惊醒梦中人！是的，一开始就没注意到，还可以这样解决，思维一直在一个圈子里绕来绕去，没有跳出来。这样做的成本很低，而且能达到了我之前说到的理想状态：

**本地开发的项目代码和交到云上的项目代码是一致的，不需要通过额外的脚本去阉割**

实施方法即是，**把 typescript 文件放在 src 文件夹下，编辑后的 js 文件放在 dist 文件夹下，在根目录编写一个 index.js 文件，文件里的 main\_hanlder 方法调用编译后的 index 文件的入口函数**，下面是一些核心代码。

→ index.js

![](https://img.serverlesscloud.cn/tmp/640-20200414190446646.png)

→ tsconfig.json

![](https://img.serverlesscloud.cn/tmp/640-20200414190500120.png)

→ template.json

![](https://img.serverlesscloud.cn/tmp/640-20200414190504191.png)

→ 编译后结果

![](https://img.serverlesscloud.cn/tmp/640-20200414190510798.png)

### 三、成果

简单展示下代码线上运行后的结果。

![](https://img.serverlesscloud.cn/tmp/640-20200414180355894-20200414190516921.png)

![](https://img.serverlesscloud.cn/tmp/640-20200414180325016.png)

## 总结

上面说了这么多，这里给一个总结就是 —— 虽然腾讯云 SCF 没有原生支持 TypeScript，但是经过一些方法还是可以做到两者的完美配合。

首先本地开发是没啥问题的，上面提到的尝试，都是为了能够在本地调试成功的同时可以部署到云上。

主要是部署的问题，其中可行的三个尝试：

- 第一个 是通过一些额外的方法去适配，但是做不到云上的项目和实际的项目的一致，如第二次尝试。
- 第二个 是文件管理上退了一步，不做到极致的分明，如第四次尝试。
- 第三个 是在根目录写一个 index.js 文件，调用具有真正逻辑的入口函数，做个转发，如第五次尝试，也就是本人认为目前最好的实践方式。

最后，以上的五个尝试，是本人开发的时候的想法与实践，也许不太正确，有误欢迎大家来批评。如果大家有更好的方法，欢迎讨论。五次尝试的源码都在 [Github 地址](https://github.com/Juliiii/scf-crawler)，前四次尝试均有对应分支，master 分支为第五次尝试。

---

> **传送门：**
>
> - GitHub: [github.com/serverless](https://github.com/serverless/serverless/blob/master/README_CN.md) 
> - 官网：[serverless.com](https://serverless.com/)

欢迎访问：[Serverless 中文网](https://serverlesscloud.cn/)，您可以在 [最佳实践](https://serverlesscloud.cn/best-practice) 里体验更多关于 Serverless 应用的开发！
