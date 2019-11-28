import * as React from 'react'
import Layout from '@src/layouts'
import Banner from '@src/components/Banner'
import Markdown from '@src/components/Markdown'
import { Box, Flex, Container } from '@src/components/atoms'
import Helmet from '@src/components/Helmet'
import styled from 'styled-components'
import { graphql } from 'gatsby'

const CustomContainer = styled(Container)`
  flex: 1;
`

interface Props {
  data: {
    about: {
      edges: {
        node: {
          id: string
          html: string
        }
      }[]
      totalCount: number
    }
  }
  location: any
}

const AboutPage = ({
  data: {
    about: { edges },
  },
  location,
}: Props) => {
  return (
    <Layout>
      <Helmet title="Serverless - 关于我们" location={location} />
      <Banner />

      <CustomContainer maxWidth={[1216, 1216, 1216, 1216, '76%', 1216]}>
        <Flex justifyContent="center">
          <Box pt={'30px'} pb={'30px'} width={[0.95, 0.95, 0.95, 0.76]}>
            <Markdown html={edges[0].node.html}></Markdown>
          </Box>
        </Flex>
      </CustomContainer>
    </Layout>
  )
}

export const query = graphql`
  query {
    about: allMarkdownRemark(
      sort: { fields: frontmatter___date, order: DESC }
      limit: 3
      filter: { fileAbsolutePath: { regex: "/about/" } }
    ) {
      totalCount
      edges {
        node {
          id
          html
        }
      }
    }
  }
`

export default AboutPage
