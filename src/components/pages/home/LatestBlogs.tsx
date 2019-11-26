import * as React from 'react'
import {
  Flex,
  Button,
  Box,
  Text,
  Background,
  Container,
  Center,
  Image,
} from '@src/components/atoms'
import theme from '@src/constants/theme'
import { formateDate } from '@src/utils'
import { MainTitle } from '@src/components/Title'
import styled from 'styled-components'
import { StaticQuery, graphql, Link } from 'gatsby'
import { Blog, GraphqlBlogResult } from '@src/types'
import BlogDetailLink from '@src/components/Link/BlogDetailLink'
import { LazyImage } from 'react-lazy-images'
import placeholderImg from '@src/assets/images/placeholder.png'
import { width, maxHeight, height } from 'styled-system'

const BlogWrapper = styled(Flex)`
  transition: all 0.3s ease;
  &:hover {
    transform: scale(1.03) translate3d(0, 0, 0) perspective(1px);
  }
`

const BoxWithFlex = styled(Box)`
  flex: 1;
`

const BlogInfo = styled(Flex)`
  flex: 1;
`

type LatestBlog = Blog

interface Props {
  blogs: LatestBlog[]
}

function Blogs({ blogs }: Props) {
  return (
    <Container maxWidth={['100%', '100%', '100%', '85%']}>
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
          <BlogDetailLink key={blog.node.id} blog={blog}>
            <BlogWrapper
              key={blog.node.id}
              flexDirection={['column', 'column', 'column', 'column', 'column']}
              alignItems={['center']}
              width={[0.9, 0.9, 340, 360, 390]}
              height="416px"
              my={[32]}
              mx={[20]}
              style={{
                border: '1px solid #eaeaea',
                boxShadow: '2px 2px 8px 0 rgba(0, 0, 0, 0.08)',
              }}
            >
              {/* <Image width={1} src={blog.node.frontmatter.thumbnail} /> */}

              <LazyImage
                src={blog.node.frontmatter.thumbnail}
                alt={blog.node.frontmatter.title}
                actual={({ imageProps }) => {
                  return (
                    <Background
                      width={[1]}
                      height={[200]}
                      background={`url(${JSON.stringify(
                        blog.node.frontmatter.thumbnail
                      )})`}
                      backgroundSize="cover"
                      backgroundPosition="center"
                      backgroundRepeat="no-repeat"
                    />
                  )
                }}
                placeholder={({ imageProps, ref }) => (
                  <Image
                    {...imageProps}
                    ref={ref}
                    src={placeholderImg}
                    width={[1]}
                  />
                )}
              />
              <BlogInfo flexDirection={'column'} p={'20px'}>
                <BoxWithFlex width={1}>
                  <Text
                    align={['left']}
                    fontSize={['16px', '16px', '16px', '18px']}
                    lineHeight={'38px'}
                  >
                    {blog.node.frontmatter.title}
                  </Text>
                  <Text
                    align={['left']}
                    my={'12px'}
                    fontSize="14px"
                    lineHeight={'18px'}
                    color={theme.colors.gray[2]}
                  >
                    {blog.node.frontmatter.description}
                  </Text>
                </BoxWithFlex>
                <Box width={[1]}>
                  <Flex justifyContent="space-between">
                    <Text
                      align={['left']}
                      my={'12px'}
                      fontSize="14px"
                      color={theme.colors.gray[2]}
                    >
                      {formateDate(blog.node.frontmatter.date)}
                    </Text>
                    {/* <BlogDetailLink blog={blog}> */}
                    <Text
                      align={['left']}
                      my={'12px'}
                      fontSize="14px"
                      color={theme.colors.serverlessRed}
                    >
                      继续阅读
                    </Text>
                    {/* </BlogDetailLink> */}
                  </Flex>
                </Box>
              </BlogInfo>
            </BlogWrapper>
          </BlogDetailLink>
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
            filter: { fileAbsolutePath: { regex: "/blog/" } }
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
              <MainTitle>最新博客</MainTitle>

              <Blogs blogs={blogs.edges} />

              <Link to="/blog">
                <Button mt="30px" mb="30px" theme={theme}>
                  More Posts
                </Button>
              </Link>
            </Center>
          </Background>
        )
      }}
    />
  )
}
