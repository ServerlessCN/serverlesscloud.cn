import * as React from 'react'
import { graphql } from 'gatsby'
import Layout from '@src/layouts'
import List from '@src/components/pages/blogList/List'
import Category from '@src/components/pages/blogList/CategoryList'
import { GraphqlBlogResult } from '@src/types'
import Breadcrumbs from '@src/components/Breadcrumbs'
import Helmet from '@src/components/Helmet'
import {
  baseCategoryUrl,
  generateCategoryText,
} from '@src/components/Link/CategoryLink'
import Content from '@src/components/Content'

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
  const categoriesText = generateCategoryText(categories)
  return (
    <Layout>
      <Helmet
        title={`${categoriesText} - Serverless`}
        keywords={
          'Serverless团队博客,Serverless发布,Serverless动态,Serverless新闻'
        }
        description={
          'Serverless 中文网分享了 Serverless 技术的最新动态、Serverless 团队的工程实践，以及社区开发者撰写投稿的优质技术博文'
        }
        location={location}
      />
      <Breadcrumbs>{categoriesText}</Breadcrumbs>

      <Content>
        <List
          generateDataUrl={pageNum =>
            `${baseCategoryUrl}/${categories}${
              pageNum === 1 ? '' : `/page/${pageNum}`
            }`
          }
          blogs={edges}
          offset={offset}
          limit={limit}
          totalCount={totalCount}
        />
        <Category />
      </Content>
    </Layout>
  )
}

export default BlogList

export const query = graphql`
  query CategoryBlogs($offset: Int!, $limit: Int!, $categories: [String!]) {
    blogs: allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      filter: {
        frontmatter: { date: { ne: null }, categories: { in: $categories } }
        fileAbsolutePath: { regex: "//blog//" }
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
