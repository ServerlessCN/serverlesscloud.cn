---
title: 用 Serverless 优雅地实现图片艺术化应用
description: 本文将会分享，如何从零开始搭建一个基于腾讯云 Serverless 的图片艺术化应用！
keywords: Serverless, Serverless Framework, Serverless 实践
date: 2020-09-09
thumbnail: https://img.serverlesscloud.cn/202099/1599651282704-v2-24a20fb94b5d74840d043f4cd2bd40e3_r.jpg
categories: 
  - user-stories
authors: 
  - 蒋启钲
authorslink: 
  - https://zhuanlan.zhihu.com/p/218803108
tags:
  - Serverless
  - TensorFlow
---

本文将会分享，如何从零开始搭建一个基于腾讯云 Serverless 的图片艺术化应用！

> 线上 demo 预览：https://art.x96.xyz/ ，项目已开源，完整代码见文末。

![img](https://img.serverlesscloud.cn/202099/1599651083623-v2-74aee01635eec12eea32cf2ae80d4ceb_b.png)

在完整阅读文章后，读者应该能够实现并部署一个相同的应用，这也是本篇文章的目标。

**项目看点概览：**

- 前端 react（Next.js）、后端 node（koa2）
- 全面使用 ts 进行开发，极致开发体验（后端运行时 ts 的方案，虽然性能差点，不过胜在无需编译，适合写 demo）
- 突破云函数代码 500mb 限制（提供解决方案）
- TensorFlow2 + Serverless 扩展想象力边际
- 高性能，轻松应对万级高并发，实现高可用（自信的表情，反正是平台干的活）
- 秒级部署，十秒部署上线
- 开发周期短（本文就能带你完成开发）

![img](https://img.serverlesscloud.cn/202099/1599651387973-v2-1fde91eae8d502af43bde5912e7a55aa_b.png)

本项目部署借助了 Serverless component，因此当前开发环境需先全局安装 Serverless 命令行工具

```bash
npm install -g serverless
```

## 需求与架构

本应用的整体需求很简单：图片上传与展示。

1. 模块概览

![模块概览](https://img.serverlesscloud.cn/202099/1599651426241-v2-503298ca435eee806d6ad281505e5db2_b.png)

2. 上传图片

![上传图片](https://img.serverlesscloud.cn/202099/1599651443287-v2-1f5d371818671e0122d57650da860765_b.png)

3. 浏览图片 

![浏览图片](https://img.serverlesscloud.cn/202099/1599651463965-v2-a51d31aa252e42d2f073a1ee69cb42d1_b.png)


## 用对象存储提供存储服务

在开发之前，我们先创建一个 oss 用于提供图片存储（可以使用你已有的对象存储）

```bash
mkdir oss
```

在新建的 oss 目录下添加 serverless.yml 

```yaml
component: cos
name: xart-oss
app: xart
stage: dev

inputs:
  src:
    src: ./
    exclude:
      - .env # 防止密钥被上传
  bucket: ${name} # 存储桶名称，如若不添加 AppId 后缀，则系统会自动添加，后缀为大写（xart-oss-<你的appid>）
  website: false
  targetDir: /
  protocol: https
  region: ap-guangzhou # 配置区域，尽量配置在和服务同区域内，速度更快
  acl:
    permissions: public-read # 读写配置为，私有写，共有读
```

执行 sls deploy 几秒后，你应该就能看到如下提示，表示新建对象存储成功。

![新建对象存储](https://img.serverlesscloud.cn/202099/1599651487608-v2-fb1abe3f51ae4aa8f6246bec14d3a786_b.png)

这里，我们看到 `url` https://art-oss-<appid>.cos.ap-guangzhou.myqcloud.com，可以发现默认的命名规则是 https://<名字-appid>.cos.<地域>.myqcloud.com

简单记录一下，在后面服务中会用到，忘记了也不要紧，看看 `.env` 内 `TENCENT_APP_ID` 字段（部署后会自动生成 .env）


## 实现后端服务

新建一个目录并初始化

```bash
mkdir art-api && cd art-api && npm init
```

安装依赖（期望获取 ts 类型提示，请自行安装 @types）

```bash
npm i koa @koa/router @koa/cors koa-body typescript ts-node cos-nodejs-sdk-v5 axios dotenv
```

配置 `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "es2018",
    "module": "commonjs",
    "lib": ["es2018", "esnext.asynciterable"],
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "esModuleInterop": true
  }
}
```

入口文件 `sls.js`

```js
require("ts-node").register({ transpileOnly: true }); // 载入 ts 运行时环境，配置忽略类型错误
module.exports = require("./app.ts"); // 直接引入业务逻辑，下面我会和你一起实现
```

补充两个实用知识点：

**node -r**

在入口文件中引入 `require("ts-node").register({ transpileOnly: true })` 实际等同于 `node -r ts-node/register/transpile-only`

所以 `node -r` 就是在执行之前载入一些特定模块，利用这个能力，能快速实现对一些功能的支持

比如 `node -r esm main.js` 通过 esm 模块就能在无需 babel、webpack 的情况下快速 import 与 export 进行模块加载与导出

**ts 加载路径**

如果不希望用 `../../../../../` 来加载模块，那么

1. 在 tsconfig.json 中配置 `baseUrl: "."`
2. `ts-node -r tsconfig-paths/register main.ts` 或 `require("tsconfig-paths").register() `
3. `import utils from 'src/utils'` 即可愉快地从项目根路径加载模块

下面来实现具体逻辑：

app.ts 

```js
require("dotenv").config(); // 载入 .env 环境变量，可以将一些密钥配置在环境变量中，并通过 .gitignore 阻止提交
import Koa from "koa";
import Router from "@koa/router";
import koaBody from "koa-body";
import cors from '@koa/cors'
import util from 'util'
import COS from 'cos-nodejs-sdk-v5'
import axios from 'axios'

const app = new Koa();
const router = new Router();

var cos = new COS({
  SecretId: process.env.SecretId // 你的id,
  SecretKey: process.env.SecretKey // 你的key,
});

const cosInfo = {
  Bucket: "xart-oss-<你的appid>", // 部署oss后获取
  Region: "ap-guangzhou",
}

const putObjectSync = util.promisify(cos.putObject.bind(cos));
const getBucketSync = util.promisify(cos.getBucket.bind(cos));

router.get("/hello", async (ctx) => {
  ctx.body = 'hello world!'
})

router.get("/api/images", async (ctx) => {
  const files = await getBucketSync({
    ...cosInfo,
    Prefix: "result",
  });

  const cosURL = `https://${cosInfo.Bucket}.cos.${cosInfo.Region}.myqcloud.com`;
  ctx.body = files.Contents.map((it) => {
    const [timestamp, size] = it.Key.split(".jpg")[0].split("__");
    const [width, height] = size.split("_");
    return {
      url: `${cosURL}/${it.Key}`,
      width,
      height,
      timestamp: Number(timestamp),
      name: it.Key,
    };
  })
    .filter(Boolean)
    .sort((a, b) => b.timestamp - a.timestamp);
});

router.post("/api/images/upload", async (ctx) => {
  const { imgBase64, style } = JSON.parse(ctx.request.body)
  const buf = Buffer.from(imgBase64.replace(/^data:image\/\w+;base64,/, ""), 'base64')
  // 调用预先提供tensorflow服务加工图片，后面替换成你自己的服务
  const { data } = await axios.post('https://service-edtflvxk-1254074572.gz.apigw.tencentcs.com/release/', {
    imgBase64: buf.toString('base64'),
    style
  })
  if (data.success) {
    const afterImg = await putObjectSync({
      ...cosInfo,
      Key: `result/${Date.now()}__400_200.jpg`,
      Body: Buffer.from(data.data, 'base64'),
    });
    ctx.body = {
      success: true,
      data: 'https://' + afterImg.Location
    }
  }
});

app.use(cors());
app.use(koaBody({
  formLimit: "10mb",
  jsonLimit: '10mb',
  textLimit: "10mb"
}));
app.use(router.routes()).use(router.allowedMethods());

const port = 8080;
app.listen(port, () => {
  console.log("listen in http://localhost:%s", port);
});

module.exports = app;
```

在代码里可以看到，在图片上传采用了 base64 的形式。这里需要注意，通过 api 网关触发 scf 的时候，网关无法透传 binary，具体上传规则可以参阅官方文档：

![](https://img.serverlesscloud.cn/202099/1599651515005-v2-a47c5e265c7a5ab449a548ebd3825222_b.png)

再补充一个知识点：实际我们访问的是 api 网关，然后触发云函数，来获得请求返回结果，所以 debug 时需要关注全链路

![](https://img.serverlesscloud.cn/202099/1599651534103-v2-d99e3200ff10dc46b0aecdd3ceb5aca7_b.png)

回归正题，接着配置环境变量 `.env`

```bash
NODE_ENV=development

# 配置 oss 上传所需密钥，需要自行配置，配好了也别告诉我：）
# 密钥查看地址：https://console.cloud.tencent.com/cam/capi
SecretId=xxxx
SecretKey=xxxx
```

以上，server 部分就开发完成了，我们可以通过在本地执行 `node sls.js` 来验证一下，应该可以看到服务启动的提示了。

> listen in http://localhost:8080 

来简单配置一下 `serverless.yml`，把服务部署到线上，后面再进一步使用 `layer` 进行优化

```yaml
component: koa # 这里填写对应的 component
app: art
name: art-api
stage: dev

inputs:
  src:
    src: ./
    exclude:
      - .env
  functionName: ${name}
  region: ap-guangzhou
  runtime: Nodejs10.15
  functionConf:
    timeout: 60 # 超时时间配置的稍微久一点
    environment:
      variables: # 配置环境变量，同时也可以直接在scf控制台配置
        NODE_ENV: production
  apigatewayConf:
    enableCORS: true
    protocols:
      - https
      - http
    environment: release
```

之后执行部署命令 `sls deploy `

等待数十秒，应该会得到如下的输出结果（如果是第一次执行，需要平台方授权）

![img](https://img.serverlesscloud.cn/202099/1599651558871-v2-2384954cb77cbaf3abf1daaad7efe2c4_b.png)

其中 url 就是当前服务部署在线上的地址，我们可以试着访问一下看看，是否看到了预设的 hello world。

到这里，server 基本上已经部署完成了。如果代码有改动，那就修改后再次执行 `sls deploy`。官方为代码小于 10M 的项目提供了在线编辑的能力。

但是，随着项目复杂度的增加，deploy 上传会变慢。所以，让我们再优化一下。

新建 `layer` 目录

```bash
mkdir layer
```

在 `layer` 目录下添加 `serverless.yml`

```yaml
component: layer
app: art
name: art-api-layer
stage: dev

inputs:
  region: ap-guangzhou
  name: ${name}
  src: ../node_modules # 将 node_modules 打包上传
  runtimes:
    - Nodejs10.15 # 注意配置为相同环境
```

回到项目根目录，调整一下根目录的 `serverless.yml`

```yaml
component: koa # 这里填写对应的 component
app: art
name: art-api
stage: dev

inputs:
  src:
    src: ./
    exclude:
      - .env
      - node_modules/** # deploy 时排除 node_modules
  functionName: ${name}
  region: ap-guangzhou
  runtime: Nodejs10.15
  functionConf:
    timeout: 60 # 超时时间配置的稍微久一点
    environment:
      variables: # 配置环境变量，同时也可以直接在 scf 控制台配置
        NODE_ENV: production
  apigatewayConf:
    enableCORS: true
    protocols:
      - https
      - http
    environment: release
  layers:
    - name: ${output:${stage}:${app}:${name}-layer.name} # 配置对应的 layer
      version: ${output:${stage}:${app}:${name}-layer.version} # 配置对应的 layer 版本
```

接着执行命令 `sls deploy --target=./layer` 部署 `layer`，然后这次部署看看速度应该已经在 10s 左右了

```bash
sls deploy
```

关于 layer 和云函数，补充两个知识点：

**layer 的加载与访问**

layer 会在函数运行时，将内容解压到 `/opt` 目录下，如果存在多个 layer，那么会按时间循序进行解压。如果需要访问 layer 内的文件，可以直接通过 `/opt/xxx` 访问。如果是访问 `node_module` 则可以直接 `import`，因为 scf 的 `NODE_PATH` 环境变量默认已包含 `/opt/node_modules` 路径。

**配额**

云函数 scf 针对每个用户帐号，均有一定的配额限制：

![img](https://img.serverlesscloud.cn/202099/1599651593275-v2-35a92707d47d21e22f162774dbfa9190_b.png)

其中需要重点关注的就是单个函数代码体积 500mb 的上限。在实际操作中，云函数虽然提供了 500mb。但也存在着一个 deploy 解压上限。

关于绕过配额问题：

- 如果超的不多，那么使用 `npm install --production` 就能解决问题
- 如果超的太多，那就通过挂载 cfs 文件系统来进行规避，我会在下面部署 tensorflow 算法模型服务章节里面，展开聊聊如何把 800mb tensorflow 的包 + 模型部署到 SCF 上

## 实现前端 SSR 服务

下面将使用 next.js 来构建一个前端 SSR 服务。

新建目录并初始化项目：

```bash
mkdir art-front && cd art-front && npm init
```

安装依赖：

```bash
npm install next react react-dom typescript @types/node swr antd @ant-design/icons dayjs
```

增加 ts 支持（next.js 跑起来会自动配置）：

```bash
touch tsconfig.json
```

打开 package.json 文件并添加 scripts 配置段：

```
"scripts": {
  "dev": "next",
  "build": "next build",
  "start": "next start"
}
```

编写前端业务逻辑（文中仅展示主要逻辑，源码在 GitHub 获取）

pages/_app.tsx

```js
import React from "react";
import "antd/dist/antd.css";
import { SWRConfig } from "swr";

export default function MyApp({ Component, pageProps }) {
  return (
    <SWRConfig
      value={{
        refreshInterval: 2000,
        fetcher: (...args) => fetch(args[0], args[1]).then((res) => res.json()),
      }}
    >
      <Component {...pageProps} />
    </SWRConfig>
  );
}
```

pages/index.tsx  [完整代码](https://github.com/jiangqizheng/art/blob/master/art-front/pages/index.tsx)

```js
import React from "react";
import { Card, Upload, message, Radio, Spin, Divider } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import useSWR from "swr";

let origin = 'http://localhost:8080'
if (process.env.NODE_ENV === 'production') {
  // 使用你自己的部署的art-api服务地址
  origin = 'https://service-5yyo7qco-1254074572.gz.apigw.tencentcs.com/release' 
}

// 略...
export default function Index() {
  const { data } = useSWR(`${origin}/api/images`);

  const [img, setImg] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const uploadImg = React.useCallback((file, style) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const res = await fetch(
        `${origin}/api/images/upload`, {
        method: 'POST',
        body: JSON.stringify({
          imgBase64: reader.result,
          style
        }),
        mode: 'cors'
      }
      ).then((res) => res.json());

      if (res.success) {
        setImg(res.data);
      } else {
        message.error(res.message);
      }
      setLoading(false);
    }
  }, []);

  const [artStyle, setStyle] = React.useState(STYLE_MODE.cube);

  return (
        <Dragger
          style={{ padding: 24 }}
          {...{
            name: "art_img",
            showUploadList: false,
            action: `${origin}/api/upload`,
            onChange: (info) => {
              const { status } = info.file;
              if (status !== "uploading") {
                console.log(info.file, info.fileList);
              }
              if (status === "done") {
                setImg(info.file.response);
                message.success(`${info.file.name} 上传成功`);
                setLoading(false);
              } else if (status === "error") {
                message.error(`${info.file.name} 上传失败`);
                setLoading(false);
              }
            },
            beforeUpload: (file) => {
              if (
                !["image/png", "image/jpg", "image/jpeg"].includes(file.type)
              ) {
                message.error("图片格式必须是 png、jpg、jpeg");
                return false;
              }
              const isLt10M = file.size / 1024 / 1024 < 10;
              if (!isLt10M) {
                message.error("文件大小超过10M");
                return false;
              }
              setLoading(true);

              uploadImg(file, artStyle);
              return false;
            },
          }}
      // 略...
```

使用 `npm run dev` 把前端跑起来看看，看到以下提示就是成功了

> ready - started server on http://localhost:3000 

接着配置 `serverless.yml`（如果有需要可以参考前文，使用 layer 优化部署体验）

```yaml
component: nextjs
app: art
name: art-front
stage: dev

inputs:
  src:
    dist: ./
    hook: npm run build
    exclude:
      - .env
  region: ap-guangzhou
  functionName: ${name}
  runtime: Nodejs12.16
  staticConf:
    cosConf:
      bucket: art-front # 将前端静态资源部署到oss，减少scf的调用频次
  apigatewayConf:
    enableCORS: true
    protocols:
      - https
      - http
    environment: release
    # customDomains: # 如果需要，可以自己配置自定义域名
    #   - domain: xxxxx 
    #     certificateId: xxxxx # 证书 ID
    #     # 这里将 API 网关的 release 环境映射到根路径
    #     isDefaultMapping: false
    #     pathMappingSet:
    #       - path: /
    #         environment: release
    #     protocols:
    #       - https
  functionConf:
    timeout: 60
    memorySize: 128
    environment:
      variables:
        apiUrl: ${output:${stage}:${app}:art-api.apigw.url} # 此处可以将api通过环境变量注入
```

由于我们额外配置了 oss，所以需要额外配置一下 `next.config.js`

```js
const isProd = process.env.NODE_ENV === "production";

const STATIC_URL =
  "https://art-front-<你的appid>.cos.ap-guangzhou.myqcloud.com/";

module.exports = {
  assetPrefix: isProd ? STATIC_URL : "",
};
```

## 提供 Tensorflow 2.x 算法模型服务

在上面的例子中，我们使用的 Tensorflow，暂时还是调用我预先提供的接口。

接着让我们会把它替换成我们自己的服务。

**基础信息**

- tensoflow2.3
- [model](https://tfhub.dev/google/magenta/arbitrary-image-stylization-v1-256/2)

scf 在 python 环境下，默认提供了 tensorflow1.9 依赖包，使用 python 可以用较低的成本直接上手。

**问题所在**

但如果你想使用 2.x 版本，或不熟悉 python，想用 node 来跑 tensorflow，那么就会遇到代码包大小的限制的问题。

-  Python 中 Tensorflow 2.3 包体积 800mb 左右 
-  node 中 tfjs-node2.3 安装后，同样会超过 400mb（tfjs core 版本，非常小，不过速度太慢） 

**怎么解决** —— 文件存储服务！

先看看 [CFS 文档](https://cloud.tencent.com/document/product/583/46199)的介绍

![img](https://img.serverlesscloud.cn/202099/1599651653678-v2-1ddde91871f80f65cf2bc3e44938f489_b.png)


挂载后，就可以正常使用了，腾讯云提供了一个简单例子。

```js
var fs = requiret('fs');
exports.main_handler = async (event, context) => {
  await fs.promises.writeFile('/mnt/myfolder/filel.txt', JSON.stringify(event)); 
  return event;
};
```

既然能正常读写，那么就能够正常的载入 npm 包，可以看到我直接加载了 `/mnt` 目录下的包，同时 model 也放在 `/mnt` 下

```js
  tf = require("/mnt/nodelib/node_modules/@tensorflow/tfjs-node");
  jpeg = require("/mnt/nodelib/node_modules/jpeg-js");
  images = require("/mnt/nodelib/node_modules/images");
  loadModel = async () => tf.node.loadSavedModel("/mnt/model");
```

如果你使用 Python，那么可能会遇到一个问题，那就是 scf 默认环境下提供了 tensorflow 1.9 的依赖包，所以需要使用 insert，提高 `/mnt` 目录下包的优先级

```python
sys.path.insert(0, "./mnt/xxx")
```

上面提供了解决方案，那么具体开发中可能会感觉很麻烦，因为 csf 必须和 scf 配置在同一个子网内，无法挂载到本地进行操作。

所以，在实际部署过程中，可以在对应网络下，购置一台按需计费的 ecs 云服务器实例。然后将硬盘挂载后，直接进行操作，最后在云函数成功部署后，销毁实例：）

```bash
sudo yum install nfs-utils
mkdir <待挂载目标目录>
sudo mount -t nfs -o vers=4.0，noresvport <挂载点IP>:/ <待挂载目录>
```

具体业务代码如下：

```js
const fs = require("fs");
let tf, jpeg, loadModel, images;

if (process.env.NODE_ENV !== "production") {
  tf = require("@tensorflow/tfjs-node");
  jpeg = require("jpeg-js");
  images = require("images");
  loadModel = async () => tf.node.loadSavedModel("./model");
} else {
  tf = require("/mnt/nodelib/node_modules/@tensorflow/tfjs-node");
  jpeg = require("/mnt/nodelib/node_modules/jpeg-js");
  images = require("/mnt/nodelib/node_modules/images");
  loadModel = async () => tf.node.loadSavedModel("/mnt/model");
}

exports.main_handler = async (event) => {
  const { imgBase64, style } = JSON.parse(event.body)
  if (!imgBase64 || !style) {
    return { success: false, message: "需要提供完整的参数imgBase64、style" };
  }
  time = Date.now();
  console.log("解析图片--");
  const styleImg = tf.node.decodeJpeg(fs.readFileSync(`./imgs/style_${style}.jpeg`));
  const contentImg = tf.node.decodeJpeg(
    images(Buffer.from(imgBase64, 'base64')).size(400).encode("jpg", { operation: 50 }) // 压缩图片尺寸
  );
  const a = styleImg.toFloat().div(tf.scalar(255)).expandDims();
  const b = contentImg.toFloat().div(tf.scalar(255)).expandDims();
  console.log("--解析图片 %s ms", Date.now() - time);


  time = Date.now();
  console.log("载入模型--");
  const model = await loadModel();
  console.log("--载入模型 %s ms", Date.now() - time);


  time = Date.now();
  console.log("执行模型--");
  const stylized = tf.tidy(() => {
    const x = model.predict([b, a])[0];
    return x.squeeze();
  });
  console.log("--执行模型 %s ms", Date.now() - time);

  time = Date.now();

  const imgData = await tf.browser.toPixels(stylized);
  var rawImageData = {
    data: Buffer.from(imgData),
    width: stylized.shape[1],
    height: stylized.shape[0],
  };

  const result = images(jpeg.encode(rawImageData, 50).data)
    .draw(
      images("./imgs/logo.png"),
      Math.random() * rawImageData.width * 0.9,
      Math.random() * rawImageData.height * 0.9
    )
    .encode("jpg", { operation: 50 });

  return { success: true, data: result.toString('base64') };
};
```

## 最后

感谢阅读，以上代码均经过实测，如果发现异常，那就再看一遍：）

有其他问题或想法，可以移步[原文链接](https://zhuanlan.zhihu.com/p/218803108)讨论。

> 源码：[jiangqizheng/art](https://github.com/jiangqizheng/art)，欢迎 star。

欢迎访问：[Serverless 中文网](https://serverlesscloud.cn/)，您可以在 [最佳实践](https://serverlesscloud.cn/best-practice) 里体验更多关于 Serverless 应用的开发！