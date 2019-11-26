import React from 'react'
import Layout from '@src/layouts'
import { graphql } from 'gatsby'
import Banner from '@src/components/Banner'
import SideMenu, { DocMenu } from '@src/components/SideMenu'
import { Box, Flex, Container } from '@src/components/atoms'
import styled from 'styled-components'
import { minWidth, height, width, minHeight } from 'styled-system'
import Markdown from '@src/components/Markdown'
import { Doc } from '@src/types'
import Helmet from '@src/components/Helmet'

import docMenuConfig from '@src/constants/docMenuConfig'

const CustomFlex = styled(Flex)`
  ${width}
`

const CustomContainer = styled(Container)`
  flex: 1;
  ${width}
`

interface Props {
  data: {
    doc: Doc
  }
  pathContext: {
    docId: string
    currentPath: string
  }
  location: any
}

const DocPage = ({
  data: { doc },
  pathContext: { currentPath },
  location,
}: Props) => {
  return (
    <Layout>
      <>
        <Helmet
          title="Serverless 中文技术网——文档"
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
            <Box width={[0.95, 0.95, 0.95, 0.22]}>
              <SideMenu menus={docMenuConfig} activeLinkTo={currentPath} />
            </Box>
            <Box pt={'30px'} pb={'30px'} width={[0.95, 0.95, 0.95, 0.76]}>
              <Markdown html={doc.html} />
            </Box>
          </CustomFlex>
        </CustomContainer>
      </>
    </Layout>
  )
}

export const query = graphql`
  query Doc($docId: String!) {
    doc: markdownRemark(id: { eq: $docId }) {
      id
      html
    }
  }
`

export default DocPage
