---
title: Serverless 动态博客开发趟「坑」记
description: 本文为 Serverless 社区成员撰稿。作者云洋，从事信息管理工作，多年电子政务信息系统建设管理经验，对 Serverless 技术和架构有浓厚兴趣。
keywords: Serverless 动态博客开发,Serverless 动态博客,Serverless 开发
date: 2020-03-12
thumbnail: https://img.serverlesscloud.cn/2020318/1584508229341-blogging.jpg
categories:
  - user-stories
authors:
  - 云洋
authorslink:
  - https://zhuanlan.zhihu.com/ServerlessGo
tags:
  - Serverless
  - 动态博客
---

这个假期挺长的，不过有幸在腾讯云 Serverless 在线直播里看到了 Serverless 的相关课程，从第一期学完，还是凭添了很多学习乐趣。

前面三节课学了一些 Serverless 的基本知识和架构特点，也跟着开发部署，其实都蛮有趣的，唯一就是都没有管理后台。第四期课程很好的弥补了这一不足。刘宇老师给大家带来的项目 Python+HTML 的动态博客，后台是基于 Flask 的，虽然我不太熟悉这个框架，但是老师给提供了课程的源码，所以可以先用后学。

- 这节动态博客的直播回放地址是：

  https://cloud.tencent.com/edu/learning/live-1926

- 刘宇老师的项目的 Github 地址是：

  https://github.com/anycodes/ServerlessBlog

直播那天我提前准备好手机和电脑，就进教室了，不过当天课程收到网络的干扰很大，一直很卡，后来刘老师重新录制了课程，据说录到凌晨两点，这一点必须点赞，敬业精神太感人啦。在老师的热情带领下，我们的学习劲头也是十足的啊。

我的学习路径可谓十分曲折，整整折腾了三天，不过最后终于实现了项目的成功部署，很开心！

整体来说，其实项目部署就是四个步骤：

1. 下载源文件
2. 执行init.py
3. 修改 serverless.yaml 文件
4. sls --debug 部署到云端。

我在每一个步骤都踩过坑，我基本上按照顺序把坑和解决方案列出来，感兴趣的同学可以基于上面的链接尝试开发部署，如果遇到相关的坑，可以对照参考。

## 坑一：Git 下载报错

Git下载报错，错误信息是这样如下：

```
remote: Counting objects: 100% (1438/1438), done.remote: Compressing objects: 100% (1100/1100), done.error: RPC failed; curl 18 transfer closed with outstanding read data remainingfatal: The remote end hung up unexpectedlyfatal: early EOFfatal: index-pack failed
```

百度之后，发现针对RPC错误需要修改Git的buffer，调到700M后依然报了上面的fatal错误，和网络有关，最后放弃用git，选择老师发在文档里的压缩包，地址上面列出来了，大家可以去自行取用。

## 坑二：pip 的源设置和 pymysql

部署过程中因为 init.py 里面用到了 pymysql，可是我没有安装，于是打开Anaconda Prompt 开始用 pip 安装，然而 pip 好像死了一样，完全没有反应，最后报错说找不到包。后来经同学和老师提醒，修改 pip 的源到国内，我用了清华的源，速度一下很快啊，安装成功。修改源的代码是：

```
pip install pymysql -i https://pypi.tuna.tsinghua.edu.cn/simple
```

如果大家需要安装其他包，就把 pymysql 换成要安装的包。

但是 init.py 依然报错，于是就吧 pymysql 的包放在项目目录中，解决了问题。



## 坑三：yaml 没有 FullLoader 属性

init.py 的执行一致不顺利，pymysql 的坑填完后继续报错。

