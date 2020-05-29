---
title: 基于「树莓派+腾讯云」的在线甲醛监测系统
description: "本文详述腾讯云多产品组合设计和体验报告 之 “树莓派+腾讯云=在线甲醛监测系统”。涉及腾讯云产品：API网关、无服务器云函数、云数据库、腾讯云图。"
keywords: Serverless,serverless framework,腾讯云serverless
date: 2019-07-04
thumbnail: https://img.serverlesscloud.cn/qianyi/b96CibCt70iaaJcib7FH02wTKvoHALAMw4f553WgrmrmItKmjkMfO2fI0YJcpdO2WibwHXYAOGZyMaQruxD3skk7icQ.jpg
categories:
  - user-stories
authors:
  - ecky
authorslink:
  - https://zhuanlan.zhihu.com/ServerlessGo
tags:
  - 树莓派
  - Serverless
---

扔掉小瓶盖，腾讯云带你体验在线甲醛监测系统！本文详述腾讯云多产品组合设计和体验报告 之 “树莓派+腾讯云=在线甲醛监测系统”。涉及腾讯云产品：API网关、无服务器云函数、云数据库、腾讯云图。

> **正文**

身边朋友在装修新房，顺便来吐槽甲醛检测麻烦，比如 有检测无监测（一次性），比如测试复杂（现场+人工）等等。刚好做为云产品经理，经常想的就是如何了解和验证多云产品组合方案的可用性问题，索性结合一下，直接把这个需求上云，然后就有了这套系统。老规矩，先上结论。

> **系统概要**

### **产品设计特性**

- 原型验证：验证多产品联动效果与开发成本。
- 软硬结合：扩展云端能力至线下物理环境。
- 能力扩展：serverless分离云端与终端，独立扩展云监控、消息队列等其它产品。
- 通用架构：云端使用通用数据结构及接口，免开发即对接各种监测数据上报。
- 弱环境要求：可PoE供电，5V/0.5A低功耗可长期运行。


### **系统组成**

_终端：终端组件_

- RaspberryPi 3B+（raspbian-stretch-lite/GPIO接口/python2.7)
- UART-CH2O传感器（UART接口）
- 128X32 OLED屏 SSD1306芯片（I2C接口）

注：RaspberryPi后续简写为Rpi

_云端：腾讯云产品_

- 腾讯云 API网关
- 腾讯云 无服务器云函数
- 腾讯云 云数据库 Mysql
- 腾讯云 腾讯云图



### **效果展示**

_腾讯云图_

