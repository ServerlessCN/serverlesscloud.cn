import * as React from 'react'
import Layout from '@src/layouts/HeaderNotFixedLayout'
import { Box, Container } from '@src/components/atoms'
import Helmet from '@src/components/Helmet'
import './about.css'
import contributors from '@src/constants/contributors'
import communitys from '@src/constants/communitys'

interface Props {
  data: {
    about: {
      edges: {
        node: {
          id: string
          html: string
        }
      }[]
      totalCount: number
    }
  }
  location: any
}

const AboutPage = () => {
  return (
    <Layout>
      <Helmet
        description="Serverless Framework 简介，快速了解Serverless基本概念与详情介绍。"
        keywords="Serverless简介,Serverless概述,Serverless指引"
        title="关于Serverless - Serverless"
      />
      <h1 className="page-title">Serverless 中文网 - 关于</h1>
      <Box className="scf-content" style={{ marginTop: 0 }}>
        <Box className="scf-page-about scf-layout-pattern">
          <Box className="scf-home-block">
            <Container width={[1, 1, 1, 912, 0.76, 1200]} px={0}>
              <Box className="scf-box-about-header">
                <Box>
                  <Box className="scf-grid__box">
                    <p className="acf-page-about__text">
                      Serverless is the future of the cloud. Serverless is like superpowers for developers. —— Austen
                      Collins (serverless.com CEO)
                    </p>
                    <p className="acf-page-about__text">
                      在 Serverless 中文网，我们相信很多事情，其中之一就是 —— Serverless
                      是一种未来的开发方式，属于每一个开发者。这种技术理念和技术架构，能让开发者将更多精力放在为用户带来价值上。
                    </p>
                    <p className="acf-page-about__text">
                      而放眼到整个开源生态中，我们也相信，开源协作的使命就是开发者们凭借着开放的心态，自发贡献，最终给彼此都带来开发效率的提升。
                    </p>
                    <p className="acf-page-about__text">
                      我们谨代表 Serverless 中文社区，感谢以下贡献者和社区， 为 Serverless
                      技术的知识和实践的创作、分享和传播做出的贡献。
                    </p>
                  </Box>
                </Box>
              </Box>

              <Box className="scf-box-about-contributor">
                <Box className="scf-box-about-contributor-header-titile">
                  <h3 className="scf-box__header-title">贡献者</h3>
                </Box>
                {/*<Box className="scf-box-about-contributor-desc">
                  <p className="acf-page-about__text">
                    Serverless 中文网在社区伙伴的共同维护下而愈加丰富多彩，我们在此感谢做出过贡献的所有社区成员。
                  </p>
  </Box>*/}
                <Box className="scf-box-about-contributor-list">
                  <ul>
                    {contributors.map(contributor => (
                      <li>
                        <a href={contributor.link} target="_blank">
                          <img
                            src={
                              contributor.avatar
                                ? contributor.avatar
                                : 'https://avatars.githubusercontent.com/' + contributor.name
                            }
                            width="60px"
                            alt={contributor.name}
                          />
                          <div>
                            {contributor.name}
                            <br />
                            {contributor.cn_name}
                          </div>
                        </a>
                      </li>
                    ))}
                  </ul>
                </Box>
              </Box>

              <Box className="scf-box-about-community">
                <Box className="scf-box-about-community-header-titile">
                  <h3 className="scf-box__header-title">合作社区</h3>
                </Box>
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
