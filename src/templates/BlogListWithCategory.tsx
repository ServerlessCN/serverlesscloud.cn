import * as React from 'react'
import { graphql } from 'gatsby'
import Layout from '@src/layouts'
import { debounce } from '@src/utils'
import List from '@src/components/pages/blogList/List'
import { Container } from '@src/components/atoms'
import Category from '@src/components/pages/blogList/CategoryList'
import { GraphqlBlogResult } from '@src/types'
import Helmet from '@src/components/Helmet'
import { generateCategoryText } from '@src/components/Link/CategoryLink'
import RightAd from '@src/components/RightAd/RightAd'
import HotArticle from '@src/components/HotArticle/HotArticle'

interface Props {
  data: {
    blogs: GraphqlBlogResult
  }
  pathContext: { offset: number; limit: number; categories: string }
  location: any
}

const BlogList = ({
  data: {
    blogs: { edges, totalCount },
  },
  pathContext: { offset, limit, categories },
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
  const categoriesText = generateCategoryText(categories)
  const generateDataUrl = pageNum => {
    let local
    if (location.pathname.includes('/page/')) {
      local = location.pathname.split('/page/')[0]
    } else {
      local = location.pathname
    }
    return `${local}${pageNum === 1 ? '' : `/page/${pageNum}`}`
  }
  return (
    <Layout>
      <Helmet
        title={`${categoriesText} - Serverless`}
        keywords={'Serverless团队博客,Serverless发布,Serverless动态,Serverless新闻'}
        description={
          'Serverless 中文网分享了 Serverless 技术的最新动态、Serverless 团队的工程实践，以及社区开发者撰写投稿的优质技术博文'
        }
        location={location}
      />
      <h1 className="page-title">Serverless 中文网 - 分类</h1>
      <Category location={location} />
      <div className="scf-Blog-Category">
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
                    generateDataUrl={generateDataUrl}
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
  query CategoryBlogs($offset: Int!, $limit: Int!, $categories: [String!]) {
    blogs: allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      filter: {
        frontmatter: { date: { ne: null }, categories: { in: $categories, nin: "guides-and-tutorials" } }
        fileAbsolutePath: { regex: "/blog/" }
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
