import * as React from 'react'
import {graphql} from 'gatsby'
import Layout from '@src/layouts'
import List from '@src/components/pages/blogList/List'
import {GraphqlBlogResult} from '@src/types'
import Helmet from '@src/components/Helmet'
import './BestPracticeList.css'

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
        title="最佳实践 - Serverless"
        keywords="Serverless教程,Serverless入门,Serverless实践,ServerlessSSR"
        description="Serverless Framework 最佳实践教程指引，帮助开发者快速掌握 Serverless 工程化框架与 Serverless 实战内容。"
        location={location}/> 
      <div className="scf-content" style={{marginTop: "80px"}}>
        <div className="scf-page-blog scf-layout-pattern">
          <div className="scf-home-block scf-practice-list">
            <div className="scf-home-block__inner">
              <div className="scf-box ">
                <div className="scf-box__body">
                  <List
                    width={[0.9, 0.9, 0.9, 0.85]}
                    generateDataUrl={pageNum => `/best-practice${pageNum === 1
                    ? ''
                    : `/page/${pageNum}`}`}
                    blogs={edges}
                    offset={offset}
                    limit={limit}
                    totalCount={totalCount}/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default BlogList

export const query = graphql `
  query BestPractice($offset: Int!, $limit: Int!) {
    blogs: allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      filter: {
        frontmatter: { date: { ne: null } }
        fileAbsolutePath: { regex: "//best-practice//" }
      }
      skip: $offset
      limit: $limit
    ) {
      edges {
        node {
          id
          frontmatter {
            thumbnail
            authors
            date
            title
            description
            authorslink
          }
          wordCount {
            words
            sentences
            paragraphs
          }
          timeToRead
          fileAbsolutePath
          fields {
            slug
          }
        }
      }
      totalCount
    }
  }
`
