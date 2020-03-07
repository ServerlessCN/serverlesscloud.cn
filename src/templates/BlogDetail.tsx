import * as React from 'react'
import {graphql} from 'gatsby'
import Layout from '@src/layouts/HeaderNotFixedLayout'
import {Box, InlineBlock} from '@src/components/atoms'
import {Blog, GraphqlBlogResult} from '@src/types'
import styled from 'styled-components'
import Markdown from '@src/components/Markdown'
import Category from '@src/components/pages/blogList/CategoryList'
import theme from '@src/constants/theme'
import {display, DisplayProps, space, SpaceProps} from 'styled-system'
import {formateDate} from '@src/utils'
import BlogCatalogs from '@src/components/Markdown/Catalogs'
import ExternalLink from '@src/components/Link/ExternalLink'
import CategoryLink from '@src/components/Link/CategoryLink'
import Activitys from '@src/components/pages/home/Activitys'
import RecommandRead from '@src/components/pages/home/RecommandRead'
import './BlogDetail.css'

const ExternalLinkWrapper = styled(InlineBlock)`
  margin-left: 5px;
  a {
    transition: all 0.3s ease;
  }
  &:hover {
    a {
      color: ${theme.colors.serverlessRed};
    }
  }
`
const LinkWrapper = styled.div < DisplayProps & SpaceProps > `
  ${display}
  ${space}
  a {
    margin: 20px 0;
    transition: all 0.3s ease;
    line-height: 22px;
    &:hover {
      color: ${theme.colors.serverlessRed};
    }
  }
`
interface Props {
  data : {
    currentBlog: Blog['node'],
    previousBlog: Blog['node'],
    nextBlog: Blog['node'],
    srecommendBlogs: GraphqlBlogResult
  }
  location : any
}

const BlogDetail = ({data: {
    currentBlog
  }, location} : Props) => {

  const [isShowAll,
    setIsShowAll] = React.useState(false)

  React.useEffect(() => {
    setIsShowAll(false)
  }, [])

  const onToggleShow = () => {
    setIsShowAll(true)
  }

  return (
    <Layout>
      <Category location={location} isDetail={true}/>
      <Box className="scf-content">
        <Box className="scf-page-blog-detail scf-layout-pattern">
          <Box className="scf-home-block">
            <Box className="scf-home-block__inner">
              <Box className="scf-detail">
                <Box className="scf-grid scf-detail__content">
                  <Box className="scf-grid__item-18">
                    <Box className="scf-grid__box">
                      <Box className="scf-detail__docs">
                        <h1 className="scf-detail-docs__title">{currentBlog.frontmatter.title}</h1>
                        <Box className="scf-detail-docs__info">
                          <p>作者：{currentBlog
                              .frontmatter
                              .authors
                              .map((author, index) => (
                                <ExternalLinkWrapper key={author}>
                                  {currentBlog.frontmatter.authorslink && currentBlog.frontmatter.authorslink[index]
                                    ? (
                                      <ExternalLink to={currentBlog.frontmatter.authorslink[index]}>
                                        {author}
                                      </ExternalLink>
                                    )
                                    : (author)}
                                </ExternalLinkWrapper>
                              ))}</p>
                          <p>发布于： {formateDate(currentBlog.frontmatter.date)}</p>
                          {currentBlog.frontmatter.categories && currentBlog.frontmatter.categories.length
                            ? <p>归档于： {currentBlog
                                  .frontmatter
                                  .categories
                                  .map(o => (
                                    <LinkWrapper key={o} display="inline-block" ml="5px">
                                      <CategoryLink category={o}/>
                                    </LinkWrapper>
                                  ))}</p>
                            : null}
                        </Box>
                        <Box
                          style={!isShowAll
                          ? {
                            height: "500px",
                            overflow: "hidden"
                          }
                          : {}}>
                          <Markdown html={currentBlog.html as string}></Markdown>
                        </Box>
                      </Box>
                      {!isShowAll
                        ? <Box className="scf-detail__show-more">
                            <Box className="scf-detail__mask"></Box>
                            <button className="scf-btn scf-btn--line" onClick={onToggleShow}>展开阅读全文</button>
                          </Box>
                        : null}
                    </Box>
                  </Box>
                  <BlogCatalogs html={currentBlog.tableOfContents}/>
                </Box>
              </Box>
            </Box>
          </Box>
          <Box className="scf-home-block">
            <Box className="scf-home-block__inner">
              <Box className="scf-grid">
                <RecommandRead/><Activitys/>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Layout>
  )
}

export default BlogDetail

export const query = graphql `
  fragment blogFields on MarkdownRemark {
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
    }
    wordCount {
      words
      sentences
      paragraphs
    }
    fileAbsolutePath
    fields {
      slug
    }
  }

  query BlogDetails(
    $blogId: String!
    $previousBlogId: String
    $nextBlogId: String
    $categories: [String!]
  ) {
    currentBlog: markdownRemark(id: { eq: $blogId }) {
      ...blogFields
      html
      tableOfContents(pathToSlugField: "fields.slug")
    }

    previousBlog: markdownRemark(id: { eq: $previousBlogId }) {
      ...blogFields
    }

    nextBlog: markdownRemark(id: { eq: $nextBlogId }) {
      ...blogFields
    }

    recommendBlogs: allMarkdownRemark(
      filter: {
        id: { ne: $blogId }
        frontmatter: { date: { ne: null }, categories: { in: $categories } }
        fileAbsolutePath: { regex: "//blog//" }
      }
      limit: 8
    ) {
      edges {
        node {
          ...blogFields
        }
      }
      totalCount
    }
  }
`
