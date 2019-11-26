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
        title="Serverless - Serverless 服务框架中文社区"
        description="Serverless Framework 是业界非常受欢迎的无服务器应用框架，开发者无需关心底层资源即可部署完整可用的 serverless 应用架构。"
        keywords={'Serverless,Serverless Framework,FaaS,函数计算,无服务器'}
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
