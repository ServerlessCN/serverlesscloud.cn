# [Serverless 中文网](https://serverlesscloud.cn/)
![avatar](https://travis-ci.com/ServerlessCN/serverlesscloud.cn.svg?branch=master)

## 简介

该仓库为 **Serverless 中文网** 的源码。

**100% serverless** 🎉

- 💪 使用 [react](https://github.com/facebook/react)，[typescript](https://www.typescriptlang.org/)，[gatsby](https://github.com/gatsbyjs/gatsby)，以及 [styled-components](https://github.com/styled-components/styled-components) 进行开发；
- ✨ 使用 [netlify](https://www.netlify.com/) 进行发布前预览；
- 🔥 使用 [Travis CI](https://travis-ci.com/) 以及 [tencent-website](https://github.com/serverless-components/tencent-website) 组件进行自动构建，并发布到腾讯云对象存储 COS 上。

## 快速开始

**1. 下载项目**

```bash
git clone git@github.com:ServerlessCN/serverlesscloud.cn.git
```

**2. 安装项目依赖**

```bash
npm install
```

**3. 本地运行项目**

```bash
npm run start
```

打开浏览器，访问 http://localhost:8000

## 目录结构

```
.
├── LICENSE
├── README.md             //  项目 Readme
├── content               // 【目录】存放网站内容
│   ├── about             // 【目录】存放关于页的内容
│   ├── best-practice     // 【目录】存放最佳实践
│   ├── blog              // 【目录】存放博客
│   └── docs              // 【目录】存放文档
├── gatsby-browser.js     //  gastby 配置文件
├── gatsby-config.js      //  gastby 配置文件
├── gatsby-node.js        //  gastby 配置文件
├── gatsby-ssr.js         //  gastby 配置文件
├── generator             // 【目录】存放 gatsby 动态生成页面或者节点的脚本
│   └── page              // 【目录】存放 gatsby 动态生成页面的脚本
├── serverless.yml        //  serverless framework 的配置文件
├── src                   // 【目录】网站代码
│   ├── assets            // 【目录】网站资源
│   ├── components        // 【目录】公共组件
│   ├── constants         // 【目录】网站主题，文档菜单配置等常量
│   ├── contexts          // 【目录】公共 react 的 context
│   ├── declarations.d.ts // 【目录】typescript 的声明文件
│   ├── layouts           // 【目录】网站页面布局组件
│   ├── pages             // 【目录】网站静态页面，包括主页，关于页，论坛页等
│   ├── styles            // 【目录】网站自定义的 css 样式
│   ├── templates         // 【目录】网站动态生成的页面，包括博客页，文档页等
│   ├── types             // 【目录】typescript 的公共声明类型
│   └── utils             // 【目录】公共工具代码
├── static                // 【目录】静态第三方文件
└── tsconfig.json         //  typescript 配置


```
## 修改网站内容

Fork 这个仓库，并提交 Pull Request !


根据 **快速开始** 的步骤，本地运行起项目。


**1. 最佳实践修改:**

可以修改 ```content/best-practice``` 文件夹下的 markdown 文件。

**2. 博客修改:**

可以修改 ```content/blog``` 文件夹下的 markdown 文件。

**3. 文档修改:**

+ 文档内容可以修改 ```content/docs``` 文件夹下的 markdown 文件；
+ 文档目录可以修改 ```src/constants/docMenuConfig.js``` 中的目录配置。

**4. 页面开发**

如目录所示，页面的代码全在 ```src``` 文件夹下，开发者可先去了解本站点的技术栈，学习相关的开发技术，然后即可上手页面的开发。

## 发布

**1. 本地打包**

```bash
npm run build
```

**2. 如果打包成功，提交你的更改到远端分支**


**3. 在 GitHub 创建一个 Pull Request**

**4. Pull Request 创建后，等待预览链接出现，并查看自己的更改**

如果一切都符合预期，那就可以等待仓库管理员合并 Pull Request 到 master。合并到 master 后，会触发 Travis CI 自动构建和发布更改到线上。

