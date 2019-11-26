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
  pathContext: { offset: number; limit: number; category: string }
  location: any
}

const BlogList = ({
  data: {
    blogs: { edges, totalCount },
  },
  pathContext: { offset, limit, category },
  location,
}: Props) => {
  return (
    <Layout>
      <Helmet
        title="Serverless 中文技术网——博客"
        description="Serverless 中文技术网，专注 Serverless 架构最佳实践"
        location={location}
      />
      <Breadcrumbs>{category}</Breadcrumbs>
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
              `/category/${category}${pageNum === 1 ? '' : `/page/${pageNum}`}`
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
  query CategoryBlogs($offset: Int!, $limit: Int!, $category: [String!]) {
    blogs: allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      filter: {
        frontmatter: { date: { ne: null }, category: { in: $category } }
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
            category
            date
            title
            heroImage
            description
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
