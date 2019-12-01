import * as React from 'react'
import {
  Flex,
  Button,
  Background,
  Container,
  Center,
} from '@src/components/atoms'
import theme from '@src/constants/theme'
import { MainTitle } from '@src/components/pages/home/Title'
import { StaticQuery, graphql, Link } from 'gatsby'
import { Blog, GraphqlBlogResult } from '@src/types'
import BlogCard from './BlogCard'
import CategoryLink from '@src/components/Link/CategoryLink'

type BestPractice = Blog

interface Props {
  blogs: BestPractice[]
}

function Blogs({ blogs }: Props) {
  return (
    <Container
      width={['100%', '100%', '100%', 'auto']}
      maxWidth={['100%', '100%', '100%', '85%']}
    >
      <Flex
        flexDirection={['column', 'column', 'row', 'row', 'row']}
        flexWrap={['initial', 'initial', 'wrap', 'wrap', 'initial']}
        justifyContent={[
          'initial',
          'initial',
          'space-between',
          'space-between',
          'center',
        ]}
        width={[1]}
        mb={[32, 32, 0]}
        mt={[0, 0, 32]}
      >
        {blogs.map(blog => (
          <BlogCard key={blog.node.id} blog={blog} />
        ))}
      </Flex>
    </Container>
  )
}

export default function() {
  return (
    <StaticQuery
      query={graphql`
        query {
          blogs: allMarkdownRemark(
            sort: { fields: frontmatter___date, order: DESC }
            limit: 3
            filter: {
              fileAbsolutePath: { regex: "/blog/" }
              frontmatter: { categories: { in: "best-practice" } }
            }
          ) {
            edges {
              node {
                id
                frontmatter {
                  title
                  thumbnail
                  description
                  date
                }
                fileAbsolutePath
                fields {
                  slug
                }
              }
            }
          }
        }
      `}
      render={({ blogs }: { blogs: GraphqlBlogResult }) => {
        return (
          <Background pt={'40px'} pb={'40px'} width={1}>
            <Center flexDirection="column">
              <MainTitle>最佳实践</MainTitle>

              <Blogs blogs={blogs.edges} />

              <CategoryLink custom category="best-practice">
                <Button mt="30px" mb="30px" theme={theme}>
                  More Posts
                </Button>
              </CategoryLink>
            </Center>
          </Background>
        )
      }}
    />
  )
}
