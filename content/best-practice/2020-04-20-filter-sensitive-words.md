---
title: Serverless 架构下，3 分钟实现文本敏感词过滤
description: 随着各种社交平台等的日益火爆，敏感词过滤逐渐成了非常重要的也是值得重视的功能。那么在 Serverless 架构下，敏感词过滤又有那些新的实现呢？
keywords: Serverless 多环境配置,Serverless 管理环境,Serverless配置方案
date: 2020-04-20
thumbnail: https://img.serverlesscloud.cn/2020511/1589207417716-ZalNtxgQAC_small.jpg
categories:
  - best-practice
authors:
  - Anycodes
authorslink:
  - https://zhuanlan.zhihu.com/ServerlessGo
tags:
  - Python
  - 文本处理
---

## 前言

敏感词过滤是随着互联网社区一起发展起来的一种阻止网络犯罪和网络暴力的技术手段，通过对可能存在犯罪或网络暴力的关键词进行有针对性的筛查和屏蔽，能够防患于未然，将后果严重的犯罪行为扼杀于萌芽之中。

随着各种社交论坛的日益火爆，敏感词过滤逐渐成为了非常重要的功能。那么在 Serverless 架构下，利用 Python 语言，敏感词过滤又有那些新的实现呢？我们能否用最简单的方法实现一个敏感词过滤的 API 呢？

## 了解敏感过滤的几种方法


### Replace方法

敏感词过滤，其实在一定程度上是文本替换，以 Python 为例，我们可以通过 replace 来实现，首先准备一个敏感词库，然后通过 replace 进行敏感词替换:

```python
def worldFilter(keywords, text):
    for eve in keywords:
        text = text.replace(eve, "***")
    return text
keywords = ("关键词1", "关键词2", "关键词3")
content = "这是一个关键词替换的例子，这里涉及到了关键词1还有关键词2，最后还会有关键词3。"
print(worldFilter(keywords, content))
```

这种方法虽然操作简单，但是存在一个很大的问题：在文本和敏感词汇非常庞大的情况下，会出现很严重的性能问题。

举个例子，我们先修改代码进行基本的性能测试：

```python
import time

def worldFilter(keywords, text):
    for eve in keywords:
        text = text.replace(eve, "***")
    return text
keywords =[ "关键词" + str(i) for i in range(0,10000)]
content = "这是一个关键词替换的例子，这里涉及到了关键词1还有关键词2，最后还会有关键词3。" * 1000
startTime = time.time()
worldFilter(keywords, content)
print(time.time()-startTime)
```

此时的输出结果是：`0.12426114082336426`，可以看到性能非常差。


### 正则表达方法

相较于 `replace`，使用正则表达 `re.sub` 实现可能更加快速。

```python
import time
import re
def worldFilter(keywords, text):
     return re.sub("|".join(keywords), "***", text)
keywords =[ "关键词" + str(i) for i in range(0,10000)]
content = "这是一个关键词替换的例子，这里涉及到了关键词1还有关键词2，最后还会有关键词3。" * 1000
startTime = time.time()
worldFilter(keywords, content)
print(time.time()-startTime)
```

增加性能测试之后，我们按照上面的方法进行改造测试，输出结果是 `0.24773502349853516`。

对比这两个例子，我们会发现当前两种方法的性能差距不是很大，但是随着文本数量的增加，正则表达的优势会逐渐凸显，性能提升明显。

### DFA 过滤敏感词

相对来说，DFA 过滤敏感词的效率会更高一些，例如我们把坏人、坏孩子、坏蛋作为敏感词，那么它们的树关系可以这样表达：

