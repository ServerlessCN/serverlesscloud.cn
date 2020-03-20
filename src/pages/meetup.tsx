import * as React from 'react'
import Layout from '@src/layouts/HeaderNotFixedLayout'
import { Box, Container } from '@src/components/atoms'
import Helmet from '@src/components/Helmet'
import LatestBlogs from '@src/components/pages/home/LatestBlogs'
import Activitys from '@src/components/pages/home/Activitys'

interface Props {
  location: any
}

const ForumPage = ({ location }: Props) => {
  return (
    <Layout>
      <Helmet
        description="Serverless Framework 简介，快速了解Serverless基本概念与详情介绍。"
        keywords="Serverless简介,Serverless概述,Serverless指引"
        title="论坛 - Serverless"
        location={location}
      />
      <Container
      width={[ 1, 1, 1, 1, 0.76, 1200 ]}
      px={0}>
      <Box className="scf-grid">
        <LatestBlogs/>
        <Activitys/>
      </Box>
    </Container>
    </Layout>
  )
}

export default ForumPage
