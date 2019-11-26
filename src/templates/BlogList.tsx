import * as React from 'react'
import { graphql } from 'gatsby'
import Banner from '@src/components/Banner'
import Layout from '@src/layouts'
import { Box, Flex, Container } from '@src/components/atoms'
import List from '@src/components/pages/blogList/List'
import Category from '@src/components/pages/blogList/CategoryList'
import { GraphqlBlogResult } from '@src/types'
import Helmet from '@src/components/Helmet'
import styled from 'styled-components'
import { width } from 'styled-system'

interface Props {
  data: {
    blogs: GraphqlBlogResult
  }
  pathContext: { offset: number; limit: number }
  location: any
}

const CustomFlex = styled(Flex)`
  ${width}
`

const CustomContainer = styled(Container)`
  flex: 1;
`

const BlogList = ({
  data: {
    blogs: { edges, totalCount },
  },
  pathContext: { offset, limit },
  location,
}: Props) => {
  return (
    <Layout>
      <Helmet
        title="Serverless 中文技术网——博客"
        description="Serverless 中文技术网，专注 Serverless 架构最佳实践"
        location={location}
      />
      <Banner />

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
              `/blog${pageNum === 1 ? '' : `/page/${pageNum}`}`
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
  query Blogs($offset: Int!, $limit: Int!) {
    blogs: allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      filter: {
        frontmatter: { date: { ne: null } }
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
