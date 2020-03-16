import * as React from 'react'
import Layout from '@src/layouts/HeaderNotFixedLayout'
import Markdown from '@src/components/Markdown'
import {Box, Flex, Container} from '@src/components/atoms'
import Helmet from '@src/components/Helmet'
import styled from 'styled-components'
import {graphql} from 'gatsby'
import QQQRcode from '@src/assets/images/qq_qrcode.png'
import WechatQRcode from '@src/assets/images/wechat_qrcode.png'
import './about.css'

const CustomContainer = styled(Container)`
  flex: 1;

  .markdown-body img {
    width: 200px;
    height: 200px;
  }

  #qrcode table {
    width: auto;
    margin-right: 10px;
  }

  #qrcode {
    display: flex;
    flex-wrap: wrap;
  }
  #contact, #question, #qrcode {
    // display: none;
    margin-top: 50px;
    overflow: hidden;
    position: relative;
    display: flex;
  }

  #about {
    overflow: hidden;
    display: flex;
    position: relative;
    padding-top: 60px;
  }
  #contact h1, #question h1, #qrcode h1{
    position: relative;
    float: left;
    margin: 10px 0 0 0;
    padding: 0;
    font-size: 22px;
    line-height: 44px;
    height: 44px;
    border: none;
    min-width: 150px;
    background-image: url(/static/box-title-bg-322b028f8b95fd6b130f15372d21b8de.svg)
  }

  #contact p, #question p, #qrcode p {
    position: relative;
    margin-left: 250px;
  }

  #about h1{
    position: relative;
    float: left;
    margin: 10px 0 0 0;
    padding: 0;
    font-size: 22px;
    line-height: 44px;
    height: 44px;
    border: none;
    min-width: 150px;
    background-image: url(/static/box-title-bg-322b028f8b95fd6b130f15372d21b8de.svg)
  }
  #about p{
    position: relative;
    margin-left: 250px;
  }
`

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
              {/*
              <Box className="scf-grid ">
                <Box className="scf-grid__item-12">
                  <Box className="scf-grid__box">
                    <Box className="scf-box__header">
                      <Box className="scf-box__header-title"><h3>加入组群</h3>
                      </Box>
                    </Box>
                  </Box>
                </Box>
                <Box className="scf-grid__item-12">
                  <Box className="scf-grid__box">
                    <Box className="scf-grid ">
                      <Box className="scf-grid__item-12 scf-grid-group scf-grid-group-qq">
                        <Box className="scf-grid__box">
                          <dl className="scf-page-about-link ">
                            <dt className="scf-page-about-link__title">交流 QQ 群</dt>
                            <dd className="scf-page-about-link__list">
                              <p className="scf-page-about-link__commit-tips">群号：871445853</p><img src={QQQRcode} alt=""/></dd>
                          </dl>
                        </Box>
                      </Box>
                      <Box className="scf-grid__item-12 scf-grid-group scf-grid-group-wechat">
                        <Box className="scf-grid__box">
                          <dl className="scf-page-about-link ">
                            <dt className="scf-page-about-link__title">微信社区群</dt>
                            <dd className="scf-page-about-link__list">
                              <p className="scf-page-about-link__commit-tips">WeChat ID：serverlesscloud</p><img src={WechatQRcode} alt=""/></dd>
                          </dl>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Box>
            */}
            </Container>
          </Box>
        </Box>
      </Box>
      {/*
      <CustomContainer maxWidth={[1216, 1216, 1216, 1216, '100%', 1216]}>
        <Flex justifyContent="center">
          <Box pt={'30px'} pb={'30px'} width={'80%'}>
            <Markdown html={edges[0].node.html}></Markdown>
          </Box>
        </Flex>
      </CustomContainer>
      */}
    </Layout>
  )
}

export default AboutPage