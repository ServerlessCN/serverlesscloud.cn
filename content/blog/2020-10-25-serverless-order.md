---
title: Springboot 之基于 Serverless 的订单应用
description: Java 是最好的语言
date: 2020-10-25
thumbnail: https://img.serverlesscloud.cn/2020115/1604567165601-spboot.jpg
categories:
  - user-stories
authors:
  - Freeeeeedom
authorslink:
  - https://freeeeeedom.github.io/
tags:
  - Serverless
  - Springboot
---

## 前言

这是一个 JAVA 开发的订单后台应用（没错！就是那个让无数大学生痛不欲生的订单后台系统），结合 Serverless 这一无服务器思想，尝试通过云函数 + API 网关 + 云数据库的组合来部署 Springboot 的成功之作。

该应用提供了完整的用户登录验证、接口数据验证、订单流 (CRUD) 等强大的功能，而且在本地开发调试时也能模拟 API 网关调用云函数（本地 Java 开发云端部署不是问题），还兼容了云消息队列 CMQ 的调用，以便后续开发引入云中间件。

同时，这种部署方式也能让其他的 Springboot 很快地转换为云函数部署。

为响应国家「十四五计划」的环保计划，特地的研究了一下传说中的 **Serverless** 方案（省服务器 😄），于是便有了这次尝试。

## 语言和框架

- JAVA 天下第一**，当然 c/c++/c#/node/python/go/php/vb 这些也不错
- JAVA 的单体应用还能选什么呢？只能是 Springboot 啊

## 部署准备

1. 注册个腾讯云账号
2. 开通以下产品权限（云函数、API 网关、对象存储）
3. 财力允许的话还可以购买数据库服务（因为年少轻狂打折时我购买了这俩很长很长时间)

- mysql数据库
- redis数据库

