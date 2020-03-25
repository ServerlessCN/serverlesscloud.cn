import * as React from 'react'
import {graphql} from 'gatsby'
import Layout from '@src/layouts'
import List from '@src/components/pages/blogList/List'
import Category from '@src/components/pages/blogList/CategoryList'
import {GraphqlBlogResult} from '@src/types'
import Helmet from '@src/components/Helmet'
import './BlogList.css'

interface Props {
  data : {
    blogs: GraphqlBlogResult
  }
  pathContext : {
    offset: number;
    limit: number
  }
  location : any
}

const BlogList = ({
  data: {
    blogs: {
      edges,
      totalCount
    }
  },
  pathContext: {
    offset,
    limit
  },
  location
} : Props) => {

  return (
    <Layout>
      <Helmet
        title="博客 - Serverless"
        keywords="Serverless团队博客,Serverless发布,Serverless动态,Serverless新闻"
        description="Serverless 中文网分享了 Serverless 技术的最新动态、Serverless 团队的工程实践，以及社区开发者撰写投稿的优质技术博文"
        location={location}/>
      <Category location={location} />
      <div className="scf-content scf-blogList-content">
        <div className="scf-page-blog scf-layout-pattern">
          <div className="scf-home-block scf-blog-list">
            <div className="scf-home-block__inner">
              <div id="scf-box-mobile-titlebar" className="scf-box__header-title">
                  <h3>博客</h3>
              </div>
              <div className="scf-box ">
                <div className="scf-box__body">
                  <List
                    generateDataUrl={pageNum => `/blog${pageNum === 1
                    ? ''
                    : `/page/${pageNum}`}`}
                    blogs={edges}
                    offset={offset}
                    limit={limit}
                    totalCount={totalCount}/>
                </div>
              </div>
             {/* <div className="scf-article-list-opeate">
                <button className="scf-btn scf-btn--line">查看更多</button>
              </div>
              */}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
export default BlogList

export const query = graphql `query Blogs($offset:
      Int!, $limit: Int!) {blogs : allMarkdownRemark(sort : {
        fields: [frontmatter___date],
        order: DESC
      }
      filter : {
        frontmatter: {
          date: {
            ne: null
          }
        }
        fileAbsolutePath: {
          regex: "//blog//"
        }
      }
      skip : $offset limit : $limit) {
        edges {
          node {
            id
            frontmatter {thumbnail authors categories date title description authorslink translators translatorslink}
            wordCount {words sentences paragraphs}
            timeToRead
            fileAbsolutePath
            fields {slug}
          }
        }
        totalCount
      }
}`
