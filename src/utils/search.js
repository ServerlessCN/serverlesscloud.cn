/*
*
* 引入：<script type="text/javascript" src="./search.js"></script>
* 使用：getSearch(temp, articleList, replaceList)
* temp: 输入内容，就是用户要搜索的内容，例如用户搜索的是 serverless framework，那么temp就是serverless framework
* articleList：将会在这个list中寻找数据，数据结构为：
*     [
*                {
*                    "node": {
*                        "id": "178f24a7-b757-555a-acce-d952d3ad72c8",
*                       "frontmatter": {
*                            "thumbnail": "https://img.serverlesscloud.cn/202034/1583323516946-v2-1a569e74722930de772e470209db3c05_1200x500.jpg",
*                            "authors": ["Anycodes"],
*                            "categories": ["guides-and-tutorials", "user-stories"],
*                            "date": "2020-03-03T00:00:00.000Z",
*                            "title": "Serverless 组件开发尝试：全局变量组件和单独部署组件",
*                            "description": "为了方便，我开发了这样的 Component",
*                            "authorslink": ["https://www.zhihu.com/people/liuyu-43-97"],
*                            "translators": null,
*                            "translatorslink": null
*                        },
*                        "wordCount": {
*                            "words": 212,
*                            "sentences": 34,
*                            "paragraphs": 33
*                        },
*                        "timeToRead": 8,
*                        "fileAbsolutePath": "/Users/fun/serverlessBBtest/serverlesscloud.cn/content/blog/2020-03-03-global-Component.md",
*                        "fields": {
*                            "slug": "/blog/2020-03-03-global-Component/"
*                        }
*                    }
*                }
*      ]
* replaceList: 额外处理的词，格式为array，例如：var replaceList = ["Serverless Framework", "Hack for WuHan"]
*
* 方法返回结果 id_list
*
* */

export function getContent(content, replaceList) {
  content = content.toLowerCase()
  var replaceJson = {}
  for (let i = 0, l = replaceList.length; i < l; i++) {
    replaceJson[replaceList[i].toLowerCase()] = replaceList[i].toLowerCase().replace(/ /ig, '')
  }
  for (var key in replaceJson) {
    content = content.replace(key, replaceJson[key])
  }
  return content
}

export function getAticleJson(articleList, replaceList) {
  var articleJson = {}
  for (let i = 0, l = articleList.length; i < l; i++) {
    const tempFrontmatter = articleList[i]['node']['frontmatter']
    const tempContent = `${tempFrontmatter['date']} ${tempFrontmatter['title']} ${tempFrontmatter['description']} ${tempFrontmatter['authors']}`
    articleJson[articleList[i]['node']['id']] = getContent(tempContent, replaceList)
  }
  return articleJson
}

export function getSearch(content, articleList, replaceList) {
  var searchContent = getContent(content, replaceList)
  var searchReg = searchContent.replace(/ /ig, '|')
  var articleContent = getAticleJson(articleList, replaceList)
  var regAttr = new RegExp(searchReg)
  var resultList = []
  for (var key in articleContent) {
    if (regAttr.test(articleContent[key])) {
      resultList.push(key)
    }
  }
  return resultList
}
