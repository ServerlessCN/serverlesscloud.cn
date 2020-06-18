---
title: Serverless + GitHub Actions 完美自动化部署静态网站
description: GitHub Actions + 对象存储 COS + 云函数 SCF + 自动刷新 CDN 完美自动化部署静态网站
keywords: Serverless云函数,Serverless网站,Serverless应用
date: 2020-04-30
thumbnail: https://img.serverlesscloud.cn/2020523/1590210110499-162011.jpg
categories:
  - user-stories
authors:
  - Stille
authorslink:
  - https://cloud.tencent.com/developer/article/1617831
tags:
  - 对象存储
  - 云函数
---

作为强迫症患者，一直对自动化部署非常痴迷，个人认为全自动部署最重要的就是稳定可靠。经过研究测试，最终使用 GitHub 和腾讯云两大平台，成功完成了全自动部署网站的实践。

## 方案简介

### 业务需求

博主有一个简单的纯静态文档站点 [docs.ioiox.com](https://docs.ioiox.com/)，使用的的是 [docsify](https://docsify.js.org/) 项目的 Markdown 渲染程序，平时通过本地 VSCode 编辑文档，并提交到 GitHub。早前是直接使用 GitHub Pages 绑定域名来访问，但由于网络问题，体验并不好。

### 寻求方案

腾讯云对象存储 COS 服务能够提供静态网页服务，并可以配置 CDN 域名进行访问。那么就需要解决以下两个问题:

1. 如何使 GitHub 自动同步文件到腾讯云 COS
2. 腾讯云 COS 对应的 CDN 如何自动刷新

### 解决方案

- **GitHub Action** - 配置每次 Push 代码后自动上传到 COS
- **腾讯云云函数 SCF** - 检测到 COS 内文件变动后自动刷新对应的 CDN 链接

### 方案流程图

![](https://img.serverlesscloud.cn/2020523/1590210109600-162011.jpg)

## 第一阶段 - GitHub Actions

![](https://img.serverlesscloud.cn/2020523/1590210110863-162011.jpg)

2019 年 11 月，GitHub 正式开放了 GitHub Actions 这个功能，不再需要申请就能自由使用，目前是按照 workflow 的使用时长来收费，个人用户每月 2000 分钟的免费额度也基本够用了。

### 获取腾讯云 API 密钥

**登录腾讯云控制面板 - 访问控制 - 访问密钥 - API 密钥管理**

新建密钥

![新建密钥](https://img.serverlesscloud.cn/2020523/1590210108855-162011.jpg)

_此密钥拥有所有权限，为保证安全，也可以添加子用户，配置 COS,CDN 对应的权限_

### 配置腾讯云 COS

**登录腾讯云控制面板 - 对象存储 - 存储桶列表**

创建存储桶

选择适合你的区域,设置权限为 `公有读私有写`.

![serverless](https://img.serverlesscloud.cn/2020523/1590210111244-162011.jpg)

![serverless](https://img.serverlesscloud.cn/2020523/1590210109266-162011.jpg)

**获取存储桶相关信息**

![serverless](https://img.serverlesscloud.cn/2020523/1590210108828-162011.jpg)

### 配置 GitHub Actions

**GitHub仓库 - Settings - Secrets**

添加 `SecretId` 和 `SecretKey` 分别为刚才获取的腾讯云 API 密钥

![serverless](https://img.serverlesscloud.cn/2020523/1590210110248-162011.jpg)

**GitHub仓库 - Actions**

默认会有很多推荐的 workflows，这里选择 `Set up a workflow yourself` 自己来配置。

![serverless](https://img.serverlesscloud.cn/2020523/1590210110244-162011.jpg)

**系统会创建一个 workflow 的 yml 配置文件，删除预设代码，复制以下样本代码。**

`图上标红两处需修改为刚才创建存储桶获取的名称和区域`

然后右上角提交即可。

![serverless](https://img.serverlesscloud.cn/2020523/1590210109426-162011.jpg)

**yml 配置文件样本**

```javascript
name: Upload to COS

on: [push]

jobs:
  build:

    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v1
    - name: Install coscmd
      run: sudo pip install coscmd
    - name: Configure coscmd
      env:
        SECRET_ID: ${{ secrets.SecretId }}
        SECRET_KEY: ${{ secrets.SecretKey }}
        BUCKET: docs-1300533487
        REGION: ap-shanghai
      run: coscmd config -a $SECRET_ID -s $SECRET_KEY -b $BUCKET -r $REGION
    - name: Upload
      run: coscmd upload -rs --delete -f ./ / --ignore "./.git/*"
```

### 测试 GitHub Actions

提交 yml 后系统检测到 `main.yml` 的 push，便会开始运行这个 workflow，根据 yml 配置文件，可以看出整个工作流简单理解为安装了腾讯云的 coscmd 工具，并根据配置的 `SecretId`、`SecretKey`、`BUCKET`、`REGION` 上传整个仓库到腾讯云 COS，同时忽略掉 `.git` 文件夹。其中 `upload -rs` 命令会使用 md5 比对存储桶中已存在的文件，相同文件将会跳过上传。

![serverless](https://img.serverlesscloud.cn/2020523/1590210110351-162011.jpg)

![serverless](https://img.serverlesscloud.cn/2020523/1590210108821-162011.jpg)

## 第二阶段 - 腾讯云函数 SCF

![serverless](https://img.serverlesscloud.cn/2020523/1590210108837-162011.jpg)

### 配置腾讯云 CDN 域名

**登录腾讯云控制面板 - 对象存储**

进入创建的存储桶 - 基础配置 - 开启静态网站

![serverless](https://img.serverlesscloud.cn/2020523/1590210108864-162011.jpg)

**域名管理**

添加自定义加速域名,并设置域名指向生成的CNAME地址,源站类型改为`静态网站源站`。

![serverless](https://img.serverlesscloud.cn/2020523/1590210110440-162011.jpg)

**控制面板 - 内容分发网络 - 域名管理**

点击添加的域名 - 高级配置

开启 HTTPS，设置强制跳转 HTTPS，并更改跳转方式为 301。在点击前往配置申请免费证书。

![serverless](https://img.serverlesscloud.cn/2020523/1590210110008-162011.jpg)

### 配置云函数 SCF

**登录腾讯云控制面板 - 云函数**

首次使用云函数可能会跳出 `服务授权` 框，需要前往访问添加并同意授权即可。该角色对本次添加的云函数没有影响。

![serverless](https://img.serverlesscloud.cn/2020523/1590210109599-162011.jpg)

![serverless](https://img.serverlesscloud.cn/2020523/1590210109748-162011.jpg)

**选择和你存储桶相同区域并新建**

填写函数名，运行环境选择 `Php 5.6`，创建方式选择 `空白函数` 下一步。

![serverless](https://img.serverlesscloud.cn/2020523/1590210109462-162011.jpg)

![serverless](https://img.serverlesscloud.cn/2020523/1590210109500-162011.jpg)

**函数配置**

上部分保持默认即可

**删除默认代码,复制以下样本代码至此.**

`图上标红两处需修改为之前获取的 API 密钥，注意此处的 ID 和 KEY 顺序和之前配置 GitHub Actions 时是相反的，并把 CDN 链接改为你的域名，如果域名已配置过 HTTPS 和证书，确保此处为 https。`

完成即可

![serverless](https://img.serverlesscloud.cn/2020523/1590210111451-162011.jpg)

![serverless](https://img.serverlesscloud.cn/2020523/1590210110042-162011.jpg)

函数代码样本

```javascript
<?php
$gl = 1;
function main_handler($event, $context) {
    $eve = json_decode(json_encode($event,JSON_FORCE_OBJECT),true);
    $usr_url=strval($eve["Records"][0]["cos"]["cosObject"]["url"]);

    //截取object部分
    $object=substr($usr_url,strpos($usr_url,"/",8));

    /*需要填写您的密钥，可从  https://console.cloud.tencent.com/capi 获取 SecretId 及 $secretKey*/
    $secretKey='XXXXXXXXXXXXXX';
    $secretId='XXXXXXXXXXXXXX';
    $action='RefreshCdnUrl';

    $HttpUrl="cdn.api.qcloud.com";
    /*除非有特殊说明，如MultipartUploadVodFile，其它接口都支持GET及POST*/
    $HttpMethod="GET";
    /*是否https协议，大部分接口都必须为https，只有少部分接口除外（如MultipartUploadVodFile）*/
    $isHttps =true;
    $nurl="https://XXXX.XXXX.com".$object; //   示例：$nurl="http://abc.com".$object;
    //print_r($nurl);

    /*下面这五个参数为所有接口的 公共参数；对于某些接口没有地域概念，则不用传递Region（如DescribeDeals）*/
    $COMMON_PARAMS = array(
                    'Nonce' => rand(),
                    'Timestamp' =>time(NULL),
                    'Action' =>$action,
                    'SecretId' => $secretId,
                    'SignatureMethod' => 'HmacSHA256',
                    'urls.0' => $nurl
                    );
    $PRIVATE_PARAMS = array();
    //**********执行CDN刷新URL操作**********/
    CreateRequest($HttpUrl,$HttpMethod,$COMMON_PARAMS,$secretKey, $PRIVATE_PARAMS, $isHttps);
   return "RefreshCdnUrl OK";
}
/***************CDN API调用方法***************/
function CreateRequest($HttpUrl,$HttpMethod,$COMMON_PARAMS,$secretKey, $PRIVATE_PARAMS, $isHttps)
{
        $FullHttpUrl = $HttpUrl."/v2/index.php";

        /***************对请求参数 按参数名 做字典序升序排列，注意此排序区分大小写*************/
        $ReqParaArray = array_merge($COMMON_PARAMS, $PRIVATE_PARAMS);
        ksort($ReqParaArray);

        /**********************************生成签名原文**********************************
         * 将 请求方法, URI地址,及排序好的请求参数  按照下面格式  拼接在一起, 生成签名原文，此请求中的原文为
         * GETcvm.api.qcloud.com/v2/index.php?Action=DescribeInstances&Nonce=345122&Region=gz
         * &SecretId=AKIDz8krbsJ5yKBZQ    ·1pn74WFkmLPx3gnPhESA&Timestamp=1408704141
         * &instanceIds.0=qcvm12345&instanceIds.1=qcvm56789
         * ****************************************************************************/
        $SigTxt = $HttpMethod.$FullHttpUrl."?";
        $isFirst = true;
        foreach ($ReqParaArray as $key => $value)
        {
                if (!$isFirst)
                {
                        $SigTxt = $SigTxt."&";
                }
                $isFirst= false;
                /*拼接签名原文时，如果参数名称中携带_，需要替换成.*/
                if(strpos($key, '_'))
                {
                        $key = str_replace('_', '.', $key);
                }
                $SigTxt=$SigTxt.$key."=".$value;
        }
        /*********************根据签名原文字符串 $SigTxt，生成签名 Signature******************/
        $Signature = base64_encode(hash_hmac('sha256', $SigTxt, $secretKey, true));

        /***************拼接请求串,对于请求参数及签名，需要进行urlencode编码********************/
        $Req = "Signature=".urlencode($Signature);
        foreach ($ReqParaArray as $key => $value)
        {
                $Req=$Req."&".$key."=".urlencode($value);
        }

        /*********************************发送请求********************************/
        if($HttpMethod === 'GET')
        {
                if($isHttps === true)
                {
                        $Req="https://".$FullHttpUrl."?".$Req;
                }
                else
                {
                        $Req="http://".$FullHttpUrl."?".$Req;
                }
                $Rsp = file_get_contents($Req);
        }
        else
        {
                if($isHttps === true)
                {
                        $Rsp= SendPost("https://".$FullHttpUrl,$Req,$isHttps);
                }
                else
                {
                        $Rsp= SendPost("http://".$FullHttpUrl,$Req,$isHttps);
                }
        }
        var_export(json_decode($Rsp,true));
}
function SendPost($FullHttpUrl, $Req, $isHttps)
{
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $Req);
        curl_setopt($ch, CURLOPT_URL, $FullHttpUrl);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        if ($isHttps === true) {
                curl_setopt($ch, CURLOPT_SSL_VERIFYPEER,  false);
                curl_setopt($ch, CURLOPT_SSL_VERIFYHOST,  false);
        }
        $result = curl_exec($ch);
        return $result;
}
?>
```

**测试函数代码**

确认 API 及 CDN 配置正确，点击测试，返回成功。

![serverless](https://img.serverlesscloud.cn/2020523/1590210109306-162011.jpg)

**添加触发方式**

此处需要分别添加 `全部创建` 和 `全部删除` 两个触发方式

触发方式：COS 触发

COS Bucket：选择你的存储桶 `(请再次确保存储桶和云函数的区域相同)`

事件类型：`全部创建`和`全部删除`

![serverless](https://img.serverlesscloud.cn/2020523/1590210109244-162011.jpg)

### 测试配置

**腾讯云控制台 - 内容分发网络**

左侧刷新预热 - 操作记录 - 查询

可以看到刚才测试成功的一条记录，现在可以尝试在 Push 代码到 GitHub 来完整的测试整个流程了。

![serverless](https://img.serverlesscloud.cn/2020523/1590210109500-162011.jpg)

---
<div id='scf-deploy-iframe-or-md'></div>

---

> **传送门：**
> - GitHub: [github.com/serverless](https://github.com/serverless/serverless/blob/master/README_CN.md)
> - 官网：[serverless.com](https://serverless.com/)

欢迎访问：[Serverless 中文网](https://serverlesscloud.cn/)，您可以在 [最佳实践](https://serverlesscloud.cn/best-practice) 里体验更多关于 Serverless 应用的开发！
