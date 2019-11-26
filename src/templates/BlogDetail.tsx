import * as React from 'react'
import { graphql } from 'gatsby'
import Layout from '@src/layouts/HeaderNotFixedLayout'
import {
  Flex,
  Container,
  Box,
  Fixed,
  Button,
  BackgroundProps,
} from '@src/components/atoms'
import { Blog, GraphqlBlogResult } from '@src/types'
import Breadcrumbs from '@src/components/Breadcrumbs'
import styled, { ThemeContext } from 'styled-components'
import Markdown from '@src/components/Markdown'
import BlogCatalogs from '@src/components/Markdown/Catalogs'
import Category from '@src/components/pages/blogList/CategoryList'
import Recommend from '@src/components/pages/blog/RecommendList'
import theme from '@src/constants/theme'
import { debounce } from '@src/utils'
import BlogDetailLink from '@src/components/Link/BlogDetailLink'
import Helmet from '@src/components/Helmet'
import { background } from 'styled-system'

interface Props {
  data: {
    currentBlog: Blog['node']
    previousBlog: Blog['node']
    nextBlog: Blog['node']
    recommendBlogs: GraphqlBlogResult
  }
  location: any
}

const LinkWrapper = styled.div`
  a {
    margin: 20px 0;

    transition: all 0.3s ease;

    line-height: 22px;

    &:hover {
      color: ${theme.colors.serverlessRed};
    }
  }
`

const BoxWithBackground = styled(Box)<BackgroundProps>`
  ${background}
  display: flex;
  align-items: center;
  border-radius: 5px;
`

const BlogDetail = ({
  data: { currentBlog, previousBlog, nextBlog, recommendBlogs },
  location,
}: Props) => {
  const [isBackTopButtonShow, setIsBackTopButtonShow] = React.useState(false)

  React.useEffect(() => {
    const onScroll = debounce(() => {
      const scrollTop = document.documentElement.scrollTop

      const clientHeight = document.documentElement.clientHeight

      if (scrollTop > clientHeight) {
      }

      setIsBackTopButtonShow(!!(scrollTop > clientHeight))
    }, 50)

    document.addEventListener('scroll', onScroll)

    return () => {
      document.removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <Layout>
      <Helmet {...currentBlog.frontmatter} location={location} />
      <Breadcrumbs>{currentBlog.frontmatter.title}</Breadcrumbs>
      <Container>
        <Flex
          alignItems={['center', 'center', 'center', 'flex-start']}
          justifyContent={['center', 'center', 'center', 'space-between']}
          flexDirection={['column', 'column', 'column', 'row']}
        >
          <Box
            width={[0.9, 0.9, 0.9, 0.72]}
            py={'40px'}
            px={[0, 0, 0, '10px', 0, 0]}
          >
            <BoxWithBackground
              mb="10px"
              py="20px"
              px="10px"
              background={theme.colors.gray[1]}
              width={1}
            >
              作者: {currentBlog.frontmatter.authors.join(' ')}
            </BoxWithBackground>

            <Markdown html={currentBlog.html as string}></Markdown>

            <Box mt="25px">
              <Flex
                alignItems="flex-start"
                justifyContent={['center', 'center', 'center', 'space-between']}
                flexDirection={['column', 'column', 'column', 'row']}
              >
                {previousBlog ? (
                  <LinkWrapper>
                    <BlogDetailLink blog={{ node: previousBlog }}>
                      上一篇：{previousBlog.frontmatter.title}
                    </BlogDetailLink>
                  </LinkWrapper>
                ) : null}

                {nextBlog ? (
                  <LinkWrapper>
                    <BlogDetailLink blog={{ node: nextBlog }}>
                      下一篇：{nextBlog.frontmatter.title}
                    </BlogDetailLink>
                  </LinkWrapper>
                ) : (
                  '已经是最后一篇了'
                )}
              </Flex>
            </Box>
          </Box>

          <Box width={[0.9, 0.9, 0.9, 0.25]}>
            <Recommend width={[1]} blogs={recommendBlogs.edges} />
            <Category width={[1]} />

            <BlogCatalogs html={currentBlog.tableOfContents} />
          </Box>
        </Flex>
      </Container>

      <Fixed right="30px" bottom="100px">
        {isBackTopButtonShow ? (
          <Button
            onClick={() => {
              document.documentElement.scrollTop = 0
            }}
            width="120px"
            fontSize="16px"
            p={'10px'}
            theme={theme}
          >
            回到顶部
          </Button>
        ) : null}
      </Fixed>
    </Layout>
  )
}

export default BlogDetail

export const query = graphql`
  fragment blogFields on MarkdownRemark {
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
    fileAbsolutePath
    fields {
      slug
    }
  }

  query BlogDetails(
    $blogId: String!
    $previousBlogId: String
    $nextBlogId: String
    $category: [String!]
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
        frontmatter: { date: { ne: null }, category: { in: $category } }
        fileAbsolutePath: { regex: "/blog/" }
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
