import * as React from 'react'
import { graphql } from 'gatsby'
import { debounce } from '@src/utils'
import Layout from '@src/layouts'
import List from '@src/components/pages/blogList/List'
import { Container } from '@src/components/atoms'
import Category from '@src/components/pages/blogList/CategoryList'
import { GraphqlBlogResult } from '@src/types'
import Helmet from '@src/components/Helmet'
import './BlogList.less'
import RightAd from '@src/components/RightAd/RightAd'
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
      <Helmet
        title="博客 - Serverless"
        keywords="Serverless团队博客,Serverless发布,Serverless动态,Serverless新闻"
        description="Serverless 中文网分享了 Serverless 技术的最新动态、Serverless 团队的工程实践，以及社区开发者撰写投稿的优质技术博文"
        location={location}
      />
      <h1 className="page-title">Serverless 中文网 - 博客</h1>
      <Category location={location} />
      <div className="scf-content scf-blogList-content">
        <div className="scf-page-blog scf-layout-pattern">
          <div className="scf-home-block scf-blog-list">
            <Container width={[1, 1, 1, 912, 0.76, 1200]} px={0} className="list-con">
              <div id="scf-box-mobile-titlebar" className="scf-box__header-title">
                <h3>博客</h3>
              </div>
              <div className="scf-box">
                <div className="scf-box__body">
                  <List
                    isMobileView={isMobileView}
                    generateDataUrl={pageNum => `/blog${pageNum === 1 ? '' : `/page/${pageNum}`}`}
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
                  <HotArticle type="blog" />
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
  query Blogs($offset: Int!, $limit: Int!) {
    blogs: allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { frontmatter: { categories: { nin: "guides-and-tutorials" } }, fileAbsolutePath: { regex: "/blog/" } }
      skip: $offset
      limit: $limit
    ) {
      edges {
        node {
          id
          frontmatter {
            thumbnail
            authors
            categories
            date
            title
            description
            authorslink
            translators
            translatorslink
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
