import * as React from 'react'
import crypto from 'crypto'
import { Box } from '@src/components/atoms'
import { StaticQuery, graphql, Link } from 'gatsby'
import { Blog, GraphqlBlogResult } from '@src/types'
import './LatestBlogs.css'
const baseCategoryUrl = '/tags'

type BestPractice = Blog

interface Props {
  blogs: BestPractice[]
}

export function BlogCard({ blog }: { blog: Blog }) {
  var md5 = crypto.createHash('md5')
  var id = md5.update(blog.node.fields.slug).digest('hex')
  return (
    <Box className="scf-article-item scf-article-item--block" data-id={id}>
      <Link to={blog.node.fields.slug} data-id={id}>
        <Box className="scf-article-item__img">
          <Box className="scf-article-item__img-inner">
            <img src={blog.node.frontmatter.thumbnail} alt={blog.node.frontmatter.title} />
          </Box>
        </Box>
        <Box className="scf-article-item__content">
          <Box className="scf-article-item__statistics">
            <span className="scf-article-item__statistics-item">
              <i className="scf-icon scf-icon-view"></i>
            </span>
            {blog.node.frontmatter.authors}· {blog.node.frontmatter.date.slice(2, 10)}
          </Box>
          <Box className="scf-article-item__title">
            <h4>{blog.node.frontmatter.title}</h4>
          </Box>
          <Box className="scf-article-item__intro">{blog.node.frontmatter.description}</Box>
        </Box>
      </Link>
      {blog.node.frontmatter.tags ? (
        <div className="scf-article-item__seotag">
          <i className="scf-icon scf-icon-tag"></i>
          {blog.node.frontmatter.tags.map(tag => (
            <Link to={`${baseCategoryUrl}/${tag}`} key={tag}>
              <span className="scf-seotag__item" key={tag}>
                {tag}
              </span>
            </Link>
          ))}
        </div>
      ) : null}
    </Box>
  )
}

function Blogs() {
  const query = graphql`
    query {
      blogs: allMarkdownRemark(
        sort: { fields: frontmatter___date, order: DESC }
        limit: 6
        filter: {
          frontmatter: { categories: { regex: "/best-practice|guides-and-tutorials/" } }
          fileAbsolutePath: { regex: "/best-practice|blog/" }
        }
      ) {
        edges {
          node {
            id
            frontmatter {
              title
              thumbnail
              description
              date
              authors
            }
            fileAbsolutePath
            timeToRead
            fields {
              slug
            }
          }
        }
      }
    }
  `
  return (
    <StaticQuery
      query={query}
      render={({ blogs }: { blogs: GraphqlBlogResult }) => {
        return (
          <Box className="scf-box__body" id="scf-box-best-recommand-read">
            {blogs.edges.map(blog => (
              <BlogCard key={blog.node.id} blog={blog} />
            ))}
          </Box>
        )
      }}
    />
  )
}

export default function(props) {
  React.useEffect(() => {
    function getBlogPv(fn) {
      const api = 'https://service-94w2imn4-1300862921.gz.apigw.tencentcs.com/release/get/article?e' + 'nv=test'
      fetch(api)
        .then(response => response.json())
        .then(response => {
          fn(null, response)
        })
        .catch(error => {
          fn(error, null)
        })
    }

    getBlogPv(function(error, response) {
      if (error || response.error) {
        console.log(error || response.error)
        return
      }
      const bestList = document.getElementById('scf-box-best-recommand-read')
      if (!bestList) return
      const bestItems = bestList.getElementsByTagName('A')

      for (var i = 0; i < bestItems.length; ++i) {
        const id = bestItems[i].getAttribute('data-id')
        if (!id) continue
        const statistics = bestItems[i].getElementsByClassName('scf-article-item__statistics-item')
        if (!statistics) continue
        const icon = statistics[0].getElementsByClassName('scf-icon')
        if (!icon) continue
        let pv = response.message[id] || Math.ceil(Math.random() * 100)
        if (pv >= 1000) {
          pv = (pv / 1000).toFixed(1) + 'K'
        }
        icon[0].innerHTML = pv + '&nbsp;·&nbsp;'
      }
    })
  })

  return (
    <Box className="scf-grid__item-16">
      <Box className="scf-grid__box">
        <Box className="scf-box scf-home-blog">
          <Box className="scf-box__header">
            <Box className="scf-box__header-title">
              <h3>{props.title ? props.title : '推荐阅读'}</h3>
            </Box>
            <Box className="scf-box__header-more">
              <Link to="/best-practice">更多推荐 &gt;</Link>
            </Box>
          </Box>
          <Blogs />
        </Box>
      </Box>
    </Box>
  )
}
