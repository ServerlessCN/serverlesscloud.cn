import React from 'react'

import Layout from '@src/layouts'
import LatestBlogs from '@src/components/pages/home/LatestBlogs'
import CommonQuestion from '@src/components/pages/home/CommonQuestion'
import Research from '@src/components/pages/home/Research'
import Banner from '@src/components/Banner'
import KOLs from '@src/components/pages/home/KOLs'
import Helmet from '@src/components/Helmet'

interface Props {
  location: any
}

const IndexPage = (props: Props) => {
  return (
    <Layout>
      <Helmet
        title="Serverless 中文技术网"
        description="Serverless 中文技术网，专注 Serverless 架构最佳实践"
        location={props.location}
      />
      <Banner />
      <LatestBlogs />
      <Research />
      <KOLs />
      <CommonQuestion />
    </Layout>
  )
}

export default IndexPage
