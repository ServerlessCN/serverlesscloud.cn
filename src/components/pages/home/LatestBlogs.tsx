import * as React from 'react'
import {Flex, Row, Background, Container, Center} from '@src/components/atoms'
import {StaticQuery, graphql, Link} from 'gatsby'
import {Blog, GraphqlBlogResult} from '@src/types'
import './LatestBlogs.css'

type LatestBlog = Blog

let BlogSort = "DESC"

function changeSort(){
  BlogSort="DESC"
}
function changeSortAgain(){
  BlogSort="!DESC"
}
interface Props {
  blogs : LatestBlog[]
}

function BlogCard({blog} : {
  blog: Blog
}) {
  return (
    <div className="scf-blog-article-item scf-blog-article-item--block">
    <Link to={blog.node.fields.slug}>
      <div className="scf-blog-article-item__img">
        <div className="scf-blog-article-item__img-inner">
          <img src={blog.node.frontmatter.thumbnail} alt=""/>
        </div>
      </div>
      <div className="scf-blog-article-item__content">
        <div className="scf-blog-article-item__statistics">
          <span className="scf-blog-article-item__statistics-item">
            <i className="scf-blog-icon scf-blog-icon-view"></i>
            13.3K</span>
          · Alfred Huang · {blog
            .node
            .frontmatter
            .date
            .slice(2, 10)} 
          · 阅读大约需要6分钟</div>
        <div className="scf-blog-article-item__title">
          <h4>{blog.node.frontmatter.title}</h4>
        </div>
        <div className="scf-blog-article-item__intro">{blog.node.frontmatter.description}</div>
      </div>
      </Link>
    </div>
  )
}

function Blogs() {
  const query= graphql `query { blogs: allMarkdownRemark( sort: { fields: frontmatter___date, order: DESC } limit: 6 filter: { fileAbsolutePath: { regex: "//blog//" } frontmatter: { categories: { nin: "best-practice" } } } ) { edges { node { id frontmatter { title thumbnail description date } fileAbsolutePath fields { slug } } } } } `
  return (
    <StaticQuery
      query={query}
      render={({blogs} : {
      blogs: GraphqlBlogResult
    }) => {
      return (
        <div className="scf-blog-box__body">
          {blogs
            .edges
            .map(blog => (<BlogCard key={blog.node.id} blog={blog}/>))}
        </div>
      )
    }}/>
  )
}

export default function () {
  return (
    <Background pt={'20px'} pb={'20px'} width={0.6666}>
      <Center flexDirection="column">
        <Row
          className="scf-box__header"
          width="100%"
          height="100%"
          alignItems="flex-end"
          justifyContent="space-between">
          <div className="scf-box__header-title">
            <h3>博客</h3>
            <div className="scf-box__header-segment">
              <a className={`scf-box__header-segment-item  is-active}`}>最新</a>
            </div>
          </div>
          <div className="scf-box__header-more">
            <Link to="/blog">
              更多博客 &gt;
            </Link>
          </div>
        </Row>
       <Blogs />
      </Center>
    </Background>
  )
}