import * as React from 'react'
import {
  Center,
  Background,
  Container,
  Box,
  Image,
} from '@src/components/atoms';
import theme from '@src/constants/theme'
import {CheckIfDesktopContext} from '@src/contexts'
import Swiper from '@src/components/Swiper'
import banner_release from '@src/assets/images/banner_release.jpg'
import banner1 from '@src/assets/images/banner1.png'
import banner2 from '@src/assets/images/banner2.png'
import banner_course from '@src/assets/images/banner_course.png'
import banner3 from '@src/assets/images/banner3.png'
import banner4 from '@src/assets/images/banner4.png'

import helloworld from '@src/assets/images/hello-world.png'
import ExternalLink from '@src/components/Link/ExternalLink'

import styled from 'styled-components'
import './Swiper.css'

const ImageWrapper = styled(Center)`
  width: 100%;
  height: 100%;
`

const bannerConfigs : {
  img : any
  backgroundColor : string
  alt : string
  link : string
  title : string
}[] = [
  {
    img: banner_release,
    backgroundColor: '#000',
    alt: '腾讯云 Serverless Framework 正式发布',
    link: 'https://serverlesscloud.cn/blog/2020-04-21-serverless-framework-launch/',
    title: ""
  }, {
    img: banner1,
    backgroundColor: '#000',
    alt: 'Serverless.com',
    link: 'https://serverless.com/cn',
    title: ""
  }, {
    img: banner2,
    backgroundColor: '#dcdcdc',
    alt: 'Serverless 组件',
    link: 'https://serverless.com/cn/components/',
    title: "Serverless 组件支持各种主流应用框架，持续发布中"
  }, {
    img: banner_course,
    backgroundColor: '#dcdcdc',
    alt: 'Serverless 课程',
    link: 'https://cloud.tencent.com/edu/paths/series/Serverless',
    title: "帮助您从零基础入门，到可基于 Serverless 构建工程化应用"
  }, {
    img: banner3,
    backgroundColor: '#fff',
    alt: '荐书',
    link: 'https://china.serverless.com/blog/2019-11-19-anycodes-book',
    title: "Serverless 社区成员出版新书啦！"
  },{
    img: banner4,
    backgroundColor: '#fff',
    alt: 'Serverless Component',
    link: '/about',
    title: "Serverless 社区成员交流"
  }
]

export default function () {
  return (
    <CheckIfDesktopContext.Consumer>
      {isDesktopView => {
        return (
          <Box className="scf-home-banner"
            pt={isDesktopView
            ? theme.headerHeights.desktop
            : theme.headerHeights.mobile} mb={'30px'}>
            <Container
            className="scf-home-banner_Container"
            width={[1, 1, 1, 912, 0.76, 1200]}
              px={0}>
              <Box className="scf-grid">
                <Box className="scf-grid__item-16">
                  <Swiper height={["100%","100%","100%","100%","92%","92%"]}>
                    {bannerConfigs.map((config, index) => {
                      return (
                        <Background
                          key={index}
                          className="swiper-slide"
                          backgroundRepeat="no-repeat"
                          background={config.backgroundColor}>
                          <ExternalLink to={config.link}>
                            <ImageWrapper>
                              <Image width={"100%"} height={"100%"} src={config.img} alt={config.alt}/>
                              <div className="scf-carousel__info">
                                <p className="scf-carousel__info-text">
                                  {config.title}</p>
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
                          <Image src={helloworld} alt=""/>
                        </Box>
                        <Box className="scf-quick-start__opeate">
                          <ExternalLink to={'https://serverless.com/cn/framework/docs/getting-started/'}>
                            <button className="scf-btn scf-btn--primary">快速开始</button>
                          </ExternalLink>
                          <ExternalLink
                            to={'https://github.com/serverless/serverless/blob/master/README_CN.md'}>
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