import React from 'react'
import {Box, Container} from '@src/components/atoms'
import Layout from '@src/layouts'
import LatestBlogs from '@src/components/pages/home/LatestBlogs'
import Activitys from '@src/components/pages/home/Activitys'
import Videos from '@src/components/pages/home/Videos'
import AboutUs from '@src/components/pages/home/AboutUs'
import LatestComponents from '@src/components/pages/home/LatestComponents'
import BestParctices from '@src/components/pages/home/BestPractices'
import CommonQuestion from '@src/components/pages/home/CommonQuestion'
import Helmet from '@src/components/Helmet'
import Swiper from '@src/components/pages/home/Swiper'
import * as classnames from 'classnames';

interface Props {
  location : any
}

const IndexPage = (props: Props) => {
  console.log(props)
  return (
    <Layout>
      <Helmet
        title="Serverless 中文网 - 最受欢迎的 Serverless 社区"
        description="Serverless中文技术社区是国内开发者技术交流社区。提供Serverless最新信息、实践案例、技术博客、组件文档、学习资源，帮助开发者快速应用Severless技术和解决开发中的问题。"
        keywords="Serverless,Serverless Framework,FaaS,函数计算,无服务器"
        location={props.location}/>
      <Swiper/>
      <BestParctices/>
      <LatestComponents/> 
      <Container
        width={[ 0.95,0.95, 0.95,0.95,0.76,1200]}
        px={0}>
        <Box className="scf-grid">
          <LatestBlogs/>
          <Activitys/>
        </Box>
      </Container>
      <Videos/>
      <CommonQuestion/>
      <AboutUs/>
    </Layout>
  )
}

export default IndexPage
