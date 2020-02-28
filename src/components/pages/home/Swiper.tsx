import * as React from 'react'
import {
  Center,
  Text,
  Background,
  Box,
  Image,
  Row,
  Button
} from '@src/components/atoms';
import theme from '@src/constants/theme'
import {CheckIfDesktopContext} from '@src/contexts'
import Swiper from '@src/components/Swiper'
import banner1 from '@src/assets/images/banner1.png'
import banner2 from '@src/assets/images/banner2.png'
import banner3 from '@src/assets/images/banner3.png'
import banner4 from '@src/assets/images/banner4.png'
import helloworld from '@src/assets/images/helloworld.png'
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
  title: string
}[] = [
  {
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
    img: banner3,
    backgroundColor: '#fff',
    alt: '荐书',
    link: 'https://china.serverless.com/blog/2019-11-19-anycodes-book',
    title: "Serverless 社区成员初版新书啦！"
  }, {
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
          <Box
            pt={isDesktopView
            ? theme.headerHeights.desktop
            : theme.headerHeights.mobile}>
            <Row
              height="100%"
              alignItems="center"
              justifyContent="center"
              style={{
              marginTop: "30px"
            }}>
              <Box
                style={{
                width: 708,
                height: 316,
                marginRight: 45
              }}>
                <Swiper height={['200px', '200px', '336px', '336px', '336px']}>
                  {bannerConfigs.map((config, index) => {
                    return (
                      <Background
                        key={index}
                        className="swiper-slide"
                        backgroundRepeat="no-repeat"
                        background={config.backgroundColor}>
                        <ExternalLink to={config.link}>
                          <ImageWrapper>
                            <Image
                              width={[0.8, 0.8, 0.8, '708px']as any}
                              height={['auto', 'auto', '316px', '316px', '316px']as any}
                              src={config.img}
                              alt={config.alt}/>
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
                      <Button
                        className="scf-btn scf-btn--primary"
                        style={{
                        width: 140
                      }}>快速开始</Button>
                    </ExternalLink>
                    <ExternalLink
                      to={'https://github.com/serverless/serverless/blob/master/README_CN.md'}>
                      <button
                        className="scf-btn scf-btn--icon scf-btn--line"
                        style={{
                        width: 146.5
                      }}>
                        <i className="scf-icon scf-icon-github-primary"></i>
                        GitHub
                      </button>
                    </ExternalLink>
                  </Box>
                </Box>
              </Box>
            </Row>
          </Box>
        )
      }}
    </CheckIfDesktopContext.Consumer>
  )
}