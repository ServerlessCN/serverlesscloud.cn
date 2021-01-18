---
title: 输入几行代码，轻松迁移 SpringBoot 应用上云
description: 快来体验一下吧！
date: 2021-01-14
thumbnail: https://main.qcloudimg.com/raw/2e90a9a7efa86ed3e180d4628ba5fbea.jpg
categories:
  - best-practice
authors:
  - Barrie 
tags:
  - Serverless
  - SpringBoot
---

[Spring Boot](https://spring.io/projects/spring-boot) 是由 Pivotal 团队提供的框架，用来简化新 Spring 应用的初始搭建以及开发过程。该框架使用了特定的方式来进行配置，从而使开发人员不再需要定义样板化的配置，因此 [Spring Boot](https://spring.io/projects/spring-boot)  框架也成为了当前非常流行的框架。

如今，您可以通过 [Serverless 应用控制台](https://console.cloud.tencent.com/ssr)，进行极其简单的代码改造，就可以迁移您的 SpringBoot 应用上云。

## 功能优势

- **低改造成本：** Serverless 组件自动帮助用户完成框架上云的适配转换，用户只需聚焦业务核心代码，进行极少的代码改造，即可完成云端部署。
- **应用层级资源展示与管理:** 部署成功后，用户可以方便地通过 Serverless 应用控制台将查看和管理创建的云端资源，无需多个页面切换，实现多资源的集中管理。
- **代码持续更新：** 支持持续构建，当文件夹上传到的内容有更新时，可以自动触发重新部署。
- **应用层级监控图表：** 提供了应用层级的监控能力，用户不仅可以看到每个资源的调用次数、错误次数等信息，还可以看到应用层级的监控指标，方便运维。

**根据以下教程步骤，快速体验框架迁移：**

> 部署前提：账号已开通 **Serverless Framework：https://console.cloud.tencent.com/sls** 与 **Coding DevOps：https://console.cloud.tencent.com/coding** 服务，登陆控制台，会自动为您进行开通，开通流程不会产生何费用。


## 创建应用

### 基于模版创建

1. 进入 [Serverless 应用控制台](https://console.cloud.tencent.com/ssr)，点击【新建应用】，进入应用创建页。

![](https://img.serverlesscloud.cn/20201123/1606141064704-%E5%B1%8F%E5%B9%95%E5%BF%AB%E7%85%A7%202020-11-22%2018.20.45.png)

2. 填入您的应用名称，【创建方式】选择【应用模版创建】，选择 **Spring Boot 框架**。

![](https://main.qcloudimg.com/raw/67ffda52ce66bd2f8884581107ccd93f.png)

3. 点击【创建】，Serverless 控制台会自动开始为您部署应用，部署完成后，进入应用详情页，可以 **查看创建的云上资源、监控日志、部署记录** 等信息，也支持在“开发部署”页面修改配置，重新部署。



### 导入已有项目

1. 代码改造：**若使用自己的 SpringBoot 项目代码进行部署需要进行如下的改造**

- 在项目 `pom.xml` 中新增腾讯云函数（需为0.0.3版本）和fastjson的依赖（若自身项目有所用版本可不修改，若无则请依赖最新版本）。

```
<dependency>
    <groupId>com.tencentcloudapi</groupId>
    <artifactId>scf-java-events</artifactId>
    <version>0.0.3</version>
</dependency>

<dependency>
    <groupId>com.alibaba</groupId>
    <artifactId>fastjson</artifactId>
    <version>1.2.73</version>
</dependency>
```

- 在项目的根目录的 `src/main/java` 的任意目录下新增一个执行方法入口，例如：在 src/main/java/example 目录下新建 MyHandler.java

```
package example;

import com.qcloud.scf.runtime.AbstractSpringHandler;

public class MyHandler extends AbstractSpringHandler {
    @Override
    public void startApp() {
        System.out.println("start app");
        // 修改为springboot项目的入口主函数，例如: 入口为DemoApplication class下的main函数
        DemoApplication.main(new String[]{""});
    }
}
```

- 将代码用 Maven 创建 `jar` 部署包或者用 Gradle 创建 zip 部署包。

  需要将项目所有的依赖包一起打包，例如使用`Maven`则推荐用`maven-shade-plugin`进行打包，修改`pom.xml`中的`plugin`：

  ```
  <plugin>
      <groupId>org.apache.maven.plugins</groupId>
      <artifactId>maven-shade-plugin</artifactId>
      <version>3.1.1</version>
      <configuration>
          <createDependencyReducedPom>false</createDependencyReducedPom>
      </configuration>
      <executions>
          <execution>
              <phase>package</phase>
              <goals>
                  <goal>shade</goal>
              </goals>
          </execution>
      </executions>
  </plugin>
  ```

> 云函数关于 Maven 部署包的说明：[点此查看](https://cloud.tencent.com/document/product/583/12217)
> 云函数关于 Gradle 部署包的说明：[点此查看](https://cloud.tencent.com/document/product/583/12216)

- 修改 serverless.yml 文件中的 `projectJarName` 配置为打包后的 .jar/.zip 文件名，.jar/.zip 文件需要放与 serverless.yml 同级。

> 如：使用 Maven 打包后生成了 code.jar 文件，则 projectJarName 为 `code.jar`

- 修改 serverless.yml 文件中的 `functionConfig` 的 `handler` 配置，格式为 `[package].[class]::mainHandler` 其中 package 为更多层时用 `.` 连接。

> 如：如新建的 MyHandler.java 放在了 src/main/java/example 中，则 handler 为 `example.MyHandler::mainHandler`

2. 进入 [Serverless 应用控制台](https://console.cloud.tencent.com/ssr)，点击【新建应用】，进入应用创建页。
3. 填入您的应用名称，【创建方式】选择【导入已有项目】，选择 **Spring Boot 应用**，直接导入您的已有项目。选择【本地上传】代码上传方式，上传Maven 创建 jar 部署包或者用 Gradle 创建 zip 部署包。

![](https://main.qcloudimg.com/raw/4e793b0b76bd41c965b0ff2493eeb218.png)

4. 点击【创建】，Serverless 控制台会自动开始为您部署应用，部署完成后，进入应用详情页，可以查看创建的云上资源、监控日志、部署记录等信息，也支持在“开发部署”页面修改配置，重新部署。

## 管理应用

应用创建完成后，可以在应用详情页，完成查看项目具体信息，主要支持以下几部分管理功能。

### 1. 资源管理

在【资源列表】页，支持查看当前应用为您创建的云资源，并查看基本配置信息。

![](https://main.qcloudimg.com/raw/47b45e7240d6a766526d97840a03013b.png)

### 2. 开发部署

在应用详情页顶部，单击【开发部署】，您可以轻松地实现应用的配置修改与二次部署上传，目前SpringBoot 仅框架支持 **本地上传**方式。

同时，您也可以在该页面修改应用配置信息，点击“保存”完成重新部署。

![](https://main.qcloudimg.com/raw/a426591041b72d526c0bdaf193f46ac1.png)

### 3. 应用监控

在【应用监控】页面，您可以查看项目部署后输出的基本信息、项目请求次数、项目报错统计等多项监控指标，方便您轻松实现项目的管理运维。

![](https://img.serverlesscloud.cn/20201126/1606384460049-%E5%B1%8F%E5%B9%95%E5%BF%AB%E7%85%A7%202020-11-26%2016.22.43.png)

### 4. 部署日志

在【部署日志】页面，可以看到【通过控制台部署】或【自动触发】的部署日志，以及部署结果。

![](https://img.serverlesscloud.cn/20201123/1606143280152-%E5%B1%8F%E5%B9%95%E5%BF%AB%E7%85%A7%202020-11-23%2022.53.44.png)

到这里，只需要极其简单的代码改造，就完成了将您的 Spring Boot 应用迁移至 Serverless 的操作，并可以进行应用的监控管理，持续开发，享受 Serverless 带来的众多优势。

欢迎前往[控制台](https://console.cloud.tencent.com/sls)体验！

---

欢迎访问：[Serverless 中文网](https://serverlesscloud.cn/)，您可以在 [最佳实践](https://serverlesscloud.cn/best-practice) 里体验更多关于 Serverless 应用的开发！