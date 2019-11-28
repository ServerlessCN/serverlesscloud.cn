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
  location: string
}

const ComponentPage = ({ location }: Props) => {
  return (
    <Layout>
      <>
        <Helmet title="Serverless - Serverless Component" location={location} />
        <Banner
          title="Components"
          subTitle="Serverless Framework 提供贴合应用场景的框架和组件，开发者根据实际需求选择对应框架后，即可在数秒内快速构建和部署 Serverless 应用"
        />
      </>
    </Layout>
  )
}

export default ComponentPage
