---
title: 基于 Serverless Component 全栈解决方案 Ⅱ
description: 如何借助 Serverless Component 快速开发全栈 Web 应用 - 续集
keywords: Serverless Component,全栈 Web 应用,全栈解决方案
date: 2019-12-11
thumbnail: https://img.serverlesscloud.cn/20191226/1577353101878-vue.js.png
categories:
  - best-practice
authors:
  - yugasun
authorslink:
  - https://github.com/yugasun
tags:
  - Serverless
  - 全栈应用
---

虽然之前的文章 [基于 Serverless Component 的全栈解决方案](https://yugasun.com/post/serverless-fullstack-vue-practice.html) 介绍了如何借助 Serverless Component 快速搭建 `Restful API` 后端服务 和 `Vue.js + Parcel` 的前端开发架构，但是最终部署后，腾讯云 COS 的访问 URL 并非自定义的，而且实际应用中，我们更偏向于使用自定义域名，同时静态文件一般都会通过 CDN 加速。那么如何为之前部署的静态网站配置 CDN 加速域名呢？

> **注意**：在开始阅读本篇文章之前，你需要一个国内备案通过的域名，如果没有，那么本篇文章不太适合你。因为实践类文章，我是极力推荐 **边看边实践** 的，不然也只是看个热闹，看完就忘......


## 配置 CDN

登录进入 [CDN（内容分发网络）控制台页面](https://console.cloud.tencent.com/cdn)，然后左边菜单选择 `域名管理`：

![域名管理](https://img.serverlesscloud.cn/20191230/1577695508886-fullstack-cdn1.jpg)

点击 `添加域名` 按钮，进入域名添加页面，因为我们的静态文件是部署在 COS 上，所以源站类型选择 `对象存储(COS)`，接着 `存储桶设置` 选择我们的之前部署好的就行，至于下面的 `加速服务配置`, 一般默认就行，如果有特殊需求，可以自己修改，如下图：

![选择静态网站](https://img.serverlesscloud.cn/20191230/1577695508405-fullstack-cdn1.jpg)


填写好配置，点击提交，这时部署需要等待大概 2 分钟左右：

![添加域名](https://img.serverlesscloud.cn/20191230/1577695508456-fullstack-cdn1.jpg)


想通过添加的域名访问，还需要添加一条 `CNAME` 类型的，DNS 解析记录（如果不知道如何添加 CNAME，可以参考此教程 [配置 CNAME](https://cloud.tencent.com/document/product/228/3121)），配置好后就可以通过 http://blog.yugasun.com 访问了。

但是目前非 HTTPS 的网站，很多浏览器都会有不安全提示，这样用户看到第一反应可能就会畏惧，不会继续访问了。那么如何为加速域名配置 HTTPS 呢？

## 配置 HTTPS

### 准备证书

既然需要配置 HTTPS，肯定是少不了证书，可是一般权威机构的证书都是需要购买的，作为一个 `qiong bi` 程序员，我是骨子里抗拒收费服务的。

于是抱着侥幸的心理点开了腾讯云的 [SSL 证书](https://console.cloud.tencent.com/ssl) 页面，眼前一亮：

![申请免费证书](https://img.serverlesscloud.cn/20191230/1577695507898-fullstack-cdn1.jpg)

没错就是 `申请免费证书` 按钮！！！！！！

于是疯狂点击她！选择免费证书机构，填写域名（因为这里是免费证书，所以没法设置泛域名，如：*.yugasun.com）配置一起合成：

![申请步骤](https://img.serverlesscloud.cn/20191230/1577695508378-fullstack-cdn1.jpg)


> 这里因为我已经申请了 `blog.yugasun.com` 的证书，为了演示，所以填写了 `demo.yugasun.com`

配置提交后，选择手动验证，根据指引填写相关 DNS 验证记录：

![操作指引](https://img.serverlesscloud.cn/20191230/1577695507743-fullstack-cdn1.jpg)

验证通过后就可以使用或下载颁发的免费证书了：

![免费证书成功啦](https://img.serverlesscloud.cn/20191230/1577695507970-fullstack-cdn1.jpg)

终于可以拥有属于自己的免费证书了，跳个舞，庆祝下~

### 开始配置

证书准备好了，接下来才是正题：为配置好的 CDN 域名，配置 HTTPS。进入 `域名详情页面`，选择 `高级配置`：

![域名详情页](https://img.serverlesscloud.cn/20191230/1577695507732-fullstack-cdn1.jpg)

![高级配置](https://img.serverlesscloud.cn/20191230/1577695507707-fullstack-cdn1.jpg)


因为是在腾讯云平台申请的免费证书，它会帮我们托管一份，这样我们再配置证书时，可以不用选择上传，只需要从托管的列表中选择就行，是不是很贴心 (*￣︶￣)

![证书托管](https://img.serverlesscloud.cn/20191230/1577695507793-fullstack-cdn1.jpg)


配置好提交就可以了，到这里我们的所有配置流程已经全部搞定，赶紧访问看看我们的成果吧：https://blog.yugasun.com。

## CDN Serverless Component

上面写了这么多，一定花了大家不少时间吧，可是我真不是故意的，因为我第一次配置的时候也是这么一路艰辛走过来的，我只是想吸引更多志同道合的同志 - [GayHub](https://github.com/yugasun)。但是经历一次过后，就再也不想再经历第二次了，实在是太痛苦了......如果你跟我也有同样的感受，那么老铁，千万不要走开，因为接下来的内容将让你的人生更加摇摆。

你可能要骂我了，我辛辛苦苦付出了这么多，你却说 「不爱我了，因为你喜欢上了渣男」。呵呵，不好意思我也要开始做「渣男」(CDN Component) 了。

### 修改 serverless.yml 配置

首先，请进入 [基于 Serverless Component 的全栈解决方案](https://yugasun.com/post/serverless-fullstack-vue-practice.html) 文章创建的项目目录 `fullstack-application-vue`，如果你不想看之前的这一篇，这里也有份项目直通车，运行如下命令即可：

```shell
$ serverless create --template-url https://github.com/yugasun/tencent-serverless-demo/tree/master/fullstack-application-vue
```

修改项目根目录下 `serverless.yml` 配置文件，为 `@serverless/tencent-website` 组件的 `inputs` 新增 `hosts` 配置，如下：

```yaml
frontend:
  component: '@serverless/tencent-website'
  # 参考: https://github.com/serverless-components/tencent-website/blob/master/docs/configure.md
  inputs:
    code:
      src: dist
      root: frontend
      hook: npm run build
    env:
      apiUrl: ${api.url}
    protocol: https
    # 以下为 CDN 加速域名配置
    hosts:
      - host: blog.yugasun.com
        https:
          certId: ZV99hYOj # 这个为你在腾讯云申请的免费证书 ID
          http2: off
          httpsType: 4
          forceSwitch: -2
```

OK，配置好了，是的没错，你不用再做任何配置。是不是还没开始就结束了，这正是 “渣男” 带来快感......

接着执行  `serverless --debug` 命令，静坐喝杯咖啡☕️☕️☕️，刷刷朋友圈，等待部署好就行：

```shell
$ serverless --debug
  // balabala, debug 信息输出
  frontend:
    url:  https://br1ovx-efmogqe-1251556596.cos-website.ap-guangzhou.myqcloud.com
    env:
      apiUrl: https://service-5y16xi22-1251556596.gz.apigw.tencentcs.com/release/
    host:
      - https://blog.yugasun.com (CNAME: blog.yugasun.com.cdn.dnsv1.com）
  api:
    region:              ap-guangzhou
    functionName:        fullstack-vue-api-pro
    apiGatewayServiceId: service-5y16xi22
    url:                 https://service-5y16xi22-1251556596.gz.apigw.tencentcs.com/release/

  254s › frontend › done
```

此时你可以开始尽情摇摆了~

## 更新 Frontend 技术栈

之前，为了方便 Demo，使用了 [parcel](https://github.com/parcel-bundler/parcel)（一款可快速构建零配置的构建工具），但是对于 Vue.js 开发者来说，大多使用的是官方脚手架工具 [@vue/cli](https://cli.vuejs.org/) 来初始化项目的，为了顺应潮流，我也重构了 `frontend` 文件夹下的前端项目。但是这里需要稍微新增一个配置，在根目录下新增 `vue.config.js` 文件：

```js
const path = require('path');
const PrerenderSPAPlugin = require('prerender-spa-plugin');

module.exports = {
  configureWebpack: {
    resolve: {
      // 这新增环境变量别名
      alias: {
        ENV: require('path').resolve(__dirname, 'env.js'),
      },
    },
  },
};
```

然后在我们的入口文件 `frontend/src/main.js` 中引入:

```js
import Vue from 'vue';
import App from './App.vue';
// 引入 api 接口配置 url
import 'ENV';
import './style/app.css';

Vue.config.productionTip = false;

new Vue({
  render: (h) => h(App),
}).$mount('#app');
```

为什么需要这么做呢？因为 `express` 组件在部署时，会自动在 `website` 组件的 `inputs.code.root` 属性配置的目录中自动生成含有部署的 API 服务的接口文件 `env.js`，如下：

```js
// frontend/env.js
window.env = {};
window.env.apiUrl = "https://service-5y16xi22-1251556596.gz.apigw.tencentcs.com/release/";
```

这样我们就可以在前端中使用该接口了：

```js
// 获得用户列表
async getUsers() {
  this.loading = true;
  const { data } = await axios.get(`${window.env.apiUrl}user`);

  if (data.code !== 0) {
    this.userList = [];
  } else {
    this.userList = data.data || [];
  }
  this.loading = false;
},
```

## 小结

以上基于腾讯云 [Serverless Framework](https://cloud.tencent.com/product/sf) 来实现。到这里，有关 `Serverless Component` 全栈解决方案的全部内容就到此结束啦！

---
<div id='scf-deploy-iframe-or-md'></div>

---

> **传送门：**
> - GitHub: [github.com/serverless](https://github.com/serverless/serverless/blob/master/README_CN.md)
> - 官网：[serverless.com](https://serverless.com/)

欢迎访问：[Serverless 中文网](https://serverlesscloud.cn/)，您可以在 [最佳实践](https://serverlesscloud.cn/best-practice) 里体验更多关于 Serverless 应用的开发！
