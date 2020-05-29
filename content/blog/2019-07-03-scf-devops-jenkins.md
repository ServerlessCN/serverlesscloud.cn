---
title: 云函数 SCF 场景下的 DevOps 实现 —— Jenkins 篇
description: "本文意图描述在 SCF 场景下，如何基于 Jenkins 搭建自己的 CI/CD 流程"
keywords: Serverless,serverless cloud function,无服务器架构
date: 2019-07-03
thumbnail: https://img.serverlesscloud.cn/2020414/1586871710979-%E5%85%AC%E5%85%B1%E7%94%A8.png
categories:
  - guides-and-tutorials
authors:
  - 李帅
authorslink:
  - https://zhuanlan.zhihu.com/ServerlessGo
tags:
  - DevOps
  - Serverless
---

当前Serverless热度越来越高，越来越多的开发者们开始抛弃传统开发模式基于Serverless来搭建自己的产品服务。在享受腾讯云Serverless产品SCF的免运维、低成本优势的同时，也要适应SCF与传统开发模式的差异。其中DevOps便是很重要的一环，因为SCF特有的runtime，使得开发者无法复用现有DevOps平台完成CI/CD流程。


为此，腾讯云中间件团队基于Jenkins、CODING企业版以及蓝盾三种DevOps方案进行了整合打通，本文意图描述在SCF场景下，如何基于Jenkins搭建自己的CI/CD流程。后续，将会介绍基于其他两种方案的DevOps实现。

**前言**

本文核心目的在于描述SCF与现有DevOps平台结合的实践，以Jenkins为例。因此不会介绍过多背景知识。因此假设你已经具备以下技能。


- Jenkins或类似平台使用背景。
- 了解SCF产品
- scf cli，SCF的命令行工具：https://github.com/tencentyun/scfcli

**源码介绍**

git地址：

https://github.com/NevenMoore/scf\_devops\_demo

