import React from 'react'
import Layout from '@src/layouts'
import { graphql } from 'gatsby'
import SideMenu from '@src/components/SideMenu'
import { Box } from '@src/components/atoms'
import Markdown from '@src/components/Markdown'
import { Doc } from '@src/types'
import Helmet from '@src/components/Helmet'
import Content from '@src/components/Content'
import Breadcrumbs from '@src/components/Breadcrumbs'

import { config } from '@src/constants/docMenuConfig'

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

function matchPath(docList) {
  let list = []
  docList.map(v => {
    if (v.content) {
      list = list.concat(v.content)
    }
  })
  return list
}

function findDocTitle(currentPath, docList) {
  let title = 'Serverless Framework 文档'
  const pathLength = currentPath.split('/').length
  let list = docList
  if (pathLength === 2) {
    return title
  } else if (pathLength === 3) {
    list.map(v => {
      if (v.to && v.to === currentPath) {
        title = title + ' - ' + v.label
      }
    })
  } else {
    for (let i = 1; i < pathLength - 3; i++) {
      list = matchPath(list)
    }
    list.map(v => {
      v.content.map(content => {
        if (currentPath === content.to) {
          title = title + ' - ' + v.label + ' - ' + content.label
        }
      })
    })
  }
  return title
}

const DocPage = ({ data: { doc }, pathContext: { currentPath }, location }: Props) => {
  const i = currentPath.split('/')
  const title = findDocTitle(currentPath, config)
  const description = doc.html.match(/(<p>)(.*?)(<\/p>)/)![2]

  return (
    <Layout>
      <Helmet
        title={title}
        keywords={'Serverless,Serverless Framework,FaaS,函数计算,无服务器'}
        description={description}
        location={location}
      />
      <h1 className="page-title">Serverless 中文网 - 文档</h1>
      <Breadcrumbs>文档</Breadcrumbs>
      <Content>
        <Box mb={'40px'} width={[0.95, 0.95, 0.95, 0.3]}>
          <SideMenu menus={config} activeLinkTo={currentPath} />
        </Box>
        <Box pt={'30px'} pb={'30px'} width={[0.95, 0.95, 0.95, 0.66]}>
          <Markdown html={doc.html} />
        </Box>
      </Content>
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