![](https://img.serverlesscloud.cn/qianyi/b96CibCt70iaaJcib7FH02wTKvoHALAMw4fgzEuBERygLb3q5GPrpYJxxtLuXNJDCduKvkSTjHBdxmHxPApzb96xA.jpg)

_终端组件_

![](https://img.serverlesscloud.cn/qianyi/b96CibCt70iaaJcib7FH02wTKvoHALAMw4f553WgrmrmItKmjkMfO2fI0YJcpdO2WibwHXYAOGZyMaQruxD3skk7icQ.jpg)

当前版本中，Rpi 使用wifi 连接互联网（也可使用有线网），故此处上云有网络依赖。

### **传感器原理与功能定位**

_UART-CH2O传感器_

- 原理：电化学传感器通过与被测气体发生反应并产生与气体浓度成正比的电信号来工作。
- 优点：简单易操作
- 缺点：非定量分析法，受温湿度、其它气体干扰准确度，且需要较准。
- 结论：以长期使用后的房间环境做为基准，进行0基准点参考。用于温湿度差异不大的环境下，提供实时监测（相对值），并附加长期趋势分析。

> **设计与实现**

### **产品设计与技术策略**

设计过程中，也进行了产品生命周期的思考，尝试进行了产品长短期设计的分析与定义（暂不展开，后续有时间写一下）。

确认了形态目标后，遵循下面几个基本原则，进行具体技术设计：

- 分级可用：避免单环故障，系统全面崩溃
- 读写分离：便于后续调试、优化、更新版本
- 远程维护：避免出现场处理异常


### **概要架构图**

![](https://img.serverlesscloud.cn/qianyi/b96CibCt70iaaJcib7FH02wTKvoHALAMw4f8JMUrO0qsyllIiahf4bno7rUGiaN1LbDhBUp5OlIQiajwLa8OCIaGjXRA.jpg)

从架构看来

- 云端部分：由于云产品的能力提供了各种便利，学习和搭建成本很低。
- 终端部分：需要多考虑免维护与自动恢复，各项工作内容稍多一些。

### **分级可用目标**

4.本地实时展示+本地缓存+数据上云 +云端显示。

3.本地实时展示+本地缓存+数据上云。云图异常。

2.本地实时展示+本地缓存。上云通路异常。

1.本地实时展示。本地sqlite异常。

0.本地无展示。硬件故障或断电。

### **硬件接线与打开系统接口**

**Rpi GPIO**


_GPIO_

(General-purpose input/output)即通用IO接口，是一种常见的端口扩展器，树莓派使用的是40针的GPIO接口。

_RPI GPIO图示_

![](https://img.serverlesscloud.cn/qianyi/b96CibCt70iaaJcib7FH02wTKvoHALAMw4f3XudpZ9dHRqDrpWMngFukLDAaFU62LbjFDed3PcF2S67YBp2DsrU0A.jpg)

**UART-CH2O**

![](https://img.serverlesscloud.cn/qianyi/j3gficicyOvavXLTR2QfHtSID5OWgnGvtCHmv6Nq2bo0CiahlPqiayWSPyd5MnOFlIvrRdG2iaNJrs2rw6I0zEgiajBA.jpg)

注：本次使用传感器，硬件接口是1.25mm端子，Rpi是2.5mm端子，使用了 7P1.25转2.5杜邦线，进行连接

**OLED**

_接线方式(I2C协议)_

![](https://img.serverlesscloud.cn/qianyi/j3gficicyOvavXLTR2QfHtSID5OWgnGvtCXouiaibibbdVDYaTLf98BWwqWJ7A0ficdDgoVDZCYOtYGaX894z1hmxszQ.jpg)

_打开I2C接口_

```javascript
raspi-config
```

按下图打开I2C接口

![](https://img.serverlesscloud.cn/qianyi/b96CibCt70iaaJcib7FH02wTKvoHALAMw4fmVEacqX8hobPyxS0iby0bsjNTuYF9XOK2GwG7crynHw6MTJSiaznjbPA.jpg)

![](https://img.serverlesscloud.cn/qianyi/b96CibCt70iaaJcib7FH02wTKvoHALAMw4fSVgOdY3iataWicaURvMoDjET5tciac8WvztRbdlzrlEWFibQiaPLUnEjqZA.jpg)

![](https://img.serverlesscloud.cn/qianyi/b96CibCt70iaaJcib7FH02wTKvoHALAMw4f3sKibAjjBy5EC7tbQQvRiabLvtDPKDuk2RicqURx9UibP51g3jeVDMDNHQ.jpg)

测试执行

```javascript
i2cdetect -y 1
```

![](https://img.serverlesscloud.cn/qianyi/b96CibCt70iaaJcib7FH02wTKvoHALAMw4fQxxFfbSXmbNbXD06pwe1Xh9ocdW7EYV1ibH0Hkiau0pbLP5bibmiaT7icJA.jpg)

看到 3C 即识别硬件成功

### **本地开发与配置**

本文暂仅放出关键代码(硬件操作部分)，便于大家撸硬件。完整包(代码+配置) 稍后放出，请关注 github/DemoOnTencentCloud。


**环境配置**

- 启动对时：rc.local 增加 nptdata cn.ntp.org.cn。避免重启后时间错位，监测错位。
- 启动拉起：getdata.py oled.py 需持续在线。
- 定时检测：getdata.py oled.py cron每分钟判断活性，进程挂掉即拉起。
- 定时同步：sync.py cron每分钟执行
- 远程维护：使用ssh tunnel 的 Remote Port Forwarding 模式，进行反向代理。

**ssh tunnel**

此处使用 autossh 进行连接，autossh可完成建立通道与监控通道的工作，通道断开后，可自主重连。远端连接云主机，之后可以云主机为跳板，反向代理访问NAT环境Rpi设备。

```javascript
bash autossh -M 监控端口 -R 远程通信端口:localhost:22 账号名@远程IP或域名 -p端口号 -i 账号KEY -o serveraliveinterval=60 -N -f
```

连接时，在云主机执行

```javascript
bash ssh -p 远程通信端口 localhost
```

**getdata.py**

获取传感器读数代码（完整代码待放出 github/DemoOnTencentCloud）

```javascript
import serial
from time import sleep

ser=serial.Serial("/dev/serial0",9600)

while True :
    r_data = ser.read()
    sleep(0.3)
    data_left = ser.inWaiting()
    r_data += ser.read(data_left)
    if 9 != len(r_data):
        print 'error length: %d'%len(r_data)
        continue
    else:
        n=ord(r_data[4])*256+ord(r_data[5])
        updatedata(n/1000.0) # ppm = n/1000.0
```

**flusholed.py**

依赖库安装

(基于 https://github.com/adafruit/Adafruit\_Python\_SSD1306)

```javascript
sudo python -m pip install --upgrade pip setuptools wheel
sudo pip install Adafruit-SSD1306
```

下为功能伪代码。（完整代码待放出 github/DemoOnTencentCloud）

```javascript
# 读取 cachefile 缓存文件
# 刷新 OLED 显示
```

**sync.py**

下为功能伪代码。（完整代码待放出 github/DemoOnTencentCloud）

```javascript
# 访问 APIGW，获取最新记录时间戳
# 读本地sqlite库，获取增量数据
# 访问 APIGW，提交更新数据
```

**Sqlite结构**

_表结构_

```javascript
CREATE TABLE "sensordata" (
"id" INTEGER PRIMARY KEY AUTOINCREMENT,
"utime" INTEGER NOT NULL,
"utype" INTEGER DEFAULT 0 NOT NULL,
"udata" REAL NOT NULL,
"sdata" TEXT
);
```

![](https://mmbiz.qpic.cn/mmbiz_png/j3gficicyOvavXLTR2QfHtSID5OWgnGvtCZfFpxEIpmXX5kMIfJeNzzjSrEEZicEmDQcic6iaE9a1OhDX8NRqO9TjEw.jpg)

### **云端开发与配置**

**无服务器云函数**

优先配置 无服务器云函数，参考 文档 建立并保存“函数代码”后，在管理页面的“触发方式”功能中，直接生成对应API网关。

![](data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==)

（完整代码待放出 github/DemoOnTencentCloud）。

当前主要强调几个注意事项：

1. 自动提交：连接数据库必须使用“autocommit = True,”参数，否则由于事务隔离，DB链接重新连接前，查询结果不变。（查不到新增记录ID）


2. 返回头：API网关开启“响应集成”时，云函数返回值需结合返回信息，指定"Content-Type"，否则出现 "transfer closed with outstanding read data remaining" 错误。


3. 验证连接：云函数实例可长期存在，但一定时间未操作mysql链接时，mysql将释放链接，所以代码中需要进行验证链路可用性。


**API网关**

_配置服务_

参考 文档 ，以上“触发方式”中建立的API网关服务，由API网关的 服务 页面，点击相应服务名，选择“API管理”分页，点击“编辑”，然后配置“请求方法-POST”、“鉴权类型-密钥对”、“使用响应集成”，其它余配置按默认即可。

_下载与使用SDK_

API网关 控制台 -> 点击 **服务名** -> 点击 **API文档/SDK** -> 点击 **下载SDK**

（完整配置待放出 github/DemoOnTencentCloud）

**云数据库 Mysql**

_表结构_

```javascript
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";

CREATE TABLE `sensordata` (
  `id` int(11) NOT NULL,
  `stime` timestamp NULL DEFAULT NULL,
  `utype` int(11) NOT NULL DEFAULT '0',
  `udata` float NOT NULL,
  `sdata` varchar(256) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

ALTER TABLE `sensordata`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `sensordata`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;
```

![](https://mmbiz.qpic.cn/mmbiz_png/j3gficicyOvavXLTR2QfHtSID5OWgnGvtCGBuE8euzdzk2c1LKibKgpGiccgCyFFmToHfLVq7rbXFyGh8ibxZjibltIA.jpg)

**云图配置**

_简要使用说明_

拖选组件 -> 点击数据栏 -> 选择数据库 -> 填写SQL -> 开启自动更新 -> 预览 -> 发布

_操作示例图_

![](https://img.serverlesscloud.cn/qianyi/b96CibCt70iaaJcib7FH02wTKvoHALAMw4fhFB0fec4tPbkKXibWxgdqyxSrtKg5KE4ey5v1A9gwKnocfASlcw52Hg.jpg)

_组件配置信息_

- 最新同步时间 - 通用文本

```javascript
select concat('最新同步时间 ',stime) as value from sensordata order by id desc limit 1
```

- 国标系数比 - 水位图

```javascript
select round((udata)/0.08*100, 2) as value from sensordata order by id desc limit 1
```

- 实时读数 - 基本条形图

```javascript
select round(udata, 3) as x, '' as y from sensordata order by id desc limit 1
```

- 10分钟数据 - 基本折线图

```javascript
select * from (select id, round(udata, 3) as y, date_format(stime, '%H:%i:%S') as x, utype as s from sensordata order by id desc limit 360) as t1 order by id asc
```

- 7天数据 - 基本折线图

```javascript
select distinct (dt), round(AVG(udata),3) as y, dt as x, '0' as s from (select id, date_format(stime, '%Y-%m-%d %H') as dt, udata from sensordata order by id desc limit 604800) as t1 group by dt order by dt ASC
```

> **写在最后**

关于丢数据（非守护进程）、脏数据（未较验数据唯一性）、缺乏系统监控告警（未接入云监控）等等待优化点，由于时间关系暂未展开，后面可以再行探讨。

> **传送门：**
> - GitHub: [github.com/serverless](https://github.com/serverless/serverless/blob/master/README_CN.md) 
> - 官网：[serverless.com](https://serverless.com/)

欢迎访问：[Serverless 中文网](https://serverlesscloud.cn/)，您可以在 [最佳实践](https://serverlesscloud.cn/best-practice) 里体验更多关于 Serverless 应用的开发！
