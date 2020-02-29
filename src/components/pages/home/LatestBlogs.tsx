import * as React from 'react'
import {Box, Row, Background, Container, Center} from '@src/components/atoms'
import {StaticQuery, graphql, Link} from 'gatsby'
import {Blog, GraphqlBlogResult} from '@src/types'
import './LatestBlogs.css'

type LatestBlog = Blog

let BlogSort = "DESC"

function changeSort() {
  BlogSort = "DESC"
}
function changeSortAgain() {
  BlogSort = "!DESC"
}
interface Props {
  blogs : LatestBlog[]
}

function BlogCard({blog} : {
  blog: Blog
}) {
  return (
    <Box className="scf-article-item scf-article-item--block">
      <Link to={blog.node.fields.slug}>
        <Box className="scf-article-item__img">
          <Box className="scf-article-item__img-inner">
            <img src={blog.node.frontmatter.thumbnail} alt=""/>
          </Box>
        </Box>
        <Box className="scf-article-item__content">
          <Box className="scf-article-item__statistics">
            <span className="scf-article-item__statistics-item">
              <i className="scf-icon scf-icon-view"></i>
              13.3K</span>
            {blog.node.frontmatter.authors}
            · {blog
              .node
              .frontmatter
              .date
              .slice(2, 10)}
            · 阅读大约需要{parseInt((Math.random() * 4 + 4) + '', 10)}分钟</Box>
          <Box className="scf-article-item__title">
            <h4>{blog.node.frontmatter.title}</h4>
          </Box>
          <Box className="scf-article-item__intro">{blog.node.frontmatter.description}</Box>
        </Box>
      </Link>
    </Box>
  )
}

function Blogs() {
  const query = graphql `query { blogs: allMarkdownRemark( sort: { fields: frontmatter___date, order: DESC } limit: 6 filter: { fileAbsolutePath: { regex: "//blog//" } frontmatter: { categories: { nin: "best-practice" } } } ) { edges { node { id frontmatter { title thumbnail thumbnail
  authors description date } fileAbsolutePath fields { slug } } } } } `
  return (
    <StaticQuery
      query={query}
      render={({blogs} : {
      blogs: GraphqlBlogResult
    }) => {
      return (
        <Box className="scf-box__body">
          {blogs
            .edges
            .map(blog => (<BlogCard key={blog.node.id} blog={blog}/>))}
        </Box>
      )
    }}/>
  )
}

export default function () {
  return (
    <Box className="scf-grid__item-16">
      <Box className="scf-grid__box">
        <Box className="scf-box scf-home-blog">
          <Box className="scf-box__header">
            <Box className="scf-box__header-title">
              <h3>博客</h3>
              <Box className="scf-box__header-segment">
                <a className={`scf-box__header-segment-item is-active`}>最新</a>
              </Box>
            </Box>
            <Box className="scf-box__header-more">
              <Link to="/blog">
                更多博客 &gt;
              </Link>
            </Box>
          </Box>
          <Blogs/>
        </Box>
      </Box>
    </Box>
  )
}