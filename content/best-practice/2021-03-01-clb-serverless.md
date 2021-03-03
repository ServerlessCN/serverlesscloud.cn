---
title: 如何快速迁移传统 LB 公网业务到 Serverless?
description: 使用 Serverless 云函数负载均衡（Cloud Load Balancer，CLB）触发方式的优势、典型应用场景和使用指引
date: 2021-03-01
thumbnail: https://main.qcloudimg.com/raw/d32d37dcb538d5804ede488d392bac3d.jpg
categories:
  - best-practice
authors:
  - 陈涛
tags:
  - Serverless
  - CLB
---

Serverless 云函数触发困难？函数触发太复杂不会配 ？无法平移传统 LB 公网业务？现在云函数已全面支持负载均衡（Cloud Load Balancer，CLB） 触发方式。提供服务级访问函数方案，适用于企业节点较多，有历史服务在CVM、容器、自建机房、且服务较重访问量较多的场景。

通过 CLB 触发器可以深度对接 Serverless 函数公网访问服务，帮助开发者平滑迁移传统架构到 Serverless，提供理解成本更低，更易操作，更加便捷的公网接入及 Web 访问体验。

## CLB 触发器的优势及特点

1. 海量调用函数场景下，对企业开发者较为友好，相较于其他方式更具性价比。　
2. 支持 IP 维度的 Serverless 型服务管理，可结合域名分地域解析能力，帮助用户实现不同地域触发不同函数执行。提升函数服务的整体可用性。
3. 服务级封装，单个 LB 可以同时封装 CVM，容器与 Serverless 服务， Serverless 服务可以更加方便的切入业务系统的核心服务，可以通过CLB触发器的方式直接路由到函数做支线能力，无需再次绑定域名，解构服务。
4. WAF防护，CLB可以直接对接WAF产品对非法请求做拦截，提供更加专业的WEB应用服务防护。
5. 支持SSL自有证书，通过CLB可以实现 Serverless 应用层的证书服务，支持 SNI 多域名证书绑定。

## CLB 触发器的典型应用场景

**典型场景一：秒杀/抢购活动**

秒杀 & 抢购活动对整体资源的应用弹性的要求比较高，而且和业务的主干场景联系较为紧密。一般是业务系统中较为独立的模块，便于迁移和改造。且可以通过 CLB 的能力无缝支持到云函数，整体计费相对于按调用次数的收费场景要友好很多，迁移成本会比较低。同域名下也可以轻松解决 CORS 跨域问题。

![](https://main.qcloudimg.com/raw/00ad6ae630ae7649cbab9d4a183fb6f6.png)

**典型场景二：辅助系统架构**

如企业的非主干 WEB 业务，订单系统，采集系统，BI分析等对削峰填谷比较敏感的非主干场景，整体迁移成本会比较底 低且迁移收益大。

![](https://main.qcloudimg.com/raw/754eb7b524ed5c110e58ded89bebb391.png)

**典型场景三：动静态业务分离**

当业务请求量较大时，可以通过区分网站的静态和动态请求，有针对性的对其进行分发处理，有效减少后端负载压力。其中动态请求可以通过单独部署负载均衡及关联 Serverless 服务进行处理；静态内容可以通过接入 CDN 服务，通过对象存储进行优化，显著提升加载速度。

![](https://main.qcloudimg.com/raw/bb932260ab32349d3fec006f7e9cfd2d.png)

**典型场景四：同域名，地域级访问服务**

业务对地域要求较高时，可以通过CLB对函数做地域级访问划分。

  
## CLB 触发器配置及使用指引

1. 在CLB控制台新建”负载均衡“实例及”监听器”资源

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2b7539adc5304cd9966de68740f2c2c2~tplv-k3u1fbpfcp-zoom-1.image)

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7438f9138fad43cb9d93909c39d12fd1~tplv-k3u1fbpfcp-zoom-1.image)

2. 在CLB控制台或函数控制台绑定需要访问的函数（暂支持单函数单URL绑定）

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/44b953433c5b42d58b161e2e8d99bf22~tplv-k3u1fbpfcp-zoom-1.image)

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8cfe70e893f1487e843867d950321c87~tplv-k3u1fbpfcp-zoom-1.image)

3. 编辑函数代码 （需要按照特定响应集成格式返回，详见[产品文档](https://cloud.tencent.com/document/product/583/52635)）

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dbf08c6706a14b0eb75390c3a55fca0f~tplv-k3u1fbpfcp-zoom-1.image)

响应集成演示代码：

```
  # -*- coding:utf-8 -*-
  def main_handler(event, context):
      html="CLB Runing Now."
      return {
          "isBase64Encoded": False,
          "statusCode": 200,
          "headers": {'Content-Type': 'ccc'},
          "body": (html)
          # "body": ('%s%s'  %(html,event))
      }
```

## 使用说明

CLB 触发器目前处于灰度测试阶段，您可点击 [申请链接](https://cloud.tencent.com/apply/p/h2r3ix3s5vs) 进行申请。

CLB 账户分为标准账户类型和传统账户类型。传统账户类型不支持绑定 SCF ，建议升级为标准账户类型。详情可参见 [账户类型升级说明](https://cloud.tencent.com/document/product/1199/49090)。

---

---
<div id='scf-deploy-iframe-or-md'></div>

---

> **传送门：**
> - GitHub: [github.com/serverless](https://github.com/serverless/serverless/blob/master/README_CN.md)
> - 官网：[serverless.com](https://serverless.com/)

欢迎访问：[Serverless 中文网](https://serverlesscloud.cn/)，您可以在 [最佳实践](https://serverlesscloud.cn/best-practice) 里体验更多关于 Serverless 应用的开发！