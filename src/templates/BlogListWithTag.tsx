import * as React from 'react'
import { graphql } from 'gatsby'
import Layout from '@src/layouts'
import List from '@src/components/pages/blogList/List'
import { Container } from '@src/components/atoms'
import Tag from '@src/components/pages/blogList/TagList'
import { GraphqlBlogResult } from '@src/types'
import Helmet from '@src/components/Helmet'
import { debounce } from '@src/utils'

interface Props {
  data: {
    blogs: GraphqlBlogResult
  }
  pathContext: { offset: number; limit: number; tags: string }
  location: any
}

const BlogList = ({
  data: {
    blogs: { edges, totalCount },
  },
  pathContext: { offset, limit, tags },
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
        title={`${tags} - Serverless`}
        keywords={'Serverless团队博客,Serverless发布,Serverless动态,Serverless新闻'}
        description={
          'Serverless 中文网分享了 Serverless 技术的最新动态、Serverless 团队的工程实践，以及社区开发者撰写投稿的优质技术博文'
        }
        location={location}
      />
      <h1 className="page-title">Serverless 中文网 - 标签</h1>
      <Tag location={location} />
      <div className="scf-Blog-Category scf-page_seotag">
        <div className="scf-page-blog scf-layout-pattern">
          <div className="scf-home-block scf-blog-list">
            <Container width={[1, 1, 1, 912, 0.76, 1200]} px={0}>
              <div id="scf-box-mobile-titlebar" className="scf-box__header-title">
                <h3>Tags</h3>
              </div>
              <div className="scf-box ">
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
            </Container>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default BlogList

export const query = graphql`
  query TagBlogs($offset: Int!, $limit: Int!, $tags: [String!]) {
    blogs: allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      filter: {
        frontmatter: { date: { ne: null }, tags: { in: $tags } }
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