![](https://img.serverlesscloud.cn/202058/2-4-1.png)

而 DFA 字典是这样表示的：

```
{
    '坏': {
        '蛋': {
            '\x00': 0
        },
        '人': {
            '\x00': 0
        },
        '孩': {
            '子': {
                '\x00': 0
            }
        }
    }
}
```

使用这种树表示问题最大的好处就是可以降低检索次数、提高检索效率。其基本代码实现如下：

```python
import time

class DFAFilter(object):
    def __init__(self):
        self.keyword_chains = {}  # 关键词链表
        self.delimit = '\x00'  # 限定

    def parse(self, path):
        with open(path, encoding='utf-8') as f:
            for keyword in f:
                chars = str(keyword).strip().lower()  # 关键词英文变为小写
                if not chars:  # 如果关键词为空直接返回
                    return
                level = self.keyword_chains
                for i in range(len(chars)):
                    if chars[i] in level:
                        level = level[chars[i]]
                    else:
                        if not isinstance(level, dict):
                            break
                        for j in range(i, len(chars)):
                            level[chars[j]] = {}
                            last_level, last_char = level, chars[j]
                            level = level[chars[j]]
                        last_level[last_char] = {self.delimit: 0}
                        break
                if i == len(chars) - 1:
                    level[self.delimit] = 0

    def filter(self, message, repl="*"):
        message = message.lower()
        ret = []
        start = 0
        while start < len(message):
            level = self.keyword_chains
            step_ins = 0
            for char in message[start:]:
                if char in level:
                    step_ins += 1
                    if self.delimit not in level[char]:
                        level = level[char]
                    else:
                        ret.append(repl * step_ins)
                        start += step_ins - 1
                        break
                else:
                    ret.append(message[start])
                    break
            else:
                ret.append(message[start])
            start += 1

        return ''.join(ret)



gfw = DFAFilter()
gfw.parse( "./sensitive_words")
content = "这是一个关键词替换的例子，这里涉及到了关键词1还有关键词2，最后还会有关键词3。" * 1000
startTime = time.time()
result = gfw.filter(content)
print(time.time()-startTime)
```

这里的字典库是：

```python
with open("./sensitive_words", 'w') as f:
    f.write("\n".join( [ "关键词" + str(i) for i in range(0,10000)]))
```

执行结果：

```text
0.06450581550598145
```

从中，我们可以看到性能又进一步得到了提升。

### AC 自动机过滤敏感词算法

什么是 AC 自动机？简单来说，AC 自动机就是字典树 +kmp 算法 + 失配指针，一个常见的例子就是给出 n 个单词，再给出一段包含 m 个字符的文章，让你找出有多少个单词在文章里出现过。

代码实现：

```python
import time
class Node(object):
    def __init__(self):
        self.next = {}
        self.fail = None
        self.isWord = False
        self.word = ""


class AcAutomation(object):

    def __init__(self):
        self.root = Node()

    # 查找敏感词函数
    def search(self, content):
        p = self.root
        result = []
        currentposition = 0

        while currentposition < len(content):
            word = content[currentposition]
            while word in p.next == False and p != self.root:
                p = p.fail

            if word in p.next:
                p = p.next[word]
            else:
                p = self.root

            if p.isWord:
                result.append(p.word)
                p = self.root
            currentposition += 1
        return result

    # 加载敏感词库函数
    def parse(self, path):
        with open(path, encoding='utf-8') as f:
            for keyword in f:
                temp_root = self.root
                for char in str(keyword).strip():
                    if char not in temp_root.next:
                        temp_root.next[char] = Node()
                    temp_root = temp_root.next[char]
                temp_root.isWord = True
                temp_root.word = str(keyword).strip()

    # 敏感词替换函数
    def wordsFilter(self, text):
        """
        :param ah: AC自动机
        :param text: 文本
        :return: 过滤敏感词之后的文本
        """
        result = list(set(self.search(text)))
        for x in result:
            m = text.replace(x, '*' * len(x))
            text = m
        return text


acAutomation = AcAutomation()
acAutomation.parse('./sensitive_words')
startTime = time.time()
print(acAutomation.wordsFilter("这是一个关键词替换的例子，这里涉及到了关键词1还有关键词2，最后还会有关键词3。"*1000))
print(time.time()-startTime)
```

词库同样是：

```python
with open("./sensitive_words", 'w') as f:
    f.write("\n".join( [ "关键词" + str(i) for i in range(0,10000)]))
```

使用上面的方法，测试结果为 `0.017391204833984375`。

### 敏感词过滤方法小结

根据上文的测试对比，我们可以发现在所有算法中，DFA 过滤敏感词性能最高，但是在实际应用中，DFA 过滤和 AC 自动机过滤各自有自己的适用场景，可以根据具体业务来选择。

## 实现敏感词过滤 API

想要实现敏感词过滤 API，就需要将代码部署到 Serverless 架构上，选择 API 网关与函数计算进行结合。以 AC 自动机过滤敏感词算法为例：我们只需要增加是几行代码就好：

```python
# -*- coding:utf-8 -*-

import json, uuid


class Node(object):
    def __init__(self):
        self.next = {}
        self.fail = None
        self.isWord = False
        self.word = ""


class AcAutomation(object):

    def __init__(self):
        self.root = Node()

    # 查找敏感词函数
    def search(self, content):
        p = self.root
        result = []
        currentposition = 0

        while currentposition < len(content):
            word = content[currentposition]
            while word in p.next == False and p != self.root:
                p = p.fail

            if word in p.next:
                p = p.next[word]
            else:
                p = self.root

            if p.isWord:
                result.append(p.word)
                p = self.root
            currentposition += 1
        return result

    # 加载敏感词库函数
    def parse(self, path):
        with open(path, encoding='utf-8') as f:
            for keyword in f:
                temp_root = self.root
                for char in str(keyword).strip():
                    if char not in temp_root.next:
                        temp_root.next[char] = Node()
                    temp_root = temp_root.next[char]
                temp_root.isWord = True
                temp_root.word = str(keyword).strip()

    # 敏感词替换函数
    def wordsFilter(self, text):
        """
        :param ah: AC自动机
        :param text: 文本
        :return: 过滤敏感词之后的文本
        """
        result = list(set(self.search(text)))
        for x in result:
            m = text.replace(x, '*' * len(x))
            text = m
        return text


def response(msg, error=False):
    return_data = {
        "uuid": str(uuid.uuid1()),
        "error": error,
        "message": msg
    }
    print(return_data)
    return return_data


acAutomation = AcAutomation()
path = './sensitive_words'
acAutomation.parse(path)


def main_handler(event, context):
    try:
        sourceContent = json.loads(event["body"])["content"]
        return response({
            "sourceContent": sourceContent,
            "filtedContent": acAutomation.wordsFilter(sourceContent)
        })
    except Exception as e:
        return response(str(e), True)
```

最后，为了方便本地测试，我们可以再增加以下代码：

```python
def test():
    event = {
        "requestContext": {
            "serviceId": "service-f94sy04v",
            "path": "/test/{path}",
            "httpMethod": "POST",
            "requestId": "c6af9ac6-7b61-11e6-9a41-93e8deadbeef",
            "identity": {
                "secretId": "abdcdxxxxxxxsdfs"
            },
            "sourceIp": "14.17.22.34",
            "stage": "release"
        },
        "headers": {
            "Accept-Language": "en-US,en,cn",
            "Accept": "text/html,application/xml,application/json",
            "Host": "service-3ei3tii4-251000691.ap-guangzhou.apigateway.myqloud.com",
            "User-Agent": "User Agent String"
        },
        "body": "{\"content\":\"这是一个测试的文本，我也就呵呵了\"}",
        "pathParameters": {
            "path": "value"
        },
        "queryStringParameters": {
            "foo": "bar"
        },
        "headerParameters": {
            "Refer": "10.0.2.14"
        },
        "stageVariables": {
            "stage": "release"
        },
        "path": "/test/value",
        "queryString": {
            "foo": "bar",
            "bob": "alice"
        },
        "httpMethod": "POST"
    }
    print(main_handler(event, None))


if __name__ == "__main__":
    test()
```

完成之后，就可以进行测试运行，例如我的字典是：

```
呵呵
测试
```

执行之后结果：

```
{'uuid': '9961ae2a-5cfc-11ea-a7c2-acde48001122', 'error': False, 'message': {'sourceContent': '这是一个测试的文本，我也就呵呵了', 'filtedContent': '这是一个**的文本，我也就**了'}}
```

接下来，我们将代码部署到云端，新建 `serverless.yaml`:

```yaml
sensitive_word_filtering:
  component: "@serverless/tencent-scf"
  inputs:
    name: sensitive_word_filtering
    codeUri: ./
    exclude:
      - .gitignore
      - .git/**
      - .serverless
      - .env
    handler: index.main_handler
    runtime: Python3.6
    region: ap-beijing
    description: 敏感词过滤
    memorySize: 64
    timeout: 2
    events:
      - apigw:
          name: serverless
          parameters:
            environment: release
            endpoints:
              - path: /sensitive_word_filtering
                description: 敏感词过滤
                method: POST
                enableCORS: true
                param:
                  - name: content
                    position: BODY
                    required: 'FALSE'
                    type: string
                    desc: 待过滤的句子
```

然后通过 `sls --debug` 进行部署，部署结果：

![](https://img.serverlesscloud.cn/202058/2-4-2.png)

最后，通过 PostMan 进行测试：

![](https://img.serverlesscloud.cn/202058/2-4-3.png)


## 总结

敏感词过滤是当前企业的普遍需求，通过敏感词过滤，我们可以在一定程度上遏制恶言恶语和违规言论的出现。在具体实现过程中，有两个方面需要额外主要：

- 敏感词库的获得问题：Github 上有很多敏感词库，其中包含了各种场景中的敏感词，大家可以自行搜索下载使用；

- API 使用场景的问题：我们可以将这个 API 放置在社区跟帖系统、留言评论系统或者是博客发布系统中，这样可以防止出现敏感词汇，减少不必要的麻烦。



---
<div id='scf-deploy-iframe-or-md'></div>

---

> **传送门：**
> - GitHub: [github.com/serverless](https://github.com/serverless/serverless/blob/master/README_CN.md)
> - 官网：[serverless.com](https://serverless.com/)

欢迎访问：[Serverless 中文网](https://serverlesscloud.cn/)，您可以在 [最佳实践](https://serverlesscloud.cn/best-practice) 里体验更多关于 Serverless 应用的开发！
