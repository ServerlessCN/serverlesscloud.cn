import * as React from 'react'
import './HotArticle.less'
import crypto from 'crypto'
import BlogLists from '@src/constants/blog.json'
import BestPracticeLists from '@src/constants/bestPractice.json'
import { Link } from 'gatsby'

const articleList = [...BlogLists, ...BestPracticeLists]

interface Props {
  type: 'blog' | 'bestPractice'
}

interface remoteList {
  [key: string]: number
}
interface Article {
  id: string
  frontmatter: {
    title: string
  }
  fields: {
    slug: string
  }
}

export default (props: Props) => {
  const { type = 'blog' } = props
  const [list, setList] = React.useState<Article[]>([])
  React.useEffect(() => {
    const api =
      'https://service-94w2imn4-1300862921.gz.apigw.tencentcs.com/release/get/article?src=' + document.location.hostname
    fetch(api)
      .then(response => response.json())
      .then(response => {
        const message: remoteList = response.message
        let list = Object.entries(message).map(([key, value]) => {
          return {
            id: key,
            pv: value,
          }
        })
        list.sort((a, b) => b.pv - a.pv)

        const blogHash = {}
        for (var i = 0; i < articleList.length; ++i) {
          const item = articleList[i].node
          var md5 = crypto.createHash('md5')
          var id = md5.update(item.fields.slug).digest('hex')
          blogHash[id] = item
        }

        const result: any = []
        list.forEach(item => {
          if (result.length === 5) return false
          const matched = blogHash[item.id]
          if (matched) {
            const isBestPractice =
              !matched.frontmatter.categories ||
              matched.frontmatter.categories?.includes('guides-and-tutorials') ||
              matched.frontmatter.categories?.includes('best-practice')
            if (type === 'blog' && !isBestPractice) {
              result.push(matched)
            }
            if (type === 'bestPractice' && isBestPractice) {
              result.push(matched)
            }
          }
        })
        setList(result)
      })
  }, [])

  return (
    <>
      <div className="right-title mt35">
        <h3>热门文章</h3>
      </div>
      <div className="hot-article">
        {list.map(item => (
          <Link className="right-item" to={item.fields.slug} key={item.id}>
            <span className="right-dot">•</span>
            <span className="right-text">{item.frontmatter.title}</span>
          </Link>
        ))}
      </div>
    </>
  )
}
