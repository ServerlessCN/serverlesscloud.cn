import * as React from 'react'
import Layout from '@src/layouts/HeaderNotFixedLayout'
import {Box, Container} from '@src/components/atoms'
import Helmet from '@src/components/Helmet'
import './about.css'

interface Props {
  data : {
    about: {
      edges: {
        node: {
          id: string,
          html: string
        }
      }[],
      totalCount: number
    }
  }
  location : any
}

const AboutPage = () => {
  return (
    <Layout>
      <Helmet
        description="Serverless Framework 简介，快速了解Serverless基本概念与详情介绍。"
        keywords="Serverless简介,Serverless概述,Serverless指引"
        title="关于Serverless - Serverless"
       />
      <Box className="scf-content" style={{marginTop:0}}>
        <Box className="scf-page-about scf-layout-pattern">
          <Box className="scf-home-block">
            <Container
              width={[
              1,
              1,
              1,
              1,
              0.76,
              1200
            ]}
              className="scf-home-block__inner"
              px={0}>
              <Box className="scf-grid ">
                <Box className="scf-grid__item-12">
                  <Box className="scf-grid__box">
                    <Box className="scf-box__header">
                      <Box className="scf-box__header-title"><h3>关于</h3>
                      </Box>
                    </Box>
                  </Box>
                </Box>
                <Box className="scf-grid__item-12">
                  <Box className="scf-grid__box">
                    <p className="acf-page-about__text">Serverless 中文技术社区是国内开发者技术交流社区。提供 Serverless
                      最新信息、实践案例、技术博客、组件文档、学习资源，帮助开发者快速应用 Severless 技术和解决开发中的问题。</p>
                  </Box>
                </Box>
              </Box>
              <Box className="scf-grid ">
                <Box className="scf-grid__item-12">
                  <Box className="scf-grid__box">
                    <Box className="scf-box__header">
                      <Box className="scf-box__header-title"><h3>联系方式</h3>
                      </Box>
                    </Box>
                  </Box>
                </Box>
                <Box className="scf-grid__item-12">
                  <Box className="scf-grid__box">
                    <ul className="scf-list scf-list--link">
                      <li className="scf-list__item">
                        <a href="https://github.com/serverless/serverless" className="scf-list__text">GitHub: https://github.com/serverless/serverless</a>
                      </li>
                      <li className="scf-list__item">
                        <a href="https://twitter.com/goserverless" className="scf-list__text">Twitter: https://twitter.com/goserverless</a>
                      </li>
                    </ul>
                  </Box>
                </Box>
              </Box>
              <Box className="scf-grid ">
                <Box className="scf-grid__item-12">
                  <Box className="scf-grid__box">
                    <Box className="scf-box__header">
                      <Box className="scf-box__header-title"><h3>问题讨论</h3>
                      </Box>
                    </Box>
                  </Box>
                </Box>
                <Box className="scf-grid__item-12">
                  <Box className="scf-grid__box">
                    <ul className="scf-list scf-list--link">
                      <li className="scf-list__item">在 SegmentFault 上快速提问</li>
                      <li className="scf-list__item">加上「Serverless」和「ServerlessFramework」标签</li>
                    </ul>
                  </Box>
                </Box>
              </Box>
            </Container>
          </Box>
        </Box>
      </Box>
    </Layout>
  )
}

export default AboutPage