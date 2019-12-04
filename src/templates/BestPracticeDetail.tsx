import * as React from 'react'
import { graphql } from 'gatsby'
import Layout from '@src/layouts/HeaderNotFixedLayout'
import {
  Flex,
  Container,
  Box,
  BackgroundProps,
  Text,
  InlineBlock,
} from '@src/components/atoms'
import { Blog, GraphqlBlogResult } from '@src/types'
import Breadcrumbs from '@src/components/Breadcrumbs'
import styled from 'styled-components'
import Markdown from '@src/components/Markdown'
import BlogCatalogs from '@src/components/Markdown/Catalogs'
import theme from '@src/constants/theme'
import Helmet from '@src/components/Helmet'
import { background } from 'styled-system'
import { formateDate } from '@src/utils'
import ExternalLink from '@src/components/Link/ExternalLink'
import BackToTop from '@src/components/BackToTop'
import PreNext from '@src/components/PreNext'

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

interface Props {
  data: {
    currentBlog: Blog['node']
    previousBlog: Blog['node']
    nextBlog: Blog['node']
    recommendBlogs: GraphqlBlogResult
  }
  location: any
}

const BoxWithBackground = styled(Box)<BackgroundProps>`
  ${background}
  display: flex;
  flex-direction: column;
  border-radius: 5px;
`

const BestPracticeDetail = ({
  data: { currentBlog, previousBlog, nextBlog, recommendBlogs },
  location,
}: Props) => {
  currentBlog.frontmatter.categories = currentBlog.frontmatter.categories || []

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
              py="10px"
              px="20px"
              background={theme.colors.gray[1]}
              width={1}
            >
              <Text my="5px">
                发布于: {formateDate(currentBlog.frontmatter.date)}
              </Text>
              <Text my="5px">
                作者:
                {currentBlog.frontmatter.authors.map((author, index) => (
                  <ExternalLinkWrapper key={author}>
                    {currentBlog.frontmatter.authorslink &&
                    currentBlog.frontmatter.authorslink[index] ? (
                      <ExternalLink
                        to={currentBlog.frontmatter.authorslink[index]}
                      >
                        {author}
                      </ExternalLink>
                    ) : (
                      author
                    )}
                  </ExternalLinkWrapper>
                ))}
              </Text>
            </BoxWithBackground>

            <Markdown html={currentBlog.html as string}></Markdown>

            <PreNext next={nextBlog} previous={previousBlog} />
          </Box>

          <Box width={[0.9, 0.9, 0.9, 0.25]}>
            <BlogCatalogs html={currentBlog.tableOfContents} />
          </Box>
        </Flex>
      </Container>

      <BackToTop />
    </Layout>
  )
}

export default BestPracticeDetail

export const query = graphql`
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

  query BestPracticeDetail(
    $blogId: String!
    $previousBlogId: String
    $nextBlogId: String
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
  }
`
