import * as React from 'react'
import { graphql } from 'gatsby'
import Layout from '@src/layouts'
import List from '@src/components/pages/blogList/List'
import { GraphqlBlogResult } from '@src/types'
import Helmet from '@src/components/Helmet'
import { Box, Container } from '@src/components/atoms'
import RightAd from '@src/components/RightAd/RightAd'
import { debounce } from '@src/utils'
import './BestPracticeList.less'
import HotArticle from '@src/components/HotArticle/HotArticle'

interface Props {
  data: {
    blogs: GraphqlBlogResult
  }
  pathContext: {
    offset: number
    limit: number
  }
  location: any
}

const BlogList = ({
  data: {
    blogs: { edges, totalCount },
  },
  pathContext: { offset, limit },
  location,
}: Props) => {
  const [isMobileView, setisMobileView] = React.useState(false)

  React.useEffect(() => {
    const onResize = debounce(() => {
      if (window.innerWidth > 992) {
        setisMobileView(false)
      } else {
        setisMobileView(true)
      }
    }, 50)

    window.addEventListener('resize', onResize)
    onResize()

    return () => {
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <Layout>
      <h1 className="page-title">Serverless 中文网 - 最佳实践</h1>
      <Helmet
        title="最佳实践 - Serverless"
        keywords="Serverless教程,Serverless入门,Serverless实践,ServerlessSSR"
        description="Serverless Framework 最佳实践教程指引，帮助开发者快速掌握 Serverless 工程化框架与 Serverless 实战内容。"
        location={location}
      />{' '}
      {isMobileView ? (
        <Box
          className="scf-box__header"
          style={{
            padding: '0 10px',
            marginTop: '100px',
          }}
        >
          <Box className="scf-box__header-title">
            <h3>最佳实践</h3>
          </Box>
        </Box>
      ) : null}
      <div className="scf-content">
        <div className="scf-page-blog scf-layout-pattern">
          <div className="scf-home-block scf-practice-list">
            <Container width={[1, 1, 1, 912, 0.76, 1200]} px={0} className="list-con">
              <div className="scf-box">
                <div className="scf-box__body">
                  <List
                    isMobileView={isMobileView}
                    width={[0.9, 0.9, 0.9, 0.85]}
                    generateDataUrl={pageNum => `/best-practice${pageNum === 1 ? '' : `/page/${pageNum}`}`}
                    blogs={edges}
                    offset={offset}
                    limit={limit}
                    totalCount={totalCount}
                  />
                </div>
              </div>
              <div className="list-right">
                <RightAd />
                <div className="mobile-hide">
                  <HotArticle type="bestPractice" />
                </div>
              </div>
            </Container>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default BlogList

export const query = graphql`
  query BestPractice($offset: Int!, $limit: Int!) {
    blogs: allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      filter: {
        frontmatter: { categories: { in: ["best-practice", "guides-and-tutorials"] } }
        fileAbsolutePath: { regex: "/best-practice|blog/" }
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
            tags
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
