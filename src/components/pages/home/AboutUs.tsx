import * as React from 'react'
import {
  Flex,
  Text,
  Container,
  Box,
  Background,
  Button,
  Row
} from '@src/components/atoms'
import './AboutUs.css'
import zhihu from '@src/assets/images/Zhihu_icon.png'
import segmentfault from '@src/assets/images/SegmentFault_icon.png'

const us : {
  icon : any
  title : string
  slogan : string
  link : string
}[] = [
  {
    icon: zhihu,
    title: '知乎',
    slogan: "Serverless 精华讨论",
    link: 'https://zhuanlan.zhihu.com/ServerlessGo'
  }, {
    icon: segmentfault,
    title: 'SegmentFault',
    slogan: "Serverless 技术问答",
    link: 'https://segmentfault.com/t/serverless/questions'
  }
]
export default function () {
  return (
    <Background pt={'20px'} pb={'40px'} width={1} backgroundColor="pink">
      <Row
        className="scf-box__header"
        width="76%"
        height="100%"
        alignItems="flex-end"
        justifyContent="space-between"
        style={{
        margin: "0px auto"
      }}>
        <div className="scf-box__header-title">
          <h3>中文社区</h3>
        </div>
        <div className="scf-box__header-more"></div>
      </Row>

      <Container
        maxWidth={[
        1000,
        1216,
        1216,
        1216,
        '76%',
        1216
      ]}>
        <Flex flexWrap="wrap" justifyContent="center">
          <div className="scf-about-us-box__body">

            <div className="scf-box__body">
              <div className="scf-grid">
                {us.map(({icon, title, slogan, link}) => (
                  <div className="scf-grid__item-12">
                    <a href={link}>
                      <div className="scf-grid__box">
                        <div className="scf-home-about-us-item">
                          <div className="scf-media">
                            <div className="scf-media__media"><img src={icon} alt=""/></div>
                            <div className="scf-media__content">
                              <div className="scf-media__title">
                                <h4>{title}</h4>
                              </div>
                              <div className="scf-media__info">
                                <p>{slogan}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Flex>
      </Container>
    </Background>
  )
}
