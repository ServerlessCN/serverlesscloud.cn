import * as React from 'react'
import Layout from '@src/layouts/HeaderNotFixedLayout'
import { Box, Container } from '@src/components/atoms'
import Helmet from '@src/components/Helmet'
import Meetups from '@src/components/pages/home/Meetups'
import AuthorDetail from '@src/components/pages/home/AuthorDetail'

interface Props {
  location: any
}

const ForumPage = ({ location }: Props) => {
  return (
    <Layout>
      <Helmet
        description="Serverless Framework 简介，快速了解Serverless基本概念与详情介绍。"
        keywords="Serverless简介,Serverless概述,Serverless指引"
        title="活动 - Serverless"
        location={location}
      />
      <h1 className="page-title">Serverless 中文网 - 活动</h1>
      <Box className="scf-page-blog scf-layout-pattern">
        <Container width={[1, 1, 1, 912, 0.76, 1200]}>
          <Box className="scf-grid">
            <Meetups />
            <AuthorDetail />
          </Box>
        </Container>
      </Box>
    </Layout>
  )
}

export default ForumPage
