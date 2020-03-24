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
import contributors from '@src/constants/contributors'
import communitys from '@src/constants/communitys'

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
              
              <Box className="scf-box-about-header">
                <Box>
                  <Box className="scf-grid__box">
                    <p className="acf-page-about__text">Serverless 中文技术社区是国内开发者技术交流社区。提供 Serverless
                      最新信息、实践案例、技术博客、组件文档、学习资源，帮助开发者快速应用 Severless 技术和解决开发中的问题。</p>
                  </Box>
                </Box>
              </Box>
              
              <Box className="scf-box-about-contributor">
                <Box className="scf-box-about-contributor-header-titile"><h3 class="scf-box__header-title">贡献者</h3></Box>
                <Box className="scf-box-about-contributor-desc">
                  <p>
                    Serverless 中文网在社区伙伴的共同维护下而愈加丰富多彩，我们在此致敬做出过贡献的所有社区成员。
                  </p>
                </Box>
                <Box className="scf-box-about-contributor-list">
                  <ul>
                    {contributors.map(contributor => (
                    <li>
                      <a href={contributor.link} target="_blank">
                        <img src={contributor.avatar ? contributor.avatar : 'https://avatars.githubusercontent.com/' + contributor.name} width="60px" />
                        {contributor.name}
                      </a>
                    </li>
                    ))}

                  </ul>
                </Box>
              </Box>

              <Box className="scf-box-about-community">
                <Box className="scf-box-about-community-header-titile"><h3 class="scf-box__header-title">合作社区</h3></Box>
                <Box className="scf-box-about-community-list">
                  <ul>
                    {communitys.map(community => (
                    <li>
                      <a href={community.link}>
                        <img src={community.logo} alt={community.name} />
                      </a>
                    </li>
                    ))}

                  </ul>
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