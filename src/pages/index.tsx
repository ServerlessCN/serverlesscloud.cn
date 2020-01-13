import React from 'react'

import Layout from '@src/layouts'
import LatestBlogs from '@src/components/pages/home/LatestBlogs'
import BestParctices from '@src/components/pages/home/BestPractices'
import CommonQuestion from '@src/components/pages/home/CommonQuestion'
import KOLs from '@src/components/pages/home/KOLs'
import Helmet from '@src/components/Helmet'
import Swiper from '@src/components/pages/home/Swiper'

interface Props {
  location : any
}

const IndexPage = (props : Props) => {
  return (
    <Layout>
      <Helmet
        title="Serverless 中文技术社区 - serverlesscloud.cn"
        description="Serverless中文技术社区是国内开发者技术交流社区。提供Serverless最新信息、实践案例、技术博客、组件文档、学习资源，帮助开发者快速应用Severless技术和解决开发中的问题。"
        keywords="Serverless,Serverless Framework,FaaS,函数计算,无服务器"
        location={props.location}/>
      <Swiper/>
      <BestParctices/>
      <LatestBlogs/>
      <KOLs/>
      <CommonQuestion/>
    </Layout>
  )
}

export default IndexPage