![img](https://img.serverlesscloud.cn/2020318/1584511211265-IMG_0189.PNG)

于是以为自己没有安装对 yaml，后来老师建议删掉该语句，大家要注意，这个语句里 Fullloader 出现在一个逗号后面，所以我们只删掉逗号后面的 loader=yaml.FullLoader 就好了。



## 坑四：数据库连接

其实如果用老师提供的测试库的话，这个坑就不是问题，但是我觉得那么多同学做作业，老师的库压力会很大，正好我自己买了一个腾讯的云数据库是 MySql的，可以直接拿来用。

于是我就天真的把数据库地址改成了自己的，以为它可以连上，但是连接超时，于是我有把用户和密码改成自己的，结果还是拒绝访问，一直到我去云数据库控制台去测试连接，才发现原来我的数据库端口没有写对。

云数据库的外网链接设置还是很方便的，这次作业让我还进入了 PMA，进行了在线数据库操作，挺好用的。到这里，init.py 的坑就填平了，我看到新建数据库的成功。



## 坑五：网络问题

这个坑有点深，我在里面爬了两天才爬出来，而且之所以爬出来，完全是因为换了网络哦。

不得不说移动的家庭宽带真的不给力啊，Git 连不上，部署函数总是断线。我之所以在这个坑里没有很快出来，还有一个原因，就是每次的报错信息不一样，这深深的吸引了我。

我的报错信息五花八门，给大家分享一下：

![img](https://img.serverlesscloud.cn/2020318/1584511211267-IMG_0189.PNG)

这个错误出现的原因其实也很难想通，因为给的信息太少，并不知道到底是哪里有问题。后来还报过一个类似的错误，印象里是说读不到 'admin_add_article'，我后来发现 git 上面又更新了一个文件夹 picture，里面有这个名字对应的图片，所以我就重新 git clone 了项目文件，把picture文件夹拷贝了过来。

![img](https://img.serverlesscloud.cn/2020318/1584511211810-IMG_0189.PNG)

![img](https://img.serverlesscloud.cn/2020318/1584511211686-IMG_0189.PNG)

这类 443 的错误，我是一直没有解决啦，直到我更换了网络。不过大家可以看到上面有一个存储桶的部署信息，那个桶不是我的。

![img](https://img.serverlesscloud.cn/2020318/1584511211634-IMG_0189.PNG)

关于 InvalidParameterValue 不太理解，什么样的 ID 是合法的呢？我考虑应该是网络中断丢失了数据，导致有些字符没了。

![img](https://img.serverlesscloud.cn/2020318/1584511212075-IMG_0189.PNG)

ECONNRESET 这个错误报了很多次，具体是什么意思不太明白，socket hang up应该还是网络不通畅吧。

![img](https://img.serverlesscloud.cn/2020318/1584511212164-IMG_0189.PNG)

还有一个是超时了，估计是网络情况不好。

![img](https://img.serverlesscloud.cn/2020318/1584511211785-IMG_0189.PNG)

这个 undefined RequestId 也是出现了多次的错误，很奇特。估计是网络数据丢包造成的吧。

以上所有的问题都是网络问题，解决方法：同学们提醒我不要部署到 hongkong 区域，可能海外服务器会有网络不稳定的情况，于是我换到了beijing，依然不行，我还换到多 guangdong，网络错误依然不断。

这个网络问题引发了我的不少猜疑啊：比如，我是不是频繁部署系统被封IP了？是不是防止勒索病毒，443端口封闭啦？我家的宽带是不是该换运营商了？

显然最后一个猜疑是并确认了的。我利用手机数据流量包部署系统就很快，240s 左右解决问题。

这里面其实报错信息不是很友好，首先，我不知道具体到哪一个文件的时候网络断开的，所以我不能肯定是不是某一个文件有问题，如果这时候能够定位一个断开的时候处理在哪一个文件，会对用户更有帮助。

而关于那个存储桶，应该是老师的，因为后来在部署成功的一次我在信息里看到了从老师的存储桶里上传了代码到一个存储桶里，而我在自己的存储桶列表里看到了那几个桶。

之所以有几个，是因为我换过几个区来部署。有一些程序老师可能部署在他的桶里，这样是不是省我们的流量呢？也可能是为了部署 Flask Admin 的过程更加平顺，老师把一些依赖部署到了线上的桶里。

记得上节课的老师也用了 Flask，他说 Flask 需要对应 Python 的精确版本，我们每个人的版本可能都会有些细小差别，造成部署过程的颠簸，老师为了避免这种状况，就额外处理了。老师，您用心啦！



## 坑六：UploadPicture

因为每次网络问题都发生在部署uploadPicture这个部分，时间很长，所以我都会忍不住cancel重来。

![img](https://img.serverlesscloud.cn/2020318/1584511212108-IMG_0189.PNG)

于是这个部分后来被我注释掉了。注释之后，部署很顺利，因为换用了手机的网络。这突如其来的顺利让我觉得 uploadPicture 可能是无罪的，我应该把它放回来。于是我就取消了注释，这时候灾难发生了，10000s 之后它还在部署。

我很好奇，为什么这个部分这么特殊，于是我打开一些 uploadPicture 的源文件来看，发现在 demo.py 里面有很多设置和我们的 global 设置不一样，于是我开始七七八八的修改起来，然而，老师说那个文件不在全局发挥最用，只是qqcloud_cos 这个依赖的一个 demo，于是我又改了回去。

后来，有同学说清空存储桶可以解决这种超长时间部署的问题，于是我试了一下。恩，真的管用哦！感谢同学的提醒。

> PS：我后来回想很可能就是缺少 picture 那个文件夹吧，我猜测部署的过程可能会跑有些 test 程序，文件的代码会被执行，而如果里面的参数读取不到就会一直停在那里。

## 坑七：后台无法使用

部署成功之后，我访问后台，发现只有登陆页可用，其他页面基本上一点就报错，Internal error。在老师的提示下，我到了函数的控制台，查看了Blog_Admin的报错信息，发现是数据库连接不到。

![img](https://img.serverlesscloud.cn/2020318/1584511212052-IMG_0189.PNG)

![img](https://img.serverlesscloud.cn/2020318/1584511212266-IMG_0189.PNG)

可是我之前明明在数据库里新增数据的，于是我打开了 serverless.yml 文件和数据库里的库名称对照, 发现数据库的名称多了一个字母 l，哎，粗心啊粗心。修改了 yaml 文件后再次部署，成功了！

应该说控制台的日志挺详细的，我觉得如果能把成功信息和报错信息在颜色上区分一下就更好啦，目前看来是用时间戳来区分的，不过有时候请求多起来，很多正确和报错信息在一起，找起来很麻烦啊。要是有丰富一些的查询选项也许更好用。

最后，我终于跳过了这些坑，上了岸！

部署成功后的页面如下：http://blogdemo-1253166145.cos-website.ap-beijing.myqcloud.com/

于是，我带着刘宇老师布置的作业来投稿，信息化资产复用最大化，感觉是一次非常开心的学习体验！



---
<div id='scf-deploy-iframe-or-md'></div>

---

> **传送门：**
> - GitHub: [github.com/serverless](https://github.com/serverless/serverless/blob/master/README_CN.md)
> - 官网：[serverless.com](https://serverless.com/)

欢迎访问：[Serverless 中文网](https://serverlesscloud.cn/)，您可以在 [最佳实践](https://serverlesscloud.cn/best-practice) 里体验更多关于 Serverless 应用的开发！
