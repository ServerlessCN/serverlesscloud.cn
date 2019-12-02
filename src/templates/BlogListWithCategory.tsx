import * as React from 'react'
import { graphql } from 'gatsby'
import Layout from '@src/layouts'
import { Flex, Container } from '@src/components/atoms'
import List from '@src/components/pages/blogList/List'
import Category from '@src/components/pages/blogList/CategoryList'
import { GraphqlBlogResult } from '@src/types'
import Breadcrumbs from '@src/components/Breadcrumbs'
import Helmet from '@src/components/Helmet'
import styled from 'styled-components'
import { width } from 'styled-system'
import {
  baseCategoryUrl,
  generateCategoryText,
} from '@src/components/Link/CategoryLink'

const CustomContainer = styled(Container)`
  flex: 1;
  ${width}
`

const CustomFlex = styled(Flex)`
  ${width}
`
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
  const isBestPractice = categories === 'best-practice'
  const categoriesText = generateCategoryText(categories)
  return (
    <Layout>
      <Helmet
        title={`${categoriesText} - Serverless`}
        keywords={
          isBestPractice
            ? 'Serverless教程,Serverless入门,Serverless实践,ServerlessSSR'
            : 'Serverless团队博客,Serverless发布,Serverless动态,Serverless新闻'
        }
        description={
          isBestPractice
            ? 'Serverless Framework 最佳实践教程指引，帮助开发者快速掌握Serverless工程化框架与Serverless实战内容。'
            : 'Serverless Framework 团队博客最新动态，最新功能，最新版本发布'
        }
        location={location}
      />
      <Breadcrumbs>{categoriesText}</Breadcrumbs>
      <CustomContainer
        width={[0.95, 0.95, 0.95, 0.95, 1216]}
        maxWidth={[1216, 1216, 1216, 1216, '76%', 1216]}
      >
        <CustomFlex
          width={1}
          alignItems={['center', 'center', 'center', 'flex-start']}
          justifyContent={['center', 'center', 'center', 'space-between']}
          flexDirection={['column', 'column', 'column', 'row']}
        >
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
        </CustomFlex>
      </CustomContainer>
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
