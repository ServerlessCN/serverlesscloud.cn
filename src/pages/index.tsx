import React from 'react'
import { Box, Container } from '@src/components/atoms'
import Layout from '@src/layouts'
import { useMobileView } from '@src/utils'
import LatestBlogs from '@src/components/pages/home/LatestBlogs'
import Activitys from '@src/components/pages/home/Activitys'
import Videos from '@src/components/pages/home/Videos'
import AboutUs from '@src/components/pages/home/AboutUs'
import HomeAd from '@src/components/pages/home/HomeAd'
import LatestComponents from '@src/components/pages/home/LatestComponents'
import BestParctices from '@src/components/pages/home/BestPractices'
import CommonQuestion from '@src/components/pages/home/CommonQuestion'
import RecommandRead from '@src/components/pages/home/RecommandRead'
import Helmet from '@src/components/Helmet'
import Swiper from '@src/components/pages/home/Swiper'
import './index_mobile.less'

interface Props {
  location: any
}

const IndexPage = (props: Props) => {
  const [isMobileView] = useMobileView()

  return (
    <Layout>
      <Helmet
        title="Serverless 中文网 - 最受欢迎的 Serverless 社区"
        description="Serverless中文技术社区是国内开发者技术交流社区。提供Serverless最新信息、实践案例、技术博客、组件文档、学习资源，帮助开发者快速应用Severless技术和解决开发中的问题。"
        keywords="Serverless,Serverless Framework,FaaS,函数计算,无服务器"
        location={props.location}
      />
      <h1 className="page-title">Serverless 中文网 - 首页</h1>
      <Swiper />
      {!isMobileView && <HomeAd />}
      {isMobileView ? (
        <Box className="scf-grid">
          <RecommandRead title={'最佳实践'} />
        </Box>
      ) : (
        <BestParctices />
      )}
      <Container width={[1, 1, 1, 912, 0.76, 1200]} px={0}>
        <Box className="scf-grid">
          <LatestBlogs />
          <Activitys />
        </Box>
      </Container>
      <Videos />
      <LatestComponents />
      <CommonQuestion />
      <AboutUs />
    </Layout>
  )
}

export default IndexPage
