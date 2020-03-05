import * as React from 'react'
import Layout from '@src/layouts/HeaderNotFixedLayout'
import Markdown from '@src/components/Markdown'
import { Box, Flex, Container } from '@src/components/atoms'
import Helmet from '@src/components/Helmet'
import styled from 'styled-components'
import { graphql } from 'gatsby'

const CustomContainer = styled(Container)`
  flex: 1;

  .markdown-body img {
    width: 200px;
    height: 200px;
  }

  #qrcode table {
    width: auto;
    margin-right: 10px;
  }

  #qrcode {
    display: flex;
    flex-wrap: wrap;
  }
  #contact, #question, #qrcode {
    // display: none;
    margin-top: 50px;
    overflow: hidden;
    position: relative;
    display: flex;
  }

  #about {
    overflow: hidden;
    display: flex;
    position: relative;
    padding-top: 60px;
  }
  #contact h1, #question h1, #qrcode h1{
    position: relative;
    float: left;
    margin: 10px 0 0 0;
    padding: 0;
    font-size: 22px;
    line-height: 44px;
    height: 44px;
    border: none;
    min-width: 150px;
    background-image: url(/static/box-title-bg-322b028f8b95fd6b130f15372d21b8de.svg)
  }

  #contact p, #question p, #qrcode p {
    position: relative;
    margin-left: 250px;
  }

  #about h1{
    position: relative;
    float: left;
    margin: 10px 0 0 0;
    padding: 0;
    font-size: 22px;
    line-height: 44px;
    height: 44px;
    border: none;
    min-width: 150px;
    background-image: url(/static/box-title-bg-322b028f8b95fd6b130f15372d21b8de.svg)
  }
  #about p{
    position: relative;
    margin-left: 250px;
  }
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
      <Helmet
        description="Serverless Framework 简介，快速了解Serverless基本概念与详情介绍。"
        keywords="Serverless简介,Serverless概述,Serverless指引"
        title="关于Serverless - Serverless"
        location={location}
      />

      <CustomContainer maxWidth={[1216, 1216, 1216, 1216, '100%', 1216]}>
        <Flex justifyContent="center">
          <Box pt={'30px'} pb={'30px'} width={'80%'}>
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