![](https://img.serverlesscloud.cn/2020115/1604566278987-img1.png)

## 部署方案

订单应用来说的话，必然是提供 restful 的接口，所以在统一 VPC 内采用了云函数 + API 网关的模式提供接口，于是就有了以下方案：

1. 应用主体部署在云函数
2. 使用 API 网关作为函数入口
3. 页面则是使用了对象存储部署
4. 数据库方面则使用了同一 vpc 下的云数据库(财力有限只尝试了 mysql、redis，理论上其他应该都可行)

## 尝试部署

要让 JAVA 工程部署到云函数上，首先了解什么是云函数(以下摘自微信开放文档)

```
云函数即在云端（服务器端）运行的函数。在物理设计上，一个云函数可由多个文件组成，占用一定量的 CPU 内存等计算资源；各云函数完全独立；可分别部署在不同的地区。开发者无需购买、搭建服务器，只需编写函数代码并部署到云端即可在小程序端调用，同时云函数之间也可互相调用。
```

云函数其实就是将业务拆分成函数粒度部署在云上，那么就写了个简单的 demo 部署到云函数上，并且配上了 API 网关尝试调用。

```java
 /**
 * 纯javascf快速开发部署(不走springboot)
 *
 * @author Freeeeeedom
 * @date 2020/10/24 10:31
 */
public class Scf {
    /**
     * log Object
     */
    private static Logger log = LoggerFactory.getLogger(Scf.class);
    private static DruidDataSource dataSource1 = new DruidDataSource();

    static {
        //此处加载或修改数据源 多数据源配置多个
        dataSource1.setUsername("Freeeeeedom");
        dataSource1.setUrl("jdbc:mysql://Freeeeeedom?autoReconnectForPools=true&useUnicode=true&characterEncoding=UTF-8&serverTimezone=Asia/Shanghai");
        dataSource1.setPassword("Freeeeeedom");
        dataSource1.setMinIdle(1);
        dataSource1.setMaxActive(5);
        dataSource1.setMaxWait(10000);
        dataSource1.setValidationQuery("SELECT 1 from dual");
        log.info("数据源加载ok~");
    }

    /**
     * 纯scf入口参数
     *
     * @param insertParam 入参
     * @return java.lang.Object 执行结果
     * @author Freeeeeedom
     * @date 2020/10/24 10:31
     */
    public Object pure(Map<String, Object> insertParam) {
        log.info("param:{}", gson.toJson(insertParam);
        Gson gson = new GsonBuilder().disableHtmlEscaping().create();
        try {
            Class.forName("com.mysql.jdbc.Driver");
        } catch (ClassNotFoundException e) {
            log.error("内部处理异常", e);
        }
        Map response = new HashMap();
        JdbcTemplate jdbcTemplate = new JdbcTemplate();
        jdbcTemplate.setDataSource(dataSource1);
        Map order = jdbcTemplate.queryForMap("select order_id,create_time from `order` limit 1");
        log.info(order.toString());
        return buildResponse(gson, gson.toJson(order), response);
    }

    private Object buildResponse(Gson gson, String json, Map response) {
        Map<String, String> headers = new HashMap(1);
        headers.put("Content-Type", "application/json");
        response.put("statusCode", HttpStatus.OK.value());
        response.put("headers", headers);
        response.put("body", json);
        return gson.toJson(response);
    }
}
```

只需要打包好代码，然后将入口函数设置为 `scf.Scf::pure` 就实现了接收数据，然后从数据库查询了第一个订单的 id 和创建时间并且返回的能力：

![](https://img.serverlesscloud.cn/2020115/1604566279001-img1.png)

每一次通过 API 网关触发云函数都会触发 pure 这个方法(调用者 > 调用 API 网关 > 云函数 --> pure)，但经测试发现 static 的数据源初始化并不会被重复加载，这也奠定了 springboot 可部署基础。

其中通过 log 打印 API 网关带来的参数，直接将其复制为 json，然后通过 main 函数模拟调用，这样就实现了本地模拟 serverless 部署后的调用。

```
log.info("param:{}", gson.toJson(insertParam);
```

有了这些基础，那么只需要有一个入口类模拟 springboot 启动的加载，然后再映射一下 API 网关过来入口参数，即可实现 springboot 在云函数上部署（其实就是上面 SCF 类的超级 plus 版本）。

** API 网关配置**

这里的路径参数对应 springboot 里的 mapping 路径

![](https://img.serverlesscloud.cn/2020115/1604566338083-apiconfig.png)

![](https://img.serverlesscloud.cn/2020115/1604566362752-apiconfigdetail.png)


## 本地调试

有了上面那些 demo 后，可得知我们模拟云端部署运行已经不是问题。那么怎么在本地调试呢？答案很简单，直接启动 springboot 然后调正常就完事了。

没错，就是直接用原生的 springboot 玩法即可。把 springboot 部署到云函数其实就是**外挂了一个 springboot 的启动类**（设计模式上叫适配器模式？(+_+)?

## 功能

完整的 springboot，能用 springboot 做的都能实现，我只是编写了一些小功能验证这个应用。

- [x] 与本地服务器数据库连接
- [x] 云数据库连接
- [x] vpc数据库连接
- [x] 外部接口调用(发短信验证码)
- [x] 实现简单的订单流 (crud)
- [x] 实现简单的登录能力
- [x] 实现简单的数据验证能力

整个项目功能简单但代码却不少。

## 安全

首先 "serverless"、"腾讯"、"云服务" 这几个词就足以代表安全了，但为了功能完整性我还是尝试加了点东西。

在这个系统中，我选择了 header 中加签名的方式验证数据，原因是啥，操作简单，有效呗。加密手段和方案暂且不说，就从流程上来看，是很方便的:

1. 从 API 网关调用参数中获取到 header，body
2. 验证数据有效性
3. 请求转入业务模块
4. 验证数据有效性
5. 参数进入功能模块
6. 验证数据有效性
7. ………………


其实只有 123 步骤是最有效的，后面的 45678 如果你想的话……更不用说 API 网关本身提供的鉴权功能了。

![](https://img.serverlesscloud.cn/2020115/1604566390815-apiconfigaccess.png)

## 性能

内存的话对于订单系统来说单次请求加上 JVM 也才 300mb，而云函数单个函数执行内存能拉到 3GB，哪怕有点量的分布式计算应该问题也不大。

![](https://img.serverlesscloud.cn/2020115/1604566438409-3gb.png)

并发的话云函数上的预置并发上限 200 个，订单系统嘛，QPS1000?10000?100000? ezpz了，再怎么也比自家机柜服务器强几百几千个量级了。

![](https://img.serverlesscloud.cn/2020115/1604566441354-predeploy.png)

内存算力不够服务器扩容？不存在的。

## 最后

生成个 VUE 项目，改改链接调调页面，然后上传到存储桶上，一键打开 CDN ~(￣▽￣)~*完美！

察觉到了到了科技的进步，时代的发展，Serverless 的强大。

---

---
<div id='scf-deploy-iframe-or-md'></div>

---

欢迎访问：[Serverless 中文网](https://serverlesscloud.cn/)，您可以在 [最佳实践](https://serverlesscloud.cn/best-practice) 里体验更多关于 Serverless 应用的开发！