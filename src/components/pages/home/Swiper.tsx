import * as React from 'react'
import { Center, Background, Container, Box, Image } from '@src/components/atoms'
import theme from '@src/constants/theme'
import { CheckIfDesktopContext } from '@src/contexts'
import Swiper from '@src/components/Swiper'
import banner2 from '@src/assets/images/banner2.png'
import banner_course from '@src/assets/images/banner_course.png'
import banner4 from '@src/assets/images/banner4.png'
import ExternalLink from '@src/components/Link/ExternalLink'

import styled from 'styled-components'
import './Swiper.less'

const ImageWrapper = styled(Center)`
  width: 100%;
  height: 100%;
`

const bannerConfigs: {
  img: any
  backgroundColor: string
  alt: string
  link: string
  title: string
}[] = [
  {
    img: banner2,
    backgroundColor: '#dcdcdc',
    alt: 'Serverless 组件',
    link: 'https://serverless.cloud.tencent.com/start?c=cmntbn',
    title: 'Serverless 组件支持各种主流应用框架，免费体验 Demo！',
  },
  {
    img: banner_course,
    backgroundColor: '#dcdcdc',
    alt: 'Serverless 课程',
    link: 'https://cloud.tencent.com/edu/paths/series/Serverless',
    title: '帮助您从零基础入门，到可基于 Serverless 构建工程化应用',
  },
  {
    img: banner4,
    backgroundColor: '#fff',
    alt: 'Serverless Component',
    link: '/about',
    title: 'Serverless 社区成员交流',
  },
]

export default function() {
  const [activeLinux, setActiveLinux] = React.useState(true)

  return (
    <CheckIfDesktopContext.Consumer>
      {isDesktopView => {
        return (
          <Box
            className="scf-home-banner"
            pt={isDesktopView ? theme.headerHeights.desktop : theme.headerHeights.mobile}
            mb={'30px'}
          >
            <Container className="scf-home-banner_Container" width={[1, 1, 1, 912, 0.76, 1200]} px={0}>
              <Box className="scf-grid">
                <Box className="scf-grid__item-16">
                  <Swiper height={['100%', '100%', '100%', '100%', '92%', '92%']}>
                    {bannerConfigs.map((config, index) => {
                      return (
                        <Background
                          key={index}
                          className="swiper-slide"
                          backgroundRepeat="no-repeat"
                          background={config.backgroundColor}
                        >
                          <ExternalLink to={config.link}>
                            <ImageWrapper>
                              <Image width={'100%'} height={'100%'} src={config.img} alt={config.alt} />
                              <div className="scf-carousel__info">
                                <p className="scf-carousel__info-text">{config.title}</p>
                              </div>
                            </ImageWrapper>
                          </ExternalLink>
                        </Background>
                      )
                    })}
                  </Swiper>
                </Box>
                <Box className="scf-grid__item-8">
                  <Box className="hello-world">
                    <Box className="scf-quick-start">
                      <Box className="scf-quick-start__header">
                        <Box className="scf-italic-title">
                          <h3 className="scf-italic-title__title">Hello World</h3>
                        </Box>
                      </Box>
                      <Box className="scf-quick-start__body">
                        <Box className="scf-quick-start__banner">
                          <div className="start-tab">
                            <div
                              className={activeLinux ? 'start-item active' : 'start-item'}
                              onClick={() => setActiveLinux(true)}
                            >
                              <i className="start-icon linux-icon"></i>
                              <span>Linux</span>
                              <i className="start-icon macos-icon"></i>
                              <span>macOS</span>
                            </div>
                            <div
                              className={!activeLinux ? 'start-item active' : 'start-item'}
                              onClick={() => setActiveLinux(false)}
                            >
                              <i className="start-icon win-icon"></i>
                              <span>Windows</span>
                            </div>
                          </div>
                          <div className="start-re">
                            <div className="start-back"></div>
                            <div className="start-content">
                              <div className="start-content-item">
                                <div className="start-content-anno"># Step 1. Install Serverless Globally</div>
                                {activeLinux ? (
                                  <div className="start-content-command">
                                    $ curl -o- -L https://slss.io/install | bash
                                  </div>
                                ) : (
                                  <div className="start-content-command">$ npm install -g serverless</div>
                                )}
                              </div>
                              <div className="start-content-item">
                                <div className="start-content-anno"># Step 2. Create a serverless function</div>
                                <div className="start-content-command">$ serverless</div>
                              </div>
                              <div className="start-content-item">
                                <div className="start-content-anno"># Step 3. Your Function is deployed!</div>
                                <div className="start-content-command">$ https://serverless.cloud.tencent.com</div>
                              </div>
                            </div>
                          </div>
                        </Box>
                        <Box className="scf-quick-start__opeate">
                          <ExternalLink to={'https://serverless.cloud.tencent.com/start?c=cmntst'}>
                            <button className="scf-btn scf-btn--primary" onClick={() => MtaH5.clickStat('start')}>
                              快速开始
                            </button>
                          </ExternalLink>
                          <ExternalLink to={'https://github.com/serverless/serverless/blob/master/README_CN.md'}>
                            <button className="scf-btn scf-btn--icon scf-btn--line">
                              <i className="scf-icon scf-icon-github-primary"></i>
                              GitHub
                            </button>
                          </ExternalLink>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Container>
          </Box>
        )
      }}
    </CheckIfDesktopContext.Consumer>
  )
}