![](https://img.serverlesscloud.cn/qianyi/YHl6UWa9s637BIpOjtIJMe3ciaW6QJ4lya3gH7dv8mu3LSJoDUiabVuyXsaEL2mYsXAa1A4SUicTpP0ptae21RiaeA.jpg)

1. **Jenkinsfile, jenkins的pipeline描述文件。**

```javascript
pipeline {agent any

stages {stage('Checkout') {steps {echo "Checkout"git 'https://github.com/NevenMoore/scf_devops_demo.git'}}stage('Build') {steps {echo 'Building'sh "pip install -r requirements.txt"}}stage('Test') {steps {echo 'Testing'script {ret = sh(script: "scf native invoke -t ./template.yaml --no-event", returnStatus: true)if (ret != 0) {echo '[Test] Failed'currentBuild.result = 'FAILURE'return}}

}}stage('Deploy - Staging') {steps {echo 'Deploy - Staging'}}stage('Sanity check') {steps {input "Does the staging environment look ok?"}}stage('Deploy - Production') {steps {echo 'Deploy - Production'script {ret = sh(script: "scf package -t ./template.yaml", returnStatus: true)if (ret != 0) {echo '[Deploy] Failed'currentBuild.result = 'FAILURE'return}ret = sh(script: "scf deploy -t ./deploy.yaml -f", returnStatus: true)if (ret != 0) {echo '[Deploy] Failed'currentBuild.result = 'FAILURE'return}}}}}

post {success {echo 'I succeeeded!'}unstable {echo 'I am unstable :/'}failure {echo 'I failed :('}changed {echo 'Things were different before...'}}}
```

    1. Checkout:检出，从github拉取代码。
    2. Build: 用pip安装项目依赖。
    3. Test：测试，SCF有自己的runtime，SCF命令行可模拟线上环境。
    4. Deploy - Staging： 灰度发布，当前云上灰度能力未完全开放，暂且跳过。
    5. Sanity check：发布审批。
    6. Deploy - Production：发布上线，这里利用了scf cli的发布能力。

2. index.py。就是scf cli init出来的helloworld模版，为了演示build阶段，特意import flask。

```javascript
# -*- coding: utf8 -*-import flask
def main_handler(event, context):print(str(event))return "hello world"
```

3. template.yaml, scf的元信息文件，例如runtime，memsize等信息，可参见scf cli文档。

**Jenkins pipeline配置**

![](https://img.serverlesscloud.cn/qianyi/YHl6UWa9s637BIpOjtIJMe3ciaW6QJ4lymbUOgSibqR9xicK4vABvBVsWAfDhkkSZB7TU75ulKrMjd47XGjlJ09oQ.jpg)

![](https://img.serverlesscloud.cn/qianyi/YHl6UWa9s637BIpOjtIJMe3ciaW6QJ4lyKNxGiatTSaw6ld7qjfoUSstzliaQqKWh04JybsEY88X9vWCicptubR2Ng.jpg)

比较简单，将上面的jenkinsfile内容粘贴下配置即可完成。

**触发&构建**

**>>>>**

**触发**

简单起见在jenkins上手动出发流程（当然你可以选择webhooks）自动触发。

![](https://img.serverlesscloud.cn/qianyi/YHl6UWa9s637BIpOjtIJMe3ciaW6QJ4lyAjBoSxUpcicMXpn9hviaWOJbLVLpOicAticVa6nTT2O54ialksPhVfepibrA.jpg)

**>**>>>

**阶段视图**

可以看见前面的checkout->build->test>Deploy - Staging阶段已自动化完成，因为上面配置了人工确认，手动确认后pipeline会将scf发布到腾讯云现网环境。

![](https://img.serverlesscloud.cn/qianyi/YHl6UWa9s637BIpOjtIJMe3ciaW6QJ4lyicj2fDriatsAq3RraqdVEE4CaoQMkYWtgdT1oibFX7hH4DnKkajeFrkZA.jpg)

![](https://img.serverlesscloud.cn/qianyi/YHl6UWa9s637BIpOjtIJMe3ciaW6QJ4lysvHM47k70A31YZKsOcOgvLf8wr8lVfNTsTtPydTiazHGb5zkG8aMaGg.jpg)

**>>>>**

**完整输出**

```javascript
Running in Durability level: MAX_SURVIVABILITY[Pipeline] Start of Pipeline[Pipeline] nodeRunning on Jenkins in /var/lib/jenkins/workspace/scf_devops_demo[Pipeline] {[Pipeline] stage[Pipeline] { (Checkout)[Pipeline] echoCheckout[Pipeline] gitNo credentials specified> git rev-parse --is-inside-work-tree # timeout=10Fetching changes from the remote Git repository> git config remote.origin.url https://github.com/NevenMoore/scf_devops_demo.git # timeout=10Fetching upstream changes fromhttps://github.com/NevenMoore/scf_devops_demo.git> git --version # timeout=10> git fetch --tags --progress https://github.com/NevenMoore/scf_devops_demo.git +refs/heads/*:refs/remotes/origin/*> git rev-parse refs/remotes/origin/master^{commit} # timeout=10> git rev-parse refs/remotes/origin/origin/master^{commit} # timeout=10Checking out Revision a500383602e314911b62a74045295f0008b0288f (refs/remotes/origin/master)> git config core.sparsecheckout # timeout=10> git checkout -f a500383602e314911b62a74045295f0008b0288f> git branch -a -v --no-abbrev # timeout=10> git branch -D master # timeout=10> git checkout -b master a500383602e314911b62a74045295f0008b0288fCommit message: "flask"First time build. Skipping changelog.[Pipeline] }[Pipeline] // stage[Pipeline] stage[Pipeline] { (Build)[Pipeline] echoBuilding[Pipeline] sh+ pip install -r requirements.txtRequirement already satisfied: flask in /usr/local/lib/python3.6/site-packages (from -r requirements.txt (line 1)) (1.0.2)Requirement already satisfied: click>=5.1 in /usr/local/lib/python3.6/site-packages (from flask->-r requirements.txt (line 1)) (6.7)Requirement already satisfied: itsdangerous>=0.24 in/usr/local/lib/python3.6/site-packages (from flask->-r requirements.txt (line 1)) (1.1.0)Requirement already satisfied: Werkzeug>=0.14 in/usr/local/lib/python3.6/site-packages (from flask->-r requirements.txt (line 1)) (0.14.1)Requirement already satisfied: Jinja2>=2.10 in /usr/local/lib/python3.6/site-packages (from flask->-r requirements.txt (line 1)) (2.10)Requirement already satisfied: MarkupSafe>=0.23 in/usr/local/lib64/python3.6/site-packages (from Jinja2>=2.10->flask->-r requirements.txt (line 1)) (1.1.1)[Pipeline] }[Pipeline] // stage[Pipeline] stage[Pipeline] { (Test)[Pipeline] echoTesting[Pipeline] script[Pipeline] {[Pipeline] sh+ scf native invoke -t ./template.yaml --no-eventSTART RequestId: 59d1d0b0-c206-4a6d-a025-ebd364952bc9{}
END RequestId: 59d1d0b0-c206-4a6d-a025-ebd364952bc9REPORT RequestId: 59d1d0b0-c206-4a6d-a025-ebd364952bc9 Duration: 0 ms BilledDuration: 100 ms Memory Size: 128 MB Max Memory Used: 32 MB

"hello world"[Pipeline] }[Pipeline] // script[Pipeline] }[Pipeline] // stage[Pipeline] stage[Pipeline] { (Deploy - Staging)[Pipeline] echoDeploy - Staging[Pipeline] }[Pipeline] // stage[Pipeline] stage[Pipeline] { (Sanity check)[Pipeline] inputDoes the staging environment look ok?Proceed or AbortApproved by 帅哥[Pipeline] }[Pipeline] // stage[Pipeline] stage[Pipeline] { (Deploy - Production)[Pipeline] echoDeploy - Production[Pipeline] script[Pipeline] {[Pipeline] sh+ scf package -t ./template.yamlGenerate deploy file 'deploy.yaml' success[Pipeline] sh+ scf deploy -t ./deploy.yaml -fdeploy default begindefault scf_devops_demo already exists, update it nowDeploy function 'scf_devops_demo' successdeploy default end[Pipeline] }[Pipeline] // script[Pipeline] }[Pipeline] // stage[Pipeline] stage[Pipeline] { (Declarative: Post Actions)[Pipeline] echoThings were different before...[Pipeline] echoI succeeeded![Pipeline] }[Pipeline] // stage[Pipeline] }[Pipeline] // node[Pipeline] End of PipelineFinished: SUCCESS
```

**>>>>**

**控制台检验**

scf\_devops\_demo函数已经正确上传。

![](https://img.serverlesscloud.cn/qianyi/YHl6UWa9s637BIpOjtIJMe3ciaW6QJ4lysYicZQYT0FHt9lzrNgah2MgSHaEIqlym4rjfNoPHHuibr0sPpibFSia5Pw.jpg)

**总结**

从阶段视图可以看出SCF环境下的DevOps并没有什么不同。唯一的区别在于SCF有自己的runtime，需要官方提供的scf cli来模拟线上运行环境。deploy阶段直接用scf cli相比写代码云API也简单了许多。

对于一些有特殊需求的SCF用户(私网CI/CD)，本文有一定借鉴作用。

![](https://img.serverlesscloud.cn/qianyi/YHl6UWa9s637BIpOjtIJMe3ciaW6QJ4lyQkY6JNRXyA6coIQAelicCsCJALKibco8ul7Tl1N0kiatqpNmOBjHs6ibkg.jpg)

最后，pip install scf。下载一个scf cli，上车。

> **传送门：**
> - GitHub: [github.com/serverless](https://github.com/serverless/serverless/blob/master/README_CN.md) 
> - 官网：[serverless.com](https://serverless.com/)

欢迎访问：[Serverless 中文网](https://serverlesscloud.cn/)，您可以在 [最佳实践](https://serverlesscloud.cn/best-practice) 里体验更多关于 Serverless 应用的开发！
